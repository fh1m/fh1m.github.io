/**
 * Everything else on the planet: every remaining project, and the places the rest of the site lives.
 * Each clickable thing carries userData.obj (its id) and userData.year (when it appeared, for the
 * time machine). Places between the zones mean something:
 *   the delta (Water/Earth border)  Bangladesh's engineering heritage: Bangladesh is a delta
 *   the library (Air/Earth)         the notebook, six shelves for six series
 *   the graveyard (Water/Fire)      where wrong ideas go: one headstone per lesson
 *   the office (Air/Water)          the CV, under the flag of Bangladesh
 *   the garage (Air/Fire)           the time machine
 */
import * as THREE from "three";
import { R, ZONES, type ZoneId } from "./planet";
import { at, flat } from "./forms";
import { glowSprite } from "./fx";
import { near, stand } from "./props";
import { lessons } from "../data/lessons";

/** A direction between two zone centres, offset along local tangents. */
export function between(a: ZoneId, b: ZoneId, dx = 0, dz = 0, w = 0.5) {
  const c = ZONES.find((z) => z.id === a)!.c.clone().multiplyScalar(1 - w).addScaledVector(ZONES.find((z) => z.id === b)!.c, w).normalize();
  const t1 = new THREE.Vector3().crossVectors(c, new THREE.Vector3(0, 1, 0)).normalize();
  const t2 = new THREE.Vector3().crossVectors(c, t1).normalize();
  return c.addScaledVector(t1, dx / R).addScaledVector(t2, dz / R).normalize();
}

export function label(text: string, w = 256, h = 64, bg = "#1d1830", fg = "#e9c46a", font = "'Nunito', sans-serif") {
  const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d")!;
  g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle";
  const lines = text.split("\n"); const size = Math.round(h * (lines.length > 1 ? 0.3 : 0.5));
  g.font = `800 ${size}px ${font}`; lines.forEach((l, i) => g.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * size * 1.15));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const sign = (text: string, w: number, h: number, bg = "#f4efe2", fg = "#1d2246") => new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: label(text, 256, Math.round(256 * h / w), bg, fg) }));
const tag = <T extends THREE.Object3D>(o: T, id: string, year: number) => { o.userData.obj = id; o.userData.year = year; return o; };

