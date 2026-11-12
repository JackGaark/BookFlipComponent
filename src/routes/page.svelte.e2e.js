import { expect, test } from '@playwright/test';

test('scroll intent aligns an off-stop gallery and captions use the three specified sizes', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/');
	await page
		.getByRole('navigation', { name: 'Main navigation' })
		.getByRole('button', { name: 'WORK' })
		.click();
	const range = page.getByRole('slider', { name: 'Image size' });
	await expect(range).toBeVisible();
	const setZoom = async (value) => {
		await range.evaluate((input, next) => {
			input.value = String(next);
			input.dispatchEvent(new Event('input', { bubbles: true }));
		}, value);
	};
	await setZoom(37);
	await page.locator('.gallery-scroll').hover({ position: { x: 800, y: 400 } });
	await page.mouse.wheel(0, 100);
	await expect(range).toHaveValue('50');
	for (const [zoom, size] of [
		[0, '3px'],
		[50, '6px'],
		[100, '12px']
	]) {
		await setZoom(zoom);
		await expect(page.locator('.caption').first()).toHaveCSS('font-size', size);
	}
});

test('landing dial paints a stop at cuts on both halves at centre, middle and edge', async ({
	page
}) => {
	test.setTimeout(60000);
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/');
	for (const x of [719, 360, 1, 721, 1080, 1439]) {
		await page.mouse.move(x, 400);
		await page.evaluate((left) => {
			window.dialObserver?.disconnect();
			window.cutSamples = [];
			const panel = document.querySelectorAll('.panel')[left ? 0 : 1];
			window.dialObserver = new MutationObserver(() => {
				const angles = [...document.querySelectorAll('.wordmark-cursor__page')].map((needle) =>
					Number(needle.style.transform.match(/rotate\(([-.\d]+)/)?.[1])
				);
				window.cutSamples.push(angles);
			});
			window.dialObserver.observe(panel, {
				subtree: true,
				attributes: true,
				attributeFilter: ['class']
			});
		}, x < 720);
		await expect
			.poll(() => page.evaluate(() => window.cutSamples.length), { timeout: 10000 })
			.toBeGreaterThanOrEqual(2);
		const samples = await page.evaluate(() => window.cutSamples);
		for (const angles of samples) {
			expect(angles).toHaveLength(5);
			for (const angle of angles) expect(angle / 30).toBeCloseTo(Math.round(angle / 30));
		}
	}
});
