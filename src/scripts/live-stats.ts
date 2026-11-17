/**
 * Live proof of work. The build already bakes in GitHub numbers (refreshed daily in CI); this
 * refreshes them in the browser so they are never older than the visit. Public API, no token,
 * cached for the session, and the baked text stays if the network says no.
 */
interface Live { commits30: number; last: { repo: string; msg: string; date: string } | null; at: number }
const KEY = "fh1m-live";
async function load(): Promise<Live | null> {
  const cached = sessionStorage.getItem(KEY);
  if (cached) { const c = JSON.parse(cached) as Live; if (Date.now() - c.at < 30 * 60e3) return c; }
  try {
    const since = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
    const h = { Accept: "application/vnd.github+json" };
    const [count, latest] = await Promise.all([
      fetch(`https://api.github.com/search/commits?q=author:fh1m+author-date:>=${since}&per_page=1`, { headers: h }).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://api.github.com/search/commits?q=author:fh1m&sort=author-date&order=desc&per_page=10`, { headers: h }).then((r) => (r.ok ? r.json() : null)),
    ]);
    if (!count || !latest) return null;
    const it = (latest.items as { commit: { message: string; author: { date: string } }; repository: { name: string } }[]).find((x) => !/^(readme|docs?\b|merge)/i.test(x.commit.message));
    const live: Live = { commits30: count.total_count, last: it ? { repo: it.repository.name, msg: it.commit.message.split("\n")[0], date: it.commit.author.date.slice(0, 10) } : null, at: Date.now() };
    sessionStorage.setItem(KEY, JSON.stringify(live));
    return live;
  } catch { return null; }
}
async function apply() {
  const els = document.querySelectorAll<HTMLElement>("[data-live-commits]");
  if (!els.length) return;
  const live = await load(); if (!live) return;
  const ago = live.last ? Math.max(0, Math.round((Date.now() - Date.parse(live.last.date)) / 864e5)) : null;
  for (const el of els) {
    el.textContent = `${live.commits30.toLocaleString("en-US")} public commits in the last 30 days, live from GitHub.` + (live.last ? ` Latest: ${live.last.repo}, "${live.last.msg.slice(0, 70)}"${ago === 0 ? " today" : ` ${ago} day${ago === 1 ? "" : "s"} ago`}.` : "");
  }
}
document.addEventListener("astro:page-load", apply);
