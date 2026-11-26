export const NEEDLE_COUNT = 6;
/** The last needle starts NEEDLE_COUNT - 1 stops late and needs twelve stops to close. */
export const DIAL_LOOP_STOPS = 12 + NEEDLE_COUNT - 1;
export const ARTBOARD_SIZE = 132.9024;
/** Renders the S at 20px, the same letter height as the long Super Bonjour logo. */
export const CURSOR_SCALE = 20 / 71.8391;

/** NEEDLE_COUNT needles follow one another at twelve stops per revolution.
 * @param {number} position
 */
export function wordmarkFrame(position) {
	const progress = ((position % DIAL_LOOP_STOPS) + DIAL_LOOP_STOPS) % DIAL_LOOP_STOPS;
	const angles = Array.from({ length: NEEDLE_COUNT }, (_, index) => {
		const turn = Math.max(0, Math.min(1, (progress - index) / 12));
		return 180 + turn * 360;
	});
	const last = angles[NEEDLE_COUNT - 1];
	const sweep = angles[0] - last;
	const mask =
		sweep < 0.001
			? 'none'
			: `conic-gradient(from ${last}deg, transparent 0deg ${sweep}deg, #000 ${sweep}deg 360deg)`;
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
