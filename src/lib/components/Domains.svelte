<script lang="ts">
  import { DOMAINS } from '$lib/data/domains';
  import { reveal } from '$lib/actions/reveal';
  import SectionHead from './SectionHead.svelte';
</script>

<section class="section container">
  <SectionHead index="02 / WHAT I BUILD" eyebrow="three mediums, one problem" title="Perception and control, wherever the machine has to move." />

  <div class="grid">
    {#each DOMAINS as d, i}
      <article class="dom sheet" style="--accent:{d.accent}" use:reveal={{ delay: i * 90 }} data-cursor>
        <div class="dom-head">
          <span class="dom-idx mono">{d.index}</span>
          <h3 class="dom-title">{d.title}</h3>
        </div>
        <p class="dom-sub">{d.sub}</p>
        <p class="dom-body">{d.body}</p>
        <ul class="dom-tags">
          {#each d.bullets as b}
            <li class="chip"><i class="dot" style="background:{d.accent}"></i>{b}</li>
          {/each}
        </ul>
      </article>
    {/each}
  </div>
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sp-4);
  }
  .dom {
    position: relative;
    padding: var(--sp-6);
    background: linear-gradient(180deg, var(--surface-1), var(--d1));
    box-shadow: var(--e1);
    display: grid;
    gap: var(--sp-3);
    align-content: start;
    transition:
      transform var(--dur) var(--ease-out),
      box-shadow var(--dur) var(--ease-out);
    overflow: hidden;
  }
  .dom::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--dur-slow) var(--ease-out);
  }
  .dom:hover {
    transform: translateY(-4px);
    box-shadow: var(--e2);
  }
  .dom:hover::after {
    transform: scaleX(1);
  }
  .dom-head {
    display: flex;
    align-items: baseline;
    gap: 0.7em;
  }
  .dom-idx {
    font-size: 0.72rem;
    color: var(--accent);
  }
  .dom-title {
    font-size: var(--text-h2);
  }
  .dom-sub {
    color: var(--ink);
    font-weight: 700;
    font-size: 0.95rem;
  }
  .dom-body {
    color: var(--ink-2);
    font-size: 0.9rem;
    line-height: 1.55;
  }
  .dom-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
    margin-top: var(--sp-2);
  }
  .dom-tags .chip::before,
  .dom-tags .chip::after {
    content: '';
  }
  .dom-tags .chip {
    gap: 0.5em;
  }
  @media (max-width: 860px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
