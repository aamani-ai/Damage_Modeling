# Validation report — tropical-cyclone wind × wind model v1.0/docs r1

## Decision

**PASS as a noncanonical, partial-coverage release candidate.** The package is internally consistent and
executable at its narrow source-native failure-unit boundary. It is **not approved for canonical runtime or
Hazard cutover** because valuation, modern-fleet applicability, remaining failure-unit coverage, consumer
adapter, and explicit promotion gates remain open.

```yaml
cell_id: tropical_cyclone_wind_wind
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_SCREENING_V1
semantic_damage_model_version: model v1.0
documentation_revision: docs r1
artifact_schema: damage_curve_record_bundle.v3
artifact_schema_status: proposed_draft
capability_schema: capability_declaration.v3
emit_schema: damage_emit.v2
canonical_runtime_artifact: false
promotion_status: proposed
validation_date: 2026-07-28
```

## Machine validation

The dedicated validator completed with the optional Draft 2020-12 schema engine available from an isolated
temporary dependency directory:

```text
PASS tropical_cyclone_wind_wind model v1.0/docs r1 noncanonical proposal
checks=5759
schema_validation=bundle v3/capability v3/emit v2 executed; two negative schema tests passed
formula_kats=24
contract_kats=23
sources=12
claims=19
parameters=24
value_rows=12
workbook_sheets=12
workbook_formulas=253
workbook_qa_passes=20
local_links=23
missing_allowed=0
```

The same validator remains dependency-light: without `jsonschema`/`referencing`, it executes its full
semantic validation path and reports the optional schema-engine check as unavailable rather than silently
claiming it ran.

## Content validated

- exact `thresholded_weibull_expected_damage` equation and the three published source archetypes;
- `delta_V50_kmh` versus absolute `V_at_DR50_kmh` identity;
- exact pathway, failure-unit, axis, selector, and source-assumption IDs;
- source-defined zero branch, core range, gap withholding, and high-range withholding;
- rejection of category, one-minute, hub-height, alternate-unit, nearest-class, interpolation, and
  modern-fleet substitution;
- operating/control-state flag and withhold behavior;
- monotonic, finite, bounded DR values and exact D50 fixtures;
- explicit null/withheld treatment for nine uncovered wind-farm failure/support units;
- source-native denominator quarantine and rejection of CWER/component/plant/TIV substitutions;
- per-turbine versus facility-level GSU exposure grain;
- no scenario loss, annual/tail metric, canonical index entry, or `current/` package;
- artifact model/docs/schema/SHA pin checks, wrong-pin rejection, and legacy-placeholder unreachability;
- source, claim, parameter-tier, value-crosswalk, old-vs-new, documentation-link, and workbook integrity.

## Workbook validation

The governed workbook was generated with `@oai/artifact-tool`, imported again for formula-value inspection,
and rendered sheet by sheet.

| Check | Result |
|---|---:|
| Expected sheet order | 12/12 PASS |
| Stored formulas | 253 |
| Equation KATs | 24/24 PASS |
| Workbook QA cells `QA!B5:B24` | 20/20 PASS |
| Formula-error scan | 0 matches |
| Sheets rendered and visually inspected | 12/12 PASS |

Visual review covered title/header hierarchy, table legibility, status coloring, parameter-input emphasis,
the three-series expected-DR chart, formula fixtures, register rendering, and the all-PASS QA sheet. No clipped
load-bearing labels, overlapping chart/table regions, or formula errors were found.

## File digests

```text
curve artifact SHA-256
608d62de357f6ece10eb9a41d90db0dbff31e8b988b99520d357dc6d39bf7a74

capability SHA-256
67c58d7495ef6e68d0ec428297bdc6591ae0093c5bccc2c6dded4a564355483a

known-answer tests SHA-256
89de2489adf4b691f3922dc3d9f3e43bfed3b0f7892b8132f9329bb9292abe9c

workbook SHA-256
2c8bbe93aac79d6c30f07bad3faa5364ce7652a07c1ab59e4d296331467c4b2f
```

## Regression and repository checks

- The historical model-v0.1 validator remains part of the final regression suite.
- Repository-current canonical contracts remain bundle v2 and are checked separately.
- Existing bundle-v3 research proposals are rerun after the additive curve-form schema extension.
- JSON files are syntax checked; CSVs are rectangular; Python helpers compile; `git diff --check` must pass.
- `docs/contracts/machine_readable_artifact_index.json` remains unchanged for this cell.

## Open promotion gates

1. independent valuation review of the paper's ambiguous turbine/tower versus total-turbine denominator;
2. engineering applicability review for target fleets and exact source-model operating/control assumptions;
3. reviewed Hazard adapter for exact axis, selector, pathway, event-family, and exposure semantics;
4. broader component/failure-unit coverage or an explicitly approved partial-product reporting policy;
5. independent consumer KAT replay, shadow comparison, rollback, and removal of hardcoded legacy behavior;
6. formal schema/evaluator review and explicit promotion decision in both repositories.

Until those gates close, the only supportable output is the conditional scalar screening DR for the exact
source-native atom. Dollar loss, whole-turbine loss, whole-plant loss, EAL, PML, VaR, TVaR, and portfolio
metrics remain withheld.
