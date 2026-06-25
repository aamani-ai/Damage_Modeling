# 09 · Damage-Code Interface Standard

The damage-code layer should output damage ratios at the right granularity. It should not become the EAL engine or financial metrics engine.

## 1. Purpose

A damage code answers:

```text
Given hazard intensity and relevant asset metadata,
what damage ratio applies to each modeled failure-unit?
```

It should not need to answer:

```text
What is the annual frequency of the hazard?
What is the final EAL?
What is the insurance premium?
What is the full financial return-period loss?
```

Those are downstream applications that consume the damage code.

## 2. Standard damage-code object

```yaml
damage_code_id: <ID>
version: <version>
hazard_asset_pair: <hazard_x_asset>
canonical_curve_artifact: <relative path to JSON>

hazard_axis:
  id: <axis_id>
  input_field: <field>
  unit: <unit>
  valid_range: [min, max]
  extrapolation_policy: clamp_or_warn

failure_units:
  - id: <failure_unit_id>
    subsystem: <SUBSYSTEM_CODE>
    component: <COMPONENT_CODE>
    treatment: primary_nonzero
    curve_id: <curve_id>
    y_axis: damage_ratio
    value_link_bucket: <bucket>
    f_kind: material_share | site_geometry | n/a

selectors:
  - field: <field>
    aliases: [<legacy_or_external_name>]
    effect: chooses_curve_family | chooses_parameter_set
    required: true | false | conditional
    default: <default>

conditioners:
  - field: <field>
    aliases: [<legacy_or_external_name>]
    effect: shifts_curve | blends_curves | state_selection | demand_multiplier
    required: true | false | conditional
    default: <default>

exposure:
  - field: <field>
    aliases: [<legacy_or_external_name>]
    effect: scales_affected_value | selects_exposed_units | local_demand_multiplier
    required: true | false | conditional
    default: <default>

emit_contract:
  schema_version: damage_emit.v1
  supported_emit_modes:
    - scalar_mean
    - scalar_mean_plus_bounds
    - discrete_state_table
    - parametric_distribution
    - state_ensemble
  populated_emit_modes_for_this_cell:
    - scalar_mean

capability_declaration:
  schema_version: capability_declaration.v1
  spread_carried: true | false
  metrics_supportable:
    failure_unit_scalar_dr: supported
    scenario_loss_given_value_basis: supported | conditional
    scalar_eal: conditional_require_cap_binding_preflight | withheld | supported
    pml: withheld | supported
    var: withheld | supported
    tvar: withheld | supported
  cap_binding:
    policy: pass_required | fail_closed | not_applicable
    preflight_status: pass | fail | not_executed_no_distribution
    required_before_scalar_eal: true | false
```

## 3. Output grain

The primary output should be at the failure-unit level:

```text
failure_unit_damage_ratio
```

Optional convenience outputs may include:

```text
subsystem_loss_fraction
physical_base_loss_fraction
TIV_loss_fraction
```

But those require a value basis and should be clearly labeled as convenience views, not the primary vulnerability output.

## 4. Distribution-ready emit object

The emit seam must support scalar or spread without changing schema later.

```yaml
emit:
  schema_version: damage_emit.v1
  cell_id: <cell_id>
  damage_code_id: <damage_code_id>
  model_version: <semantic damage-model version>
  emit_mode: scalar_mean | scalar_mean_plus_bounds | discrete_state_table | parametric_distribution | state_ensemble
  hazard_input_used: {...}
  selectors_used: {...}
  conditioners_used: {...}
  exposure_used: {...}
  failure_unit_results:
    - failure_unit_id: <id>
      curve_id: <curve_id>
      subsystem: <SUBSYSTEM_CODE>
      component: <COMPONENT_CODE>
      scalar_mean_dr: <0-1 or null>
      distribution:
        type: none | discrete_states | parametric | ensemble
        states: []
        params: {}
      metadata_flags: []
  capability_declaration_ref: <pointer or embedded object>
  cap_binding_preflight_ref: <pointer or embedded result>
```

A v1 cell may populate only `scalar_mean_dr`; the object must still allow distribution fields.

## 5. Reviewed-but-not-modeled outputs

The code or metadata spec should also declare reviewed units:

```yaml
secondary_or_reconciliation_units:
  - subsystem: INVERTER_SYSTEM
    treatment: DR_near_zero_v1
    reason: direct hail is not the dominant mechanism in this cell

  - subsystem: MOUNTING
    treatment: conditioner_only_v1
    reason: tracker stow changes module exposure but direct tracker damage is not modeled
```

This preserves the snapshot identity of the cell.

## 6. Null and unknown handling

For required selectors or conditioners, the code should define default behavior.

Examples:

```text
module_archetype unknown
  → use default_3_2mm_glass_backsheet, flag DEFAULT_SELECTOR_USED

stow_state unknown
  → use probabilistic/default scenario, flag UNKNOWN_CONDITIONER_STATE

hazard input outside range
  → clamp or extrapolate with warning, depending cell policy
```

## 7. No hidden EAL

The damage code may be run over a hazard frequency curve by another system. It should not internally hard-code frequency assumptions unless the cell explicitly includes a site-adaptation utility sheet.

```text
hazard catalog
   │
   ▼
damage code
   │
   ▼
failure-unit DR / emit object
   │
   ▼
financial / risk engine
   ├─ EAL       only if frequency layer + cap-binding gate pass
   ├─ PML       only if spread/tail support exists
   ├─ return-period loss
   └─ portfolio metrics
```

## 8. Withhold-not-caveat enforcement

A downstream consumer must check `capability_declaration.metrics_supportable` before emitting metrics. If the requested metric is `withheld` or `conditional_require_cap_binding_preflight` without a passing preflight result, the value should be absent/null with a reason code.

```text
unsupported metric emitted with caveat  → not allowed
unsupported metric withheld by contract → required
```
