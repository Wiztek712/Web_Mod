import { createSwapy } from '../node_modules/swapy/dist/swapy.js';

// Fonction pour trouver le dossier des favoris principaux
const mainFolderId = "128"; // Renseignez ici l'ID du dossier des favoris principaux
const defaultFaviconUrl = '../favicon.ico';
// Google Search Bar Focus
// window.onload = function() {
//     document.querySelector('#google-search input[type="text"]').focus();
// };

// Handling favicon not found
function createFaviconElement(url) {
    const img = document.createElement('img');
    img.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`; // Use site favicon

    // Set up an error handler for the favicon image
    img.onerror = function() {
        img.src = defaultFaviconUrl; // Fallback to the default favicon on error
    };

    return img;
}

// Fonction pour afficher les favoris dans la barre latérale
function displayMainBookmarks(bookmarks) {
    const mainBookmarksContainer = document.getElementById('sidebar');
    mainBookmarksContainer.innerHTML = '';  // Clear the container

    bookmarks.forEach((bookmark, index) => {
        if (bookmark.url) {
            // Create the slot container
            const bookmarkDiv = document.createElement('div');
            bookmarkDiv.classList.add("slot-" + (index + 1).toString());
            
            // Adding this line: define a 'swapy' slot by including a 'data-swapy-slot' attribute
            bookmarkDiv.setAttribute('data-swapy-slot', index + 1); // Slot index starts at 1

            // Add the bookmark content
            const div = document.createElement('div');
            div.classList.add("item-" + (index + 1).toString());
            div.setAttribute('data-swapy-item', 100 * (index + 1));

            const divEl = document.createElement('div');
            const a = document.createElement('a');
            a.href = bookmark.url;
            a.title = bookmark.title;

            const img = createFaviconElement(bookmark.url);
            a.appendChild(img);
            divEl.appendChild(a);
            div.appendChild(divEl);
            bookmarkDiv.appendChild(div);

            // Add the bookmark to the sidebar container
            mainBookmarksContainer.appendChild(bookmarkDiv);
        }
    });
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
                const img = createFaviconElement(bookmark.url);
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
  chrome.bookmarks.getTree().then((bookmarks) => {
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
//displayBookmarks();

// const mainBookmarksContainer = document.getElementById('main-bookmarks');
// let draggedItem = null;

// // Load bookmarks from localStorage if available, otherwise use default bookmarks
// function loadBookmarks() {
//     const savedOrder = localStorage.getItem('bookmarkOrder');
//     if (savedOrder) {
//         return JSON.parse(savedOrder);
//     }
//     return bookmarks;
// }

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
    // const bookmarks = loadBookmarks();
    const container = document.querySelector('.container');
        
    displayBookmarks();
    const swapy = createSwapy(container, {
      animation: 'dynamic' // ou 'spring' ou 'none'
    });
    
    swapy.enable(true);

    // swapy.onSwap((event) => {
    //     console.log(event.data.object);
    //     console.log(event.data.array);
    //     console.log(event.data.map);
    // })
};