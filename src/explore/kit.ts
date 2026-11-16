/**
 * The explorable kit. Every diagram on the site is built from these few pieces:
 *   svg()/s()     an SVG in a fixed coordinate system that scales with its container
 *   scrub()       a number inside a sentence that you drag (or arrow-key) to change
 *   handle()      a draggable point inside a diagram, keyboard-accessible
 *   say()         a live sentence under the diagram whose numbers are the outputs
 * Colours carry one meaning everywhere (see DESIGN.md).
 */
export const C = {
  chalk: "#eceef3", dim: "#a7b1c6", faint: "#6f7d99", line: "#16233f", grid: "#0c1730",
  me: "#e5322d", medium: "#3b6fe0", measured: "#6f9cff", failure: "#ff4a42", estimate: "#b8c4dc",
} as const;

const NS = "http://www.w3.org/2000/svg";
type Attrs = Record<string, string | number | undefined>;

export function s<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Attrs = {}, parent?: Element): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined) e.setAttribute(k, String(v));
  parent?.append(e);
  return e;
}
export function set(e: Element, attrs: Attrs) { for (const [k, v] of Object.entries(attrs)) if (v !== undefined) e.setAttribute(k, String(v)); return e; }

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, parent?: Element, html?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined) e.setAttribute(k, String(v));
  if (html !== undefined) e.innerHTML = html;
  parent?.append(e);
  return e;
}

/** An SVG with a fixed viewBox, labelled for assistive tech. */
export function svg(root: Element, w: number, h: number, label: string) {
  const e = s("svg", { viewBox: `0 0 ${w} ${h}`, role: "img", "aria-label": label, class: "x-svg" }, root);
  return e;
}

export const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface ScrubOpts { value: number; min: number; max: number; step?: number; log?: boolean; fmt?: (v: number) => string; label: string; tone?: keyof typeof C }

/**
 * A scrubbable number. Drag left/right, or focus and use arrow keys (Shift = ×10).
 * Returns a setter so other controls can move it too.
 */
