// Browser smoke test: loads index.html, exercises every interactive piece,
// fails on console errors or horizontal scroll. Run: node tests/smoke.mjs
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const url = new URL('../index.html', import.meta.url).href;
const shots = process.env.SHOTS; // optional dir for screenshots
const browser = await chromium.launch();
const errors = [];

try {
  for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 375, height: 812 }]]) {
    const page = await browser.newPage({ viewport, ignoreHTTPSErrors: true });
    page.on('pageerror', e => errors.push(`${name}: ${e.message}`));
    page.on('console', m => m.type() === 'error' && !m.text().startsWith('Failed to load resource') && errors.push(`${name}: ${m.text()}`));
    await page.goto(url);

    assert.match(await page.textContent('h1'), /Sahil Lenka/);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 0, `${name}: horizontal scroll of ${overflow}px`);

    // Pipeline: run with sufficient evidence -> verified; insufficient -> abstain
    await page.click('#run-pipeline');
    await page.waitForSelector('#verdict[data-state="verified"]', { timeout: 15000 });
    await page.click('#evidence-toggle');
    await page.click('#run-pipeline');
    await page.waitForSelector('#verdict[data-state="abstained"]', { timeout: 15000 });

    // Clicking a stage shows its detail
    await page.click('.stage[data-i="4"]');
    assert.match(await page.textContent('#stage-detail'), /Reciprocal Rank Fusion/);

    // Metric tabs change the chart
    const before = await page.textContent('.bars');
    await page.click('.metric[data-metric="r1"]');
    assert.notEqual(await page.textContent('.bars'), before);

    // Skill filter hides chips from other groups
    await page.click('.filter[data-group="db"]');
    const visible = await page.$$eval('.chip', cs => cs.filter(c => !c.hidden).map(c => c.textContent.trim()));
    assert.deepEqual(visible, ['MongoDB', 'PostgreSQL', 'SQL']);

    // Command palette opens with Ctrl+K and jumps to a section
    await page.keyboard.press('Control+k');
    await page.waitForSelector('#palette[open]');
    await page.keyboard.type('contact');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => !document.querySelector('#palette').open && location.hash === '#contact');

    if (shots) {
      await page.goto(url);
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${shots}/${name}-hero.png` });
      // scroll through so reveal animations fire before the full-page shot
      for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 600) {
        await page.evaluate(y => window.scrollTo(0, y), y);
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${shots}/${name}-full.png`, fullPage: true });
    }
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log('smoke: all checks passed');
} finally {
  await browser.close();
}
