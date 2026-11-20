/**
 * Live proof of work. The build bakes in a year of GitHub numbers (refreshed daily in CI); this
 * adds the latest public commit in the browser, so the page is never older than the visit.
 * Public API, no token, cached for the session; the baked text stays if the network says no.
 */
interface Live { last: { repo: string; msg: string; date: string } | null; at: number }
const KEY = "fh1m-live-v2";
async function load(): Promise<Live | null> {
  const cached = sessionStorage.getItem(KEY);
  if (cached) { const c = JSON.parse(cached) as Live; if (Date.now() - c.at < 30 * 60e3) return c; }
  try {
    const latest = await fetch("https://api.github.com/search/commits?q=author:fh1m&sort=author-date&order=desc&per_page=10", { headers: { Accept: "application/vnd.github+json" } }).then((r) => (r.ok ? r.json() : null));
    if (!latest) return null;
    const it = (latest.items as { commit: { message: string; author: { date: string } }; repository: { name: string } }[]).find((x) => !/^(readme|docs?\b|merge)/i.test(x.commit.message));
    const live: Live = { last: it ? { repo: it.repository.name, msg: it.commit.message.split("\n")[0], date: it.commit.author.date.slice(0, 10) } : null, at: Date.now() };
    sessionStorage.setItem(KEY, JSON.stringify(live));
    return live;
  } catch { return null; }
}
async function apply() {
  const els = document.querySelectorAll<HTMLElement>("[data-live-commits]");
  if (!els.length) return;
  const live = await load(); if (!live) return;
  const clip = (s: string, n: number) => {
    if (s.length <= n) return s;
    const cut = s.lastIndexOf(" ", n);
    return s.slice(0, cut > n / 2 ? cut : n).replace(/[;,:.\s-]+$/, "") + "…";
  };
  const ago = live.last ? Math.max(0, Math.round((Date.now() - Date.parse(live.last.date)) / 864e5)) : null;
  for (const el of els) {
    if (!live.last) continue;
    const base = (el.dataset.base ??= el.textContent ?? "");
    el.textContent = `${base.trim()} Latest public commit: ${live.last.repo}, "${clip(live.last.msg, 56)}",${ago === 0 ? " today" : ` ${ago} day${ago === 1 ? "" : "s"} ago`}.`;
  }
}
apply();
