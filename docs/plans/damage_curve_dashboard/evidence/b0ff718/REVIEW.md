<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-21
updated: 2026-10-21
status: proposed
scope: The look review (discussion 06 §4, gate G10) and the brief's acceptance checks (iteration_2_brief.md §5) of dashboard iteration 2 at receipt commit b0ff718 — the plain layer first, sources as links, every asset — with the screenshot set, the greyscale, screenshot-escape, keyboard, copy, theme and speed checks, the mechanical acceptance scan, what the owner is asked to decide, and what is open.
-->

# Iteration 2 — the plain layer first, look review at `b0ff718`

This folder is the evidence for the look review of [`06` §4](../../../../extra/discussion/damage_curve_dashboard/06_look_and_usability.md)
and for the acceptance checks of the [iteration-2 brief](../../iteration_2_brief.md) §5, for the iteration that answers the owner's first
review of V0 (`DCD-D18`): the plain layer is the page and every ledger fact is one control away (`DCD-D19`), sources are links, every asset
has the asset view with the *split differently* finding, and the four oldest cells show the evidence read from their workbooks and dossiers.
Seven of the nine checks pass; the cold read (7) needs a named reader and the owner's review (9) is open.

| # | Check | Verdict | Evidence here |
|---|---|---|---|
| 1 | Screens | **pass** | 139 PNGs: eight per screen for the 15 routes of `routes.iter2.json`, plus greyscale and scrolled frames (13.9 MB) |
| 2 | Greyscale | **pass** | `b0ff718_16_greyscale_*` |
| 3 | Screenshot escape | **pass** | `b0ff718_13_escape_*`, `escape.json` |
| 4 | Keyboard | **pass** | `keywalk.json` |
| 5 | Copy | **pass** | `acceptance_checks.txt` (no code in the default view on 39 pages), the fixed sentences unchanged |
| 6 | Themes | **pass** as far as the builder can judge | every screen in both themes |
| 7 | Cold read | **pending** | needs a named reader: two questions, two minutes each (§5 check 8) |
| 8 | Speed | **pass** | `speed.json` |
| 9 | Owner review | **open** | this folder, `/v0` and the running app |

## The brief's acceptance checks (§5)

`acceptance_checks.py` runs them against the served export and the built data; its output is `acceptance_checks.txt`:

```text
1 no code in the default view: 39 pages scanned, 0 with a hit
2 one curve at a time: the part selector's first part is checked by default and compare is opt-in (?compare=1); verified by the keyboard walk (keywalk.json: 'Next part selected (the URL carries ?part=)') and the 1_ vs 14_ captures
3 captions: 104 drawn curves, 0 without the four parts []
4 sources: {'total': 267, 'linked': 249, 'locator_only': 13, 'neither': 5, 'markers': 6, 'placeholders': 3}; sources with neither a link nor a locator carry the words and are on the queue: source_without_link=5, sources_locator_only rows=9; sources that carry no words at all: []
5 every asset: solar: rendered, split block present, differs=True, twin=False, rows=10; wind: rendered, split block present, differs=True, twin=False, rows=10; real_estate: rendered, split block present, differs=True, twin=False, rows=5; substation: rendered, split block present, differs=True, twin=True, rows=5; bess: rendered, split block present, differs=True, twin=True, rows=5
6 older cells: hail_solar: extracted, 21 sources (20 linked), 8 parameters, unmatched []; flood_solar: extracted, 8 sources (8 linked), 9 parameters, unmatched ['ANZGEO_2023_SCOUR_CONTEXT']; strong_wind_solar: extracted, 10 sources (10 linked), 26 parameters, unmatched ['WIND_PRESSURE_PHYSICS']; wind_tornado_wind: extracted, 8 sources (8 linked), 22 parameters, unmatched ['AWN_15_DECLARED_BRIDGE']
7 plain panels: 250 station paragraphs, 0 whose first sentence carries a code pattern
8 cold read: pending — needs a named reader (two questions, two minutes each)
RESULT: all mechanical checks pass
```

