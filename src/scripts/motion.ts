/**
 * Motion system — ticker-synced Lenis + GSAP ScrollTrigger.
 *
 * Layering:
 * - Lenis smooth scroll is driven by the GSAP ticker (`autoRaf: false`) so
 *   scroll and animation share one clock.
 * - CSS scroll-driven animations (`src/styles/scroll.css`) are the PRIMARY
 *   reveal + scrub layer in browsers that support `animation-timeline`.
 *   In those browsers this module only runs Lenis + the scroll readout.
 * - In browsers WITHOUT scroll-driven support, GSAP is the fallback: it
 *   binds `[data-reveal]` reveals and the two scrub moments (About/log
 *   timeline hairline fills + Trajectories draw-on).
 *
 * Everything is gated on `prefers-reduced-motion: no-preference`. Under
 * `reduce` this module is a no-op: no Lenis, no ScrollTrigger, no reveals,
 * no scrubs, no readout updates. Content is never hidden by JS — reveals
 * use `gsap.from`, so the initial state is fully visible.
 */
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MOTION_OK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Browsers with scroll-driven animation support get the CSS layer; GSAP is
// the fallback for the rest (older Firefox/Safari).
const SCROLL_DRIVEN = CSS.supports('animation-timeline', 'scroll()');

let lenis: Lenis | null = null;

// `astro:page-load` fires on the initial load AND after every navigation, so
// init() can run twice against the same DOM. Track bound elements to avoid
// double-binding reveals (a second gsap.from would reset them to hidden).
const boundReveals = new WeakSet<HTMLElement>();
let readoutTrigger: ScrollTrigger | null = null;
let scrubTriggers: ScrollTrigger[] = [];

/** Update the header SCROLL readout, e.g. `[SCROLL: 42%]`. */
function updateScrollReadout(progress: number): void {
  const el = document.getElementById('scroll-readout');
  if (!el) return;
  const pct = Math.round(progress * 100);
  el.textContent = `[SCROLL: ${String(pct).padStart(2, '0')}%]`;
}

/** Bind reveal animations to every `[data-reveal]` element (GSAP fallback). */
function bindReveals(): void {
  if (SCROLL_DRIVEN) return; // CSS view-timeline reveals own this in supporting browsers.
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  targets.forEach((el) => {
    if (boundReveals.has(el)) return;
    boundReveals.add(el);
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
    });
  });
}

/** Bind the header scroll-progress readout. */
function bindScrollReadout(): void {
  const el = document.getElementById('scroll-readout');
  if (!el) return;
  readoutTrigger?.kill();
  readoutTrigger = ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => updateScrollReadout(self.progress),
  });
}

/**
 * Two scrub moments — About/log timeline hairline fills + Trajectories
 * draw-on. GSAP fallback for browsers without scroll-driven animation
 * support; the CSS layer owns these in supporting browsers.
 * Transform/opacity only (plus stroke-dashoffset for the SVG draw-on).
 */
function bindScrubMoments(): void {
  scrubTriggers.forEach((t) => t.kill());
  scrubTriggers = [];
  if (SCROLL_DRIVEN) return;

  // About timeline hairline fill — scaleY driven by a CSS var on the line.
  const aboutLine = document.querySelector<HTMLElement>('.timeline-section .timeline-line');
  if (aboutLine) {
    scrubTriggers.push(
      gsap
        .fromTo(
          aboutLine,
          { '--line-fill': 0 },
          {
            '--line-fill': 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.timeline-section .timeline',
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: 1,
              anticipatePin: 1,
            },
          },
        )
        .scrollTrigger!,
    );
  }

  // Log timeline hairline fill — scaleY driven by a CSS var on the rail.
  const logTimeline = document.querySelector<HTMLElement>('.log-page .timeline');
  if (logTimeline) {
    scrubTriggers.push(
      gsap
        .fromTo(
          logTimeline,
          { '--log-fill': 0 },
          {
            '--log-fill': 1,
            ease: 'none',
            scrollTrigger: {
              trigger: logTimeline,
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: 1,
              anticipatePin: 1,
            },
          },
        )
        .scrollTrigger!,
    );
  }

  // Trajectories draw-on — curves stroke-dashoffset + area opacity.
  const traj = document.querySelector<HTMLElement>('.trajectories');
  if (traj) {
    scrubTriggers.push(
      gsap
        .fromTo(
          '.traj-curve',
          { strokeDasharray: 1000, strokeDashoffset: 1000 },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '.trajectories',
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: 1,
              anticipatePin: 1,
            },
          },
        )
        .scrollTrigger!,
    );
    scrubTriggers.push(
      gsap
        .fromTo(
          '.traj-area',
          { opacity: 0 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.trajectories',
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: 1,
              anticipatePin: 1,
            },
          },
        )
        .scrollTrigger!,
    );
  }
}

/** (Re)initialize everything — runs on load and on every `astro:page-load`. */
function init(): void {
  if (!MOTION_OK) return;

  if (!lenis) {
    const l = new Lenis({
      lerp: 0.1,
      smoothWheel: !prefersReduced,
      autoRaf: false,
    });
    lenis = l;
    l.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => l.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // A view transition swaps the DOM — drop triggers bound to the old tree,
  // then re-register against the new one.
  ScrollTrigger.getAll().forEach((t) => t.kill());
  ScrollTrigger.refresh();
  lenis.resize();

  bindReveals();
  bindScrollReadout();
  bindScrubMoments();
}

init();

document.addEventListener('astro:page-load', init);