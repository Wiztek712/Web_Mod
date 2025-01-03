// Fonction pour trouver le dossier des favoris principaux
const mainFolderId = "44"; // Renseignez ici l'ID du dossier des favoris principaux

// Google Search Bar Focus
// window.onload = function() {
//     document.querySelector('#google-search input[type="text"]').focus();
// };

// Fonction pour afficher les favoris dans la barre latérale
function displayMainBookmarks(bookmarks) {
    const mainBookmarksContainer = document.getElementById('bookmark-icons');
    mainBookmarksContainer.innerHTML = '';  // Vider le conteneur

    for (let bookmark of bookmarks) {
        if (bookmark.url) {
            const img = document.createElement('img');
            img.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${bookmark.url}`; // Utiliser l'icône du site
            img.alt  
            img.alt = bookmark.title;
            img.title = bookmark.title;
            img.addEventListener('click', () => {
                window.open(bookmark.url, '_blank');
            });
            mainBookmarksContainer.appendChild(img);
        }
    }
}

// Add hover effect to control column appearance and body resizing
const bookmarkColumn = document.getElementById('bookmark-column');
const body = document.body;

// Show/hide bookmark column on hover
bookmarkColumn.addEventListener('mouseenter', () => {
    body.classList.add('bookmark-column-open');
});
bookmarkColumn.addEventListener('mouseleave', () => {
    body.classList.remove('bookmark-column-open');
});

function displayOtherBookmarks(bookmarks) {
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

// Fonction pour parcourir l'arbre de favoris et afficher les résultats
function displayBookmarks() {
    // browser.bookmarks.getTree().then((bookmarks) => {
    chrome.bookmarks.getTree((bookmarks) => {
        const rootBookmarks = bookmarks[0].children;

        // Parcourir les dossiers pour trouver le dossier principal
        let mainBookmarks = null;
        let otherBookmarks = [];

        function findBookmarks(bookmarks) {
            for (let bookmark of bookmarks) {
                if (bookmark.id === mainFolderId) {
                    mainBookmarks = bookmark.children;
                } else if (bookmark.children) {
                    otherBookmarks.push(bookmark);
                    findBookmarks(bookmark.children);
                }
            }
        }

        findBookmarks(rootBookmarks);

        // Afficher les favoris principaux dans la barre latérale
        if (mainBookmarks) {
            displayMainBookmarks(mainBookmarks);
        }

        // Afficher les autres favoris au centre
        displayOtherBookmarks(otherBookmarks);
    });
}

// Appel de la fonction pour afficher les favoris
displayBookmarks();



const mainBookmarksContainer = document.getElementById('main-bookmarks');
let draggedItem = null;

// Load bookmarks from localStorage if available, otherwise use default bookmarks
function loadBookmarks() {
    const savedOrder = localStorage.getItem('bookmarkOrder');
    if (savedOrder) {
        return JSON.parse(savedOrder);
    }
    return chrome.bookmarks;
}

// // Save the current order of bookmarks to localStorage
// function saveBookmarkOrder() {
//     const bookmarkOrder = [];
//     document.querySelectorAll('.sidebar-bookmark').forEach(bookmark => {
//         bookmarkOrder.push({
//             id: bookmark.getAttribute('data-id'),
//             title: bookmark.getAttribute('data-title'),
//             url: bookmark.getAttribute('data-url')
//         });
//     });
//     localStorage.setItem('bookmarkOrder', JSON.stringify(bookmarkOrder));
// }

// Load and display bookmarks when the page loads
window.onload = function() {
    const bookmarks = loadBookmarks();
    displayBookmarks(bookmarks);
};