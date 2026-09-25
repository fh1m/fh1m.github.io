<script lang="ts">
  import type { Repo } from '$lib/data/repos';
  import { reveal } from '$lib/actions/reveal';
  let { repo, delay = 0 }: { repo: Repo; delay?: number } = $props();
  const card = $derived(`/media/repos/${repo.name}.png`);
</script>

<a class="rc" href={repo.url} target="_blank" rel="noopener" use:reveal={{ delay }} data-cursor>
  <div class="rc-media">
    <img src={card} alt={repo.name} loading="lazy" onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')} />
  </div>
  <div class="rc-body">
    <div class="rc-top">
      <span class="rc-name mono">{repo.name}{#if repo.fork}<span class="fork">fork</span>{/if}</span>
      <span class="rc-lang mono">{repo.lang ?? '—'}</span>
    </div>
    <p class="rc-desc">{repo.desc}</p>
    <div class="rc-meta mono">
      {#if repo.stars > 0}<span>★ {repo.stars}</span>{/if}
      <span>updated {repo.pushed}</span>
    </div>
  </div>
</a>

<style>
  .rc {
    display: grid;
    grid-template-rows: auto 1fr;
    background: linear-gradient(180deg, var(--surface-1), var(--d1));
    box-shadow: var(--e1);
    overflow: hidden;
    transition:
      transform var(--dur) var(--ease-out),
      box-shadow var(--dur) var(--ease-out);
  }
  .rc:hover {
    transform: translateY(-3px);
    box-shadow: var(--e2);
  }
  .rc-media {
    aspect-ratio: 2 / 1;
    background: var(--d0);
    overflow: hidden;
  }
  .rc-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .rc-body {
    padding: var(--sp-4);
    display: grid;
    gap: 0.4em;
    align-content: start;
  }
  .rc-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.6em;
  }
  .rc-name {
    font-size: 0.82rem;
    color: var(--ink);
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
  }
  .fork {
    font-size: 0.55rem;
    color: var(--amber-lit);
    text-transform: lowercase;
    letter-spacing: 0.1em;
    padding: 0.1em 0.4em;
    box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--amber) 40%, transparent);
  }
  .rc-lang {
    font-size: 0.64rem;
    color: var(--sea-lit);
  }
  .rc-desc {
    font-size: 0.8rem;
    color: var(--ink-2);
    line-height: 1.45;
  }
  .rc-meta {
    display: flex;
    gap: 1em;
    font-size: 0.62rem;
    color: var(--ink-3);
    margin-top: 0.3em;
  }
</style>
