/** Keys (arrows / WASD / space) and an on-screen stick for touch. Values are -1..1. */
export interface Input { x: number; y: number; boost: boolean; touched: boolean }

export function createInput(stick: HTMLElement | null): Input {
  const s: Input = { x: 0, y: 0, boost: false, touched: false };
  const down = new Set<string>();
  const sync = () => {
    if (s.touched) return;
    s.y = (down.has("ArrowUp") || down.has("KeyW") ? 1 : 0) - (down.has("ArrowDown") || down.has("KeyS") ? 1 : 0);
    s.x = (down.has("ArrowRight") || down.has("KeyD") ? 1 : 0) - (down.has("ArrowLeft") || down.has("KeyA") ? 1 : 0);
    s.boost = down.has("ShiftLeft") || down.has("ShiftRight");
  };
  const GAME_KEYS: Record<string, true> = { ArrowUp: true, ArrowDown: true, ArrowLeft: true, ArrowRight: true, KeyW: true, KeyA: true, KeyS: true, KeyD: true, ShiftLeft: true, ShiftRight: true, Space: true };
  addEventListener("keydown", (e) => { if (!GAME_KEYS[e.code] || (e.target as HTMLElement)?.closest?.("input,textarea")) return; if (e.code.startsWith("Arrow") || e.code === "Space") e.preventDefault(); s.touched = false; down.add(e.code); sync(); });
  addEventListener("keyup", (e) => { down.delete(e.code); sync(); });
  addEventListener("blur", () => { down.clear(); sync(); });

  if (stick) {
    const knob = stick.querySelector<HTMLElement>(".knob")!;
    let id: number | null = null, cx = 0, cy = 0;
    const move = (e: PointerEvent) => {
      const r = stick.getBoundingClientRect(), max = r.width / 2;
      let dx = e.clientX - cx, dy = e.clientY - cy; const l = Math.hypot(dx, dy); if (l > max) { dx *= max / l; dy *= max / l; }
      knob.style.transform = `translate(${dx}px, ${dy}px)`; s.x = dx / max; s.y = -dy / max; s.boost = l > max * 0.95;
    };
    stick.addEventListener("pointerdown", (e) => { const r = stick.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; id = e.pointerId; s.touched = true; stick.setPointerCapture(e.pointerId); move(e); });
    stick.addEventListener("pointermove", (e) => { if (e.pointerId === id) move(e); });
    const end = () => { id = null; s.x = s.y = 0; s.boost = false; knob.style.transform = ""; };
    stick.addEventListener("pointerup", end); stick.addEventListener("pointercancel", end);
  }
  return s;
}
