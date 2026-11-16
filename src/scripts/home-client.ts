/**
 * The drawing set, client side. All enhancement: every sheet is complete HTML without it.
 *  - fixtures (benches) hydrate near the viewport
 *  - the sheet strip tracks the sheet in view; j / k flip sheets, g goes to the top
 *  - View 01: the isometric assembly, its parts list and the part panel
 */
type BenchModule = { mount: (el: HTMLElement, bus: EventTarget) => void };
const benches = import.meta.glob<BenchModule>(["../benches/*.ts", "!../benches/ui.ts"]);
const bus = new EventTarget();
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Fixtures
const hydrate = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const el = e.target as HTMLElement;
    hydrate.unobserve(el);
    const load = benches[`../benches/${el.dataset.bench}.ts`];
    if (!load) { el.innerHTML = `<p class="mono failure">No fixture called ${el.dataset.bench}.</p>`; continue; }
    load().then((m) => { el.replaceChildren(); m.mount(el, bus); el.dataset.ready = "1"; })
      .catch((err) => { el.innerHTML = `<p class="mono failure">This fixture failed to load: ${String(err)}</p>`; });
  }
}, { rootMargin: "700px 0px" });
document.querySelectorAll<HTMLElement>("[data-bench]").forEach((el) => hydrate.observe(el));

// Sheets in view → strip; reveal
const sheets = [...document.querySelectorAll<HTMLElement>("section.sheet")];
const strip = new Map<string, HTMLAnchorElement>();
document.querySelectorAll<HTMLAnchorElement>(".strip a").forEach((a) => strip.set(a.dataset.strip ?? "", a));
const reveal = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: 0.08 });
sheets.forEach((s) => reveal.observe(s));
let current = -1;
const ratios = new Map<HTMLElement, number>();
const watch = new IntersectionObserver((es) => {
  for (const e of es) ratios.set(e.target as HTMLElement, e.intersectionRatio);
  let best = -1, r = 0;
  sheets.forEach((s, i) => { const v = ratios.get(s) ?? 0; if (v > r) { r = v; best = i; } });
  if (best === current) return;
  strip.get(String(current))?.classList.remove("on");
  strip.get(String(current))?.removeAttribute("aria-current");
  strip.get(String(best))?.classList.add("on");
  strip.get(String(best))?.setAttribute("aria-current", "location");
  current = best;
}, { threshold: [0, .2, .4, .6] });
sheets.forEach((s) => watch.observe(s));
const onScroll = () => document.body.classList.toggle("scrolled", scrollY > innerHeight * 0.6);
addEventListener("scroll", onScroll, { passive: true }); onScroll();

// j / k / g: flip sheets like a notebook. Never while typing or with modifiers.
addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const t = e.target as HTMLElement;
  if (t.closest("input, textarea, select, [contenteditable], canvas, dialog[open]")) return;
  const go = (i: number) => sheets[Math.max(0, Math.min(sheets.length - 1, i))]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (e.key === "j") { e.preventDefault(); go(current + 1); }
  else if (e.key === "k") { e.preventDefault(); go(current < 0 ? 0 : current - 1); }
  else if (e.key === "g") { e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); }
});

// View 01: parts list, panel, 3D
const panel = document.getElementById("part-panel") as HTMLDialogElement | null;
const partButtons = [...document.querySelectorAll<HTMLButtonElement>(".parts button")];
function openPart(n: number) {
  const s = document.querySelector<HTMLElement>(`section.sheet[data-chapter="${n}"]`);
  if (!s || !panel) return;
  panel.querySelector(".pp-meta")!.textContent = s.querySelector(".sheet-text > .label")?.textContent ?? "";
  panel.querySelector("h2")!.textContent = s.querySelector("h2")?.textContent ?? "";
  panel.querySelector(".pp-kicker")!.textContent = s.querySelector(".kicker")?.textContent ?? "";
  panel.querySelector(".pp-note")!.textContent = `Note: ${s.querySelector(".tb-note dd")?.firstChild?.textContent?.trim() ?? ""}`;
  const go = panel.querySelector<HTMLAnchorElement>(".pp-go")!;
  go.href = `#${s.id}`; go.onclick = () => panel.close();
  panel.showModal();
}
bus.addEventListener("part", (e) => openPart((e as CustomEvent<number>).detail));
bus.addEventListener("part-lit", (e) => { const n = (e as CustomEvent<number>).detail; partButtons.forEach((b) => b.classList.toggle("lit", Number(b.dataset.part) === n)); });
partButtons.forEach((b) => {
  const n = Number(b.dataset.part);
  b.addEventListener("click", () => openPart(n));
  b.addEventListener("mouseenter", () => bus.dispatchEvent(new CustomEvent("light", { detail: n })));
  b.addEventListener("focus", () => bus.dispatchEvent(new CustomEvent("light", { detail: n })));
  b.addEventListener("mouseleave", () => bus.dispatchEvent(new CustomEvent("light", { detail: -1 })));
});
const canvas = document.getElementById("assembly") as HTMLCanvasElement | null;
const balloons = document.querySelector<HTMLElement>(".balloons");
const gl = (() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; } })();
if (canvas && balloons && gl) {
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    import("../world/assembly").then((m) => m.start(canvas, balloons, bus, reduce)).then(() => document.body.classList.add("view-ready")).catch((err) => console.warn("assembly:", err));
  }, { rootMargin: "300px" }).observe(canvas);
}
