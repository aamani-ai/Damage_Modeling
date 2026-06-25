# Strong wind × solar PV — damage-code metadata spec v0.1

**Cell:** `STRONG_WIND_SOLAR`
**Semantic model version:** `v0.1 scaffold`
**Purpose:** define the runtime inputs, selectors, conditioners, exposure variables, outputs, and open seams for future strong-wind solar damage codes.

---

## 1. Runtime concept

```text
hazard input
   → selected failure-unit curve
   → conditioned by operating state
   → scaled by exposed footprint / structural zone
   → applied to linked value bucket
```

The damage-code layer outputs damage ratios and flags. It does not calculate EAL, PML, or portfolio metrics.

---

## 2. Required hazard inputs

| Field | Unit | Required? | Notes |
|---|---:|---:|---|
| `gust_3s_array_height_mps` | m/s | preferred | 3-second gust at array/tracker height. |
| `gust_3s_source_height_mps` | m/s | optional | Hazard-native height before height conversion. |
| `wind_direction_deg` | degrees | optional | Used for row orientation / angle-of-attack conditioner. |
| `hazard_pathway` | enum | required | `straight_line_gust`, `hurricane_gust`, `derecho_gust`; `tornado_debris_swath` deferred. |

---

## 3. Selectors

Selectors are fixed asset attributes that choose curve families or resistance classes.

| Selector | Applies to | Example values |
|---|---|---|
| `mounting_type` | mounting/racking | `fixed_tilt`, `single_axis_tracker`, `dual_axis_tracker` |
| `tracker_type` | tracker | vendor/model or `single_axis_generic` |
| `racking_design_class` | racking | `standard`, `storm_hardened`, `unknown` |
| `design_wind_speed_mps` | all structural curves | site / design basis |
| `module_clamp_type` | module detachment | `top_down_clamp`, `through_bolted`, `unknown` |
| `foundation_type` | foundation | `driven_pile`, `ground_screw`, `ballast`, `unknown` |
| `soil_class_or_capacity` | foundation | site-specific if available |
| `module_format` | module/clamp | `framed`, `frameless`, `large_format`, `unknown` |

---

## 4. Conditioners

Conditioners are event-time states that modify vulnerability.

| Conditioner | Applies to | Notes |
|---|---|---|
| `stow_state` | trackers | `stowed`, `unstowed`, `unknown`, `not_applicable` |
| `stow_angle_deg` | trackers | actual or assumed angle during event |
| `stow_success_probability` | trackers | used only if state unknown |
| `control_availability` | trackers / SCADA | whether stow command/control was available |
| `wind_direction_relative_to_rows_deg` | trackers/fixed tilt | affects angle of attack / pressure demand |
| `maintenance_condition` | fasteners/clamps | placeholder for torque audit / degraded fasteners |

---

## 5. Exposure variables

Exposure variables determine how much value is affected.

| Exposure variable | Meaning |
|---|---|
| `array_exposure_fraction` | fraction of array in damaging wind footprint |
| `edge_zone_fraction` | fraction of exposed array in edge/corner/high-pressure zones |
| `interior_zone_fraction` | fraction of exposed array in sheltered interior |
| `terrain_exposure_class` | ASCE-style terrain exposure / roughness class if available |
| `topographic_factor` | ridge/slope/channeling factor if known |
| `debris_environment` | loose equipment / debris potential; v0.1 flag only |
| `wind_calming_or_screening` | fence/windbreak/protection flag; v0.1 modifier only |

---

## 6. Failure-unit records

| Damage code ID | Failure-unit | Subsystem | Component | Role |
|---|---|---|---|---|
| `SWS_TRACKER_STRUCT` | tracker torque-tube / drive structural wind loading | `MOUNTING` | `TRACKER` | primary |
| `SWS_RACKING_UPLIFT` | racking uplift / deformation | `MOUNTING` | `RACKING_STRUCTURE` | primary |
| `SWS_MODULE_CLAMP_DETACH` | module detachment / clamp failure / breakage | `PV_ARRAY` | `PV_MODULE` | primary |
| `SWS_FOUNDATION_UPLIFT` | pile uplift / pullout / support failure | `FOUNDATION` | `FOUNDATION_BASE` | primary |
| `SWS_WIRE_MGMT_CONSEQ` | consequential wire-management damage | `ELECTRICAL_COLLECTION` | `CABLE_DC` / `CABLE_AC` | secondary |
| `SWS_SCADA_MET_WIND` | exposed met station / instrument damage | `SCADA` | `MET_STATION` | secondary |
| `SWS_INVERTER_ENCLOSURE_WIND` | enclosure/debris/wind-driven rain damage | `INVERTER_SYSTEM` | `INVERTER` | secondary/deferred |

---

## 7. Output fields

| Output | Meaning |
|---|---|
| `failure_unit_damage_ratio` | DR for the selected failure-unit. |
| `damage_state` | optional state label if using piecewise/state curve. |
| `curve_family_id` | selected curve family. |
| `selector_flags` | missing or defaulted selector metadata. |
| `conditioner_flags` | missing stow / control / wind direction data. |
| `exposure_flags` | exposure approximation flags. |
| `open_seam_flags` | tornado, debris, wind-driven rain, claims calibration, etc. |

---

## 8. Example damage-code object

```yaml
damage_code_id: SWS_MODULE_CLAMP_DETACH
cell_id: STRONG_WIND_SOLAR
model_version: v0.1_scaffold
status: not_parameterized

hazard_axis:
  id: SWS_GUST_3S_ARRAY_HEIGHT
  input_field: gust_3s_array_height_mps
  unit: m/s

failure_unit:
  subsystem: PV_ARRAY
  component: PV_MODULE
  failure_mode: module_detachment_clamp_failure_breakage

selectors:
  - module_clamp_type
  - mounting_type
  - racking_design_class
  - design_wind_speed_mps

conditioners:
  - stow_state
  - stow_angle_deg
  - wind_direction_relative_to_rows_deg

exposure:
  - array_exposure_fraction
  - edge_zone_fraction
  - terrain_exposure_class

value_link:
  value_bucket: PV_ARRAY_MODULE_ATTACHMENT_EXPOSED
  f_kind: footprint_structural_zone_exposure

outputs:
  - failure_unit_damage_ratio
  - selected_curve_family
  - open_seam_flags
```

---

## 9. v0.1 boundary

This metadata spec is ready for scaffold review. It is not yet a runtime curve.
