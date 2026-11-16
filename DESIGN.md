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
- Tinted near-black surfaces (#0b0b0b, #111) standing in for black; navy "surfaces".
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
- A 3D globe or HUD as the hero because "space looks impressive" (rejected).

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

## Tokens

- Background #000. Text #ececec, secondary #a3a3a3 (≥ 7:1), tertiary #7a7a7a (≥ 4.5:1).
- Nations: water #4f8fe0, earth #79b35f, fire #e5533d, air #eaa63b. Red for "this was wrong"
  is the fire red; it only appears struck-through beside its correction.
- Type: Zed Sans for everything readable; Obel Mono only for code, hashes, tabular figures.
  Scale with real contrast: 0.875 / 1 / 1.25 / 1.75 / 3 / 5 rem.

## Sources

- Anthropic, frontend-design SKILL.md (calibration clusters; label/arrow/middle-dot/mono tells).
- Adrian Krebs, "Scoring Show HN submissions for AI design patterns" (16 patterns, 1,590 pages) and HN discussion 47864393.
- JCarterJohnson/vibecoded-design-tells (3,033 comments, 125 Reddit threads).
- impeccable.style/slop (62 rules: eyebrow labels, flat hierarchy, grid backgrounds, side-tab borders).
- Kyle Chayka, The New Yorker, "The A.I.-Design Aesthetic That's Taking Over the Internet" (June 2026).
- Jim Nielsen, "The AI Aesthetic" (2026). godobject.dev "10 tells of a slop UI". Fountain Institute "7 signs".
- Wikipedia: Signs of AI writing (puffery, vague association, rule of three).
- HN "My website is ugly because I made it" (44114982): personal sites are valued for being visibly someone's.
