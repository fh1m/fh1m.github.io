<script lang="ts">
  import { onMount } from 'svelte';

  // In-page section index for the home route. Each id must match an anchor
  // rendered on the page. Kept short on purpose — a station list, not a sitemap.
  const SECTIONS = [
    { id: 'proof', label: 'proof' },
    { id: 'work', label: 'work' },
    { id: 'systems', label: 'systems' },
    { id: 'story', label: 'story' },
    { id: 'lab', label: 'lab' },
    { id: 'minds', label: 'minds' },
    { id: 'contact', label: 'contact' },
  ];

  let active = $state('proof');
  let shown = $state(false);

  onMount(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => !!el,
    );

    // Active section = the last one whose top has crossed ~40% of the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) active = e.target.id;
        }
      },
      { rootMargin: '-38% 0px -55% 0px', threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));

    // Reveal the bar only once the hero is behind us.
    const onScroll = () => {
      shown = window.scrollY > window.innerHeight * 0.6;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  });

  function go(e: MouseEvent, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    active = id;
  }
</script>

<nav class="secnav" class:on={shown} aria-label="Sections">
  <div class="secnav-in container-wide">
    <span class="tag mono">index</span>
    <ol class="rail">
      {#each SECTIONS as s, i}
        <li>
          <a
            href={'#' + s.id}
            class="tab"
            class:cur={active === s.id}
            data-cursor
            onclick={(e) => go(e, s.id)}
          >
            <span class="n">{String(i + 1).padStart(2, '0')}</span>
            <span class="l">{s.label}</span>
          </a>
        </li>
      {/each}
    </ol>
    <a class="up mono" href="#top" data-cursor onclick={(e) => go(e, 'top')} aria-label="Back to top">↑ top</a>
  </div>
</nav>

<style>
  .secnav {
    position: sticky;
    top: 60px;
    z-index: var(--z-bar);
    background: color-mix(in oklab, var(--surface-0) 88%, transparent);
    border-bottom: 1px solid var(--line);
    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition:
      opacity var(--dur) var(--ease-out),
      transform var(--dur) var(--ease-out);
  }
  .secnav.on {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }
  .secnav-in {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    height: 38px;
  }
  .tag {
    font-size: 0.58rem;
    letter-spacing: 0.2em;
    text-transform: lowercase;
    color: var(--ink-3);
    flex: none;
  }
  .tag::before {
    content: '';
    display: inline-block;
    width: 14px;
    height: 1px;
    margin-right: 0.6em;
    vertical-align: middle;
    background: var(--red-lit);
  }
  .rail {
    display: flex;
    align-items: center;
    gap: clamp(0.4rem, 1.4vw, 1.3rem);
    flex: 1 1 auto;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .rail::-webkit-scrollbar {
    display: none;
  }
  .tab {
    display: inline-flex;
    align-items: baseline;
    gap: 0.4em;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: lowercase;
    color: var(--ink-3);
    white-space: nowrap;
    padding: 0.2em 0;
    border-bottom: 1px solid transparent;
    transition: color var(--dur-fast);
  }
  .tab .n {
    font-size: 0.54rem;
    color: color-mix(in oklab, var(--ink-3) 60%, transparent);
  }
  .tab:hover {
    color: var(--ink);
  }
  .tab.cur {
    color: var(--red-lit);
    border-bottom-color: var(--red-lit);
  }
  .tab.cur .n {
    color: color-mix(in oklab, var(--red-lit) 70%, transparent);
  }
  .up {
    flex: none;
    font-size: 0.62rem;
    letter-spacing: 0.14em;
    text-transform: lowercase;
    color: var(--ink-3);
    transition: color var(--dur-fast);
  }
  .up:hover {
    color: var(--sea-lit);
  }
  @media (max-width: 720px) {
    .tag,
    .up {
      display: none;
    }
  }
</style>
