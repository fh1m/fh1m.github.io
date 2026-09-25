<script lang="ts">
  import type { WorkItem } from '$lib/data/work';
  import { reveal } from '$lib/actions/reveal';
  let { item, delay = 0, big = false }: { item: WorkItem; delay?: number; big?: boolean } = $props();
</script>

<a class="wc" class:big href="/work/{item.slug}" use:reveal={{ delay }} data-cursor>
  <div class="wc-media">
    {#if item.images?.[0]}
      <img src={item.images[0].src} alt={item.images[0].alt} loading="lazy" />
    {:else}
      <div class="wc-noimg">
        <span class="mono">{item.name}</span>
      </div>
    {/if}
    <span class="chip {item.status} wc-chip"><i class="dot"></i>{item.statusLabel}</span>
  </div>
  <div class="wc-body">
    <div class="wc-top">
      <h3 class="wc-name">{item.name}</h3>
      <span class="wc-year mono">{item.years}</span>
    </div>
    <p class="wc-cat silk">{item.category}</p>
    <p class="wc-tag">{item.tagline}</p>
    <div class="wc-tags">
      {#each item.tags.slice(0, 4) as t}<span class="t mono">{t}</span>{/each}
    </div>
    <span class="wc-go mono">OPEN DOSSIER →</span>
  </div>
</a>

<style>
  .wc {
    display: grid;
    grid-template-rows: auto 1fr;
    background: linear-gradient(180deg, var(--surface-1), var(--d1));
    box-shadow: var(--e1);
    overflow: hidden;
    transition:
      transform var(--dur) var(--ease-out),
      box-shadow var(--dur) var(--ease-out);
  }
  .wc:hover {
    transform: translateY(-4px);
    box-shadow: var(--e2);
  }
  .wc-media {
    position: relative;
    aspect-ratio: 16 / 9;
    background: var(--d0);
    overflow: hidden;
  }
  .wc-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(1.05) contrast(1.02);
    transition: transform var(--dur-slow) var(--ease-out);
  }
  .wc:hover .wc-media img {
    transform: scale(1.04);
  }
  .wc-noimg {
    display: grid;
    place-items: center;
    height: 100%;
    color: var(--ink-3);
    background:
      radial-gradient(60% 60% at 50% 40%, color-mix(in oklab, var(--sea) 18%, transparent), transparent),
      var(--d0);
  }
  .wc-chip {
    position: absolute;
    top: 10px;
    left: 10px;
    background: color-mix(in oklab, var(--surface-0) 78%, transparent);
    backdrop-filter: blur(4px);
    padding: 0.35em 0.6em;
  }
  .wc-chip::before,
  .wc-chip::after {
    content: '';
  }
  .wc-body {
    padding: var(--sp-5);
    display: grid;
    gap: 0.5em;
    align-content: start;
  }
  .wc-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1em;
  }
  .wc-name {
    font-size: var(--text-h3);
  }
  .wc-year {
    font-size: 0.66rem;
    color: var(--ink-3);
    white-space: nowrap;
  }
  .wc-cat {
    color: var(--red-lit);
    font-size: 0.6rem;
  }
  .wc-tag {
    color: var(--ink-2);
    font-size: 0.92rem;
    line-height: 1.5;
  }
  .wc-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    margin-top: 0.3em;
  }
  .wc-tags .t {
    font-size: 0.6rem;
    color: var(--ink-3);
    padding: 0.2em 0.5em;
    box-shadow: inset 0 0 0 1px var(--line);
  }
  .wc-go {
    margin-top: 0.6em;
    font-size: 0.66rem;
    color: var(--sea-lit);
    letter-spacing: 0.1em;
  }
  .big .wc-name {
    font-size: var(--text-h2);
  }
</style>
