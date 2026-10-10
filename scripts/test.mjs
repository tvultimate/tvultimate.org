/**
 * Automated quality gates. Run before committing.
 *
 *   npm run build && npm test              # builds, previews, tests
 *   npm run test:dev                       # tests the running dev server
 *
 * Checks every route at six viewport widths:
 *   1. Contrast  — samples the pixels actually painted behind each run of text
 *                  and compares them to the text's computed colour. Sampling
 *                  rather than parsing `background-color` is what makes this
 *                  trustworthy: it is correct through oklab()/color-mix(),
 *                  gradients, backdrop-filter and images, all of which a
 *                  static check either misses or gets wrong.
 *   2. Overflow  — elements escaping their parent, exempting anything inside a
 *                  deliberate clip or scroll container.
 *   3. Structure — one h1, no skipped heading levels, no duplicate ids, images
 *                  sized and alt'd and actually loading, labelled controls,
 *                  tap-target size on small screens.
 *   4. Console   — page and console errors.
 */

import { spawn } from 'node:child_process';
import { PNG } from 'pngjs';
import process from 'node:process';

const CHROME =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const AA = 4.5;
const AA_LARGE = 3;

const WIDTHS = [320, 390, 768, 1024, 1280, 1440];

const ROUTES = [
  '/',
  '/partner-clubs/',
  '/partner-clubs/sawtooth-ultimate/',
  '/battle-of-idaho/',
  '/battle-of-idaho/battle-of-idaho-sponsorship/',
  // Google Ads landing pages. Unlinked from the navigation, audited like any
  // other route.
  '/battle-of-idaho/free-agent/',
  '/battle-of-idaho/youth-open/',
  '/battle-of-idaho/register-a-team/',
  '/youth-community/',
  '/resources-and-media/',
  '/donations-and-dues/',
  '/donations-and-dues/general-donation/',
  '/donations-and-dues/youth-donations/',
  '/donations-and-dues/sawtooth-donations/',
  '/donations-and-dues/team-dues/',
  // Policy pages. Not in the main navigation, but audited like any other route.
  '/policies/bylaws/',
  '/policies/board-governance/',
  '/policies/club-affiliation-agreement/',
  '/policies/funds-and-capital-management/',
];

/*
 * The built 404 page is a static artifact served at /404/, so a static host
 * returns 200 for it. Audit it as a normal page and separately assert that a
 * genuinely missing URL 404s.
 */
const NOT_FOUND_PAGE = '/404/';
const MISSING_ROUTE = '/this-route-does-not-exist/';

const argBase = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function startServer() {
  if (argBase) return { base: argBase, stop: async () => {} };

  const port = 4399;
  const child = spawn('npx', ['astro', 'preview', '--port', String(port)], {
    stdio: 'ignore',
  });

  const base = `http://localhost:${port}`;
  for (let i = 0; i < 60; i += 1) {
    try {
      if ((await fetch(`${base}/`)).ok) {
        return { base, stop: async () => child.kill() };
      }
    } catch {
      /* not up yet */
    }
    await sleep(500);
  }
  child.kill();
  throw new Error('preview server did not start');
}

