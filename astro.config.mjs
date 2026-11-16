import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://fh1m.github.io",
  output: "static",
  trailingSlash: "ignore",
  integrations: [mdx()],
  build: { inlineStylesheets: "auto" },
  vite: {
    build: { chunkSizeWarningLimit: 700 },
  },
});
