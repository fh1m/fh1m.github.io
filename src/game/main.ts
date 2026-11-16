/**
 * The world: a tiny planet in space, and Zero driving on it. Step 1: planet, robot, driving, sound.
 */
import * as THREE from "three";
import { R, WATER, ZONES, buildPlanet, groundR, height, zoneOf, type ZoneId } from "./planet";
import { buildZero } from "./zero";
import { createInput } from "./input";
import { createSound } from "./audio";

export function start(canvas: HTMLCanvasElement, ui: { zone: HTMLElement; stick: HTMLElement | null; sound: HTMLButtonElement | null }) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0b1233");
  const cam = new THREE.PerspectiveCamera(55, 1, 0.1, 400);

  // Stars: a few hundred points far away, and a couple of flat planets in the distance
  const sp: number[] = [];
  for (let i = 0; i < 900; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(160 + Math.random() * 60); sp.push(v.x, v.y, v.z); }
  scene.add(new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(sp, 3)), new THREE.PointsMaterial({ color: "#ffffff", size: 0.9, sizeAttenuation: true })));
  const moon = new THREE.Mesh(new THREE.IcosahedronGeometry(7, 2), new THREE.MeshLambertMaterial({ color: "#f3d36b", flatShading: true })); moon.position.set(-90, 50, -120); scene.add(moon);
  const far = new THREE.Mesh(new THREE.IcosahedronGeometry(4, 1), new THREE.MeshLambertMaterial({ color: "#ff6fa5", flatShading: true })); far.position.set(110, -30, -90); scene.add(far);

  // Light: a warm sun and a cool space fill, Kurzgesagt-ish
  const sun = new THREE.DirectionalLight("#fff1d6", 2.4); sun.position.set(40, 60, 30); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 150 });
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight("#b9d4ff", "#4a3a8b", 1.5));
  // a soft atmosphere rim around the planet
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(R + 3.2, 48, 32), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
    vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }",
    fragmentShader: "varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1. - abs(dot(vN, vV)), 2.2); gl_FragColor = vec4(0.45, 0.65, 1.0, f * 0.55); }",
  }));
  scene.add(atmo);

  const planet = buildPlanet(); scene.add(planet.group);
  planet.group.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).receiveShadow = true; });

  const zero = buildZero(); scene.add(zero.root);
  const input = createInput(ui.stick);
  const sound = createSound();
  if (ui.sound) { ui.sound.setAttribute("aria-pressed", String(sound.on())); ui.sound.addEventListener("click", () => ui.sound!.setAttribute("aria-pressed", String(sound.toggle()))); }

  // State on the sphere: orientation q (local up = +Y), speed along local forward (-Z)
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), ZONES[0].c.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.12).normalize());
  let speed = 0;
  const up = new THREE.Vector3(), fwd = new THREE.Vector3(), right = new THREE.Vector3(), dir = new THREE.Vector3(), tmpQ = new THREE.Quaternion();
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  let zoneNow: ZoneId | "" = "";

  const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.fov = w < h ? 70 : 55; cam.updateProjectionMatrix(); };
  addEventListener("resize", resize); resize();

  let last = performance.now(), running = true, first = true;
  function frame(now: number) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;

    up.set(0, 1, 0).applyQuaternion(q); fwd.set(0, 0, -1).applyQuaternion(q); right.set(1, 0, 0).applyQuaternion(q);
    const inWater = groundR(up) <= WATER + 0.06 && R + height(up) < WATER;
    const top = (input.boost ? 13 : 8.5) * (inWater ? 0.6 : 1);
    speed += (input.y * top - speed) * Math.min(1, dt * (input.y ? 2.2 : 1.6));
    const turn = -input.x * 1.9 * Math.min(1, 0.35 + Math.abs(speed) / 6) * (speed < -0.1 ? -1 : 1);
    q.premultiply(tmpQ.setFromAxisAngle(up, turn * dt));
    right.set(1, 0, 0).applyQuaternion(q);
    q.premultiply(tmpQ.setFromAxisAngle(right, -speed * dt / R));
    q.normalize();

    up.set(0, 1, 0).applyQuaternion(q); fwd.set(0, 0, -1).applyQuaternion(q);
    const r = groundR(up);
    zero.root.position.copy(up).multiplyScalar(r + (inWater ? 0.12 * Math.sin(t * 2.2) - 0.25 : 0));
    // tilt to the slope: sample the ground ahead and to the side
    const ahead = dir.copy(up).addScaledVector(fwd, 0.06).normalize(), hA = groundR(ahead) - r;
    const side = new THREE.Vector3().copy(up).addScaledVector(right.set(1, 0, 0).applyQuaternion(q), 0.05).normalize(), hS = groundR(side) - r;
    zero.root.quaternion.copy(q);
    zero.body.rotation.z = THREE.MathUtils.lerp(zero.body.rotation.z, Math.atan2(-hS, 1) * 0.9 + (inWater ? 0.05 * Math.sin(t * 1.7) : 0), 0.15);
    zero.root.rotateX(Math.atan2(hA, 1.2) * 0.9);
    zero.update(dt, speed, t);

    // Chase camera, following the curvature
    const want = camPos.copy(zero.root.position).addScaledVector(up, 7.5).addScaledVector(fwd, -12.5);
    if (first) cam.position.copy(want); else cam.position.lerp(want, 1 - Math.pow(0.002, dt));
    cam.up.copy(up);
    camLook.copy(zero.root.position).addScaledVector(up, 0.6).addScaledVector(fwd, 4.5);
    cam.lookAt(camLook);
    first = false;

    // Light follows so shadows stay crisp around Zero
    // The sun travels with you: always morning wherever Zero is (Kurzgesagt never lets a scene go dark)
    sun.target.position.copy(zero.root.position);
    sun.position.copy(zero.root.position).addScaledVector(up, 45).addScaledVector(right.set(1, 0, 0).applyQuaternion(q), 22).addScaledVector(fwd, 12);

    planet.water.rotation.y += dt * 0.01;
    const z = zoneOf(up); const zid = z.d > 0.55 ? z.id : "";
    if (zid !== zoneNow) { zoneNow = zid; const Z = ZONES.find((x) => x.id === zid); ui.zone.textContent = Z ? Z.name : ""; ui.zone.style.color = Z?.colour ?? ""; ui.zone.classList.toggle("on", !!Z); if (Z) sound.blip(Z.id === "air" ? 990 : Z.id === "water" ? 660 : Z.id === "earth" ? 520 : 780); }
    sound.setSpeed(speed, input.boost);

    renderer.render(scene, cam);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) { last = performance.now(); requestAnimationFrame(frame); } });
  if (reduce) speed = 0;
  return { stop: () => { running = false; renderer.dispose(); } };
}
