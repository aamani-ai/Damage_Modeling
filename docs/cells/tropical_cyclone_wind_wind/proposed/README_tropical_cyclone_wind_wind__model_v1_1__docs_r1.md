# tropical_cyclone_wind_wind — model v1.1 pre-promotion record, docs r1

> **Outcome: promoted 2026-08-14.** The canonical package is now
> [`model v1.1 / docs r1`](../current/README.md). This folder preserves the noncanonical review bytes and
> pre-promotion reasoning; consumers must not load it.

## What the reviewed proposal introduced

Model v1.1 adds one deliberately narrow route for Hazard's canonical Wind Farm:

```text
canonical target: 5 MW turbine · 100 m hub
        │ exact opt-in IDs
        ▼
Jaimes source record: 3.3 MW · 100 m hub · 114 m rotor
        │ unchanged equation and parameters
        ▼
screening DR for rotor+nacelle+tower value scope only
```

It does not claim that 3.3 MW and 5 MW turbines are physically equivalent. It records an owner-approved
screening assumption so the limitation is explicit, testable and replaceable.

## Exact request contract

The proxy route requires all of these values:

| Field | Required value |
|---|---|
| `turbine_archetype_id` | `CONUS_WIND_FARM_5MW_HH100_PROXY_V1` |
| `proxy_policy_id` | `TCWW_OWNER_APPROVED_3P3MW_FOR_CANONICAL_5MW_V1` |
| `canonical_asset_profile_id` | `CONUS_WIND_FARM_REFERENCE_V1` |
| `covered_value_basis_id` | `CONUS_WIND_FARM_ROTOR_NACELLE_TOWER_63PCT_V1` |
| hazard field | `tc_peak_gust_3s_10m_kmh` |
| source assumption acknowledgement | `JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED` |

Missing or mismatched IDs fail closed. A generic 4 MW, 5 MW or 6 MW selector is not routed to the nearest
source record.

## What remains numerically unchanged

- `V_zero = 90 km/h`
- `delta_V50 = 73.3 km/h`
- `rho = 4.99`
- `V_at_DR50 = 163.3 km/h`
- `max_dr = 1`
- valid and withheld speed regions for every exact model-v1.0 source selector
- every exact 1 MW, 2.5 MW and 3.3 MW model-v1.0 result

There is no `5 / 3.3` multiplier. Rated capacity identifies the target; it is not a supported damage-ratio
scaler.

## Proxy-only speed completion

The exact 5 MW proxy is complete across nonnegative gusts so a Hurricane event is never silently dropped:

| 10 m, 3-second gust | Proxy behavior |
|---|---|
| `0–90 km/h` | source-assumed zero |
| `90–108 km/h` | zero, explicitly flagged as a conservative screening completion |
| `108–252 km/h` | unchanged Jaimes equation |
| above `252 km/h` | cap at `max_dr = 1`, explicitly flagged |

This does not redraw the source evidence range. Across all 1,773 active Hurricane cells and 113,526 M1 events,
the low-wind zero rule's summed placement-EAL upper bound is `$10,564.85`; the extreme-wind rule prevents
unbounded extrapolation and respects the curve's declared maximum.

## Covered value

| Scope | Share of project TIV | Treatment at the activation `$140M` value |
|---|---:|---:|
| rotor | 0.26 | `$36.4M` covered |
| nacelle | 0.21 | `$29.4M` covered |
| tower | 0.16 | `$22.4M` covered |
| **covered total** | **0.63** | **`$88.2M` occurrence cap** |
| foundation + substation + electrical + civil | **0.37** | **`$51.8M` withheld, not zero** |

Damage emits the bounded failure-unit DR and its capability/value contract. Hazard owns event loss,
frequency, EAL/PML and the correctly grained occurrence/annual caps. A consumer must disclose both percent
of the `$88.2M` covered value and percent of the full `$140M` project TIV.

## Review package

- [change classification](CHANGE_CLASSIFICATION_tropical_cyclone_wind_wind__model_v1_1__docs_r1.md)
- [decision log](DECISION_LOG_tropical_cyclone_wind_wind__model_v1_1__docs_r1.md)
- [derivation dossier](tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_1__docs_r1.md)
- [curve artifact](tropical_cyclone_wind_wind__model_v1_1__docs_r1__curve_artifact.json)
- [capability declaration](tropical_cyclone_wind_wind__model_v1_1__docs_r1__capability.json)
- [known-answer tests](known_answer_tests_tropical_cyclone_wind_wind__model_v1_1__docs_r1.json)
- [value crosswalk](VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v1_1__docs_r1.csv)
- [old-v-new comparison](OLD_VS_NEW_COMPARISON_tropical_cyclone_wind_wind__model_v1_1__docs_r1.csv)
- [validation report](VALIDATION_REPORT_tropical_cyclone_wind_wind__model_v1_1__docs_r1.md)
- [promotion gates](PROMOTION_GATE_MATRIX_tropical_cyclone_wind_wind__model_v1_1__docs_r1.md)
- [workbook](damage_curve_records_tropical_cyclone_wind_wind__model_v1_1__docs_r1.xlsx)

## Allowed use

Screening and investigation only, conditional on the exact target asset and proxy IDs. Promotion did not
make the method field-calibrated, claims-calibrated, a generic modern-turbine curve, a full-plant damage
model or a bankable loss estimate.
