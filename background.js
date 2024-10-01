chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension Installed');
  });
  
  // You can listen for bookmark changes or other events as needed
  chrome.bookmarks.onCreated.addListener((id, bookmark) => {
    console.log('New bookmark added:', bookmark);
  });