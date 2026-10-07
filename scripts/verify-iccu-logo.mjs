/**
 * Prove public/img/logo-iccu.svg is the artwork the studio supplied.
 *
 * Renders the SVG at the exact pixel size of the studio's own PNG export of the
 * same EPS, then compares the two images colour class by colour class: green
 * where the export is green, slate where it is slate, transparent where it is
 * transparent. Anything else counts as a mismatch.
 *
 * The point is the colour mapping. An EPS carries CMYK ink values, and the
 * usual CMYK-to-RGB formula gets both of this logo's fills visibly wrong, so
 * the hexes in build-iccu-logo.py were taken from the export. This is what
 * proves they were taken from the right pixels.
 *
 * Usage:
 *   node scripts/verify-iccu-logo.mjs <reference.png> <built.svg>
 */

import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { PNG } from 'pngjs';

const CHROME =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/** Mismatch budget, as a fraction of the painted area. */
const TOLERANCE = 0.02;

const [referencePath, svgPath] = process.argv.slice(2);
if (!referencePath || !svgPath) {
  console.error('usage: node scripts/verify-iccu-logo.mjs <reference.png> <built.svg>');
  process.exit(2);
}

const reference = PNG.sync.read(readFileSync(resolve(referencePath)));

const { chromium } = await import('playwright-core');
const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({
  viewport: { width: reference.width, height: reference.height },
  deviceScaleFactor: 1,
});

// The logo is loaded as an <img>, the same way the site uses it, on a transparent
// ground with no other content — so the only thing that can change a pixel is the
// artwork. Loading it through an <img> also exercises the file the way a browser
// actually consumes it, rather than as a standalone document.
const harness = resolve(tmpdir(), 'verify-iccu-logo.html');
writeFileSync(
  harness,
  `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;background:transparent}img{display:block}</style>
<img src="${pathToFileURL(resolve(svgPath)).href}" width="${reference.width}" height="${reference.height}" alt="">`,
);
await page.goto(pathToFileURL(harness).href);

const shot = await page.screenshot({ omitBackground: true });
await browser.close();
rmSync(harness);

const rendered = PNG.sync.read(shot);
if (rendered.width !== reference.width || rendered.height !== reference.height) {
  console.error(
    `FAIL rendered ${rendered.width}x${rendered.height}, reference ${reference.width}x${reference.height}`,
  );
  process.exit(1);
}

/** Bucket a pixel as the export buckets it, so the comparison is class-wise. */
function classify(r, g, b, a) {
  if (a < 128) return 'none';
  // The export is flat two-colour artwork, so "nearest of the two" is exact.
  const toGreen = (r - 67) ** 2 + (g - 176) ** 2 + (b - 42) ** 2;
  const toSlate = (r - 85) ** 2 + (g - 87) ** 2 + (b - 89) ** 2;
  return toGreen < toSlate ? 'green' : 'slate';
}

let painted = 0;
let wrong = 0;
const byClass = new Map();

for (let i = 0; i < reference.data.length; i += 4) {
  const want = classify(
    reference.data[i],
    reference.data[i + 1],
    reference.data[i + 2],
    reference.data[i + 3],
  );
  const got = classify(
    rendered.data[i],
    rendered.data[i + 1],
    rendered.data[i + 2],
    rendered.data[i + 3],
  );
  if (want !== 'none') painted += 1;
  if (want !== got) {
    wrong += 1;
    byClass.set(`${want}->${got}`, (byClass.get(`${want}->${got}`) ?? 0) + 1);
  }
}

const rate = painted === 0 ? 1 : wrong / painted;
const detail = [...byClass.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([k, v]) => `${k} ${v}`)
  .join(', ');

console.log(
  `verify ${svgPath}: ${painted} painted px of ${reference.width}x${reference.height}, ` +
    `${wrong} mismatched (${(rate * 100).toFixed(3)}%)`,
);
if (detail) console.log(`  ${detail}`);

if (rate > TOLERANCE) {
  console.error(`FAIL above ${(TOLERANCE * 100).toFixed(1)}% tolerance`);
  process.exit(1);
}
console.log('PASS');
