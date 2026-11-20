import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import rehypeReading from "./src/lib/rehype-reading.mjs";

export default defineConfig({
  site: "https://fh1m.github.io",
  output: "static",
  trailingSlash: "ignore",
  // Keep technical material accessible without rearranging the article.
  markdown: { processor:unified({ rehypePlugins:[rehypeReading] }) },
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
