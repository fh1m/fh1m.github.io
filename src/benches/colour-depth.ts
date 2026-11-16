/**
 * Sink a colour card through water (same model as fh1m/green-at-depth):
 *   I = J·e^(−k·d) + B·(1 − e^(−k·d)),  k = pure-water absorption (Pope & Fry 1997) × 4.
 * The 2023 HSV threshold (hue 50–70 of 180, S ≥ 100, V ≥ 100) is applied live.
 */
import { canvas, slider, readout, C, emit } from "./ui";

const K = [0.2224 * 4, 0.0447 * 4, 0.0094 * 4]; // R, G, B  [1/m]
const VEIL = [0.08, 0.42, 0.55];                 // R, G, B

function hsv(r: number, g: number, b: number) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [((h * 60 + 360) % 360) / 2, mx ? (d / mx) * 255 : 0, mx * 255]; // OpenCV ranges
}

export function mount(el: HTMLElement, bus: EventTarget) {
  const cv = canvas(el, 0.56, "A colour card under water: a green arrow, an orange gate post and red, green and blue swatches");
  const say = readout(el);
  const W = 240, H = 134;
  const card = new OffscreenCanvas(W, H);
  const cx = card.getContext("2d")!;
  cx.fillStyle = "#bdb09a"; cx.fillRect(0, 0, W, H);                      // sand
  cx.fillStyle = "#28c83c"; cx.beginPath();                               // the arrow
  cx.moveTo(30, 52); cx.lineTo(100, 52); cx.lineTo(100, 34); cx.lineTo(140, 67); cx.lineTo(100, 100); cx.lineTo(100, 82); cx.lineTo(30, 82); cx.closePath(); cx.fill();
  cx.fillStyle = "#eb6e14"; cx.fillRect(170, 14, 14, 106);                // gate post
  [["#e0242a", 200], ["#1fae3a", 214], ["#2a4fd8", 228]].forEach(([c, x]) => { cx.fillStyle = c as string; cx.fillRect(x as number, 14, 10, 32); });
  const src = cx.getImageData(0, 0, W, H).data;
  const out = new ImageData(W, H), mask = new ImageData(W, H);
  const tmp = new OffscreenCanvas(W, H).getContext("2d")!;

  let depth = 0;
  const draw = () => {
    const t = K.map((k) => Math.exp(-k * depth));
    let arrowPass = 0, postPass = 0;
    for (let i = 0; i < src.length; i += 4) {
      const r = (src[i] / 255) * t[0] + VEIL[0] * (1 - t[0]);
      const g = (src[i + 1] / 255) * t[1] + VEIL[1] * (1 - t[1]);
      const b = (src[i + 2] / 255) * t[2] + VEIL[2] * (1 - t[2]);
      out.data[i] = r * 255; out.data[i + 1] = g * 255; out.data[i + 2] = b * 255; out.data[i + 3] = 255;
      const [h, s, v] = hsv(r, g, b);
      const pass = h >= 50 && h <= 70 && s >= 100 && v >= 100;
      mask.data[i] = pass ? 184 : 8; mask.data[i + 1] = pass ? 243 : 9; mask.data[i + 2] = pass ? 74 : 11; mask.data[i + 3] = 255;
      const px = (i / 4) % W, py = Math.floor(i / 4 / W);
      if (pass && px < 145) arrowPass++;
      if (pass && px >= 168 && px <= 186) postPass++;
    }
    const { ctx, w, h } = cv;
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = false;
    tmp.putImageData(out, 0, 0); ctx.drawImage(tmp.canvas, 0, 0, w, (h * 0.62));
    tmp.putImageData(mask, 0, 0); ctx.drawImage(tmp.canvas, 0, h * 0.64, w * 0.5, h * 0.36);
    ctx.fillStyle = C.dim; ctx.font = "11px 'Commit Mono', monospace";
    ctx.fillText("what the 2023 threshold keeps", w * 0.52, h * 0.7);
    ctx.fillStyle = C.medium; ctx.fillText(`${depth.toFixed(1)} m of water`, w * 0.52, h * 0.8);
    ctx.fillStyle = C.failure; ctx.fillText(`red left: ${(t[0] * 100).toFixed(0)} %`, w * 0.52, h * 0.9);
    const arrowOk = arrowPass > 2500, postLies = postPass > 600;
    say(`${depth.toFixed(1)} m · red transmission <b>${(t[0] * 100).toFixed(0)} %</b> · arrow ${arrowOk ? '<span class="measured">found</span>' : '<span class="failure">lost</span>'}${postLies ? ' · <span class="failure">the orange post now passes as green</span>' : ""}`);
    emit(bus, "colour-depth", depth);
  };
  slider(el, { label: "depth (water path)", min: 0, max: 12, step: 0.1, value: 0, unit: " m", fmt: (v) => `${v.toFixed(1)} m`, id: "cd-depth" }, (v) => { depth = v; draw(); });
  const note = document.createElement("p");
  note.className = "bench-note";
  note.textContent = "Pure-water absorption (Pope & Fry 1997) ×4 for a real pool. A model with honest shapes, not a measurement of any pool.";
  el.append(note);
  cv.onResize(draw);
  draw();
}
