import { expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import WordmarkCursor from './WordmarkCursor.svelte';

it('uses the original artwork and preserves wipe progress through pauses and reversals', async () => {
	const screen = render(WordmarkCursor);
	const artwork = screen.container.querySelector('.wordmark-cursor__artwork');
	const image = artwork.querySelector('.letter-b');
	const images = [...screen.container.querySelectorAll('img')];
	await expect.poll(() => images.every((img) => img.complete && img.naturalWidth > 0)).toBe(true);
	expect(images).toHaveLength(7);
	const letterS = artwork.querySelector('.letter-s');
	expect(letterS.getBoundingClientRect().width).toBeCloseTo(24.00445, 1);
	expect(letterS.getBoundingClientRect().height).toBeCloseTo(35.91955, 1);
	await expect.poll(() => image.complete && image.naturalWidth > 0).toBe(true);
	expect(image.getBoundingClientRect().width).toBeCloseTo(22.85545, 1);
	expect(image.getBoundingClientRect().height).toBeCloseTo(34.44645, 1);
	expect(getComputedStyle(screen.container.firstElementChild).pointerEvents).toBe('none');

	screen.component.setDialPosition(4);
	const forward = artwork.style.maskImage;
	const pages = [...screen.container.querySelectorAll('.wordmark-cursor__page')];
	expect(new Set(pages.map((page) => page.style.transform)).size).toBeGreaterThan(1);
	expect(forward).toContain('conic-gradient');
	screen.component.setDialPosition(4);
	expect(artwork.style.maskImage).toBe(forward);
	screen.component.setDialPosition(5);
	expect(artwork.style.maskImage).not.toBe(forward);
	screen.component.setDialPosition(4);
	expect(artwork.style.maskImage).toBe(forward);
	screen.component.setDialPosition(0);
	expect(artwork.style.maskImage).toBe('none');
});
