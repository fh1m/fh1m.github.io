<script lang="ts">
  import { reveal } from '$lib/actions/reveal';
  let {
    index = '',
    eyebrow = '',
    title = '',
    meta = '',
  }: { index?: string; eyebrow?: string; title?: string; meta?: string } = $props();
</script>

<header class="sh" use:reveal>
  <div class="sh-top">
    {#if index}<span class="sh-index mono">{index}</span>{/if}
    {#if eyebrow}<span class="eyebrow">{eyebrow}</span>{/if}
    {#if meta}<span class="sh-meta mono">{meta}</span>{/if}
  </div>
  {#if title}<h2 class="sh-title">{title}</h2>{/if}
</header>

<style>
  .sh {
    margin-bottom: var(--sp-8);
  }
  .sh-top {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    padding-bottom: var(--sp-3);
    border-bottom: 1px solid var(--line);
    flex-wrap: wrap;
  }
  .sh-index {
    font-size: 0.72rem;
    color: var(--red-lit);
    letter-spacing: 0.1em;
  }
  .sh-meta {
    margin-left: auto;
    font-size: 0.68rem;
    color: var(--ink-3);
  }
  .sh-title {
    font-size: var(--text-display);
    margin-top: var(--sp-4);
    letter-spacing: -0.03em;
    max-width: 20ch;
  }
</style>
