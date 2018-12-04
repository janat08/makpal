// self.addEventListener('install', function (e) {
//     e.waitUntil(
//         caches.open('video-storeaaa').then(function (cache) {
//             var a = cache.addAll([
//                 '/bundles/index.js',
//                 '/index.html',
//             ]).then(x=>console.log(x));
//             return a
//         })
//     );
// });

// self.addEventListener('fetch', function (e) {
//     console.log(e.request.url);
//     e.respondWith(
//         caches.match(e.request).then(function (response) {
//             return response || fetch(e.request);
//         })
//     );
// });

//from https://github.com/VeliovGroup/Meteor-Files-Demos/blob/master/demo/public/sw.js
(function(self) {
	"use strict";
	var CACHE_NAME = "makpalApp";
	var pages = ["/", "/man.webmanifest"];
	var origin = self.location.origin;
	var RE = {
		method: /GET/i,
		static: /\.(?:png|jpe?g|css|js|gif|webm|webp|eot|svg|ttf|woff|woff2)(?:\?[a-zA-Z0-9-._~:/#\[\]@!$&'()*+,;=]*)?$|(?:fonts\.googleapis\.com|gstatic\.com)/i,
		sockjs: /\/sockjs\//
	};

	self.addEventListener("install", function(event) {
		self.skipWaiting();
		event.waitUntil(
			caches.open(CACHE_NAME).then(function(cache) {
				cache.addAll(pages);
			})
		);
	});

	self.addEventListener("fetch", function(event) {
		self.clients.claim();

		if (
			RE.method.test(event.request.method) &&
			!RE.sockjs.test(event.request.url) &&
			!event.request.headers.get("Range")
		) {
			var req = event.request.clone();
			var uri = event.request.url.replace(origin, "");

			event.respondWith(
				fetch(req)
					.then(function(response) {
						if (
							(!!~pages.indexOf(uri) ||
								RE.static.test(event.request.url)) &&
							response.status === 200
						) {
							var resp = response.clone();
							caches.open(CACHE_NAME).then(function(cache) {
								cache.put(req, resp);
							});
						}
						return response;
					})
					.catch(function() {
						return caches
							.match(req)
							.then(function(cached) {
								return (
									cached ||
									caches.match("/").catch(function() {
										return fetch(req);
									})
								);
							})
							.catch(function() {
								return caches.match("/").catch(function() {
									return fetch(req);
								});
							});
					})
			);
		}
	});

	self.addEventListener("activate", function(event) {
		event.waitUntil(
			caches.keys().then(function(cacheNames) {
				return Promise.all(
					cacheNames.map(function(cacheName) {
						return caches.delete(cacheName).catch(function() {
							return;
						});
					})
				);
			})
		);
	});
})(this);
