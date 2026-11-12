import { page } from 'vitest/browser';
import { expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { initI18n } from './i18n/i18n.js';
import StudioSheet from './StudioSheet.svelte';

it('opens Studio, switches sections, navigates and restores scrolling after dismissal', async () => {
	initI18n();
	const onclose = vi.fn();
	const onnavigate = vi.fn();
	const originalOverflow = document.body.style.overflow;
	const screen = render(StudioSheet, { open: false, onclose, onnavigate });
	const dialog = screen.container.querySelector('dialog');
	if (!dialog) throw new Error('Studio dialog missing');
	expect(dialog.open).toBe(false);
	await screen.rerender({ open: true });
	await expect.poll(() => dialog.open).toBe(true);
	expect(document.body.style.overflow).toBe('hidden');
	expect(dialog.textContent).toContain('Hi there, Bonjour and Bienvenue.');
	dialog.querySelector('.sections')?.querySelectorAll('button')[1].click();
	await expect.poll(() => dialog.textContent).toContain('Herschel Supply');
	dialog.querySelector('.sections')?.querySelectorAll('button')[2].click();
	await expect
		.poll(() => dialog.querySelector('a[href="mailto:salut@superbonjour.com"]'))
		.not.toBeNull();
	dialog.querySelector('.main-nav')?.querySelectorAll('button')[1].click();
	expect(onnavigate).toHaveBeenCalledWith('index');
	dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
	expect(onclose).toHaveBeenCalledOnce();
	await screen.rerender({ open: false });
	await expect.poll(() => dialog.open).toBe(false);
	expect(document.body.style.overflow).toBe(originalOverflow);
});

it('reverses an opening sheet without jumping and resets content when reopened', async () => {
	initI18n();
	const screen = render(StudioSheet, { open: false });
	const dialog = screen.container.querySelector('dialog');
	if (!dialog) throw new Error('Studio dialog missing');
	await screen.rerender({ open: true });
	await new Promise((resolve) => setTimeout(resolve, 100));
	const before = new DOMMatrix(getComputedStyle(dialog).transform).m42;
	await screen.rerender({ open: false });
	const after = new DOMMatrix(getComputedStyle(dialog).transform).m42;
	expect(Math.abs(after - before)).toBeLessThan(60);
	await screen.rerender({ open: true });
	await expect
		.poll(() => new DOMMatrix(getComputedStyle(dialog).transform).m42, { timeout: 4500 })
		.toBe(0);
	expect(dialog.open).toBe(true);
	await screen.rerender({ open: false });
	await expect.poll(() => dialog.open).toBe(false);
});

it('keeps the Figma sheet inset and its navigation visible on desktop and mobile', async () => {
	initI18n();
	await page.viewport(1440, 880);
	const screen = render(StudioSheet, { open: true });
	const dialog = screen.container.querySelector('dialog');
	if (!dialog) throw new Error('Studio dialog missing');
	await expect
		.poll(() => Math.round(dialog.getBoundingClientRect().top), { timeout: 4500 })
		.toBe(40);
	expect(Math.round(dialog.getBoundingClientRect().width)).toBe(1272);
	await page.viewport(390, 844);
	expect(Math.round(dialog.getBoundingClientRect().width)).toBe(358);
	expect(dialog.querySelector('.main-nav')?.getBoundingClientRect().bottom).toBeLessThanOrEqual(
		844
	);
	await screen.rerender({ open: false });
	await expect.poll(() => dialog.open).toBe(false);
});

it('rises over 1000ms with a slow start and finish', async () => {
	initI18n();
	const screen = render(StudioSheet, { open: false });
	const dialog = screen.container.querySelector('dialog');
	if (!dialog) throw new Error('Studio dialog missing');
	await screen.rerender({ open: true });
	await expect.poll(() => dialog.getAnimations().length).toBeGreaterThan(0);
	const animation = dialog.getAnimations()[0];
	if (!animation) throw new Error('Opening transition missing');
	expect(animation.effect?.getTiming().duration).toBe(1000);
	animation.pause();
	animation.currentTime = 0;
	const travel = new DOMMatrix(getComputedStyle(dialog).transform).m42;
	expect(dialog.getBoundingClientRect().top).toBeGreaterThanOrEqual(window.innerHeight);

	for (const [progress, remaining] of [
		[0.25, 0.94],
		[0.5, 0.5],
		[0.75, 0.06]
	]) {
		animation.currentTime = progress * 1000;
		const position = new DOMMatrix(getComputedStyle(dialog).transform).m42 / travel;
		expect(Math.abs(position - remaining)).toBeLessThan(0.02);
	}
	animation.finish();
	await screen.rerender({ open: false });
	await expect.poll(() => dialog.open).toBe(false);
});

it('visibly travels upward on both first open and reopen', async () => {
	initI18n();
	await page.viewport(1440, 880);
	const screen = render(StudioSheet, { open: false });
	const dialog = screen.container.querySelector('dialog');
	if (!dialog) throw new Error('Studio dialog missing');
	for (let attempt = 0; attempt < 2; attempt++) {
		await screen.rerender({ open: true });
		expect(dialog.getBoundingClientRect().top).toBeGreaterThanOrEqual(880);
		await new Promise((resolve) => setTimeout(resolve, 500));
		const midway = dialog.getBoundingClientRect().top;
		expect(midway).toBeGreaterThan(200);
		expect(midway).toBeLessThan(800);
		await expect
			.poll(() => Math.round(dialog.getBoundingClientRect().top), { timeout: 3000 })
			.toBe(40);
		await screen.rerender({ open: false });
		await expect.poll(() => dialog.open).toBe(false);
	}
}, 12000);

it('raises Services first, then Client List, keeping the introduction underneath', async () => {
	initI18n();
	await page.viewport(1440, 880);
	const screen = render(StudioSheet, { open: true, motion: 'full' });
	const dialog = screen.container.querySelector('dialog');
	if (!dialog) throw new Error('Studio dialog missing');
	await expect
		.poll(() => Math.round(dialog.getBoundingClientRect().top), { timeout: 2000 })
		.toBe(40);
	const services = dialog.querySelector('.services');
	const clients = dialog.querySelector('.clients');
	if (!services || !clients) throw new Error('Sheets missing');
	dialog.querySelector('.sections')?.querySelectorAll('button')[1].click();
	await new Promise((resolve) => setTimeout(resolve, 550));
	expect(services.getBoundingClientRect().top).toBeGreaterThan(144);
	expect(services.getBoundingClientRect().top).toBeLessThan(880);
	expect(clients.getBoundingClientRect().top).toBeGreaterThan(880);
	expect(dialog.querySelector('.intro')?.textContent).toContain(
		'Super Bonjour is a creative studio'
	);
	await expect
		.poll(() => Math.round(clients.getBoundingClientRect().top), { timeout: 2500 })
		.toBe(123);
	expect(Math.round(services.getBoundingClientRect().top)).toBe(144);
	expect(Math.round(services.getBoundingClientRect().left)).toBe(109);
	expect(Math.round(clients.getBoundingClientRect().left)).toBe(720);
	expect(clients.querySelectorAll('li')[2].textContent).toBe('Little Burgundy Shoes');
	dialog.querySelector('.sections')?.querySelectorAll('button')[0].click();
	await expect.poll(() => services.getBoundingClientRect().top).toBeGreaterThan(880);
	expect(dialog.querySelector('.sheets')?.getAttribute('inert')).not.toBeNull();
	await screen.rerender({ open: false });
	await expect.poll(() => dialog.open).toBe(false);
}, 8000);

it('cancels the delayed client entrance when switching away quickly', async () => {
	initI18n();
	const screen = render(StudioSheet, { open: true, motion: 'full' });
	const dialog = screen.container.querySelector('dialog');
	if (!dialog) throw new Error('Studio dialog missing');
	await expect
		.poll(() => Math.round(dialog.getBoundingClientRect().top), { timeout: 2000 })
		.toBe(40);
	dialog.querySelector('.sections')?.querySelectorAll('button')[1].click();
	await new Promise((resolve) => setTimeout(resolve, 150));
	dialog.querySelector('.sections')?.querySelectorAll('button')[2].click();
	await new Promise((resolve) => setTimeout(resolve, 1200));
	expect(dialog.querySelector('.clients')?.getBoundingClientRect().top).toBeGreaterThan(
		window.innerHeight
	);
	expect(dialog.querySelector('a[href="mailto:salut@superbonjour.com"]')).not.toBeNull();
	await screen.rerender({ open: false });
	await expect.poll(() => dialog.open).toBe(false);
});
