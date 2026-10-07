# Treasure Valley Ultimate

Astro site for Treasure Valley Ultimate Inc., a 501(c)(3) non-profit growing
Ultimate Frisbee across Idaho's Treasure Valley.

## Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build the production site to `./dist/`            |
| `npm run preview`         | Preview the production build locally             |
| `npm test`                | Audit the build — run this before every commit   |
| `npm run test:dev`        | Audit a running dev server instead               |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

The dev server also runs in background mode: `astro dev --background`, then
`astro dev stop`, `astro dev status`, and `astro dev logs`.

Live reload is on via Vite HMR. Editing `src/data/*.ts` triggers a full reload;
editing a component or stylesheet hot-updates in place.

`npm test` builds, serves the build, and drives headless Chrome over every route at
six viewport widths. It checks text contrast by sampling the pixels actually painted
behind each run of text, then container overflow, text truncation, squished mobile
columns, primary-nav popovers, document structure, image loading, tap targets, and
console errors. See `scripts/test.mjs` for the details and
`AGENTS.md` for the rules it enforces.

## Pages

The structure mirrors the previous site, and keeps its URLs so existing links
continue to work.

| URL                                              | Page                        |
| :----------------------------------------------- | :-------------------------- |
| `/`                                               | Home                        |
| `/partner-clubs/`                                 | Partner Information         |
| `/partner-clubs/sawtooth-ultimate/`               | Sawtooth Ultimate           |
| `/battle-of-idaho/`                               | 2026 Battle of Idaho        |
| `/battle-of-idaho/battle-of-idaho-sponsorship/`   | Battle of Idaho Sponsorship |
| `/youth-community/`                               | Youth & Community           |
| `/resources-and-media/`                           | Resources and Media         |
| `/donations-and-dues/`                            | Donations Information        |
| `/donations-and-dues/general-donation/`           | General Donation            |
| `/donations-and-dues/youth-donations/`            | Youth Donations             |
| `/donations-and-dues/sawtooth-donations/`         | Sawtooth Donations          |
| `/donations-and-dues/team-dues/`                  | Team Dues                   |

## Project structure

```
src/
├── data/          All copy and content, split by concern
├── styles/        Design tokens, global element styles, island styles
├── components/
│   ├── ui/        Reusable primitives (Card, Button, Section, Grid, Icon, …)
│   ├── sections/  Page-level content blocks
│   ├── react/     Interactive islands
│   ├── SiteHeader.astro
│   └── SiteFooter.astro
├── layouts/
└── pages/         One file per route
```

### Adding or changing content

Almost all copy lives in `src/data/`. Edit those files — not the page
components — to change text, facts, dates, or links. Every donation URL, email
address, and external link is defined once in `src/data/org.ts`.

### Adding a page

1. Add an entry to `navSections` in `src/data/navigation.ts`. Use `children`
   when the page belongs to an existing section, and it will appear in the
   masthead, the sub-navigation bar, the mobile menu, and the footer index.
2. Create the route file under `src/pages/`.
3. Build the page from `BaseLayout`, `PageHero`, and the `ui/` primitives.

### Navigation

`src/data/navigation.ts` is the single source of truth. The masthead reads
`Astro.url` to work out the active section and which sub-navigation to show, so
no navigation state is threaded through props.

The active section is deliberately `undefined` on the home page: being on the
home page means no section is selected, rather than defaulting to the first
entry and falsely highlighting it.

### Donation fund pages

The four donation pages all render from `FundPage.astro`, driven by an entry in
`src/data/funds.ts`. Adding a fund means adding one object there plus a short
route wrapper — no layout work.

## Design system

All visual constants live in `src/styles/tokens.css` as CSS custom properties.
Components consume those tokens rather than hard-coding values, so the site can
be re-themed by editing one file. See the Code Standards section of `AGENTS.md`.

### Action hierarchy

Three weights, and a section should have at most one `solid`:

| Variant            | Use                                             |
| :----------------- | :---------------------------------------------- |
| `variant="solid"`  | The one real call to action on a screen          |
| `variant="outline"`| A real alternative, one step down                |
| `variant="quiet"`  | A tertiary action                                |

All three are defined in tokens (`--btn-solid-*`, `--btn-outline-*`,
`--btn-quiet-*`), so `.on-inverse` re-themes all of them at once. That is why
there is no "inverse" button variant: a button on a dark ground is
`variant="solid"`, not a different component.

Two Astro-specific gotchas worth knowing:

- Scoped styles do not reach into child components' markup. To style an element
  rendered by a child, the parent must write `:global(.class)`.
- `ui/Icon.astro` sizes its own SVG. An unsized SVG fills its container, so
  owning the default means a caller can only shrink an icon, never enlarge it.

## Assets

Brand images in `public/img/` were recovered from the archived previous site.
**Read `public/img/manifest.json` before placing one** — it records what each
image depicts, the page it came from, and the pages where it is contextually
accurate (`contexts`), plus pages where it would mislead (`explicitlyNot`).

Filenames describe the subject, not where the image sat on the old site. The
previous pass named them by position (`program-events.jpg`), which is how a
club-team photo came to be labelled as tournament imagery.

