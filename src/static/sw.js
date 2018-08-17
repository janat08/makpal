self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('video-storeaaa').then(function (cache) {
            var a = cache.addAll([
                '/bundles/index.js',
                '/index.html',
            ]).then(x=>console.log(x));
            return a
        })
    );
});

self.addEventListener('fetch', function (e) {
    console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});