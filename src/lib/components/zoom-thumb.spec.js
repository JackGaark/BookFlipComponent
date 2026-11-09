import { describe, it, expect } from 'vitest';
import { detent, thumbShape, thumbAppearance } from './zoom-thumb.js';

describe('zoom thumb detent', () => {
	it.each([300, 1200])('keeps enter and escape distances stable on a %ipx track', (travel) => {
		/** @param {number} px */
		const units = (px) => (px * 100) / travel;
		expect(detent(50 - units(11), false, travel)).toEqual({ value: 50, snapped: true });
		expect(detent(50 + units(20), true, travel)).toEqual({ value: 50, snapped: true });
		expect(detent(50 - units(20), true, travel)).toEqual({ value: 50, snapped: true });
		expect(detent(50 + units(29), true, travel).snapped).toBe(false);
		expect(detent(50 - units(29), true, travel).snapped).toBe(false);
		expect(detent(50 + units(11), false, travel).value).toBe(50);
	});
	it('does not pull a jump across the centre back to the centre', () => {
		expect(detent(40, false, 1000)).toEqual({ value: 40, snapped: false });
		expect(detent(60, false, 1000)).toEqual({ value: 60, snapped: false });
	});
	it('resetting capture makes the exit band free again', () => {
		expect(detent(52, true, 1000).value).toBe(50);
		expect(detent(52, false, 1000).value).toBe(52);
	});
	it('clamps out-of-range values', () => {
		expect(detent(-10, false, 1000).value).toBe(0);
		expect(detent(110, false, 1000).value).toBe(100);
	});
});

describe('zoom thumb shape', () => {
	it('returns to a circle at any resting position without shifting the zoom', () => {
		for (const position of [0, 13, 25, 41, 50, 67, 75, 89, 100]) {
			expect(thumbAppearance(position, 0)).toMatchObject({
				position, stretch: 0, circleScale: 1, circleOpacity: 1
			});
		}
	});
	it('uses an undistorted circle at every stop and full capsule between stops', () => {
		for (const stop of [0, 50, 100]) {
			expect(thumbAppearance(stop)).toMatchObject({ stretch: 0, circleScale: 1, circleOpacity: 1 });
		}
		for (const middle of [25, 75]) {
			expect(thumbAppearance(middle)).toMatchObject({ stretch: 1, capsuleScale: 1 });
			expect(thumbAppearance(middle).circleOpacity).toBeCloseTo(0);
		}
	});
	it('is bounded, symmetric and grows smoothly away from each stop', () => {
		for (let value = 0; value <= 100; value++) {
			expect(thumbShape(value)).toBeGreaterThanOrEqual(0);
			expect(thumbShape(value)).toBeLessThanOrEqual(1);
			expect(thumbShape(value)).toBeCloseTo(thumbShape(100 - value));
		}
		expect(thumbShape(1)).toBeLessThan(thumbShape(6));
		expect(thumbShape(6)).toBeLessThan(thumbShape(12));
		expect(thumbShape(-1)).toBe(0);
		expect(thumbShape(101)).toBe(0);
	});
});
