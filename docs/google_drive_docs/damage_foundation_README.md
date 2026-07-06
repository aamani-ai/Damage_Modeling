# Google Drive docs — *InfraSure Damage* foundation set

Local `.docx` copies of the team's shared Google Drive folder **"InfraSure Damage"**
(`Shared with me › Modeling › Docs › InfraSure Damage`). They're kept in-repo so the reference
material is available offline and to agents working in this repo.

> **Google Drive is the source of truth.** These local copies are a snapshot and can drift —
> re-export from Drive when in doubt. The set is **shared with the team**, so edits belong in
> Drive, not here.

This set sits one layer *below* the [InfraSure Hazard](../../Hazard_modeling/docs/google_drive_docs/README.md) set: the hazard set turns
events into a loss distribution and reads metrics off it; the damage set builds the **damage
callable** the hazard pipeline binds to at its M3 (per-event loss generation) stage. The damage
side's job ends at SHIP — annual aggregation, financial application, and tail metrics are all
hazard-side, downstream of M3.

## Files in this folder

Stored **flat** here; the *Drive subfolder* column shows where each lives in Drive. (Sizes are the
on-disk `.docx` sizes.) *More files will be added to "2) Methodology & Implementation" as cells
are built.*

| Local file | Drive subfolder | ~Size | What it is |
|---|---|---|---|
| `damage_modeling_terminology.docx` | 1) Reference | 430 KB | The vocabulary the damage layer assumes — the curve, grain, shape, binding, evidence, and emit families, each term paired with the one it's most often confused with. |
| `damage_curve_evidence_reference.docx` | 1) Reference | 185 KB | What counts as evidence for a damage curve, the four-tier taxonomy (T1–T4), how a tier converts into curve parameters, and what each tier authorizes the curve to claim downstream. |
| `damage_curve_build_methodology.docx` | 2) Methodology & Implementation | 405 KB | The strict-order pipeline — EVIDENCE → GRAIN → AXIS → FORM → ADJUSTMENTS → EMIT → SHIP — that turns curated evidence into a shippable callable, plus the cell-package layout, a worked example, and the staged roadmap. |

## Suggested reading order

The three lock into one pipeline — **evidence → curve → shipped callable**:

1. **`damage_modeling_terminology`** — the vocabulary (callable-not-chart, failure-unit vs
   subsystem vs cell, selector vs conditioner, vulnerability vs fragility, withhold-not-caveat).
   Read first to avoid the classic confusions.
2. **`damage_curve_evidence_reference`** — why damage evidence is curated, not fitted; the
   T1–T4 tier taxonomy; the source-to-parameter mapping; the tier × claim matrix that gates which
   downstream metrics are honest.
3. **`damage_curve_build_methodology`** — the seven-stage pipeline that consumes the vocabulary
   and the evidence and emits a versioned, contracted damage callable. Read the §12 worked example
   (hail × utility-scale solar) last to see the stages collapsed into one cell.

---

## File details

### 1. `damage_modeling_terminology.docx`
**Damage Modeling Terminology** · *Drive: 1) Reference*

The vocabulary the rest of the damage layer assumes — input terms, shape terms, binding terms,
evidence terms, emit terms.

- **Purpose.** A controlled-vocabulary reference for the terms a modeler handles while building a
  damage curve. Each term lives under exactly one *family*; where it's commonly confused with a
  term in another family, the confusion is flagged inline and again in the confusions table. The
  input/shape/emit-side companion to the Evidence Reference.
- **Key topics.** Two anchoring ideas (a damage curve is a *callable*, not a chart; damage is
  *plural per cell*) · the curve family (vulnerability vs fragility vs loss vs severity vs derating)
  · the grain family (cell vs failure-unit vs subsystem vs component; cap-and-sum, no grouping
  primitive) · the shape family (logistic default; threshold, midpoint, steepness, saturation cap,
  anchoring) · the binding family (selector vs conditioner vs exposure) · the evidence family
  (T1–T4 tiers; curated-not-fitted; provenance travels) · the emit family (scalar / mean+spread /
  state vector / distribution; the capability declaration; withhold-not-caveat).
