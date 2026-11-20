/** Nominal two-link geometry and settled commands from the supplied Mini_Arm_IK_ESP prototype.
 * Lengths are inches, confirmed by Fahim. No hardware, contact, flex or motion dynamics are simulated.
 */
import { canvas, readout, slider, buttons, C, css, emit } from "./ui";

const L1 = 15.5, L2 = 14, RAD = Math.PI / 180;
const START_X = 21.4, START_Y = 13.8, EXTENT = 42;
type Mode = "ideal" | "archive";

function solve(x: number, y: number, mode: Mode) {
  const squared = x * x + y * y, radius = Math.sqrt(squared);
  const geometric = radius >= Math.abs(L1 - L2) && radius <= L1 + L2;
  let direction = Math.atan2(y, -x) / RAD;
  if (direction < 0) direction += 360;
  let servo1: number, servo2: number;
  if (radius > L1 + L2) { servo1 = direction - 60; servo2 = 10; }
  else {
    const base = Math.acos((L1 * L1 + squared - L2 * L2) / (2 * L1 * radius)) / RAD;
    const triangle = Math.acos((L1 * L1 + L2 * L2 - squared) / (2 * L1 * L2)) / RAD;
    servo1 = direction - base - 60;
    servo2 = 10 + (180 - triangle);
  }
  const finite = Number.isFinite(servo1) && Number.isFinite(servo2) && (mode === "archive" || geometric);
  const limited = finite && (servo1 < 30 || servo1 > 135 || servo2 < 10 || servo2 > 135);
  if (finite && mode === "archive") {
    servo1 = Math.trunc(Math.max(30, Math.min(135, servo1)));
    servo2 = Math.trunc(Math.max(10, Math.min(135, servo2)));
  }
  const q1 = (servo1 + 60) * RAD, q2 = (servo2 - 10) * RAD;
  const elbowX = -L1 * Math.cos(q1), elbowY = L1 * Math.sin(q1);
  const tipX = elbowX - L2 * Math.cos(q1 + q2), tipY = elbowY + L2 * Math.sin(q1 + q2);
  return { finite, geometric, limited, servo1, servo2, elbowX, elbowY, tipX, tipY, miss:Math.hypot(tipX - x, tipY - y) };
}

