// Playwright test of single-file builds opened from file://. Usage: node tests/browser/e2e_file.js <dir with html/restaurant-demo-test.html and -emu.html>
const { chromium, devices } = require('playwright');
const SP = process.argv[2];
async function run(file, label, deviceName) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(deviceName ? { ...devices[deviceName] } : { viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [], reqs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('request', r => { if (!r.url().startsWith('file:')) reqs.push(r.url().split('?')[0].slice(0, 90)); });
  await page.goto('file://' + file);
  await page.getByRole('button', { name: 'Start' }).click({ timeout: 20000 });
  await page.locator('input[value="O1"]').check();
  await page.getByRole('button', { name: 'Continue' }).click();
  let n = 0;
  while (true) {
    const rows = page.locator('.item'); await rows.first().waitFor();
    await rows.nth(2).locator('.pick.best').click();
    await rows.nth(3).locator('.pick.worst').click();
    if (n === 0 && label === 'TEST') await page.screenshot({ path: `${SP}/file-choice-desktop.png` });
    n++;
    const btn = page.locator('button.btn'); const txt = await btn.textContent(); await btn.click();
    if (txt === 'Finish') break;
  }
  await page.waitForSelector('h1:text-matches("Thank you|Done|not open|Could not")', { timeout: 20000 });
  console.log(label, 'screens', n, 'h1:', await page.locator('h1').textContent(), '| errors', errs, '| network', [...new Set(reqs)]);
  await browser.close();
}
(async () => {
  await run(`${SP}/html/restaurant-demo-test.html`, 'TEST', null);
  await run(`${SP}/html/restaurant-demo-emu.html`, 'LIVE-EMU', 'iPhone 13');
})().catch(e => { console.error(e); process.exit(1); });
