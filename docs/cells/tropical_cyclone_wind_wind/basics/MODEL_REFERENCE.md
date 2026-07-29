# Tropical-cyclone wind × onshore wind model reference

```yaml
cell_id: tropical_cyclone_wind_wind
pathway_id: tropical_cyclone_wind
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_SCREENING_V1
semantic_damage_model_version: model v1.0
human_documentation_revision: docs r1
lifecycle_state: release_candidate
promotion_status: proposed
model_grade: screening_source_derived_engineering_proxy
artifact_schema: damage_curve_record_bundle.v3
artifact_schema_status: proposed_draft
capability_schema: capability_declaration.v3
emit_schema: damage_emit.v2
consumer_pin: none
canonical_runtime_artifact: false
artifact_sha256: 608d62de357f6ece10eb9a41d90db0dbff31e8b988b99520d357dc6d39bf7a74
capability_sha256: 67c58d7495ef6e68d0ec428297bdc6591ae0093c5bccc2c6dded4a564355483a
known_answer_tests_sha256: 89de2489adf4b691f3922dc3d9f3e43bfed3b0f7892b8132f9329bb9292abe9c
```

## Authority and interpretation

The proposed [curve artifact](../proposed/tropical_cyclone_wind_wind__model_v1_0__docs_r1__curve_artifact.json),
[standalone capability](../proposed/tropical_cyclone_wind_wind__model_v1_0__docs_r1__capability.json), and
[known-answer tests](../proposed/known_answer_tests_tropical_cyclone_wind_wind__model_v1_0__docs_r1.json)
control exact proposal behavior. The [dossier](../proposed/tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_0__docs_r1.md),
[metadata specification](../proposed/tropical_cyclone_wind_wind_damage_code_metadata_spec__model_v1_0__docs_r1.md),
registers, and workbook explain the evidence and derivation.

This reference describes a noncanonical shadow/review product. A production consumer must reject it until an
explicit promotion creates a current pointer, artifact-index entry, full pin, and authorized migration.

## Supported failure unit and ordinate

| Field | Exact meaning |
|---|---|
| `failure_unit_id` | `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT` |
| subject grain | one qualifying turbine point |
| ordinate | conditional expected direct repair-or-replacement cost ratio |
| denominator | Jaimes per-turbine/turbine-tower replacement-cost proxy `Ct(h)` |
| coverage | tower damage states DS1-DS3 in the source model |
| model grade | source-derived screening engineering proxy; not field/claims calibrated |

The unit is a quarantine boundary. It is mutually exclusive with `WT_TURBINE_EQUIPMENT_ASSEMBLY` and is not
an additional bucket to add beside it. Rotor, blade, nacelle, foundation, electrical, GSU, control, civil,
and support failure modes are not implied by the source-unit DR.

## Hazard input contract

| Field | Type/unit | Requirement | Missing or invalid behavior |
|---|---|---:|---|
| `pathway_id` | exact enum | required | reject unless `tropical_cyclone_wind` |
| `tc_peak_gust_3s_10m_kmh` | finite nonnegative number, km/h | required | reject; no alias inference |
| `turbine_archetype_id` | exact v1 enum | required | reject unsupported/missing selector |
| `source_model_assumption_set_id` | exact enum | required | reject unsupported/missing acknowledgement |
| `failure_unit_id` | declared unit ID | optional routing filter | reject unknown unit; omission may return all declared unit results |
| `actual_operating_control_state` | exact enum | capture if known | known mismatch withholds; unknown flags |

`tc_peak_gust_3s_10m_kmh` means a 3-second peak gust at 10 m. The evaluator performs no unit, height,
averaging-period, terrain, gust, or rotor conversion. NHC one-minute wind, Saffir-Simpson category,
hub-height wind, mph, m/s, knots, and Rose's 10-minute wind are not aliases.

When an upstream bridge produced this quantity, consumers must preserve the original source value, unit,
height, averaging period, exposure convention, product/version, valid time, bridge ID, validity domain, and
uncertainty. No such bridge is approved by this model.

## Runtime domain

| Input `V` | Status | Numeric result / reason |
|---:|---|---|
| nonfinite or `< 0` | rejected | `AXIS_OUTSIDE_VALID_RANGE` |
| `0 <= V <= 90` | supported | `scalar_central_dr = 0`; flag `SOURCE_ASSUMED_NO_DAMAGE_THRESHOLD_NOT_EMPIRICAL` |
| `90 < V < 108` | withheld | `BELOW_SOURCE_SIMULATION_RANGE` |
| `108 <= V <= 252` | supported | evaluate the exact selected record |
| `V > 252` | withheld | `ABOVE_SOURCE_SIMULATION_RANGE` |

