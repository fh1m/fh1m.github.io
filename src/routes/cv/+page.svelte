<script lang="ts">
  import { PROFILE } from '$lib/data/profile';
  import { EXPERIENCE, EDUCATION } from '$lib/data/experience';
  import { PUBLICATIONS } from '$lib/data/publications';
  import { COMPETITIONS } from '$lib/data/press';

  const skills = [
    ['languages', 'Python · C · C++ · Rust · JavaScript'],
    ['ml', 'PyTorch · CUDA · TensorRT · OpenCV · YOLO11 · scikit-learn'],
    ['robotics', 'ROS 2 · MAVLink · Nav2 · Gazebo · Pixhawk · Jetson · Hailo-8'],
    ['web', 'SvelteKit · React · Next.js · Node · Flask · Django'],
    ['tools', 'Linux · Git · Docker · Bash · KiCad · PCB design'],
  ];
</script>

<svelte:head>
  <title>Fahim Faisal — CV</title>
  <meta name="description" content="Curriculum vitae — Fahim Faisal, autonomy & robotics engineer." />
</svelte:head>

<div class="cv-page">
  <div class="cv-actions no-print">
    <a class="key" href="/" data-cursor>← back</a>
    <a class="key primary" href="/fahim-faisal-cv.pdf" download data-cursor>download pdf ↓</a>
  </div>

  <article class="paper" id="cv">
    <header class="cv-head">
      <div>
        <h1>Muhammad Fahim Faisal</h1>
        <p class="role">Autonomy &amp; robotics engineer — perception, control, embedded</p>
      </div>
      <ul class="contact">
        <li>{PROFILE.links.emailPlain}</li>
        <li>github.com/fh1m</li>
        <li>{PROFILE.location}</li>
      </ul>
    </header>

    <p class="summary">
      Autonomy engineer working across underwater, aerial and ground robots — from the firmware on the
      board to the neural net that sees. Engineering lead on BRAC University’s RoboSub AUV team;
      builder of an independent ROS 2 AUV stack with a 500 Hz control loop and Hailo-8 vision. I care
      about the seam between software and physics, and about numbers that ship with the measurement
      that produced them.
    </p>

    <section>
      <h2>Skills</h2>
      <ul class="skills">
        {#each skills as [k, v]}
          <li><span class="sk">{k}</span><span class="sv">{v}</span></li>
        {/each}
      </ul>
    </section>

    <section>
      <h2>Experience</h2>
      {#each EXPERIENCE as r}
        <div class="entry">
          <div class="entry-top">
            <span class="org">{r.org}</span>
            <span class="dates">{r.dates}</span>
          </div>
          <p class="etitle">{r.title} · {r.location}</p>
          <ul class="pts">
            {#each r.points as p}<li>{p}</li>{/each}
          </ul>
        </div>
      {/each}
    </section>

    <div class="two-col">
      <section>
        <h2>Education</h2>
        {#each EDUCATION as e}
          <div class="entry">
            <div class="entry-top"><span class="org">{e.org}</span><span class="dates">{e.dates}</span></div>
            <p class="etitle">{e.degree} · {e.location}</p>
            {#if e.note}<p class="note">{e.note}</p>{/if}
          </div>
        {/each}
      </section>
      <section>
        <h2>Competition</h2>
        <ul class="comps">
          {#each COMPETITIONS as c}
            <li><span class="cy">{c.year}</span> {c.event} — {c.team}. {c.line}</li>
          {/each}
        </ul>
      </section>
    </div>

    <section>
      <h2>Publications</h2>
      {#each PUBLICATIONS as p}
        <div class="entry">
          <p class="etitle">{p.title}</p>
          <p class="note">{p.authors} · {p.venue}, {p.year}</p>
        </div>
      {/each}
    </section>

    <p class="foot">References and a live portfolio at fh1m.github.io</p>
  </article>
</div>

<style>
  .cv-page {
    max-width: 900px;
    margin: 0 auto;
    padding: var(--sp-8) var(--gutter) var(--sp-16);
  }
  .cv-actions {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--sp-5);
  }
  .paper {
    background: #fbfbf9;
    color: #14161c;
    padding: 3rem 3.25rem;
    box-shadow: var(--e3);
    font-size: 13px;
    line-height: 1.5;
  }
  .paper h1 {
    font-family: var(--font-display);
    font-size: 1.7rem;
    letter-spacing: -0.02em;
    color: #0b1730;
  }
  .role {
    color: #3b4a63;
    font-size: 0.85rem;
    margin-top: 0.2em;
  }
  .cv-head {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
    padding-bottom: 1rem;
    border-bottom: 2px solid #0b1730;
    margin-bottom: 1rem;
  }
  .contact {
    text-align: right;
    font-family: var(--font-mono);
    font-size: 11px;
    color: #3b4a63;
    display: grid;
    gap: 0.2em;
  }
  .summary {
    color: #2a3345;
    margin-bottom: 1.4rem;
  }
  .paper h2 {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #b32b22;
    border-bottom: 1px solid #d8d8d2;
    padding-bottom: 0.3em;
    margin-bottom: 0.7rem;
  }
  section {
    margin-bottom: 1.4rem;
  }
  .skills {
    display: grid;
    gap: 0.3em;
  }
  .skills li {
    display: grid;
    grid-template-columns: 6.5rem 1fr;
    gap: 1rem;
  }
  .sk {
    font-family: var(--font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6a7488;
    padding-top: 2px;
  }
  .sv {
    color: #1c2330;
  }
  .entry {
    margin-bottom: 0.9rem;
  }
  .entry-top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: baseline;
  }
  .org {
    font-weight: 700;
    color: #0b1730;
    font-size: 0.95rem;
  }
  .dates {
    font-family: var(--font-mono);
    font-size: 10px;
    color: #6a7488;
    white-space: nowrap;
  }
  .etitle {
    color: #2f5fd0;
    font-size: 0.82rem;
    margin: 0.1em 0 0.3em;
  }
  .pts {
    display: grid;
    gap: 0.15em;
  }
  .pts li {
    position: relative;
    padding-left: 1em;
    color: #2a3345;
    font-size: 12px;
  }
  .pts li::before {
    content: '—';
    position: absolute;
    left: 0;
    color: #b32b22;
  }
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .note {
    color: #55607a;
    font-size: 11.5px;
  }
  .comps {
    display: grid;
    gap: 0.3em;
  }
  .comps li {
    font-size: 12px;
    color: #2a3345;
  }
  .cy {
    font-family: var(--font-mono);
    font-weight: 700;
    color: #0b1730;
  }
  .foot {
    margin-top: 1.5rem;
    padding-top: 0.8rem;
    border-top: 1px solid #d8d8d2;
    font-family: var(--font-mono);
    font-size: 10px;
    color: #6a7488;
    text-align: center;
  }
  @media (max-width: 640px) {
    .paper {
      padding: 1.5rem 1.35rem;
    }
    .two-col {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
  @media print {
    .no-print {
      display: none !important;
    }
    .cv-page {
      padding: 0;
      max-width: none;
    }
    .paper {
      box-shadow: none;
      padding: 0.3in 0.5in;
      font-size: 12.5px;
    }
    section {
      margin-bottom: 1.1rem;
    }
    .entry {
      margin-bottom: 0.7rem;
    }
    .foot {
      margin-top: 1rem;
      padding-top: 0.6rem;
      break-before: avoid;
    }
  }
</style>
