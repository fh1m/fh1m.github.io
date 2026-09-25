<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { paletteOpen } from '$lib/stores';
  import { NAV } from '$lib/data/nav';
  import { PROFILE } from '$lib/data/profile';

  interface Cmd {
    label: string;
    hint: string;
    kind: 'nav' | 'link' | 'action';
    run: () => void;
    keys?: string;
  }

  let query = $state('');
  let sel = $state(0);
  let input: HTMLInputElement | null = $state(null);

  const cmds: Cmd[] = [
    ...NAV.map((n) => ({
      label: `Go to ${n.label}`,
      hint: n.href,
      kind: 'nav' as const,
      keys: n.num,
      run: () => goto(n.href),
    })),
    { label: 'Open GitHub', hint: 'github.com/fh1m', kind: 'link', run: () => open(PROFILE.links.github) },
    { label: 'Email Fahim', hint: PROFILE.links.emailPlain, kind: 'link', run: () => (location.href = PROFILE.links.email) },
    { label: 'BRACU Duburi', hint: 'bracuduburi.com', kind: 'link', run: () => open(PROFILE.links.duburi) },
    { label: 'View Mongla docs', hint: 'the flagship AUV stack', kind: 'link', run: () => open('https://fh1m.github.io/mongla_ws/') },
    { label: 'Download CV', hint: 'PDF', kind: 'action', run: () => { const a = document.createElement('a'); a.href = '/fahim-faisal-cv.pdf'; a.download = ''; a.click(); } },
    { label: 'sudo hire fahim', hint: 'permission granted', kind: 'action', run: () => (location.href = PROFILE.links.email) },
    { label: 'Replay boot sequence', hint: 'POST', kind: 'action', run: () => { sessionStorage.removeItem('booted'); location.reload(); } },
  ];

  const filtered = $derived(
    query.trim()
      ? cmds.filter((c) => (c.label + c.hint).toLowerCase().includes(query.toLowerCase()))
      : cmds,
  );

  function open(url: string) {
    window.open(url, '_blank', 'noopener');
  }
  function close() {
    paletteOpen.set(false);
    query = '';
    sel = 0;
  }
  function exec(c: Cmd) {
    close();
    c.run();
  }

  function onKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      paletteOpen.update((v) => !v);
      return;
    }
    if (!$paletteOpen) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % filtered.length; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + filtered.length) % filtered.length; }
    else if (e.key === 'Enter' && filtered[sel]) { e.preventDefault(); exec(filtered[sel]); }
  }

  $effect(() => {
    if ($paletteOpen) {
      tick().then(() => input?.focus());
    }
  });

  onMount(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

{#if $paletteOpen}
  <div class="scrim" role="button" tabindex="-1" onclick={close} onkeydown={() => {}}></div>
  <div class="pal panel-2" role="dialog" aria-modal="true" aria-label="Command menu">
    <div class="pal-in">
      <div class="field">
        <span class="prompt mono">›</span>
        <input
          bind:this={input}
          bind:value={query}
          oninput={() => (sel = 0)}
          placeholder="Type a command or search…"
          spellcheck="false"
          autocomplete="off"
        />
        <span class="esc mono">ESC</span>
      </div>
      <ul class="list">
        {#each filtered as c, i}
          <li>
            <button class="row" class:on={i === sel} onmouseenter={() => (sel = i)} onclick={() => exec(c)}>
              <span class="row-k mono">{c.keys ?? (c.kind === 'link' ? '↗' : '»')}</span>
              <span class="row-l">{c.label}</span>
              <span class="row-h mono">{c.hint}</span>
            </button>
          </li>
        {/each}
        {#if filtered.length === 0}
          <li class="empty mono">no match — but the machine is still running</li>
        {/if}
      </ul>
    </div>
  </div>
{/if}

<style>
  .scrim {
    position: fixed;
    inset: 0;
    z-index: var(--z-palette);
    background: rgba(2, 3, 6, 0.72);
  }
  .pal {
    position: fixed;
    z-index: calc(var(--z-palette) + 1);
    left: 50%;
    top: 18vh;
    transform: translateX(-50%);
    width: min(620px, calc(100vw - 2rem));
    animation: pop 200ms var(--ease-out);
  }
  @keyframes pop {
    from {
      opacity: 0;
      transform: translate(-50%, 8px);
    }
  }
  .pal-in {
    padding: var(--sp-2);
  }
  .field {
    display: flex;
    align-items: center;
    gap: 0.6em;
    padding: 0.7em 0.8em;
    border-bottom: 1px solid var(--line);
  }
  .prompt {
    color: var(--red-lit);
  }
  .field input {
    flex: 1;
    background: none;
    border: none;
    color: var(--ink);
    font-family: var(--font-body);
    font-size: 1rem;
    outline: none;
  }
  .esc {
    font-size: 0.6rem;
    color: var(--ink-3);
    padding: 0.2em 0.4em;
    box-shadow: var(--e1);
  }
  .list {
    max-height: 50vh;
    overflow-y: auto;
    padding: var(--sp-2) 0 0;
  }
  .row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.8em;
    padding: 0.6em 0.7em;
    text-align: left;
    color: var(--ink-2);
  }
  .row.on {
    background: var(--surface-1);
    color: var(--ink);
    box-shadow: inset 2px 0 0 var(--red-lit);
  }
  .row-k {
    width: 1.6em;
    font-size: 0.7rem;
    color: var(--ink-3);
    text-align: center;
  }
  .row-l {
    flex: 1;
    font-size: 0.9rem;
  }
  .row-h {
    font-size: 0.68rem;
    color: var(--ink-3);
  }
  .empty {
    padding: 1.2em;
    text-align: center;
    color: var(--ink-3);
    font-size: 0.8rem;
  }
</style>
