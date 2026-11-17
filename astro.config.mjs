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
  // the old site's addresses keep working
  redirects: { "/work": "/everything", "/writing": "/notes", "/now": "/about#now", "/lab": "/missions/air",
    "/work/mongla": "/projects/mongla", "/work/duburi": "/projects/duburi", "/work/air-gnc": "/projects/aerd", "/work/mongoltori-arm": "/projects/mongol-tori", "/work/dristy": "/projects/dristy",
    "/work/passless": "/projects/tools", "/work/secure-p2p-chat": "/projects/tools", "/work/cipher-project": "/everything", "/work/arduino-vision": "/everything", "/work/track-and-predict": "/everything", "/work/calib-challenge": "/everything" },
  build: { inlineStylesheets: "always" },
  vite: {
    build: { chunkSizeWarningLimit: 700 },
  },
});
