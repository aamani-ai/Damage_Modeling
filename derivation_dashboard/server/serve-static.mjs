// The derivation dashboard's server: copied from dashboard/scripts/serve-static.mjs (no dependencies). Serves
// derivation_dashboard/site, copied into the image as out/, on Cloud Run's PORT. Text is gzipped when the browser accepts it; Next's hashed
// files under /_next/static/ never change, so browsers keep them; pages and data revalidate.
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";

const OUT = join(fileURLToPath(new URL(".", import.meta.url)), "..", "out");
const PORT = Number(process.env.PORT ?? process.argv[2] ?? 3211);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".ttf": "font/ttf", ".csv": "text/csv" };
const TEXT = new Set([".html", ".js", ".css", ".json", ".txt", ".svg", ".csv"]);

function resolve(urlPath) {
  let clean;
  try {
    clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  } catch {
    return undefined; // a malformed address
  }
  const base = join(OUT, clean);
  for (const p of [base, `${base}.html`, join(base, "index.html")]) {
    if (p.startsWith(OUT + sep) && existsSync(p) && statSync(p).isFile()) return p;
  }
  return null;
}

function send(req, res, status, file) {
  const ext = extname(file);
  const gzip = TEXT.has(ext) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
  const immutable = status === 200 && (req.url ?? "").startsWith("/_next/static/");
  res.writeHead(status, {
    "content-type": TYPES[ext] ?? "application/octet-stream",
    "cache-control": immutable ? "public, max-age=31536000, immutable" : "no-cache",
    vary: "accept-encoding",
    ...(gzip ? { "content-encoding": "gzip" } : {}),
  });
  const body = createReadStream(file);
  (gzip ? body.pipe(createGzip()) : body).pipe(res);
}

if (!existsSync(OUT)) {
  console.error("out/ is missing: build the site first (derivation_dashboard/tools/build.py)");
  process.exit(1);
}
createServer((req, res) => {
  const file = resolve(req.url ?? "/");
  if (file === undefined) {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" }).end("bad request\n");
    return;
  }
  if (!file) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("not found\n");
    return;
  }
  send(req, res, 200, file);
}).listen(PORT, () => console.log(`static export on http://localhost:${PORT}`));
