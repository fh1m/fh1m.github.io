import { test, expect, type Page } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import config from "../astro.config.mjs";

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

test("observatory: personal entrance, optional Voyager opening, and project navigation", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/?intro");
  await expect(page.locator("#opening")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator("#explore").click();
  await expect(page.locator(".zones.on")).toBeVisible({ timeout: 20_000 });
  const ids = await page.locator(".things [data-focus]").evaluateAll((bs) => [...new Set(bs.map((b) => (b as HTMLElement).dataset.focus!))]);
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

test("project deep links reopen the observatory destination after visiting its story", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#mongla");
  const panel = page.locator('.objpanel[data-obj="mongla"].on');
  await expect(page.locator("#main")).toHaveClass(/exploring/);
  await expect(panel.getByRole("heading", { name: "Mongla", exact: true })).toBeVisible();
  await panel.getByRole("link", { name: "The whole story", exact: true }).click();
  await expect(page).toHaveURL(/[/]projects[/]mongla[/]?$/);
  await page.goBack();
  await expect(page).toHaveURL(/[/]#mongla$/);
  await expect(page.locator('.objpanel[data-obj="mongla"].on h2')).toBeVisible();
});

test("object navigation clears narration belonging to the previous world", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("bunnu-enabled", "1"));
  await page.goto("/#fire");
  await expect(page.locator("#guide.on")).toBeVisible();
  await page.goto("/#mongla");
  await expect(page.locator('.objpanel[data-obj="mongla"].on')).toBeVisible();
  await expect(page.locator("#guide")).not.toHaveClass(/\bon\b/);
});

test("the homepage universe fills the viewport in animated and reduced-motion modes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/");
    const background = page.locator(reducedMotion === "reduce" ? ".poster-img" : "#world");
    await expect(background).toBeVisible();
    await expect.poll(async () => {
      const box = await background.boundingBox();
      return box ? { left: Math.round(box.x), width: Math.round(box.width) } : null;
    }).toEqual({ left: 0, width: 1440 });
  }
});

test("entering a world frames its project destinations inside the free canvas", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.locator("#explore").click();
  await page.locator('#zones [data-zone="water"]').click();
  await expect(page.locator("#world")).toHaveAttribute("aria-busy", "false", { timeout: 20_000 });
  const ids = await page.locator('[data-plate="water"] .things [data-focus]').evaluateAll(
    buttons => buttons.map(button => (button as HTMLElement).dataset.focus!),
  );
  await expect.poll(async () => page.evaluate(ids => {
    const plate = document.querySelector('.plate.on')!.getBoundingClientRect();
    return ids.filter(id => {
      const label = document.querySelector<HTMLButtonElement>(`[data-lbl="${id}"]`)!;
      const box = label.getBoundingClientRect();
      return label.hidden || box.left < 0 || box.right > plate.left || box.top < 0 || box.bottom > innerHeight;
    });
  }, ids), { timeout: 20_000 }).toEqual([]);
});

test("the index reaches everything: every entry opens its own panel or world, and search narrows it", async ({ page }) => {
  const errors = watchErrors(page);
  await page.addInitScript(() => sessionStorage.setItem("seen-opening", "1"));
  await page.goto("/");
  await page.locator("#explore").click();
  await expect(page.locator(".index.on")).toBeVisible({ timeout: 20_000 });
  const ids = await page.locator(".tree [data-focus]").evaluateAll((bs) => bs.map((b) => (b as HTMLElement).dataset.focus!));
  for (const id of ids) {
    await page.locator("#index summary").click();
    await page.locator(`.tree [data-focus="${id}"]`).click();
    await expect(page.locator(`.objpanel[data-obj="${id}"].on h2`), id).toBeVisible();
  }
  await page.locator("#index summary").click();
  await page.locator("#find").fill("dristy");
  await expect(page.locator('.tree li:not([hidden]) [data-focus="dristy"]')).toBeVisible();
  await expect(page.locator('.tree [data-focus="mongla"]')).toBeHidden();
  expect(errors).toEqual([]);
});