/* Runs in the page: reports text runs, geometry, and structural issues. */
const INSPECT = `(() => {
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));

  /* Parse any CSS colour the browser computed, whatever the colour space. */
  const probe = document.createElement('span');
  document.body.appendChild(probe);
  const toRGB = (value) => {
    probe.style.color = 'rgb(1, 2, 3)';
    probe.style.color = value;
    const resolved = getComputedStyle(probe).color;
    const m = resolved.match(/[-\\d.]+/g);
    if (!m || m.length < 3) return null;
    return { r: +m[0], g: +m[1], b: +m[2], a: m.length > 3 ? +m[3] : 1 };
  };

  const describe = (el) => {
    const cls =
      el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.')
        : '';
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + cls;
  };

  const CLIPPING = ['auto', 'scroll', 'hidden', 'clip'];
  /* True if this element or any ancestor deliberately contains overflow. */
  const contained = (el) => {
    let node = el.parentElement;
    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      if (CLIPPING.includes(cs.overflowX)) return true;
      node = node.parentElement;
    }
    return false;
  };

  const texts = [];
  const overflow = [];
  const structure = [];
  const truncated = [];
  const squished = [];
  const disclosures = [];

  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (Number(cs.opacity) === 0) continue;
    // A collapsed <details> is not painted, so neither its computed styles nor
    // the screenshot describe how it looks when open.
    if (el.closest('details:not([open])')) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;

    const own = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim();

    if (own) {
      const fg = toRGB(cs.color);
      texts.push({
        el: describe(el),
        text: own.slice(0, 60),
        x: r.left, y: r.top, w: r.width, h: r.height,
        size: parseFloat(cs.fontSize),
        weight: Number(cs.fontWeight) || 400,
        fg: fg ? { r: clamp(fg.r), g: clamp(fg.g), b: clamp(fg.b), a: fg.a } : null,
        scrollY: window.scrollY,
      });
    }

    if (!contained(el) && !CLIPPING.includes(cs.overflowX)) {
      const parent = el.parentElement;
      // \`display: contents\` elements (Astro's <astro-island>, and similar)
      // generate no box at all, so they have no width to overflow.
      if (parent && getComputedStyle(parent).display !== 'contents') {
        const pw = parent.getBoundingClientRect().width;
        if (r.width > pw + 1) {
          overflow.push({
            el: describe(el),
            w: Math.round(r.width),
            parent: describe(parent),
            parentW: Math.round(pw),
          });
        }
      }
    }
  }

  const vw = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth > vw + 1) {
    overflow.push({ el: 'document', w: document.documentElement.scrollWidth, parent: 'viewport', parentW: vw });
  }

  /* ---- truncation ----
   * Any box that hides overflow and actually clips its own text is silently
   * dropping words. text-overflow:ellipsis makes it look deliberate, which is
   * exactly why it survives review. Opt out per element with a
   * data-allow-truncation attribute if truncation is genuinely the intent.
   */
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('details:not([open])')) continue;
    if (el.hasAttribute('data-allow-truncation')) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (!['hidden', 'clip'].includes(cs.overflowX)) continue;
    // Visually-hidden text is one or two pixels wide by definition.
    if (el.clientWidth <= 2) continue;
    const over = el.scrollWidth - el.clientWidth;
    if (over <= 1) continue;
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    if (!text) continue;
    // Tagged so CONFIRM_TRUNCATION can re-measure with the glyphs hidden and
    // prove the overflow came from text. A box that clips a decorative child,
    // such as a bleed-to-the-edges hero graphic, also reports a scrollWidth
    // past its clientWidth and would otherwise look exactly like elided copy.
    el.setAttribute('data-audit-trunc', String(truncated.length));
    truncated.push({
      el: describe(el),
      text: text.slice(0, 60),
      visible: el.clientWidth,
      needed: el.scrollWidth,
      lost: over,
      ellipsis: cs.textOverflow === 'ellipsis',
      nowrap: cs.whiteSpace === 'nowrap',
    });
  }

  /* ---- squished layout ----
   * Mobile layouts stack to one column, so a block holding real copy that is
   * far narrower than the viewport means a track collapsed rather than the
   * design intending a narrow column. Narrow boxes only count when they hold a
   * substantial amount of text, which keeps shrink-to-fit inline boxes (button
   * labels, eyebrows, a short heading) out of the report. Elements that elide
   * their own text are left to the truncation check.
  */
  const vwNow = document.documentElement.clientWidth;
  if (vwNow < 768) {
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('details:not([open])')) continue;
      if (el.hasAttribute('data-audit-trunc')) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (cs.display === 'contents' || cs.display.startsWith('inline')) continue;
      if (cs.position === 'absolute' || cs.position === 'fixed') continue;
      if (!['block', 'flow-root', 'flex', 'grid', 'list-item'].includes(cs.display)) {
        continue;
      }
      const r = el.getBoundingClientRect();
      if (r.width <= 2) continue;

      const text = el.textContent.replace(/\s+/g, ' ').trim();
      if (text.length < 24) continue;

      // A squished column is narrow against the viewport and narrower still
      // against its own parent, so a wide ancestor cannot explain it.
      const parent = el.parentElement;
      if (!parent) continue;
      const pw = parent.getBoundingClientRect().width;
      if (pw === 0) continue;
      if (r.width > vwNow * 0.3 || r.width > pw * 0.6) continue;

      squished.push({
        el: describe(el),
        text: text.slice(0, 48),
        w: Math.round(r.width),
        parent: describe(parent),
        parentW: Math.round(pw),
        vw: vwNow,
      });
    }
  }

  /* ---- disclosure panels ----
   * A primary navigation disclosure should be a full-bleed panel that pushes
   * the page down. Positioned absolutely it becomes a floating popover that
   * covers whatever it lands on and never gets the width to lay out in.

   * Measured on the element that actually holds the links, not on the
   * <details> itself: the disclosure can be full width and static while its
   * panel inside is a 22rem popover, which is the same defect one level down.
  */
  for (const d of document.querySelectorAll('details')) {
    const label =
      d.getAttribute('aria-label') ||
      d.querySelector('summary')?.textContent ||
      '';
    if (!/menu|navigation|nav\b/i.test(label)) continue;

    const dcs = getComputedStyle(d);
    if (dcs.display === 'none' || d.getBoundingClientRect().width === 0) continue;

    let panel = null;
    let best = -1;
    for (const candidate of d.querySelectorAll('*')) {
      const n = candidate.querySelectorAll('a').length;
      if (n > best) {
        best = n;
        panel = candidate;
      }
    }
    if (!panel) continue;

    const cs = getComputedStyle(panel);
    const r = panel.getBoundingClientRect();
    const vwPanel = document.documentElement.clientWidth;
    disclosures.push({
      el: describe(panel),
      label: label.replace(/\s+/g, ' ').trim().slice(0, 40),
      position: cs.position,
      w: Math.round(r.width),
      vw: vwPanel,
    });
  }

  /* ---- structure ---- */
  const h1s = document.querySelectorAll('h1');
  if (h1s.length !== 1) structure.push({ kind: 'h1-count', detail: String(h1s.length) });

  let prev = 0;
  for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
    const lvl = +h.tagName[1];
    if (prev && lvl > prev + 1) {
      structure.push({ kind: 'heading-skip', detail: 'h' + prev + ' -> h' + lvl + ' at "' + h.textContent.trim().slice(0, 32) + '"' });
    }
    prev = lvl;
  }

  const seen = new Map();
  for (const el of document.querySelectorAll('[id]')) {
    seen.set(el.id, (seen.get(el.id) || 0) + 1);
  }
  for (const [id, n] of seen) {
    if (n > 1) structure.push({ kind: 'duplicate-id', detail: id + ' x' + n });
  }

  for (const img of document.querySelectorAll('img')) {
    const src = img.getAttribute('src');
    if (!img.hasAttribute('alt')) structure.push({ kind: 'img-missing-alt', detail: src });
    if (img.complete && img.naturalWidth === 0) structure.push({ kind: 'img-broken', detail: src });
    if (!img.getAttribute('width') || !img.getAttribute('height')) {
      structure.push({ kind: 'img-no-dimensions', detail: src });
    }
  }

  /*
   * A use element is the other way this site loads artwork: the Sawtooth logo is
   * a symbol inside an external sprite. An img check cannot see it. A use whose
   * fragment does not exist renders an empty box, silently, and the page still
   * looks structurally sound. Collect the references here; the target lookup
   * and the painted-pixel proof both need the network and the screenshot
   * buffer, so they run in Node (see auditUses below).
   */
  const uses = [];
  for (const host of document.querySelectorAll('svg:has(use)')) {
    const refs = [...host.querySelectorAll('use')].map(
      (u) => u.getAttribute('href') || u.getAttribute('xlink:href') || '',
    );
    uses.push({
      refs,
      cls: host.getAttribute('class') || 'svg',
      label: host.getAttribute('aria-label') || '',
      box: (() => {
        const r = host.getBoundingClientRect();
        return [Math.round(r.width), Math.round(r.height)];
      })(),
    });
  }

  for (const el of document.querySelectorAll('input,select,textarea')) {
    const id = el.id;
    const ok =
      (id && document.querySelector('label[for="' + CSS.escape(id) + '"]')) ||
      el.closest('label') ||
      el.getAttribute('aria-label') ||
      el.getAttribute('aria-labelledby');
    if (!ok) structure.push({ kind: 'unlabelled-control', detail: el.tagName + (id ? '#' + id : '') });
  }

  if (vw < 640) {
    for (const el of document.querySelectorAll('a[href],button,summary')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (getComputedStyle(el).display.startsWith('inline')) continue;
      if (r.height < 24 || r.width < 24) {
        structure.push({ kind: 'small-tap-target', detail: describe(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height) });
      }
    }
  }

  probe.remove();
  return { texts, overflow, structure, truncated, squished, disclosures, uses, scrollY: window.scrollY, vw };
})()`;

