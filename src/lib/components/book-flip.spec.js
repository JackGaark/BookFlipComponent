import { describe, it, expect } from 'vitest';
import { bookFlip, initialBookFlip, flipAttribute } from './book-flip.js';

const ready = () =>
	bookFlip(initialBookFlip, { type: 'environment', reducedMotion: false, finePointer: true });
/** @param {import('./book-flip.js').FlipState} state
 * @param {...Exclude<import('./book-flip.js').FlipAction['type'], 'environment'>} types */
const act = (state, ...types) =>
	types.reduce((s, type) => bookFlip(s, { type, run: s.run }), state);

describe('book flip interactions', () => {
	it('never restarts or queues overlapping clicks, hover, and unheld nudges', () => {
		const started = act(ready(), 'click');
		expect(act(started, 'click', 'hover', 'sliderMove')).toBe(started);
		expect(act(started, 'finished')).toMatchObject({
			status: 'idle',
			trigger: null,
			moved: false,
			run: 1
		});
	});
	it('continues a held moving slider once, then rests if it stays still', () => {
		const started = act(ready(), 'sliderGrab', 'sliderMove');
		const moving = act(started, 'sliderMove', 'sliderMove');
		expect(moving.run).toBe(started.run);
		const continued = act(moving, 'finished');
		expect(continued).toMatchObject({ status: 'flipping', run: 2, held: true, moved: false });
		expect(act(continued, 'finished')).toMatchObject({ status: 'idle', run: 2, held: true });
	});
	it('does not repeat a quick flick or carry movement into a new grab', () => {
		const released = act(ready(), 'sliderGrab', 'sliderMove', 'sliderMove', 'sliderRelease');
		expect(released).toMatchObject({ held: false, moved: false });
		expect(act(released, 'sliderGrab', 'finished')).toMatchObject({ status: 'idle', run: 1 });
	});
	it('ignores stale finishes and every event after unmount', () => {
		const current = act(ready(), 'click', 'finished', 'click');
		expect(bookFlip(current, { type: 'finished', run: 1 })).toBe(current);
		expect(bookFlip(current, { type: 'cancelled', run: 1 })).toBe(current);
		const gone = act(current, 'unmount');
		expect(act(gone, 'finished', 'click', 'sliderGrab', 'sliderMove', 'sliderRelease')).toBe(gone);
		expect(flipAttribute(gone)).toBeNull();
	});
	it('suppresses hover under reduced motion, preserving intentional click and slider flips', () => {
		const reduced = bookFlip(ready(), {
			type: 'environment',
			reducedMotion: true,
			finePointer: true
		});
		expect(act(reduced, 'hover')).toBe(reduced);
		expect(flipAttribute(act(reduced, 'click'))).toBe('requested');
		expect(flipAttribute(act(reduced, 'sliderMove'))).toBe('requested');
		expect(flipAttribute(act(ready(), 'hover'))).toBe('');
	});
	it('allows touch dragging without touch hover', () => {
		const touch = bookFlip(ready(), {
			type: 'environment',
			reducedMotion: false,
			finePointer: false
		});
		expect(act(touch, 'hover')).toBe(touch);
		expect(act(touch, 'sliderMove').status).toBe('flipping');
	});
	it('can continue a click run with slider movement, but cancellation cannot loop', () => {
		const moving = act(ready(), 'click', 'sliderGrab', 'sliderMove');
		expect(act(moving, 'finished')).toMatchObject({
			status: 'flipping',
			trigger: 'slider',
			run: 2
		});
		expect(act(moving, 'cancelled')).toMatchObject({ status: 'idle', moved: false, run: 1 });
	});
	it('grabbing alone does not animate', () => {
		const held = act(ready(), 'sliderGrab');
		expect(act(held, 'sliderGrab')).toBe(held);
		expect(held.status).toBe('idle');
	});
});
