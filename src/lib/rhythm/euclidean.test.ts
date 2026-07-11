import { describe, it, expect } from 'vitest';
import { bjorklund, rotate, euclideanPattern } from './euclidean';

describe('bjorklund', () => {
	it('returns empty array for 0 steps', () => {
		expect(bjorklund(3, 0)).toEqual([]);
	});

	it('returns all false for 0 pulses', () => {
		expect(bjorklund(0, 8)).toEqual([false, false, false, false, false, false, false, false]);
	});

	it('returns all true when pulses === steps', () => {
		expect(bjorklund(4, 4)).toEqual([true, true, true, true]);
	});

	it('returns all true when pulses > steps', () => {
		expect(bjorklund(5, 4)).toEqual([true, true, true, true]);
	});

	it('E(3,8) yields [1,0,0,1,0,0,1,0] (acceptance criterion #1)', () => {
		expect(bjorklund(3, 8)).toEqual([true, false, false, true, false, false, true, false]);
	});

	it('E(2,5) yields [1,0,1,0,0]', () => {
		expect(bjorklund(2, 5)).toEqual([true, false, true, false, false]);
	});

	it('E(5,16) has correct length and pulse count', () => {
		const result = bjorklund(5, 16);
		expect(result).toHaveLength(16);
		expect(result.filter(Boolean)).toHaveLength(5);
	});

	it('E(5,16) is maximally even (gaps differ by at most 1)', () => {
		const result = bjorklund(5, 16);
		const indices = result.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
		const gaps: number[] = [];
		for (let i = 0; i < indices.length; i++) {
			const next = indices[(i + 1) % indices.length];
			const gap = next > indices[i] ? next - indices[i] : next + result.length - indices[i];
			gaps.push(gap);
		}
		expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThanOrEqual(1);
	});

	it('E(7,16) has correct length and pulse count', () => {
		const result = bjorklund(7, 16);
		expect(result).toHaveLength(16);
		expect(result.filter(Boolean)).toHaveLength(7);
	});

	it('E(7,16) is maximally even', () => {
		const result = bjorklund(7, 16);
		const indices = result.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
		const gaps: number[] = [];
		for (let i = 0; i < indices.length; i++) {
			const next = indices[(i + 1) % indices.length];
			const gap = next > indices[i] ? next - indices[i] : next + result.length - indices[i];
			gaps.push(gap);
		}
		expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThanOrEqual(1);
	});

	it('E(4,4) yields [1,1,1,1]', () => {
		expect(bjorklund(4, 4)).toEqual([true, true, true, true]);
	});

	it('E(3,7) distributes pulses as evenly as possible', () => {
		const pattern = bjorklund(3, 7);
		const indices = pattern.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
		const gaps: number[] = [];
		for (let i = 0; i < indices.length; i++) {
			const next = indices[(i + 1) % indices.length];
			const gap = next > indices[i] ? next - indices[i] : next + pattern.length - indices[i];
			gaps.push(gap);
		}
		const maxGap = Math.max(...gaps);
		const minGap = Math.min(...gaps);
		expect(maxGap - minGap).toBeLessThanOrEqual(1);
	});
});

describe('rotate', () => {
	it('rotates a pattern to the left by 1', () => {
		expect(rotate([true, false, false, true], 1)).toEqual([false, false, true, true]);
	});

	it('rotation by 0 returns the same pattern', () => {
		const p = [true, false, true, false];
		expect(rotate(p, 0)).toEqual(p);
	});

	it('rotation by length returns the same pattern', () => {
		const p = [true, false, true, false];
		expect(rotate(p, 4)).toEqual(p);
	});

	it('handles empty array', () => {
		expect(rotate([], 3)).toEqual([]);
	});

	it('handles negative rotation (rotates right)', () => {
		// rotate([true, false, false], -1) should rotate right by 1
		// = [false, true, false]
		expect(rotate([true, false, false], -1)).toEqual([false, true, false]);
	});
});

describe('euclideanPattern', () => {
	it('combines bjorklund + rotation', () => {
		const base = bjorklund(3, 8);
		const rotated = euclideanPattern(3, 8, 2);
		expect(rotated).toEqual(rotate(base, 2));
	});

	it('rotated pattern still has the same number of pulses', () => {
		const pattern = euclideanPattern(5, 16, 3);
		expect(pattern).toHaveLength(16);
		expect(pattern.filter(Boolean)).toHaveLength(5);
	});
});
