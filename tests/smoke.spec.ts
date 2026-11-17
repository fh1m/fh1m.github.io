import { test, expect, type Page } from "@playwright/test";

/** Collect every console error and uncaught exception on a page. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  return errors;
}

/** Visit each page, wait for every explorable to mount, and fail on any console error. */
async function visitAll(page: Page, hrefs: string[]) {
  for (const href of hrefs) {
    const errors = watchErrors(page);
    await page.goto(href);
    const figs = page.locator("figure.x");
    for (let i = 0; i < (await figs.count()); i++) {
      await figs.nth(i).scrollIntoViewIfNeeded();
      await expect(figs.nth(i), `${href} explorable ${i}`).toHaveAttribute("data-ready", "true", { timeout: 15_000 });
    }
    expect(errors, href).toEqual([]);
    page.removeAllListeners("console"); page.removeAllListeners("pageerror");
  }
}

test("planet: skip the opening, then at least 8 objects each open their own panel", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/");
  await expect(page.locator("#opening")).toBeVisible();
  await page.keyboard.press("Escape"); // skip the opening the way a keyboard user would
  await expect(page.locator(".zones.on")).toBeVisible({ timeout: 20_000 });
  const ids = await page.locator(".things [data-focus]").evaluateAll((bs) => [...new Set(bs.map((b) => (b as HTMLElement).dataset.focus!))]);
  expect(ids.length).toBeGreaterThanOrEqual(8);
  const opened = new Set<string>();
  for (const id of ids) {
    await page.evaluate((id) => (document.querySelector(`[data-focus="${id}"]`) as HTMLButtonElement).click(), id);
    const heading = page.locator(`.objpanel[data-obj="${id}"].on h2`);
    await expect(heading, id).toBeVisible();
    opened.add((await heading.textContent())!.trim());
  }
  expect(opened.size).toBe(ids.length);
  for (const z of ["air", "water", "earth", "fire"]) {
    await page.locator(`.zones button[data-zone="${z}"]`).click();
    await expect(page.locator(`.plate[data-plate="${z}"].on`)).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("the index reaches everything: every entry opens its own panel or world, and search narrows it", async ({ page }) => {
  const errors = watchErrors(page);
  await page.addInitScript(() => sessionStorage.setItem("seen-opening", "1"));
  await page.goto("/");
  await expect(page.locator(".index.on")).toBeVisible({ timeout: 20_000 });
  const ids = await page.locator(".tree [data-focus]").evaluateAll((bs) => bs.map((b) => (b as HTMLElement).dataset.focus!));
  expect(ids.length).toBeGreaterThanOrEqual(40);
  for (const id of ids) {
    await page.evaluate((id) => (document.querySelector(`.tree [data-focus="${id}"]`) as HTMLButtonElement).click(), id);
    await expect(page.locator(`.objpanel[data-obj="${id}"].on h2`), id).toBeVisible();
  }
  await page.locator("#find").fill("dristy");
  await expect(page.locator('.tree li:not([hidden]) [data-focus="dristy"]')).toBeVisible();
  expect(await page.locator(".tree li:not([hidden]) [data-focus]").count()).toBeLessThan(ids.length / 4);
  expect(errors).toEqual([]);
});

test("a mission: wrong guesses are struck through, the right one shows the fix and the report", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("seen-opening", "1"));
  await page.goto("/");
  await page.locator('.zones button[data-zone="water"]').click({ timeout: 20_000 });
  await page.locator('[data-mission="water"]').click();
  await page.locator('[data-mission-box="water"] button', { hasText: "Run it" }).click();
  await page.locator(".hyps button", { hasText: "Drain the camera queue" }).click();
  await expect(page.locator(".hyps button.struck")).toHaveCount(1);
  await page.locator(".hyps button", { hasText: "Keep only the newest" }).click();
  await expect(page.locator('[data-mission-box="water"] a', { hasText: "after-action report" })).toHaveAttribute("href", "/missions/water");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("missions-done") ?? "[]"))).toContain("water");
});

test("every project, element, mission, lesson and index page renders with zero errors; explorables mount", async ({ page }) => {
  await page.goto("/everything");
  const projects = await page.locator(".works a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
  expect(projects.length).toBeGreaterThanOrEqual(18);
  await page.goto("/lessons");
  const lessons = await page.locator(".wall a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
  expect(lessons.length).toBeGreaterThanOrEqual(16);
  const missions = ["air", "water", "earth", "fire"].map((z) => `/missions/${z}`);
  await visitAll(page, ["/everything", "/air", "/water", "/earth", "/fire", ...projects, ...missions, ...lessons, "/lessons", "/notes", "/log", "/cv", "/about"]);
});

test("notes: every explorable on every note mounts, zero errors", async ({ page }) => {
  await page.goto("/notes");
  const hrefs = await page.locator(".chap a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
  expect(hrefs.length).toBeGreaterThanOrEqual(35);
  await visitAll(page, hrefs);
});

test("without JavaScript the content is complete", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/everything");
  expect(await page.locator(".works a").count()).toBeGreaterThanOrEqual(18);
  await page.goto("/projects/mongla");
  await expect(page.locator(".nums li")).toHaveCount(6);
  await page.goto("/lessons/the-kill-switch-that-said-clear");
  await expect(page.locator(".s-struck")).toBeVisible();
  await ctx.close();
});

test("reduced motion gets the poster: no three.js, and the same panels work", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => sessionStorage.setItem("seen-opening", "1"));
  const errors = watchErrors(page);
  const scripts: string[] = [];
  page.on("request", (r) => { if (r.resourceType() === "script") scripts.push(r.url()); });
  await page.goto("/");
  await expect(page.locator("main.poster .poster-img")).toBeVisible();
  await page.locator('.zones button[data-zone="earth"]').click({ timeout: 20_000 });
  await expect(page.locator('.plate[data-plate="earth"].on')).toBeVisible();
  await page.evaluate(() => (document.querySelector('[data-focus="e-bhapa"]') as HTMLButtonElement).click());
  await expect(page.locator('.objpanel[data-obj="e-bhapa"].on h2')).toBeVisible();
  expect(scripts.filter((u) => /three|game\/main|main\.[A-Za-z0-9_-]+\.js/.test(u))).toEqual([]);
  expect(errors).toEqual([]);
});

test("cv: page and PDF are served", async ({ request }) => {
  expect((await request.get("/cv/")).status()).toBe(200);
  const pdf = await request.get("/cv/fahim-faisal-cv.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("pdf");
});
