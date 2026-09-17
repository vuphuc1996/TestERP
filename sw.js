const CACHE_NAME = 'fumeni-shell-v3';

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(SHELL_FILES);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key !== CACHE_NAME;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  const request = event.request;

  /*
   * Chỉ xử lý GET.
   */
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  /*
   * Chỉ cache GitHub Pages cùng origin.
   * Không cache Google / GAS / Googleusercontent.
   */
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(function (cachedResponse) {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then(function (response) {
          /*
           * Chỉ cache response của chính GitHub Pages.
           */
          if (
            response &&
            response.ok &&
            url.origin === self.location.origin
          ) {
            const responseClone = response.clone();

            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, responseClone);
            });
          }

          return response;
        });
      })
  );
});
