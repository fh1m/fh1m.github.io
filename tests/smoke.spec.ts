import { test, expect, type Page } from "@playwright/test";

/** Collect every console error and uncaught exception on a page. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  return errors;
}

async function scrollThrough(page: Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 700) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(120); }
}

test("home: every chapter and bench renders, with zero console errors", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/");
  await expect(page.locator("section.chapter")).toHaveCount(11);
  await scrollThrough(page);
  const benches = page.locator("[data-bench]");
  const n = await benches.count();
  expect(n).toBeGreaterThanOrEqual(10);
  for (let i = 0; i < n; i++) await expect(benches.nth(i)).toHaveAttribute("data-ready", "1", { timeout: 15_000 });
  expect(errors).toEqual([]);
});

test("home: at least 8 ports in the 3D delta open their chapter panel", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/");
  await expect(page.locator("body.world-ready")).toHaveCount(1, { timeout: 20_000 });
  const opened = await page.evaluate(() => {
    const c = document.getElementById("world")!; const r = c.getBoundingClientRect(); const seen = new Map<string, string>();
    const d = document.getElementById("port-panel") as HTMLDialogElement;
    for (let y = r.top + 30; y < r.bottom - 20; y += 12) for (let x = r.left + 20; x < r.right - 20; x += 12) {
      const o = { clientX: x, clientY: y, bubbles: true, pointerId: 1 };
      c.dispatchEvent(new PointerEvent("pointermove", o));
      const lit = document.querySelector<HTMLAnchorElement>(".ports a.lit");
      if (!lit || seen.has(lit.dataset.port!)) continue;
      c.dispatchEvent(new PointerEvent("pointerdown", o)); c.dispatchEvent(new PointerEvent("pointerup", o));
      if (d.open) { seen.set(lit.dataset.port!, document.getElementById("port-h")!.textContent ?? ""); d.close(); }
    }
    return [...seen.values()];
  });
  expect(opened.length).toBeGreaterThanOrEqual(8);
  expect(opened.every((t) => t.length > 0)).toBe(true);
  expect(errors).toEqual([]);
});

test("reduced motion: the whole story is there without animation, zero errors", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = watchErrors(page);
  await page.goto("/");
  await expect(page.locator("section.chapter")).toHaveCount(11);
  await expect(page.locator(".ports a")).toHaveCount(11);
  await scrollThrough(page);
  await expect(page.locator('[data-bench="hull"]')).toHaveAttribute("data-ready", "1", { timeout: 15_000 });
  expect(errors).toEqual([]);
});

test("notes: every explorable on every note mounts, zero errors", async ({ page }) => {
  await page.goto("/notes/");
  const hrefs = await page.locator(".tiles a").evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!));
  expect(hrefs.length).toBeGreaterThanOrEqual(35);
  for (const href of hrefs) {
    const errors = watchErrors(page);
    await page.goto(href);
    const figs = page.locator("figure.x");
    const n = await figs.count();
    for (let i = 0; i < n; i++) { await figs.nth(i).scrollIntoViewIfNeeded(); await expect(figs.nth(i), `${href} fig ${i}`).toHaveAttribute("data-ready", "true", { timeout: 15_000 }); }
    expect(errors, href).toEqual([]);
    page.removeAllListeners("console"); page.removeAllListeners("pageerror");
  }
});

test("cv: page and PDF are served", async ({ request }) => {
  expect((await request.get("/cv/")).status()).toBe(200);
  const pdf = await request.get("/cv/fahim-faisal-cv.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("pdf");
});
