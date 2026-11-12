import { expect, it } from 'vitest';
import { wordmarkFrame, DIAL_LOOP_STOPS, dialBeat, stepDial } from './wordmark-cursor.js';
it('has twelve angular stops and closes after sixteen travel stops', () => {
	for (let position = 0; position <= DIAL_LOOP_STOPS; position++) {
		const { angles } = wordmarkFrame(position);
		angles.forEach((angle) => expect(angle / 30).toBeCloseTo(Math.round(angle / 30)));
		expect(angles[0] - angles[4]).toBeLessThanOrEqual(120.00001);
	}
	expect(wordmarkFrame(12).angles[0]).toBe(540);
	expect(wordmarkFrame(16)).toEqual(wordmarkFrame(0));
	expect(wordmarkFrame(0).mask).toBe('none');
	expect(wordmarkFrame(-1)).toEqual(wordmarkFrame(15));
});

it('keeps one stop per cut through fractional frames, tempo changes and side switches', () => {
	let position = 0;
	for (const direction of [1, -1, 1, -1]) {
		let beat = dialBeat(position, direction);
		let previousStop = direction > 0 ? Math.floor(position) : Math.ceil(position);
		let count = 0;
		for (let frame = 0; frame < 300; frame++) {
			const next = stepDial(position, beat, 16 / (100 + frame * 3), direction);
			if (next.cuts) {
				count += next.cuts;
				expect(Number.isInteger(next.paint)).toBe(true);
				expect(next.paint).toBe(previousStop + direction * next.cuts);
				previousStop = next.paint;
			}
			position = next.position;
			beat = next.beat;
			expect(dialBeat(position, direction)).toBeCloseTo(beat);
		}
		expect(count).toBeGreaterThan(0);
	}
});
