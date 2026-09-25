<script lang="ts">
  import { reveal } from '$lib/actions/reveal';
  import { LANGUAGES, LANGUAGE_NOTE } from '$lib/data/stats';

  const total = LANGUAGES.reduce((s, l) => s + l.count, 0);
  const R = 52;
  const C = 2 * Math.PI * R;
  let acc = 0;
  const segs = LANGUAGES.map((l) => {
    const frac = l.count / total;
    const seg = { ...l, frac, dash: frac * C, offset: -acc * C, pct: Math.round(frac * 100) };
    acc += frac;
    return seg;
  });
</script>

<div class="lr panel" use:reveal>
  <p class="silk">// public repositories · by primary language</p>
  <div class="lr-body">
    <div class="ring-wrap">
      <svg viewBox="0 0 120 120" class="ring">
        <circle cx="60" cy="60" r={R} class="track" />
        {#each segs as s, i}
          <circle
            cx="60"
            cy="60"
            r={R}
            class="seg"
            style="stroke:{s.color};stroke-dasharray:{s.dash} {C};stroke-dashoffset:{s.offset};animation-delay:{i * 90}ms"
          />
        {/each}
      </svg>
      <div class="ring-center">
        <span class="num big">{total}</span>
        <span class="mono lbl">REPOS</span>
      </div>
    </div>
    <ul class="legend">
      {#each segs as s}
        <li>
          <span class="sw" style="background:{s.color}"></span>
          <span class="ln">{s.name}</span>
          <span class="lc mono">{s.count}</span>
          <span class="lp mono">{s.pct}%</span>
        </li>
      {/each}
    </ul>
  </div>
  <p class="note">{LANGUAGE_NOTE}</p>
</div>

<style>
  .lr {
    padding: var(--sp-5);
    display: grid;
    gap: var(--sp-4);
    align-content: start;
  }
  .silk {
    color: var(--red-lit);
  }
  .lr-body {
    display: flex;
    gap: var(--sp-5);
    align-items: center;
    flex-wrap: wrap;
  }
  .ring-wrap {
    position: relative;
    width: 150px;
    height: 150px;
    flex: none;
  }
  .ring {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  .track {
    fill: none;
    stroke: #0d1017;
    stroke-width: 12;
  }
  .seg {
    fill: none;
    stroke-width: 12;
    transform-origin: center;
    animation: draw 0.9s var(--ease-out) both;
  }
  @keyframes draw {
    from {
      stroke-dasharray: 0 999;
    }
  }
  .ring-center {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    text-align: center;
  }
  .ring-center .big {
    font-size: 2rem;
    font-weight: 700;
    color: var(--ink);
  }
  .ring-center .lbl {
    font-size: 0.55rem;
    color: var(--ink-3);
    letter-spacing: 0.2em;
  }
  .legend {
    flex: 1;
    min-width: 180px;
    display: grid;
    gap: 0.35em;
  }
  .legend li {
    display: grid;
    grid-template-columns: 12px 1fr auto auto;
    align-items: center;
    gap: 0.7em;
    font-size: 0.82rem;
    padding-bottom: 0.35em;
    border-bottom: 1px solid var(--line);
  }
  .sw {
    width: 10px;
    height: 10px;
  }
  .ln {
    color: var(--ink);
  }
  .lc {
    color: var(--ink-3);
    font-size: 0.7rem;
  }
  .lp {
    color: var(--ink-2);
    font-size: 0.7rem;
    width: 3ch;
    text-align: right;
  }
  .note {
    font-size: 0.68rem;
    color: var(--ink-3);
    line-height: 1.5;
  }
  @media (prefers-reduced-motion: reduce) {
    .seg {
      animation: none;
    }
  }
</style>
