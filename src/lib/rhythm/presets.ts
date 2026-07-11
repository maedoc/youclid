export interface RhythmPreset {
	name: string;
	steps: number;
	pulses: number;
	rotation: number;
}

export const presets: RhythmPreset[] = [
	{ name: 'Son Clave', steps: 8, pulses: 3, rotation: 0 },
	{ name: 'Rumba Clave', steps: 8, pulses: 3, rotation: 4 },
	{ name: 'Bossa Nova', steps: 16, pulses: 5, rotation: 0 },
	{ name: 'Afrobeat 7/16', steps: 16, pulses: 7, rotation: 0 },
	{ name: 'Tresillo', steps: 8, pulses: 3, rotation: 0 },
	{ name: '4-on-the-floor', steps: 4, pulses: 4, rotation: 0 }
];

/**
 * Find a preset matching the given parameters, or null if no match.
 */
export function findPreset(
	steps: number,
	pulses: number,
	rotation: number
): RhythmPreset | null {
	return (
		presets.find(
			(p) => p.steps === steps && p.pulses === pulses && p.rotation === rotation
		) ?? null
	);
}
