import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ZoomThumb from './ZoomThumb.svelte';

describe('zoom handle motion', () => {
	it.each([{ animate: true }, { animate: false }])(
		'morphs during input and returns to a circle anywhere: %j',
		async (options) => {
			const screen = render(ZoomThumb, { value: 20, ...options, onsettled: () => {} });
			const thumb = screen.container.querySelector('.zoom-thumb');
			const stretch = () => Number(thumb.dataset.stretch);
			expect(stretch()).toBe(0);

			await screen.rerender({ value: 21 });
			await expect.poll(stretch, { interval: 10 }).toBeGreaterThan(0.05);
			expect(stretch()).toBeLessThan(1);
			for (const value of [22, 23, 24, 25, 26, 27, 28]) {
				await screen.rerender({ value });
				await new Promise((resolve) => setTimeout(resolve, 40));
			}
			expect(stretch()).toBeGreaterThan(0.8);
			const capsule = thumb.querySelector('.zoom-thumb__capsule img');
			expect(capsule.getBoundingClientRect().width).toBeGreaterThan(26);
			expect(capsule.getBoundingClientRect().height).toBe(15);

			await expect.poll(stretch, { interval: 10 }).toBeLessThan(0.7);
			expect(stretch()).toBeGreaterThan(0.05);
			await expect.poll(stretch).toBe(0);
			await expect.poll(() => Number(thumb.dataset.position)).toBe(28);
			const circle = thumb.querySelector('.zoom-thumb__circle img');
			expect(circle.getBoundingClientRect().width).toBe(15);
			expect(circle.getBoundingClientRect().height).toBe(15);
			await expect.poll(() => circle.complete && circle.naturalWidth > 0).toBe(true);
			await expect.poll(() => capsule.complete && capsule.naturalWidth > 0).toBe(true);
		}
	);
});
