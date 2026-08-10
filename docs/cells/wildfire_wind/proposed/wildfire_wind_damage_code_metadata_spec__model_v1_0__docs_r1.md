# Metadata contract — wildfire_wind model v1.0/docs r1

## Required request fields

```yaml
event_id: nonempty
event_family_id: nonempty
pathway_id: wildfire_thermal_attack
failure_unit_id:
  one_of:
    - WT_PAD_ELECTRICAL
    - WT_GSU_PROTECTION_CONTROL_DC
source_wildfire_product_id: USFS_RDS_2016_0034_3_270M
screening_assumption_set_id: WW_T4_PARTIAL_ELECTRICAL_SCREENING_2026_08_08
conditional_flame_length_class_state: exact integer 0..6
```

## Required result meaning

```yaml
schema_version: damage_emit.v2
emit_mode: scalar_mean
status: conditional
scalar_central_dr: same-failure-unit direct physical repair/replacement cost ratio
scenario_loss: not emitted
annual_and_tail_metrics: not emitted
```

Every numerical result carries the noncanonical, Tier-4, partial-coverage, FSim-not-local-heat-flux,
no-automatic-mitigation-credit, not-field-or-claims-calibrated, and no-intrinsic-spread flags.

Unsupported failure units return `status: withheld`, `curve_id: null`, `scalar_central_dr: null`, and exact
reason codes. Unknown pathways, wrong product identity, missing assumption acknowledgement, and invalid
class states reject rather than returning a numeric fallback.

The machine-authoritative fields are in
`wildfire_wind__model_v1_0__docs_r1__curve_artifact.json` and
`wildfire_wind__model_v1_0__docs_r1__capability.json`.
