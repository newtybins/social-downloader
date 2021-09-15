"use strict";

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

const regex = /http[s]?:\/\/twitter.com\/.*\/status\/[0-9]*/gi;

chrome.browserAction.onClicked.addListener((tab) => {
  if (regex.test(tab.url)) {
    const formData = new FormData();
    formData.append("url", tab.url);

    fetch("https://www.savetweetvid.com/downloader", {
      method: "post",
      body: formData,
    })
      .then((res) => res.text())
      .then((res) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(res, "text/html");
        const button = doc.getElementsByClassName("btn btn-download")[0];

        chrome.tabs.create({ url: button.href });
      })
      .catch(() => {
        alert(
          "There was no video or GIF on this page! If this is an error, please open an issue at newtykins/twitdown on GitHub!"
        );
      });
  } else {
    alert("This is not a valid tweet URL!");
  }
});
