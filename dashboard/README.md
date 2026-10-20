# dashboard/ — the damage-curve dashboard (V0, local)

An internal instrument that shows every damage curve in this repository with where it came from: the library
of hazard × asset cells, an asset view, a cell page with the derivation trail, a curve dossier, the
"does it happen?" page and a `/code/` resolver. It **reads** the catalogue and the cell artifacts through a
checked build step and **never writes** to `docs/`. Plan of record:
[`docs/plans/damage_curve_dashboard/`](../docs/plans/damage_curve_dashboard/README.md); reasoning:
[`docs/extra/discussion/damage_curve_dashboard/`](../docs/extra/discussion/damage_curve_dashboard/README.md).

**Status: V0, battery storage end to end, local only.** It waits for the owner's look review
([`REVIEW.md`](../docs/plans/damage_curve_dashboard/evidence/3f9d516/REVIEW.md)); nothing merges before it.

## Run it

From the repository root, with the `python3.12` venv of [`AGENTS.md`](../AGENTS.md) and Node 22:

```bash
.venv/bin/python scripts/dashboard/build_dashboard_data.py
```

```bash
cd dashboard && npm install && npm run dev
```

Open <http://localhost:3000>. The build step writes `dashboard/data/` and prints one line per failed check; it
exits 1 today because one *data* check fails (see below) — the data are still written and the pages show the
finding. A *structural* failure writes nothing.

- **The static site**, as the look review measures it: `npm run build && npm run start`, then
  <http://localhost:3211>. `npm run start` serves `out/` with `scripts/serve-static.mjs`; no server code ships.
- **Checks only:** add `--check` to the build step to run every check and write nothing.
- **In a git worktree** the venv lives in the main checkout: `<main checkout>/.venv/bin/python
  scripts/dashboard/build_dashboard_data.py`, run from the worktree root.
- **Hazard's twin crosswalk** is read from `$HAZARD_MODELING`, else the gitignored `Hazard_modeling` symlink,
  else a `Hazard_modeling` checkout beside this repository. Without any of them the build checks the committed
  copy `data/twin_crosswalk.csv` against the same pin and says so in the receipt.
- **If `npm install` fails with `EACCES` under `~/.npm`**, give it another cache: `npm install --cache
  /tmp/npm-cache`.
- **Other scripts:** `npm run lint` · `npm run typecheck` · `npm run data` (the build step, from the main
  checkout).

## The build checks

`scripts/dashboard/build_dashboard_data.py` runs them in this order; `data/receipt.json` records each result,
and the library's header shows them as a strip.

| Check | Passes when | Kind | Today |
|---|---|---|---|
| `counts` | The headline counts equal the catalogue's (13 live · 5 proposals · 3 reused · 4 gaps; 25 entries) | structural | pass |
| `pins` | Every artifact, index, value-binding and source SHA equals its pin (45 pins) | structural | pass |
| `twin_crosswalk` | Hazard's twin crosswalk SHA equals the battery value binding's pin | structural | pass |
| `curves` | Every curve record is sampled through a repository evaluator, or listed with the fixed *no evaluator* sentence; and no cell listed as having no evaluator has one in `scripts/reference_helpers/` | structural | pass — 94 drawn, 10 listed |
| `known_answers` | Every executable known answer reproduces within tolerance; a case not run carries its reason | data | pass — 1,748 of 1,748 run; 136 not run with reasons |
| `source_ids` | Every source ID shown resolves in the cell's own register | data | **fails** — 22 references in `tropical_cyclone_wind_wind`, `wildfire_solar`, `tropical_cyclone_wind_solar` |
| `domain` | Nothing is sampled outside a declared valid domain (each sampler asserts it; a violation stops the build) | structural | pass |
| `chain_files` | No trail station is marked *artifact* without a file behind it | structural | pass |
| `occurrence` | Every occurrence register names its catalogue entry and uses the shared bucket keys | structural | pass |

A data check is never loosened to make the strip green: the failure is shown on the library and in each
affected cell's evidence card until the cell's registers are fixed.

