/** Smooth scroll (Lenis) + GSAP/ScrollTrigger sync, wired to stores.
 *  No-ops under prefers-reduced-motion (native scroll, no rAF loop). */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollProgress, scrollY, reducedMotion } from './stores';

let lenis: Lenis | null = null;
let raf = 0;

export function initMotion(): () => void {
  if (typeof window === 'undefined') return () => {};

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  reducedMotion.set(reduce);

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const y = window.scrollY || doc.scrollTop;
    scrollY.set(y);
    scrollProgress.set(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
  };

  if (reduce) {
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }

  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', () => {
    ScrollTrigger.update();
    update();
  });

  const loop = (time: number) => {
    lenis?.raf(time);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  gsap.ticker.lagSmoothing(0);
  update();

  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}

export function scrollToTop() {
  lenis ? lenis.scrollTo(0, { immediate: false }) : window.scrollTo({ top: 0 });
}

export function stopScroll() {
  lenis?.stop();
}
export function startScroll() {
  lenis?.start();
}
