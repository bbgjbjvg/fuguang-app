var CACHE_NAME = 'fuguang-v2';
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
  // HTML: stale-while-revalidate (always get latest)
  if (event.request.url.endsWith('.html') || event.request.url.endsWith('/') || event.request.url.indexOf('.html?') > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(cached) {
          var fetchPromise = fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return cached || fetchPromise;
        });
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