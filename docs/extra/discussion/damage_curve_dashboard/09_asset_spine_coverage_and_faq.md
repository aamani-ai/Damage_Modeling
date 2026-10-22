<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-21
updated: 2026-10-21
status: active
scope: How assets are organised on the dashboard (the agreed category → type → profile spine), how each damage curve shows what it covers on the Digital Twin's own 3D model, what has to change at a high level, the FAQ's outline, and four decisions (G20–G23). Complements discussion 08.
-->

# 09 — The asset spine, what each curve covers, and the FAQ

**Iteration 1, 2026-10-21 — G20–G23 ruled the same day** (*"agree on all"*). Nothing is built from this yet. Decision sheet
[`08`](08_categories_and_construction.md) is the companion to this note on the `dashboard` branch. This note settles 08's G13 with the owner's own words and adds G20–G23.

**Starting problem:** battery storage reads well and solar and wind do not. The three battery cells cut the
plant the same way because they all started from one reference plant. The solar and wind cells each cut the
plant their own way:

- Hail × Solar curves 1 part, Flood × Solar 8 parts, Wildfire × Solar 10, with different names for the same
  equipment.
- Flood × Wind curves only the substation; Hurricane × Wind curves only the tower.
- Real estate lists *buildings* as its parts.

Nobody can see what a curve covers without reading its files. All counts come from
[evidence](evidence/2026-10-21_twin_spine_and_cell_parts.txt).

## 1 · The spine — agreed

*Divy, 2026-10-21: "You have power plants. Within that, you have all those things. You have real estate. Within
that, you will have categories. Power plants and real estate are something parallel, just like grid
infrastructure, just like a data center in the future."* This is the Digital Twin's taxonomy, and every level
below it already exists in the twin.

```text
 CATEGORY               TYPE                PROFILE (reference)                 TWIN MODEL     OUR CELLS
 Power plants           Solar farm          100 MWac 1P tracker block           pv-tracker     5 live
                        Wind farm           2.8 MW geared turbine               wind-turbine   4 live · 1 gap
                        Battery storage     5 MW / 20 MWh LFP block             bess-block     3 live · 2 gaps
                        Hybrid (planned)    solar + storage, AC or DC coupled   hybrid-block   —
 Real estate            Residential         one-storey house                    re-house       } 5 proposals,
                        Commercial          retail (twin) · office (our cells)  re-retail      } each holding
                        Industrial          distribution warehouse              re-warehouse   } all three types
 Grid infrastructure    Substation          transmission · switching · distr.   gi-sub-*       1 live · 3 reused · 1 gap
                        Transmission/distribution line                          gi-line-*      —
 Digital infrastructure (future)  data centres                                  —              —

 Below each profile, the twin's tree:  asset → systems → equipment → components
   (BESS block: 6 systems · 16 equipment · 8 components; solar block 8 · 30 · 34; turbine 9 · 34 · 53; house 7 · 28 · 8)
 A damage curve attaches to the part that is replaced and priced on its own (the "failure unit"); its failure
 modes sit below as the reasons. A curve never sits on a building or a plant as a whole unless the evidence is
 only available at that grain (the substation's "whole fenced station").
```

Four precise points, agreed in the same exchange: a real-estate building is a profile, not a part; a plant's own
substation is inside the plant while a utility's substation is Grid infrastructure; Hybrid is a power-plant type;
and Commercial has two profiles today (G21).

## 2 · How a curve shows what it covers

The twin's 3D viewer already recolours any part from a map, which is how its *Exposure* overlay works. We use the
same viewer and models, and colour each part by **what this cell does with it**:

