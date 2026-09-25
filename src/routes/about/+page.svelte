<script lang="ts">
  import { EXPERIENCE, EDUCATION } from '$lib/data/experience';
  import { PROFILE } from '$lib/data/profile';
  import { reveal } from '$lib/actions/reveal';

  const tagColor: Record<string, string> = {
    underwater: 'var(--sea-lit)',
    air: 'var(--red-lit)',
    ground: 'var(--amber-lit)',
    web: 'var(--state-water)',
    club: 'var(--ink-3)',
  };
</script>

<svelte:head>
  <title>About — Fahim Faisal</title>
  <meta name="description" content="Fahim Faisal — autonomy engineer from Dhaka. The continuity story: rockets, rovers, and underwater vehicles." />
</svelte:head>

<div class="page container">
  <header class="ph">
    <div class="ph-copy" use:reveal>
      <p class="eyebrow">05 — About</p>
      <h1 class="ph-title">One question, asked<br />in three <em>mediums.</em></h1>
      <p class="prose">
        I’m Fahim — an autonomy engineer from Dhaka. I started where machines are hardest to hide:
        something that has to leave the ground. Rockets taught me guidance and control; rovers taught
        me manipulation and vision; underwater vehicles taught me to trust nothing I hadn’t measured.
        The thread through all of it is the same question — <strong>how does a machine understand the
        world well enough to act in it?</strong>
      </p>
      <p class="prose">
        Today I build the whole stack: the firmware on the board, the estimator that fuses cheap
        sensors, and the neural net that sees. I care about the seam between software and physics —
        the place where an elegant idea meets a vehicle that either moves or doesn’t.
      </p>
    </div>
    <div class="ph-card panel" use:reveal>
      <img class="avatar" src="/media/avatar.jpg" alt="Fahim Faisal" />
      <div class="id">
        <p class="id-name">{PROFILE.fullName}</p>
        <p class="id-role mono">{PROFILE.role}</p>
        <ul class="id-rows mono">
          <li><span>LOCATION</span><span>{PROFILE.location}</span></li>
          <li><span>FOCUS</span><span>Autonomy · robotics · ML</span></li>
          <li><span>STATUS</span><span class="run">● {PROFILE.availability}</span></li>
        </ul>
      </div>
    </div>
  </header>

  <section class="xp">
    <p class="silk sec-lbl">// experience</p>
    <ul class="xp-list">
      {#each EXPERIENCE as r, i}
        <li class="xp-item" class:subtle={r.subtle} use:reveal={{ delay: (i % 5) * 40 }} style="--c:{tagColor[r.tag]}">
          <div class="xp-head">
            <div>
              <h2 class="xp-org">{#if r.url}<a href={r.url} target="_blank" rel="noopener" data-cursor>{r.org}</a>{:else}{r.org}{/if}</h2>
              <p class="xp-title-line">{r.title}</p>
            </div>
            <div class="xp-when mono">
              <span class="dates">{r.dates}</span>
              <span class="loc">{r.location}</span>
            </div>
          </div>
          <ul class="pts">
            {#each r.points as p}<li>{p}</li>{/each}
          </ul>
        </li>
      {/each}
    </ul>
  </section>

  <section class="edu">
    <p class="silk sec-lbl">// education</p>
    <div class="edu-grid">
      {#each EDUCATION as e, i}
        <div class="edu-card panel" use:reveal={{ delay: i * 60 }}>
          <p class="edu-org">{e.org}</p>
          <p class="edu-deg">{e.degree}</p>
          <div class="edu-meta mono">
            <span>{e.dates}</span>
            <span>{e.location}</span>
          </div>
          {#if e.note}<p class="edu-note">{e.note}</p>{/if}
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .page {
    padding-top: var(--sp-10);
  }
  .ph {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: var(--sp-8);
    padding-bottom: var(--sp-10);
    border-bottom: 1px solid var(--line);
    margin-bottom: var(--sp-10);
    align-items: start;
  }
  .ph-title {
    font-size: var(--text-display);
    letter-spacing: -0.03em;
    margin: var(--sp-3) 0 var(--sp-5);
  }
  .ph-title em {
    font-style: italic;
    font-family: var(--font-body);
    font-weight: 400;
    color: var(--red-lit);
  }
  .prose + .prose {
    margin-top: 1.1em;
  }
  .ph-card {
    padding: var(--sp-4);
    position: sticky;
    top: 84px;
  }
  .avatar {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    filter: grayscale(0.2) contrast(1.05);
    box-shadow: var(--e-in);
  }
  .id {
    padding-top: var(--sp-4);
  }
  .id-name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.2rem;
  }
  .id-role {
    font-size: 0.7rem;
    color: var(--sea-lit);
    margin-bottom: var(--sp-3);
  }
  .id-rows {
    display: grid;
    gap: 0.5em;
    font-size: 0.66rem;
  }
  .id-rows li {
    display: flex;
    justify-content: space-between;
    gap: 1em;
    color: var(--ink-2);
    border-bottom: 1px solid var(--line);
    padding-bottom: 0.4em;
  }
  .id-rows li span:first-child {
    color: var(--ink-3);
  }
  .run {
    color: var(--ok);
  }
  .sec-lbl {
    color: var(--red-lit);
    margin-bottom: var(--sp-5);
  }
  .xp {
    margin-bottom: var(--sp-12);
  }
  .xp-list {
    display: grid;
    gap: 0;
  }
  .xp-item {
    padding: var(--sp-6) 0;
    border-bottom: 1px solid var(--line);
    border-left: 2px solid transparent;
    padding-left: var(--sp-4);
    transition: border-color var(--dur);
  }
  .xp-item:hover {
    border-left-color: var(--c);
  }
  .xp-item.subtle {
    opacity: 0.62;
  }
  .xp-head {
    display: flex;
    justify-content: space-between;
    gap: var(--sp-4);
    align-items: baseline;
    flex-wrap: wrap;
    margin-bottom: var(--sp-3);
  }
  .xp-org {
    font-size: var(--text-h3);
    color: var(--ink);
  }
  .xp-org a:hover {
    color: var(--c);
  }
  .xp-title-line {
    color: var(--c);
    font-size: 0.85rem;
    margin-top: 0.2em;
  }
  .xp-when {
    text-align: right;
    font-size: 0.66rem;
    color: var(--ink-3);
    display: grid;
    gap: 0.2em;
  }
  .pts {
    display: grid;
    gap: 0.4em;
    max-width: 76ch;
  }
  .pts li {
    position: relative;
    padding-left: 1.2em;
    color: var(--ink-2);
    font-size: 0.9rem;
    line-height: 1.55;
  }
  .pts li::before {
    content: '—';
    position: absolute;
    left: 0;
    color: var(--c);
  }
  .edu-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-3);
  }
  .edu-card {
    padding: var(--sp-5);
  }
  .edu-org {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-h3);
  }
  .edu-deg {
    color: var(--ink-2);
    margin: 0.4em 0 0.8em;
  }
  .edu-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.66rem;
    color: var(--ink-3);
    border-top: 1px solid var(--line);
    padding-top: 0.6em;
  }
  .edu-note {
    font-size: 0.8rem;
    color: var(--ink-3);
    margin-top: 0.6em;
  }
  @media (max-width: 860px) {
    .ph {
      grid-template-columns: 1fr;
    }
    .ph-card {
      position: static;
      max-width: 320px;
    }
    .edu-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
