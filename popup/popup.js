// Popup script untuk WA Web Plus - Prototype
// Implementasi sederhana untuk toggle blur

console.log('[WAWebPlus Popup] Popup script loaded');

// DOM elements
let hideModeToggle;
let restoreDeletedToggle;
let statusDot;
let statusText;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[WAWebPlus Popup] DOM loaded, initializing...');
  
  // Get DOM elements
  hideModeToggle = document.getElementById('hideModeToggle');
  restoreDeletedToggle = document.getElementById('restoreDeletedToggle');
  statusDot = document.getElementById('statusDot');
  statusText = document.getElementById('statusText');
  
  if (!hideModeToggle || !restoreDeletedToggle || !statusDot || !statusText) {
    console.error('[WAWebPlus Popup] Failed to initialize DOM elements');
    return;
  }
  
  // Setup event listeners
  hideModeToggle.addEventListener('change', handleHideModeToggle);
  restoreDeletedToggle.addEventListener('change', handleRestoreDeletedToggle);
  
  // Load current state
  await loadCurrentState();
  
  console.log('[WAWebPlus Popup] Initialization complete');
});

// Load current state from storage
async function loadCurrentState() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getHideMode' });
    const restoreResponse = await chrome.runtime.sendMessage({ action: 'getRestoreDeleted' });
    
    if (response && response.enabled !== undefined) {
      updateHideModeUI(response.enabled);
      console.log(`[WAWebPlus Popup] Hide mode state loaded: ${response.enabled}`);
    }
    
    if (restoreResponse && restoreResponse.enabled !== undefined) {
      updateRestoreDeletedUI(restoreResponse.enabled);
      console.log(`[WAWebPlus Popup] Restore deleted state loaded: ${restoreResponse.enabled}`);
    }
  } catch (error) {
    console.error('[WAWebPlus Popup] Error loading current state:', error);
    updateHideModeUI(false);
    updateRestoreDeletedUI(false);
  }
}

// Handle hide mode toggle change
async function handleHideModeToggle(event) {
  const enabled = event.target.checked;
  console.log(`[WAWebPlus Popup] Hide mode toggle changed: ${enabled}`);
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'toggleHideMode',
      enabled: enabled
    });
    
    if (response && response.success) {
      updateHideModeUI(enabled);
      console.log(`[WAWebPlus Popup] Hide mode toggle successful: ${enabled}`);
    } else {
      console.error('[WAWebPlus Popup] Hide mode toggle failed:', response);
      // Revert toggle
      hideModeToggle.checked = !enabled;
    }
  } catch (error) {
    console.error('[WAWebPlus Popup] Error toggling hide mode:', error);
    // Revert toggle
    hideModeToggle.checked = !enabled;
  }
}

// Handle restore deleted messages toggle change
async function handleRestoreDeletedToggle(event) {
  const enabled = event.target.checked;
  console.log(`[WAWebPlus Popup] Restore deleted toggle changed: ${enabled}`);
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'toggleRestoreDeleted',
      enabled: enabled
    });
    
    if (response && response.success) {
      updateRestoreDeletedUI(enabled);
      console.log(`[WAWebPlus Popup] Restore deleted toggle successful: ${enabled}`);
    } else {
      console.error('[WAWebPlus Popup] Restore deleted toggle failed:', response);
      // Revert toggle
      restoreDeletedToggle.checked = !enabled;
    }
  } catch (error) {
    console.error('[WAWebPlus Popup] Error toggling restore deleted:', error);
    // Revert toggle
    restoreDeletedToggle.checked = !enabled;
  }
}

// Update hide mode UI based on state
function updateHideModeUI(enabled) {
  hideModeToggle.checked = enabled;
  
  if (enabled) {
    statusDot.className = 'status-dot active';
    statusText.textContent = 'Hide Mode: ON';
  } else {
    statusDot.className = 'status-dot';
    statusText.textContent = 'Hide Mode: OFF';
  }
}

// Update restore deleted UI based on state
function updateRestoreDeletedUI(enabled) {
  restoreDeletedToggle.checked = enabled;
  console.log(`[WAWebPlus Popup] Restore deleted UI updated: ${enabled}`);
}