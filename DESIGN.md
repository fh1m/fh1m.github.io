# DESIGN.md: what this site is, and what it must never do

Read before touching any page. Every rule below comes from research (sources at the end),
and most of the "never" list is a mistake this site has already made once.

## The brief

An engineer from Dhaka telling his story to a mixed room: robotics people, serious people,
friends. The subject is machines that have to work alone in water, on land, in the air and
on small silicon, and the record of getting them wrong and fixing them. The proof is real:
photos of real vehicles, real commits, real measurements. The voice is Sagan's perspective,
Hotz's bluntness, Karpathy's "here is how it actually works", Rick's wit. Structure is
Donda/Rubin reduction: one thing at a time, nothing extra.

### November 2026 refinement

The entrance is now direct: a human introduction and three choices, with the animated opening opt-in. The selected observatory is a navigational exhibit, not a qualification. Its miniature project models are schematics; actual hardware, CAD and recorded output belong in the project/story pages.

The entrance universe stays edge-to-edge behind the introduction. Keep the canvas and reduced-motion poster at viewport bounds; use a continuous dark scrim for readability, not a translated scene that exposes a flat background strip. Object hover tips remain hidden until entering the observatory.

Oxocarbon Dark is the selected palette: neutral charcoal layers, bright neutral prose, pink primary actions and blue navigation/focus. Domain and data colors come from the same established family, not unrelated background hues. Photographs should be large enough to inspect; diagrams must say whether they are measured, simulated or illustrative. Press is a dated source list, never a wall of endorsement logos.

The shared type roles take the Mongla site's separation of display, prose and data without copying its vehicle-specific palette: Manrope headings, Zed Sans reading and interface text, IBM Plex Mono measurements/code and Tiro Bangla. Professional documents use conventional Plex Sans. Zed Sans must not be replaced by Zed Mono for body text. Important links remain visibly actionable. Wide technical material has labelled, focusable horizontal regions on phones; the document itself must not widen. Gallery images preserve native proportions and open at full resolution.

## Never (the documented tells, and where this site did them)

Type and labels
- Tracked-out ALL-CAPS labels or headings (we did: `F A H I M  F A I S A L`, `WATER`, CV/log section heads).
- An eyebrow label above a heading ("Lessons learned · after NASA's LLIS" above the h2).
- Meta strings glued with middle dots: `2026 · bench · 0 dives`. Say it as a sentence or lay it out.
- `→` / `↗` appended to links. A link is underlined; that is enough.
- A monospace face for every small label. Obel Mono is for code, commit hashes and tabular numbers only.
- A flat type scale where heading and body are nearly the same size (our 1.125 scale everywhere).
- One word of a headline in a different colour, italic or weight.

Colour and surfaces
- Undifferentiated near-black or navy content cards. Instrument frames may use a restrained blue-black surface when it helps separate controls from prose.
- Glow: coloured box-shadow/text-shadow halos (the header dot, the map pins).
- Glassmorphism: backdrop-blur panels floating over a background (the old sheets).
- Rainbow: colour that means nothing. Each nation colour is used only for its own nation.
- Decorative grid-line backgrounds (the explorable frames had one).

Layout
- Grids of identical cards (lessons, voices, notebook tiles, element tiles).
- Coloured left or top border stripes on cards or quotes.
- Stat banner rows: a grid of big-number/small-label boxes (project "figures").
- Numbered markers 01/02/03 unless the content really is a sequence.
- The same section template repeated on every page; hairline rules between everything.
- A 3D globe or HUD as a substitute for an introduction. The optional observatory must be preceded by direct routes to the story and work.

Motion
- Fade-up on scroll, hover-grow on every card, ambient loops that never stop.
- Motion is allowed only in answer to a person (open, drag, play) or once, deliberately.

Words
- "Not X, but Y" constructions; triads by reflex ("gravity, wind, and no second try").
- Puffery and significance claims; vague "associated with"; taglines.
- Self-description of the build ("Written in Dhaka… every number has a source").
- Generic hype verbs (elevate, seamless, unleash, empower).

## Always

- Ground each page in the most characteristic real thing: a photo of the vehicle, the hull
  CAD, the bench you can drag, the commit. That one thing is big; everything else is quiet.
