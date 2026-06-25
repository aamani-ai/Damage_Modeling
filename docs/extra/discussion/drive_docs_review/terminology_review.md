# Terminology doc — edit specification

A **complete, self-contained edit spec** for `docs/google_drive_docs/damage_modeling_terminology.docx`.
Intended use: hand an LLM **(a)** the current doc and **(b)** this spec, and ask it to produce the updated
doc. It must not need any other context. *(Hardened against a dry-run + completeness stress-test — every
number used here carries provenance in §G6, and figure edits are spelled out as text blocks.)*

**How to read this spec.** Organized by **doc section** (apply top-to-bottom), cross-referenced to the
original review points `[#1]…[#11]`. Tags: `[LANGUAGE]` wording · `[FACT]` correctness · `[STRUCTURE]`
add/move/split · `[EXAMPLE]` worked example. **§G** = doc-wide rules. **§X1/§X2** = the two definitions
*shared with the Evidence Reference* — apply them **identically in both docs**, and §X2 includes the explicit
Evidence-Reference edits needed to converge.

---

## v2.5 reconciliation — READ FIRST

The implementation is now the **v2.5 hardened deliverable**
(`…/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE`; V2.2 retired), which **implemented** most
of the backlog. For the Drive-doc edits:

- **Describe, don't propose.** Cells now carry a capability declaration, per-parameter tier/role tables, a
  derivation rationale, `param_role` grouping, and JSON artifacts. Where this spec earlier said "not
  implemented," the Drive doc should **describe and align to the v2.5 artifact**, not say "to be built."
- **§X2 (capability) is superseded — use the v2.5 schema (below).** v2.5 implemented it as a machine-readable
  block, **richer than the earlier enum draft** (standard 21 + `schemas/capability_declaration.schema.json`).
  Terminology §7's capability block must match THIS:
  ```yaml
  capability_declaration:
    schema_version: capability_declaration.v1
    cell_id: <id>
    spread_carried: true | false
    emit_modes_populated_by_cell: [ scalar_mean | discrete_state_table | parametric_distribution | state_ensemble ]
    metrics_supportable:                 # PER-METRIC (not a flat list)
      failure_unit_scalar_dr:           supported | conditional | withheld
      scenario_loss_given_value_basis:  supported | conditional | withheld
      scalar_eal:                       supported | conditional_require_cap_binding_preflight | withheld
      pml:                              supported | withheld
      var:                              supported | withheld
      tvar:                             supported | withheld
    cap_binding:                         # a FAIL-CLOSED PREFLIGHT object (NOT a frequency enum)
      policy:                     pass_required | fail_closed | not_applicable
      preflight_status:           pass | fail | not_executed_no_distribution | not_executed_no_value_basis
      required_before_scalar_eal: true | false
      tolerance_pct:              <number>      # default 2.5 %
      action_if_fail:             require_mean_plus_spread_emit
  ```
  Two changes from the earlier draft: `cap_binding` is now a structured **fail-closed preflight** object (the
  `rarely|occasionally|frequently` enum is gone), and `metrics_supportable` is **per-metric**
  (supported/conditional/withheld). Doctrine unchanged: unsupported → **withheld**, not caveated.
- **#9 field-name flip:** v2.5 canonicalized to the **cell** names **`iec_wind_class`** / **`enclosure_rating`**
  (standard-07 names recorded as *aliases*) — the *opposite* of the §5 note below. Use the **cell** names as
  canonical; the §5 "use standard-07 names" line is superseded.
- **Still doc-side (v2.5 did not touch these):** **X1** tiers — terminology remains the outlier to fix (the
  v2.5 per-parameter tier tables use the canonical T1–T4); **X3** coverage roles — terminology §3 still needs
  aligning to standard 14.
- **Paths:** standards/cells are now under the **V2.5** bundle (same standard numbers; plus new standards
  20–21 and `schemas/`).

---

## §G · Doc-wide rules

**G1 · [LANGUAGE] Plain and concrete; delete meta-framing.** The doc narrates its own structure and reaches
for abstract framing that adds load without meaning. Remove or rewrite every instance — highest-volume edit:
- Delete: *"Every term in the rest of this document is either a piece of that signature or a fact about how
  the callable was built or a fact about what the callable can honestly support downstream. That triage is
  the organizing principle of the families below."* → if a bridge is needed: *"The families below group every
  term; read them in order."*
