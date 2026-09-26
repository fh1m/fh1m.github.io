<script lang="ts">
  import SectionHead from './SectionHead.svelte';
  import WorkCard from './WorkCard.svelte';
  import { FEATURED_WORK, WORK } from '$lib/data/work';
</script>

<section class="section container">
  <SectionHead index="03 / SELECTED WORK" eyebrow="machines & systems" title="Things I built that had to work." meta="{FEATURED_WORK.length} of {WORK.length} projects" />

  <div class="grid">
    {#each FEATURED_WORK as w, i}
      <WorkCard item={w} delay={i * 60} />
    {/each}
  </div>

  <div class="more">
    <a class="key" href="/work" data-cursor>ALL WORK →</a>
    <a class="key" href="https://github.com/fh1m" target="_blank" rel="noopener" data-cursor>GITHUB · 24 REPOS →</a>
  </div>
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sp-3);
  }
  .more {
    display: flex;
    gap: var(--sp-3);
    justify-content: center;
    margin-top: var(--sp-6);
    flex-wrap: wrap;
  }
  @media (max-width: 900px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 560px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
