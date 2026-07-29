# tropical_cyclone_wind_wind damage-code metadata spec — proposed model v1.0/docs r1

## 1. Damage-code identity

```yaml
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_SCREENING_V1
cell_id: tropical_cyclone_wind_wind
semantic_damage_model_version: model v1.0
documentation_revision: docs r1
lifecycle_state: release_candidate
promotion_status: proposed
review_status: pressure_tested_pending_independent_review
model_grade: screening_source_derived_engineering_proxy
artifact_schema_version: damage_curve_record_bundle.v3
artifact_schema_status: proposed_draft
emit_schema_version: damage_emit.v2
capability_schema_version: capability_declaration.v3
proposed_curve_artifact: tropical_cyclone_wind_wind__model_v1_0__docs_r1__curve_artifact.json
proposed_capability: tropical_cyclone_wind_wind__model_v1_0__docs_r1__capability.json
canonical_runtime_artifact: false
current_canonical_pin: null
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: not_included
```

The identity fields are atomic. `proposed`, `noncanonical`, and the model grade are not embedded in the model
version string. This spec describes a review/shadow-evaluation proposal; a production consumer must reject it
until an explicit promotion creates a canonical model/docs/schema/full-SHA pin.

## 2. Pathway contract

| Field | Required | Accepted value | Missing/invalid behavior |
|---|---:|---|---|
| `pathway_id` | yes for evaluation | exact `tropical_cyclone_wind` | reject `PATHWAY_ID_REQUIRED` or `PATHWAY_ID_UNKNOWN`; no default |
| `event_id` | downstream occurrence/loss lineage | non-empty stable ID | not evaluated by the v1 reference helper; downstream occurrence aggregation must withhold if absent |
| `event_family_id` | downstream compound-event lineage | non-empty parent ID | not evaluated by the v1 reference helper; downstream compound aggregation must withhold if absent |

TC-spawned tornadoes, surge, flood, scour, debris, and rain ingress are not aliases for
`tropical_cyclone_wind`. They require distinct pathway/result objects while preserving the common
`event_family_id` needed to prevent double counting.

## 3. Failure-unit identities

