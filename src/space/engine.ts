/**
 * The fh1m system, rendered: one star, four worlds with their moons, a belt of wrong ideas,
 * stations, the pale blue dot, and Voyager at the edge. Bunnu flies a small ship to whatever
 * you choose. Same World interface as before, so every panel, plate and mission keeps working.
 *
 * Kept deliberately light: no shadow maps, one instanced draw for the belt dust, shared local
 * surface maps, adaptive pixel ratio capped at 1.5, and a loop that sleeps when hidden.
 */
import * as THREE from "three";
import { ALL, PLANETS, MOONS, STATIONS, ROCKS, HOME, PROBE, byId } from "./system";
import { siliconMaterial, atmosphere, starMaterial, rockMaterial } from "./shaders";
import { createSound, type Sound } from "../game/audio";
import { createArtefactFactory } from "./artefacts";
import { oxocarbon } from "../data/palette";

export type ZoneId = "air" | "water" | "earth" | "fire";
export type Mode = "idle" | "fail" | "wrong" | "fixed";
export interface World {
  go: (z: ZoneId | null) => void; fallIn: () => void; sound: Sound;
  onZone: (cb: (z: ZoneId | null) => void) => void;
  onObject: (cb: (id: string) => void) => void; focus: (id: string) => void;
  setMode: (m: Mode) => void;
  setYear: (y: number | null) => void;
  onHover: (cb: (id: string | null, x: number, y: number) => void) => void;
  /** Screen positions of labelled bodies, for the HTML labels. */
  onFrame: (cb: (pos: Map<string, { x: number; y: number; z: number; r: number; visible: boolean }>) => void) => void;
  /** Bunnu's ship was clicked. */
  onBunnu: (cb: () => void) => void;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function start(canvas: HTMLCanvasElement): World {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#020306");
  const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 6000);
  // A soft viewing light makes engineering artefacts readable without relighting the worlds.
  const inspectionLight = new THREE.PointLight("#e2edff", 0, 0, 0);
  inspectionLight.position.set(0, 4, 0);
  cam.add(inspectionLight); scene.add(cam);

  const loader = new THREE.TextureLoader(), textures = new Map<string, THREE.Texture>();
  const texture = (name: string) => {
    let map = textures.get(name);
    if (!map) {
      map = loader.load(`/media/space/${name}.webp`);
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      textures.set(name, map);
    }
    return map;
  };
  const backdrop = texture("milky-way"); backdrop.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = backdrop; scene.backgroundIntensity = 0.65;

  // the sky: three star layers with real-looking colour spread, and a faint galactic band
  const sky = new THREE.Group(); scene.add(sky);
  {
    const N = 4200, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), size = new Float32Array(N);
    const tint = [new THREE.Color("#9db4ff"), new THREE.Color("#ffffff"), new THREE.Color("#ffe9c4"), new THREE.Color("#ffc58f")];
    const band = new THREE.Vector3(0.3, 1, 0.2).normalize();
    for (let i = 0; i < N; i++) {
      const v = new THREE.Vector3().randomDirection();
      if (i < N * 0.45) { v.addScaledVector(band, -v.dot(band) * 0.85).normalize(); } // concentrate into a band
      v.multiplyScalar(2400 + Math.random() * 900); pos.set([v.x, v.y, v.z], i * 3);
      const c = tint[Math.floor(Math.random() ** 2 * tint.length)]; col.set([c.r, c.g, c.b], i * 3);
      size[i] = Math.random() < 0.02 ? 3.2 : 0.8 + Math.random() * 1.4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("color", new THREE.BufferAttribute(col, 3)); g.setAttribute("size", new THREE.BufferAttribute(size, 1));
    sky.add(new THREE.Points(g, starMaterial()));
  }