/*
 * `<use>` audit, run in Node because it needs the network and pixel buffers.
 *
 * Two independent proofs, because each catches what the other misses:
 *
 *   1. The fragment resolves to a real element in the referenced file. Catches
 *      a renamed id, a sprite that 404s, or a typo in the `href`.
 *   2. The host `<svg>` actually painted opaque pixels. Catches everything the
 *      first cannot see — a symbol that resolves but whose paths are all
 *      clipped away, or a fill that resolves to nothing.
 *
 * Proof 2 is the one that matters. Proof 1 alone passes for a symbol whose
 * geometry is invisible, which is precisely the "check that never runs but
 * still reports PASS" failure this suite exists to prevent.
 */
async function auditUses(page, uses) {
  const problems = [];
  for (const use of uses) {
    if (use.refs.length === 0) {
      problems.push({ kind: 'use-no-href', detail: use.cls });
      continue;
    }
    for (const ref of use.refs) {
      if (!ref) {
        problems.push({ kind: 'use-no-href', detail: use.cls });
        continue;
      }
      const hash = ref.indexOf('#');
      if (hash === -1) {
        problems.push({ kind: 'use-no-fragment', detail: ref });
        continue;
      }
      const file = ref.slice(0, hash);
      const fragment = ref.slice(hash + 1);
      if (!file) continue; // Same-document; the page-side check covers it.
      try {
        const res = await fetch(new URL(file, server.base));
        if (!res.ok) {
          problems.push({ kind: 'use-target-unreachable', detail: `${ref} ${res.status}` });
          continue;
        }
        const text = await res.text();
        const target = parseTarget(text, fragment);
        if (!target.found) {
          problems.push({ kind: 'use-missing-target', detail: ref });
        } else if (target.drawable === 0) {
          /*
           * The id resolves, so proof 1 passes, yet there is nothing to draw.
           * A group emptied of its paths, or a symbol whose only content is
           * hidden, is invisible in the browser and no status code reports it.
           */
          problems.push({
            kind: 'use-target-empty',
            detail: `${ref} (${target.drawable} drawable nodes)`,
          });
        }
      } catch (err) {
        problems.push({ kind: 'use-target-unreachable', detail: `${ref} ${err.message}` });
      }
    }

    const [w, h] = use.box;
    if (w < 2 || h < 2) {
      problems.push({ kind: 'use-zero-size', detail: `${use.cls} ${w}x${h}` });
      continue;
    }

    /*
     * Measure the artwork, not the furniture around it.
     *
     * `omitBackground` only drops the page background. A logo that sits on its
     * own coloured plate has that plate as the element's own background, which
     * would keep the pixel count above zero and mask a logo that paints nothing
     * at all. So the host's background, padding and shadow are neutralised for
     * the duration of the shot, then restored.
     */
    const style = await page.addStyleTag({
      content:
        'svg:has(use){background:none!important;padding:0!important;' +
        'box-shadow:none!important;border:0!important}',
    });
    const handle = await page
      .locator(`svg${cssEscapeClass(use.cls)}`)
      .first()
      .elementHandle();
    const shot = await handle?.screenshot({ omitBackground: true }).catch(() => null);
    await style.evaluate((el) => el.remove()).catch(() => {});
    if (!shot) continue;
    const { PNG } = await import('pngjs');
    const png = PNG.sync.read(shot);
    let opaque = 0;
    for (let i = 3; i < png.data.length; i += 4) {
      if (png.data[i] > 8) opaque += 1;
    }
    if (opaque === 0) {
      problems.push({
        kind: 'use-paints-nothing',
        detail: `${use.cls} ${use.refs.join(' ')}`,
      });
    }
  }
  return problems;
}