The mathematical function exists above 90, but runtime values in the 90-108 gap remain withheld. The
`V <= 90` zero is source-assumed, not empirically demonstrated immunity. Values above 252 are not clamped or
extrapolated.

## Curve-record contract

```yaml
curve_form: thresholded_weibull_expected_damage
x_axis: tc_peak_gust_3s_10m_kmh
y_axis: failure_unit_damage_ratio
failure_unit_id: WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT
pathway_id: tropical_cyclone_wind
parameters:
  V_zero_kmh: 90
  delta_V50_kmh: <record value>
  rho: <record value>
  V_at_DR50_kmh: <90 + delta_V50_kmh>
  max_dr: 1
```

```text
DR(V) = 0,                                                        V <= V_zero
DR(V) = max_dr * [1 - 0.5^(((V - V_zero) / delta_V50)^rho)],     V > V_zero
```

| Curve ID | Selector ID | Rating MW | Hub m | Rotor m | `delta_V50` km/h | `rho` | `V_at_DR50` km/h |
|---|---|---:|---:|---:|---:|---:|---:|
| `TCWW_JAIMES_1MW_44M_SCREENING` | `TCWW_JAIMES_GENERIC_1MW_HH44_V1` | 1.0 | 44 | 50 | 106.77 | 8.94 | 196.77 |
| `TCWW_JAIMES_2P5MW_80M_SCREENING` | `TCWW_JAIMES_GENERIC_2P5MW_HH80_V1` | 2.5 | 80 | 90 | 82.52 | 4.54 | 172.52 |
| `TCWW_JAIMES_3P3MW_100M_SCREENING` | `TCWW_JAIMES_GENERIC_3P3MW_HH100_V1` | 3.3 | 100 | 114 | 73.30 | 4.99 | 163.30 |

Semantic validation requires positive `delta_V50` and `rho`, `max_dr = 1`, exact selector uniqueness,
`V_at_DR50 = V_zero + delta_V50`, monotonicity, bounds, exact axis/pathway/unit identities, and reproduction
of the known-answer tests.

## Selector contract

Selection is by exact `turbine_archetype_id`. The artifact's rating, hub height, and rotor diameter are
locked facts for that selector, not independent fuzzy matching fields.

Prohibited behavior includes:

- default or alias selection;
- nearest-neighbor or “closest rating” mapping;
- interpolation among the three records;
- probabilistic mixing;
- automatic transfer to an actual make/model or modern fleet; and
- mapping the Amazon Gamesa G114-2.0 placeholder to a source class.

The 1 MW record uses Table 2's 44 m hub height and carries
`SOURCE_1MW_HUB_HEIGHT_TABLE_44M_FIGURE_CAPTION_40M` because the source also states 40 m elsewhere.

## Source-state and conditioner contract

Required acknowledgement:

```yaml
source_model_assumption_set_id: JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED
```

| `actual_operating_control_state` | Behavior |
|---|---|
| absent | evaluate only if the required source-assumption acknowledgement is present; no independent state claim |
| `known_consistent_with_source_assumption` | evaluate; no numeric credit |
| `unknown` | evaluate and flag `SOURCE_MODEL_CONTROL_STATE_UNKNOWN`; no credit |
| `known_inconsistent_with_source_assumption` | withhold `SOURCE_MODEL_CONTROL_STATE_MISMATCH` |

The acknowledgement preserves the paper's generic fixed-base steel-tower setup, wind parallel to the rotor,
no yawing, and its internally inconsistent feathered/minimum-drag versus parked/no-pitch wording. It does not
assert a generic parked, protected, or emergency state.

Operational, yaw, pitch, brake, grid, backup-power, duration, veer, turbulence, and control-history fields
may be carried as provenance/context, but none changes DR in model v1.0.

## Failure-unit coverage

| ID | Grain | v1 status | Exact guardrail |
|---|---|---|---|
| `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT` | one turbine point | conditional scalar mean DR | exact axis, selector, source-state, domain, and conditioner rules |
| `WT_TURBINE_EQUIPMENT_ASSEMBLY` | rotor+nacelle+tower repeated unit | withheld | source-native atom not harmonized; omitted non-tower modes |
| `WT_FOUNDATION` | one turbine foundation | withheld | no runtime curve |
| `WT_PAD_MOUNTED_ELECTRICAL` | turbine/cluster point or pad | withheld | electrical value split required |
| `WT_COLLECTION_SYSTEM` | segment/line/network | withheld | line/network exposure required |
| `WT_GSU_SUBSTATION` | one shared facility/yard | withheld | facility-level exposure required; never repeat per turbine |
| `WT_CONTROL_BUILDING_AND_SCADA` | subject-specific point/building | withheld | no runtime curve |
| `WT_CIVIL_INFRA` | split road/pad/building/fence/drainage subjects | withheld | mixed bucket requires split |
| `SUPPORT_FIELDWORK` | post-damage work scope | no intrinsic DR | allocate once after disposition |
| `SUPPORT_TRANSPORT_LOGISTICS` | post-damage logistics scope | no intrinsic DR | allocate once after disposition |

