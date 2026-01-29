// --- REGISTRASI SERVICE WORKER & PUSH NOTIF ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then((reg) => {
            console.log('TITAN SW Registered');
            
            // Meminta Izin Notifikasi
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification Access Granted');
                }
            });
        });
    });
}
