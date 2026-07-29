# Tropical-cyclone wind × solar — proposed model-v1 reference

## Identity and authorization state

```yaml
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_PERRY_MODULE_SCREENING_V1
semantic_damage_model_version: model v1.0
human_documentation_revision: docs r2
runtime_proposal_revision: docs r1
artifact_schema_version: damage_curve_record_bundle.v3
emit_schema_version: damage_emit.v2
capability_schema_version: capability_declaration.v3
lifecycle_state: release_candidate
promotion_status: proposed_blocked
review_status: deep_curated_noncanonical_no_model_bump
model_grade: screening_remote_sensing_labeled_visible_fraction_with_T4_economic_bridge
strict_evidence_earned_gate: NO_GO_RETAIN_V0_1
coverage_first_exception: deliberate_noncanonical_screening_proposal
canonical_runtime_artifact: false
package_release: unreleased
package_inclusion_status: not_included
curve_record_count: 1
consumer_cutover: none
```

This is the exact reference for the lead human/evidence state and unchanged docs-r1 runtime proposal. It is
not a canonical artifact, runtime pin, package release, or authorization for Hazard consumption. The
preserved strict alternative is
[model v0.1/docs r1](../proposed/README_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md), which has zero
curves and returns `NO_RUNTIME_CURVE` for every numeric request.

## Frozen proposal digests

```text
curve artifact SHA-256  bb01300d3e76114203dd826be5bff4bb9f2b98490880327dd57575007a180840
capability SHA-256      5cd4f5501961a9d7f2c21259b4cfabd9e74eef30b5fdd9ceff72729b83ffc4fc
known-answer tests      2e18603a9efb5cbb8bdd1c7f3b162e1a3e0c4b0723df5e1afbdc27def84f7cd2
audit workbook          748031c226187e3b43d83f6a57b2dbd5554457edc01a06debe16b7ef640f3105
Perry manual CSV        edb34e74cc078bba1fdbe34463abadc794fd416caa66eb64ac3d0ed176ac5e00
```

## Supported source-specific atom

| Field | Exact model-v1 value |
|---|---|
| `failure_unit_id` | `PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT` |
| subsystem | `PV_ARRAY_MODULES_SOURCE_COHORT` |
| component | `VISIBLE_OR_MISSING_MODULE_HARDWARE_MATERIAL_ONLY` |
| subject grain | one complete Perry-compatible ground-mounted nontracking site module population |
| curve ID | `TCWS_PERRY_GROUND_FIXED_VISIBLE_REPLACEMENT_PROXY_V1` |
| output | conditional scalar mean visible-module-hardware material replacement proxy DR |
| mutually exclusive standard unit | `PV_FIXED_TILT_MODULE_FIELD` |

The atom excludes racking, attachments, labor, freight, inspection, hidden module damage, electrical work,
support, and every other plant unit. It is source-cohort specific and makes no utility-scale, CONUS, generic
fixed-tilt, or pure-aerodynamic claim.

## Source cohort

```text
source file rows                       47
ground-mounted rows                    37
ground + tracking=False cohort         35
runtime fit rows                       34
audit-only sparse-tail rows             1
event clusters                          6
```

The fit rows come from Dorian (3), Florence (20), Ian (2), Idalia (1), Maria (4), and Michael (4). The cohort
is explicitly mixed scale because the released manual CSV has no `site_type` column and some system-power
values are missing. At least one physical site recurs across storm records, so the 34 fit rows are neither 34
unique sites nor independent event/site realizations.

## Hazard-axis contract

```yaml
axis_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST_MPS
input_field: perry_event_max_gust_mps
unit: m/s
source_wind_product_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST
valid_range_mps: [17.4, 39.1]
interpolation_policy: linear_between_source_knots
extrapolation_policy: withhold
48_2_mps_source_row: audit_only_not_runtime
```