Withheld is null, not zero. No standard unit inherits the Jaimes curve or a turbine-point exposure fraction.

## Exposure contract

For aggregation, preserve:

- `asset_id` and exact `asset_subject_id`;
- `asset_subject_grain = turbine_point` for the supported unit;
- point geometry, CRS, geometry date, accuracy, and lineage;
- per-subject delivered demand; and
- explicit exposed subject IDs or count.

A farm-average gust is not automatically a per-turbine delivered demand. Foundation points, pad points,
collection lines/networks, the shared GSU yard, control subjects, and civil geometry require their own
objects. A turbine count or lease-polygon fraction cannot be broadcast to them.

## Value and dollar-loss boundary

The Jaimes audit proxy is:

```text
Ct(h) = 1307.9 * h^1.82 source-nominal USD
```

The source's wording does not establish whether this is cleanly tower-only, turbine-equipment, or whole
turbine value. Consequently:

| Value/output request | v1 status |
|---|---|
| source-proxy value in audit material | retained for denominator review |
| CWER turbine-equipment value | reference only; cannot bind this DR |
| site/full-plant TIV | prohibited denominator |
| source-unit dollar loss | withheld while noncanonical and denominator-unapproved |
| site/scenario/farm dollar loss | withheld |
| support-cost allocation | open; no independent support curve |

Supplying a value does not broaden capability or convert the curve to a standard asset unit.

## Output contract and reportability

For a fully supported request, the source atom may populate:

```yaml
status: supported
failure_unit_id: WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT
scalar_central_dr: <0..1>
curve_intrinsic_spread: not_carried
scenario_loss: withheld
```

Core limitation flags include:

- `NONCANONICAL_PROPOSAL`;
- `SCREENING_SOURCE_DERIVED_ENGINEERING_PROXY`;
- `NOT_FIELD_CALIBRATED`;
- `NOT_CLAIMS_CALIBRATED`;
- `SOURCE_DENOMINATOR_SCOPE_AMBIGUOUS`;
- `PARTIAL_FAILURE_UNIT_COVERAGE`;
- `SOURCE_MODEL_CONTROL_STATE_INTERNALLY_INCONSISTENT`;
- `CURVE_INTRINSIC_SPREAD_NOT_CARRIED`; and
- `NO_NHC_OR_HUB_HEIGHT_BRIDGE`.

Reportability matrix:

| Metric | Capability |
|---|---|
| source-unit scalar mean DR | conditional |
| standard-unit or plant DR | withheld |
| curve spread/state probabilities | not carried |
| dollar/scenario/plant loss | withheld |
| EAL/PML/VaR/TVaR | downstream-owned; withheld before and after promotion while coverage/value gaps remain |

## Consumer preflight

Before shadow evaluation, verify:

1. exact model/docs/artifact/capability/emit identities and full SHAs;
2. noncanonical policy allows review-only execution;
3. exact pathway, source-native axis, domain, selector, source-state acknowledgement, and failure unit;
4. actual control state is not known inconsistent;
5. no prohibited value, exposure, or unit conversion;
6. all unsupported units remain explicit nulls; and
7. known-answer tests pass in the consumer runtime.

Production use must additionally reject the proposal while `canonical_runtime_artifact=false`. No failure may
fall back to a legacy Hurricane/Hazard function or the v0.1 scaffold under a new label.

## Validation and promotion status

The package is a proposed release candidate. Promotion remains blocked until independent equation and KAT
reproduction, valuation review, engineering applicability review, bundle-v3 curve-form approval, a pin-aware
Hazard adapter, partial-coverage and compound-event tests, shadow comparison, rollback readiness, and an
explicit decision are complete.

No artifact index, `current/` pointer, package release, canonical pin, or Hazard runtime behavior is changed.

## Version history

| Version | Curve behavior | Status |
|---|---|---|
| model v0.1/docs r1 | zero curve records; all numeric outputs fail closed | preserved historical scaffold |
| model v1.0/docs r1 | three exact Jaimes expected-DR records for the quarantined source unit | current documentation anchor; proposed and noncanonical |

The [v0.1 package](../proposed/README_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md) and
[v0.1 pressure test](../proposed/PRESSURE_TEST_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md) remain
part of the audit trail. Their generic-transfer and denominator warnings remain active; only the narrow claim
that no economic DR exists is superseded by the v1 source-native adoption.
