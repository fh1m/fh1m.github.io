import { test, expect, type Page } from "@playwright/test";

/** Collect every console error and uncaught exception on a page. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  return errors;
}

const ELEMENTS = ["water", "earth", "fire", "air"];

test("home: the dive lands on the globe, and 8 objects in the scene each open their panel", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/");
  await expect(page.locator("#intro")).toBeVisible();
  await page.locator("#dive").click();
  await expect(page.locator("body.world-on")).toHaveCount(1, { timeout: 20_000 });
  await expect(page.locator("#intro")).toHaveCount(0, { timeout: 10_000 });

  // 4 element satellites + 4 place pins live in the WebGL scene's overlay
  const targets = [...ELEMENTS.map((e) => `.pins .sat[data-sat="${e}"]`), ...["dhaka", "irvine", "mongla", "khulna"].map((p) => `.pins .pin[data-pin="${p}"]`)];
  const opened: string[] = [];
  for (const sel of targets) {
    await page.goto("/");
    await expect(page.locator("body.world-on")).toHaveCount(1, { timeout: 20_000 });
    await page.locator(sel).dispatchEvent("click"); // a pin may be on the far side of the globe; it is still a real link
    const heading = page.locator(".panel h2, .sheet h1, .cv h1").first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
    opened.push((await heading.textContent())!.trim());
  }
  expect(new Set(opened).size).toBe(8);
  expect(errors).toEqual([]);
});

test("the world persists across navigation instead of reloading", async ({ page }) => {
  await page.goto("/water");
  await expect(page.locator("body.world-on")).toHaveCount(1, { timeout: 20_000 });
  await page.evaluate(() => ((window as unknown as { __mark: number }).__mark = 1));
  await page.locator('.tiles a[href="/projects/mongla"]').click();
  await expect(page.locator(".sheet h1")).toHaveText("Mongla");
  expect(await page.evaluate(() => (window as unknown as { __mark?: number }).__mark)).toBe(1);
});

test("every element, project, lesson and index page renders with zero errors; benches mount", async ({ page }) => {
  await page.goto("/lessons");
  const lessonHrefs = await page.locator(".grp a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
  expect(lessonHrefs.length).toBeGreaterThanOrEqual(16);
  const projectHrefs: string[] = [];
  for (const e of ELEMENTS) { await page.goto(`/${e}`); projectHrefs.push(...(await page.locator(".tiles a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!)))); }
  expect(projectHrefs.length).toBeGreaterThanOrEqual(18);
  for (const href of [...ELEMENTS.map((e) => `/${e}`), ...projectHrefs, ...lessonHrefs, "/lessons", "/shoulders", "/notes", "/log", "/cv"]) {
    const errors = watchErrors(page);
    await page.goto(href);
    const figs = page.locator("figure.x");
    for (let i = 0; i < (await figs.count()); i++) { await figs.nth(i).scrollIntoViewIfNeeded(); await expect(figs.nth(i), `${href} bench ${i}`).toHaveAttribute("data-ready", "true", { timeout: 15_000 }); }
    expect(errors, href).toEqual([]);
    page.removeAllListeners("console"); page.removeAllListeners("pageerror");
  }
});

test("without JavaScript the content is complete", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/water");
  await expect(page.locator(".panel h2")).toHaveText("Water");
  expect(await page.locator(".tiles a").count()).toBeGreaterThanOrEqual(5);
  await page.goto("/projects/mongla");
  await expect(page.locator(".figs div")).toHaveCount(6);
  await page.goto("/lessons/the-kill-switch-that-said-clear");
  await expect(page.locator(".llis .wrong")).toBeVisible();
  await ctx.close();
});

test("reduced motion: no intro, the world and every element link are there", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = watchErrors(page);
  await page.goto("/");
  await expect(page.locator("#intro")).toHaveCount(0);
  await expect(page.locator(".who .els a")).toHaveCount(4);
  await expect(page.locator("body.world-on")).toHaveCount(1, { timeout: 20_000 });
  expect(errors).toEqual([]);
});

test("notes: every explorable on every note mounts, zero errors", async ({ page }) => {
  await page.goto("/notes/");
  const hrefs = await page.locator(".ser a").evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!));
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
