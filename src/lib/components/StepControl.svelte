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

	function handleInput(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		const parsed = parseInt(target.value);
		if (!isNaN(parsed)) {
			onChange(parsed);
		}
	}

	function handleBlur(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		const parsed = parseInt(target.value);
		if (isNaN(parsed) || parsed < min) {
			target.value = String(min);
			onChange(min);
		} else if (parsed > max) {
			target.value = String(max);
			onChange(max);
		}
	}
</script>

<div class="step-control">
	<label for={label}>{label}</label>
	<div class="control-row">
		<button
			onclick={() => onChange(Math.max(min, value - 1))}
			disabled={value <= min}
			aria-label="Decrease {label}"
		>◀</button>
		<input
			id={label}
			class="value-input"
			type="number"
			{min}
			{max}
			value={value}
			oninput={handleInput}
			onblur={handleBlur}
			aria-label={label}
		/>
		<button
			onclick={() => onChange(Math.min(max, value + 1))}
			disabled={value >= max}
			aria-label="Increase {label}"
		>▶</button>
	</div>
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
		flex-shrink: 0;
	}

	.control-row button:hover:not(:disabled) {
		background: color-mix(in srgb, var(--accent) 10%, var(--card));
	}

	.control-row button:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.value-input {
		flex: 1;
		width: 100%;
		text-align: center;
		font-size: 1.25rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--fg);
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.25rem 0.5rem;
		-moz-appearance: textfield;
		appearance: textfield;
	}

	.value-input::-webkit-outer-spin-button,
	.value-input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.value-input:focus {
		outline: none;
		border-color: var(--accent);
	}
</style>
