const CACHE_NAME = 'snake-game-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'index.tsx',
  'App.tsx',
  'SnakeLoader.tsx',
  'constants.ts',
  'types.ts',
  'snake-icon.svg',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/client'
];

// Install event: cache all the core assets.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
          console.error('Failed to cache resources during install:', error);
      })
  );
});

// Fetch event: serve assets from cache first.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return from cache if found, otherwise fetch from network.
        return response || fetch(event.request);
      })
  );
});

// Activate event: clean up old caches.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});