Key images:

| File                          | Shows                                              |
| :---------------------------- | :------------------------------------------------- |
| `logo-tvu.png`                | The organisation mark — a rainbow TVU, Sawtooth ridgeline |
| `logo-tvu-roundel.png`        | Circular TVU badge, alternative treatment          |
| `sawtooth-disc-mark.png`      | Sawtooth mountain-and-disc circle, black line art  |
| `logo-sawtooth-mark.png`      | Sawtooth mark with alpha. Dark grounds only        |
| `logo-erth-beverage-co.png`   | Battle of Idaho sponsor                            |
| `logo-stevenson-real-estate.png` | Battle of Idaho sponsor                         |
| `logo-iccu.svg`               | Battle of Idaho sponsor, converted from EPS        |
| `team-roster-boise.jpg`       | Sawtooth on a park field, foothills behind         |
| `youth-coaching.jpg`          | A youth player taking instruction                  |
| `aerial-circle.jpg`           | Overhead drone shot of players in a circle         |
| `boise-landscape-mark.png`    | Boise cityscape in line art                       |

**The Battle of Idaho pages carry no photography.** The four images that were on
the old tournament page were lost with the archive, and every sports image we
did recover is Sawtooth club-team photography. Rather than present a club photo
as tournament imagery, that page is typographic and leads with the sponsor wall.

### Vector logos

`logo-iccu.svg` is converted from the studio's Illustrator EPS by
`scripts/build-iccu-logo.py`, which parses the drawing section and rewrites the
PostScript paths as SVG. Nothing is rasterised. Two things about that source are
counter-intuitive and are recorded in the build script: the drawing section's
coordinates already read top-down, so honouring the page setup line
(`1 -1 scale 0 -400 translate`) renders the wordmark upside down; and neither of
the two CMYK fills survives a naive CMYK-to-RGB conversion, so the hex values
were sampled from the studio's own PNG export of the same artwork.

`scripts/verify-iccu-logo.mjs` rasterises the built SVG and diffs it against that
export. It is what settles both of the questions above, so **run it after any
change to the build script** — the build calls it automatically when the export
sits beside the source.

## Policies

The published policies and agreements live in `src/data/policies/`, one file per
document, and are rendered by `sections/PolicyDocument.astro` through a single
dynamic route at `src/pages/policies/[slug].astro`. Publishing a document is
therefore a data change, not a new page file, and every document gets an
identical page shape.

| Slug                             | Document                                          |
| :------------------------------- | :------------------------------------------------ |
| `bylaws`                         | Bylaws                                            |
| `board-governance`               | Board Governance, Composition, Appointments, and Removal Policy |
| `club-affiliation-agreement`     | Club Team Affiliation Policy & Partnership Agreement |
| `funds-and-capital-management`   | Organizational Funds & Capital Management Policy   |

Each document is a list of clauses; each clause is a heading plus blocks of
plain text, bullets, or a run-in `Term: explanation` with optional sub-bullets.
That one shape covers all four documents despite their being structured very
differently, and it keeps a clause from drifting away from its neighbours.

**These pages are not in the main navigation.** They are indexed in the footer
and reachable by direct URL, but they are deliberately absent from
`data/navigation.ts`, so they stay out of the masthead, the mobile drawer, and
the sub-navigation bars. Adding a fifth document means adding it to
`data/policies/` only — do not add it to `navSections`.

Heading text inside each document is reproduced verbatim from the adopted
documents, capitals included, because it is part of the legal text. The page
title and the footer label are the presentational layer and are written in title
case.

## Downloads

`public/documents/` holds files a reader takes away rather than pages they visit.
Their paths and labels are registered once in `documents` in `data/org.ts`, so
the link text and the file it points at cannot drift apart. The club partnership
agreement is the only document with a published original today; its page under
`/policies/` and the Partner Clubs page both offer it as a download.

## Donations

Each fund page embeds its Zeffy donation form directly, via Zeffy's
`/embed/donation-form/<slug>` endpoint, so a donor can give without leaving the
site. The page also keeps a plain link to the form on Zeffy as an accessibility
guarantee and as a fallback if the iframe is blocked.

`src/components/react/DonationEmbed.tsx` mounts the frame only when it scrolls
into view — a payment form is the heaviest third-party asset on the site, and
most visitors scroll past it.

The form slug is **derived from the fund's canonical URL** in `data/org.ts`
(`zeffySlug()`) rather than stored separately. An earlier version passed the
fund's internal slug, which silently pointed every embedded form at the wrong
Zeffy form; deriving it means the embed and the outbound link cannot drift.

Zeffy owns the interior of the iframe, so its accent colour is set in the Zeffy
dashboard, not in this repo. What the site themes is the frame and everything
around it — see `src/styles/embed.css`.

## Content notes

- The general contact address appears on the old site as both
  `help@tvultimate.org` and `help@tvutlimate.org` (a transposition). The correct
  address is `help@tvultimate.org`.
- `astro.config.mjs` sets `trailingSlash: 'always'` so routes are served as
  directory indexes without redirects.