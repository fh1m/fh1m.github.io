/**
 * Downstream, client side. Everything here is enhancement: the DOM already holds the story.
 *  1. Benches hydrate near the viewport (each is its own chunk).
 *  2. Chapters reveal; the river map marks the reach in view.
 *  3. The river is drawn through the chapter markers and flows with the scroll.
 *  4. The 3D delta in the hero: ports are clickable and open a panel (port events).
 */
type BenchModule = { mount: (el: HTMLElement, bus: EventTarget) => void };
const benches: Record<string, () => Promise<BenchModule>> = {
  ebhapa: () => import("../benches/ebhapa"),
  "colour-depth": () => import("../benches/colour-depth"),
  hull: () => import("../benches/hull"),
  gimbal: () => import("../benches/gimbal"),
  "ik-arm": () => import("../benches/ik-arm"),
  delay: () => import("../benches/delay"),
  liars: () => import("../benches/liars"),
  haar: () => import("../benches/haar"),
  query: () => import("../benches/query"),
  recorder: () => import("../benches/recorder"),
  robosub: () => import("../benches/robosub"),
};
const bus = new EventTarget();
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Benches
const hydrate = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const el = e.target as HTMLElement;
    hydrate.unobserve(el);
    benches[el.dataset.bench ?? ""]?.()
      .then((m) => { el.replaceChildren(); m.mount(el, bus); el.dataset.ready = "1"; })
      .catch((err) => { el.innerHTML = `<p class="mono failure">This bench failed to load: ${String(err)}</p>`; });
  }
}, { rootMargin: "700px 0px" });
document.querySelectorAll<HTMLElement>("[data-bench]").forEach((el) => hydrate.observe(el));

// 2. Chapters in view
const sections = [...document.querySelectorAll<HTMLElement>("section.chapter")];
const mapLinks = new Map<string, HTMLAnchorElement>();
document.querySelectorAll<HTMLAnchorElement>(".rivermap a").forEach((a) => mapLinks.set(a.dataset.map ?? "", a));
const reveal = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) e.target.classList.add("in");
}, { threshold: 0.12 });
sections.forEach((s) => reveal.observe(s));
let active = -1;
const ratios = new Map<HTMLElement, number>();
const watch = new IntersectionObserver((entries) => {
  for (const e of entries) ratios.set(e.target as HTMLElement, e.intersectionRatio);
  let best: HTMLElement | null = null, r = 0;
  for (const [el, v] of ratios) if (v > r) { best = el; r = v; }
  const n = best ? Number(best.dataset.chapter) : -1;
  if (n === active) return;
  mapLinks.get(String(active))?.classList.remove("active");
  mapLinks.get(String(active))?.removeAttribute("aria-current");
  mapLinks.get(String(n))?.classList.add("active");
  mapLinks.get(String(n))?.setAttribute("aria-current", "location");
  active = n;
  bus.dispatchEvent(new CustomEvent("chapter", { detail: n }));
}, { threshold: [0, 0.15, 0.3, 0.5] });
sections.forEach((s) => watch.observe(s));
const hero = document.querySelector(".hero");
if (hero) new IntersectionObserver(([e]) => document.body.classList.toggle("past-hero", !e.isIntersecting), { threshold: 0.05 }).observe(hero);

// 3. The river: a meander through each chapter's marker, alternating banks.
const wrap = document.querySelector<HTMLElement>(".river-wrap");
const svg = wrap?.querySelector<SVGSVGElement>("svg.river");
const bed = svg?.querySelector<SVGPathElement>(".bed");
const flow = svg?.querySelector<SVGPathElement>(".flow");
let length = 0;
function layoutRiver() {
  if (!wrap || !svg || !bed || !flow) return;
  const box = wrap.getBoundingClientRect();
  const W = box.width, H = wrap.scrollHeight;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const narrow = W < 900;
  const pts = sections.map((s, i) => {
    const m = s.querySelector<HTMLElement>("[data-river-anchor]") ?? s;
    const r = m.getBoundingClientRect();
    const y = r.top - box.top + r.height * 0.5;
    const x = narrow ? 14 : (i % 2 ? W * 0.9 : W * 0.06);
    return [x, y] as const;
  });
  if (!pts.length) return;
  let d = `M ${pts[0][0]} 0 L ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const my = (y0 + y1) / 2;
    d += ` C ${x0} ${my}, ${x1} ${my}, ${x1} ${y1}`;
  }
  d += ` L ${pts[pts.length - 1][0]} ${H}`;
  bed.setAttribute("d", d); flow.setAttribute("d", d);
  length = flow.getTotalLength();
  flow.style.strokeDasharray = `${length}`;
  drawRiver();
}
function drawRiver() {
  if (!wrap || !flow || !length) return;
  if (reduce) { flow.style.strokeDashoffset = "0"; return; }
  const box = wrap.getBoundingClientRect();
  const seen = Math.min(1, Math.max(0, (innerHeight * 0.7 - box.top) / wrap.scrollHeight));
  flow.style.strokeDashoffset = String(length * (1 - seen));
}
let ticking = false;
addEventListener("scroll", () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; drawRiver(); }); }, { passive: true });
if (wrap) new ResizeObserver(() => layoutRiver()).observe(wrap);
addEventListener("load", layoutRiver);

// 4. Ports: the panel, from the 3D map or the hero chips.
const panel = document.getElementById("port-panel") as HTMLDialogElement | null;
function openPort(n: number) {
  const s = sections.find((x) => Number(x.dataset.chapter) === n);
  if (!s || !panel) return;
  const accent = getComputedStyle(s).getPropertyValue("--accent");
  panel.style.setProperty("--accent", accent);
  panel.querySelector(".pp-meta")!.textContent = s.querySelector(".meta")?.textContent ?? "";
  panel.querySelector("h2")!.textContent = s.querySelector("h2")?.textContent ?? "";
  panel.querySelector(".pp-kicker")!.textContent = s.querySelector(".kicker")?.textContent ?? "";
  panel.querySelector(".pp-lesson")!.textContent = s.querySelector(".lesson")?.textContent ?? "";
  const go = panel.querySelector<HTMLAnchorElement>(".pp-go")!;
  go.href = `#${s.id}`;
  go.onclick = () => panel.close();
  panel.showModal();
}
bus.addEventListener("port", (e) => openPort((e as CustomEvent<number>).detail));
const chips = [...document.querySelectorAll<HTMLAnchorElement>(".ports a")];
bus.addEventListener("hover-port", (e) => { const n = (e as CustomEvent<number>).detail; chips.forEach((c) => c.classList.toggle("lit", Number(c.dataset.port) === n)); });
chips.forEach((c) => {
  c.addEventListener("mouseenter", () => bus.dispatchEvent(new CustomEvent("highlight-port", { detail: Number(c.dataset.port) })));
  c.addEventListener("mouseleave", () => bus.dispatchEvent(new CustomEvent("highlight-port", { detail: -1 })));
});

// The 3D delta: only with WebGL2, after first paint. Reduced motion gets a still frame.
const canvas = document.getElementById("world") as HTMLCanvasElement | null;
const gl2 = (() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; } })();
if (canvas && gl2) {
  const start = () => import("../world/delta").then((w) => w.start(canvas, bus, sections.length, reduce)).then(() => document.body.classList.add("world-ready")).catch((err) => console.warn("delta: not started,", err));
  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 2000 }); else setTimeout(start, 900);
}
