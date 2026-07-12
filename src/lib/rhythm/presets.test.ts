import { describe, it, expect } from 'vitest';
import { presets, findPreset } from './presets';

describe('presets', () => {
	it('includes at least 20 presets', () => {
		expect(presets.length).toBeGreaterThanOrEqual(20);
	});

	it('has unique names', () => {
		const names = presets.map((p) => p.name);
		expect(new Set(names).size).toBe(names.length);
	});

	it('Tresillo is (3,8,0)', () => {
		const p = findPreset(8, 3, 0);
		expect(p?.name).toBe('Tresillo');
	});

	it('Cinquillo is (5,8,0)', () => {
		const p = findPreset(8, 5, 0);
		expect(p?.name).toBe('Cinquillo');
	});

	it('Bossa Nova is (5,16,0)', () => {
		const p = findPreset(16, 5, 0);
		expect(p?.name).toBe('Bossa Nova');
	});

	it('Son Clave 3-2 is (5,16,6)', () => {
		const p = findPreset(16, 5, 6);
		expect(p?.name).toBe('Son Clave 3-2');
	});

	it('Take Five is (2,5,2)', () => {
		const p = findPreset(5, 2, 2);
		expect(p?.name).toBe('Take Five');
	});

	it('Gahu Bell is (7,12,0)', () => {
		const p = findPreset(12, 7, 0);
		expect(p?.name).toBe('Gahu Bell');
	});

	it('Aksak is (4,9,0)', () => {
		const p = findPreset(9, 4, 0);
		expect(p?.name).toBe('Aksak');
	});

	it('4-on-the-floor is (4,4,0)', () => {
		const p = findPreset(4, 4, 0);
		expect(p?.name).toBe('4-on-the-floor');
	});

	it('returns null for non-matching params', () => {
		expect(findPreset(13, 5, 0)).toBeNull();
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
