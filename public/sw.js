const BASE_PATH = '';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('zenvibe-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/ZenVibeContent.json',
        '/bell1.mp3',
        '/gong2.mp3',
        '/chime3.mp3',
        '/icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      });
    })
  );
});
