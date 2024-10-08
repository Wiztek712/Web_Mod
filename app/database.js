// IndexedDB setup for folders and bookmarks
const dbName = 'BookmarksDB';
const folderStoreName = 'foldersStore';
const bookmarkStoreName = 'bookmarksStore';

async function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create store for folders with unique `id`
            const folderStore = db.createObjectStore(folderStoreName, { keyPath: 'id' });
            folderStore.createIndex('id', 'id', { unique: true });

            // Create store for bookmarks with unique `id` and an index on `folderId`
            const bookmarkStore = db.createObjectStore(bookmarkStoreName, { keyPath: 'id' });
            bookmarkStore.createIndex('id', 'id', { unique: true });
            bookmarkStore.createIndex('folderId', 'folderId', { unique: false });  // Link to folder
        };

        request.onsuccess = () => {
            console.log('Database opened successfully');
            resolve(request.result);
        };

        request.onerror = (error) => {
            console.error('Error opening database:', error);
            reject(error);
        };
    });
}

async function saveFolder(id, name) {
    const db = await initIndexedDB();
    const transaction = db.transaction(folderStoreName, 'readwrite');
    const folderStore = transaction.objectStore(folderStoreName);

    const folder = { id, name };
    
    const request = folderStore.put(folder);
    
    // request.onsuccess = () => {
    //     console.log('Folder saved successfully:', folder);
    // };

    request.onerror = () => {
        console.error('Error saving folder:', request.error);
    };
}

async function saveBookmark(id, url, name, folderId, rank = 0) {
    const db = await initIndexedDB();
    const transaction = db.transaction(bookmarkStoreName, 'readwrite');
    const bookmarkStore = transaction.objectStore(bookmarkStoreName);

    const bookmark = { id, url, name, folderId, rank };
    
    const request = bookmarkStore.put(bookmark);
    
    // request.onsuccess = () => {
    //     console.log('Bookmark saved successfully:', bookmark);
    // };

    request.onerror = () => {
        console.error('Error saving bookmark:', request.error);
    };
}

async function getFolderById(folderId) {
    const db = await initIndexedDB();
    const transaction = db.transaction(folderStoreName, 'readonly');
    const folderStore = transaction.objectStore(folderStoreName);
    
    const request = folderStore.get(folderId);
    
    request.onsuccess = () => {
        if (request.result) {
            // console.log('Folder found:', request.result);
        } else {
            console.log('Folder not found with id:', folderId);
        }
    };

    request.onerror = () => {
        console.error('Error fetching folder:', request.error);
    };
}

async function getBookmarksByFolderId(folderId) {
    const db = await initIndexedDB();
    const transaction = db.transaction(bookmarkStoreName, 'readonly');
    const bookmarkStore = transaction.objectStore(bookmarkStoreName);
    const index = bookmarkStore.index('folderId');  // Use folderId index

    return new Promise((resolve, reject) => {
        const request = index.getAll(folderId);
        
        request.onsuccess = () => {
            let bookmarks = request.result;
            if (bookmarks.length > 0) {
                // Sort bookmarks by rank attribute
                bookmarks.sort((a, b) => a.rank - b.rank);
                resolve(bookmarks); // Resolve the promise with the sorted results
            } else {
                resolve([]); // Resolve with an empty array if no bookmarks found
            }
        };

        request.onerror = () => {
            console.error('Error fetching bookmarks:', request.error);
            reject(request.error); // Reject the promise with the error
        };
    });
}

async function getBookmarksExceptFolderId(excludedFolderId) {
    const db = await initIndexedDB();
    const transaction = db.transaction(bookmarkStoreName, 'readonly');
    const bookmarkStore = transaction.objectStore(bookmarkStoreName);

    return new Promise((resolve, reject) => {
        const bookmarks = [];

        const request = bookmarkStore.openCursor(); // Open cursor for all entries

        request.onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor) {
                // Check if the current cursor's entry does not have the excluded folderId
                if (cursor.value.folderId !== excludedFolderId) {
                    bookmarks.push(cursor.value); // Push the entry if it doesn't match
                }
                cursor.continue(); // Move to the next entry
            } else {
                // Cursor has reached the end
                resolve(bookmarks); // Resolve with the collected bookmarks
            }
        };

        request.onerror = () => {
            console.error('Error fetching bookmarks:', request.error);
            reject(request.error); // Reject with the error
        };
    });
}




export {saveBookmark,saveFolder, getBookmarksByFolderId, getBookmarksExceptFolderId}