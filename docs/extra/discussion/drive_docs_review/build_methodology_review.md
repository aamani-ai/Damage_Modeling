# Build Methodology doc — edit specification

A **self-contained edit spec** for `docs/google_drive_docs/damage_curve_build_methodology.docx`. Same use as
the terminology spec: hand an LLM the current doc + this spec to produce the update.

**Shared rules** (do not repeat — they apply here too, from
[`terminology_review.md`](terminology_review.md)): **§G1** plain/no-meta-framing · **§G3** numbers match the
live cell or are labeled illustrative · **§G5** figures are images → render edits as text blocks + fix
captions · **§G6** number provenance · **§X1** canonical tier taxonomy · **§X2** canonical capability schema.
Tags: `[LANGUAGE]/[FACT]/[STRUCTURE]/[EXAMPLE]`. Cross-ref to review points `[Q1]…[Q5]`.

---

## v2.5 reconciliation — READ FIRST

Implementation is now the **v2.5 hardened deliverable** (V2.2 retired). Several edits below are now things to
**describe**, not propose:
- **#10 adjustment provenance + reasoning** and the **derivation rationale (M)** are **implemented** — v2.5
  added rationale addenda + serialized adjustment form/source/reasoning to the cells. Describe it.
- **#8 EMIT / tail honesty** — v2.5 added a distribution-ready emit schema (`schemas/damage_emit.schema.json`)
  + emit modes (standard 21 §6: scalar_mean / discrete_state_table / parametric_distribution / state_ensemble)
  **and a fail-closed cap-binding preflight** (standard 21 + `runtime_helpers/cap_binding_preflight.py`). The
  EMIT rewrite should reference these — and note `scalar_eal` is now *conditional on a passing preflight*.
