<script lang="ts">
  import { LOG } from '$lib/data/timeline';
  import { reveal } from '$lib/actions/reveal';

  const kindColor: Record<string, string> = {
    tag: 'var(--amber-lit)',
    merge: 'var(--state-soft)',
    branch: 'var(--state-water)',
    commit: 'var(--sea-lit)',
  };
</script>

<svelte:head>
  <title>Log — Fahim Faisal</title>
  <meta name="description" content="The career as a commit history — how Fahim Faisal got from first internship to an independent AUV stack." />
</svelte:head>

<div class="page container">
  <header class="ph" use:reveal>
    <p class="eyebrow">04 — Log</p>
    <h1 class="ph-title">git log <span class="dim">--author=</span><em>fh1m</em></h1>
    <p class="ph-lede prose">
      The career, as a commit history. Newest first. Every entry is a real thing that shipped,
      competed, or got tested.
    </p>
  </header>

  <div class="graph">
    {#each LOG as c, i}
      <div class="node" use:reveal={{ delay: (i % 8) * 30 }}>
        <div class="rail">
          <span class="dot" class:tag={c.kind === 'tag'} style="--c:{kindColor[c.kind]}"></span>
          {#if i < LOG.length - 1}<span class="line"></span>{/if}
        </div>
        <div class="entry">
          <div class="entry-top">
            <span class="hash mono">{c.hash}</span>
            <span class="branch mono" style="--c:{kindColor[c.kind]}">{c.kind === 'merge' ? 'merge:' : ''}{c.branch}</span>
            {#if c.refs}
              {#each c.refs as r}<span class="ref mono">{r}</span>{/each}
            {/if}
            <span class="date mono">{c.date}</span>
          </div>
          <h2 class="title">{c.title}</h2>
          <p class="body">{c.body}</p>
        </div>
      </div>
    {/each}
  </div>

  <p class="foot mono">— end of history · <a class="link" href="https://github.com/fh1m" target="_blank" rel="noopener">full log on github ↗</a></p>
</div>

<style>
  .page {
    padding-top: var(--sp-10);
    max-width: 900px;
  }
  .ph {
    padding: var(--sp-6) 0 var(--sp-8);
    border-bottom: 1px solid var(--line);
    margin-bottom: var(--sp-8);
  }
  .ph-title {
    font-size: var(--text-h1);
    font-family: var(--font-mono);
    font-weight: 700;
    letter-spacing: -0.01em;
    margin: var(--sp-3) 0 var(--sp-4);
  }
  .ph-title em {
    font-style: normal;
    color: var(--red-lit);
  }
  .graph {
    display: grid;
  }
  .node {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: var(--sp-4);
  }
  .rail {
    position: relative;
    display: flex;
    justify-content: center;
  }
  .dot {
    width: 13px;
    height: 13px;
    margin-top: 4px;
    border-radius: 50%;
    background: var(--surface-0);
    border: 2px solid var(--c);
    box-shadow: 0 0 8px color-mix(in oklab, var(--c) 60%, transparent);
    z-index: 1;
    flex: none;
  }
  .dot.tag {
    border-radius: 2px;
    transform: rotate(45deg);
  }
  .line {
    position: absolute;
    top: 14px;
    bottom: -14px;
    width: 2px;
    background: var(--line-lit);
  }
  .entry {
    padding-bottom: var(--sp-6);
  }
  .entry-top {
    display: flex;
    align-items: center;
    gap: 0.6em;
    flex-wrap: wrap;
    margin-bottom: 0.4em;
  }
  .hash {
    font-size: 0.68rem;
    color: var(--amber-lit);
  }
  .branch {
    font-size: 0.64rem;
    color: var(--c);
    padding: 0.15em 0.5em;
    box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--c) 40%, transparent);
  }
  .ref {
    font-size: 0.6rem;
    color: var(--ink);
    background: var(--surface-2);
    padding: 0.15em 0.5em;
    box-shadow: var(--e1);
  }
  .date {
    margin-left: auto;
    font-size: 0.64rem;
    color: var(--ink-3);
  }
  .title {
    font-size: var(--text-h3);
    letter-spacing: -0.01em;
  }
  .body {
    color: var(--ink-2);
    font-size: 0.92rem;
    line-height: 1.6;
    margin-top: 0.3em;
    max-width: 60ch;
  }
  .foot {
    color: var(--ink-3);
    font-size: 0.72rem;
    padding: var(--sp-4) 0 var(--sp-8);
  }
  @media (max-width: 560px) {
    .date {
      margin-left: 0;
    }
  }
</style>
