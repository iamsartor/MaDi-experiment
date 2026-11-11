// Browser end-to-end test of the survey (Playwright). See docs/survey.md, "Testing".
// node tests/browser/e2e_survey.js <outdir>   (needs link_local.txt and link_live.txt in <outdir>)
const { chromium, devices } = require('playwright');
const fs = require('fs');
const SP = process.argv[2];
async function run(link, label, shot) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(link);
  await page.getByRole('button', { name: 'Start' }).click({ timeout: 20000 });
  if (shot) await page.screenshot({ path: `${SP}/shot-intro.png` });
  await page.locator('input[value="O2"]').check();
  await page.getByRole('button', { name: 'Continue' }).click();
  let n = 0;
  while (true) {
    const rows = page.locator('.item');
    await rows.first().waitFor();
    const count = await rows.count();
    // pick: Most on row 0, Least on row 1; also exercise toggling
    await rows.nth(0).locator('.pick.best').click();
    await rows.nth(0).locator('.pick.worst').click();   // switches row 0 to least
    await rows.nth(1).locator('.pick.best').click();
    if (shot && n === 1) await page.screenshot({ path: `${SP}/shot-choice.png` });
    n++;
    const btn = page.locator('button.btn');
    const txt = await btn.textContent();
    await btn.click();
    if (txt === 'Finish') break;
  }
  await page.waitForFunction(() => window.__maxdiffResponse, null, { timeout: 20000 });
  await page.waitForSelector('h1:text-matches("Thank you|Done")', { timeout: 20000 });
  const r = await page.evaluate(() => window.__maxdiffResponse);
  const h1 = await page.locator('h1').textContent();
  if (shot) await page.screenshot({ path: `${SP}/shot-done.png` });
  console.log(label, 'screens', n, 'h1:', h1, 'answers', r.answers.length, 'sample', JSON.stringify(r.answers[0]), 'segments', JSON.stringify(r.segments), 'errors', errs);
  // reload: should say already completed in live mode
  await page.reload();
  await page.waitForSelector('h1');
  console.log(label, 'after reload:', await page.locator('h1').textContent());
  await browser.close();
}
(async () => {
  await run(fs.readFileSync(`${SP}/link_local.txt`, 'utf8').trim(), 'LOCAL', true);
  await run(fs.readFileSync(`${SP}/link_live.txt`, 'utf8').trim() .replace('?study=restaurant-demo', '?study=restaurant-demo&emulator=1'), 'LIVE-EMU', false);
  // broken link (no wording)
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://127.0.0.1:8000/survey/?study=restaurant-demo&mode=local'); await p.waitForSelector('h1');
  console.log('NO-HASH:', await p.locator('p.error').textContent()); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
