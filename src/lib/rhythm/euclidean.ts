/**
 * Bjorklund algorithm: distributes `pulses` as evenly as possible
 * across `steps` positions. Returns a boolean[] where true = pulse.
 *
 * Reference: Toussaint, "The Euclidean Algorithm Generates Traditional Rhythms" (2005)
 *
 * Uses the two-array (groups) approach: start with `pulses` groups of [1]
 * and `steps - pulses` groups of [0], then distribute zeros among ones
 * until only one remainder group is left.
 */
export function bjorklund(pulses: number, steps: number): boolean[] {
	if (steps <= 0) return [];
	if (pulses <= 0) return new Array(steps).fill(false);
	if (pulses >= steps) return new Array(steps).fill(true);

	let ones: number[][] = [];
	let zeros: number[][] = [];

	for (let i = 0; i < pulses; i++) ones.push([1]);
	for (let i = 0; i < steps - pulses; i++) zeros.push([0]);

	while (zeros.length > 1) {
		const numToMerge = Math.min(ones.length, zeros.length);
		for (let i = 0; i < numToMerge; i++) {
			ones[i] = ones[i].concat(zeros.shift()!);
		}
		// Any remaining ones groups become the new zero groups
		if (ones.length > numToMerge) {
			const remaining = ones.splice(numToMerge);
			zeros = zeros.concat(remaining);
		}
	}

	let pattern: number[] = ones.flat();
	if (zeros.length > 0) {
		pattern = pattern.concat(zeros[0]);
	}

	return pattern.slice(0, steps).map((v) => v === 1);
}

/**
 * Rotate a pattern to the left by `rotation` positions.
 * (Follows the spec: rotated = base[rotation...] + base[..<rotation])
 */
export function rotate(pattern: boolean[], rotation: number): boolean[] {
	if (pattern.length === 0) return [];
	const r = ((rotation % pattern.length) + pattern.length) % pattern.length;
	return [...pattern.slice(r), ...pattern.slice(0, r)];
}

/**
 * Generate a rotated Euclidean pattern.
 */
export function euclideanPattern(
	pulses: number,
	steps: number,
	rotation: number = 0
): boolean[] {
	const base = bjorklund(pulses, steps);
	return rotate(base, rotation);
}
