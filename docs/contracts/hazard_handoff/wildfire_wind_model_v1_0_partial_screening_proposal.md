# Hazard handoff — wildfire_wind model v1.0 partial screening proposal

## Disposition

```yaml
cell_id: wildfire_wind
damage_code_id: WILDFIRE_WIND_PARTIAL_ELECTRICAL_SCREENING_V1
semantic_damage_model_version: model v1.0
documentation_revision: docs r1
canonical_runtime_artifact: false
action: review_or_shadow_only
cutover: not_authorized
```

Hazard may exercise this proposal in a bounded development/shadow path. Operational execution continues to
follow the model-v0.1 fail-closed boundary until an explicit canonical promotion.

## Valid call

```yaml
event_id: required
event_family_id: required
pathway_id: wildfire_thermal_attack
failure_unit_id:
  one_of:
    - WT_PAD_ELECTRICAL
    - WT_GSU_PROTECTION_CONTROL_DC
source_wildfire_product_id: USFS_RDS_2016_0034_3_270M
screening_assumption_set_id: WW_T4_PARTIAL_ELECTRICAL_SCREENING_2026_08_08
conditional_flame_length_class_state: exact integer 0..6
```

State 0 is a damage-code no-event control. States 1–6 are exact source-native FSim conditional flame-length
classes. Noninteger, missing, unknown, and out-of-range states reject. Hazard must not interpolate categories,
derive local heat flux, or substitute another wildfire product.

## Output boundary

The proposal returns scalar screening DR for the named failure unit. It does not return:

- aggregate electrical or whole-wind-farm DR;
- scenario dollars or an implicit NREL USD/kW value;
- firebrand, residue, internal-fire, or post-fire-hazard damage;
- burn probability, EAL, PML, VaR, TVaR, BI, outage, or revenue loss; or
- zero for an unsupported unit.

An unsupported unit must return null plus its governed reason codes. The same physical shared GSU package is
represented once, including at hybrid sites.

## Shadow-test requirements

1. Pin exact cell/model/docs/schema/artifact bytes locally; do not add a canonical index row.
2. Intersect each pad point and the actual GSU footprint with the FSim grid independently; do not smear one
   class over the lease polygon.
3. Confirm state lookup for all 14 numerical KATs and all 6 fail-closed tests.
4. Demonstrate that firebrand, wrong product, missing assumption acknowledgement, and noninteger states never
   fall back to a thermal result.
5. Preserve null results for every withheld unit and prohibit full TIV or mixed 72 USD/kW value binding.
6. Retain model-v0.1 rollback until independent review and an explicit promotion decision.