- Delete: *"Everything that follows hangs on those two ideas."* · Trim *"The most-confused set of terms in
  the field… Lock these in first; the rest follows."* to a plain lead-in.
- **Rule:** no sentence whose only job is to describe the document's own architecture. Cut filler intensifiers
  (deliberately, genuinely, precisely, exactly). **Keep §9's closing "A note on scope"** — it is reader
  orientation, not self-description; leave it.

**G2 · [EXAMPLE] One running example, threaded through §2/§3/§4/§5/§7.** Use **hail × utility-scale solar**;
do not introduce a different hazard per table. Reuse this set — **these are the live cell's values** (see G6
for sources), so they satisfy G3:

```
  failure-unit:   PV_MODULE_GLASS_CELL  (primary)
  curve form:     logistic  P_break(D) = L / (1 + e^(−k(D−D50)))
  D50 (midpoint): ≈ 52.7 mm   (live default archetype; archetypes 41 / 53 / 64 mm)
  k (steepness):  ≈ 0.166 /mm (live default archetype)
  threshold:      ≈ 25 mm     (IBHS impact threshold, T2)
  L (cap):        ≈ 0.95      (module-replacement cap, unstowed; illustrative)
  conditioner:    stow_state  (stowed caps DR at ≈ 0.90)
  selector:       module_archetype  (fragile / default 3.2 mm g-bs / hardened)
  exposure:       array_exposure_fraction
  worked value:   P_break(60 mm) = 0.95/(1+e^(−0.166·(60−52.7))) ≈ 0.73   ← use this in §2's vulnerability row
```

**G3 · [FACT] Numbers must match the live cell or be labeled "illustrative."** The doc currently carries no
numbers; the values in G2/G6 are live (sourced). The one explicitly *illustrative* number is L≈0.95 and the
generic fragility vector in the #6 collapse example — both must be tagged "illustrative." Never show an
invented citation.

**G4 · [FACT] Two definitions are shared with the Evidence Reference** — the evidence tiers (§X1) and the
capability declaration (§X2). The docs currently disagree on both; apply §X1/§X2 in lockstep (§X2 lists the
Evidence-Reference-side edits too).

**G5 · [STRUCTURE] The doc is figure-heavy and the figures are IMAGES.** The plain-text export shows only
captions for: the *callable-in-one-box* (§1), the *fragility→vulnerability collapse* (§2), the *anchored-
logistic shape* (§4), and the *four binding steps* (§5). **You cannot edit an image's interior from text.**
For any edit that targets a figure interior, do this instead: **render the new/updated content as a fenced
monospace text block placed immediately after the figure, and update the figure's caption to match.** Note in
an editor's comment that the image itself should be regenerated to match (a separate follow-up, out of scope
for the text update). Do **not** attempt to "edit the box."

**G6 · Provenance of the facts cited in this spec** (so the executing LLM treats them as sourced, not
invented — these belong in the *cells/foundations*, not necessarily printed in the doc):

| Fact used in this spec | Source |
|---|---|
| default archetype D50 ≈ 52.7 mm, k ≈ 0.166 /mm; archetypes 41/53/64 | hail_solar dossier v1.3 §6–§7 |
| failure-unit `P_break` logistic (not an asset blend) | hail_solar dossier v1.3 |
| threshold ≈ 25 mm (T2) | IBHS impact threshold (hail dossier) |
| stowed cap ≈ 0.90 | hail_solar dossier §13.3 |
| VaR₉₉ understated ~12× by mean-collapse | foundations `05_emit_object` §0 `[REF]` |
| wind per-unit caps: blade/tower 1.00, nacelle 0.85, foundation 0.65; tornado anchored to one EF4 case | wind_tornado_wind dossier |
| field-name divergence `turbine_class`/`iec_wind_class`, `equipment_ip_or_nema_rating`/`enclosure_rating` | standard 07 §5/§6 vs cell specs |

---

## Edits by section

