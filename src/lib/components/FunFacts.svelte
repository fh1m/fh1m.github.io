<script lang="ts">
  import { onMount } from 'svelte';
  import { FUNFACTS } from '$lib/data/funfacts';
  import { reveal } from '$lib/actions/reveal';

  let i = $state(0);
  let paused = $state(false);
  const f = $derived(FUNFACTS[i]);

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!paused) i = (i + 1) % FUNFACTS.length;
    }, 4200);
    return () => clearInterval(id);
  });
</script>

<section class="ff" use:reveal>
  <div class="container ff-in">
    <div class="ff-left">
      <span class="ff-cue mono">intermission</span>
      <span class="ff-sub mono">a fun fact, grounded in real engineering</span>
    </div>

    <button
      class="ff-card"
      onmouseenter={() => (paused = true)}
      onmouseleave={() => (paused = false)}
      onclick={() => (i = (i + 1) % FUNFACTS.length)}
      data-cursor
      aria-label="Next fun fact"
    >
      {#key i}
        <div class="ff-body">
          <div class="ff-stat num">{f.stat}</div>
          <p class="ff-line">{f.line}</p>
          <span class="ff-tag mono">// {f.tag}</span>
        </div>
      {/key}
      <div class="ff-dots">
        {#each FUNFACTS as _, k}<span class="d" class:on={k === i}></span>{/each}
      </div>
    </button>
  </div>
</section>

<style>
  .ff {
    border-block: 1px solid var(--line);
    background: color-mix(in oklab, var(--sea) 4%, transparent);
  }
  .ff-in {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: var(--sp-6);
    padding-block: var(--sp-8);
    align-items: center;
  }
  .ff-left {
    display: grid;
    gap: 0.4em;
  }
  .ff-cue {
    font-size: 0.66rem;
    letter-spacing: 0.24em;
    color: var(--red-lit);
  }
  .ff-sub {
    font-size: 0.6rem;
    color: var(--ink-3);
  }
  .ff-card {
    position: relative;
    text-align: left;
    padding: var(--sp-5) var(--sp-6);
    background: linear-gradient(180deg, var(--surface-1), var(--d1));
    box-shadow: var(--e1);
    min-height: 132px;
    display: grid;
    align-content: center;
  }
  .ff-card:hover {
    box-shadow: var(--e1), var(--glow-signal);
  }
  .ff-body {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--sp-5);
    align-items: center;
    animation: ff-in 0.5s var(--ease-out);
  }
  @keyframes ff-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }
  .ff-stat {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 700;
    color: var(--sea-lit);
    line-height: 1;
    white-space: nowrap;
  }
  .ff-line {
    color: var(--ink);
    font-size: 0.95rem;
    line-height: 1.5;
    max-width: 60ch;
  }
  .ff-tag {
    grid-column: 2;
    font-size: 0.62rem;
    color: var(--red-lit);
  }
  .ff-dots {
    position: absolute;
    top: var(--sp-4);
    right: var(--sp-5);
    display: flex;
    gap: 4px;
  }
  .ff-dots .d {
    width: 5px;
    height: 5px;
    background: var(--line-lit);
  }
  .ff-dots .d.on {
    background: var(--red-lit);
  }
  @media (max-width: 760px) {
    .ff-in {
      grid-template-columns: 1fr;
      gap: var(--sp-4);
    }
    .ff-body {
      grid-template-columns: 1fr;
      gap: var(--sp-2);
    }
    .ff-tag {
      grid-column: 1;
    }
  }
</style>
