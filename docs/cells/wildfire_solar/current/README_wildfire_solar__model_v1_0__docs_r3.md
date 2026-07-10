# Wildfire × utility-scale solar — screening model v1.0

```yaml
cell_id: wildfire_solar
damage_code_id: WILDFIRE_SOLAR_FSIM_SCREENING_V1
semantic_damage_model_version: model v1.0
documentation_revision: docs r3
lifecycle_state: released_v1_0
promotion_status: released
model_grade: screening_engineering_proxy
claims_or_field_calibrated: false
canonical_runtime_artifact: true
portable_package_release: unchanged_at_library_v2.5
```

## What was released

Model v1.0 is the first numerical wildfire × solar runtime model. It evaluates the six source-native FSim
conditional flame-length classes against ten separately valued physical failure units and can assemble a
reference physical or installed-CAPEX loss fraction.

It is deliberately a **screening engineering proxy**. Public evidence constrains the hazard states,
component mechanisms, relative vulnerability, endpoint rules, and value basis. Public evidence does not
calibrate the absolute class-to-damage ordinates. Those ordinates are explicit Tier 4 engineering judgments,
not hidden conversions or borrowed claims curves.

## Why this is a reasonable v1.0

The v0.1 research rejected a false-precision chain from landscape fireline intensity to equipment heat flux.
Model v1.0 keeps that rejection. It does not convert `kW/m` to `kW/m²`, invent a duration, or assign a midpoint
to the open-ended FSim class.

Instead, it uses an exact categorical state table:

```text
FSim event occurs
  -> sample one of six conditional flame-length classes
  -> exact state lookup for each failure unit
  -> failure-unit direct replacement DR
  -> multiply by the matching value bucket
  -> allocate support cost once
```

This makes every approximation visible and replaceable. It also gives the Hazard consumer a stable
screening seam while the field-data program works toward a site-calibrated model.

## Runtime ordinates

| Failure unit | `<2 ft` | `2–<4` | `4–<6` | `6–<8` | `8–<12` | `≥12 ft` |
|---|---:|---:|---:|---:|---:|---:|
| PV modules | 0.2% | 1.0% | 4.0% | 12.0% | 32.0% | 65.0% |
| Tracker/racking | 0.0% | 0.1% | 0.5% | 2.0% | 8.0% | 25.0% |
| Foundation/pads | 0.0% | 0.0% | 0.1% | 0.3% | 1.0% | 4.0% |
| Inverter | 0.2% | 1.0% | 5.0% | 18.0% | 45.0% | 80.0% |
| Combiner boxes | 0.3% | 1.5% | 6.0% | 20.0% | 50.0% | 85.0% |
| Exposed AC/DC cable | 0.5% | 2.0% | 8.0% | 25.0% | 60.0% | 90.0% |
| Transformer/switchgear | 0.1% | 0.6% | 3.0% | 12.0% | 35.0% | 70.0% |
| Grounding/lightning | 0.0% | 0.1% | 0.4% | 1.5% | 5.0% | 12.0% |
| SCADA/communications | 0.4% | 2.0% | 8.0% | 25.0% | 60.0% | 90.0% |
| Direct civil bucket | 0.1% | 0.5% | 2.0% | 7.0% | 18.0% | 40.0% |

These are conditional expected same-unit replacement ratios for a generic screening archetype. They are not
local heat-flux fragilities and must not be relabeled as such.

## Reference aggregate

Using the documented 100 MWdc cost archetype and allocating support cost proportionally once:

| FSim class | Physical-base loss | Installed-CAPEX loss |
|---|---:|---:|
| `<2 ft` | 0.1681% | 0.1318% |
| `2–<4 ft` | 0.8230% | 0.6450% |
| `4–<6 ft` | 3.4522% | 2.7056% |
| `6–<8 ft` | 11.2131% | 8.7882% |
| `8–<12 ft` | 29.9249% | 23.4535% |
| `≥12 ft` | 58.3104% | 45.7006% |

The installed-CAPEX result is lower because the physical replaceable basis is
`877.795702 / 1120 = 78.374616%` of installed CAPEX. No downstream hardcoded value-share constant is needed.

## Evidence and approximation boundary

- [FSim](https://doi.org/10.2737/RDS-2016-0034-3) defines the six conditional hazard states and keeps burn
  probability separate.
- [USFS field measurements](https://research.fs.usda.gov/treesearch/42185) show that local radiant and
  convective exposure varies strongly with fuels and fire environment; this is why no universal physical
  converter is claimed.
- [DOE FEMP wildfire guidance](https://www.energy.gov/cmei/femp/solar-photovoltaic-hardening-resilience-wildfire)
  supports multi-subsystem burn damage, rebuild/inspection endpoints, and protection variables.
- The [2026 wildfire-affected PV study](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003300065)
  supports EL/IR and continuing-monitoring endpoints but not numerical fragility.
- [NEMA GD 2](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-2-2016-evaluating-fire-and-heat-damaged-electrical-equipment-guide.pdf)
  supports category-specific post-fire evaluation/replacement logic.
- The [NREL/NLR cost benchmark](https://data.nrel.gov/submissions/304) supports the reference value basis.

## Permitted use

```text
regional portfolio screening
model comparison and financial ranging
FSim-driven Hazard M3/M4 development
prioritizing field inspection and evidence collection
explicit sensitivity analysis
```

## Prohibited use

```text
site appraisal or claims settlement
code-compliance or safety certification
adaptation/mitigation efficacy credit
local heat-flux or duration inference
business interruption, smoke/ash, PSPS, or equipment-origin fire
presentation as claims-calibrated or field-calibrated
```

## Main files

- `wildfire_solar__model_v1_0__docs_r3__curve_artifact.json` — canonical runtime artifact.
- `known_answer_tests_wildfire_solar__model_v1_0__docs_r3.json` — executable state and value KATs.
- `wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md` — complete derivation reasoning.
- `wildfire_solar_damage_code_metadata_spec__model_v1_0__docs_r3.md` — callable interface.
- `ORDINATE_TABLE_wildfire_solar__model_v1_0__docs_r3.csv` — reviewable numerical state table.
- `VALUE_LINKAGE_wildfire_solar__model_v1_0__docs_r3.csv` — denominator and allocation record.
- `damage_curve_records_wildfire_solar__model_v1_0__docs_r3.xlsx` — formula-driven audit workbook.
