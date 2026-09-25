<script lang="ts">
  import { onMount } from 'svelte';
  import { bootDone } from '$lib/stores';

  interface Line { t: string; s?: string; ok?: boolean }

  const seq: Line[] = [
    { t: 'fh1m/os · POST' },
    { t: 'checking PERCEPTION', s: 'Hailo-8 · 53.9 Hz', ok: true },
    { t: 'checking CONTROL', s: '500 Hz · ESP32', ok: true },
    { t: 'checking LOCALIZATION', s: 'RI-EKF · no GPS', ok: true },
    { t: 'checking POWER', s: '2 packs · nominal', ok: true },
    { t: 'mounting 24 repositories', s: '1,038 commits', ok: true },
    { t: 'loading 3,756 tests', s: 'all green', ok: true },
    { t: 'in water', s: 'never', ok: false },
    { t: 'MACHINE STATUS', s: 'RUNNING', ok: true },
  ];

  let shown = $state<Line[]>([]);
  let show = $state(true);
  let closing = $state(false);
  let pct = $state(0);

  function finish() {
    if (closing) return;
    closing = true;
    try { sessionStorage.setItem('booted', '1'); } catch {}
    setTimeout(() => {
      show = false;
      bootDone.set(true);
    }, 520);
  }

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let already = false;
    try { already = sessionStorage.getItem('booted') === '1'; } catch {}

    if (reduce || already) {
      show = false;
      bootDone.set(true);
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    let i = 0;
    const step = () => {
      if (i < seq.length) {
        shown = [...shown, seq[i]];
        i++;
        pct = Math.round((i / seq.length) * 100);
        timer = window.setTimeout(step, i === 1 ? 260 : 150 + Math.random() * 120);
      } else {
        timer = window.setTimeout(finish, 520);
      }
    };
    let timer = window.setTimeout(step, 240);

    const skip = (e: KeyboardEvent | MouseEvent) => {
      if (e instanceof KeyboardEvent && e.key !== 'Enter' && e.key !== 'Escape' && e.key !== ' ') return;
      clearTimeout(timer);
      shown = seq;
      pct = 100;
      finish();
    };
    window.addEventListener('keydown', skip);
    window.addEventListener('click', skip);

    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', skip);
      window.removeEventListener('click', skip);
    };
  });

  $effect(() => {
    if (!show) document.documentElement.style.overflow = '';
  });
</script>

{#if show}
  <div class="boot" class:closing aria-hidden="true">
    <div class="crt"></div>
    <div class="boot-in">
      <div class="brand mono">
        <span class="glyph">FF</span>
        <span>FAHIM FAISAL — AUTONOMY SYSTEMS</span>
      </div>
      <ul class="log">
        {#each shown as l}
          <li>
            <span class="dots mono">{l.t}</span>
            {#if l.s}
              <span class="res mono" class:ok={l.ok} class:warn={l.ok === false}>{l.ok === false ? '⚠' : '✓'} {l.s}</span>
            {/if}
          </li>
        {/each}
      </ul>
      <div class="prog">
        <div class="prog-track"><div class="prog-fill" style="width:{pct}%"></div></div>
        <span class="mono">{String(pct).padStart(3, '0')}%</span>
      </div>
      <p class="skip mono">press any key to skip</p>
    </div>
  </div>
{/if}

<style>
  .boot {
    position: fixed;
    inset: 0;
    z-index: var(--z-boot);
    background: var(--surface-0);
    display: grid;
    place-items: center;
    padding: var(--gutter);
    transition: opacity 500ms var(--ease-out);
  }
  .boot.closing {
    opacity: 0;
  }
  .crt {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(0deg, transparent 0 2px, rgba(0, 0, 0, 0.22) 2px 3px);
    opacity: 0.5;
  }
  .boot-in {
    width: min(560px, 100%);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 0.7em;
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    color: var(--ink-3);
    margin-bottom: var(--sp-5);
  }
  .glyph {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    color: #fff;
    font-weight: 700;
    background: linear-gradient(180deg, #1a3bff, var(--sea));
    box-shadow: var(--e1), var(--glow-signal);
  }
  .log {
    display: grid;
    gap: 0.4em;
    min-height: 15em;
  }
  .log li {
    display: flex;
    justify-content: space-between;
    gap: 1em;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--ink-2);
    animation: fadein 200ms var(--ease-out);
  }
  @keyframes fadein {
    from { opacity: 0; transform: translateX(-6px); }
  }
  .res.ok {
    color: var(--ok);
  }
  .res.warn {
    color: var(--amber-lit);
  }
  .prog {
    display: flex;
    align-items: center;
    gap: 0.8em;
    margin-top: var(--sp-5);
    font-size: 0.7rem;
    color: var(--ink-3);
  }
  .prog-track {
    flex: 1;
    height: 3px;
    background: var(--line);
  }
  .prog-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--sea), var(--red-lit));
    transition: width 160ms var(--ease-out);
  }
  .skip {
    margin-top: var(--sp-4);
    font-size: 0.62rem;
    color: var(--ink-3);
    opacity: 0.6;
    text-align: center;
    letter-spacing: 0.2em;
    text-transform: lowercase;
  }
</style>
