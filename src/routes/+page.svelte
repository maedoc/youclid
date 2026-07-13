<script lang="ts">
	import { onMount } from 'svelte';
	import { metronome } from '$lib/stores/metronome.svelte';
	import TapButton from '$lib/components/TapButton.svelte';
	import BPMDisplay from '$lib/components/BPMDisplay.svelte';
	import StepControl from '$lib/components/StepControl.svelte';
	import PresetPicker from '$lib/components/PresetPicker.svelte';
	import PlayButton from '$lib/components/PlayButton.svelte';
	import PatternViz from '$lib/components/PatternViz.svelte';

	onMount(() => {
		const handleVisibility = () => metronome.handleVisibilityChange();
		document.addEventListener('visibilitychange', handleVisibility);
		return () => document.removeEventListener('visibilitychange', handleVisibility);
	});
</script>

<svelte:head>
	<title>Euclid Metronome</title>
	<meta name="description" content="A minimalist Euclidean rhythm metronome" />
</svelte:head>

<main>
	<div class="card">
		<BPMDisplay />
		<div class="tap-play-row">
			<TapButton />
			<PlayButton />
		</div>
		<PatternViz />
		<div class="controls">
			<StepControl
				label="Steps"
				value={metronome.steps}
				min={2}
				max={64}
				onChange={(v) => metronome.setSteps(v)}
			/>
			<StepControl
				label="Pulses"
				value={metronome.pulses}
				min={0}
				max={metronome.steps}
				onChange={(v) => metronome.setPulses(v)}
			/>
			<StepControl
				label="Rotation"
				value={metronome.rotation}
				min={0}
				max={metronome.steps - 1}
				onChange={(v) => metronome.setRotation(v)}
			/>
		</div>
		<PresetPicker />
	</div>
</main>

<style>
	main {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.card {
		width: 100%;
		max-width: 440px;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: clamp(1.25rem, 4vmin, 2rem);
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 16px;
	}

	.tap-play-row {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 0.25rem 0;
	}

	.tap-play-row > :global(.play-controls) {
		flex: 1;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (min-width: 641px) {
		.card {
			box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		}
	}
</style>
