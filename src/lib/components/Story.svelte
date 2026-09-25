<script lang="ts">
  import type { Story } from '$lib/data/stories';
  import DeviceFrame from './DeviceFrame.svelte';
  import { reveal } from '$lib/actions/reveal';
  let { story }: { story: Story } = $props();
</script>

<section class="story section" style="--ac:{story.accent}">
  <div class="container">
    <header class="st-head" use:reveal>
      <span class="eyebrow">{story.eyebrow}</span>
      <h2 class="st-title">{story.title}</h2>
      <p class="st-stand prose">{story.standfirst}</p>
    </header>

    <div class="beats">
      {#each story.beats as b, i}
        <div class="beat" class:flip={i % 2 === 1}>
          <div class="beat-media">
            {#if b.img}
              <DeviceFrame src={b.img} alt={b.caption ?? b.heading} label={b.label} caption={b.caption} credit={b.credit} fit={b.imgFit ?? 'cover'} />
            {/if}
          </div>
          <div class="beat-text" use:reveal>
            <span class="beat-n num">{String(i + 1).padStart(2, '0')} / {String(story.beats.length).padStart(2, '0')}</span>
            <h3 class="beat-h">{b.heading}</h3>
            <p class="beat-b">{b.body}</p>
            {#if b.pull}<p class="beat-pull">“{b.pull}”</p>{/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .story {
    border-top: 1px solid var(--line);
  }
  .st-head {
    max-width: 62ch;
    margin-bottom: var(--sp-10);
  }
  .st-title {
    font-size: var(--text-display);
    letter-spacing: -0.03em;
    margin: var(--sp-2) 0 var(--sp-4);
  }
  .st-stand {
    font-size: var(--text-lede);
    color: var(--ink-2);
    max-width: 66ch;
  }
  .beats {
    display: grid;
    gap: var(--sp-10);
  }
  .beat {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: var(--sp-8);
    align-items: center;
  }
  .beat.flip .beat-media {
    order: 2;
  }
  .beat-n {
    font-size: 0.66rem;
    color: var(--ac);
    letter-spacing: 0.1em;
  }
  .beat-h {
    font-size: var(--text-h2);
    letter-spacing: -0.02em;
    margin: 0.4em 0 0.5em;
  }
  .beat-b {
    color: var(--ink-2);
    line-height: 1.7;
    max-width: 52ch;
  }
  .beat-pull {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    color: var(--ac);
    border-left: 2px solid var(--ac);
    padding-left: 0.9em;
    margin-top: var(--sp-4);
    line-height: 1.5;
  }
  @media (max-width: 860px) {
    .beat {
      grid-template-columns: 1fr;
      gap: var(--sp-4);
    }
    .beat.flip .beat-media {
      order: 0;
    }
  }
</style>
