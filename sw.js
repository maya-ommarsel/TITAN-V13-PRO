// 1. Tentukan Versi Cache. 
// Cukup ubah angka versi ini setiap kali Anda melakukan update besar.
const CACHE_NAME = 'titan-supreme-v13.1'; 

const assets = [
  '/',
  '/index.html',
  '/manifest.json',
  // Tambahkan file CSS atau JS lain di sini jika ada
];

// Tahap Install: Menyimpan aset ke cache
self.addEventListener('install', e => {
  self.skipWaiting(); // Memaksa service worker baru untuk aktif segera
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(assets);
    })
  );
});

// Tahap Activate: Membersihkan cache lama secara otomatis
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Tahap Fetch: Strategi Network-First
// Mencoba ambil dari internet dulu agar 'index.html' selalu yang terbaru.
// Jika internet gagal (offline), baru ambil dari cache.
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Simpan salinan terbaru ke cache sambil jalan
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => caches.match(e.request)) // Ambil dari cache jika koneksi gagal
  );
});
// Tambahkan ini di bagian paling bawah sw.js
self.addEventListener('message', e => {
  if (e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
