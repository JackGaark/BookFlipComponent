export const CURSOR_CYCLE_MS = 1320;
export const ARTBOARD_SIZE = 132.9024;
export const CURSOR_SCALE = 0.5;

/** The storyboard advances each page by 45° before the next page follows.
 * @param {number} phase
 */
export function wordmarkFrame(phase) {
	const progress = ((phase % 1) + 1) % 1;
	const angles = Array.from({ length: 5 }, (_, index) => {
		const turn = Math.max(0, Math.min(1, (progress - index / 12) * 1.5));
		return 180 + turn * 360;
	});
	const sweep = angles[0] - angles[4];
	const mask = sweep < 0.001
		? 'none'
		: `conic-gradient(from ${angles[4]}deg, transparent 0deg ${sweep}deg, #000 ${sweep}deg 360deg)`;
	return { angles, mask };
}
