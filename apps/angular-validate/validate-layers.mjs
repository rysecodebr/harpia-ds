import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const chromePath = process.env.HARPIA_CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.setContent(`
    <style>
      body { margin: 0; }
      #card { position: fixed; inset: 0; z-index: 1; background: white; }
      #header { position: fixed; inset: 0 0 auto; height: 120px; z-index: 10; background: #ddd; }
      #dropdown { position: absolute; top: 40px; left: 40px; width: 180px; height: 100px; z-index: 2; background: #88f; }
      #open-dialog { position: absolute; top: 10px; right: 20px; }
      #drawer-backdrop { position: fixed; inset: 0; z-index: 20; background: #0006; }
      #drawer { position: fixed; inset: 0 auto 0 0; width: 500px; z-index: 21; background: #9e9; }
      #root-toast { position: fixed; left: 350px; top: 250px; width: 100px; height: 100px; z-index: 99999; background: #f88; }
      #modal { width: 300px; height: 220px; padding: 0; border: 0; background: #eef; }
      #modal::backdrop { background: #0006; }
      #inner-popover { position: fixed; left: 350px; top: 250px; width: 100px; height: 100px; margin: 0; border: 0; background: #ff8; }
      #inner-toast { position: absolute; left: 130px; top: 80px; width: 100px; height: 100px; z-index: 3; background: #f88; }
    </style>
    <main id="card">Card</main>
    <header id="header"><div id="dropdown">Dropdown</div><button id="open-dialog">Abrir diálogo</button></header>
    <div id="drawer-backdrop" hidden></div><aside id="drawer" hidden>Drawer</aside>
    <div id="root-toast" hidden>Toast raiz</div>
    <dialog id="modal"><button id="open-popover" popovertarget="inner-popover">Abrir popover</button><div id="inner-toast">Toast do diálogo</div><div id="inner-popover" popover="auto">Popover do diálogo</div></dialog>
    <script>document.querySelector('#open-dialog').addEventListener('click', () => document.querySelector('#modal').showModal());</script>
  `);
  const top = (x, y) => page.evaluate(([px, py]) => document.elementFromPoint(px, py)?.id, [x, y]);
  assert.equal(await top(60, 60), 'dropdown', 'Dropdown should cover the card below the header');
  await page.evaluate(() => { document.querySelector('#drawer-backdrop').hidden = false; document.querySelector('#drawer').hidden = false; });
  assert.equal(await top(60, 60), 'drawer', 'Drawer should cover the page dropdown');
  await page.evaluate(() => { document.querySelector('#open-dialog').focus(); document.querySelector('#modal').showModal(); document.querySelector('#root-toast').hidden = false; document.querySelector('#inner-toast').hidden = true; });
  assert.equal(await page.evaluate(() => document.querySelector('#modal').contains(document.activeElement)), true, 'Focus should enter the dialog');
  assert.equal(await top(400, 300), 'modal', 'Root toast cannot cover a native modal dialog');
  await page.evaluate(() => { document.querySelector('#inner-toast').hidden = false; });
  assert.equal(await top(400, 300), 'inner-toast', 'Toast in the dialog should cover its surface');
  await page.locator('#open-popover').click();
  assert.equal(await top(400, 300), 'inner-popover', 'Popover in the active dialog should cover its toast');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#inner-popover').evaluate((node) => node.matches(':popover-open')), false);
  assert.equal(await page.locator('#modal').evaluate((node) => node.open), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#modal').evaluate((node) => node.open), false);
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'open-dialog', 'Focus should return to the prior control');
  assert.equal(await top(60, 60), 'drawer');
  console.log('Chrome: dropdown < drawer < native dialog; nested popover and toast follow top-layer order; Escape closes popover then dialog.');
} finally {
  await browser.close();
}
