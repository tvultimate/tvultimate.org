// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Required by @astrojs/sitemap: without an absolute site it cannot emit
  // fully-qualified URLs. Keep in sync with `domain` in src/data/org.ts.
  site: 'https://tvultimate.org',

  integrations: [
    react(),
    sitemap({
      // The Google Ads landing pages are excluded from the organic index so
      // they do not compete with the tournament and registration pages for the
      // same terms, or cannibalise the ad spend.
      // 404 is excluded by the integration itself.
      filter: (page) =>
        ![
          'https://tvultimate.org/battle-of-idaho/free-agent/',
          'https://tvultimate.org/battle-of-idaho/youth-free-agent/',
          'https://tvultimate.org/battle-of-idaho/youth-open/',
          'https://tvultimate.org/battle-of-idaho/register-a-team/',
        ].includes(page),
    }),
  ],

  // Every route is prerendered as static HTML and served as a directory index.
  // Links across the site include the trailing slash to match, which keeps
  // navigation redirect-free.
  trailingSlash: 'always',

  build: {
    /*
     * Inline every stylesheet into the page's <head> rather than emitting a
     * linked .css file.
     *
     * Astro's default (`'auto'`) inlines only stylesheets under Vite's
     * 4 KiB asset limit. Our shared chunk — which carries the token sheet and
     * every common component's styles — is ~29 KiB raw, so it always missed
     * that threshold and shipped as a linked file. One render-blocking
     * round trip, measured at 190 ms on a throttled mobile connection and
     * flagged by Lighthouse on every route.
     *
     * Inlining costs nothing here: the whole stylesheet is ~6 KiB gzipped
     * against an HTML document that is already two to three times that, and
     * the CSS is now parsed in the same pass as the markup instead of
     * blocking first paint. There is no cacheable-CSS win to lose, because
     * every visitor to a given page already downloads a fresh copy of the
     * HTML for it.
     */
    inlineStylesheets: 'always',
  },

  adapter: cloudflare(),
});