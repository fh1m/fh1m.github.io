/**
 * What stands in each zone: things from the real work, not decoration.
 *   air   the launch pad, and clouds going past
 *   water a RoboSub-style gate half under the lagoon, and buoys
 *   earth a giant keyboard for the typing arm, and the wall E-Bhapa got pinned against
 *   fire  a K210-like chip with gold pins and nine cores, for Zero to shrink into
 */
import * as THREE from "three";
import { R, WATER, ZONES, groundR, height, zoneOf, type ZoneId } from "./planet";
import { at, flat } from "./forms";
import { glowSprite } from "./fx";

/** A direction near a zone centre, offset along the zone's own tangent axes (units ≈ metres on the ground). */
export function near(zone: ZoneId, dx: number, dz: number) {
  const c = ZONES.find((z) => z.id === zone)!.c;
  const t1 = new THREE.Vector3().crossVectors(c, Math.abs(c.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)).normalize();
  const t2 = new THREE.Vector3().crossVectors(c, t1).normalize();
  return c.clone().addScaledVector(t1, dx / R).addScaledVector(t2, dz / R).normalize();
}

/** Stand an object on the ground at dir, +Y up, optionally facing a heading around up. */
export function stand(o: THREE.Object3D, dir: THREE.Vector3, lift = 0, heading = 0, r?: number) {
  const d = dir.clone().normalize();
  o.position.copy(d).multiplyScalar((r ?? groundR(d)) + lift);
  o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
  o.rotateY(heading);
  return o;
}

