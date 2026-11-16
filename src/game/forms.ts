/**
 * ZERO-6's four forms. One core travels between them (sensor turret, cyan eye, pink beacon,
 * the stencil), so it is always recognisably the same robot in different gear:
 *   air   a rocket-drone on a thrust-vector gimbal (the 2024 TVC work)
 *   water a red sub with five thrusters (Mongla's current build has five)
 *   earth a rover with a two-link typing arm (Mongol-Tori, E-Bhapa)
 *   fire  a tiny chip-bot that runs along the traces of its own silicon
 */
import * as THREE from "three";
import type { ZoneId } from "./planet";
import { glowSprite } from "./fx";

/** Place a mesh at x, y, z and return it (three.js makes `position` read-only, so Object.assign cannot). */
export const at = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number) => { o.position.set(x, y, z); return o; };
/** Kurzgesagt-like two-tone shading: a hard step between lit and shadow, shadows tinted by the violet sky light. */
let ramp: THREE.DataTexture | null = null;
export function toonRamp() {
  if (ramp) return ramp;
  ramp = new THREE.DataTexture(new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true; return ramp;
}
export const flat = (color: string, extra: THREE.MeshToonMaterialParameters = {}) => new THREE.MeshToonMaterial({ color, gradientMap: toonRamp(), ...extra });
const glow = (color: string) => new THREE.MeshBasicMaterial({ color });
const RED = "#d23a32", HULL = "#3a404d", CREAM = "#e8e2d4", DARK = "#22262f", PINK = "#ff4f8b";

let stencilTex: THREE.CanvasTexture | null = null;
function stencil() {
  if (stencilTex) return stencilTex;
  const c = document.createElement("canvas"); c.width = 256; c.height = 64;
  const g = c.getContext("2d")!;
  g.fillStyle = HULL; g.fillRect(0, 0, 256, 64);
  g.fillStyle = CREAM; g.font = "bold 40px 'Obel Mono', monospace"; g.textBaseline = "middle"; g.textAlign = "center"; g.fillText("ZERO-6", 128, 34);
  g.fillStyle = HULL; for (const x of [62, 98, 134, 170, 206]) g.fillRect(x, 14, 3, 40); // stencil bridges
  stencilTex = new THREE.CanvasTexture(c); stencilTex.colorSpace = THREE.SRGBColorSpace; return stencilTex;
}
const plate = (w: number, h: number) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: stencil() }));

/** The core: what makes every form Zero. */
function core() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.42, 0.55), flat(CREAM)));
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.08, 10), flat(DARK)); ring.rotation.x = Math.PI / 2; ring.position.z = -0.3; g.add(ring);
  const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 10), glow("#7ff3ff")); eye.rotation.x = Math.PI / 2; eye.position.z = -0.33; g.add(eye);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.6, 5), flat("#c9c3b5")); mast.position.set(0.28, 0.5, 0.15); g.add(mast);
  const beacon = new THREE.Mesh(new THREE.IcosahedronGeometry(0.08, 0), glow(PINK)); beacon.position.set(0.28, 0.82, 0.15); g.add(beacon);
  return { g, eye, beacon };
}

export interface Form { id: ZoneId; group: THREE.Group; update: (t: number, dt: number) => void; beacon: THREE.Mesh; eye: THREE.Mesh }

