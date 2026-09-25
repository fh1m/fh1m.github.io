<script lang="ts">
  let { lines, title = 'output', accent = 'sea' }: { lines: string[]; title?: string; accent?: string } = $props();
</script>

<div class="term" style="--ac:var(--{accent}-lit, var(--sea-lit))">
  <div class="term-bar">
    <span class="dots"><i></i><i></i><i></i></span>
    <span class="term-title mono">{title}</span>
    <span class="term-live mono">● live</span>
  </div>
  <pre class="term-body">{#each lines as l}<span class="ln">{l}</span>
{/each}</pre>
</div>

<style>
  .term {
    background: #04060b;
    box-shadow: var(--e1);
    overflow: hidden;
  }
  .term-bar {
    display: flex;
    align-items: center;
    gap: 0.7em;
    padding: 0.5em 0.8em;
    border-bottom: 1px solid var(--line);
    background: linear-gradient(180deg, #0b0e15, #070a10);
  }
  .dots {
    display: inline-flex;
    gap: 4px;
  }
  .dots i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22262f;
  }
  .dots i:first-child {
    background: var(--ac);
  }
  .term-title {
    font-size: 0.62rem;
    color: var(--ink-3);
    letter-spacing: 0.1em;
  }
  .term-live {
    margin-left: auto;
    font-size: 0.58rem;
    color: var(--ok);
  }
  .term-body {
    margin: 0;
    padding: 1em 1.1em;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    line-height: 1.7;
    color: var(--ink-2);
    white-space: pre-wrap;
    word-break: break-word;
    overflow-x: auto;
  }
  .ln {
    display: block;
  }
  .ln:first-child {
    color: var(--ac);
  }
</style>
