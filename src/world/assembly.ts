/**
 * View 01: the machines laid out like a parts sheet, in blueprint linework.
 * Each part is a simple, honest model of the real thing (the Mongla hull is its actual CAD mesh).
 * Numbered balloons are real <button>s positioned over the canvas, so the view is keyboard-usable
 * and the 3D is never the only way in. Hover/select lights a part in red.
 */
import * as THREE from "three";

const BLUE = 0x3b6fe0, DIM = 0x2a3d66, RED = 0xe5322d, FILL = 0x040a18;

type Part = { n: number; group: THREE.Group; anchor: THREE.Vector3; lines: THREE.LineBasicMaterial[] };

function lineMesh(geo: THREE.BufferGeometry, mats: THREE.LineBasicMaterial[], threshold = 20) {
  const g = new THREE.Group();
  const fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: FILL, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
  const m = new THREE.LineBasicMaterial({ color: BLUE });
  mats.push(m);
  g.add(fill, new THREE.LineSegments(new THREE.EdgesGeometry(geo, threshold), m));
  return g;
}
const at = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number, r: [number, number, number] = [0, 0, 0]) => { o.position.set(x, y, z); o.rotation.set(...r); return o; };

/** The hull container (see benches/hull.ts for the format). Positions only; edges at a crease angle. */
async function hullGeometry(): Promise<THREE.BufferGeometry | null> {
  try {
    const buf = await (await fetch("/media/hull.mgla")).arrayBuffer();
    const dv = new DataView(buf);
    const version = dv.getUint16(4, true), idxBytes = dv.getUint16(6, true), nv = dv.getUint32(8, true), nt = dv.getUint32(12, true);
    let off = 32;
    if (version >= 3) { const np = dv.getUint16(off, true); off += 2 + np * 12; }
    const pos = new Int16Array(buf.slice(off, off + nv * 6)); off += nv * 6;
    if (version >= 2) off += nv * 3;
    if (version >= 3) off += nv;
    const idx = idxBytes === 2 ? new Uint16Array(buf.slice(off, off + nt * 6)) : new Uint32Array(buf.slice(off, off + nt * 12));
    const p = new Float32Array(nv * 3); for (let i = 0; i < nv * 3; i++) p[i] = pos[i] / 32767;
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(p, 3)); g.setIndex(new THREE.BufferAttribute(idx, 1));
    return g;
  } catch { return null; }
}

