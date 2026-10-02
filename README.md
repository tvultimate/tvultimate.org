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
| `team-roster-boise.jpg`       | Sawtooth on a park field, foothills behind         |
| `youth-coaching.jpg`          | A youth player taking instruction                  |
| `aerial-circle.jpg`           | Overhead drone shot of players in a circle         |
| `boise-landscape-mark.png`    | Boise cityscape in line art                       |

**The Battle of Idaho pages carry no photography.** The four images that were on
the old tournament page were lost with the archive, and every sports image we
did recover is Sawtooth club-team photography. Rather than present a club photo
as tournament imagery, that page is typographic and leads with the sponsor wall.

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