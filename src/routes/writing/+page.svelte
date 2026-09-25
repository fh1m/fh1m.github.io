<script lang="ts">
  import { WRITING } from '$lib/data/writing';
  import { reveal } from '$lib/actions/reveal';
</script>

<svelte:head>
  <title>Writing — Fahim Faisal</title>
  <meta name="description" content="Notes from the work — perception, estimation, reliability, and first principles in real robotics." />
</svelte:head>

<div class="page container">
  <header class="ph" use:reveal>
    <p class="eyebrow">03 — Writing</p>
    <h1 class="ph-title">Notes from<br />the <em>work.</em></h1>
    <p class="ph-lede prose">
      Short, technical, honest. What building autonomy actually teaches you — about perception,
      estimation, latency, and refusing to lie when the machine can’t see.
    </p>
  </header>

  <ul class="list">
    {#each WRITING as e, i}
      <li use:reveal={{ delay: i * 40 }}>
        <a href="/writing/{e.slug}" data-cursor>
          <div class="row-top">
            <span class="thread silk">{e.thread}</span>
            <span class="meta mono">{e.date} · {e.minutes} min</span>
          </div>
          <h2 class="title">{e.title}</h2>
          <p class="dek">{e.dek}</p>
          <div class="tags">
            {#each e.tags as t}<span class="t mono">{t}</span>{/each}
            <span class="go mono">READ →</span>
          </div>
        </a>
      </li>
    {/each}
  </ul>
</div>

<style>
  .page {
    padding-top: var(--sp-10);
  }
  .ph {
    padding: var(--sp-6) 0 var(--sp-10);
    border-bottom: 1px solid var(--line);
    margin-bottom: var(--sp-8);
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
  .list {
    display: grid;
    gap: 0;
  }
  .list li a {
    display: grid;
    gap: 0.5em;
    padding: var(--sp-6) 0;
    border-bottom: 1px solid var(--line);
    transition: padding-left var(--dur) var(--ease-out);
  }
  .list li a:hover {
    padding-left: var(--sp-3);
  }
  .row-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .thread {
    color: var(--sea-lit);
  }
  .meta {
    font-size: 0.66rem;
    color: var(--ink-3);
  }
  .title {
    font-size: var(--text-h2);
    letter-spacing: -0.02em;
    max-width: 24ch;
  }
  .list li a:hover .title {
    color: var(--sea-lit);
  }
  .dek {
    color: var(--ink-2);
    max-width: 60ch;
    line-height: 1.55;
  }
  .tags {
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin-top: 0.4em;
  }
  .t {
    font-size: 0.6rem;
    color: var(--ink-3);
    padding: 0.2em 0.5em;
    box-shadow: inset 0 0 0 1px var(--line);
  }
  .go {
    margin-left: auto;
    font-size: 0.66rem;
    color: var(--red-lit);
  }
</style>
