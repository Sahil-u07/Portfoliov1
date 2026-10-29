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
    await page.route(u => u.hostname === 'api.github.com', r => {
      const q = new URL(r.request().url()).searchParams.get('q');
      if (q.includes('is:unmerged')) return r.fulfill({ status: 403, json: {} });
      const tab = q.includes('is:merged') ? 'merged' : 'open';
      r.fulfill({ json: { total_count: 33, items: [1, 2].map(i => ({ title: `${tab} PR ${i}`, html_url: `https://github.com/o/r/pull/${i}`, repository_url: 'https://api.github.com/repos/o/r' })) } });
    });
    await page.goto(url);

    await page.getByRole('heading', { level: 1, name: 'Sahil Lenka' }).waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 0, `${name}: horizontal scroll of ${overflow}px`);

    // Download CV serves the PDF.
    const cv = await page.locator('.hero a[download]').evaluate(a => fetch(a.href).then(r => r.ok && r.headers.get('content-type')));
    assert.equal(cv, 'application/pdf', `${name}: Download CV link is broken`);

    // The banner clock ticks.
    const t0 = await page.textContent('.clock');
    assert.match(t0, /^\d{6}$/); // HH MM SS, the colons are drawn dots
    await page.waitForFunction(t => document.querySelector('.clock').textContent !== t, t0);

    // The profile picture, the banner skyline and every experience logo load.
    await page.waitForFunction(() => [...document.querySelectorAll('.portrait img, .xp .logo img')].every(i => i.complete && i.naturalWidth > 0));
    // The banner scene is drawn: the sky's top-left is dark red, not blank.
    await page.waitForFunction(() => { const [r, g, b, a] = document.querySelector('.night').getContext('2d').getImageData(2, 2, 1, 1).data; return a === 255 && r > g && r > b; });
    assert.equal(await page.locator('.xp .logo img, .xp .logo .ic').count(), 4, `${name}: an experience logo is missing`);

    assert.equal(await page.locator('#quotes li').count(), 4, `${name}: the quotes are missing`);

    // Every index link points at a section that exists.
    for (const href of await page.$$eval('.index a', as => as.map(a => a.getAttribute('href'))))
      assert.equal(await page.locator(href).count(), 1, `${name}: ${href} has no section`);

    assert.deepEqual(await page.$$eval('#projects h3', hs => hs.map(h => h.textContent)), ['EvidenceRAG', 'RoadGuard AI', 'ProjectMUJToppers', 'This portfolio']);
    // Open source: per-project counts link to each repo; the PR list is live, one search per tab.
    assert.ok(await page.$$eval('#open-source .more', as => as.length === 4 && as.every(a => a.href.startsWith('https://github.com/'))));
    await page.waitForSelector('.prs h3');
    assert.deepEqual(await page.$$eval('.prs h3', hs => hs.map(h => h.textContent)), ['merged PR 1', 'merged PR 2']);
    assert.match(await page.textContent('#open-source .view-all'), /View All \(31 more\)/);
    await page.getByRole('tab', { name: 'open' }).click();
    await page.waitForFunction(() => document.querySelector('.prs h3')?.textContent === 'open PR 1');
    // If GitHub refuses (rate limit), the closed tab falls back to the project list instead of going blank.
    await page.getByRole('tab', { name: 'closed' }).click();
    await page.waitForFunction(() => [...document.querySelectorAll('.prs h3')].map(h => h.textContent).join() === 'Beehive,Concore,Diomede,GNU Radio');

    // Experience rows fold open to show their details.
    const row = page.locator('.xp-row').first();
    await row.click();
    assert.equal(await row.getAttribute('aria-expanded'), 'true');
    await page.locator('.fold.open .points li').first().waitFor({ state: 'visible' });

    // The theme toggle flips and remembers the theme.
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'light' && localStorage.getItem('theme') === 'light');
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');

    // The heatmap draws one cell per day from the (mocked) contribution feed.
    await page.waitForSelector('.heat i[data-level]');
    assert.equal(await page.locator('.heat i[data-level]').count(), 365);
    assert.match(await page.textContent('#activity .sec-note'), /^\d+ GitHub contributions in the last year$/);

    // Command menu: Ctrl+K, type, Enter jumps to the section.
    await page.keyboard.press('Control+k');
    await page.waitForSelector('.palette[open]');
    await page.keyboard.type('skills');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => !document.querySelector('.palette').open && location.hash === '#skills');

    // Wheel scrolling glides to its target instead of jumping, but still gets there.
    // Let the smooth jump to #skills finish first, or it nudges the starting point.
    const settled = () => new Promise(r => { const y = scrollY; requestAnimationFrame(() => requestAnimationFrame(() => r(scrollY === y))); });
    await page.waitForFunction(settled);
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForFunction(settled);
    const y0 = await page.evaluate(() => scrollY);
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    await page.mouse.wheel(0, 400);
    assert.ok(await page.evaluate(() => scrollY) < y0 + 400, `${name}: wheel scroll jumped instead of gliding`);
    await page.waitForFunction(y0 => Math.abs(scrollY - y0 - 400) < 1, y0);

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
