<script lang="ts">
  import { reveal } from '$lib/actions/reveal';
  let {
    src,
    alt,
    label = '',
    caption = '',
    credit = '',
    ratio = '16 / 10',
    fit = 'cover',
  }: { src: string; alt: string; label?: string; caption?: string; credit?: string; ratio?: string; fit?: 'cover' | 'contain' } = $props();
</script>

<figure class="dev sheet" use:reveal>
  {#if label}
    <div class="dev-bar">
      <span class="dots"><i></i><i></i><i></i></span>
      <span class="dev-label mono">{label}</span>
      <span class="dev-rec mono">rec ●</span>
    </div>
  {/if}
  <div class="dev-screen" style="aspect-ratio:{ratio};background:{fit === 'contain' ? 'var(--d0)' : 'transparent'}">
    <img {src} {alt} loading="lazy" style="object-fit:{fit}" />
    <span class="dev-cross" aria-hidden="true"></span>
  </div>
  {#if caption || credit}
    <figcaption>
      {#if caption}<span class="cap">{caption}</span>{/if}
      {#if credit}<span class="cred mono">{credit}</span>{/if}
    </figcaption>
  {/if}
</figure>

<style>
  .dev {
    background: linear-gradient(180deg, #0d1119, #070a10);
    box-shadow: var(--e2);
    padding: 8px;
  }
  .dev-bar {
    display: flex;
    align-items: center;
    gap: 0.7em;
    padding: 0.4em 0.6em 0.55em;
  }
  .dots {
    display: inline-flex;
    gap: 4px;
  }
  .dots i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #262b34;
  }
  .dots i:first-child {
    background: var(--red-lit);
  }
  .dots i:nth-child(2) {
    background: var(--amber);
  }
  .dots i:nth-child(3) {
    background: var(--ok);
  }
  .dev-label {
    font-size: 0.6rem;
    color: var(--ink-3);
    letter-spacing: 0.1em;
  }
  .dev-rec {
    margin-left: auto;
    font-size: 0.55rem;
    color: var(--red-lit);
  }
  .dev-screen {
    position: relative;
    overflow: hidden;
    box-shadow: var(--e-in);
  }
  .dev-screen img {
    width: 100%;
    height: 100%;
    display: block;
    transition: transform var(--dur-slow) var(--ease-out);
  }
  .dev:hover .dev-screen img {
    transform: scale(1.03);
  }
  .dev-cross {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg, transparent calc(50% - 0.5px), rgba(255, 255, 255, 0.05) 50%, transparent calc(50% + 0.5px)),
      linear-gradient(0deg, transparent calc(50% - 0.5px), rgba(255, 255, 255, 0.05) 50%, transparent calc(50% + 0.5px));
    opacity: 0;
    transition: opacity var(--dur);
  }
  .dev:hover .dev-cross {
    opacity: 1;
  }
  figcaption {
    display: flex;
    justify-content: space-between;
    gap: 1em;
    padding: 0.6em 0.4em 0.2em;
    flex-wrap: wrap;
  }
  .cap {
    font-size: 0.78rem;
    color: var(--ink-2);
  }
  .cred {
    font-size: 0.58rem;
    color: var(--ink-3);
  }
</style>
