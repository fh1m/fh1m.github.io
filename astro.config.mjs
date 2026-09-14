// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// PLACEHOLDER DOMAIN — replace with real domain (README todo 16)
export default defineConfig({
  output: 'static',
  site: 'https://fahim-faisal.dev',
  integrations: [sitemap()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },
});