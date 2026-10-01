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
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

The dev server also runs in background mode: `astro dev --background`, then
`astro dev stop`, `astro dev status`, and `astro dev logs`.

Live reload is on via Vite HMR. Editing `src/data/*.ts` triggers a full reload;
editing a component or stylesheet hot-updates in place.

## Pages

The site structure mirrors the previous site. URLs keep the original paths so
existing links continue to work.

| URL                                                    | Page                          |
| :----------------------------------------------------- | :---------------------------- |
| `/`                                                     | Home                          |
| `/partner-clubs/`                                       | Partner Information           |
| `/partner-clubs/sawtooth-ultimate/`                     | Sawtooth Ultimate             |
| `/battle-of-idaho/`                                     | 2026 Battle of Idaho          |
| `/battle-of-idaho/battle-of-idaho-sponsorship/`         | Battle of Idaho Sponsorship   |
| `/youth-community/`                                     | Youth & Community             |
| `/resources-and-media/`                                 | Resources and Media           |
| `/donations-and-dues/`                                  | Donations Information          |
| `/donations-and-dues/general-donation/`                 | General Donation              |
| `/donations-and-dues/youth-donations/`                  | Youth Donations               |
| `/donations-and-dues/sawtooth-donations/`               | Sawtooth Donations            |
| `/donations-and-dues/team-dues/`                        | Team Dues                     |

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

### Donation fund pages

The four donation pages all render from `FundPage.astro`, driven by an entry in
`src/data/funds.ts`. Adding a fund means adding one object there plus a short
route wrapper — no layout work.

### Design system

All visual constants live in `src/styles/tokens.css` as CSS custom properties.
Components consume those tokens rather than hard-coding values, so the site can
be re-themed by editing one file. See the Code Standards section of `AGENTS.md`.

One caveat worth knowing: Astro scopes styles per component, so a parent's
class selector does **not** apply to markup rendered inside a child component
(unless the child opts out with `is:global`). `ui/Icon.astro` sizes itself so an
unstyled icon can never fill its container; any caller overriding it must write
`:global(.their-class)`.

## Assets

Brand images in `public/img/` were migrated from the previous site, recovered
via the Wayback Machine because the originals were served from infrastructure
that blocks direct hotlinking.

- `tvu-logo.png` / `tvu-logo-sm.png` — the Treasure Valley Ultimate mark
- `sawtooth-logo-mark.png` — the Sawtooth mark, converted to transparency
  (dark-ground use only)
- `boise-skyline-black.png` — Boise skyline silhouette
- `team-photo.jpg`, `team-huddle.jpg` — Sawtooth photography
- `action-lay.jpg`, `drone-circle.jpg` — tournament and aerial photography

## Content notes

- The general contact address appears on the old site as both
  `help@tvultimate.org` and `help@tvutlimate.org` (a transposition). The correct
  address is `help@tvultimate.org`.
- `astro.config.mjs` sets `trailingSlash: 'always'` so routes are served as
  directory indexes without redirects.