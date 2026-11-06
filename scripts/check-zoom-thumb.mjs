import { chromium, firefox, webkit } from 'playwright';
import assert from 'node:assert/strict';

const artifactDir =
	'/Users/jackgaarkeuken/.t3/scratch/2026-11-06-open-bookflipcomponent-t3-context-v1-df3c91c3';
for (const [name, engine] of Object.entries({ chrome: chromium, firefox, webkit })) {
	const browser = await engine.launch(name === 'chrome' ? { channel: 'chrome' } : {});
	try {
		for (const mobile of [false, true]) {
			const page = await browser.newPage({
				viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
				hasTouch: mobile,
				reducedMotion: 'no-preference'
			});
			const errors = [];
			page.on('pageerror', (error) => errors.push(error.message));
			await page.goto('http://localhost:5173/');
			await page.waitForFunction(() => {
				const button = document.querySelector('.landing .playback');
				if (button?.getAttribute('aria-pressed') === 'true') return true;
				button?.click();
				return false;
			});
			await page.getByRole('button', { name: 'Work', exact: true }).click();
			const slider = page.getByRole('slider', { name: 'Image size' });
			const thumb = page.locator('.zoom-thumb');
			await thumb.waitFor({ state: 'attached' });
			const setZoom = (value) =>
				slider.evaluate((input, value) => {
					input.value = String(value);
					input.dispatchEvent(new Event('input', { bubbles: true }));
				}, value);
			const settled = (value) =>
				page.waitForFunction(
					(value) =>
						Math.abs(Number(document.querySelector('.zoom-thumb').dataset.position) - value) < 0.01,
					value
				);
			const geometry = async () => {
				const bounds = await slider.boundingBox();
				assert.ok(bounds);
				const hit = await slider.evaluate((input) =>
					parseFloat(getComputedStyle(input).getPropertyValue('--hit'))
				);
				return {
					bounds,
					hit,
					travel: bounds.width - hit,
					x: (value) => bounds.x + hit / 2 + ((bounds.width - hit) * value) / 100,
					y: bounds.y + bounds.height / 2
				};
			};
			const g = await geometry();
			assert.equal(g.hit, mobile ? 25 : 35);
			for (const value of [0, 25, 50, 75, 100]) {
				await setZoom(value);
				await settled(value);
				const selector =
					value === 25 || value === 75 ? '.zoom-thumb__capsule' : '.zoom-thumb__circle';
				const expectedWidth = selector.includes('capsule') ? 29 : 15;
				const asset = await page.locator(`${selector} img`).evaluate((img) => {
					const rect = img.getBoundingClientRect();
					return {
						width: rect.width,
						height: rect.height,
						center: rect.x + rect.width / 2,
						naturalWidth: img.naturalWidth,
						naturalHeight: img.naturalHeight,
						opacity: Number(getComputedStyle(img.parentElement).opacity)
					};
				});
				assert.equal(asset.naturalWidth, expectedWidth);
				assert.equal(asset.naturalHeight, 15);
				assert.ok(Math.abs(asset.width - expectedWidth) < 0.1);
				assert.ok(Math.abs(asset.height - 15) < 0.1);
				assert.ok(
					Math.abs(asset.center - g.x(value)) < 0.5,
					'Visual centre matches native thumb travel'
				);
				assert.equal(asset.opacity, 1);
			}
			await setZoom(25);
			await settled(25);
			if (name === 'chrome')
				await page
					.locator('.control')
					.screenshot({ path: `${artifactDir}/zoom-thumb-${mobile ? 'mobile' : 'desktop'}.png` });
			await page.mouse.move(g.x(40), g.y);
			await page.mouse.down();
			await page.mouse.move(g.x(50) - 10, g.y, { steps: 5 });
			await page.waitForFunction(
				() => document.querySelector('.control').dataset.snapped === 'true'
			);
			assert.equal(
				await slider.inputValue(),
				'50',
				'Native value is re-synced on entering the snap'
			);
			await page.mouse.move(g.x(50) + 20, g.y);
			assert.equal(await slider.inputValue(), '50', 'The wider exit band keeps the centre stable');
			await page.mouse.move(g.x(50) + 35, g.y);
			assert.ok(Number(await slider.inputValue()) > 50, 'Dragging beyond the exit band escapes');
			await page.mouse.move(g.x(50) - 10, g.y);
			assert.equal(await slider.inputValue(), '50', 'The centre can capture again');
			await page.mouse.up();
			await slider.press('ArrowRight');
			await slider.press('ArrowRight');
			assert.equal(await slider.inputValue(), '52', 'Keyboard bypasses the detent');
			await settled(52);

			await page.mouse.move(g.x(40), g.y);
			await page.mouse.down();
			await page.mouse.move(g.x(50), g.y);
			assert.equal(await slider.inputValue(), '50');
			await slider.dispatchEvent('pointercancel');
			await page.mouse.up();
			assert.equal(await page.locator('.control').getAttribute('data-snapped'), 'false');
			await page.mouse.move(g.x(50) + 20, g.y);
			await page.mouse.down();
			assert.ok(Number(await slider.inputValue()) > 50, 'A fresh gesture does not inherit capture');
			await page.mouse.up();

			await setZoom(30);
			await page.mouse.move(g.x(30), g.y);
			await page.mouse.down();
			await page.mouse.move(g.x(45), g.y);
			const releasedFrom = Number(await slider.inputValue());
			assert.ok(Math.abs(releasedFrom - 45) < 0.5);
			await settled(releasedFrom);
			await page.mouse.up();
			const samples = await page.evaluate(async () => {
				const positions = [];
				for (let i = 0; i < 30; i++) {
					await new Promise(requestAnimationFrame);
					positions.push(Number(document.querySelector('.zoom-thumb').dataset.position));
				}
				return positions;
			});
			assert.ok(
				samples.some((value) => value > releasedFrom + 0.01 && value < 49.99),
				'Release snap has intermediate positions'
			);
			await settled(50);
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await setZoom(30);
			await page.mouse.move(g.x(30), g.y);
			await page.mouse.down();
			await page.mouse.move(g.x(45), g.y);
			await page.mouse.up();
			await page.evaluate(() => new Promise(requestAnimationFrame));
			assert.equal(
				Number(await thumb.getAttribute('data-position')),
				50,
				'Reduced motion settles immediately'
			);
			assert.deepEqual(errors, []);
			console.log(
				`${name} ${mobile ? 'mobile' : 'desktop'}: exact assets, geometry, snap/escape, keyboard, cancellation, spring and reduced motion pass`
			);
			await page.close();
		}
	} finally {
		await browser.close();
	}
}
