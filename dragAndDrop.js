const mainBookmarksContainer = document.getElementById('main-bookmarks');
let draggedItem = null;

// Load bookmarks from localStorage if available, otherwise use default bookmarks
function loadBookmarks() {
    const savedOrder = localStorage.getItem('bookmarkOrder');
    if (savedOrder) {
        return JSON.parse(savedOrder);
    }
    return bookmarks;
}

// Save the current order of bookmarks to localStorage
function saveBookmarkOrder() {
    const bookmarkOrder = [];
    document.querySelectorAll('.sidebar-bookmark').forEach(bookmark => {
        bookmarkOrder.push({
            id: bookmark.getAttribute('data-id'),
            title: bookmark.getAttribute('data-title'),
            url: bookmark.getAttribute('data-url')
        });
    });
    localStorage.setItem('bookmarkOrder', JSON.stringify(bookmarkOrder));
}

// Display bookmarks
function displayBookmarks(bookmarks) {
    mainBookmarksContainer.innerHTML = '';  // Clear container

    bookmarks.forEach(bookmark => {
        const bookmarkDiv = document.createElement('div');
        bookmarkDiv.classList.add('sidebar-bookmark');
        bookmarkDiv.setAttribute('draggable', 'true');
        bookmarkDiv.setAttribute('data-id', bookmark.id);
        bookmarkDiv.setAttribute('data-title', bookmark.title);
        bookmarkDiv.setAttribute('data-url', bookmark.url);

        const a = document.createElement('a');
        a.href = bookmark.url;
        a.title = bookmark.title;

        const img = document.createElement('img');
        img.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${bookmark.url}`; // Use site favicon

        a.appendChild(img);
        bookmarkDiv.appendChild(a);
        mainBookmarksContainer.appendChild(bookmarkDiv);

        // Add drag-and-drop event listeners
        bookmarkDiv.addEventListener('dragstart', handleDragStart);
        bookmarkDiv.addEventListener('dragend', handleDragEnd);
        bookmarkDiv.addEventListener('dragover', handleDragOver);
        bookmarkDiv.addEventListener('drop', handleDrop);
    });
}

// Handle drag start event
function handleDragStart(event) {
    draggedItem = event.target;
    event.target.classList.add('dragging');
}

// Handle drag end event
function handleDragEnd(event) {
    event.target.classList.remove('dragging');
    draggedItem = null;
    saveBookmarkOrder(); // Save the new order when the drag ends
}

// Handle drag over event
function handleDragOver(event) {
    event.preventDefault();
    const draggingOver = event.target.closest('.sidebar-bookmark');
    if (draggingOver && draggedItem !== draggingOver) {
        mainBookmarksContainer.insertBefore(draggedItem, draggingOver.nextSibling);
    }
}

// Handle drop event
function handleDrop(event) {
    event.preventDefault();
}

// Load and display bookmarks when the page loads
window.onload = function() {
    const bookmarks = loadBookmarks();
    displayBookmarks(bookmarks);
};