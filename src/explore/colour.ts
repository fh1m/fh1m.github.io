/**
 * What water does to colour. Beer–Lambert per channel with veiling light,
 * k = pure-water absorption (Pope & Fry 1997) ×4 for a pool. The same model as fh1m/green-at-depth.
 * Venue dots are REAL: mean red ÷ green over 119 frames of 2025 footage (mongla_ws tools/studies/colour_loss.py).
 * Where a dot sits on the model curve is an inference ("as if the camera did nothing"), and is labelled so.
 */
import data from "../data/mongla.json";
import { C, s, svg, set, h, scrub, sentence, readout, handle, axis, scale, poke } from "./kit";

const K = [0.2224 * 4, 0.0447 * 4, 0.0094 * 4];
const VEIL = [0.08, 0.42, 0.55];

function hsv(r: number, g: number, b: number) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let hh = 0;
  if (d) hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [((hh * 60 + 360) % 360) / 2, mx ? (d / mx) * 255 : 0, mx * 255];
}

export function mount(root: HTMLElement) {
  let depth = 2;
  const { slots } = sentence(root, `Sink the card through {d} of water. Red keeps <b class="k-failure">{r}</b> of its light, green <b class="k-measured">{g}</b>, blue <b class="k-medium">{b}</b>. The 2023 rule "hue between 50 and 70" now sees {verdict}.`);
  const wrap = h("div", { style: "display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:1.4rem;align-items:center" }, root);
  const W = 560, H = 320, L = 52, R = 540, T = 20, B = 270, MAXD = 10;
  const el = svg(wrap, W, H, "Fraction of red, green and blue light left against water depth, with real venue measurements");
  const x = scale(0, MAXD, L, R), y = scale(0, 1, B, T);
  const g = s("g", {}, el);
  axis(g, { dir: "x", x0: L, x1: R, y0: B, y1: B, ticks: [0, 2, 4, 6, 8, 10], at: x, fmt: (v) => `${v} m`, label: "water between lens and card" });
  axis(g, { dir: "y", x0: L, x1: R, y0: B, y1: T, ticks: [0, 0.25, 0.5, 0.75, 1], at: y, fmt: (v) => `${Math.round(v * 100)}%`, label: "light left" });
  const tones = [C.failure, C.measured, C.medium];
  K.forEach((k, i) => {
    const d = Array.from({ length: 101 }, (_, j) => { const dd = (MAXD * j) / 100; return `${j ? "L" : "M"}${x(dd).toFixed(1)} ${y(Math.exp(-k * dd)).toFixed(1)}`; }).join("");
    s("path", { d, fill: "none", stroke: tones[i], "stroke-width": 2.5 }, g);
  });
  // red ÷ green, dashed
  const rg = Array.from({ length: 101 }, (_, j) => { const dd = (MAXD * j) / 100; return `${j ? "L" : "M"}${x(dd).toFixed(1)} ${y(Math.exp(-(K[0] - K[1]) * dd)).toFixed(1)}`; }).join("");
  s("path", { d: rg, fill: "none", stroke: C.chalk, "stroke-dasharray": "4 5", opacity: 0.6 }, g);
  s("text", { x: x(4.2), y: y(Math.exp(-(K[0] - K[1]) * 4.2)) - 8, class: "x-lbl" }, g).textContent = "red ÷ green";
  // real venues on the red÷green curve
  for (const v of data.colour.rows as { venue: string; rn: number }[]) {
    if (v.rn >= 0.99) continue; // the neutral clip: camera or white balance differed, not the water
    const dEq = -Math.log(v.rn) / (K[0] - K[1]);
    s("circle", { cx: x(dEq), cy: y(v.rn), r: 6, fill: C.me }, g);
    s("text", { x: x(dEq) + 10, y: y(v.rn) + 4, class: "x-lbl", fill: C.me }, g).textContent = `${v.venue}: red at ${Math.round(v.rn * 100)}% of green`;
  }
  const cursor = s("line", { y1: T, y2: B, stroke: C.me, opacity: 0.5 }, el);

  // the card, rendered live
  const cv = h("canvas", { width: 240, height: 150, class: "bench-canvas", role: "img", "aria-label": "The colour card as the camera would see it at this depth" }, wrap) as HTMLCanvasElement;
  const ctx = cv.getContext("2d")!;
  const card = document.createElement("canvas"); card.width = 240; card.height = 150;
  const cx = card.getContext("2d")!;
  cx.fillStyle = "#bdb09a"; cx.fillRect(0, 0, 240, 150);
  cx.fillStyle = "#28c83c"; cx.beginPath(); cx.moveTo(24, 60); cx.lineTo(96, 60); cx.lineTo(96, 40); cx.lineTo(140, 75); cx.lineTo(96, 110); cx.lineTo(96, 90); cx.lineTo(24, 90); cx.closePath(); cx.fill();
  cx.fillStyle = "#eb6e14"; cx.fillRect(168, 14, 14, 122);
  [["#e0242a", 196], ["#1fae3a", 210], ["#2a4fd8", 224]].forEach(([c, xx]) => { cx.fillStyle = c as string; cx.fillRect(xx as number, 14, 10, 40); });
  const src = cx.getImageData(0, 0, 240, 150).data;
  const out = ctx.createImageData(240, 150);
  const say = readout(root);

  const draw = () => {
    const t = K.map((k) => Math.exp(-k * depth));
    let arrow = 0, post = 0;
    for (let i = 0; i < src.length; i += 4) {
      const c = [0, 1, 2].map((ch) => (src[i + ch] / 255) * t[ch] + VEIL[ch] * (1 - t[ch]));
      out.data[i] = c[0] * 255; out.data[i + 1] = c[1] * 255; out.data[i + 2] = c[2] * 255; out.data[i + 3] = 255;
      const [hh, ss, vv] = hsv(c[0], c[1], c[2]);
      if (hh >= 50 && hh <= 70 && ss >= 100 && vv >= 100) { const px = (i / 4) % 240; if (px < 145) arrow++; else if (px > 165 && px < 185) post++; }
    }
    ctx.putImageData(out, 0, 0);
    slots.r.textContent = `${Math.round(t[0] * 100)}%`; slots.g.textContent = `${Math.round(t[1] * 100)}%`; slots.b.textContent = `${Math.round(t[2] * 100)}%`;
    const arrowOk = arrow > 2500, postLies = post > 600;
    slots.verdict.innerHTML = arrowOk && !postLies ? `<b class="k-measured">the arrow, and only the arrow</b>` : arrowOk && postLies ? `<b class="k-failure">the arrow, and the orange post too</b>` : `<b class="k-failure">nothing at all</b>`;
    set(cursor, { x1: x(depth), x2: x(depth) });
    say(`model: pure-water absorption ×4, veiling light included. <b>Pink dots are real</b>: two venues of our own 2025 footage. Where they sit on the dashed curve is what the model would say if the camera had done nothing, and it didn't do nothing, so read it as a shape, not a depth.`);
  };
  const ds = scrub(slots.d, { value: depth, min: 0, max: MAXD, step: 0.1, fmt: (v) => `${v.toFixed(1)} m`, label: "Water depth", tone: "medium" }, (v) => { depth = v; hd.put(x(v), y(Math.exp(-K[0] * v))); draw(); poke(); });
  const hd = handle(el, "Water depth, on the red curve", "failure", (px) => { const d = Math.max(0, Math.min(MAXD, ((px - L) / (R - L)) * MAXD)); return [x(d), y(Math.exp(-K[0] * d))]; }, (px) => { const d = ((px - L) / (R - L)) * MAXD; if (Math.abs(d - depth) > 0.04) { depth = Math.round(d * 10) / 10; ds.set(depth); } }, [x(depth), y(Math.exp(-K[0] * depth))]);
  draw();
  if (matchMedia("(max-width: 760px)").matches) wrap.style.gridTemplateColumns = "1fr";
}
