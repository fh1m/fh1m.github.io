<script lang="ts">
  import { reveal } from '$lib/actions/reveal';

  const running = [
    { t: 'Mongla', d: 'An independent AUV autonomy stack — firmware, vision, EKF. Bench-validated; the next milestone is water.' },
    { t: 'BRACU Duburi', d: 'Engineering lead through the RoboSub 2026 campaign — two vehicles to the semi-finals.' },
    { t: 'Vision that survives murk', d: 'Domain generalization for underwater detection — the “Color is Also Class Evidence” line of work.' },
    { t: 'Cheap sensing, honest estimates', d: 'Turning a downward camera into a velocity sensor so a vehicle doesn’t need a DVL to know it moved.' },
  ];
  const next = [
    'World-class autonomy engineering',
    'Embodied intelligence — perceive, reason, act',
    'Integrated robotic computers (board + accelerator + firmware as one)',
    'Open-source autonomous systems',
    'Automotive- and aerospace-grade reliability',
    'Built from Bangladesh',
  ];
  const reading = [
    'The Creative Act — Rick Rubin',
    'tinygrad internals — geohot',
    'Anything on right-invariant EKFs',
    'RoboSub team codebases (BumblebeeAS)',
  ];
</script>

<svelte:head>
  <title>Now — Fahim Faisal</title>
  <meta name="description" content="What Fahim Faisal is focused on right now." />
</svelte:head>

<div class="page container">
  <header class="ph" use:reveal>
    <p class="eyebrow">06 — Now</p>
    <h1 class="ph-title">What I’m building<br /><em>right now.</em></h1>
    <p class="ph-lede prose">
      A <a class="link" href="https://nownownow.com/about" target="_blank" rel="noopener">now page</a> —
      a snapshot of current focus, updated when the focus changes. Last set September 2026.
    </p>
  </header>

  <div class="cols">
    <section class="col">
      <p class="silk sec">// currently running</p>
      <ul class="run-list">
        {#each running as r, i}
          <li use:reveal={{ delay: i * 50 }}>
            <span class="dot"></span>
            <div>
              <h2 class="r-t">{r.t}</h2>
              <p class="r-d">{r.d}</p>
            </div>
          </li>
        {/each}
      </ul>
    </section>

    <aside class="col side">
      <div class="box panel" use:reveal>
        <p class="silk sec">// next: aiming at</p>
        <ul class="next-list">
          {#each next as n}<li><span class="mono arr">→</span>{n}</li>{/each}
        </ul>
      </div>
      <div class="box panel" use:reveal>
        <p class="silk sec">// on the desk</p>
        <ul class="read-list">
          {#each reading as r}<li>{r}</li>{/each}
        </ul>
      </div>
    </aside>
  </div>
</div>

<style>
  .page {
    padding-top: var(--sp-10);
  }
  .ph {
    padding: var(--sp-6) 0 var(--sp-10);
    border-bottom: 1px solid var(--line);
    margin-bottom: var(--sp-10);
  }
  .ph-title {
    font-size: var(--text-display);
    letter-spacing: -0.03em;
    margin: var(--sp-3) 0 var(--sp-4);
  }
  .ph-title em {
    font-style: italic;
    font-family: var(--font-body);
    font-weight: 400;
    color: var(--red-lit);
  }
  .cols {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: var(--sp-8);
    align-items: start;
  }
  .sec {
    color: var(--red-lit);
    margin-bottom: var(--sp-5);
  }
  .run-list {
    display: grid;
    gap: 0;
  }
  .run-list li {
    display: grid;
    grid-template-columns: 16px 1fr;
    gap: var(--sp-3);
    padding: var(--sp-5) 0;
    border-bottom: 1px solid var(--line);
  }
  .run-list .dot {
    width: 9px;
    height: 9px;
    margin-top: 8px;
    background: var(--ok);
    box-shadow: 0 0 8px var(--ok);
    animation: pulse 2s var(--ease-in-out) infinite;
  }
  @keyframes pulse {
    50% {
      opacity: 0.4;
    }
  }
  .r-t {
    font-size: var(--text-h3);
  }
  .r-d {
    color: var(--ink-2);
    margin-top: 0.3em;
    line-height: 1.55;
    max-width: 52ch;
  }
  .side {
    display: grid;
    gap: var(--sp-3);
    position: sticky;
    top: 84px;
  }
  .box {
    padding: var(--sp-5);
  }
  .next-list,
  .read-list {
    display: grid;
    gap: 0.6em;
  }
  .next-list li {
    display: flex;
    gap: 0.6em;
    color: var(--ink);
    font-size: 0.92rem;
  }
  .arr {
    color: var(--sea-lit);
  }
  .read-list li {
    color: var(--ink-2);
    font-size: 0.88rem;
    padding-bottom: 0.5em;
    border-bottom: 1px solid var(--line);
  }
  @media (max-width: 860px) {
    .cols {
      grid-template-columns: 1fr;
    }
    .side {
      position: static;
    }
  }
</style>
