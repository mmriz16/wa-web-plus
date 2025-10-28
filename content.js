// Content script untuk WA Web Plus - Prototype
// Implementasi sederhana untuk blur chat names di chat list

console.log('[WAWebPlus Content] Script loaded');

// State
let isHideModeEnabled = false;
let hideStyleElement = null;
let isRestoreDeletedEnabled = false;
let messageStore = new Map();
let messageObserver = null;

// Initialize
init();

function init() {
  console.log('[WAWebPlus Content] Initializing...');
  
  // Load state from storage
  chrome.storage.local.get(['hideMode', 'restoreDeleted'], (result) => {
    isHideModeEnabled = result.hideMode || false;
    isRestoreDeletedEnabled = result.restoreDeleted || false;
    console.log('[WAWebPlus Content] Hide mode state:', isHideModeEnabled);
    console.log('[WAWebPlus Content] Restore deleted state:', isRestoreDeletedEnabled);
    
    if (isHideModeEnabled) {
      applyBlurStyles();
    }
    
    if (isRestoreDeletedEnabled) {
      startMessageMonitoring();
    }
  });
  
  // Listen for messages from popup/background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[WAWebPlus Content] Received message:', message);
    
    if (message.action === 'toggleHideMode') {
      isHideModeEnabled = message.enabled;
      
      if (isHideModeEnabled) {
        applyBlurStyles();
      } else {
        removeBlurStyles();
      }
      
      sendResponse({ success: true });
    }
    
    if (message.action === 'toggleRestoreDeleted') {
      isRestoreDeletedEnabled = message.enabled;
      
      if (isRestoreDeletedEnabled) {
        startMessageMonitoring();
      } else {
        stopMessageMonitoring();
      }
      
      sendResponse({ success: true });
    }
    
    return true;
  });
}

