<script lang="ts">
  import { SHOTS, LAB_CATS, type LabCat } from '$lib/data/gallery';
  import { reveal } from '$lib/actions/reveal';

  let filter = $state<LabCat | 'all'>('all');
  let open = $state(-1);
  const shown = $derived(filter === 'all' ? SHOTS : SHOTS.filter((s) => s.cat === filter));

  function close() { open = -1; }
  function step(d: number) { open = (open + d + shown.length) % shown.length; }
  function onKey(e: KeyboardEvent) {
    if (open < 0) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  }
</script>

<svelte:window onkeydown={onKey} />

<div class="lab-tabs" use:reveal>
  <button class="tab" class:on={filter === 'all'} onclick={() => (filter = 'all')} data-cursor>all <span class="ct mono">{SHOTS.length}</span></button>
  {#each LAB_CATS as c}
    {@const n = SHOTS.filter((s) => s.cat === c.key).length}
    {#if n}
      <button class="tab" class:on={filter === c.key} onclick={() => (filter = c.key)} data-cursor>{c.label} <span class="ct mono">{n}</span></button>
    {/if}
  {/each}
</div>

<div class="lab-grid">
  {#each shown as s, i (s.src)}
    <button class="shot" onclick={() => (open = i)} use:reveal={{ delay: (i % 6) * 40 }} data-cursor>
      <div class="shot-img" style="background:{s.fit === 'cover' ? 'transparent' : 'var(--d0)'}">
        <img src={s.src} alt={s.title} loading="lazy" style="object-fit:{s.fit ?? 'cover'}" />
      </div>
      <div class="shot-meta">
        <span class="shot-cat mono">{s.cat}</span>
        <span class="shot-title">{s.title}</span>
        <span class="shot-zoom mono">⤢</span>
      </div>
    </button>
  {/each}
</div>

{#if open >= 0}
  <div class="lb" role="dialog" aria-modal="true">
    <button class="lb-scrim" onclick={close} aria-label="Close"></button>
    <button class="lb-nav prev" onclick={() => step(-1)} aria-label="Previous" data-cursor>‹</button>
    <figure class="lb-fig">
      <img src={shown[open].src} alt={shown[open].title} />
      <figcaption>
        <span class="lb-cat mono">{shown[open].cat} · {open + 1}/{shown.length}</span>
        <span class="lb-title">{shown[open].title}</span>
        <span class="lb-cap">{shown[open].caption}</span>
      </figcaption>
    </figure>
    <button class="lb-nav next" onclick={() => step(1)} aria-label="Next" data-cursor>›</button>
    <button class="lb-close mono" onclick={close} data-cursor>esc ✕</button>
  </div>
{/if}

<style>
  .lab-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-2);
    margin-bottom: var(--sp-5);
  }
  .tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.4em 0.8em;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    color: var(--ink-3);
    box-shadow: var(--e1);
    background: var(--surface-1);
    transition: color var(--dur-fast), box-shadow var(--dur-fast);
  }
  .tab .ct {
    font-size: 0.58rem;
    color: var(--ink-3);
    opacity: 0.7;
  }
  .tab:hover {
    color: var(--ink);
  }
  .tab.on {
    color: #fff;
    box-shadow: var(--e1), inset 0 -2px 0 var(--red-lit);
  }
  .lab-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--sp-3);
  }
  .shot {
    text-align: left;
    background: linear-gradient(180deg, var(--surface-1), var(--d1));
    box-shadow: var(--e1);
    overflow: hidden;
    transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
  }
  .shot:hover {
    transform: translateY(-3px);
    box-shadow: var(--e2);
  }
  .shot-img {
    aspect-ratio: 16 / 10;
    overflow: hidden;
  }
  .shot-img img {
    width: 100%;
    height: 100%;
    transition: transform var(--dur-slow) var(--ease-out);
  }
  .shot:hover .shot-img img {
    transform: scale(1.04);
  }
  .shot-meta {
    display: flex;
    align-items: baseline;
    gap: 0.5em;
    padding: 0.6em 0.7em;
  }
  .shot-cat {
    font-size: 0.55rem;
    color: var(--sea-lit);
    letter-spacing: 0.12em;
  }
  .shot-title {
    font-size: 0.78rem;
    color: var(--ink);
    flex: 1;
  }
  .shot-zoom {
    color: var(--ink-3);
    font-size: 0.8rem;
  }
  .shot:hover .shot-zoom {
    color: var(--red-lit);
  }

  /* lightbox */
  .lb {
    position: fixed;
    inset: 0;
    z-index: var(--z-palette);
    display: grid;
    place-items: center;
    padding: clamp(1rem, 4vw, 3rem);
  }
  .lb-scrim {
    position: absolute;
    inset: 0;
    background: rgba(2, 3, 6, 0.9);
    border: none;
  }
  .lb-fig {
    position: relative;
    z-index: 1;
    max-width: min(1100px, 92vw);
    max-height: 86vh;
    display: grid;
    grid-template-rows: 1fr auto;
    gap: var(--sp-3);
    margin: 0;
  }
  .lb-fig img {
    max-width: 100%;
    max-height: 68vh;
    object-fit: contain;
    box-shadow: var(--e3);
    justify-self: center;
  }
  figcaption {
    display: grid;
    gap: 0.25em;
    text-align: center;
    max-width: 70ch;
    margin-inline: auto;
  }
  .lb-cat {
    font-size: 0.62rem;
    color: var(--red-lit);
    letter-spacing: 0.14em;
  }
  .lb-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--ink);
  }
  .lb-cap {
    color: var(--ink-2);
    font-size: 0.85rem;
    line-height: 1.5;
  }
  .lb-nav {
    position: absolute;
    z-index: 2;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    font-size: 1.6rem;
    color: var(--ink-2);
    background: var(--surface-2);
    box-shadow: var(--e1);
  }
  .lb-nav:hover {
    color: #fff;
  }
  .lb-nav.prev {
    left: clamp(0.5rem, 2vw, 2rem);
  }
  .lb-nav.next {
    right: clamp(0.5rem, 2vw, 2rem);
  }
  .lb-close {
    position: absolute;
    z-index: 2;
    top: clamp(0.5rem, 2vw, 1.5rem);
    right: clamp(0.5rem, 2vw, 1.5rem);
    font-size: 0.66rem;
    color: var(--ink-3);
    padding: 0.4em 0.7em;
    box-shadow: var(--e1);
    background: var(--surface-2);
  }
  @media (max-width: 900px) {
    .lab-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 520px) {
    .lab-grid {
      grid-template-columns: 1fr;
    }
    .lb-nav {
      display: none;
    }
  }
</style>
