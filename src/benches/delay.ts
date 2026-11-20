/**
 * The obedient, delayed human from fh1m/four-leds: sees the LEDs `delay` ms late,
 * moves at 600 px/s in the lit direction. Bang-bang LEDs vs LEDs dimmed in proportion.
 */
import { canvas, slider, readout, buttons, C, emit } from "./ui";

export function mount(el: HTMLElement, bus: EventTarget) {
  const cv = canvas(el, 0.32, "Error over time for a person steering a camera with four LEDs");
  const say = readout(el);
  const s = { delay: 250, zone: 50, mode: "bang" as "bang" | "prop" };
  const DT = 0.005, T = 6, SPEED = 600;

  const run = () => {
    const n = Math.round(T / DT), lag = Math.round(s.delay / 1000 / DT), hold = Math.round(1 / 15 / DT);
    const xs: number[] = []; const cmds: number[] = [];
    let x = 180, shown = 0;
    for (let k = 0; k < n; k++) {
      if (k % hold === 0) shown = Math.abs(x) <= s.zone ? 0 : s.mode === "bang" ? -Math.sign(x) : Math.max(-1, Math.min(1, -x / (4 * s.zone)));
      cmds.push(shown);
      const act = k >= lag ? cmds[k - lag] : 0;
      x += act * SPEED * DT;
      xs.push(x);
    }
    return xs;
  };

  const draw = () => {
    const xs = run();
    const { ctx, w, h } = cv;
    ctx.clearRect(0, 0, w, h);
    const ym = h / 2, sy = (h * 0.42) / 200;
    ctx.fillStyle = "rgba(123,156,224,0.12)"; ctx.fillRect(0, ym - s.zone * sy, w, 2 * s.zone * sy);
    ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(0, ym); ctx.lineTo(w, ym); ctx.stroke();
    ctx.strokeStyle = s.mode === "bang" ? C.failure : C.medium; ctx.lineWidth = 1.6; ctx.beginPath();
    xs.forEach((x, i) => { const px = (i / xs.length) * w, py = ym - Math.max(-200, Math.min(200, x)) * sy; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
    ctx.stroke(); ctx.lineWidth = 1;
    ctx.fillStyle = C.dim; ctx.font = "11px 'Commit Mono', monospace";
    ctx.fillText(`buzzer zone ±${s.zone} px`, 8, ym - s.zone * sy - 6);
    ctx.fillText("6 s", w - 26, h - 6);
    const last = xs.slice(-Math.round(1 / DT));
    const settled = last.every((x) => Math.abs(x) <= s.zone);
    const overshoot = (SPEED * s.delay) / 1000;
    say(`overshoot per reversal ≈ <b>${overshoot.toFixed(0)} px</b> vs a ${2 * s.zone} px zone · ${settled ? '<span class="measured">settled</span>' : '<span class="failure">still hunting after 6 s</span>'}`);
    emit(bus, "delay", { settled });
  };
  slider(el, { label: "reaction delay", min: 0, max: 600, step: 10, value: s.delay, fmt: (v) => `${v} ms`, id: "dl-delay" }, (v) => { s.delay = v; draw(); });
  slider(el, { label: "buzzer zone", min: 10, max: 120, step: 5, value: s.zone, fmt: (v) => `±${v} px`, id: "dl-zone" }, (v) => { s.zone = v; draw(); });
  buttons(el, [
    { label: "LEDs on/off (2024)", pressed: true, on: () => { s.mode = "bang"; draw(); } },
    { label: "LEDs dimmed", pressed: false, on: () => { s.mode = "prop"; draw(); } },
  ], "LED display");
  cv.onResize(draw);
  draw();
}
