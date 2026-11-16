/**
 * How far does a radio signal get into water?
 * Plane wave in a lossy dielectric: α = (ω/c)·|Im √εc|, εc = ε∞ + (εs−ε∞)/(1+jωτ) − jσ/(ωε0)
 * Debye water at 25 °C: εs 78.4, ε∞ 5.2, τ 8.27 ps (Kaatze 1989). σ: sea 4 S/m, fresh pool ~0.01 S/m.
 * Ignores the reflection at the surface and any antenna effects: both only make it worse.
 */
import { C, s, svg, set, h, scrub, sentence, readout, choice, handle, axis, scale, poke } from "./kit";

const E0 = 8.854e-12, CL = 299792458;
function alphaDbPerM(f: number, sigma: number) {
  const w = 2 * Math.PI * f;
  const den = 1 + (w * 8.27e-12) ** 2;
  // εc = re − j·im
  const re = 5.2 + (78.4 - 5.2) / den;
  const im = ((78.4 - 5.2) * w * 8.27e-12) / den + sigma / (w * E0);
  // principal sqrt of (re − j im): |imag part|
  const mod = Math.hypot(re, im);
  const imSqrt = Math.sqrt((mod - re) / 2);
  return 8.686 * (w / CL) * imSqrt;
}

const fmtF = (f: number) => (f >= 1e9 ? `${(f / 1e9).toFixed(f < 1e10 ? 3 : 1)} GHz` : f >= 1e6 ? `${(f / 1e6).toFixed(f < 1e7 ? 1 : 0)} MHz` : f >= 1e3 ? `${(f / 1e3).toFixed(f < 1e4 ? 1 : 0)} kHz` : `${f.toFixed(0)} Hz`);
const fmtD = (m: number) => (m >= 1 ? `${m.toFixed(m < 10 ? 1 : 0)} m` : m >= 0.01 ? `${(m * 100).toFixed(m < 0.1 ? 1 : 0)} cm` : `${(m * 1000).toFixed(1)} mm`);

