/// <reference types="@sveltejs/kit" />
/// <reference types="vite/client" />

// PWA service worker — precaches all built assets for offline use.

const CACHE_NAME = 'euclid-v1';
const PRECACHE_URLS: string[] = ['/'];

self.addEventListener('install', (event: ExtendableEvent) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
	);
});

self.addEventListener('activate', (event: ExtendableEvent) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(
				keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
			)
		)
	);
});

self.addEventListener('fetch', (event: FetchEvent) => {
	const { request } = event;

	// Only handle GET requests
	if (request.method !== 'GET') return;

	// Network-first for navigation, cache fallback
	if (request.mode === 'navigate') {
		event.respondWith(
			fetch(request)
				.then((response) => {
					const copy = response.clone();
					caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
					return response;
				})
				.catch(() => caches.match(request).then((r) => r || caches.match('/')))
		);
		return;
	}

	// Cache-first for static assets
	event.respondWith(
		caches.match(request).then((cached) => {
			if (cached) return cached;
			return fetch(request).then((response) => {
				if (response.ok && response.type === 'basic') {
					const copy = response.clone();
					caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
				}
				return response;
			});
		})
	);
});
