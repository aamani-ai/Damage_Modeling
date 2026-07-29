# Strong-wind × solar completion plan

Status: **Step 1 audit complete; model v2 promotion blocked**  
Audit date: **2026-07-28**  
Cell: `strong_wind_solar`  
Current runtime: `strong_wind_solar@model_v1_0__docs_r3`  
Candidate: noncanonical `model v2.0 / docs r1`, pathway `straight_line_convective`

## Outcome first

This hazard × asset pair is not missing and should not be rebuilt from scratch. The repository already has:

- a canonical model v1.0 runtime artifact;
- a much stronger, pathway- and architecture-aware model v2.0 proposal;
- fixed-tilt and qualified single-axis-tracker routes;
- explicit failure-unit, exposure, value, dependency, capability and rejection contracts;
- a workbook, source/claim/parameter registers, KATs, a validator and a Hazard migration proposal.

The proposal passes its structural, mathematical, workbook and regression checks. It is still a
**screening research package**, not a releasable damage model, because its numerical medians, dispersion,
hard-zero boundary, localized repair ratios and central cascade treatment remain T4 assumptions. Passing
tests proves internal coherence; it does not establish external calibration.

Therefore the accuracy-first decision is:

```text
preserve v1 canonical
  + preserve the useful v2 architecture
  + close evidence and engineering gates
  + repair the remaining governed package seams
  + shadow in Hazard
  -> only then make an explicit promote/withhold decision
```

## Step 1 audit result

| Area | Result | Consequence |
|---|---|---|
| Canonical identity | v1 artifact SHA remains `832f47d69372ec54723a61b8a956addccef07bb39338c3ec99907e116f1855ca` | No current runtime change |
| Candidate identity | v2 artifact SHA remains `32fe982548139cda846fb2e1da63568bcdcc689a87d6b21bd0110f23676c58fb` | Stable research candidate, not a consumer pin |
| Runtime index | v2 is absent | Correct while promotion is blocked |
| Proposal validator | Pass: 6 runtime, 1 monetary-loss, 4 loss-rejection, 4 pin and 16 contract-rejection tests | Contract and equations are internally coherent |
| Canonical regression validator | Pass for all five current artifacts | No detected cross-cell regression |
| Workbook | 14 QA rows pass; formulas and renders are usable | Workbook is reviewable, not calibration evidence |
| Scientific axis review | Blocked | Fixed pressure bridge and tracker `Vnormal/Ucrit` require independent review |
| Numerical parameters | Blocked | T4 values cannot be promoted merely because they are monotone and bounded |
| Dependency/value | Conditional | Salvage/cascade and support-once allocation need resolution |
| Site-condition adapter | Missing as a dedicated governed file | Add field roles, fail-closed behavior and double-counting matrix |
| Workbook manifest | Sheet-order description differs from actual workbook order | Repair as documentation/QC, without changing formulas |
| Hazard shadow/rollback | Blocked | Required before any cutover |

## Current v1 safety seam

The v1 workbook has a documented selector defect: `Dashboard!G7` reads mounting type `B7` instead of the
displayed stow state `B8`. This makes the displayed stow input inert and applies the default probabilistic
tracker factor to fixed tilt in the dashboard calculation. The model v2 proposal correctly records the issue
without silently changing the current artifact.

Before using v1 workbook outputs for decisions, add an executable legacy KAT or equivalent regression check
that separates canonical JSON behavior from the defective dashboard formula. Any actual correction that
changes delivered results must be separately classified and versioned; it must not be bundled invisibly into
v2 documentation work.

## Ordered implementation

### Step 2 — refresh and pressure-test the axes

1. Re-run a bounded primary-source search from the existing 2026-07-12 cutoff.
2. Review the fixed-tilt net-pressure demand ratio and squared-speed proxy separately.
3. Review tracker `Vnormal/Ucrit`, exact-system qualification, 1P/2P, attained state and the 0.75 operational
   action flag separately.
4. Retain transfer limits. Standards and wind-tunnel guidance may support mechanisms and contracts, but do
   not become fragility curves.