export function mount(root: HTMLElement) {
  // GPS L1 minimum received power −128.5 dBm (IS-GPS-200); a good receiver keeps tracking to about −167 dBm (u-blox M8).
  const TOP = -128.5, FLOOR = -167;
  let f = 1.57542e9, water: "sea" | "fresh" = "sea", depth = 0.02;
  const { slots } = sentence(root, `A signal at {f} arrives at the surface as strong as GPS does. In {water}, it loses <b class="k-failure">{rate}</b> per metre, and a good receiver gives up after <b class="k-estimate">38.5 dB</b>. So it is gone by <b class="k-failure">{dead}</b>.`);
  const W = 860, H = 330, L = 70, R = 830, T = 24, B = 280;
  const el = svg(root, W, H, "Signal level against depth below the surface, with the receiver's tracking floor");
  const grid = s("g", {}, el), plot = s("g", {}, el);
  const say = readout(root);
  let maxD = 0.2;
  const y = scale(TOP, -200, T, B);
  let x = scale(0, maxD, L, R);
  const line = s("path", { fill: "none", stroke: C.medium, "stroke-width": 3, class: "x-glow", style: `color:${C.medium}` }, plot);
  const floor = s("line", { x1: L, x2: R, y1: y(FLOOR), y2: y(FLOOR), stroke: C.estimate, "stroke-dasharray": "6 5" }, plot);
  s("text", { x: R, y: y(FLOOR) - 8, "text-anchor": "end", class: "x-lbl", fill: C.estimate }, plot).textContent = "receiver gives up (−167 dBm)";
  const deadMark = s("line", { y1: T, y2: B, stroke: C.failure, "stroke-dasharray": "2 4" }, plot);
  const deadLbl = s("text", { y: T + 12, class: "x-lbl", fill: C.failure }, plot);
  const surf = s("text", { x: L + 40, y: T - 8, class: "x-lbl", fill: C.medium }, plot); surf.textContent = "← surface";
  const probe = s("text", { class: "x-lbl", fill: C.chalk }, plot);

  const draw = () => {
    const a = alphaDbPerM(f, water === "sea" ? 4 : 0.01);
    const dead = 38.5 / a;
    maxD = Math.min(2000, Math.max(0.05, dead * 2.2));
    x = scale(0, maxD, L, R);
    grid.replaceChildren();
    const ticks = Array.from({ length: 5 }, (_, i) => (maxD * i) / 4);
    axis(grid, { dir: "x", x0: L, x1: R, y0: B, y1: B, ticks, at: x, fmt: fmtD, label: "depth below the surface" });
    axis(grid, { dir: "y", x0: L, x1: R, y0: B, y1: T, ticks: [-130, -150, -170, -190], at: y, fmt: (v) => `${v}`, label: "dBm" });
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) { const d = (maxD * i) / 120; const v = Math.max(-200, TOP - a * d); pts.push(`${i ? "L" : "M"}${x(d).toFixed(1)} ${y(v).toFixed(1)}`); }
    line.setAttribute("d", pts.join(""));
    set(line, { stroke: water === "sea" ? C.medium : C.chalk, style: `color:${water === "sea" ? C.medium : C.chalk}` });
    set(deadMark, { x1: x(dead), x2: x(dead) }); set(deadLbl, { x: x(dead) + 6 }); deadLbl.textContent = `gone at ${fmtD(dead)}`;
    slots.rate.textContent = `${a >= 10 ? a.toFixed(0) : a.toFixed(2)} dB`;
    slots.dead.textContent = fmtD(dead);
    slots.water.textContent = water === "sea" ? "sea water" : "a fresh-water pool";
    depth = Math.min(depth, maxD);
    hd.put(x(depth), y(Math.max(-200, TOP - a * depth)));
  };

  const hd = handle(el, "Probe depth", "me", (px) => {
    const d = Math.max(0, Math.min(maxD, (px - L) / (R - L) * maxD));
    const a = alphaDbPerM(f, water === "sea" ? 4 : 0.01);
    return [x(d), y(Math.max(-200, TOP - a * d))];
  }, (px, py) => {
    depth = Math.max(0, (px - L) / (R - L) * maxD);
    const lvl = TOP - alphaDbPerM(f, water === "sea" ? 4 : 0.01) * depth;
    set(probe, { x: Math.min(px + 14, R - 150), y: py - 14 }); probe.textContent = `${fmtD(depth)}: ${lvl.toFixed(0)} dBm`;
    say(`at <b>${fmtD(depth)}</b> the signal is <b class="${lvl > FLOOR ? "k-measured" : "k-failure"}">${lvl > FLOOR ? `${(lvl - FLOOR).toFixed(0)} dB above` : `${(FLOOR - lvl).toFixed(0)} dB below`}</b> what a receiver can hear`);
    poke();
  }, [L + 60, T + 40], 8);

  const fScrub = scrub(slots.f, { value: f, min: 10, max: 1e10, log: true, fmt: fmtF, label: "Signal frequency", tone: "me" }, (v) => { f = v; draw(); poke(); });
  const ctl = h("div", {}, root);
  const freqs: [string, number][] = [["VLF, submarine radio · 10 kHz", 1e4], ["FM · 100 MHz", 1e8], ["GPS L1 · 1.575 GHz", 1.57542e9], ["Wi-Fi · 2.4 GHz", 2.4e9]];
  choice(ctl, "Frequency presets", freqs.map(([l, v]) => ({ label: l, on: () => fScrub.set(v) })), 2);
  choice(ctl, "Water", [{ label: "sea water · σ 4 S/m", on: () => { water = "sea"; draw(); } }, { label: "pool water · σ 0.01 S/m", on: () => { water = "fresh"; draw(); } }]);
  h("p", { class: "bench-note" }, root, "Debye model of water at 25 °C (Kaatze 1989) plus conductivity. Ignores the reflection at the surface, which only makes it worse. Receiver figures: GPS minimum signal −128.5 dBm (IS-GPS-200), tracking to −167 dBm (u-blox M8).");
  draw();
}
