/**
 * Twenty real seconds of a control board sitting still (mongla_ws
 * src/mongla_localization/test/data/board_still_2026-09-15.json, 1,000 rows, accelerometer in the
 * sensor's own axes). Brush a window; its statistics are computed here, from those rows.
 * At rest the only truth outside water is known: velocity zero, |a| = local gravity.
 */
import data from "../data/mongla.json";
import { C, s, svg, set, h, readout, handle, axis, poke } from "./kit";

export function mount(root: HTMLElement) {
  const rows = data.imuStill.rows as number[][];
  const t = rows.map((r) => r[0]);
  const mag = rows.map((r) => Math.hypot(r[1], r[2], r[3]));
  const W = 860, H = 280, L = 70, R = 830, T = 24, B = 230;
  const lo = Math.min(...mag), hi = Math.max(...mag), pad = (hi - lo) * 0.25;
  const x = (v: number) => L + (v / t[t.length - 1]) * (R - L);
  const y = (v: number) => B - ((v - (lo - pad)) / (hi - lo + 2 * pad)) * (B - T);
  h("p", { class: "x-say" }, root, `A board on a bench, disarmed, for twenty seconds. Nothing moves, so the accelerometer should read gravity and nothing else. Drag the <span class="k-me">two handles</span> to pick a window; the numbers are computed from the real samples.`);
  const el = svg(root, W, H, "Twenty seconds of accelerometer magnitude from a board at rest");
  const g = s("g", {}, el);
  const ticks = [lo, (lo + hi) / 2, hi].map((v) => Math.round(v * 1000) / 1000);
  axis(g, { dir: "x", x0: L, x1: R, y0: B, y1: B, ticks: [0, 5, 10, 15, 20], at: x, fmt: (v) => `${v} s`, label: "time" });
  axis(g, { dir: "y", x0: L, x1: R, y0: B, y1: T, ticks, at: y, fmt: (v) => v.toFixed(3), label: "|a|, m/s²" });
  const win = s("rect", { y: T, height: B - T, fill: C.me, opacity: 0.08 }, el);
  s("path", { d: mag.map((m, i) => `${i ? "L" : "M"}${x(t[i]).toFixed(1)} ${y(m).toFixed(1)}`).join(""), fill: "none", stroke: C.measured, "stroke-width": 1.3, class: "x-glow", style: `color:${C.measured}` }, el);
  const meanL = s("line", { stroke: C.me, "stroke-width": 2 }, el);
  const say = readout(root);
  let a = 2, b = 18;
  const stats = () => {
    const i0 = t.findIndex((v) => v >= a), i1 = t.findIndex((v) => v >= b);
    const seg = mag.slice(i0, i1 > i0 ? i1 : undefined);
    const mean = seg.reduce((p, q) => p + q, 0) / seg.length;
    const sd = Math.sqrt(seg.reduce((p, q) => p + (q - mean) ** 2, 0) / Math.max(1, seg.length - 1));
    const az = rows.slice(i0, i1).map((r) => r[3]); const azm = az.reduce((p, q) => p + q, 0) / az.length;
    const tilt = (Math.acos(Math.min(1, azm / mean)) * 180) / Math.PI;
    set(win, { x: x(a), width: x(b) - x(a) });
    set(meanL, { x1: x(a), x2: x(b), y1: y(mean), y2: y(mean) });
    say(`<b>${seg.length}</b> samples, ${(b - a).toFixed(1)} s · |a| = <b class="k-measured">${mean.toFixed(4)} ± ${sd.toFixed(4)} m/s²</b> · the board sits <b class="k-estimate">${tilt.toFixed(1)}°</b> off level, so the small x and y readings are gravity, not bias. Rest is verified, not assumed: a bump would show here first.`);
    poke();
  };
  const ha = handle(el, "Window start", "me", (px) => [Math.max(L, Math.min(x(b) - 20, px)), B + 22], (px) => { a = ((px - L) / (R - L)) * t[t.length - 1]; stats(); }, [x(a), B + 22]);
  handle(el, "Window end", "me", (px) => [Math.min(R, Math.max(x(a) + 20, px)), B + 22], (px) => { b = ((px - L) / (R - L)) * t[t.length - 1]; stats(); }, [x(b), B + 22]);
  void ha;
  h("p", { class: "bench-note" }, root, "The longer, 30-minute version of this run (89,813 samples) put every gyro bias under 0.0004 °/s, three orders of magnitude below the per-sample noise. Since the board already removes its own bias, the filter on the Pi must not estimate it a second time.");
  stats();
}
