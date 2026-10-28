// Browser smoke test: serves the existing dist/ with `vite preview`, exercises
// every interactive piece at desktop and phone width, and fails on JS errors or
// horizontal scroll. Run: npm run build && npm test
import { preview } from 'vite';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const shots = process.env.SHOTS; // optional dir for screenshots
const server = await preview({ preview: { port: 4173, strictPort: true, open: false }, logLevel: 'silent' });
const url = server.resolvedUrls.local[0];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM }); // CHROMIUM: optional path to a preinstalled browser
const errors = [];
const activityUrl = 'https://github-contributions-api.jogruber.de/v4/Sahil-u07';
const year = Array.from({ length: 365 }, (_, i) => ({ date: new Date(Date.UTC(2025, 9, 28 + i)).toISOString().slice(0, 10), count: i % 5, level: i % 5 }));

try {
  for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 375, height: 812 }]]) {
    const page = await browser.newPage({ viewport, ignoreHTTPSErrors: true });
    page.on('pageerror', e => errors.push(`${name}: ${e.message}`));
    // Network failures (e.g. fonts blocked offline) are not page bugs.
    page.on('console', m => m.type() === 'error' && !m.text().startsWith('Failed to load resource') && errors.push(`${name}: ${m.text()}`));
    // Serve a fixed year of contributions so the heatmap is tested offline.
    await page.route(u => u.href.startsWith(activityUrl), r => r.fulfill({ json: { contributions: year } }));
    await page.goto(url);

    await page.getByRole('heading', { level: 1, name: 'Sahil Lenka.' }).waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 0, `${name}: horizontal scroll of ${overflow}px`);

    // Download CV serves the PDF.
    const cv = await page.locator('.hero a[download]').evaluate(a => fetch(a.href).then(r => r.ok && r.headers.get('content-type')));
    assert.equal(cv, 'application/pdf', `${name}: Download CV link is broken`);

    // The banner clock ticks.
    const t0 = await page.textContent('.clock');
    assert.match(t0, /^\d\d\.\d\d\.\d\d$/);
    await page.waitForFunction(t => document.querySelector('.clock').textContent !== t, t0);

    // The intro video is served.
    const clips = await page.$$eval('.portrait video source', ss => Promise.all(ss.map(s => fetch(s.src).then(r => r.ok && r.headers.get('content-type')))));
    assert.deepEqual(clips, ['video/webm', 'video/mp4'], `${name}: intro video is missing`);
    // The avatar is drawn cut out: transparent in the corner, solid in the middle.
    await page.waitForFunction(() => { const c = document.querySelector('.portrait canvas').getContext('2d');
      return c.getImageData(5, 5, 1, 1).data[3] === 0 && c.getImageData(240, 200, 1, 1).data[3] === 255; });
    // The first click anywhere on the page turns the voice on.
    await page.locator('.intro').click();
    assert.equal(await page.locator('.portrait video').evaluate(v => v.muted), false, `${name}: first click did not turn the sound on`);

    // Every index link points at a section that exists.
    for (const href of await page.$$eval('.index a', as => as.map(a => a.getAttribute('href'))))
      assert.equal(await page.locator(href).count(), 1, `${name}: ${href} has no section`);

    assert.deepEqual(await page.$$eval('#projects h3', hs => hs.map(h => h.textContent)), ['EvidenceRAG', 'RoadGuard AI', 'ProjectMUJToppers', 'This portfolio']);
    assert.deepEqual(await page.$$eval('#open-source h3', hs => hs.map(h => h.textContent)), ['Beehive', 'Concore', 'Diomede', 'GNU Radio']);
    assert.ok(await page.$$eval('#open-source .more', as => as.every(a => a.href.startsWith('https://github.com/'))));

    // The heatmap draws one cell per day from the (mocked) contribution feed.
    await page.waitForSelector('.cells i[data-level]');
    assert.equal(await page.locator('.cells i[data-level]').count(), 365);
    assert.match(await page.textContent('.activity'), /contributions in the last year/);

    // Command menu: Ctrl+K, type, Enter jumps to the section.
    await page.keyboard.press('Control+k');
    await page.waitForSelector('.palette[open]');
    await page.keyboard.type('skills');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => !document.querySelector('.palette').open && location.hash === '#skills');

    // Wheel scrolling glides to its target instead of jumping, but still gets there.
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    await page.mouse.wheel(0, 400);
    assert.ok(await page.evaluate(() => scrollY) < 400, `${name}: wheel scroll jumped instead of gliding`);
    await page.waitForFunction(() => Math.abs(scrollY - 400) < 1);

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
