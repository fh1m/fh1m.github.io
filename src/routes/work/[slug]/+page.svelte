<script lang="ts">
  import { reveal } from '$lib/actions/reveal';
  import PartsTour from '$lib/components/PartsTour.svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
  const item = $derived(data.item);

  const statusName: Record<string, string> = {
    ok: 'OPERATIONAL',
    warn: 'PARTIAL',
    fail: 'DOWN',
    off: 'OFFLINE',
  };
</script>

<svelte:head>
  <title>{item.name} — Fahim Faisal</title>
  <meta name="description" content={item.summary} />
</svelte:head>

<article class="page container">
  <a class="back mono" href="/work" data-cursor>← ALL WORK</a>

  <header class="dh">
    <div class="dh-meta">
      <span class="chip {item.status}"><i class="dot"></i>{item.statusLabel}</span>
      <span class="silk">{item.category}</span>
      <span class="mono dim">{item.years}</span>
    </div>
    <h1 class="dh-title">{item.name}</h1>
    <p class="dh-tag">{item.tagline}</p>
  </header>

  {#if item.images?.[0]}
    <div class="hero-img" use:reveal>
      <img src={item.images[0].src} alt={item.images[0].alt} />
      {#if item.images[0].credit}<span class="credit mono">SOURCE — {item.images[0].credit}</span>{/if}
    </div>
  {/if}

  <div class="layout">
    <div class="main">
      <p class="summary">{item.summary}</p>
      {#if item.body}
        {#each item.body as para}
          {#if para.startsWith('## ')}
            <h2 class="h">{para.slice(3)}</h2>
          {:else if para.startsWith('> ')}
            <blockquote class="pull">{para.slice(2)}</blockquote>
          {:else}
            <p class="p">{para}</p>
          {/if}
        {/each}
      {/if}

      {#if item.images && item.images.length > 1}
        <div class="gallery" use:reveal>
          {#each item.images.slice(1) as im}
            <figure>
              <img src={im.src} alt={im.alt} loading="lazy" />
              <figcaption class="mono">{im.alt}{#if im.credit} · {im.credit}{/if}</figcaption>
            </figure>
          {/each}
        </div>
      {/if}
    </div>

    <aside class="side">
      {#if item.metrics}
        <div class="panel side-box">
          <p class="silk">// key numbers</p>
          <ul class="metrics">
            {#each item.metrics as m}
              <li><span class="m-v num">{m.value}</span><span class="m-l mono">{m.label}</span></li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if item.stack}
        <div class="panel side-box">
          <p class="silk">// stack</p>
          <ul class="stack">
            {#each item.stack as s}
              <li>
                <div class="s-row"><span>{s.name}</span><span class="mono">{s.weight}%</span></div>
                <div class="s-bar"><div class="s-fill" style="width:{s.weight}%"></div></div>
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if item.subsystems}
        <div class="panel side-box">
          <p class="silk">// subsystems</p>
          <ul class="subs">
            {#each item.subsystems as s}
              <li>
                <span class="mono">{s.name}</span>
                <span class="sub-st {s.status}"><i></i>{statusName[s.status]}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      <div class="panel side-box">
        <p class="silk">// links</p>
        <div class="links">
          {#each item.links as l}
            <a href={l.url} target="_blank" rel="noopener" class="key" data-cursor>{l.label} ↗</a>
          {/each}
        </div>
      </div>
    </aside>
  </div>

  <a class="next" href="/work/{data.next.slug}" use:reveal data-cursor>
    <span class="silk">// next</span>
    <span class="next-name">{data.next.name} →</span>
  </a>
</article>

{#if item.slug === 'mongla'}
  <PartsTour />
{/if}

<style>
  .page {
    padding: var(--sp-8) 0 0;
    max-width: 1100px;
  }
  .back {
    font-size: 0.68rem;
    color: var(--ink-3);
  }
  .back:hover {
    color: var(--sea-lit);
  }
  .dh {
    margin: var(--sp-5) 0 var(--sp-6);
  }
  .dh-meta {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    flex-wrap: wrap;
    margin-bottom: var(--sp-4);
  }
  .dh-meta .silk {
    color: var(--sea-lit);
  }
  .dh-title {
    font-size: var(--text-display);
    letter-spacing: -0.03em;
  }
  .dh-tag {
    font-size: var(--text-lede);
    color: var(--ink-2);
    max-width: 40ch;
    margin-top: var(--sp-3);
  }
  .hero-img {
    position: relative;
    margin-bottom: var(--sp-8);
    box-shadow: var(--e2);
    overflow: hidden;
  }
  .hero-img img {
    width: 100%;
    display: block;
  }
  .credit {
    position: absolute;
    bottom: 8px;
    right: 8px;
    font-size: 0.58rem;
    color: var(--ink-2);
    background: color-mix(in oklab, var(--surface-0) 78%, transparent);
    padding: 0.3em 0.6em;
    letter-spacing: 0.1em;
  }
  .layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: var(--sp-8);
    align-items: start;
  }
  .summary {
    font-size: var(--text-lede);
    color: var(--ink);
    line-height: 1.5;
    margin-bottom: var(--sp-5);
  }
  .h {
    font-size: var(--text-h3);
    margin: var(--sp-6) 0 var(--sp-3);
    color: var(--ink);
  }
  .p {
    color: var(--ink-2);
    line-height: 1.7;
    margin-bottom: var(--sp-4);
    max-width: var(--measure);
  }
  .pull {
    font-family: var(--font-display);
    font-size: var(--text-h3);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--sea-lit);
    border-left: 2px solid var(--red-lit);
    padding-left: var(--sp-4);
    margin: var(--sp-5) 0;
    line-height: 1.35;
  }
  .gallery {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-3);
    margin-top: var(--sp-6);
  }
  .gallery figure {
    box-shadow: var(--e1);
    overflow: hidden;
  }
  .gallery img {
    width: 100%;
    display: block;
  }
  .gallery figcaption {
    font-size: 0.6rem;
    color: var(--ink-3);
    padding: 0.6em;
  }
  .side {
    display: grid;
    gap: var(--sp-3);
    position: sticky;
    top: 84px;
  }
  .side-box {
    padding: var(--sp-4);
  }
  .side-box .silk {
    color: var(--red-lit);
    margin-bottom: var(--sp-3);
    display: block;
  }
  .metrics {
    display: grid;
    gap: 0.7em;
  }
  .metrics li {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 1px solid var(--line);
    padding-bottom: 0.5em;
  }
  .m-v {
    font-size: 1.1rem;
    color: var(--ink);
    font-weight: 700;
  }
  .m-l {
    font-size: 0.6rem;
    color: var(--ink-3);
  }
  .stack {
    display: grid;
    gap: 0.7em;
  }
  .s-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    color: var(--ink-2);
    margin-bottom: 0.3em;
  }
  .s-bar {
    height: 4px;
    background: var(--d0);
  }
  .s-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--sea), var(--sea-lit));
  }
  .subs {
    display: grid;
    gap: 0.5em;
  }
  .subs li {
    display: flex;
    justify-content: space-between;
    font-size: 0.72rem;
    color: var(--ink-2);
  }
  .sub-st {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    font-size: 0.6rem;
  }
  .sub-st i {
    width: 6px;
    height: 6px;
  }
  .sub-st.ok {
    color: var(--ok);
  }
  .sub-st.ok i {
    background: var(--ok);
  }
  .sub-st.warn {
    color: var(--amber-lit);
  }
  .sub-st.warn i {
    background: var(--amber-lit);
  }
  .sub-st.fail {
    color: var(--fail);
  }
  .sub-st.fail i {
    background: var(--fail);
  }
  .sub-st.off {
    color: var(--ink-3);
  }
  .sub-st.off i {
    background: var(--ink-3);
  }
  .links {
    display: grid;
    gap: 0.5em;
  }
  .links .key {
    justify-content: center;
  }
  .next {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: var(--sp-10) 0 var(--sp-8);
    padding: var(--sp-5) 0;
    border-top: 1px solid var(--line);
  }
  .next-name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-h3);
  }
  .next:hover .next-name {
    color: var(--sea-lit);
  }
  @media (max-width: 860px) {
    .layout {
      grid-template-columns: 1fr;
    }
    .side {
      position: static;
    }
    .gallery {
      grid-template-columns: 1fr;
    }
  }
</style>
