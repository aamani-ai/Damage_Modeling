// Server-side readers of dashboard/data (written only by scripts/dashboard/build_dashboard_data.py). Pages are
// prerendered from these files; nothing is fetched at runtime and nothing is evaluated in the browser (P6).
import fs from "node:fs";
import path from "node:path";
import type { AssetView, Cell, Citations, Curve, Manifest, OccurrencePage } from "./types";

const DATA = path.join(process.cwd(), "data");

function readJson<T>(rel: string): T | null {
  const p = path.join(DATA, rel);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
}

export function manifest(): Manifest {
  const m = readJson<Manifest>("manifest.json");
  if (!m) throw new Error("dashboard/data/manifest.json is missing — run scripts/dashboard/build_dashboard_data.py first");
  return m;
}

export const cell = (entryId: string) => readJson<Cell>(`cells/${entryId}.json`);
export const assetView = (slug: string) => readJson<AssetView>(`assets/${slug}.json`);
export const occurrence = (asset: string, hazard: string) => readJson<OccurrencePage>(`occurrence/${asset}/${hazard}.json`);
export const citations = () => readJson<Citations>("citations.json");

export function curve(entryId: string, curveId: string, versionKey?: string | null): Curve | null {
  const dir = path.join(DATA, "curves", entryId);
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter((f) => f.startsWith(`${curveId}@`));
  const pick = versionKey ? files.find((f) => f === `${curveId}@${versionKey}.json`) : files[0];
  return pick ? readJson<Curve>(`curves/${entryId}/${pick}`) : null;
}

export function curvesOf(entryId: string): Curve[] {
  const dir = path.join(DATA, "curves", entryId);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => readJson<Curve>(`curves/${entryId}/${f}`)!).filter(Boolean);
}

export function receipt(): Record<string, unknown> | null {
  return readJson<Record<string, unknown>>("receipt.json");
}

/** repository blob URL at the build commit — every file link opens the file the number came from */
export function blobUrl(m: Manifest, repoPath: string): string {
  return `${m.repo.url}/blob/${m.commit_full}/${repoPath.replace(/^\/+/, "")}`;
}
