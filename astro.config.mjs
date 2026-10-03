// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [react()],

  // Every route is prerendered as static HTML and served as a directory index.
  // Links across the site include the trailing slash to match, which keeps
  // navigation redirect-free.
  trailingSlash: 'always',

  adapter: cloudflare(),
});