import { chromium, firefox, webkit } from 'playwright';
import assert from 'node:assert/strict';

for (const [name, engine] of Object.entries({ chrome: chromium, firefox, webkit })) {
	const browser = await engine.launch(name === 'chrome' ? { channel: 'chrome' } : {});
	try {
		const page = await browser.newPage({ reducedMotion: 'no-preference' });
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
		const book = page.getByRole('button', { name: 'Turn book pages' });
		await book.waitFor();
		for (const trigger of ['hover', 'click', 'click']) {
			await page.mouse.move(500, 500);
			if (trigger === 'hover') await book.hover();
			else await book.dispatchEvent('click');
			await page.waitForFunction(
				() => {
					const path = document.querySelector('.book__page');
					const transform = path && getComputedStyle(path).transform;
					return transform && transform !== 'none' && transform !== 'matrix(1, 0, 0, 1, 0, 0)';
				},
				null,
				{ timeout: 2000 }
			);
			await page.waitForFunction(
				() =>
					!document.querySelector('[aria-label="Turn book pages"]').hasAttribute('data-flipping'),
				null,
				{ timeout: 3000 }
			);
			console.log(`${name}: ${trigger} animates and resets`);
		}
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.mouse.move(500, 500);
		await book.hover();
		assert.equal(await book.getAttribute('data-flipping'), null, 'Reduced motion suppresses hover');
		await book.dispatchEvent('click');
		await page.waitForFunction(
			() => {
				const transform = getComputedStyle(document.querySelector('.book__page')).transform;
				return transform !== 'none' && transform !== 'matrix(1, 0, 0, 1, 0, 0)';
			},
			null,
			{ timeout: 2000 }
		);
		await page.waitForFunction(
			() => !document.querySelector('[aria-label="Turn book pages"]').hasAttribute('data-flipping'),
			null,
			{ timeout: 3000 }
		);
		console.log(`${name}: reduced motion suppresses hover but explicit click plays and resets`);
		const slider = page.getByRole('slider', { name: 'Image size' });
		const setZoom = (value) =>
			slider.evaluate((input, value) => {
				input.value = String(value);
				input.dispatchEvent(new Event('input', { bubbles: true }));
			}, value);
		const animations = () =>
			book.locator('path').evaluateAll((paths) =>
				paths.flatMap((path) =>
					path.getAnimations().map((animation) => ({
						name: animation.animationName,
						start: animation.startTime,
						duration: animation.effect.getTiming().duration,
						delay: animation.effect.getTiming().delay,
						easing: animation.effect.getKeyframes()[0].easing
					}))
				)
			);
		await setZoom(62.5);
		await page.waitForFunction(() => document.querySelector('.book').hasAttribute('data-flipping'));
		await page.waitForFunction(
			() => document.querySelector('.book__page').getAnimations()[0]?.startTime != null
		);
		const started = await animations();
		assert.equal(started.length, 10, 'All five pages run the forward and return turns');
		assert.ok(
			started.every(
				(animation) => animation.duration === 360 && animation.easing === 'ease-in-out'
			),
			'Slider uses the same speed and easing as the standalone flip'
		);
		await setZoom(75);
		await setZoom(40);
		assert.deepEqual(
			new Set((await animations()).map((animation) => animation.start)),
			new Set(started.map((animation) => animation.start)),
			'Fast slider changes and reversals do not restart the sequence'
		);
		await page.waitForFunction(
			() => !document.querySelector('.book').hasAttribute('data-flipping'),
			null,
			{ timeout: 3000 }
		);
		assert.ok(
			await book
				.locator('path')
				.evaluateAll((paths) =>
					paths.every((path) => getComputedStyle(path).transform === 'matrix(1, 0, 0, 1, 0, 0)')
				),
			'All pages settle at rest when the gesture stops'
		);
		await page.emulateMedia({ reducedMotion: 'no-preference' });
		const bounds = await slider.boundingBox();
		assert.ok(bounds);
		const x = (fraction) => bounds.x + bounds.width * fraction;
		const y = bounds.y + bounds.height / 2;
		await page.mouse.move(x(0.35), y);
		await page.mouse.down();
		await page.mouse.move(x(0.45), y, { steps: 5 });
		await page.waitForFunction(
			() => document.querySelector('.book__page').getAnimations()[0]?.startTime != null
		);
		const dragging = await animations();
		await page.mouse.move(x(0.6), y, { steps: 5 });
		await page.mouse.move(x(0.4), y, { steps: 5 });
		assert.deepEqual(
			new Set((await animations()).map((animation) => animation.start)),
			new Set(dragging.map((animation) => animation.start)),
			'Real pointer reversals preserve the running sequence'
		);
		for (let step = 0; step < 18; step++) {
			await page.mouse.move(x(step % 2 ? 0.55 : 0.45), y);
			await page.waitForTimeout(90);
		}
		const continued = await animations();
		assert.ok(continued.length > 0, 'A held moving slider continues flipping');
		assert.notEqual(continued[0].start, dragging[0].start, 'Continuation starts a new sequence');
		await page.mouse.up();
		const resting = () =>
			page.waitForFunction(
				() => !document.querySelector('.book').hasAttribute('data-flipping'),
				null,
				{ timeout: 2000 }
			);
		await resting();
		await page.waitForTimeout(200);
		assert.equal(
			await book.getAttribute('data-flipping'),
			null,
			'Release leaves no queued sequence'
		);

		await slider.focus();
		await page.keyboard.down('ArrowRight');
		await page.waitForFunction(() => document.querySelector('.book').hasAttribute('data-flipping'));
		await page.keyboard.up('ArrowRight');
		await resting();
		await slider.press('Home');
		await resting();
		await slider.press('ArrowLeft');
		assert.equal(
			await book.getAttribute('data-flipping'),
			null,
			'A clamped key at the boundary does not flip'
		);

		await page.mouse.move(x(0.4), y);
		await page.mouse.down();
		await page.mouse.move(x(0.6), y, { steps: 5 });
		await slider.dispatchEvent('pointercancel');
		await page.mouse.up();
		await resting();
		assert.equal(
			await book.getAttribute('data-flipping'),
			null,
			'Pointer cancellation releases the gesture'
		);

		await setZoom(30);
		await page.waitForFunction(() => document.querySelector('.book').hasAttribute('data-flipping'));
		await page.getByRole('button', { name: 'STUDIO', exact: true }).click();
		await book.waitFor({ state: 'detached' });
		await page.locator('.popup .dialog-icon:not(.mobile)').dispatchEvent('click');
		await book.waitFor();
		await page.waitForTimeout(1500);
		assert.equal(
			await book.getAttribute('data-flipping'),
			null,
			'Remounted book ignores the removed book’s completion'
		);
		console.log(
			`${name}: slider nudges, real drag/reversal/release, keyboard, cancel, and unmount pass`
		);
		assert.deepEqual(errors, []);
	} finally {
		await browser.close();
	}
}