/**
 * Find a symbol or group by id in an SVG source string and count the nodes in
 * it that can actually paint.
 *
 * Counted as drawable: path, rect, circle, ellipse, line, polyline, polygon,
 * text, image, and a nested use. Excluded: anything explicitly hidden via
 * `display="none"`, an inline `opacity="0"`, or a `visibility="hidden"`,
 * because a caller hiding the artwork is a legitimate thing to do and the
 * browser will honour it silently.
 *
 * This is a structural read of the file, not a layout. It cannot see a path
 * clipped entirely out of view by a clipPath — nothing short of rendering can
 * — but it does catch the common failure of a symbol that resolves to nothing.
 */
function parseTarget(text, id, depth = 0) {
  // A self-referential sprite would otherwise recurse forever.
  if (depth > 8) return { found: true, drawable: 1 };
  const idPattern = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const first = new RegExp(`<(\\w+)\\b[^>]*\\sid="${idPattern}"[^>]*>`).exec(text);
  if (!first) return { found: false, drawable: 0 };

  const tag = first[1];
  // Self-closing with an id has no children to draw.
  if (/\/>$/.test(first[0])) return { found: true, drawable: 0 };

  /*
   * The target's own attributes hide its children too. `sawtooth-mark` marked
   * `opacity="0"` is a group of perfectly normal paths that paint nothing, so
   * the check has to start here rather than at each descendant.
   */
  if (isHidden(first[0])) return { found: true, drawable: 0 };

  /*
   * Slice to this element's own matching close tag, tracking nesting of the
   * same tag name. A plain indexOf of the first closing tag would stop at an
   * inner `</g>` — the mark's paths are wrapped in a nested group, so that
   * would truncate the body and under-count it to a single path.
   */
  const tagOpen = new RegExp(`<${tag}\\b`, 'g');
  const tagClose = new RegExp(`</${tag}\\s*>`, 'g');
  let nest = 1;
  let end = -1;
  let cursor = first.index + first[0].length;
  while (nest > 0) {
    tagOpen.lastIndex = cursor;
    tagClose.lastIndex = cursor;
    const nextOpen = tagOpen.exec(text);
    const nextClose = tagClose.exec(text);
    if (!nextClose) return { found: true, drawable: 0 };
    if (nextOpen && nextOpen.index < nextClose.index) {
      nest += 1;
      cursor = nextOpen.index + nextOpen[0].length;
    } else {
      nest -= 1;
      end = nextClose.index;
      cursor = nextClose.index + nextClose[0].length;
    }
  }
  const body = text.slice(first.index + first[0].length, end);

  /*
   * Count drawable nodes, honouring hidden ancestors.
   *
   * `hiddenUpTo` is the index of the nearest enclosing start tag above `body`
   * that hides its contents. Without it a group marked `opacity="0"` still
   * reports its children as drawable, because each path's own opening tag looks
   * perfectly normal — the hiding is on the parent. So before counting, check
   * every ancestor from the target down to each node.
   */
  const matches = [...body.matchAll(/<(path|rect|circle|ellipse|line|polyline|polygon|text|image)\b/g)];
  let drawable = 0;
  for (const m of matches) {
    if (isHidden(openTagAt(text, m.index))) continue;
    if (hasHiddenAncestor(text, first.index, m.index, tag, depth)) continue;
    drawable += 1;
  }

  /*
   * Resolve nested use references, or the count is meaningless: a symbol whose
   * entire content is one `<use href="#some-group">` would score zero even
   * though that group is full of paths. Composition has to be followed, not
   * just the first level.
   */
  const nested = [...body.matchAll(/<use\b[^>]*\bhref="#([^"]+)"/g)];
  for (const m of nested) {
    const openTag = openTagAt(text, m.index);
    if (isHidden(openTag)) continue;
    if (hasHiddenAncestor(text, first.index, m.index, tag, depth)) continue;
    const child = parseTarget(text, m[1], depth + 1);
    if (!child.found) continue; // Reported by its own reference, not here.
    drawable += child.drawable;
  }

  return { found: true, drawable };
}

