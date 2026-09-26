<script lang="ts">
  import Gallery from '$lib/components/Gallery.svelte';
  import DeepDives from '$lib/components/DeepDives.svelte';
  import { reveal } from '$lib/actions/reveal';
</script>

<svelte:head>
  <title>The Lab — Fahim Faisal</title>
  <meta name="description" content="Real frames from the running stack — perception HUDs, telemetry, simulation, and the pool." />
</svelte:head>

<div class="page container">
  <header class="ph" use:reveal>
    <p class="eyebrow">04 — the lab</p>
    <h1 class="ph-title">frames from the<br />running <em>machine.</em></h1>
    <p class="ph-lede prose">
      Not renders. Not mockups. These are real screenshots from the tooling I build and run — the
      perception HUDs, the flight telemetry, the simulator, the latency audits, and the pool where
      sim stops mattering. Tap any of them.
    </p>
  </header>

  <Gallery />
</div>

<DeepDives />

<style>
  .page {
    padding-top: var(--sp-10);
  }
  .ph {
    padding: var(--sp-6) 0 var(--sp-8);
    border-bottom: 1px solid var(--line);
    margin-bottom: var(--sp-8);
  }
  .ph-title {
    font-size: var(--text-display);
    letter-spacing: -0.03em;
    margin: var(--sp-3) 0 var(--sp-4);
  }
  .ph-title em {
    font-style: italic;
    font-family: var(--font-body);
    font-weight: 400;
    color: var(--red-lit);
  }
</style>
