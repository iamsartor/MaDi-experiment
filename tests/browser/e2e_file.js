// Playwright test of single-file builds opened from file://.
// Usage: node tests/browser/e2e_file.js <dir>
//   <dir>/html/restaurant-demo-test.html     test build      (run if present)
//   <dir>/html/restaurant-demo-emu.html      live build with --emulator (run if present; needs the emulator)
//   <dir>/html/restaurant-demo-offline.html  offline build   (run if present)
// The offline run writes <dir>/offline-saved.json and <dir>/offline-copied.txt
// (the saved and the copied result) so tests/test_collect_offline.py can check them.
const fs = require('fs');
const { chromium, devices } = require('playwright');
const SP = process.argv[2];

function assert(cond, msg) { if (!cond) throw new Error('ASSERT: ' + msg); }

async function answerAll(page, label) {
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
  return n;
}

async function run(file, label, deviceName) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(deviceName ? { ...devices[deviceName] } : { viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [], reqs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('request', r => { if (!r.url().startsWith('file:')) reqs.push(r.url().split('?')[0].slice(0, 90)); });
  await page.goto('file://' + file);
  const n = await answerAll(page, label);
  await page.waitForSelector('h1:text-matches("Thank you|Done|not open|Could not")', { timeout: 20000 });
  console.log(label, 'screens', n, 'h1:', await page.locator('h1').textContent(), '| errors', errs, '| network', [...new Set(reqs)]);
  await browser.close();
}

async function runOffline(file) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
  const page = await ctx.newPage();
  const errs = [], network = [], files = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  // Count every request the page makes. Allowed: the page itself and the blob: of the download.
  ctx.on('request', r => {
    const u = r.url();
    if (u.startsWith('file:')) files.push(u); else if (!u.startsWith('blob:') && !u.startsWith('data:')) network.push(u);
  });
  await page.goto('file://' + file);
  const intro = await page.locator('p.small').first().textContent({ timeout: 20000 });
  assert(intro.includes('You send it to us yourself'), 'offline privacy line: ' + intro);
  assert(await page.locator('.badge').count() === 0, 'no test badge in offline mode');

  const n = await answerAll(page, 'OFFLINE');
  await page.waitForSelector('h1:text("Almost done: please send us your result")', { timeout: 20000 });
  const shown = await page.locator('#result-text').inputValue();
  assert(shown.endsWith('\n') && shown.trim().split('\n').length === 1, 'result is one line + newline');
  const r = JSON.parse(shown);
  assert(r.client.offline === true && r.answers.length === n, 'result shape');
  await page.screenshot({ path: `${SP}/file-offline-end.png` });

  // Save: a download with exactly the shown text
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Save result' }).click()]);
  assert(/^restaurant-demo-result-[a-z0-9]{6}\.json$/.test(dl.suggestedFilename()), 'filename ' + dl.suggestedFilename());
  const saved = fs.readFileSync(await dl.path(), 'utf8');
  assert(saved === shown, 'saved file equals the shown text');
  fs.writeFileSync(`${SP}/offline-saved.json`, saved);

  // Copy: clipboard API
  await page.getByRole('button', { name: 'Copy result' }).click();
  await page.waitForSelector('#result-status:text("Copied ✓")', { timeout: 5000 });
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  assert(copied === shown, 'clipboard equals the shown text');
  fs.writeFileSync(`${SP}/offline-copied.txt`, copied);
  await page.waitForFunction(() => document.getElementById('result-status').textContent === '', null, { timeout: 4000 });

  // Copy without the clipboard API: execCommand fallback, or the manual hint
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true }); });
  await page.getByRole('button', { name: 'Copy result' }).click();
  const fb = await page.locator('#result-status').textContent();
  assert(fb === 'Copied ✓' || fb === 'Select the text below and press Ctrl+C', 'fallback feedback: ' + fb);

  // Reopen: the stored result is shown again instead of a new survey
  await page.reload();
  await page.waitForSelector('h1:text("You already completed this survey")', { timeout: 20000 });
  assert(await page.locator('#result-text').inputValue() === shown, 'stored result shown again');
  const [dl2] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Save result' }).click()]);
  assert(fs.readFileSync(await dl2.path(), 'utf8') === shown, 'save works after reopening');

  const pageFile = 'file://' + file;
  assert(files.every(u => u === pageFile), 'only the page itself was loaded: ' + files.join(', '));
  assert(network.length === 0, 'network requests: ' + network.join(', '));
  assert(errs.length === 0, 'page errors: ' + errs.join(' | '));
  console.log('OFFLINE screens', n, '| saved', dl.suggestedFilename(), '| copy fallback:', fb, '| network', network, '| OK');
  await browser.close();
}

(async () => {
  const f = (name) => `${SP}/html/${name}`;
  if (fs.existsSync(f('restaurant-demo-test.html'))) await run(f('restaurant-demo-test.html'), 'TEST', null);
  if (fs.existsSync(f('restaurant-demo-emu.html'))) await run(f('restaurant-demo-emu.html'), 'LIVE-EMU', 'iPhone 13');
  if (fs.existsSync(f('restaurant-demo-offline.html'))) await runOffline(f('restaurant-demo-offline.html'));
})().catch(e => { console.error(e); process.exit(1); });
