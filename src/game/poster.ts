/**
 * The planet without WebGL: same interface as the 3D world, so every panel, plate, mission,
 * the time machine and Bunnu work unchanged on top of a still picture of the planet.
 * Used for reduced motion, low-end devices, no WebGL2, or ?poster=1.
 */
import type { World } from "./main";
import type { ZoneId } from "./planet";
import type { Mode } from "./forms";
import { createSound } from "./audio";

export function startPoster(): World {
  const zoneCbs: ((z: ZoneId | null) => void)[] = [], objCbs: ((id: string) => void)[] = [];
  const sound = createSound();
  return {
    sound,
    go: (z) => { sound.scene(z ?? "space"); zoneCbs.forEach((f) => f(z)); },
    fallIn: () => {},
    focus: (id) => objCbs.forEach((f) => f(id)),
    setMode: (_m: Mode) => {},
    setYear: () => {},
    onZone: (cb) => zoneCbs.push(cb),
    onObject: (cb) => objCbs.push(cb),
    onHover: () => {},
  };
}

/** Whether this device should get the poster instead of the 3D planet. */
export function wantsPoster() {
  if (new URLSearchParams(location.search).has("poster")) return true;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const nav = navigator as Navigator & { deviceMemory?: number };
  if ((nav.deviceMemory ?? 8) <= 2 || (navigator.hardwareConcurrency ?? 8) <= 2) return true;
  try { return !document.createElement("canvas").getContext("webgl2"); } catch { return true; }
}
