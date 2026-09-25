<script lang="ts">
  import { PROFILE } from '$lib/data/profile';
  import { scrollToTop } from '$lib/motion';
  const year = new Date().getFullYear();
</script>

<footer class="ft">
  <div class="container-wide">
    <div class="ft-top">
      <div class="ft-cta">
        <p class="silk">// let’s build something that has to work</p>
        <a class="ft-mail" href={PROFILE.links.email} data-cursor>{PROFILE.links.emailPlain}</a>
      </div>
      <button class="top key" onclick={scrollToTop} data-cursor>↑ TOP</button>
    </div>
    <hr class="rule" />
    <div class="ft-grid">
      <div class="ft-links">
        <a href={PROFILE.links.github} target="_blank" rel="noopener" data-cursor>GITHUB</a>
        <a href={PROFILE.links.duburi} target="_blank" rel="noopener" data-cursor>BRACU DUBURI</a>
        <a href="https://fh1m.github.io/mongla_ws/" target="_blank" rel="noopener" data-cursor>MONGLA</a>
        <a href="/cv" data-cursor>CV</a>
        <a href={PROFILE.links.email} data-cursor>EMAIL</a>
      </div>
      <div class="ft-meta mono">
        <span><i class="d"></i>{PROFILE.status}</span>
        <span>{PROFILE.name} — {PROFILE.location}</span>
        <span>© {year} · built with SvelteKit + WebGL · no templates</span>
      </div>
    </div>
  </div>
</footer>

<style>
  .ft {
    border-top: 1px solid var(--line);
    margin-top: var(--sp-16);
    padding: var(--sp-8) 0 calc(var(--sp-8) + 40px);
    background: linear-gradient(180deg, transparent, color-mix(in oklab, var(--sea) 5%, transparent));
  }
  .ft-top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--sp-4);
    flex-wrap: wrap;
    margin-bottom: var(--sp-6);
  }
  .ft-cta .silk {
    color: var(--red-lit);
  }
  .ft-mail {
    display: block;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.5rem, 1rem + 3vw, 3rem);
    letter-spacing: -0.02em;
    color: var(--ink);
    margin-top: 0.2em;
  }
  .ft-mail:hover {
    color: var(--sea-lit);
  }
  .ft-grid {
    display: flex;
    justify-content: space-between;
    gap: var(--sp-6);
    flex-wrap: wrap;
    margin-top: var(--sp-5);
  }
  .ft-links {
    display: flex;
    gap: var(--sp-5);
    flex-wrap: wrap;
  }
  .ft-links a {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    color: var(--ink-3);
  }
  .ft-links a:hover {
    color: var(--ink);
  }
  .ft-meta {
    display: grid;
    gap: 0.3em;
    text-align: right;
    font-size: 0.68rem;
    color: var(--ink-3);
  }
  .ft-meta .d {
    display: inline-block;
    width: 7px;
    height: 7px;
    background: var(--ok);
    margin-right: 0.5em;
  }
  @media (max-width: 640px) {
    .ft-meta {
      text-align: left;
    }
  }
</style>
