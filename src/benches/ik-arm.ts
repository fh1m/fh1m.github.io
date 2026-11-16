/**
 * Two-link arm, analytic inverse kinematics (elbow-up), over a keyboard.
 * Click or drag a key (or use the arrow keys) and the arm solves for it, or says it can't reach.
 */
import { canvas, readout, C, emit } from "./ui";

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export function mount(el: HTMLElement, bus: EventTarget) {
  const cv = canvas(el, 0.7, "A two-link arm above a keyboard, reaching for the selected key");
  cv.el.tabIndex = 0;
  cv.el.setAttribute("aria-label", "Two-link arm. Click a key, or focus here and use the arrow keys to move the target.");
  const say = readout(el);
  let row = 0, col = 4;
  let target = { x: 0, y: 0 };

  const geom = () => {
    const { w, h } = cv;
    const key = Math.min(w / 11.5, 34);
    const base = { x: w * 0.5, y: h * 0.12 };
    const L1 = h * 0.42, L2 = h * 0.36;
    return { w, h, key, base, L1, L2, kx0: w / 2 - key * 5, ky0: h * 0.58 };
  };
  const keyCenter = (r: number, c: number) => {
    const g = geom();
    return { x: g.kx0 + c * g.key + r * g.key * 0.35 + g.key / 2, y: g.ky0 + r * g.key + g.key / 2 };
  };

  const draw = () => {
    const g = geom(); const { ctx } = cv;
    ctx.clearRect(0, 0, g.w, g.h);
    ctx.font = `${Math.round(g.key * 0.38)}px 'Commit Mono', monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ROWS.forEach((keys, r) => [...keys].forEach((k, c) => {
      const p = keyCenter(r, c); const sel = r === row && c === col;
      ctx.strokeStyle = sel ? C.estimate : "#2c333a"; ctx.lineWidth = sel ? 1.6 : 1;
      ctx.strokeRect(p.x - g.key / 2 + 2, p.y - g.key / 2 + 2, g.key - 4, g.key - 4);
      ctx.fillStyle = sel ? C.estimate : C.dim; ctx.fillText(k, p.x, p.y);
    }));
    target = keyCenter(row, col);
    const dx = target.x - g.base.x, dy = target.y - g.base.y;
    const d = Math.hypot(dx, dy);
    const c2 = (d * d - g.L1 * g.L1 - g.L2 * g.L2) / (2 * g.L1 * g.L2);
    const reach = Math.abs(c2) <= 1;
    const q2 = reach ? Math.acos(c2) : 0;
    const q1 = Math.atan2(dy, dx) - (reach ? Math.atan2(g.L2 * Math.sin(q2), g.L1 + g.L2 * Math.cos(q2)) : 0);
    const elbow = { x: g.base.x + g.L1 * Math.cos(q1), y: g.base.y + g.L1 * Math.sin(q1) };
    const tip = { x: elbow.x + g.L2 * Math.cos(q1 + q2), y: elbow.y + g.L2 * Math.sin(q1 + q2) };
    ctx.strokeStyle = C.chalk; ctx.lineWidth = 5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(g.base.x, g.base.y); ctx.lineTo(elbow.x, elbow.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
    ctx.lineWidth = 1; ctx.fillStyle = C.measured;
    [g.base, elbow].forEach((p) => { ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, 7); ctx.fill(); });
    ctx.fillStyle = reach ? C.measured : C.failure; ctx.beginPath(); ctx.arc(tip.x, tip.y, 4, 0, 7); ctx.fill();
    const key = ROWS[row][col];
    say(reach
      ? `key <b>${key}</b> · shoulder ${((q1 * 180) / Math.PI).toFixed(1)}° · elbow ${((q2 * 180) / Math.PI).toFixed(1)}° · <span class="measured">pressed</span>`
      : `key <b>${key}</b> · <span class="failure">out of reach</span>: ${d.toFixed(0)} px away, the arm is ${(g.L1 + g.L2).toFixed(0)} px long`);
    emit(bus, "ik-arm", { key, reach });
  };

  const pick = (ev: PointerEvent) => {
    const r = cv.el.getBoundingClientRect(); const x = ev.clientX - r.left, y = ev.clientY - r.top;
    let best = Infinity;
    ROWS.forEach((keys, rr) => [...keys].forEach((_, cc) => { const p = keyCenter(rr, cc); const dd = Math.hypot(p.x - x, p.y - y); if (dd < best) { best = dd; row = rr; col = cc; } }));
    draw();
  };
  cv.el.addEventListener("pointerdown", (e) => { cv.el.setPointerCapture(e.pointerId); pick(e); });
  cv.el.addEventListener("pointermove", (e) => { if (e.buttons) pick(e); });
  cv.el.addEventListener("keydown", (e) => {
    const m: Record<string, [number, number]> = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] };
    const mv = m[e.key]; if (!mv) return;
    e.preventDefault();
    row = Math.max(0, Math.min(2, row + mv[0])); col = Math.max(0, Math.min(ROWS[row].length - 1, col + mv[1])); draw();
  });
  const note = document.createElement("p");
  note.className = "bench-note";
  note.textContent = "Analytic two-link IK, elbow up. The URC arm also had to find the keyboard first, which is the hard part.";
  el.append(note);
  cv.onResize(draw);
  draw();
}
