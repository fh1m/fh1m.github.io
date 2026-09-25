<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { NAV } from '$lib/data/nav';
  import { PROFILE } from '$lib/data/profile';
  import { paletteOpen } from '$lib/stores';

  let clock = $state('--:--:--');
  const active = $derived($page.url.pathname);

  function isActive(href: string) {
    return href === '/' ? active === '/' : active.startsWith(href);
  }

  onMount(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const tick = () => {
      const d = new Date();
      clock = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  });
</script>

<header class="hd">
  <div class="hd-in container-wide">
    <a class="wm" href="/" data-cursor aria-label="Home — Fahim Faisal">
      <span class="wm-mark">FF</span>
      <span class="wm-name">FAHIM&nbsp;FAISAL</span>
    </a>

    <nav class="nav" aria-label="Primary">
      {#each NAV as item}
        <a href={item.href} class="nav-a" class:on={isActive(item.href)} data-cursor>
          <span class="nav-num">{item.num}</span>{item.label}
        </a>
      {/each}
    </nav>

    <div class="tele">
      <button class="cmd" onclick={() => paletteOpen.set(true)} data-cursor aria-label="Open command menu">
        <span class="cmd-k">⌘</span>K
      </button>
      <span class="clock mono">{clock}</span>
      <span class="stat" title={PROFILE.status}><i></i>RUN</span>
    </div>
  </div>
</header>

<style>
  .hd {
    position: sticky;
    top: 0;
    z-index: var(--z-header);
    background: color-mix(in oklab, var(--surface-0) 94%, transparent);
    border-bottom: 1px solid var(--line);
  }
  .hd-in {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-4);
    height: 60px;
  }
  .wm {
    display: inline-flex;
    align-items: center;
    gap: 0.6em;
    font-family: var(--font-mono);
    letter-spacing: 0.16em;
  }
  .wm-mark {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    font-weight: 700;
    font-size: 0.7rem;
    color: #fff;
    background: linear-gradient(180deg, #1a3bff, var(--sea));
    box-shadow: var(--e1);
  }
  .wm-name {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--ink);
  }
  .wm:hover .wm-name {
    color: var(--sea-lit);
  }
  .nav {
    display: flex;
    gap: clamp(0.6rem, 2vw, 1.6rem);
  }
  .nav-a {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: lowercase;
    color: var(--ink-3);
    display: inline-flex;
    align-items: baseline;
    gap: 0.4em;
    transition: color var(--dur-fast);
  }
  .nav-num {
    font-size: 0.6rem;
    color: color-mix(in oklab, var(--ink-3) 70%, transparent);
  }
  .nav-a:hover {
    color: var(--ink);
  }
  .nav-a.on {
    color: var(--red-lit);
  }
  .tele {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
  }
  .cmd {
    display: inline-flex;
    align-items: center;
    gap: 0.25em;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    color: var(--ink-2);
    padding: 0.35em 0.6em;
    box-shadow: var(--e1);
    background: var(--surface-1);
  }
  .cmd:hover {
    color: #fff;
    box-shadow: var(--e1), var(--glow-signal);
  }
  .cmd-k {
    font-size: 0.85em;
  }
  .clock {
    font-size: 0.72rem;
    color: var(--ink-2);
    font-variant-numeric: tabular-nums;
  }
  .stat {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    color: var(--ok);
  }
  .stat i {
    width: 7px;
    height: 7px;
    background: var(--ok);
    box-shadow: 0 0 8px var(--ok);
    animation: blink 2.4s steps(1) infinite;
  }
  @keyframes blink {
    0%,
    70% {
      opacity: 1;
    }
    71%,
    100% {
      opacity: 0.35;
    }
  }
  @media (max-width: 900px) {
    .nav {
      display: none;
    }
    .clock {
      display: none;
    }
  }
</style>
