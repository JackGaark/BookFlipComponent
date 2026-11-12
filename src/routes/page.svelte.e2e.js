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

test('middle gallery matches the Figma frame and keeps 8px gutters at any width', async ({
	page
}) => {
	// Upright geometry of Figma frame 5566:2356: [asset, x, width, height] per row.
	const rows = [
		[293, [0, 1, 2, 3, 0, 1, 2, 3, 4, 5], [160, 160, 180, 100, 160, 160, 180, 100, 80, 180]],
		[533, [3, 5, 1, 2, 4, 0, 4, 3, 1], [100, 180, 160, 180, 80, 160, 180, 100, 160]],
		[773, [1, 2, 3, 4, 5, 0, 1, 2, 3, 0], [160, 180, 100, 80, 180, 160, 160, 180, 100, 160]]
	];
	const measure = () =>
		page.locator('.image-card').evaluateAll((cards) =>
			cards.slice(0, 29).map((card) => {
				const { left, right, bottom, height } = card
					.querySelector('.frame')
					.getBoundingClientRect();
				const asset = Number(card.querySelector('img').src.match(/image-(\d)/)[1]);
				return { asset, left, right, bottom, height };
			})
		);
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/');
	await page
		.getByRole('navigation', { name: 'Main navigation' })
		.getByRole('button', { name: 'WORK' })
		.click();
	await expect(page.getByRole('slider', { name: 'Image size' })).toHaveValue('50');
	await expect.poll(async () => (await measure())[0]?.height).toBeCloseTo(160, 0);

	const cards = await measure();
	let index = 0;
	for (const [baseline, assets, heights] of rows) {
		let x = 84;
		for (const [column, asset] of assets.entries()) {
			const card = cards[index++];
			const width = asset === 4 && heights[column] === 180 ? 248 : 120;
			expect(card.asset).toBe(asset);
			expect(card.left).toBeCloseTo(x, 0);
			expect(card.right - card.left).toBeCloseTo(width, 0);
			expect(card.height).toBeCloseTo(heights[column], 0);
			expect(card.bottom).toBeCloseTo(baseline, 0);
			x += width + 8;
		}
	}

	await page.setViewportSize({ width: 1800, height: 1000 });
	await expect.poll(async () => (await measure())[0].left).toBeCloseTo(105, 0);
	const wide = await measure();
	for (const start of [0, 10, 19]) {
		const count = start === 10 ? 9 : 10;
		for (let i = start + 1; i < start + count; i++) {
			expect(wide[i].left - wide[i - 1].right).toBeCloseTo(8, 1);
		}
	}
});
