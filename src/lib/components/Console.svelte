<script lang="ts">
  import { onMount } from 'svelte';

  const knobs = [
    { label: 'perception', v: 0.72 },
    { label: 'control', v: 0.5 },
    { label: 'nav', v: 0.86 },
    { label: 'power', v: 0.63 },
  ];
  const faders = [
    { label: 'roll', v: 0.5 },
    { label: 'pitch', v: 0.68 },
    { label: 'yaw', v: 0.42 },
  ];
  const steps = Array.from({ length: 8 }, (_, i) => i);

  let active = $state(0);
  let meter = $state(0.3);
  let depth = $state(-1.24);
  let yaw = $state(89);
  let scope: HTMLCanvasElement;

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let step = 0;
    const seq = setInterval(() => {
      step = (step + 1) % 8;
      active = step;
      depth = -1.0 - Math.random() * 0.9;
      yaw = Math.round(80 + Math.random() * 20);
    }, 320);

    // Oscilloscope — a cheap live trace on a small canvas, ~30fps.
    const ctx = scope?.getContext('2d');
    let raf = 0;
    let last = 0;
    let t = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 33 || !ctx) return;
      last = now;
      t += 0.08;
      const w = scope.width, h = scope.height;
      ctx.clearRect(0, 0, w, h);
      // grid
      ctx.strokeStyle = 'rgba(90,141,255,0.10)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 16) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 12) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      // two traces
      const trace = (color: string, freq: number, amp: number, off: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const y = h / 2 + off + Math.sin(x * freq + t) * amp * (0.6 + 0.4 * Math.sin(t * 0.7 + x * 0.01));
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      };
      trace('rgba(90,141,255,0.9)', 0.09, h * 0.22, -h * 0.12);
      trace('rgba(255,87,71,0.85)', 0.14, h * 0.14, h * 0.16);
      meter = 0.25 + Math.abs(Math.sin(t)) * 0.6 + Math.random() * 0.1;
    };
    raf = requestAnimationFrame(draw);
    return () => { clearInterval(seq); cancelAnimationFrame(raf); };
  });

  const meterCells = 12;
</script>

