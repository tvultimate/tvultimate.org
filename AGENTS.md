## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Code Standards

### Mobile first

Every layout is designed for a small screen first. Use unstyled-by-default flow layouts that
naturally stack, then layer on wider screens with `min-width` media queries. Never write a
`max-width` media query. Test at 320px first; verify at `48rem` and `64rem`.

### Prefer relative units

Never use `px` for lengths. Use:

| Instead of        | Use                                  |
| ----------------- | ------------------------------------ |
| `px`              | `rem` (or `em` for component-relative) |
| `font-size: 16px` | relative or `rem`                   |
| hard-coded steps  | `clamp()` for fluid type and spacing |
| `%` widths only   | `ch` for text measure, `fr` for grid |

`px` is acceptable only for genuinely 1-unit things: hairline borders (`0.0625rem`),
`background-size` sprites, and `box-shadow` offsets where sub-pixel matters.

### Design tokens live in one place

All visual constants are CSS custom properties declared once in the root-level stylesheet
(`src/styles/tokens.css`) and imported by the base layout. Components **must** consume those
variables and **must not** hard-code a color, radius, shadow, spacing step, or font size.

The token scale is derived from a small set of primitives so it can be re-themed globally:

- Color: `--color-*` primitives plus semantic aliases (`--surface`, `--text`, `--accent`) that
  components reference. Semantic names over raw colors so a theme swap is a token edit.
- Type: `--text-*` scale steps, `--font-*` families, `--leading-*`, `--tracking-*`.
- Space: `--space-1` through `--space-9`, built on one base unit.
- Shape: `--radius-*`, `--shadow-*`, `--border-width`.

Never introduce a one-off value. If a component needs a value that does not exist, add a token
that generalizes rather than inlining a literal.

### Shared visual language for recurring elements

If an element type appears more than once, it gets exactly one component. Headings, card
subtitles, eyebrow labels, stat values, buttons, and badges must be styled in a single place so
they cannot drift across sections. Semantic HTML elements (`h1`-`h4`, `p`, `ul`, `blockquote`)
are styled globally from tokens; a component should not re-specify those styles.

Heading levels must follow document order. Do not jump levels to get a visual size — style size
independently of level.

### Component decomposition

Prefer many small, composable files over large monolithic ones. Each component should have one
clear responsibility and be reusable at more than one call site.

- Target roughly 150 lines or less per component file. If a file grows past that, look for a
  second responsibility to extract.
- Data-driven, not copy-pasted. Repeating structures (feature grids, schedules, stat rows,
  link lists) are rendered from arrays of objects with a single shared presentational component.
- Content and presentation are separated: page-specific copy belongs in the page or a content
  module, not inlined into layout components.

### Astro and React boundaries

Use Astro components by default — they render to zero client JavaScript. Add a React component
only when it brings genuine interactivity or a library that removes real complexity, and pass
`client:` directives deliberately (prefer `client:visible` or `client:idle` over `client:load`).

Keep client-side state local to the smallest component that needs it. Do not introduce a global
store for a page that has none.

### Accessibility and semantics

Use semantic elements, one `h1` per page, labelled form controls, visible focus rings that are
never removed without a replacement, and `prefers-reduced-motion` fallbacks for animation.

---

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
