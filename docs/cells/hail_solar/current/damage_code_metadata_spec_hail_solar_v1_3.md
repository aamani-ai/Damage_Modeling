# Hail × Solar Damage-Code Metadata Spec v1.3

This file defines the metadata contract for the **hail × solar** damage code. v1.3 adds explicit derivation/provenance fields and clarifies selector/conditioner adjustment logic.

---

## 1. Damage-code identity

```yaml
damage_code_id: HAIL_SOLAR_PV_MODULE_V1
version: 1.3
hazard: hail
asset_class: solar_pv
primary_failure_unit: PV_MODULE_GLASS_CELL
curve_output_grain: failure_unit_damage_ratio
```

---

## 2. Hazard input

| Field | Required | Type | Unit | Notes |
|---|---:|---|---|---|
| `mesh_diameter_mm` | Yes | number | mm | Primary operational x-axis: MESH-equivalent maximum hail diameter. |
| `hail_size_source` | Recommended | enum | n/a | `observed_report`, `MRMS_MESH`, `vendor_map`, `lab_test`, `scenario`. |
| `source_unit` | Optional | enum | n/a | `mm`, `in`. Convert to mm internally. |

---

## 3. Optional physics bridge

| Field | Required | Type | Unit | Notes |
|---|---:|---|---|---|
| `impact_ke_proxy_j` | Optional / derived | number | J/impact | Per-stone impact-energy proxy. Do not confuse with J/m² event flux. |
| `bridge_assumption_version` | Conditional | string | n/a | Required if KE proxy is used. |
| `bridge_notes` | Conditional | text | n/a | Mass/velocity assumptions. |

The current KE bridge is a vertical-fall reference bridge. It does not include event wind vector, tracker orientation, or contact-normal impact energy.

---

## 4. Selectors — fixed asset attributes

Selectors choose or shift the curve family.

| Field | Required | Type | Example | Notes |
|---|---:|---|---|---|
| `module_archetype` | Yes unless exact specs available | enum | `default_3_2mm_glass_backsheet` | Main v1 selector. |
| `front_glass_thickness_mm` | Recommended | number | `3.2` | Important hail vulnerability metadata. |
| `tempered_glass` | Recommended | boolean | `true` | Hail-linked PV module spec. |
| `glass_glass_vs_backsheet` | Recommended | enum | `glass_backsheet` | Used to classify archetype. |
| `hail_test_rating` | Optional / high value | string | `IEC baseline / enhanced / 50mm / 75mm` | If available, can override generic archetype. |
| `manufacturer_model` | Optional | string | n/a | Used for override and provenance. |
| `bom_test_report_id` | Optional / high value | string | n/a | Links to exact BOM hail test evidence if available. |

---

## 5. Conditioners — event-time states

Conditioners shift vulnerability during the event.

| Field | Required | Type | Example | Notes |
|---|---:|---|---|---|
| `mounting_type` | Yes | enum | `single_axis_tracker` | Determines whether stow applies. |
| `stow_applicable` | Derived | boolean | `true` | Fixed tilt generally `false`; trackers generally `true`. |
| `stow_state` | Conditional | enum | `unknown_probabilistic` | `not_applicable`, `unstowed`, `stowed`, `unknown_probabilistic`. |
| `stow_angle_deg` | Conditional | number | `60` | Required if using explicit stowed curve; v1.3 stores but does not continuously calibrate by angle. |
| `stow_trigger` | Optional | enum | `weather_alert` | manual, automatic, weather-alert, none. |
| `stow_confirmation` | Optional | enum | `commanded_not_confirmed` | Separates command from actual state. |
| `stow_success_probability` | Optional | number 0–1 | `0.60` | Used only when actual stow state is unknown. |

Formula if probabilistic:

```text
DR_conditioned(D)
  = P(stowed) × DR_stowed(D)
  + (1 - P(stowed)) × DR_unstowed(D)
```

`P(stowed)` is not hail frequency. It is event-time state uncertainty.

### 5.1 Deferred wind-driven hail conditioner

Wind-driven hail is documented as a future conditioner / contact-intensity bridge candidate, not as a current required input. These candidate fields are intentionally **not** active in v1.3 runtime logic:

