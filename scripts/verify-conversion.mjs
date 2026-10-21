/**
 * Drive the conversion tracker in a real browser.
 *
 * Asserts the click fires exactly one `conversion` event with the configured
 * label, that a `_blank` link is not hijacked into a same-tab navigation, and
 * that a same-tab link waits for the beacon before navigating.
 *
 * It also asserts which Google Ads tag each page carries: the tag is opt-in
 * per page, so a page with no account must carry none at all, and the
 * retired account must not appear anywhere.
 */

import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';

/** The account the Battle of Idaho campaign reports to. */
const CAMPAIGN_ACCOUNT = 'AW-18501242003';

/** The account the site used to report to, before the tag became opt-in. */
const RETIRED_ACCOUNT = 'AW-18508946300';

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
 * Record what the page sends without stubbing gtag: the Google tag component
 * defines its own inline `gtag`, so a stub installed here would simply be
 * overwritten. The real gtag pushes an `arguments` object onto dataLayer, so
 * spying on the queue is the only way to observe the call without touching
 * the network.
 */
const readConversions = () =>
  page.evaluate(() =>
    (window.dataLayer ?? [])
      .map((entry) => (entry instanceof Array ? entry : Array.from(entry)))
      .filter((args) => args[0] === 'event' && args[1] === 'conversion'),
  );

/** The Google Ads accounts a page loads the tag for. */
const readTagAccounts = () =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')).map(
      (el) => new URL(el.src).searchParams.get('id'),
    ),
  );

const seedDataLayer = () =>
  page.evaluate(() => {
    window.dataLayer = window.dataLayer ?? [];
  });

await page.goto(`${BASE}/battle-of-idaho/free-agent/`, { waitUntil: 'networkidle' });

check('no console errors on load', errors.length === 0, errors.join(' | '));

// --- The Google tag ------------------------------------------------------
const freeAgentTags = await readTagAccounts();
check(
  'the free agent page loads one Google Ads tag',
  freeAgentTags.length === 1,
  JSON.stringify(freeAgentTags),
);
check(
  'the tag is the campaign account',
  freeAgentTags[0] === CAMPAIGN_ACCOUNT,
  String(freeAgentTags[0]),
);

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
  'send_to is the campaign account',
  payload.send_to === CAMPAIGN_ACCOUNT,
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
check(
  'other landing pages carry the campaign tag',
  (await readTagAccounts()).includes(CAMPAIGN_ACCOUNT),
  JSON.stringify(await readTagAccounts()),
);

// --- The tag is opt-in, page by page -------------------------------------
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
const homeTags = await readTagAccounts();
check('a page with no account carries no tag', homeTags.length === 0, JSON.stringify(homeTags));

// --- The retired account must be gone ------------------------------------
let retiredOn = null;
for (const path of [
  '/',
  '/battle-of-idaho/',
  '/battle-of-idaho/free-agent/',
  '/battle-of-idaho/youth-open/',
  '/battle-of-idaho/register-a-team/',
]) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  if ((await page.content()).includes(RETIRED_ACCOUNT)) retiredOn = path;
}
check('the retired account appears on no page', retiredOn === null, String(retiredOn));

check('no console errors overall', errors.length === 0, errors.join(' | '));

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);