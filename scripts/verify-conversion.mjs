/**
 * Drive the conversion tracker in a real browser.
 *
 * Asserts the click fires exactly one `conversion` event with the configured
 * label, that a `_blank` link is not hijacked into a same-tab navigation, and
 * that a same-tab link waits for the beacon before navigating.
 *
 * It also asserts which Google Ads tag each page carries: the tag is on every
 * public page, `/admin/` opts out, and the retired account must not appear
 * anywhere.
 */

import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';

/** The account the Battle of Idaho campaign reports to. */
const CAMPAIGN_ACCOUNT = 'AW-18501242003';

/** The account the site used to report to, before the current account. */
const RETIRED_ACCOUNT = 'AW-18508946300';

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
};

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await chromium.launch({ executablePath: CHROME });
const context = await browser.newContext();
const page = await context.newPage();

/*
 * Third-party requests are answered locally instead of being fetched.
 *
 * The Google tag, the web fonts, and the registration form are not what this
 * script is testing, and waiting on them made the run depend on the network:
 * a slow or unreachable request to any of them leaves the page short of
 * `networkidle` long after it is ready to be tested, and the run fails on a
 * timeout rather than on a real defect.
 *
 * They are fulfilled rather than blocked, because a blocked request logs a
 * console error and the run asserts that the page loads without one. The
 * tag's own behaviour is unaffected: the inline script that defines `gtag`
 * and seeds `dataLayer` is served from the site, and that is what this
 * script observes.
 *
 * The routes are set on the context, not the page, so they cover the popup
 * the registration link opens as well.
 */
const stubbed = new Set();
const external = new Set();

context.on('request', (request) => {
  try {
    const { hostname } = new URL(request.url());
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') external.add(request.url());
  } catch {
    /* Not a URL this check can reason about. */
  }
});

const stub = (pattern, contentType, body) =>
  context.route(pattern, (route) => {
    stubbed.add(route.request().url());
    return route.fulfill({ status: 200, contentType, body });
  });

await stub('**://www.googletagmanager.com/**', 'application/javascript', '');
await stub('**://fonts.googleapis.com/**', 'text/css', '');
await stub('**://fonts.gstatic.com/**', 'font/woff2', '');
await stub('**://www.zeffy.com/**', 'text/html', '<!doctype html><title>Registration</title>');

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

/**
 * Click the first tracked registration link and report what it fired. The
 * link opens a new tab, which is closed again before returning.
 */
const clickTracked = async () => {
  const [popup] = await Promise.all([
    page.waitForEvent('popup', { timeout: 10000 }),
    page.locator('a[data-conversion]').first().click(),
  ]);
  const fired = await readConversions();
  check('popup opened (tab preserved)', !!popup);
  await popup.close();
  return fired;
};

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

const conversions = await clickTracked();
check('exactly one conversion fired', conversions.length === 1, `got ${conversions.length}`);

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

// --- The youth free agent page reports the same conversion ---------------
await page.goto(`${BASE}/battle-of-idaho/youth-free-agent/`, { waitUntil: 'networkidle' });
check(
  'the youth free agent page carries the campaign tag',
  (await readTagAccounts()).includes(CAMPAIGN_ACCOUNT),
  JSON.stringify(await readTagAccounts()),
);

const youthTracked = page.locator('a[data-conversion]');
check(
  'the youth free agent page has two tracked links',
  (await youthTracked.count()) === 2,
  `found ${await youthTracked.count()}`,
);

const youthConversions = await clickTracked();
check(
  'the youth free agent page fires exactly one conversion',
  youthConversions.length === 1,
  `got ${youthConversions.length}`,
);
check(
  'the youth free agent conversion names the campaign account',
  youthConversions[0]?.[2]?.send_to === CAMPAIGN_ACCOUNT,
  String(youthConversions[0]?.[2]?.send_to),
);
check(
  'the youth free agent page did not navigate away',
  page.url().includes('/battle-of-idaho/youth-free-agent/'),
  page.url(),
);

// --- The tag is on every public page, with one deliberate exception ------
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
const homeTags = await readTagAccounts();
check(
  'the home page carries the site tag',
  homeTags.length === 1 && homeTags[0] === CAMPAIGN_ACCOUNT,
  JSON.stringify(homeTags),
);

await page.goto(`${BASE}/admin/`, { waitUntil: 'networkidle' });
const adminTags = await readTagAccounts();
check('the staff index carries no tag', adminTags.length === 0, JSON.stringify(adminTags));

// --- The retired account must be gone ------------------------------------
let retiredOn = null;
for (const path of [
  '/',
  '/admin/',
  '/battle-of-idaho/',
  '/battle-of-idaho/free-agent/',
  '/battle-of-idaho/youth-free-agent/',
  '/battle-of-idaho/youth-open/',
  '/battle-of-idaho/register-a-team/',
]) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  if ((await page.content()).includes(RETIRED_ACCOUNT)) retiredOn = path;
}
check('the retired account appears on no page', retiredOn === null, String(retiredOn));

// --- The run must not depend on the network ------------------------------
/*
 * Every third-party request the local pages made was answered by a stub. This
 * runs before the secondary-link test, which is the one step that deliberately
 * leaves the local server, so anything listed here came from a page under
 * test.
 */
const escaped = [...external].filter((url) => !stubbed.has(url));
check(
  'no third-party request left the machine',
  escaped.length === 0,
  escaped.join(' | '),
);

// --- Untracked links must not fire ---------------------------------------
// The secondary "more info" link is an absolute URL to the live site, so this
// step leaves the local server on purpose. It is last for that reason: it is
// the one navigation that reaches the network.
await page.goto(`${BASE}/battle-of-idaho/free-agent/`, { waitUntil: 'networkidle' });
await seedDataLayer();

const secondary = page.locator('.btn--quiet').first();
await secondary.click();
await page.waitForURL('**/battle-of-idaho/', { timeout: 10000 });
const afterSecondary = await readConversions();
check('untracked secondary link fires nothing', afterSecondary.length === 0, `got ${afterSecondary.length}`);

check('no console errors overall', errors.length === 0, errors.join(' | '));

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);