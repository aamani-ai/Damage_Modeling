<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-21
updated: 2026-10-21
status: draft
scope: The asset spine and the twin crosswalks — which Digital Twin part each damage curve covers, per asset type and hazard. Drafted here, co-owned with Hazard (DCD-D23); read by the dashboard's data build to colour the twin's 3D models (DCD-D21).
-->

# Twin crosswalks — which part each curve covers

Each damage curve is drawn on the Digital Twin's own reference model, so a reader sees what it covers
([discussion 09](../../extra/discussion/damage_curve_dashboard/09_asset_spine_coverage_and_faq.md)). Two kinds of
file make that possible:

- [`spine.json`](spine.json) is the asset spine: category → type → profile, after the twin's taxonomy
  (`DCD-D20`). Each type names its twin asset and its crosswalk.
- One CSV per twin asset says what each cell does with each twin part:
  [`solar.csv`](solar.csv), [`wind.csv`](wind.csv), [`bess.csv`](bess.csv), [`gi_sub_t.csv`](gi_sub_t.csv) (the
  substation), [`re_res.csv`](re_res.csv) (house), [`re_ind.csv`](re_ind.csv) (warehouse) and
  [`re_com.csv`](re_com.csv) (the commercial picture).

## Columns

| Column | Meaning |
|---|---|
| `hazard` | The dashboard's hazard slug: `hail`, `flood`, `hurricane_wind`, `convective_wind`, `wildfire` |
| `entry_id` | The catalogue entry (the cell or binding) |
| `twin_node` | A node of the twin's tree at the pinned twin commit (`dashboard/data/twin/trees.json`), at any level. Its children inherit the row unless a row of their own says otherwise |
| `state` | `curve` — the part has a damage curve in this cell · `conditioner` — it changes the curve, no curve of its own (tracker stow, a flood defence) · `no_curve` — in the asset's value, no curve yet (named as missing, withheld, or not named) · `no_direct_damage` — reviewed: this hazard does not damage it directly · `outside` — outside the value this cell prices (the site, a resilience measure, an export line) |
| `part` | For `curve`, the catalogue row's part exactly as the entry names it; two curves that are alternatives for the same twin part are separated by ` \| ` (hurricane × solar's two module routes). Otherwise the entry's own words for the gap, when it has them |
| `basis` | Where the state comes from: `part` (a catalogue row) · `not_covered` · `out_of_scope` · `coverage_decision` (the cell's stated coverage) · `not_named` (the cell does not mention the part) · `inferred` (read from the mechanism; to confirm with the cell owner) |
| `note` | One plain sentence, shown on the dashboard beside the part |

A gap entry (no curve for the hazard yet) needs no rows: every part shows *no curve yet*.

## How to change one

Edit the row, run `.venv/bin/python scripts/dashboard/build_dashboard_data.py`, and look at the asset page. The build
fails when a node is not in the pinned twin, an entry or part does not match the catalogue, or a state is unknown;
it reports any part a cell leaves unmapped. Rows marked `inferred` or `not_named` are the questions to take to each
cell's owner. When the twin changes, run `node scripts/dashboard/export_twin.mjs` first.

Commercial is the office (`DCD-D22`): its curve rows name the office's parts, and the picture is the twin's retail
building until the twin has an office model; the page says so.

These files are a draft for Hazard to co-own beside its battery and substation crosswalks
(`Hazard_modeling/docs/plans/_cross_cutting/bess_conus/twin_crosswalk.csv`), which map the same twin nodes to value
buckets. They change no curve and no number.
