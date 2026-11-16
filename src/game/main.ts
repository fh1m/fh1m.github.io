/**
 * The world: a tiny planet that stays still in space, and one machine that changes form for each medium,
 * flown by Bunnu, my cat.
 * Motion is timed and eased (cinematic flights, squash-and-stretch transformations), light sources glow,
 * and the music changes with where you are.
 */
import * as THREE from "three";
import { R, WATER, buildPlanet, zoneOf, type ZoneId } from "./planet";
import { buildForms, flat, type Form, type Mode } from "./forms";
import { buildProps, stand, STATIONS } from "./props";
import { buildLandmarks } from "./landmarks";
import { buildBunnu } from "./bunnu";
import { createSound, type Sound } from "./audio";
import { glowSprite } from "./fx";

export interface World {
  go: (z: ZoneId | null) => void; fallIn: () => void; sound: Sound;
  onZone: (cb: (z: ZoneId | null) => void) => void;
  /** An object was chosen (clicked or opened from the keyboard); the camera flies to it. */
  onObject: (cb: (id: string) => void) => void; focus: (id: string) => void;
  /** Mission state for the form on screen: fail, try a wrong fix, fixed, or back to idle. */
  setMode: (m: Mode) => void;
  /** Show the planet as it was in a year (null = now): later things shrink away. */
  setYear: (y: number | null) => void;
  /** The pointer is over an object (id) or nothing (null), at client coordinates x, y. */
  onHover: (cb: (id: string | null, x: number, y: number) => void) => void;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

export function start(canvas: HTMLCanvasElement): World {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene(); scene.background = new THREE.Color("#0b1233");
  const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 3000);

