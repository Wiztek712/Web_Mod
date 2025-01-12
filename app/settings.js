document.getElementById('open-settings').addEventListener('click', function() {
    document.getElementById('settings-modal').style.display = 'flex';
});

document.getElementById('cancel-settings').addEventListener('click', function() {
    document.getElementById('settings-modal').style.display = 'none';
});

document.getElementById('save-settings').addEventListener('click', function() {
    const mainFolder = document.getElementById('main-folder').value;
    const backgroundFolderInput = document.getElementById('background-folder');
    const backgroundFolder = Array.from(backgroundFolderInput.files).map(file => file.webkitRelativePath);

    localStorage.setItem('mainFolder', mainFolder);
    localStorage.setItem('backgroundFolder', JSON.stringify(backgroundFolder));

    console.log('Settings saved:', { mainFolder, backgroundFolder });

    document.getElementById('settings-modal').style.display = 'none';
});

window.onload = () => {
    const savedMainFolder = localStorage.getItem('mainFolder');
    const savedBackgroundFolder = JSON.parse(localStorage.getItem('backgroundFolder'));

    if (savedMainFolder) {
        document.getElementById('main-folder').value = savedMainFolder;
    }

    if (savedBackgroundFolder && savedBackgroundFolder.length > 0) {
        console.log('Previously selected background images folder:', savedBackgroundFolder);
    }
};
  