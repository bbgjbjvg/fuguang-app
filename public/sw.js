var CACHE_NAME = 'fuguang-v3';
// Only pre-cache static assets (not HTML, to avoid old SW poisoning the cache)
var urlsToCache = [
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

// Activate immediately, don't wait for old SW to release
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  // HTML: Network First (never serve stale HTML)
  if (event.request.url.endsWith('.html') || event.request.url.endsWith('/') || event.request.url.indexOf('.html?') > -1) {
    event.respondWith(
      fetch(event.request).then(function(networkResponse) {
        var cloned = networkResponse.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, cloned);
        });
        return networkResponse;
      }).catch(function() {
        return caches.match(event.request);
      })
    );
    return;
  }
  // Static assets: cache-first
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  // Take control of all pages immediately
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(name) {
            return name !== CACHE_NAME;
          }).map(function(name) {
            return caches.delete(name);
          })
        );
      })
    ])
  );
});