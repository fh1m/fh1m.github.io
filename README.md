# fahim-personal-site

A static personal site for Fahim Faisal — machines that perceive, reason, and act. Built as an instrument panel: near-black, hairline grid, one amber accent.

## Stack

- Astro 5 (static output)
- TypeScript
- Self-hosted fonts (Iosevka, Roboto Mono Variable, IBM Plex Sans, Instrument Serif via @fontsource)
- GSAP + Lenis for motion, gated behind `prefers-reduced-motion`
- No frontend frameworks, no CSS frameworks

### Typography sizing note

Iosevka is narrow (~0.5em advance) — display text fits roughly half the width of a typical grotesque at the same size. The display scale caps at 4.5rem (72px) and the mono floor is 12px (`--text-mono`); the old 9rem Archivo overflow fix (scoped 404 clamp) is no longer needed. All 800/900 display weights are normalized to 700 — only latin-400 + latin-700 are imported.

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

The live domain is `https://fh1m.github.io` — a GitHub Pages user site, served from the root with no base path (`site` in `astro.config.mjs`). The email link in `src/data/profile.ts` is the real address (`fahim.2002.faisal@gmail.com`).

## Content review checklist

Run before shipping. All copy is drafted — replace or correct anything that does not match reality.

- [ ] `grep -r 'VERIFY' dist` returns 0 hits (currently 52 markers in built HTML — each one is a fact to confirm)
- [ ] `grep -riE 'passionate|innovative|cutting-edge|synergy|leveraging' dist` returns 0 hits (expect zero)
- [ ] `grep -r '∞' dist` returns 0 hits
- [ ] `grep -r '#000' dist` returns 0 hits
- [ ] `grep -r 'border-radius' dist` returns 0 hits
- [ ] `grep -r 'fonts.googleapis' dist` returns 0 hits
- [ ] Identity copy is accurate: name (Fahim Faisal), handle (fh1m), location (Dhaka, Bangladesh), GitHub (github.com/fh1m), Duburi (bracu-duburi.com)
- [ ] RoboSub results are correct: 2023 runners-up (2nd), 2025 9th, 2026 8th (6230 pts)
- [ ] Machine repo links and dates match GitHub (Duburi, duburi_ws, duburi-sim_ws, duburi-codebase_RND, calib_challenge_fh1m, Arduino-Vision, vision-scratch repos, secure-terminal-p2p-chat, toolchain repos)
- [ ] Air / drones & GPS-denied navigation entry is confirmed (no public repo — drafted from the brief narrative)
- [ ] AERD name and scope are confirmed (air-gnc entry + about chapter 01 "AERD / ROCKETS" — program name, dates, and what it actually covers)
- [ ] Mongol Tori spelling is confirmed (duburi-sim_ws + about chapter 02 "MONGOL TORI" — repo README says "Mongla", v2 plan says "Mongol Tori")
- [ ] Unauthorized Engineering collective name and framing confirmed (log phase-06 + now page + about chapter 08 "INDEPENDENT SYSTEMS / UE" — name, framing, motto-spirit line)
- [ ] Subteam-lead role start date is confirmed (2025 — log phase-04/05)
- [ ] Engineering-lead transition date is confirmed (2026 — log phase-05)
- [ ] Notebook publish dates are confirmed (all are draft placeholders)
- [ ] Log phase dates and role titles are confirmed (2022 start year, subteam-lead to engineering-lead arc)
- [ ] Email link is real (`fahim.2002.faisal@gmail.com`)
- [ ] Media: all machine pages show `[MEDIA: PENDING]` placeholders — no images or video are shipped yet