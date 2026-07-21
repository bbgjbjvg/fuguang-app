// SW v5 - 强制清除所有缓存并重新加载
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.map(function(name) { return caches.delete(name); }));
    }).then(function() {
      return clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  // 拦截 index.html，返回清除脚本
  if (event.request.url.indexOf('index.html') !== -1 || event.request.url.match(/\/$/)) {
    event.respondWith(
      new Response(
        '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>芙光</title></head><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#FFF5F8"><div style="text-align:center"><div style="font-size:40px;margin-bottom:16px">✨</div><div style="color:#E84D8A;font-weight:700;font-size:16px">正在更新芙光...</div></div><script>' +
        'navigator.serviceWorker.getRegistrations().then(function(regs){regs.forEach(function(r){r.unregister()})});' +
        'caches.keys().then(function(names){return Promise.all(names.map(function(n){return caches.delete(n)}))}).then(function(){' +
        'setTimeout(function(){location.replace("index.html?v=8")},800)' +
        '})' +
        '</script></body></html>',
        {headers: {'Content-Type': 'text/html;charset=UTF-8'}}
      )
    );
    return;
  }
  event.respondWith(fetch(event.request));
});