/**
 * Audio buffer factory — generates synthetic sounds as AudioBuffers.
 * No audio files needed; everything is procedurally generated.
 */

export function generateSineBurst(
	ctx: AudioContext,
	freq: number,
	duration: number,
	amplitude: number = 0.6
): AudioBuffer {
	const sampleRate = ctx.sampleRate;
	const length = Math.ceil(duration * sampleRate);
	const buffer = ctx.createBuffer(1, length, sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < length; i++) {
		const t = i / sampleRate;
		const envelope = Math.exp(-t * 200); // quick exponential decay
		data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * amplitude;
	}
	return buffer;
}

export function generateHiHatBuffer(
	ctx: AudioContext,
	decay: number,
	amplitude: number,
	release: number = 0.01
): AudioBuffer {
	const sampleRate = ctx.sampleRate;
	const length = Math.ceil((decay + release) * 1.5 * sampleRate);
	const buffer = ctx.createBuffer(1, length, sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < length; i++) {
		const t = i / sampleRate;
		const noise = Math.random() * 2 - 1;
		const env = t <= 0 ? 1 : Math.exp(-t / decay);
		data[i] = noise * env * amplitude;
	}
	return buffer;
}

export interface AudioBuffers {
	accent: AudioBuffer;
	closed: AudioBuffer;
	open: AudioBuffer;
}

export function createAudioBuffers(ctx: AudioContext): AudioBuffers {
	return {
		accent: generateSineBurst(ctx, 150, 0.01, 0.6),
		closed: generateHiHatBuffer(ctx, 0.05, 0.4, 0.01),
		open: generateHiHatBuffer(ctx, 0.2, 0.4, 0.02)
	};
}
