// Background script untuk WA Web Plus - Prototype
// Implementasi sederhana untuk message passing

console.log('[WAWebPlus Background] Service worker started');

// Inisialisasi saat extension dimuat
chrome.runtime.onInstalled.addListener(async () => {
  console.log('[WAWebPlus Background] Extension installed');
  
  // Set default state
  await chrome.storage.local.set({ 
    hideMode: false,
    restoreDeleted: false 
  });
  console.log('[WAWebPlus Background] Default state set: hideMode = false, restoreDeleted = false');
});

// Mendengarkan pesan dari popup dan content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[WAWebPlus Background] Received message:', message);
  
  if (message.action === 'toggleHideMode') {
    handleToggleHideMode(message.enabled, sendResponse);
    return true; // Keep message channel open for async response
  }
  
  if (message.action === 'toggleRestoreDeleted') {
    handleToggleRestoreDeleted(message.enabled, sendResponse);
    return true; // Keep message channel open for async response
  }
  
  if (message.action === 'getHideMode') {
    chrome.storage.local.get(['hideMode'], (result) => {
      sendResponse({ enabled: result.hideMode || false });
    });
    return true;
  }
  
  if (message.action === 'getRestoreDeleted') {
    chrome.storage.local.get(['restoreDeleted'], (result) => {
      sendResponse({ enabled: result.restoreDeleted || false });
    });
    return true;
  }
  
  sendResponse({ success: false, error: 'Unknown action' });
});

// Fungsi untuk toggle hide mode
async function handleToggleHideMode(enabled, sendResponse) {
  console.log(`[WAWebPlus Background] Toggling hide mode: ${enabled}`);
  
  try {
    // Save to storage
    await chrome.storage.local.set({ hideMode: enabled });
    
    // Send message to all WhatsApp Web tabs
    const tabs = await chrome.tabs.query({ url: 'https://web.whatsapp.com/*' });
    
    for (const tab of tabs) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'toggleHideMode',
          enabled: enabled
        });
        console.log(`[WAWebPlus Background] Sent toggle message to tab ${tab.id}`);
      } catch (error) {
        console.log(`[WAWebPlus Background] Tab ${tab.id} not ready:`, error.message);
      }
    }
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('[WAWebPlus Background] Error in handleToggleHideMode:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Fungsi untuk toggle restore deleted messages
async function handleToggleRestoreDeleted(enabled, sendResponse) {
  console.log(`[WAWebPlus Background] Toggling restore deleted: ${enabled}`);
  
  try {
    // Save to storage
    await chrome.storage.local.set({ restoreDeleted: enabled });
    
    // Send message to all WhatsApp Web tabs
    const tabs = await chrome.tabs.query({ url: 'https://web.whatsapp.com/*' });
    
    for (const tab of tabs) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'toggleRestoreDeleted',
          enabled: enabled
        });
        console.log(`[WAWebPlus Background] Sent restore deleted toggle message to tab ${tab.id}`);
      } catch (error) {
        console.log(`[WAWebPlus Background] Tab ${tab.id} not ready:`, error.message);
      }
    }
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('[WAWebPlus Background] Error in handleToggleRestoreDeleted:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Fungsi untuk reload CSS
async function handleReloadCSS() {
  console.log('[WAWebPlus Background] Reloading CSS');
  
  const tabs = await chrome.tabs.query({ 
    url: 'https://web.whatsapp.com/*' 
  });
  
  if (tabs.length === 0) {
    console.log('[WAWebPlus Background] No WhatsApp Web tabs found for CSS reload');
    return;
  }
  
  // Kirim pesan reload CSS ke semua tab WhatsApp Web
  for (const tab of tabs) {
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'reloadCSS'
      });
      console.log(`[WAWebPlus Background] Sent CSS reload to tab ${tab.id}`);
    } catch (error) {
      console.error(`[WAWebPlus Background] Error sending CSS reload to tab ${tab.id}:`, error);
    }
  }
}

// Mendengarkan perubahan tab untuk auto-apply state
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Hanya proses jika tab selesai loading dan merupakan WhatsApp Web
  if (changeInfo.status === 'complete' && 
      tab.url && 
      tab.url.includes('web.whatsapp.com')) {
    
    console.log(`[WAWebPlus Background] WhatsApp Web tab loaded: ${tabId}`);
    
    // Dapatkan state saat ini
    const result = await chrome.storage.local.get(['hideMode', 'restoreDeleted']);
    const hideMode = result.hideMode || false;
    const restoreDeleted = result.restoreDeleted || false;
    
    // Tunggu sebentar untuk memastikan content script sudah loaded
    setTimeout(async () => {
      try {
        // Send hide mode state
        chrome.tabs.sendMessage(tabId, {
          action: 'toggleHideMode',
          enabled: hideMode
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.log(`[WAWebPlus Background] Tab ${tabId} not ready for hide mode:`, chrome.runtime.lastError.message);
          } else {
            console.log(`[WAWebPlus Background] Initialized hide mode on tab ${tabId}: ${hideMode}`);
          }
        });
        
        // Send restore deleted state
        chrome.tabs.sendMessage(tabId, {
          action: 'toggleRestoreDeleted',
          enabled: restoreDeleted
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.log(`[WAWebPlus Background] Tab ${tabId} not ready for restore deleted:`, chrome.runtime.lastError.message);
          } else {
            console.log(`[WAWebPlus Background] Initialized restore deleted on tab ${tabId}: ${restoreDeleted}`);
          }
        });
      } catch (error) {
        console.error(`[WAWebPlus Background] Error initializing tab ${tabId}:`, error);
      }
    }, 1000);
  }
});

// Storage change listener untuk sinkronisasi antar tab
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.hideMode) {
      console.log('[WAWebPlus Background] Hide mode changed in storage:', changes.hideMode.newValue);
    }
    if (changes.restoreDeleted) {
      console.log('[WAWebPlus Background] Restore deleted changed in storage:', changes.restoreDeleted.newValue);
    }
  }
});