/**
 * An idealised four-buffer host queue, based on the recorded camera-path test.
 * Later frames are unavailable to that full host queue; the model does not establish
 * what the physical sensor exposed. The measured values remain separate from its
 * zero-initial-age frame lattice and ideal reader scheduling.
 */
import data from "../data/mongla.json";
import { C, s, svg, h, scrub, sentence, readout, choice, poke } from "./kit";

export function mount(root: HTMLElement) {
  const meas = data.prose.frameAge;
  let stall = 400, fps = 60, pol = 0;
  const N = 4;
  const { slots } = sentence(root, `The consumer reads frame 31, then gets busy for {stall}. The camera keeps running at {fps}. Choose the next read policy: {policy}.`);
  const W = 860, H = 250, L = 30, R = 840;
  h("p", { class: "x-out" }, root, "Upper row: retained host buffers during the stall. Lower row: not retained there. Pale marks show later model arrivals; the dashed line is when the consumer resumes.");
  const el = svg(root, W, H, "Ideal host-buffer timeline: retained frames above, unavailable frames below, and a marker for the frame selected by the read policy");
  const g = s("g", {}, el);
  const say = readout(root);
  const pols = [
    { k: "A", name: "plain read()", what: "takes the oldest frame in the queue" },
    { k: "B", name: "drain, take the last", what: "keeps the newest retained buffer, not a missing recent frame" },
    { k: "C", name: "drain, then wait", what: "asks for a new frame after draining and can block the caller" },
    { k: "D", name: "a keep-up thread", what: "an ideal separate reader keeps pace; descheduling is not simulated" },
  ];

  const draw = () => {
    g.replaceChildren();
    const dt = 1000 / fps, tEnd = stall + dt * 3;
    const x = (t: number) => L + (t / tEnd) * (R - L);
    // stall band
    s("rect", { x: x(0), y: 30, width: x(stall) - x(0), height: 130, fill: C.me, opacity: 0.07 }, g);
    s("line", { x1: x(stall), x2: x(stall), y1: 30, y2: 200, stroke: C.me, "stroke-dasharray": "4 4" }, g);
    const frames = Math.floor(tEnd / dt);
    let kept = 0;
    let firstT = 0, lastT = 0;
    for (let i = 1; i <= frames; i++) {
      const t = i * dt;
      const during = t < stall;
      let state: "kept" | "dropped" | "after" = "after";
      if (during) { if (pol === 3 || kept < N) { state = "kept"; kept++; if (kept === 1) firstT = t; lastT = t; } else state = "dropped"; }
      const col = state === "kept" ? C.medium : state === "dropped" ? C.failure : C.dim;
      const yy = state === "dropped" ? 120 : 70;
      s("rect", { x: x(t) - 3, y: yy, width: 6, height: 36, rx: 1.5, fill: col, opacity: state === "dropped" ? 0.35 : 0.9 }, g);
    }
    // which frame gets used, and its age
    let usedT: number, age: number, blocked = 0;
    if (pol === 3) { usedT = Math.floor(stall / dt) * dt; age = stall - usedT; }
    else if (pol === 2 || kept === 0) { usedT = Math.ceil(stall / dt) * dt; blocked = Math.max(0, usedT - stall); age = 0; }
    else { usedT = pol === 0 ? firstT : lastT; age = stall - usedT; }
    const consumedAt = stall + blocked;
    s("circle", { cx: x(usedT), cy: 225, r: 7, fill: C.failure }, g);
    s("line", { x1: x(usedT), x2: x(consumedAt), y1: 225, y2: 225, stroke: C.failure, "stroke-width": 3 }, g);
    const p = pols[pol];
    const m = meas.policies[pol];
    const exact = Math.round(stall) === 400 && fps === 60;
    const usedSequence = 31 + Math.round(usedT / dt);
    say(`Policy ${p.k}: ${p.what}. Model uses frame <b>${usedSequence}</b>${usedSequence === 31 ? " again" : ""}: <b><output aria-label="Model frame age" aria-live="off">${age.toFixed(0)} ms</output></b> old, blocked <b><output aria-label="Model blocking wait" aria-live="off">${blocked.toFixed(0)} ms</output></b>. ${exact ? `Recorded camera-path result, 10 reps: <b class="k-measured">${m.ageMs} ms</b> old, blocked <b>${m.blockedMs} ms</b>.` : "Set 400 ms at 60 fps to compare the separate recorded result."}`);
  };
  scrub(slots.stall, { value: stall, min: 20, max: 800, step: 10, fmt: (v) => `${v.toFixed(0)} ms`, label: "How long the consumer is busy", tone: "me" }, (v) => { stall = v; draw(); poke(); });
  scrub(slots.fps, { value: fps, min: 15, max: 120, step: 5, fmt: (v) => `${v.toFixed(0)} fps`, label: "Camera frame rate", tone: "medium" }, (v) => { fps = v; draw(); poke(); });
  const polSpan = slots.policy;
  const setPol = (i: number) => { pol = i; polSpan.innerHTML = `<b class="k-me">${pols[i].k}, ${pols[i].name}</b>`; draw(); };
  choice(root, "Read policy", pols.map((p, i) => ({ label: `${p.k} · ${p.name}`, on: () => setPol(i) })), 0);
  setPol(0);
  h("p", { class: "bench-note" }, root, "Frame 31 starts at model time zero. Camera phase, exposure, transfer and reader scheduling are omitted; the model is not fitted to the recorded ages.");
}