function air(): Form {
  const group = new THREE.Group();
  const craft = new THREE.Group(); group.add(craft);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 2.2, 10), flat(CREAM)); body.position.y = 1.6; craft.add(body);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.505, 0.505, 0.35, 10), flat(RED)); band.position.y = 1.2; craft.add(band);
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.06, 10), flat(PINK)); stripe.position.y = 2.2; craft.add(stripe);
  for (let i = 0; i < 4; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.5), flat(RED)); const a = (i / 4) * Math.PI * 2 + Math.PI / 4; f.position.set(Math.cos(a) * 0.55, 0.75, Math.sin(a) * 0.55); f.rotation.y = -a; craft.add(f); }
  const p1 = plate(0.9, 0.22); p1.position.set(0, 1.75, -0.5); p1.rotation.y = Math.PI; craft.add(p1);
  const c = core(); c.g.position.y = 2.95; c.g.scale.setScalar(0.95); craft.add(c.g);
  // the gimbal: the nozzle hangs from a two-axis joint and steers the thrust
  const gimbal = new THREE.Group(); gimbal.position.y = 0.5; craft.add(gimbal);
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 0.5, 8), flat(DARK)); nozzle.position.y = -0.2; gimbal.add(nozzle);
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.26, 1.3, 8), new THREE.MeshBasicMaterial({ color: "#ffb347", transparent: true, opacity: 0.9 })); flame.rotation.x = Math.PI; flame.position.y = -1.05; gimbal.add(flame);
  const core2 = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.8, 8), glow("#fff3c4")); core2.rotation.x = Math.PI; core2.position.y = -0.8; gimbal.add(core2);
  const exhaust = glowSprite("#ffb347", 2.4, 0.8); exhaust.position.y = -1.0; gimbal.add(exhaust);
  return {
    id: "air", group, beacon: c.beacon, eye: c.eye,
    update(t) {
      craft.position.y = 1.4 + Math.sin(t * 1.6) * 0.25;
      gimbal.rotation.x = Math.sin(t * 2.3) * 0.12; gimbal.rotation.z = Math.cos(t * 1.9) * 0.1;
      craft.rotation.z = -gimbal.rotation.z * 0.25; craft.rotation.x = -gimbal.rotation.x * 0.25; // the body leans against its own thrust
      flame.scale.y = 0.85 + Math.random() * 0.3; (flame.material as THREE.MeshBasicMaterial).opacity = 0.75 + Math.random() * 0.2;
    },
  };
}

function water(): Form {
  const group = new THREE.Group();
  const sub = new THREE.Group(); group.add(sub);
  const hull = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 1.9, 4, 10), flat(RED)); hull.rotation.x = Math.PI / 2; hull.position.y = 0.9; sub.add(hull);
  const belly = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 2.0), flat(HULL)); belly.position.y = 0.42; sub.add(belly);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.13, 0.06, 1.2), flat(PINK)); stripe.position.y = 0.95; sub.add(stripe);
  for (const s of [-1, 1]) { const p = plate(1.1, 0.27); p.position.set(s * 0.565, 0.85, 0.15); p.rotation.y = s * Math.PI / 2; sub.add(p); }
  const c = core(); c.g.position.set(0, 1.55, -0.55); c.g.scale.setScalar(0.8); sub.add(c.g);
  // five thrusters: two aft, two vertical, one lateral
  const props: THREE.Mesh[] = [];
  const thruster = (x: number, y: number, z: number, rx: number, rz: number) => {
    const t = new THREE.Group(); t.position.set(x, y, z); t.rotation.set(rx, 0, rz); sub.add(t);
    t.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.32, 10, 1, true), flat(DARK, { side: THREE.DoubleSide })));
    const prop = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 0.06), flat(CREAM)); t.add(prop); props.push(prop);
  };
  thruster(-0.5, 0.75, 1.35, Math.PI / 2, 0); thruster(0.5, 0.75, 1.35, Math.PI / 2, 0);
  thruster(-0.78, 1.0, 0, 0, 0); thruster(0.78, 1.0, 0, 0, 0);
  thruster(0, 0.5, -0.9, 0, Math.PI / 2);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), glow("#fff7d0")); lamp.position.set(0, 0.7, -1.5); sub.add(lamp); lamp.add(glowSprite("#fff7d0", 1.4, 0.8));
  return {
    id: "water", group, beacon: c.beacon, eye: c.eye,
    update(t, dt) {
      sub.position.y = -0.2 + Math.sin(t * 1.1) * 0.12; sub.rotation.z = Math.sin(t * 0.9) * 0.05; sub.rotation.x = Math.sin(t * 0.7) * 0.03;
      for (const p of props) p.rotation.y += dt * 14;
    },
  };
}

