/**
 * The dive: the real Pale Blue Dot photo, then a fall into the dot until the globe takes over.
 * Once per session; skipped for reduced motion. Click, scroll, a key, or 3 s starts it.
 */
function init() {
  const intro = document.getElementById("intro");
  const img = intro?.querySelector<HTMLImageElement>(".pbd");
  if (!intro || !img) return;
  const done = () => { intro.classList.add("gone"); setTimeout(() => intro.remove(), 1500); };
  if (sessionStorage.getItem("dove") || matchMedia("(prefers-reduced-motion: reduce)").matches) { intro.remove(); return; }
  const DX = 0.5942, DY = 0.5196, IW = 2400, IH = 2375;
  let s0 = 1;
  const placeAt = (s: number) => {
    const W = innerWidth, H = innerHeight;
    img.style.transform = `translate(${W / 2 - DX * IW * s}px, ${H / 2 - DY * IH * s}px) scale(${s})`;
  };
  const fit = () => { const W = innerWidth, H = innerHeight; s0 = Math.max(W / (2 * (1 - DX) * IW), H / (2 * (1 - DY) * IH), W / IW, H / IH) * 1.02; img.style.width = `${IW}px`; placeAt(s0); };
  fit(); addEventListener("resize", fit);
  let started = false;
  const dive = () => {
    if (started) return; started = true; sessionStorage.setItem("dove", "1");
    intro.classList.add("diving");
    const t0 = performance.now(), D = 2600;
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / D)), e = t * t * (3 - 2 * t);
      placeAt(s0 * Math.pow(70, e));
      if (t > 0.45 && !intro.classList.contains("gone")) { dispatchEvent(new CustomEvent("world:go", { detail: { ...JSON.parse(document.body.dataset.world ?? "{}"), from: 40 } })); done(); }
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  document.getElementById("dive")?.addEventListener("click", dive);
  addEventListener("wheel", dive, { once: true, passive: true });
  addEventListener("touchstart", dive, { once: true, passive: true });
  addEventListener("keydown", (e) => { if (e.key !== "Tab") dive(); }, { once: true });
  setTimeout(dive, 3200);
}
document.addEventListener("astro:page-load", () => { if (document.body.classList.contains("home")) init(); });