test("a mission: wrong guesses are struck through, the right one shows the fix and the report", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("seen-opening", "1"));
  await page.goto("/");
  await page.locator("#explore").click();
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
  await page.goto("/lessons");
  const lessons = await page.locator(".wall a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
  const missions = ["air", "water", "earth", "fire"].map((z) => `/missions/${z}`);
  await visitAll(page, ["/everything", "/air", "/water", "/earth", "/fire", ...projects, ...missions, ...lessons, "/lessons", "/notes", "/log", "/cv", "/about"]);
});

test("notes: every explorable on every note mounts, zero errors", async ({ page }) => {
  await page.goto("/notes");
  const hrefs = await page.locator(".chap a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
  await visitAll(page, hrefs);
});

test("without JavaScript the content is complete", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/projects/mongla");
  await expect(page.getByRole("heading", { name:"Mongla", exact:true })).toBeVisible();
  await page.goto("/lessons/the-kill-switch-that-said-clear");
  await expect(page.locator(".s-struck")).toBeVisible();
  await page.goto("/notes/the-2025-workbench");
  await expect(page.locator(".prose img").first()).toBeVisible();
  await expect(page.locator(".prose pre").first()).toBeVisible();
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
  await page.locator("#explore").click();
  await page.locator('.zones button[data-zone="earth"]').click({ timeout: 20_000 });
  await expect(page.locator('.plate[data-plate="earth"].on')).toBeVisible();
  await page.evaluate(() => (document.querySelector('[data-focus="e-bhapa"]') as HTMLButtonElement).click());
  await expect(page.locator('.objpanel[data-obj="e-bhapa"].on h2')).toBeVisible();
  expect(scripts.filter((u) => /three|game\/main|main\.[A-Za-z0-9_-]+\.js/.test(u))).toEqual([]);
  expect(errors).toEqual([]);
});

test("the camera queue model waits for a first capture instead of inventing a fresh frame", async ({ page }) => {
  await page.goto("/notes/the-frame-age-problem");
  const model = page.locator('[data-explore="fossil"]');
  await model.scrollIntoViewIfNeeded();
  await model.getByRole("slider", { name: "How long the consumer is busy" }).press("Home");
  await model.getByRole("slider", { name: "Camera frame rate" }).press("Home");
  await expect(model.getByLabel("Model frame age")).toHaveText("0 ms");
  await expect(model.getByLabel("Model blocking wait")).toHaveText("47 ms");
  await model.getByRole("button", { name: "D · a keep-up thread", exact: true }).click();
  await expect(model.getByLabel("Model frame age")).toHaveText("20 ms");
  await expect(model.getByLabel("Model blocking wait")).toHaveText("0 ms");
});

test("professional PDFs preserve page limits, structure and public project links", async ({ request }) => {
  const work = await mkdtemp(join(tmpdir(), "fh1m-pdf-check-"));
  const options = { encoding: "utf8" as const, env: { ...process.env, LC_ALL: "C" } };
  try {
    for (const [name, pages] of [["cv", 2], ["resume", 1]] as const) {
      const pdf = await request.get(`/cv/fahim-faisal-${name}.pdf`);
      expect(pdf.status()).toBe(200);
      const path = join(work, `${name}.pdf`);
      const body = await pdf.body();
      expect(body.byteLength, `${name}: Greenhouse's documented parsing limit`).toBeLessThan(2_500_000);
      await writeFile(path, body);
      const info = execFileSync("pdfinfo", [path], options);
      expect(info, name).toMatch(new RegExp(`^Pages:\\s+${pages}$`, "m"));
      expect(info, name).toMatch(/^Tagged:\s+yes$/m);
      const urls = execFileSync("pdfinfo", ["-url", path], options);
      expect(urls, name).toContain(new URL("/notes/the-frame-age-problem", config.site).href);
      expect(urls, name).not.toMatch(/https?:\/\/(?:localhost|127(?:\.\d+){3}|0\.0\.0\.0|\[::1\])(?=[:/])/);
      for (const layout of [false, true]) {
        const label = `${name}/${layout ? "layout" : "logical"}`;
        const text = execFileSync("pdftotext", [...(layout ? ["-layout"] : []), "-enc", "UTF-8", "-nopgbrk", path, "-"], options);
        const flat = text.replace(/\s+/g, " ").trim();
        expect(flat, label).toMatch(/^Muhammad Fahim Faisal\b/);
        expect(flat, label).toContain("fh1m.faisal.work@gmail.com");
        expect(flat, label).not.toContain("\uFFFD");
        const duburi = flat.slice(flat.indexOf("BRACU Duburi"), flat.indexOf("Dubotech"));
        expect(duburi, label).toContain("Former Engineering Team Lead");
        expect(duburi, label).toMatch(/Sep 2023\s*[–-]\s*Aug 2026/);
        expect(duburi, label).not.toMatch(/\bpresent\b/i);
        const iu = flat.slice(flat.indexOf("IU International University"), flat.indexOf("Technical skills"));
        expect(iu, label).toContain("2024");
        expect(flat, label).toContain("Python");
        expect(flat, label).toMatch(/\bROS\s*2\b/);
        expect(flat, label).toContain("MAVLink");
        expect(flat, label).toContain("K210");
        expect(flat, label).toContain(new URL("/notes/the-frame-age-problem", config.site).href);
      }
    }
  } finally {
    await rm(work, { recursive: true, force: true });
  }
});