| `failure_unit_id` | Physical/value grain | v1 treatment | Numeric output | Runtime reason-code payload when withheld |
|---|---|---|---|---|
| `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT` | one source-defined Jaimes turbine-tower exposure and replacement-cost proxy | conditional primary | scalar expected DR only | domain or conditioner code only when the otherwise supported atom is withheld |
| `WT_TURBINE_EQUIPMENT_ASSEMBLY` | CWER rotor+nacelle+tower repeated unit | withheld | null | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`; `SOURCE_NATIVE_ATOM_NOT_HARMONIZED_TO_STANDARD_EQUIPMENT_ASSEMBLY`; `OMITTED_NON_TOWER_FAILURE_MODES` |
| `WT_FOUNDATION` | one turbine foundation/base | withheld | null | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` |
| `WT_PAD_MOUNTED_ELECTRICAL` | turbine-adjacent transformer/switchgear point or pad | withheld | null | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`; `ELECTRICAL_VALUE_SPLIT_REQUIRED` |
| `WT_COLLECTION_SYSTEM` | collection cable/pole segment, line, or network | withheld | null | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`; `LINE_NETWORK_EXPOSURE_REQUIRED` |
| `WT_GSU_SUBSTATION` | one facility-level GSU transformer/switchyard/control subject | withheld | null | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`; `FACILITY_LEVEL_EXPOSURE_REQUIRED` |
| `WT_CONTROL_BUILDING_AND_SCADA` | control building, SCADA, and communications subject | withheld | null | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` |
| `WT_CIVIL_INFRA` | subject-specific road/pad/building/fence/drainage unit | withheld/split required | null | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`; `MIXED_CIVIL_BUCKET_REQUIRES_SPLIT` |
| `SUPPORT_FIELDWORK` | support allocated after qualified direct damage | support once | no intrinsic DR | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`; `SUPPORT_COST_ALLOCATE_ONCE_AFTER_DISPOSITION`; `NO_INDEPENDENT_FRAGILITY` |
| `SUPPORT_TRANSPORT_LOGISTICS` | support allocated after qualified replacement | support once | no intrinsic DR | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`; `SUPPORT_COST_ALLOCATE_ONCE_AFTER_DISPOSITION`; `NO_INDEPENDENT_FRAGILITY` |

`WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT` is a quarantine boundary. It is not an additional value bucket to sum
beside the CWER turbine-equipment assembly, and it is not a synonym for tower-only value.

`failure_unit_id` is optional in the proposal helper only so one call can return the full declared unit set:
the supported source atom plus explicit null/withheld results for every other unit. When supplied, it must be
one declared ID; an unknown ID rejects `FAILURE_UNIT_ID_UNKNOWN`.

## 4. Native hazard input

### Required evaluated field

| Field | Type/unit | Required | Rule |
|---|---|---:|---|
| `tc_peak_gust_3s_10m_kmh` | finite number, km/h | yes for the supported unit | exact 3-second peak gust at 10 m; nonnegative; no alias inference |

The field name is part of the contract. The evaluator performs no unit, height, averaging-period, terrain,
gust-factor, or source-product conversion.

### Required lineage when a source field was transformed upstream

| Field | Requirement |
|---|---|
| `source_wind_value` | preserve original source value |
| `source_wind_unit` | exact original unit |
| `source_wind_height_m` | exact original reference height |
| `source_wind_averaging_period_s` | exact original averaging duration |
| `source_wind_exposure_standard` | terrain/exposure convention |
| `source_wind_product_id` | model/product and version |
| `source_wind_valid_time` | event timestamp |
| `tc_wind_bridge_id` | versioned bridge that produced the evaluated field |
| `bridge_validity_domain` | proof that the transformation applies |
| `bridge_uncertainty` | transformation uncertainty/quality object |

No bridge is approved by this proposed damage model. A bridge may be carried for shadow evaluation only after
separate governance; source and target values must both remain visible. NHC one-minute wind, category,
hub/rotor wind, generic mph/m/s, and Rose's 10-minute knots cannot be renamed into the evaluated field.

## 5. Runtime domain behavior

```text
if the exact axis field is missing: reject TC_SOURCE_NATIVE_AXIS_REQUIRED
if V is nonfinite or V < 0:         reject AXIS_OUTSIDE_VALID_RANGE
if 0 <= V <= 90:                 scalar_dr = 0
if 90 < V < 108:                 withhold BELOW_SOURCE_SIMULATION_RANGE
if 108 <= V <= 252:              evaluate selected curve
if V > 252:                      withhold ABOVE_SOURCE_SIMULATION_RANGE
```

The zero output at or below 90 km/h is the paper's assumed Eq. 1 branch and must carry
`SOURCE_ASSUMED_NO_DAMAGE_THRESHOLD_NOT_EMPIRICAL`. It is not inferred from absence of observed damage.
Formula values in the open interval 90-108 may be reproduced in audit material but may not enter runtime
emits. Inputs above 252 are neither clamped nor extrapolated.

## 6. Fixed selector contract

The request must carry the exact routing selector and source-state acknowledgement:

```yaml
turbine_archetype_id: <exact enum>
source_model_assumption_set_id: JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED
```

Each artifact record locks the selector to the source tuple:

| `turbine_archetype_id` | artifact `rated_power_mw` | artifact `hub_height_m` | artifact `rotor_diameter_m` | Curve parameter set |
|---|---:|---:|---:|---|
| `TCWW_JAIMES_GENERIC_1MW_HH44_V1` | 1.0 | 44 | 50 | Jaimes 1 MW |
| `TCWW_JAIMES_GENERIC_2P5MW_HH80_V1` | 2.5 | 80 | 90 | Jaimes 2.5 MW |
| `TCWW_JAIMES_GENERIC_3P3MW_HH100_V1` | 3.3 | 100 | 114 | Jaimes 3.3 MW |

Selection rules:

- the evaluator routes by the exact selector ID; the artifact validates the associated numeric tuple;
- consumer asset mapping may assign the ID only when rating/hub/rotor evidence matches that tuple;
- there is no default, alias, nearest-neighbor, rating/hub/rotor interpolation, or probability mixture;
- an actual make/model needs a governed mapping to the exact source class;
- the Amazon Gamesa G114-2.0 has no approved mapping and must return unsupported;
- the 1 MW selector uses Table 2's 44 m and always flags the conflicting 40 m figure/conclusion wording.

Missing selector data returns `TURBINE_ARCHETYPE_REQUIRED`; an unknown ID returns
`TURBINE_ARCHETYPE_UNSUPPORTED`. Missing or unsupported source-state acknowledgement returns
`SOURCE_MODEL_ASSUMPTION_SET_REQUIRED` or `SOURCE_MODEL_ASSUMPTION_SET_UNSUPPORTED`.

## 7. Source-model state and event-time conditioners

The source configuration must be preserved as:

```yaml
source_model_assumption_set_id: JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED
```

Jaimes describes blades as feathered/minimum drag in section 3.3.1, then describes a parked,
chord-horizontal setup with no pitch angle in section 3.3.2. All simulations use wind parallel to the rotor
axis and no yawing. Because those statements are not fully consistent, the proposal does not translate them
into a generic protected/failed control state or a numeric credit.

The runtime conditioner is:

| `actual_operating_control_state` | v1 behavior |
|---|---|
| absent | no independently verified state; required source-assumption acknowledgement still governs |
| `known_consistent_with_source_assumption` | evaluate with no numeric credit |
| `unknown` | evaluate and flag `SOURCE_MODEL_CONTROL_STATE_UNKNOWN`; no credit |
| `known_inconsistent_with_source_assumption` | withhold `SOURCE_MODEL_CONTROL_STATE_MISMATCH` |

Other research/context fields have no numeric modifier:

| Conditioner field | Allowed/example values | v1 effect | Unknown behavior |
|---|---|---|---|
| `operational_state` | operating/parked/stopped/emergency/unknown | metadata only | flag; no curve switch |
| `yaw_state` | active/fixed/aligned/off-axis/unknown | metadata only | flag; no Rose/default switch |
| `pitch_state` | feathered/commanded/unavailable/unknown | metadata only | flag; no credit |
| `brake_state` | applied/released/failed/unknown | metadata only | flag |
| `grid_state` | energized/lost/unstable/unknown | metadata only | no destruction inference |
| `backup_power_state` | available/unavailable/exhausted/unknown | metadata only | no protection credit |
| `duration_above_threshold_s` | nonnegative + threshold ID/unknown | research descriptor | flag |
| `direction_change_deg` | degrees + window/unknown | research descriptor | flag |
| `turbulence_descriptor` | value + definition/unknown | research descriptor | flag |
| `control_history_basis` | SCADA/reconstruction/design/unknown | provenance | flag |

Unknown conditioner state never chooses an archetype, alters DR, or earns resilience credit.

## 8. Exposure and subject fields

| Field | Required for aggregation | Rule |
|---|---:|---|
| `asset_id` | yes | wind-farm identity |
| `asset_subject_id` | yes | exact repeated turbine/source-unit identity |
| `asset_subject_grain` | yes | `turbine_point` for the supported source unit |
| `subject_geometry` | yes | point/reference with CRS and lineage |
| `horizontal_crs` | yes | exact CRS |
| `geometry_date` | yes | as-built/current lineage |
| `geometry_accuracy_m` | recommended | exposure uncertainty |
| `per_subject_delivered_demand` | yes | do not evaluate DR of a farm-average gust in place of per-unit demand |
| `exposed_subject_count_or_ids` | for aggregation | no default whole-farm exposure |

Foundation, pad, collection, GSU, control, and civil subjects require separate objects and geometries. A
turbine count or lease-polygon fraction cannot be broadcast to them.

## 9. Curve-record contract

```yaml
curve_form: thresholded_weibull_expected_damage
x_axis: tc_peak_gust_3s_10m_kmh
y_axis: failure_unit_damage_ratio
failure_unit_id: WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT
pathway_id: tropical_cyclone_wind
parameters:
  V_zero_kmh: 90
  delta_V50_kmh: <106.77 | 82.52 | 73.30>
  rho: <8.94 | 4.54 | 4.99>
  V_at_DR50_kmh: <196.77 | 172.52 | 163.30>
  max_dr: 1
