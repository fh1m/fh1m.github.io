<script lang="ts">
  import SectionHead from './SectionHead.svelte';
  import Counter from './Counter.svelte';
  import Heatmap from './Heatmap.svelte';
  import LanguageRing from './LanguageRing.svelte';
  import { HEADLINE_STATS } from '$lib/data/stats';
  import { COMPETITIONS } from '$lib/data/press';
  import { WORK } from '$lib/data/work';
  import { PUBLICATIONS } from '$lib/data/publications';
  import { EXPERIENCE } from '$lib/data/experience';
  import { REPO_COUNT_TOTAL } from '$lib/data/repos';
  import { PROFILE } from '$lib/data/profile';
  import { reveal } from '$lib/actions/reveal';

  const achievements = [
    { v: String(WORK.length), l: 'projects shipped', accent: 'signal' },
    { v: String(EXPERIENCE.length), l: 'teams & roles', accent: 'amber' },
    { v: String(COMPETITIONS.length), l: 'competition results', accent: 'red' },
    { v: String(PUBLICATIONS.length), l: 'peer-reviewed papers', accent: 'water' },
    { v: String(REPO_COUNT_TOTAL), l: 'public repositories', accent: 'signal' },
  ];
</script>

<section class="section container" id="proof">
  <SectionHead index="01 / THE RECEIPTS" eyebrow="numbers, with their source" title="Proof of work, not adjectives." />

  <div class="tiles">
    {#each HEADLINE_STATS as s, i}
      <div class="tile sheet a-{s.accent}" use:reveal={{ delay: i * 70 }}>
        <Counter value={s.value} />
        <p class="tile-label">{s.label}</p>
        <p class="tile-note mono">{s.note}</p>
      </div>
    {/each}
  </div>

  <ul class="achv" use:reveal>
    {#each achievements as a, i}
      <li class="a-{a.accent}" style="--d:{i * 60}ms">
        <span class="a-v num">{a.v}</span>
        <span class="a-l">{a.l}</span>
      </li>
    {/each}
  </ul>

  <div class="charts">
    <Heatmap />
    <LanguageRing />
  </div>

  <div class="comps" use:reveal>
    <p class="silk">// competition record · press-verified</p>
    <ul class="comp-list">
      {#each COMPETITIONS as c}
        <li>
          <span class="c-year num">{c.year}</span>
          <span class="c-event">{c.event}</span>
          <span class="c-team mono">{c.team}</span>
          <span class="c-line">{c.line}</span>
        </li>
      {/each}
    </ul>
  </div>

  <div class="trajectory" use:reveal>
    <p class="tr-lede">“{PROFILE.thesis}”</p>
    <p class="tr-body">
      Every number above is a checkpoint, not a ceiling — the trajectory is world-class autonomy engineering:
      embodied intelligence that perceives, reasons and acts, built to automotive- and aerospace-grade
      reliability, open-sourced so the next person doesn’t start from zero. <span class="tr-status">{PROFILE.availability}.</span>
    </p>
  </div>
</section>

<style>
  .tiles {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--sp-3);
    margin-bottom: var(--sp-6);
  }
  .tile {
    padding: var(--sp-5);
    background: linear-gradient(180deg, var(--surface-1), var(--d1));
    box-shadow: var(--e1);
    display: grid;
    gap: 0.4em;
    align-content: start;
    position: relative;
    overflow: hidden;
  }
  .tile :global(.num) {
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
  }
  .a-red :global(.num) { color: var(--red-lit); }
  .a-water :global(.num) { color: var(--state-water); }
  .a-signal :global(.num) { color: var(--sea-lit); }
  .a-amber :global(.num) { color: var(--amber-lit); }
  .tile-label {
    font-size: 0.85rem;
    color: var(--ink);
    font-weight: 700;
  }
  .tile-note {
    font-size: 0.64rem;
    color: var(--ink-3);
    line-height: 1.5;
  }
  .achv {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1px;
    background: var(--line);
    box-shadow: var(--e1);
    margin-bottom: var(--sp-6);
  }
  .achv li {
    background: var(--d1);
    padding: var(--sp-4) var(--sp-3);
    display: grid;
    gap: 0.3em;
    text-align: center;
    justify-items: center;
  }
  .achv .a-v {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--ink);
  }
  .achv .a-signal .a-v { color: var(--sea-lit); }
  .achv .a-red .a-v { color: var(--red-lit); }
  .achv .a-amber .a-v { color: var(--amber-lit); }
  .achv .a-water .a-v { color: var(--state-water); }
  .achv .a-l {
    font-size: 0.62rem;
    color: var(--ink-3);
    letter-spacing: 0.04em;
  }
  .charts {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: var(--sp-3);
    margin-bottom: var(--sp-6);
  }
  .comps {
    border-top: 1px solid var(--line);
    padding-top: var(--sp-5);
  }
  .silk {
    color: var(--red-lit);
    margin-bottom: var(--sp-4);
  }
  .comp-list {
    display: grid;
    gap: 0;
  }
  .comp-list li {
    display: grid;
    grid-template-columns: 4rem 1.4fr 1fr 2fr;
    gap: 1em;
    align-items: baseline;
    padding: 0.9em 0;
    border-bottom: 1px solid var(--line);
  }
  .c-year {
    color: var(--sea-lit);
    font-size: 1rem;
  }
  .c-event {
    color: var(--ink);
    font-weight: 700;
  }
  .c-team {
    color: var(--ink-3);
    font-size: 0.7rem;
  }
  .c-line {
    color: var(--ink-2);
    font-size: 0.88rem;
  }
  .trajectory {
    margin-top: var(--sp-6);
    padding-top: var(--sp-5);
    border-top: 1px solid var(--line);
    display: grid;
    grid-template-columns: 0.7fr 1.3fr;
    gap: var(--sp-6);
  }
  .tr-lede {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-h3);
    color: var(--sea-lit);
    letter-spacing: -0.01em;
    line-height: 1.3;
  }
  .tr-body {
    color: var(--ink-2);
    line-height: 1.7;
    max-width: 62ch;
  }
  .tr-status {
    color: var(--ok);
  }
  @media (max-width: 900px) {
    .tiles {
      grid-template-columns: repeat(2, 1fr);
    }
    .achv {
      grid-template-columns: repeat(2, 1fr);
    }
    .charts {
      grid-template-columns: 1fr;
    }
    .comp-list li {
      grid-template-columns: 3rem 1fr;
      row-gap: 0.2em;
    }
    .c-team,
    .c-line {
      grid-column: 2;
    }
    .trajectory {
      grid-template-columns: 1fr;
    }
  }
</style>
