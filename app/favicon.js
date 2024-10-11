async function fetchFavicon(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const iconLink = doc.querySelector("link[rel~='icon']");
        if (iconLink) {
            let faviconUrl = iconLink.href;
            if (!faviconUrl.startsWith('http')) {
                const base = new URL(url);
                faviconUrl = base.origin + faviconUrl;
            }
            return faviconUrl;
        } else {
            return `${url}/favicon.ico`;
        }
    } catch (error) {
        console.error('Error fetching favicon:', error);
    }
}

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('FaviconsDB', 1);

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            reject('Database error');
        };

        request.onsuccess = (event) => {
            console.log('Database opened successfully');
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('favicons')) {
                db.createObjectStore('favicons', { keyPath: 'url' });
            }
        };
    });
}

async function storeFavicon(url) {
    const db = await openDatabase();
    const transaction = db.transaction(['favicons'], 'readwrite');
    const store = transaction.objectStore('favicons');

    const faviconUrl = await fetchFavicon(url);
    const response = await fetch(faviconUrl);
    const faviconBlob = await response.blob();

    const request = store.put({ url: url, faviconBlob: faviconBlob });

    request.onsuccess = () => {
        console.log('Favicon stored successfully');
    };

    request.onerror = (event) => {
        console.error('Error storing favicon:', event.target.error);
    };
}

async function getFavicon(url) {
    const db = await openDatabase();
    const transaction = db.transaction(['favicons'], 'readonly');
    const store = transaction.objectStore('favicons');

    const request = store.get(url);

    request.onsuccess = (event) => {
        const result = event.target.result;
        if (result) {
            const blobUrl = URL.createObjectURL(result.faviconBlob);
            const img = document.createElement('img');
            img.src = blobUrl;
            img.alt = 'Favicon';
            document.body.appendChild(img);
        } else {
            console.log('No favicon found for this URL');
        }
    };

    request.onerror = (event) => {
        console.error('Error retrieving favicon:', event.target.error);
    };
}

export{storeFavicon, getFavicon}