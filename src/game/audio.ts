/**
 * Sound, synthesised in code: no files, one graph, one room (a generated reverb).
 * Music changes with where you are:
 *   space  a slow D major 9 pad
 *   air    high and open, with a breath of wind
 *   water  deep and muffled, with bubbles
 *   earth  warm, with a wooden pentatonic pluck now and then
 *   fire   low and electric, with crackle
 * Effects: pluck (buttons), whoosh (camera moves), chime (transformations), shutter (Voyager).
 * On by default, but browsers only allow audio after a gesture, so it starts on the first one.
 */
export type SceneId = "space" | "air" | "water" | "earth" | "fire";
export interface Sound { scene: (s: SceneId) => void; pluck: (f?: number) => void; whoosh: () => void; chime: () => void; shutter: () => void; toggle: () => boolean; on: () => boolean }

const hz = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
const SCENES: Record<SceneId, { notes: number[]; type: OscillatorType; cutoff: number; wobble: number; level: number }> = {
  space: { notes: [50, 57, 62, 64, 66, 73], type: "sine", cutoff: 1400, wobble: 0.08, level: 0.16 },
  air: { notes: [69, 73, 76, 80, 83], type: "triangle", cutoff: 4200, wobble: 0.12, level: 0.1 },
  water: { notes: [38, 45, 53, 60, 64], type: "triangle", cutoff: 520, wobble: 0.25, level: 0.2 },
  earth: { notes: [43, 50, 55, 59, 66], type: "triangle", cutoff: 1500, wobble: 0.06, level: 0.15 },
  fire: { notes: [40, 47, 55, 62], type: "sawtooth", cutoff: 820, wobble: 0.15, level: 0.07 },
};

