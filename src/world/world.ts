/**
 * The Range in 3D. Ten stations along one line, each a low-poly set for its arena.
 * The DOM decides which arena is active; the camera follows. Benches nudge their station
 * (depth tints the water, the gimbal tilts the rocket, the arm reaches...). Renders only
 * while something moves, at a capped pixel ratio.
 */
import * as THREE from "three";
import stats from "../data/github.json";

const GAP = 16;
const PAL = { chalk: 0xf2f0e8, measured: 0xb8f34a, failure: 0xff5c4d, medium: 0x2ee6d6, estimate: 0xffb020, steel: 0x3a434b, dark: 0x0b0f12 };

type Station = { group: THREE.Group; tick?: (t: number) => boolean; bench?: (v: unknown) => void };

function mat(color: number, emissive = 0, rough = 0.7) {
  return new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: emissive ? 0.6 : 0, roughness: rough, metalness: 0.1, flatShading: true });
}

export async function start(canvas: HTMLCanvasElement, bus: EventTarget, count: number) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  const mobile = matchMedia("(max-width: 900px)").matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.6));
  renderer.setClearColor(0x000000);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.045);
  const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 140);
  scene.add(new THREE.HemisphereLight(0x8fb3c8, 0x050608, 0.65));
  const key = new THREE.DirectionalLight(0xfff1dc, 1.6); key.position.set(6, 10, 8); scene.add(key);

  // The range itself: an instrument floor with survey ticks.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(GAP * (count + 2), 40, 1, 1), mat(0x050607, 0, 1));
  floor.rotation.x = -Math.PI / 2; floor.position.set(GAP * (count - 1) / 2, -0.01, 0); scene.add(floor);
  const grid = new THREE.GridHelper(GAP * (count + 2), (count + 2) * 8, 0x1a2228, 0x0d1216);
  grid.position.set(GAP * (count - 1) / 2, 0, 0); scene.add(grid);
  const rail = new THREE.Mesh(new THREE.BoxGeometry(GAP * (count - 1) + 8, 0.03, 0.06), mat(PAL.steel, 0x1a2228));
  rail.position.set(GAP * (count - 1) / 2, 0.02, 3.2); scene.add(rail);

  const stations: Station[] = [];
  const at = (i: number, g: THREE.Group) => { g.position.x = i * GAP; scene.add(g); return g; };
  const lamp = (g: THREE.Group, color: number, y = 4, intensity = 22) => { const l = new THREE.PointLight(color, intensity, 14, 2); l.position.set(-1.5, y, 2.5); g.add(l); };

  // 0 · Bench zero: E-Bhapa and a wall.
  {
    const g = new THREE.Group(); lamp(g, PAL.estimate);
    const bot = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.35, 1), mat(0xc9a77a, 0, 0.4)); body.position.y = 0.45; bot.add(body);
    for (const [x, z] of [[-0.5, 0.58], [0.5, 0.58], [-0.5, -0.58], [0.5, -0.58]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 14), mat(0x15191c)); w.rotation.x = Math.PI / 2; w.position.set(x, 0.28, z); bot.add(w); }
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5), mat(PAL.chalk)); stalk.position.set(0.45, 0.85, 0); bot.add(stalk);
    for (const z of [-0.16, 0.16]) { const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.12, 16), mat(0x2a4fd8, 0x10204a)); eye.rotation.z = Math.PI / 2; eye.position.set(0.55, 1.12, z); bot.add(eye); }
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.4, 5), mat(0x20262b)); wall.position.set(3.4, 1.2, 0); g.add(wall);
    g.add(bot);
    let v2 = false, x = -2.4, dir = 1;
    stations.push({ group: at(0, g), tick: (t) => {
      if (v2) { x += dir * 0.02; if (x > 1.6) dir = -1; if (x < -2.6) dir = 1; bot.rotation.y = dir > 0 ? 0 : Math.PI; }
      else { x = Math.min(x + 0.02, 1.85); bot.rotation.y = 0; bot.position.y = x >= 1.85 ? Math.abs(Math.sin(t * 9)) * 0.03 : 0; }
      bot.position.x = x; return true;
    }, bench: (v) => { v2 = v === "v2"; x = -2.4; dir = 1; } });
  }

  // 1 · Water: a slab of water that eats red with depth, and a colour card inside it.
  {
    const g = new THREE.Group(); lamp(g, PAL.medium, 5, 30);
    const waterMat = new THREE.MeshPhysicalMaterial({ color: 0x0e5f66, transparent: true, opacity: 0.55, roughness: 0.15, transmission: 0, metalness: 0, side: THREE.DoubleSide });
    const water = new THREE.Mesh(new THREE.BoxGeometry(6, 3.2, 4, 24, 1, 16), waterMat); water.position.y = 1.6; g.add(water);
    const card = new THREE.Group();
    const swatch = (c: number, x: number) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.05), mat(c, c, 0.5)); m.position.set(x, 1.6, 0); card.add(m); return m; };
    const sw = [swatch(0xe0242a, -0.7), swatch(0x1fae3a, 0), swatch(0x2a4fd8, 0.7)];
    g.add(card);
    const pos = water.geometry.getAttribute("position") as THREE.BufferAttribute; const base = Float32Array.from(pos.array as Float32Array);
    let depth = 0;
    const K = [0.89, 0.18, 0.04];
    const tint = () => sw.forEach((m, i) => { const t = Math.exp(-K[i] * depth); (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.7 * t; (m.material as THREE.MeshStandardMaterial).color.setScalar(0.25 + 0.75 * t).multiply(new THREE.Color([0xe0242a, 0x1fae3a, 0x2a4fd8][i])); });
    stations.push({ group: at(1, g), tick: (t) => {
      const a = pos.array as Float32Array;
      for (let i = 0; i < a.length; i += 3) if (base[i + 1] > 1.5) a[i + 1] = base[i + 1] + Math.sin(base[i] * 1.7 + t * 1.3) * 0.06 + Math.cos(base[i + 2] * 2.1 + t) * 0.04;
      pos.needsUpdate = true; card.position.y = -depth * 0.08; return true;
    }, bench: (v) => { depth = Number(v); tint(); } });
  }

  // 2 · Mongla: red fairings over a grey can, five thrusters, bubbles.
  {
    const g = new THREE.Group(); lamp(g, PAL.medium, 5, 26);
    const hull = new THREE.Group();
    const can = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 2.4, 6, 18), mat(0x6c757d, 0, 0.35)); can.rotation.z = Math.PI / 2; hull.add(can);
    const fair = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 2.0, 6, 18, 2), mat(0xc81e14, 0x200400, 0.45)); fair.rotation.z = Math.PI / 2; fair.scale.set(1, 1, 0.82); hull.add(fair);
    for (const x of [-1.15, 1.15]) for (const k of [0, 1]) { const tun = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 8, 20), mat(0x1a1d20)); tun.position.set(x * (k ? 0.75 : 1), 0, 0); tun.rotation.x = k ? 0 : Math.PI / 2; hull.add(tun); }
    hull.position.y = 1.6; g.add(hull);
    const bubbles = new THREE.InstancedMesh(new THREE.SphereGeometry(0.04, 6, 4), mat(PAL.medium, PAL.medium), 60);
    const seeds = Array.from({ length: 60 }, (_, i) => [Math.sin(i * 12.9) * 1.6, (i * 0.37) % 4, Math.cos(i * 7.3) * 0.8]);
    g.add(bubbles); const m4 = new THREE.Matrix4();
    let apart = 0;
    stations.push({ group: at(2, g), tick: (t) => {
      hull.rotation.y = Math.sin(t * 0.3) * 0.25; hull.position.y = 1.6 + Math.sin(t * 0.8) * 0.05;
      fair.position.y = apart * 0.9; can.position.y = -apart * 0.2;
      seeds.forEach(([x, y, z], i) => { m4.makeTranslation(x, ((y + t * 0.4) % 4) + 0.2, z); bubbles.setMatrixAt(i, m4); });
      bubbles.instanceMatrix.needsUpdate = true; return true;
    }, bench: (v) => { apart = Number(v); } });
  }

  // 3 · Air: a rocket on a gimbal, wind lines, exhaust.
  {
    const g = new THREE.Group(); lamp(g, PAL.failure, 5, 24);
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.2, 8), mat(PAL.steel)); pad.position.y = 0.1; g.add(pad);
    const rocket = new THREE.Group();
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 2.6, 12), mat(PAL.chalk, 0, 0.4)); tube.position.y = 1.3; rocket.add(tube);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.6, 12), mat(PAL.failure, 0x300800)); nose.position.y = 2.9; rocket.add(nose);
    for (let k = 0; k < 4; k++) { const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.5, 0.35), mat(PAL.failure)); fin.position.set(Math.cos(k * Math.PI / 2) * 0.3, 0.3, Math.sin(k * Math.PI / 2) * 0.3); fin.rotation.y = -k * Math.PI / 2; rocket.add(fin); }
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.7, 10), new THREE.MeshBasicMaterial({ color: PAL.estimate })); flame.rotation.x = Math.PI; flame.position.y = -0.35; rocket.add(flame);
    rocket.position.y = 0.6; g.add(rocket);
    const wind = new THREE.Group();
    for (let k = 0; k < 7; k++) { const l = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.015, 0.015), new THREE.MeshBasicMaterial({ color: PAL.medium, transparent: true, opacity: 0.5 })); l.position.set(-3, 0.8 + k * 0.45, -0.5 + (k % 3) * 0.5); wind.add(l); }
    g.add(wind);
    let tilt = 0;
    stations.push({ group: at(3, g), tick: (t) => {
      rocket.rotation.z = THREE.MathUtils.lerp(rocket.rotation.z, -Math.max(-1, Math.min(1, tilt)) * 0.9, 0.08);
      flame.scale.y = 0.85 + Math.sin(t * 40) * 0.15;
      wind.children.forEach((l, k) => { l.position.x = -4 + ((t * 2.2 + k * 0.7) % 4); });
      return true;
    }, bench: (v) => { tilt = (v as { tilt: number }).tilt ?? 0; } });
  }

  // 4 · Ground: terrain, a rover, a two-link arm reaching for a keyboard.
  {
    const g = new THREE.Group(); lamp(g, PAL.estimate, 5, 22);
    const terrain = new THREE.PlaneGeometry(9, 6, 36, 24); const tp = terrain.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < tp.count; i++) { const x = tp.getX(i), y = tp.getY(i); tp.setZ(i, Math.sin(x * 0.9) * 0.18 + Math.cos(y * 1.3 + x * 0.4) * 0.14 + (Math.abs(x) > 3.2 ? (Math.abs(x) - 3.2) * 0.5 : 0)); }
    terrain.computeVertexNormals();
    const ground = new THREE.Mesh(terrain, mat(0x5a3e2b, 0, 1)); ground.rotation.x = -Math.PI / 2; g.add(ground);
    const rover = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 1.1), mat(0xdedad0, 0, 0.5)); rover.position.set(-1.2, 0.6, 0); g.add(rover);
    for (const [x, z] of [[-1.8, 0.65], [-0.6, 0.65], [-1.8, -0.65], [-0.6, -0.65]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.22, 10), mat(0x15191c)); w.rotation.x = Math.PI / 2; w.position.set(x, 0.32, z); g.add(w); }
    const kb = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.6), mat(0x22282d)); kb.position.set(1.6, 0.45, 0); g.add(kb);
    const shoulder = new THREE.Group(); shoulder.position.set(-0.6, 0.85, 0); g.add(shoulder);
    const l1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.12), mat(PAL.measured, 0x1a2a08)); l1.position.x = 0.7; shoulder.add(l1);
    const elbow = new THREE.Group(); elbow.position.x = 1.4; shoulder.add(elbow);
    const l2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 0.1), mat(PAL.measured, 0x1a2a08)); l2.position.x = 0.55; elbow.add(l2);
    let aim = 0;
    stations.push({ group: at(4, g), tick: (t) => {
      const target = 0.6 + Math.sin(t * 0.7 + aim) * 0.35;
      shoulder.rotation.z = THREE.MathUtils.lerp(shoulder.rotation.z, 0.35 - target * 0.4, 0.06);
      elbow.rotation.z = THREE.MathUtils.lerp(elbow.rotation.z, -0.9 - target * 0.5, 0.06);
      return true;
    }, bench: (v) => { aim = String((v as { key: string }).key ?? "A").charCodeAt(0) * 0.37; } });
  }

  // 5 · Delay: four LEDs that answer late, and a metronome.
  {
    const g = new THREE.Group(); lamp(g, PAL.estimate, 5, 18);
    const leds = [PAL.failure, PAL.measured, PAL.chalk, 0x2a4fd8].map((c, k) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.1 })); m.position.set(-1.2 + k * 0.8, 1.2, 0); g.add(m); return m; });
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.4, 0.06), mat(PAL.chalk)); arm.geometry.translate(0, 1.2, 0);
    const met = new THREE.Group(); met.position.set(2.2, 0.2, 0); met.add(arm); g.add(met);
    const base = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.8, 4), mat(PAL.steel)); base.position.set(2.2, 0.4, 0); g.add(base);
    let settled = false;
    stations.push({ group: at(5, g), tick: (t) => {
      const sw = Math.sin(t * 2.4);
      met.rotation.z = sw * (settled ? 0.08 : 0.45);
      leds.forEach((m, k) => { (m.material as THREE.MeshStandardMaterial).emissiveIntensity = settled ? 0.15 : ((k === 0 && sw > 0.2) || (k === 1 && sw < -0.2) ? 1.6 : 0.12); });
      return true;
    }, bench: (v) => { settled = !!(v as { settled: boolean }).settled; } });
  }

  // 6 · Noise: a cloud of readings and the line that believes them.
  {
    const g = new THREE.Group(); lamp(g, PAL.failure, 5, 20);
    const n = 120; const pts = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.07), new THREE.MeshStandardMaterial({ color: PAL.chalk, emissive: 0x111111 }), n);
    const liar = new Float32Array(n); const m4 = new THREE.Matrix4(); const col = new THREE.Color();
    const place = (frac: number) => { for (let i = 0; i < n; i++) { const x = -2.6 + (i / n) * 5.2; const l = ((Math.sin(i * 91.7) + 1) / 2) < frac; liar[i] = l ? 1 : 0; m4.makeTranslation(x, 0.8 + x * 0.35 + (l ? 0.8 + ((i * 37) % 10) * 0.12 : Math.sin(i * 3.1) * 0.05), Math.cos(i * 1.7) * 0.4); pts.setMatrixAt(i, m4); pts.setColorAt(i, col.set(l ? PAL.failure : PAL.chalk)); } pts.instanceMatrix.needsUpdate = true; if (pts.instanceColor) pts.instanceColor.needsUpdate = true; };
    place(0.2); g.add(pts);
    const truth = new THREE.Mesh(new THREE.BoxGeometry(6, 0.025, 0.025), new THREE.MeshBasicMaterial({ color: PAL.measured })); truth.position.y = 0.8; truth.rotation.z = Math.atan(0.35); g.add(truth);
    const ols = new THREE.Mesh(new THREE.BoxGeometry(6, 0.02, 0.02), new THREE.MeshBasicMaterial({ color: 0x8a8f95 })); ols.position.y = 0.8; ols.rotation.z = Math.atan(0.35); g.add(ols);
    let frac = 0.2;
    stations.push({ group: at(6, g), tick: (t) => { g.rotation.y = Math.sin(t * 0.25) * 0.2; ols.position.y = THREE.MathUtils.lerp(ols.position.y, 0.8 + frac * 1.6, 0.05); return true; },
      bench: (v) => { frac = (v as { frac: number }).frac; place(frac); } });
  }

  // 7 · Sight: a camera frustum and the nine light/dark tiles it believes are a face.
  {
    const g = new THREE.Group(); lamp(g, PAL.measured, 5, 20);
    const frustum = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.ConeGeometry(1.4, 3, 4, 1, true)), new THREE.LineBasicMaterial({ color: PAL.measured }));
    frustum.rotation.z = Math.PI / 2; frustum.rotation.x = Math.PI / 4; frustum.position.set(-1.2, 1.6, 0); g.add(frustum);
    const cam3 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.5), mat(0x1c2126)); cam3.position.set(-2.8, 1.6, 0); g.add(cam3);
    const tiles: THREE.Mesh[] = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const tile = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.04), mat(r === 1 && c !== 1 ? 0x111111 : 0xd8d4c8)); tile.position.set(1.6, 2.2 - r * 0.5, -0.5 + c * 0.5); tile.rotation.y = -Math.PI / 2; g.add(tile); tiles.push(tile); }
    let k = 0;
    stations.push({ group: at(7, g), tick: (t) => { tiles.forEach((m, i) => { m.position.x = 1.6 + (i === k ? 0.12 + Math.sin(t * 4) * 0.04 : 0); }); return true; }, bench: (v) => { k = Number(v) % 9; } });
  }

  // 8 · Workshop: a monitor, a keyboard, a terminal glow.
  {
    const g = new THREE.Group(); lamp(g, PAL.measured, 5, 18);
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.12, 2), mat(0x16130f)); desk.position.y = 1; g.add(desk);
    for (const x of [-1.9, 1.9]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1, 1.6), mat(0x16130f)); leg.position.set(x, 0.5, 0); g.add(leg); }
    const screen = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.3, 0.08), new THREE.MeshStandardMaterial({ color: 0x050505, emissive: PAL.measured, emissiveIntensity: 0.25 }));
    screen.position.set(0, 1.85, -0.5); g.add(screen);
    const kb = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.45), mat(0x2a2f34)); kb.position.set(0, 1.1, 0.35); g.add(kb);
    let pulse = 0;
    stations.push({ group: at(8, g), tick: (t) => { (screen.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.22 + pulse * 0.4 * Math.max(0, 1 - (t % 1.2)); pulse *= 0.995; return true; }, bench: () => { pulse = 1; } });
  }

  // 9 · Flight recorder: a skyline of the last year's real contributions.
  {
    const g = new THREE.Group(); lamp(g, PAL.measured, 6, 26);
    const days = stats.days as [string, number][];
    const mx = Math.max(...days.map((d) => d[1]));
    const bars = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 1, 0.16), new THREE.MeshStandardMaterial({ color: PAL.measured, emissive: 0x2a4008, roughness: 0.5 }), days.length);
    const m4 = new THREE.Matrix4(); const col = new THREE.Color();
    days.forEach(([, n], i) => { const h = 0.04 + Math.sqrt(n / mx) * 3; const w = Math.floor(i / 7), d = i % 7; m4.makeScale(1, h, 1).setPosition(-4.6 + w * 0.18, h / 2, -0.6 + d * 0.2); bars.setMatrixAt(i, m4); bars.setColorAt(i, col.set(n ? PAL.measured : 0x1a2228)); });
    g.add(bars);
    const marker = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial({ color: PAL.estimate })); g.add(marker);
    const mark = (i: number) => { const w = Math.floor(i / 7), d = i % 7; const h = 0.04 + Math.sqrt(days[i][1] / mx) * 3; marker.position.set(-4.6 + w * 0.18, h + 0.25, -0.6 + d * 0.2); };
    mark(days.length - 1);
    stations.push({ group: at(9, g), tick: (t) => { marker.rotation.y = t; return true; }, bench: (v) => { const i = days.findIndex((d) => d[0] === (v as { date: string }).date); if (i >= 0) mark(i); } });
  }

  // Camera stations: look at the set from the front-right; offset the frustum so it sits right of the text.
  let active = 0, from = new THREE.Vector3(), to = new THREE.Vector3(), look = new THREE.Vector3(), lookTo = new THREE.Vector3(), blend = 1;
  const camFor = (i: number, out: THREE.Vector3) => out.set(i * GAP + 5.5, 3.4, 9.5);
  const lookFor = (i: number, out: THREE.Vector3) => out.set(i * GAP, 1.4, 0);
  camFor(0, cam.position); lookFor(0, look); lookFor(0, lookTo); camFor(0, to);

  const resize = () => {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    if (w > 900) cam.setViewOffset(w, h, -w * 0.18, 0, w, h); else cam.clearViewOffset();
    cam.updateProjectionMatrix();
  };
  addEventListener("resize", () => { resize(); kick(); });
  resize();

  bus.addEventListener("arena", (e) => {
    const n = (e as CustomEvent<number>).detail;
    if (n < 0 || n === active) return;
    active = n; from.copy(cam.position); camFor(n, to); lookTo.set(n * GAP, 1.4, 0); blend = 0; kick();
  });
  const benchStation: Record<string, number> = { ebhapa: 0, "colour-depth": 1, hull: 2, gimbal: 3, "ik-arm": 4, delay: 5, liars: 6, haar: 7, query: 8, recorder: 9 };
  bus.addEventListener("bench", (e) => {
    const { bench, value } = (e as CustomEvent<{ bench: string; value: unknown }>).detail;
    stations[benchStation[bench]]?.bench?.(value); kick();
  });

  let running = false, t0 = performance.now(), hidden = false;
  document.addEventListener("visibilitychange", () => { hidden = document.hidden; if (!hidden) kick(); });
  function frame(now: number) {
    if (hidden) { running = false; return; }
    const t = (now - t0) / 1000;
    if (blend < 1) { blend = Math.min(1, blend + 0.018); const k = 1 - Math.pow(1 - blend, 3); cam.position.lerpVectors(from, to, k); }
    look.lerp(lookTo, 0.08); cam.lookAt(look);
    // Only the active station and its neighbours animate.
    for (let i = Math.max(0, active - 1); i <= Math.min(stations.length - 1, active + 1); i++) stations[i].tick?.(t);
    renderer.render(scene, cam);
    requestAnimationFrame(frame);
  }
  function kick() { if (!running && !hidden) { running = true; requestAnimationFrame(frame); } }
  renderer.compile(scene, cam);
  kick();
}