/** One model per sheet, in sheet order. Units are arbitrary; each fits in ~2.4. */
async function buildModels(): Promise<((mats: THREE.LineBasicMaterial[]) => THREE.Group)[]> {
  const hull = await hullGeometry();
  return [
    // 00 source: a laptop
    (m) => { const g = new THREE.Group(); g.add(at(lineMesh(new THREE.BoxGeometry(2.2, 0.08, 1.5), m), 0, 0.04, 0)); g.add(at(lineMesh(new THREE.BoxGeometry(2.2, 1.4, 0.06), m), 0, 0.72, -0.78, [-0.25, 0, 0])); return g; },
    // 01 sky: a rocket on a gimbal stand
    (m) => { const g = new THREE.Group(); g.add(at(lineMesh(new THREE.CylinderGeometry(0.22, 0.22, 2.2, 10), m), 0, 1.4, 0)); g.add(at(lineMesh(new THREE.ConeGeometry(0.22, 0.6, 10), m), 0, 2.8, 0)); for (let k = 0; k < 4; k++) g.add(at(lineMesh(new THREE.BoxGeometry(0.02, 0.5, 0.4), m), Math.cos(k * Math.PI / 2) * 0.3, 0.55, Math.sin(k * Math.PI / 2) * 0.3, [0, -k * Math.PI / 2, 0])); g.add(at(lineMesh(new THREE.CylinderGeometry(0.7, 0.8, 0.15, 8), m), 0, 0.08, 0)); return g; },
    // 02 water: a camera looking at a colour card
    (m) => { const g = new THREE.Group(); g.add(at(lineMesh(new THREE.BoxGeometry(0.6, 0.45, 0.45), m), -0.9, 0.5, 0)); g.add(at(lineMesh(new THREE.CylinderGeometry(0.16, 0.2, 0.3, 12), m), -0.45, 0.5, 0, [0, 0, Math.PI / 2])); g.add(at(lineMesh(new THREE.BoxGeometry(0.06, 1.1, 1.4), m), 1.0, 0.6, 0)); g.add(at(lineMesh(new THREE.BoxGeometry(0.03, 0.5, 0.5), m), 0.96, 0.6, 0.2)); return g; },
    // 03 cat: E-Bhapa
    (m) => { const g = new THREE.Group(); g.add(at(lineMesh(new THREE.BoxGeometry(1.5, 0.3, 1.0), m), 0, 0.45, 0)); for (const [x, z] of [[-0.5, 0.58], [0.5, 0.58], [-0.5, -0.58], [0.5, -0.58]]) g.add(at(lineMesh(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 12), m), x, 0.28, z, [Math.PI / 2, 0, 0])); g.add(at(lineMesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), m), 0.5, 0.85, 0)); for (const z of [-0.15, 0.15]) g.add(at(lineMesh(new THREE.CylinderGeometry(0.11, 0.11, 0.12, 12), m), 0.58, 1.12, z, [0, 0, Math.PI / 2])); return g; },
    // 04 ground: rover with a two-link arm
    (m) => { const g = new THREE.Group(); g.add(at(lineMesh(new THREE.BoxGeometry(1.7, 0.35, 1.1), m), -0.2, 0.55, 0)); for (const [x, z] of [[-0.8, 0.65], [0.4, 0.65], [-0.8, -0.65], [0.4, -0.65]]) g.add(at(lineMesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 10), m), x, 0.3, z, [Math.PI / 2, 0, 0])); g.add(at(lineMesh(new THREE.BoxGeometry(1.1, 0.1, 0.1), m), 0.75, 1.05, 0, [0, 0, 0.5])); g.add(at(lineMesh(new THREE.BoxGeometry(0.8, 0.08, 0.08), m), 1.45, 1.15, 0, [0, 0, -0.7])); return g; },
    // 05 current: a frame AUV (the Duburi shape: frame, can, thrusters)
    (m) => { const g = new THREE.Group(); g.add(at(lineMesh(new THREE.BoxGeometry(1.9, 0.9, 1.3), m, 1), 0, 0.75, 0)); g.add(at(lineMesh(new THREE.CylinderGeometry(0.32, 0.32, 1.5, 12), m), 0, 0.8, 0, [0, 0, Math.PI / 2])); for (const [x, z] of [[-0.95, 0.65], [0.95, 0.65], [-0.95, -0.65], [0.95, -0.65]]) g.add(at(lineMesh(new THREE.CylinderGeometry(0.15, 0.15, 0.25, 10), m), x, 1.25, z)); return g; },
    // 06 mongla: the real hull mesh
    (m) => { const g = new THREE.Group(); if (hull) { const h = lineMesh(hull, m, 32); h.scale.setScalar(1.35); h.rotation.x = -Math.PI / 2; h.position.y = 0.55; g.add(h); } else g.add(at(lineMesh(new THREE.CapsuleGeometry(0.4, 1.6, 4, 12), m), 0, 0.6, 0, [0, 0, Math.PI / 2])); return g; },
    // 07 dristy: the K210 camera module
    (m) => { const g = new THREE.Group(); g.add(at(lineMesh(new THREE.BoxGeometry(1.3, 0.12, 1.0), m), 0, 0.4, 0)); g.add(at(lineMesh(new THREE.BoxGeometry(0.9, 0.06, 0.6), m), 0, 0.5, -0.1)); g.add(at(lineMesh(new THREE.CylinderGeometry(0.22, 0.26, 0.35, 14), m), 0.3, 0.65, 0.25)); return g; },
    // 08 rupsha: an Ackermann car
    (m) => { const g = new THREE.Group(); g.add(at(lineMesh(new THREE.BoxGeometry(1.9, 0.18, 0.9), m), 0, 0.42, 0)); for (const [x, z, s] of [[-0.7, 0.55, 0], [-0.7, -0.55, 0], [0.7, 0.55, 0.3], [0.7, -0.55, 0.3]]) g.add(at(lineMesh(new THREE.CylinderGeometry(0.26, 0.26, 0.18, 12), m), x, 0.26, z, [Math.PI / 2, s, 0])); g.add(at(lineMesh(new THREE.BoxGeometry(0.4, 0.3, 0.3), m), 0.6, 0.66, 0)); return g; },
    // 09 den: two monitors and a keyboard
    (m) => { const g = new THREE.Group(); g.add(at(lineMesh(new THREE.BoxGeometry(1.4, 0.85, 0.05), m), -0.55, 1.1, -0.2, [0, 0.25, 0])); g.add(at(lineMesh(new THREE.BoxGeometry(1.4, 0.85, 0.05), m), 0.75, 1.1, -0.2, [0, -0.25, 0])); g.add(at(lineMesh(new THREE.BoxGeometry(1.2, 0.05, 0.4), m), 0.1, 0.03, 0.55)); for (const x of [-0.55, 0.75]) g.add(at(lineMesh(new THREE.BoxGeometry(0.06, 0.65, 0.06), m), x, 0.35, -0.25)); return g; },
    // 10 mohona: a bar chart (the last year, built from the page's own data attribute)
    (m) => { const g = new THREE.Group(); const raw = (document.getElementById("assembly")?.dataset.weeks ?? "").split(",").map(Number).filter((v) => v >= 0); const mx = Math.max(1, ...raw); raw.forEach((v, i) => { const h = 0.05 + (v / mx) * 1.8; g.add(at(lineMesh(new THREE.BoxGeometry(0.09, h, 0.3), m), -1.1 + i * (2.2 / raw.length), h / 2, 0)); }); return g; },
  ];
}

