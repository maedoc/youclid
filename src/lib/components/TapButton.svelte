<script lang="ts">
	import { metronome } from '../stores/metronome.svelte';

	let flashing = $state(false);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	function handleTap() {
		metronome.tapTempo();
		flashing = true;
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => (flashing = false), 150);
	}

	// Touch events for better mobile responsiveness
	function handleTouchStart(e: TouchEvent) {
		e.preventDefault();
		handleTap();
	}
</script>

<button
	class="tap-circle"
	class:flashing
	onclick={handleTap}
	ontouchstart={handleTouchStart}
	aria-label="Tap tempo"
>
	<span>TAP</span>
</button>

<style>
	.tap-circle {
		width: min(120px, 30vmin);
		height: min(120px, 30vmin);
		border-radius: 50%;
		border: 3px solid var(--accent);
		background: transparent;
		color: var(--accent);
		font-size: clamp(1rem, 4vmin, 1.5rem);
		font-weight: 700;
		letter-spacing: 0.1em;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.1s ease, transform 0.1s ease, color 0.1s ease;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.tap-circle:hover {
		background: color-mix(in srgb, var(--accent) 10%, transparent);
	}

	.tap-circle.flashing {
		background: var(--accent);
		color: var(--bg);
		transform: scale(0.95);
	}

	.tap-circle:active {
		transform: scale(0.9);
	}
</style>