export function buildLandmarks() {
  const group = new THREE.Group();
  const anim: ((t: number) => void)[] = [];
  const add = (o: THREE.Object3D, dir: THREE.Vector3, lift = 0, heading = 0, r?: number) => group.add(stand(o, dir, lift, heading, r));

  // ---- AIR -------------------------------------------------------------
  // the gimbal test stand: a frame, a motor, two servo boxes
  const stand2 = tag(new THREE.Group(), "gimbal", 2024);
  for (const x of [-0.6, 0.6]) for (const z of [-0.6, 0.6]) stand2.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 0.08), flat("#9a958a")), x, 0.8, z));
  stand2.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 1.3), flat("#9a958a")), 0, 1.6, 0));
  const motor = new THREE.Group(); motor.position.y = 1.1; stand2.add(motor);
  motor.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.8, 10), flat("#e8e2d4")), 0, 0, 0));
  for (const [x, z] of [[0.32, 0], [0, 0.32]]) stand2.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.14), flat("#3d6fd6")), x, 1.5, z)); // two SG90s
  add(stand2, near("air", 4.5, -4.5), 0);
  anim.push((t) => { motor.rotation.x = Math.sin(t * 2.1) * 0.18; motor.rotation.z = Math.cos(t * 1.7) * 0.15; });

  // ---- WATER -----------------------------------------------------------
  // Mongla's hull at a pier, dry, waiting
  const pier = tag(new THREE.Group(), "mongla", 2026);
  pier.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 4.2), flat("#8b6a4a")), 0, 0.3, 0));
  for (const z of [-1.8, 0, 1.8]) for (const x of [-0.7, 0.7]) pier.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6), flat("#6e5238")), x, -0.2, z));
  const hull = new THREE.Group(); hull.position.set(0, 0.75, 0.2); pier.add(hull);
  hull.add(at(new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.6, 4, 10), flat("#d23a32")), 0, 0, 0)).rotation.x = Math.PI / 2;
  hull.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 1.0), flat("#8f97a6")), 0, 0.12, 0));
  hull.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.8), flat("#bcd6ff", { transparent: true, opacity: 0.8 })), 0, 0.35, 0));
  add(pier, near("water", -1.5, 5.5), 0, 0.3);
  // green-at-depth: a green arrow sign, half under water
  const arrow = tag(new THREE.Group(), "green-at-depth", 2023);
  const ash = new THREE.Shape(); ash.moveTo(0, 0.5); ash.lineTo(0.7, 0.5); ash.lineTo(0.7, 0.9); ash.lineTo(1.3, 0.25); ash.lineTo(0.7, -0.4); ash.lineTo(0.7, 0); ash.lineTo(0, 0); ash.lineTo(0, 0.5);
  const am = new THREE.Mesh(new THREE.ExtrudeGeometry(ash, { depth: 0.12, bevelEnabled: false }), flat("#39d353")); am.position.set(-0.65, 0, 0); arrow.add(am);
  arrow.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 6), flat("#9a958a")), 0, -0.6, 0.06));
  add(arrow, near("water", 6.5, 3.5), -0.1, 0.9);
  anim.push((t) => { am.material instanceof THREE.MeshToonMaterial && am.material.color.setHSL(0.36, 0.65, 0.42 + 0.06 * Math.sin(t * 1.5)); });
  // interview-bottle: a bottle floating, being graded
  const bottle = tag(new THREE.Group(), "interview-bottle", 2023);
  bottle.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.8, 12), flat("#bfe6ff", { transparent: true, opacity: 0.75 })), 0, 0, 0));
  bottle.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.18, 0.25, 12), flat("#bfe6ff", { transparent: true, opacity: 0.75 })), 0, 0.52, 0));
  bottle.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 12), flat("#4f8fe0")), 0, 0.7, 0));
  bottle.rotation.z = 1.2;
  const bwrap = new THREE.Group(); bwrap.add(bottle); tag(bwrap, "interview-bottle", 2023);
  add(bwrap, near("water", -5.5, 1.5), 0.15);
  anim.push((t) => { bottle.rotation.x = Math.sin(t * 1.3) * 0.2; bottle.position.y = Math.sin(t * 1.1) * 0.06; });

  // ---- EARTH -----------------------------------------------------------
  // four-leds: a camera on a pan rig and four LEDs telling a human where to look
  const leds = tag(new THREE.Group(), "four-leds", 2024);
  leds.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 6), flat("#22262f")), 0, 0.55, 0));
  const head = new THREE.Group(); head.position.y = 1.15; leds.add(head);
  head.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.32, 0.36), flat("#e8e2d4")), 0, 0, 0));
  head.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 10), flat("#22262f")), 0, 0, -0.22)).rotation.x = Math.PI / 2;
  const bulbs = [[-0.42, 0], [0.42, 0], [0, 0.32], [0, -0.32]].map(([x, y]) => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshBasicMaterial({ color: "#3a1010" })); b.position.set(x, y + 1.15, -0.25); leds.add(b); return b; });
  add(leds, near("earth", 5, -4.5), 0, 0.5);
  anim.push((t) => { const k = Math.floor(t * 1.4) % 4; bulbs.forEach((b, i) => (b.material as THREE.MeshBasicMaterial).color.setHex(i === k ? 0xff5040 : 0x3a1010)); head.rotation.y = Math.sin(t * 0.9) * 0.5; });

  // ---- FIRE ------------------------------------------------------------
  // pareidolia: a webcam on a stand, a face box around nothing
  const pare = tag(new THREE.Group(), "pareidolia", 2023);
  pare.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 6), flat("#9a958a")), 0, 0.45, 0));
  pare.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 10), flat("#22262f")), 0, 1.05, 0));
  pare.add(at(new THREE.Mesh(new THREE.CircleGeometry(0.12, 12), new THREE.MeshBasicMaterial({ color: "#7ff3ff" })), 0, 1.05, -0.33)).rotation.y = Math.PI;
  const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)), new THREE.LineBasicMaterial({ color: "#39d353" })); box.position.set(0, 1.4, -1.2); pare.add(box);
  add(pare, near("fire", -5.5, -3), 0, 0.4);
  anim.push((t) => box.scale.setScalar(0.9 + 0.1 * Math.sin(t * 2)));
  // half-a-second: a bottle with a tracking bracket and a guess of where it will be
  const half = tag(new THREE.Group(), "half-a-second", 2024);
  half.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.3, 10), flat("#3d3157")), 0, 0.15, 0));
  const hb = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.6, 10), flat("#bfe6ff", { transparent: true, opacity: 0.8 })); hb.position.y = 0.6; half.add(hb);
  const ghost = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.6, 10), flat("#ff4f8b", { transparent: true, opacity: 0.35 })); ghost.position.y = 0.6; half.add(ghost);
  add(half, near("fire", -5.5, 3), 0);
  anim.push((t) => { hb.position.x = Math.sin(t * 1.2) * 0.8; ghost.position.x = Math.sin((t - 0.5) * 1.2) * 0.8; }); // the guess is half a second behind
  // trust-issues: a depth sensor pointed at a wall of readings, some of them lying
  const trust = tag(new THREE.Group(), "trust-issues", 2023);
  trust.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.25), flat("#e8e2d4")), 0, 0.3, 0.9));
  for (let i = 0; i < 12; i++) { const liar = i % 4 === 3; const d = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 5), new THREE.MeshBasicMaterial({ color: liar ? "#ff5040" : "#7ff3ff" })); d.position.set(-1 + i * 0.18, 0.2 + i * 0.08 + (liar ? 0.5 : 0), -0.4); trust.add(d); }
  add(trust, near("fire", 3.5, -6), 0, 0.2);
  // small sharp tools: a kiosk showing a clock
  const kiosk = tag(new THREE.Group(), "tools", 2023);
  kiosk.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 0.12), flat("#22262f")), 0, 1.0, 0));
  kiosk.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.65), new THREE.MeshBasicMaterial({ map: label("1:19", 256, 176, "#05060f", "#3f7cff") })), 0, 1.0, -0.07)).rotation.y = Math.PI;
  kiosk.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.1), flat("#9a958a")), 0, 0.3, 0));
  add(kiosk, near("fire", -1, 6.5), 0, 3.0);

  // ---- THE DELTA: Bangladesh's engineering heritage (always there; it came first) ----
  // J. C. Bose: a lattice mast and a horn, millimetre waves in 1895
  const jcb = tag(new THREE.Group(), "heritage-jcbose", 1895);
  for (let i = 0; i < 6; i++) jcb.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.5 - i * 0.06, 0.06, 0.5 - i * 0.06), flat("#c9c3b5")), 0, 0.4 + i * 0.4, 0));
  for (const [x, z] of [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 2.6, 4), flat("#c9c3b5")); leg.position.set(x * 0.7, 1.3, z * 0.7); jcb.add(leg); }
  jcb.add(at(new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.5, 4, 1, true), flat("#e9c46a", { side: THREE.DoubleSide })), 0, 2.75, -0.2)).rotation.x = -Math.PI / 2;
  const waves = [0, 1, 2].map((i) => { const w = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 4, 20, Math.PI), new THREE.MeshBasicMaterial({ color: "#e9c46a", transparent: true })); w.position.set(0, 2.75, -0.6); w.rotation.z = Math.PI / 2; jcb.add(w); return w; });
  add(jcb, between("water", "earth", -3.2, -1.5, 0.66), 0);
  anim.push((t) => waves.forEach((w, i) => { const k = (t * 0.8 + i / 3) % 1; w.position.z = -0.6 - k * 1.6; w.scale.setScalar(1 + k * 2); (w.material as THREE.MeshBasicMaterial).opacity = 1 - k; }));
  // S. N. Bose: a boson, glowing, with two orbits
  const snb = tag(new THREE.Group(), "heritage-snbose", 1924);
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), new THREE.MeshBasicMaterial({ color: "#bba6ff" })); core.position.y = 1.6; core.add(glowSprite("#bba6ff", 2.2, 0.7)); snb.add(core);
  const orb = [0, 1].map((i) => { const o = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.02, 4, 40), new THREE.MeshBasicMaterial({ color: "#ded4ff" })); o.position.y = 1.6; o.rotation.x = Math.PI / 2 + i * 0.9; snb.add(o); return o; });
  snb.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.4, 8), flat("#9a958a")), 0, 0.2, 0));
  add(snb, between("water", "earth", -0.8, 1.8, 0.66), 0);
  anim.push((t) => orb.forEach((o, i) => (o.rotation.z = t * (i ? 0.9 : -0.6))));
  // F. R. Khan: a tall braced tube, the X-braced frame he used to make skyscrapers cheap and stiff
  const frk = tag(new THREE.Group(), "heritage-frkhan", 1929);
  frk.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.9, 3.6, 0.9), flat("#3a404d")), 0, 1.8, 0));
  for (let k = 0; k < 3; k++) for (const s of [-1, 1]) for (const face of [0, 1]) {
    const x = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.45, 0.05), flat("#e8e2d4"));
    x.position.set(face ? 0.46 : 0, 0.6 + k * 1.2, face ? 0 : 0.46); x.rotation.set(0, face ? Math.PI / 2 : 0, s * 0.64); frk.add(x);
  }
  frk.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 4), flat("#c9c3b5")), 0.2, 4.0, 0.2));
  add(frk, between("water", "earth", 1.8, -1.6, 0.66), 0);
  // Jamilur Reza Choudhury: a bridge over the delta (he chaired the expert panels for Jamuna and Padma)
  const jrc = tag(new THREE.Group(), "heritage-jrc", 1943);
  jrc.add(at(new THREE.Mesh(new THREE.BoxGeometry(6, 0.18, 0.7), flat("#c9c3b5")), 0, 1.0, 0));
  for (let i = 0; i < 5; i++) jrc.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.4, 8), flat("#9a958a")), -2.4 + i * 1.2, 0.35, 0));
  for (let i = 0; i < 10; i++) { const tr = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.6, 0.04), flat("#4f8fe0")); tr.position.set(-2.7 + i * 0.6, 1.4, 0.33); tr.rotation.z = i % 2 ? 0.7 : -0.7; jrc.add(tr); }
  jrc.add(at(new THREE.Mesh(new THREE.BoxGeometry(6, 0.05, 0.05), flat("#4f8fe0")), 0, 1.68, 0.33));
  add(jrc, between("water", "earth", 1.6, 3.4, 0.6), -0.2, 0.3);

  // ---- PLACES ------------------------------------------------------------
  // the library: the notebook, six shelves for six series
  const lib = tag(new THREE.Group(), "library", 2026);
  lib.add(at(new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.9, 2.2), flat("#e8dcc4")), 0, 0.95, 0));
  for (let i = 0; i < 4; i++) lib.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.9, 8), flat("#f7f1e3")), -1.2 + i * 0.8, 0.95, -1.15));
  lib.add(at(new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.14, 2.5), flat("#6e5238")), 0, 1.97, 0));
  lib.add(at(new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.5, 2.0), flat("#e8dcc4")), 0, 2.29, 0));
  lib.add(at(new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 2.2), flat("#6e5238")), 0, 2.58, 0));
  const spines = ["#4f8fe0", "#79b35f", "#e5533d", "#eaa63b", "#bba6ff", "#ff4f8b"];
  spines.forEach((c, i) => lib.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.6, 0.3), flat(c)), -0.75 + i * 0.3, 0.6, -1.12)));
  const ls = sign("Notebook", 1.6, 0.36); ls.position.set(0, 1.62, -1.12); ls.rotation.y = Math.PI; lib.add(ls);
  add(lib, between("air", "earth", 0, 0), 0, 0);
  // the graveyard of wrong ideas: one headstone per lesson
  const yard = new THREE.Group();
  const gate2 = tag(new THREE.Group(), "graveyard", 2026);
  gate2.add(at(new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 0.1), new THREE.MeshBasicMaterial({ map: label("Here lie my\nwrong ideas", 256, 64, "#2b2e38", "#e8e2d4") })), 0, 1.6, 0));
  for (const x of [-1.05, 1.05]) gate2.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 0.12), flat("#2b2e38")), x, 0.9, 0));
  yard.add(at(gate2, 0, 0, 3.2));
  const stoneShape = new THREE.Shape(); stoneShape.moveTo(-0.31, 0); stoneShape.lineTo(-0.31, 0.62); stoneShape.absarc(0, 0.62, 0.31, Math.PI, 0, true); stoneShape.lineTo(0.31, 0); stoneShape.lineTo(-0.31, 0);
  const stoneGeo = new THREE.ExtrudeGeometry(stoneShape, { depth: 0.14, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2, curveSegments: 12 });
  lessons.forEach((l, i) => {
    const st = tag(new THREE.Group(), `lesson-${l.slug}`, +l.date.slice(0, 4));
    st.add(at(new THREE.Mesh(stoneGeo, flat("#a7a39a")), 0, 0, -0.07));
    st.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.4), flat("#8a8579")), 0, 0.04, 0));
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.32), new THREE.MeshBasicMaterial({ map: label(`RIP\n${l.id}`, 128, 82, "#a7a39a", "#2b2e38") })); face.position.set(0, 0.6, 0.095); st.add(face);
    const col = i % 4, row = Math.floor(i / 4);
    st.position.set(-1.8 + col * 1.2 + (row % 2) * 0.3, 0, -2 + row * 1.15); st.rotation.y = (Math.sin(i * 7.1) * 0.25);
    yard.add(st);
  });
  add(yard, between("water", "fire", 0, 0, 0.64), 0, 0.2);
  // the office: the CV, under the flag of Bangladesh
  const office = tag(new THREE.Group(), "cv", 2026);
  office.add(at(new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 1.6), flat("#f4efe2")), 0, 0.7, 0));
  office.add(at(new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 1.8), flat("#3a404d")), 0, 1.48, 0));
  office.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.05), flat("#3a404d")), 0, 0.4, -0.82));
  const os = sign("CV", 0.9, 0.36, "#1d2246", "#f4efe2"); os.position.set(0, 1.18, -0.81); os.rotation.y = Math.PI; office.add(os);
  office.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.4, 5), flat("#c9c3b5")), 1.3, 1.2, 0));
  const flag = new THREE.Group(); flag.position.set(1.3, 2.15, 0); office.add(flag);
  flag.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.54), new THREE.MeshBasicMaterial({ color: "#006a4e", side: THREE.DoubleSide })), 0.45, 0, 0));
  flag.add(at(new THREE.Mesh(new THREE.CircleGeometry(0.18, 20), new THREE.MeshBasicMaterial({ color: "#f42a41", side: THREE.DoubleSide })), 0.4, 0, 0.005)); // the disc sits slightly toward the hoist, as on the real flag
  add(office, between("air", "water", 0, 0), 0, 0.6);
  anim.push((t) => (flag.rotation.y = Math.sin(t * 2) * 0.15));
  // the garage: the time machine
  const garage = tag(new THREE.Group(), "timemachine", 0); // the time machine has always been here
  garage.add(at(new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.7, 2.2), flat("#8a8f9e")), 0, 0.85, 0));
  for (let i = 0; i < 9; i++) garage.add(at(new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.13, 0.06), flat(i % 2 ? "#6b707e" : "#5d6270")), 0, 0.08 + i * 0.145, -1.12)); // the roll-up door, half open
  garage.add(at(new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.12, 2.4), flat("#5d6270")), 0, 1.76, 0));
  const bench = new THREE.Group(); bench.position.set(-1.0, 0, -1.9); garage.add(bench);
  bench.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.5), flat("#8b6a4a")), 0, 0.6, 0));
  for (const x of [-0.42, 0.42]) bench.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.06), flat("#6e5238")), x, 0.3, 0));
  bench.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.22), flat("#3a404d")), -0.2, 0.73, 0)); // an oscilloscope, of course
  bench.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.12), new THREE.MeshBasicMaterial({ color: "#8dff6a" })), -0.2, 0.74, -0.115)).rotation.y = Math.PI;
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), new THREE.MeshBasicMaterial({ color: "#fff1c4" })); bulb.position.set(0.6, 1.5, -1.25); bulb.add(glowSprite("#ffe7a3", 1.2, 0.7)); garage.add(bulb);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.12, 8, 32), new THREE.MeshBasicMaterial({ color: "#8dff6a" })); ring.position.set(0, 1.0, -2.2); ring.add(glowSprite("#8dff6a", 3.5, 0.6)); garage.add(ring);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.72, 32), new THREE.MeshBasicMaterial({ color: "#6dff9a", transparent: true, opacity: 0.55, side: THREE.DoubleSide })); disc.position.copy(ring.position); garage.add(disc);
  add(garage, between("air", "fire", 0, 0), 0, 0);
  anim.push((t) => { ring.rotation.z = t * 0.8; disc.rotation.z = -t * 2; (disc.material as THREE.MeshBasicMaterial).opacity = 0.45 + 0.15 * Math.sin(t * 3); });

  group.traverse((o) => { if ((o as THREE.Mesh).isMesh) { (o as THREE.Mesh).castShadow = true; (o as THREE.Mesh).receiveShadow = true; } });
  return { group, update: (t: number) => anim.forEach((f) => f(t)) };
}
