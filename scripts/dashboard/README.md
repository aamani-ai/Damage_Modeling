# scripts/dashboard — the dashboard's data build

The one build step behind [`dashboard/`](../../dashboard/README.md): it reads the catalogue, every cell
artifact, the known-answer tests, the source and claim registers, the occurrence register and Hazard's pinned
twin crosswalk, runs the checks, and writes `dashboard/data/` with a receipt. Nothing under `docs/` is written.
Needs the `python3.12` venv (`openpyxl` reads the workbooks for the trail's prose detector and for the older
cells' evidence sheets).

```bash
.venv/bin/python scripts/dashboard/build_dashboard_data.py                    # build from origin/main; a structural failure writes nothing
.venv/bin/python scripts/dashboard/build_dashboard_data.py --source worktree  # a labelled preview of this checkout
.venv/bin/python scripts/dashboard/build_dashboard_data.py --check            # run every check, write nothing
node scripts/dashboard/export_twin.mjs ["<Digital Twin checkout>"]            # re-export the twin when it changes
```

| File | What |
|---|---|
| `build_dashboard_data.py` | The command line: picks the source (an export of `origin/main` by default, or the worktree as a labelled preview), runs the build, prints the failed checks, exits 1 if any check fails |
| `export_twin.mjs` | Exports the Digital Twin's trees for the spine's types into `dashboard/data/twin/trees.json` and vendors its viewer, models and three.js into `dashboard/public/twin/` with a SHA manifest, pinned to the twin commit |
| `dashboard_build/twin.py` | The spine and the coverage: every twin node's state per hazard from the crosswalks, the systems list, the systems × hazards table, the nav spine; checks the rows and the vendored viewer |
| `dashboard_build/hazard_main.py` | Hazard as it is on its `origin/main`, through git: reads its files, looks up every Hazard path (on main · moved into `_archive/` · on a branch) |
| `dashboard_build/faq.py` | `docs/faq.md` parsed into questions; the four-sentence rule, the example and every *Read more* link checked |
| `dashboard_build/build.py` | Assembles every JSON the app reads and runs the checks listed in the [dashboard README](../../dashboard/README.md#the-build-checks) |
| `dashboard_build/catalogue.py` | Loads the 25 catalogue entries and checks their pins |
| `dashboard_build/sampling.py` | Samples each curve through the cell's own evaluator in `scripts/reference_helpers/`, reproduces its known answers, or lists it *no evaluator* (G9) |
| `dashboard_build/chain.py` | The ten-station derivation trail: files first, then dossier headings and workbook sheets, else *not yet detected* |
| `dashboard_build/registers.py` | Reads source, claim and parameter registers across their header variants |
| `dashboard_build/occurrence.py` | The occurrence register, the bucket values and the twin crosswalk pin |
| `dashboard_build/summaries.py` | The plain first line of each screen |
| `dashboard_build/sources.py` | Sources as links (URL · DOI · repository file at the build commit · Hazard file · none, with the words *no link in the register*); the older cells' sources, claims, assumptions and open seams read from their workbook sheets and dossier tables, each marked where it came from; the tier table's source IDs matched to them by their words |
| `dashboard_build/plain.py` | The plain layer (DCD-D19, D27, D28): the four tier words and the code-to-word rewrite, the rail chips, the capability sentences, one caption per drawn curve, the main logic, the four steps, the ten station paragraphs, parameters in words |
| `dashboard_build/parts.py` | The asset view for every asset: the canonical parts per asset, each cell's own split (failure units, catalogue rows, value linkage, the binding ledgers), the *split differently* finding, Hazard's substation budget and crosswalk |
| `dashboard_build/common.py` | Paths, formats and the fixed honest-state sentences (discussion `06` §2.4) |
| `seed_occurrence_register.py` | Seeds `docs/evidence/occurrence/<asset>/<hazard>.{json,md}` with every bucket *not searched* and the Digital Twin's leads; never overwrites a searched row or an existing log |
