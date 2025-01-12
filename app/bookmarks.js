let currentIndex = 0;

export function displayOtherBookmarks(bookmarkFolders) {
  const container = document.getElementById('bookmark-container');

  // Load last used index from localStorage (default to 0 if not found)
  currentIndex = parseInt(localStorage.getItem('currentIndex') || '0', 10);

  // Load last used folder order from localStorage
  const savedOrder = JSON.parse(localStorage.getItem('folderOrder'));
  if (savedOrder) {
    bookmarkFolders = savedOrder.map((id) => bookmarkFolders.find((f) => f.id === id) || {}).filter((f) => f.id);
  }

  // Display six folders at a time
  function displayFolders() {
    const gridContainer = document.getElementById('folder-grid');
    gridContainer.innerHTML = '';

    const visibleFolders = bookmarkFolders.slice(currentIndex, currentIndex + 6);

    visibleFolders.forEach((folder) => {
      const folderDiv = document.createElement('div');
      folderDiv.classList.add('folder-item');

      // Folder icon
      const icon = document.createElement('div');
      icon.classList.add('folder-icon');
      icon.innerHTML = '📁'; // Unicode folder icon
      folderDiv.appendChild(icon);

      // Folder title
      const title = document.createElement('div');
      title.classList.add('folder-title');
      title.textContent = folder.title || 'Unnamed Folder';
      folderDiv.appendChild(title);

      // Add click event to show bookmarkFolders
      folderDiv.addEventListener('click', () => {
        const folderContent = document.createElement('div');
        folderContent.classList.add('folder-content');
        folderContent.innerHTML = ''; // Clear previous content
        folderContent.appendChild(createBookmarkGrid(folder.children));

        // Move clicked folder to the front
        bookmarkFolders = [folder, ...bookmarkFolders.filter((f) => f !== folder)];
        saveFolderOrder();

        // Clear the container and show bookmarkFolders
        gridContainer.innerHTML = '';
        const backButton = createBackButton(() => {
          gridContainer.innerHTML = '';
          gridContainer.appendChild(displayFolders());
        });
        gridContainer.appendChild(backButton);
        gridContainer.appendChild(folderContent);
      });

      gridContainer.appendChild(folderDiv);
    });

    toggleNavButtons();
  }

  // Save the current folder order to localStorage
  function saveFolderOrder() {
    const folderOrder = bookmarkFolders.map((folder) => folder.id);
    localStorage.setItem('folderOrder', JSON.stringify(folderOrder));
  }

  // Enable/disable navigation buttons
  function toggleNavButtons() {
    document.getElementById('prev').disabled = currentIndex === 0;
    document.getElementById('next').disabled = currentIndex + 6 >= bookmarkFolders.length;
  }

  // Navigation logic
  document.getElementById('prev').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 6;
      localStorage.setItem('currentIndex', currentIndex); // Save to localStorage
      displayFolders();
    }
  });

  document.getElementById('next').addEventListener('click', () => {
    if (currentIndex + 6 < bookmarkFolders.length) {
      currentIndex += 6;
      localStorage.setItem('currentIndex', currentIndex); // Save to localStorage
      displayFolders();
    }
  });

  // Create a grid of bookmarkFolders for a folder
  function createBookmarkGrid(bookmarkFolders) {
    const grid = document.createElement('div');
    grid.classList.add('bookmark-grid');
    for (let bookmark of bookmarkFolders) {
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
  displayFolders();
}
