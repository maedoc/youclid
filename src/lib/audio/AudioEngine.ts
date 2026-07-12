import { createAudioBuffers, type AudioBuffers } from './buffers';
import { euclideanPattern } from '../rhythm/euclidean';

/**
 * Lookahead scheduler using the "A Tale of Two Clocks" pattern.
 * A setInterval (25ms) looks ahead and schedules AudioBufferSourceNodes
 * at precise AudioContext.currentTime offsets for drift-free timing.
 */

const LOOKAHEAD_MS = 25; // setInterval interval
const SCHEDULE_AHEAD_S = 0.1; // schedule 100ms ahead

export type NoteValue = 'quarter' | 'eighth' | 'sixteenth';

const NOTE_DIVISION: Record<NoteValue, number> = {
	quarter: 1,
	eighth: 2,
	sixteenth: 4
};

export class AudioEngine {
	private ctx: AudioContext | null = null;
	private buffers: AudioBuffers | null = null;
	private gainNode: GainNode | null = null;

	private nextNoteTime = 0;
	private currentBeat = 0;
	private timerId: ReturnType<typeof setInterval> | null = null;

	private bpm = 120;
	private steps = 8;
	private pulses = 3;
	private rotation = 0;
	private noteValue: NoteValue = 'eighth';
	private pattern: boolean[] = [];

	private onBeatCallback: ((beat: number) => void) | null = null;

	/** Must be called from a user gesture to satisfy autoplay policy */
	async init(): Promise<void> {
		if (this.ctx) {
			if (this.ctx.state === 'suspended') {
				await this.ctx.resume();
			}
			return;
		}

		const Ctor =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext: typeof AudioContext })
				.webkitAudioContext;
		this.ctx = new Ctor();

		this.buffers = createAudioBuffers(this.ctx);

		this.gainNode = this.ctx.createGain();
		this.gainNode.gain.value = 1.0;
		this.gainNode.connect(this.ctx.destination);
	}

	setParams(params: {
		bpm?: number;
		steps?: number;
		pulses?: number;
		rotation?: number;
		noteValue?: NoteValue;
	}): void {
		if (params.bpm !== undefined) this.bpm = params.bpm;
		if (params.steps !== undefined) this.steps = params.steps;
		if (params.pulses !== undefined) this.pulses = params.pulses;
		if (params.rotation !== undefined) this.rotation = params.rotation;
		if (params.noteValue !== undefined) this.noteValue = params.noteValue;
		this.regeneratePattern();
	}

	private regeneratePattern(): void {
		this.pattern = euclideanPattern(this.pulses, this.steps, this.rotation);
	}

	setOnBeat(cb: (beat: number) => void): void {
		this.onBeatCallback = cb;
	}

	start(): void {
		if (!this.ctx || !this.buffers || !this.gainNode) return;
		if (this.timerId !== null) return;

		this.currentBeat = 0;
		this.nextNoteTime = this.ctx.currentTime + 0.05;
		this.regeneratePattern();

		this.timerId = setInterval(() => this.scheduler(), LOOKAHEAD_MS);
	}

	stop(): void {
		if (this.timerId !== null) {
			clearInterval(this.timerId);
			this.timerId = null;
		}
	}

	get isRunning(): boolean {
		return this.timerId !== null;
	}

	private scheduler(): void {
		if (!this.ctx || !this.buffers || !this.gainNode) return;

		const secondsPerBeat = 60.0 / this.bpm / NOTE_DIVISION[this.noteValue];

		while (this.nextNoteTime < this.ctx.currentTime + SCHEDULE_AHEAD_S) {
			const beatInPattern = this.currentBeat % this.steps;
			const patternIndex = beatInPattern;

			if (this.pattern.length > 0 && this.pattern[patternIndex]) {
				const isAccent = patternIndex === 0;
				const buffer = isAccent
					? this.buffers.accent
					: this.buffers.closed;

				this.scheduleBuffer(buffer, this.nextNoteTime);
			}

			// Schedule UI callback slightly ahead
			const beatNum = this.currentBeat;
			const delayMs = (this.nextNoteTime - this.ctx.currentTime) * 1000;
			const clampedDelay = Math.max(0, delayMs);
			setTimeout(() => {
				if (this.onBeatCallback) this.onBeatCallback(beatNum);
			}, clampedDelay);

			this.nextNoteTime += secondsPerBeat;
			this.currentBeat++;
		}
	}

	private scheduleBuffer(buffer: AudioBuffer, time: number): void {
		if (!this.ctx || !this.gainNode) return;
		const source = this.ctx.createBufferSource();
		source.buffer = buffer;
		source.connect(this.gainNode);
		source.start(time);
		source.stop(time + buffer.duration);
	}

	dispose(): void {
		this.stop();
		if (this.ctx) {
			this.ctx.close();
			this.ctx = null;
		}
	}
}
