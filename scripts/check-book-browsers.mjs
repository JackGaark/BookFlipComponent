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
      await page.waitForFunction(() => {
        const path = document.querySelector('.book__page');
        const transform = path && getComputedStyle(path).transform;
        return transform && transform !== 'none' && transform !== 'matrix(1, 0, 0, 1, 0, 0)';
      }, null, { timeout: 2000 });
      await page.waitForFunction(() => !document.querySelector('[aria-label="Turn book pages"]').hasAttribute('data-flipping'), null, { timeout: 3000 });
      console.log(`${name}: ${trigger} animates and resets`);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.mouse.move(500, 500);
    await book.hover();
    assert.equal(await book.getAttribute('data-flipping'), null, 'Reduced motion suppresses hover');
    await book.dispatchEvent('click');
    await page.waitForFunction(() => {
      const transform = getComputedStyle(document.querySelector('.book__page')).transform;
      return transform !== 'none' && transform !== 'matrix(1, 0, 0, 1, 0, 0)';
    }, null, { timeout: 2000 });
    await page.waitForFunction(() => !document.querySelector('[aria-label="Turn book pages"]').hasAttribute('data-flipping'), null, { timeout: 3000 });
    console.log(`${name}: reduced motion suppresses hover but explicit click plays and resets`);
    const slider = page.getByRole('slider', { name: 'Image size' });
    const pageTurns = () => book.locator('path').evaluateAll(paths => paths.map(path => getComputedStyle(path).transform));
    const initialTurns = await pageTurns();
    await slider.evaluate(input => {
      input.value = '62.5';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForFunction(() => document.querySelector('.book__page').style.getPropertyValue('--zoom-turn') === '90deg');
    const movedTurns = await pageTurns();
    assert.notDeepEqual(movedTurns, initialTurns, 'Zoom movement turns the book pages');
    assert.notEqual(movedTurns[0], movedTurns[4], 'Pages fan out as zoom moves');
    await slider.evaluate(input => {
      input.value = '50';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForFunction(() => document.querySelector('.book__page').style.getPropertyValue('--zoom-turn') === '0deg');
    assert.deepEqual(await pageTurns(), initialTurns, 'Reversing zoom reverses the page turn');
    console.log(`${name}: zoom scrubs book pages forward and backward`);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
}
