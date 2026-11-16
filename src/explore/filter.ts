/**
 * The 2024 gimbal's tilt estimator, three ways (fh1m gist e3a64a4d, v1):
 *   as flashed: `float angleX = 0;` inside the function, so every call starts from zero and the
 *               "complementary filter" returns 0.96·gyro·dt + 0.04·accel, about 4 % of the tilt;
 *   fixed:      the estimate lives outside the loop and integrates the gyro between calls;
 *   ms for dt:  memory kept, but dt passed in milliseconds, so the gyro term is 1000× too strong.
 * Simulated: a slow sway plus a 10° gust at 2 s, gyro with a 3 °/s bias and noise, accelerometer
 * with vibration noise. The true tilt is known, so the error is exact.
 */
import { C, s, svg, h, scrub, readout, choice, axis, scale } from "./kit";

const DT = 0.01, N = 600; // 6 s at 100 Hz
type Mode = "flashed" | "fixed" | "ms";

function rng(seed: number) { let x = seed; return () => { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; }; }
function gauss(r: () => number) { return Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r()); }

/** The world: true tilt, gyro rate and accelerometer angle, fixed for every run so modes compare fairly. */
const world = (() => {
  const r = rng(7), truth: number[] = [], gyro: number[] = [], accel: number[] = [];
  for (let i = 0; i < N; i++) {
    const t = i * DT;
    const th = 8 * Math.sin(2 * Math.PI * 0.6 * t) + (t > 2 ? 10 * (1 - Math.exp(-(t - 2) * 3)) : 0);
    truth.push(th);
  }
  for (let i = 0; i < N; i++) {
    const rate = i ? (truth[i] - truth[i - 1]) / DT : 0;
    gyro.push(rate + 3 + gauss(r) * 1.5);          // °/s: bias 3, noise 1.5
    accel.push(truth[i] + gauss(r) * 4);           // °: vibration noise
  }
  return { truth, gyro, accel };
})();

function run(mode: Mode, alpha: number) {
  const est: number[] = [];
  let kept = 0;
  for (let i = 0; i < N; i++) {
    const dt = mode === "ms" ? DT * 1000 : DT;
    if (mode === "flashed") { const angleX = 0; est.push(alpha * (angleX + world.gyro[i] * dt) + (1 - alpha) * world.accel[i]); }
    else { kept = alpha * (kept + world.gyro[i] * dt) + (1 - alpha) * world.accel[i]; est.push(kept); }
  }
  return est;
}

export function mount(root: HTMLElement) {
  let mode: Mode = "flashed", alpha = 0.96;
  const W = 640, H = 300, L = 52, R = 624, T = 16, B = 262;
  const el = svg(root, W, H, "True tilt of the rocket and the estimator's guess over six seconds");
  const x = scale(0, (N - 1) * DT, L, R), y = scale(-15, 30, B, T);
  const g = s("g", {}, el);
  axis(g, { dir: "x", x0: L, x1: R, y0: B, y1: B, ticks: [0, 1, 2, 3, 4, 5, 6], at: x, fmt: (v) => `${v} s`, label: "time" });
  axis(g, { dir: "y", x0: L, x1: R, y0: B, y1: T, ticks: [-10, 0, 10, 20, 30], at: y, fmt: (v) => `${v}°`, label: "tilt" });
  const path = (a: number[]) => a.map((v, i) => `${i ? "L" : "M"}${x(i * DT).toFixed(1)} ${y(Math.max(-15, Math.min(30, v))).toFixed(1)}`).join("");
  s("path", { d: path(world.accel), fill: "none", stroke: C.faint, "stroke-width": 1, opacity: 0.55 }, g);
  s("path", { d: path(world.truth), fill: "none", stroke: C.chalk, "stroke-width": 2.5 }, g);
  const estPath = s("path", { fill: "none", stroke: C.me, "stroke-width": 2.5 }, g);
  s("text", { x: x(0.15), y: y(27), class: "x-lbl", fill: C.chalk }, g).textContent = "true tilt";
  s("text", { x: x(0.15), y: y(22.5), class: "x-lbl", fill: C.me }, g).textContent = "what the controller is told";
  s("text", { x: x(0.15), y: y(18), class: "x-lbl", fill: C.faint }, g).textContent = "raw accelerometer";
  s("line", { x1: x(2), x2: x(2), y1: T, y2: B, stroke: C.dim, "stroke-dasharray": "3 4" }, g);
  s("text", { x: x(2) + 6, y: T + 12, class: "x-lbl" }, g).textContent = "gust";

  const controls = h("div", { style: "display:flex;flex-wrap:wrap;gap:.6rem 1.2rem;align-items:center;margin-top:.6rem" }, root);
  choice(controls, "Estimator", [
    { label: "as flashed in 2024", on: () => { mode = "flashed"; draw(); } },
    { label: "memory kept", on: () => { mode = "fixed"; draw(); } },
    { label: "memory kept, dt in ms", on: () => { mode = "ms"; draw(); } },
  ]);
  const wrap = h("p", { class: "x-say", style: "margin:0" }, controls, "gyro weight ");
  const a = h("span", {}, wrap);
  scrub(a, { value: alpha, min: 0.8, max: 0.995, step: 0.005, fmt: (v) => v.toFixed(3), label: "Gyro weight in the complementary filter", tone: "measured" }, (v) => { alpha = v; draw(); });
  const say = readout(root);

  function draw() {
    const e = run(mode, alpha);
    estPath.setAttribute("d", path(e));
    let se = 0, worst = 0;
    for (let i = 0; i < N; i++) { const d = e[i] - world.truth[i]; se += d * d; worst = Math.max(worst, Math.abs(d)); }
    const rms = Math.sqrt(se / N);
    const share = e.slice(250).reduce((p, v) => p + v, 0) / world.truth.slice(250).reduce((p, v) => p + v, 0);
    const why = mode === "flashed"
      ? `Starting from zero every call, the filter reports about <b>${Math.round(share * 100)} %</b> of the real tilt. The controller is correcting a number with no history.`
      : mode === "ms"
        ? `The gyro term is a thousand times too strong: the estimate runs off the chart within a few samples.`
        : `Gyro for the fast motion, accelerometer to pull the bias back. The gyro's 3 °/s bias costs a small, steady offset.`;
    say(`RMS error <b style="color:${C.me}">${rms > 999 ? "off the chart" : rms.toFixed(1) + "°"}</b>, worst <b>${worst > 999 ? "∞" : worst.toFixed(1) + "°"}</b>. ${why}`);
  }
  draw();
}
