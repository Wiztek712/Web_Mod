const backgroundImages = [
    '../images/picture1.jpeg',
    '../images/picture2.jpeg'
    ];

export function initBackground() {
    
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    document.body.style.backgroundImage = `url(${randomImage})`;

    // Call when page loads
    document.addEventListener('DOMContentLoaded', initBackground);
}