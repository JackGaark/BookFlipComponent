export const CIRCLE = 15;
export const CAPSULE = 29;
export const SNAP_ENTER_PX = 20;
export const SNAP_EXIT_PX = 48;
export const THUMB_SPRING = { stiffness: 0.25, damping: 0.9, precision: 0.001 };

/** @param {number} value */
export const clampZoom = (value) => Math.max(0, Math.min(100, value));

/**
 * Hold the three stops until the pointer deliberately leaves their capture band.
 * @param {number} raw
 * @param {number | null} snapped
 * @param {number} travelWidth
 * @returns {{ value: number, snapped: number | null }}
 */
export function detent(raw, snapped, travelWidth) {
	const value = clampZoom(raw);
	const width = Math.max(1, travelWidth);
	const distance = (stop) => Math.abs(value - stop) * width / 100;
	const enter = Math.min(SNAP_ENTER_PX, width * 0.08);
	const exit = Math.min(SNAP_EXIT_PX, width * 0.18);
	if (snapped !== null && distance(snapped) <= exit) {
		return { value: snapped, snapped };
	}
	const stop = [0, 50, 100].find((stop) => distance(stop) <= enter);
	return stop === undefined ? { value, snapped: null } : { value: stop, snapped: stop };
}

/** @param {number} value */
export function thumbShape(value) {
	const v = clampZoom(value);
	const distance = Math.min(v, Math.abs(v - 50), 100 - v);
	const t = Math.min(distance / 12, 1);
	return t * t * (3 - 2 * t);
}

/** @param {number} value @param {number} movement */
export function thumbAppearance(value, movement = 1) {
	const position = clampZoom(value);
	const stretch = thumbShape(position) * Math.max(0, Math.min(1, movement));
	return {
		position,
		stretch,
		circleScale: 1 + (CAPSULE / CIRCLE - 1) * stretch,
		capsuleScale: CIRCLE / CAPSULE + (1 - CIRCLE / CAPSULE) * stretch,
		circleOpacity: 1 - Math.max(0, (stretch - 0.9) / 0.1)
	};
}