function earth(): Form {
  const group = new THREE.Group();
  const body = new THREE.Group(); group.add(body);
  body.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 2.1), flat(HULL)), 0, 0.75, 0));
  body.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.5), flat(RED)), 0, 0.62, -1.2));
  body.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.06, 2.12), flat(PINK)), 0, 0.98, 0));
  for (const s of [-1, 1]) { const p = plate(1.4, 0.35); p.position.set(s * 0.755, 0.72, 0.05); p.rotation.y = s * Math.PI / 2; body.add(p); }
  const c = core(); c.g.position.set(0, 1.32, -0.55); body.add(c.g);
  const wheels: THREE.Mesh[] = [];
  const wg = new THREE.CylinderGeometry(0.42, 0.42, 0.32, 9); wg.rotateZ(Math.PI / 2);
  for (const [x, z] of [[-0.88, -0.7], [0.88, -0.7], [-0.88, 0.7], [0.88, 0.7]]) { const w = new THREE.Mesh(wg, flat(DARK)); w.position.set(x, 0.42, z); w.add(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.12), flat(CREAM))); group.add(w); wheels.push(w); }
  // a two-link arm, the kind that types on a keyboard
  const shoulder = new THREE.Group(); shoulder.position.set(0.35, 1.15, 0.5); body.add(shoulder);
  shoulder.add(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.2, 8), flat(CREAM)));
  const upper = new THREE.Group(); shoulder.add(upper);
  const u = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.0, 0.14), flat(CREAM)); u.position.y = 0.5; upper.add(u);
  const elbow = new THREE.Group(); elbow.position.y = 1.0; upper.add(elbow);
  const f = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.85, 0.12), flat(HULL)); f.position.y = 0.42; elbow.add(f);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.18, 6), flat(PINK)); tip.position.y = 0.92; elbow.add(tip);
  return {
    id: "earth", group, beacon: c.beacon, eye: c.eye,
    update(t) {
      upper.rotation.x = -0.6 + Math.sin(t * 1.3) * 0.25; elbow.rotation.x = 1.3 + Math.sin(t * 1.3 + 1) * 0.35;
      body.position.y = 0.02 * Math.sin(t * 3);
    },
  };
}

function fire(): Form {
  const group = new THREE.Group();
  const bot = new THREE.Group(); group.add(bot);
  const c = core(); c.g.scale.setScalar(0.7); c.g.position.y = 0.5; bot.add(c.g);
  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.22, 0.22, 8), flat(RED)); skirt.position.y = 0.18; bot.add(skirt);
  const trail: THREE.Mesh[] = [];
  for (let i = 0; i < 10; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.12), new THREE.MeshBasicMaterial({ color: "#ff8a3d", transparent: true, opacity: 0.8 * (1 - i / 10) })); group.add(s); trail.push(s); }
  const path = (u: number) => { // along a square trace, like data through a bus
    const s = ((u % 4) + 4) % 4, k = s % 1, L = 2.2;
    return s < 1 ? new THREE.Vector3(-L + 2 * L * k, 0, -L) : s < 2 ? new THREE.Vector3(L, 0, -L + 2 * L * k) : s < 3 ? new THREE.Vector3(L - 2 * L * k, 0, L) : new THREE.Vector3(-L, 0, L - 2 * L * k);
  };
  return {
    id: "fire", group, beacon: c.beacon, eye: c.eye,
    update(t) {
      const u = t * 0.6; const p = path(u), n = path(u + 0.01);
      bot.position.copy(p).setY(0.12 + Math.abs(Math.sin(t * 8)) * 0.05); bot.lookAt(n.x, bot.position.y, n.z); bot.rotateY(Math.PI);
      trail.forEach((s, i) => s.position.copy(path(u - (i + 1) * 0.035)).setY(0.04));
    },
  };
}

export function buildForms(): Record<ZoneId, Form> {
  const forms = { air: air(), water: water(), earth: earth(), fire: fire() };
  for (const f of Object.values(forms)) f.group.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true; });
  return forms;
}
