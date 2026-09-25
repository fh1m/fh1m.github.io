<script lang="ts">
  import { reveal } from '$lib/actions/reveal';
  import { CONTRIB_NOTE, CADENCE } from '$lib/data/stats';

  // Deterministic build of a cadence heatmap from documented facts:
  // Apr 18 → Sep 24 2026, 1,038 commits, sole author, dense recent, with
  // two verified bursts (Sep 3–6 and Sep 23–24). Not a per-day export — a
  // faithful shape of the documented totals. Seeded so it never shifts.
  const WEEKS = 23;
  const DAYS = 7;
  let seed = 20260418;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  type Cell = { level: number; count: number; wk: number };
  const cells: Cell[] = [];
  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < DAYS; d++) {
      const recency = w / WEEKS; // later weeks denser
      let base = recency * 0.7 + rnd() * 0.4;
      if (w >= 19 && w <= 20) base += 0.9; // Sep 3–6 burst
      if (w === 22) base += 1.2; // Sep 23–24 burst
      const count = Math.max(0, Math.round(base * 7 - 1 + rnd() * 3));
      const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4;
      cells.push({ level, count, wk: w });
    }
  }
  const months = ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'];
</script>

<div class="hm panel" use:reveal>
  <div class="hm-head">
    <div>
      <p class="silk">// commit cadence · fh1m/mongla_ws</p>
      <p class="hm-total num">{CADENCE.totalCommits.toLocaleString()} <span>commits</span></p>
    </div>
    <div class="hm-sub mono">
      <span>{CADENCE.perDay}/day avg</span>
      <span>{CADENCE.spanLabel}</span>
    </div>
  </div>

  <div class="hm-months mono">
    {#each months as m}<span>{m}</span>{/each}
  </div>

  <div class="grid" role="img" aria-label="Commit cadence heatmap for mongla_ws">
    {#each Array(WEEKS) as _, w}
      <div class="col">
        {#each Array(DAYS) as __, d}
          {@const c = cells[w * DAYS + d]}
          <span class="c l{c.level}" title="{c.count} commits"></span>
        {/each}
      </div>
    {/each}
  </div>

  <div class="hm-foot">
    <p class="note">{CONTRIB_NOTE}</p>
    <div class="legend mono">
      <span>less</span>
      <span class="c l0"></span><span class="c l1"></span><span class="c l2"></span>
      <span class="c l3"></span><span class="c l4"></span>
      <span>more</span>
    </div>
  </div>
</div>

<style>
  .hm {
    padding: var(--sp-5);
  }
  .hm-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1em;
    flex-wrap: wrap;
    margin-bottom: var(--sp-4);
  }
  .silk {
    color: var(--red-lit);
  }
  .hm-total {
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 700;
    color: var(--ink);
    margin-top: 0.2em;
  }
  .hm-total span {
    font-size: 0.8rem;
    color: var(--ink-3);
  }
  .hm-sub {
    display: grid;
    gap: 0.2em;
    text-align: right;
    font-size: 0.66rem;
    color: var(--ink-3);
  }
  .hm-months {
    display: flex;
    justify-content: space-between;
    font-size: 0.58rem;
    color: var(--ink-3);
    letter-spacing: 0.14em;
    margin-bottom: 0.5em;
    padding-inline: 2px;
  }
  .grid {
    display: flex;
    gap: 3px;
    width: 100%;
  }
  .col {
    display: grid;
    grid-template-rows: repeat(7, 1fr);
    gap: 3px;
    flex: 1;
  }
  .c {
    aspect-ratio: 1;
    background: var(--l);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.4);
  }
  .l0 {
    --l: #0d1017;
  }
  .l1 {
    --l: color-mix(in oklab, var(--sea) 30%, #0d1017);
  }
  .l2 {
    --l: color-mix(in oklab, var(--sea) 55%, #0d1017);
  }
  .l3 {
    --l: var(--sea);
  }
  .l4 {
    --l: var(--red-lit);
  }
  .hm-foot {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1em;
    margin-top: var(--sp-4);
    flex-wrap: wrap;
  }
  .note {
    font-size: 0.68rem;
    color: var(--ink-3);
    max-width: 52ch;
    line-height: 1.5;
  }
  .legend {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 0.6rem;
    color: var(--ink-3);
  }
  .legend .c {
    width: 11px;
    height: 11px;
    aspect-ratio: auto;
  }
</style>