let instance: Sound | null = null;
export function createSound(): Sound {
  if (instance) return instance;
  let ctx: AudioContext | null = null, master: GainNode, music: GainNode, fx: GainNode, verb: ConvolverNode;
  let enabled = localStorage.getItem("zero-sound") !== "off";
  let want: SceneId = "space", playing: { stop: () => void } | null = null;

  const impulse = (c: AudioContext, seconds = 3.2) => {
    const len = c.sampleRate * seconds, b = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    return b;
  };
  const noiseBuf = (c: AudioContext) => { const b = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; };
  let noise: AudioBuffer;

  function ensure() {
    if (ctx) return;
    ctx = new AudioContext();
    master = ctx.createGain(); master.gain.value = enabled ? 0.55 : 0; master.connect(ctx.destination);
    verb = ctx.createConvolver(); verb.buffer = impulse(ctx); const wet = ctx.createGain(); wet.gain.value = 0.55; verb.connect(wet); wet.connect(master);
    music = ctx.createGain(); music.gain.value = 1; music.connect(master); music.connect(verb);
    fx = ctx.createGain(); fx.gain.value = 0.8; fx.connect(master); fx.connect(verb);
    noise = noiseBuf(ctx);
    play(want);
  }
  for (const ev of ["keydown", "pointerdown", "touchstart"]) addEventListener(ev, ensure, { once: true, passive: true });

  function play(id: SceneId) {
    if (!ctx) return;
    const c = ctx, S = SCENES[id], t = c.currentTime;
    playing?.stop();
    const bus = c.createGain(); bus.gain.setValueAtTime(0, t); bus.gain.linearRampToValueAtTime(S.level, t + 2.5);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = S.cutoff; lp.Q.value = 0.4; lp.connect(bus); bus.connect(music);
    const lfo = c.createOscillator(), lfoG = c.createGain(); lfo.frequency.value = 0.07; lfoG.gain.value = S.cutoff * S.wobble; lfo.connect(lfoG); lfoG.connect(lp.frequency); lfo.start();
    const oscs: OscillatorNode[] = [lfo];
    S.notes.forEach((n, i) => {
      for (const det of [-5, 5]) {
        const o = c.createOscillator(), g = c.createGain(); o.type = S.type; o.frequency.value = hz(n); o.detune.value = det + i;
        g.gain.value = 0.5 / S.notes.length; o.connect(g); g.connect(lp); o.start(); oscs.push(o);
      }
    });
    // textures
    const timers: number[] = [];
    const every = (ms: number, f: () => void) => timers.push(window.setInterval(() => { if (enabled && !document.hidden) f(); }, ms));
    if (id === "air") { const n = c.createBufferSource(); n.buffer = noise; n.loop = true; const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2600; bp.Q.value = 0.8; const g = c.createGain(); g.gain.value = 0.035; n.connect(bp); bp.connect(g); g.connect(bus); n.start(); oscs.push(n as unknown as OscillatorNode); }
    if (id === "water") every(1400, () => { if (Math.random() < 0.6) tone(300 + Math.random() * 500, 0.05, "sine", 0.16, 2.4); });
    if (id === "earth") { const scale = [55, 57, 59, 62, 64, 67, 69]; every(950, () => { if (Math.random() < 0.55) tone(hz(scale[(Math.random() * scale.length) | 0] + 12), 0.06, "sine", 0.5, 1); }); }
    if (id === "fire") every(220, () => { if (Math.random() < 0.35) crackle(); });
    playing = {
      stop: () => {
        const e = c.currentTime; bus.gain.cancelScheduledValues(e); bus.gain.setValueAtTime(bus.gain.value, e); bus.gain.linearRampToValueAtTime(0, e + 2.5);
        timers.forEach(clearInterval); setTimeout(() => oscs.forEach((o) => { try { o.stop(); } catch { /* already stopped */ } }), 2700);
      },
    };
  }

  function tone(f: number, vol: number, type: OscillatorType, decay: number, bend = 1) {
    if (!ctx || !enabled) return;
    const c = ctx, t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (bend !== 1) o.frequency.exponentialRampToValueAtTime(f * bend, t + decay * 0.6);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    o.connect(g); g.connect(fx); o.start(t); o.stop(t + decay + 0.05);
  }
  function crackle() {
    if (!ctx) return;
    const c = ctx, t = c.currentTime, n = c.createBufferSource(), hp = c.createBiquadFilter(), g = c.createGain();
    n.buffer = noise; hp.type = "highpass"; hp.frequency.value = 2500; g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    n.connect(hp); hp.connect(g); g.connect(fx); n.start(t, Math.random()); n.stop(t + 0.05);
  }

  instance = {
    scene(id) { want = id; play(id); },
    pluck(f = 660) { tone(f, 0.12, "sine", 0.5); tone(f * 2, 0.03, "triangle", 0.25); },
    whoosh() {
      if (!ctx || !enabled) return;
      const c = ctx, t = c.currentTime, n = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
      n.buffer = noise; bp.type = "bandpass"; bp.Q.value = 1.2; bp.frequency.setValueAtTime(260, t); bp.frequency.exponentialRampToValueAtTime(2200, t + 0.7); bp.frequency.exponentialRampToValueAtTime(500, t + 1.4);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.13, t + 0.35); g.gain.linearRampToValueAtTime(0, t + 1.4);
      n.connect(bp); bp.connect(g); g.connect(fx); n.start(t); n.stop(t + 1.5);
    },
    chime() { [0, 4, 7, 11, 14].forEach((s, i) => setTimeout(() => tone(hz(72 + s), 0.07, "triangle", 1.2), i * 70)); },
    shutter() { crackle(); setTimeout(crackle, 60); tone(1800, 0.05, "square", 0.05); },
    toggle() { enabled = !enabled; localStorage.setItem("zero-sound", enabled ? "on" : "off"); if (ctx) master.gain.setTargetAtTime(enabled ? 0.55 : 0, ctx.currentTime, 0.1); return enabled; },
    on: () => enabled,
  };
  return instance;
}
