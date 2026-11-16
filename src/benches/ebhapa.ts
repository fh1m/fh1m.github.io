/**
 * E-Bhapa in a room, live: v1 as flashed in 2024 (front/rear wiring, uint8 wrap,
 * "follow" drives into things) vs v2 (fixed wiring + signs, distance hold, boredom rule).
 * A port of fh1m/E-Bhapa sim/run.py, at a gentler step size.
 */
import { canvas, readout, buttons, C, emit } from "./ui";

const ROOM = 3, SPEED = 0.45, TRACK = 0.14, BODY = 0.09;

export function mount(el: HTMLElement, bus: EventTarget) {
  const cv = canvas(el, 0.78, "Top view of a 3 by 3 metre room with E-Bhapa driving inside it");
  const say = readout(el);
  let version: "v1" | "v2" = "v1";
  let st = fresh();
  let raf = 0, last = 0;

  function fresh() {
    return { x: 0.9, y: 0.9, th: 0.55, cmd: [0, 0] as [number, number], t: 0, pinned: 0, busyUntil: 0, plan: [] as { until: number; cmd: [number, number] }[], boredD: -1, boredT: 0, trail: [] as [number, number][], rng: 7 };
  }
  const rand = () => ((st.rng = (st.rng * 1664525 + 1013904223) >>> 0) / 4294967296);
  const sonar = () => {
    const c = Math.cos(st.th), s = Math.sin(st.th);
    const ts = [c > 1e-9 ? (ROOM - st.x) / c : Infinity, c < -1e-9 ? -st.x / c : Infinity, s > 1e-9 ? (ROOM - st.y) / s : Infinity, s < -1e-9 ? -st.y / s : Infinity];
    return Math.min(4, ...ts) * 100;
  };
  const drive = (l: number, r: number): [number, number] => {
    if (version === "v1") { const side = (((l % 256) + 256) % 256 + ((r % 256) + 256) % 256) / 2 / 255 * SPEED; return [side, side]; }
    return [(Math.max(-255, Math.min(255, l)) / 255) * SPEED, (Math.max(-255, Math.min(255, r)) / 255) * SPEED];
  };
  const decide = () => {
    const d = sonar();
    const at = (ms: number, cmd: [number, number]) => {
      const start = st.plan.length ? st.plan[st.plan.length - 1].until : st.t; // actions run back to back, like delay() calls
      st.plan.push({ until: start + ms / 1000, cmd });
    };
    if (version === "v1") {
      if (d > 0 && d < 25) { const s = 100 + (155 * d) / 25; st.cmd = drive(s, s); }
      else if (d < 30) { at(300 + rand() * 500, [0, 0]); const left = rand() < 0.5; at(200 + rand() * 300, drive(left ? 0 : 200, left ? 200 : 0)); }
      else { const a = Math.floor(rand() * 10), sp = 255;
        if (a === 0) st.cmd = drive(sp, sp); else if (a === 1) st.cmd = drive(-sp, -sp);
        else if (a === 2) at(200 + rand() * 300, drive(-200, 200)); else if (a === 3) at(200 + rand() * 300, drive(200, -200));
        else if (a === 4) at(300 + rand() * 500, [0, 0]); }
      at(100, st.cmd);
    } else {
      const turnAway = () => { const left = rand() < 0.5; at(250 + rand() * 350, drive(left ? -200 : 200, left ? 200 : -200)); };
      if (d < 12) { at(300, drive(-180, -180)); turnAway(); }
      else if (d < 60) {
        if (st.boredD < 0 || Math.abs(d - st.boredD) > 3) { st.boredD = d; st.boredT = st.t; }
        if (st.t - st.boredT > 2.5) { turnAway(); st.boredD = -1; }
        else { const e = d - 30; let p = Math.abs(e) <= 4 ? 0 : Math.max(-255, Math.min(255, 9 * e)); if (p && Math.abs(p) < 90) p = Math.sign(p) * 90; st.cmd = drive(p, p); }
      } else { st.boredD = -1; const a = Math.floor(rand() * 4);
        if (a < 2) { st.cmd = drive(180, 180); at(400, st.cmd); } else if (a === 2) turnAway(); else at(200 + rand() * 300, [0, 0]); }
      at(50, st.cmd);
    }
  };
  const step = (dt: number) => {
    while (st.plan.length && st.plan[0].until <= st.t) st.plan.shift();
    if (!st.plan.length) decide();
    const [vl, vr] = st.plan.length ? st.plan[0].cmd : st.cmd;
    const v = (vl + vr) / 2, w = (vr - vl) / TRACK;
    const nx = st.x + v * Math.cos(st.th) * dt, ny = st.y + v * Math.sin(st.th) * dt;
    const hit = nx < BODY || nx > ROOM - BODY || ny < BODY || ny > ROOM - BODY;
    if (hit && Math.abs(v) > 1e-6) st.pinned += dt; else { st.x = nx; st.y = ny; }
    st.th += w * dt; st.t += dt;
  };
  const draw = () => {
    const { ctx, w, h } = cv; const s = Math.min(w, h) / ROOM * 0.94, ox = (w - ROOM * s) / 2, oy = (h - ROOM * s) / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "#24304a"; ctx.lineWidth = 2; ctx.strokeRect(ox, oy, ROOM * s, ROOM * s); ctx.lineWidth = 1;
    ctx.strokeStyle = version === "v1" ? C.failure : C.medium; ctx.beginPath();
    st.trail.forEach(([x, y], i) => (i ? ctx.lineTo(ox + x * s, oy + y * s) : ctx.moveTo(ox + x * s, oy + y * s))); ctx.stroke();
    const px = ox + st.x * s, py = oy + st.y * s;
    ctx.save(); ctx.translate(px, py); ctx.rotate(st.th);
    ctx.fillStyle = "#070c18"; ctx.strokeStyle = C.chalk; ctx.fillRect(-12, -9, 24, 18); ctx.strokeRect(-12, -9, 24, 18);
    ctx.fillStyle = C.estimate; ctx.beginPath(); ctx.arc(10, -4, 2.5, 0, 7); ctx.arc(10, 4, 2.5, 0, 7); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "rgba(215,101,93,.45)"; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(px, py);
    const d = sonar() / 100; ctx.lineTo(px + Math.cos(st.th) * d * s, py + Math.sin(st.th) * d * s); ctx.stroke(); ctx.setLineDash([]);
    const pin = st.t ? (st.pinned / st.t) * 100 : 0;
    say(`${version} · ${st.t.toFixed(0)} s · pinned against a wall <b class="${pin > 30 ? "failure" : "measured"}">${pin.toFixed(0)} %</b> of the time`);
  };
  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    for (let i = 0; i < 4; i++) step(dt);
    if (st.trail.length === 0 || Math.hypot(st.trail[st.trail.length - 1][0] - st.x, st.trail[st.trail.length - 1][1] - st.y) > 0.02) st.trail.push([st.x, st.y]);
    draw();
    if (st.t < 120) raf = requestAnimationFrame(loop);
  };
  const reset = () => { cancelAnimationFrame(raf); st = fresh(); last = performance.now(); raf = requestAnimationFrame(loop); emit(bus, "ebhapa", version); };
  buttons(el, [
    { label: "v1 · as flashed, 2024", pressed: true, on: () => { version = "v1"; reset(); } },
    { label: "v2 · fixed", pressed: false, on: () => { version = "v2"; reset(); } },
  ], "Firmware version");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { for (let i = 0; i < 2400; i++) { step(0.025); if (i % 6 === 0) st.trail.push([st.x, st.y]); } draw(); }
  else { new IntersectionObserver(([e]) => { if (e.isIntersecting && !raf) reset(); else if (!e.isIntersecting) { cancelAnimationFrame(raf); raf = 0; } }).observe(cv.el); }
  cv.onResize(draw);
  draw();
}
