/**
 * A one-axis thrust-vector-control gimbal holding a rocket upright against wind.
 * Toy dynamics with honest shapes: θ'' = (torque_ctrl + wind)/J, PID on θ, actuator saturation.
 */
import { canvas, slider, readout, buttons, C, emit } from "./ui";

export function mount(el: HTMLElement, bus: EventTarget) {
  const cv = canvas(el, 0.62, "A rocket on a gimbal, and a trace of its tilt over eight seconds");
  const say = readout(el);
  const g = { p: 6, i: 0, d: 0, wind: 0.6 };
  const DT = 1 / 240, T = 8, J = 1, SAT = 12;

  const simulate = () => {
    let th = 0, w = 0, integ = 0, prev = 0;
    const trace: number[] = [];
    for (let k = 0; k * DT < T; k++) {
      const t = k * DT;
      const wind = t > 1 ? g.wind * (1 + 0.25 * Math.sin(t * 3.1)) : 0;
      const err = -th;
      integ += err * DT;
      const der = (err - prev) / DT; prev = err;
      const u = Math.max(-SAT, Math.min(SAT, g.p * err + g.i * integ + g.d * der));
      w += ((u + wind) / J) * DT;
      th += w * DT;
      if (k % 4 === 0) trace.push(th);
    }
    return trace;
  };

  const draw = () => {
    const tr = simulate();
    const { ctx, w, h } = cv;
    ctx.clearRect(0, 0, w, h);
    // rocket at the final tilt
    const th = tr[tr.length - 1];
    const rx = w * 0.18, ry = h * 0.62;
    ctx.save(); ctx.translate(rx, ry); ctx.rotate(Math.max(-1.2, Math.min(1.2, th)));
    ctx.strokeStyle = C.chalk; ctx.lineWidth = 1.4;
    ctx.strokeRect(-9, -80, 18, 80);
    ctx.beginPath(); ctx.moveTo(-9, -80); ctx.lineTo(0, -102); ctx.lineTo(9, -80); ctx.stroke();
    ctx.fillStyle = C.failure; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(0, 22 + Math.random() * 6); ctx.lineTo(6, 0); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = C.medium; ctx.setLineDash([3, 4]); ctx.beginPath();
    for (let y = h * 0.15; y < h * 0.85; y += 14) { ctx.moveTo(w * 0.02, y); ctx.lineTo(w * 0.02 + 10 * g.wind, y); }
    ctx.stroke(); ctx.setLineDash([]);
    // trace
    const x0 = w * 0.34, x1 = w * 0.98, ym = h * 0.5, sy = h * 0.35;
    ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(x0, ym); ctx.lineTo(x1, ym); ctx.stroke();
    ctx.strokeStyle = C.measured; ctx.lineWidth = 1.6; ctx.beginPath();
    tr.forEach((v, i) => { const x = x0 + ((x1 - x0) * i) / (tr.length - 1); const y = ym - Math.max(-1, Math.min(1, v / 0.6)) * sy; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.stroke(); ctx.lineWidth = 1;
    ctx.fillStyle = C.dim; ctx.font = "11px 'Commit Mono', monospace";
    ctx.fillText("tilt over 8 s (wind starts at 1 s)", x0, h * 0.1);
    // verdict
    const tail = tr.slice(Math.floor(tr.length * 0.75));
    const peak = Math.max(...tr.map(Math.abs));
    const ring = Math.max(...tail) - Math.min(...tail);
    const offset = tail.reduce((s, v) => s + v, 0) / tail.length;
    const diverged = !Number.isFinite(peak) || peak > 1.5;
    let verdict: string;
    if (diverged) verdict = '<span class="failure">lost it</span>: the gimbal saturated and the rocket fell over';
    else if (ring > 0.05) verdict = '<span class="estimate">still ringing</span>: add D, the brake';
    else if (Math.abs(offset) > 0.01) verdict = `<span class="estimate">parked ${(offset * 57.3).toFixed(1)}° off</span>: only I beats a steady wind`;
    else verdict = '<span class="measured">holding</span>: upright and quiet';
    say(`P ${g.p.toFixed(1)} · I ${g.i.toFixed(1)} · D ${g.d.toFixed(2)} · peak ${(peak * 57.3).toFixed(1)}° · ${verdict}`);
    emit(bus, "gimbal", { tilt: th });
  };

  slider(el, { label: "P · how hard", min: 0, max: 20, step: 0.5, value: g.p, fmt: (v) => v.toFixed(1), id: "g-p" }, (v) => { g.p = v; draw(); });
  slider(el, { label: "I · how stubborn", min: 0, max: 10, step: 0.25, value: g.i, fmt: (v) => v.toFixed(2), id: "g-i" }, (v) => { g.i = v; draw(); });
  slider(el, { label: "D · how cautious", min: 0, max: 6, step: 0.05, value: g.d, fmt: (v) => v.toFixed(2), id: "g-d" }, (v) => { g.d = v; draw(); });
  slider(el, { label: "wind", min: 0, max: 2, step: 0.05, value: g.wind, fmt: (v) => v.toFixed(2), id: "g-w" }, (v) => { g.wind = v; draw(); });
  buttons(el, [
    { label: "P only", on: () => setGains(6, 0, 0) },
    { label: "add D", on: () => setGains(6, 0, 3) },
    { label: "add I", on: () => setGains(6, 3, 3) },
  ], "Presets");
  function setGains(p: number, i: number, d: number) {
    for (const [id, v] of [["g-p", p], ["g-i", i], ["g-d", d]] as const) {
      const inp = el.querySelector<HTMLInputElement>(`#${id}`)!;
      inp.value = String(v); inp.dispatchEvent(new Event("input"));
    }
  }
  cv.onResize(draw);
  draw();
}
