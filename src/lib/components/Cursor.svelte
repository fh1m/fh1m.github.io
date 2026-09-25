<script lang="ts">
  import { onMount } from 'svelte';

  let dotX = $state(0), dotY = $state(0);
  let ringX = $state(0), ringY = $state(0);
  let active = $state(false);
  let visible = $state(false);
  let enabled = $state(false);

  onMount(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;
    enabled = true;

    let tx = 0, ty = 0, raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      dotX = tx; dotY = ty;
      visible = true;
      const t = e.target as HTMLElement;
      active = !!t.closest('a, button, [data-cursor], input, textarea, .key');
    };
    const loop = () => {
      ringX += (tx - ringX) * 0.18;
      ringY += (ty - ringY) * 0.18;
      raf = requestAnimationFrame(loop);
    };
    const leave = () => (visible = false);

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  });
</script>

{#if enabled}
  <div class="cur" class:visible aria-hidden="true">
    <div class="dot" style="transform:translate({dotX}px,{dotY}px)"></div>
    <div class="ring" class:active style="transform:translate({ringX}px,{ringY}px)"></div>
  </div>
{/if}

<style>
  .cur {
    position: fixed;
    inset: 0;
    z-index: var(--z-cursor);
    pointer-events: none;
    opacity: 0;
    transition: opacity 200ms;
  }
  .cur.visible {
    opacity: 1;
  }
  .dot,
  .ring {
    position: absolute;
    top: 0;
    left: 0;
    will-change: transform;
  }
  .dot {
    width: 6px;
    height: 6px;
    margin: -3px 0 0 -3px;
    background: var(--red-lit);
    box-shadow: 0 0 8px var(--cad-red);
  }
  .ring {
    width: 34px;
    height: 34px;
    margin: -17px 0 0 -17px;
    border: 1px solid var(--line-strong);
    transition:
      width 180ms var(--ease-out),
      height 180ms var(--ease-out),
      margin 180ms var(--ease-out),
      border-color 180ms var(--ease-out);
  }
  .ring.active {
    width: 52px;
    height: 52px;
    margin: -26px 0 0 -26px;
    border-color: var(--sea-lit);
    box-shadow: var(--glow-signal);
  }
  @media (hover: none), (prefers-reduced-motion: reduce) {
    .cur {
      display: none;
    }
  }
</style>
