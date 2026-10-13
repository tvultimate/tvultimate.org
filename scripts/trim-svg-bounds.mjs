/**
 * Find the real artwork bounds of an SVG by rasterising it and scanning for
 * non-white pixels.
 *
 * Auto-traced artwork often arrives on a canvas far larger than the drawing,
 * with the art pushed into one corner. The declared width/height then render it
 * mostly blank, so the true bounds are needed to set a sane viewBox.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const [, , input, outDir] = process.argv;
if (!input || !outDir) {
  console.error('usage: trim-svg-bounds.mjs <svg> <outDir>');
  process.exit(2);
}

const abs = path.resolve(input);
const png = path.join(outDir, 'bounds-probe.png');

fs.mkdirSync(outDir, { recursive: true });

/*
 * Screenshot the SVG file itself rather than an <img> inside a wrapper page.
 * The wrapper raced the image load and produced an unreadable PNG; pointing
 * Chrome straight at the file renders it reliably.
 */
execFileSync(
  CHROME,
  [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--screenshot=' + png,
    '--window-size=1500,1000',
    '--default-background-color=FFFFFFFF',
    'file://' + abs,
  ],
  { stdio: 'ignore' },
);

const img = PNG.sync.read(fs.readFileSync(png));
let minX = img.width, minY = img.height, maxX = -1, maxY = -1;

for (let y = 0; y < img.height; y++) {
  for (let x = 0; x < img.width; x++) {
    const i = (img.width * y + x) << 2;
    const [r, g, b] = [img[i], img[i + 1], img[i + 2]];
    // Treat near-white as background so anti-aliased edges do not inflate the box.
    if (r > 244 && g > 244 && b > 244) continue;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
}

if (maxX < 0) {
  console.error('no ink found — is the file valid SVG?');
  process.exit(1);
}

const w = maxX - minX + 1;
const h = maxY - minY + 1;
console.log(`probe canvas: ${img.width}x${img.height}`);
console.log(`artwork bounds: x ${minX}..${maxX}, y ${minY}..${maxY}`);
console.log(`suggested viewBox: "${minX} ${minY} ${w} ${h}"`);
console.log(`suggested width=${w} height=${h}`);
console.log(`artwork occupies ${((w / img.width) * 100).toFixed(0)}% wide, ${((h / img.height) * 100).toFixed(0)}% tall`);