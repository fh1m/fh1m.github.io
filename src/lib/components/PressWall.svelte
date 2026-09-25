<script lang="ts">
  import SectionHead from './SectionHead.svelte';
  import { PRESS } from '$lib/data/press';
  import { reveal } from '$lib/actions/reveal';
</script>

<section class="section container">
  <SectionHead index="03 / IN THE PRESS" eyebrow="the work, covered" title="When the machine works, the news notices." meta="8 articles · 5 outlets" />

  <div class="wall">
    {#each PRESS as p, i}
      <a class="pc" class:has-img={!!p.image} href={p.url} target="_blank" rel="noopener" use:reveal={{ delay: i * 50 }} data-cursor>
        {#if p.image}
          <div class="pc-img">
            <img src={p.image} alt={p.title} loading="lazy" />
          </div>
        {/if}
        <div class="pc-body">
          <div class="pc-top">
            <span class="pc-src silk">{p.source}</span>
            <span class="pc-year mono">{p.year}</span>
          </div>
          <p class="pc-title">{p.title}</p>
          <span class="pc-go mono">READ ↗</span>
        </div>
      </a>
    {/each}
  </div>
</section>

<style>
  .wall {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--sp-3);
  }
  .pc {
    display: grid;
    grid-template-rows: auto 1fr;
    background: linear-gradient(180deg, var(--surface-1), var(--d1));
    box-shadow: var(--e1);
    overflow: hidden;
    transition:
      transform var(--dur) var(--ease-out),
      box-shadow var(--dur) var(--ease-out);
  }
  .pc:hover {
    transform: translateY(-4px);
    box-shadow: var(--e2);
  }
  /* first (big) card spans 2 cols + 2 rows when it has an image */
  .wall > .pc:first-child {
    grid-column: span 2;
    grid-row: span 2;
  }
  .pc-img {
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--d0);
  }
  .pc:first-child .pc-img {
    aspect-ratio: 16 / 10;
  }
  .pc-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--dur-slow) var(--ease-out);
  }
  .pc:hover .pc-img img {
    transform: scale(1.05);
  }
  .pc-body {
    padding: var(--sp-4);
    display: grid;
    gap: 0.5em;
    align-content: space-between;
  }
  .pc-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .pc-src {
    color: var(--sea-lit);
  }
  .pc-year {
    font-size: 0.64rem;
    color: var(--ink-3);
  }
  .pc-title {
    font-size: 0.9rem;
    color: var(--ink);
    line-height: 1.4;
  }
  .pc:first-child .pc-title {
    font-size: var(--text-h3);
    font-family: var(--font-display);
    font-weight: 700;
  }
  .pc-go {
    font-size: 0.62rem;
    color: var(--ink-3);
    letter-spacing: 0.1em;
  }
  .pc:hover .pc-go {
    color: var(--red-lit);
  }
  @media (max-width: 900px) {
    .wall {
      grid-template-columns: repeat(2, 1fr);
    }
    .wall > .pc:first-child {
      grid-column: span 2;
      grid-row: auto;
    }
  }
  @media (max-width: 520px) {
    .wall {
      grid-template-columns: 1fr;
    }
    .wall > .pc:first-child {
      grid-column: auto;
    }
  }
</style>