/**
 * True if any start tag strictly between `from` and `to` hides its contents.
 * Scans backwards for `<g>`-like openers and checks each one's attributes, so a
 * hidden wrapper group cannot hide the fact that its children are drawable.
 */
function hasHiddenAncestor(text, from, to, tag, depth) {
  if (depth > 8) return false;
  const inner = text.slice(from, to);
  const openers = [...inner.matchAll(/<(\w+)\b[^>]*?(?<!\/)>/g)];
  for (const o of openers) {
    if (o[1] === tag && o.index === 0) continue; // The target itself.
    if (isHidden(o[0])) return true;
  }
  return false;
}

function openTagAt(text, index) {
  const end = text.indexOf('>', index);
  return end === -1 ? '' : text.slice(index, end + 1);
}

function isHidden(openTag) {
  return (
    /display\s*=\s*"none"/.test(openTag) ||
    /visibility\s*=\s*"hidden"/.test(openTag) ||
    /opacity\s*=\s*"0(\.0+)?"/.test(openTag)
  );
}

/** Turn a class attribute into a CSS class selector, e.g. "a b" -> ".a.b". */
function cssEscapeClass(value) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((c) => `.${c.replace(/([^\w-])/g, '\\$1')}`)
    .join('');
}

const server = await startServer();
const { chromium } = await import('playwright-core');
const browser = await chromium.launch({ executablePath: CHROME });