### Preamble — "How to read this document" `[#1] [LANGUAGE][STRUCTURE]`
Replace the whole block with ~2 plain sentences:
> *This is a glossary. Terms are grouped into families (curve, grain, shape, binding, evidence, emit). Read
> them in order once; afterward jump to the family you need or use the index (§9).*
**Drop the `[settled]` convention** — it is described in the preamble but never used anywhere in the body (so
there is no "first use" to relocate it to). If you want to keep it, the only genuinely-settled choices to tag
are *logistic-default*, *cap-and-sum*, and *withhold-not-caveat* — but dropping it is cleaner.

### Doc metadata header (Author/Audience/Folder/Companions/Reads) `[STRUCTURE]`
Keep the `Reads:` line (the new preamble complements it). **Update `Companions:`** to name **both** the Build
Methodology *and* the Damage Curve Evidence Reference (the tiers/capability schema in §X1/§X2 are now shared
with it).

### §1 Orientation `[#2][#4] [STRUCTURE][LANGUAGE]`
- **Add a starter box at the top of §1** (the five words needed before anything else):
  > **cell** — one (hazard × asset) pair; the unit that ships (own version, dossier). · **failure-unit** —
  > the thing that fails; the atom a curve is written for. · **damage callable** — the function
  > `D(intensity, selectors, conditioners, exposure) → emit`, not a chart. · **DR** — repair cost ÷
  > replacement value. · **curve** — one failure-unit's `intensity → DR`.
- **Gloss "cell" at first use:** *"a cell (one hazard × asset pair — see §3)."*
- Apply **G1** (cut the "triage/organizing principle" and "hangs on those two ideas" sentences).

### §1 — "damage callable in one box" figure `[#3] [EXAMPLE]` (figure = image → apply **G5**)
Render a text block after the figure showing the signature with **one example per binding input** (the box
currently shows only a conditioner), then fix the caption:
```
  D( intensity,                         e.g.  mesh_diameter_mm = 60
     selectors,        ← fixed asset    e.g.  module_archetype = default_3.2mm_g_bs
     conditioners,     ← event-time     e.g.  stow_state = stowed
     exposure )        ← value touched  e.g.  array_exposure_fraction = 0.4
   → emit_object  (+ capability declaration)
```

