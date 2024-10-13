import { createSwapy } from '../node_modules/swapy/dist/swapy.js';
import { saveBookmark, saveFolder, getBookmarksByFolderId, getFoldersExceptFolderId, getBookmarksExceptFolderId, updateRanksInAFolder, checkEmptyness, synchroDB } from './database.js';

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
    img.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;

    img.onerror = function() {
        img.src = defaultFaviconUrl;
    };

    return img;
}

// Fonction pour initialiser les favoris
async function gatherBookmarks(){
    let bookmark = new Map();
    chrome.bookmarks.getTree().then((bookmarks) => {
        const rootBookmarks = bookmarks[0].children;
        let rank = 0;
        function findBookmarks(elements) { 
            elements.forEach(element => {
                if(element.url){
                    saveBookmark(element.id, element.url, element.title, element.parentId, rank++);
                }
                else if (element.children){
                    saveFolder(element.id, element.title);
                    findBookmarks(element.children);
                }
            });
        }

        findBookmarks(rootBookmarks)
    });
}

// Fonction pour afficher les favoris dans la barre latérale
async function displayMainBookmarks() {
    const mainBookmarksContainer = document.getElementById('sidebar');
    mainBookmarksContainer.innerHTML = '';  // Clear the container

    let sidebarBookmarks = await getBookmarksByFolderId(mainFolderId);

    sidebarBookmarks.forEach((bookmark, index) => {
        // Create the slot container
        const bookmarkDiv = document.createElement('div');
        bookmarkDiv.classList.add("slot");
        bookmarkDiv.classList.add("slot-" + (index + 1).toString());
        bookmarkDiv.setAttribute('data-swapy-slot', index + 1); // Slot index starts at 1
        bookmarkDiv.setAttribute('data-id', index + 1);

        // Add the bookmark content
        const div = document.createElement('div');
        div.classList.add("item");
        div.classList.add("item-" + bookmark.id);
        div.setAttribute('data-swapy-item', bookmark.id);

        const divEl = document.createElement('div');
        const a = document.createElement('a');
        a.href = bookmark.url;
        a.title = bookmark.name;

        const img = createFaviconElement(bookmark.url);
        a.appendChild(img);
        divEl.appendChild(a);
        div.appendChild(divEl);
        bookmarkDiv.appendChild(div);

        // Add the bookmark to the sidebar container
        mainBookmarksContainer.appendChild(bookmarkDiv);
    });
}

// Fonction pour afficher les autres favoris
async function displayOtherBookmarks() {
    const container = document.getElementById('bookmark-container');
    container.innerHTML = '';  // Vider le conteneur avant d'ajouter du contenu

    let folders = await getFoldersExceptFolderId(mainFolderId);

    // Parcourir les favoris et générer les dossiers
    async function createBookmarkList() {
        const Div = document.createElement('div');
        folders.forEach(async (folder,index) => {
            const folderDiv = document.createElement('div');
            folderDiv.classList.add('bookmark-folder');
            const title = document.createElement('h2');
            title.textContent = folder.name || "Dossier sans titre";
            folderDiv.appendChild(title);
            
            let bookmarks = await getBookmarksByFolderId(folder.id);
            const ul = document.createElement('ul');
            for (let bookmark of bookmarks) {
                if (bookmark) {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = bookmark.url;
                    a.textContent = bookmark.name || bookmark.url;
                    const img = createFaviconElement(bookmark.url);
                    li.appendChild(img);
                    li.appendChild(a);
                    ul.appendChild(li);
                }
            }
            folderDiv.appendChild(ul);

            Div.appendChild(folderDiv);
        });
        return Div;
    }

    // Ajout des favoris au DOM
    let bookmarks = await createBookmarkList()
    container.appendChild(bookmarks);
}

// Fonction pour vérifier si la base de données est vide
async function isDBEmpty(){
    const bool = await checkEmptyness();
    return bool;
}

// Recursive function to flatten Chrome bookmark tree
function flattenBookmarks(bookmarkNodes, flatList = []) {
    
    if (!Array.isArray(bookmarkNodes)) {
        bookmarkNodes = [bookmarkNodes];  // Convert to array if it's a single object
    }

    for (const node of bookmarkNodes) {
        if (node.url) {
            // It's a bookmark (not a folder), push to the flatList
            flatList.push({
                id: node.id,
                title: node.title,
                url: node.url,
                parentId: node.parentId || null // Optionally capture parent folder ID
            });
        }
        if (node.children) {
            // If the node has children (it's a folder), recurse through them
            flattenBookmarks(node.children, flatList);
        }
    }
    return flatList;
}


// Fonction pour synchronise la base de données.
document.getElementById("refreshButton").addEventListener("click", async () => {
    const chromeBookmarks = chrome.bookmarks.getTree();
    const chromeBookmarksFlatten = flattenBookmarks(chromeBookmarks); 
    await synchroDB(chromeBookmarksFlatten);
});

// Load and display bookmarks when the page loads
window.onload = async function() {

    try{
        const isEmpty = await isDBEmpty();
        if(isEmpty){
            gatherBookmarks();
            console.log('Bookmarks load');
        }

        displayMainBookmarks();
        console.log("Main bookmarks displayed");

        displayOtherBookmarks();
        console.log("Other bookmarks displayed");
    }
    catch(error){
        console.error(error);
    }
    

    // const container = document.querySelector('.container');
        
    // displayBookmarks();
    // const swapy = createSwapy(container, {
    //   animation: 'dynamic' // 'dynamic' 'spring' 'none'
    // });
    
    // swapy.enable(true);

    // swapy.onSwap((event) => {
    //     console.log(event.data.object);
    //     console.log(event.data.array);
    //     console.log(event.data.map);
    // });
}