- Spend boldness in one place per page (Chanel: remove one accessory before leaving).
- Real photographs only, candid over posed, never AI-generated imagery.
- Captions say a specific true thing ("Walking in with the flag of Bangladesh."), not a label.
- Copy is first person, plain verbs, sentence case, short; numbers carry their source.
- Contrast: body text ≥ 4.5:1 on black; no grey-on-grey small text.
- Works without JS, respects reduced motion, keyboard focus visible.

## Images: size, scale, placement

- Never display an image larger than its native pixels (check width before placing; a 512 px
  CFD render cannot be a 1400 px hero).
- Respect orientation: portrait photos go in portrait slots; never crop a portrait into a
  wide strip or rotate by accident (`e-bhapa.webp` is stored sideways; use `e-bhapa-upright.webp`).
- Scale by job: the evidence image is large; supporting images are smaller and grouped by
  orientation; a sequence of images reads left to right in story order.
- Before using any image, look at it. Filenames lie (`robosub25-1.webp` is a CFD render).
- Images of the university programme's vehicles belong to Duburi, not Mongla.
- Held media (see MEDIA_AUDIT) is never used.

## Canonical tokens

`src/data/palette.ts` supplies the selected Oxocarbon roles; `src/styles/global.css` supplies their CSS and typography roles. Do not reintroduce the superseded black-only palette or a second hard-coded nation-color system. Source photographs and planetary textures retain their actual colors.

Manrope is the heading face, Zed Sans the reading/interface face, IBM Plex Mono the code/data face and Tiro Bangla the Bangla face. Professional documents deliberately use Plex Sans. Heading contrast comes from hierarchy and composition, not oversized gaps or a different color on one word.

## Sources

- Anthropic, frontend-design SKILL.md (calibration clusters; label/arrow/middle-dot/mono tells).
- Adrian Krebs, "Scoring Show HN submissions for AI design patterns" (16 patterns, 1,590 pages) and HN discussion 47864393.
- JCarterJohnson/vibecoded-design-tells (3,033 comments, 125 Reddit threads).
- impeccable.style/slop (62 rules: eyebrow labels, flat hierarchy, grid backgrounds, side-tab borders).
- Kyle Chayka, The New Yorker, "The A.I.-Design Aesthetic That's Taking Over the Internet" (June 2026).
- Jim Nielsen, "The AI Aesthetic" (2026). godobject.dev "10 tells of a slop UI". Fountain Institute "7 signs".
- Wikipedia: Signs of AI writing (puffery, vague association, rule of three).
- HN "My website is ugly because I made it" (44114982): personal sites are valued for being visibly someone's.

## Approved whole-site revision, November 2026

The user approved an openly themed personal world, credible 3D rendering, stronger editorial composition across every route, a researched dark palette and close desktop/mobile browser inspection. Black, navy and bottle green were examples, not a closed list. Earlier black-only and subtle-reference rules yield to this explicit direction.

The initial custom ink/deep-water/aubergine/copper mix was explicitly rejected. Do not reinstate it. After actual-page previews of several established palettes, the user selected Oxocarbon. `src/data/palette.ts` is the canonical source for CSS, SVG and canvas roles. Attribution: [Oxocarbon](https://github.com/nyoom-engineering/oxocarbon), [base16 colors](https://github.com/nyoom-engineering/base16-oxocarbon); MIT notice is retained in `public/licenses/oxocarbon.txt`. Follow [Carbon color roles](https://www.carbondesignsystem.com/building-blocks/foundations/color/overview): neutral layers dominate, accents have a purpose, decorative borders are not substitutes for accessible control boundaries. Build and responsive checks do not certify visual quality or all contrast combinations.

Controls now have a 4 px radius, source/document actions a deliberate 2 px edge, and instruments at most 10 px. There is no rule to put every section in a card. Composition, contextual media and reading rhythm must carry the hierarchy; alternating colored rectangles alone are not a finished design.

### Applied reading and control system

Neutral layers and semantic accents now carry the domain pages, reports, notebook, project records, archive and directory. Source photographs/planetary textures are not recolored to match UI tokens; GitHub language/activity colors remain source data. Important actions and evidence links use pink; navigation/progress/focus use blue. Missing project images are not represented by blank tiles.

Notebook discovery uses full-width series headers and editorial columns, with contextual images retained on phones. Technical figures preserve proportions and open at full resolution. Wide engineering drawings keep readable labels in a focusable horizontal region rather than shrinking type below legibility. Only explanatory motion remains in those drawings; no decorative wait before their outlines appear.
