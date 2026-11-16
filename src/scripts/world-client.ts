/**
 * Boots the world once and points it at each page's declared state.
 * With the ClientRouter the canvas is persisted, so the camera travels between pages
 * instead of the world restarting. Without WebGL2 the pages are complete without it.
 */
import type { WorldState } from "../world/globe";

let world: { go: (s: WorldState) => void } | null = null;
let booting: Promise<void> | null = null;

const state = (): WorldState => { try { return JSON.parse(document.body.dataset.world ?? "{}"); } catch { return {}; } };
const gl2 = (() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; } })();

function ensure() {
  if (world || booting || !gl2) return booting;
  const canvas = document.getElementById("world") as HTMLCanvasElement | null;
  const pins = document.querySelector<HTMLElement>(".world .pins");
  if (!canvas || !pins) return null;
  booting = import("../world/globe").then(async (m) => { world = await m.boot(canvas, pins); document.body.classList.add("world-on"); world.go(state()); }).catch((e) => console.warn("world:", e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e)));
  return booting;
}

document.addEventListener("astro:page-load", () => {
  if (!document.body.dataset.world) { document.body.classList.remove("world-on"); return; } // pages opt in to the world
  if (world) { document.body.classList.add("world-on"); world.go(state()); return; }
  const start = () => ensure();
  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 400 }); else setTimeout(start, 200);
});

// Pages can point the world somewhere temporarily (e.g. hovering an element) and back.
addEventListener("world:go", (e) => world?.go((e as CustomEvent<WorldState>).detail ?? state()));
addEventListener("world:reset", () => world?.go(state()));
