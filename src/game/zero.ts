/**
 * ZERO-6, called Zero. A defence-prototype-looking little robot that is, in fact, mostly bugs.
 * Built from primitives (no model files): hull, red Mongla-style panel, one camera eye,
 * an antenna with a pink beacon, four wheels. Gear for each element is added in later steps.
 */
import * as THREE from "three";

const flat = (color: string, extra: THREE.MeshLambertMaterialParameters = {}) => new THREE.MeshLambertMaterial({ color, flatShading: true, ...extra });

function stencil() {
  const c = document.createElement("canvas"); c.width = 256; c.height = 64;
  const g = c.getContext("2d")!;
  g.fillStyle = "#3a404d"; g.fillRect(0, 0, 256, 64);
  g.fillStyle = "#e8e2d4"; g.font = "bold 40px 'Obel Mono', monospace"; g.textBaseline = "middle"; g.textAlign = "center";
  g.fillText("ZERO-6", 128, 34);
  // stencil bridges, like spray-painted military markings
  g.fillStyle = "#3a404d"; for (const x of [62, 98, 134, 170, 206]) g.fillRect(x, 14, 3, 40);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export interface Zero { root: THREE.Group; body: THREE.Group; wheels: THREE.Mesh[]; beacon: THREE.Mesh; eye: THREE.Mesh; update: (dt: number, speed: number, t: number) => void }

export function buildZero(): Zero {
  const root = new THREE.Group();
  const body = new THREE.Group(); root.add(body);

  const hull = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 2.1), flat("#3a404d")); hull.position.y = 0.75; body.add(hull);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.12, 1.7), flat("#4a5162")); deck.position.y = 1.16; body.add(deck);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.5), flat("#d23a32")); nose.position.set(0, 0.62, -1.2); body.add(nose); // Mongla red
  const tail = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.4), flat("#d23a32")); tail.position.set(0, 0.62, 1.15); body.add(tail);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.06, 2.12), flat("#ff4f8b")); stripe.position.y = 0.98; body.add(stripe); // my pink

  const tex = stencil();
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.35), new THREE.MeshBasicMaterial({ map: tex })); p.position.set(s * 0.755, 0.72, 0.05); p.rotation.y = s * Math.PI / 2; body.add(p); }

  // head: a little sensor turret with one eye
  const head = new THREE.Group(); head.position.set(0, 1.42, -0.45); body.add(head);
  head.add(new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.42, 0.55), flat("#e8e2d4")));
  const eyeRing = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.08, 10), flat("#22262f")); eyeRing.rotation.x = Math.PI / 2; eyeRing.position.z = -0.3; head.add(eyeRing);
  const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 10), new THREE.MeshBasicMaterial({ color: "#7ff3ff" })); eye.rotation.x = Math.PI / 2; eye.position.z = -0.33; head.add(eye);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 5), flat("#c9c3b5")); mast.position.set(0.45, 1.6, 0.6); body.add(mast);
  const beacon = new THREE.Mesh(new THREE.IcosahedronGeometry(0.09, 0), new THREE.MeshBasicMaterial({ color: "#ff4f8b" })); beacon.position.set(0.45, 2.02, 0.6); body.add(beacon);

  const wheels: THREE.Mesh[] = [];
  const wg = new THREE.CylinderGeometry(0.42, 0.42, 0.32, 9); wg.rotateZ(Math.PI / 2);
  for (const [x, z] of [[-0.88, -0.7], [0.88, -0.7], [-0.88, 0.7], [0.88, 0.7]]) {
    const w = new THREE.Mesh(wg, flat("#22262f")); w.position.set(x, 0.42, z); root.add(w); wheels.push(w);
    const hub = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.12), flat("#e8e2d4")); w.add(hub); // a spoke, so you can see it turn
  }

  root.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true; });

  let roll = 0;
  return {
    root, body, wheels, beacon, eye,
    update(dt, speed, t) {
      roll += speed * dt / 0.42;
      for (const w of wheels) w.rotation.x = -roll;
      body.position.y = 0.04 * Math.sin(t * 9) * Math.min(1, Math.abs(speed) / 4);  // suspension jiggle
      body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, -speed * 0.012, 0.1); // pitch under acceleration
      (beacon.material as THREE.MeshBasicMaterial).color.setHex(Math.sin(t * 4) > 0.2 ? 0xff4f8b : 0x5a1d33);
    },
  };
}
