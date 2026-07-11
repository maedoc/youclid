<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { registerServiceWorker } from '../service-worker-register';

	let { children } = $props();

	onMount(() => {
		registerServiceWorker();
	});
</script>

<svelte:head>
	<link rel="icon" href="{base}/icons/icon.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="{base}/icons/icon-192.png" />
	<link rel="manifest" href="{base}/manifest.json" />
	<meta name="theme-color" content="#1a1a2e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#f5f5f5" media="(prefers-color-scheme: light)" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="Euclid" />
</svelte:head>

{@render children()}