  // the star at the centre: a hot core and a soft corona
  const sun = new THREE.Group(); scene.add(sun);
  const sunMat = new THREE.MeshBasicMaterial({ map: texture("sun"), toneMapped: false });
  sun.add(new THREE.Mesh(new THREE.SphereGeometry(7, 64, 48), sunMat));
  const corona = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: "#ffc285", opacity: 0.38, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  corona.scale.setScalar(31); sun.add(corona);
  const light = new THREE.PointLight("#fff1dc", 2.5, 0, 0); sun.add(light);
  scene.add(new THREE.HemisphereLight("#b4c7e4", "#242936", 0.55));
  sun.userData.obj = "fh1m";

  // bodies
  const nodes = new Map<string, THREE.Object3D>(), pickables: THREE.Object3D[] = [], shaderMats: THREE.ShaderMaterial[] = [];
  const visuals = new Map<string, THREE.Object3D>(), radii = new Map<string, number>(), centres = new Map<string, THREE.Vector3>();
  const overviewOrbits = new THREE.Group(); scene.add(overviewOrbits);
  const moonOrbits: { line: THREE.Line; parent: string }[] = [];
  const contextVisible = new Set(ALL.map(body => body.id));
  const orbitLine = (r: number, opacity = 0.12) => {
    const pts = Array.from({ length: 257 }, (_, i) => { const a = (i / 256) * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r); });
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: "#8fa3c4", transparent: true, opacity }));
  };
  const pivots = new Map<string, THREE.Object3D>(); // the thing that orbits (holds the body)
  for (const p of PLANETS) {
    overviewOrbits.add(orbitLine(p.orbit));
    const pivot = new THREE.Group(); scene.add(pivot); pivots.set(p.id, pivot);
    const visual = new THREE.Group(); visual.rotation.z = p.tilt ?? 0; pivot.add(visual); visuals.set(p.id, visual);
    const mat = p.surface === "silicon"
      ? siliconMaterial(p.colours!)
      : new THREE.MeshStandardMaterial({ map: texture(p.surface === "gas" ? "saturn" : p.surface === "desert" ? "mars" : "earth"), roughness: 0.88, metalness: 0 });
    if (mat instanceof THREE.ShaderMaterial) shaderMats.push(mat);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(p.size, 64, 48), mat);
    mesh.userData.obj = p.id; visual.add(mesh);
    const atm = atmosphere(p.size * 1.055, p.surface === "silicon" ? "#e0864a" : p.surface === "gas" ? "#d6bb86" : p.surface === "desert" ? "#cd8e66" : "#7fb6ff");
    visual.add(atm);
    radii.set(p.id, p.size * (p.surface === "gas" ? 2.2 : 1.055));
    if (p.surface === "gas") {
      const inner = p.size * 1.4, outer = p.size * 2.2;
      const geometry = new THREE.RingGeometry(inner, outer, 128);
      const positions = geometry.getAttribute("position"), uv = geometry.getAttribute("uv");
      for (let i = 0; i < positions.count; i++) uv.setXY(i, (Math.hypot(positions.getX(i), positions.getY(i)) - inner) / (outer - inner), 0.5);
      const ring = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: texture("saturn-rings"), roughness: 1, transparent: true, opacity: 0.92, side: THREE.DoubleSide, depthWrite: false }));
      ring.userData.obj = p.id; pickables.push(ring);
      ring.rotation.x = Math.PI / 2; visual.add(ring);
    }
    nodes.set(p.id, mesh); pickables.push(mesh);
  }
  const rockGeo = (seed: number) => { const g = new THREE.IcosahedronGeometry(1, 2); const a = g.getAttribute("position") as THREE.BufferAttribute; const v = new THREE.Vector3(); for (let i = 0; i < a.count; i++) { v.fromBufferAttribute(a, i); const n = 1 + 0.18 * Math.sin(v.x * 3 + seed) * Math.cos(v.y * 4 - seed) + 0.08 * Math.sin(v.z * 7 + seed * 2); v.multiplyScalar(n); a.setXYZ(i, v.x, v.y, v.z); } g.computeVertexNormals(); return g; };
  const artefact = createArtefactFactory();
  for (const m of MOONS) {
    const host = pivots.get(m.parent!)!;
    const ringLine = orbitLine(m.orbit, 0.08); host.add(ringLine);
    moonOrbits.push({ line: ringLine, parent: m.parent! });
    const pivot = new THREE.Group(); host.add(pivot); pivots.set(m.id, pivot);
    const mesh = artefact(m.id);
    mesh.scale.setScalar(m.size); pivot.add(mesh);
    nodes.set(m.id, mesh); pickables.push(mesh);
  }
  for (const s of STATIONS) {
    const pivot = new THREE.Group(); scene.add(pivot); pivots.set(s.id, pivot);
    const st = station(s.id); st.scale.setScalar(s.size); st.traverse((o) => (o.userData.obj = s.id)); pivot.add(st);
    nodes.set(s.id, st); pickables.push(st);
  }
  // the belt: 1,400 grains of dust in one draw, and one real rock per lesson
  {
    const dust = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), rockMaterial("#6d6a66"), 1400);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    for (let i = 0; i < 1400; i++) {
      const a = Math.random() * Math.PI * 2, r = 61 + Math.random() * 7 + (Math.random() - 0.5) * 3;
      p.set(Math.cos(a) * r, (Math.random() - 0.5) * 2.2, Math.sin(a) * r); q.setFromEuler(new THREE.Euler(Math.random() * 6, Math.random() * 6, 0)); s.setScalar(0.05 + Math.random() ** 3 * 0.35);
      dust.setMatrixAt(i, m4.compose(p, q, s));
    }
    const belt = new THREE.Group(); belt.add(dust); scene.add(belt); pivots.set("belt", belt);
    for (const r of ROCKS) {
      const pivot = new THREE.Group(); belt.add(pivot); pivots.set(r.id, pivot);
      const mesh = new THREE.Mesh(rockGeo(r.phase * 3), rockMaterial("#9a948c")); mesh.scale.setScalar(r.size); mesh.userData.obj = r.id; pivot.add(mesh);
      nodes.set(r.id, mesh); pickables.push(mesh);
    }
  }
  // home: a small blue world, far out, with a thin atmosphere
  {
    const pivot = new THREE.Group(); scene.add(pivot); pivots.set(HOME.id, pivot); overviewOrbits.add(orbitLine(HOME.orbit, 0.07));
    const visual = new THREE.Group(); visual.rotation.z = 0.409; pivot.add(visual); visuals.set(HOME.id, visual);
    const mat = new THREE.MeshStandardMaterial({ map: texture("earth"), roughness: 0.85, metalness: 0 });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(HOME.size, 48, 32), mat); mesh.userData.obj = HOME.id; visual.add(mesh);
    visual.add(atmosphere(HOME.size * 1.055, "#8cc4ff")); radii.set(HOME.id, HOME.size * 1.055);
    nodes.set(HOME.id, mesh); pickables.push(mesh);
  }
  // Voyager 1: dish, bus, booms, still going
  {
    const pivot = new THREE.Group(); scene.add(pivot); pivots.set(PROBE.id, pivot);
    const v = new THREE.Group(); const m = (c: string) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.6 });
    const dish = new THREE.Mesh(new THREE.SphereGeometry(1.8, 24, 12, 0, Math.PI * 2, 0, 0.6), m("#e8e4da")); dish.rotation.x = -Math.PI / 2; v.add(dish);
    const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.5, 10), m("#c79a3c")); bus.rotation.x = Math.PI / 2; bus.position.z = -0.4; v.add(bus);
    for (const [x, y, len] of [[1, 0, 6], [-1, -0.6, 3.5], [0, 1, 3]] as const) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, len, 5), m("#bdb7aa")); b.position.set((x * len) / 2, (y * len) / 2, -0.4); b.rotation.z = Math.atan2(-x, y); v.add(b); }
    v.traverse((o) => (o.userData.obj = PROBE.id)); pivot.add(v); nodes.set(PROBE.id, v); pickables.push(v);
  }
  pickables.push(sun.children[0]); sun.children[0].userData.obj = "fh1m"; nodes.set("fh1m", sun.children[0]);
  // Bounds are measured once, outside the render loop. Keep off-centre booms and noses in frame.
  const bounds = new THREE.Box3(), sphere = new THREE.Sphere();
  for (const [id, node] of nodes) {
    bounds.setFromObject(node).getBoundingSphere(sphere);
    centres.set(id, node.worldToLocal(sphere.center.clone()));
    if (!radii.has(id)) radii.set(id, sphere.radius);
  }
  // A domain is its projects as well as its planet. Fit that neighbourhood on entry.
  const neighbourhoodRadii = new Map<string, number>();
  for (const planet of PLANETS) neighbourhoodRadii.set(planet.id, radii.get(planet.id)!);
  for (const moon of MOONS) {
    const parent = moon.parent!;
    neighbourhoodRadii.set(parent, Math.max(neighbourhoodRadii.get(parent)!, moon.orbit + radii.get(moon.id)!));
  }

  // Bunnu's ship: small, quick, a little cat in the canopy; she flies to whatever you choose
  const ship = buildShip(); scene.add(ship.group);
  pickables.push(ship.group);
  const shipPos = new THREE.Vector3(20, 6, 20), shipVel = new THREE.Vector3();

  // camera: a state (target, distance, yaw, pitch) with eased flights; drag to orbit, wheel to zoom
  const look = new THREE.Vector3(), camState = { dist: 260, yaw: 0.6, pitch: 0.55 };
  let flight: { fromLook: THREE.Vector3; toId: string | null; toLook: THREE.Vector3; d0: number; d1: number; p0: number; p1: number; y0: number; y1: number; t: number; dur: number } | null = null;
  let follow: string | null = null;
  const worldPos = (id: string, out = new THREE.Vector3()) => {
    const node = nodes.get(id), centre = centres.get(id);
    return node && centre ? node.localToWorld(out.copy(centre)) : out.set(0, 0, 0);
  };
  const sizeOf = (id: string) => radii.get(id) ?? 1;
  function flyTo(id: string | null, dist?: number, dur = 1.8) {
    const toLook = id ? worldPos(id) : new THREE.Vector3();
    const halfVertical = THREE.MathUtils.degToRad(cam.fov / 2);
    const freeAspect = cam.aspect * (canvas.clientWidth > 900 ? 0.62 : 0.9);
    const fitAngle = Math.min(halfVertical, Math.atan(Math.tan(halfVertical) * freeAspect));
    const body = id ? byId[id] : undefined;
    const viewRadius = id ? (body?.kind === "planet" ? neighbourhoodRadii.get(id)! : sizeOf(id)) : 0;
    const d1 = dist ?? (id ? Math.max(2, viewRadius / Math.sin(fitAngle) * 1.3) : 260);
    // look at a body from its sunlit side (the star is at the origin), a little off-axis
    let y1 = camState.yaw;
    const overview = !id || id === "timemachine";
    contextVisible.clear();
    for (const candidate of ALL) if (overview || candidate.id === id || (body?.kind === "planet" && candidate.parent === id)) contextVisible.add(candidate.id);
    overviewOrbits.visible = overview;
    for (const orbit of moonOrbits) orbit.line.visible = overview || orbit.parent === id;
    pivots.get("belt")!.visible = overview || body?.kind === "rock";
    nodes.get("fh1m")!.visible = overview || id === "fh1m"; corona.visible = overview || id === "fh1m";
    inspectionLight.intensity = !overview && id !== "fh1m" && body?.kind !== "planet" && body?.kind !== "home" ? 1.25 : 0;
    if (body?.parent) {
      const outward = toLook.clone().sub(worldPos(body.parent));
      const want = Math.atan2(outward.z, outward.x) + 0.25;
      y1 = camState.yaw + Math.atan2(Math.sin(want - camState.yaw), Math.cos(want - camState.yaw));
    } else if (id && id !== "fh1m" && toLook.lengthSq() > 1) {
      const want = Math.atan2(toLook.z, toLook.x) + Math.PI - 0.55;
      y1 = camState.yaw + Math.atan2(Math.sin(want - camState.yaw), Math.cos(want - camState.yaw));
    }
    flight = { fromLook: look.clone(), toId: id, toLook, d0: camState.dist, d1, p0: camState.pitch, p1: body?.kind === "planet" ? 0.75 : body?.kind === "moon" ? 0.65 : id ? 0.32 : 0.55, y0: camState.yaw, y1, t: 0, dur: reduce ? 0.01 : dur };
    canvas.setAttribute("aria-busy", "true");
    follow = id;
  }

  const sound = createSound();
  let zone: ZoneId | null = null, year: number | null = null, mode: Mode = "idle", modeT = 0;
  const zoneCbs: ((z: ZoneId | null) => void)[] = [], objCbs: ((id: string) => void)[] = [], hoverCbs: ((id: string | null, x: number, y: number) => void)[] = [], frameCbs: ((m: Map<string, { x: number; y: number; z: number; r: number; visible: boolean }>) => void)[] = [], bunnuCbs: (() => void)[] = [];

  // input
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const hits: THREE.Intersection[] = [];
  const visibleInScene = (node: THREE.Object3D) => {
    for (let ancestor: THREE.Object3D | null = node; ancestor; ancestor = ancestor.parent) if (!ancestor.visible) return false;
    return true;
  };
  let drag: { x: number; y: number; moved: boolean } | null = null;
  canvas.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY, moved: false }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", (e) => {
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      camState.yaw -= dx * 0.005; camState.pitch = THREE.MathUtils.clamp(camState.pitch + dy * 0.004, 0.05, 1.45);
      drag.x = e.clientX; drag.y = e.clientY; return;
    }
    const id = pick(e); hoverCbs.forEach((f) => f(id, e.clientX, e.clientY)); canvas.style.cursor = id ? "pointer" : "grab";
  });
  canvas.addEventListener("pointerup", (e) => { const was = drag; drag = null; if (was && !was.moved) { const id = pick(e); if (id === "bunny-ship") bunnuCbs.forEach((f) => f()); else if (id) choose(id); } });
  canvas.addEventListener("wheel", (e) => { e.preventDefault(); camState.dist = THREE.MathUtils.clamp(camState.dist * Math.exp(e.deltaY * 0.0012), 5, 420); }, { passive: false });
  function pick(e: PointerEvent | MouseEvent) {
    const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    hits.length = 0; ray.intersectObjects(pickables, true, hits);
    for (const hit of hits) {
      if (!visibleInScene(hit.object)) continue;
      if (hit.object.userData.ship) return "bunny-ship";
      if (hit.object.userData.obj) return hit.object.userData.obj as string;
    }
    return null;
  }
  // panels that live somewhere without being a body of their own
  const ALIAS: Record<string, string> = { graveyard: ROCKS[0].id, "heritage-jcbose": HOME.id, "heritage-snbose": HOME.id, "heritage-frkhan": HOME.id, "heritage-jrc": HOME.id };
  function choose(id: string) {
    const b = byId[id];
    if (b?.kind === "planet") { go(b.zone!); return; }
    flyTo(ALIAS[id] ?? id); shift(true); sound.whoosh(); objCbs.forEach((f) => f(id));
  }
  function go(z: ZoneId | null) {
    zone = z; sound.whoosh(); sound.scene(z ?? "space");
    flyTo(z); shift(!!z); zoneCbs.forEach((f) => f(z));
  }

  // with a panel open on the right of a wide screen, shift the picture so the subject sits in the free space
  let shifted = false;
  const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.fov = w < h ? 58 : 40; if (shifted && w > 900) cam.setViewOffset(w, h, w * 0.12, 0, w, h); else cam.clearViewOffset(); cam.updateProjectionMatrix(); };
  const shift = (on: boolean) => { if (on !== shifted) { shifted = on; resize(); } };
  addEventListener("resize", resize); resize();

  // labels: planets always; a world's moons when you are at that world; the star and stations when zoomed out
  const labelled = [...PLANETS.map((p) => p.id), ...STATIONS.map((s) => s.id), HOME.id, PROBE.id, "fh1m", ...MOONS.map((m) => m.id)];
  const screen = new Map(labelled.map(id => [id, { x: 0, y: 0, z: 0, r: 0, visible: false }]));
  const v3 = new THREE.Vector3(), shipTarget = new THREE.Vector3(), shipOffset = new THREE.Vector3(), shipJitter = new THREE.Vector3();

  let last = performance.now(), running = true, tAcc = 0, orbitT = 0, firstFrame = true, frameMs = 16, frameN = 0;
  function tick(now: number) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = (tAcc += reduce ? 0 : dt);
    // Hold the map steady for close inspection; resume its orbits in the whole-system view.
    const moveOrbits = firstFrame || (!reduce && !follow); firstFrame = false;
    if (moveOrbits && !reduce) orbitT += dt;
    for (const b of ALL) {
      const pv = pivots.get(b.id); if (!pv) continue;
      if (moveOrbits) {
        const a = b.phase + orbitT * b.speed;
        if (b.kind === "rock") pv.position.set(Math.cos(a) * b.orbit, Math.sin(a * 3) * 0.6, Math.sin(a) * b.orbit);
        else pv.position.set(Math.cos(a) * b.orbit, 0, Math.sin(a) * b.orbit);
        if (b.kind === "moon") pv.rotation.y = Math.PI / 2 - a;
      }
      const n = nodes.get(b.id);
      if (n && !reduce && (b.kind === "planet" || b.kind === "home")) n.rotation.y += dt * 0.025;
      // Fade the whole visual, including a planet's atmosphere and rings, not its orbit hierarchy.
      const on = (year === null || b.year <= year) && contextVisible.has(b.id), visual = visuals.get(b.id) ?? n;
      if (visual) {
        const base = visual.userData.base ?? (visual.userData.base = visual.scale.x);
        const k = THREE.MathUtils.damp(visual.scale.x / base, on ? 1 : 0.001, 6, dt);
        visual.scale.setScalar(base * k); visual.visible = k > 0.01;
      }
    }
    if (moveOrbits) pivots.get("belt")!.rotation.y = orbitT * 0.004;
    for (const m of shaderMats) if (m.uniforms.uTime) m.uniforms.uTime.value = t;
    corona.material.rotation = t * 0.02;

    // camera
    if (flight) {
      flight.t = Math.min(1, flight.t + dt / flight.dur); const k = ease(flight.t);
      const to = flight.toId ? worldPos(flight.toId, v3) : flight.toLook;
      look.copy(flight.fromLook).lerp(to, k);
      camState.dist = Math.exp(Math.log(flight.d0) + (Math.log(flight.d1) - Math.log(flight.d0)) * k);
      camState.pitch = flight.p0 + (flight.p1 - flight.p0) * k;
      camState.yaw = flight.y0 + (flight.y1 - flight.y0) * k;
      if (flight.t >= 1) { flight = null; canvas.setAttribute("aria-busy", "false"); }
    } else if (follow) look.lerp(worldPos(follow, v3), 1 - Math.exp(-dt * 8));
    if (!drag && !flight && !follow && !reduce) camState.yaw += dt * 0.005;
    cam.position.set(look.x + Math.cos(camState.yaw) * Math.cos(camState.pitch) * camState.dist, look.y + Math.sin(camState.pitch) * camState.dist, look.z + Math.sin(camState.yaw) * Math.cos(camState.pitch) * camState.dist);
    cam.lookAt(look);

    // Bunnu: spring toward a point beside the target, a little bob, banks into turns
    if (follow) worldPos(follow, shipTarget); else shipTarget.set(0, 0, 0);
    shipOffset.set(Math.cos(t * 0.7), 0.6 + Math.sin(t * 1.3) * 0.25, Math.sin(t * 0.7)).multiplyScalar(follow ? sizeOf(follow) * 1.7 + 0.15 : 16);
    shipTarget.add(shipOffset);
    if (reduce) { shipPos.copy(shipTarget); shipVel.set(0, 0, 0); }
    else {
      const acc = shipTarget.sub(shipPos).multiplyScalar(4).addScaledVector(shipVel, -2.6);
      if (mode === "fail" || mode === "wrong") acc.add(shipJitter.set(Math.sin(t * 9), Math.cos(t * 7), Math.sin(t * 11)).multiplyScalar(mode === "wrong" ? 18 : 9));
      shipVel.addScaledVector(acc, dt); shipPos.addScaledVector(shipVel, dt);
    }
    ship.group.position.copy(shipPos);
    if (shipVel.lengthSq() > 0.01) ship.group.lookAt(v3.copy(shipPos).add(shipVel));
    ship.group.rotateZ(THREE.MathUtils.clamp(-shipVel.x * 0.02, -0.5, 0.5));
    ship.flame.scale.z = 0.6 + Math.min(2, shipVel.length() * 0.08) + Math.sin(t * 40) * 0.08;
    ship.group.scale.setScalar(follow ? THREE.MathUtils.clamp(sizeOf(follow) * 0.13, 0.12, 0.9) : 0.8);
    modeT += dt; if (mode === "fixed" && modeT > 3) mode = "idle";

    renderer.render(scene, cam);
    // adaptive resolution: if frames run long for a while, render fewer pixels; recover when fast
    frameMs = frameMs * 0.95 + dt * 1000 * 0.05;
    if (++frameN % 60 === 0) {
      const pr = renderer.getPixelRatio();
      if (frameMs > 24 && pr > 0.6) { renderer.setPixelRatio(Math.max(0.6, pr - 0.25)); resize(); }
      else if (frameMs < 14 && pr < Math.min(devicePixelRatio, 1.5)) { renderer.setPixelRatio(Math.min(Math.min(devicePixelRatio, 1.5), pr + 0.25)); resize(); }
    }

    // project labels
    const w = canvas.clientWidth, h = canvas.clientHeight;
    for (const id of labelled) {
      const n = nodes.get(id); if (!n) continue;
      worldPos(id, v3); const d = v3.distanceTo(cam.position); v3.project(cam);
      const b = byId[id];
      const near = b?.kind === "moon" ? follow === id || (zone === b.zone && d < 140) : b?.kind === "station" || id === "fh1m" ? camState.dist > 60 || follow === id : true;
      const r = (sizeOf(id) / d) * (h / 2) / Math.tan((cam.fov * Math.PI) / 360);
      const projected = screen.get(id)!;
      projected.x = (v3.x * 0.5 + 0.5) * w; projected.y = (-v3.y * 0.5 + 0.5) * h;
      projected.z = d; projected.r = r; projected.visible = v3.z > -1 && v3.z < 1 && visibleInScene(n) && near;
    }
    frameCbs.forEach((f) => f(screen));
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) { last = performance.now(); requestAnimationFrame(tick); } });

  return {
    sound,
    go,
    fallIn: () => { flyTo(null, 230, 0.8); },
    focus: (id) => choose(id),
    setMode: (m) => { mode = m; modeT = 0; if (m === "fixed") sound.chime(); else if (m === "wrong") sound.pluck(220); else if (m === "fail") sound.pluck(330); },
    setYear: (y) => { year = y; },
    onZone: (cb) => zoneCbs.push(cb),
    onObject: (cb) => objCbs.push(cb),
    onHover: (cb) => hoverCbs.push(cb),
    onFrame: (cb) => frameCbs.push(cb),
    onBunnu: (cb) => bunnuCbs.push(cb),
  };
}

function glowTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.2, "rgba(255,230,190,.55)"); r.addColorStop(1, "rgba(255,200,140,0)");
  g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
}

/** Stations: built from parts so they read as made things, not rocks. */
function station(id: string) {
  const g = new THREE.Group(); const m = (c: string, e = "#000000") => new THREE.MeshStandardMaterial({ color: c, roughness: 0.45, metalness: 0.7, emissive: e });
  if (id === "library") { // a ring habitat: the notes
    g.add(new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.18, 10, 48), m("#c9ccd2")));
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 2.4, 10), m("#9aa0aa")));
    for (let i = 0; i < 4; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.6), m("#9aa0aa")); s.rotation.y = (i * Math.PI) / 2; s.position.set(Math.cos((i * Math.PI) / 2) * 0.8, 0, Math.sin((i * Math.PI) / 2) * 0.8); g.add(s); }
    g.rotation.x = 1.1;
  } else if (id === "cv") { // a satellite with panels: the CV
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.1), m("#c79a3c")));
    for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 0.8), m("#1d3557", "#0b1a33")); p.position.x = s * 1.6; g.add(p); }
  } else if (id === "timemachine") { // a gate: the time machine
    g.add(new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.22, 12, 64), m("#7c7f88", "#14233a")));
    const core = new THREE.Mesh(new THREE.CircleGeometry(1.55, 48), new THREE.MeshBasicMaterial({ color: "#6fb6ff", transparent: true, opacity: 0.18, side: THREE.DoubleSide })); g.add(core);
  } else { // the tea house: a small lantern-lit module
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 0.9, 8), m("#7a5a3a")));
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.6, 8), m("#3a2a1e")); roof.position.y = 0.75; g.add(roof);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), new THREE.MeshBasicMaterial({ color: "#ffb35c" })); lamp.position.set(0.85, 0.1, 0); g.add(lamp);
  }
  return g;
}

