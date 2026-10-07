import { chromium } from 'playwright';
const [url, out, w, h, frac = '0', mobile = '0'] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2, isMobile: mobile === '1', hasTouch: mobile === '1' });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
await page.waitForTimeout(1500);
const H = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < H * +frac; y += 400) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(100); }
await page.evaluate((y) => window.scrollTo(0, y), Math.round(H * +frac));
await page.waitForTimeout(1500);
await page.screenshot({ path: out });
await browser.close();
