'use strict';

const fetchVideoUrl = url => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('url', url);

        fetch('https://www.savetweetvid.com/downloader', {
            method: 'post',
            body: formData
        })
            .then(res => res.text())
            .then(res => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(res, 'text/html');

                const [button] = doc.getElementsByClassName('btn btn-download');

                if (button && button.href) {
                    resolve(button.href);
                } else {
                    reject();
                }
            });
    });
};

chrome.browserAction.onClicked.addListener(({ url }) => {
    fetchVideoUrl(url)
        .then(async video => {
            // todo: Add an option to instead open in the next tab
            chrome.downloads.download({
                url: video,
                saveAs: true
            });
        })
        .catch(e =>
            chrome.tabs.executeScript({
                code: "alert('A Twitter video could not be detected, or there was an error parsing your request!');"
            })
        );
});
