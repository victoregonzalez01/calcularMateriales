// sw.js
const CACHE_NAME = 'calc-materiales-cache-v2'; // Cambiamos la versión
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/productos.json', // ¡IMPORTANTE! Añadimos el JSON de productos
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://interceramic.com/on/demandware.static/Sites-interceramic-Site/-/default/dw3478a94e/images/logo.png',
  'https://raw.githubusercontent.com/victoregonzalez01/victoregonzalez01.github.io/refs/heads/main/LOGO.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve respuesta en caché si existe
        if (response) {
          return response;
        }
        
        // Clona la petición para poder usarla
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Verifica si la respuesta es válida
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clona la respuesta para guardarla en caché
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
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
