// sw.js
const CACHE_NAME = 'calc-materiales-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://interceramic.com/on/demandware.static/Sites-interceramic-Site/-/default/dw3478a94e/images/logo.png',
  'https://raw.githubusercontent.com/victoregonzalez01/victoregonzalez01.github.io/refs/heads/main/LOGO.ico',
  'https://interceramic.com/on/demandware.static/-/Sites/default/dw9d4c5c4e/images/137437.png',
  'https://interceramic.com/on/demandware.static/-/Sites/default/dw6e4c9f4f/images/137440.png',
  'https://interceramic.com/on/demandware.static/-/Sites/default/dwdd5c5a8d/images/168146.png',
  'https://interceramic.com/on/demandware.static/-/Sites/default/dw2f5d9f65/images/168147.png',
  'https://interceramic.com/on/demandware.static/-/Sites/default/dw2a8b1d6a/images/137438.png',
  'https://interceramic.com/on/demandware.static/-/Sites/default/dwcb7c3e0a/images/168148.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