**The two battery cells without an evaluator.** `tropical_cyclone_wind_bess` and `wildfire_bess` show *Not
drawn — no reference evaluator for this form in this repository (G9).* Their evaluators landed on `main` in
PR #4 after this slice was cut; once they are present the `curves` check stops the build until the sampler
draws those cells through them (`DCD-A06`). That wiring is the first V1 step.

## The look review

Every slice is judged by [`06` §4](../docs/extra/discussion/damage_curve_dashboard/06_look_and_usability.md):
screenshots at 1440 × 900 and 1024 × 768 in both themes, a greyscale print, the screenshot-escape check, a
keyboard-only walk, the fixed sentences, both themes, a cold read, the speed budget (library ≤ 1 s, cell page
≤ 1.5 s to usable) and the owner's acceptance. The measured half is scripted in
[`scripts/look-review/`](scripts/look-review/README.md); the evidence goes under
`docs/plans/damage_curve_dashboard/evidence/<commit>/` with a `REVIEW.md`. V0's record:
[`evidence/3f9d516/REVIEW.md`](../docs/plans/damage_curve_dashboard/evidence/3f9d516/REVIEW.md).

## What V0 covers, and what it does not

| Covered in V0 | Not in V0 |
|---|---|
| The library of all 25 entries, with the Status, Evidence, Does it happen?, Value covered and Review lenses | The chain lens and the gate view (`07` §6–§7) |
| The battery asset view: value buckets × hazards with the twin lead, the curve mark and the field-report state | Value buckets for the other four assets: their views list the catalogue's parts instead, since only batteries have a bucket crosswalk |
| The Flood × Battery storage cell page with the ten-station trail, its drawers and the cards | Lineage lighting, the version ghost and the chain diff |
| The Separate PCS curve dossier, with a linear or log x-axis | Digitised source points (◇) and the events rug; no V0 cell has data for either |
| The Hail × Battery storage occurrence page, every bucket *not searched* | Search results: no field-report search has been logged |
| Hurricane wind and wildfire × Battery storage listed, *Not drawn* | Their curves (the V1 step above) |
| The `/code/<damage_code_id>?v=` resolver | The review queue and the one-pager export (gate G8) |
| Every other cell and asset page, rendered from the same build | A look review of any page outside the battery slice |
| Local run, static export | Hosting (gate H1) |

## How it is built

| Path | What |
|---|---|
| `app/` | The routes: `/`, `/assets/[asset]`, `/cells/[entry]`, `/cells/[entry]/curves/[curve]`, `/occurrence/[asset]/[hazard]`, `/code/[code]` — all prerendered from `data/` |
| `components/` | The status rail, the trail and its drawer, the library grid, the asset view, the curve plots, the cell cards |
| `lib/` | Readers for `data/`, types, number formats, the series palette and line styles, URL state |
| `data/` | Written only by the build step ([README](data/README.md)) |
| `scripts/serve-static.mjs` | Serves `out/` for `npm run start` |
| `scripts/look-review/` | The look-review scripts |

- **Stack.** Next.js 16 (App Router, static export), React 19.2.4, Tailwind 4, ECharts 6 (tree-shaken, canvas
  renderer), next-themes; Geist and Geist Mono. Tokens follow the Hazard dashboard's `globals.css`
  (`DCD-D03`). The lock resolved Next 16.4.2; Hazard's baseline is 16.3.1 (`DCD-A02`).
- **The browser never evaluates a curve.** Every point on a plot was sampled by a repository evaluator during
  the build; the app draws the samples.
- **View state lives in the URL** so a link reproduces what the sender saw: `?lens=` on the library and the
  asset view, `?row=` for an open bucket, `?station=` for an open trail drawer, `?open=` for open cards
  (`?open=all` opens every card), `?x=log` on a dossier plot.
- **Dependencies.** `npm audit --omit=dev` reports none. The dev-only lint chain (`eslint-config-next` →
  `micromatch` → `braces`) carries five high-severity advisories with no non-breaking fix yet.