```text
 ┌────────────────────────────────────────────────────┐   WHAT THE COLOURS MEAN
 │                                                    │   ■ has a damage curve in this cell
 │     the twin's own reference model, in 3D,         │   ■ changes the curve, no curve of its own (tracker stow)
 │     every part coloured by its state               │   ■ in the asset's value, no curve yet
 │     orbit · zoom · click a part → its curve        │   ■ reviewed: no direct damage from this hazard
 │                                                    │
 │                                                    │   THE ASSET'S SYSTEMS, AS THE TWIN BREAKS IT DOWN
 │                                                    │   Battery System   has a curve: enclosures, thermal
 │                                                    │                    no curve yet: suppression, fire safety
 └────────────────────────────────────────────────────┘   Power Conversion has a curve: PCS · no curve yet: MV …
   Flood × Battery storage   [Hail × Solar]  [Flood × Solar]     ← the same plant, hazard by hazard
```

A working prototype exists:
[`evidence/2026-10-21_coverage_prototype.html`](evidence/2026-10-21_coverage_prototype.html), shown to the
owner on 2026-10-21. It loads the twin's engine as-is and has three views:

- **Flood × Battery storage.** Green enclosures and PCS sit in an amber balance of plant.
- **Hail × Solar.** The modules are green, the trackers blue (stow) and the rest grey.
- **Flood × Solar.** The same rows are coloured almost entirely differently. *That* is the inconsistency, made
  visible.

The mapping from each cell's parts to the twin's equipment was read off the catalogue by hand for the
prototype. The real one comes from the crosswalks in §3.

The rules for this picture:

- The legend is always visible.
- Every colour is repeated in words in the systems list, so nothing depends on colour alone.
- The same four states appear on the asset page, on the cell page, and as a thumbnail on the curve page.

## 3 · What has to change — at a high level

| # | Change | Where | Changes numbers? |
|---|---|---|---|
| 1 | **Pin the twin's taxonomy** (category, type, profile, model ID) by twin commit, as Hazard's battery crosswalk is already pinned | data build | no |
| 2 | **One crosswalk per asset type**: twin node → value bucket → each cell's failure unit, plus that unit's state per hazard. Battery storage and substation partly exist (Hazard). Solar, wind, house, warehouse, retail and office are new: drafted here and co-owned with Hazard (G22) | `docs/contracts/` or Hazard, per G22 | no |
| 3 | **Show the twin's 3D model** on the asset page and the cell page, coloured by the four states. Clicking a part opens its curve. The curve page carries a thumbnail of its part (G20) | dashboard | no |
| 4 | **Navigation and library by category**: Power plants, Real estate, Grid. Real estate gets one row per type, not one *Real estate* row whose "parts" are buildings | dashboard | no |
| 5 | **Make the inconsistency visible**: per asset, a table of twin systems × hazards showing which cell curves which part. This is today's "split differently" block, made exact | dashboard | no |
| 6 | **The FAQ**, written once and maintained (§4, G23) | docs + dashboard | no |
| 7 | **Follow-up for the cells, not the dashboard.** The solar and wind cells should come to share one part list, as the battery cells do. That needs a reference value budget per asset, which Hazard has for batteries and substations only. Recorded for the cell owners; the dashboard shows the gap meanwhile | cell packages, Hazard | later, governed |

The cells' artifacts and curves are untouched by 1–6.

## 4 · The FAQ — outline

The FAQ is one page, five short sections, and about fifteen questions. Each answer has at most four sentences,
one example, and one *Read more* link to the governing document. It is written for someone who has never seen
the framework.

```text
 1  THE BASICS          What is a damage curve? · How are assets organised? · At which level does a curve attach?
                        · What is a "cell"?
 2  READING A PAGE      What do the four colours on the picture mean? · Why does the same plant show different parts
                        for different hazards? · Why do some parts have no curve?
 3  HOW SURE WE ARE     What do lab-tested / standard / transferred / our judgment mean? · What is "seen in the field"?
                        · Who has reviewed a curve?
 4  USING THE NUMBERS   What can a curve be used for? · Why is there no yearly loss (EAL) or PML here?
 5  BEHIND THE SCENES   How is a curve built, step by step? · Where do the files live, and how do I propose a change?
```

