// Read-only evidence for discussion 09: the Digital Twin's asset spine (every asset's tree, by level) beside the
// parts each damage-curve cell curves today. Loads the twin's data scripts in a sandbox (no DOM, no 3D), runs their
// installers, walks each asset's tree; reads docs/cells/catalogue/*.json for the cells. Writes nothing.
// Run:  node docs/extra/discussion/damage_curve_dashboard/evidence/2026-10-21_twin_spine_and_cell_parts.mjs "<Digital Twin checkout>"
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path'; import { execSync } from 'node:child_process';
const TWIN = process.argv[2]; const HERE = path.dirname(new URL(import.meta.url).pathname); const REPO = path.resolve(HERE, '../../../../..');
const order = fs.readFileSync(path.join(TWIN, 'src/engine/loadEngine.ts'), 'utf8').match(/'([^']+\.js)'/g).map((s) => s.slice(1, -1)).filter((f) => !f.startsWith('models/') && !/viewer|scene/.test(f));
const win = { console, setTimeout, clearTimeout, setInterval: () => 0, clearInterval() {}, performance: { now: () => 0 }, addEventListener() {}, dispatchEvent() {}, document: { addEventListener() {}, createElement: () => ({ getContext: () => null, style: {} }) }, localStorage: { getItem: () => null, setItem() {} }, location: { hash: '' } };
win.window = win; const ctx = vm.createContext(win);
for (const f of order) vm.runInContext(fs.readFileSync(path.join(TWIN, 'public/engine', f), 'utf8'), ctx, { filename: f });
for (let i = 0; i < 2; i++) for (const k of Object.keys(win)) if (/Install$/.test(k) && typeof win[k] === 'function') { try { win[k](); } catch {} }
const N = win.SubsystemData.nodes, kids = {}; for (const [id, n] of Object.entries(N)) if (n.p) (kids[n.p] ||= []).push(id);
const levels = (r) => { const c = []; const w = (id, d) => { c[d] = (c[d] || 0) + 1; (kids[id] || []).forEach((k) => w(k, d + 1)); }; w(r, 0); return c; };
const git = (dir) => execSync(`git -C "${dir}" rev-parse --short HEAD`).toString().trim();
console.log(`Digital Twin at ${git(TWIN)} · damage_modeling at ${git(REPO)}\n`);
console.log('THE TWIN — every asset, its reference model and its tree (counts per level: asset · systems · equipment · components)');
for (const [id, a] of Object.entries(win.SubsystemData.assets)) for (const r of [a.root, a.plantRoot].filter(Boolean))
  console.log(`  ${id.padEnd(9)} ${(a.cat || 'power').padEnd(6)} ${String(a.model).padEnd(16)} ${r.padEnd(9)} ${JSON.stringify(levels(r)).padEnd(16)} ${(kids[r] || []).map((k) => N[k].n).join(' · ')}`);
console.log('\nOUR CELLS — the parts each cell curves today, by asset');
const by = {};
for (const f of fs.readdirSync(path.join(REPO, 'docs/cells/catalogue')).filter((f) => f.endsWith('.json')).sort()) {
  const e = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/cells/catalogue', f), 'utf8'));
  (by[e.asset] ||= []).push(`    ${e.hazard.padEnd(16)} ${e.kind.padEnd(8)} ${(e.rows || []).length} part(s): ${(e.rows || []).map((r) => r.part).join(' · ') || '—'}`);
}
for (const [a, rows] of Object.entries(by)) { console.log(`  ${a}`); rows.sort().forEach((r) => console.log(r)); }