// Apply blur styles to chat names only
function applyBlurStyles() {
  console.log('[WAWebPlus Content] Applying blur styles...');
  
  // Remove existing styles first
  removeBlurStyles();
  
  // Create style element
  hideStyleElement = document.createElement('style');
  hideStyleElement.id = 'wawebplus-blur-styles';
  
  // CSS for blurring chat names and conversation content
  const blurCSS = `
    /* Blur chat names in chat list */
    [data-testid="cell-frame-container"] span[dir="auto"]:not(:empty),
    [role="gridcell"] span[title]:not([title=""]),
    div[data-testid="cell-frame-title"] span,
    div[class*="chat-title"] span,
    span[class*="ggj6brxn"] {
      filter: blur(8px) !important;
      transition: filter 0.3s ease !important;
    }
    
    /* Blur message previews in chat list - comprehensive selectors */
    [data-testid="last-msg"],
    [data-testid="last-msg"] span,
    [data-testid="last-msg"] div,
    .x1iyjqo2.x6ikm8r.x10wlt62,
    .gfz4du6o.r7fjleex.lhj4utae,
    [data-testid="cell-frame-container"] [data-testid="last-msg-status"] + span,
    [data-testid="cell-frame-container"] span:not([data-testid]):not([title]):not([dir="auto"]),
    [data-testid="cell-frame-container"] div:not([data-testid]):not([class*="avatar"]) span,
    [role="gridcell"] span:not([title]):not([dir="auto"]),
    [data-testid="cell-frame-container"] span[class*="x1jchvi3"],
    [data-testid="cell-frame-container"] span[class*="x193iq5w"],
    [data-testid="cell-frame-container"] > div > div:last-child span:not([dir="auto"]),
    [data-testid="cell-frame-container"] > div > div:last-child div span {
      filter: blur(6px) !important;
      transition: filter 0.3s ease !important;
      border-radius: 3px !important;
      padding: 1px 3px !important;
    }
    
    /* Blur contact names in conversation header */
    [data-testid="conversation-header"] span[dir="auto"],
    header span[dir="auto"]:not(:empty),
    div[class*="chat-header"] span {
      filter: blur(8px) !important;
      transition: filter 0.3s ease !important;
    }
    
    /* Remove blur on hover for chat list */
    [data-testid="cell-frame-container"]:hover span[dir="auto"]:not(:empty),
    [role="gridcell"]:hover span[title]:not([title=""]),
    div[data-testid="cell-frame-title"]:hover span,
    div[class*="chat-title"]:hover span,
    span[class*="ggj6brxn"]:hover,
    /* Remove blur on hover for message previews */
    [data-testid="cell-frame-container"]:hover [data-testid="last-msg"],
    [data-testid="cell-frame-container"]:hover [data-testid="last-msg"] span,
    [data-testid="cell-frame-container"]:hover [data-testid="last-msg"] div,
    [data-testid="cell-frame-container"]:hover .x1iyjqo2.x6ikm8r.x10wlt62,
    [data-testid="cell-frame-container"]:hover .gfz4du6o.r7fjleex.lhj4utae,
    [data-testid="cell-frame-container"]:hover [data-testid="last-msg-status"] + span,
    [data-testid="cell-frame-container"]:hover span:not([data-testid]):not([title]):not([dir="auto"]),
    [data-testid="cell-frame-container"]:hover div:not([data-testid]):not([class*="avatar"]) span,
    [role="gridcell"]:hover span:not([title]):not([dir="auto"]),
    [data-testid="cell-frame-container"]:hover span[class*="x1jchvi3"],
    [data-testid="cell-frame-container"]:hover span[class*="x193iq5w"],
    [data-testid="cell-frame-container"]:hover > div > div:last-child span:not([dir="auto"]),
    [data-testid="cell-frame-container"]:hover > div > div:last-child div span {
      filter: blur(0px) !important;
    }
    
    /* Remove blur on hover for conversation header */
    [data-testid="conversation-header"]:hover span[dir="auto"],
    header:hover span[dir="auto"]:not(:empty),
    div[class*="chat-header"]:hover span {
      filter: blur(0px) !important;
    }
    
    /* Blur entire message containers - single blur per message */
    div[data-testid="msg-container"],
    div[class*="message-in"],
    div[class*="message-out"],
    div[data-tab="6"] {
      filter: blur(6px) !important;
      transition: filter 0.3s ease !important;
    }
    
    /* Blur standalone media that's not in message containers */
    [data-testid="main"] img:not([style*="width: 40px"]):not([style*="height: 40px"]):not([alt*="profile"]),
    [data-testid="main"] video,
    [data-testid="main"] canvas {
      filter: blur(12px) !important;
      transition: filter 0.3s ease !important;
    }
    
    /* Exclude profile pictures and small thumbnails */
    img[style*="width: 40px"],
    img[style*="height: 40px"],
    img[alt*="profile"],
    div[class*="avatar"] img,
    div[class*="avatar"] {
      filter: none !important;
    }
    
    /* Remove blur on hover for entire message containers */
    div[data-testid="msg-container"]:hover,
    div[class*="message-in"]:hover,
    div[class*="message-out"]:hover,
    div[data-tab="6"]:hover {
      filter: blur(0px) !important;
    }
    
    /* Remove blur on hover for standalone media */
    [data-testid="main"] img:hover:not([style*="width: 40px"]):not([style*="height: 40px"]):not([alt*="profile"]),
    [data-testid="main"] video:hover,
    [data-testid="main"] canvas:hover {
      filter: blur(0px) !important;
    }
  `;
  
  hideStyleElement.textContent = blurCSS;
  document.head.appendChild(hideStyleElement);
  
  console.log('[WAWebPlus Content] Blur styles applied');
}

// Remove blur styles
function removeBlurStyles() {
  if (hideStyleElement) {
    hideStyleElement.remove();
    hideStyleElement = null;
    console.log('[WAWebPlus Content] Blur styles removed');
  }
}

