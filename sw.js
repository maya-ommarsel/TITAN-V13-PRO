const CACHE_NAME = 'titan-v13-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Tahap Install: Menyimpan aset penting ke dalam cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('TITAN V13: Archiving System Assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Tahap Aktivasi: Membersihkan cache lama jika ada update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('TITAN V13: Purging Old Protocols...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Tahap Fetch: Mengambil data dari cache jika offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Kembalikan aset dari cache, atau ambil dari jaringan jika tidak ada
      return response || fetch(event.request);
    }).catch(() => {
      // Jika keduanya gagal (offline total), bisa diarahkan ke halaman offline khusus jika ada
      console.log('TITAN V13: Connection Interrupted. Using Offline Core.');
    })
  );
});
