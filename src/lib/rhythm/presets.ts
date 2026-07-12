export interface RhythmPreset {
	name: string;
	steps: number;
	pulses: number;
	rotation: number;
}

/**
 * Curated library of Euclidean rhythms found in world music traditions.
 * Sources: Toussaint (2005) "The Euclidean Algorithm Generates Traditional
 * Musical Rhythms", Demaine et al. "Deep Rhythms".
 *
 * Rotations follow the convention: rotate left so the named pattern
 * starts at position 0. Where the source says "started on the Nth
 * onset", rotation = position of that onset in the base E(k,n) pattern.
 */
export const presets: RhythmPreset[] = [
	// 3 steps
	{ name: 'Afro-Cuban 2/3', steps: 3, pulses: 2, rotation: 0 },

	// 4 steps
	{ name: '4-on-the-floor', steps: 4, pulses: 4, rotation: 0 },
	{ name: 'Baiao', steps: 4, pulses: 3, rotation: 0 },
	{ name: 'Cumbia', steps: 4, pulses: 3, rotation: 2 },

	// 5 steps
	{ name: 'Khafif-e-ramal', steps: 5, pulses: 2, rotation: 0 },
	{ name: 'Take Five', steps: 5, pulses: 2, rotation: 2 },

	// 6 steps
	{ name: 'York-Samai', steps: 6, pulses: 5, rotation: 1 },

	// 7 steps
	{ name: 'Ruchenitza', steps: 7, pulses: 3, rotation: 0 },
	{ name: 'Ruchenitza 4', steps: 7, pulses: 4, rotation: 0 },
	{ name: 'Nawakhat', steps: 7, pulses: 5, rotation: 0 },

	// 8 steps
	{ name: 'Tresillo', steps: 8, pulses: 3, rotation: 0 },
	{ name: 'Cinquillo', steps: 8, pulses: 5, rotation: 0 },
	{ name: 'Bendir', steps: 8, pulses: 7, rotation: 0 },

	// 9 steps
	{ name: 'Aksak', steps: 9, pulses: 4, rotation: 0 },
	{ name: 'Agsag-Samai', steps: 9, pulses: 5, rotation: 0 },

	// 11 steps
	{ name: 'Dhruva Tala', steps: 11, pulses: 4, rotation: 0 },
	{ name: 'Savari Tal', steps: 11, pulses: 3, rotation: 0 },
	{ name: 'Pictures', steps: 11, pulses: 5, rotation: 0 },

	// 12 steps
	{ name: 'Fandango', steps: 12, pulses: 4, rotation: 0 },
	{ name: 'Aka Pygmy', steps: 12, pulses: 5, rotation: 0 },
	{ name: 'Gahu Bell', steps: 12, pulses: 7, rotation: 0 },

	// 14 steps
	{ name: 'Dhamar Tal', steps: 14, pulses: 3, rotation: 0 },

	// 16 steps
	{ name: 'Bossa Nova', steps: 16, pulses: 5, rotation: 0 },
	{ name: 'Son Clave 3-2', steps: 16, pulses: 5, rotation: 6 },
	{ name: 'Samba', steps: 16, pulses: 7, rotation: 0 },
	{ name: 'Ngbaka', steps: 16, pulses: 9, rotation: 0 }
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
