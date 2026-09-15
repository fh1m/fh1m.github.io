/**
 * Motion system — Lenis smooth scroll + GSAP ScrollTrigger reveals.
 *
 * Everything is gated on `prefers-reduced-motion: no-preference`. Under
 * `reduce` this module is a no-op: no Lenis, no ScrollTrigger, no reveals,
 * no scroll readout updates. Content is never hidden by JS — reveals use
 * `gsap.from`, so the initial state is fully visible.
 */
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MOTION_OK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

let lenis: Lenis | null = null;

// `astro:page-load` fires on the initial load AND after every navigation, so
// init() can run twice against the same DOM. Track bound elements to avoid
// double-binding reveals (a second gsap.from would reset them to hidden).
const boundReveals = new WeakSet<HTMLElement>();
let readoutTrigger: ScrollTrigger | null = null;

/** Update the header SCROLL readout, e.g. `[SCROLL: 42%]`. */
function updateScrollReadout(progress: number): void {
  const el = document.getElementById('scroll-readout');
  if (!el) return;
  const pct = Math.round(progress * 100);
  el.textContent = `[SCROLL: ${String(pct).padStart(2, '0')}%]`;
}

/** Bind reveal animations to every `[data-reveal]` element. */
function bindReveals(): void {
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

/** (Re)initialize everything — runs on load and on every `astro:page-load`. */
function init(): void {
  if (!MOTION_OK) return;

  if (!lenis) {
    lenis = new Lenis({ autoRaf: true });
    lenis.on('scroll', ScrollTrigger.update);
  }

  // Re-register after a view transition swaps the DOM.
  ScrollTrigger.refresh();
  lenis.resize();

  bindReveals();
  bindScrollReadout();
}

init();

document.addEventListener('astro:page-load', init);