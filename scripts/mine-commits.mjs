#!/usr/bin/env node
/**
 * Snapshot the real commit history of each project into src/data/commits.json.
 * Every row is [date, short hash, type, scope, subject]; the site links each to GitHub.
 * Local clones only (no API rate limits, full history):
 *   MONGLA_WS=…/mongla_ws MINE_ROOT=…/mine DOTFILES=~/.dotfiles node scripts/mine-commits.mjs
 */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.env.MINE_ROOT;
const projects = [
  { slug: "mongla", repo: "fh1m/mongla_ws", element: "water", path: process.env.MONGLA_WS },
  { slug: "mongla-sim", repo: "fh1m/mongla_sim", element: "water", path: root && join(root, "mongla_sim") },
  { slug: "duburi", repo: "fh1m/duburi-rnd", element: "water", path: root && join(root, "duburi-rnd") },
  { slug: "rupsha", repo: "fh1m/rupsha_ws", element: "earth", path: root && join(root, "rupsha_ws") },
  { slug: "dristy", repo: "fh1m/Dristy", element: "fire", path: root && join(root, "Dristy") },
  { slug: "den", repo: "fh1m/.dotfiles", element: "fire", path: process.env.DOTFILES },
];

const CONV = /^([a-z]+)(?:\(([^)]*)\))?!?:\s*(.*)$/;
const out = { taken: new Date().toISOString(), projects: {} };
for (const p of projects) {
  if (!p.path) { console.warn(`skip ${p.slug}: no path`); continue; }
  const raw = execFileSync("git", ["-C", p.path, "log", "--no-merges", "--format=%cs%x09%h%x09%s"], { encoding: "utf8", maxBuffer: 64 << 20 });
  const rows = raw.trim().split("\n").filter(Boolean).map((l) => {
    const [date, hash, subject] = l.split("\t");
    const m = subject.match(CONV);
    const s = (m ? m[3] : subject).trim();
    return [date, hash, m ? m[1] : "", m ? (m[2] ?? "") : "", s.length > 140 ? `${s.slice(0, 137)}…` : s];
  }).reverse();
  out.projects[p.slug] = { repo: p.repo, element: p.element, head: execFileSync("git", ["-C", p.path, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim(), commits: rows };
  console.log(`${p.slug}: ${rows.length} commits, ${rows[0]?.[0]} → ${rows.at(-1)?.[0]}`);
}
writeFileSync(new URL("../src/data/commits.json", import.meta.url), JSON.stringify(out) + "\n");
