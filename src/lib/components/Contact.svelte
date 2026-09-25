<script lang="ts">
  import { PROFILE } from '$lib/data/profile';
  import { reveal } from '$lib/actions/reveal';
</script>

<section class="contact section" id="contact">
  <div class="container">
    <div class="c-inner sheet" use:reveal>
      <p class="eyebrow">// {PROFILE.availability}</p>
      <h2 class="c-title">
        Want a machine<br />that actually <em>moves?</em>
      </h2>
      <p class="c-lede">
        I’m looking for autonomy, robotics and ML work where the code eventually has to touch the
        real world. If that’s you, the fastest path is one email.
      </p>

      <div class="c-actions">
        <a class="key primary big-key" href={PROFILE.links.email} data-cursor>
          <span class="mono">›</span> {PROFILE.links.emailPlain}
        </a>
      </div>

      <div class="c-rows mono">
        <a href={PROFILE.links.github} target="_blank" rel="noopener" data-cursor>
          <span class="k">GITHUB</span><span class="v">github.com/fh1m</span><span class="a">↗</span>
        </a>
        <a href={PROFILE.links.duburi} target="_blank" rel="noopener" data-cursor>
          <span class="k">TEAM</span><span class="v">bracuduburi.com</span><span class="a">↗</span>
        </a>
        <a href="https://fh1m.github.io/mongla_ws/" target="_blank" rel="noopener" data-cursor>
          <span class="k">FLAGSHIP</span><span class="v">mongla — the AUV stack</span><span class="a">↗</span>
        </a>
        <div class="loc">
          <span class="k">BASED</span><span class="v">{PROFILE.location}</span><span class="a">◎</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .contact {
    border-top: 1px solid var(--line);
  }
  .c-inner {
    position: relative;
    padding: clamp(2rem, 6vw, 5rem);
    background:
      radial-gradient(90% 120% at 100% 0%, color-mix(in oklab, var(--sea) 12%, transparent), transparent 60%),
      radial-gradient(70% 90% at 0% 100%, color-mix(in oklab, var(--cad-red) 8%, transparent), transparent 60%),
      linear-gradient(180deg, var(--surface-1), var(--d1));
    box-shadow: var(--e2);
  }
  .c-title {
    font-size: var(--text-display);
    letter-spacing: -0.03em;
    margin: 0.3em 0 0.4em;
  }
  .c-title em {
    font-style: italic;
    font-family: var(--font-body);
    font-weight: 400;
    color: var(--red-lit);
  }
  .c-lede {
    max-width: 52ch;
    color: var(--ink-2);
    font-size: var(--text-lede);
    line-height: 1.5;
  }
  .c-actions {
    margin: var(--sp-6) 0;
  }
  .big-key {
    font-size: 0.95rem;
    padding: 1em 1.4em;
    text-transform: none;
    letter-spacing: 0.02em;
  }
  .big-key .mono {
    color: #fff;
  }
  .c-rows {
    display: grid;
    gap: 0;
    max-width: 560px;
  }
  .c-rows > * {
    display: grid;
    grid-template-columns: 6rem 1fr auto;
    gap: 1em;
    align-items: center;
    padding: 0.8em 0;
    border-bottom: 1px solid var(--line);
    font-size: 0.8rem;
  }
  .c-rows .k {
    color: var(--ink-3);
    font-size: 0.66rem;
    letter-spacing: 0.14em;
  }
  .c-rows .v {
    color: var(--ink);
  }
  .c-rows .a {
    color: var(--sea-lit);
  }
  .c-rows a:hover .v {
    color: var(--sea-lit);
  }
</style>
