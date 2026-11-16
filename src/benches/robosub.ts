/**
 * Where the points came from: BRAC U's RoboSub rounds, task by task, from RoboNation's published
 * score sheets (snapshotted in src/data/mongla.json from mongla_ws docs/data/robosub.json).
 * Pick a year; hover or focus a segment to read it.
 */
import { readout, buttons, emit } from "./ui";
import data from "../data/mongla.json";

type Task = { task: string; points: number };
const GROUPS: [RegExp, string, string][] = [
  [/^Gate/, "gate", "#d7655d"],
  [/^(Channel|Avoid Debris)/, "channel / slalom", "#7b9ce0"],
  [/^Restore/, "restore", "#6aa7c4"],
  [/^Random Pinger/, "pinger", "#a9b2c2"],
  [/^Return Home/, "return home", "#3c5590"],
  [/^Weight/, "weight bonus", "#24304a"],
];
const groupOf = (t: string) => GROUPS.find(([re]) => re.test(t)) ?? GROUPS[GROUPS.length - 1];

type Year = { teams: number; wildcard: number; overall: { score: number; rank: number }; rounds: Record<string, { score: number; rank: number | null; tasks: Task[] }> };
// The JSON import types each year as its own literal shape; they share this structure.
const years = data.robosub.years as unknown as Record<string, Year>;

export function mount(el: HTMLElement, bus: EventTarget) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 640 300");
  svg.setAttribute("role", "img");
  svg.style.cssText = "width:100%;height:auto;display:block;background:#02040a;border:1px solid var(--line);border-radius:6px";
  el.append(svg);
  const say = readout(el);
  const legend = document.createElement("p");
  legend.className = "bench-note";
  legend.innerHTML = GROUPS.map(([, n, c]) => `<span style="color:${c}">■</span> ${n}`).join("&ensp;");
  el.append(legend);

  let year = "2026";
  const draw = () => {
    const y = years[year];
    const rounds = Object.entries(y.rounds).filter(([n]) => n !== "Final");
    const max = 7000, x0 = 118, W = 500, rowH = 58, top = 34;
    const X = (v: number) => x0 + (v / max) * W;
    svg.replaceChildren();
    svg.setAttribute("aria-label", `RoboSub ${year}, BRAC U, ${y.overall.rank}th of ${y.teams}. ` + rounds.map(([n, r]) => `${n}: ${r.score} points`).join("; ") + `. Finals wild card at ${y.wildcard}.`);
    const add = (tag: string, attrs: Record<string, string | number>, text?: string) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, String(attrs[k])); if (text) n.textContent = text; svg.append(n); return n; };
    for (let v = 0; v <= max; v += 1000) { add("line", { x1: X(v), x2: X(v), y1: top - 10, y2: top + rounds.length * rowH, stroke: "#0a1122" }); add("text", { x: X(v), y: top + rounds.length * rowH + 16, "text-anchor": "middle", fill: "#5d6678", "font-size": 11, "font-family": "Commit Mono, monospace" }, String(v)); }
    rounds.forEach(([name, r], i) => {
      const yy = top + i * rowH;
      add("text", { x: 0, y: yy + 22, fill: "#eef0f4", "font-size": 13, "font-family": "Commit Mono, monospace" }, name);
      add("text", { x: 0, y: yy + 38, fill: "#5d6678", "font-size": 11, "font-family": "Commit Mono, monospace" }, r.rank ? `round rank ${r.rank}` : "");
      let acc = 0;
      for (const t of r.tasks) {
        if (t.points <= 0) continue;
        const [, gname, col] = groupOf(t.task);
        const rect = add("rect", { x: X(acc), y: yy + 8, width: Math.max(1, X(acc + t.points) - X(acc) - 1.5), height: 30, rx: 3, fill: col, tabindex: 0, "aria-label": `${t.task}: ${t.points} points` });
        rect.style.cursor = "pointer"; rect.style.outline = "none";
        const show = () => { say(`${year} · ${name} · <b>${t.task}</b>: ${t.points} points <span style="color:${col}">(${gname})</span>`); emit(bus, "robosub", { year, task: t.task }); };
        rect.addEventListener("pointerenter", show); rect.addEventListener("focus", show);
        acc += t.points;
      }
      add("text", { x: X(acc) + 6, y: yy + 28, fill: "#eef0f4", "font-size": 13, "font-family": "Commit Mono, monospace", "font-weight": 700 }, String(r.score));
    });
    const wx = X(y.wildcard);
    add("line", { x1: wx, x2: wx, y1: top - 14, y2: top + rounds.length * rowH, stroke: "#d7655d", "stroke-width": 2, "stroke-dasharray": "5 4" });
    add("text", { x: wx, y: top - 18, fill: "#d7655d", "font-size": 11, "text-anchor": "middle", "font-family": "Commit Mono, monospace" }, `finals wild card ${y.wildcard}`);
    const best = Math.max(...rounds.map(([, r]) => r.score));
    say(`${year}: ${y.overall.rank}th of ${y.teams} · best round <b>${best.toLocaleString("en-US")}</b> · wild card ${y.wildcard.toLocaleString("en-US")}. Hover or tab through a bar to read a task.`);
  };
  buttons(el, [
    { label: "2025", pressed: false, on: () => { year = "2025"; draw(); } },
    { label: "2026", pressed: true, on: () => { year = "2026"; draw(); } },
  ], "Year");
  const note = document.createElement("p");
  note.className = "bench-note";
  note.innerHTML = 'RoboNation\'s published score sheets, read by <a href="https://github.com/fh1m/mongla_ws/blob/main/docs/data/robosub.json">a script</a>, never typed in. In 2025 the third-chance run cleared the wild-card line and still wasn\'t enough: seven teams made the finals.';
  el.append(note);
  draw();
}
