const CACHE_VERSION = 'v3';
const CACHE_NAME = `zenvibe-cache-${CACHE_VERSION}`;

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/ZenVibeContent.json',
  '/bell1.mp3',
  '/gong2.mp3',
  '/chime3.mp3',
  '/icon.png',
  '/screenshot1.png',
  '/screenshot2.png',
  '/screenshot3.png',
  '/screenshot4.png'
];

// Install event – only caches required files
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate newest SW immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event – deletes all old caches
self.addEventListener('activate', event => {
  clients.claim(); // SW controls all pages immediately

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

// Fetch event – always tries network first (for latest JS/CSS)
// Falls back to cache when offline
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache fresh version
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        // Offline fallback to cache
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});