| Candidate field | Current status | Intended future role |
|---|---|---|
| `hail_event_wind_speed_mps` | Deferred | Event wind speed during damaging hail. |
| `hail_event_wind_direction_deg` | Deferred | Event wind direction during damaging hail. |
| `tracker_stow_orientation_deg` | Deferred | Direction the module face/back was oriented during stow. |
| `normal_ke_multiplier` | Deferred / derived | Contact-normal energy modifier from wind vector, hail trajectory, stow angle, and orientation. |

Adding any of these as output-changing runtime fields would be a `MODEL_BEHAVIOR_CHANGE`, not a docs-only update.

---

## 6. Exposure geometry

| Field | Required | Type | Example | Notes |
|---|---:|---|---|---|
| `array_exposure_fraction` | Optional | number 0–1 | `1.00` | Fraction of PV array footprint hit by damaging hail swath. |
| `exposure_basis` | Optional | enum | `full_site_default` | `full_site_default`, `footprint_overlay`, `scenario`. |

---

## 7. Value linkage and denominator

| Field | Required | Type | Example | Notes |
|---|---:|---|---|---|
| `value_profile_id` | Required for reference asset-loss application | enum/string | `HAIL_HAZARD_REFERENCE_ADAPTER_V1` | Selects an artifact-published profile; there is no implicit default. |
| `site_value_basis` | Alternative to profile | object | site schedule of values | Supplies site-specific direct module value, denominator, and support-cost allocation. |
| `value_bucket` | Yes for loss application | enum/string | `PV_ARRAY_MODULE_EXPOSED` | Links DR to the module failure-unit value bucket. |
| `at_risk_fraction` | Optional / site-specific | number 0–1 | `0.90` | Use only when part of the module inventory is inapplicable; default 1.0 for the selected failure-unit bucket. |
| `denominator` | Yes for reported percentage | enum | `physical_replaceable_base` | Also supports `installed_capex` or a named insured TIV; the label travels with the number. |

Published profiles:

| Profile | Physical-base share | Installed-capex share | Allocation meaning |
|---|---:|---:|---|
| `HAIL_DIRECT_MODULE_HARDWARE_ONLY_V1` | 0.3317569801903719 | 0.2600132602142186 | Direct module hardware only. |
| `HAIL_HAZARD_REFERENCE_ADAPTER_V1` | 0.4535037224398962 | 0.3554318022885826 | Module hardware plus all general replacement fieldwork in `Solar_Map!15`; T4 compatibility scenario. |

The former `f_hail_material_share = 0.75/0.8` examples are deprecated. They double-concentrated value after
the bucket had already been narrowed to module hardware and created inconsistent 19.5%/20.8% TIV caps. The
35.543% Hazard-compatible view is explicit and reproducible but remains a support-cost allocation scenario,
not an intrinsic fragility cap.

---

## 8. Curve derivation / provenance metadata

| Field | Required | Type | Example | Notes |
|---|---:|---|---|---|
| `curve_id` | Yes | string | `HAIL_SOLAR_DEFAULT_3P2_GBS` | Identifies archetype or transformed curve. |
| `curve_form` | Yes | enum/string | `logistic` | v1.3 uses logistic P_break(D). |
| `curve_native_axis` | Yes | enum | `MESH_DIAMETER_MM` | Axis of fitted curve. |
| `D50_mm` | Yes for logistic | number | `52.696` | Diameter at 50% breakage / replacement DR. |
| `k_1_per_mm` | Yes for logistic | number | `0.165912` | Steepness. |
| `anchor_set_id` | Yes | string | `ANCHORS_DEFAULT_3P2_GBS_V1_3` | Links to fit anchors. |
| `evidence_map_version` | Yes | string | `HAIL_EVIDENCE_PARAMS_V1_3` | Links to source-to-parameter map. |
| `assumption_register_version` | Yes | string | `HAIL_ASSUMPTIONS_V1_3` | Links to explicit assumptions. |
| `derivation_status` | Yes | enum | `public_source_derived` | Not private claims-calibrated. |
| `confidence` | Yes | enum | `medium` | Curve-level confidence. |

---

## 9. Adjustment logic metadata

