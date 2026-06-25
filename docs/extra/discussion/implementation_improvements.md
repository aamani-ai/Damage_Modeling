# Implementation improvements — surfaced during the Drive-doc review

The **implementation-side** counterpart to [`drive_docs_review/`](drive_docs_review/README.md). Those are
wording/structure edits to the Drive foundation docs; **these are changes to the built artifacts** — cell
dossiers/specs, the `damage_code()` contract + global-method standards, and the **Hazard_modeling notebooks
(M2/M3)** that consume the curves. Several are cross-repo. A few are *gated* by a doc-side decision (noted).

> **What earns a place here:** an item belongs only if a **built artifact must change** — a cell
> dossier/spec, a global-method standard, a notebook (M2/M3), or the `damage_code()` contract — *and the
> artifact is verified wrong*, not merely contradicted by a doc. When a Drive doc disagrees with a
> **correct** implementation, the fix is the **doc** (→ [`drive_docs_review/`](drive_docs_review/README.md)),
> not here.

> Each item below is **What** (the concrete change) · **Why it matters** (the risk if left) · **Where** (the
> evidence/files) · **Fix** (the move). Surfaced + adversarially verified by workflows `w4xotw60h`,
> `wqq12t8kc`, `w4mfrfok0` + direct reads.

## v2.5 status — most of this is now implemented

The owner generated **`DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE`** from this backlog
(V2.2 retired). Per its `IMPLEMENTATION_HARDENING_SUMMARY_v2_5.md`:

