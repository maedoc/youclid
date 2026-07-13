<script lang="ts">
	import { metronome } from '../stores/metronome.svelte';

	let editing = $state(false);
	let inputValue = $state('');

	// Drag-to-adjust state
	let dragging = $state(false);
	let dragStartY = 0;
	let dragStartBpm = 0;
	let dragAccum = 0;

	function decrement() {
		metronome.setBpm(metronome.bpm - 1);
	}

	function increment() {
		metronome.setBpm(metronome.bpm + 1);
	}

	function startEdit() {
		inputValue = String(metronome.bpm);
		editing = true;
	}

	function commitEdit() {
		editing = false;
		const parsed = parseInt(inputValue);
		if (!isNaN(parsed)) {
			metronome.setBpm(parsed);
		}
	}

	function onInputKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			commitEdit();
		} else if (e.key === 'Escape') {
			editing = false;
		}
	}

	function onPointerDown(e: PointerEvent) {
		if (editing) return;
		dragging = true;
		dragStartY = e.clientY;
		dragStartBpm = metronome.bpm;
		dragAccum = 0;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		const delta = dragStartY - e.clientY;
		// Exponential scaling: drag further = faster adjustment
		// Each pixel = 1 BPM for first 50px, then accelerates
		dragAccum += delta;
		const absAccum = Math.abs(dragAccum);
		let adjustment: number;
		if (absAccum <= 50) {
			adjustment = dragAccum;
		} else {
			const extra = absAccum - 50;
			const sign = Math.sign(dragAccum);
			adjustment = sign * (50 + extra * (1 + extra / 100));
		}
		metronome.setBpm(Math.round(dragStartBpm + adjustment));
		// Reset accumulator so we track incremental movement
		dragAccum = 0;
		dragStartBpm = metronome.bpm;
	}

	function onPointerUp(e: PointerEvent) {
		dragging = false;
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
	}
</script>

<div class="bpm-display">
	{#if editing}
		<input
			class="bpm-input"
			type="number"
			min="20"
			max="300"
			bind:value={inputValue}
			onblur={commitEdit}
			onkeydown={onInputKeydown}
			aria-label="BPM"
		/>
	{:else}
		<div
			class="bpm-value"
			class:dragging
			role="slider"
			aria-label="Tempo in BPM, drag to adjust, click to type"
			aria-valuenow={metronome.bpm}
			aria-valuemin={20}
			aria-valuemax={300}
			tabindex="0"
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			ondblclick={startEdit}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') startEdit();
				if (e.key === 'ArrowUp') increment();
				if (e.key === 'ArrowDown') decrement();
			}}
		>{metronome.bpm}</div>
	{/if}
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
		cursor: ns-resize;
		user-select: none;
		-webkit-user-select: none;
		touch-action: none;
	}

	.bpm-value.dragging {
		color: var(--accent);
	}

	.bpm-input {
		font-size: clamp(2.5rem, 10vmin, 4.5rem);
		font-weight: 200;
		font-variant-numeric: tabular-nums;
		line-height: 1;
		color: var(--fg);
		background: var(--bg);
		border: 1px solid var(--accent);
		border-radius: 8px;
		text-align: center;
		width: 4ch;
		-moz-appearance: textfield;
		appearance: textfield;
	}

	.bpm-input::-webkit-outer-spin-button,
	.bpm-input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.bpm-input:focus {
		outline: none;
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
