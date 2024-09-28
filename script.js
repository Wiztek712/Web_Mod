// Fonction pour trouver le dossier des favoris principaux
const mainFolderId = "-AsCWKV4LM_D"; // Renseignez ici l'ID du dossier des favoris principaux

// Google Search Bar Focus
// window.onload = function() {
//     document.querySelector('#google-search input[type="text"]').focus();
// };

// Fonction pour afficher les favoris dans la barre latérale
function displayMainBookmarks(bookmarks) {
    const mainBookmarksContainer = document.getElementById('main-bookmarks');
    mainBookmarksContainer.innerHTML = '';  // Vider le conteneur

    for (let bookmark of bookmarks) {
        if (bookmark.url) {
            const bookmarkDiv = document.createElement('div');
            bookmarkDiv.classList.add('sidebar-bookmark');
            
            const a = document.createElement('a');
            a.href = bookmark.url;
            a.title = bookmark.title;

            const img = document.createElement('img');
            img.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${bookmark.url}`; // Utiliser l'icône du site
            
            //const span = document.createElement('span');
            //span.textContent = bookmark.title;

            a.appendChild(img);
            //a.appendChild(span);
            bookmarkDiv.appendChild(a);
            mainBookmarksContainer.appendChild(bookmarkDiv);

            // Add drag-and-drop event listeners
            bookmarkDiv.addEventListener('dragstart', handleDragStart);
            bookmarkDiv.addEventListener('dragend', handleDragEnd);
            bookmarkDiv.addEventListener('dragover', handleDragOver);
            bookmarkDiv.addEventListener('drop', handleDrop);
        }
    }
}

// Fonction pour afficher les autres favoris
function displayOtherBookmarks(bookmarks) {
    const container = document.getElementById('bookmark-container');
    container.innerHTML = '';  // Vider le conteneur avant d'ajouter du contenu

    // Parcourir les favoris et générer les dossiers
    function createBookmarkList(bookmarks) {
        const ul = document.createElement('ul');
        for (let bookmark of bookmarks) {
            if (bookmark.url) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = bookmark.url;
                a.textContent = bookmark.title || bookmark.url;
                const img = document.createElement('img');
                img.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${bookmark.url}`; // Utiliser l'icône du site
                li.appendChild(img);
                li.appendChild(a);
                ul.appendChild(li);
            } else if (bookmark.children) {
                // Si c'est un dossier, on le crée aussi
                const folder = document.createElement('div');
                folder.classList.add('bookmark-folder');
                const title = document.createElement('h2');
                title.textContent = bookmark.title || "Dossier sans titre";
                folder.appendChild(title);
                folder.appendChild(createBookmarkList(bookmark.children));
                container.appendChild(folder);
            }
        }
        return ul;
    }

    // Ajout des favoris au DOM
    container.appendChild(createBookmarkList(bookmarks));
}

// Fonction pour parcourir l'arbre de favoris et afficher les résultats
function displayBookmarks() {
    browser.bookmarks.getTree().then((bookmarks) => {
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