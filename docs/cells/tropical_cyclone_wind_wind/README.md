# Tropical-cyclone wind × onshore wind

## Current identity

```yaml
cell_id: tropical_cyclone_wind_wind
pathway_id: tropical_cyclone_wind
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_TOWER_SCREENING_V1_2
semantic_damage_model_version: model v1.2
human_documentation_revision: docs r2
lifecycle_state: released_v1_2
promotion_status: released
model_grade: screening_owner_approved_target_mismatch_tower_only_proxy
artifact_schema_version: damage_curve_record_bundle.v3
canonical_runtime_artifact: true
current_runtime_pointer: tropical_cyclone_wind_wind@model_v1_2__docs_r2
```

Model v1.2 is the repository-current release. It keeps the Jaimes 3.3 MW / 100 m numerical curve unchanged
and corrects what value that curve may touch. The canonical 5 MW bridge now covers only tower value—0.16 of
project TIV. The other 0.84 is withheld, not treated as zero.

Start with the [current package](current/README.md) or the
[request guide](../../extra/guides/tropical_cyclone_wind_wind_curve_request_guide.md).

## The corrected contract

```text
source-native 3-second peak gust at 10 m, km/h
                         │
                         ▼
unchanged Jaimes 3.3 MW / 100 m expected-DR curve
                         │
                         ▼
WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT
                         │
                         ▼
tower = 0.16 of project TIV covered
all non-tower value = 0.84 withheld
```

The previous model-v1.1 bridge applied the same tower-state curve to rotor+nacelle+tower value (0.63 of
TIV). The Hurricane consumer review showed a maximum annual loss near 7.45% in Monte Carlo and 7.78%
analytically. More importantly, that value scope was broader than the source failure unit. Model v1.2 fixes
the scope rather than tuning the curve. On the same governed events, the corrected Monte Carlo maximum is
1.890796% of full TIV/year. This is a consequence check, not external financial-range validation.

## Exact route

| Contract field | Required value |
|---|---|
| `failure_unit_id` | `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT` |
| `turbine_archetype_id` | `CONUS_WIND_FARM_5MW_HH100_TOWER_PROXY_V1` |
| `proxy_policy_id` | `TCWW_OWNER_APPROVED_3P3MW_FOR_CANONICAL_5MW_TOWER_ONLY_V1` |
| `canonical_asset_profile_id` | `CONUS_WIND_FARM_REFERENCE_V1` |
| `covered_value_basis_id` | `CONUS_WIND_FARM_TOWER_16PCT_V1` |
| hazard field | `tc_peak_gust_3s_10m_kmh` |

Selection is exact. There is no default, alias, capacity-ratio multiplier, interpolation, or inferred
nearest turbine. The model-v1.1 archetype, policy, equipment-assembly unit, and 63% value basis fail closed.

## Numerical curve

The proxy reuses the source record exactly:

```text
DR(V) = 0,                                                    V <= 90 km/h
DR(V) = 1 - 0.5^(((V - 90) / 73.3)^4.99),                    V > 90 km/h
```

| Delivered gust | Treatment |
|---:|---|
| `0–90 km/h` | source-assumed zero with disclosure flag |
| `90–108 km/h` | named proxy returns flagged zero; source-native selectors withhold |
| `108–252 km/h` | unchanged Jaimes equation |
| above `252 km/h` | named proxy returns flagged `max_dr=1`; source-native selectors withhold |

The accepted quantity is a source-native three-second peak gust at 10 m. NHC one-minute sustained wind,
Saffir-Simpson category, hub-height wind, knots, mph, m/s, and ten-minute wind are not aliases.

## Value and reportability

| Value scope | Share of project TIV | Treatment |
|---|---:|---|
| tower | 0.16 | covered by the screening proxy |
| rotor, nacelle, foundation, substation, electrical, civil and other plant value | 0.84 | withheld, not zero |

The numeric ordinate is a conditional expected direct repair-or-replacement cost ratio built from the
source's tower damage states and assumed state-cost ratios. It is screening evidence. It is not a
field-calibrated, claims-calibrated, component-complete, whole-plant, or bankable curve.

Damage owns the curve, request contract, value boundary, known answers, and cap declaration. Hazard owns
node-aware event coupling, frequency, occurrence loss, EAL/PML, and enforcement of the `$22.4M` tower-value
cap for the `$140M` canonical reference farm.

## What remains unsupported

- target-matched 5 MW evidence;
- independent rotor, blade, nacelle, foundation, electrical, substation, civil, and support-cost curves;
- curve intrinsic spread and state probabilities;
- tropical-cyclone surge, flood, scour, debris, rain ingress, lightning, fire, and business interruption;
- external financial-range validation for the resulting annual metrics.

Withheld never means immune or zero loss. It means this model has no governed answer for that scope.

## Governed package

- [curve artifact](current/tropical_cyclone_wind_wind__model_v1_2__docs_r2__curve_artifact.json)
- [capability declaration](current/tropical_cyclone_wind_wind__model_v1_2__docs_r2__capability.json)
- [known-answer tests](current/known_answer_tests_tropical_cyclone_wind_wind__model_v1_2__docs_r2.json)
- [derivation dossier](current/tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_2__docs_r2.md)
- [value crosswalk](current/VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v1_2__docs_r2.csv)
- [old-versus-new comparison](current/OLD_VS_NEW_COMPARISON_tropical_cyclone_wind_wind__model_v1_2__docs_r2.csv)
- [validation report](current/VALIDATION_REPORT_tropical_cyclone_wind_wind__model_v1_2__docs_r2.md)
- [release decision](current/RELEASE_DECISION_tropical_cyclone_wind_wind__model_v1_2__docs_r2.md)

## Version history

| Version | Status | Meaning |
|---|---|---|
| model v0.1/docs r1 | historical scaffold | no runtime curve; generic transfer blocked |
| model v1.0/docs r1 | exact archive | three source-native Jaimes records; no canonical farm value binding |
| model v1.1/docs r1 | exact archive; superseded | 0.63 equipment-assembly bridge; reproducible but no longer current |
| model v1.2/docs r2 | repository-current | unchanged curve; corrected tower-only 0.16 value binding |

The archive exists for reproduction, not for selection by current consumers. The machine-readable artifact
index is the only repository-current pointer.
