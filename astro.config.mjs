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
      // The three Google Ads landing pages are excluded from the organic
      // index so they do not compete with the tournament and registration
      // pages for the same terms, or cannibalise the ad spend.
      // 404 is excluded by the integration itself.
      filter: (page) =>
        ![
          'https://tvultimate.org/battle-of-idaho/free-agent/',
          'https://tvultimate.org/battle-of-idaho/youth-open/',
          'https://tvultimate.org/battle-of-idaho/register-a-team/',
        ].includes(page),
    }),
  ],

  // Every route is prerendered as static HTML and served as a directory index.
  // Links across the site include the trailing slash to match, which keeps
  // navigation redirect-free.
  trailingSlash: 'always',

  adapter: cloudflare(),
});