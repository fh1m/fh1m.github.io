/**
 * The nine stage-0 Haar features of OpenCV's frontal-face cascade, on my 2023 webcam face.
 * Each feature compares the brightness of rectangles; the cascade weights are real
 * (extracted from fh1m/pareidolia/cascade.xml). The verdict per feature is computed live
 * on the image's actual pixels.
 */
import { canvas, readout, buttons, C, emit } from "./ui";
import features from "./haar-stage0.json";

export function mount(el: HTMLElement, bus: EventTarget) {
  const cv = canvas(el, 1, "My face in 2023, with one of the cascade's first nine light-versus-dark comparisons drawn over it");
  const say = readout(el);
  const img = new Image();
  img.src = "/media/notes/face-2023.webp";
  let k = 0, gray: Float32Array | null = null;
  const G = 24;

  img.decode().then(() => {
    const off = new OffscreenCanvas(G, G).getContext("2d")!;
    off.drawImage(img, 0, 0, G, G);
    const d = off.getImageData(0, 0, G, G).data;
    gray = new Float32Array(G * G);
    for (let i = 0; i < G * G; i++) gray[i] = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255;
    draw();
  });

  const sum = (x: number, y: number, w: number, h: number) => { let s = 0; for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) s += gray![j * G + i]; return s; };

  function draw() {
    const { ctx, w, h } = cv; const s = Math.min(w, h) / G;
    ctx.clearRect(0, 0, w, h);
    if (img.complete) ctx.drawImage(img, 0, 0, G * s, G * s);
    const f = (features as number[][][])[k];
    let score = 0;
    for (const [x, y, rw, rh, wt] of f) {
      ctx.fillStyle = wt > 0 ? "rgba(242,240,232,.62)" : "rgba(0,0,0,.68)";
      ctx.fillRect(x * s, y * s, rw * s, rh * s);
      ctx.strokeStyle = wt > 0 ? C.chalk : C.dim; ctx.strokeRect(x * s, y * s, rw * s, rh * s);
      if (gray) score += wt * sum(x, y, rw, rh);
    }
    ctx.fillStyle = C.measured; ctx.font = "12px 'Commit Mono', monospace";
    ctx.fillText(`feature ${k + 1} / 9`, 8, 18);
    const area = f[0][2] * f[0][3];
    const contrast = gray ? score / area : 0;
    say(`feature ${k + 1}: weighted brightness difference <b>${contrast.toFixed(3)}</b> · ${contrast > 0 ? "lighter where it expects light" : "darker where it expects light"}. Nine of these, thresholded and summed, decide whether a window is worth a second look.`);
    emit(bus, "haar", k);
  }
  buttons(el, [
    { label: "← previous", on: () => { k = (k + 8) % 9; draw(); } },
    { label: "next →", on: () => { k = (k + 1) % 9; draw(); } },
  ], "Stage-0 feature");
  const note = document.createElement("p");
  note.className = "bench-note";
  note.textContent = "Rectangles and weights straight from OpenCV's haarcascade_frontalface_default.xml (Lienhart). Light = positive weight. The face is mine, November 2023, from the original webcam screenshot.";
  el.append(note);
  cv.onResize(draw);
  draw();
}