// Message monitoring functions for restore deleted messages
function startMessageMonitoring() {
  console.log('[WAWebPlus Content] Starting message monitoring...');
  
  // Stop existing observer if any
  stopMessageMonitoring();
  
  // Wait for WhatsApp to load
  const checkWhatsAppLoaded = setInterval(() => {
    const chatContainer = document.querySelector('[data-testid="conversation-panel-messages"]') || 
                         document.querySelector('#main') ||
                         document.querySelector('[data-tab="6"]');
    
    if (chatContainer) {
      clearInterval(checkWhatsAppLoaded);
      initMessageObserver(chatContainer);
      
      // Also scan existing messages
      scanExistingMessages();
      
      // Monitor for deleted message restoration
      monitorDeletedMessages();
    }
  }, 1000);
  
  // Clear interval after 30 seconds if WhatsApp doesn't load
  setTimeout(() => clearInterval(checkWhatsAppLoaded), 30000);
}

function stopMessageMonitoring() {
  if (messageObserver) {
    messageObserver.disconnect();
    messageObserver = null;
    console.log('[WAWebPlus Content] Message monitoring stopped');
  }
}

function initMessageObserver(chatContainer) {
  messageObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Check for new messages
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          storeNewMessages(node);
        }
      });
      
      // Check for modified messages (potential deletions)
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        // Check if the target or its children contain deleted messages
        const targetElement = mutation.target;
        if (targetElement.nodeType === Node.ELEMENT_NODE) {
          checkAndRestoreDeletedMessage(targetElement);
          // Also check child message containers
          const messageContainers = targetElement.querySelectorAll('[data-testid="msg-container"]');
          messageContainers.forEach(msgElement => {
            checkAndRestoreDeletedMessage(msgElement);
          });
        }
      }
    });
  });
  
  messageObserver.observe(chatContainer, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true
  });
  
  console.log('[WAWebPlus Content] Message observer initialized');
}

function storeNewMessages(element) {
  try {
    // Look for message containers with more comprehensive selectors
    let messages = [];
    
    if (element.querySelectorAll) {
      // Try multiple selector patterns for WhatsApp Web
      const selectors = [
        '[data-testid="msg-container"]',
        '[data-testid="conversation-panel-messages"] > div > div',
        '.message-in, .message-out',
        '[class*="message"]',
        'div[data-id]'
      ];
      
      for (const selector of selectors) {
        const found = element.querySelectorAll(selector);
        if (found.length > 0) {
          messages = Array.from(found);
          console.log('[WAWebPlus Content] Found messages with selector:', selector, 'count:', found.length);
          break;
        }
      }
    } else if (element.matches) {
      // Check if element itself is a message
      const messageSelectors = [
        '[data-testid="msg-container"]',
        '.message-in', '.message-out',
        '[class*="message"]',
        'div[data-id]'
      ];
      
      for (const selector of messageSelectors) {
        if (element.matches(selector)) {
          messages = [element];
          console.log('[WAWebPlus Content] Element itself is a message:', selector);
          break;
        }
      }
    }
    
    console.log('[WAWebPlus Content] Processing', messages.length, 'messages for storage');
    
    messages.forEach((msgElement) => {
      const messageId = generateMessageId(msgElement);
      if (messageId && !messageStore.has(messageId)) {
        const messageData = extractMessageData(msgElement);
        if (messageData.content && messageData.content.trim()) {
          messageStore.set(messageId, messageData);
          console.log('[WAWebPlus Content] Stored message:', messageId, 'content preview:', messageData.content.substring(0, 30));
        }
      }
    });
  } catch (error) {
    console.error('[WAWebPlus Content] Error storing new messages:', error);
  }
}