| # | Check | Verdict |
|---|---|---|
| 1 | No code in the default view | **pass** — 39 pages (every cell page, the curve pages of two cells, every asset view, the queue, `/v0`, an occurrence page): outside `<details>`, footers and tooltips, no register or claim ID, no tier code without its word, no gate letter, station number or SHA. The library's tiles keep their codes: the owner accepted the library as it was |
| 2 | One curve at a time | **pass** — a cell page opens on one labelled curve; the part selector and the variant toggle choose, the other parts are ghosted; *compare all parts* is `?compare=1`, opt-in (captures `1_` against `14_`; the keyboard walk's `?part=1` step) |
| 3 | Captions | **pass** — 104 of 104 drawn curves carry *what it says · how sure · seen in the field · main references*, written by the build (`plain_layer` build check) |
| 4 | Sources | **pass** — 267 documents across the 18 cells with sources: 249 links, 13 titled citations with a locator and the words *no link in the register*, 5 with neither (the words shown, and the first rows of the review queue); 6 provenance markers and 3 placeholder inputs listed apart |
| 5 | Every asset | **pass** — `/assets/solar`, `/assets/wind`, `/assets/real_estate`, `/assets/substation`, `/assets/bess` render; each shows the *split differently* block (it differs for all five); twin nodes for batteries and substations, *no twin mapping yet* for the rest |
| 6 | Older cells | **pass** — Hail × Solar farm 21 sources (20 linked), Flood × Solar farm 8, Convective wind × Solar farm 10, Convective wind × Wind farm 8, read from their workbooks and dossiers and marked so; three tier-table IDs match no document and the pages say which |
| 7 | Plain panels | **pass** — 250 station paragraphs (ten per cell, 25 cells); no first sentence carries a code pattern |
| 8 | Cold read | **pending** — a named reader answers *which hazards affect solar farms, and how sure are we?* from the Solar farm page and *what does the PCS flood curve say and what is it based on?* from the PCS curve page, under two minutes each, and says what confused them |

## How the set was made

- **The build.** The data were rebuilt from a clean tree at `b0ff718`; the receipt says `working_tree_clean: true` and
  `commit: b0ff718`. Structural checks pass (`counts`, `pins` 45, `twin_crosswalk`, `substation_budget`, `curves` 104 of 104,
  `plain_layer`, `domain`, `chain_files`, `occurrence`); 1,852 of 1,852 known answers run reproduced, 32 not run with a reason.
  Three data checks fail and are shown: `source_ids` (22 references, unchanged since V0), `source_links` (5 sources with
  neither a link nor a locator), `extracted_sources` (3 unmatched IDs).
- **The static export** (`npm run build`) served by `dashboard/scripts/serve-static.mjs` on `localhost:3213`; port 3211 was
  the owner's running build of `main`.
- **The captures.** Headless Chrome 155 through puppeteer-core 23.11.1 (installed `--no-save`), with
  [`dashboard/scripts/look-review/`](../../../../../dashboard/scripts/look-review/README.md): `routes.iter2.json`,
  `speed.iter2.json`, the iteration-2 `keywalk.mjs`. Both theme switches set (the colour-scheme media feature and
  next-themes' stored key), device scale 1, reduced motion. Images reduced to 128 colours without dithering.
- **File names.** `b0ff718_<n>_<screen>__<width>x<height>__<theme>[__full|__grey|__middle|__bottom].png`.

| # | Screen | Route |
|---|---|---|
| 1 | Flood × Battery storage, the cell page | `/cells/flood_bess` |
| 2 | … with the *Where the numbers come from* panel open | `/cells/flood_bess?station=evidence` |
| 3 | Hail × Solar farm, the cell page (an older cell) | `/cells/hail_solar` |
| 4 | … with its evidence panel open | `/cells/hail_solar?station=evidence` |
| 5 | Separate PCS, the curve page | `/cells/flood_bess/curves/BESS_PCS_INUNDATION_PROXY` |
| 6–10 | The five asset views | `/assets/solar` · `/assets/wind` · `/assets/substation` · `/assets/real_estate` · `/assets/bess` |
| 11 | The library (unchanged; the header shows the build date) | `/` |
| 12 | The review queue | `/review` |
| 13 | The iteration-2 walkthrough | `/v0` |
| 14 | Flood × Battery storage with *compare all parts* | `/cells/flood_bess?compare=1` |
| 15 | Hurricane wind × Battery storage (a scenario set: six variants) | `/cells/tropical_cyclone_wind_bess` |
| 16 | Greyscale: the cell page, the Solar farm view, the library | 1440, light |
| 13 (escape) | Scrolled frames | both widths, light |

## 2 · Greyscale

On the cell page the selected curve is the one dark line, the other part a faint grey line behind it, the known answers
hollow rings; the words of the chips, the strip and the blocks carry the page. On the Solar farm view every cell is words,
so nothing depends on colour. The library reads as before.

## 3 · Screenshot escape

| Screen | Scrolls by, at 1440 / 1024 | In every frame |
|---|---|---|
| Flood × Battery storage, the cell page | 300 / 1,158 px | the status rail |
| Hail × Solar farm, the cell page | 300 / 1,058 px | the status rail |
| Solar farm, the asset view | 597 / 1,120 px | the status rail |
| Separate PCS, the curve page | 367 / 1,023 px | the status rail |

## 4 · Keyboard

`keywalk.mjs` walked library → the *Flood × Battery storage* tile → the cell page → the *How this was built* strip (arrow
keys) → the *Where the numbers come from* panel (Enter; Escape returns focus to the step) → the part selector (the next part,
`?part=1`) → the curve's own page → the ⓘ → close, in both themes. Every step showed the 2 px accent ring
(solid 2px rgb(37, 99, 235) light; solid 2px rgb(91, 141, 239) dark), `:focus-visible` true throughout.

| Step | Keys | Focus lands on |
|---|---|---|
| Library: first tile | Tab ×20 | Hail × Solar farm, live, partial, shape T2, cost T2, not searched |
| Library: Flood × Battery storage tile | ArrowDown ×4, ArrowRight ×1 | Flood × Battery storage, live, partial, shape T3–4, cost T3–4, not sea |
| Cell page opened; focus on the page body | Enter | ← Battery storageFlood × Battery storageLive · a screening m |
| How this was built: first step (What it covers) | Tab ×3 | What it covers: Which hazard, which asset, which parts; what is left o |
| How this was built: Where the numbers come from | ArrowRight ×3 | Where the numbers come from: The sources, what was taken from each, an |
| Step panel open; focus on Close | Enter | Close |
| Panel closed; focus back on the step | Escape | Where the numbers come from: The sources, what was taken from each, an |
| Part selector: the selected part | Tab ×7 | Battery enclosure (active hardware) |
| Next part selected (the URL carries ?part=) | Tab, Enter | Separate PCS |
| Cell page: the curve's own page link | Tab ×14 | open this curve's own page ▸ |
| Curve page opened; focus on the page body | Enter | ← Flood × Battery storageSeparate PCSLive · a screening mode |
| Curve page: first ⓘ button | Tab ×2 | What the evidence words mean |
| ⓘ open | Enter | What the evidence words mean |
| ⓘ closed; focus stays on the button | Escape | What the evidence words mean |

## 5 · Copy

- **No code before a control.** `acceptance_checks.py` strips `<details>` (innermost first), footers and attributes from
  each served page and scans the rest: 39 pages, 0 hits. Tiers appear as words with the code secondary (*transferred · T3*);
  a bare code inside a catalogue sentence is given its word by the build (*reused as a T4 (our judgment) hypothesis*) and a
  register ID is dropped from the default view, the raw text staying in the ledger.
- **The fixed sentences** of `06` §2.4 are unchanged: *Not searched — nobody has looked for field reports yet*, *No curve —
  …*, *Withheld: …*; the chip says *Field reports: nobody has looked yet* and the sentence stays in the panel.
- **New fixed sentences**, written once in the build: *no link in the register*; *Sources are in the dossier prose and the
  workbook; not yet extracted — open the dossier*; *No twin mapping yet — the Digital Twin's nodes have not been
  crosswalked to this asset's parts*; the asset cells' words (*curve · lab-tested*, *curve for part of it*, *one curve for
  the whole …*, *named, no response yet (withheld)*, *no curve*, *not named by this cell*, *no cell yet*).
- **Headings** name the object; the build date replaces the commit in the header (the commit is in every footer).

## 6 · Themes

Both themes were captured for every screen; the panels, the ghosted curves, the hatched withheld zones and the
ring marks were checked in the dark captures. No new colour was introduced: the series tokens of the first V1 step stand.

## 8 · Speed

Budgets from `06` §2.9 (the library within 1 s, a cell page within 1.5 s to usable; the asset views held to the cell budget,
the queue and `/v0` to the library's). Apple M4, macOS 26.1, headless Chrome 155, against the static export, seven cold runs
per page; *usable* = hydrated and, on plot pages, the canvas present. Worst *usable*: 151 ms at full speed, 633 ms at 4× slower CPU.

| Screen | Budget (ms) | Full speed: first paint · usable median (worst) | 4× slower CPU: first paint · usable median (worst) | |
|---|---|---|---|---|
| library / | 1,000 | 48 · 71 (76) | 136 · 289 (303) | pass |
| cell /cells/flood_bess | 1,500 | 68 · 141 (150) | 208 · 593 (625) | pass |
| cell /cells/hail_solar | 1,500 | 76 · 138 (146) | 204 · 580 (605) | pass |
| cell /cells/tropical_cyclone_wind_bess | 1,500 | 64 · 144 (151) | 212 · 616 (633) | pass |
| dossier PCS | 1,500 | 56 · 123 (128) | 128 · 498 (590) | pass |
| asset /assets/solar | 1,500 | 48 · 83 (87) | 140 · 320 (364) | pass |
| asset /assets/bess | 1,500 | 48 · 76 (85) | 128 · 295 (325) | pass |
| review queue /review | 1,000 | 44 · 63 (70) | 92 · 210 (222) | pass |
| review page /v0 | 1,000 | 48 · 72 (82) | 144 · 282 (293) | pass |

## 9 · Owner review

Open. The decisions asked for on `/v0`:

1. **The balance** — the plain layer as the page, the ledger one control away (*Details*, *Show the numbers*, the footer).
   Accept, or name a fact that should come back to the surface.
2. **The four tier words** — field-calibrated · lab-tested · transferred · our judgment, with the code secondary.
3. **The rows of each asset view** — the plant's parts as this page names them (`DCD-A14`), each cell's own names beside them.
4. **The cold reader** — two questions, two minutes each; Prashant is the usability table's name for the task.
5. **The header's build date** instead of the commit.

## Findings that are not look failures

1. **Five sources carry neither a link nor a locator** (the hurricane × wind farm register's four rows, whose columns are
   `source_id · role · use · limits`; one review log in wildfire × solar). The page says *no link in the register* and the
   review queue lists them; the registers are their cells' owners' to fix.
2. **Three tier-table IDs of the oldest cells match no document** in their workbook or dossier
   (`ANZGEO_2023_SCOUR_CONTEXT`, `WIND_PRESSURE_PHYSICS`, `AWN_15_DECLARED_BRIDGE`): reported, never guessed.
3. **The `source_ids` data check still fails** on its 22 references (unchanged from V0).
4. **Hazard's substation twin crosswalk is read unpinned** (no artifact in this repository pins it); the receipt records its
   SHA and the page says so. The reference budget is pinned by the substation flood binding and checked.
5. **The library keeps its codes** (tier codes and entry IDs on the tiles): the one screen the owner accepted as it was.

## Files in this folder

| File | What |
|---|---|
| `b0ff718_*.png` | The 139 captures |
| `escape.json` | Scroll height and rail-in-frame for each scrolled frame |
| `keywalk.json` | Each keyboard step's focused element, outline, pressed or checked state and URL, light and dark |
| `speed.json` | The speed runs behind the table above |
| `acceptance_checks.py` · `.txt` | The brief's §5 checks 1–7, run against the served export and the data, and their output |