  // Space: two layers of stars (parallax), a distant sun, a moon
  for (const [n, r, size] of [[900, 500, 1.5], [400, 900, 2.6]] as [number, number, number][]) {
    const sp: number[] = []; for (let i = 0; i < n; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(r + Math.random() * 200); sp.push(v.x, v.y, v.z); }
    scene.add(new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(sp, 3)), new THREE.PointsMaterial({ color: "#ffffff", size, sizeAttenuation: true, transparent: true, opacity: 0.85 })));
  }
  const sunFar = new THREE.Group(); sunFar.position.set(-520, 300, -700); sunFar.add(glowSprite("#ffe7a3", 260, 0.75), glowSprite("#fff8e6", 60, 1)); scene.add(sunFar);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(4.2, 24, 16), flat("#f3d36b")); scene.add(moon);
  // Voyager 1, still going: a clickable object far out
  const voyager = new THREE.Group(); voyager.userData.obj = "voyager";
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.18, 24), flat("#e9e6dc")); dish.rotation.x = Math.PI / 2; voyager.add(dish);
  const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.5, 10), flat("#d9a441")); bus.rotation.x = Math.PI / 2; bus.position.z = 0.4; voyager.add(bus);
  for (const [x, y, len] of [[1, 0, 5], [-1, -0.6, 3], [0, 1, 3]] as [number, number, number][]) { const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, len, 5), flat("#c9c3b5")); boom.position.set(x * len / 2, y * len / 2, 0.4); boom.rotation.z = Math.atan2(-x, y); voyager.add(boom); }
  scene.add(voyager);

  const sun = new THREE.DirectionalLight("#fff1d6", 2.2); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004; Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 200 });
  scene.add(sun, sun.target, new THREE.HemisphereLight("#bcd6ff", "#5b3d9c", 1.35));
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(R + 3.4, 64, 48), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
    vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }",
    fragmentShader: "varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1. - abs(dot(vN, vV)), 2.4); gl_FragColor = vec4(0.47, 0.68, 1.0, f * 0.6); }",
  })));

  const planet = buildPlanet(); scene.add(planet.group);
  planet.group.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).receiveShadow = true; });
  const props = buildProps(); scene.add(props.group);
  const marks = buildLandmarks(); scene.add(marks.group);
  const bunnu = buildBunnu();
  const forms = buildForms();
  for (const f of Object.values(forms)) {
    f.group.visible = false; scene.add(f.group);
    f.beacon.add(glowSprite("#ff4f8b", 0.9, 0.8)); f.eye.add(glowSprite("#7ff3ff", 0.6, 0.7));
  }
  const sound = createSound();

  // sparks for the transformation
  const sparks = Array.from({ length: 28 }, () => { const s = glowSprite("#ff9ec2", 0.35, 0); scene.add(s); return { s, v: new THREE.Vector3(), life: 0 }; });
  const burst = (at: THREE.Vector3, up: THREE.Vector3) => sparks.forEach((p) => { p.s.position.copy(at).addScaledVector(up, 1); p.v.randomDirection().multiplyScalar(3 + Math.random() * 4).addScaledVector(up, 3); p.life = 1; });

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  // Camera: a state (dir from the look point, distance, look point) and timed, eased flights between states
  const OVERVIEW = 70;
  const cur = { dir: new THREE.Vector3(0.3, 0.45, 1).normalize(), dist: 1400, look: new THREE.Vector3() };
  let flight: { from: typeof cur; to: typeof cur; t: number; dur: number } | null = null;
  const fly = (to: typeof cur, dur = 2.0) => { flight = { from: { dir: cur.dir.clone(), dist: cur.dist, look: cur.look.clone() }, to, t: 0, dur: reduce ? 0.01 : dur }; };
  let zone: ZoneId | null = null, form: Form | null = null, swap: { from: Form; to: Form; t: number } | null = null, idle = 0;
  const listeners: ((z: ZoneId | null) => void)[] = [];
  const objListeners: ((id: string) => void)[] = [], hoverListeners: ((id: string | null, x: number, y: number) => void)[] = [];
  const objects = new Map<string, THREE.Object3D>();
  for (const g of [props.group, marks.group]) g.traverse((o) => { if (o.userData.obj && !objects.has(o.userData.obj)) objects.set(o.userData.obj, o); });
  objects.set("voyager", voyager);
  const pickables = [props.group, marks.group, voyager];
  // the time machine: everything with a year grows in or shrinks away
  const dated: { o: THREE.Object3D; year: number; k: number }[] = [];
  for (const g of [props.group, marks.group]) g.traverse((o) => { if (typeof o.userData.year === "number") dated.push({ o, year: o.userData.year, k: 1 }); });
  let year: number | null = null;
  const objectAt = (x: number, y: number) => {
    ndc.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1); ray.setFromCamera(ndc, cam);
    for (const h of ray.intersectObjects(pickables, true)) { let o: THREE.Object3D | null = h.object; while (o && !o.userData.obj) o = o.parent; if (o) return o.userData.obj as string; }
    return null;
  };
  function focus(id: string) {
    const o = objects.get(id); if (!o) return;
    const p = o.getWorldPosition(new THREE.Vector3()); const n = p.clone().normalize();
    const side = new THREE.Vector3().crossVectors(n, Math.abs(n.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)).normalize();
    const far = id === "voyager";
    const sphere = new THREE.Box3().setFromObject(o).getBoundingSphere(new THREE.Sphere());
    const dist = far ? 16 : THREE.MathUtils.clamp(sphere.radius * 3.4, 5, 22); // frame what the thing actually is
    const look = far ? p : sphere.center;
    fly({ dir: far ? n.clone().addScaledVector(side, 0.8).normalize() : n.clone().multiplyScalar(0.8).addScaledVector(side, 0.6).normalize(), dist, look }, 1.8);
    sound.whoosh(); sound.pluck(784); idle = 0;
    objListeners.forEach((f) => f(id));
  }

  function seatBunnu(f: Form) { f.seat.add(bunnu.root); bunnu.root.scale.setScalar(0.85 * f.seatScale); bunnu.root.position.set(0, 0, 0); }

  function framing(z: ZoneId) {
    const d = STATIONS[z].dir();
    const side = new THREE.Vector3().crossVectors(d, Math.abs(d.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)).normalize();
    return { dir: d.clone().multiplyScalar(0.82).addScaledVector(side, 0.58).normalize(), dist: 12.5, look: d.clone().multiplyScalar(R + 1.3) };
  }
  function go(z: ZoneId | null) {
    if (z === zone) { if (z) fly(framing(z)); else fly({ dir: cur.dir.clone().setY(0.4).normalize(), dist: OVERVIEW, look: new THREE.Vector3() }); listeners.forEach((f) => f(z)); return; }
    zone = z; idle = 0; sound.whoosh(); sound.scene(z ?? "space");
    if (!z) fly({ dir: cur.dir.clone().setY(0.4).normalize(), dist: OVERVIEW, look: new THREE.Vector3() });
    else {
      fly(framing(z));
      const next = forms[z], st = STATIONS[z];
      stand(next.group, st.dir(), st.lift, st.heading, st.onWater ? WATER : undefined);
      if (form && form !== next) swap = { from: form, to: next, t: 0 };
      else { form = next; form.group.visible = true; seatBunnu(next); swap = { from: next, to: next, t: 0.5 }; }
    }
    listeners.forEach((f) => f(z));
  }

  // Drag to look around; click a zone to go there
  let drag: { x: number; y: number } | null = null, moved = 0;
  canvas.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY }; moved = 0; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", (e) => {
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y; moved += Math.abs(dx) + Math.abs(dy); drag = { x: e.clientX, y: e.clientY };
      if (flight) return;
      const up = zone ? cur.look.clone().normalize() : new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(up, cur.dir).normalize();
      cur.dir.applyAxisAngle(up, -dx * 0.004).applyAxisAngle(right, -dy * 0.004).normalize();
      if (zone && cur.dir.dot(up) < 0.25) cur.dir.addScaledVector(up, 0.25 - cur.dir.dot(up)).normalize(); // never under the ground
      idle = 0; return;
    }
    const id = objectAt(e.clientX, e.clientY);
    hoverListeners.forEach((f) => f(id, e.clientX, e.clientY));
    ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, cam);
    canvas.style.cursor = id || (!zone && ray.intersectObject(planet.group, true).length) ? "pointer" : "grab";
  });
  canvas.addEventListener("pointerup", () => { drag = null; });
  canvas.addEventListener("pointerleave", () => hoverListeners.forEach((f) => f(null, 0, 0)));
  canvas.addEventListener("click", (e) => {
    if (moved > 6) return;
    const id = objectAt(e.clientX, e.clientY); if (id) { focus(id); return; }
    ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, cam);
    const hit = ray.intersectObject(planet.group, true)[0];
    if (hit) { const z = zoneOf(hit.point.clone().normalize()); if (z.d > 0.45) go(z.id); }
  });

  const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.fov = w < h ? 60 : 42; cam.updateProjectionMatrix(); };
  addEventListener("resize", resize); resize();

  let last = performance.now(), running = true;
  const tmp = new THREE.Vector3();
  function tick(now: number) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;
    idle += dt;

    if (flight) {
      flight.t = Math.min(1, flight.t + dt / flight.dur); const k = easeInOut(flight.t);
      cur.dir.copy(flight.from.dir).lerp(flight.to.dir, k).normalize();
      // distance on a log scale so the long fall from space doesn't rush the last metres
      cur.dist = Math.exp(Math.log(flight.from.dist) + (Math.log(flight.to.dist) - Math.log(flight.from.dist)) * k);
      // the look point travels over the surface (never through the planet), and the camera arcs up mid-flight
      const la = flight.from.look.length(), lb = flight.to.look.length();
      if (la > 1 && lb > 1) {
        const qa = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), flight.from.look.clone().normalize());
        const qb = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), flight.to.look.clone().normalize());
        cur.look.set(0, 1, 0).applyQuaternion(qa.slerp(qb, k)).multiplyScalar(la + (lb - la) * k);
        const span = flight.from.look.clone().normalize().angleTo(flight.to.look.clone().normalize());
        cur.dist += Math.sin(Math.PI * k) * span * 14; // higher arc for longer trips
        cur.dir.lerp(cur.look.clone().normalize(), Math.sin(Math.PI * k) * 0.6).normalize();
      } else cur.look.copy(flight.from.look).lerp(flight.to.look, k);
      if (flight.t >= 1) flight = null;
    } else if (!zone && idle > 3 && !reduce) cur.dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), dt * 0.04);

    const up = tmp.set(0, 1, 0).lerp(cur.look.clone().normalize(), Math.min(1, cur.look.length() / (R + 1.3))).normalize();
    cam.position.copy(cur.look).addScaledVector(cur.dir, cur.dist); cam.up.copy(up); cam.lookAt(cur.look);
    sun.position.copy(cam.position).add(new THREE.Vector3(30, 55, 25)); sun.target.position.copy(cur.look);
    moon.position.set(Math.cos(t * 0.015) * 62, 20, Math.sin(t * 0.015) * 62);
    voyager.position.set(Math.cos(-t * 0.03 + 2) * 46, -14 + Math.sin(t * 0.05) * 3, Math.sin(-t * 0.03 + 2) * 46); voyager.lookAt(0, 0, 0);

    // the transformation: squash, spin away, sparks, pop in with an overshoot
    if (swap) {
      swap.t = Math.min(1, swap.t + dt / 1.1);
      const { from, to } = swap;
      if (swap.t < 0.5) {
        const k = swap.t / 0.5; from.group.scale.set(1 + k * 0.35, Math.max(0.01, 1 - k), 1 + k * 0.35); from.group.rotateY(dt * 10 * k);
      } else {
        if (from.group.visible && from !== to) { from.group.visible = false; from.group.scale.setScalar(1); burst(to.group.position, to.group.position.clone().normalize()); sound.chime(); }
        if (!to.group.visible || form !== to) { to.group.visible = true; form = to; seatBunnu(to); bunnu.react("happy"); }
        const k = easeOutBack((swap.t - 0.5) / 0.5); to.group.scale.set(Math.max(0.01, k), Math.max(0.01, k * (1 + 0.15 * Math.sin(swap.t * 20) * (1 - swap.t))), Math.max(0.01, k));
      }
      if (swap.t >= 1) { to.group.scale.setScalar(1); swap = null; }
    }
    for (const p of sparks) if (p.life > 0) { p.life -= dt * 1.4; p.s.position.addScaledVector(p.v, dt); p.v.multiplyScalar(0.94); (p.s.material as THREE.SpriteMaterial).opacity = Math.max(0, p.life); }
    if (form) { form.update(t, dt); bunnu.update(t, dt); }
    for (const d of dated) { const want = year === null || d.year <= year ? 1 : 0; if (d.k !== want) { d.k += (want - d.k) * Math.min(1, dt * 6); if (Math.abs(d.k - want) < 0.01) d.k = want; d.o.scale.setScalar(Math.max(0.0001, d.k)); d.o.visible = d.k > 0.01; } }
    marks.update(t);
    for (const f of Object.values(forms)) if (f.group.visible) (f.beacon.material as THREE.MeshBasicMaterial).color.setHex(Math.sin(t * 4) > 0.2 ? 0xff4f8b : 0x5a1d33);
    props.update(t);

    renderer.render(scene, cam);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) { last = performance.now(); requestAnimationFrame(tick); } });

  return {
    go, sound, focus,
    setMode: (m) => {
      form?.setMode(m); bunnu.react(m === "fixed" ? "happy" : m === "idle" ? "calm" : "alarmed");
      if (m === "fixed") sound.chime(); else if (m === "wrong") sound.pluck(220); else if (m === "fail") sound.pluck(330);
    },
    setYear: (y) => { year = y; sound.pluck(y ? 400 + (y - 2020) * 60 : 880); },
    onObject: (cb) => objListeners.push(cb),
    onHover: (cb) => hoverListeners.push(cb),
    fallIn: () => { cur.dist = 1400; idle = 0; fly({ dir: new THREE.Vector3(0.3, 0.45, 1).normalize(), dist: OVERVIEW, look: new THREE.Vector3() }, 4.2); },
    onZone: (cb) => listeners.push(cb),
  };
}
