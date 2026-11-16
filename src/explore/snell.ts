/**
 * A flat port shrinks the field of view. Snell: n_w·sin θ_w = sin θ_a.
 * The air FOV is computed from each camera's real calibration matrix (mongla_ws config/calibration).
 * The ranging errors are the measured ones from mongla_ws ROADMAP A1 (one in-water focal for every pixel).
 */
import data from "../data/mongla.json";
import { C, s, svg, set, h, scrub, sentence, readout, choice, poke } from "./kit";

const deg = (r: number) => (r * 180) / Math.PI, rad = (d: number) => (d * Math.PI) / 180;
const hfov = (c: { w: number; K: number[][] }) => 2 * deg(Math.atan(c.w / 2 / c.K[0][0]));

export function mount(root: HTMLElement) {
  const cams = [
    { name: "downward camera", fov: hfov(data.calibration.downward) },
    { name: "forward camera", fov: hfov(data.calibration.forward) },
  ];
  let cam = 0, n = 1.333, range = 3, prop = 1.5;
  const { slots } = sentence(root, `The {cam} sees <b>{air}</b> across in air. Behind a flat window in water of index {n}, it sees <b class="k-medium">{water}</b>. At {range}, a {prop}-wide gate {fits}.`);
  const W = 860, H = 340, PX = 140, CY = 170, SC = 110;
  const el = svg(root, W, H, "A camera behind a flat port: its field of view in air, dashed, and in water, solid");
  s("rect", { x: PX, y: 20, width: W - PX - 20, height: H - 40, fill: C.medium, opacity: 0.05 }, el);
  s("line", { x1: PX, x2: PX, y1: 30, y2: H - 30, stroke: C.chalk, "stroke-width": 3 }, el);
  s("text", { x: PX - 8, y: 40, "text-anchor": "end", class: "x-lbl" }, el).textContent = "flat port";
  s("text", { x: PX + 10, y: 40, class: "x-lbl", fill: C.medium }, el).textContent = "water";
  s("rect", { x: PX - 70, y: CY - 22, width: 50, height: 44, rx: 4, fill: "#11161b", stroke: C.dim }, el);
  s("circle", { cx: PX - 20, cy: CY, r: 9, fill: "none", stroke: C.dim }, el);
  const airL = s("path", { fill: "none", stroke: C.dim, "stroke-dasharray": "6 6" }, el);
  const watL = s("path", { fill: C.medium, "fill-opacity": 0.12, stroke: C.medium, "stroke-width": 2.5 }, el);
  const gate = s("line", { stroke: C.estimate, "stroke-width": 5, "stroke-linecap": "round" }, el);
  const gateL = s("text", { class: "x-lbl", fill: C.estimate }, el);
  const say = readout(root);

  // real measured ranging error from one in-water focal for every pixel (1.5 m gate, truth 4.0 m)
  const meas = h("div", { class: "x-mini" }, root);
  meas.innerHTML = `<p class="x-out" style="margin-top:1rem">Measured, not modelled: a 1.5 m gate at <b>4.0 m</b>, ranged with one in-water focal length for every pixel. A flat port has no single focal length: it grows toward the edges.</p>`;
  const mel = svg(meas, 860, 120, "Measured range readings for a gate truly at 4.0 metres: 5.15 m on axis, 4.59 m at 1.2 m off axis, 3.33 m at 2.2 m off axis");
  const rx = (m: number) => 150 + ((m - 2.5) / 3.2) * 640;
  s("line", { x1: rx(4), x2: rx(4), y1: 10, y2: 100, stroke: C.measured, "stroke-width": 2 }, mel);
  s("text", { x: rx(4) + 6, y: 20, class: "x-lbl", fill: C.measured }, mel).textContent = "truth 4.0 m";
  ([["on axis", 5.15, "+29 %"], ["1.2 m off axis", 4.59, "+15 %"], ["2.2 m off axis", 3.33, "−17 %"]] as const).forEach(([l, v, e], i) => {
    const yy = 38 + i * 28;
    s("line", { x1: rx(4), x2: rx(v), y1: yy, y2: yy, stroke: C.failure, "stroke-width": 8, opacity: 0.85 }, mel);
    s("text", { x: 140, y: yy + 4, "text-anchor": "end", class: "x-lbl" }, mel).textContent = l;
    s("text", { x: Math.max(rx(v), rx(4)) + 8, y: yy + 4, class: "x-lbl", fill: C.failure }, mel).textContent = `${v} m (${e})`;
  });

  const draw = () => {
    const fa = cams[cam].fov / 2;
    const fw = deg(Math.asin(Math.sin(rad(fa)) / n));
    const cone = (half: number, len: number) => { const dx = len, dy = Math.tan(rad(half)) * len; return `M${PX - 20} ${CY} L${PX - 20 + dx} ${CY - dy} M${PX - 20} ${CY} L${PX - 20 + dx} ${CY + dy}`; };
    set(airL, { d: cone(fa, Math.min(660, 140 / Math.tan(rad(fa)))) });
    const len = Math.min(660, 130 / Math.tan(rad(fw))), dy = Math.tan(rad(fw)) * len; // stay inside the frame
    set(watL, { d: `M${PX - 20} ${CY} L${PX - 20 + len} ${CY - dy} L${PX - 20 + len} ${CY + dy} Z` });
    const gx = PX - 20 + range * SC, half = (prop / 2) * SC; // one scale for both axes, so the cone and the gate agree
    const visHalf = Math.tan(rad(fw)) * range;
    set(gate, { x1: Math.min(gx, W - 30), x2: Math.min(gx, W - 30), y1: CY - half, y2: CY + half });
    set(gateL, { x: Math.min(gx, W - 30) - 4, y: CY + half + 18, "text-anchor": "end" }); gateL.textContent = `gate ${prop.toFixed(1)} m`;
    const fits = prop / 2 <= visHalf;
    slots.cam.textContent = cams[cam].name;
    slots.air.textContent = `${cams[cam].fov.toFixed(1)}°`;
    slots.water.textContent = `${(2 * fw).toFixed(1)}°`;
    slots.fits.innerHTML = fits ? `<b class="k-measured">fits, with ${(2 * visHalf - prop).toFixed(2)} m to spare</b>` : `<b class="k-failure">doesn't fit: the camera sees only ${(2 * visHalf).toFixed(2)} m of it</b>`;
    say(`world in frame, water vs air: <b>${Math.round((Math.tan(rad(fw)) / Math.tan(rad(fa))) * 100)}%</b>. The air figure is measured (calibration from 25 views, held-out reprojection ${data.calibration.downward.holdoutRmsPx.toFixed(2)} px); the water figure is Snell from it, computed, not yet measured underwater.`);
  };
  scrub(slots.n, { value: n, min: 1, max: 1.4, step: 0.001, fmt: (v) => v.toFixed(3), label: "Refractive index of the medium", tone: "medium" }, (v) => { n = v; draw(); poke(); });
  scrub(slots.range, { value: range, min: 0.5, max: 4, step: 0.1, fmt: (v) => `${v.toFixed(1)} m`, label: "Range to the gate", tone: "estimate" }, (v) => { range = v; draw(); poke(); });
  scrub(slots.prop, { value: prop, min: 0.3, max: 3, step: 0.1, fmt: (v) => `${v.toFixed(1)} m`, label: "Gate width", tone: "estimate" }, (v) => { prop = v; draw(); poke(); });
  choice(root, "Camera", cams.map((c, i) => ({ label: `${c.name} · fx ${(i === 0 ? data.calibration.downward : data.calibration.forward).K[0][0].toFixed(1)} px`, on: () => { cam = i; draw(); } })), 0);
  draw();
}
