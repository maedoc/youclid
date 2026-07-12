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
		<div class="note-value-control">
			<span class="label">Note Value</span>
			<div class="segmented" role="radiogroup" aria-label="Note value per step">
				<button
					class:active={metronome.noteValue === 'quarter'}
					onclick={() => metronome.setNoteValue('quarter')}
					role="radio"
					aria-checked={metronome.noteValue === 'quarter'}
				>¼</button>
				<button
					class:active={metronome.noteValue === 'eighth'}
					onclick={() => metronome.setNoteValue('eighth')}
					role="radio"
					aria-checked={metronome.noteValue === 'eighth'}
				>⅛</button>
				<button
					class:active={metronome.noteValue === 'sixteenth'}
					onclick={() => metronome.setNoteValue('sixteenth')}
					role="radio"
					aria-checked={metronome.noteValue === 'sixteenth'}
				>1/16</button>
			</div>
		</div>
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

	.note-value-control {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.note-value-control .label {
		font-size: 0.8rem;
		letter-spacing: 0.05em;
		color: var(--muted);
		text-transform: uppercase;
	}

	.segmented {
		display: flex;
		border: 1px solid var(--border);
		border-radius: 8px;
		overflow: hidden;
	}

	.segmented button {
		flex: 1;
		padding: 0.6rem;
		border: none;
		background: var(--card);
		color: var(--muted);
		font-size: 0.95rem;
		cursor: pointer;
		transition: background 0.1s ease, color 0.1s ease;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.segmented button.active {
		background: var(--accent);
		color: var(--bg);
		font-weight: 600;
	}

	@media (min-width: 641px) {
		.card {
			box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		}
	}
</style>
