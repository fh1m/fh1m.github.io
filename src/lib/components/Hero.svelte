<script lang="ts">
  import WebglField from './WebglField.svelte';
  import Console from './Console.svelte';
  import { PROFILE } from '$lib/data/profile';
  import { bootDone } from '$lib/stores';
</script>

<section class="hero" class:go={$bootDone}>
  <WebglField intensity={0.9} class="hero-field" />
  <div class="hero-grid" aria-hidden="true"></div>

  <div class="hero-in container-wide">
    <div class="hero-copy">
      <p class="eyebrow">Autonomy · robotics · ML — Dhaka, Bangladesh</p>
      <h1 class="title">
        <span class="l l1">Machines that</span>
        <span class="l l2">perceive, reason,</span>
        <span class="l l3">and <em>act.</em></span>
      </h1>
      <p class="lede">{PROFILE.intro}</p>
      <div class="cta">
        <a class="key primary" href="/work" data-cursor>VIEW THE WORK →</a>
        <a class="key" href={PROFILE.links.email} data-cursor>HIRE FAHIM</a>
      </div>
      <p class="thesis mono">“{PROFILE.thesis}”</p>
    </div>

    <div class="hero-device">
      <Console />
      <div class="device-cap">
        <span class="silk">FIG. 01 — THE OPERATOR CONSOLE</span>
        <span class="chip ok"><i class="dot"></i>ALL SYSTEMS NOMINAL</span>
      </div>
    </div>
  </div>

  <div class="scroll-hint mono" aria-hidden="true">
    <span>SCROLL</span>
    <span class="arr">↓</span>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    align-items: center;
    padding: 90px 0 60px;
    overflow: hidden;
    border-bottom: 1px solid var(--line);
  }
  :global(.hero-field) {
    z-index: 0;
    opacity: 0.55;
  }
  .hero::after {
    /* darken lower half for legibility */
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(180deg, transparent 30%, color-mix(in oklab, var(--surface-0) 55%, transparent));
    pointer-events: none;
  }
  .hero-grid {
    position: absolute;
    inset: 0;
    z-index: 1;
    background-image:
      linear-gradient(var(--line) 1px, transparent 1px),
      linear-gradient(90deg, var(--line) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: radial-gradient(120% 90% at 50% 40%, black, transparent 78%);
    opacity: 0.35;
    pointer-events: none;
  }
  .hero-in {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: clamp(1.5rem, 4vw, 4rem);
    align-items: center;
    width: 100%;
  }
  .eyebrow {
    margin-bottom: var(--sp-4);
  }
  .title {
    font-size: var(--text-hero);
    line-height: 0.92;
    letter-spacing: -0.035em;
    margin: 0 0 var(--sp-5);
  }
  .title .l {
    display: block;
    opacity: 0;
    transform: translateY(28px);
  }
  .go .title .l {
    animation: rise 0.8s var(--ease-out) forwards;
  }
  .go .l1 { animation-delay: 0.05s; }
  .go .l2 { animation-delay: 0.16s; }
  .go .l3 { animation-delay: 0.27s; }
  .title em {
    font-style: italic;
    font-family: var(--font-body);
    font-weight: 400;
    color: var(--red-lit);
  }
  @keyframes rise {
    to {
      opacity: 1;
      transform: none;
    }
  }
  .lede {
    max-width: 46ch;
    color: var(--ink-2);
    font-size: var(--text-lede);
    line-height: 1.5;
    margin-bottom: var(--sp-5);
  }
  .cta {
    display: flex;
    gap: var(--sp-3);
    flex-wrap: wrap;
    margin-bottom: var(--sp-6);
  }
  .thesis {
    font-size: 0.8rem;
    color: var(--ink-3);
    letter-spacing: 0.04em;
    border-left: 2px solid var(--red-lit);
    padding-left: 0.9em;
  }
  .device-cap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: var(--sp-3);
    gap: var(--sp-3);
    flex-wrap: wrap;
  }
  .scroll-hint {
    position: absolute;
    bottom: 46px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: grid;
    justify-items: center;
    gap: 0.4em;
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    color: var(--ink-3);
  }
  .arr {
    animation: bob 1.8s var(--ease-in-out) infinite;
  }
  @keyframes bob {
    50% {
      transform: translateY(6px);
      opacity: 0.5;
    }
  }
  @media (max-width: 900px) {
    .hero-in {
      grid-template-columns: 1fr;
    }
    .hero-device {
      order: 2;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .title .l {
      opacity: 1;
      transform: none;
      animation: none;
    }
  }
</style>
