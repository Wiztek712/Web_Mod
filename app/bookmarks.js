export function displayOtherBookmarks(bookmarks) {
    const container = document.getElementById('bookmark-container');
    container.innerHTML = ''; // Clear the container

    // Create a grid of folder squares
    function createFolderGrid(bookmarks) {
        const grid = document.createElement('div');
        grid.classList.add('folder-grid');

        for (let bookmark of bookmarks) {
            if (bookmark.children) { // Only process folders
                const folderDiv = document.createElement('div');
                folderDiv.classList.add('folder-item');

                // Folder icon
                const icon = document.createElement('div');
                icon.classList.add('folder-icon');
                icon.innerHTML = '📁'; // Unicode folder icon (you can replace this with an image)
                folderDiv.appendChild(icon);

                // Folder title
                const title = document.createElement('div');
                title.classList.add('folder-title');
                title.textContent = bookmark.title || "Unnamed Folder";
                folderDiv.appendChild(title);

                // Add click event to show bookmarks
                folderDiv.addEventListener('click', () => {
                    const folderContent = document.createElement('div');
                    folderContent.classList.add('folder-content');
                    folderContent.innerHTML = ''; // Clear previous content
                    folderContent.appendChild(createBookmarkGrid(bookmark.children));

                    // Clear the container and show bookmarks
                    container.innerHTML = '';
                    const backButton = createBackButton(() => {
                        container.innerHTML = '';
                        container.appendChild(createFolderGrid(bookmarks));
                    });
                    container.appendChild(backButton);
                    container.appendChild(folderContent);
                });

                grid.appendChild(folderDiv);
            }
        }

        return grid;
    }

    // Create a grid of bookmarks for a folder
    function createBookmarkGrid(bookmarks) {
        const grid = document.createElement('div');
        grid.classList.add('bookmark-grid');
        for (let bookmark of bookmarks) {
            if (bookmark.url) {
                const bookmarkDiv = document.createElement('div');
                bookmarkDiv.classList.add('bookmark-item');

                const img = document.createElement('img');
                img.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${bookmark.url}`;
                bookmarkDiv.appendChild(img);

                const a = document.createElement('a');
                a.href = bookmark.url;
                a.textContent = bookmark.title || bookmark.url;
                a.target = '_blank';
                bookmarkDiv.appendChild(a);

                grid.appendChild(bookmarkDiv);
            }
        }
        return grid;
    }

    // Create a back button
    function createBackButton(onClick) {
        const backButton = document.createElement('button');
        backButton.textContent = '⬅ Back';
        backButton.classList.add('back-button');
        backButton.addEventListener('click', onClick);
        return backButton;
    }

    // Add folders to the DOM
    container.appendChild(createFolderGrid(bookmarks));
    
}