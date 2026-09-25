<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { initMotion } from '$lib/motion';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import InstrumentBar from '$lib/components/InstrumentBar.svelte';
  import CommandPalette from '$lib/components/CommandPalette.svelte';
  import Boot from '$lib/components/Boot.svelte';

  let { children } = $props();

  onMount(() => initMotion());
</script>

<div class="fx-grain"></div>
<div class="fx-scanline"></div>
<div class="fx-vignette"></div>

<Boot />
<Cursor />
<CommandPalette />

<a class="skip-link" href="#main">Skip to content</a>
<Header />

<main id="main">
  {@render children()}
</main>

<Footer />
<InstrumentBar />

<style>
  .skip-link {
    position: fixed;
    top: 8px;
    left: 8px;
    z-index: calc(var(--z-header) + 5);
    background: var(--surface-2);
    color: var(--ink);
    padding: 0.6em 1em;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    box-shadow: var(--e1);
    transform: translateY(-160%);
    transition: transform var(--dur-fast) var(--ease-out);
  }
  .skip-link:focus {
    transform: none;
  }
  main {
    min-height: 60vh;
  }
</style>
