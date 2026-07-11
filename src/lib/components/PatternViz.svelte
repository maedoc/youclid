<script lang="ts">
	import { metronome } from '../stores/metronome.svelte';
	import { euclideanPattern } from '../rhythm/euclidean';

	let pattern = $derived(euclideanPattern(metronome.pulses, metronome.steps, metronome.rotation));
	let activeStep = $derived(metronome.isPlaying ? metronome.currentStep : -1);
</script>

<div class="pattern-viz" role="img" aria-label="Euclidean rhythm pattern visualization">
	{#each pattern as isActive, i (i)}
		<div
			class="cell"
			class:active={isActive}
			class:playing={i === activeStep}
		></div>
	{/each}
</div>

<style>
	.pattern-viz {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		justify-content: center;
		min-height: 24px;
	}

	.cell {
		width: clamp(14px, 4vmin, 22px);
		height: clamp(14px, 4vmin, 22px);
		border-radius: 4px;
		border: 1.5px solid var(--border);
		background: transparent;
		transition: background 0.08s ease, transform 0.08s ease, border-color 0.08s ease;
	}

	.cell.active {
		background: var(--accent);
		border-color: var(--accent);
	}

	.cell.playing {
		transform: scale(1.3);
		border-color: var(--fg);
		box-shadow: 0 0 8px var(--accent);
	}
</style>
