var CACHE_NAME = 'fuguang-v1';
var urlsToCache = [
  'index.html',
  'manifest.json',
  'icons/icon-48.svg',
  'icons/icon-72.svg',
  'icons/icon-96.svg',
  'icons/icon-128.svg',
  'icons/icon-144.svg',
  'icons/icon-152.svg',
  'icons/icon-192.svg',
  'icons/icon-384.svg',
  'icons/icon-512.svg'
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
