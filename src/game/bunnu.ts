/**
 * Bunnu: my cat. My mother named her; she arrived around 2021, during Covid, and has been in the room
 * for most of what's on this planet. Mostly white, a blackish patch on one corner of her head, and a
 * tail that ends blackish with a bit of orange. She pilots every machine, in her own space helmet.
 */
import * as THREE from "three";
import { flat } from "./forms";

const WHITE = "#f7f4ef", PATCH = "#2a2730", ORANGE = "#e08a3c", PINK = "#f2a3b3";

export interface Bunnu { root: THREE.Group; update: (t: number, dt: number) => void; react: (mood: "happy" | "alarmed" | "calm") => void }

export function buildBunnu(): Bunnu {
  const root = new THREE.Group();
  const cat = new THREE.Group(); root.add(cat);

  // body: a sitting loaf
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.26, 18, 14), flat(WHITE)); body.scale.set(1, 0.85, 1.15); body.position.set(0, 0.22, 0.05); cat.add(body);
  for (const x of [-0.1, 0.1]) { const paw = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), flat(WHITE)); paw.scale.set(1, 0.6, 1.3); paw.position.set(x, 0.04, -0.2); cat.add(paw); }

  // head
  const head = new THREE.Group(); head.position.set(0, 0.52, -0.08); cat.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 16), flat(WHITE)); skull.scale.set(1.12, 0.95, 1); head.add(skull);
  // the patch on one corner of her head: a dark cap over the left ear and brow
  const patch = new THREE.Mesh(new THREE.SphereGeometry(0.205, 20, 16, Math.PI * 0.05, Math.PI * 0.55, 0, Math.PI * 0.42), flat(PATCH)); patch.scale.set(1.12, 0.95, 1); patch.rotation.y = Math.PI * 0.55; head.add(patch);
  const ear = (x: number, dark: boolean) => {
    const e = new THREE.Group(); e.position.set(x, 0.15, 0); e.rotation.z = -x * 2.2; head.add(e);
    e.add(new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.16, 4), flat(dark ? PATCH : WHITE)));
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 4), flat(PINK)); inner.position.set(0, -0.01, -0.03); e.add(inner);
    return e;
  };
  const earL = ear(0.12, true), earR = ear(-0.12, false);
  const eyes = [-0.075, 0.075].map((x) => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: "#2b2a1f" })); e.position.set(x, 0.02, -0.18); e.scale.set(1, 1.25, 0.6); head.add(e); return e; });
  for (const x of [-0.065, 0.085]) { const glint = new THREE.Mesh(new THREE.SphereGeometry(0.01, 6, 4), new THREE.MeshBasicMaterial({ color: "#ffffff" })); glint.position.set(x, 0.035, -0.205); head.add(glint); }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), flat(PINK)); nose.position.set(0, -0.04, -0.2); head.add(nose);
  for (const s of [-1, 1]) for (const k of [0, 1]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.16, 3), new THREE.MeshBasicMaterial({ color: "#9a958a" })); w.position.set(s * 0.12, -0.05 + k * 0.025, -0.17); w.rotation.z = Math.PI / 2 + s * (0.12 - k * 0.2); head.add(w); }

  // tail: white, then a band of orange, then a blackish tip
  const tail = new THREE.Group(); tail.position.set(0, 0.12, 0.3); cat.add(tail);
  const seg = (len: number, col: string, r: number) => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 3, 8), flat(col)); m.position.y = len / 2; g.add(m); return g; };
  const t1 = seg(0.16, WHITE, 0.035); t1.rotation.x = 1.2; tail.add(t1);
  const t2 = seg(0.12, WHITE, 0.033); t2.position.y = 0.18; t1.add(t2);
  const t3 = seg(0.06, ORANGE, 0.032); t3.position.y = 0.14; t2.add(t3);
  const t4 = seg(0.08, PATCH, 0.03); t4.position.y = 0.08; t3.add(t4);

  // her helmet
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 18), new THREE.MeshPhongMaterial({ color: "#cfe6ff", transparent: true, opacity: 0.22, shininess: 120, specular: "#ffffff", depthWrite: false }));
  helmet.position.y = 0.36; root.add(helmet);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.04, 8, 28), flat("#ff4f8b")); collar.rotation.x = Math.PI / 2; collar.position.y = 0.04; root.add(collar);

  root.traverse((o) => { if ((o as THREE.Mesh).isMesh && o !== helmet) (o as THREE.Mesh).castShadow = true; });
  root.scale.setScalar(0.85);

  let mood: "happy" | "alarmed" | "calm" = "calm", moodT = 0, blink = 2;
  return {
    root,
    react(m) { mood = m; moodT = 0; },
    update(t, dt) {
      moodT += dt; blink -= dt;
      const look = Math.sin(t * 0.37) * 0.5 + Math.sin(t * 0.11) * 0.3;
      head.rotation.y = mood === "alarmed" ? Math.sin(t * 9) * 0.15 : look * 0.6;
      head.rotation.x = mood === "happy" ? -0.15 + Math.sin(moodT * 10) * 0.05 * Math.max(0, 1 - moodT) : Math.sin(t * 0.5) * 0.06;
      earL.rotation.x = earR.rotation.x = mood === "alarmed" ? 0.5 : Math.sin(t * 2.3) > 0.97 ? -0.25 : 0; // an ear twitch now and then
      t1.rotation.z = Math.sin(t * (mood === "alarmed" ? 6 : 1.6)) * 0.5; t2.rotation.z = Math.sin(t * 1.6 - 0.6) * 0.4; t3.rotation.z = Math.sin(t * 1.6 - 1.2) * 0.3;
      const closed = blink < 0.12; eyes.forEach((e) => (e.scale.y = closed ? 0.15 : mood === "happy" ? 0.7 : 1.25));
      if (blink < 0) blink = 2 + Math.random() * 4;
      if (moodT > 3) mood = "calm";
      cat.position.y = Math.sin(t * 2) * 0.008; // breathing
    },
  };
}
