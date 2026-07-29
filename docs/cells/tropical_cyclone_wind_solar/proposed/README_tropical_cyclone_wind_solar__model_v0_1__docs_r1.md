# tropical_cyclone_wind_solar — model v0.1 research scaffold

> **Status: proposed, pressure-tested, noncanonical, zero runtime curves.** This package does not change any
> current Damage Modeling or Hazard Modeling runtime pin.

## Outcome

```yaml
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested
canonical_runtime_artifact: false
curve_records: 0
runtime_reason: NO_RUNTIME_CURVE
```

The package closes the last active coverage gap in the supplied hazard × asset planning table. It reuses the
solar asset/value substrate and the tropical-cyclone event/pathway contract, but it does not inherit a
strong-wind, flood, wind-farm, or legacy hurricane numerical curve.

## Evidence decision

Three field evidence families constrain the problem without producing economic DR:

1. Ceferino et al. (2023) supplies a Bayesian source-native probability of **site-level extensive structural
   failure** for 14 large Caribbean ground-mounted sites. Its endpoint mixes clip/racking failure affecting
   more than half of panels and does not provide fixed/tracker, component, disposition, or cost splits.
2. Perry et al. (2025) supplies remote-sensing prevalence across 1,534 mixed PV sites: 17% visible damage and
   2.8% with more than 50% visible damage. It reports a weak gust relationship and strong installation/site
   heterogeneity, but no hidden damage, disposition, or cost.
3. The DOE/FEMP St Croix case supplies detailed fixed-tilt, attachment, structural, electrical, maintenance,
   rain, and flood mechanisms for one compound total-loss event. It is not a population curve.

Design, qualification, and aeroelastic sources define fields and future bridge gates. They are not failure
probabilities or economic consequences. The bounded search found no public matched chain from local TC demand
through exact architecture/state and inspected disposition to same-unit direct cost.

## Failure-unit plan

| Failure unit | Scaffold treatment | Main blocker |
|---|---|---|
| `PV_FIXED_TILT_MODULE_FIELD` | Primary candidate; withheld | No architecture-specific all-severity probability/cost chain |
| `PV_FIXED_TILT_SUPPORT_STRUCTURE` | Primary candidate; withheld | No qualified pressure bridge, states, or same-unit cost |
| `PV_TRACKER_MODULE_FIELD` | Exact-system candidate; withheld | No TC-specific module/state/cost model |
| `PV_TRACKER_SBOS_ASSEMBLY` | Exact-system candidate; withheld | No qualified TC demand/history and economic state chain |
| `PV_FOUNDATION` | Separate unit; withheld, not zero | Boundary, capacity, disposition, and dependency unresolved |
| `PV_POWER_CONVERSION_AND_COLLECTION` | Split-required unit; withheld | Point/line/network mechanisms and cost unresolved |
| `PV_GSU_SUBSTATION` | Separate shared-component binding; withheld | Site BOM/value, point/yard exposure, wind response, disposition, and cost unresolved |
| `PV_SCADA_COMMUNICATIONS` | Split-required unit; withheld | Location, mechanism, value, and disposition unresolved |
| `PV_CIVIL_INFRA` | Split-required unit; withheld | Mixed subject and mechanism bucket |
| `PV_REPLACEMENT_SUPPORT` | Allocate once after qualified repair scope | No reviewed reinstatement rule |

The Q1-2025 2024-USD/kWdc reference ledger reconciles direct hardware `656.9814571503722`, physical
`877.7957023626668`, excluded `242.20429763733296`, and installed `1120`. Module plus mounting anatomy is
`401.2045774673221`; it is not a supported loss share or cap.

## Axis decision

No runtime scalar axis is frozen. NHC one-minute sustained surface wind at 10 m is valid upstream storm-field
metadata, not array demand. The research candidates are architecture-specific:

```text
fixed tilt: local event net pressure / qualified design net-pressure capacity

tracker: tracker-normal local wind / exact-system Ucrit
         + duration/cycling + attained angle/drive/lock/control state
```

Both require named, versioned source-to-local bridges with exact definitions, validity, and uncertainty. No
global gust/height factor, pressure coefficient, Ucrit, stow credit, or convective-to-TC conversion is used.

## GSU/substation decision

The GSU/substation is a facility subasset and therefore remains inside this solar cell, but it is split from
array and collection equipment as `PV_GSU_SUBSTATION`. Common equipment anatomy and governance may be reused
across solar and wind facilities. Numerical response, local exposure, ownership, value, evidence, capability,
and release remain cell-local. No flood or neighboring wind curve is inherited.

## Package contents

Governance and evidence:

- `CHANGE_CLASSIFICATION_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `DECISION_LOG_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `SOURCE_REGISTER_tropical_cyclone_wind_solar__model_v0_1__docs_r1.csv`
- `CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_solar__model_v0_1__docs_r1.csv`
- `PARAMETER_TIER_TABLE_tropical_cyclone_wind_solar__model_v0_1__docs_r1.csv`
- `BOUNDED_EVIDENCE_SEARCH_LOG_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `LEGACY_EVIDENCE_INGESTION_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `NUMERICAL_CANDIDATE_AUDIT_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `PRESSURE_TEST_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`

Design and contract:

- `SEVEN_STEP_AUDIT_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `SITE_CONDITION_ADAPTER_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `VALUE_CROSSWALK_tropical_cyclone_wind_solar__model_v0_1__docs_r1.csv`
- `tropical_cyclone_wind_solar_curve_derivation_dossier__model_v0_1__docs_r1.md`
- `tropical_cyclone_wind_solar_damage_code_metadata_spec__model_v0_1__docs_r1.md`
- `tropical_cyclone_wind_solar__model_v0_1__docs_r1__curve_artifact.json`
- `tropical_cyclone_wind_solar__model_v0_1__docs_r1__capability.json`
- `known_answer_tests_tropical_cyclone_wind_solar__model_v0_1__docs_r1.json`
- `damage_curve_records_tropical_cyclone_wind_solar__model_v0_1__docs_r1.xlsx`
- `workbook_sheet_manifest_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`

## Explicit non-changes

```yaml
current_artifact_index: unchanged
portable_package_v2_5: unchanged
existing_cell_pins: unchanged
Hazard_runtime: unchanged
numeric_damage_emit: not_created
model_v1_0: not_released
annual_frequency_and_tail_engine: not_owned_or_modified
```
