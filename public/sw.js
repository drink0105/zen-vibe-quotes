const BASE_PATH = '/zen-vibe-quotes';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('zenvibe-cache-v1').then((cache) => {
      return cache.addAll([
        `${BASE_PATH}/`,
        `${BASE_PATH}/manifest.json`,
        `${BASE_PATH}/public/ZenVibeContent.json`,
        `${BASE_PATH}/public/bell1.mp3`,
        `${BASE_PATH}/public/gong2.mp3`,
        `${BASE_PATH}/public/chime3.mp3`,
        `${BASE_PATH}/public/icon.png`
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
          return caches.match(`${BASE_PATH}/`);
        }
      });
    })
  );
});
