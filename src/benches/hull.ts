/**
 * The Mongla hull, from its own CAD (hull.mgla, packed by mongla_ws tools/site/pack_hull.py):
 *   'MGLA' | u16 version | u16 indexBytes | u32 verts | u32 tris | f32 centre[3] | f32 scale
 *   [v3+: u16 nParts | f32 dir[3]*nParts] | i16 pos[3]*verts | [v2+: u8 col[3]*verts] | [v3+: u8 part*verts] | idx
 * Positions are normalised int16 inside the bounding sphere. Drag the fader to take it apart.
 */
import * as THREE from "three";
import { slider, readout, emit } from "./ui";

const STOPS = [
  [0, "Assembled: 702.0 × 176.1 × 172.1 mm, 40 bodies."],
  [0.22, "The fairings come off. Red shells, flooded: they shape the flow and hold nothing dry."],
  [0.44, "The pressure can: 3.310 L enclosed, the entire source of buoyancy."],
  [0.66, "Four tunnels and one axial thruster, ⌀84 mm. Five of six degrees of freedom; roll has no actuator."],
  [0.88, "And a handle. A vehicle nobody can carry is a vehicle nobody tests."],
] as const;

function parse(buf: ArrayBuffer) {
  const dv = new DataView(buf);
  if (String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3)) !== "MGLA") throw new Error("not a hull container");
  const version = dv.getUint16(4, true), idxBytes = dv.getUint16(6, true);
  const nv = dv.getUint32(8, true), nt = dv.getUint32(12, true);
  let off = 16 + 12 + 4, dirs = new Float32Array(0), nParts = 0;
  if (version >= 3) { nParts = dv.getUint16(off, true); off += 2; dirs = new Float32Array(buf.slice(off, off + nParts * 12)); off += nParts * 12; }
  const pos = new Int16Array(buf.slice(off, off + nv * 6)); off += nv * 6;
  const col = version >= 2 ? new Uint8Array(buf.slice(off, off + nv * 3)) : null; if (col) off += nv * 3;
  const parts = version >= 3 ? new Uint8Array(buf.slice(off, off + nv)) : null; if (parts) off += nv;
  const idx = idxBytes === 2 ? new Uint16Array(buf.slice(off, off + nt * 6)) : new Uint32Array(buf.slice(off, off + nt * 12));
  return { pos, col, parts, dirs, nv, idx };
}

export function mount(el: HTMLElement, bus: EventTarget) {
  const say = readout(el);
  const holder = document.createElement("div");
  holder.style.cssText = "position:relative;aspect-ratio:16/10;border:1px solid var(--line);border-radius:3px;overflow:hidden;background:#02040a";
  el.prepend(holder);
  const gl2 = (() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; } })();
  if (!gl2) {
    holder.innerHTML = `<img src="/media/mongla-docs/mongla-iso.webp" alt="The Mongla hull CAD" style="width:100%;height:100%;object-fit:cover" />`;
    say("WebGL2 isn't available here, so this is the CAD as a still. The same mesh, rendered at 2800 px.");
    return;
  }
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setClearColor(0x02040a);
  renderer.domElement.setAttribute("role", "img");
  renderer.domElement.setAttribute("aria-label", "The Mongla AUV hull, rendered from its CAD mesh, taking itself apart as the fader moves");
  holder.append(renderer.domElement);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x02040a, 3.2, 6.5);
  const cam = new THREE.PerspectiveCamera(30, 1.6, 0.05, 20);
  cam.position.set(2.6, 0.9, 2.3); cam.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0x9fb4dc, 0x061018, 0.9));
  const key = new THREE.DirectionalLight(0xfff2e0, 2.2); key.position.set(2, 3, 2); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7b9ce0, 1.4); rim.position.set(-3, -1, -2); scene.add(rim);

  let mesh: THREE.Mesh | null = null, base: Float32Array, parts: Uint8Array | null = null, dirs: Float32Array;
  const pivot = new THREE.Group(); // spins about world Y; the mesh inside keeps its CAD orientation
  scene.add(pivot);
  let explode = 0, yaw = 0, raf = 0, visible = false;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const size = () => {
    const w = holder.clientWidth, h = holder.clientHeight;
    renderer.setSize(w, h, false); renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%";
    cam.aspect = w / h; cam.updateProjectionMatrix();
  };
  const render = () => { pivot.rotation.y = yaw; renderer.render(scene, cam); };
  const apply = () => {
    if (!mesh) return;
    const attr = mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < arr.length / 3; i++) {
      const p = parts ? parts[i] : 0;
      arr[i * 3] = base[i * 3] + dirs[p * 3] * explode;
      arr[i * 3 + 1] = base[i * 3 + 1] + dirs[p * 3 + 1] * explode;
      arr[i * 3 + 2] = base[i * 3 + 2] + dirs[p * 3 + 2] * explode;
    }
    attr.needsUpdate = true;
    const stop = [...STOPS].reverse().find(([t]) => explode >= t - 1e-6) ?? STOPS[0];
    say(`${Math.round(explode * 100)} % apart · ${stop[1]}`);
    emit(bus, "hull", explode);
    render();
  };

  fetch("/media/hull.mgla").then((r) => { if (!r.ok) throw new Error(`hull ${r.status}`); return r.arrayBuffer(); }).then((buf) => {
    const m = parse(buf);
    base = new Float32Array(m.nv * 3);
    for (let i = 0; i < m.nv * 3; i++) base[i] = m.pos[i] / 32767;
    parts = m.parts; dirs = m.dirs.length ? m.dirs : new Float32Array(3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(base), 3));
    if (m.col) geo.setAttribute("color", new THREE.BufferAttribute(m.col, 3, true));
    geo.setIndex(new THREE.BufferAttribute(m.idx, 1));
    mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: !!m.col, color: m.col ? 0xffffff : 0xc81e14, flatShading: true, roughness: 0.55, metalness: 0.15, side: THREE.DoubleSide }));
    mesh.rotation.x = -Math.PI / 2;
    pivot.add(mesh);
    size(); apply();
    const tick = () => { if (!visible) return; yaw += 0.0035; render(); raf = requestAnimationFrame(tick); };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); } }).observe(holder);
  }).catch((err) => say(`The hull mesh didn't load (${String(err)}). The CAD still is in the photos below.`));

  new ResizeObserver(() => { size(); render(); }).observe(holder);
  slider(el, { label: "take it apart", min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => `${Math.round(v * 100)} %`, id: "hull-x" }, (v) => { explode = v; apply(); });
  const note = document.createElement("p");
  note.className = "bench-note";
  note.innerHTML = 'The CAD itself, packed by <a href="https://github.com/fh1m/mongla_ws">mongla_ws</a>: not a render made for this page. Stops from the Mongla teardown.';
  el.append(note);
}
