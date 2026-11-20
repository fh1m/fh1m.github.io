# fh1m.github.io

Fahim Faisal's personal observatory and working archive. A direct entrance leads to the life story, engineering work or an optional navigable solar system. The record begins with a 2021 web internship, not with the latest robotics stack.

## What's here

- **Observatory** (`/`): a direct personal entrance and optional three.js system. “Find a place” collapses out of the way; Enter opens the matching project, selection closes the index, and Escape closes the index before a project panel. Project/world fragments are bookmarkable and restore their destination when returning from a story. Domain entry frames the planet and its project neighbourhood rather than hiding most moons off-screen. Air, water, land and silicon contain schematic artefacts and source-linked panels. Bunnu is opt-in; sound is separate. The Voyager opening at `/?intro` is optional.
- **Missions**: four real failures you can debug, each with an after-action report (`/missions/*`) and an explorable that reproduces the bug.
- **Notebook** (`/notes`): continuous long-form reading with a section/source rail. Compact tables fit their content instead of inheriting an artificial minimum width. Authored diagrams and runtime SVG charts with text retain labelled, keyboard-accessible horizontal regions rather than shrinking axis labels to a few pixels on phones; text-free illustrations still fit the viewport. Evidence remains beside its explanation.
- **What I got wrong** (`/lessons`): sixteen lessons learned in NASA's format, each linked to its fix.
- **All the work** (`/everything`): every project and every public repository, without the planet. The repository ledger uses the available page width, separates dates into a desktop column, and stacks cleanly on narrow screens.
- **Life archive** (`/log`): twelve chapters, original photographs, silent archival film excerpts, interactive models, education and public repositories. Early work, transitions and unfinished experiments remain visible.
- **Work and credibility** (`/about`): responsibilities, measured experiments, team achievements, all preserved press/mentions, certificates and publications. Newsroom, institutional and sponsor sources are distinguished.
- **Professional documents**: a two-page technical CV (`/cv`) and one-page résumé (`/resume`), both with centred headers, 10pt print body text and tagged, selectable-text PDFs. Dates stay beside their roles and degrees in normal reading order. The résumé selects one contribution per featured role; the full CV retains the complete role bullets. Visible source URLs lead to campaign records and bounded engineering measurements. Public PDF links use the configured site URL, never the temporary print-server address.

Reduced motion, low-end devices and browsers without WebGL2 get a still with the same panels, and three.js never loads. Without JavaScript the story, work, notebook, project and professional-document pages retain their content; `/everything` is the text alternative to the observatory.

## Stack

