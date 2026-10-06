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

    // The role decodes from scrambled letters, so check the accessible name, then the settled text.
    await page.getByRole('heading', { level: 1, name: 'Full-stack developer' }).waitFor();
    await page.waitForFunction(() => document.querySelector('h1').textContent === 'Full-stack developer');
    // The hero must be fully at rest at the top: any leftover scroll transform blurs its text.
    assert.ok(['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(await page.$eval('.hero-inner', e => getComputedStyle(e).transform)), `${name}: hero is transformed at the top`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 0, `${name}: horizontal scroll of ${overflow}px`);

    // Download CV serves the PDF.
    const cv = await page.locator('.hero a[download]').evaluate(a => fetch(a.href).then(r => r.ok && r.headers.get('content-type')));
    assert.equal(cv, 'application/pdf', `${name}: Download CV link is broken`);

    // The intro video is served, and the round button turns its sound on and off.
    const clip = await page.locator('.portrait video source').evaluate(s => fetch(s.src).then(r => r.ok && r.headers.get('content-type')));
    assert.equal(clip, 'video/mp4', `${name}: intro video is missing`);
    const sound = page.locator('.sound');
    await sound.click();
    assert.equal(await page.locator('.portrait video').evaluate(v => v.muted), false, `${name}: sound did not turn on`);
    await sound.click();
    assert.equal(await page.locator('.portrait video').evaluate(v => v.muted), true, `${name}: sound did not turn off`);

    // ID card flips with the keyboard and swings (the JS sets a rotation on its hanger).
    const card = page.locator('.idcard');
    await card.focus();
    await page.keyboard.press('Enter');
    assert.equal(await card.getAttribute('aria-pressed'), 'true', `${name}: ID card did not flip`);
    await page.waitForFunction(() => document.querySelector('.hanger').style.transform.startsWith('rotate'));

    // 3D search sketch: it only animates while on screen, so wait for it to draw the query's neighbours.
    const field = page.locator('.field canvas');
    await field.hover();
    await field.evaluate(c => new Promise((resolve, reject) => {
      const lit = () => {
        const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        let ink = 0; // the query and its neighbour lines are drawn in the off-white accent
        for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200 && d[i] > 200 && d[i + 1] > 200 && d[i + 2] > 190) ink++;
        return ink > 50;
      };
      const t0 = performance.now();
      (function poll() { lit() ? resolve() : performance.now() - t0 > 5000 ? reject(new Error('3D sketch drew no highlighted neighbours')) : requestAnimationFrame(poll); })();
    }));

    // Dragging spins the field (exercises the drag handlers; any error fails the run).
    const fb = await field.boundingBox();
    await page.mouse.move(fb.x + fb.width / 2, fb.y + fb.height / 2);
    await page.mouse.down();
    await page.mouse.move(fb.x + fb.width / 2 + 80, fb.y + fb.height / 2 + 20, { steps: 5 });
    await page.mouse.up();

    // Projects: four panels, the first open; choosing another opens it and folds the first.
    const panels = page.locator('.project');
    assert.equal(await panels.count(), 4);
    assert.deepEqual(await page.$$eval('.project h3', hs => hs.map(h => h.textContent)), ['EvidenceRAG', 'RoadGuard AI', 'This portfolio', 'ProjectMUJToppers']);
    await panels.nth(1).locator('.spine').click();
    assert.deepEqual(await page.$$eval('.project', ps => ps.map(p => p.classList.contains('open'))), [false, true, false, false]);
    await page.locator('.project.open .project-links a').first().waitFor({ state: 'visible' });

    // Open source: one short card per project, each linking to its repository.
    assert.deepEqual(await page.$$eval('#open-source .card h3', hs => hs.map(h => h.textContent)), ['Beehive', 'Concore', 'Diomede', 'GNU Radio']);
    assert.ok(await page.$$eval('#open-source .more', as => as.every(a => a.href.startsWith('https://github.com/'))));

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

    // Skill filter dims every tile outside the chosen family, and the inspector names the hovered tile.
    await page.getByRole('button', { name: 'Databases' }).click();
    assert.deepEqual(await page.$$eval('.element:not(.dim) span', cs => cs.map(c => c.textContent)), ['MongoDB', 'PostgreSQL', 'SQL']);
    const syms = await page.$$eval('.element b', bs => bs.map(b => b.textContent));
    assert.equal(new Set(syms).size, syms.length, `${name}: duplicate element symbols`);
    await page.locator('.element button', { hasText: 'FastAPI' }).hover();
    assert.match(await page.textContent('.inspector'), /FastAPI.*EvidenceRAG/);

    // Achievements: scrolling through the pinned section slides the cards sideways, and numbers count up.
    await page.evaluate(() => { const s = document.getElementById('achievements'); scrollTo({ top: s.offsetTop + (s.offsetHeight - innerHeight) / 2, behavior: 'instant' }); });
    await page.waitForFunction(() => new DOMMatrix(getComputedStyle(document.querySelector('.ach-track')).transform).m41 < -50);
    await page.waitForFunction(() => /[1-9]/.test(document.querySelector('.ach.near .ach-num')?.textContent));

    // Command menu: Ctrl+K, type, Enter jumps to the section.
    await page.keyboard.press('Control+k');
    await page.waitForSelector('.palette[open]');
    await page.keyboard.type('contact');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => !document.querySelector('.palette').open && location.hash === '#contact');

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
