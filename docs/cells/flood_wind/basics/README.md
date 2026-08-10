# Flood × onshore wind basics

**Start here.** Proposed model v1.0/docs r1 answers one narrow question: given qualified freshwater depth
above the grade of one facility-level GSU/substation, what whole-substation screening damage ratio does the
legacy FEMA Hazus-MH 2.1 Table 7.9 assign?

```yaml
cell_id: flood_wind
cell_model_version: model v1.0
human_documentation_revision: docs r1
damage_code_id: FLOOD_WIND_FEMA_HAZUS_SUBSTATION_SCREENING_V1
change_class: MODEL_BEHAVIOR_CHANGE + SCHEMA_CONTRACT_CHANGE
canonical_runtime_artifact: true
consumer_cutover: none
```

## Five ideas to remember

1. **The main screened risk is a low facility-level substation, not the elevated turbine rotor.** Floodwater
   can reach control-room, cable, transformer, and switchgear functions at the GSU/substation while most
   turbine equipment remains above water.
2. **The v1 number belongs to one whole-substation source atom.** It is not a switchgear, transformer,
   control, cable, turbine, or whole-wind-farm curve.
3. **Solar and wind may share one physical GSU identity, but not duplicate value.** A shared hybrid-site
   substation is represented once. The reusable asset-neutral layer records identity and binding rules; the
   flood-wind cell owns the hazard response and release decision.
4. **The legacy table is screening evidence, not current Hazus runtime authority.** Hazus 7.0 marks electric
   power mapping-only and disables its default electric-power loss functions.
5. **A numerical DR still does not authorize loss.** No scenario loss is bound before canonical promotion;
   full-project TIV, mixed `72 USD/kW`, and per-turbine GSU repetition are prohibited.

## Supported flow

```text
freshwater depth above one substation's grade
                 |
                 +-- exact ESSL / ESSM / ESSH source class
                 +-- explicit legacy-source acknowledgement
                 +-- unprotected or internal post-bypass depth
                 v
linear interpolation on FEMA Table 7.9, 0–10 ft
                 v
FW_HAZUS_GSU_SUBSTATION_ASSEMBLY conditional scalar DR
                 |
                 `-- no component, whole-farm, dollar, EAL, or PML output
```

## Curve at a glance

| Depth (ft) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| DR | 0 | .02 | .04 | .06 | .07 | .08 | .09 | .10 | .12 | .14 | .15 |

At `7.5 ft`, exact linear interpolation yields `DR = 0.11`. At `10.0001 ft`, the result is withheld; the
endpoint is not clamped. A negative depth is rejected.

## Worked example

```yaml
pathway_id: flood_inundation_contact
failure_unit_id: FW_HAZUS_GSU_SUBSTATION_ASSEMBLY
substation_hazus_class: ESSM
source_assumption_set_id: FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION
water_quality_class: freshwater_non_contaminated
delivered_depth_basis: unprotected_or_internal_post_bypass_depth
flood_depth_above_substation_grade_ft: 7.5
```

The review evaluator returns:

```text
status: conditional
curve_id: FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL
scalar_central_dr: 0.11
scenario_loss_status: supported_with_explicit_same_substation_value_and_exposure_only
```

If WSE and grade are supplied instead, both elevations must use the same vertical datum. For example,
`100.3048 m - 100.0000 m = 0.3048 m = 1 ft`, which yields `DR = 0.02`.

## What still withholds

- all six GSU component units;
- turbine-base and pad/turbine electrical equipment;
- collection cables and terminations;
- turbine foundation/scour and mixed civil subjects;
- salt, brackish, contaminated, chemically contaminated, and unknown water states;
- any value binding before promotion;
- whole-wind-farm, annual, tail, portfolio, insurance, and financial outputs.

Withheld means unknown/not supported, never zero.

## Read next

- [How the model is built](HOW_THE_MODEL_IS_BUILT.md)
- [Exact model reference](MODEL_REFERENCE.md)
- [Cell anchor](../README.md)
- [Derivation dossier](../current/flood_wind_curve_derivation_dossier__model_v1_0__docs_r1.md)
- [Canonical artifact](../current/flood_wind__model_v1_0__docs_r1__curve_artifact.json)
- [Audit workbook](../current/damage_curve_records_flood_wind__model_v1_0__docs_r1.xlsx)
- [Historical model-v0.1 package](../proposed/README_flood_wind__model_v0_1__docs_r1.md)
