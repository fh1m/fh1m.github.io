<script lang="ts">
  import SectionHead from './SectionHead.svelte';
  import Counter from './Counter.svelte';
  import Heatmap from './Heatmap.svelte';
  import LanguageRing from './LanguageRing.svelte';
  import { HEADLINE_STATS } from '$lib/data/stats';
  import { COMPETITIONS } from '$lib/data/press';
  import { reveal } from '$lib/actions/reveal';
</script>

<section class="section container" id="proof">
  <SectionHead index="03 / THE RECEIPTS" eyebrow="numbers, with their source" title="Proof of work, not adjectives." />

  <div class="tiles">
    {#each HEADLINE_STATS as s, i}
      <div class="tile sheet a-{s.accent}" use:reveal={{ delay: i * 70 }}>
        <Counter value={s.value} />
        <p class="tile-label">{s.label}</p>
        <p class="tile-note mono">{s.note}</p>
      </div>
    {/each}
  </div>

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
  @media (max-width: 900px) {
    .tiles {
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
  }
</style>