/** Bunnu's ship: a short hull, two fins, a glass canopy with two ear-shaped bumps, and an engine. */
function buildShip() {
  const group = new THREE.Group(); group.userData.ship = true;
  const m = (c: string) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.4, metalness: 0.5 });
  const hull = new THREE.Mesh(new THREE.CapsuleGeometry(0.35, 1.1, 6, 12), m("#e8e6e1")); hull.rotation.x = Math.PI / 2; group.add(hull);
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: "#9fd0ff", roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.7 }));
  canopy.position.set(0, 0.22, 0.25); group.add(canopy);
  const catMaterial = m("#2a2730"), earGeometry = new THREE.ConeGeometry(0.055, 0.12, 4);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), catMaterial);
  head.position.set(0, 0.33, 0.25); group.add(head);
  const eyeGeometry = new THREE.SphereGeometry(0.025, 8, 6), eyeMaterial = new THREE.MeshBasicMaterial({ color: oxocarbon.cyan });
  const finGeometry = new THREE.BoxGeometry(0.7, 0.04, 0.4), finMaterial = m(oxocarbon.pink);
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(earGeometry, catMaterial); ear.position.set(side * 0.095, 0.435, 0.25); group.add(ear);
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial); eye.position.set(side * 0.055, 0.35, 0.374); group.add(eye);
    const fin = new THREE.Mesh(finGeometry, finMaterial); fin.position.set(side * 0.45, 0, -0.3); fin.rotation.z = side * 0.25; group.add(fin);
  }
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 10), new THREE.MeshBasicMaterial({ color: "#7fd3ff", transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
  flame.rotation.x = -Math.PI / 2; flame.position.z = -0.95; group.add(flame);
  group.traverse((o) => (o.userData.ship = true));
  return { group, flame };
}
