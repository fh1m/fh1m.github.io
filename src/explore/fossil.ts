/**
 * A full V4L2 queue holds the OLDEST frames, not the newest.
 * Model: the driver owns N buffers; while the consumer stalls, the camera fills the free ones
 * and drops everything after. Measured (mongla_ws camera-latency.md §1–2, 400 ms stall at 60 fps,
 * two cameras from different vendors): the queue held seq +1..+4, ages 396.1 / 380.2 / 364.2 / 344.2 ms.
 */
import data from "../data/mongla.json";
import { C, s, svg, set, h, scrub, sentence, readout, choice, poke } from "./kit";

export function mount(root: HTMLElement) {
  const meas = data.prose.frameAge;
  let stall = 400, fps = 60, pol = 0;
  const N = 4;
  const { slots } = sentence(root, `The consumer reads frame 31, then gets busy for {stall}. The camera keeps running at {fps}. Using {policy}, the next frame it acts on is <b class="k-failure">{age}</b> old.`);
  const W = 860, H = 250, L = 30, R = 840;
  const el = svg(root, W, H, "Camera frames over time during a consumer stall: which were captured into the driver's buffers and which were dropped");
  const g = s("g", {}, el);
  const say = readout(root);
  const pols = [
    { k: "A", name: "plain read()", what: "takes the oldest frame in the queue" },
    { k: "B", name: "drain, take the last", what: "empties the queue and keeps its newest, the standard advice" },
    { k: "C", name: "drain, then wait", what: "empties the queue and waits for a fresh frame (blocks)" },
    { k: "D", name: "a keep-up thread", what: "a thread that always dequeues, so the driver never fills" },
  ];

  const draw = () => {
    g.replaceChildren();
    const dt = 1000 / fps, tEnd = stall + dt * 3;
    const x = (t: number) => L + (t / tEnd) * (R - L);
    // stall band
    s("rect", { x: x(0), y: 30, width: x(stall) - x(0), height: 130, fill: C.me, opacity: 0.07 }, g);
    s("text", { x: x(stall / 2), y: 24, "text-anchor": "middle", class: "x-lbl", fill: C.me }, g).textContent = `consumer busy for ${stall.toFixed(0)} ms`;
    s("line", { x1: x(stall), x2: x(stall), y1: 30, y2: 200, stroke: C.me, "stroke-dasharray": "4 4" }, g);
    s("text", { x: x(stall) + 6, y: 196, class: "x-lbl", fill: C.me }, g).textContent = "it reads again";
    const frames = Math.floor(tEnd / dt);
    let kept = 0;
    const keptT: number[] = [];
    for (let i = 1; i <= frames; i++) {
      const t = i * dt;
      const during = t < stall;
      let state: "kept" | "dropped" | "after" = "after";
      if (during) { if (pol === 3 || kept < N) { state = "kept"; kept++; keptT.push(t); } else state = "dropped"; }
      if (pol === 3 && during) state = "kept";
      const col = state === "kept" ? C.medium : state === "dropped" ? C.failure : C.dim;
      const yy = state === "dropped" ? 120 : 70;
      s("rect", { x: x(t) - 3, y: yy, width: 6, height: 36, rx: 1.5, fill: col, opacity: state === "dropped" ? 0.35 : 0.9 }, g);
      if (frames < 40 || i % 2 === 0 || i <= 5) s("text", { x: x(t), y: yy - 6, "text-anchor": "middle", class: "x-tick" }, g).textContent = String(31 + i);
    }
    s("text", { x: R, y: 66, "text-anchor": "end", class: "x-lbl", fill: C.medium }, g).textContent = pol === 3 ? "dequeued as they arrive" : `captured into the ${N} buffers`;
    s("text", { x: R, y: 166, "text-anchor": "end", class: "x-lbl", fill: C.failure }, g).textContent = pol === 3 ? "" : "never captured: no free buffer";
    // which frame gets used, and its age
    let usedT: number, age: number, blocked = 0;
    if (pol === 0) { usedT = keptT[0] ?? stall; age = stall - usedT; }
    else if (pol === 1) { usedT = keptT[keptT.length - 1] ?? stall; age = stall - usedT; }
    else if (pol === 2) { usedT = Math.ceil(stall / dt) * dt; blocked = usedT - stall; age = 0; }
    else { usedT = Math.floor(stall / dt) * dt; age = stall - usedT; }
    s("circle", { cx: x(usedT), cy: 225, r: 7, fill: C.failure }, g);
    s("line", { x1: x(usedT), x2: x(stall), y1: 225, y2: 225, stroke: C.failure, "stroke-width": 3 }, g);
    s("text", { x: Math.min(x(usedT), x(stall)) - 8, y: 230, "text-anchor": "end", class: "x-lbl", fill: C.failure }, g).textContent = `frame used: ${age.toFixed(0)} ms old`;
    slots.age.textContent = `${age.toFixed(0)} ms`;
    const p = pols[pol];
    const m = meas.policies[pol];
    const exact = Math.round(stall) === 400 && fps === 60;
    say(`policy ${p.k} ${p.what}. Model: <b>${age.toFixed(0)} ms</b> old${blocked ? `, blocked ${blocked.toFixed(0)} ms` : ""}. ${exact ? `Measured on the real camera, 10 reps: <b class="k-measured">${m.ageMs} ms</b> old, blocked <b>${m.blockedMs} ms</b>.` : `Set 400 ms at 60 fps to see the measured number beside it.`}`);
  };
  scrub(slots.stall, { value: stall, min: 20, max: 800, step: 10, fmt: (v) => `${v.toFixed(0)} ms`, label: "How long the consumer is busy", tone: "me" }, (v) => { stall = v; draw(); poke(); });
  scrub(slots.fps, { value: fps, min: 15, max: 120, step: 5, fmt: (v) => `${v.toFixed(0)} fps`, label: "Camera frame rate", tone: "medium" }, (v) => { fps = v; draw(); poke(); });
  const polSpan = slots.policy;
  const setPol = (i: number) => { pol = i; polSpan.innerHTML = `<b class="k-me">${pols[i].k}, ${pols[i].name}</b>`; draw(); };
  choice(root, "Read policy", pols.map((p, i) => ({ label: `${p.k} · ${p.name}`, on: () => setPol(i) })), 0);
  setPol(0);
  h("p", { class: "bench-note" }, root, "Frame numbers continue from 31, as in the real capture. The model ignores exposure and transfer time, which is why its ages run a few ms under the measured ones.");
}
