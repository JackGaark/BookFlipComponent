import { expect, it } from 'vitest';
import { wordmarkFrame } from './wordmark-cursor.js';

it('matches the opening fan, half-turn wipe and closing stem from the storyboard', () => {
	expect(wordmarkFrame(0)).toEqual({ angles: [180, 180, 180, 180, 180], mask: 'none' });
	for (const [phase, expected] of [
		[1 / 12, [225, 180, 180, 180, 180]],
		[1 / 6, [270, 225, 180, 180, 180]],
		[1 / 4, [315, 270, 225, 180, 180]],
		[1 / 3, [360, 315, 270, 225, 180]],
		[1 / 2, [450, 405, 360, 315, 270]],
		[2 / 3, [540, 495, 450, 405, 360]],
		[11 / 12, [540, 540, 540, 540, 495]]
	]) {
		wordmarkFrame(phase).angles.forEach((angle, index) => expect(angle).toBeCloseTo(expected[index]));
	}
	expect(wordmarkFrame(1).mask).toBe('none');
});

it('never erases the entire wordmark and reverses continuously across the loop', () => {
	for (let frame = 0; frame < 120; frame++) {
		const { angles } = wordmarkFrame(frame / 120);
		expect(angles[0] - angles[4]).toBeLessThanOrEqual(180.00001);
	}
	expect(wordmarkFrame(-0.25)).toEqual(wordmarkFrame(0.75));
});
