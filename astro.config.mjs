import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import rehypeScenes from "./src/lib/rehype-scenes.mjs";

export default defineConfig({
  site: "https://fh1m.github.io",
  output: "static",
  trailingSlash: "ignore",
  // unified (not the default Sätteri) so notes can be split into scenes at build time
  markdown: { processor: unified({ rehypePlugins: [rehypeScenes] }) },
  integrations: [mdx()],
  build: { inlineStylesheets: "always" },
  vite: {
    build: { chunkSizeWarningLimit: 700 },
  },
});
