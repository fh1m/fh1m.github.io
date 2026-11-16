# fh1m.github.io

The robotics work of Fahim Faisal (`fh1m`) as a small planet. Each region holds the machines built for one place a machine can fail: air (a thrust-vector gimbal, rocketry), water (Duburi, Mongla), land (rovers, E-Bhapa) and silicon (Dristy on a K210, tools). Every project opens to what broke, what fixed it, and the commit that did it.

![The planet from orbit: a sandy airfield cap under clouds, green land, a blue sea along one side, landmarks around the rim](public/world/poster.webp)

## What's here

- **The planet** (`/`): a three.js scene. Click a region or any object to open its panel. Bunnu, the guide, explains why things were built the way they were.
- **Missions**: four real failures you can debug, each with an after-action report (`/missions/*`) and an explorable that reproduces the bug.
- **Notebook** (`/notes`): long notes split into scenes at build time; figures and explorables stay on a sticky stage beside the text.
- **What I got wrong** (`/lessons`): sixteen lessons learned in NASA's format, each linked to its fix.
- **All the work** (`/everything`): every project and every public repository, without the planet.
- **CV** (`/cv`) with a generated PDF.

Reduced motion, low-end devices and browsers without WebGL2 get a still of the planet with the same panels, and three.js never loads. Without JavaScript, every page's content is complete.

## Stack

- [Astro](https://astro.build) 7, static output, MDX on the unified processor
- three.js for the planet; plain SVG and canvas for explorables (`src/explore`, `src/benches`)
- `src/lib/rehype-scenes.mjs` turns each note's sections into scenes
- Zed Sans, Zed Mono and Tiro Bangla, self-hosted

## Develop

```bash
npm ci
npm run dev          # http://localhost:4321
npm run stats        # refresh src/data/github.json from the GitHub API (uses gh auth or GITHUB_TOKEN)
npm run build        # astro build, then the CV PDF
npx playwright install chromium
npm test             # smoke tests against the built site
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: refresh the GitHub stats, build, publish to GitHub Pages. It also runs daily so the numbers stay current.

## Rules the content keeps

- Every number has a source: GitHub numbers come from the API at build time, commit counts from `src/data/commits.json` (`scripts/mine-commits.mjs`). None are typed in.
- Credit is explicit: Mongla's board and firmware are Rakibul Islam's; the university-programme vehicles are BRACU Duburi's.
- Media sources are listed in [`public/media/CREDITS.md`](public/media/CREDITS.md).
