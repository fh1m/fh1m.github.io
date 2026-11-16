/**
 * The world behind every page: the Earth in linework, the four elements as its layers and as
 * satellites, and a sky in which every star is a real commit. One instance for the whole visit
 * (the canvas is persisted across navigations); each page declares a state on <body data-world>.
 *   air   = atmosphere and winds     water = oceans, coastlines, rivers
 *   earth = land as a field of dots  fire  = the lights we make: cities, silicon
 * Data: Natural Earth (public domain) in /world/earth.json; commits in /world/commits.json.
 */
import * as THREE from "three";

export type Layer = "all" | "air" | "water" | "earth" | "fire" | "none";
export interface WorldState {
  layer?: Layer; focus?: [number, number]; dist?: number; pins?: string[]; side?: "right" | "center" | "left";
  ui?: boolean; active?: string; from?: number; sats?: boolean;
}
type Place = { name: string; ll: [number, number]; href?: string; gem?: string; lab?: "u" | "d" | "l" };
export const PLACES: Record<string, Place> = {
  dhaka: { name: "Dhaka", ll: [90.41, 23.81], href: "/cv", lab: "u" },
  irvine: { name: "Irvine · RoboSub", ll: [-117.83, 33.68], href: "/projects/duburi" },
  mongla: { name: "Mongla", ll: [89.6, 22.49], href: "/projects/mongla", lab: "d" },
  khulna: { name: "Rupsha", ll: [89.56, 22.82], href: "/projects/rupsha", lab: "l" },
  mymensingh: { name: "Mymensingh", ll: [90.41, 24.75], gem: "J. C. Bose, born here 1858; millimetre waves, 1895" },
  sylhet: { name: "Sylhet", ll: [91.87, 24.9], gem: "Jamilur Reza Choudhury, born here 1943; he chaired the expert panels for the Jamuna and Padma bridges" },
  padma: { name: "Padma Bridge", ll: [90.26, 23.44], gem: "Padma Bridge, opened 2022" },
};
const SATS = [
  { id: "water", name: "Water", tilt: 0.42, r: 1.5, speed: 0.05, phase: 0.2 },
  { id: "earth", name: "Earth", tilt: -0.3, r: 1.62, speed: 0.042, phase: 1.9 },
  { id: "fire", name: "Fire", tilt: 0.16, r: 1.74, speed: 0.036, phase: 3.5 },
  { id: "air", name: "Air", tilt: -0.55, r: 1.86, speed: 0.03, phase: 5.0 },
];

const BLUE = new THREE.Color("#7b9ce0"), RED = new THREE.Color("#d7655d");
const R = 1;
const xyz = (lon: number, lat: number, r = R, out = new THREE.Vector3()) => {
  const la = THREE.MathUtils.degToRad(lat), lo = THREE.MathUtils.degToRad(lon);
  return out.set(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo));
};
const hash01 = (s: string, salt = 0) => { let h = 2166136261 ^ salt; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return ((h >>> 0) % 100000) / 100000; };

type Earth = { coast: number[][]; rivers: number[][]; cities: number[][]; land: number[] };
type Commits = { projects: Record<string, { repo: string; commits: [string, string, string, string, string][] }> };
export interface World { go: (s: WorldState) => void }
let instance: World | null = null;

