/** Small shared visual effects. */
import * as THREE from "three";

let glowTex: THREE.CanvasTexture | null = null;
/** A soft radial glow, added on top of light sources. */
export function glowSprite(color: string, size: number, opacity = 0.9) {
  if (!glowTex) {
    const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64); grad.addColorStop(0, "rgba(255,255,255,1)"); grad.addColorStop(0.25, "rgba(255,255,255,.55)"); grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128); glowTex = new THREE.CanvasTexture(c);
  }
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
  s.scale.setScalar(size); return s;
}

