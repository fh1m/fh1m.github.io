/**
 * A depth-sensor calibration with lying readings (from fh1m/trust-issues).
 * Least squares vs RANSAC (+ least-squares refit on inliers), computed live.
 */
import { canvas, slider, readout, buttons, C, emit } from "./ui";

const TRUE_M = 0.0125, TRUE_B = -1.8, N = 90;

function lsq(xs: number[], ys: number[]) {
  const n = xs.length, mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  const m = sxy / sxx; return { m, b: my - m * mx };
}

function ransac(xs: number[], ys: number[], rand: () => number) {
  let best: number[] = [];
  for (let it = 0; it < 200; it++) {
    const i = Math.floor(rand() * xs.length), j = Math.floor(rand() * xs.length);
    if (i === j || xs[i] === xs[j]) continue;
    const m = (ys[j] - ys[i]) / (xs[j] - xs[i]), b = ys[i] - m * xs[i];
    const inl = xs.map((x, k) => k).filter((k) => Math.abs(ys[k] - (m * xs[k] + b)) < 0.15);
    if (inl.length > best.length) best = inl;
  }
  return { fit: lsq(best.map((k) => xs[k]), best.map((k) => ys[k])), inliers: new Set(best) };
}

export function mount(el: HTMLElement, bus: EventTarget) {
  const cv = canvas(el, 0.62, "Calibration readings, some of them lies, with two fitted lines");
  const say = readout(el);
  let frac = 0.2, seed = 7;

  const draw = () => {
    let s = seed;
    const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-12)) * Math.cos(2 * Math.PI * rand());
    const xs: number[] = [], ys: number[] = [], liar: boolean[] = [];
    for (let i = 0; i < N; i++) {
      const x = 150 + rand() * 850; const l = rand() < frac;
      xs.push(x); ys.push(TRUE_M * x + TRUE_B + gauss() * 0.03 + (l ? 2 + rand() * 4 : 0)); liar.push(l);
    }
    const ols = lsq(xs, ys); const rs = ransac(xs, ys, rand);
    const err = (f: { m: number; b: number }) => { let e = 0; for (let x = 150; x <= 1000; x += 17) e += Math.abs(f.m * x + f.b - (TRUE_M * x + TRUE_B)); return (e / 51) * 100; };
    const { ctx, w, h } = cv;
    ctx.clearRect(0, 0, w, h);
    const X = (x: number) => 20 + ((x - 150) / 850) * (w - 30), Y = (y: number) => h - 16 - ((y + 0.5) / 16) * (h - 26);
    xs.forEach((x, i) => {
      ctx.fillStyle = liar[i] ? C.failure : C.chalk;
      if (liar[i]) { ctx.font = "10px monospace"; ctx.fillText("×", X(x) - 3, Y(ys[i]) + 3); }
      else { ctx.beginPath(); ctx.arc(X(x), Y(ys[i]), 2, 0, 7); ctx.fill(); }
    });
    const line = (f: { m: number; b: number }, col: string, dash: number[]) => {
      ctx.strokeStyle = col; ctx.setLineDash(dash); ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(X(150), Y(f.m * 150 + f.b)); ctx.lineTo(X(1000), Y(f.m * 1000 + f.b)); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
    };
    line(ols, C.dim, [5, 4]); line(rs.fit, C.measured, []);
    ctx.fillStyle = C.dim; ctx.font = "11px 'Commit Mono', monospace";
    ctx.fillText("raw counts →", w - 92, h - 4); ctx.fillText("depth ↑", 4, 12);
    const eo = err(ols), er = err(rs.fit);
    say(`${Math.round(frac * 100)} % liars · least squares off by <b class="${eo > 5 ? "failure" : "measured"}">${eo.toFixed(1)} cm</b> · RANSAC off by <b class="${er > 5 ? "failure" : "measured"}">${er.toFixed(1)} cm</b> (mean depth error)`);
    emit(bus, "liars", { frac, ols: eo, ransac: er });
  };
  slider(el, { label: "readings that lie", min: 0, max: 0.6, step: 0.05, value: frac, fmt: (v) => `${Math.round(v * 100)} %`, id: "li-frac" }, (v) => { frac = v; draw(); });
  buttons(el, [{ label: "new sensor run", on: () => { seed = (seed * 31 + 17) >>> 0; draw(); } }]);
  const note = document.createElement("p");
  note.className = "bench-note";
  note.innerHTML = '<span style="color:var(--dim)">dashed</span>: least squares. <span style="color:var(--measured)">solid</span>: RANSAC, then least squares on the readings it believed.';
  el.append(note);
  cv.onResize(draw);
  draw();
}
