/**
 * A tiny low-poly planet with four zones, in Aang's (and my) order: Air, Water, Earth, Fire.
 * One height function defines the ground; the robot drives on the same function, so it always
 * sits on what you see.
 */
import * as THREE from "three";

export const R = 20;                 // planet radius
export const WATER = R - 0.55;       // water level (radius)

export type ZoneId = "air" | "water" | "earth" | "fire";
export const ZONES: { id: ZoneId; c: THREE.Vector3; name: string; colour: string }[] = [
  { id: "air", c: new THREE.Vector3(0, 1, 0), name: "Air", colour: "#eaa63b" },
  { id: "water", c: new THREE.Vector3(0.943, -0.333, 0).normalize(), name: "Water", colour: "#4f8fe0" },
  { id: "earth", c: new THREE.Vector3(-0.471, -0.333, 0.816).normalize(), name: "Earth", colour: "#79b35f" },
  { id: "fire", c: new THREE.Vector3(-0.471, -0.333, -0.816).normalize(), name: "Fire", colour: "#e5533d" },
];

// Small, deterministic 3D value noise (no dependencies).
const hash = (x: number, y: number, z: number) => {
  let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const smooth = (t: number) => t * t * (3 - 2 * t);
export function noise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = smooth(x - xi), yf = smooth(y - yi), zf = smooth(z - zi);
  let v = 0;
  for (let dx = 0; dx < 2; dx++) for (let dy = 0; dy < 2; dy++) for (let dz = 0; dz < 2; dz++) {
    const w = (dx ? xf : 1 - xf) * (dy ? yf : 1 - yf) * (dz ? zf : 1 - zf);
    v += w * hash(xi + dx, yi + dy, zi + dz);
  }
  return v * 2 - 1;
}
const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export function zoneOf(dir: THREE.Vector3): { id: ZoneId; d: number } {
  let best = ZONES[0], bd = -2;
  for (const z of ZONES) { const d = dir.dot(z.c); if (d > bd) { bd = d; best = z; } }
  return { id: best.id, d: bd };
}

/** Height above R for a unit direction. */
export function height(dir: THREE.Vector3) {
  const x = dir.x, y = dir.y, z = dir.z;
  let h = 0.55 * noise(x * 2.3 + 11, y * 2.3, z * 2.3) + 0.22 * noise(x * 5.1, y * 5.1 + 7, z * 5.1);
  const a = dir.dot(ZONES[0].c), w = dir.dot(ZONES[1].c), e = dir.dot(ZONES[2].c), f = dir.dot(ZONES[3].c);
  h += 1.1 * sstep(0.78, 0.9, a) - 0.25 * sstep(0.9, 0.97, a) * 0;            // the sky plateau, flat on top
  if (a > 0.9) h = 1.1 + 0.05 * noise(x * 9, y * 9, z * 9);
  h -= 1.9 * sstep(0.5, 0.85, w);                                             // the lagoon
  h += 1.7 * sstep(0.45, 0.8, e) * (0.6 + 0.6 * noise(x * 4.2 + 3, y * 4.2, z * 4.2)); // hills
  h = h * (1 - 0.8 * sstep(0.55, 0.8, f)) + 0.15 * sstep(0.55, 0.8, f);       // the city sits on flat ground
  return h;
}

/** Ground radius the robot drives on (it floats on the lagoon). */
export const groundR = (dir: THREE.Vector3) => Math.max(R + height(dir), WATER + 0.05);

const COL = {
  grass: new THREE.Color("#5fae6a"), grass2: new THREE.Color("#4c9a5f"),
  sand: new THREE.Color("#e9d39b"), sky: new THREE.Color("#f1c27a"), skyTop: new THREE.Color("#f7e6c0"),
  rock: new THREE.Color("#8a6a52"), moss: new THREE.Color("#79b35f"), silicon: new THREE.Color("#2c2440"), siliconHi: new THREE.Color("#3d3157"),
  seabed: new THREE.Color("#2b6aa8"),
};

export function buildPlanet() {
  const geo = new THREE.IcosahedronGeometry(1, 28).toNonIndexed();
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const colours = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3(), c = new THREE.Color();
  // displace
  for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).normalize(); const r = R + height(v); pos.setXYZ(i, v.x * r, v.y * r, v.z * r); }
  // colour per face (flat shading look)
  const a = new THREE.Vector3(), b = new THREE.Vector3(), d = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i); b.fromBufferAttribute(pos, i + 1); d.fromBufferAttribute(pos, i + 2);
    const m = a.clone().add(b).add(d).divideScalar(3); const r = m.length(); const dir = m.normalize();
    const z = zoneOf(dir); const hh = r - R;
    if (r < WATER + 0.12) c.copy(hh < -1.2 ? COL.seabed : COL.sand);
    else if (z.id === "air" && z.d > 0.78) c.copy(z.d > 0.9 ? COL.skyTop : COL.sky);
    else if (z.id === "earth" && z.d > 0.5) c.copy(hh > 1.3 ? COL.rock : COL.moss);
    else if (z.id === "fire" && z.d > 0.55) c.copy(noise(dir.x * 30, dir.y * 30, dir.z * 30) > 0 ? COL.silicon : COL.siliconHi);
    else c.copy(noise(dir.x * 8, dir.y * 8, dir.z * 8) > 0 ? COL.grass : COL.grass2);
    for (let k = 0; k < 3; k++) colours.set([c.r, c.g, c.b], (i + k) * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colours, 3));
  geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));

  const water = new THREE.Mesh(new THREE.IcosahedronGeometry(WATER, 12), new THREE.MeshPhongMaterial({ color: "#3d8fe6", flatShading: true, transparent: true, opacity: 0.82, shininess: 80, specular: "#bfe0ff" }));

  const group = new THREE.Group(); group.add(ground, water);
  return { group, water };
}

/** Put an object on the surface at `dir`, with its +Y along the local up. */
export function placeOnSurface(o: THREE.Object3D, dir: THREE.Vector3, lift = 0) {
  const d = dir.clone().normalize();
  o.position.copy(d).multiplyScalar(groundR(d) + lift);
  o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
}
