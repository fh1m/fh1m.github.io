<script lang="ts">
  import SectionHead from '$lib/components/SectionHead.svelte';
  import WorkCard from '$lib/components/WorkCard.svelte';
  import RepoCard from '$lib/components/RepoCard.svelte';
  import Story from '$lib/components/Story.svelte';
  import Certificates from '$lib/components/Certificates.svelte';
  import { WORK } from '$lib/data/work';
  import { REPOS } from '$lib/data/repos';
  import { STORIES } from '$lib/data/stories';
  import { reveal } from '$lib/actions/reveal';
</script>

<svelte:head>
  <title>Work — Fahim Faisal</title>
  <meta name="description" content="Machines and systems Fahim Faisal built — AUVs, rocketry GNC, rover autonomy, security and ML." />
</svelte:head>

<div class="page container">
  <header class="ph" use:reveal>
    <p class="eyebrow">02 — Work</p>
    <h1 class="ph-title">Everything I’ve built<br />that had to <em>work.</em></h1>
    <p class="ph-lede prose">
      Underwater, in the air, on the ground, and in software. Competition vehicles, research code,
      firmware and tools — with real repositories and press behind them.
    </p>
  </header>

  <section class="section-sm">
    <SectionHead eyebrow="the machines" title="Featured work" meta="{WORK.length} projects" />
    <div class="grid">
      {#each WORK as w, i}
        <WorkCard item={w} delay={(i % 3) * 60} />
      {/each}
    </div>
  </section>

  <section class="section-sm">
    <SectionHead eyebrow="the whole shelf" title="On GitHub" meta="github.com/fh1m · 24 repos" />
    <div class="repo-grid">
      {#each REPOS as r, i}
        <RepoCard repo={r} delay={(i % 4) * 40} />
      {/each}
    </div>
  </section>
</div>

<Story story={STORIES[0]} />
<Story story={STORIES[1]} />
<Certificates />

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
  .section-sm {
    padding-bottom: var(--sp-12);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sp-3);
  }
  .repo-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--sp-3);
  }
  @media (max-width: 900px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .repo-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 560px) {
    .grid,
    .repo-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