function scanExistingMessages() {
  console.log('[WAWebPlus Content] Scanning existing messages...');
  
  try {
    // Try multiple selectors to find existing messages
    const selectors = [
      '[data-testid="msg-container"]',
      '[data-testid="conversation-panel-messages"] > div > div',
      '.message-in, .message-out',
      '[class*="message"]',
      'div[data-id]'
    ];
    
    let existingMessages = [];
    
    for (const selector of selectors) {
      const found = document.querySelectorAll(selector);
      if (found.length > 0) {
        existingMessages = Array.from(found);
        console.log('[WAWebPlus Content] Found existing messages with selector:', selector, 'count:', found.length);
        break;
      }
    }
    
    console.log('[WAWebPlus Content] Processing', existingMessages.length, 'existing messages');
    
    existingMessages.forEach((msgElement) => {
      const messageId = generateMessageId(msgElement);
      if (messageId && !messageStore.has(messageId)) {
        const messageData = extractMessageData(msgElement);
        if (messageData.content && messageData.content.trim()) {
          messageStore.set(messageId, messageData);
          console.log('[WAWebPlus Content] Stored existing message:', messageId);
        }
      }
    });
    
    console.log('[WAWebPlus Content] Scan complete. Total messages in store:', messageStore.size);
  } catch (error) {
    console.error('[WAWebPlus Content] Error scanning existing messages:', error);
  }
}

function generateMessageId(msgElement) {
  try {
    // Try multiple selectors for timestamp
    const timeSelectors = [
      '[data-testid="msg-meta"] span',
      '.message-datetime', 
      '[class*="time"]',
      '[data-testid="msg-meta"]',
      'span[title]'
    ];
    
    let timestamp = '';
    for (const selector of timeSelectors) {
      const timeElement = msgElement.querySelector(selector);
      if (timeElement) {
        timestamp = timeElement.textContent?.trim() || timeElement.title || '';
        if (timestamp) break;
      }
    }
    
    if (!timestamp) {
      timestamp = Date.now().toString();
    }
    
    // Try multiple selectors for message content
    const textSelectors = [
      '[data-testid="conversation-text"]',
      '.selectable-text',
      '[class*="text"]',
      'span[dir="ltr"]',
      'span[dir="rtl"]',
      '.copyable-text'
    ];
    
    let content = '';
    for (const selector of textSelectors) {
      const textElement = msgElement.querySelector(selector);
      if (textElement) {
        content = textElement.textContent?.trim() || '';
        if (content) break;
      }
    }
    
    if (!content) {
      // Fallback: use element's text content
      content = msgElement.textContent?.trim().substring(0, 50) || '';
    }
    
    // Create unique ID combining timestamp and content hash
    const contentHash = content.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const messageId = `${timestamp}_${Math.abs(contentHash)}`;
    console.log('[WAWebPlus Content] Generated message ID:', messageId, 'for content:', content.substring(0, 20));
    return messageId;
  } catch (error) {
    console.error('[WAWebPlus Content] Error generating message ID:', error);
    return `fallback_${Date.now()}_${Math.random()}`;
  }
}

function extractMessageData(msgElement) {
  try {
    // Try multiple selectors for text content
    const textSelectors = [
      '[data-testid="conversation-text"]',
      '.selectable-text',
      '[class*="text"]',
      'span[dir="ltr"]',
      'span[dir="rtl"]',
      '.copyable-text'
    ];
    
    let textElement = null;
    let content = '';
    
    for (const selector of textSelectors) {
      textElement = msgElement.querySelector(selector);
      if (textElement) {
        content = textElement.innerHTML || textElement.textContent || '';
        if (content.trim()) {
          console.log('[WAWebPlus Content] Found text with selector:', selector);
          break;
        }
      }
    }
    
    // Try multiple selectors for timestamp
    const timeSelectors = [
      '[data-testid="msg-meta"] span',
      '.message-datetime',
      '[class*="time"]',
      '[data-testid="msg-meta"]',
      'span[title]'
    ];
    
    let timeElement = null;
    let timestamp = '';
    
    for (const selector of timeSelectors) {
      timeElement = msgElement.querySelector(selector);
      if (timeElement) {
        timestamp = timeElement.textContent?.trim() || timeElement.title || '';
        if (timestamp) {
          console.log('[WAWebPlus Content] Found time with selector:', selector);
          break;
        }
      }
    }
    
    if (!timestamp) {
      timestamp = new Date().toLocaleTimeString();
    }
    
    const messageData = {
      content: content,
      timestamp: timestamp,
      element: msgElement.cloneNode(true)
    };
    
    console.log('[WAWebPlus Content] Extracted message data:', {
      content: content.substring(0, 50),
      timestamp: timestamp,
      hasElement: !!messageData.element,
      contentLength: content.length
    });
    
    return messageData;
  } catch (error) {
    console.error('[WAWebPlus Content] Error extracting message data:', error);
    return { content: '', timestamp: '', element: null };
  }
}

