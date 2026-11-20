/**
 * Twenty real seconds of a control board sitting still (mongla_ws
 * src/mongla_localization/test/data/board_still_2026-09-15.json, 1,000 rows, accelerometer in the
 * sensor's own axes). Brush a window; its statistics are computed here, from those rows.
 * Rest is the recorded setup, not something a scalar acceleration norm proves.
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
  h("p", { class: "x-say" }, root, `A disarmed board recorded as stationary for twenty seconds. Drag the <span class="k-me">two handles</span> to select an interval; its statistics use the published accelerometer samples in the original sensor axes.`);
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
    const i0 = t.findIndex((v) => v >= a), end = t.findIndex((v) => v > b);
    const i1 = end < 0 ? rows.length : end, count = i1 - i0;
    let total = 0, sx = 0, sy = 0, sz = 0;
    for (let i = i0; i < i1; i++) { total += mag[i]; sx += rows[i][1]; sy += rows[i][2]; sz += rows[i][3]; }
    const mean = total / count;
    let squared = 0;
    for (let i = i0; i < i1; i++) squared += (mag[i] - mean) ** 2;
    const sd = Math.sqrt(squared / (count - 1));
    const direction = Math.atan2(Math.hypot(sx, sy), sz) * 180 / Math.PI;
    set(win, { x: x(a), width: x(b) - x(a) });
    set(meanL, { x1: x(a), x2: x(b), y1: y(mean), y2: y(mean) });
    say(`<b>${count}</b> samples in the ${a.toFixed(2)}–${b.toFixed(2)} s selection. |a| mean ± sample SD: <b class="k-measured">${mean.toFixed(4)} ± ${sd.toFixed(4)} m/s²</b>. The mean acceleration vector is <b class="k-estimate">${direction.toFixed(1)}°</b> from +sensor-Z; that is not an independently calibrated board tilt.`);
    poke();
  };
  handle(el, "Window start", "me", (px) => [Math.max(L, Math.min(x(b) - 20, px)), B + 22], (px) => { a = ((px - L) / (R - L)) * t[t.length - 1]; stats(); }, [x(a), B + 22]);
  handle(el, "Window end", "me", (px) => [Math.min(R, Math.max(x(a) + 20, px)), B + 22], (px) => { b = ((px - L) / (R - L)) * t[t.length - 1]; stats(); }, [x(b), B + 22]);
  h("p", { class: "bench-note" }, root, "This 15 September accelerometer fixture is a different session from the reported thirty-minute record. A quiet magnitude trace does not independently establish zero motion, sensor calibration or gyro-bias behaviour.");
  stats();
}
