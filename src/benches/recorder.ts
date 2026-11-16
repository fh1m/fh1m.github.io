/**
 * The flight recorder: the last year of public GitHub contributions, rebuilt daily at build time.
 * Scrub the timeline; the readout says what that day held.
 */
import { canvas, slider, readout, C, emit } from "./ui";
import stats from "../data/github.json";

export function mount(el: HTMLElement, bus: EventTarget) {
  const days = stats.days as [string, number][];
  const cv = canvas(el, 0.26, `A year of contributions: ${stats.contributionsLastYear} in total`);
  const say = readout(el);
  const max = Math.max(...days.map((d) => d[1]));
  let pick = days.length - 1;

  const draw = () => {
    const { ctx, w, h } = cv;
    ctx.clearRect(0, 0, w, h);
    const weeks = Math.ceil(days.length / 7), cw = w / weeks, ch = h / 7.6;
    days.forEach(([, n], i) => {
      const x = Math.floor(i / 7) * cw, y = (i % 7) * ch;
      const a = n ? 0.18 + 0.82 * Math.sqrt(n / max) : 0.05;
      ctx.fillStyle = n ? `rgba(123,156,224,${a})` : "rgba(123,156,224,0.07)";
      ctx.fillRect(x + 0.6, y + 0.6, cw - 1.2, ch - 1.2);
    });
    const x = Math.floor(pick / 7) * cw, y = (pick % 7) * ch;
    ctx.strokeStyle = C.estimate; ctx.lineWidth = 1.5; ctx.strokeRect(x - 0.5, y - 0.5, cw + 1, ch + 1); ctx.lineWidth = 1;
    const [date, n] = days[pick];
    const week = days.slice(Math.max(0, pick - 6), pick + 1).reduce((s, d) => s + d[1], 0);
    say(`<b>${date}</b> · ${n} contribution${n === 1 ? "" : "s"} that day · ${week} in the 7 days to it · busiest day of the year: ${stats.busiestDay[0]} (${stats.busiestDay[1]})`);
    emit(bus, "recorder", { date, n });
  };
  slider(el, { label: "day", min: 0, max: days.length - 1, step: 1, value: pick, fmt: (v) => days[v][0], id: "rec-day" }, (v) => { pick = v; draw(); });
  const langs = document.createElement("div");
  langs.style.cssText = "display:flex;height:8px;border-radius:2px;overflow:hidden;margin-top:1rem";
  langs.setAttribute("role", "img");
  const top = stats.languages.slice(0, 6);
  langs.setAttribute("aria-label", "Languages by bytes across public repositories: " + top.map((l) => `${l.name} ${(l.share * 100).toFixed(1)}%`).join(", "));
  top.forEach((l) => { const s = document.createElement("span"); s.style.cssText = `flex:${l.share};background:${l.color ?? "#555"}`; s.title = `${l.name} ${(l.share * 100).toFixed(1)}%`; langs.append(s); });
  el.append(langs);
  const legend = document.createElement("p");
  legend.className = "bench-note";
  legend.textContent = top.map((l) => `${l.name} ${(l.share * 100).toFixed(1)}%`).join(" · ") + ` · public data, generated ${stats.generatedAtLabel}`;
  el.append(legend);
  cv.onResize(draw);
  draw();
}
