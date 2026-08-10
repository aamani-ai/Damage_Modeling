# Tropical-cyclone wind × onshore wind

## 1. Cell identity

```yaml
cell_id: tropical_cyclone_wind_wind
pathway_id: tropical_cyclone_wind
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_SCREENING_V1
semantic_damage_model_version: model v1.0
human_documentation_revision: docs r1
lifecycle_state: released_v1_0
promotion_status: released
review_status: reviewed_partial_screening_release
model_grade: screening_source_derived_engineering_proxy
artifact_schema_version: damage_curve_record_bundle.v3
artifact_schema_status: released
canonical_runtime_artifact: true
current_runtime_pointer: tropical_cyclone_wind_wind@model_v1_0__docs_r1
package_release: unreleased
```

This page is the current **cell-documentation anchor**. Model v1.0/docs r1 is now a repository-current,
source-native partial-screening release. The preserved proposal remains audit history; the canonical bytes,
capability, KATs, and release decision live in [`current/`](current/README.md).

For the shortest Hazard-facing request, exact selector example, and range behavior, start with the
[hurricane × wind curve request guide](../../extra/guides/tropical_cyclone_wind_wind_curve_request_guide.md).

Model v1.0 changes one conclusion from the historical v0.1 scaffold. Jaimes et al. publish an expected
economic damage-ratio function, not only a DS3 collapse fragility. The function can be retained honestly for
the paper's own source-native turbine-tower exposure unit and three exact source archetypes. It still cannot
be presented as a generic whole-turbine, wind-farm, CWER-value, or claims-calibrated curve.

## 2. What model v1.0 supports

```text
source-native 3-second peak gust at 10 m, in km/h
                         |
                         v
             exact Jaimes archetype selector
                         |
                         v
 WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT, one turbine point
                         |
                         v
 conditional scalar mean DR only; no dollar or plant-loss binding
```

The only numeric failure unit is:

`WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT`

It is a quarantined, source-defined unit. It is mutually exclusive with the standard
`WT_TURBINE_EQUIPMENT_ASSEMBLY`; it is neither a CWER tower bucket nor an extra value row to add beside the
standard turbine assembly.

## 3. Exact curve records

All three records use `curve_form: thresholded_weibull_expected_damage`:

```text
DR(V) = 0,                                                        V <= V_zero
DR(V) = max_dr * [1 - 0.5^(((V - V_zero) / delta_V50)^rho)],     V > V_zero
```

`V_zero_kmh = 90` and `max_dr = 1` for every record.

| Exact selector ID | Rating / hub / rotor | `delta_V50_kmh` | `rho` | `V_at_DR50_kmh` |
|---|---|---:|---:|---:|
| `TCWW_JAIMES_GENERIC_1MW_HH44_V1` | 1 MW / 44 m / 50 m | 106.77 | 8.94 | 196.77 |
| `TCWW_JAIMES_GENERIC_2P5MW_HH80_V1` | 2.5 MW / 80 m / 90 m | 82.52 | 4.54 | 172.52 |
| `TCWW_JAIMES_GENERIC_3P3MW_HH100_V1` | 3.3 MW / 100 m / 114 m | 73.30 | 4.99 | 163.30 |

Selection is exact. There is no default, alias, nearest-neighbor selection, interpolation, or implicit
transfer to a modern fleet or actual make/model. The 1 MW selector follows the paper's Table 2 value of 44 m
and carries the documented 44 m versus 40 m source discrepancy.

## 4. Native axis and domain behavior

```yaml
hazard_axis_id: TC_PEAK_GUST_3S_10M_KMH_JAIMES
input_field: tc_peak_gust_3s_10m_kmh
quantity: three-second peak gust
reference_height_m: 10
unit: km/h
source_simulation_range_kmh: [108, 252]
```

| Delivered `V` | Result |
|---:|---|
| nonfinite or `< 0` | reject |
| `0 <= V <= 90` | emit DR `0` with `SOURCE_ASSUMED_NO_DAMAGE_THRESHOLD_NOT_EMPIRICAL` |
| `90 < V < 108` | withhold `BELOW_SOURCE_SIMULATION_RANGE` |
| `108 <= V <= 252` | evaluate the selected curve |
| `V > 252` | withhold `ABOVE_SOURCE_SIMULATION_RANGE` |

NHC one-minute sustained wind, Saffir-Simpson category, hub-height wind, knots, mph, m/s, and Rose's
10-minute hub-height wind are not accepted aliases. Model v1.0 includes no height, averaging-period, terrain,
gust, or rotor bridge.

## 5. Source-state and exposure guardrails

Every supported request must acknowledge:

```yaml
source_model_assumption_set_id: JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED
```

That identifier preserves the source's generic fixed-base steel-tower model and its internally inconsistent
feathered/minimum-drag versus parked/no-pitch wording, with wind parallel to the rotor and no yawing. It is
not a protection credit. A known-inconsistent actual control state withholds; an unknown state may be
evaluated only with an explicit flag and no numeric adjustment.

Evaluation is per qualifying turbine point and local source-native gust. The turbine exposure fraction is
not reusable for foundations, collection lines, a shared GSU yard, control buildings, or civil assets. In
particular, `WT_GSU_SUBSTATION` is one facility-level exposure and is never multiplied by turbine count.

