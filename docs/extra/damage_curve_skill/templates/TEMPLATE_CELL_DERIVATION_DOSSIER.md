# <cell_id> curve derivation dossier

## 1. Scope, asset boundary, and failure mechanisms

Name included physical value and excluded BI, revenue, insurance, land, soft/sunk value, and deferred pathways.

### 1A. Pathway architecture

| pathway_id | physical mechanism | in scope | axis/bridge | neighboring-cell boundary | event double-count guardrail |
|---|---|---:|---|---|---|

Explain why the declared pathways share one cell or require separate cells. A pathway is not a selector, conditioner, exposure, boolean, or intensity inference.

## 2. Failure-unit decomposition and coverage

| pathway_id | Failure unit | Subsystem/component | Mechanism | Protection/BOM split | Value row/bucket | Treatment | Evidence status |
|---|---|---|---|---|---|---|---|

Do not precommit the curve count before every material value row has a treatment.

## 3. Source-native hazard axis and local exposure bridge

Distinguish the source-native hazard variable from delivered failure-unit demand and duration. Name every missing bridge independently by pathway.

## 4. Source register summary

| source_id | pathway_ids | source | role | tier | used_for | notes |
|---|---|---|---|---|---|---|

Point to the machine-readable source register with exact locators and transfer limits.

## 5. Claim/parameter provenance map

| pathway_id | claim/parameter | failure unit/curve | source IDs and locators | claim type/role | tier | decision | permitted/prohibited inference | update trigger |
|---|---|---|---|---|---|---|---|---|

## 6. Evidence and legacy numerical pressure test

Reproduce equations/tables, verify endpoints and units, test boundary/zero/asymptotic behavior, and record rejected/demoted material. Point to the legacy-ingestion memo when applicable.

## 7. Y-axis and row-level value crosswalk

Define same-unit numerator/denominator, direct value, mixed/support/excluded rows, allocation rules, and reconciliation difference.

## 8. Site-condition adapter and double-counting matrix

Separate selector, conditioner, bridge input, derived exposure, allocation, and deferred pathway. Address barriers such as fences/walls and bypass pathways when applicable. Assign no blanket mitigation credit.

## 9. Curve-form decision

State why each adopted form is supportable at pathway × failure-unit grain. If none is supportable, say `NO_RUNTIME_CURVE`; if only one pair is unsupported, use `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`. A curve form is not mandatory.

## 10. Parameter derivation and tiers

## 11. Seven-step audit

Summarize the outcome and blocker for all seven steps using `TEMPLATE_SEVEN_STEP_AUDIT.md`.

## 12. Derivation rationale / combination narrative

## 13. Capability and fail-closed decision

Record `curve_records`, the rectangular pathway × failure-unit support matrix, every metric status, reason codes, canonical/runtime/package status, and promotion evidence. No-curve KATs must assert no numeric DR/loss.

## 14. Open seams and update triggers

## 15. Validation/QC

Include pathway-specific KATs, cross-pathway negative tests, old-vs-new behavior, schema migration, and consumer model/docs/schema/SHA pin verification.
