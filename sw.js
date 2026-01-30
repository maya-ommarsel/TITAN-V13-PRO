if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
const CACHE_NAME = 'titan-v13-secure-cache';
const assets = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(assets)));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
