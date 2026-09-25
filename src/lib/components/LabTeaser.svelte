<script lang="ts">
  import { SHOTS } from '$lib/data/gallery';
  import { reveal } from '$lib/actions/reveal';
  const picks = ['mission-control', 'dualcam-fusion', 'meghdut-tui-1', 'sim-gate-a', 'pool-gate', 'sonar-ping360']
    .map((n) => SHOTS.find((s) => s.src.includes(n)))
    .filter(Boolean) as typeof SHOTS;
</script>

<section class="lt section container" use:reveal>
  <a class="lt-in" href="/lab" data-cursor>
    <div class="lt-copy">
      <span class="eyebrow">the lab</span>
      <h2 class="lt-title">real frames from the<br />running machine →</h2>
      <p class="lt-sub mono">{SHOTS.length} screenshots · perception · telemetry · sim · water</p>
    </div>
    <div class="lt-strip">
      {#each picks as p}
        <div class="lt-cell"><img src={p.src} alt={p.title} loading="lazy" /></div>
      {/each}
    </div>
  </a>
</section>

<style>
  .lt-in {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: var(--sp-6);
    align-items: center;
    padding: var(--sp-6);
    background: linear-gradient(180deg, var(--surface-1), var(--d1));
    box-shadow: var(--e1);
    transition: box-shadow var(--dur), transform var(--dur);
  }
  .lt-in:hover {
    box-shadow: var(--e2), var(--glow-signal);
    transform: translateY(-3px);
  }
  .lt-title {
    font-size: var(--text-h1);
    letter-spacing: -0.02em;
    margin: var(--sp-2) 0;
  }
  .lt-in:hover .lt-title {
    color: var(--sea-lit);
  }
  .lt-sub {
    font-size: 0.66rem;
    color: var(--ink-3);
  }
  .lt-strip {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 4px;
  }
  .lt-cell {
    aspect-ratio: 3 / 4;
    background: var(--d0);
    overflow: hidden;
    box-shadow: var(--e1);
  }
  .lt-cell img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(1.05);
    transition: transform var(--dur-slow);
  }
  .lt-in:hover .lt-cell img {
    transform: scale(1.06);
  }
  @media (max-width: 760px) {
    .lt-in {
      grid-template-columns: 1fr;
    }
    .lt-strip {
      grid-template-columns: repeat(6, 1fr);
    }
  }
</style>
