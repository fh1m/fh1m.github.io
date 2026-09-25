<script lang="ts">
  import SectionHead from './SectionHead.svelte';
  import { VOICES, PRINCIPLES, AUTHOR_LINE } from '$lib/data/principles';
  import { reveal } from '$lib/actions/reveal';

  let sel = $state(1); // start on Hotz
  const v = $derived(VOICES[sel]);
  const maxDepth = Math.max(...VOICES.map((x) => x.depth));
</script>

<section class="section container">
  <SectionHead index="05 / SHOULDERS" eyebrow="the thinking behind the work" title="Standing on shoulders, as a dive." />

  <div class="pc-grid">
    <div class="dive panel">
      <div class="dive-scale">
        <div class="scale-line"></div>
        {#each VOICES as voice, i}
          <button
            class="stop"
            class:on={i === sel}
            style="top:{(voice.depth / (maxDepth + 8)) * 100}%"
            onclick={() => (sel = i)}
            data-cursor
            aria-label={voice.name}
          >
            <span class="tick"></span>
            <span class="stop-name mono">{voice.name}</span>
            <span class="stop-depth mono">{voice.depth}m</span>
          </button>
        {/each}
      </div>

      <div class="readout well">
        <div class="ro-head">
          <span class="ro-name">{v.name}</span>
          <span class="ro-depth mono">DEPTH {v.depth}M</span>
        </div>
        <blockquote class="ro-quote">“{v.quote}”</blockquote>
        {#if v.idea}<p class="ro-idea">{v.idea}</p>{/if}
        <div class="ro-foot">
          <span class="mono">{v.source}</span>
          {#if v.url}<a class="link" href={v.url} target="_blank" rel="noopener">SOURCE ↗</a>{/if}
        </div>
      </div>
    </div>

    <div class="principles">
      <p class="silk">// from my own commit log &amp; doctrines</p>
      <ul class="p-list">
        {#each PRINCIPLES as p, i}
          <li use:reveal={{ delay: (i % 6) * 40 }}>
            <span class="p-theme mono">{p.theme}</span>
            <span class="p-text">{p.text}</span>
            <span class="p-src mono">{p.source}</span>
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <blockquote class="author" use:reveal>
    <p>“{AUTHOR_LINE.text}”</p>
    <cite class="mono">— {AUTHOR_LINE.source}</cite>
  </blockquote>
</section>

<style>
  .pc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-4);
  }
  .dive {
    display: grid;
    grid-template-columns: 190px 1fr;
    gap: var(--sp-4);
    padding: var(--sp-5);
  }
  .dive-scale {
    position: relative;
    min-height: 340px;
  }
  .scale-line {
    position: absolute;
    left: 6px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(180deg, var(--line-lit), var(--sea));
  }
  .stop {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    gap: 0.5em;
    transform: translateY(-50%);
    color: var(--ink-3);
    white-space: nowrap;
  }
  .tick {
    width: 12px;
    height: 1px;
    background: var(--ink-3);
    flex: none;
  }
  .stop.on {
    color: var(--ink);
  }
  .stop.on .tick {
    width: 18px;
    height: 2px;
    background: var(--red-lit);
    box-shadow: 0 0 8px var(--cad-red);
  }
  .stop-name {
    font-size: 0.68rem;
  }
  .stop-depth {
    font-size: 0.58rem;
    color: var(--ink-3);
  }
  .stop:hover {
    color: var(--sea-lit);
  }
  .readout {
    padding: var(--sp-5);
    display: grid;
    align-content: start;
    gap: var(--sp-3);
  }
  .ro-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 1px solid var(--line);
    padding-bottom: 0.6em;
  }
  .ro-name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.2rem;
  }
  .ro-depth {
    font-size: 0.62rem;
    color: var(--red-lit);
  }
  .ro-quote {
    font-size: var(--text-quote);
    line-height: 1.35;
    color: var(--ink);
    font-style: italic;
  }
  .ro-idea {
    color: var(--ink-2);
    font-size: 0.9rem;
  }
  .ro-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1em;
    margin-top: auto;
    font-size: 0.66rem;
    color: var(--ink-3);
  }
  .ro-foot .link {
    font-size: 0.62rem;
  }
  .principles {
    padding: var(--sp-2) 0;
  }
  .principles .silk {
    color: var(--red-lit);
    margin-bottom: var(--sp-3);
  }
  .p-list {
    display: grid;
    gap: 0;
    max-height: 420px;
    overflow-y: auto;
    padding-right: 0.5em;
  }
  .p-list li {
    display: grid;
    gap: 0.3em;
    padding: 0.85em 0;
    border-bottom: 1px solid var(--line);
  }
  .p-theme {
    font-size: 0.58rem;
    color: var(--sea-lit);
    letter-spacing: 0.14em;
    text-transform: lowercase;
  }
  .p-text {
    color: var(--ink);
    font-size: 0.92rem;
    line-height: 1.45;
  }
  .p-src {
    font-size: 0.6rem;
    color: var(--ink-3);
  }
  .author {
    margin-top: var(--sp-8);
    text-align: center;
    max-width: 60ch;
    margin-inline: auto;
  }
  .author p {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-h3);
    letter-spacing: -0.02em;
    color: var(--ink);
    line-height: 1.3;
  }
  .author cite {
    display: block;
    margin-top: 1em;
    font-size: 0.7rem;
    color: var(--red-lit);
    font-style: normal;
  }
  @media (max-width: 900px) {
    .pc-grid {
      grid-template-columns: 1fr;
    }
    .dive {
      grid-template-columns: 160px 1fr;
    }
  }
  @media (max-width: 560px) {
    .dive {
      grid-template-columns: 1fr;
    }
    .dive-scale {
      min-height: 300px;
    }
  }
</style>
