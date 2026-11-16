/**
 * Two real findings from RoboSub 2025 footage (mongla_ws detection-continuity.md):
 *  1. 71 detection gaps: p50 0.155 s, p90 0.651 s, p99 2.418 s, max 4.00 s, and the lock ladder's
 *     rungs with the fraction of gaps each covers.
 *  2. The tracker's track-creation threshold (0.6, inherited from pedestrian benchmarks) sat above
 *     99.4 % of real underwater scores, so the tracker emitted nothing.
 * Between the measured percentiles, the curve is interpolated in log-time, and says so.
 */
import data from "../data/mongla.json";
import { C, s, svg, set, h, scrub, sentence, readout, choice, axis, poke } from "./kit";

export function mount(root: HTMLElement) {
  const c = data.prose.continuity;
  const P: [number, number][] = [[0.04, 0], [c.gaps.p50, 0.5], [c.gaps.p90, 0.9], [c.gaps.p99, 0.99], [c.gaps.max, 1]];
  const cover = (t: number) => {
    if (t <= P[0][0]) return 0; if (t >= P[P.length - 1][0]) return 1;
    for (let i = 1; i < P.length; i++) if (t <= P[i][0]) { const a = Math.log(P[i - 1][0]), b = Math.log(P[i][0]); return P[i - 1][1] + ((Math.log(t) - a) / (b - a)) * (P[i][1] - P[i - 1][1]); }
    return 1;
  };
  let timeout = 0.8;
  const { slots } = sentence(root, `Underwater, the detector blinks. If the vehicle coasts for {t} after losing sight, it rides through about <b class="k-measured">{cov}</b> of the ${c.gaps.n} real gaps, and gives up on the rest.`);
  const W = 860, H = 300, L = 70, R = 830, T = 26, B = 250;
  const tmin = 0.04, tmax = 6;
  const x = (t: number) => L + (Math.log(t / tmin) / Math.log(tmax / tmin)) * (R - L);
  const y = (p: number) => B - p * (B - T);
  const el = svg(root, W, H, "Fraction of real detection gaps shorter than a given time, with the lock ladder's rungs");
  const g = s("g", {}, el);
  axis(g, { dir: "x", x0: L, x1: R, y0: B, y1: B, ticks: [0.05, 0.1, 0.2, 0.5, 1, 2, 5], at: x, fmt: (v) => `${v} s`, label: "gap length (log)" });
  axis(g, { dir: "y", x0: L, x1: R, y0: B, y1: T, ticks: [0, 0.5, 0.9, 1], at: y, fmt: (v) => `${Math.round(v * 100)}%`, label: "gaps shorter than this" });
  const d = Array.from({ length: 121 }, (_, i) => { const t = tmin * Math.pow(tmax / tmin, i / 120); return `${i ? "L" : "M"}${x(t).toFixed(1)} ${y(cover(t)).toFixed(1)}`; }).join("");
  s("path", { d, fill: "none", stroke: C.medium, "stroke-width": 2, "stroke-dasharray": "5 5", opacity: 0.7 }, g);
  P.slice(1).forEach(([t, p], i) => { s("circle", { cx: x(t), cy: y(p), r: 6, fill: C.medium }, g); s("text", { x: x(t) + 8, y: y(p) + (i === 3 ? 16 : -8), class: "x-lbl", fill: C.medium }, g).textContent = `${["p50", "p90", "p99", "worst"][i]} ${t} s`; });
  (c.ladder as [string, number, number][]).forEach(([name, t, pct], i) => {
    s("line", { x1: x(t), x2: x(t), y1: T, y2: B, stroke: C.estimate, opacity: 0.35 }, g);
    s("text", { x: x(t) + 3, y: T + 14 + (i % 2) * 14, class: "x-tick", fill: C.estimate }, g).textContent = `${name.replace("vision.", "").replace("VISION_", "").toLowerCase()} ${pct}%`;
  });
  const cur = s("line", { y1: T, y2: B, stroke: C.me, "stroke-width": 3 }, el);
  const say = readout(root);
  const draw = () => {
    set(cur, { x1: x(timeout), x2: x(timeout) });
    const cv = cover(timeout);
    slots.cov.textContent = `${Math.round(cv * 100)}%`;
    say(`dots are measured percentiles; the dashed line between them is interpolated. Amber lines are the shipped rungs with the coverage measured for each. A coast much longer than the gaps isn't safer: it's the vehicle steering confidently at where something used to be.`);
  };
  scrub(slots.t, { value: timeout, min: tmin, max: tmax, log: true, fmt: (v) => `${v < 1 ? (v * 1000).toFixed(0) + " ms" : v.toFixed(2) + " s"}`, label: "Coast time", tone: "me" }, (v) => { timeout = v; draw(); poke(); });
  draw();

  // Part 2: the tracker that emitted nothing
  const box = h("div", { style: "margin-top:2rem" }, root);
  const { slots: s2 } = sentence(box, `Before any of that, the tracker only starts a track above a confidence threshold. The one shipped, inherited from pedestrian benchmarks, was {thr}. On real underwater footage, the tracker then follows the target <b>{pres}</b> of the time.`);
  const el2 = svg(box, W, 150, "Real detection confidences: 10th, 50th and 90th percentile and maximum, against the track-creation threshold");
  const cx = (v: number) => L + v * (R - L) / 0.7;
  s("line", { x1: cx(0), x2: cx(0.7), y1: 70, y2: 70, stroke: C.line }, el2);
  [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7].forEach((v) => { s("text", { x: cx(v), y: 92, "text-anchor": "middle", class: "x-tick" }, el2).textContent = v.toFixed(1); });
  const pc = c.confPercentiles;
  s("rect", { x: cx(pc.p10), width: cx(pc.p90) - cx(pc.p10), y: 58, height: 24, rx: 3, fill: C.medium, opacity: 0.3 }, el2);
  ([["p10", pc.p10], ["median", pc.p50], ["p90", pc.p90], ["max", pc.max]] as const).forEach(([n, v], i) => { s("line", { x1: cx(v), x2: cx(v), y1: 52, y2: 88, stroke: C.medium, "stroke-width": 2 }, el2); s("text", { x: cx(v), y: 44 - (i % 2) * 14, "text-anchor": "middle", class: "x-lbl", fill: C.medium }, el2).textContent = `${n} ${v}`; });
  s("text", { x: L, y: 130, class: "x-lbl" }, el2).textContent = `${c.clip}: real detection confidences`;
  const thrL = s("line", { y1: 20, y2: 110, stroke: C.failure, "stroke-width": 3 }, el2);
  const thrT = s("text", { y: 122, "text-anchor": "middle", class: "x-lbl", fill: C.failure }, el2);
  const say2 = readout(box);
  const rows = c.thresholdPresence as [number, number][];
  const setThr = (i: number) => {
    const [t, p] = rows[i];
    set(thrL, { x1: cx(t), x2: cx(t) }); set(thrT, { x: cx(t) }); thrT.textContent = `threshold ${t.toFixed(2)}`;
    s2.thr.innerHTML = `<b class="k-failure">${t.toFixed(2)}</b>`;
    s2.pres.innerHTML = `<span class="${p > 20 ? "k-measured" : "k-failure"}">${p.toFixed(1)}%</span>`;
    say2(i === 0 ? `0.6% of real detections reach 0.60, so no track ever starts. Every node still looks healthy: an empty array is a valid message. Clamped to the detector's own floor, the same footage gave <b class="k-measured">${c.arms[2][1]}%</b> presence, mission-aborting losses fell from <b>${c.arms[0][2]}</b> to <b>${c.arms[2][2]}</b>, and /tracks went from silence to <b>${c.tracksHzAfter} Hz</b>.` : `measured presence at this threshold: ${p}%.`);
  };
  choice(box, "Track-creation threshold", rows.map(([t]) => ({ label: `threshold ${t.toFixed(2)}`, on: () => setThr(rows.findIndex((r) => r[0] === t)) })), 0);
  setThr(0);
}
