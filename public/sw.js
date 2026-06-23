var CACHE_NAME = 'fupop-v1';
var urlsToCache = [
  '/index.html',
  '/manifest.json',
  '/pwa-assets/icons/icon-48.svg',
  '/pwa-assets/icons/icon-72.svg',
  '/pwa-assets/icons/icon-96.svg',
  '/pwa-assets/icons/icon-128.svg',
  '/pwa-assets/icons/icon-144.svg',
  '/pwa-assets/icons/icon-152.svg',
  '/pwa-assets/icons/icon-192.svg',
  '/pwa-assets/icons/icon-384.svg',
  '/pwa-assets/icons/icon-512.svg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
});
