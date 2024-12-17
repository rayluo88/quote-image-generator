// Create context menu item when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'create-quote-image',
    title: 'Create Quote Image',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'create-quote-image' && tab?.id) {
    openEditor(info.selectionText || '');
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'OPEN_EDITOR') {
    openEditor(message.payload.text);
  }
});

// Helper function to open editor
function openEditor(text: string): void {
  // Store the selected text
  chrome.storage.local.set({ selectedText: text }, () => {
    // Open editor in a new tab
    chrome.windows.create({
      url: chrome.runtime.getURL('editor.html'),
      type: 'popup',
      width: 800,
      height: 600
    });
  });
} 