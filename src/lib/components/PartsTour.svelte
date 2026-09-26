<script lang="ts">
  import { onMount } from 'svelte';
  import AuvScene from './AuvScene.svelte';
  import { reveal } from '$lib/actions/reveal';

  type Key = 'control' | 'perception' | 'estimator' | 'thrust';

  interface Chapter {
    key: Key;
    tag: string;
    title: string;
    body: string[];
    stat?: { v: string; l: string }[];
    source: string;
  }

  const chapters: Chapter[] = [
    {
      key: 'control',
      tag: 'the board',
      title: 'The split no one sees',
      body: [
        'The first fight was with myself, not the hardware: I kept wanting one brain for the whole vehicle. It’s the wrong instinct. Reflexes belong on hardware that cannot be interrupted, so the ESP32 core got sensors, control and DShot at a fixed 500 Hz — nothing else runs there, ever.',
        'The Pi does nothing but see. The two meet over one USB-C cable, and exactly one node is allowed to touch the board. I didn’t believe the split was actually clean until I watched the control loop’s jitter on a live plot while vision spiked — and it didn’t move.',
      ],
      stat: [
        { v: '500 Hz', l: 'control loop, fixed' },
        { v: '0', l: 'control jitter change under vision load' },
      ],
      source: 'mongla — srot/Hailo split, live telemetry',
    },
    {
      key: 'perception',
      tag: 'the eye',
      title: 'Decode on demand, not on arrival',
      body: [
        'The Hailo-8 has a scarce budget of TOPS, and my first version wasted it — decoding every frame the camera handed over, whether the inference worker was ready or not. I rewrote the rule: decode only when the worker is idle, so the chip never spends its compute on a frame that’s already stale.',
        'I didn’t trust the fix until the instrumentation said it out loud, unprompted, every ten seconds: across 778 inferences, mean frame age at infer-start was 11.5 ms, worst case 19.2 ms — and zero frames were ever decoded and then never used.',
      ],
      stat: [
        { v: '778', l: 'inferences, instrumented' },
        { v: '11.5 ms', l: 'mean frame age at infer-start' },
        { v: '0', l: 'decoded-but-never-inferred' },
      ],
      source: 'mongla — chip-efficiency readout',
    },
    {
      key: 'perception',
      tag: 'the python problem',
      title: 'Nothing in the hot path holds the lock',
      body: [
        'Python has one lock, and a vehicle can’t afford a stage that holds it while it works — every other stage freezes with it. Instead of chasing stalls one symptom at a time, I audited every hot-path stage by hold × rate: the fraction of wall-time the process is actually frozen (tools/gil_audit.py).',
        'The verdict: every hot-path stage releases the lock — hailo run_async at 78.3% duty frees it, cv2.imdecode at 32.0% frees it, the only holder left is the viewer feed, off the mission path. That one session of work took the vision pipeline from 28 ms to 18 ms, detections from 36.5 Hz to 77 Hz, at about 30% less CPU.',
      ],
      stat: [
        { v: '28 → 18 ms', l: 'vision pipeline, one session' },
        { v: '36.5 → 77 Hz', l: 'detections' },
        { v: '~30%', l: 'less CPU' },
      ],
      source: 'mongla — tools/gil_audit.py',
    },
    {
      key: 'perception',
      tag: 'the honest ceiling',
      title: 'The sensor is the limit — not the code',
      body: [
        'Once the pipeline stopped being the bottleneck, I had to prove it rather than assume it. Authority at p99 came back 1.000 on both cameras: at the 99th percentile, the freshest frame the sensor could physically provide is the frame the controller acts on. There’s no software latency left to chase.',
        'The forward camera runs at 73.4 Hz, the downward at 27.6 Hz — and the calibration that feeds both had to be redone once I put the vehicle in water: the datasheet says 63.8° field of view; measured wet, it’s 46.7°. Water bends light the manual doesn’t know about.',
      ],
      stat: [
        { v: '1.000', l: 'authority at p99, both cameras' },
        { v: '73.4 / 27.6 Hz', l: 'forward / downward camera rate' },
        { v: '46.7° vs 63.8°', l: 'measured wet vs datasheet FOV' },
      ],
      source: 'mongla — photon-to-command latency, live hardware',
    },
    {
      key: 'estimator',
      tag: 'the brain',
      title: 'Time is the hard part, not the math',
      body: [
        'The Kalman filter equations were the easy part — a weekend of linear algebra. What actually took the effort was time: a right-invariant EKF that predicts on the board IMU and corrects with depth, optical-flow velocity and heading has to replay a late measurement at the instant it happened, not the instant it arrived.',
        'That rule forced a harder one on the whole codebase: absence renders as “--”, never 0.0. A number that reports success while the vehicle does nothing is treated as the worst failure there is — because a silently-wrong zero is indistinguishable from a real reading, and an estimator that can’t tell the difference will lie to the controller with total confidence.',
      ],
      source: 'mongla — right-invariant EKF, board IMU + depth + optical flow',
    },
    {
      key: 'thrust',
      tag: 'the honest badge',
      title: 'Built. Not yet proven. It says so.',
      body: [
        'Every thruster on this vehicle has been bench-tested, every control surface exercised, every subsystem exercised against 3,756 tests across 1,038 commits. None of that is the same claim as “it works in the water,” so the status badge doesn’t make that claim — it reads “in water: never,” in the same amber as every other unverified number on this site.',
        'I’d rather ship an honest “not yet” than a comforting maybe. The next milestone for this machine isn’t a feature. It’s the pool.',
      ],
      stat: [
        { v: '1,038', l: 'commits' },
        { v: '3,756', l: 'tests, all green on the bench' },
        { v: 'never', l: 'in water — still true' },
      ],
      source: 'mongla — README status badges',
    },
  ];

  let activeIndex = $state(0);
  const activeKey = $derived(chapters[activeIndex]?.key ?? null);

  let els: HTMLElement[] = [];

  onMount(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = els.indexOf(e.target as HTMLElement);
            if (i >= 0) activeIndex = i;
          }
        }
      },
      { rootMargin: '-42% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  });
</script>

<section class="parts-tour section container">
  <header class="pt-head" use:reveal>
    <span class="eyebrow">anatomy / mongla</span>
    <h2 class="pt-title">The machine, part by part — with the numbers that built each one.</h2>
    <p class="pt-sub">Every stat here came off the running stack, not a spec sheet. Scroll — the console follows the story.</p>
  </header>

  <div class="pt-grid">
    <div class="pt-sticky">
      <div class="pt-visual">
        <AuvScene highlight={activeKey} />
      </div>
      <div class="pt-tag mono">
        <span class="dot" class:on={!!activeKey}></span>
        {chapters[activeIndex]?.tag ?? 'idle'}
      </div>
    </div>

    <div class="pt-chapters">
      {#each chapters as c, i}
        <article class="chapter" class:on={i === activeIndex} bind:this={els[i]}>
          <span class="ch-tag silk">{c.tag}</span>
          <h3 class="ch-title">{c.title}</h3>
          {#each c.body as p}<p class="ch-body">{p}</p>{/each}
          {#if c.stat}
            <div class="ch-stats">
              {#each c.stat as s}
                <div class="ch-stat">
                  <span class="cs-v num">{s.v}</span>
                  <span class="cs-l mono">{s.l}</span>
                </div>
              {/each}
            </div>
          {/if}
          <p class="ch-source mono">// {c.source}</p>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .pt-head {
    max-width: 62ch;
    margin-bottom: var(--sp-8);
  }
  .pt-title {
    font-size: var(--text-display);
    letter-spacing: -0.03em;
    margin: var(--sp-3) 0 var(--sp-3);
  }
  .pt-sub {
    color: var(--ink-2);
    font-size: var(--text-lede);
  }
  .pt-grid {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: var(--sp-8);
    align-items: start;
  }
  .pt-sticky {
    position: sticky;
    top: 84px;
    display: grid;
    gap: var(--sp-3);
  }
  .pt-visual {
    position: relative;
    aspect-ratio: 4 / 5;
    background: linear-gradient(180deg, #0a0d13, #03040a);
    box-shadow: var(--e3);
    overflow: hidden;
  }
  .pt-tag {
    display: flex;
    align-items: center;
    gap: 0.6em;
    justify-content: center;
    font-size: 0.68rem;
    color: var(--ink-3);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .pt-tag .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ink-3);
  }
  .pt-tag .dot.on {
    background: var(--sea-lit);
    box-shadow: 0 0 6px var(--sea);
  }
  .pt-chapters {
    display: grid;
    gap: var(--sp-10);
  }
  .chapter {
    padding: var(--sp-6) 0;
    border-bottom: 1px solid var(--line);
    opacity: 0.45;
    transition: opacity var(--dur-slow) var(--ease-out);
  }
  .chapter:last-child {
    border-bottom: none;
  }
  .chapter.on {
    opacity: 1;
  }
  .ch-tag {
    color: var(--red-lit);
  }
  .ch-title {
    font-size: var(--text-h2);
    letter-spacing: -0.02em;
    margin: 0.4em 0 0.7em;
    max-width: 34ch;
  }
  .ch-body {
    color: var(--ink-2);
    line-height: 1.7;
    max-width: var(--measure);
    margin-bottom: var(--sp-3);
  }
  .ch-stats {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-3);
    margin: var(--sp-4) 0;
  }
  .ch-stat {
    display: grid;
    gap: 0.2em;
    padding: 0.6em 0.9em;
    background: linear-gradient(180deg, var(--surface-1), var(--d1));
    box-shadow: var(--e1);
  }
  .cs-v {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--sea-lit);
    line-height: 1;
  }
  .cs-l {
    font-size: 0.6rem;
    color: var(--ink-3);
  }
  .ch-source {
    font-size: 0.62rem;
    color: var(--ink-3);
    margin-top: var(--sp-2);
  }
  @media (max-width: 900px) {
    .pt-grid {
      grid-template-columns: 1fr;
    }
    .pt-sticky {
      position: static;
      max-width: 340px;
      margin: 0 auto;
    }
  }
</style>
