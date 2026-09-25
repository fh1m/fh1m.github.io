<script lang="ts">
  import type { DeepTable } from '$lib/data/deepdives';
  let { table }: { table: DeepTable } = $props();
  const cell = (c: string | { v: string; accent?: string }) => (typeof c === 'string' ? { v: c } : c);
</script>

<div class="ct">
  <table>
    <thead>
      <tr>
        {#each table.cols as c}<th class="mono">{c}</th>{/each}
      </tr>
    </thead>
    <tbody>
      {#each table.rows as row}
        <tr>
          {#each row as c, i}
            {@const cc = cell(c)}
            <td class="mono" class:head={i === 0} data-ac={cc.accent ?? ''}>{cc.v}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .ct {
    overflow-x: auto;
    box-shadow: var(--e1);
    background: var(--d1);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.72rem;
  }
  th {
    text-align: left;
    padding: 0.7em 1em;
    color: var(--ink-3);
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    text-transform: lowercase;
    border-bottom: 1px solid var(--line-lit);
    background: #0b0e15;
  }
  th:first-child {
    color: var(--red-lit);
  }
  td {
    padding: 0.7em 1em;
    color: var(--ink-2);
    border-bottom: 1px solid var(--line);
    white-space: nowrap;
  }
  td.head {
    color: var(--ink);
  }
  tr:hover td {
    background: color-mix(in oklab, var(--sea) 6%, transparent);
  }
  td[data-ac='ok'] {
    color: var(--ok);
  }
  td[data-ac='red'] {
    color: var(--red-lit);
  }
  td[data-ac='sea'] {
    color: var(--sea-lit);
  }
  td[data-ac='amber'] {
    color: var(--amber-lit);
  }
</style>
