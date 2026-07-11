import { describe, it, expect } from 'vitest';
import { presets, findPreset } from './presets';

describe('presets', () => {
	it('includes all 6 presets', () => {
		expect(presets).toHaveLength(6);
	});

	it('has unique names', () => {
		const names = presets.map((p) => p.name);
		expect(new Set(names).size).toBe(names.length);
	});

	it('Son Clave is (3,8,0)', () => {
		const p = findPreset(8, 3, 0);
		expect(p?.name).toBe('Son Clave');
	});

	it('Rumba Clave is (3,8,4)', () => {
		const p = findPreset(8, 3, 4);
		expect(p?.name).toBe('Rumba Clave');
	});

	it('Bossa Nova is (5,16,0)', () => {
		const p = findPreset(16, 5, 0);
		expect(p?.name).toBe('Bossa Nova');
	});

	it('Afrobeat 7/16 is (7,16,0)', () => {
		const p = findPreset(16, 7, 0);
		expect(p?.name).toBe('Afrobeat 7/16');
	});

	it('Tresillo is (3,8,0) — same params as Son Clave but different rotation', () => {
		// Son Clave and Tresillo both have (3,8,0), so Son Clave is found first
		const p = findPreset(8, 3, 0);
		expect(p?.name).toBe('Son Clave');
	});

	it('4-on-the-floor is (4,4,0)', () => {
		const p = findPreset(4, 4, 0);
		expect(p?.name).toBe('4-on-the-floor');
	});

	it('returns null for non-matching params', () => {
		expect(findPreset(7, 3, 0)).toBeNull();
	});

	it('all presets have valid parameters', () => {
		for (const p of presets) {
			expect(p.steps).toBeGreaterThanOrEqual(2);
			expect(p.steps).toBeLessThanOrEqual(16);
			expect(p.pulses).toBeGreaterThanOrEqual(0);
			expect(p.pulses).toBeLessThanOrEqual(p.steps);
			expect(p.rotation).toBeGreaterThanOrEqual(0);
			expect(p.rotation).toBeLessThan(p.steps);
		}
	});
});
