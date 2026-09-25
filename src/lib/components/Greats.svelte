<script lang="ts">
  import SectionHead from './SectionHead.svelte';
  import { GREATS } from '$lib/data/greats';
  import { reveal } from '$lib/actions/reveal';

  let sel = $state(1); // hotz
  const g = $derived(GREATS[sel]);
  const initials = (n: string) => n.split(' ').map((w) => w[0]).join('').slice(0, 2);
</script>

<section class="section container">
  <SectionHead index="influences / shoulders" eyebrow="who taught me to build" title="ten people, one reflex each" meta="real work · real debt" />

  <div class="feature" use:reveal>
    <div class="portrait" style="--ac:{g.accent}">
      {#if g.img}
        <img src={g.img} alt={g.name} />
      {:else}
        <div class="mono-fallback"><span>{initials(g.name)}</span></div>
      {/if}
      <div class="scan"></div>
      <span class="years mono">{g.years}</span>
    </div>

    <div class="read">
      <div class="read-head">
        <h3 class="g-name">{g.name}</h3>
        <span class="g-role mono">{g.role}</span>
      </div>
      <blockquote class="g-quote" style="--ac:{g.accent}">“{g.quote}”</blockquote>
      <div class="g-rows">
        <div class="g-row">
          <span class="g-k silk">the work</span>
          <span class="g-v">{g.work}</span>
        </div>
        <div class="g-row">
          <span class="g-k silk">what it changed in me</span>
          <span class="g-v hl">{g.why}</span>
        </div>
      </div>
      {#if g.url}<a class="link src" href={g.url} target="_blank" rel="noopener">read the source ↗</a>{/if}
    </div>
  </div>

  <div class="strip">
    {#each GREATS as p, i}
      <button class="thumb" class:on={i === sel} style="--ac:{p.accent}" onclick={() => (sel = i)} data-cursor aria-label={p.name}>
        {#if p.img}
          <img src={p.img} alt={p.name} loading="lazy" />
        {:else}
          <span class="t-mono">{initials(p.name)}</span>
        {/if}
        <span class="t-name mono">{p.name.split(' ').slice(-1)}</span>
      </button>
    {/each}
  </div>
</section>

<style>
  .feature {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: var(--sp-6);
    align-items: stretch;
    margin-bottom: var(--sp-5);
  }
  .portrait {
    position: relative;
    aspect-ratio: 3 / 4;
    background: var(--d0);
    box-shadow: var(--e2), 0 0 0 1px color-mix(in oklab, var(--ac) 30%, transparent);
    overflow: hidden;
  }
  .portrait img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(0.35) contrast(1.05) brightness(0.95);
    transition: filter var(--dur-slow);
  }
  .feature:hover .portrait img {
    filter: grayscale(0) contrast(1.05);
  }
  .mono-fallback {
    display: grid;
    place-items: center;
    height: 100%;
    background: radial-gradient(80% 80% at 50% 35%, color-mix(in oklab, var(--ac) 22%, transparent), var(--d0));
  }
  .mono-fallback span {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 4rem;
    color: var(--ac);
    opacity: 0.85;
  }
  .scan {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(0deg, transparent 0 3px, rgba(0, 0, 0, 0.12) 3px 4px);
    mix-blend-mode: multiply;
    opacity: 0.5;
  }
  .years {
    position: absolute;
    bottom: 8px;
    left: 8px;
    font-size: 0.6rem;
    color: #fff;
    background: color-mix(in oklab, var(--surface-0) 70%, transparent);
    padding: 0.2em 0.5em;
  }
  .read {
    display: grid;
    align-content: center;
    gap: var(--sp-4);
  }
  .read-head {
    display: flex;
    align-items: baseline;
    gap: 1em;
    flex-wrap: wrap;
  }
  .g-name {
    font-size: var(--text-display);
    letter-spacing: -0.02em;
  }
  .g-role {
    font-size: 0.66rem;
    color: var(--sea-lit);
  }
  .g-quote {
    font-family: var(--font-display);
    font-size: var(--text-quote);
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: var(--ink);
    border-left: 3px solid var(--ac);
    padding-left: var(--sp-4);
  }
  .g-rows {
    display: grid;
    gap: var(--sp-3);
    max-width: 62ch;
  }
  .g-row {
    display: grid;
    gap: 0.3em;
  }
  .g-k {
    color: var(--ink-3);
  }
  .g-v {
    color: var(--ink-2);
    font-size: 0.9rem;
    line-height: 1.55;
  }
  .g-v.hl {
    color: var(--ink);
  }
  .src {
    font-size: 0.66rem;
  }
  .strip {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: var(--sp-2);
  }
  .thumb {
    position: relative;
    aspect-ratio: 1;
    background: var(--d0);
    box-shadow: var(--e1);
    overflow: hidden;
    filter: grayscale(1);
    opacity: 0.5;
    transition:
      opacity var(--dur),
      filter var(--dur),
      box-shadow var(--dur);
  }
  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .t-mono {
    display: grid;
    place-items: center;
    height: 100%;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--ac);
    background: color-mix(in oklab, var(--ac) 12%, var(--d0));
  }
  .thumb:hover,
  .thumb.on {
    opacity: 1;
    filter: grayscale(0);
    box-shadow: var(--e1), 0 0 0 1px var(--ac);
  }
  .t-name {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 0.5rem;
    text-align: center;
    color: #fff;
    background: color-mix(in oklab, var(--surface-0) 72%, transparent);
    padding: 0.15em;
    opacity: 0;
    transition: opacity var(--dur);
  }
  .thumb.on .t-name,
  .thumb:hover .t-name {
    opacity: 1;
  }
  @media (max-width: 820px) {
    .feature {
      grid-template-columns: 1fr;
    }
    .portrait {
      max-width: 240px;
    }
    .strip {
      grid-template-columns: repeat(5, 1fr);
    }
  }
</style>
