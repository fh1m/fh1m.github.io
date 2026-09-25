<script lang="ts">
  import { PROFILE } from '$lib/data/profile';
  import { reveal } from '$lib/actions/reveal';
  const marquee = ['REALITY', 'FIRST PRINCIPLES', 'PHYSICS GETS THE FINAL VOTE', 'OPEN SOURCE', 'STILL BUILDING', 'MEASURE THEN SHIP'];
</script>

<section class="mani section">
  <div class="marquee" aria-hidden="true">
    <div class="track">
      {#each [...marquee, ...marquee] as m}
        <span class="m-item">{m}</span>
        <span class="m-dot">✦</span>
      {/each}
    </div>
  </div>

  <div class="container">
    <div class="mani-grid">
      <p class="mani-lead" use:reveal>
        A short list of things I believe, and keep testing against the machine.
      </p>
      <ol class="mani-list">
        {#each PROFILE.manifesto as line, i}
          <li use:reveal={{ delay: i * 40 }}>
            <span class="n mono">{String(i + 1).padStart(2, '0')}</span>
            <span class="t">{line}</span>
          </li>
        {/each}
      </ol>
    </div>
  </div>
</section>

<style>
  .mani {
    border-bottom: 1px solid var(--line);
  }
  .marquee {
    overflow: hidden;
    border-block: 1px solid var(--line);
    padding: 0.8em 0;
    margin-bottom: var(--sp-10);
    background: color-mix(in oklab, var(--sea) 5%, transparent);
  }
  .track {
    display: flex;
    align-items: center;
    gap: 2rem;
    width: max-content;
    animation: slide 34s linear infinite;
  }
  .m-item {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.4rem, 4vw, 3rem);
    letter-spacing: -0.02em;
    color: transparent;
    -webkit-text-stroke: 1px var(--ink-3);
    white-space: nowrap;
  }
  .m-dot {
    color: var(--red-lit);
    font-size: 1rem;
  }
  @keyframes slide {
    to {
      transform: translateX(-50%);
    }
  }
  .mani-grid {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    gap: var(--sp-8);
  }
  .mani-lead {
    font-family: var(--font-display);
    font-size: var(--text-h2);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--ink);
    max-width: 16ch;
    position: sticky;
    top: 90px;
    align-self: start;
  }
  .mani-list {
    display: grid;
    gap: 0;
  }
  .mani-list li {
    display: flex;
    gap: 1.2em;
    align-items: baseline;
    padding: 0.9em 0;
    border-bottom: 1px solid var(--line);
  }
  .mani-list .n {
    font-size: 0.7rem;
    color: var(--red-lit);
    flex: none;
  }
  .mani-list .t {
    font-size: var(--text-lede);
    color: var(--ink);
  }
  .mani-list li:last-child .t {
    color: var(--sea-lit);
    font-style: italic;
  }
  @media (max-width: 760px) {
    .mani-grid {
      grid-template-columns: 1fr;
      gap: var(--sp-5);
    }
    .mani-lead {
      position: static;
    }
    @media (prefers-reduced-motion: reduce) {
      .track {
        animation: none;
      }
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .track {
      animation: none;
    }
  }
</style>