| Item | v2.5 status |
|---|---|
| **C** capability declaration | ✅ **done** — standard 21 + `schemas/capability_declaration.schema.json` + cell JSON |
| **D** cap-binding preflight | ✅ **policy + helper** — standard 21 (fail-closed) + `runtime_helpers/cap_binding_preflight.py`; the *run* is downstream (fail-closed until a distribution + value basis exist) |
| **E** distribution-ready emit | ✅ **done** — `schemas/damage_emit.schema.json` + standard 21 §6 (scalar / discrete / parametric / state-ensemble) |
| **F** field names | ✅ **resolved** — canonicalized to the **cell** names `iec_wind_class` / `enclosure_rating` (+ aliases); standard 07 updated *(note: opposite of the original suggestion — chose cell names, not standard-07's)* |
| **G** per-parameter tier table | ✅ **done** — tier/source/role in cell JSON + dossier addenda |
| **I** Excel → JSON | ✅ **done** — `*__curve_artifact.json` per cell + standard 20 |
| **M** derivation rationale | ✅ **done** — rationale addenda + serialized blocks incl. adjustment form/source/reasoning |
| **N** param-nature grouping | ✅ **done** — `param_role` / `parameter_nature` in JSON |
| **A** hail two curves | ◐ **library done** (hail JSON canonical; legacy blend blocked) — **Hazard_modeling M3 notebook patch still pending (external)** |
| **B** wind height bridge | ◐ **contract + helper done** (`runtime_helpers/height_bridge.py` + handoff) — **Hazard_modeling M2 notebook patch still pending (external)** |

**No curve parameters changed** — all cells remain semantic model **v1.0**. **The live remaining engineering
work is the two external `Hazard_modeling` notebook patches (A, B)** (handoff specs under
`…/00_global_method/hazard_modeling_handoff/`); everything else is in the library and now just needs the Drive
docs updated to *describe* it. The detailed entries below remain as the **record of why** each change was made.

---

## Backlog at a glance

| # | Item | Priority | Repo(s) | Status |
|---|---|---|---|---|
| **A** | Hail cell runs a different curve than its own dossier | **HIGH** | both | open |
| **B** | Wind M2 feeds a 10 m gust into a hub-height curve (unbuilt bridge) | **HIGH** | Hazard_modeling | open |
| **C** | Capability declaration designed but not wired into any cell | MED-HIGH | damage_modeling | open |
| **D** | No cap-binding preflight — scalar EAL may be silently biased | MED | damage_modeling | open |
| **E** | Confirm the emit seam is distribution-ready (verify-then-maybe) | MED | both | open |
| **F** | Field names diverge between standard 07 and the cells | LOW-MED | damage_modeling | open |
| **G** | Cells lack the per-parameter tier table | MED | damage_modeling | gated by X1 |
| **I** | Excel → machine-readable JSON curve artifact | LOW | damage_modeling | roadmapped |
| **M** | No first-class "derivation rationale" (incl. adjustment form+reasoning) | MED | damage_modeling | open |
| **N** | Source-to-parameter map not grouped by parameter nature | LOW (optional) | damage_modeling | doc-led |
| ~~H/J/K/L~~ | re-triaged out → doc-side (see end) | — | — | not impl |

---

## A · Hail cell runs a different curve than its own dossier [HIGH, cross-repo]
**What.** The hail × solar M3 notebook computes loss from a **capex-weighted subsystem blend** — `PV_ARRAY` logistic (L=0.95, k=0.1064, x₀=59.2) + `MOUNTING` (L=0.40, k=0.10, x₀=88.0), asset DR capped ≈0.344 — vendored from the legacy `infrasure-damage-curves`. The **intended** source, the `damage_modeling` dossier v1.3 (a *failure-unit* `P_break` logistic, archetype D50 ≈ 41/53/64 mm, PVEL/Kiwa-anchored), is **not wired in**.
**Why it matters.** One cell has two curves that disagree on **grain** (asset-blend vs failure-unit) *and* **numbers**, and the *less*-curated one is the one producing the shipped EAL. So the headline number doesn't come from the evidence-curated dossier — it comes from a vendored blend nobody is maintaining. It also breaks the spin-out contract (M3 is supposed to *consume* the published `damage_code()`, not embed a curve).
**Where.** `Hazard_modeling/Notebooks/hail/solar/m3_damage/01_damage.py:94,119` ← `Hazard_modeling/data/hail/damage_curves/hail_solar_asset_capex_weighted.json`; vs `damage_modeling/.../hail_solar/current/hail_solar_curve_derivation_dossier_v1_3.md`.
**Fix.** Confirm the dossier is canonical, reconcile the numbers, wire the dossier curve into M3 via the versioned contract; until then label the notebook's curve a placeholder so its EAL isn't read as the curated number. **Done when:** one curve per cell, sourced from the dossier.

## B · Wind M2 feeds a 10 m gust into a hub-height curve [HIGH, Hazard_modeling]
**What.** The damage curve's x-axis is a **hub-height** design-normalized gust ratio `r = V_3s_hub / Ve50`, but M2 passes the catalog's **10 m, Exposure-C** gust straight through, unconverted. The 10 m→hub terrain/height bridge is *declared* (`layer0`, assumption `AWN-15`, "assigned to M2") but **absent from the M2 code**.
**Why it matters.** Wind shear makes the hub-height gust materially higher than the 10 m gust, so feeding the 10 m value evaluates the curve at the **wrong (lower) intensity → under-states DR → under-states EAL/PML**. It's silent: the code runs fine, it just reads the wrong node on the chain — basis risk *inside the pipeline* (the "one chain, many products" node-gap, left unmodeled by accident).
**Where.** `Hazard_modeling/Notebooks/convective_wind/wind_farm/m2_coupling/` (no height/terrain term — verified); declared at `layer0` / `AWN-15`.
**Fix.** Implement the 10 m→hub adjustment in M2 (power-law / log-law profile), **or**, if v1 deliberately treats them equal, say so explicitly and quantify the bias. **Done when:** M2 converts to hub height before M3, or the assumption is documented with a bias estimate.

## C · Capability declaration designed but not wired into any cell [MED-HIGH, damage_modeling]
**What.** `metrics_supportable` / `cap_binding` / `spread_carried` live only as contract *design* in `SCOPE_AND_STORY`; **no cell metadata spec populates them** (grep = 0 in `01_cells/*/current`).
**Why it matters.** "Withhold-not-caveat" — the project's core honesty mechanism — is currently enforced only by *convention* ("the damage code emits DR only"), not by a machine-checkable field. A downstream consumer can't programmatically learn which metrics are honest, and the tail-honesty guarantee isn't *enforceable*. The whole emit/tail-honesty discipline is designed but not operative.
**Where.** `SCOPE_AND_STORY` §4/§6/§10; standard 09; absent in every cell metadata spec.
**Fix.** Add the capability block (canonical **X2** schema) to each cell's metadata spec, populated from its evidence; make it required in standard 09; enforce the withheld set at the contract boundary. **Done when:** each cell ships a populated declaration M3 can read.

## D · No cap-binding preflight — scalar EAL may be silently biased [MED, damage_modeling]
**What.** No cell runs the A22-style "does the saturation cap rarely bind?" known-answer check (capped-MC-mean ≈ uncapped-analytic EAL). Only a *passive* `cap_sensitive` flag exists in the hail spec.
**Why it matters.** A scalar mean DR gives a **correct EAL only while the cap rarely binds** (foundations 05 §7). If the cap bites inside the spread (hail stowed cap 0.90; wind per-unit caps 0.85/0.65), Jensen's inequality makes the scalar **overstate EAL** — so the *headline* number could be biased with nobody noticing. The check is the line between "scalar EAL is honest here" (verified) and "we assumed it."
**Where.** foundations 05 §7 (the open item); hail spec `metadata_flags: cap_sensitive` (flag only, no executed check).
**Fix.** Add the cap-binding check per cell to standard 10's validation checklist; a cell that fails must climb to a mean+spread emit *even for EAL*. **Done when:** each cell records a pass/fail and failing cells are flagged for a spread.

## E · Confirm the emit seam is distribution-ready [MED, cross-repo — verify-then-maybe]
**What.** Verify the `damage_code()` output schema **+** the M3→M4 parquet can carry scalar *or* spread *or* states — not scalar-only.
**Why it matters.** Foundations 05 (Q-a) says build the distribution-capable seam **up front** as cheap insurance. Flood (state table) and wind (fragility) are rung-3-shaped at the source but emit collapsed scalars today; if the seam is scalar-only, the **first tail metric or fragility cell forces a re-plumb of M4** — exactly the rework the up-front interface is meant to prevent. (Listed as *verify-then-maybe*: it only becomes a change if the seam is actually scalar-only.)
**Where.** standard 09 output schema; the M3→M4 parquet schema (Hazard_modeling).
**Fix.** Inspect both; if scalar-only, widen to a distribution-capable object (parametric tag + params, or discretized bins) while keeping v1 *content* scalar. **Done when:** the seam provably carries a non-scalar emit without a schema change.

## F · Field names diverge between standard 07 and the cells [LOW-MED, damage_modeling — verify-then-maybe]
**What.** Canonical standard 07 names ≠ the cell specs: `turbine_class` (07) vs `iec_wind_class` (wind cell); `equipment_ip_or_nema_rating` (07) vs `enclosure_rating` (flood cell).
**Why it matters.** Standard 07 is meant to be the canonical field vocabulary the cells *implement*; divergent names mean a consumer reading the standard can't bind to the cell, and there's no single source of truth for the field contract. Small, but it's contract integrity.
**Where.** standard 07 §5/§6 vs `wind_tornado_wind` / `flood_solar` metadata specs.
**Fix.** Pick canonical names (default to standard 07's), reconcile the cell specs (or update the standard) so they match. **Done when:** standard 07 and all cell specs use identical field strings.

## G · Cells lack the per-parameter tier table [MED, damage_modeling — gated by doc X1]
**What.** Evidence Reference §4 mandates a per-parameter `{value, tier, source}` table per cell; the cells carry evidence *narratives* but not that exact tiered schema, and use their own confidence vocabulary.
**Why it matters.** The tier×claim matrix (which gates honest metrics) needs each parameter's tier; without the per-parameter table in the artifact, the capability declaration (C) can't be *derived or audited*, and "the weakest tier the curve depends on" can't be computed. It's the data backbone of the honesty discipline.
**Where.** Evidence Reference §4 (the schema); cell dossiers (narrative only).
**Fix.** After **X1** settles the canonical tiering, add the §4 table to each cell and map the cells' confidence labels to T1–T4. **Done when:** each cell carries a per-parameter tier table the capability declaration is derived from.

## I · Excel → machine-readable JSON curve artifact [LOW, roadmapped]
**What.** Cells carry `.xlsx` records; `SCOPE_AND_STORY` §6/§9 wants a machine-readable **JSON** canonical artifact (a serialization of the assembled-curve-record schema), with Excel demoted to a derivation view.
**Why it matters.** A spreadsheet isn't a clean machine contract — M3 binds to a callable + params; serving params from `.xlsx` is fragile, hard to diff, and hard to version. JSON makes the curve a real, diffable, version-pinnable artifact (the old repo's `master_curve_index.json` is the reference). Already migration **step 5** — listed for completeness.
**Where.** `SCOPE_AND_STORY` §6/§9; cells' `damage_curve_records_*.xlsx`.
**Fix.** Serialize the assembled-curve-record schema to JSON per cell; demote Excel to a view. **Done when:** each cell has a JSON params artifact M3 reads.

## M · No first-class "derivation rationale" [MED, damage_modeling]
**What.** Add a named, qualitative **"derivation rationale / combination narrative"** per failure-unit — and (from #10) extend it to **adjustments** (the form + source + reasoning of each selector/conditioner).
**Why it matters.** The cells handle ready-made curves *correctly* in practice (PVEL/Kiwa lab data → re-derived anchors; IEC 61215 → a single boundary anchor; CLIMADA/Schmid building curve → T3 proxy with a −10–15 mm x₀ shift; NIST → method adopted, not numbers). But the **qualitative "why"** — which sources were in play, which was chosen as the spine, what was demoted/rejected and *why*, and the resulting tier mix — is **scattered prose, not a named artifact**. The combination is quantitative but non-trivial and resource-dependent; without the narrative a reviewer can't reconstruct or challenge the curation, and source conflicts (Evidence-Ref Rule 4) aren't *visibly* resolved. For **adjustments**: the hail cell already has the provenance fields (`adjustment_type` + `adjustment_source_id = E_VDE_HAIL_STOW`), so the gap is (a) the *form-reasoning*, and (b) **verifying flood/wind carry the same fields** (the grep found them only in hail).
**Where.** Evidence Ref §6 (tier-mix narrative — required, not implemented); overlaps **C** (capability) and **G** (tier table); hail metadata spec (adjustment fields present); flood/wind (to verify).
**Fix.** Add a "derivation rationale" dossier section + workbook narration + a validation check; cover adjustment form+reasoning; close the flood/wind adjustment-provenance consistency gap. **Done when:** each cell's dossier names sources, the chosen spine, conflicts-resolved, and the tier mix — and adjustments carry form+source+reasoning.
**Doc-side counterpart:** `build_methodology_review.md` Q1 + #10.

## N · Source-to-parameter map not grouped by parameter nature [LOW / optional, doc-led]
**What.** Group the cells' source-to-parameter map by parameter **nature**: curve-fit / shape (`k, x₀` — logistic-specific) · boundary / form-agnostic (`threshold`, cap `L` — reusable across forms) · adjustments (`cond_*`). A hard-line separation or a `param_role` tag.
**Why it matters.** A flat table reads as one homogeneous set for a single curve, hiding that some params *fit* this curve while others are *boundary constraints reusable across curve forms* — which matters for reuse and for understanding what's transferable to the next cell. **Useful, not load-bearing** (owner's call).
**Where.** Evidence Reference §4 schema (the doc home); cells' evidence map + dossier table (verified flat: hail dossier §253, metadata spec lines 107–111).
**Fix.** Add a `param_role` grouping/column to the schema (Evidence Ref §4) then to the cells' map/table. **Done when:** the map visibly separates the three natures.

---

## Re-triaged OUT — doc-side, not implementation changes

These read like impl items in a first draft, but the implementation is **already correct**; the fix is a doc:
- **J — coverage-role "modifier" mismatch** → standard 14 (canonical) is right; terminology §3 + the build_methodology GRAIN table are wrong → cross-doc **X3** in the review specs. *No verified cell change.*
- **K — mounting role** → the live hail cell + standard 14 already say `MOUNTING/TRACKER` = conditioner-only; only the build_methodology *worked example* is wrong → `build_methodology_review.md` Q4. *No cell change.*
- **L — cell layout target vs current** → a doc-status clarification; the real impl work is the JSON/YAML migration already tracked as item **I**.
- **H — dangling foundations link** → a foundations-doc link fix (doc hygiene), not a model artifact.

---
*Companion: [`drive_docs_review/`](drive_docs_review/README.md) (doc-side edits, incl. X1/X2/X3 and the relocated J/K/L/H). Load-bearing engineering: **A** hail two curves · **B** wind terrain bridge · **C** capability wiring · **D** cap-binding check · **G** tier table (gated X1) · **M** derivation rationale. **E/F** verify-then-maybe · **I** roadmapped · **N** optional.*