function monitorDeletedMessages() {
  // Check for deleted messages every 2 seconds
  setInterval(() => {
    if (!isRestoreDeletedEnabled) return;
    
    const deletedMessages = document.querySelectorAll('[data-testid="msg-container"]');
    deletedMessages.forEach((msgElement) => {
      checkAndRestoreDeletedMessage(msgElement);
    });
  }, 2000);
}

function checkAndRestoreDeletedMessage(msgElement) {
  try {
    // Look for "This message was deleted" text in various languages
    const deletedTexts = [
      'This message was deleted',
      'Pesan ini telah dihapus',
      'Este mensaje fue eliminado',
      'Cette message a été supprimé',
      'Diese Nachricht wurde gelöscht'
    ];
    
    const textContent = msgElement.textContent || msgElement.innerText || '';
    const isDeleted = deletedTexts.some(text => textContent.includes(text));
    
    console.log('[WAWebPlus Content] Checking message for deletion:', {
      textContent: textContent.substring(0, 50),
      isDeleted: isDeleted,
      hasRestored: msgElement.hasAttribute('data-restored')
    });
    
    if (isDeleted && !msgElement.hasAttribute('data-restored')) {
      console.log('[WAWebPlus Content] Found deleted message, attempting to restore...');
      const messageId = generateMessageId(msgElement);
      if (messageId && messageStore.has(messageId)) {
        const originalMessage = messageStore.get(messageId);
        console.log('[WAWebPlus Content] Found original message in store, restoring...');
        restoreDeletedMessage(msgElement, originalMessage);
      } else {
        console.log('[WAWebPlus Content] No original message found in store for ID:', messageId);
        console.log('[WAWebPlus Content] Current store size:', messageStore.size);
      }
    }
  } catch (error) {
    console.error('[WAWebPlus Content] Error checking deleted message:', error);
  }
}

function restoreDeletedMessage(msgElement, originalMessage) {
  console.log('[WAWebPlus Content] Restoring deleted message');
  
  // Find the text container
  const textContainer = msgElement.querySelector('[data-testid="conversation-text"]') ||
                       msgElement.querySelector('.selectable-text') ||
                       msgElement.querySelector('[class*="text"]');
  
  if (textContainer) {
    // Create restored message container
    const restoredDiv = document.createElement('div');
    restoredDiv.style.cssText = `
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 8px;
      padding: 8px;
      margin: 4px 0;
      font-style: italic;
      position: relative;
    `;
    
    // Add restored label
    const label = document.createElement('div');
    label.style.cssText = `
      font-size: 11px;
      color: #856404;
      margin-bottom: 4px;
      font-weight: bold;
    `;
    label.textContent = '🔄 Restored Message';
    
    // Add original content
    const content = document.createElement('div');
    content.innerHTML = originalMessage.content;
    content.style.color = '#856404';
    
    restoredDiv.appendChild(label);
    restoredDiv.appendChild(content);
    
    // Replace or append to text container
    textContainer.appendChild(restoredDiv);
    
    // Mark as restored
    msgElement.setAttribute('data-restored', 'true');
  }
}