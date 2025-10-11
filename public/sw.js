self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('zenvibe-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/public/ZenVibeContent.json',
        '/public/bell1.mp3',
        '/public/gong2.mp3',
        '/public/chime3.mp3',
        '/public/icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // Cache successful responses
        if (fetchResponse.ok && event.request.method === 'GET') {
          const responseToCache = fetchResponse.clone();
          caches.open('zenvibe-cache-v1').then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return fetchResponse;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return response;
      });
    })
  );
});
