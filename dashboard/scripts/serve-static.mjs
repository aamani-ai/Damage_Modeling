// Serve the static export (dashboard/out) on localhost — the path the speed budget is measured on (06 §2.9).
// No dependencies: maps /cells/flood_bess → out/cells/flood_bess.html, as the export lays files out.
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(fileURLToPath(new URL(".", import.meta.url)), "..", "out");
const PORT = Number(process.env.PORT ?? process.argv[2] ?? 3211);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".csv": "text/csv" };

function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const base = join(OUT, clean);
  for (const p of [base, `${base}.html`, join(base, "index.html")]) {
    if (existsSync(p) && statSync(p).isFile()) return p;
  }
  return null;
}

if (!existsSync(OUT)) {
  console.error("dashboard/out is missing — run `npm run build` first");
  process.exit(1);
}
createServer((req, res) => {
  const file = resolve(req.url ?? "/");
  if (!file) {
    res.writeHead(404, { "content-type": TYPES[".html"] });
    createReadStream(join(OUT, "404.html")).pipe(res);
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream", "cache-control": "no-cache" });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`static export on http://localhost:${PORT}`));
