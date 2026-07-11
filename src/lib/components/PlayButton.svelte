<script lang="ts">
	import { metronome } from '../stores/metronome.svelte';

	let label = $derived(metronome.isPlaying ? 'Stop' : 'Play');
</script>

<div class="play-controls">
	<button
		class="play-button"
		class:playing={metronome.isPlaying}
		onclick={() => metronome.togglePlay()}
		aria-label={label}
	>
		{#if metronome.isPlaying}
			■
		{:else}
			▶
		{/if}
		{label}
	</button>
	<button
		class="reset-button"
		onclick={() => metronome.reset()}
		aria-label="Reset to defaults"
	>
		Reset
	</button>
</div>

<style>
	.play-controls {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
	}

	.play-button {
		flex: 1;
		padding: 0.85rem 1.5rem;
		border: none;
		border-radius: 10px;
		background: var(--accent);
		color: var(--bg);
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		transition: opacity 0.1s ease, transform 0.1s ease;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.play-button:hover {
		opacity: 0.9;
	}

	.play-button:active {
		transform: scale(0.97);
	}

	.play-button.playing {
		background: var(--danger);
	}

	.reset-button {
		padding: 0.85rem 1.25rem;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--card);
		color: var(--fg);
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.1s ease;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.reset-button:hover {
		background: color-mix(in srgb, var(--accent) 8%, var(--card));
	}
</style>
