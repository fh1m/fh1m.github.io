// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Live domain — GitHub Pages user site (fh1m.github.io), served from root, no base path.
export default defineConfig({
  output: 'static',
  site: 'https://fh1m.github.io',
  integrations: [sitemap()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },
});