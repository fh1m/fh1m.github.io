/** Shared building blocks for the test benches: a crisp canvas, a labelled slider, a live readout. */
import { siteTheme, oxocarbon } from "../data/palette";

export function canvas(parent: HTMLElement, aspect = 0.62, label = "") {
  const c = document.createElement("canvas");
  c.className = "bench-canvas";
  c.setAttribute("role", "img");
  if (label) c.setAttribute("aria-label", label);
  parent.append(c);
  const ctx = c.getContext("2d")!;
  const size = () => {
    const w = c.clientWidth || parent.clientWidth || 320;
    const h = Math.round(w * aspect);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    c.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w, h };
  };
  let dims = size();
  return {
    el: c, ctx,
    get w() { return dims.w; }, get h() { return dims.h; },
    onResize(fn: () => void) { new ResizeObserver(() => { dims = size(); fn(); }).observe(c); },
  };
}

export function slider(parent: HTMLElement, o: { label: string; min: number; max: number; step: number; value: number; unit?: string; fmt?: (v: number) => string; id: string }, on: (v: number) => void) {
  const wrap = document.createElement("div");
  wrap.className = "ctl";
  const fmt = o.fmt ?? ((v: number) => `${v}${o.unit ?? ""}`);
  wrap.innerHTML = `<label for="${o.id}">${o.label}</label><output for="${o.id}">${fmt(o.value)}</output>`;
  const input = document.createElement("input");
  Object.assign(input, { type: "range", id: o.id, min: String(o.min), max: String(o.max), step: String(o.step), value: String(o.value) });
  wrap.append(input);
  parent.append(wrap);
  const out = wrap.querySelector("output")!;
  input.addEventListener("input", () => { const v = Number(input.value); out.textContent = fmt(v); on(v); });
  return input;
}

/** A polite live region: what changed, in words, for screen readers and for the curious. */
export function readout(parent: HTMLElement) {
  const p = document.createElement("p");
  p.className = "readout mono";
  p.setAttribute("aria-live", "polite");
  parent.append(p);
  return (html: string) => { p.innerHTML = html; };
}

export function buttons(parent: HTMLElement, items: { label: string; pressed?: boolean; on: () => void }[], group = "") {
  const row = document.createElement("div");
  row.className = "btns";
  if (group) row.setAttribute("aria-label", group);
  row.setAttribute("role", "group");
  const els = items.map((it) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = it.label;
    if (it.pressed !== undefined) b.setAttribute("aria-pressed", String(it.pressed));
    b.addEventListener("click", () => {
      if (it.pressed !== undefined) els.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      it.on();
    });
    row.append(b);
    return b;
  });
  parent.append(row);
  return els;
}

export const css = getComputedStyle(document.documentElement);
export const C = {
  chalk:siteTheme["--chalk"], dim:siteTheme["--dim"], faint:siteTheme["--faint"], line:siteTheme["--line"],
  measured:siteTheme["--measured"], failure:siteTheme["--failure"], medium:siteTheme["--medium"], estimate:siteTheme["--estimate"], pink:oxocarbon.pink, time:oxocarbon.violet, air:oxocarbon.ice,
};

export function emit(bus: EventTarget, bench: string, value: unknown) {
  bus.dispatchEvent(new CustomEvent("bench", { detail: { bench, value } }));
}
