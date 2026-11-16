#!/usr/bin/env node
/** A minimal static server for dist/ (tests and the CV printer). 404s serve dist/404.html. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".woff": "font/woff", ".webp": "image/webp", ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".pdf": "application/pdf", ".mgla": "application/octet-stream" };

export function serve(port = 0) {
  const server = createServer(async (req, res) => {
    const p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
    let file = join(DIST, p);
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, "index.html");
    try { const body = await readFile(file); res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }); res.end(body); }
    catch { res.writeHead(404, { "content-type": TYPES[".html"] }); res.end(await readFile(join(DIST, "404.html")).catch(() => "")); }
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const s = await serve(Number(process.argv[2] ?? 4322));
  console.log(`serving dist on http://127.0.0.1:${s.address().port}`);
}
