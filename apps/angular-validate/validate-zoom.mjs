import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright-core';

const url = process.env.HARPIA_VALIDATE_URL ?? 'http://localhost:4200/';
const chromePath = process.env.HARPIA_CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const screenshots = path.resolve('artifacts', 'zoom');
await access(chromePath);
await mkdir(screenshots, { recursive: true });

async function checkZoom(factor) {
  const profile = await mkdtemp(path.join(os.tmpdir(), 'harpia-zoom-'));
  let context;
  try {
    if (factor === 2) {
      await mkdir(path.join(profile, 'Default'), { recursive: true });
      // Chromium stores the default zoom level by partition key; "x" is the default partition.
      // See chrome/browser/ui/zoom/chrome_zoom_level_prefs.cc and blink/page_zoom.cc.
      await writeFile(path.join(profile, 'Default', 'Preferences'), JSON.stringify({
        partition: { default_zoom_level: { x: Math.log(2) / Math.log(1.2) } }
      }));
    }
    context = await chromium.launchPersistentContext(profile, {
      executablePath: chromePath,
      headless: true,
      viewport: { width: 390, height: 844 },
      args: ['--no-sandbox', '--disable-gpu']
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => ({
      width: window.innerWidth,
      ratio: window.devicePixelRatio,
      visualScale: window.visualViewport.scale,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      samples: document.querySelectorAll('[data-token]').length,
      fontLoaded: document.fonts.check('16px Montserrat')
    }));
    assert.equal(metrics.width, 390 / factor, `Unexpected CSS viewport at ${factor * 100}%`);
    assert.equal(metrics.ratio, factor, `Unexpected devicePixelRatio at ${factor * 100}%`);
    assert.equal(metrics.visualScale, 1, 'Pinch zoom should remain inactive');
    assert.equal(metrics.overflow, false, 'Horizontal overflow');
    assert.equal(metrics.samples, 29, 'Typography sample count');
    assert.equal(metrics.fontLoaded, true, 'Montserrat did not load');
    assert.deepEqual(errors, []);
    await page.screenshot({ path: path.join(screenshots, `angular-${factor * 100}.png`), fullPage: true });
    process.stdout.write(`${factor * 100}%: ${JSON.stringify(metrics)}\n`);
  } finally {
    if (context) await context.close();
    await rm(profile, { recursive: true, force: true });
  }
}

await checkZoom(1);
await checkZoom(2);
