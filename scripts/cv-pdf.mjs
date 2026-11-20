#!/usr/bin/env node
/**
 * Print the built technical CV and résumé with Chromium (Playwright).
 * Serve local assets, but resolve document hyperlinks against the configured public site.
 */
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { serve } from "./serve-dist.mjs";
import config from "../astro.config.mjs";

const DIST = new URL("../dist/", import.meta.url).pathname;
const server = await serve();
const { port } = server.address();

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.emulateMedia({ media: "print" });
  for (const [route, filename] of [["cv", "fahim-faisal-cv.pdf"], ["resume", "fahim-faisal-resume.pdf"]]) {
    await page.goto(`http://127.0.0.1:${port}/${route}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate((site) => {
      for (const link of document.links) {
        if (link.origin === location.origin) {
          link.href = new URL(link.pathname + link.search + link.hash, site).href;
        }
      }
    }, config.site);
    const out = join(DIST, "cv", filename);
    await page.pdf({ path: out, format: "A4", printBackground: false, tagged: true, margin: { top: "14mm", bottom: "14mm", left: "15mm", right: "15mm" } });
    console.log(`cv-pdf: wrote ${out}`);
  }
} finally {
  await browser.close();
  server.close();
}