- **Sections.** Orientation → curve family → grain family → shape family → binding family →
  evidence family → emit family → confusions-at-a-glance → cross-reference index.
- **Use it when.** Defining or sanity-checking damage-model terms: settling vulnerability vs
  fragility, keeping failure-unit vs subsystem straight, distinguishing a selector from a
  conditioner, or deciding which emit shape a downstream metric needs.

### 2. `damage_curve_evidence_reference.docx`
**Damage Curve Evidence Reference** · *Drive: 1) Reference*

What counts as evidence for a damage curve, how it is tiered, how a tier converts into curve
parameters, and what each tier authorizes the curve to claim downstream.

- **Purpose.** Defines what is and is not evidence for a damage curve, and establishes the
  framework the Build Methodology assumes. The operating mode is **curation, not fitting**:
  heterogeneous artifacts (papers, claims, standards, forensic studies, expert notes) are read,
  tiered, and attributed to specific parameters — not regressed into one curve.
- **Key topics.** Why damage evidence differs structurally from hazard data · the four-tier
  taxonomy (T1 direct empirical, T2 engineering standards, T3 inferred/proxy, T4 expert judgment)
  and the tier-to-confidence ladder · evidence sources by class (research, claims, vendor reports,
  consensus standards, forensic studies, hazard-model libraries, expert elicitation) · the
  source-to-parameter mapping table every curve writes · provenance and the source-context folder ·
  the tier × claim matrix · the ingestion protocol, freshness/staleness, and the per-cell dossier
  template.
- **Sections.** Why damage evidence is different → tier taxonomy → sources by class →
  source-to-parameter mapping → provenance & source-context → tier × claim matrix → ingestion
  protocol → freshness & staleness → dossier template → cross-references.
- **Use it when.** Tiering a new artifact, mapping a parameter to its source, deciding whether a
  curve's evidence base honestly supports a requested downstream metric, or auditing whether a
  curve is honoring its tier limits rather than quietly overreaching.

### 3. `damage_curve_build_methodology.docx`
**Damage Curve Build Methodology** · *Drive: 2) Methodology & Implementation*

The strict-order pipeline from curated evidence to a shippable damage callable, with the
cell-package layout, worked example, and staged roadmap.

- **Purpose.** The "doctrine layer" that turns vocabulary + evidence into a curve. The object
  built is one concrete thing — a callable `D(intensity, selectors, conditioners, exposure) →
  emit_object` plus a capability declaration — that the hazard pipeline binds to at M3. The
  document stops at SHIP and specifies **what M3 is entitled to assume**, not how M3 invokes the
  callable.
- **Key topics.** The seven-stage strict-order pipeline (EVIDENCE → GRAIN → AXIS → FORM →
  ADJUSTMENTS → EMIT → SHIP), each stage with one decisive question, defined inputs/outputs,
  doctrine, worked moves, and the failure modes it prevents · subsystem-default grain with
  cap-and-sum composition · univariate axis with declared valid range and no extrapolation ·
  logistic-by-parsimony form with anchoring · the three binding kinds · emit-shape selection by
  first-nonlinearity-downstream · the capability declaration schema · the cell-package layout · a
  full worked example (hail × utility-scale solar) · the 12-check validation list and the
  staged A→D roadmap.
- **Sections.** Relation to companions → prerequisites → seven-stage overview → the seven stages
  (one section each) → cell-package layout → worked example → validation & staged roadmap →
  cross-reference index.
- **Use it when.** Building or reviewing a damage cell end-to-end: choosing the grain, picking the
  axis, parameterizing the form, declaring selectors/conditioners/exposure, selecting the emit
  shape, writing the capability declaration, and shipping a versioned, contracted artifact. Pair
  with the Evidence Reference for the source-to-parameter discipline and the Terminology for the
  vocabulary.

---

*Per-file summaries above were generated from the actual document contents. They're a navigation
aid — defer to the documents (and to Drive) for specifics.*
