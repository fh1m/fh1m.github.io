/**
 * The range, client side.
 *  1. Test benches hydrate when they come near the viewport (each is its own chunk).
 *  2. The range map marks the arena in view.
 *  3. The 3D world loads after first paint, only if WebGL2 exists and motion is welcome.
 *     It is decoration with meaning: the DOM already holds everything.
 */

type BenchModule = { mount: (el: HTMLElement, bus: EventTarget) => void };

const benches: Record<string, () => Promise<BenchModule>> = {
  "ebhapa": () => import("../benches/ebhapa"),
  "colour-depth": () => import("../benches/colour-depth"),
  "hull": () => import("../benches/hull"),
  "gimbal": () => import("../benches/gimbal"),
  "ik-arm": () => import("../benches/ik-arm"),
  "delay": () => import("../benches/delay"),
  "liars": () => import("../benches/liars"),
  "haar": () => import("../benches/haar"),
  "query": () => import("../benches/query"),
  "recorder": () => import("../benches/recorder"),
};

/** Benches and the world talk through one bus: bench -> world ("bench" events), world -> page ("arena"). */
const bus = new EventTarget();

const hydrate = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const el = e.target as HTMLElement;
    hydrate.unobserve(el);
    const key = el.dataset.bench ?? "";
    benches[key]?.()
      .then((m) => { el.replaceChildren(); m.mount(el, bus); el.dataset.ready = "1"; })
      .catch((err) => { el.innerHTML = `<p class="mono" style="color:var(--failure)">This bench failed to load: ${String(err)}</p>`; });
  }
}, { rootMargin: "600px 0px" });
document.querySelectorAll<HTMLElement>("[data-bench]").forEach((el) => hydrate.observe(el));

// Active arena -> range map + world.
const links = new Map<string, HTMLAnchorElement>();
document.querySelectorAll<HTMLAnchorElement>(".rangemap a").forEach((a) => links.set(a.dataset.map ?? "", a));
const sections = [...document.querySelectorAll<HTMLElement>("section.arena")];
let active = -1;
const visible = new Map<HTMLElement, number>();
const watch = new IntersectionObserver((entries) => {
  for (const e of entries) visible.set(e.target as HTMLElement, e.intersectionRatio);
  let best: HTMLElement | null = null, bestR = 0;
  for (const [el, r] of visible) if (r > bestR) { best = el; bestR = r; }
  const n = best ? Number(best.dataset.arena) : -1;
  if (n !== active) {
    links.get(String(active))?.classList.remove("active");
    links.get(String(n))?.classList.add("active");
    links.get(String(n))?.setAttribute("aria-current", "location");
    links.get(String(active))?.removeAttribute("aria-current");
    active = n;
    bus.dispatchEvent(new CustomEvent("arena", { detail: n }));
  }
}, { threshold: [0, 0.2, 0.4, 0.6] });
sections.forEach((s) => watch.observe(s));

// Scroll progress for the camera, cheap.
let ticking = false;
addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bus.dispatchEvent(new CustomEvent("progress", { detail: max > 0 ? scrollY / max : 0 }));
  });
}, { passive: true });

// The world: only when it can be smooth, and never before the content is painted.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("world") as HTMLCanvasElement | null;
const gl2 = (() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; } })();
if (canvas && gl2 && !reduce) {
  const start = () => import("../world/world").then((w) => w.start(canvas, bus, sections.length)).then(() => {
    document.body.classList.add("world-ready");
  }).catch((err) => console.warn("world: not started,", err));
  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 2500 }); else setTimeout(start, 1200);
} else {
  document.body.classList.add(reduce ? "world-still-motion" : "world-none");
}
