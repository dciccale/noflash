/* globals chrome */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.method === 'getWhiteList') {
    sendResponse({whiteList: localStorage.whiteList});
  }
});
