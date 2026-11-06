export const CIRCLE = 15;
export const CAPSULE = 29;
export const SNAP_ENTER_PX = 12;
export const SNAP_EXIT_PX = 28;
export const THUMB_SPRING = { stiffness: 0.25, damping: 0.9, precision: 0.001 };

/** @param {number} value */
export const clampZoom = (value) => Math.max(0, Math.min(100, value));

/**
 * Pointer-only centre capture. The wider exit band prevents jitter at the edge.
 * @param {number} raw
 * @param {boolean} snapped
 * @param {number} travelWidth
 * @returns {{ value: number, snapped: boolean }}
 */
export function detent(raw, snapped, travelWidth) {
	const value = clampZoom(raw);
	const distance = (Math.abs(value - 50) * Math.max(1, travelWidth)) / 100;
	const captured = distance <= (snapped ? SNAP_EXIT_PX : SNAP_ENTER_PX);
	return { value: captured ? 50 : value, snapped: captured };
}

/** @param {number} value */
export function thumbShape(value) {
	const v = clampZoom(value);
	const distance = Math.min(v, Math.abs(v - 50), 100 - v);
	const t = Math.min(distance / 12, 1);
	return t * t * (3 - 2 * t);
}

/** @param {number} value */
export function thumbAppearance(value) {
	const position = clampZoom(value);
	const stretch = thumbShape(position);
	return {
		position,
		stretch,
		circleScale: 1 + (CAPSULE / CIRCLE - 1) * stretch,
		capsuleScale: CIRCLE / CAPSULE + (1 - CIRCLE / CAPSULE) * stretch,
		circleOpacity: 1 - Math.max(0, (stretch - 0.9) / 0.1)
	};
}