selector_match:
  turbine_archetype_id: <exact source class>
  rated_power_mw: <exact source rating>
  hub_height_m: <exact source hub height>
  rotor_diameter_m: <exact source rotor diameter>
```

Evaluation for the mathematical curve is:

```text
DR(V) = 0,                                                         V <= V_zero
DR(V) = max_dr * [1 - 0.5^(((V - V_zero)/delta_V50)^rho)],        V > V_zero
```

Semantic validation must prove `V_at_DR50_kmh = V_zero_kmh + delta_V50_kmh`, positive `delta_V50_kmh` and
`rho`, `max_dr = 1`, selector uniqueness, exact pathway/failure-unit identity, and monotone bounded outputs.
Runtime domain withholding is applied in addition to the mathematical function.

## 10. Y-axis and value boundary

The numeric ordinate means:

```text
conditional expected direct repair-or-replacement cost ratio
of the source-defined Jaimes turbine-tower exposure unit
relative to the paper's per-turbine replacement-cost proxy
```

It does not mean:

- physical tower-only replacement ratio;
- CWER `WT_TURBINE_EQUIPMENT_ASSEMBLY` DR;
- foundation, BOS, GSU, collection, control, civil, or support DR;
- full physical/installed TIV DR;
- affected-turbine fraction, farm failure probability, or annual loss.

Jaimes is all-severity only over tower damage states DS1-DS3. Rotor, blades, and nacelle act as modeled loads
or masses but do not receive independent failure states. Field evidence of blade replacements on surviving
towers demonstrates why the source result cannot be called an all-component turbine-equipment curve.

## 11. Value fields and dollar-loss withholding

| Field | v1 status |
|---|---|
| `value_basis_id` | source audit label is `JAIMES_CT_H_SOURCE_NATIVE_REPLACEMENT_PROXY`; not runtime-approved |
| `direct_replacement_value_usd` for source unit | no approved site binding |
| `cwer_turbine_equipment_value` | may be retained as reference; cannot bind this DR |
| `full_plant_tiv` | prohibited denominator for this DR |
| `support_cost_allocation_rule` | open; no independent support DR |
| `scenario_loss_usd` with a CWER/site denominator | withheld `SOURCE_DENOMINATOR_CROSSWALK_NOT_APPROVED` |
| `scenario_loss_usd` with the source proxy while noncanonical | withheld `NONCANONICAL_PROPOSAL_NO_SCENARIO_LOSS` |

Supplying a dollar value does not override the capability declaration. A future binding must resolve the
source boundary and prove one-to-one value scope without double counting the standard turbine assembly.

The audit-only source values are `Ct(h)=1307.9*h^1.82`: `1,281,322.377752261`,
`3,803,630.4553727144`, and `5,709,190.569869134` source-nominal USD for the three selectors. Their vintage
and physical scope are insufficient for a runtime site-value binding.

## 12. Output contract

### Supported proposal/shadow result

The full object follows `damage_emit.v2`; the representative `failure_unit_results` member below shows the
populated scalar fields. Spread/state fields are omitted rather than serialized as JSON nulls.

```yaml
pathway_id: tropical_cyclone_wind
failure_unit_id: WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT
curve_id: <one exact TCWW_JAIMES_*_SCREENING curve ID>
subsystem: REPEATED_TURBINE_SOURCE_NATIVE
component: TOWER_TRIGGERED_SINGLE_TURBINE_RECORD_JAIMES
status: supported
scalar_central_dr: <0..1 when domain and selector pass>
withheld_reason_codes: []
metadata_flags:
  - NONCANONICAL_PROPOSAL
  - SCREENING_SOURCE_DERIVED_ENGINEERING_PROXY
  - NOT_FIELD_CALIBRATED
  - NOT_CLAIMS_CALIBRATED
  - SOURCE_DENOMINATOR_SCOPE_AMBIGUOUS
  - PARTIAL_FAILURE_UNIT_COVERAGE
  - CURVE_INTRINSIC_SPREAD_NOT_CARRIED
  - SOURCE_MODEL_ASSUMPTION_SET_ACKNOWLEDGED
