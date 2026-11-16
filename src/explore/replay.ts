/**
 * Every measurement describes a moment that has already gone.
 * A position fix stamped at t−τ, applied as if it were now, pulls the estimate back along the
 * path by the chord 2(v/ω)·sin(ωτ/2): straight back when going straight, back AND sideways in a turn.
 * Replaying it at its own timestamp lands it on the state it was about.
 */
import { C, s, svg, set, h, scrub, sentence, readout, poke } from "./kit";

export function mount(root: HTMLElement) {
  let tau = 180, v = 0.6, w = 18;
  const { slots } = sentence(root, `A fix arrives {tau} after the shutter opened. The vehicle is moving at {v} and turning at {w}. Applied on arrival, it drags the estimate <b class="k-failure">{err}</b> into the past. Replayed at its own timestamp: <b class="k-measured">0 cm</b>.`);
  const W = 860, H = 380, SC = 260; // px per metre
  const el = svg(root, W, H, "Top view of a turning vehicle: where it is, where the late fix says it is, and where replay puts it");
  const path = s("path", { fill: "none", stroke: C.dim, "stroke-width": 2 }, el);
  const back = s("path", { fill: "none", stroke: C.failure, "stroke-width": 3, "stroke-dasharray": "6 5" }, el);
  const tri = (fill: string) => { const g = s("g", {}, el); s("path", { d: "M14 0 L-9 -8 L-9 8 Z", fill }, g); return g; };
  const now = tri(C.measured), naive = tri(C.failure);
  const shutter = s("circle", { r: 6, fill: "none", stroke: C.estimate, "stroke-width": 2 }, el);
  const lbl = (c: string) => s("text", { class: "x-lbl", fill: c }, el);
  const lNow = lbl(C.measured), lNaive = lbl(C.failure), lSh = lbl(C.estimate);
  const say = readout(root);

  const draw = () => {
    const om = (w * Math.PI) / 180, t = tau / 1000;
    const pose = (tt: number): [number, number, number] => {
      if (Math.abs(om) < 1e-6) return [v * tt, 0, 0];
      const R = v / om; return [R * Math.sin(om * tt), R * (1 - Math.cos(om * tt)), om * tt];
    };
    const T = 2.4, ox = 90, oy = H - 70;
    const P = (q: [number, number, number]) => [ox + q[0] * SC, oy - q[1] * SC] as const;
    const pts: string[] = [];
    for (let i = 0; i <= 80; i++) { const [a, b] = P(pose((T * i) / 80)); pts.push(`${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`); }
    set(path, { d: pts.join("") });
    const qNow = pose(T), qShut = pose(T - t);
    const [nx, ny] = P(qNow), [sx, sy] = P(qShut);
    set(now, { transform: `translate(${nx} ${ny}) rotate(${(-qNow[2] * 180) / Math.PI})` });
    // naive: the fix's position, believed to be "now", heading still taken from the gyro (current)
    set(naive, { transform: `translate(${sx} ${sy}) rotate(${(-qNow[2] * 180) / Math.PI})`, opacity: 0.85 });
    set(shutter, { cx: sx, cy: sy });
    set(back, { d: `M${nx} ${ny} L${sx} ${sy}` });
    const chord = Math.hypot(qNow[0] - qShut[0], qNow[1] - qShut[1]);
    // sideways part of the error, in the vehicle frame
    const dx = qShut[0] - qNow[0], dy = qShut[1] - qNow[1], hd = qNow[2];
    const side = Math.abs(-Math.sin(hd) * dx + Math.cos(hd) * dy);
    set(lNow, { x: nx + 16, y: ny - 14 }); lNow.textContent = "where it is";
    set(lNaive, { x: sx - 12, y: sy + 26, "text-anchor": "end" }); lNaive.textContent = "fix, applied on arrival";
    set(lSh, { x: sx + 12, y: sy + 26 }); lSh.textContent = "";
    slots.err.textContent = `${(chord * 100).toFixed(1)} cm`;
    say(`error = <b>${(chord * 100).toFixed(1)} cm</b>, of which <b>${(side * 100).toFixed(1)} cm sideways</b>. Set the speed to zero and it vanishes, which is why it survives every bench test. Photon to detection alone is 18.0 ms median on Mongla; add the graph, the filter's queue and a frame you waited for, and a fifth of a second is ordinary.`);
  };
  scrub(slots.tau, { value: tau, min: 0, max: 600, step: 5, fmt: (x) => `${x.toFixed(0)} ms`, label: "Fix latency", tone: "estimate" }, (x) => { tau = x; draw(); poke(); });
  scrub(slots.v, { value: v, min: 0, max: 1.5, step: 0.05, fmt: (x) => `${x.toFixed(2)} m/s`, label: "Speed", tone: "measured" }, (x) => { v = x; draw(); poke(); });
  scrub(slots.w, { value: w, min: -60, max: 60, step: 1, fmt: (x) => `${x.toFixed(0)}°/s`, label: "Yaw rate", tone: "me" }, (x) => { w = x; draw(); poke(); });
  h("p", { class: "bench-note" }, root, "The filter keeps a short buffer of its own states. A stamped measurement rewinds it to that instant, corrects there, and replays the motion inputs since. A timestamp is what turns a rumour into a measurement.");
  draw();
}
