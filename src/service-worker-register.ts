import { browser } from '$app/environment';
import { dev } from '$app/environment';

export async function registerServiceWorker() {
	if (!browser || dev) return;

	if ('serviceWorker' in navigator) {
		try {
			const basePath = import.meta.env.BASE_URL;
			await navigator.serviceWorker.register(`${basePath}service-worker.js`);
		} catch (e) {
			console.warn('Service worker registration failed:', e);
		}
	}
}
