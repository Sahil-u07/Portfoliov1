// Browser smoke test: serves the existing dist/ with `vite preview`, exercises
// every interactive piece at desktop and phone width, and fails on JS errors or
// horizontal scroll. Run: npm run build && npm test
import { preview } from 'vite';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const shots = process.env.SHOTS; // optional dir for screenshots
const server = await preview({ preview: { port: 4173, strictPort: true, open: false }, logLevel: 'silent' });
const url = server.resolvedUrls.local[0];
const browser = await chromium.launch();
const errors = [];

try {
  for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 375, height: 812 }]]) {
    const page = await browser.newPage({ viewport, ignoreHTTPSErrors: true });
    page.on('pageerror', e => errors.push(`${name}: ${e.message}`));
    // Network failures (e.g. fonts blocked offline) are not page bugs.
    page.on('console', m => m.type() === 'error' && !m.text().startsWith('Failed to load resource') && errors.push(`${name}: ${m.text()}`));
    await page.goto(url);

    // The name decodes from scrambled letters, so check the accessible name, then the settled text.
    await page.getByRole('heading', { level: 1, name: 'Sahil Lenka' }).waitFor();
    await page.waitForFunction(() => document.querySelector('h1').textContent === 'Sahil Lenka');
    // The hero must be fully at rest at the top: any leftover scroll transform blurs its text.
    assert.ok(['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(await page.$eval('.hero-inner', e => getComputedStyle(e).transform)), `${name}: hero is transformed at the top`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 0, `${name}: horizontal scroll of ${overflow}px`);

    // Background ribbons are drawn.
    assert.ok(await page.locator('.ribbons').evaluate(c => c.getContext('2d').getImageData(0, 0, c.width, c.height).data.some((v, i) => i % 4 === 3 && v > 0)), `${name}: ribbons drew nothing`);

    // Hero field: hovering it draws the query and its neighbours on the canvas.
    const field = page.locator('.field canvas');
    await field.hover();
    await page.waitForTimeout(200);
    const lit = await field.evaluate(c => {
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let lime = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i] > 150 && d[i + 1] > 200 && d[i + 2] < 100) lime++;
      return lime;
    });
    assert.ok(lit > 50, `${name}: retrieval field drew no highlighted neighbours`);

    // Projects: three cards, and hovering one tilts it.
    const cards = page.locator('.project');
    assert.equal(await cards.count(), 3);
    assert.deepEqual(await page.$$eval('.project h3', hs => hs.map(h => h.textContent)), ['EvidenceRAG', 'This portfolio', 'ProjectMUJToppers']);
    await cards.first().scrollIntoViewIfNeeded();
    const box = await cards.first().boundingBox();
    await page.mouse.move(box.x + 10, box.y + 10);
    assert.notEqual(await cards.first().evaluate(c => c.style.getPropertyValue('--rx')), '');

    // Pipeline: sufficient evidence -> verified; insufficient -> abstained.
    const runBtn = page.getByRole('button', { name: 'Run query' });
    await runBtn.click();
    await page.waitForSelector('.verdict[data-state="verified"]', { timeout: 15000 });
    await page.getByRole('switch').click();
    await runBtn.click();
    await page.waitForSelector('.verdict[data-state="abstained"]', { timeout: 15000 });

    // Clicking a stage explains it.
    await page.locator('.stage').nth(4).click();
    assert.match(await page.textContent('.stage-detail'), /Reciprocal Rank Fusion/);

    // Metric toggle changes the chart.
    const before = await page.textContent('.bars');
    await page.getByRole('button', { name: 'Recall@1' }).click();
    assert.notEqual(await page.textContent('.bars'), before);

    // Skill filter shows only the chosen group.
    await page.getByRole('button', { name: 'Databases' }).click();
    assert.deepEqual(await page.$$eval('.chip', cs => cs.map(c => c.textContent)), ['MongoDB', 'PostgreSQL', 'SQL']);

    // Command menu: Ctrl+K, type, Enter jumps to the section.
    await page.keyboard.press('Control+k');
    await page.waitForSelector('.palette[open]');
    await page.keyboard.type('contact');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => !document.querySelector('.palette').open && location.hash === '#contact');

    if (shots) {
      await page.goto(url);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${shots}/${name}-hero.png` });
      // scroll through so reveal animations fire before the full-page shot
      for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 600) {
        await page.evaluate(y => window.scrollTo(0, y), y);
        await page.waitForTimeout(150);
      }
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${shots}/${name}-full.png`, fullPage: true });
    }
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log('smoke: all checks passed');
} finally {
  await browser.close();
  await server.close();
}