- **Capability schema (§9 / X2)** — use the **v2.5 schema** (see `terminology_review.md` → "v2.5
  reconciliation"), not the build-methodology §9 draft.
- **#9** stays redirected to the Evidence Reference; v2.5 already implemented the cell-side `param_role` / tier
  tables.
- **A/B (cross-repo)** — v2.5 made the hail JSON canonical + provided a wind height-bridge contract/helper, but
  the **Hazard_modeling M3 / M2 notebook patches are still external/pending** (see the handoff docs under
  `00_global_method/hazard_modeling_handoff/`).
- **Still doc-side:** **X1** tiers (build-methodology already correct — terminology is the outlier), **X3**
  coverage roles (build-methodology GRAIN → standard 14).

---

## Edits by section

### §2.2 "Evidence baseline" — tiers introduced too thinly `[Q2] [STRUCTURE]`
The tiers (T1–T4) are used heavily in §4 EVIDENCE worked moves and the source-to-parameter tables but only
get a one-line mention in §2.2. **Expand §2.2** to a short real definition — one line + one example per tier —
and add an **inline forward-reference** the first time tiers are used in §4: *"Tiers T1–T4 are defined in the
Damage Curve Evidence Reference §2 (summarized in §2.2 above)."* Use the canonical **§X1** tier definitions
verbatim. *(Build-methodology's existing ordering T3=inferred/proxy, T4=expert already matches X1 — keep it;
this is the correct one. The terminology doc is the outlier that must change.)*

### §4 EVIDENCE + §7 FORM — the missing "derivation rationale" `[Q1] [STRUCTURE][FACT]`
The pipeline produces a quantitative **source-to-parameter table** but no first-class **qualitative
derivation rationale**. Add it as a required output:
- **In §4 (EVIDENCE) outputs and §7 (FORM) outputs**, add a required artifact: a **derivation rationale** —
  a short narrative *per failure-unit* answering: (1) which source set each parameter; (2) **how a ready-made
  curve was used** — decomposed into anchor points / threshold / cap and re-derived, *not* adopted wholesale
  (a similar-asset library curve enters as **T3 proxy**; a paper's curve is **T1 for its specimen, T3
  transferred**); (3) **which sources conflicted and why each was chosen** over the others (Evidence Reference
  **Rule 4**: choose one + note it in the dossier, or let the spread carry the disagreement — choice by tier
  then specimen relevance); (4) what was rejected and why.
- Add a sentence in §4 doctrine making explicit that **a found curve is an artifact like any other** —
  tiered for the claim, decomposed to evidence, never copied as a black box.
- **Home:** the dossier (a dedicated "derivation rationale" section, expanding the Evidence Reference §6
  tier-mix narrative) **and** narrated in the `workbook` (which currently only mechanically reproduces
  anchors→params). Make it **§13 validation check #13** ("derivation rationale present per built failure-unit;
  every parameter conflict named and resolved"). *(Also an implementation item — cells don't carry it.)*

### §5 GRAIN — the role table doesn't match the canonical taxonomy `[Q3] [FACT]`
The GRAIN role table (`Primary / Secondary / Conditioner-only / Modifier / DR≈0`) uses a **"Modifier"** role
defined as *"affects the damage path of multiple primaries / racking angle changes impact angle."* This does
**not** match the canonical coverage-role taxonomy in **standard 14**, whose five roles are:
`primary-nonzero / secondary-conditional / conditioner-only / **exposure-protection-modifier** / DR≈0-reviewed`
(standard 14 §1; §6 splits it: *conditioner changes vulnerability · exposure modifier changes affected amount
· protection modifier changes local hazard reaching equipment*). **Replace** the GRAIN role table with
standard 14's five roles verbatim, and reclassify the examples: the "racking angle changes impact angle" case
is a **conditioner** (it changes vulnerability), not a "modifier"; an output multiplier like hail-hardened
glass is a **selector / new archetype**, not a "modifier." This is the **X3** cross-doc reconciliation —
terminology §3 has a *different* wrong "Modifier" (output multiplier), so **both docs converge on standard
14**. *(See `implementation_improvements.md` item J.)*

### §5 GRAIN worked example — `mounting_frame` is mis-roled, and the grain is blurred `[Q4] [FACT]`
- **Mounting role:** the worked example calls `mounting_frame` **"secondary"** (capex 0.20, curve v1.1). The
  canonical taxonomy (standard 14 §5/§9/§10) and the live hail cell say **`MOUNTING/TRACKER` for hail =
  conditioner-only** (stow changes module vulnerability; *"not the primary hail-damaged value bucket"*). It's
  also internally inconsistent — the same §5 capex table marks `racking` as **DR≈0 under hail**. **Fix:**
  change the worked example so `MOUNTING/TRACKER` is **conditioner-only** (hosting `stow_state`), consistent
  with standard 14 and the cell. If the intent was the static frame/racking as a severe-hail secondary, name
  it explicitly (`MOUNTING/RACKING_STRUCTURE`, secondary/backlog) and keep it distinct from the tracker — but
  default to the canonical conditioner-only for v1. *(Implementation item K: reconcile in the cell.)*
- **Failure-unit vs subsystem grain `[Q4] [LANGUAGE]`:** the doc calls `panel_glass / mounting_frame /
  inverter / racking` "failure-units," but these are subsystem/component-level. Per the terminology, the
  **failure-unit is the curve atom** (e.g. `PV_MODULE_GLASS_CELL`) and the **subsystem is the value-link unit**
  (e.g. `PV_ARRAY`); "subsystem-default" means *write at subsystem grain unless the mechanism concentrates
  finer.* **Fix:** make the worked example precise — name the failure-unit as the full path
  `PV_ARRAY / PV_MODULE / glass-cell replacement trigger` (matching standard 14 §3) and reserve "subsystem" for
  the value bucket. State once that the reader's confusion is the naming, not the concept.

### §9 EMIT — capability schema is a third variant `[Q5] [FACT]`
Build-methodology §9's schema uses **`cap_binding: yes|no` (boolean)** and `spread_carried: none|curated`.
**Align to the canonical §X2**: `cap_binding` → enum `rarely|occasionally|frequently`; `spread_carried` →
`false|true`; keep `cell_damage_model_version`. This doc must be part of the **X2 lockstep** (it's the third
schema variant after Terminology and Evidence Reference). Drop `emit_shape`/`withheld` as *capability* fields
per X2 (emit_shape belongs to the emit object; withheld = absent from `metrics_supportable`).

### §11 cell-package layout — doesn't match the built cells `[Q5] [FACT/STRUCTURE]`
§11 prescribes `callable.py / parameters.yaml / capability_declaration.yaml / source_to_parameter.md /
dossier.md / source_context/ / workbook.ipynb / preview_renders/ / freshness_card.md / changelog.md /
archive/`. The **actual** built cells use `current/` with `README_<cell>_<ver>.md`, the dossier, a
`damage_code_metadata_spec`, a `workbook_sheet_manifest`, a `CELL_DOCUMENTATION_CROSSWALK`, and **`.xlsx`**
records; plus `previews/` and `archive/`. **This is a target-vs-current divergence** (same as the Evidence
Reference's layout). **Decide which is canonical** and reconcile — likely: the doc describes the *target*
(machine-readable `.yaml`/`.py`/`.json`), the cells are the *current* `.xlsx`/`.md` state, and the JSON/YAML
migration (implementation item I) closes the gap. State the layout's status (target vs current) in §11 so a
reader isn't misled. *(Implementation item L.)*

### §12 worked example — synthetic numbers `[Q5/G3] [FACT]`
The worked example uses `L=0.85, k=0.062, x₀=46, "Schmid 2024", mounting capex 0.20` — invented values that
match **neither** the live cell (dossier `P_break`, D50≈52.7, k≈0.166) **nor** the built blend (PV_ARRAY
L=0.95/k=0.1064/x₀=59.2), and "Schmid 2024, Table 3, n=9" reads as a fabricated citation in a doc that preaches
provenance. **Fix per §G3:** use the live cell's numbers + real sources (PVEL/Kiwa, IBHS), or label the whole
example "illustrative (not the live cell's parameters; see the cell dossier for live values)."

### Doc-wide `[LANGUAGE]`
Apply **§G1** (this doc has the same self-narration tic — e.g. "Why seven and not five or eight," the
"discipline of strict order" framing — keep what teaches, cut what only describes the document's architecture).
Update the `Companions:` header line if needed (it already names both companions — good).

---

## Round 2 — questions #6–#10

### §5 ADJUSTMENTS (and §2 GRAIN) — explain *why these categories*, by default `[#6] [STRUCTURE]`
Both stages state the *rules* but not the *why*, which forces the reader to ask a question we could have pre-answered. Add a 2–3 sentence rationale up front:
- **ADJUSTMENTS:** *"These are three roles, not one 'parameters' bucket, because they answer different questions at different times — a **selector** picks the curve (fixed, bind-time), a **conditioner** adjusts it (event-time), an **exposure** scales it to dollars. Splitting them keeps event-time state out of curve *choice* and keeps the audit trail clean."*
- **GRAIN:** a parallel "why these roles" line — each role implies a different build effort, and the split prevents the two opposite mistakes (one vague asset-curve vs fake-precision many curves). *(Doc-only; no impl.)*

### §8 — define "bind-time" / "event-time" `[#7] [LANGUAGE]`
Jargon used without definition. Define at first use: *bind-time = set once, when the cell is loaded for a specific asset (stable across that asset's events); event-time = set per event, recomputed on each event call.* *(Doc-only.)*

### §9 EMIT — "not useful for tail metrics" reads too sternly `[#8] [FACT / clarification]`
Rewrite the capability/withheld language to distinguish the two variability sources:
- **Event variability** (frequency × severity) — always preserved when the curve is applied per-event to historical/simulated events → a **real loss distribution** and an **honest EAL**, even with a scalar curve.
- **Within-event spread** (the curve's secondary uncertainty + spatial footprint) — *omitted* by a scalar mean DR, but the **dominant** contributor to the **deep tail** (founding incident: collapsing it → VaR99 ~12× understated).

Frame the withhold as *"a scalar tail would be **understated**, so we withhold rather than ship it understated"* — **not** "no tail exists." Add a one-liner that the final risk stats come from applying the curve to the event set and reading the per-event $ distribution. *(Doc clarification; relates to capability wiring item C; may also touch foundations 06 for consistency.)*

### §8 ADJUSTMENTS — provenance + reasoning for the adjustment *formula* `[#10] [FACT]`
Codify the pattern the **hail cell already uses** — `adjustment_type` (the transformation form) + `adjustment_source_id` (the ref) — so an adjustment's **form and source**, not just its magnitude/tier, are provenance-tracked, and require the **reasoning for the chosen form** (folds into the derivation rationale, item M). *(Doc + impl — see implementation item M extension; verify flood/wind carry these fields too.)*

### #9 is NOT a build-methodology edit — redirected
`[#9]` — separating the **source-to-parameter table** by parameter *nature* (curve-fit `k, x₀` vs boundary/form-agnostic `threshold, L` vs adjustments) so a flat table doesn't read as one homogeneous set for a single curve. That table is defined in the **Evidence Reference §4 schema**, not here — build-methodology only *references* it. → logged for the Evidence Reference review + implementation item **N**. (Owner's note: useful, not necessarily important.)

---

## At-a-glance status

| Q | Section | Type | Status |
|---|---|---|---|
| Q1 | §4/§7 derivation rationale (missing artifact) | STRUCTURE/FACT | spec'd · understanding ✅ |
| Q2 | §2.2 tier intro + forward-ref (use §X1) | STRUCTURE | spec'd · understanding ✅ |
| Q3 | §5 GRAIN role table → standard-14 (X3) | FACT | spec'd · understanding ✅ |
| Q4 | §5/§12 mounting role + failure-unit/subsystem grain | FACT/LANGUAGE | spec'd · understanding ✅ |
| Q5 | §9 capability (X2), §11 layout, §12 numbers (G3) | FACT | spec'd |
| #6 | §5/§2 "why these categories" intro | STRUCTURE | spec'd · understanding ✅ |
| #7 | §8 define bind-time / event-time | LANGUAGE | spec'd · understanding ✅ |
| #8 | §9 EMIT — event vs within-event variability; withhold≠no-tail | FACT/clarif. | spec'd · understanding ✅ |
| #9 | source-to-parameter table grouped by param nature | STRUCTURE | **redirected → Evidence Ref §4 + impl item N** |
| #10 | §8 adjustment formula provenance + reasoning | FACT | spec'd → folds into impl item M |

*Cross-doc: **X1** tiers (build-methodology already correct; terminology must change) · **X2** capability
(add build-methodology to the lockstep) · **X3** coverage-role taxonomy (new — canonicalize terminology §3 +
build-methodology GRAIN on standard 14). Implementation counterparts appended to
[`../implementation_improvements.md`](../implementation_improvements.md) items J–L. Grounding: standard 14 read
directly; build-methodology + companions read directly.*
