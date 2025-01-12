export function initColumn(mainBookmarks) {

    const bookmarkColumn = document.getElementById('bookmark-column');
    const body = document.body;

    bookmarkColumn.addEventListener('mouseenter', () => {
        body.classList.add('bookmark-column-open');
    });

    bookmarkColumn.addEventListener('mouseleave', () => {
        body.classList.remove('bookmark-column-open');
    });
            
    const mainBookmarksContainer = document.getElementById('bookmark-icons');
    mainBookmarksContainer.innerHTML = '';

    for (let bookmark of mainBookmarks) {
        if (bookmark.url) {
            const img = document.createElement('img');
            img.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${bookmark.url}`;
            img.alt = bookmark.title;
            img.title = bookmark.title;
            img.addEventListener('click', () => {
                window.open(bookmark.url, '_blank');
            });
            mainBookmarksContainer.appendChild(img);
        }
    }
    
}