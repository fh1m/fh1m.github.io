<script lang="ts">
  import { PROFILE } from '$lib/data/profile';
  import { scrollToTop } from '$lib/motion';
  import { NAV } from '$lib/data/nav';
  const year = new Date().getFullYear();
</script>

<footer class="ft">
  <div class="ft-marquee" aria-hidden="true">
    <div class="ft-track">
      {#each Array(6) as _}
        <span>let’s build something that has to work</span><span class="star">✦</span>
      {/each}
    </div>
  </div>

  <div class="container ft-in">
    <div class="ft-lead">
      <p class="silk">// end of transmission — reach the machine</p>
      <a class="ft-mail" href={PROFILE.links.email} data-cursor>{PROFILE.links.emailPlain}</a>
      <div class="ft-actions">
        <a class="key primary" href={PROFILE.links.email} data-cursor>hire fahim</a>
        <a class="key" href="/cv" data-cursor>download cv</a>
        <button class="key" onclick={scrollToTop} data-cursor>↑ back to top</button>
      </div>
    </div>

    <div class="ft-cols">
      <div class="ft-col">
        <span class="ft-h silk">pages</span>
        {#each NAV as n}<a href={n.href} data-cursor><span class="n mono">{n.num}</span>{n.label.toLowerCase()}</a>{/each}
      </div>
      <div class="ft-col">
        <span class="ft-h silk">elsewhere</span>
        <a href={PROFILE.links.github} target="_blank" rel="noopener" data-cursor>github ↗</a>
        <a href="https://fh1m.github.io/mongla_ws/" target="_blank" rel="noopener" data-cursor>mongla docs ↗</a>
        <a href={PROFILE.links.duburi} target="_blank" rel="noopener" data-cursor>bracu duburi ↗</a>
        <a href="/cv" data-cursor>cv ↓</a>
      </div>
      <div class="ft-col ft-status">
        <span class="ft-h silk">status</span>
        <div class="st-row"><i class="d ok"></i>machine · running</div>
        <div class="st-row"><i class="d sea"></i>vision · 53.9 hz</div>
        <div class="st-row"><i class="d red"></i>in water · never</div>
        <div class="st-row"><i class="d amber"></i>open to work</div>
      </div>
    </div>
  </div>

  <div class="container ft-base mono">
    <span>© {year} fahim faisal — {PROFILE.location}</span>
    <span class="ft-colophon">a film about a machine that works when nobody is watching</span>
    <span>sveltekit · webgl · no templates</span>
  </div>
</footer>

<style>
  .ft {
    border-top: 1px solid var(--line);
    margin-top: var(--sp-16);
    padding-bottom: calc(var(--sp-8) + 40px);
    background:
      radial-gradient(80% 120% at 100% 0%, color-mix(in oklab, var(--sea) 7%, transparent), transparent 60%),
      var(--surface-0);
  }
  .ft-marquee {
    overflow: hidden;
    border-bottom: 1px solid var(--line);
    padding: 0.7em 0;
    background: color-mix(in oklab, var(--cad-red) 5%, transparent);
  }
  .ft-track {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    width: max-content;
    animation: ftm 40s linear infinite;
  }
  .ft-track span {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1rem, 2.4vw, 1.8rem);
    letter-spacing: -0.01em;
    color: transparent;
    -webkit-text-stroke: 1px var(--ink-3);
    white-space: nowrap;
  }
  .ft-track .star {
    -webkit-text-stroke: 0;
    color: var(--red-lit);
  }
  @keyframes ftm {
    to {
      transform: translateX(-50%);
    }
  }
  .ft-in {
    display: grid;
    grid-template-columns: 1.1fr 1.4fr;
    gap: var(--sp-8);
    padding-top: var(--sp-10);
    padding-bottom: var(--sp-8);
    align-items: start;
  }
  .ft-lead .silk {
    color: var(--red-lit);
  }
  .ft-mail {
    display: block;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.3rem, 1rem + 2.4vw, 2.4rem);
    letter-spacing: -0.02em;
    color: var(--ink);
    margin: 0.3em 0 0.7em;
    word-break: break-word;
  }
  .ft-mail:hover {
    color: var(--sea-lit);
  }
  .ft-actions {
    display: flex;
    gap: var(--sp-2);
    flex-wrap: wrap;
  }
  .ft-cols {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sp-5);
  }
  .ft-col {
    display: grid;
    gap: 0.5em;
    align-content: start;
  }
  .ft-h {
    color: var(--ink-3);
    margin-bottom: 0.3em;
  }
  .ft-col a {
    font-size: 0.8rem;
    color: var(--ink-2);
    display: inline-flex;
    gap: 0.5em;
    align-items: baseline;
  }
  .ft-col a:hover {
    color: var(--sea-lit);
  }
  .ft-col a .n {
    font-size: 0.6rem;
    color: var(--ink-3);
  }
  .st-row {
    display: flex;
    align-items: center;
    gap: 0.5em;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--ink-2);
  }
  .st-row .d {
    width: 7px;
    height: 7px;
    flex: none;
  }
  .d.ok {
    background: var(--ok);
    box-shadow: 0 0 6px var(--ok);
  }
  .d.sea {
    background: var(--sea-lit);
  }
  .d.red {
    background: var(--red-lit);
  }
  .d.amber {
    background: var(--amber-lit);
    box-shadow: 0 0 6px var(--amber);
  }
  .ft-base {
    display: flex;
    justify-content: space-between;
    gap: 1em;
    flex-wrap: wrap;
    padding-top: var(--sp-5);
    border-top: 1px solid var(--line);
    font-size: 0.62rem;
    color: var(--ink-3);
  }
  .ft-colophon {
    color: var(--ink-3);
    opacity: 0.8;
  }
  @media (max-width: 820px) {
    .ft-in {
      grid-template-columns: 1fr;
      gap: var(--sp-6);
    }
  }
  @media (max-width: 520px) {
    .ft-cols {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .ft-track {
      animation: none;
    }
  }
</style>
