<script lang="ts">
  import type { PageData } from './$types';
  import { reveal } from '$lib/actions/reveal';
  import { inlineMd } from '$lib/inlineMd';
  let { data }: { data: PageData } = $props();
  const e = $derived(data.essay);
</script>

<svelte:head>
  <title>{e.title} — Fahim Faisal</title>
  <meta name="description" content={e.dek} />
</svelte:head>

<article class="page container">
  <a class="back mono" href="/writing" data-cursor>← WRITING</a>

  <header class="ah">
    <div class="ah-meta">
      <span class="thread silk">{e.thread}</span>
      <span class="mono dim">{e.date} · {e.minutes} min read</span>
    </div>
    <h1 class="ah-title">{e.title}</h1>
    <p class="ah-dek">{e.dek}</p>
  </header>

  <div class="body">
    {#each e.body as para}
      {#if para.startsWith('## ')}
        <h2 class="h">{para.slice(3)}</h2>
      {:else if para.startsWith('> ')}
        <blockquote class="pull">{@html inlineMd(para.slice(2))}</blockquote>
      {:else}
        <p class="p">{@html inlineMd(para)}</p>
      {/if}
    {/each}
  </div>

  <a class="next" href="/writing/{data.next.slug}" use:reveal data-cursor>
    <span class="silk">// next note</span>
    <span class="next-name">{data.next.title} →</span>
  </a>
</article>

<style>
  .page {
    padding: var(--sp-8) 0 0;
    max-width: 760px;
  }
  .back {
    font-size: 0.68rem;
    color: var(--ink-3);
  }
  .back:hover {
    color: var(--sea-lit);
  }
  .ah {
    margin: var(--sp-5) 0 var(--sp-8);
    padding-bottom: var(--sp-6);
    border-bottom: 1px solid var(--line);
  }
  .ah-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: var(--sp-4);
  }
  .thread {
    color: var(--sea-lit);
  }
  .ah-title {
    font-size: var(--text-h1);
    letter-spacing: -0.03em;
    line-height: 1.05;
  }
  .ah-dek {
    font-size: var(--text-lede);
    color: var(--ink-2);
    margin-top: var(--sp-4);
    line-height: 1.5;
  }
  .body {
    font-size: 1.075rem;
  }
  .h {
    font-size: var(--text-h3);
    margin: var(--sp-6) 0 var(--sp-3);
    color: var(--ink);
  }
  .p {
    color: var(--ink-2);
    line-height: 1.75;
    margin-bottom: var(--sp-4);
  }
  .p :global(code),
  .pull :global(code) {
    font-family: var(--font-mono);
    font-size: 0.88em;
    color: var(--sea-lit);
    background: color-mix(in oklab, var(--sea) 12%, transparent);
    padding: 0.1em 0.35em;
  }
  .p :global(strong) {
    color: var(--ink);
    font-weight: 700;
  }
  .p :global(em) {
    font-style: italic;
    color: var(--ink);
  }
  .pull {
    font-family: var(--font-display);
    font-size: var(--text-h3);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--sea-lit);
    border-left: 2px solid var(--red-lit);
    padding-left: var(--sp-4);
    margin: var(--sp-6) 0;
    line-height: 1.35;
  }
  .next {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: var(--sp-10) 0 var(--sp-8);
    padding-top: var(--sp-5);
    border-top: 1px solid var(--line);
    gap: 1em;
  }
  .next-name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-h3);
    text-align: right;
  }
  .next:hover .next-name {
    color: var(--sea-lit);
  }
</style>