- [Astro](https://astro.build) 7, static output, MDX on the unified processor
- three.js for the observatory; plain SVG and canvas for explorables (`src/explore`, `src/benches`)
- `src/lib/rehype-reading.mjs` preserves authored order and provides accessible regions for wide technical material.
- Manrope headings, Zed Sans reading and interface text, IBM Plex Mono code/data, and Tiro Bangla; all self-hosted. Professional documents retain conventional Plex Sans typography.

## Develop

Tests require Chromium and Poppler's `pdfinfo` and `pdftotext` (`poppler` on Arch, `poppler-utils` on Ubuntu). The PDF regression checks page counts, document tagging, public project links, the documented 2.5MB parsing limit, and critical fields and date association in logical and layout-preserving text extraction from the actual served files. These are local compatibility checks, not an ATS score, vendor certification or a guarantee of screening results. No résumé is uploaded to a screening service. [Greenhouse documents why image-only documents, complex columns, text boxes and misplaced contact information can prevent parsing](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse).

```bash
npm ci
npm run dev          # http://localhost:4321
npm run stats        # refresh src/data/github.json from the GitHub API (uses gh auth or GITHUB_TOKEN)
npm run build        # astro build, then both professional-document PDFs
npx playwright install chromium
npm test             # smoke tests against the built site
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: refresh the GitHub stats, install Poppler and Chromium, type-check, build, run the smoke/PDF regressions, then publish to GitHub Pages. It also runs daily so the numbers stay current.

## Rules the content keeps

- Live GitHub aggregates come from the public API at build time. Technical numbers are dated, source-backed measurements, not live telemetry; commit history snapshots come from `scripts/mine-commits.mjs`. API failure preserves the previous timestamped snapshot.
- Credit is explicit: Mongla's board and firmware are Rakibul Islam's; the university-programme vehicles are BRACU Duburi's.
- Duburi leadership is a former role ending August 2026, when Fahim also left BRAC University, per his direct correction. Older team listings do not override that departure date. Historical campaign credits remain dated rather than being rewritten as current membership.
- Media sources are listed in [`public/media/CREDITS.md`](public/media/CREDITS.md).

## Archive maintenance

`src/data/story.ts` holds the life chapters; `facts.ts` holds dated roles, education and publications. `project-context.ts` adds each project's problem, method and explicit validation boundary. Public repository inventory includes archived work and forks, but never private repositories.

The supplied controller, DINO and modular perception trees are preserved experiments, not automatically deployment records. `/notes/the-2025-workbench` distinguishes source inspection and isolated numerical probes from hardware validation. `/notes/reading-the-ping360` credits Fahim's four applications separately from modified upstream-based helpers and upstream data; independent firmware remains the development motivation, not a completed release. Archive films are silent, user-started and `preload="none"`. Original assets remain untouched; derivative sources are in the media credits.

`/notes/dhrubotara` separates the historical XFeat/YOLO/IMU interface from a new ORB-assisted CPU replay and a controlled image-translation experiment. The measured image-space results do not claim metric pose or depth. Archive films accept their intrinsic dimensions and retain that aspect ratio under the viewport-height limit; the 4:3 pool preview is a lower-bandwidth inspection copy, not the research input.

`/notes/matra` follows metric-scale recovery and the scene-dependent depth conversion with a keyboard-operable numerical explainer. Both [Dhrubotara](https://github.com/fh1m/dhrubotara) and [Matra](https://github.com/fh1m/matra) are published research repositories; their source links appear beside article introductions and their public metadata enters the normal GitHub inventory. Dhrubotara's historical backend has one recorded publication-only signing-key sanitization; the supplied original remains untouched.

`/notes/happy-little-trees` distinguishes realised label flips from their probability, derives the conditional population-accuracy reference, explains greedy splitting and cost-complexity pruning, and bounds the compiled-C comparison to its tested inputs. The published experiment's plot annotation and README carry the same correction; its seed, data and printed model scores are unchanged.

`/notes/turning-a-camera-into-a-sensor` keeps its animated scale illustration separate from the measured evidence. `FlowRecords.astro` renders all four source records once, as a native table that remains readable without JavaScript and does not scale its labels down with an SVG. The dated diagonal diagnostic is retained, not selected by an error threshold; its unverified path is not graded against the three axial 30cm references. The chapter distinguishes integrated-distance magnitude, direction, reference uncertainty and algebraically derived height consistency from underwater velocity validation.

`/notes/dhara` follows the temporal-unit boundary in the same modular perception snapshot. The public [Dhara repository](https://github.com/fh1m/dhara) preserves the complete odometry/state modules, replays the unchanged velocity assignment on controlled metric poses, and contrasts capture-time and completion-time intervals. Its native-control illustration is arithmetic, not a run of the historical vision pipeline; event labels remain HTML text rather than shrinking inside an SVG. The source modules are byte-preserved, and no hardware, model weights or active Mongla repository is modified.

Mongla's CV, role summary, observatory and article use the dated 19 November 2026 accelerator-sharing experiment: two 30 Hz detector workers plus 3 Hz XFeat for 15 seconds on one repeated image. They do not promote its call rates into camera throughput, ROS performance or accuracy. The cautioned B-61 18 ms / 53.9 Hz headlines are retired; the article retains the failed higher-rate condition and links the immutable ledger correction. `/notes/the-frame-age-problem` separates kernel-stamp age, call duration, clock propagation and ownership from physical sensor-to-actuator timing. Its ideal queue illustration handles an empty queue by waiting for the first new frame; the keep-up policy can instead return the preceding frame again.

The observatory's Mongla miniature depicts two camera inputs, compute and a control interface rather than inventing a finished vehicle. Its panel states that illustrative scope and leads with recorded-pool replay imagery. Hull CAD remains clearly labelled design context inside the archive, not a cover. Bunnu's canopy now contains the cat pilot rather than detached ear shapes; repeated eye, ear and fin parts share geometry and materials.

The 2025 workbench also records two isolated version-7 identity probes using the unchanged Kalman, IoU, feature-bank and assignment definitions on CPU with OpenCV 4.12. Expiration can invalidate returned display indices, and omitted feature rows can assign another track's appearance evidence to the wrong ID. No model weights, camera or vehicle are exercised by those probes; their results are not a historical tracking-accuracy score.