| Field | Required | Type | Example | Notes |
|---|---:|---|---|---|
| `adjustment_type` | Conditional | enum | `base_curve`, `horizontal_shift`, `vertical_multiplier`, `probability_blend`, `exposure_multiplier` | Describes transformation. |
| `D50_shift_mm` | Conditional | number | `8` | Used for stowed placeholder curve. |
| `max_DR_multiplier` | Conditional | number | `0.90` | Used for stowed placeholder curve. |
| `adjustment_confidence` | Conditional | enum | `low` | Numeric stow adjustment is placeholder. |
| `adjustment_source_id` | Conditional | string | `E_VDE_HAIL_STOW` | Links to evidence map. |
| `adjustment_open_seam_id` | Conditional | string | `AS_STOW_D50_SHIFT` | Links to assumption register/open seam. |

---

## 10. Outputs

| Output | Required | Meaning |
|---|---:|---|
| `failure_unit_damage_ratio` | Yes | Damage ratio for PV_MODULE glass/cell failure-unit. |
| `subsystem_loss_fraction` | Optional | PV_ARRAY loss fraction if value linkage is available. |
| `physical_base_loss_fraction` | Optional | Loss fraction of physical replaceable base if valuation inputs are supplied. |
| `tiv_loss_fraction` | Optional | Loss fraction of installed capex/TIV if basis inputs are supplied. |
| `value_profile_id_used` | Required for reference value-linked outputs | Named profile used to produce the asset-loss view. |
| `loss_denominator_used` | Required for percentage outputs | `physical_replaceable_base`, `installed_capex`, or named insured TIV. |
| `metadata_flags` | Yes | Flags such as `cap_sensitive`, `stow_unknown`, `curve_public_source_derived`, `stow_adjustment_placeholder`. |
| `reviewed_secondary_units` | Yes | List of other reviewed subsystems and v1 treatment. |

---

## 11. Minimum viable input object

```yaml
mesh_diameter_mm: 50
module_archetype: default_3_2mm_glass_backsheet
mounting_type: single_axis_tracker
stow_state: unknown_probabilistic
stow_success_probability: 0.60
array_exposure_fraction: 1.00
```

---

## 12. High-confidence input object

```yaml
mesh_diameter_mm: 50
hail_size_source: MRMS_MESH
module_archetype: exact_specs_available
front_glass_thickness_mm: 3.2
tempered_glass: true
glass_glass_vs_backsheet: glass_backsheet
manufacturer_model: <module model>
bom_test_report_id: <report id>
hail_test_rating: <enhanced hail test>
mounting_type: single_axis_tracker
stow_state: stowed
stow_angle_deg: 60
stow_confirmation: confirmed_by_SCADA
array_exposure_fraction: 0.72
exposure_basis: footprint_overlay
value_profile_id: HAIL_HAZARD_REFERENCE_ADAPTER_V1
denominator: installed_capex
value_bucket: PV_ARRAY_MODULE_EXPOSED
```

---

## Repository-current machine-readable artifact and capability declaration

Canonical runtime artifact:

```text
hail_solar__model_v1_0__docs_r7__curve_artifact.json
```

The JSON artifact and its known-answer file are the preferred machine-readable sources for M3/runtime
consumers. The workbook remains a derivation/audit view; its older 0.8 at-risk example is not the runtime value
contract.

```yaml
capability_declaration:
  schema_version: capability_declaration.v2
  cell_id: hail_solar
  vulnerability_emit:
    failure_unit_scalar_dr: supported
    scenario_loss_given_value_basis: supported_with_explicit_value_and_exposure_basis
    curve_intrinsic_spread: not_carried
    populated_emit_modes: [scalar_mean]
  consumer_annual_metrics:
    computation_owner: downstream_consumer
    frequency_driven_annual_loss_distribution: supported_if_consumer_samples_frequency_intensity_coupling_and_applies_caps
    vulnerability_uncertainty_distribution: not_supported_curve_intrinsic_spread_not_carried
    eal: consumer_computable_with_prerequisites
    pml: consumer_computable_from_validated_annual_loss_distribution
    var: consumer_computable_from_validated_annual_loss_distribution
    tvar: consumer_computable_from_validated_annual_loss_distribution
  cap_binding:
    policy: consumer_enforced_fail_closed
    enforcement_owner: downstream_consumer
    status: not_evaluated_by_damage_artifact
```

Runtime consumers may compute annual metrics only from a validated annual loss distribution with explicit
frequency, intensity, coupling, value, exposure, and correct-grain caps. They must flag that curve-intrinsic
vulnerability spread is not carried.
