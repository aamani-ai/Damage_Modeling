<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-19
updated: 2026-10-20
status: active
scope: Design options for the damage-curve dashboard — information architecture, screen wireframes, one glyph legend, chart rules, creative ideas, the trade-offs Divy decides (G1–G4, G10–G12 and smaller design choices) and, in §7, the annotated plot finish; faces, colours and states are specified in 06.
-->

# 03 — Design options

*Wireframes are sketches for feedback. Counts, tiers, values and IDs come from the catalogue and the cell
files as of 2026-10-19; curve shapes inside the sketches are approximate. Every mark is defined once, in §3.*

## 0 · Design stance

- **A review instrument, not a brochure.** Dense is fine; every number exact; every caveat visible on the
  screen it applies to (the Hazard dashboard's status-chip rule).
- **One idea per altitude.** Library (all cells) → asset (one asset's subsystems) → curve cell (one hazard ×
  asset) → curve (one failure unit). The same marks at every level.
- **The source is always one click away.** No number without its source ID, claim ID or "our judgment".
- **The browser draws, it does not calculate.** Curves arrive as sampled points from Python evaluators
  ([`05`](05_build_brief.md) §3).
- **Never one status chip for three facts:** what exists (live / proposal / reused / gap), how strong the
  evidence is (tiers, "does it happen?"), and who has reviewed what — the catalogue entry and the curve
  release are reviewed separately.
- **The chain is visible.** Every cell page carries the ten-station derivation trail of
  [`07`](07_derivation_chain.md) under the status rail, and its cards follow the reader's order (answer →
  parts → evidence → audit → proof → seams → field and review) while the trail keeps the skill's order.

## 1 · Information architecture

```text
                              ┌──────────────────────────────┐
                              │  LIBRARY  asset × hazard      │  lenses: status · evidence · does it happen?
                              │  (the coverage map, alive)    │          · value covered · review
                              └───────┬──────────────┬────────┘
                         asset name   │              │  cell
                                      ▼              ▼
          ┌─────────────────────────────────┐   ┌──────────────────────────────────────┐
          │ ASSET VIEW  subsystem × hazard   │──►│ CURVE CELL PAGE  hazard × asset       │
          │ "which hazards affect batteries?"│   │ curves · value ribbon · parts · use   │
          │ twin leads · curves · events     │   │ judgment · gaps · checks · sources    │
          └──────────────┬──────────────────┘   └───────────────┬──────────────────────┘
                         │ subsystem × hazard                   │ curve
                         ▼                                      ▼
          ┌─────────────────────────────────┐   ┌──────────────────────────────────────┐
          │ DOES IT HAPPEN?  search log      │◄─►│ CURVE DOSSIER  one failure unit       │
          │ sources · can it see it · hits   │   │ plot · parameters + tiers · versions  │
          └─────────────────────────────────┘   │ known answers · review                │
                                                 └──────────────────────────────────────┘
   side surfaces:  REVIEW QUEUE (people + weekly agents)   ·   ONE-PAGER EXPORT (print / PDF)
   in from outside:  Hazard dashboard grid-cell dossier · model-gpr "Physical damage by hazard" row · Digital Twin node
```

## 2 · Screens

### 2.1 Library — the coverage map, alive

```text
┌─ Damage-curve library ──────────────────────────────────────────────────────────────────── ◑  ⓘ ─┐
│ 13 live · 5 proposals · 3 reused · 4 gaps            built from catalogue d8f022a · 2026-10-19     │
│ catalogue entries: 25 of 25 read by an agent only · curve releases: 8 of 13 live carry a review    │
│ state of its own (e.g. reviewed_owner_approved_screening_release) — shown apart from the entry     │
│ Lens  [Status]  Evidence  Does it happen?  Value covered  Review             ⌕ curve, source, ID  │
├───────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬────────────┤
│               │ Hail        │ Flood       │ Hurricane   │ Convective  │ Wildfire    │ outside    │
│               │             │             │ wind        │ wind        │             │ the five ▸ │
├───────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼────────────┤
│ Solar farm    │ ■◔ T2/T2    │ ■◔ T3–4/T3–4│ ■◔ T3–4/T4  │ ■◔ T4/T4    │ ■◔ T4/T2    │  ?  ?  ?   │
│ Wind farm     │ ┈ gap       │ ■◔ T3/T3    │ ■◔ T3/T4    │ ■◔ T4/T3–4  │ ■◔ T4/T4    │  ?  ?  ?   │
│ Real estate   │ ▢◔ T3–4/T3–4│ ▢ T2/T2     │ ▢ T2/T2     │ ▢ T3/T4     │ ▢ T3/T4     │  ?  ?  ?   │
│ Substation    │ ┈ gap       │ ■ T3/T4     │ ▨ T4/T4     │ ▨ T4/T4     │ ▨◔ T4/T4    │  ?  ?  ?   │
│ Battery stor. │ ┈ gap       │ ■◔ T3–4/T3–4│ ■◔ T4/T4    │ ┈ gap       │ ■◔ T4/T4    │  ?  ?  ?   │
└───────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴────────────┘
  marks: §3 legend      asset name → asset view      cell → curve cell page
  "outside the five" = heat · icing · lightning — no damage cell today; twin leads and any field reports
```

