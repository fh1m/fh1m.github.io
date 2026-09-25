<script lang="ts">
  import { onMount } from 'svelte';

  const knobs = [
    { label: 'PERCEPTION', v: 0.72 },
    { label: 'CONTROL', v: 0.5 },
    { label: 'NAV', v: 0.86 },
    { label: 'POWER', v: 0.63 },
  ];
  const faders = [
    { label: 'ROLL', v: 0.5 },
    { label: 'PITCH', v: 0.68 },
    { label: 'YAW', v: 0.42 },
  ];
  // 8-step sequencer; step 5 is the "measured" (red) accent.
  const steps = Array.from({ length: 8 }, (_, i) => i);

  let active = $state(0);
  let meter = $state(0.3);
  let running = $state(true);

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      running = false;
      return;
    }
    let step = 0;
    const seq = setInterval(() => {
      step = (step + 1) % 8;
      active = step;
    }, 300);
    let raf = 0;
    const tick = () => {
      meter = 0.25 + Math.abs(Math.sin(performance.now() / 400)) * 0.6 + Math.random() * 0.1;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      clearInterval(seq);
      cancelAnimationFrame(raf);
    };
  });

  const meterCells = 12;
</script>

<div class="console panel" data-cursor role="img" aria-label="An instrument console — knobs, faders, an LED meter and a running step sequencer">
  <div class="top-row">
    <div class="knobs">
      {#each knobs as k}
        <div class="knob-unit">
          <div class="knob" style="--rot:{(-135 + k.v * 270).toFixed(1)}deg">
            <div class="knob-face">
              <span class="ind"></span>
            </div>
          </div>
          <span class="k-label silk">{k.label}</span>
        </div>
      {/each}
    </div>

    <div class="meter well">
      <div class="meter-head">
        <span class="silk">SIGNAL</span>
        <span class="mono live">● LIVE</span>
      </div>
      <div class="meter-cells">
        {#each Array(meterCells) as _, i}
          <span
            class="cell"
            class:on={meter * meterCells > i}
            class:hot={i >= meterCells - 3}
          ></span>
        {/each}
      </div>
    </div>
  </div>

  <div class="bottom-row">
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

    <div class="pads">
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
        <span class="bpm mono">500 Hz</span>
      </div>
    </div>
  </div>
</div>

<style>
  .console {
    position: relative;
    padding: clamp(1rem, 2vw, 1.8rem);
    display: grid;
    gap: clamp(1rem, 2vw, 1.6rem);
    background: linear-gradient(180deg, #14181f, #0a0d13);
    box-shadow: var(--e3);
  }
  .console::before {
    content: '';
    position: absolute;
    inset: 6px;
    border: 1px solid rgba(255, 255, 255, 0.03);
    pointer-events: none;
  }
  .top-row,
  .bottom-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: clamp(1rem, 2.4vw, 2rem);
    align-items: center;
  }

  /* Knobs */
  .knobs {
    display: flex;
    gap: clamp(0.8rem, 2vw, 1.6rem);
  }
  .knob-unit {
    display: grid;
    justify-items: center;
    gap: 0.5em;
  }
  .knob {
    width: clamp(46px, 6vw, 66px);
    height: clamp(46px, 6vw, 66px);
    border-radius: 50%;
    background:
      repeating-conic-gradient(from 0deg, #2a2f38 0deg 6deg, #1b1f26 6deg 12deg);
    box-shadow: var(--e2), inset 0 0 0 3px #0b0e13;
    display: grid;
    place-items: center;
    transition: transform var(--dur) var(--ease-out);
  }
  .knob-unit:hover .knob {
    transform: rotate(12deg);
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
    top: 5px;
    left: 50%;
    width: 2px;
    height: 34%;
    margin-left: -1px;
    background: var(--sea-lit);
    box-shadow: 0 0 6px var(--sea);
  }
  .k-label,
  .f-label {
    font-size: 0.55rem;
    letter-spacing: 0.14em;
  }

  /* Meter */
  .meter {
    padding: 0.7em 0.8em;
    min-width: clamp(140px, 22vw, 220px);
  }
  .meter-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.6em;
  }
  .live {
    font-size: 0.55rem;
    color: var(--red-lit);
  }
  .meter-cells {
    display: flex;
    gap: 3px;
  }
  .cell {
    flex: 1;
    height: 18px;
    background: #12151c;
    box-shadow: inset 0 0 0 1px #000;
    transition: background 90ms;
  }
  .cell.on {
    background: var(--sea-lit);
    box-shadow: inset 0 0 0 1px #000, 0 0 6px var(--sea);
  }
  .cell.hot.on {
    background: var(--red-lit);
    box-shadow: inset 0 0 0 1px #000, 0 0 6px var(--cad-red);
  }

  /* Faders */
  .faders {
    display: flex;
    gap: clamp(0.9rem, 2vw, 1.4rem);
  }
  .fader-unit {
    display: grid;
    justify-items: center;
    gap: 0.5em;
  }
  .fader {
    position: relative;
    width: 14px;
    height: clamp(70px, 10vw, 96px);
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
    width: 20px;
    height: 12px;
    margin-left: -10px;
    background: linear-gradient(180deg, #d8d5cf, #a9a7a1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.7), inset 0 1px 0 #fff;
    transition: bottom var(--dur) var(--ease-out);
  }

  /* Pads */
  .pads {
    display: grid;
    gap: 0.8em;
  }
  .pad-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }
  .pad {
    aspect-ratio: 1.4;
    min-width: clamp(30px, 4vw, 44px);
    background: linear-gradient(180deg, #23272f, #14171d);
    box-shadow: var(--e1);
    display: grid;
    place-items: center;
    position: relative;
    transition:
      transform 80ms,
      box-shadow 120ms;
  }
  .pad-n {
    font-size: 0.55rem;
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
    gap: 0.5em;
  }
  .tbtn {
    width: 30px;
    height: 22px;
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
    border-left: 8px solid var(--ink-2);
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }
  .sq {
    width: 9px;
    height: 9px;
    background: var(--ink-2);
  }
  .rec .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--red-lit);
    box-shadow: 0 0 8px var(--cad-red);
  }
  .bpm {
    margin-left: auto;
    font-size: 0.6rem;
    color: var(--ink-3);
  }

  @media (max-width: 560px) {
    .top-row,
    .bottom-row {
      grid-template-columns: 1fr;
    }
    .meter {
      min-width: 0;
    }
  }
</style>
