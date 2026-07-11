<script lang="ts">
	import { metronome } from '../stores/metronome.svelte';

	function decrement() {
		metronome.setBpm(metronome.bpm - 1);
	}

	function increment() {
		metronome.setBpm(metronome.bpm + 1);
	}
</script>

<div class="bpm-display">
	<div class="bpm-value">{metronome.bpm}</div>
	<div class="bpm-label">BPM</div>
	<div class="bpm-controls">
		<button onclick={decrement} aria-label="Decrease BPM">−</button>
		<button onclick={increment} aria-label="Increase BPM">+</button>
	</div>
</div>

<style>
	.bpm-display {
		text-align: center;
	}

	.bpm-value {
		font-size: clamp(2.5rem, 10vmin, 4.5rem);
		font-weight: 200;
		font-variant-numeric: tabular-nums;
		line-height: 1;
		color: var(--fg);
	}

	.bpm-label {
		font-size: 0.8rem;
		letter-spacing: 0.2em;
		color: var(--muted);
		text-transform: uppercase;
		margin-top: 0.25rem;
	}

	.bpm-controls {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		margin-top: 0.75rem;
	}

	.bpm-controls button {
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		background: var(--card);
		color: var(--fg);
		font-size: 1.25rem;
		cursor: pointer;
		transition: background 0.1s ease;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.bpm-controls button:hover {
		background: color-mix(in srgb, var(--accent) 10%, var(--card));
	}

	.bpm-controls button:active {
		transform: scale(0.95);
	}
</style>
