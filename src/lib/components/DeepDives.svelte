<script lang="ts">
  import SectionHead from './SectionHead.svelte';
  import TerminalBlock from './TerminalBlock.svelte';
  import CompareTable from './CompareTable.svelte';
  import { DEEPDIVES } from '$lib/data/deepdives';
  import { reveal } from '$lib/actions/reveal';
</script>

<section class="section container">
  <SectionHead index="proof / engineering" eyebrow="measured, not claimed" title="five real decisions, with the numbers that settled them" meta="from the running stack" />

  <div class="dives">
    {#each DEEPDIVES as d, i}
      <article class="dive" use:reveal>
        <div class="dive-l">
          <div class="dive-head">
            <span class="dive-idx num">{d.index}</span>
            <span class="dive-kick silk">{d.kicker}</span>
          </div>
          <h3 class="dive-title">{d.title}</h3>
          <p class="dive-lede">{d.lede}</p>
          <div class="dive-body">
            {#each d.body as p}
              {#if p.startsWith('> ')}
                <p class="pull">{p.slice(2)}</p>
              {:else}
                <p class="p">{p}</p>
              {/if}
            {/each}
          </div>
          <p class="dive-src mono">// source — {d.source}</p>
        </div>

        <div class="dive-r">
          {#if d.stats}
            <div class="statgrid">
              {#each d.stats as s}
                <div class="stat sheet">
                  <span class="s-v num">{s.v}</span>
                  <span class="s-l mono">{s.l}</span>
                </div>
              {/each}
            </div>
          {/if}
          {#if d.table}
            <CompareTable table={d.table} />
          {/if}
          {#if d.terminal}
            <TerminalBlock lines={d.terminal} title={d.id} />
          {/if}
        </div>
      </article>
    {/each}
  </div>
</section>

<style>
  .dives {
    display: grid;
    gap: var(--sp-8);
  }
  .dive {
    display: grid;
    grid-template-columns: 0.95fr 1.05fr;
    gap: var(--sp-8);
    align-items: start;
    padding-bottom: var(--sp-8);
    border-bottom: 1px solid var(--line);
  }
  .dive:last-child {
    border-bottom: none;
  }
  .dive:nth-child(even) .dive-l {
    order: 2;
  }
  .dive-head {
    display: flex;
    align-items: baseline;
    gap: 0.8em;
    margin-bottom: var(--sp-3);
  }
  .dive-idx {
    font-size: 1.2rem;
    color: var(--red-lit);
  }
  .dive-kick {
    color: var(--sea-lit);
  }
  .dive-title {
    font-size: var(--text-h2);
    letter-spacing: -0.02em;
    margin-bottom: var(--sp-3);
  }
  .dive-lede {
    font-size: var(--text-lede);
    color: var(--ink);
    line-height: 1.5;
    margin-bottom: var(--sp-4);
  }
  .dive-body .p {
    color: var(--ink-2);
    line-height: 1.7;
    margin-bottom: var(--sp-3);
    max-width: 58ch;
  }
  .pull {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    color: var(--sea-lit);
    border-left: 2px solid var(--red-lit);
    padding-left: 0.9em;
    margin: var(--sp-4) 0;
    line-height: 1.5;
  }
  .dive-src {
    font-size: 0.62rem;
    color: var(--ink-3);
    margin-top: var(--sp-3);
  }
  .dive-r {
    display: grid;
    gap: var(--sp-3);
    position: sticky;
    top: 76px;
  }
  .statgrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--sp-2);
  }
  .stat {
    padding: var(--sp-4);
    background: linear-gradient(180deg, var(--surface-1), var(--d1));
    box-shadow: var(--e1);
    display: grid;
    gap: 0.3em;
  }
  .s-v {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
  }
  .s-l {
    font-size: 0.6rem;
    color: var(--ink-3);
    line-height: 1.4;
  }
  @media (max-width: 900px) {
    .dive {
      grid-template-columns: 1fr;
      gap: var(--sp-5);
    }
    .dive:nth-child(even) .dive-l {
      order: 0;
    }
    .dive-r {
      position: static;
    }
  }
</style>