### §2 Curve family `[#5][#6] [EXAMPLE][FACT]`
- **[#5] Add a running-example clause to each family-table row** (hail × solar, consistent values):
  > vulnerability → *"= L·P_break; ≈ 0.73 at 60 mm for the running curve."* · fragility → *"returns a state
  > vector, e.g. P(slight)=…, P(moderate)=… (see the collapse example)."* · loss function → *"same object,
  > actuarial dialect."* · **severity distribution** → *"pool the per-event DRs across many hail events at a
  > site → a per-event loss-size distribution (no calendar; not annual)."* · **derating** → *"soiling/
  > temperature MWh forgone — NOT hail damage; lives in the disruption track."*  *(Draft the severity and
  > derating lines explicitly — don't leave them for the LLM to invent.)*
- **[#6] Make the fragility→vulnerability collapse concrete — as a GENERIC illustrative example** (figure =
  image → **G5**: add as a text block). It is **not** the hail running curve (the hail cell is already a
  *vulnerability* function, not fragility-shaped), so label it illustrative and do not reuse the 0.73/60 mm
  figure:
  > *Illustrative.* A fragility function gives probabilities over damage states. Attach a **cost-per-state
  > vector** (repair cost of each state ÷ replacement) and take the probability-weighted average —
  > `MDR = Σ_s P(state_s)·cost_ratio(state_s)`:
  > ```
  > state         none   slight  moderate  extensive  complete
  > P(state)      0.30    0.40     0.20       0.08       0.02
  > cost_ratio    0.00    0.05     0.25       0.60       1.00     (illustrative)
  > MDR = .30(0)+.40(.05)+.20(.25)+.08(.60)+.02(1.0) = 0.138 ≈ 0.14
  > ```
  > The cost-per-state vector is the bridge. The collapse is **one-way**: many fragility vectors average to
  > 0.14, so you cannot recover the states from the mean — which is why a vulnerability function never becomes
  > a fragility function.
- **Severity-distribution duplication:** the term appears both in the §2 table and as a standalone paragraph.
  Keep the standalone paragraph (it adds the per-event/no-calendar point) but trim it under G1; give it the
  one-line example above.

### §3 Grain family `[#7][#2] [EXAMPLE][FACT]`
- **[#7] One example per coverage role**, but **keep coverage-role (§3) and binding-role (§5) separate** —
  don't call the tracker a "conditioner": the tracker's *coverage role* is **conditioner-only** (it has no
  curve of its own); the *binding role* it hosts is the **`stow_state` conditioner**. Write:
  > Primary → `PV_MODULE_GLASS_CELL` (drives the cell DR). · Secondary → a smaller co-event contributor (none
  > material in hail v1). · Conditioner-only → `MOUNTING/TRACKER` — *no curve of its own; it hosts the
  > `stow_state` conditioner that shifts the module curve.* · Modifier → a hail-hardened-glass factor. ·
  > DR ≈ 0 → `INVERTER_SYSTEM`, `SUBSTATION` (reviewed, negligible for hail).
- **Stow naming — standardize on `stow_state`** everywhere (the canonical standard-07 field; `stow_angle_deg`
  is a sub-parameter of it). Replace the doc's existing `stow_angle` conditioner example and the §3 "stow
  angle" mention with `stow_state` for consistency with G2 and §5.

### §4 Shape family `[#8] [FACT][STRUCTURE]` (figure = image → **G5**)
Split the "geometric features" into two groups and fix the count (the figure caption currently says "four
geometric features: threshold, midpoint x₀, steepness k, saturation cap L"):
- **Form-agnostic features (any curve):** **threshold** (low-intensity edge, DR≈0), **saturation cap L**
  (= at-risk fraction of value; no extrapolation past it), **anchoring** (remove a non-physical DR(0)>0).
- **Logistic parameters (sigmoid only):** **midpoint x₀**, **steepness k** — a piecewise/PCHIP/state curve
  has no single x₀ or k.
- State plainly: **logistic is the default, used by all built cells** (3 physical params). Other forms only
  when evidence shape demands — **piecewise/state** (flood electricals), **PCHIP** (clean knots), **linear**
  (rare); for them, threshold + cap still apply, transition is described by knots/step-thresholds, not x₀/k.
- **Figure (G5):** rewrite the caption to "the anchored logistic — its form-agnostic features (threshold,
  cap L) and its logistic-only parameters (x₀, k)," and render the two-group split as a text block beneath it.

### §5 Binding family `[#9] [FACT][STRUCTURE][EXAMPLE]` (the §5 figure = image → **G5**)
- **[#9a] State that a conditioner is a SIBLING of a selector, not a subset** (two-axis test):
  > A selector and a conditioner are distinct roles on two axes. *When set:* a **selector** is a **fixed asset
  > attribute** (once per asset, stable across events); a **conditioner** is an **event-time state** (varies
  > per event). *What it does:* a selector **chooses** the curve family/parameter set; a conditioner **shifts
  > or blends** the already-chosen curve. Both axes must flip for it to be a conditioner — a fixed attribute
  > that adjusts is still a selector (`chooses_parameter_set`); an event-time variable that picks is a
  > conditioner (`state_selection`). They are **not** nested. *(Standard 07 §8: "Selectors choose.
  > Conditioners shift or blend. Exposure variables scale affected value… these must not be mixed.")*
- **[#9a] The trap example:** *`stow_state` feels like a module property but is an operating state ("how the
  tracker was positioned during the event"), so it is a conditioner, not a selector.*
- **Three roles vs four steps:** the §5 figure shows **four steps** (select → condition → evaluate → expose)
  but there are **three roles** (selector/conditioner/exposure) — "evaluate" is a step, not a role. Add one
  sentence so the two framings don't read as a contradiction: *"three binding roles; four steps, the fourth
  being evaluation of the conditioned curve."*
- **[#9b] Add a "Resiliency & adaptation" note** (it reuses the three knobs — a Phase-3 layer, not new
  vocabulary):
  > Resiliency / adaptation measures are not a new binding role — each reuses one of the three knobs:
  > ```
  > raises the damage threshold (tracker stow)        → CONDITIONER (shifts x₀ / blends)
  > blocks / replaces (hardened glass, new mode)      → SELECTOR / new archetype
  > removes the hazard pathway (flood wall, elevation)→ EXPOSURE / protection modifier
  > reduces how much is hit (partial swath)           → EXPOSURE multiplier
  > ```
  > Phase 2 only *exposes* each lever as one of these; magnitude calibration + the optimization layer are
  > Phase 3 (consumer-side).
- **Field-name divergence is an IMPLEMENTATION item, not a doc edit.** The divergent pairs
  (`turbine_class`/`iec_wind_class`, `equipment_ip_or_nema_rating`/`enclosure_rating`) are wind/flood fields
  that don't appear in this solar-focused doc. **Do not inject them here.** Canonical = the **standard-07
  names** (`turbine_class`, `equipment_ip_or_nema_rating`); reconcile the cell specs to those — tracked in
  [`../implementation_improvements.md`](../implementation_improvements.md) item F.

### §6 Evidence family `[#10] [FACT][STRUCTURE]`
- **[#10] Reframe "curated, not fitted" as data-dependent, not an absolute ban** (the cells fit):
  > Damage curves are **curated**: which evidence is admissible, and the axis/form/anchors, are decided by
  > reasoning about what each source authorizes — *the objection is to fitting one pooled, heterogeneous
  > dataset, not to fitting at all.* **Curation sets the frame; fitting is allowed inside it** — an optimizer
  > may fit to source-pinned **anchor points** and report residuals, but never overrides the anchors or pools
  > evidence across tiers. The balance **slides with data**: sparse, non-jointly-observed evidence → curate
  > heavily; rich, jointly-observed, homogeneous data → fitting carries more weight, still inside the frame.
  Add the sliding-scale illustration (generalized — don't hard-code anchor counts):
  > ```
  > sparse, not-joint ───────────────────────────────►  rich, joint, homogeneous
  > FLOOD×solar            WIND×tornado            HAIL×solar          (1000s of attributable
  > no fit; piecewise      engineering-fit         logistic fit to     claims @ known intensity
  > STATE table            logistic, bounded by    a few source-       → MLE fit OK, still
  > (evidence is           sparse case evidence    pinned anchors      framed by curation)
  > state-shaped)          + judgmental shift
  > ```
- **[#10/X1] Fix the tier-3 authorization error.** The current §6 tier table says tier-3 *"supports EAL with
  caveats."* Wrong twice: it contradicts the Evidence Reference matrix (a curve whose weakest parameter is
  **T3** backs **no** sized metric → `metrics_supportable: []`), and "with caveats" violates this doc's own
  **withhold-not-caveat** doctrine. Correct it to: a T3-dependent curve **renders and informs but backs no
  sized metric (`metrics_supportable: []`)**. Use the label **"inferred/proxy" for T3** (per §X1 — forensic
  is T1 for the event it covers, not inherently T3). Use `[]` (empty list), not `{}`.
- **[X1] Replace the tier table with the canonical §X1 taxonomy** and adopt the `T1–T4` labels (this doc
  currently omits them, though the Evidence Reference's whole matrix depends on them).
- Leave the other §6 sub-items (provenance travels, source context, evidence backlog, source-to-parameter
  mapping) in place; they remain consistent with the reframe.

### §7 Emit family `[#11] [FACT][STRUCTURE][EXAMPLE]`
- **[#11] Reframe scalar as "correct where the path is linear," not "default by appetite":**
  > The emit shape is **forced by the first nonlinearity** downstream, not chosen. If everything from emit to
  > the metric is linear (sums, scalar multiplies), a **scalar mean DR is exact**. Scalar is correct when the
  > deliverable is **EAL**, the **cap rarely binds**, and there are **no financial terms**. The moment a
  > nonlinearity sits on the path — the cap biting, a deductible/limit, or the quantile operator
  > (VaR/PML/TVaR) — a scalar is *silently wrong*. (Founding incident: mean-collapse upstream of a
  > nonlinearity understated VaR₉₉ ~12× — foundations `05` §0.)
- **[#11] Correct "cells declare the capability fields."** They don't yet — the capability declaration is
  **contract design** (`SCOPE_AND_STORY`), not populated in any current cell spec. Write: *"the contract
  specifies a per-curve capability declaration (§X2); v1 cells emit a single scalar DR per failure-unit, and
  the declaration is not yet wired into the cell artifacts."* (Implementation item C.)
- **[#11] Distinguish emit-shape from curve-form/source-shape:** *"All three built cells emit a scalar today,
  even though flood's source is a state table and wind's is a fragility — state/fragility-shaped at the source,
  collapsed to a scalar on the wire."*
- **[#11] Per-shape example** in the emit table:
  ```
  scalar mean DR  → hail PV_MODULE_GLASS_CELL: one primary unit, EAL, linear path, cap rarely binds
  mean + spread   → hail STOWED curve (cap ≈ 0.90): at large-diameter hail the cap engages → Jensen →
                    scalar biases even EAL  (the cap rarely bites at typical intensities — this is the edge case)
  state vector    → wind turbine bundle (NIST fragility) / flood depth-% state: fragility-shaped source
  distribution    → wind farm once a tornado/EF4 tail (VaR/PML) is priced: the quantile operator is on the path
  ```
- **[#11] Version-pin subsection stays.** §X2's schema carries `cell_damage_model_version`; the doc's §7
  "cell damage-model version **vs** package release version" prose is **separate and stays** — *package
  release version is not a capability field* (it's the library/doc version). Don't delete it; just don't add
  it to the capability block.
- **[X2] Align the capability schema to §X2** (the doc's current schema is close; rename
  `cell_damage_model_ver`→`cell_damage_model_version`, change `source_tier` enum to `T1|T2|T3|T4`, and define
  `source_tier` as "the **weakest** tier the curve depends on").

### §8 Confusions-at-a-glance `[FACT]`
Propagate every fix above so the table doesn't restate the old version. Specifically: the selector/conditioner
row → the **sibling / two-axis** framing; the curated/fitted row → "curation frames; fitting allowed inside
it," not an absolute ban. (Withheld-vs-caveated, damage-vs-derating, etc. are already correct — leave them.)

### §9 Cross-reference index `[STRUCTURE]`
Make these **specific** edits (don't leave the row set to inference):
- **Rename** the tier rows: `Inferred / forensic (tier-3)` → `T3 — inferred/proxy`; `Proxy (tier-4)` →
  `T4 — expert judgment`; add `T1 — direct empirical`, `T2 — engineering standards` if absent.
- **Add** rows: *selector/conditioner two-axis test* (§5), *resiliency & adaptation* (§5), *form-agnostic vs
  logistic features* (§4). For the "first operational use" column, point each at the Build Methodology stage
  it maps to (binding → ADJUSTMENTS; features → FORM); if unknown, write "—".
- **No deletions needed** for G1's prose cuts — the deleted sentences are body prose, not indexed terms.

---

## §X1 · Canonical evidence-tier taxonomy `[CROSS-DOC — apply identically in Terminology AND Evidence Reference]`

The two docs disagree (Terminology: tier-3 = forensic/inferred, tier-4 = proxy/expert, no T-labels; Evidence
Reference: T3 = inferred/proxy, T4 = expert, forensic claim-dependent). **Adopt the Evidence Reference
framing** — more principled, because a tier grades an artifact *for the claim being made*: forensic is T1 for
the event it covers, T3 when transferred (not its own tier). **Confirm this choice once before executing** (it
edits both docs); the choice itself is stated decisively here so an LLM has one answer.

```
T1  Direct empirical    Loss obs. on the actual asset × hazard with intensity recorded/reconstructible
                        (attributed claims; field campaigns; realistic test stands; forensic studies FOR THE
                        EVENT THEY COVER). → anchors + mean shape in-range; tail metrics if spread curated.
T2  Engineering         Consensus standards / lab tests (IEC, IEEE, IBHS, ASCE, UL, HAZUS). → thresholds,
    standards           saturation caps, damage-state cutoffs; cross-asset calibration.
T3  Inferred / proxy    Related-but-not-identical asset/hazard/scale: coupon tests, analogous assets,
                        cross-event transfer, forensic APPLIED ELSEWHERE. → order-of-magnitude shape +
                        documented variant selectors. Backs NO sized metric on its own.
T4  Expert judgment     Documented credentialed opinion / elicitation; OEM notes that aren't test reports.
                        → a provisional curve's existence + selector/conditioner short-lists. No metrics.
```
**Three rules (state in both docs):** a tier grades the artifact *for a specific claim*, not in the abstract;
five T3 ≠ one T1 (just a more-confident T3); tiers are re-examined at every curve update. The cells' own
evidence-strength labels reconcile to T1–T4 (implementation item G).

## §X2 · Canonical capability declaration `[SUPERSEDED → use the v2.5 schema in the "v2.5 reconciliation" section at the top]`

> **Superseded by v2.5.** The enum-based draft below is kept only for history. The canonical capability
> declaration is now v2.5's machine-readable block (standard 21 + `schemas/capability_declaration.schema.json`),
> reproduced in the **v2.5 reconciliation** section at the top of this file. Align all three Drive docs to that.
> The Evidence-Reference convergence edits below still apply (drop `emit_shape`/`withheld` as fields; replace
> the boolean `cap_binding`), but the target schema is the v2.5 one, not this enum.

The two docs specify different fields (`cap_binding` enum here vs boolean there; this doc has `spread_carried`,
the other has `withheld`/`emit_shape`). **Adopt this version** (matches the implementation contract,
`SCOPE_AND_STORY`):

```yaml
capability:
  metrics_supportable: [EAL] | [EAL, VaR, OEP-PML] | [EAL, VaR, OEP-PML, AEP-PML, TVaR]
  cap_binding:         rarely | occasionally | frequently   # how often the saturation cap bites
  spread_carried:      false | true                          # is secondary uncertainty curated?
  valid_intensity_range: [x_min, x_max]
  source_tier:         T1 | T2 | T3 | T4                      # the WEAKEST tier the curve depends on
  cell_damage_model_version: "1.0"
```
**Doctrine (both docs):** an unsupported metric is **withheld** (absent from `metrics_supportable`), not
returned with a caveat.

**Evidence-Reference-side edits required to converge** (so X2 doesn't re-create drift):
1. In the Evidence Reference §6 worked example, change `cap_binding: yes` → an enum value (e.g.
   `occasionally`), so the field's meaning is *frequency-of-binding* in both docs.
2. **Remove `emit_shape` and `withheld` as capability fields** there — `emit_shape` belongs to the emit
   object, and `withheld` is implied by absence from `metrics_supportable`. Don't keep two schemas alive.
3. Use `metrics_supportable: []` (empty list) for the no-metric case, not `{}`.

*(Implementation note: these fields are contract design and are not yet populated in any cell spec —
implementation item C. The docs define the schema; the cells must fill it.)*

---

## At-a-glance status

| # | Section | Type | Status |
|---|---|---|---|
| 1 | preamble "how to read" (+ drop `[settled]`) | LANGUAGE/STRUCTURE | spec'd |
| 2 | §1 cell gloss + starter box | STRUCTURE | spec'd · understanding ✅ |
| 3 | §1 callable box (figure→text, G5) | EXAMPLE | spec'd |
| 4 | doc-wide language (§G1) | LANGUAGE | spec'd (global) |
| 5 | §2 family examples (+ severity/derating drafted) | EXAMPLE | spec'd |
| 6 | §2 fragility→vulnerability collapse (generic, illustrative) | FACT/EXAMPLE | spec'd · understanding ✅ |
| 7 | §3 roles examples (coverage- vs binding-role kept separate) | EXAMPLE | spec'd |
| 8 | §4 universal-vs-logistic split (figure→text, G5) | FACT/STRUCTURE | spec'd · understanding ✅ |
| 9 | §5 sibling/two-axis + resiliency + 3-roles-4-steps | FACT/STRUCTURE/EXAMPLE | spec'd · understanding ✅ |
| 10 | §6 curated-not-fitted sliding scale + tier-3 fix | FACT/STRUCTURE | spec'd · understanding ✅ |
| 11 | §7 scalar reframe + capability + per-shape examples | FACT/STRUCTURE/EXAMPLE | spec'd · understanding ✅ |
| X1 | evidence-tier taxonomy (cross-doc) | FACT | spec'd — **confirm canonical choice** |
| X2 | capability declaration (+ Evidence-Ref converge edits) | FACT | spec'd |

*Global rules: §G1 language · §G2 running example (live values) · §G3 match-live-or-illustrative · §G5
figures-are-images · §G6 number provenance. Grounding: workflows `w4xotw60h` + `wqq12t8kc` (adversarially
verified), hardened by stress-test `w3adyhjkl` (dry-run + completeness). Implementation counterparts:
[`../implementation_improvements.md`](../implementation_improvements.md).*