The FAQ is kept current like a ledger. Each question carries an *updated* date and an owner. The data build
checks every *Read more* link. A question asked twice in review becomes a new entry.

## 5 · Decisions

### G20 · How does the 3D picture get into the dashboard? — **RULED (a), 2026-10-21**

**Options.**
- (a) **Copy the twin's viewer and the models we use into the dashboard, pinned by the twin's commit.** They are
  plain scripts with no build step. The data build checks the pin.
- (b) Link out to the twin app for the picture.
- (c) Pre-rendered static images.

**Recommendation:** (a). It is what the prototype does, it keeps one picture per state, and it costs no
duplicated geometry work.
- *Cost:* about 1 MB of scripts, and WebGL in the reader's browser. Without WebGL the systems list carries
  everything.
- *What would change it:* the twin team preferring one hosted viewer. Then (b), with the same states passed in
  the link.

**Ruling:** (a) — copy the twin's viewer and models into the dashboard, pinned by the twin's commit. *Divy, 2026-10-21, in chat: "yrepp agree on all" — the recommendation is ruled.*

### G21 · Which reference building stands for Commercial? — **RULED (a), 2026-10-21**

**Options.**
- (a) **Office, because our curves are for the office; ask the twin for an office model.** Until it exists, the
  Commercial picture shows the twin's retail building with the note *picture: retail · curves: office*.
- (b) Retail, the twin's profile; the office curves stay without a picture.

**Recommendation:** (a). Hazard's reference profiles and four of the five real-estate cells use the office.
- *Cost:* one model request to the twin.

**Ruling:** (a) — office; ask the twin for an office model, show retail meanwhile with the note. *Divy, 2026-10-21, in chat: "yrepp agree on all" — the recommendation is ruled.*

### G22 · Who owns the new crosswalks? — **RULED (a), 2026-10-21**

**Options.**
- (a) **Draft them here for solar, wind and the three buildings. Hand them to Hazard, which already owns the
  battery and substation ones, and co-own them.** Gaps such as "no reference value budget for solar" are
  flagged in the table.
- (b) Wait for Hazard to build solar and wind reference profiles first.

**Recommendation:** (a). It unblocks the dashboard, and it is the bounded trace Hazard's own asset-structure note
asks for ([`05_physical_asset_structure_and_model_projections.md`](../../../../Hazard_modeling/docs/discussion/_cross_cutting/energy_infrastructure_risk_framework/05_physical_asset_structure_and_model_projections.md),
follow-up AS-F01).

**Ruling:** (a) — draft the crosswalks here; hand them to Hazard and co-own them. *Divy, 2026-10-21, in chat: "yrepp agree on all" — the recommendation is ruled.*

### G23 · Where does the FAQ live? — **RULED (a), 2026-10-21**

**Options.**
- (a) **One Markdown file in this repository, rendered by the dashboard as its FAQ page.** Edits go through a
  pull request like any document.
- (b) Written inside the dashboard code.
- (c) A shared Google Doc.

**Recommendation:** (a). It is reviewable, versioned with the curves it explains, and the same text serves
Prashant, a client walkthrough and a new teammate.

**Ruling:** (a) — one Markdown file in this repository, rendered as the dashboard's FAQ page. *Divy, 2026-10-21, in chat: "yrepp agree on all" — the recommendation is ruled.*

## 6 · How 08 and this note fit together

| 08 gate | State after this note |
|---|---|
| G13 · how assets are grouped | **Answered by the owner on 2026-10-21** (§1): the twin's categories, with real-estate buildings as types and profiles |
| G14 · top bar and library | Follows G13 (§3, item 4). Real estate gets one row per type |
| G15–G18 | Unchanged; still open on PR #7 |
| G19 · build date | Already ruled |

The next build, iteration 3 on the `dashboard` branch, has G13 and G20–G23; it still needs 08's G15–G18.
