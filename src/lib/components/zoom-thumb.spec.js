import { describe, it, expect } from 'vitest';
import { detent, thumbShape, thumbAppearance } from './zoom-thumb.js';

describe('zoom thumb detent', () => {
	it.each([300, 1200])('captures and holds all three stops on a %ipx track', (travel) => {
		const units = (px) => px * 100 / travel;
		for (const stop of [0, 50, 100]) {
			for (const direction of stop === 0 ? [1] : stop === 100 ? [-1] : [-1, 1]) {
				expect(detent(stop + direction * units(19), null, travel)).toEqual({ value: stop, snapped: stop });
				expect(detent(stop + direction * units(47), stop, travel)).toEqual({ value: stop, snapped: stop });
				const free = stop + direction * units(49);
				expect(detent(free, stop, travel)).toEqual({ value: free, snapped: null });
			}
		}
	});
	it('tracks the pointer exactly between the three magnetic zones', () => {
		for (const value of [10, 25, 40, 60, 75, 90]) {
			expect(detent(value, null, 1000)).toEqual({ value, snapped: null });
		}
	});
	it('releases a captured point without pulling a large jump back', () => {
		expect(detent(75, 50, 1000)).toEqual({ value: 75, snapped: null });
		expect(detent(99, 50, 1000)).toEqual({ value: 100, snapped: 100 });
	});
	it('keeps free space between stops on short tracks', () => {
		expect(detent(25, 0, 100)).toEqual({ value: 25, snapped: null });
		expect(detent(75, 50, 100)).toEqual({ value: 75, snapped: null });
	});
	it('clamps out-of-range values to the end stops', () => {
		expect(detent(-10, null, 1000)).toEqual({ value: 0, snapped: 0 });
		expect(detent(110, null, 1000)).toEqual({ value: 100, snapped: 100 });
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
