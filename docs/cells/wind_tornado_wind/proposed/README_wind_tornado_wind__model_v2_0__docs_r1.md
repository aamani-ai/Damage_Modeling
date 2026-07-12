# wind_tornado_wind — proposed model v2.0, docs r1

> **Status: proposed, noncanonical screening model.** Current model v1.0/docs r4 remains the runtime artifact.
> This package is deliberately absent from the artifact index and portable library v2.5.

## Outcome

The v1.0 shift-only model is rebuilt as one shared onshore-turbine cell with two independently governed
pathways:

```text
wind_tornado_wind
├─ straight_line_convective
│  └─ downburst / microburst / macroburst / gust-front / local derecho outflow
└─ tornado_direct_hit
   └─ conditional severity after Hazard has resolved turbine intersection and local demand
```

Tropical-cyclone, nonconvective synoptic, and downslope wind are outside both branches.

## What the proposal changes

| Current v1.0 | Proposed v2.0 |
|---|---|
| One top-level `V_3s_hub / Ve50` axis | Pathway-specific rotor-effective axes and proxy contracts |
| Boolean `tornado_variant` | Required first-class `pathway_id` |
| Same component logistics with tornado D50 shifts | Independent pathway evidence and capacity scenarios |
| Independent blade/tower/nacelle/foundation sum | Mutually exclusive repeated-turbine damage states |
| Unreconciled component shares | Row-complete NREL CWER value crosswalk |
| No executable wind/tornado KATs | Pathway, equation, state, bounds, rejection, value, and migration KATs |
| Bundle v2 / emit v1 / capability v2 | Proposed bundle v3 / emit v2 / capability v3 |

## Scientific grade

Both pathways remain screening engineering proxies:

- `straight_line_convective` has strong transient-load evidence and observed blade/tower failures, but no
  matched modern-turbine load-to-repair-cost dataset;
- `tornado_direct_hit` has a field-supported blade-damage anchor near 51 m/s and a Greenfield collapse
  transition around 65–69 m/s, but turbine archetype, wind-height, control-state, debris, and capacity
  uncertainty remain material;
- direct nacelle, foundation, collection/substation, civil, and support-cost fragilities remain withheld.

The serialized lower/central/upper resistance scenarios are engineering bounds, not statistical percentiles.

## Primary loss atom and denominator

The numeric record applies to one repeated turbine-equipment assembly:

```text
rotor + pitch + nacelle + power electronics + yaw + tower = 1,090 USD/kW
```

Its y-axis excludes foundation, external electrical, civil, fieldwork, transport/logistics, soft costs, BI,
curtailment, insurance terms, and annual frequency. Support is allocated once downstream after damaged units
are known.

## Package contents

Governance and research:

- `CHANGE_CLASSIFICATION_wind_tornado_wind__model_v2_0__docs_r1.md`
- `DECISION_LOG_wind_tornado_wind__model_v2_0__docs_r1.md`
- `BOUNDED_EVIDENCE_SEARCH_LOG_wind_tornado_wind__model_v2_0__docs_r1.md`
- `SOURCE_REGISTER_wind_tornado_wind__model_v2_0__docs_r1.csv`
- `CLAIM_PARAMETER_REGISTER_wind_tornado_wind__model_v2_0__docs_r1.csv`
- `PARAMETER_TIER_TABLE_wind_tornado_wind__model_v2_0__docs_r1.csv`
- `LEGACY_NUMERICAL_AUDIT_wind_tornado_wind__model_v2_0__docs_r1.md`
- `PRESSURE_TEST_wind_tornado_wind__model_v2_0__docs_r1.md`

Design, value, and contract:

- `SEVEN_STEP_AUDIT_wind_tornado_wind__model_v2_0__docs_r1.md`
- `VALUE_CROSSWALK_wind_tornado_wind__model_v2_0__docs_r1.csv`
- `HURRICANE_AND_NEIGHBORING_WIND_BOUNDARY_wind_tornado_wind__model_v2_0__docs_r1.md`
- `wind_tornado_wind_curve_derivation_dossier__model_v2_0__docs_r1.md`
- `wind_tornado_wind_damage_code_metadata_spec__model_v2_0__docs_r1.md`
- `wind_tornado_wind__model_v2_0__docs_r1__curve_artifact.json`
- `wind_tornado_wind__model_v2_0__docs_r1__capability.json`
- `known_answer_tests_wind_tornado_wind__model_v2_0__docs_r1.json`
- `damage_curve_records_wind_tornado_wind__model_v2_0__docs_r1.xlsx`
- `workbook_sheet_manifest_wind_tornado_wind__model_v2_0__docs_r1.md`

Validation and consumer migration:

- `OLD_VS_NEW_COMPARISON_wind_tornado_wind__model_v2_0__docs_r1.csv`
- `VALIDATION_REPORT_wind_tornado_wind__model_v2_0__docs_r1.md`
- `PROMOTION_GATE_MATRIX_wind_tornado_wind__model_v2_0__docs_r1.md`
- `docs/contracts/hazard_handoff/wind_tornado_wind_model_v2_0_hazard_migration_proposal.md`

## Explicit non-changes

```yaml
current_model_v1_0: unchanged
current_artifact_index: unchanged
portable_package_v2_5: unchanged
Hazard_runtime: unchanged
hurricane_curve: not_created
annual_frequency_and_tail_engine: not_owned_or_modified
promotion: not_performed
```
