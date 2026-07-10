# Strong wind × solar PV — damage-code metadata spec

**Cell ID:** `STRONG_WIND_SOLAR`  
**Semantic damage-model version:** `model v1.0`  
**Documentation revision:** `docs r1`

---

## 1 · Runtime purpose

The damage code consumes wind hazard intensity and asset metadata and emits failure-unit damage ratios.

It does **not** compute EAL, PML, return-period loss, or insurance metrics.

```text
hazard catalog + asset metadata
      │
      ▼
strong_wind_solar damage code
      │
      ▼
failure-unit DRs + flags
      │
      ▼
external value / financial engine
```

---

## 2 · Required hazard input

| Field | Required? | Unit | Notes |
|---|---:|---|---|
| `gust_3s_mph` | Yes | mph | 3-second gust wind speed. |
| `wind_height_basis` | Conditional | text | Array/tracker height, 10 m, or source-native height. Required if conversion is needed. |
| `wind_direction_deg` | Optional | degrees | Future input for row-orientation / zone loading. |
| `event_duration_hr` | Optional | hr | Open seam; not a v1.0 numeric axis. |

---

## 3 · Required selectors

Selectors are fixed asset attributes.

| Field | Required? | Allowed / example | Effect |
|---|---:|---|---|
| `design_gust_mph` | Yes | e.g. `120` | Normalizes hazard wind into demand ratio. |
| `mounting_type` | Yes | `single_axis_tracker`, `fixed_tilt`, `dual_axis_tracker`, `unknown` | Determines stow applicability and active structural emphasis. |
| `racking_design_type` | Optional | vendor / generic / unknown | Future curve family selector. |
| `module_clamp_type` | Optional | top clamp / through-bolt / unknown | Future module-attachment selector. |
| `foundation_type` | Optional | driven pile / ground screw / concrete / unknown | Future foundation selector. |
| `design_code_basis` | Optional | ASCE 7-16, ASCE 7-22, project-specific | Governance and design-basis metadata. |

---

## 4 · Conditioners

Conditioners are event-time states.

| Field | Required? | Allowed / example | Effect |
|---|---:|---|---|
| `stow_state` | Conditional | `confirmed_stowed`, `unstowed_or_failed`, `probabilistic`, `not_applicable` | Modifies effective demand ratio. |
| `stow_success_probability` | Conditional | 0–1 | Used only when `stow_state = probabilistic`. |
| `stow_angle_deg` | Optional | degrees | Documented; not numerically parameterized in v1.0. |
| `control_availability` | Optional | yes/no/unknown | Future link to stow success. |
| `construction_state` | Optional | operating / under-construction / incomplete | Future vulnerability modifier. |

---

## 5 · Exposure variables

| Field | Required? | Unit / example | Effect |
|---|---:|---|---|
| `array_exposure_fraction` | Yes | 0–1 | Scales affected value. |
| `zone_multiplier` | Conditional | 1.0 interior, 1.15 mixed, 1.35 edge/corner | Multiplies demand ratio. |
| `terrain_topography_multiplier` | Optional | multiplier | Future local demand modifier. |
| `debris_environment` | Optional | low / medium / high | Flag only in v1.0; tornado/debris is deferred. |

---

## 6 · Failure-unit outputs

| Output curve | Subsystem | Component | Output |
|---|---|---|---|
| `SWS_TRACKER_STRUCT` | `MOUNTING` | `TRACKER` | tracker structural DR |
| `SWS_RACKING_STRUCT` | `MOUNTING` | `RACKING_STRUCTURE` | racking/support structural DR |
| `SWS_MODULE_ATTACH` | `PV_ARRAY` | `PV_MODULE` | module attachment/detachment DR |
| `SWS_FOUNDATION_UPLIFT` | `FOUNDATION` | `FOUNDATION_BASE` | foundation/pile support DR |
| `SWS_SCADA_EXPOSED` | `SCADA` | `MET_STATION` / `MONITORING_SYSTEM` | exposed-instrument secondary DR |

---

## 7 · YAML-style damage-code interface

```yaml
damage_code_id: STRONG_WIND_SOLAR_V1
cell_id: STRONG_WIND_SOLAR
model_version: v1.0

hazard_axis:
  id: SWS_GUST_3S_ARRAY_HEIGHT
  input_field: gust_3s_mph
  unit: mph
  native_curve_axis: effective_demand_ratio

selectors:
  required:
    - design_gust_mph
    - mounting_type
  optional:
    - racking_design_type
    - module_clamp_type
    - foundation_type
    - design_code_basis

conditioners:
  conditional:
    - stow_state
    - stow_success_probability
  optional:
    - stow_angle_deg
    - control_availability
    - construction_state

exposure:
  required:
    - array_exposure_fraction
  optional:
    - zone_multiplier
    - terrain_topography_multiplier
    - debris_environment

outputs:
  - curve_id: SWS_TRACKER_STRUCT
    output: tracker_structural_damage_ratio
  - curve_id: SWS_RACKING_STRUCT
    output: racking_structural_damage_ratio
  - curve_id: SWS_MODULE_ATTACH
    output: module_attachment_damage_ratio
  - curve_id: SWS_FOUNDATION_UPLIFT
    output: foundation_uplift_damage_ratio
  - curve_id: SWS_SCADA_EXPOSED
    output: exposed_scada_secondary_damage_ratio

flags:
  - generic_engineering_fit
  - not_claims_calibrated
  - tornado_debris_deferred
  - cascade_dependency_flag
```

---

## 8 · Version semantics

`model v1.0` means these damage-code inputs now produce runtime DR outputs. Future `model v1.1` changes should be used only if the same inputs would produce different DRs.

---

## Repository-current machine-readable artifact and capability declaration

Canonical runtime artifact:

```text
strong_wind_solar__model_v1_0__docs_r3__curve_artifact.json
```

The JSON artifact is the preferred machine-readable source for M3/runtime consumers. The workbook remains a derivation/audit view.

```yaml
capability_declaration:
  schema_version: capability_declaration.v2
  cell_id: strong_wind_solar
  vulnerability_emit:
    failure_unit_scalar_dr: supported
    scenario_loss_given_value_basis: supported_with_explicit_value_and_exposure_basis
    curve_intrinsic_spread: not_carried
  consumer_annual_metrics:
    frequency_driven_annual_loss_distribution: supported_if_consumer_samples_frequency_intensity_coupling_and_applies_caps
    vulnerability_uncertainty_distribution: not_supported_curve_intrinsic_spread_not_carried
    eal: consumer_computable_with_prerequisites
    pml: consumer_computable_from_validated_annual_loss_distribution
    var: consumer_computable_from_validated_annual_loss_distribution
    tvar: consumer_computable_from_validated_annual_loss_distribution
  cap_binding:
    policy: consumer_enforced_fail_closed
    enforcement_owner: downstream_consumer
```

Runtime consumers may compute annual metrics from a validated frequency-driven loss distribution and must
flag that curve-intrinsic vulnerability spread is not carried.
