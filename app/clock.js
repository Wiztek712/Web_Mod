export function initClock() {
    function updateClock() {
        const now = new Date();
        const time = now.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
        document.getElementById('time').textContent = time;
    }

    setInterval(updateClock, 1000);
    updateClock();
}