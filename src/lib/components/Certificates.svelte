<script lang="ts">
  import SectionHead from './SectionHead.svelte';
  import { reveal } from '$lib/actions/reveal';

  const certs = [
    { src: '/media/certs/robosub-2026.png', year: '2026', label: '29th Annual RoboSub', note: 'Two vehicles to the semi-finals' },
    { src: '/media/certs/robosub-2025.png', year: '2025', label: '28th Annual RoboSub', note: 'Semi-final + Entrepreneurship award' },
    { src: '/media/certs/robosub-2024.png', year: '2024', label: '27th Annual RoboSub', note: 'Woollett Aquatics Center, Irvine' },
  ];
</script>

<section class="section container">
  <SectionHead index="record / on paper" eyebrow="san diego, three years running" title="signed, dated, and in the water" meta="RoboNation" />
  <div class="grid">
    {#each certs as c, i}
      <figure class="cert" use:reveal={{ delay: i * 70 }} data-cursor>
        <div class="cert-img">
          <img src={c.src} alt="RoboSub {c.year} certificate of participation — Muhammad Fahim Faisal" loading="lazy" />
        </div>
        <figcaption>
          <span class="c-year num">{c.year}</span>
          <span class="c-label">{c.label}</span>
          <span class="c-note mono">{c.note}</span>
        </figcaption>
      </figure>
    {/each}
  </div>
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sp-4);
  }
  .cert {
    background: linear-gradient(180deg, var(--surface-1), var(--d1));
    box-shadow: var(--e1);
    padding: 8px;
    transition:
      transform var(--dur) var(--ease-out),
      box-shadow var(--dur) var(--ease-out);
  }
  .cert:hover {
    transform: translateY(-4px);
    box-shadow: var(--e2), var(--glow-signal);
  }
  .cert-img {
    background: #fff;
    overflow: hidden;
    box-shadow: var(--e-in);
  }
  .cert-img img {
    width: 100%;
    display: block;
  }
  figcaption {
    display: grid;
    gap: 0.25em;
    padding: 0.8em 0.4em 0.3em;
  }
  .c-year {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--sea-lit);
  }
  .c-label {
    color: var(--ink);
    font-size: 0.85rem;
  }
  .c-note {
    font-size: 0.62rem;
    color: var(--ink-3);
  }
  @media (max-width: 760px) {
    .grid {
      grid-template-columns: 1fr;
      max-width: 420px;
      margin-inline: auto;
    }
  }
</style>
