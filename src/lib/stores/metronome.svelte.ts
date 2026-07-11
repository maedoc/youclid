import { browser } from '$app/environment';
import { AudioEngine } from '../audio/AudioEngine';
import { presets, findPreset } from '../rhythm/presets';

export type HiHatVariant = 'closed' | 'open';

class MetronomeState {
	bpm = $state(120);
	steps = $state(8);
	pulses = $state(3);
	rotation = $state(0);
	hiHatVariant = $state<HiHatVariant>('closed');
	isPlaying = $state(false);
	currentStep = $state(0);
	currentPresetName = $state('Son Clave');
	initialized = $state(false);

	private engine = new AudioEngine();
	private tapTimestamps: number[] = [];

	init() {
		if (this.initialized) return;
		this.engine.setParams({
			bpm: this.bpm,
			steps: this.steps,
			pulses: this.pulses,
			rotation: this.rotation,
			hiHatVariant: this.hiHatVariant
		});
		this.engine.setOnBeat((beat) => {
			this.currentStep = beat % this.steps;
			if (browser && 'vibrate' in navigator) {
				navigator.vibrate(10);
			}
		});
		this.initialized = true;
	}

	async ensureAudio() {
		if (!this.initialized) {
			this.init();
		}
		await this.engine.init();
	}

	async togglePlay() {
		await this.ensureAudio();

		if (this.isPlaying) {
			this.engine.stop();
			this.isPlaying = false;
		} else {
			this.engine.setParams({
				bpm: this.bpm,
				steps: this.steps,
				pulses: this.pulses,
				rotation: this.rotation,
				hiHatVariant: this.hiHatVariant
			});
			this.engine.start();
			this.isPlaying = true;
		}
	}

	setBpm(value: number) {
		this.bpm = Math.max(20, Math.min(300, Math.round(value)));
		this.engine.setParams({ bpm: this.bpm });
		this.updatePresetName();
	}

	setSteps(value: number) {
		this.steps = Math.max(2, Math.min(16, Math.round(value)));
		if (this.pulses > this.steps) this.pulses = this.steps;
		if (this.rotation >= this.steps) this.rotation = this.steps - 1;
		this.engine.setParams({
			steps: this.steps,
			pulses: this.pulses,
			rotation: this.rotation
		});
		this.updatePresetName();
	}

	setPulses(value: number) {
		this.pulses = Math.max(0, Math.min(this.steps, Math.round(value)));
		this.engine.setParams({ pulses: this.pulses });
		this.updatePresetName();
	}

	setRotation(value: number) {
		this.rotation = Math.max(0, Math.min(this.steps - 1, Math.round(value)));
		this.engine.setParams({ rotation: this.rotation });
		this.updatePresetName();
	}

	setHiHatVariant(variant: HiHatVariant) {
		this.hiHatVariant = variant;
		this.engine.setParams({ hiHatVariant: variant });
	}

	applyPreset(presetName: string) {
		const preset = presets.find((p) => p.name === presetName);
		if (!preset) return;

		this.steps = preset.steps;
		this.pulses = preset.pulses;
		this.rotation = preset.rotation;
		this.currentPresetName = preset.name;

		this.engine.setParams({
			steps: this.steps,
			pulses: this.pulses,
			rotation: this.rotation
		});
	}

	reset() {
		this.bpm = 120;
		this.steps = 8;
		this.pulses = 3;
		this.rotation = 0;
		this.hiHatVariant = 'closed';
		this.engine.setParams({
			bpm: this.bpm,
			steps: this.steps,
			pulses: this.pulses,
			rotation: this.rotation,
			hiHatVariant: this.hiHatVariant
		});
		this.updatePresetName();
	}

	tapTempo() {
		const now = performance.now();
		this.tapTimestamps.push(now);

		// Keep only last 8 taps
		if (this.tapTimestamps.length > 8) {
			this.tapTimestamps.shift();
		}

		// Drop outliers (intervals < 200ms or > 3s)
		if (this.tapTimestamps.length >= 2) {
			const intervals: number[] = [];
			for (let i = 1; i < this.tapTimestamps.length; i++) {
				const interval = this.tapTimestamps[i] - this.tapTimestamps[i - 1];
				if (interval >= 200 && interval <= 3000) {
					intervals.push(interval);
				}
			}
			if (intervals.length >= 1) {
				const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
				const bpm = Math.round(60000 / avg);
				this.setBpm(bpm);
			}
		}

		if (browser && 'vibrate' in navigator) {
			navigator.vibrate(10);
		}
	}

	private updatePresetName() {
		const match = findPreset(this.steps, this.pulses, this.rotation);
		this.currentPresetName = match ? match.name : 'Custom';
	}

	handleVisibilityChange() {
		if (!browser) return;
		if (document.hidden && this.isPlaying) {
			this.engine.stop();
			this.isPlaying = false;
		}
	}
}

export const metronome = new MetronomeState();