export async function boot(canvas: HTMLCanvasElement, layer: HTMLElement): Promise<World> {
  if (instance) return instance;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [earth, commits] = await Promise.all([
    fetch("/world/earth.json").then((r) => r.json() as Promise<Earth>),
    fetch("/world/commits.json").then((r) => r.json() as Promise<Commits>).catch(() => null),
  ]);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 1, 0.01, 200);
  const globe = new THREE.Group(); scene.add(globe);
  const v = new THREE.Vector3();

  globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.995, 64, 48), new THREE.MeshBasicMaterial({ color: 0x02050c })));

  const grat: number[] = [];
  for (let lat = -60; lat <= 60; lat += 30) for (let lon = -180; lon < 180; lon += 3) { const a = xyz(lon, lat, R * 1.001), b = xyz(lon + 3, lat, R * 1.001); grat.push(a.x, a.y, a.z, b.x, b.y, b.z); }
  for (let lon = -180; lon < 180; lon += 30) for (let lat = -84; lat < 84; lat += 3) { const a = xyz(lon, lat, R * 1.001), b = xyz(lon, lat + 3, R * 1.001); grat.push(a.x, a.y, a.z, b.x, b.y, b.z); }
  const gratMat = new THREE.LineBasicMaterial({ color: 0x111a2e, transparent: true });
  globe.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(grat, 3)), gratMat));

  const segs = (lines: number[][], r: number) => {
    const out: number[] = []; const a = new THREE.Vector3(), b = new THREE.Vector3();
    for (const l of lines) for (let i = 0; i + 3 < l.length; i += 2) { xyz(l[i], l[i + 1], r, a); xyz(l[i + 2], l[i + 3], r, b); out.push(a.x, a.y, a.z, b.x, b.y, b.z); }
    return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(out, 3));
  };
  const coastMat = new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.55 });
  globe.add(new THREE.LineSegments(segs(earth.coast, R * 1.002), coastMat));
  const riverMat = new THREE.LineBasicMaterial({ color: new THREE.Color("#a9c3ee"), transparent: true, opacity: 0 });
  globe.add(new THREE.LineSegments(segs(earth.rivers, R * 1.003), riverMat));

  const landPos: number[] = [];
  for (let i = 0; i < earth.land.length; i += 2) { xyz(earth.land[i], earth.land[i + 1], R * 1.001, v); landPos.push(v.x, v.y, v.z); }
  const landMat = new THREE.PointsMaterial({ color: BLUE, size: 0.008, sizeAttenuation: true, transparent: true, opacity: 0.35 });
  globe.add(new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(landPos, 3)), landMat));

  // Glow points (cities, stars) share one shader
  const glow = (color: THREE.Color, scale: number) => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uOn: { value: 0 }, uScale: { value: scale }, uTime: { value: 0 }, uColor: { value: color } },
    vertexShader: `attribute float size; attribute vec3 tint; attribute float seed; uniform float uScale; uniform float uTime; varying vec3 vC; varying float vT;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vC = tint; vT = .75 + .25 * sin(uTime * (1. + seed * 2.) + seed * 40.);
      gl_PointSize = size * uScale * (2.2 / -mv.z); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform float uOn; varying vec3 vC; varying float vT; void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, .0, d); a *= a; gl_FragColor = vec4(vC, a * uOn * vT); }`,
  });
  const pointsGeo = (pos: number[], size: number[], tint: number[], seed: number[]) => new THREE.BufferGeometry()
    .setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)).setAttribute("size", new THREE.Float32BufferAttribute(size, 1))
    .setAttribute("tint", new THREE.Float32BufferAttribute(tint, 3)).setAttribute("seed", new THREE.Float32BufferAttribute(seed, 1));

  const cp: number[] = [], cs: number[] = [], ct: number[] = [], cz: number[] = [];
  for (const [lon, lat, pop] of earth.cities) { xyz(lon, lat, R * 1.004, v); cp.push(v.x, v.y, v.z); cs.push(Math.max(2, Math.log10(Math.max(pop, 10)) * 2.4)); ct.push(0.95, 0.55, 0.42); cz.push(hash01(`${lon}${lat}`)); }
  const cityMat = glow(RED, 1);
  globe.add(new THREE.Points(pointsGeo(cp, cs, ct, cz), cityMat));

  const atmoMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
    uniforms: { uOn: { value: 0.35 }, uColor: { value: BLUE } },
    vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform float uOn; uniform vec3 uColor; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1. - abs(dot(vN, vV)), 2.6); gl_FragColor = vec4(uColor, f * uOn); }`,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.06, 64, 48), atmoMat));

  const windPos: number[] = [];
  for (let k = 0; k < 34; k++) {
    const lat0 = -66 + (k * 37) % 132, lon0 = (k * 71) % 360 - 180, len = 40 + (k * 13) % 60;
    for (let s = 0; s < len; s += 2) { const a = xyz(lon0 + s, lat0 + Math.sin(s / 9 + k) * 6, R * 1.025), b = xyz(lon0 + s + 2, lat0 + Math.sin((s + 2) / 9 + k) * 6, R * 1.025); windPos.push(a.x, a.y, a.z, b.x, b.y, b.z); }
  }
  const windMat = new THREE.LineBasicMaterial({ color: new THREE.Color("#a9c3ee"), transparent: true, opacity: 0 });
  const wind = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(windPos, 3)), windMat);
  globe.add(wind);

  // The sky: every star is a commit. Each project is a constellation; time runs along it.
  const sky = new THREE.Group(); scene.add(sky);
  const starRows: { p: string; repo: string; r: [string, string, string, string, string] }[] = [];
  const starMat = glow(BLUE, 34);
  let starPts: THREE.Points | null = null;
  if (commits) {
    const sp: number[] = [], ss: number[] = [], st: number[] = [], sz: number[] = [];
    const keys = Object.keys(commits.projects);
    keys.forEach((k, ki) => {
      const P = commits.projects[k];
      const az0 = Math.PI + (keys.length > 1 ? ki / (keys.length - 1) - 0.5 : 0) * 1.9, el0 = (ki % 2 ? 0.2 : -0.18);
      const n = P.commits.length;
      P.commits.forEach((row, i) => {
        const f = n > 1 ? i / (n - 1) : 0.5;
        const az = az0 + (f - 0.5) * 0.32 + (hash01(row[1]) - 0.5) * 0.14;
        const el = el0 + Math.sin(f * 4 + ki) * 0.1 + (hash01(row[1], 7) - 0.5) * 0.16;
        const rr = 26 + hash01(row[1], 3) * 10;
        sp.push(rr * Math.cos(el) * Math.sin(az), rr * Math.sin(el), rr * Math.cos(el) * Math.cos(az));
        const fix = row[2] === "fix" || /retract|wrong|revert/i.test(row[4]);
        ss.push(fix ? 5.5 : 4 + hash01(row[1], 5) * 3);
        if (fix) st.push(0.86, 0.45, 0.42); else { const w = hash01(row[1], 9); st.push(0.6 + w * 0.35, 0.7 + w * 0.25, 0.95); }
        sz.push(hash01(row[1], 11));
        starRows.push({ p: k, repo: P.repo, r: row });
      });
    });
    // and a little dust that is only dust
    for (let i = 0; i < 900; i++) { const az = hash01(`d${i}`) * Math.PI * 2, el = Math.asin(hash01(`e${i}`) * 2 - 1), rr = 50 + hash01(`r${i}`) * 30; sp.push(rr * Math.cos(el) * Math.sin(az), rr * Math.sin(el), rr * Math.cos(el) * Math.cos(az)); ss.push(2 + hash01(`s${i}`) * 3); st.push(0.4, 0.45, 0.55); sz.push(hash01(`z${i}`)); }
    starPts = new THREE.Points(pointsGeo(sp, ss, st, sz), starMat);
    sky.add(starPts);
  }
  starMat.uniforms.uOn.value = 1;

  // Orbits and satellites (the four elements)
  const orbitMats: THREE.LineBasicMaterial[] = [];
  const orbits = SATS.map((s) => {
    const g = new THREE.Group(); g.rotation.set(s.tilt, 0, s.tilt * 0.6); scene.add(g);
    const pts: number[] = []; for (let i = 0; i <= 128; i++) { const a = (i / 128) * Math.PI * 2; pts.push(Math.cos(a) * s.r, 0, Math.sin(a) * s.r); }
    const m = new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0 }); orbitMats.push(m);
    g.add(new THREE.Line(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)), m));
    const el = document.createElement("a"); el.className = "sat"; el.href = `/${s.id}`; el.dataset.sat = s.id; el.innerHTML = `<i></i><span>${s.name}</span>`; el.tabIndex = -1; layer.append(el);
    return { ...s, g, el, a: s.phase };
  });

  // Pins
  const pins = new Map<string, HTMLAnchorElement>();
  for (const [id, p] of Object.entries(PLACES)) {
    const a = document.createElement("a"); a.className = `${p.gem ? "pin gem" : "pin"}${p.lab ? ` lab-${p.lab}` : ""}`; a.dataset.pin = id; a.tabIndex = -1;
    if (p.href) a.href = p.href; if (p.gem) a.title = p.gem;
    a.innerHTML = `<span>${p.name}</span>${p.gem ? `<em>${p.gem}</em>` : ""}`;
    layer.append(a); pins.set(id, a);
  }
  const tip = document.createElement("div"); tip.className = "startip"; layer.append(tip);

  // State
  const cur = { lon: 90, lat: 18, dist: 6, side: 0, sats: 0 }, tgt = { ...cur };
  const lay = { air: 0.35, water: 0.55, earth: 0.35, fire: 0.5, rivers: 0.3, grat: 1, wind: 0 }, layT = { ...lay };
  let shown: string[] = [], ui = false, active = "", idleSpin = true;
  const LAYERS: Record<Layer, typeof lay> = {
    all: { air: 0.45, water: 0.55, earth: 0.4, fire: 0.6, rivers: 0.35, grat: 1, wind: 0.12 },
    air: { air: 0.7, water: 0.22, earth: 0.12, fire: 0.1, rivers: 0, grat: 0.6, wind: 0.6 },
    water: { air: 0.25, water: 0.95, earth: 0.1, fire: 0.08, rivers: 1, grat: 0.7, wind: 0 },
    earth: { air: 0.2, water: 0.3, earth: 1, fire: 0.08, rivers: 0.25, grat: 0.6, wind: 0 },
    fire: { air: 0.12, water: 0.18, earth: 0.12, fire: 1.2, rivers: 0, grat: 0.45, wind: 0 },
    none: { air: 0, water: 0, earth: 0, fire: 0, rivers: 0, grat: 0, wind: 0 },
  };
  function go(s: WorldState) {
    if (s.focus) { tgt.lon = s.focus[0]; tgt.lat = s.focus[1]; }
    tgt.dist = s.dist ?? (s.focus ? 3.4 : 5.2);
    if (s.from) cur.dist = s.from;
    tgt.side = s.side === "right" ? 0.3 : s.side === "left" ? -0.24 : 0;
    Object.assign(layT, LAYERS[s.layer ?? "all"]);
    shown = s.pins ?? []; ui = !!s.ui; active = s.active ?? ""; tgt.sats = s.sats ?? ui ? 1 : 0;
    idleSpin = !s.focus;
    canvas.classList.toggle("ui", ui);
    pins.forEach((el, id) => { const on = shown.includes(id); el.classList.toggle("on", on); el.tabIndex = on && !el.classList.contains("gem") ? 0 : -1; });
    orbits.forEach((o) => { o.el.classList.toggle("on", tgt.sats > 0); o.el.classList.toggle("active", o.id === active); o.el.tabIndex = tgt.sats > 0 ? 0 : -1; });
    kick();
  }

  // Drag to turn the world; hover stars to read commits
  let drag: { x: number; y: number; lon: number; lat: number } | null = null;
  const ray = new THREE.Raycaster(); ray.params.Points = { threshold: 0.45 };
  const ndc = new THREE.Vector2(); let hoverStar = -1;
  canvas.addEventListener("pointerdown", (e) => { if (!ui) return; drag = { x: e.clientX, y: e.clientY, lon: tgt.lon, lat: tgt.lat }; canvas.setPointerCapture(e.pointerId); idleSpin = false; });
  canvas.addEventListener("pointerup", (e) => {
    if (drag && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 4 && hoverStar >= 0) { const s = starRows[hoverStar]; open(`https://github.com/${s.repo}/commit/${s.r[1]}`, "_blank", "noopener"); }
    drag = null;
  });
  canvas.addEventListener("pointermove", (e) => {
    if (drag) { tgt.lon = drag.lon - (e.clientX - drag.x) * 0.25; tgt.lat = THREE.MathUtils.clamp(drag.lat + (e.clientY - drag.y) * 0.25, -70, 70); kick(); return; }
    if (!ui || !starPts) return;
    ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const hit = ray.intersectObject(starPts).find((h) => (h.index ?? 1e9) < starRows.length);
    hoverStar = hit?.index ?? -1;
    if (hoverStar < 0) { tip.classList.remove("on"); canvas.style.cursor = "grab"; return; }
    const s = starRows[hoverStar]; canvas.style.cursor = "pointer";
    tip.innerHTML = `<b>${s.p}</b> · ${s.r[0]} · <span class="h">${s.r[1]}</span><br>${s.r[4].replace(/</g, "&lt;")}`;
    tip.style.transform = `translate(${Math.min(e.clientX + 14, innerWidth - 380)}px, ${e.clientY + 14}px)`; tip.classList.add("on");
  });
  canvas.addEventListener("pointerleave", () => tip.classList.remove("on"));

  const resize = () => { renderer.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); kick(); };
  addEventListener("resize", resize);

  let running = false, last = performance.now();
  const q = new THREE.Quaternion(), e = new THREE.Euler(), camDir = new THREE.Vector3();
  function place(el: HTMLElement, p: THREE.Vector3) { p.project(cam); el.style.transform = `translate(${((p.x + 1) / 2) * innerWidth}px, ${((1 - p.y) / 2) * innerHeight}px)`; }
  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const k = reduce ? 1 : 1 - Math.pow(cur.dist > 8 ? 0.2 : 0.004, dt);
    if (!reduce && idleSpin && !drag) tgt.lon -= dt * 2.5;
    const dl = ((tgt.lon - cur.lon + 540) % 360) - 180;
    cur.lon += dl * k; cur.lat += (tgt.lat - cur.lat) * k; cur.dist += (tgt.dist - cur.dist) * k; cur.side += (tgt.side - cur.side) * k; cur.sats += (tgt.sats - cur.sats) * k;
    for (const key in lay) { const kk = key as keyof typeof lay; lay[kk] += (layT[kk] - lay[kk]) * k; }
    e.set(THREE.MathUtils.degToRad(cur.lat), THREE.MathUtils.degToRad(-cur.lon), 0, "XYZ"); q.setFromEuler(e); globe.quaternion.copy(q);
    cam.position.set(0, 0, cur.dist * Math.max(1, 0.95 / cam.aspect)); cam.lookAt(0, 0, 0); // portrait screens: pull back so the globe fits the width
    const w = innerWidth; if (w > 900) cam.setViewOffset(w, innerHeight, -w * cur.side, 0, w, innerHeight); else cam.clearViewOffset();
    coastMat.opacity = lay.water; riverMat.opacity = lay.rivers; landMat.opacity = lay.earth; atmoMat.uniforms.uOn.value = lay.air;
    cityMat.uniforms.uOn.value = lay.fire; gratMat.opacity = lay.grat; windMat.opacity = lay.wind;
    cityMat.uniforms.uTime.value = starMat.uniforms.uTime.value = now / 1000;
    wind.rotation.y = now / 7000; sky.rotation.y = Math.sin(now / 90000) * 0.35;
    camDir.copy(cam.position).normalize();
    orbits.forEach((o, i) => {
      if (!reduce) o.a += dt * o.speed * (o.id === active ? 0.4 : 1);
      orbitMats[i].opacity = cur.sats * (o.id === active ? 0.5 : 0.14);
      v.set(Math.cos(o.a) * o.r, 0, Math.sin(o.a) * o.r).applyEuler(o.g.rotation);
      const behind = v.z < -0.2 && Math.hypot(v.x, v.y) < 1.05;
      o.el.classList.toggle("behind", behind);
      o.el.style.opacity = String(cur.sats * (behind ? 0.15 : 1));
      place(o.el, v);
    });
    renderer.render(scene, cam);
    globe.updateMatrixWorld();
    pins.forEach((el, id) => {
      if (!el.classList.contains("on")) return;
      xyz(PLACES[id].ll[0], PLACES[id].ll[1], R * 1.01, v).applyMatrix4(globe.matrixWorld);
      el.classList.toggle("hidden", v.clone().normalize().dot(camDir) < 0.2);
      place(el, v);
    });
    if (!document.hidden) requestAnimationFrame(frame); else running = false;
  }
  function kick() { if (running) return; running = true; last = performance.now(); requestAnimationFrame(frame); }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) kick(); });

  resize();
  instance = { go };
  return instance;
}