const lum = ({ r, g, b }) => {
  const f = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
};

const over = (fg, bg) => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a),
});

const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const failures = [];
let checks = 0;

/*
 * Samples the pixels painted behind a box.
 *
 * The caller hides every glyph first (see HIDE_TEXT), so these reads hit
 * background only. Points sit at the midpoints of the four edges rather than
 * the corners, because a rounded box's corners lie outside its own fill and
 * would read whatever is behind the box instead.
 */
function sampleBackground(png, box, dpr) {
  const px = (x, y) => {
    const ix = Math.round(x * dpr);
    const iy = Math.round(y * dpr);
    if (ix < 0 || iy < 0 || ix >= png.width || iy >= png.height) return null;
    const i = (png.width * iy + ix) << 2;
    return { r: png.data[i], g: png.data[i + 1], b: png.data[i + 2] };
  };


  const cy = box.y + box.h / 2;
  const cx = box.x + box.w / 2;
  const samples = [
    px(box.x + 1, cy),
    px(box.x + box.w - 1, cy),
    px(cx, box.y + 1),
    px(cx, box.y + box.h - 1),
  ].filter(Boolean);

  if (samples.length === 0) return null;

  // Median per channel, so one border or stray pixel cannot skew it.
  const channel = (key) => {
    const values = samples.map((s) => s[key]).sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  };

  return { r: channel('r'), g: channel('g'), b: channel('b') };
}

