<script lang="ts">
  import SectionHead from './SectionHead.svelte';
  import { PUBLICATIONS } from '$lib/data/publications';
  import { reveal } from '$lib/actions/reveal';
</script>

<section class="section container">
  <SectionHead index="04 / PUBLISHED" eyebrow="peer-reviewed & indexed" title="Research, with my name on it." />

  <div class="pubs">
    {#each PUBLICATIONS as p, i}
      <a class="pub sheet" href={p.url} target="_blank" rel="noopener" use:reveal={{ delay: i * 80 }} data-cursor>
        <div class="pub-side">
          <span class="pub-venue silk">{p.venue}</span>
          <span class="pub-year num">{p.year}</span>
        </div>
        <div class="pub-main">
          <h3 class="pub-title">{p.title}</h3>
          <p class="pub-authors mono">{p.authors}</p>
          <p class="pub-role">{p.role}</p>
          <div class="pub-tags">
            {#each p.tags as t}<span class="t mono">{t}</span>{/each}
          </div>
          <span class="pub-go mono">READ THE PAPER ↗</span>
        </div>
      </a>
    {/each}
  </div>
</section>

<style>
  .pubs {
    display: grid;
    gap: var(--sp-3);
  }
  .pub {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: var(--sp-5);
    padding: var(--sp-6);
    background: linear-gradient(180deg, var(--surface-1), var(--d1));
    box-shadow: var(--e1);
    transition:
      transform var(--dur) var(--ease-out),
      box-shadow var(--dur) var(--ease-out);
  }
  .pub:hover {
    transform: translateY(-3px);
    box-shadow: var(--e2);
  }
  .pub-side {
    display: grid;
    gap: 0.4em;
    align-content: start;
    border-right: 1px solid var(--line);
    padding-right: var(--sp-4);
  }
  .pub-venue {
    color: var(--sea-lit);
    line-height: 1.5;
  }
  .pub-year {
    font-size: 2rem;
    font-weight: 700;
    color: var(--ink);
  }
  .pub-title {
    font-size: var(--text-h3);
    line-height: 1.25;
    margin-bottom: 0.5em;
  }
  .pub-authors {
    font-size: 0.7rem;
    color: var(--ink-3);
    margin-bottom: 0.7em;
  }
  .pub-role {
    color: var(--ink-2);
    font-size: 0.9rem;
    max-width: 60ch;
  }
  .pub-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    margin: 0.9em 0;
  }
  .pub-tags .t {
    font-size: 0.6rem;
    color: var(--ink-3);
    padding: 0.2em 0.5em;
    box-shadow: inset 0 0 0 1px var(--line);
  }
  .pub-go {
    font-size: 0.66rem;
    color: var(--red-lit);
    letter-spacing: 0.1em;
  }
  @media (max-width: 720px) {
    .pub {
      grid-template-columns: 1fr;
      gap: var(--sp-4);
    }
    .pub-side {
      border-right: none;
      border-bottom: 1px solid var(--line);
      padding-right: 0;
      padding-bottom: var(--sp-3);
      grid-template-columns: 1fr auto;
      align-items: baseline;
    }
  }
</style>
