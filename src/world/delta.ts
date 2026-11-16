/**
 * The delta: the story as a river seen from above, source (far) to mouth (near).
 * Ports are the chapters; they come from the DOM (.ports a), so the 3D and the page
 * can never disagree. Hover lights a port, click opens its panel, drag looks around.
 */
import * as THREE from "three";

const DOMAIN: Record<string, number> = { water: 0x00e1ff, air: 0xff6b2c, ground: 0xffd23f, sight: 0xc6ff3d, time: 0xa98bff, workshop: 0xff2e7e };

function heightAt(x: number, z: number) {
  return Math.sin(x * 0.23) * 0.9 + Math.cos(z * 0.19 + x * 0.07) * 1.1 + Math.sin((x + z) * 0.11) * 0.7;
}

export async function start(canvas: HTMLCanvasElement, bus: EventTarget, _n: number, reduce: boolean) {
  const chips = [...document.querySelectorAll<HTMLAnchorElement>(".ports a")];
  const ports = chips.map((a) => ({
    n: Number(a.dataset.port),
    domain: [...(a.parentElement?.classList ?? [])].find((c) => c.startsWith("d-"))?.slice(2) ?? "workshop",
    bn: a.querySelector(".bn")?.textContent ?? "",
  }));

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  const mobile = matchMedia("(max-width: 900px)").matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.75));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 24, 70);
  const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 200);

  // The river course: source far away (negative z), mouth near the camera.
  const course = new THREE.CatmullRomCurve3([
    [-26, 0, -38], [-18, 0, -30], [-8, 0, -27], [-2, 0, -19], [-10, 0, -11], [-4, 0, -4],
    [6, 0, -6], [12, 0, 1], [6, 0, 7], [12, 0, 13], [22, 0, 16],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, "catmullrom", 0.4);

  // Terrain with contour lines, carved down along the river.
  const SIZE = 110, SEG = mobile ? 140 : 220;
  const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
  geo.rotateX(-Math.PI / 2);
  const samples = course.getSpacedPoints(400);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    let d = Infinity;
    for (const p of samples) { const dx = p.x - x, dz = p.z - z; const dd = dx * dx + dz * dz; if (dd < d) d = dd; }
    d = Math.sqrt(d);
    const carve = Math.min(1, d / 6);
    pos.setY(i, heightAt(x, z) * carve * 1.6 - (1 - carve) * 1.2 + carve * 1.2);
  }
  geo.computeVertexNormals();
  const terrain = new THREE.Mesh(geo, new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { uTime: { value: 0 }, uPink: { value: new THREE.Color(0xff2e7e) }, uCyan: { value: new THREE.Color(0x00e1ff) }, uAmber: { value: new THREE.Color(0xffd23f) } },
    vertexShader: `varying vec3 vP; varying float vD; void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position,1.); vD = -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform float uTime; uniform vec3 uPink, uCyan, uAmber; varying vec3 vP; varying float vD;
      void main(){
        float h = vP.y * 2.2;
        float f = abs(fract(h) - 0.5);
        float w = fwidth(h);
        float line = 1.0 - smoothstep(0.0, w * 1.4, f - (0.5 - w * 0.8));
        float major = 1.0 - smoothstep(0.0, w * 1.6, abs(fract(h / 5.0) - 0.5) - (0.5 - w * 1.2) / 5.0);
        vec3 c = mix(uCyan, uPink, smoothstep(-18.0, 18.0, vP.x + vP.z * 0.4));
        c = mix(c, uAmber, smoothstep(1.5, 3.2, vP.y) * 0.6);
        float fade = smoothstep(68.0, 18.0, vD);
        float a = (line * 0.28 + major * 0.55) * fade;
        gl_FragColor = vec4(c * (0.75 + major * 0.6), a);
      }`,
  }));
  scene.add(terrain);

  // The river ribbon: flowing light from source to mouth.
  const ribbon = new THREE.TubeGeometry(course, 420, 0.42, 6, false);
  ribbon.scale(1, 0.25, 1); ribbon.translate(0, -0.2, 0);
  const riverMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: `uniform float uTime; varying vec2 vUv;
      vec3 pal(float t){ return t < .2 ? mix(vec3(1.,.18,.49), vec3(1.,.42,.17), t/.2) : t < .5 ? mix(vec3(1.,.42,.17), vec3(0.,.88,1.), (t-.2)/.3) : t < .8 ? mix(vec3(0.,.88,1.), vec3(.78,1.,.24), (t-.5)/.3) : mix(vec3(.78,1.,.24), vec3(.66,.55,1.), (t-.8)/.2); }
      void main(){ float s = fract(vUv.x * 60.0 - uTime * 0.35); float glow = .55 + .45 * smoothstep(.0,.15,s) * smoothstep(.6,.15,s); gl_FragColor = vec4(pal(vUv.x) * glow, .95); }`,
  });
  scene.add(new THREE.Mesh(ribbon, riverMat));

  // Particles drifting downstream.
  const NP = mobile ? 260 : 600;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(NP * 3), seed = new Float32Array(NP);
  for (let i = 0; i < NP; i++) seed[i] = Math.random();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.16, color: 0xffffff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(particles);
  const tmp = new THREE.Vector3(), tan = new THREE.Vector3();
  const moveParticles = (t: number) => {
    for (let i = 0; i < NP; i++) {
      const u = (((seed[i] + t * 0.012 * (0.6 + seed[i] * 0.8)) % 1) + 1) % 1; // RAF time can precede t0
      course.getPointAt(u, tmp); course.getTangentAt(u, tan);
      const side = (((i * 7919) % 100) / 100 - 0.5) * 0.8;
      pPos[i * 3] = tmp.x - tan.z * side; pPos[i * 3 + 1] = 0.05 + Math.sin(t * 2 + i) * 0.04; pPos[i * 3 + 2] = tmp.z + tan.x * side;
    }
    pGeo.getAttribute("position").needsUpdate = true;
  };

  // Ports: a pin, a halo, a Bangla label.
  await document.fonts?.load("48px 'Tiro Bangla'").catch(() => undefined);
  const pickables: THREE.Object3D[] = [];
  const portObjs = ports.map((p, i) => {
    const u = ports.length > 1 ? i / (ports.length - 1) : 0;
    const at = course.getPointAt(u);
    const col = DOMAIN[p.domain] ?? 0xff2e7e;
    const g = new THREE.Group();
    g.position.set(at.x, 0, at.z);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.4, 6), new THREE.MeshBasicMaterial({ color: col }));
    stem.position.y = 1.2; g.add(stem);
    const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), new THREE.MeshBasicMaterial({ color: col }));
    head.position.y = 2.6; g.add(head);
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.7, 0.86, 40), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
    halo.rotation.x = -Math.PI / 2; halo.position.y = 0.06; g.add(halo);
    const c = document.createElement("canvas"); c.width = 256; c.height = 96;
    const x = c.getContext("2d")!;
    x.font = "52px 'Tiro Bangla', serif"; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillStyle = "#" + col.toString(16).padStart(6, "0"); x.fillText(p.bn, 128, 52);
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
    label.scale.set(2.6, 0.98, 1); label.position.y = 3.65; g.add(label);
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 4.6, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.y = 2.2; hit.userData.port = p.n; g.add(hit); pickables.push(hit);
    scene.add(g);
    return { g, head, halo, n: p.n };
  });

  // Camera: an oblique look down the river; drag to swing.
  let yaw = -0.5, pitch = 0.78, dist = 54, targetYaw = yaw, targetPitch = pitch;
  const look = new THREE.Vector3(1, 0, -6);
  const place = () => {
    cam.position.set(look.x + Math.sin(yaw) * Math.cos(pitch) * dist, look.y + Math.sin(pitch) * dist, look.z + Math.cos(yaw) * Math.cos(pitch) * dist);
    cam.lookAt(look);
  };
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    cam.aspect = r.width / Math.max(1, r.height);
    if (r.width > 900) cam.setViewOffset(r.width, r.height, -r.width * 0.12, 0, r.width, r.height); else cam.clearViewOffset();
    cam.updateProjectionMatrix();
  };
  new ResizeObserver(() => { resize(); kick(); }).observe(canvas);
  resize(); place();

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let hovered = -1, highlighted = -1, dragging = false, moved = 0, lastX = 0, lastY = 0;
  const pick = (ev: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const hit = ray.intersectObjects(pickables, false)[0];
    return hit ? (hit.object.userData.port as number) : -1;
  };
  canvas.addEventListener("pointerdown", (e) => { dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic or stale pointer */ } canvas.style.cursor = "grabbing"; });
  canvas.addEventListener("pointerup", (e) => {
    dragging = false; canvas.style.cursor = "grab";
    if (moved < 6) { const n = pick(e); if (n >= 0) bus.dispatchEvent(new CustomEvent("port", { detail: n })); }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (dragging) {
      moved += Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY);
      targetYaw -= (e.clientX - lastX) * 0.004; targetPitch = Math.min(1.25, Math.max(0.28, targetPitch + (e.clientY - lastY) * 0.003));
      lastX = e.clientX; lastY = e.clientY; kick(); return;
    }
    const n = pick(e);
    if (n !== hovered) { hovered = n; canvas.style.cursor = n >= 0 ? "pointer" : "grab"; bus.dispatchEvent(new CustomEvent("hover-port", { detail: n })); kick(); }
  });
  canvas.addEventListener("pointerleave", () => { if (hovered !== -1) { hovered = -1; bus.dispatchEvent(new CustomEvent("hover-port", { detail: -1 })); kick(); } });
  bus.addEventListener("highlight-port", (e) => { highlighted = (e as CustomEvent<number>).detail; kick(); });

  // Render only while the hero is on screen.
  let visible = true, running = false;
  const t0 = performance.now();
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }, { threshold: 0 }).observe(canvas);
  const frame = (now: number) => {
    const t = Math.max(0, (now - t0) / 1000);
    yaw += (targetYaw - yaw) * 0.08; pitch += (targetPitch - pitch) * 0.08;
    if (!dragging && !reduce && hovered < 0 && highlighted < 0) targetYaw += 0.0006; // hold still while a port is pointed at
    place();
    (terrain.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    riverMat.uniforms.uTime.value = reduce ? 0 : t;
    if (!reduce) moveParticles(t);
    for (const p of portObjs) {
      const on = p.n === hovered || p.n === highlighted;
      const s = on ? 1.5 : 1;
      p.head.scale.lerp(new THREE.Vector3(s, s, s), 0.2);
      p.head.rotation.y = t * 0.8;
      (p.halo.material as THREE.MeshBasicMaterial).opacity = on ? 0.95 : 0.35 + 0.15 * Math.sin(t * 2 + p.n);
      p.halo.scale.setScalar(on ? 1.6 : 1 + 0.08 * Math.sin(t * 2 + p.n));
    }
    renderer.render(scene, cam);
    if (visible && !reduce) requestAnimationFrame(frame); else running = false;
  };
  function kick() { if (running) return; running = true; requestAnimationFrame(frame); }
  if (reduce) moveParticles(0);
  kick();
}