function label(text: string, w = 256, h = 64, bg = "#1d1830", fg = "#e9c46a") {
  const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d")!;
  g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = `bold ${Math.round(h * 0.55)}px 'Obel Mono', monospace`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, w / 2, h / 2 + 2);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function buildProps() {
  const group = new THREE.Group();
  const anim: ((t: number) => void)[] = [];

  // AIR: the pad and the clouds
  const pad = new THREE.Group();
  pad.add(new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.3, 16), flat("#9a958a")));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.08, 4, 24), flat("#ffd15c")); ring.rotation.x = Math.PI / 2; ring.position.y = 0.16; pad.add(ring);
  for (let i = 0; i < 8; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.18), flat(i % 2 ? "#22262f" : "#ffd15c")); const a = (i / 8) * Math.PI * 2; m.position.set(Math.cos(a) * 2.2, 0.17, Math.sin(a) * 2.2); m.rotation.y = -a; pad.add(m); }
  group.add(stand(pad, near("air", 0, 0), 0.1));
  const clouds: THREE.Group[] = [];
  for (let i = 0; i < 7; i++) {
    const cl = new THREE.Group();
    for (let k = 0; k < 4; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.9 + Math.random() * 0.7, 14, 10), flat("#ffffff")); b.position.set(k * 1.0 - 1.5, Math.random() * 0.4, Math.random() * 0.8); cl.add(b); }
    const a = (i / 7) * Math.PI * 2; group.add(stand(cl, near("air", Math.cos(a) * 9, Math.sin(a) * 9), 4 + (i % 3) * 1.2)); clouds.push(cl);
  }
  anim.push((t) => clouds.forEach((c, i) => { c.rotateY(0.0006 * (i % 2 ? 1 : -1)); c.scale.setScalar(1 + Math.sin(t * 0.5 + i) * 0.03); }));

  // WATER: the gate and the buoys
  const gate = new THREE.Group();
  const pvc = flat("#ff8a3d");
  for (const x of [-1.8, 1.8]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.6, 8), pvc); p.position.set(x, 0, 0); gate.add(p); }
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.84, 8), pvc); bar.rotation.z = Math.PI / 2; bar.position.y = 1.8; gate.add(bar);
  const mid = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 6), flat("#e5533d")); mid.position.set(0, 1.1, 0); gate.add(mid);
  group.add(stand(gate, near("water", 3.5, 0), -0.4, 0, WATER));
  const buoys: THREE.Mesh[] = [];
  for (const [dx, dz, col] of [[-2, 4, "#e5533d"], [6, -3, "#79b35f"], [1, -6, "#ffd15c"]] as [number, number, string][]) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 6), flat(col)); group.add(stand(b, near("water", dx, dz), 0.1, 0, WATER)); buoys.push(b); }
  anim.push((t) => buoys.forEach((b, i) => { b.scale.y = 1 + Math.sin(t * 2 + i) * 0.06; }));

  // EARTH: the keyboard and the wall
  const kb = new THREE.Group();
  kb.add(at(new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.35, 1.7), flat("#2b2e38")), 0, 0.18, 0));
  for (let r = 0; r < 3; r++) for (let k = 0; k < 9; k++) { const key = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.38), flat(r === 1 && k === 4 ? "#ff4f8b" : "#e8e2d4")); key.position.set(-1.9 + k * 0.475 + (r % 2) * 0.12, 0.43, -0.5 + r * 0.5); kb.add(key); }
  group.add(stand(kb, near("earth", 3.2, 1.0), 0.05, 0.4));
  const wall = new THREE.Group();
  for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.3, 0.45), flat(r % 2 ? "#a4483a" : "#b9533f")); b.position.set(-1.6 + k * 0.64 + (r % 2) * 0.32, 0.16 + r * 0.31, 0); wall.add(b); }
  group.add(stand(wall, near("earth", -3.0, -3.2), 0, -0.3));
  for (let i = 0; i < 9; i++) { const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3 + Math.random() * 0.5, 0), flat("#8a6a52")); group.add(stand(rock, near("earth", (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16), 0.1)); }

  // FIRE: the chip
  const chip = new THREE.Group();
  chip.add(at(new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 6), flat("#1d1830")), 0, 0.2, 0));
  for (let i = 0; i < 12; i++) for (const s of [-1, 1]) {
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.7), flat("#e9c46a")); p1.position.set(-2.6 + i * 0.47, 0.1, s * 3.2); chip.add(p1);
    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.16), flat("#e9c46a")); p2.position.set(s * 3.2, 0.1, -2.6 + i * 0.47); chip.add(p2);
  }
  const cores: THREE.Mesh[] = [];
  for (let x = 0; x < 3; x++) for (let z = 0; z < 3; z++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.9), new THREE.MeshBasicMaterial({ color: "#ff8a3d" })); m.position.set(-1.2 + x * 1.2, 0.46, -1.2 + z * 1.2); m.add(glowSprite("#ff8a3d", 1.6, 0.45)); chip.add(m); cores.push(m); }
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.5), new THREE.MeshBasicMaterial({ map: label("K210") })); tag.rotation.set(-Math.PI / 2, 0, Math.PI); tag.position.set(0, 0.41, -2.55); chip.add(tag);
  group.add(stand(chip, near("fire", 0, 0), 0));
  anim.push((t) => cores.forEach((m, i) => (m.material as THREE.MeshBasicMaterial).color.setHSL(0.06 + 0.03 * Math.sin(t * 2 + i), 1, 0.45 + 0.15 * Math.sin(t * 3 + i * 1.7))));

  // Trees on the plain grass between the zones
  const v = new THREE.Vector3();
  let placed = 0, tries = 0;
  while (placed < 70 && tries++ < 4000) {
    v.randomDirection(); const z = zoneOf(v);
    if (z.d > 0.42 || R + height(v) < WATER + 0.2) continue;
    const tree = new THREE.Group(); const h = 0.8 + Math.random() * 0.9;
    tree.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, h * 0.5, 5), flat("#7a5236")), 0, h * 0.25, 0));
    tree.add(at(new THREE.Mesh(new THREE.ConeGeometry(0.45 * h, h * 1.1, 6), flat(Math.random() > 0.5 ? "#3f8f55" : "#2f7a49")), 0, h * 0.95, 0));
    group.add(stand(tree, v, 0)); placed++;
  }

  group.traverse((o) => { if ((o as THREE.Mesh).isMesh) { (o as THREE.Mesh).castShadow = true; (o as THREE.Mesh).receiveShadow = true; } });
  return { group, update: (t: number) => anim.forEach((f) => f(t)) };
}

/** Where Zero stands in each zone, and how far above the ground. */
export const STATIONS: Record<ZoneId, { dir: () => THREE.Vector3; lift: number; heading: number; onWater?: boolean }> = {
  air: { dir: () => near("air", 0, 0), lift: 0.25, heading: 0 },
  water: { dir: () => near("water", 0.5, 0.2), lift: -0.35, heading: -Math.PI / 2, onWater: true },
  earth: { dir: () => near("earth", 1.2, -1.2), lift: 0.05, heading: 0.4 },
  fire: { dir: () => near("fire", 0, 0), lift: 0.4, heading: 0 },
};
