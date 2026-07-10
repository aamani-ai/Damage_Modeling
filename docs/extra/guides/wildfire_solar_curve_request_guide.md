# Guide: give me a wildfire × solar damage model

## Short answer

Use the repository-current canonical screening model:

```text
cell_id:          wildfire_solar
consumer pin:     wildfire_solar@model_v1_0__docs_r3
damage_code_id:   WILDFIRE_SOLAR_FSIM_SCREENING_V1
artifact:         docs/cells/wildfire_solar/current/
                  wildfire_solar__model_v1_0__docs_r3__curve_artifact.json
model grade:      screening engineering proxy
portable package: not included in library v2.5
```

Do not use the legacy capex-weighted continuous FLI logistic. Do not convert FSim bins to midpoint fireline
intensity. Model v1.0 uses exact categorical class lookup.

## Input

Supply either one FSim conditional flame-length class:

```text
lt_2_ft
gte_2_lt_4_ft
gte_4_lt_6_ft
gte_6_lt_8_ft
gte_8_lt_12_ft
gte_12_ft
```

or all six conditional probabilities given burning. The probabilities must sum to one. Burn probability is
not a damage input; Hazard owns frequency.

## Output

The artifact returns ten same-unit screening DRs for modules, tracker/racking, foundation, inverter, combiner,
exposed cable, MV equipment, grounding, SCADA, and direct civil property.

For the source-native probability vector:

```text
E[DR_u | burn] = Σ_s FLP_s × DR_u(s)
```

Scenario loss requires explicit selection of `WILDFIRE_SOLAR_REFERENCE_100MWDC_V1` or complete site
failure-unit values. There is no implicit TIV constant.

## Required flags

Every consumer output must preserve:

```text
SCREENING_ENGINEERING_PROXY
NOT_FIELD_CALIBRATED
NOT_CLAIMS_CALIBRATED
FSIM_CLASS_IS_NOT_LOCAL_HEAT_FLUX
CURVE_INTRINSIC_SPREAD_NOT_CARRIED
```

## Permitted and prohibited uses

Permitted: regional screening, comparative risk ranking, financial ranging, model integration, and field-data
prioritization.

Prohibited: site appraisal, claims settlement, safety certification, automatic mitigation credit, or
representation as an empirical local heat-flux fragility.

## Main review files

- [Cell README](../../cells/wildfire_solar/current/README_wildfire_solar__model_v1_0__docs_r3.md)
- [Derivation dossier](../../cells/wildfire_solar/current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md)
- [Known-answer tests](../../cells/wildfire_solar/current/known_answer_tests_wildfire_solar__model_v1_0__docs_r3.json)
- [Hazard migration handoff](../../contracts/hazard_handoff/wildfire_solar_model_v1_0_hazard_migration.md)
- [Preserved v0.1 evidence package](../../cells/wildfire_solar/proposed/README_wildfire_solar__model_v0_1__docs_r1.md)
