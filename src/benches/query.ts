/**
 * The start-page query grammar (fh1m/start-page js/queryParser.js), ported with the
 * same order of checks: URL → exact key → key:search → key/path → default search.
 * Nothing is opened; it shows where the query would go.
 */
import { readout, C, emit } from "./ui";

const CMDS: { key: string; name: string; url: string; search?: string }[] = [
  { key: "g", name: "GitHub", url: "https://github.com", search: "/search?q={}" },
  { key: "y", name: "YouTube", url: "https://youtube.com", search: "/results?search_query={}" },
  { key: "r", name: "Reddit", url: "https://reddit.com", search: "/search?q={}" },
  { key: "m", name: "Mail", url: "https://gmail.com", search: "/#search/text={}" },
  { key: "d", name: "Drive", url: "https://drive.google.com", search: "/drive/search?q={}" },
  { key: "dc", name: "Discord", url: "https://discord.com/app" },
  { key: "st", name: "StackOverflow", url: "https://stackoverflow.com", search: "/search?q={}" },
  { key: "md", name: "MDN", url: "https://developer.mozilla.org", search: "/search?q={}" },
  { key: "h", name: "HackerNews", url: "https://news.ycombinator.com" },
];
const bases = Object.fromEntries(CMDS.map((command) => [command.key, new URL(command.url).origin]));
const URLISH = /^((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/i;

function parse(q: string): { rule: string; to: string } {
  if (!q) return { rule:"type something", to:"" };
  if (URLISH.test(q)) return { rule:"looks like a URL", to:/^[a-z]+:\/\//i.test(q) ? q : `http://${q}` };
  const trimmed = q.trim();
  const colon = trimmed.indexOf(":"), slash = trimmed.indexOf("/");
  const searchKey = colon < 0 ? trimmed : trimmed.slice(0, colon);
  const pathKey = slash < 0 ? trimmed : trimmed.slice(0, slash);
  for (const command of CMDS) {
    if (q === command.key) return { rule:`exact key "${command.key}"`, to:command.url };
    if (searchKey === command.key && command.search) {
      const query = colon < 0 ? "" : trimmed.slice(colon + 1).trim();
      return { rule:`${command.name} search`, to:bases[command.key] + command.search.replace("{}", encodeURIComponent(query)) };
    }
    if (pathKey === command.key) {
      const path = slash < 0 ? "" : trimmed.slice(slash + 1).trim();
      return { rule:`${command.name} + path`, to:`${bases[command.key]}/${path}` };
    }
  }
  return { rule:"default web search", to:`https://google.com/search?q=${encodeURIComponent(q)}` };
}

export function mount(el: HTMLElement, bus: EventTarget) {
  const wrap = document.createElement("div");
  wrap.innerHTML = `<label for="q-in">new tab</label>
    <input id="q-in" type="text" autocomplete="off" spellcheck="false" value="g:kalman filter" style="width:100%;margin-top:.4rem;background:var(--page);border:1px solid var(--line);border-radius:var(--r-1);color:${C.measured};font:400 1.05rem var(--mono);padding:.7rem .8rem" />`;
  el.append(wrap);
  const say = readout(el);
  const keys = document.createElement("p");
  keys.className = "bench-note";
  keys.innerHTML = CMDS.map((c) => `<b style="color:var(--chalk);font-weight:400">${c.key}</b> ${c.name}`).join(" · ") + " · and 12 more on the real page";
  el.append(keys);
  const input = wrap.querySelector("input")!;
  const update = () => {
    const r = parse(input.value);
    say(r.to ? `rule: <b>${r.rule}</b><br><span class="medium">→ ${r.to.replace(/</g, "&lt;")}</span>` : r.rule);
    emit(bus, "query", r.rule);
  };
  input.addEventListener("input", update);
  update();
}