```

The capability declaration always discloses
`SOURCE_MODEL_CONTROL_STATE_INTERNALLY_INCONSISTENT` and
`SOURCE_ASSUMED_NO_DAMAGE_THRESHOLD_NOT_EMPIRICAL` as model limitations. At result level, the zero branch
adds `SOURCE_ASSUMED_NO_DAMAGE_THRESHOLD_NOT_EMPIRICAL`; the 1 MW class adds
`SOURCE_1MW_HUB_HEIGHT_TABLE_44M_FIGURE_CAPTION_40M`; and an unknown actual control state adds
`SOURCE_MODEL_CONTROL_STATE_UNKNOWN`. A known mismatch withholds instead of emitting.

### Withheld outputs

| Request | Status/reason |
|---|---|
| `90 < V < 108` | withheld `BELOW_SOURCE_SIMULATION_RANGE` |
| `V > 252` | withheld `ABOVE_SOURCE_SIMULATION_RANGE` |
| standard CWER turbine-equipment unit | withheld with the three exact codes in section 3, including `SOURCE_NATIVE_ATOM_NOT_HARMONIZED_TO_STANDARD_EQUIPMENT_ASSEMBLY` and `OMITTED_NON_TOWER_FAILURE_MODES` |
| foundation/pad/collection/GSU/control/civil/support | withheld with the exact unit-specific payload in section 3 |
| CWER/site-dollar scenario loss | withheld `SOURCE_DENOMINATOR_CROSSWALK_NOT_APPROVED` |
| source-proxy scenario loss before promotion | withheld `NONCANONICAL_PROPOSAL_NO_SCENARIO_LOSS` |
| EAL/PML/VaR/TVaR | withheld; downstream-owned and noncanonical |

Null is not zero. A withheld result never inherits a legacy or Hazard placeholder curve.

## 13. Rejection and fail-closed rules

Reject or withhold without numeric fallback when:

- `pathway_id`, native axis field, selector ID, or source-assumption acknowledgement is missing or
  unsupported, or a supplied failure-unit ID is unknown;
- unit, height, or averaging semantics do not match the native axis;
- an actual turbine is mapped by proximity rather than an approved exact mapping;
- input lies in the 90-108 gap or above 252;
- a request applies the source DR to CWER equipment, foundation, electrical/GSU, civil, support, or full TIV;
- a request asks for dollars without an approved source-unit denominator/value binding;
- a consumer asks for variance/bounds/state probabilities that model v1.0 does not carry;
- any model/docs/schema/artifact-SHA/capability/KAT pin is missing or stale;
- a production consumer attempts to load the proposal while `canonical_runtime_artifact=false`.

## 14. Capability declaration

Authoritative standalone proposal:

```text
tropical_cyclone_wind_wind__model_v1_0__docs_r1__capability.json
```

Embedded and standalone declarations must be semantically identical. The supported source-unit scalar DR is
conditional; scenario loss is withheld; intrinsic spread is not carried; standard units are withheld; and
annual metrics remain withheld before promotion. Completeness of request fields cannot broaden capability.

## 15. Consumer preflight and pin contract

Before any evaluation, verify:

1. exact `model v1.0` + `docs r1` + bundle v3 + capability v3 + emit v2 identities;
2. full artifact, capability, KAT, and schema SHA equality;
3. `canonical_runtime_artifact` policy appropriate to review versus production;
4. exact pathway, failure unit, native axis, domain, selector ID, pinned source tuple, and source-assumption
   acknowledgement;
5. no prohibited denominator/value/exposure conversion;
6. no legacy, hardcoded, or default curve path;
7. KATs pass in the consumer runtime.

Any failure returns a structured rejection/withheld object. It must not silently execute the old Hazard
curve, the v0.1 no-curve scaffold under a new label, or an unpinned copy of the proposed function.

## 16. Version and promotion rule

This is a `NEW_CELL_MODEL_RELEASE` plus `MODEL_BEHAVIOR_CHANGE` and `SCHEMA_CONTRACT_CHANGE` proposal. It is
deliberately absent from the canonical artifact index/current pointer. Promotion requires the repository and
consumer gates in the promotion matrix, an explicit reviewed decision, atomic registry/index/changelog
updates, a full SHA pin, and a verified rollback path. Until then, no reportable production output is
authorized.
