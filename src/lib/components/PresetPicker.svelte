<script lang="ts">
	import { metronome } from '../stores/metronome.svelte';
	import { presets } from '../rhythm/presets';

	function handleChange(e: Event) {
		const target = e.currentTarget as HTMLSelectElement;
		if (target.value !== 'Custom') {
			metronome.applyPreset(target.value);
		}
	}
</script>

<div class="preset-picker">
	<label for="preset-select">Preset</label>
	<select
		id="preset-select"
		value={metronome.currentPresetName}
		onchange={handleChange}
		aria-label="Rhythm preset"
	>
		<option value="Custom" disabled={metronome.currentPresetName !== 'Custom'}>
			Custom
		</option>
		{#each presets as preset (preset.name)}
			<option value={preset.name}>{preset.name}</option>
		{/each}
	</select>
</div>

<style>
	.preset-picker {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.preset-picker label {
		font-size: 0.8rem;
		letter-spacing: 0.05em;
		color: var(--muted);
		text-transform: uppercase;
	}

	select {
		width: 100%;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		background: var(--card);
		color: var(--fg);
		font-size: 1rem;
		cursor: pointer;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23888' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		padding-right: 2rem;
	}
</style>