test("Bunnu stays optional and remembers visited places across reloads", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await page.locator("#explore").click();
  await expect(page.locator("#bunnu-toggle")).toHaveAttribute("aria-pressed", "false");
  await page.locator("#bunnu-toggle").click();
  await expect(page.locator("#guide.on")).toBeVisible();
  for (const control of await page.locator(".hud > a, .hud > button:visible").all()) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  }
  await page.locator("#bunnu-story").click();
  await expect(page.locator("#guide-source")).toContainText("preserved pid_v1.py");
  await page.reload();
  await page.locator("#explore").click();
  await page.locator("#bunnu-story").click();
  await expect(page.locator("#guide-source")).toContainText("dino_idea_v1.py");
  await page.evaluate(() => (document.querySelector('[data-focus="dristy"]') as HTMLButtonElement).click());
  await page.reload();
  await expect(page.locator("#bunnu-toggle")).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("bunnu-visited") || "[]"))).toContain("dristy");
  await page.locator("#bunnu-toggle").click();
  await expect(page.locator("#guide")).not.toHaveClass(/\bon\b/);
});

test("long code and the water ledger remain usable without widening a phone page", async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.goto("/notes/the-2025-workbench");
  const code = page.locator("pre").first();
  await code.scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  expect(await code.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  await page.goto("/log");
  const ledger = page.getByRole("region", { name:"Water-contact ledger; scroll horizontally on a narrow screen" });
  await ledger.scrollIntoViewIfNeeded();
  expect(await ledger.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  for (const bench of await page.locator("[data-bench]").all()) {
    await bench.scrollIntoViewIfNeeded();
    await expect(bench).toHaveAttribute("data-ready","1");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("work section links land below both sticky navigation bars on phones", async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.emulateMedia({ reducedMotion:"reduce" });
  await page.goto("/about");
  await page.locator('.work-sections a[href="#h-press"]').click();
  await expect.poll(() => page.evaluate(() => {
    const heading = document.querySelector("#h-press")!.getBoundingClientRect();
    const navigation = document.querySelector(".work-sections")!.getBoundingClientRect();
    return heading.top > navigation.bottom && heading.bottom < innerHeight;
  })).toBe(true);
});

test("the observatory remains usable after leaving for work and returning through links", async ({ page }) => {
  await page.emulateMedia({ reducedMotion:"reduce" });
  await page.goto("/");
  await page.locator("#explore").click();
  await expect(page.locator(".zones.on")).toBeVisible();
  await page.locator('.hud a[href="/about"]').click();
  await expect(page.locator(".work-page")).toBeVisible();
  await page.locator('.sbar a[href="/"]').click();
  await page.locator("#explore").click();
  await page.locator('.zones button[data-zone="water"]').click();
  await expect(page.locator('.plate[data-plate="water"].on')).toBeVisible();
  await page.locator('.things [data-focus="mongla"]').click();
  await expect(page.locator('.objpanel[data-obj="mongla"].on')).toBeVisible();
});

test("hidden missions stay out of navigation and companion captions wait for entry", async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.addInitScript(() => localStorage.setItem("bunnu-enabled", "1"));
  await page.goto("/");
  await expect(page.locator("#bunnu-toggle")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#guide")).toBeHidden();
  await expect(page.locator("#bunnu-story")).toBeHidden();
  for (const plate of await page.locator(".plate").all()) await expect(plate).toBeHidden();
  await page.locator("#explore").click();
  await expect(page.locator("#guide")).toBeVisible();
  await page.locator('.zones button[data-zone="water"]').click();
  await expect(page.locator('.plate[data-plate="water"]')).toBeVisible();
  await expect(page.locator('.plate[data-plate="air"]')).toBeHidden();
});

test("phone mission diagrams scroll by keyboard without widening the page", async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.goto("/missions/water");
  const diagram = page.getByRole("region", { name:"Mission diagram; scroll horizontally on a narrow screen" });
  await expect(diagram).toBeVisible();
  await diagram.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => diagram.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("shortcut preview replaces a saved base path and preserves search punctuation", async ({ page }) => {
  await page.goto("/log");
  const bench = page.locator('[data-bench="query"]');
  await bench.scrollIntoViewIfNeeded();
  const input = bench.getByLabel("new tab", { exact:true });
  await input.fill("dc/help");
  await expect(bench.locator(".readout .medium")).toHaveText("→ https://discord.com/help");
  await input.fill("g:camera & motion");
  const destination = (await bench.locator(".readout .medium").innerText()).replace(/^→\s*/, "");
  expect(new URL(destination).searchParams.get("q")).toBe("camera & motion");
});

test("article wayfinding follows a rapid jump into the middle of an earlier section", async ({ page }) => {
  await page.emulateMedia({ reducedMotion:"reduce" });
  await page.goto("/notes/e-bhapa");
  const contents = page.getByRole("navigation", { name:"In this article", exact:true });
  const later = contents.locator('a[href="#three-versions-in-a-room-with-a-model-cat"]');
  await later.click();
  await expect(later).toHaveAttribute("aria-current", "location");
  await page.locator('svg[aria-labelledby="eb-drive-title eb-drive-desc"]').evaluate((diagram) => {
    window.scrollTo({ top:diagram.getBoundingClientRect().top + window.scrollY - 85, behavior:"instant" });
  });
  await expect(contents.locator('a[href="#reverse-represented-as-a-very-small-forward"]')).toHaveAttribute("aria-current", "location");
});

test("arm geometry stays unchanged when the viewport changes", async ({ page }) => {
  await page.setViewportSize({ width:1440, height:1000 });
  await page.goto("/projects/mongol-tori/");
  const bench = page.locator('[data-bench-mount="ik-arm"]');
  const status = bench.locator(".readout");
  await expect(status).not.toBeEmpty();
  const before = await status.innerText();
  const width = await bench.locator("canvas").evaluate((el: HTMLCanvasElement) => el.width);
  await page.setViewportSize({ width:800, height:1000 });
  await expect.poll(() => bench.locator("canvas").evaluate((el: HTMLCanvasElement) => el.width)).not.toBe(width);
  await page.evaluate(() => {
    const { promise, resolve } = Promise.withResolvers<void>();
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    return promise;
  });
  await expect(status).toHaveText(before);
});

test("observatory search opens the matching project rather than its parent world", async ({ page }) => {
  await page.goto("/");
  await page.locator("#explore").click();
  await page.locator("#index summary").click();
  await page.locator("#find").fill("e-bhapa");
  await page.locator("#find").press("Enter");
  const panel = page.locator('.objpanel[data-obj="e-bhapa"].on');
  await expect(panel).toBeVisible();
  await expect(page.locator("#index details")).not.toHaveAttribute("open", "");
  await expect(panel.locator(".close")).toBeFocused();
});

test("archive film preserves its 4:3 image when viewport height limits its size", async ({ page }) => {
  await page.goto("/notes/dhrubotara/");
  const video = page.locator("article video");
  for (const viewport of [{ width:1440, height:1000 }, { width:800, height:700 }, { width:390, height:844 }]) {
    await page.setViewportSize(viewport);
    await expect.poll(async () => {
      const box = await video.boundingBox();
      return box ? Math.abs(box.width / box.height - 4 / 3) : Infinity;
    }).toBeLessThan(0.01);
    const box = await video.boundingBox();
    expect(box!.height).toBeLessThanOrEqual(viewport.height * 0.7 + 2);
    expect(box!.width).toBeLessThanOrEqual(viewport.width);
  }
});