/*
 * Decides which truncation candidates really are dropping words.
 *
 * Making glyphs transparent is not enough: they still occupy layout width, so
 * scrollWidth does not change and every candidate looks confirmed. This strips
 * the text nodes out of each candidate and its descendants, re-measures, and
 * puts them back. A box that still overflows was clipping a decorative child;
 * one that stops overflowing was clipping its own copy.
 *
 * Must run after the contrast screenshot, since removing text reflows the page.
 */
const CONFIRM_TRUNCATION = `(() => {
  const out = [];
  for (const el of document.querySelectorAll('[data-audit-trunc]')) {
    const index = Number(el.getAttribute('data-audit-trunc'));
    const stripped = [];
    for (const node of [el, ...el.querySelectorAll('*')]) {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === 3 && child.textContent.trim()) {
          stripped.push([node, child]);
          child.remove();
        }
      }
    }
    out.push({ index, stillOver: el.scrollWidth - el.clientWidth });
    for (const [node, child] of stripped) node.appendChild(child);
  }
  for (const el of document.querySelectorAll('[data-audit-trunc]')) {
    el.removeAttribute('data-audit-trunc');
  }
  return out;
})()`;

/*
 * Makes every glyph invisible without disturbing layout, so one extra
 * screenshot gives the true backdrop of every text run. Deliberately not done
 * with `color: transparent`, which would also blank any border or background
 * declared as currentColor.
 */
const HIDE_TEXT = `
  *, *::before, *::after {
    text-shadow: none !important;
    -webkit-text-fill-color: transparent !important;
  }
`;

