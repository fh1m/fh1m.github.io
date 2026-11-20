/** A project's commits as a constellation strip: x = date, y = scatter by hash; red = fixes and retractions. */
type Row = [string, string, string, string, string];
const h01 = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return ((h >>> 0) % 10000) / 10000; };
async function init() {
  const cv = document.querySelector<HTMLCanvasElement>("canvas[data-commits]");
  if (!cv) return;
  const read = cv.parentElement!.querySelector<HTMLElement>(".read")!;
  const data = await (await fetch("/world/commits.json")).json();
  const P = data.projects[cv.dataset.commits!]; if (!P) return;
  const rows: Row[] = P.commits;
  const ts = rows.map((r) => Date.parse(r[0])); const t0 = Math.min(...ts) - 864e5 * 3, t1 = Math.max(...ts) + 864e5 * 3;
  const ctx = cv.getContext("2d")!;
  const ink = getComputedStyle(document.body).getPropertyValue("--c").trim() || "#a3a3a3"; let W = 0, H = 0, pts: { x: number; y: number; r: Row; fix: boolean }[] = [], hi = -1;
  const layout = () => {
    const dpr = Math.min(devicePixelRatio, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = rows.map((r, i) => ({ x: 12 + ((ts[i] - t0) / (t1 - t0)) * (W - 24), y: 14 + h01(r[1]) * (H - 40), r, fix: r[2] === "fix" || /retract|wrong|revert/i.test(r[4]) }));
    draw();
  };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.font = "11px 'Zed Sans', sans-serif"; ctx.fillStyle = "#7a7a7a";
    const months = new Set(rows.map((r) => r[0].slice(0, 7)));
    for (const m of months) { const x = 12 + ((Date.parse(m + "-01") - t0) / (t1 - t0)) * (W - 24); if (x > 10 && x < W - 40) ctx.fillText(m, x, H - 6); }
    pts.forEach((p, i) => { const on = i === hi; ctx.beginPath(); ctx.arc(p.x, p.y, on ? 3.2 : 1.3, 0, 7); ctx.fillStyle = on ? "#ffffff" : p.fix ? "#e5533d" : ink; ctx.fill(); });
  };
  cv.addEventListener("pointermove", (e) => {
    const b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; let best = -1, bd = 100;
    pts.forEach((p, i) => { const d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; best = i; } });
    if (best === hi) return; hi = best; draw(); if (best < 0) return;
    const r = pts[best].r; read.innerHTML = `${r[0]} · <a href="https://github.com/${P.repo}/commit/${r[1]}">${r[1]}</a> · ${r[2] ? `${r[2]}${r[3] ? `(${r[3]})` : ""}: ` : ""}${r[4].replace(/</g, "&lt;")}`;
  });
  cv.addEventListener("click", () => { if (hi >= 0) open(`https://github.com/${P.repo}/commit/${pts[hi].r[1]}`, "_blank", "noopener"); });
  new ResizeObserver(layout).observe(cv);
}
// Fetch the history only when the strip approaches the viewport.
const start = () => {
  const target = document.querySelector("canvas[data-commits]");
  if (!target) return;
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); init(); } }, { rootMargin: "300px 0px" });
  io.observe(target);
};
start();
