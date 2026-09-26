<script lang="ts">
  import SectionHead from './SectionHead.svelte';
  import { SHOTS, type LabCat } from '$lib/data/gallery';
  import { reveal } from '$lib/actions/reveal';

  // Each band = one category, given a short educational lede, then its real
  // frames with their own captions. The images are spread across the page as
  // sections — not shoved into one grid.
  const BANDS: { key: LabCat | LabCat[]; kicker: string; title: string; lede: string }[] = [
    {
      key: 'perception',
      kicker: 'what it sees',
      title: 'Detection is where every mission begins',
      lede: 'Nothing downstream — no heading, no descent, no grab — happens until a pixel becomes a detection. These are real frames from murky competition water, not a clean demo. The whole pipeline exists to keep the confidence numbers on the left honest.',
    },
    {
      key: 'telemetry',
      kicker: 'what it measures',
      title: 'A number you cannot see is a number you cannot trust',
      lede: 'The recurring failure mode on a vehicle is a plausible value standing in for an absent one. So every stage is instrumented: latency down to p99, the GIL held per stage, the chip’s wasted decodes. If a subsystem cannot show its work, it does not ship.',
    },
    {
      key: 'simulation',
      kicker: 'where it rehearses',
      title: 'Water is scarce — the verbs are rehearsed in sim first',
      lede: 'Gazebo over ArduSub SITL presents the same MAVLink surface the real vehicle expects, so control behaviour and every verb transfer directly. What does not transfer — detection thresholds, vision gains — is deliberately left to the pool, because sim imagery is too clean.',
    },
    {
      key: 'tooling',
      kicker: 'what sharpens it',
      title: 'The tools around the vehicle set how fast it improves',
      lede: 'A web operator that records datasets, a ledger that scores every run with its conditions, subsystems that configure themselves from one deck-editable file. The speed of iteration is a capability too — and a capability is only real if the path to it is wired.',
    },
    {
      key: ['sonar', 'water', 'field'],
      kicker: 'where it counts',
      title: 'Then the water gets a vote',
      lede: 'Sonar sees where cameras go blind. And past every simulation and bench check is the pool, where sim stops mattering and the real thing has to be found — with a human on the kill switch and the abort path one press away.',
    },
  ];

  function shotsFor(key: LabCat | LabCat[]) {
    const keys = Array.isArray(key) ? key : [key];
    return SHOTS.filter((s) => keys.includes(s.cat));
  }
</script>

<section class="section container">
  <SectionHead
    index="the lab"
    eyebrow="22 real frames, from the running machine"
    title="the work, on screen"
    meta="perception · telemetry · sim · water"
  />

  <div class="bands">
    {#each BANDS as band, bi}
      {@const shots = shotsFor(band.key)}
      <article class="band" use:reveal>
        <header class="band-head">
          <div class="band-tag">
            <span class="band-idx num">{String(bi + 1).padStart(2, '0')}</span>
            <span class="band-kick silk">{band.kicker}</span>
          </div>
          <h3 class="band-title">{band.title}</h3>
          <p class="band-lede">{band.lede}</p>
        </header>

        <div class="frames">
          {#each shots as s}
            <figure class="frame">
              <div class="shot" class:cover={s.fit === 'cover'}>
                <img src={s.src} alt={s.title} loading="lazy" />
                <span class="shot-tag mono">{s.title}</span>
              </div>
              <figcaption class="cap">{s.caption}</figcaption>
            </figure>
          {/each}
        </div>
      </article>
    {/each}
  </div>

  <div class="more">
    <a class="key" href="/lab" data-cursor>open the full lab →</a>
  </div>
</section>

<style>
  .bands {
    display: grid;
    gap: var(--sp-8);
  }
  .band {
    display: grid;
    gap: var(--sp-5);
    padding-bottom: var(--sp-8);
    border-bottom: 1px solid var(--line);
  }
  .band:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  .band-head {
    max-width: 62ch;
  }
  .band-tag {
    display: flex;
    align-items: baseline;
    gap: 0.7em;
    margin-bottom: var(--sp-2);
  }
  .band-idx {
    font-size: 1rem;
    color: var(--red-lit);
  }
  .band-kick {
    color: var(--sea-lit);
  }
  .band-title {
    font-size: var(--text-h2);
    letter-spacing: -0.02em;
    margin-bottom: var(--sp-3);
  }
  .band-lede {
    color: var(--ink-2);
    line-height: 1.65;
    font-size: var(--text-lede);
  }
  .frames {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--sp-5) var(--sp-4);
  }
  .frame {
    display: grid;
    gap: var(--sp-2);
    align-content: start;
  }
  /* An orphaned last image (odd count) spans the full width instead of
     sitting alone beside a void. */
  .frame:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }
  .frame:last-child:nth-child(odd) .shot {
    aspect-ratio: 24 / 9;
  }
  .shot {
    position: relative;
    aspect-ratio: 16 / 10;
    background: var(--d0);
    box-shadow: var(--e1);
    overflow: hidden;
    display: grid;
    place-items: center;
  }
  .shot img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .shot.cover img {
    object-fit: cover;
  }
  .shot-tag {
    position: absolute;
    left: 0;
    bottom: 0;
    font-size: 0.56rem;
    letter-spacing: 0.1em;
    color: var(--ink-2);
    background: color-mix(in oklab, var(--surface-0) 82%, transparent);
    padding: 0.3em 0.6em;
    border-top: 1px solid var(--line);
    border-right: 1px solid var(--line);
  }
  .cap {
    font-size: 0.72rem;
    line-height: 1.5;
    color: var(--ink-3);
  }
  .more {
    margin-top: var(--sp-6);
    display: flex;
    justify-content: center;
  }
  @media (max-width: 520px) {
    .frames {
      grid-template-columns: 1fr;
    }
    .frame:last-child:nth-child(odd) .shot {
      aspect-ratio: 16 / 10;
    }
  }
</style>
