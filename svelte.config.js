import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // GitHub Pages user site (fh1m.github.io) — served from the domain root,
    // so no base path. Full static prerender.
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true,
    }),
    paths: { base: '' },
    prerender: { handleHttpError: 'warn' },
  },
};

export default config;