Exit: every axis/bridge claim is retained, revised or rejected with an exact source and transfer limit.

### Step 3 — resolve the numerical curve gate

For medians, beta, hard zero, state costs and salvage/cascade:

1. search for matched demand–architecture–disposition–cost evidence;
2. if matched evidence remains unavailable, run a documented formal elicitation with named reviewers,
   anchors, ranges, disagreement and sign-off;
3. if neither path is available, retain the curves as screening scenarios and keep promotion blocked;
4. never relabel unweighted lower/central/upper scenarios as probabilities or P10/P50/P90.

Exit: parameters either receive governed support adequate for their claimed tier or remain explicitly
withheld from canonical use.

### Step 4 — repair the governed proposal package

1. Add a dedicated site-condition adapter covering selectors, conditioners, bridge inputs, derived exposure,
   allocation, missing/default behavior and prohibited double counts.
2. Resolve the module/structure nonterminal dependence and replacement-support allocation rule.
3. Reconcile the workbook manifest with actual sheet order.
4. Update source, claim and parameter registers; dossier; metadata; artifact; capability; workbook; KATs;
   validation report; pressure test and promotion matrix as one synchronized candidate revision.
5. Do not modify the canonical index, v1 artifact or current pin during candidate repair.

Exit: one reviewable candidate package with no unresolved internal contract or documentation drift.

### Step 5 — Hazard shadow and release decision

1. Dual-read v1 and v2 using exact cell/model/docs/schema/SHA identities.
2. Test local convective event and parent-event partition, zone exposure, hail/convective compound handling,
   rejected neighboring wind pathways, value grain and withheld units.
3. Test rollback to the exact v1 pin and identify/remove any downstream hardcoded curve copies.
4. Record explicit maintainer approval or withholding.
5. Only an approved promotion updates the registry, artifact index and changelog atomically.

Exit: either a governed canonical release or a documented decision to retain v1 and keep v2 research-only.

## Completion definition

`strong_wind_solar` is complete for v1 delivery only when all five statements are true:

- the local hazard is routed to `straight_line_convective`, not inferred from wind speed alone;
- fixed tilt and qualified tracker architectures use reviewed, non-interchangeable demand axes;
- numerical DR parameters have evidence or formal elicitation appropriate to their claim;
- failure-unit exposure, value and dependency rules cannot double count or silently create whole-plant DR;
- Hazard proves exact pinning, rejection behavior, shadow comparability and rollback.

Until then, the current runtime stays on v1 and the v2 package remains screening/shadow material.

## Governed sources of truth

- Current cell: [`docs/cells/strong_wind_solar/`](../../cells/strong_wind_solar/README.md)
- Proposed package: [`proposed/README_strong_wind_solar__model_v2_0__docs_r1.md`](../../cells/strong_wind_solar/proposed/README_strong_wind_solar__model_v2_0__docs_r1.md)
- Promotion gates: [`PROMOTION_GATE_MATRIX_strong_wind_solar__model_v2_0__docs_r1.md`](../../cells/strong_wind_solar/proposed/PROMOTION_GATE_MATRIX_strong_wind_solar__model_v2_0__docs_r1.md)
- Evidence log: [`BOUNDED_EVIDENCE_SEARCH_LOG_strong_wind_solar__model_v2_0__docs_r1.md`](../../cells/strong_wind_solar/proposed/BOUNDED_EVIDENCE_SEARCH_LOG_strong_wind_solar__model_v2_0__docs_r1.md)
- Consumer plan: [`strong_wind_solar_model_v2_0_convective_migration_proposal.md`](../../contracts/hazard_handoff/strong_wind_solar_model_v2_0_convective_migration_proposal.md)
- Evidence refresh: [`evidence_refresh_2026_07_28.md`](evidence_refresh_2026_07_28.md)
- Axis review packet: [`axis_independent_review_packet.md`](axis_independent_review_packet.md)
- Decisions: [`decisions.md`](decisions.md)
- Assumptions and unresolved questions: [`assumptions.md`](assumptions.md)
