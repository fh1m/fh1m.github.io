/** Scroll-reveal action. Adds `.is-in` when the element enters the viewport.
 *  Respects prefers-reduced-motion (reveals immediately). */
export function reveal(node: HTMLElement, params: { delay?: number; once?: boolean } = {}) {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (reduce || typeof IntersectionObserver === 'undefined') {
    node.classList.add('is-in');
    return {};
  }

  const { delay = 0, once = true } = params;
  if (delay) node.style.transitionDelay = `${delay}ms`;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          node.classList.add('is-in');
          if (once) io.unobserve(node);
        } else if (!once) {
          node.classList.remove('is-in');
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  io.observe(node);
  return { destroy: () => io.disconnect() };
}
