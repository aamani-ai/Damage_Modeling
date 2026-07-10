# Wildfire × solar model v1.0 — damage-code metadata specification

## Identity

```yaml
cell_id: wildfire_solar
damage_code_id: WILDFIRE_SOLAR_FSIM_SCREENING_V1
semantic_damage_model_version: model v1.0
documentation_revision: docs r3
model_grade: screening_engineering_proxy
```

## Hazard inputs

Use exactly one mode.

### Event-class mode

```yaml
conditional_flame_length_class:
  enum:
    - lt_2_ft
    - gte_2_lt_4_ft
    - gte_4_lt_6_ft
    - gte_6_lt_8_ft
    - gte_8_lt_12_ft
    - gte_12_ft
```

The evaluator maps these IDs to exact screening states `1..6`. No interpolation or midpoint conversion is
permitted.

### Conditional-distribution mode

```yaml
conditional_flame_length_probability_by_bin:
  lt_2_ft: fraction
  gte_2_lt_4_ft: fraction
  gte_4_lt_6_ft: fraction
  gte_6_lt_8_ft: fraction
  gte_8_lt_12_ft: fraction
  gte_12_ft: fraction
```

Each fraction must lie in `[0,1]`; all six must sum to one within the declared numerical tolerance. Expected
DR is the probability-weighted state-table result.

`burn_probability` is prohibited as a damage-curve input. Hazard uses it in the frequency layer.

## Value inputs

Failure-unit DR needs no value. Scenario loss requires one of:

```text
value_profile_id = WILDFIRE_SOLAR_REFERENCE_100MWDC_V1
or
site_failure_unit_values_usd keyed by all ten failure_unit_id values
```

The reference profile declares:

```yaml
physical_replaceable_usd_per_kwdc: 877.7957023626668
installed_capex_usd_per_kwdc: 1120.0
physical_to_installed_ratio: 0.7837461628238097
direct_and_civil_usd_per_kwdc: 688.2052014426097
support_usd_per_kwdc: 189.59050092005714
support_allocation: proportional_once_to_aggregate_direct_and_civil_DR
```

There is no implicit value profile. Missing value basis withholds scenario loss while leaving failure-unit DR
available.

## Outputs

Event-class mode returns ten records:

```yaml
failure_unit_id:
screening_fire_state_id:
conditional_failure_unit_damage_ratio:
evidence_tier: T4_placeholder_or_expert_judgment
metadata_flags:
  - SCREENING_ENGINEERING_PROXY
  - NOT_FIELD_CALIBRATED
```

Distribution mode additionally returns the six FLP weights used and an expected conditional DR for each
failure unit.

With an explicit value basis, the optional assembly returns:

```yaml
direct_and_civil_loss_fraction:
physical_base_loss_fraction:
installed_capex_loss_fraction:
support_cost_allocation_fraction:
value_profile_id:
```

## Missing and invalid behavior

| Condition | Result |
|---|---|
| No class or FLP vector | Reject: `MISSING_WILDFIRE_SEVERITY_INPUT` |
| Both modes supplied | Reject: `AMBIGUOUS_WILDFIRE_SEVERITY_INPUT` |
| Unknown class | Reject: `FSIM_CLASS_NOT_RECOGNIZED` |
| FLP outside `[0,1]` | Reject: `FLP_VALUE_OUT_OF_RANGE` |
| FLPs do not sum to one | Reject: `FLP_VECTOR_MUST_SUM_TO_ONE` |
| `burn_probability` supplied to M3 | Reject from damage input: `FREQUENCY_FIELD_NOT_ALLOWED_IN_DAMAGE_CALL` |
| Missing value basis | Failure-unit DR supported; scenario loss withheld: `EXPLICIT_VALUE_PROFILE_OR_SITE_VALUE_BASIS_REQUIRED` |
| Unknown mitigation/control state | No credit; central screening table unchanged |
| Attempted fractional class/interpolation | Reject: `EXACT_STATE_LOOKUP_REQUIRED` |

## Controls and selectors

The v0.1 site-condition fields remain valid metadata but do not change v1.0 numerical ordinates. This avoids
invented mitigation multipliers. `cable_installation` affects value-profile selection: the reference profile
is exposed; a site profile must remove verified buried/protected value from `WSV1_CABLE_EXPOSED` rather than
discounting the curve twice.

## Capability boundary

Failure-unit scalar DR is supported. Scenario loss is supported only with explicit value basis. Hazard may
compute EAL/PML/VaR/TVaR from a validated frequency-driven annual loss distribution, subject to its coupling,
cap, and financial-term controls. The curve carries no intrinsic probability distribution or confidence
interval.