Perry identifies Visual Crossing API as the study-level provider. The full cohort's row-level station/product,
height, averaging period, exposure standard, query settings, retrieval version, time-of-maximum, and
uncertainty are unresolved. NHC sustained wind, Hazard or ASCE 3-second gust, Saffir-Simpson category, a new
Visual Crossing query, array-height wind, and other gust products are not aliases.

## Required selectors and acknowledgements

Every numeric research request must exactly provide:

```yaml
array_architecture_id: PERRY_GROUND_NONTRACKING_SOURCE_COHORT_V1
source_population_match_id: PERRY_MANUAL_GROUND_NONTRACKING_MIXED_SCALE_V1
module_value_distribution_assumption_id: UNIFORM_MODULE_HARDWARE_VALUE
visible_damage_disposition_assumption_id: FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING
source_wind_product_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST
causal_scope_acknowledgement_id: SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS
```

No field has a default. The final acknowledgement prevents the associated imagery endpoint from being
described as pure wind-pressure fragility. The uniform-value and full-replacement acknowledgements are
Tier-4 economic bridges, not observed source facts.

## Curve record

The curve is an equal-record-weighted PAVA fit, serialized at pooled-block edges and linearly interpolated.
The historical `EQUAL_SITE_WEIGHT_NOT_MODULE_WEIGHTED` flag distinguishes row weighting from module
weighting; it does not establish unique-site independence or predictive validity.

| Knot | x (m/s) | Proxy DR |
|---:|---:|---:|
| 1 | 17.4 | 0.000000000000000 |
| 2 | 18.3 | 0.000000000000000 |
| 3 | 20.7 | 0.000272766560000 |
| 4 | 24.6 | 0.000272766560000 |
| 5 | 24.8 | 0.000955175835000 |
| 6 | 25.1 | 0.000955175835000 |
| 7 | 25.9 | 0.001853190692857 |
| 8 | 29.5 | 0.001853190692857 |
| 9 | 29.8 | 0.004054775905000 |
| 10 | 31.7 | 0.004414548050000 |
| 11 | 37.9 | 0.004414548050000 |
| 12 | 38.9 | 0.018272937632500 |
| 13 | 39.1 | 0.018272937632500 |

The isolated source observation at 48.2 m/s has fraction `0.4142383192`; it is excluded from runtime fitting
and retained in audit lineage. There is no clamp, asymptote, tail law, or curve-intrinsic spread.

The transformation is computationally reproducible but not a scientifically validated prediction for an
unseen source-compatible site. The convenience cohort lacks a sampling frame, architecture/design controls,
cluster-aware inference, and an independent validation event; PAVA and the block-edge ramps impose shape.

## Ordinate meaning

```text
source visible/missing module percentage / 100
  × uniform module-hardware material value assumption
  × full replacement of every visibly affected module-area assumption
  = source-specific module-material replacement proxy DR
```

The proxy can overstate material loss when visible modules are reusable or repairable and understate it when
imagery misses hidden damage. Its bias direction is not known. It excludes installed module cost and all
nonmodule value.

## Withheld units

| Failure unit | Model-v1 result |
|---|---|
| `PV_FIXED_TILT_MODULE_FIELD` | withheld, not zero; source atom is not generic all-damage module response |
| `PV_FIXED_TILT_SUPPORT_STRUCTURE` | withheld, not zero |
| `PV_TRACKER_MODULE_FIELD` | withheld, not zero; tracker population unsupported |
| `PV_TRACKER_SBOS_ASSEMBLY` | withheld, not zero |
| `PV_FOUNDATION` | withheld, not zero |
| `PV_POWER_CONVERSION_AND_COLLECTION` | withheld, not zero; point/line/network split required |
| `PV_GSU_SUBSTATION` | withheld, not zero; facility-level cell-local binding required |
| `PV_SCADA_COMMUNICATIONS` | withheld, not zero |
| `PV_CIVIL_INFRA` | withheld, not zero; mixed bucket requires split |
| `PV_REPLACEMENT_SUPPORT` | withheld; no independent fragility; allocate once after disposition |