export async function start(canvas: HTMLCanvasElement, balloons: HTMLElement, bus: EventTarget, reduce: boolean) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-10, 10, 6, -6, -100, 100);

  // A ground grid like a cutting mat, with a border.
  const grid = new THREE.GridHelper(26, 26, DIM, 0x101b36); scene.add(grid);

  const makers = await buildModels();
  const COLS = 6, DX = 4.2, DZ = 4.6;
  const parts: Part[] = makers.map((make, i) => {
    const mats: THREE.LineBasicMaterial[] = [];
    const group = make(mats);
    const col = i % COLS, row = Math.floor(i / COLS);
    group.position.set((col - (COLS - 1) / 2) * DX + (row ? DX / 2 : 0), 0, (row - 0.5) * DZ);
    const box = new THREE.Box3().setFromObject(group);
    group.userData.part = i;
    group.traverse((o) => { o.userData.part = i; });
    scene.add(group);
    return { n: i, group, anchor: new THREE.Vector3((box.min.x + box.max.x) / 2, box.max.y + 0.5, (box.min.z + box.max.z) / 2), lines: mats };
  });

  // Balloons: numbered buttons, positioned each frame.
  const btns = parts.map((p) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "balloon"; b.textContent = String(p.n).padStart(2, "0");
    b.setAttribute("aria-label", `Part ${p.n}`);
    b.addEventListener("click", () => bus.dispatchEvent(new CustomEvent("part", { detail: p.n })));
    b.addEventListener("mouseenter", () => setLit(p.n)); b.addEventListener("mouseleave", () => setLit(-1));
    balloons.append(b);
    return b;
  });

  let yaw = Math.PI / 4, pitch = Math.atan(1 / Math.SQRT2), target = yaw, lit = -1;
  const resize = () => {
    const r = canvas.getBoundingClientRect(); renderer.setSize(r.width, r.height, false);
    const aspect = r.width / Math.max(1, r.height), half = 11.5;
    cam.left = -half; cam.right = half; cam.top = half / aspect; cam.bottom = -half / aspect; cam.updateProjectionMatrix();
  };
  const place = () => { const d = 30; cam.position.set(Math.sin(yaw) * Math.cos(pitch) * d, Math.sin(pitch) * d, Math.cos(yaw) * Math.cos(pitch) * d); cam.lookAt(0, 0.6, 0); };
  function setLit(n: number) {
    lit = n;
    for (const p of parts) for (const m of p.lines) m.color.setHex(p.n === n ? RED : BLUE);
    btns.forEach((b, i) => b.classList.toggle("lit", i === n));
    bus.dispatchEvent(new CustomEvent("part-lit", { detail: n }));
    kick();
  }
  bus.addEventListener("light", (e) => setLit((e as CustomEvent<number>).detail));

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const pick = (ev: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const hit = ray.intersectObjects(parts.map((p) => p.group), true).find((h) => (h.object as THREE.Mesh).isMesh);
    return hit ? (hit.object.userData.part as number) : -1;
  };
  let dragging = false, moved = 0, lastX = 0;
  canvas.addEventListener("pointerdown", (e) => { dragging = true; moved = 0; lastX = e.clientX; try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic */ } });
  canvas.addEventListener("pointerup", (e) => { dragging = false; if (moved < 6) { const n = pick(e); if (n >= 0) bus.dispatchEvent(new CustomEvent("part", { detail: n })); } });
  canvas.addEventListener("pointermove", (e) => {
    if (dragging) { moved += Math.abs(e.clientX - lastX); target -= (e.clientX - lastX) * 0.006; lastX = e.clientX; kick(); return; }
    const n = pick(e); if (n !== lit) setLit(n); canvas.style.cursor = n >= 0 ? "pointer" : "grab";
  });
  canvas.addEventListener("pointerleave", () => { if (lit !== -1) setLit(-1); });

  const v = new THREE.Vector3();
  let running = false, visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }).observe(canvas);
  new ResizeObserver(() => { resize(); kick(); }).observe(canvas);
  function frame() {
    yaw += (target - yaw) * 0.15;
    place();
    renderer.render(scene, cam);
    const r = canvas.getBoundingClientRect();
    // anchors are world-space (Box3.setFromObject)
    parts.forEach((p, i) => { v.copy(p.anchor).project(cam); btns[i].style.transform = `translate(${((v.x + 1) / 2) * r.width}px, ${((1 - v.y) / 2) * r.height}px) translate(-50%, -50%)`; });
    if (Math.abs(target - yaw) > 0.0005 && visible) requestAnimationFrame(frame); else running = false;
  }
  function kick() { if (running) return; running = true; requestAnimationFrame(frame); }
  resize(); place(); kick();
  void reduce;
}
