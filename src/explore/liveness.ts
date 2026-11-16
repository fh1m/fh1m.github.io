/**
 * Alive is not working (mongla_ws commit 82c4e70). Twenty seconds of a detector node whose
 * accelerator is still held by an old process: the model load logs FATAL at 2 s and returns,
 * and the node keeps running, publishing, answering parameters and consuming 30 fps of camera,
 * with zero detections. Three monitoring policies, and when each one would tell anyone.
 */
import { C, s, svg, readout, choice, scale } from "./kit";

type Policy = "liveness" | "output" | "exit";
const T_END = 20, FAIL = 2, WINDOW = 3;

export function mount(root: HTMLElement) {
  let policy: Policy = "liveness";
  const W = 640, H = 270, L = 150, R = 624, T = 18;
  const el = svg(root, W, H, "Five signals from a detector node over twenty seconds, and when an alarm fires");
  const x = scale(0, T_END, L, R);
  const lanes = ["process alive", "topics up", "parameters answer", "camera frames", "detections"];
  const laneY = (i: number) => T + 10 + i * 38;
  const g = s("g", {}, el), dyn = s("g", {}, el);
  lanes.forEach((name, i) => {
    s("text", { x: 8, y: laneY(i) + 14, class: "x-lbl" }, g).textContent = name;
    s("rect", { x: L, y: laneY(i), width: R - L, height: 20, fill: C.grid, rx: 3 }, g);
  });
  for (let t = 0; t <= T_END; t += 5) s("text", { x: x(t) - 6, y: H - 12, class: "x-lbl" }, g).textContent = `${t} s`;
  s("line", { x1: x(FAIL), x2: x(FAIL), y1: T, y2: H - 30, stroke: C.failure, "stroke-dasharray": "3 4" }, g);
  s("text", { x: x(FAIL) + 6, y: T + 4, class: "x-lbl", fill: C.failure }, g).textContent = "model load: FATAL, returned";

  choice(root, "Monitoring policy", [
    { label: "alarm on liveness", on: () => { policy = "liveness"; draw(); } },
    { label: "alarm on output rate", on: () => { policy = "output"; draw(); } },
    { label: "the fix: exit or shout", on: () => { policy = "exit"; draw(); } },
  ]);
  const say = readout(root);

  function bar(i: number, t0: number, t1: number, tone: string) { s("rect", { x: x(t0), y: laneY(i), width: Math.max(0, x(t1) - x(t0)), height: 20, fill: tone, rx: 3, opacity: 0.85 }, dyn); }
  function draw() {
    dyn.replaceChildren();
    const dies = policy === "exit" ? FAIL : T_END;
    for (let i = 0; i < 4; i++) bar(i, 0, dies, C.measured);
    // detections: nothing ever, because the model never loaded (before 2 s it was still loading)
    s("text", { x: x(T_END / 2), y: laneY(4) + 14, class: "x-lbl", fill: C.failure, "text-anchor": "middle" }, dyn).textContent = "0 per second, the whole time";
    const alarm = policy === "liveness" ? null : policy === "output" ? FAIL + WINDOW : FAIL;
    if (alarm !== null) {
      s("line", { x1: x(alarm), x2: x(alarm), y1: T, y2: H - 30, stroke: C.me, "stroke-width": 3 }, dyn);
      s("text", { x: x(alarm) + 6, y: H - 34, class: "x-lbl", fill: C.me }, dyn).textContent = policy === "exit" ? "process exits: supervisor alarms" : "alarm: frames in, nothing out";
    }
    say(policy === "liveness"
      ? `Every liveness check stays green for all ${T_END} s. <b style="color:${C.failure}">No alarm, ever.</b> The vehicle would run its whole mission blind.`
      : policy === "output"
        ? `Frames arriving while detections stay at zero for ${WINDOW} s: <b style="color:${C.me}">alarm at ${FAIL + WINDOW} s</b>, ${WINDOW} s after the failure.`
        : `The node exits the moment the model can't load: <b style="color:${C.me}">the supervisor knows at ${FAIL} s</b>, and the log says why.`);
  }
  draw();
}
