/**
 * A camera pointed at the floor is a speedometer, if you know one number: the height.
 *   pixels per second = v · f / h        reported v = pixels/s · h_believed / f
 * f = 513.94 px (the downward camera at the flow resolution, from the bench runs).
 * The three slides at the bottom are real: mongla_ws .claude/context/perception/flow_runs_2026-09-07.json.
 */
import data from "../data/mongla.json";
import { C, s, svg, set, h, scrub, sentence, readout, reduced, poke } from "./kit";

export function mount(root: HTMLElement) {
  const F = 513.94;
  let v = 0.3, hgt = 0.72, err = 0;
  const { slots } = sentence(root, `The vehicle moves at {v} over a floor {h} below the camera. The floor slides <b class="k-me">{px}</b> across the image. If we believe the height is off by {err}, we report <b>{rep}</b>, and dead reckoning drifts <b class="k-failure">{drift}</b> every minute.`);
  const W = 860, H = 230;
  const el = svg(root, W, H, "Top view of the floor sliding under the downward camera's footprint");
  const floor = s("g", {}, el);
  const dots: { x: number; y: number }[] = Array.from({ length: 140 }, (_, i) => ({ x: (i * 97.13) % W, y: 20 + ((i * 53.71) % (H - 40)) }));
  const ds = dots.map((d) => s("circle", { cx: d.x, cy: d.y, r: 2.2, fill: C.dim }, floor));
  const fp = s("rect", { y: 30, height: H - 60, fill: "none", stroke: C.me, "stroke-width": 2, rx: 4 }, el);
  const fpL = s("text", { y: 24, class: "x-lbl", fill: C.me }, el);
  const arrow = s("path", { fill: "none", stroke: C.measured, "stroke-width": 3 }, el);
  const say = readout(root);

  let px = 0, offset = 0, last = performance.now(), raf = 0;
  const draw = () => {
    const pxs = (v * F) / hgt; px = pxs;
    const rep = (pxs * hgt * (1 + err)) / F;
    const fpw = Math.min(W - 80, (640 / F) * hgt * 520);
    set(fp, { x: (W - fpw) / 2, width: fpw });
    set(fpL, { x: (W - fpw) / 2 }); fpL.textContent = `what the camera sees: ${((640 / F) * hgt).toFixed(2)} m of floor`;
    set(arrow, { d: `M${W / 2 - 60} ${H / 2} h${120} m-12 -8 l12 8 l-12 8` });
    slots.px.textContent = `${pxs.toFixed(0)} px/s`;
    slots.rep.innerHTML = `<span class="${Math.abs(err) < 0.01 ? "k-measured" : "k-failure"}">${rep.toFixed(3)} m/s</span>`;
    slots.drift.textContent = `${Math.abs((rep - v) * 60).toFixed(2)} m`;
    say(`one ratio, and height is the term that ruins you: wrong by ${Math.round(Math.abs(err) * 100)}% means every velocity is wrong by ${Math.round(Math.abs(err) * 100)}%, in the same direction, forever.`);
  };
  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    offset = (offset + v * 520 * dt) % W; // world view: the floor moves at v; the footprint grows with height
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

  // the real bench: mongla_ws measured-bars §13, flow_runs_2026-09-07.json
  type Run = { phase: string; abs_m: number; implied_h_m: number; axis_deg: number; pct: number };
  const runs = (data.flowRuns as unknown[]).filter((r): r is Run => typeof r === "object" && r !== null && "abs_m" in r);
  const box = h("div", {}, root);
  h("p", { class: "x-out", style: "margin-top:1.2rem" }, box, `The real bench, 2026-09-07, in air: 30 cm hand slides with the downward camera 0.72 m above the floor (by tape). Each slide's error implies a height. The same console on synthetic frames with exact truth was off by at most <b>0.02 cm</b>; the gap to the real slides is the hand, the tape and the height, not the algorithm.`);
  const rel = svg(box, 860, 40 + runs.length * 34, "Real slides: measured distance and the camera height each implies, against the tape's 0.72 m");
  const hx = (m: number) => 330 + ((m - 0.6) / 0.16) * 480;
  s("line", { x1: hx(0.72), x2: hx(0.72), y1: 8, y2: 30 + runs.length * 34, stroke: C.measured, "stroke-width": 2 }, rel);
  s("text", { x: hx(0.72) + 6, y: 18, class: "x-lbl", fill: C.measured }, rel).textContent = "tape: 0.72 m";
  const name: Record<string, string> = { lat: "lateral slide", fwd: "forward slide", back: "back slide" };
  runs.forEach((r, i) => {
    const yy = 42 + i * 34;
    const diagonal = r.pct > 120;
    s("text", { x: 320, y: yy + 4, "text-anchor": "end", class: "x-lbl", fill: diagonal ? C.faint : C.dim }, rel).textContent = diagonal ? `diagonal on purpose: ${(r.abs_m * 100).toFixed(2)} cm at ${r.axis_deg.toFixed(1)}°` : `${name[r.phase] ?? r.phase}: ${(r.abs_m * 100).toFixed(2)} cm`;
    if (diagonal) { s("text", { x: hx(0.6), y: yy + 4, class: "x-lbl", fill: C.faint }, rel).textContent = "not a 30 cm test: it checks the angle, and read it right"; return; }
    s("circle", { cx: hx(r.implied_h_m), cy: yy, r: 7, fill: C.me }, rel);
    s("text", { x: hx(r.implied_h_m) + 12, y: yy + 4, class: "x-lbl", fill: C.me }, rel).textContent = `implies ${r.implied_h_m.toFixed(2)} m`;
  });
}
