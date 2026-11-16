/**
 * Sound, synthesised in code (no files): a motor hum that follows speed, and small blips.
 * On by default, but browsers only allow audio after a gesture, so it starts on the first key or tap.
 */
export interface Sound { setSpeed: (v: number, boost: boolean) => void; blip: (f?: number) => void; toggle: () => boolean; on: () => boolean }

export function createSound(): Sound {
  let ctx: AudioContext | null = null, master: GainNode | null = null, osc: OscillatorNode | null = null, osc2: OscillatorNode | null = null, hum: GainNode | null = null;
  let enabled = localStorage.getItem("zero-sound") !== "off";
  const start = () => {
    if (ctx) return;
    ctx = new AudioContext();
    master = ctx.createGain(); master.gain.value = enabled ? 0.5 : 0; master.connect(ctx.destination);
    hum = ctx.createGain(); hum.gain.value = 0; hum.connect(master);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 700; lp.connect(hum);
    osc = ctx.createOscillator(); osc.type = "sawtooth"; osc.frequency.value = 50; osc.connect(lp); osc.start();
    osc2 = ctx.createOscillator(); osc2.type = "square"; osc2.frequency.value = 75; const g2 = ctx.createGain(); g2.gain.value = 0.25; osc2.connect(g2); g2.connect(lp); osc2.start();
  };
  for (const ev of ["keydown", "pointerdown", "touchstart"]) addEventListener(ev, start, { once: true, passive: true });
  return {
    setSpeed(v, boost) {
      if (!ctx || !osc || !osc2 || !hum) return;
      const a = Math.min(1, Math.abs(v) / 9), t = ctx.currentTime;
      osc.frequency.setTargetAtTime(48 + a * 90 + (boost ? 25 : 0), t, 0.08);
      osc2.frequency.setTargetAtTime(72 + a * 130, t, 0.08);
      hum.gain.setTargetAtTime(0.05 + a * 0.16, t, 0.1);
    },
    blip(f = 880) {
      if (!ctx || !master || !enabled) return;
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
      o.type = "triangle"; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.08);
      g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.22);
    },
    toggle() { enabled = !enabled; localStorage.setItem("zero-sound", enabled ? "on" : "off"); if (master && ctx) master.gain.setTargetAtTime(enabled ? 0.5 : 0, ctx.currentTime, 0.05); return enabled; },
    on: () => enabled,
  };
}
