import { initClock } from './clock.js';
import { initColumn } from './column.js';
import { displayOtherBookmarks } from './bookmarks.js';
import { initBackground } from './background.js';

const targetFolderName = "Main"; // Replace with the folder name you want to search for

chrome.bookmarks.getTree((bookmarks) => {
    const rootBookmarks = bookmarks[0].children;
    let mainBookmarks = null;
    let otherBookmarks = [];

    function findBookmarks(bookmarks) {
        for (let bookmark of bookmarks) {
            if (bookmark.title === targetFolderName && bookmark.children) {
                mainBookmarks = bookmark.children;
            } else if (bookmark.children) {
                otherBookmarks.push(bookmark);
                findBookmarks(bookmark.children);
            }
        }
    }
    findBookmarks(rootBookmarks);

    if (mainBookmarks) {
        initColumn(mainBookmarks)
    }

    displayOtherBookmarks(otherBookmarks);
});

initClock();
initBackground();