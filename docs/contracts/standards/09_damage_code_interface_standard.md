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
  schema_version: capability_declaration.v2
  vulnerability_emit:
    failure_unit_scalar_dr: supported | withheld
    scenario_loss_given_value_basis: supported_with_explicit_value_and_exposure_basis | withheld
    curve_intrinsic_spread: carried | not_carried | not_applicable_no_runtime_curve
    populated_emit_modes: [scalar_mean]
  consumer_annual_metrics:
    computation_owner: downstream_consumer
    frequency_driven_annual_loss_distribution: supported_if_consumer_samples_frequency_intensity_coupling_and_applies_caps | withheld_no_runtime_curve
    vulnerability_uncertainty_distribution: supported_by_curve_emit | not_supported_curve_intrinsic_spread_not_carried | withheld_no_runtime_curve
    eal: consumer_computable_with_prerequisites | withheld
    pml: consumer_computable_from_validated_annual_loss_distribution | withheld
    var: consumer_computable_from_validated_annual_loss_distribution | withheld
    tvar: consumer_computable_from_validated_annual_loss_distribution | withheld
  cap_binding:
    policy: consumer_enforced_fail_closed | not_applicable
    enforcement_owner: downstream_consumer | not_applicable
    status: not_evaluated_by_damage_artifact | consumer_pass | consumer_fail | not_applicable
    checks_required: [...]
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

For any value-linked view, the artifact must name the denominator and allocation profile. A field such as
`value_share = 0.35` is invalid without saying whether the denominator is physical replaceable value,
installed capex, or insured TIV and which support-cost rows are included.

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

## 7. No hidden annual metrics

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
   ├─ EAL       from an explicit frequency/intensity/value/coupling object
   ├─ PML       from the consumer-built annual loss distribution
   ├─ VaR/TVaR  from that same annual loss distribution
   ├─ return-period loss
   └─ portfolio metrics
```

A deterministic curve may be applied to sampled event counts and intensities to form a frequency-driven annual
loss distribution. That consumer distribution can support tail metrics even when the curve carries no
intrinsic vulnerability spread. The consumer must then label the result
`CURVE_INTRINSIC_SPREAD_NOT_CARRIED`; it must not claim that vulnerability uncertainty was sampled.

What remains prohibited is deriving PML/VaR/TVaR from one expected loss or inventing a distribution around a
scalar DR.

## 8. Withhold-not-caveat enforcement

A downstream consumer must check `capability_declaration.v2`. If a runtime curve, value/exposure basis,
hazard/event distribution, correct-grain cap treatment, or return-period support is absent, the affected value
must be null with a reason code.

```text
unsupported metric emitted with caveat  → not allowed
unsupported metric withheld by contract → required
frequency-driven tail with deterministic vulnerability → allowed with limitation flag
```
