# fahim-personal-site

A static personal site for Fahim Faisal — machines that perceive, reason, and act. Built as an instrument panel: near-black, hairline grid, one amber accent.

## Stack

- Astro 5 (static output)
- TypeScript
- Self-hosted fonts (Archivo, JetBrains Mono, IBM Plex Sans, Instrument Serif via @fontsource)
- GSAP + Lenis for motion, gated behind `prefers-reduced-motion`
- No frontend frameworks, no CSS frameworks

## Local run

```
npm install
npm run dev
```

Dev server: http://localhost:4321

## Build / check

```
npm run build
npm run check
```

`npm run build` emits a static site to `dist/`. `npm run check` runs `astro check` plus `tsc --noEmit`.

## Deploy

### GitHub Pages

Push to `main`. `.github/workflows/deploy.yml` builds and deploys via the official Pages actions (upload-pages-artifact + deploy-pages).

One-time repo setting, Settings > Pages:
- Source: GitHub Actions
- Path: /

No base path is configured in `astro.config.mjs`; the site is served from the domain root.

### Vercel

Import the repo in Vercel — zero-config static deploy. No `vercel.json` needed.

### Domain

`astro.config.mjs` sets `site: 'https://fahim-faisal.dev'` — a placeholder. Search the repo for `fahim-faisal.dev` and replace with the real domain before publishing. The email link in `src/data/profile.ts` is also a placeholder (`hello@fahimfaisal.dev`).

## Content review checklist

Run before shipping. All copy is drafted — replace or correct anything that does not match reality.

- [ ] `grep -r 'VERIFY' dist` returns 0 hits (currently 44 markers in built HTML — each one is a fact to confirm)
- [ ] `grep -riE 'passionate|innovative|cutting-edge|synergy|leveraging' dist` returns 0 hits (expect zero)
- [ ] `grep -r '∞' dist` returns 0 hits
- [ ] `grep -r '#000' dist` returns 0 hits
- [ ] `grep -r 'border-radius' dist` returns 0 hits
- [ ] `grep -r 'fonts.googleapis' dist` returns 0 hits
- [ ] Identity copy is accurate: name (Fahim Faisal), handle (fh1m), location (Dhaka, Bangladesh), GitHub (github.com/fh1m), Duburi (bracu-duburi.com)
- [ ] RoboSub results are correct: 2023 runners-up (2nd), 2025 9th, 2026 8th (6230 pts)
- [ ] Machine repo links and dates match GitHub (Duburi, duburi_ws, duburi-sim_ws, duburi-codebase_RND, calib_challenge_fh1m, Arduino-Vision, vision-scratch repos, secure-terminal-p2p-chat, toolchain repos)
- [ ] Air / drones & GPS-denied navigation entry is confirmed (no public repo — drafted from the brief narrative)
- [ ] Notebook publish dates are confirmed (all are draft placeholders)
- [ ] Log phase dates and role titles are confirmed (2022 start year, subteam-lead to engineering-lead arc)
- [ ] Email link is real (currently `hello@fahimfaisal.dev` placeholder)
- [ ] Unauthorized Engineering collective name and framing confirmed
- [ ] Media: all machine pages show `[MEDIA: PENDING]` placeholders — no images or video are shipped yet