**Lenses** recolour the same grid without moving it: *Evidence* shades by the weaker of the two tiers;
*Does it happen?* swaps the tier text for the event state; *Value covered* shows the share of reference value
with a curve; *Review* shows the entry read / reviewed / stale since review, and the curve release review.

> **A tension the build must resolve.** In the catalogue every live solar, wind and battery cell is
> *partial* (◔). model-gpr's owner direction of 2026-10-04 says hail × solar modelled on PV modules only must
> not by itself raise a "partial" warning (`docs/principles/analytical_ui.md`). They differ on what "partial"
> means: *a part deliberately left out* versus *a part with no curve yet*. No catalogue or artifact field
> separates the two today (failure-unit `treatment` is free text, and several values say "no curve, not
> zero"), so showing them apart needs a new field — see §4 and gate G5 in the README.

### 2.2 Asset view — "which hazards affect batteries?"

```text
┌─ Battery storage ─ reference plant 100 MW / 400 MWh LFP · 80 enclosures · 20 PCS · $109.8M ─────────── ⓘ ─┐
│ Which hazards affect batteries, and how sure are we?        lens [All]  Curves  Does it happen?  Twin     │
├──────────────────────────────┬─────────┬─────────┬─────────┬─────────┬─────────╥─────────┬───────┬────────┤
│ subsystem             value  │ Hail    │ Flood   │Hurricane│Convect. │Wildfire ║ Heat    │ Icing │Lightng.│
├──────────────────────────────┼─────────┼─────────┼─────────┼─────────┼─────────╫─────────┼───────┼────────┤
│ ▸ Battery enclosures $84.0M  │ L ┈   ? │ H ■T4◔ ?│ L ■T4 ? │ L ┈   ? │ M ■T4 ? ║ H perf  │ L  —  │ M  —  ?│
│   ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 77%       │         │         │         │         │         ║         │       │        │
│ ▸ PCS                $10.4M  │ – ┈   ? │ M ■T3 ? │ – ■T4 ? │ – ┈   ? │ – ■T4 ? ║ H perf  │ –  —  │ M  —  ?│
│   ▇▇ 9%                      │         │         │         │         │         ║         │       │        │
│ ▸ MV, collection,    $13.2M  │ – ┈   ? │ M ✕   ? │ – ✕   ? │ – ┈   ? │ – ✕   ? ║ M perf  │ –  —  │ M  —  ?│
│   controls ▇▇▇ 12%           │         │         │         │         │         ║         │       │        │
│ ▸ Civil and fieldwork $2.2M  │ – ┈   ? │ M ✕   ? │ – ✕   ? │ – ┈   ? │ M ✕   ? ║   —     │ –  —  │ –  —   │
└──────────────────────────────┴─────────┴─────────┴─────────┴─────────┴─────────╨─────────┴───────┴────────┘
 cell = twin lead · curve · does it happen?      (marks: §3 legend)
 ▸ expands to the Digital Twin nodes in that bucket (Hazard's twin_crosswalk.csv), each with its lead and the
   twin's reason, e.g. modules · flood H · "Submersion shorts modules"
```

What this screen says today: flood, hurricane wind and wildfire have curves, all from transferred or policy
evidence (T3–T4); hail and convective wind have no curve and only *Low* twin leads; heat is the twin's strongest
lead but works through performance (ageing, derating), not physical damage; lightning has *Medium* leads on the
electronics and no hazard cell at all; **no row has been searched for field reports yet** — every event mark is
`?`. Detail and caveats in [`04`](04_does_it_happen_evidence.md) §6.

### 2.3 Curve cell page — Flood × Battery storage

```text
┌─ ← Battery storage    Flood × Battery storage ──────────────────────────────────────────────── ⓘ  ⤓ ─┐
│ [LIVE · screening]  model v1.0 · docs r1   BESS_FLOOD_INUNDATION_SCREENING_V1   sha c9bc91… ✓ pinned  │
│ evidence: shape T3–T4 · cost T3–T4 · does it happen? ? not searched                                   │
│ review: catalogue entry agent-read 10-19 · curve release: no review field in this artifact            │
├──────────────────────────────────────────────────────┬──────────────────────────────────────────────┤
│ CURVES  damage ratio vs water depth above grade (m)   │ HOW TO USE                                    │
│ 1.0 ┤        ┌────────────────────── enclosure (T4)   │ share of: hardware value of the same unit     │
│     │        │      ┌─────────────── PCS, fresh (T3)  │ single event ✓   scenario $ ✓                 │
│ 0.5 ┤        │    ╱                                   │ yearly loss: Hazard computes, with caps       │
│     │        │  ╱                                     │ needs depth and water type (fresh | saline)   │
│ 0.0 ┼────────┴╱────────────────────────────────       │ withheld: unknown water type, missing depth   │
│     0      0.3   0.6   0.9        1.5    2.0   2.3 m  │                                               │
│ water [fresh] saline    ○ known answers   ┆ events    │ OUT OF SCOPE  collector station · internal     │
│                                                       │ failures · business interruption              │
├──────────────────────────────────────────────────────┴──────────────────────────────────────────────┤
│ VALUE  $82.5M of $109.8M has a flood curve                                                           │
│ ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇░░░░░░░░░░░░░░░  covered 75% · no curve 25%:           │
│ racks and fire suppression $11.89M · electrical balance $13.2M · civil $1.6M · fieldwork $0.6M       │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PARTS                 curves                         shape  cost  does it happen?   note              │
│ ▸ Battery enclosure   BESS_ACTIVE_CONTACT_STATE      T4     T4    ? not searched    key assumption    │
│ ▸ Separate PCS        BESS_PCS_INUNDATION_PROXY +1   T3     T3    ? not searched    reused from Flood │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ OUR JUDGMENT  4 ▸   MISSING MECHANISMS wave impact · scour · debris   OPEN ITEMS 3 ▸                  │
│ OUTSIDE CHECKS none yet       KEY SOURCES BF-S01 · S02 · S06 · S12 · S13 ▸       FILES write-up ▸ …     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Curve dossier — one failure unit

```text
┌─ ← Flood × Battery storage   BESS_PCS_INUNDATION_PROXY · Separate PCS · freshwater ── shape T3 · cost T3 ─┐
├───────────────────────────────────────────────────────────────┬──────────────────────────────────────────┤
│ DR                                                             │ WHAT SETS THIS CURVE                      │
│ 1.0 ┤               ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┅┅┅┅┅┅┅┅┅    │ form   piecewise linear                   │
│     │             ╱    source knots to 2.3 m   │ T4 beyond     │ knots  Flood × Solar inverter curve, read │
│ 0.5 ┤           ●      ◇ source points  ○ known answers        │        on depth above the 0.30 m entry    │
│     │         ╱                                                │        (T3 · BF-S06)                      │
│ 0.0 ┼━━━━━━━━●                                                  │ entry  0.30 m above grade — owner policy,  │
│     0       0.3     0.6     0.9      1.5      2.0  2.3  2.6 m  │        not measured (T4)                  │
│     ┆   ┆ ┆        events rug — field reports at their depth    │ beyond the last knot: full replacement    │
│     ┄┄┄ earlier version (ghost)       [linear | log x]          │        continued (T4)                     │
├───────────────────────────────────────────────────────────────┼──────────────────────────────────────────┤
│ DOES IT HAPPEN?  ? not searched   [open the search log ▸]      │ REVIEW                                    │
│ leads: Digital Twin PCS flood M ("Skid height"); flood-then-    │ entry: agent-read 2026-10-19              │
│ fire reports at solar PCS in Japan (to verify)                  │ release: —     how to sign off ▸          │
├───────────────────────────────────────────────────────────────┴──────────────────────────────────────────┤
│ VERSIONS  model v1.0 · docs r1 (current)  ▸ compare with …     WHAT WE CHANGED FROM THE SOURCE  2 ▸        │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

The PCS curve reaches full replacement at 0.9 m above grade (0.6 m above the entry, from the reused knots);
the knots run to 2.0 m above the entry (2.3 m above grade), and only the continuation beyond that is our
judgment. "How to sign off" opens the instruction (edit the entry, open a pull request); the dashboard shows
review state, it does not own it.

### 2.5 "Does it happen?" — the search log for one asset × hazard

```text
┌─ Does it happen? — Hail × Battery storage ─────────────────────────── state: ? not searched ──────────┐
│ Has hail physically damaged a battery subsystem in the field?  twin leads: shell L · chiller L · vent L │
│ buckets: battery enclosures ? · PCS ? · MV, collection, controls ? · civil and fieldwork ?            │
├────────────────────────────┬──────────────┬─────────┬────────────┬───────┬──────────────────────────┤
│ source                     │ can it see   │ public? │ searched   │ hits  │ note                      │
│                            │ hail damage? │         │            │       │                           │
├────────────────────────────┼──────────────┼─────────┼────────────┼───────┼──────────────────────────┤
│ EPRI BESS incident DB      │ no — excludes│ yes     │ —          │ n/a   │ only internal failures    │
│                            │ outside cause│         │            │       │                           │
│ NOAA Storm Events          │ yes          │ yes     │ —          │       │ narrative keyword search  │
│ NITE accident reports (JP) │ yes          │ yes     │ —          │       │ statutory, CSV            │
│ Insurer / broker notes     │ yes          │ partly  │ —          │       │ gated summaries           │
│ News, OEM and site notices │ yes          │ yes     │ —          │       │                           │
├────────────────────────────┴──────────────┴─────────┴────────────┴───────┴──────────────────────────┤
│ rule  ✓ one or more direct reports · ~ adjacent · ∅ none in at least two sources that can see it      │
│ suggested next  search first (§5, idea 2)                                                            │
└──────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.6 Review queue — for people and the weekly agents

```text
┌─ Review queue ───────────────────────────────────────────── asset ▾  owner ▾  only mine ☐ ─────────┐
│ 25 catalogue entries: 25 agent-read, 0 read by their owner · 0 stale since read                    │
│ 11 of 21 cells and bindings have no outside check · 51 of 71 part rows carry a T4 shape or cost    │
├─────────────────────────────┬──────────┬───────────────┬───────────────────────────┬──────────────┤
│ entry                       │ status   │ entry read    │ curve release review       │ flags        │
│ convective_wind_real_estate │ proposal │ agent · 10-19 │ (proposal)                 │ Jung A doubt │
│ flood_bess                  │ live     │ agent · 10-19 │ — no field                 │ 25% no curve │
│ tropical_cyclone_wind_bess  │ live     │ agent · 10-19 │ same author, independent   │ T4 · T4      │
│                             │          │               │ numerical methods          │              │
│ hail_bess                   │ gap      │ agent · 10-19 │ —                          │ ? not searched│
│ …                           │          │               │                            │              │
├─────────────────────────────┴──────────┴───────────────┴────────────────────────────┴──────────────┤
│ agent notes (report only): one line per finding, with the file and line it points at  ⤓ JSON        │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.7 One-pager — an export of the same entry

```text
┌──────────────────────────────── A4 / Letter, light theme ───────────────────────────────┐
│ Flood × Battery storage                         InfraSure damage-curve library          │
│ model v1.0 · docs r1 · screening · reviewed by — on —                                   │
│ ┌──────────────────────────────┐  What it is: damage ratio of each battery enclosure    │
│ │   curves (as on the page)     │  and PCS for a stated water depth and water type.      │
│ └──────────────────────────────┘  How it was built: … (method, one line)                 │
│ Evidence  shape T3–T4 · cost T3–T4 · field reports: …                                   │
│ What it covers ▇▇▇▇▇▇▇▇▇░░  75% of reference value                                       │
│ Main references (3–5) · Our judgment (T4 items) · Limits (missing mechanisms, scope)    │
│ footer: source commit · file SHA · "detail on request" (the NDA line, G8)               │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

## 3 · The marks — one legend for every screen

| Fact | Mark | States |
|---|---|---|
| What exists | Fill of the square | ■ live · ▢ proposal · ▨ reused binding · ┈ gap |
| Part of the value has no curve (catalogue "partial") | ◔ after the square or tier | present or absent |
| Curve evidence | `T2/T3` = shape / cost | T1–T4; a range when parts differ (`T3–4`) |
| Does it happen? | Last mark in the cell | ✓ found · ~ adjacent · ∅ none after a logged search · ? not searched |
| Twin lead (asset view) | First letter | H · M · L · – (no lead) |
| In the asset's value, no curve in this cell (asset view) | ✕ | — |
| No damage cell for this hazard (asset view) | `—`, or `perf` when the twin's lead works through performance | — |

None of these depends on colour. Colour, where used, repeats the mark (state pairs from the token set).

### Examples

| Mark | Reads as |
|---|---|
| `■ T2/T2 ✓` | Live, all value covered, shape and cost from public lab or standards, field reports found |
| `■◔ T4/T4 ?` | Live, some value without a curve, both tiers our judgment, nobody has looked for field reports |
| `┈ gap ∅` | No curve, and a logged search in sources that could see it found nothing → park, with a revisit trigger |
| `L ┈ ?` (asset view) | Twin rates exposure *Low*, no curve, not searched → search first, cheaply |

## 4 · How curves are drawn

| Rule | Why |
|---|---|
| One plot = one hazard axis, in that cell's native unit (depth m, MESH mm, 3-s gust, FSim class, pressure ratio) | Never normalise intensity across hazards; the units do not mean the same thing |
| Steps drawn as steps; ordinal inputs (FSim class 1–6) and binary states as categories, not a line | A binary entry policy drawn as a ramp would claim knowledge we do not have |
| A band only when the artifact carries spread | All 13 live artifacts declare `curve_intrinsic_spread: not_carried` for their curves. Hurricane wind × Solar also declares `nonprobabilistic_epistemic_envelope` — draw it as an envelope labelled "not a probability", the one case the rule must handle |
| Scenario sets (e.g. `capacity_scenarios` lower / central / upper in two hurricane artifacts) drawn as separate labelled lines, never averaged | They are unweighted alternatives |
| Known answers as hollow dots, digitised source points as diamonds | Shows the curve passing its own tests and where its evidence sits |
| Linear / log x and zoom change the view only | *"change resolution, not meaning"* (model-gpr `docs/principles/ui/time_series_change_resolution_not_meaning.md`) |
| Line style as well as colour per curve (solid, dashed, dotted) | Overlays must survive greyscale print and colour blindness |
| The value ribbon separates: covered by a curve · deliberately left out · no curve yet | Separates a modelling choice from a gap (§2.1). The middle state needs a new field; until it exists, show two states and say so |

## 5 · Creative ideas, beyond the basics

| # | Idea | What it gives | Cost |
|---|---|---|---|
| 1 | **Events rug** — each field report as a tick under the curve, at the intensity it happened | You see at once whether the evidence sits where the curve rises | Needs intensity on each report; often missing |
| 2 | **Search-first default** on gap rows — "search for field reports" is the first action offered | Turns Divy's 21:49 idea into the normal workflow | Low |
| 3 | **Twin thumbnail per subsystem** from `<subsystem-viewer>.thumbnails()`, linking to the twin node | A picture of the thing that breaks, and one ID across twin, curve and value | Medium: the viewer needs three.js r147 and load order |
| 4 | **Connection lighting** — select a source and every curve citing it lights up; select a curve and the Hazard layers and model-gpr rows using it light up | Shows the reach of a weak source or a curve change | Needs a citation index, built offline |
| 5 | **Version ghost** — the previous version as a dashed line, with a diff of parameters | Review a change in seconds | Low once samples exist per version |
| 6 | **"What we changed from the source"** list per curve (after OS-Climate physrisk) | Makes every transformation reviewable | Low; content exists in derivation files |
| 7 | **Reference-asset curve** — share of asset value lost vs intensity, every unit at the same intensity | The intuition clients ask for | Easy to misread: label it an illustration; compute offline |
| 8 | **"Outside the five" columns** (heat, icing, lightning) | Field evidence can earn a hazard its first cell, or confirm it needs none. The winter-storm call (learning-log ledger `C-172`) is the template: 43 snow and ice accidents at PV systems in Japan in 2018–21 (NITE, from secondary web reads), in heavy-snow regions and, Sarasi noted, on rooftop systems — adjacent for utility-scale plants, not direct | Low |
| 9 | **Walkthrough mode** for a client session (as in the *Plymouth Walkthrough* artifact's play control) | The 20–50-minute client deep dive, guided | Later; after the one-pager |

## 6 · Trade-offs for Divy

| Choice | Options | Lean | Why |
|---|---|---|---|
| **G1 · page unit** | A: page per cell, rows per subsystem · B: page per subsystem curve · C: both, as levels | **C** | The cell is the project unit and holds the value ribbon; the failure unit is the curve atom and holds the evidence. Prashant's *"library of subsystems"* is served by the asset view plus the dossier |
| **G2 · home** | A: own app in `damage_modeling/dashboard/` · B: a section of the Hazard dashboard · C: a Claude artifact | **A**, with an artifact snapshot for quick sharing | Versions with the files it renders; the same stack keeps a later merge into B cheap; an artifact alone drifts from the repository |
| **G3 · look** | A: Hazard dashboard tokens (zinc, Geist) · B: product tokens (model-gpr / RenewablesInfo: oklch neutrals, Inter, brand green) | **A** | Same audience and job as the Hazard dashboard, and reviewers will move between the two. B fits better if this later joins the client product |
| **G4 · first slice** | A: battery storage, all five hazards · B: hail × solar, the strongest cell | **A** | Answers a live question and tests the new evidence field. Caveat: two battery cells have no evaluator yet ([`05`](05_build_brief.md) §3) |
| Asset-view rows | A: the value buckets, twin nodes as children · B: twin nodes as rows | **A** | Curves and value attach to the buckets; Hazard's crosswalk already maps the twin's BESS nodes onto them |
| Tier display | A: text `T2/T3` · B: pips / bars | **A** | The audience reads tiers; pips need a legend and lose the shape / cost split |
| Charts | A: ECharts through the Hazard wrapper · B: Recharts (model-gpr) | **A** | Steps, categorical axes, mark points and log axes are routine there; the theme wrapper exists |
| Data path | A: static JSON built from the repository · B: a server API | **A** | 25 entries and about a hundred curves; no server to run or secure |
| Partial marking | A: catalogue "partial" as-is · B: split "no curve yet" from "deliberately left out" | **B**, once a field exists | Matches model-gpr's 10-04 direction and keeps the warning meaningful |
| **G10 · look sign-off** | A: done when checks pass · B: done when the owner accepts the slice's screenshots · C: weekly design reviews | **B** | Argued in [`06`](06_look_and_usability.md) §6 |
| **G11 · where the look principle lives** | A: shared file in `Hazard_modeling/docs/principles/` · B: a `docs/principles/` here · C: model-gpr `ui/` | **A** | [`06`](06_look_and_usability.md) §6 |
| **G12 · plain language** | A: one plain sentence per screen · B: a plain-mode switch · C: nothing plain | **A** | [`06`](06_look_and_usability.md) §6 |

## 7 · Finish — the sketches at real size

The wireframes above are layouts. How a tile, the status rail, a plot and the dossier are finished — faces,
sizes, colours, states, motion, widths — is specified once in [`06`](06_look_and_usability.md) §2–§3 so the
builder has one source. The plot, annotated, because it is the element the house has never drawn:

```text
 DR
1.0 ┤          ●━━━━━━━━━━━━━━━━━━━━━━━━┅┅┅┅┅┅┅┅┅┅┅   PCS, fresh (T3)   ← label at the right end, not only in a legend
    │        ╱     ◇  ◇                                                ← ◇ hollow = digitised source point
0.5 ┤      ╱   ○                                                       ← ○ hollow = known answer, reproduced by the build
    │    ╱                                                             ← solid 1.75 px = the curve · dotted = beyond the last knot, "our judgment (T4)"
0.0 ┼━━━●  ░░░░░░░░░ withheld: unknown water type ░░░░░░░░░             ← a withheld domain is a gap with sparse hatch, never a zero
    0     0.3    0.6    0.9         1.5        2.0    2.3    2.6 m    ← unit in the axis title · numbers in Geist Mono
    ┆  ┆     ┆                                                         ← events rug: one tick per field report at its intensity
    ┄┄┄┄┄ previous version (ghost, 1 px dashed, muted)    [linear | log x]   legend: curve · source points · known answers · events · ghost
```

Hairline grid at 8 % of the foreground, no plot box, the plot ≥ 60 % of the content width at 1440, every
series with a line style as well as a colour, and nothing drawn that the artifact does not carry.
