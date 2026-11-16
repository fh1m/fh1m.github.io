/**
 * The album player. Playing a track: its artefact goes behind everything in its nation's colour,
 * and its real commit history (commits per day) is drawn as a waveform, swept once by a playhead.
 * ↑/↓ move through the tracklist; Enter opens the track. No loop runs while nothing is playing.
 */
function init() {
  const tracks = [...document.querySelectorAll<HTMLAnchorElement>(".track")];
  const art = document.querySelector<HTMLElement>(".art");
  const img = art?.querySelector("img");
  const title = document.querySelector<HTMLElement>(".np-t");
  const cv = document.querySelector<HTMLCanvasElement>(".wave");
  if (!tracks.length || !art || !img || !title || !cv) return;
  const ctx = cv.getContext("2d")!;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0, cur: HTMLAnchorElement | null = null;

  const draw = (t: HTMLAnchorElement, head: number) => {
    const dpr = Math.min(devicePixelRatio, 2), W = cv.clientWidth, H = cv.clientHeight;
    if (cv.width !== W * dpr) { cv.width = W * dpr; cv.height = H * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const c = t.dataset.c!, [vals, from, to] = (t.dataset.wave ?? "").split("|");
    ctx.font = "10px 'Obel Mono', monospace"; ctx.textBaseline = "middle";
    if (!vals) { ctx.fillStyle = "#3a3a3a"; ctx.fillRect(0, H / 2, W * head, 1); ctx.fillStyle = "#6b6b6b"; ctx.fillText(`no public commit history · ${t.dataset.stat ?? ""}`, 0, H / 2 - 9); return; }
    const v = vals.split(",").map(Number), max = Math.max(...v), bw = Math.min(6, W / v.length); // a short history should look short
    v.forEach((x, i) => {
      const h = x ? Math.max(1.5, (Math.sqrt(x) / Math.sqrt(max)) * (H / 2 - 2)) : 0.5;
      ctx.fillStyle = i / v.length <= head ? c : "#2a2a2a";
      ctx.fillRect(i * bw, H / 2 - h, Math.max(1, bw - (bw > 3 ? 1 : 0)), h * 2);
    });
    ctx.fillStyle = "#6b6b6b"; ctx.fillText(from === to ? `${from} · one day` : from, 0, H - 4); if (from === to) return; const tw = ctx.measureText(to).width; ctx.fillText(to, Math.max(tw + 70, v.length * bw) - tw, H - 4);
  };

  const play = (t: HTMLAnchorElement) => {
    if (cur === t) return;
    cur?.classList.remove("on"); cur = t; t.classList.add("on");
    document.body.classList.add("playing");
    art.style.setProperty("--c", t.dataset.c!);
    if (t.dataset.art) { img.src = t.dataset.art; img.style.display = ""; } else img.style.display = "none";
    title.textContent = `${t.querySelector(".no")!.textContent} ${t.querySelector(".ti")!.textContent}`;
    cancelAnimationFrame(raf);
    if (reduce) { draw(t, 1); return; }
    const t0 = performance.now();
    const step = (now: number) => { const k = Math.min(1, (now - t0) / 1400); draw(t, 1 - Math.pow(1 - k, 3)); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  };

  tracks.forEach((t) => { t.addEventListener("mouseenter", () => play(t)); t.addEventListener("focus", () => play(t)); });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const i = cur ? tracks.indexOf(cur) : -1;
    tracks[Math.max(0, Math.min(tracks.length - 1, i + (e.key === "ArrowDown" ? 1 : -1)))].focus();
  });
  addEventListener("resize", () => cur && draw(cur, 1));
}
document.addEventListener("astro:page-load", () => { if (document.body.classList.contains("album")) init(); });
