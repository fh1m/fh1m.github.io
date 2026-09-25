# fh1m.github.io — Fahim Faisal

Personal site for **Fahim Faisal** (`fh1m`) — an autonomy & robotics engineer from Dhaka.
Machines that perceive, reason, and act. Built as an instrument: near-black ground, one blue
signal, one measured red, real WebGL, real numbers.

## Stack

- **SvelteKit** (Svelte 5, runes) + **`@sveltejs/adapter-static`** — fully prerendered static site
- **three.js** — the WebGL caustic/depth field behind the hero (custom GLSL, lazy-loaded, graceful fallback)
- **GSAP** + **Lenis** — smooth scroll + scroll orchestration
- Self-hosted fonts: **Manrope** (display), **Zed Sans** (prose), **Zed Mono** (data) — from `mongla_ws`
- Custom design-token system (`src/lib/styles`), no CSS framework
- Everything gated behind `prefers-reduced-motion`

## Content is real

- **Repos, languages, commit cadence** — pulled from the GitHub API (24 repos, mongla_ws's 1,038 commits).
  The site tells an *activity* story, not a popularity one.
- **Press** — real coverage; wording is press-verified (no unverified competition rankings).
- **Publications** — the two papers Fahim is a listed author on.
- **Principles** — inspiration voices + lines mined from his own commit history.
- **Media** — vendored into `static/media` with sources in [`static/media/CREDITS.md`](static/media/CREDITS.md).
  Re-fetch with `node scripts/fetch-media.mjs`.

Honesty rules kept from `mongla_ws`: `calib_challenge` is described as a comma.ai fork; C++/Rust
are not claimed as public primary languages; absent values render as `--`, never a fake `0`.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output → build/
npm run check      # svelte-check + tsc
```

## Deploy

Push to `main`. `.github/workflows/deploy.yml` builds and deploys to GitHub Pages
(upload-pages-artifact + deploy-pages). User site — served from the domain root, no base path.

One-time repo setting → **Settings → Pages → Source: GitHub Actions**.

## Structure

```
src/routes/          # /, /work, /work/[slug], /writing, /writing/[slug], /log, /about, /now
src/lib/components/   # Hero, Console (WebGL + skeuomorphic), Boot, dashboards, charts, chrome
src/lib/data/         # typed content: profile, repos, stats, press, publications, principles…
src/lib/styles/       # tokens, fonts, base
scripts/fetch-media.mjs
static/media/         # vendored real assets + CREDITS.md
```
