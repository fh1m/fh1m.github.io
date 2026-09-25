/** Lightweight scroll tracking — native scroll only (no Lenis, no GSAP).
 *  A single passive listener drives the instrument bar; reveals use the
 *  IntersectionObserver action in actions/reveal.ts. */
import { scrollProgress, scrollY, reducedMotion } from './stores';

export function initMotion(): () => void {
  if (typeof window === 'undefined') return () => {};

  reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  let ticking = false;
  const read = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const y = window.scrollY || doc.scrollTop;
    scrollY.set(y);
    scrollProgress.set(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(read);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  read();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