export function mount(el: HTMLElement, bus: EventTarget) {
  el.classList.add("bench-split");
  const view = document.createElement("div"), controls = document.createElement("div");
  view.className = "bench-view"; controls.className = "bench-controls";
  el.append(view, controls);
  const cv = canvas(view, 1, "Source-derived arm workspace in inches. Select a target or use the controls.");
  cv.el.tabIndex = 0;
  cv.el.style.touchAction = "pan-y";
  const instructions = document.createElement("p");
  instructions.textContent = "Pick a target in the plot, or use arrow keys in 0.5-inch steps. Compare a mathematical solution with the prototype’s limited, integer servo commands.";
  controls.append(instructions);
  let x = START_X, y = START_Y, mode: Mode = "archive";
  let pose = solve(x, y, mode), frame = 0;
  let published: typeof pose | undefined;
  const font = `13px ${css.getPropertyValue("--mono")}`;
  const format = (value: number) => `${value.toFixed(1)} in`;

  // Image of the source's command rectangle: q1 = servo1 + 60°, q2 = servo2 − 10°.
  const allowed = new Path2D();
  let first = true;
  const boundary = (q1: number, q2: number) => {
    const px = -L1 * Math.cos(q1 * RAD) - L2 * Math.cos((q1 + q2) * RAD);
    const py = L1 * Math.sin(q1 * RAD) + L2 * Math.sin((q1 + q2) * RAD);
    if (first) { allowed.moveTo(px, py); first = false; } else allowed.lineTo(px, py);
  };
  for (let q2 = 0; q2 <= 125; q2++) boundary(90, q2);
  for (let q1 = 90; q1 <= 195; q1++) boundary(q1, 125);
  for (let q2 = 125; q2 >= 0; q2--) boundary(195, q2);
  for (let q1 = 195; q1 >= 90; q1--) boundary(q1, 0);
  allowed.closePath();

  const queueDraw = () => { if (!frame) frame = requestAnimationFrame(draw); };
  const setTarget = (nextX: number, nextY: number) => {
    x = Math.round(Math.max(-40, Math.min(40, nextX)) * 10) / 10;
    y = Math.round(Math.max(-40, Math.min(40, nextY)) * 10) / 10;
    inputX.value = String(x); inputY.value = String(y);
    outputX.value = format(x); outputY.value = format(y);
    pose = solve(x, y, mode); queueDraw();
  };
  buttons(controls, [
    { label:"Ideal geometry", pressed:false, on:() => { mode = "ideal"; pose = solve(x, y, mode); queueDraw(); } },
    { label:"Archived commands", pressed:true, on:() => { mode = "archive"; pose = solve(x, y, mode); queueDraw(); } },
  ], "Arm calculation");
  const inputX = slider(controls, { label:"Target X", id:"arm-x", min:-40, max:40, step:0.1, value:x, fmt:format }, (value) => setTarget(value, y));
  const inputY = slider(controls, { label:"Target Y", id:"arm-y", min:-40, max:40, step:0.1, value:y, fmt:format }, (value) => setTarget(x, value));
  const outputX = controls.querySelector<HTMLOutputElement>('output[for="arm-x"]')!;
  const outputY = controls.querySelector<HTMLOutputElement>('output[for="arm-y"]')!;
  const presets = buttons(controls, [
    { label:"Source start", on:() => setTarget(START_X, START_Y) },
    { label:"Joint limit", on:() => setTarget(10, 10) },
    { label:"Beyond length", on:() => setTarget(40, 0) },
    { label:"Inner hole", on:() => setTarget(1, 0) },
    { label:"At the base", on:() => setTarget(0, 0) },
  ], "Arm boundary cases");
  presets[0].parentElement!.classList.add("arm-presets");
  const say = readout(controls);
  const note = document.createElement("p");
  note.className = "arm-legend";
  note.textContent = "Dashed rings: ideal reach. Blue region: nominal command bounds. Target and tip are separate markers; a position solution is not a keypress.";
  controls.append(note);

  function draw() {
    frame = 0;
    const { ctx, w, h } = cv;
    const scale = (Math.min(w, h) - 56) / (2 * EXTENT), cx = w / 2, cy = h / 2;
    const screenX = (value: number) => cx + value * scale;
    const screenY = (value: number) => cy - value * scale;
    ctx.clearRect(0, 0, w, h);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(scale, -scale);
    ctx.fillStyle = C.medium; ctx.globalAlpha = 0.12; ctx.fill(allowed); ctx.globalAlpha = 1;
    ctx.strokeStyle = C.medium; ctx.lineWidth = 1 / scale; ctx.stroke(allowed);
    ctx.strokeStyle = C.dim; ctx.setLineDash([5 / scale, 5 / scale]);
    for (const radius of [Math.abs(L1 - L2), L1 + L2]) { ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.stroke(); }
    ctx.setLineDash([]); ctx.restore();
    ctx.strokeStyle = C.line; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(22, cy); ctx.lineTo(w - 22, cy); ctx.moveTo(cx, 22); ctx.lineTo(cx, h - 22); ctx.stroke();
    ctx.font = font; ctx.fillStyle = C.dim; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const value of [-40, -20, 20, 40]) {
      ctx.fillText(String(value), screenX(value), cy + 14);
      ctx.fillText(String(value), cx - 17, screenY(value));
    }
    ctx.fillText("X (in)", w - 34, cy - 16); ctx.fillText("Y (in)", cx + 30, 16);
    if (pose.finite) {
      ctx.strokeStyle = C.chalk; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(screenX(pose.elbowX), screenY(pose.elbowY)); ctx.lineTo(screenX(pose.tipX), screenY(pose.tipY)); ctx.stroke();
      ctx.fillStyle = C.measured;
      for (let i = 0; i < 3; i++) { const px = i === 0 ? 0 : i === 1 ? pose.elbowX : pose.tipX, py = i === 0 ? 0 : i === 1 ? pose.elbowY : pose.tipY; ctx.beginPath(); ctx.arc(screenX(px), screenY(py), 4, 0, Math.PI * 2); ctx.fill(); }
      ctx.strokeStyle = C.failure; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(screenX(pose.tipX), screenY(pose.tipY)); ctx.lineTo(screenX(x), screenY(y)); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.strokeStyle = C.estimate; ctx.lineWidth = 2;
    const tx = screenX(x), ty = screenY(y);
    ctx.beginPath(); ctx.arc(tx, ty, 7, 0, Math.PI * 2); ctx.moveTo(tx - 10, ty); ctx.lineTo(tx + 10, ty); ctx.moveTo(tx, ty - 10); ctx.lineTo(tx, ty + 10); ctx.stroke();
    if (published !== pose) {
      const request = `target (${x.toFixed(1)}, ${y.toFixed(1)}) in`;
      if (!pose.finite) say(`${request} · <span class="failure">${mode === "archive" ? "non-finite source angles; no valid command pose" : "no geometric solution"}</span>`);
      else if (mode === "ideal") say(`${request} · ideal branch · q1 ${(pose.servo1 + 60).toFixed(1)}° · q2 ${(pose.servo2 - 10).toFixed(1)}° · <span class="measured">geometric solution, not a keypress</span>`);
      else say(`${request} · servo ${pose.servo1}° / ${pose.servo2}°${pose.limited ? " · command clamped" : " · integer commands"} · nominal tip (${pose.tipX.toFixed(3)}, ${pose.tipY.toFixed(3)}) in · <b>miss ${pose.miss.toFixed(3)} in</b>`);
      emit(bus, "ik-arm", { x, y, mode, finite:pose.finite, geometric:pose.geometric, nominalMiss:pose.finite ? pose.miss : null });
      published = pose;
    }
  }

  const pick = (event: PointerEvent) => {
    const bounds = cv.el.getBoundingClientRect(), scale = (Math.min(cv.w, cv.h) - 56) / (2 * EXTENT);
    setTarget((event.clientX - bounds.left - cv.w / 2) / scale, -(event.clientY - bounds.top - cv.h / 2) / scale);
  };
  cv.el.addEventListener("pointerdown", (event) => { if (event.pointerType === "mouse") cv.el.setPointerCapture(event.pointerId); pick(event); });
  cv.el.addEventListener("pointermove", (event) => { if (event.pointerType === "mouse" && event.buttons) pick(event); });
  cv.el.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowLeft": setTarget(x - 0.5, y); break;
      case "ArrowRight": setTarget(x + 0.5, y); break;
      case "ArrowUp": setTarget(x, y + 0.5); break;
      case "ArrowDown": setTarget(x, y - 0.5); break;
      default: return;
    }
    event.preventDefault();
  });
  cv.onResize(queueDraw);
  queueDraw();
}
