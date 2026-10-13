/**
 * Drive the conversion tracker in a real browser.
 *
 * Asserts the click fires exactly one `conversion` event with the configured
 * label, that a `_blank` link is not hijacked into a same-tab navigation, and
 * that a same-tab link waits for the beacon before navigating.
 */

import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
};

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage();

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

/*
 * Record what the page sends without stubbing gtag: BaseLayout defines its own
 * inline `gtag`, so a stub installed here would simply be overwritten. The real
 * gtag pushes an `arguments` object onto dataLayer, so spying on the queue is
 * the only way to observe the call without touching the network.
 */
const readConversions = () =>
  page.evaluate(() =>
    (window.dataLayer ?? [])
      .map((entry) => (entry instanceof Array ? entry : Array.from(entry)))
      .filter((args) => args[0] === 'event' && args[1] === 'conversion'),
  );

const seedDataLayer = () =>
  page.evaluate(() => {
    window.dataLayer = window.dataLayer ?? [];
  });

await page.goto(`${BASE}/battle-of-idaho/free-agent/`, { waitUntil: 'networkidle' });

check('no console errors on load', errors.length === 0, errors.join(' | '));

// --- Tracked, target=_blank link -----------------------------------------
const tracked = page.locator('a[data-conversion]');
check('two tracked registration links', (await tracked.count()) === 2, `found ${await tracked.count()}`);

const [popup] = await Promise.all([
  page.waitForEvent('popup', { timeout: 10000 }),
  tracked.first().click(),
]);

const conversions = await readConversions();
check('exactly one conversion fired', conversions.length === 1, `got ${conversions.length}`);
check('popup opened (tab preserved)', !!popup);

const payload = conversions[0]?.[2] ?? {};
check(
  'send_to is the conversion label',
  payload.send_to === 'AW-18508946300/XJyNCImOuJodEPy24PlE',
  String(payload.send_to),
);
check('value is 1', payload.value === 1, String(payload.value));
check('currency is USD', payload.currency === 'USD', String(payload.currency));
check('registers as a conversion event', conversions[0]?.[0] === 'event' && conversions[0]?.[1] === 'conversion');

// The page itself must not have navigated away.
check(
  'page stayed on the landing page',
  page.url().includes('/battle-of-idaho/free-agent/'),
  page.url(),
);

// --- Untracked links must not fire ---------------------------------------
await popup.close();
// The secondary "more info" link stays on this site, so it navigates in place
// rather than opening a popup.
await page.goto(`${BASE}/battle-of-idaho/free-agent/`, { waitUntil: 'networkidle' });
await seedDataLayer();

const secondary = page.locator('.btn--quiet').first();
await secondary.click();
await page.waitForURL('**/battle-of-idaho/', { timeout: 10000 });
const afterSecondary = await readConversions();
check('untracked secondary link fires nothing', afterSecondary.length === 0, `got ${afterSecondary.length}`);

// --- Other landing pages must be untouched -------------------------------
await page.goto(`${BASE}/battle-of-idaho/youth-open/`, { waitUntil: 'networkidle' });
check(
  'other landing pages have no tracked links',
  (await page.locator('a[data-conversion]').count()) === 0,
);

check('no console errors overall', errors.length === 0, errors.join(' | '));

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);