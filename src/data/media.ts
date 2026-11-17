/** Real pixel sizes of every image in public/media (src/data/media.json, generated from the files). */
import media from "./media.json";
const M = media as Record<string, number[]>;
export const dims = (src: string): { w: number; h: number; portrait: boolean; square: boolean } => {
  const [w, h] = M[src] ?? [1200, 800];
  return { w, h, portrait: h > w * 1.05, square: h >= w * 0.8 && h <= w * 1.05 };
};
/** Group a story gallery into rows: runs of portraits sit side by side (max 3), near-squares pair up, wide landscapes get a row each. */
export const rows = (items: [string, string][]) => {
  const out: { src: string; cap: string; w: number; h: number; portrait: boolean; square: boolean }[][] = [];
  for (const [src, cap] of items) {
    const d = { src, cap, ...dims(src) };
    const last = out[out.length - 1];
    if (d.portrait && last && last[0].portrait && last.length < 3) last.push(d);
    else if (d.square && last && last[0].square && last.length < 2) last.push(d);
    else out.push([d]);
  }
  return out;
};
