#!/usr/bin/env node
// Export the pieces of the Digital Twin the dashboard uses, pinned to the twin's commit (plan DCD-D20, DCD-D21).
//
//   node scripts/dashboard/export_twin.mjs ["<Digital Twin checkout>"]      (default: $DIGITAL_TWIN, then ~/code/personal/Digital Twin)
//
// Writes, and nothing else:
//   dashboard/data/twin/trees.json     every exported asset's node tree (id, name, parent), its 3D model IDs and the twin commit
//   dashboard/public/twin/             the twin's 3D viewer, the model files those assets need, three.js r147, and manifest.json
//                                      with each file's SHA-256. The files are copied unchanged; the dashboard never edits them.
// Run it again when the twin changes; the data build checks the copied files against manifest.json.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const TWIN = process.argv[2] || process.env.DIGITAL_TWIN || path.join(os.homedir(), 'code/personal/Digital Twin');
const ENGINE = path.join(TWIN, 'public/engine');
if (!fs.existsSync(ENGINE)) { console.error(`FAIL: no Digital Twin engine at ${ENGINE}`); process.exit(1); }

// The twin assets the dashboard's types point at (docs/contracts/twin_crosswalks/spine.json names them).
const spine = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/contracts/twin_crosswalks/spine.json'), 'utf8'));
const WANT = [...new Set(spine.categories.flatMap((c) => c.types).flatMap((t) => (t.twin ? [t.twin.asset] : [])))];

// 1 · load the twin's data scripts in a sandbox (no DOM, no 3D) and run their installers
const order = fs.readFileSync(path.join(TWIN, 'src/engine/loadEngine.ts'), 'utf8').match(/'([^']+\.js)'/g).map((s) => s.slice(1, -1));
const data = order.filter((f) => !f.startsWith('models/') && !/viewer|scene/.test(f));
const win = { console, setTimeout, clearTimeout, setInterval: () => 0, clearInterval() {}, performance: { now: () => 0 }, addEventListener() {}, dispatchEvent() {},
  document: { addEventListener() {}, createElement: () => ({ getContext: () => null, style: {} }) }, localStorage: { getItem: () => null, setItem() {} }, location: { hash: '' } };
win.window = win;
const ctx = vm.createContext(win);
for (const f of data) vm.runInContext(fs.readFileSync(path.join(ENGINE, f), 'utf8'), ctx, { filename: f });
for (let i = 0; i < 2; i++) for (const k of Object.keys(win)) if (/Install$/.test(k) && typeof win[k] === 'function') { try { win[k](); } catch { /* an installer whose inputs are absent returns early */ } }
const D = win.SubsystemData, N = D.nodes;
const kids = {}; for (const [id, n] of Object.entries(N)) if (n.p) (kids[n.p] ||= []).push(id);

// 2 · the trees
const subtree = (root) => { const out = {}; const walk = (id, parent) => { out[id] = { n: N[id].n, ...(parent ? { p: parent } : {}) }; (kids[id] || []).forEach((k) => walk(k, id)); }; walk(root, null); return out; };
const assets = {};
for (const id of WANT) {
  const a = D.assets[id];
  if (!a) { console.error(`FAIL: the twin has no asset "${id}"`); process.exit(1); }
  assets[id] = { name: a.name, category: a.cat || 'power', model: a.model, root: a.root, plant_model: a.plantModel || null, plant_root: a.plantRoot || null, plant_name: a.plantName || null,
    nodes: subtree(a.root), plant_nodes: a.plantRoot ? subtree(a.plantRoot) : null };
}
const commit = execSync(`git -C "${TWIN}" rev-parse HEAD`).toString().trim();
const dirty = execSync(`git -C "${TWIN}" status --porcelain -- public/engine src/engine`).toString().trim() !== '';
fs.mkdirSync(path.join(REPO, 'dashboard/data/twin'), { recursive: true });
fs.writeFileSync(path.join(REPO, 'dashboard/data/twin/trees.json'), JSON.stringify({ schema: 'damage_dashboard_twin_trees.v1', twin_repo: 'aamani-ai/infrasure-digital-twin', twin_commit: commit, twin_dirty: dirty, assets }, null, 1) + '\n');

// 3 · the viewer, the models those assets need (and the kits they read), three.js
const models = new Set(Object.values(assets).flatMap((a) => [a.model, a.plant_model]).filter(Boolean));
const fileOf = {};
for (const f of fs.readdirSync(path.join(ENGINE, 'models'))) for (const m of fs.readFileSync(path.join(ENGINE, 'models', f), 'utf8').matchAll(/R\['([a-z0-9-]+)'\]\s*=/g)) fileOf[m[1]] = `models/${f}`;
const needed = new Set();
for (const m of models) { if (!fileOf[m]) { console.error(`FAIL: no model file registers "${m}"`); process.exit(1); } needed.add(fileOf[m]); }
// kits first, in the twin's own load order: a model that reads window.HVKit, window.REKit or window.ComposeKit needs the file
// that defines it (HVKit: hv-kit.js; REKit: re-warehouse.js; ComposeKit: compose-kit.js)
const KITS = { HVKit: 'models/hv-kit.js', REKit: 'models/re-warehouse.js', ComposeKit: 'models/compose-kit.js' };
const kits = [];
for (const [kit, file] of Object.entries(KITS)) if ([...needed].some((n) => new RegExp(`window\\.${kit}\\b`).test(fs.readFileSync(path.join(ENGINE, n), 'utf8')))) kits.push(file);
kits.sort((a, b) => order.indexOf(a) - order.indexOf(b));
const load = [...new Set([...kits, ...order.filter((f) => needed.has(f))])];
const OUTP = path.join(REPO, 'dashboard/public/twin');
fs.rmSync(OUTP, { recursive: true, force: true });
fs.mkdirSync(path.join(OUTP, 'models'), { recursive: true });
const files = {};
const copy = (from, to) => { fs.copyFileSync(from, path.join(OUTP, to)); files[to] = crypto.createHash('sha256').update(fs.readFileSync(path.join(OUTP, to))).digest('hex'); };
copy(path.join(TWIN, 'node_modules/three/build/three.min.js'), 'three.min.js');
copy(path.join(ENGINE, 'subsystem-viewer.js'), 'subsystem-viewer.js');
for (const f of load) copy(path.join(ENGINE, f), f);
const three = JSON.parse(fs.readFileSync(path.join(TWIN, 'node_modules/three/package.json'), 'utf8')).version;
fs.writeFileSync(path.join(OUTP, 'manifest.json'), JSON.stringify({ schema: 'damage_dashboard_twin_viewer.v1', twin_repo: 'aamani-ai/infrasure-digital-twin', twin_commit: commit, twin_dirty: dirty, three, load_order: ['three.min.js', ...load, 'subsystem-viewer.js'], files }, null, 1) + '\n');
console.log(`twin ${commit.slice(0, 7)}${dirty ? ' (engine has local changes)' : ''} · ${Object.keys(assets).length} assets · ${models.size} models in ${load.length} files · three ${three}`);
