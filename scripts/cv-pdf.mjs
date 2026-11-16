#!/usr/bin/env node
/**
 * Print the built /cv page to dist/cv/fahim-faisal-cv.pdf with Chromium (Playwright).
 * Runs after `astro build`; serves dist/ on a throwaway port so links and fonts resolve.
 */
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { serve } from "./serve-dist.mjs";

const DIST = new URL("../dist/", import.meta.url).pathname;
const server = await serve();
const { port } = server.address();

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.emulateMedia({ media: "print" });
  await page.goto(`http://127.0.0.1:${port}/cv/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const out = join(DIST, "cv", "fahim-faisal-cv.pdf");
  await page.pdf({ path: out, format: "A4", printBackground: true, margin: { top: "14mm", bottom: "14mm", left: "15mm", right: "15mm" } });
  console.log(`cv-pdf: wrote ${out}`);
} finally {
  await browser.close();
  server.close();
}