## 6. Coverage beyond the source-native atom

| Failure unit | Model v1.0 treatment | Key reason |
|---|---|---|
| `WT_TURBINE_EQUIPMENT_ASSEMBLY` | withheld, not zero | source denominator is not harmonized and non-tower failure modes are omitted |
| `WT_FOUNDATION` | withheld, not zero | no qualified direct TC-wind curve |
| `WT_PAD_MOUNTED_ELECTRICAL` | withheld, not zero | electrical value/exposure split required |
| `WT_COLLECTION_SYSTEM` | withheld, not zero | line/network exposure and response required |
| `WT_GSU_SUBSTATION` | withheld, not zero | facility-level curve, exposure, and value split required |
| `WT_CONTROL_BUILDING_AND_SCADA` | withheld, not zero | no qualified subject-specific curve |
| `WT_CIVIL_INFRA` | withheld, not zero | mixed civil bucket requires a subject split |
| `SUPPORT_FIELDWORK` | no intrinsic DR | allocate once after qualified disposition |
| `SUPPORT_TRANSPORT_LOGISTICS` | no intrinsic DR | allocate once after qualified disposition |

Withheld means unsupported or unknown. It never means physically immune, zero loss, or permission to inherit
the Jaimes curve.

## 7. Y-axis, value, and reportability

The numeric ordinate is the conditional expected direct repair-or-replacement cost ratio for the
source-defined Jaimes turbine-tower exposure unit relative to the paper's replacement-cost proxy. The paper
constructs it from modeled tower damage-state probabilities and assumed state cost ratios. That supports a
Tier-4 screening proxy; it does not establish a field- or claims-calibrated curve.

The source denominator is internally ambiguous across “selected structure,” “turbine tower,” and “total cost
of the turbine.” It is not approved as CWER turbine equipment, plant physical value, installed value, or TIV.
Therefore model v1.0 supports only a conditional scalar mean DR for the source-native unit. It does not emit:

- source-unit or site dollar loss;
- standard turbine-equipment, wind-farm, or full-TIV DR;
- scenario or plant loss;
- curve spread or state probabilities; or
- EAL, PML, VaR, TVaR, or portfolio metrics.

## 8. Scope exclusions

The release covers direct aerodynamic tropical-cyclone wind loading only. TC-spawned tornado, surge,
pluvial flood, scour, saturated-soil failure, debris, rain ingress, lightning, fire, offshore loading,
fatigue, disruption, insurance, and finance are separate or downstream pathways. Related child pathways
must retain the same `event_family_id` so a consumer can coordinate occurrence loss without duplicate value
charges.

## 9. Governed package

Start with the [current model v1.0 package](current/README.md),
then use:

- [derivation dossier](current/tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_0__docs_r1.md);
- [metadata specification](current/tropical_cyclone_wind_wind_damage_code_metadata_spec__model_v1_0__docs_r1.md);
- [curve artifact](current/tropical_cyclone_wind_wind__model_v1_0__docs_r1__curve_artifact.json);
- [capability declaration](current/tropical_cyclone_wind_wind__model_v1_0__docs_r1__capability.json);
- [known-answer tests](current/known_answer_tests_tropical_cyclone_wind_wind__model_v1_0__docs_r1.json);
- [validation report](current/VALIDATION_REPORT_tropical_cyclone_wind_wind__model_v1_0__docs_r1.md);
- [release decision](current/RELEASE_DECISION_tropical_cyclone_wind_wind__model_v1_0__docs_r1.md); and
- [workbook](current/damage_curve_records_tropical_cyclone_wind_wind__model_v1_0__docs_r1.xlsx).

The current JSON artifact and capability file define runtime behavior. The dossier, registers, and workbook
explain the evidence and derivation. The pre-promotion package under `proposed/` remains noncanonical.

## 10. Version history

| Version | Status | Meaning |
|---|---|---|
| model v0.1/docs r1 | preserved historical scaffold | zero curve records and fail-closed `NO_RUNTIME_CURVE`; retained the candidate evidence and correctly blocked generic turbine transfer |
| model v1.0/docs r1 | repository-current partial-screening release | three source-native Jaimes expected-DR records for one quarantined unit; all broader asset and loss outputs remain withheld |

The [v0.1 package overview](proposed/README_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md),
[v0.1 pressure test](proposed/PRESSURE_TEST_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md), and
[v0.1 numerical candidate audit](proposed/NUMERICAL_CANDIDATE_AUDIT_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md)
remain part of the audit trail. Their “no economic DR” conclusion is superseded only for the narrow
source-native Jaimes unit adopted in v1.0; their transfer, denominator, coverage, and fail-closed cautions
remain in force.

## 11. Release boundary

Promotion is complete only for the exact source-native scalar product. The common Hazard loader replays all
47 formula and contract KATs and enforces exact pathway, axis, selector, source assumption, domain, and
partial-capability behavior.

Valuation transfer, modern-fleet mapping, additional failure units, whole-farm aggregation, and annual/tail
metrics remain blocked. The portable package remains v2.5; this release is polled through the repository
artifact index and exact SHA pin.