try {
  for (const width of WIDTHS) {
    const dpr = 1;
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      deviceScaleFactor: dpr,
    });

    for (const route of [...ROUTES, NOT_FOUND_PAGE]) {
      const consoleErrors = [];
      page.removeAllListeners('pageerror');
      page.removeAllListeners('console');
      page.on('pageerror', (e) => consoleErrors.push(String(e).slice(0, 140)));
      page.on('console', (m) => {
        if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 140));
      });

      const res = await page.goto(server.base + route, { waitUntil: 'load' });
      await page.waitForTimeout(700);

      const expected = 200;
      checks += 1;
      if (!res || res.status() !== expected) {
        failures.push(`[${width}] ${route}: status ${res?.status()}, expected ${expected}`);
      }

      const where = `[${width}] ${route}`;
      const { texts, overflow, structure, truncated, squished, disclosures, uses, scrollY } =
        await page.evaluate(INSPECT);

      /*
       * Audited here, before HIDE_TEXT blanks the glyphs and before sampling
       * reflows the page, so each `use` host is screenshotted as the visitor
       * would see it.
       */
      for (const p of await auditUses(page, uses)) {
        checks += 1;
        failures.push(`${where}: ${p.kind} — ${p.detail}`);
      }

      // Layout is now known; blank the glyphs so the pixels behind each text
      // run are unambiguous, then read the backdrop from that screenshot.
      await page.addStyleTag({ content: HIDE_TEXT });
      await page.waitForTimeout(120);
      const shot = PNG.sync.read(await page.screenshot({ fullPage: true }));
      // After sampling, because stripping text reflows the page.
      const truncationProof = await page.evaluate(CONFIRM_TRUNCATION);
      const isTextClipped = new Map(
        truncationProof.map((c) => [c.index, c.stillOver <= 1]),
      );
      await page.evaluate(() => {
        for (const el of document.querySelectorAll('style')) {
          if (el.textContent.includes('-webkit-text-fill-color')) el.remove();
        }
      });

      for (const t of texts) {
        if (!t.fg) continue;
        const bg = sampleBackground(
          shot,
          { x: t.x, y: t.y + scrollY, w: t.w, h: t.h },
          dpr,
        );
        if (!bg) continue;

        const large = t.size >= 24 || (t.size >= 18.66 && t.weight >= 700);
        const need = large ? AA_LARGE : AA;
        const r = ratio(t.fg.a < 1 ? over(t.fg, bg) : t.fg, bg);
        checks += 1;
        if (r < need) {
          failures.push(
            `${where}: contrast ${r.toFixed(2)}:1 (needs ${need}) — ${t.el} ` +
              `${t.size.toFixed(0)}px/${t.weight} "${t.text}" ` +
              `fg=rgb(${t.fg.r},${t.fg.g},${t.fg.b}) ` +
              `bg=rgb(${bg.r},${bg.g},${bg.b})`,
          );
        }
      }

      for (const o of overflow) {
        checks += 1;
        failures.push(
          `${where}: overflow — ${o.el} is ${o.w}px inside ${o.parent} (${o.parentW}px)`,
        );
      }

      for (const s of structure) {
        checks += 1;
        failures.push(`${where}: ${s.kind} — ${s.detail}`);
      }

      for (const [index, t] of truncated.entries()) {
        if (!isTextClipped.get(index)) continue;
        checks += 1;
        failures.push(
          `${where}: truncated — ${t.el} clips ${t.lost}px of its own text ` +
            `(${t.visible}px shown, ${t.needed}px needed` +
            `${t.ellipsis ? ', text-overflow: ellipsis' : ''}` +
            `${t.nowrap ? ', white-space: nowrap' : ''}) "${t.text}"`,
        );
      }

      for (const q of squished) {
        checks += 1;
        failures.push(
          `${where}: squished — ${q.el} is ${q.w}px in a ${q.vw}px viewport ` +
            `(${q.parent} is ${q.parentW}px) "${q.text}"`,
        );
      }

      if (width < 768) {
        for (const d of disclosures) {
          checks += 1;
          if (d.position !== 'static' && d.w < d.vw - 1) {
            failures.push(
              `${where}: nav popover — ${d.el} ("${d.label}") is ` +
                `${d.position} and only ${d.w}px wide in a ${d.vw}px viewport; ` +
                `a primary menu should span the viewport and push content down`,
            );
          }
        }
      }

      if (consoleErrors.length) {
        checks += 1;
        failures.push(`${where}: console — ${consoleErrors.join(' | ')}`);
      }
    }

    /* A URL that does not exist must actually 404.
     *
     * Asserted with `fetch`, not `page.goto`: Playwright throws on an error
     * status rather than returning the response, and the thrown error does not
     * carry the status code. */
    const missing = await fetch(server.base + MISSING_ROUTE, {
      redirect: 'manual',
    });
    checks += 1;
    if (missing.status !== 404) {
      failures.push(
        `[${width}] ${MISSING_ROUTE}: status ${missing.status}, expected 404`,
      );
    }

    await page.close();
  }
} finally {
  await browser.close();
  await server.stop();
}

const unique = [...new Set(failures)];

if (unique.length === 0) {
  console.log(
    `PASS — ${checks} checks across ${ROUTES.length} routes x ${WIDTHS.length} widths`,
  );
  process.exit(0);
}

console.log(`FAIL — ${unique.length} distinct problems (${failures.length} total)\n`);

// Group by kind so the summary reads as a worklist, not a wall of text.
const byKind = new Map();
for (const f of unique) {
  /*
   * Take the kind from the message itself rather than sniffing for keywords.
   * Sniffing misfiled truncation as overflow, because a truncation message
   * quotes `text-overflow: ellipsis` and so contains the word "overflow".
   */
  const tagged = f.match(/^\[\d+\] \S+: ([a-z-]+)/);
  const word = tagged ? tagged[1] : '';
  const kind =
    word === 'nav' ? 'nav-popover'
    : word === 'status' ? 'http'
    : ['contrast', 'overflow', 'truncated', 'squished', 'console'].includes(word)
      ? word
      : 'structure';
  if (!byKind.has(kind)) byKind.set(kind, []);
  byKind.get(kind).push(f);
}

for (const [kind, items] of byKind) {
  console.log(`--- ${kind} (${items.length})`);
  for (const item of items) console.log('  ' + item);
  console.log('');
}

process.exit(1);