export function scrub(host: HTMLElement, o: ScrubOpts, on: (v: number) => void) {
  const fmt = o.fmt ?? ((v) => String(v));
  const step = o.step ?? (o.max - o.min) / 100;
  let v = o.value;
  host.classList.add("x-scrub");
  if (o.tone) host.style.setProperty("--tone", C[o.tone]);
  host.tabIndex = 0;
  host.setAttribute("role", "slider");
  host.setAttribute("aria-label", o.label);
  host.setAttribute("aria-valuemin", String(o.min));
  host.setAttribute("aria-valuemax", String(o.max));
  const toT = (x: number) => (o.log ? Math.log(x / o.min) / Math.log(o.max / o.min) : (x - o.min) / (o.max - o.min));
  const fromT = (t: number) => (o.log ? o.min * Math.pow(o.max / o.min, t) : o.min + t * (o.max - o.min));
  const snap = (x: number) => (o.log ? x : Math.round(x / step) * step);
  const apply = (x: number, fire = true) => {
    v = clamp(snap(x), o.min, o.max);
    host.textContent = fmt(v);
    host.setAttribute("aria-valuenow", String(v));
    host.setAttribute("aria-valuetext", fmt(v));
    if (fire) { on(v); host.dispatchEvent(new CustomEvent("x-change", { bubbles: true })); }
  };
  let x0 = 0, t0 = 0;
  host.addEventListener("pointerdown", (e) => { x0 = e.clientX; t0 = toT(v); host.setPointerCapture(e.pointerId); host.classList.add("x-active"); e.preventDefault(); });
  host.addEventListener("pointermove", (e) => { if (!host.hasPointerCapture(e.pointerId)) return; apply(fromT(clamp(t0 + (e.clientX - x0) / 260, 0, 1))); });
  const end = (e: PointerEvent) => { if (host.hasPointerCapture(e.pointerId)) host.releasePointerCapture(e.pointerId); host.classList.remove("x-active"); };
  host.addEventListener("pointerup", end); host.addEventListener("pointercancel", end);
  host.addEventListener("keydown", (e) => {
    const k = e.shiftKey ? 10 : 1;
    const dt = o.log ? 0.02 * k : 0;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { apply(o.log ? fromT(toT(v) + dt) : v + step * k); e.preventDefault(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { apply(o.log ? fromT(toT(v) - dt) : v - step * k); e.preventDefault(); }
    if (e.key === "Home") { apply(o.min); e.preventDefault(); }
    if (e.key === "End") { apply(o.max); e.preventDefault(); }
  });
  apply(v, false);
  return { set: (x: number) => apply(x), get: () => v };
}

/**
 * Build a sentence with scrubbable slots: "At {depth} of water…" → spans with data-k.
 * Returns the spans by key.
 */
export function sentence(root: Element, tpl: string, cls = "x-say") {
  const p = h("p", { class: cls }, root);
  p.innerHTML = tpl.replace(/\{(\w+)\}/g, (_, k) => `<span data-k="${k}"></span>`);
  const out: Record<string, HTMLElement> = {};
  p.querySelectorAll<HTMLElement>("[data-k]").forEach((e) => (out[e.dataset.k!] = e));
  return { p, slots: out };
}

/** A live output line; numbers coloured by tone. Keep it short: it's read aloud. */
export function readout(root: Element) {
  const p = h("p", { class: "x-out", "aria-live": "polite" }, root);
  return (html: string) => { p.innerHTML = html; };
}

/** A draggable point inside an SVG. `place` maps a pointer (viewBox coords) to the new point. */
export function handle(svgEl: SVGSVGElement, label: string, tone: keyof typeof C, place: (x: number, y: number) => [number, number], on: (x: number, y: number) => void, start: [number, number], keyStep = 6) {
  const g = s("g", { class: "x-handle", tabindex: 0, role: "slider", "aria-label": label }, svgEl);
  s("circle", { r: 16, fill: C[tone], opacity: 0.16 }, g);
  s("circle", { r: 7, fill: "#000", stroke: C[tone], "stroke-width": 2.5 }, g);
  let p = start;
  const put = (x: number, y: number) => { p = place(x, y); g.setAttribute("transform", `translate(${p[0]} ${p[1]})`); g.setAttribute("aria-valuetext", `${p[0].toFixed(0)}, ${p[1].toFixed(0)}`); on(p[0], p[1]); };
  const toView = (e: PointerEvent) => { const pt = svgEl.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const m = svgEl.getScreenCTM()!.inverse(); const q = pt.matrixTransform(m); return [q.x, q.y] as [number, number]; };
  g.addEventListener("pointerdown", (e) => { g.setPointerCapture(e.pointerId); g.classList.add("x-active"); e.preventDefault(); });
  g.addEventListener("pointermove", (e) => { if (g.hasPointerCapture(e.pointerId)) put(...toView(e)); });
  g.addEventListener("pointerup", (e) => { g.releasePointerCapture(e.pointerId); g.classList.remove("x-active"); });
  g.addEventListener("keydown", (e) => {
    const m: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const d = m[e.key]; if (!d) return; e.preventDefault();
    const k = (e.shiftKey ? 5 : 1) * keyStep; put(p[0] + d[0] * k, p[1] + d[1] * k);
  });
  put(...start);
  return { put, get: () => p };
}

/** Buttons that act like a radio group. */
export function choice(root: Element, label: string, items: { label: string; on: () => void }[], active = 0) {
  const div = h("div", { class: "x-btns", role: "group", "aria-label": label }, root);
  const bs = items.map((it, i) => {
    const b = h("button", { type: "button", "aria-pressed": i === active ? "true" : "false" }, div, it.label);
    b.addEventListener("click", () => { bs.forEach((x) => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); it.on(); b.dispatchEvent(new CustomEvent("x-change", { bubbles: true })); });
    return b;
  });
  return bs;
}

/** Linear scale helper. */
export const scale = (d0: number, d1: number, r0: number, r1: number) => (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

/** Axis ticks along x or y, in viewBox space. */
export function axis(g: Element, o: { x0: number; x1: number; y0: number; y1: number; ticks: number[]; at: (v: number) => number; fmt: (v: number) => string; dir: "x" | "y"; label?: string }) {
  const { x0, x1, y0, y1 } = o;
  if (o.dir === "x") {
    s("line", { x1: x0, x2: x1, y1: y0, y2: y0, stroke: C.line }, g);
    o.ticks.forEach((t) => { const x = o.at(t); s("line", { x1: x, x2: x, y1: y0, y2: y0 + 5, stroke: C.faint }, g); s("text", { x, y: y0 + 18, "text-anchor": "middle", class: "x-tick" }, g).textContent = o.fmt(t); });
    if (o.label) s("text", { x: x1, y: y0 + 34, "text-anchor": "end", class: "x-axl" }, g).textContent = o.label;
  } else {
    s("line", { x1: x0, x2: x0, y1: y0, y2: y1, stroke: C.line }, g);
    o.ticks.forEach((t) => { const y = o.at(t); s("line", { x1: x0 - 5, x2: x0, y1: y, y2: y, stroke: C.faint }, g); s("line", { x1: x0, x2: x1, y1: y, y2: y, stroke: C.grid }, g); s("text", { x: x0 - 9, y: y + 4, "text-anchor": "end", class: "x-tick" }, g).textContent = o.fmt(t); });
    if (o.label) s("text", { x: x0, y: y1 - 10, class: "x-axl" }, g).textContent = o.label;
  }
}

/** Tell the page the human did something (the fh1m sprite types while you scrub). */
export function poke() { window.dispatchEvent(new CustomEvent("x-poke")); }