Unsupported units return explicit null DR and reason codes. None receives zero or the source-unit curve.

## Value and exposure rules

The scalar response already represents a realized source-site module-field fraction. A second
`at_risk_fraction` is prohibited. Scenario value input is rejected before promotion.

Only a future promoted contract could bind exact site-specific module-hardware material acquisition value,
with currency/vintage, ownership, subject identity, and source-population proof. The NLR module benchmark,
installed cost, array value, physical value, insured value, and full TIV are prohibited runtime denominators.

## Capability

```yaml
failure_unit_scalar_dr: conditional_for_exact_source_atom_only
populated_emit_modes: [scalar_mean]
scenario_loss_given_value_basis: withheld
curve_intrinsic_spread: not_carried
generic_fixed_tilt_module_dr: withheld
tracker_and_all_other_failure_unit_dr: withheld
full_array_damage_ratio: withheld
full_plant_damage_ratio: withheld
scalar_eal: withheld
pml: withheld
var: withheld
tvar: withheld
```

Every conditional scalar result must carry the proposal's noncanonical, remote-sensing, mixed-population,
source-axis, composite-mechanism, visible-only, PAVA, equal-site-weight, event-cluster, sparse-tail,
cross-method-conflict, partial-coverage, no-spread, no-extrapolation, and scenario-dollar-withheld flags.

## Stable fail-closed behavior

- below 17.4 or above 39.1 m/s: `AXIS_OUTSIDE_VALID_RANGE`;
- wrong or missing selector: `SELECTOR_MISMATCH` or `SELECTOR_REQUIRED`;
- wrong wind product: `SELECTOR_MISMATCH`;
- extra module exposure fraction: `EXTRA_EXPOSURE_FRACTION_PROHIBITED`;
- value input: `SCENARIO_LOSS_WITHHELD_NONCANONICAL_PROPOSAL`;
- wrong pathway: `UNSUPPORTED_PATHWAY_ID`;
- unsupported unit: explicit null plus unit-specific reason code; and
- no neighboring, tracker, generic-unit, v0.1, or endpoint-clamp fallback.

## Validation and promotion status

The docs-r2 validator reports `PASS` for the evidence revision, including source and claim addenda, schemas,
capability parity, evaluator/KAT checks, workbook QA, unchanged runtime hashes, v0.1 regression, and canonical
artifact-index exclusion.

The strict evidence-earned gate remains `NO_GO_RETAIN_V0_1`. Canonical runtime, scenario dollars,
annual/tail metrics, and consumer cutover remain blocked. Internal validity does not override the promotion
matrix.

## Authoritative model-v1 files

- [Docs-r2 overview](../proposed/README_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
- [Docs-r2 deep-curation decision](../proposed/DEEP_CURATION_DECISION_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
- [Docs-r2 validation report](../proposed/VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
- [Proposal overview](../proposed/README_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md)
- [Curve artifact](../proposed/tropical_cyclone_wind_solar__model_v1_0__docs_r1__curve_artifact.json)
- [Capability](../proposed/tropical_cyclone_wind_solar__model_v1_0__docs_r1__capability.json)
- [Known-answer tests](../proposed/known_answer_tests_tropical_cyclone_wind_solar__model_v1_0__docs_r1.json)
- [Metadata contract](../proposed/tropical_cyclone_wind_solar_damage_code_metadata_spec__model_v1_0__docs_r1.md)
- [Derivation dossier](../proposed/tropical_cyclone_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md)
- [Validation report](../proposed/VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md)
- [Promotion gates](../proposed/PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md)

## Strict model-v0.1 alternative

- [Fail-closed overview](../proposed/README_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
- [Zero-curve artifact](../proposed/tropical_cyclone_wind_solar__model_v0_1__docs_r1__curve_artifact.json)
- [Validation report](../proposed/VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
