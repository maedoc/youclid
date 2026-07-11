<script lang="ts">
	import { metronome } from '../stores/metronome.svelte';

	interface Props {
		label: string;
		value: number;
		min: number;
		max: number;
		onChange: (v: number) => void;
	}

	let { label, value, min, max, onChange }: Props = $props();
</script>

<div class="step-control">
	<label for={label}>{label}</label>
	<div class="control-row">
		<button
			onclick={() => onChange(Math.max(min, value - 1))}
			disabled={value <= min}
			aria-label="Decrease {label}"
		>◀</button>
		<span class="value" aria-live="polite">{value}</span>
		<button
			onclick={() => onChange(Math.min(max, value + 1))}
			disabled={value >= max}
			aria-label="Increase {label}"
		>▶</button>
	</div>
	<input
		id={label}
		type="range"
		{min}
		{max}
		{value}
		oninput={(e) => onChange(parseInt(e.currentTarget.value))}
		aria-label={label}
	/>
</div>

<style>
	.step-control {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.step-control label {
		font-size: 0.8rem;
		letter-spacing: 0.05em;
		color: var(--muted);
		text-transform: uppercase;
	}

	.control-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.control-row button {
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--border);
		border-radius: 6px;
		background: var(--card);
		color: var(--fg);
		font-size: 0.7rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.1s ease;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.control-row button:hover:not(:disabled) {
		background: color-mix(in srgb, var(--accent) 10%, var(--card));
	}

	.control-row button:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.value {
		flex: 1;
		text-align: center;
		font-size: 1.25rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--fg);
	}

	input[type='range'] {
		width: 100%;
		accent-color: var(--accent);
		height: 1.5rem;
	}
</style>
