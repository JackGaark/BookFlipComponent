export const DIAL_LOOP_STOPS = 16;
export const ARTBOARD_SIZE = 132.9024;
export const CURSOR_SCALE = 0.5;

/** Five needles follow one another at twelve stops per revolution.
 * @param {number} position
 */
export function wordmarkFrame(position) {
	const progress = ((position % DIAL_LOOP_STOPS) + DIAL_LOOP_STOPS) % DIAL_LOOP_STOPS;
	const angles = Array.from({ length: 5 }, (_, index) => {
		const turn = Math.max(0, Math.min(1, (progress - index) / 12));
		return 180 + turn * 360;
	});
	const sweep = angles[0] - angles[4];
	const mask =
		sweep < 0.001
			? 'none'
			: `conic-gradient(from ${angles[4]}deg, transparent 0deg ${sweep}deg, #000 ${sweep}deg 360deg)`;
	return { angles, mask };
}

/** @param {number} position @param {number} direction */
export function dialBeat(position, direction) {
	const fraction = ((position % 1) + 1) % 1;
	return direction > 0 || fraction === 0 ? fraction : 1 - fraction;
}

/** Advance the shared clock; retain sub-frame time after painting the exact cut stop.
 * @param {number} position @param {number} beat @param {number} travel @param {number} direction
 */
export function stepDial(position, beat, travel, direction) {
	const total = beat + travel;
	const cuts = Math.floor(total);
	const remainder = total - cuts;
	const next = position + direction * travel;
	const stop = Math.round(next - direction * remainder);
	return {
		position: cuts ? stop + direction * remainder : next,
		paint: cuts ? stop : next,
		beat: remainder,
		cuts
	};
}
