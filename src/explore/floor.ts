/**
 * A camera pointed at the floor is a speedometer, if you know one number: the height.
 *   pixels per second = v · f / h        reported v = pixels/s · h_believed / f
 * f = 513.94 px (the downward camera at the flow resolution, from the bench runs).
 * Recorded bench slides are server-rendered separately in FlowRecords.astro.
 */
import { C, s, svg, set, h, scrub, sentence, readout, reduced, poke } from "./kit";

export function mount(root: HTMLElement) {
  const F = 513.94;
  let v = 0.3, hgt = 0.72, err = 0;
  const { slots } = sentence(root, `The vehicle moves at {v} over a floor {h} below the camera. The floor slides <b class="k-me">{px}</b> across the image. If we believe the height is off by {err}, we report <b>{rep}</b>, and dead reckoning drifts <b class="k-failure">{drift}</b> every minute.`);
  const W = 860, H = 230;
  const el = svg(root, W, H, "Schematic horizontal camera span over a moving, flat floor");
  const floor = s("g", {}, el);
  const dots: { x: number; y: number }[] = Array.from({ length: 140 }, (_, i) => ({ x: (i * 97.13) % W, y: 20 + ((i * 53.71) % (H - 40)) }));
  const ds = dots.map((d) => s("circle", { cx: d.x, cy: d.y, r: 2.2, fill: C.dim }, floor));
  const fp = s("rect", { y: 30, height: H - 60, fill: "none", stroke: C.me, "stroke-width": 2, rx: 4 }, el);
  const span = h("p", { class: "x-out" }, root);
  const arrow = s("path", { fill: "none", stroke: C.measured, "stroke-width": 3 }, el);
  const say = readout(root);

  let offset = 0, last = performance.now(), raf = 0;
  const draw = () => {
    const pxs = (v * F) / hgt;
    const rep = (pxs * hgt * (1 + err)) / F;
    const fpw = (640 / F) * hgt * 260;
    set(fp, { x: (W - fpw) / 2, width: fpw });
    span.textContent = `Horizontal camera span: ${((640 / F) * hgt).toFixed(2)} m across a 640 px image. The drawing is schematic.`;
    set(arrow, { d: `M${W / 2 - 60} ${H / 2} h${120} m-12 -8 l12 8 l-12 8` });
    slots.px.textContent = `${pxs.toFixed(0)} px/s`;
    slots.rep.innerHTML = `<span class="${Math.abs(err) < 0.01 ? "k-measured" : "k-failure"}">${rep.toFixed(3)} m/s</span>`;
    slots.drift.textContent = `${Math.abs((rep - v) * 60).toFixed(2)} m`;
    say(`Height scale: ${(1 + err).toFixed(2)}×. Reported horizontal velocity scales by this ratio; drift also depends on speed and elapsed time. This model assumes a flat floor and excludes rotation, vertical motion, tracking error and calibration error.`);
  };
  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    offset = (offset + v * 260 * dt) % W;
    dots.forEach((d, i) => ds[i].setAttribute("cx", String((d.x - offset + W * 4) % W)));
    raf = requestAnimationFrame(tick);
  };
  scrub(slots.v, { value: v, min: 0, max: 1.2, step: 0.01, fmt: (x) => `${x.toFixed(2)} m/s`, label: "True speed", tone: "measured" }, (x) => { v = x; draw(); poke(); });
  scrub(slots.h, { value: hgt, min: 0.2, max: 2, step: 0.01, fmt: (x) => `${x.toFixed(2)} m`, label: "Height above the floor", tone: "medium" }, (x) => { hgt = x; draw(); poke(); });
  scrub(slots.err, { value: err, min: -0.3, max: 0.3, step: 0.01, fmt: (x) => `${x >= 0 ? "+" : "−"}${Math.round(Math.abs(x) * 100)}%`, label: "Error in the believed height", tone: "failure" }, (x) => { err = x; draw(); poke(); });
  draw();
  if (!reduced()) {
    new IntersectionObserver(([e]) => { if (e.isIntersecting && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); } else if (!e.isIntersecting) { cancelAnimationFrame(raf); raf = 0; } }).observe(el);
  }
}
