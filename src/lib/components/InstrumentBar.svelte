<script lang="ts">
  import { page } from '$app/stores';
  import { scrollProgress } from '$lib/stores';
  import { NAV } from '$lib/data/nav';

  const current = $derived(
    NAV.find((n) => (n.href === '/' ? $page.url.pathname === '/' : $page.url.pathname.startsWith(n.href))) ?? NAV[0],
  );
  const pct = $derived(Math.round($scrollProgress * 100));
</script>

<div class="bar" aria-hidden="true">
  <span class="lbl mono">[{current.num}/06] {current.label}</span>
  <div class="track">
    <div class="fill" style="transform:scaleX({$scrollProgress})"></div>
  </div>
  <span class="pct mono">{String(pct).padStart(2, '0')}%</span>
</div>

<style>
  .bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: var(--z-bar);
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    height: 34px;
    padding: 0 var(--sp-4);
    background: color-mix(in oklab, var(--surface-1) 90%, transparent);
    backdrop-filter: blur(8px);
    border-top: 1px solid var(--line);
    pointer-events: none;
  }
  .lbl {
    font-size: 0.66rem;
    letter-spacing: 0.14em;
    color: var(--ink-3);
    text-transform: uppercase;
    white-space: nowrap;
  }
  .track {
    position: relative;
    flex: 1;
    height: 2px;
    background: var(--line);
    min-width: 0;
  }
  .fill {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--sea), var(--red-lit));
    transform-origin: left;
  }
  .pct {
    font-size: 0.66rem;
    color: var(--ink-2);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  @media (max-width: 560px) {
    .lbl {
      display: none;
    }
  }
</style>