<div class="console panel" data-cursor role="img" aria-label="An instrument console — an oscilloscope screen, knobs, faders, an LED meter and a running step sequencer">
  <!-- screen row -->
  <div class="screen-row">
    <div class="screen well">
      <canvas bind:this={scope} width="320" height="96" class="scope"></canvas>
      <div class="screen-hud mono">
        <span class="hud-l">fh1m · op-01</span>
        <span class="hud-r">◉ live</span>
      </div>
      <div class="screen-tele mono">
        <span>depth <b>{depth.toFixed(2)}m</b></span>
        <span>yaw <b>{yaw}°</b></span>
        <span>mode <b class="hl">alt_hold</b></span>
      </div>
    </div>

    <div class="reel-stack">
      <div class="reel"><span class="hub"></span></div>
      <div class="meter well">
        <div class="meter-cells">
          {#each Array(meterCells) as _, i}
            <span class="cell" class:on={meter * meterCells > i} class:hot={i >= meterCells - 3}></span>
          {/each}
        </div>
        <span class="silk">signal</span>
      </div>
    </div>
  </div>

  <div class="top-row">
    <div class="knobs">
      {#each knobs as k}
        <div class="knob-unit">
          <div class="knob" style="--rot:{(-135 + k.v * 270).toFixed(1)}deg">
            <div class="knob-face"><span class="ind"></span></div>
          </div>
          <span class="k-label silk">{k.label}</span>
        </div>
      {/each}
    </div>

    <div class="faders">
      {#each faders as f}
        <div class="fader-unit">
          <div class="fader">
            <div class="fader-track"></div>
            <div class="fader-thumb" style="bottom:calc({(f.v * 100).toFixed(0)}% - 7px)"></div>
          </div>
          <span class="f-label silk">{f.label}</span>
        </div>
      {/each}
    </div>
  </div>

  <div class="bottom-row">
    <div class="pad-grid">
      {#each steps as s}
        <div class="pad" class:on={active === s} class:accent={s === 4}>
          <span class="pad-n mono">{s + 1}</span>
        </div>
      {/each}
    </div>
    <div class="transport">
      <button class="tbtn" aria-label="play"><span class="tri"></span></button>
      <button class="tbtn" aria-label="stop"><span class="sq"></span></button>
      <button class="tbtn rec" aria-label="record"><span class="dot"></span></button>
      <span class="bpm mono">500 hz</span>
    </div>
  </div>
</div>

<style>
  .console {
    position: relative;
    padding: clamp(0.9rem, 1.8vw, 1.5rem);
    display: grid;
    gap: clamp(0.8rem, 1.6vw, 1.3rem);
    background: linear-gradient(180deg, #161a21, #0a0d13);
    box-shadow: var(--e3);
  }
  .console::before {
    content: '';
    position: absolute;
    inset: 5px;
    border: 1px solid rgba(255, 255, 255, 0.03);
    pointer-events: none;
  }

  /* screen row */
  .screen-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: clamp(0.7rem, 1.5vw, 1.2rem);
  }
  .screen {
    position: relative;
    padding: 6px;
    background: #03040a;
    overflow: hidden;
  }
  .scope {
    display: block;
    width: 100%;
    height: clamp(70px, 9vw, 96px);
    image-rendering: pixelated;
  }
  .screen-hud {
    position: absolute;
    top: 8px;
    left: 10px;
    right: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 0.52rem;
    color: var(--sea-lit);
    letter-spacing: 0.1em;
    pointer-events: none;
  }
  .screen-hud .hud-r {
    color: var(--red-lit);
  }
  .screen-tele {
    position: absolute;
    bottom: 7px;
    left: 10px;
    right: 10px;
    display: flex;
    gap: 1em;
    font-size: 0.52rem;
    color: var(--ink-3);
  }
  .screen-tele b {
    color: var(--ink);
    font-weight: 400;
  }
  .screen-tele .hl {
    color: var(--sea-lit);
  }

  .reel-stack {
    display: grid;
    gap: 8px;
    align-content: start;
  }
  .reel {
    width: clamp(44px, 6vw, 60px);
    height: clamp(44px, 6vw, 60px);
    border-radius: 50%;
    background:
      repeating-conic-gradient(from 0deg, #23272f 0deg 20deg, #14171d 20deg 40deg);
    box-shadow: var(--e2), inset 0 0 0 2px #0b0e13;
    display: grid;
    place-items: center;
    animation: spin 3.4s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .reel .hub {
    width: 30%;
    height: 30%;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 30%, #3a4048, #14171d);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  .meter {
    padding: 0.5em 0.55em;
    display: grid;
    gap: 0.4em;
  }
  .meter-cells {
    display: flex;
    gap: 2px;
  }
  .cell {
    flex: 1;
    height: 14px;
    background: #10131a;
    box-shadow: inset 0 0 0 1px #000;
  }
  .cell.on {
    background: var(--sea-lit);
    box-shadow: inset 0 0 0 1px #000, 0 0 5px var(--sea);
  }
  .cell.hot.on {
    background: var(--red-lit);
    box-shadow: inset 0 0 0 1px #000, 0 0 5px var(--cad-red);
  }
  .meter .silk {
    font-size: 0.48rem;
  }

  .top-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: clamp(0.9rem, 2vw, 1.8rem);
    align-items: center;
  }
  .knobs {
    display: flex;
    gap: clamp(0.7rem, 1.8vw, 1.4rem);
  }
  .knob-unit {
    display: grid;
    justify-items: center;
    gap: 0.45em;
  }
  .knob {
    width: clamp(40px, 5.4vw, 58px);
    height: clamp(40px, 5.4vw, 58px);
    border-radius: 50%;
    background: repeating-conic-gradient(from 0deg, #2a2f38 0deg 6deg, #1b1f26 6deg 12deg);
    box-shadow: var(--e2), inset 0 0 0 3px #0b0e13;
    display: grid;
    place-items: center;
    transition: transform var(--dur) var(--ease-out);
  }
  .knob-unit:hover .knob {
    transform: rotate(14deg);
  }
  .knob-face {
    width: 68%;
    height: 68%;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 30%, #3a4048, #14171d 70%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 2px 4px rgba(0, 0, 0, 0.6);
    position: relative;
    transform: rotate(var(--rot));
  }
  .ind {
    position: absolute;
    top: 4px;
    left: 50%;
    width: 2px;
    height: 34%;
    margin-left: -1px;
    background: var(--sea-lit);
    box-shadow: 0 0 6px var(--sea);
  }
  .k-label,
  .f-label {
    font-size: 0.5rem;
    letter-spacing: 0.1em;
  }

  .faders {
    display: flex;
    gap: clamp(0.7rem, 1.6vw, 1.2rem);
  }
  .fader-unit {
    display: grid;
    justify-items: center;
    gap: 0.45em;
  }
  .fader {
    position: relative;
    width: 12px;
    height: clamp(56px, 8vw, 78px);
  }
  .fader-track {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    margin-left: -2px;
    background: #0a0d12;
    box-shadow: var(--e-well);
  }
  .fader-thumb {
    position: absolute;
    left: 50%;
    width: 18px;
    height: 11px;
    margin-left: -9px;
    background: linear-gradient(180deg, #d8d5cf, #a9a7a1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.7), inset 0 1px 0 #fff;
  }

  .bottom-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: clamp(0.9rem, 2vw, 1.6rem);
    align-items: center;
  }
  .pad-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 5px;
  }
  .pad {
    aspect-ratio: 1.3;
    min-width: 26px;
    background: linear-gradient(180deg, #23272f, #14171d);
    box-shadow: var(--e1);
    display: grid;
    place-items: center;
    position: relative;
    transition: transform 80ms, box-shadow 120ms;
  }
  .pad-n {
    font-size: 0.5rem;
    color: var(--ink-3);
  }
  .pad.on {
    background: linear-gradient(180deg, #2a49ff, #0026c9);
    box-shadow: var(--e1), var(--glow-signal);
    transform: translateY(1px);
  }
  .pad.on .pad-n {
    color: #fff;
  }
  .pad.accent.on {
    background: linear-gradient(180deg, #ff5747, #c00);
    box-shadow: var(--e1), var(--glow-red);
  }
  .transport {
    display: flex;
    align-items: center;
    gap: 0.45em;
  }
  .tbtn {
    width: 28px;
    height: 20px;
    display: grid;
    place-items: center;
    background: linear-gradient(180deg, #23272f, #14171d);
    box-shadow: var(--e1);
  }
  .tbtn:active {
    box-shadow: var(--e-in);
    transform: translateY(1px);
  }
  .tri {
    width: 0;
    height: 0;
    border-left: 7px solid var(--ink-2);
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
  }
  .sq {
    width: 8px;
    height: 8px;
    background: var(--ink-2);
  }
  .rec .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--red-lit);
    box-shadow: 0 0 8px var(--cad-red);
    animation: pulse 1.4s ease-in-out infinite;
  }
  @keyframes pulse {
    50% {
      opacity: 0.4;
    }
  }
  .bpm {
    margin-left: auto;
    font-size: 0.56rem;
    color: var(--ink-3);
  }

  @media (max-width: 560px) {
    .screen-row,
    .top-row,
    .bottom-row {
      grid-template-columns: 1fr;
    }
    .pad-grid {
      grid-template-columns: repeat(8, 1fr);
    }
  }
</style>
