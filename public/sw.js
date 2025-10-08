self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('zenvibe-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/public/ZenVibeContent.json',
        '/public/bell1.mp3',
        '/public/gong2.mp3',
        '/public/chime3.mp3',
        '/public/icon.png',
        '/dist/assets/main.js',
        '/dist/assets/main.css'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
