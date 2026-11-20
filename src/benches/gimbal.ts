/**
 * A one-axis thrust-vector-control gimbal holding a rocket upright against wind.
 * Toy dynamics with honest shapes: θ'' = (torque_ctrl + wind)/J, PID on θ, actuator saturation.
 */
import { canvas, slider, readout, buttons, C, css, emit } from "./ui";

export function mount(el: HTMLElement, bus: EventTarget) {
  el.classList.add("bench-split");
  const view = document.createElement("div"), controls = document.createElement("div");
  view.className = "bench-view"; controls.className = "bench-controls";
  el.append(view, controls);
  const cv = canvas(view, 0.72, "A schematic rocket and its simulated tilt over eight seconds");
  cv.el.style.touchAction = "auto";
  const say = readout(controls);
  const g = { p: 6, i: 0, d: 0, wind: 0.6 };
  const DT = 1 / 240, T = 8, J = 1, SAT = 12;
  const trace = new Float64Array(Math.ceil(T / DT / 4));
  const plotFont = `13px ${css.getPropertyValue("--mono")}`;
  let drawQueued = false;

  const simulate = () => {
    let th = 0, w = 0, integ = 0, prev = 0;
    let sample = 0;
    for (let k = 0; k * DT < T; k++) {
      const t = k * DT;
      const wind = t > 1 ? g.wind * (1 + 0.25 * Math.sin(t * 3.1)) : 0;
      const err = -th;
      integ += err * DT;
      const der = (err - prev) / DT; prev = err;
      const u = Math.max(-SAT, Math.min(SAT, g.p * err + g.i * integ + g.d * der));
      w += ((u + wind) / J) * DT;
      th += w * DT;
      if (k % 4 === 0) trace[sample++] = th;
    }
    return trace;
  };

  const draw = () => {
    drawQueued = false;
    const tr = simulate();
    const tailStart = Math.floor(tr.length * 0.75);
    let peak = 0, tailMin = Infinity, tailMax = -Infinity, tailSum = 0;
    for (let i = 0; i < tr.length; i++) {
      peak = Math.max(peak, Math.abs(tr[i]));
      if (i >= tailStart) { tailMin = Math.min(tailMin, tr[i]); tailMax = Math.max(tailMax, tr[i]); tailSum += tr[i]; }
    }
    const ring = tailMax - tailMin, offset = tailSum / (tr.length - tailStart);
    const { ctx, w, h } = cv;
    ctx.clearRect(0, 0, w, h);
    const th = tr[tr.length - 1], rx = w * 0.18, ry = h * 0.62, rocketScale = Math.min(1, w * 0.16 / 102);
    ctx.save(); ctx.translate(rx, ry); ctx.rotate(th); ctx.scale(rocketScale, rocketScale);
    ctx.strokeStyle = C.chalk; ctx.lineWidth = 1.4 / rocketScale;
    ctx.strokeRect(-9, -80, 18, 80);
    ctx.beginPath(); ctx.moveTo(-9, -80); ctx.lineTo(0, -102); ctx.lineTo(9, -80); ctx.stroke();
    ctx.fillStyle = C.failure; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(0, 25); ctx.lineTo(6, 0); ctx.fill();
    ctx.restore();
    const x0 = w * 0.34, x1 = w * 0.98, ym = h * 0.55, sy = h * 0.25;
    const extent = Math.max(0.2, peak * 1.1), disturbanceX = x0 + (x1 - x0) / T;
    ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(x0, ym); ctx.lineTo(x1, ym); ctx.stroke();
    ctx.strokeStyle = C.medium; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(disturbanceX, ym - sy); ctx.lineTo(disturbanceX, ym + sy); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = C.measured; ctx.lineWidth = 1.6; ctx.beginPath();
    for (let i = 0; i < tr.length; i++) { const x = x0 + (x1 - x0) * i / (tr.length - 1), y = ym - tr[i] / extent * sy; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke(); ctx.lineWidth = 1;
    ctx.fillStyle = C.dim; ctx.font = plotFont;
    ctx.fillText(`tilt: auto ±${(extent * 180 / Math.PI).toFixed(1)}°`, x0, h * 0.12);
    ctx.fillText("gust starts at 1 s", x0, h * 0.21);
    ctx.fillText("0 s", x0, h * 0.92); ctx.textAlign = "right"; ctx.fillText("8 s", x1, h * 0.92); ctx.textAlign = "start";
    let verdict: string;
    if (!Number.isFinite(peak) || peak > 1.5) verdict = '<span class="failure">large-angle response</span>: beyond this linear model’s useful range';
    else if (ring > 0.05) verdict = '<span class="estimate">still ringing</span>: add D, the brake';
    else if (Math.abs(offset) > 0.01) verdict = `<span class="estimate">mean offset ${(offset * 180 / Math.PI).toFixed(1)}°</span>: integral action can reduce persistent error`;
    else verdict = '<span class="measured">holding</span>: upright and quiet';
    say(`P ${g.p.toFixed(1)} · I ${g.i.toFixed(1)} · D ${g.d.toFixed(2)} · peak ${(peak * 180 / Math.PI).toFixed(1)}° · ${verdict}`);
    emit(bus, "gimbal", { tilt: th });
  };
  const queueDraw = () => { if (!drawQueued) { drawQueued = true; requestAnimationFrame(draw); } };

  slider(controls, { label: "P · restoring", min: 0, max: 20, step: 0.5, value: g.p, fmt: (v) => v.toFixed(1), id: "g-p" }, (v) => { g.p = v; queueDraw(); });
  slider(controls, { label: "I · accumulated error", min: 0, max: 10, step: 0.25, value: g.i, fmt: (v) => v.toFixed(2), id: "g-i" }, (v) => { g.i = v; queueDraw(); });
  slider(controls, { label: "D · damping", min: 0, max: 6, step: 0.05, value: g.d, fmt: (v) => v.toFixed(2), id: "g-d" }, (v) => { g.d = v; queueDraw(); });
  slider(controls, { label: "disturbance scale", min: 0, max: 2, step: 0.05, value: g.wind, fmt: (v) => v.toFixed(2), id: "g-w" }, (v) => { g.wind = v; queueDraw(); });
  buttons(controls, [
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
  cv.onResize(queueDraw);
  queueDraw();
}
