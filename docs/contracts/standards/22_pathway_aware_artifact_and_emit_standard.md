# 22 · Pathway-aware artifact and emit standard

## 1. Purpose and status

Bundle v2 protects the payloads used by the current single-axis evaluators. It cannot represent a cell in
which two hazard mechanisms share an asset substrate but require different axes, evidence, curve families,
capabilities, and consumer routing.

This standard defines the proposed v3 contract for that case. It is used by the `wind_tornado_wind` and
`strong_wind_solar` model v2.0 proposals and remains a draft until a v3 model and its Hazard migration pass
promotion review. Existing canonical artifacts remain bundle v2 and emit v1.

```yaml
artifact_schema: damage_curve_record_bundle.v3
emit_schema: damage_emit.v2
capability_schema: capability_declaration.v3
current_canonical_contracts_changed: false
```

## 2. First-class pathway identity

`pathway_id` is a required runtime dimension. It identifies the causal loading mechanism selected upstream;
it is not a fixed asset selector, an event-time conditioner, a Boolean variant, or an alias for hazard name.

```text
valid:
  pathway_id = straight_line_convective
  pathway_id = tornado_direct_hit

invalid:
  tornado_variant = true
  pathway hidden in selector_match
  pathway inferred from one shared curve's D50 shift
```

The pathway must be repeated in the selected record and every emitted failure-unit result. The evaluator
rejects a missing, unknown, or mismatched pathway rather than choosing a default.

## 3. Bundle v3 structure

```yaml
schema_version: damage_curve_record_bundle.v3
cell_id: <shared hazard-asset cell>
failure_units: <shared asset/value substrate>
pathways:
  - pathway_id: <stable ID>
    hazard_scope: <included and excluded mechanisms>
    hazard_axis: <pathway-native axis and proxy rules>
    selector_logic: <fixed asset attributes>
    conditioner_logic: <event-time state>
    exposure_contract: <upstream affected units/value grain>
    failure_unit_coverage: <modeled, secondary, or withheld by pathway>
    curve_records:
      - pathway_id: <same stable ID>
        failure_unit_id: <shared unit ID>
        curve_form: <pinned evaluator form>
        parameters: <pinned payload>
value_linkage: <row-complete shared basis and support-cost rules>
emit_contract:
  schema_version: damage_emit.v2
capability_declaration:
  schema_version: capability_declaration.v3
```

Every `(pathway_id, failure_unit_id)` combination receives either a curve record or an explicit withheld
treatment with reason codes. A shared failure-unit list does not authorize parameter sharing.

## 4. Ordered damage-state lognormal form

The initial v3 evaluator pins one pathway-aware form:

```text
curve_form = ordered_damage_state_lognormal
```

For positive scalar demand `x`, common dispersion `beta_ln`, and ordered median capacities `theta_j`:

```text
P(DS >= j | x) = Phi(ln(x / theta_j) / beta_ln)
```

Exact state probabilities are differences between adjacent exceedance probabilities. Expected damage ratio
is the exact-state probability weighted by each state's same-unit direct replacement-cost ratio.

The payload requires:

```yaml
parameters:
  beta_ln: <positive number>
  zero_below: <optional nonnegative hard boundary>
  damage_states:
    - state_id: DS0
      cost_ratio: 0
      affected_subsystems: []
    - state_id: DS1
      cost_ratio: <nondecreasing 0..1>
      affected_subsystems: [...]
  capacity_scenarios:
    - scenario_id: lower_resistance | central_screening | upper_resistance
      state_medians: <one positive value for every state above DS0>
```

Semantic validation additionally requires:

- strictly increasing medians inside each scenario;
- nondecreasing state cost ratios;
- the same state count for every scenario;
- exact-state probabilities in `[0,1]` that sum to one;
- monotone expected DR for fixed pathway, selectors, conditioners, and scenario;
- no probabilistic weights on an epistemic scenario envelope unless separately evidenced.

An engineering envelope is not a confidence interval, percentile band, or sampled distribution merely
because it has three scenarios.

## 5. Axis and proxy rules

Each pathway owns its axis. A source-native field may be accepted only through a named bridge with provenance,
units, height, temporal averaging, and uncertainty.

```text
10 m ASCE gust -> not automatically hub or rotor gust
EF rating      -> not automatically measured turbine wind
derecho label  -> not a local turbine intensity
```

The artifact specifies its preferred input and permitted proxies. The consumer supplies the bridge; Damage
Modeling evaluates the delivered failure-unit demand. Missing a load-bearing bridge withholds the result.

When one pathway serves materially different asset architectures, `hazard_axis` may additionally carry:

```yaml
routing_field: array_architecture
architecture_input_contracts:
  <architecture_id>:
    axis_field: <normalized scalar evaluated by curve records>
    preferred_input_field: <source field>
    accepted_payloads:
      - mode: <preferred or proxy>
        required_fields: [<complete payload>]
    valid_range: [min, max]
```

The bundle v3 schema validates this optional structure; the cell validator must also cross-check the exact
architecture IDs and payload fields against evaluator and KAT behavior. A generic top-level preferred field
does not authorize cross-architecture fallback.

## 6. Selector, conditioner, and exposure separation

```text
pathway     = causal hazard mechanism
selector    = fixed turbine/design attribute
conditioner = event-time operating/control state
exposure    = which repeated turbines or external assets were touched
```

For a wind farm, turbine-point exposure, substation point exposure, collection-line exposure, and civil-area
exposure are different objects. A tornado swept fraction or straight-line footprint must not be applied once
to full TIV.

## 7. Emit v2

Emit v2 requires `pathway_id` at object and result level. It may carry a central screening response and named
scenario responses without pretending the scenarios are probabilistically weighted.

```yaml
schema_version: damage_emit.v2
pathway_id: <required>
emit_mode: scalar_mean_plus_bounds | state_ensemble
failure_unit_results:
  - pathway_id: <same ID>
    failure_unit_id: <ID>
    status: supported | conditional | withheld
    scalar_central_dr: <0..1 or null>
    scenario_drs: {<scenario_id>: <0..1>}
    state_probabilities_by_scenario: {...}
    withheld_reason_codes: [...]
    metadata_flags: [...]
```

Frequency, event count, spatial correlation, turbine hits, EAL, PML, VaR, TVaR, financial terms, and
portfolio accumulation remain consumer-owned.

## 8. Capability v3

Capability is stated per pathway because axis quality and failure-unit coverage may differ. It must declare:

- supported, conditional, and withheld failure-unit results;
- value/exposure requirements for scenario loss;
- whether spread is probabilistic, a nonprobabilistic envelope, or absent;
- limitation flags and extrapolation bounds;
- the pre-promotion noncanonical gate;
- consumer prerequisites after promotion.

A proposed artifact cannot authorize reportable consumer annual metrics. After promotion, a consumer may
compute a frequency-driven annual distribution only after its own occurrence, intensity, coupling, value,
cap, and pin/KAT checks pass.

## 9. Migration and compatibility

Adding bundle v3 does not rewrite bundle v2. Migration is deliberate:

```text
1. Build and validate the proposed v3 artifact.
2. Run pathway-specific KATs and old-vs-new comparisons.
3. Update the Hazard adapter to require pathway_id and emit v2.
4. Verify model + docs + schema + SHA pinning.
5. Remove Boolean pathway routing and hardcoded consumer curves.
6. Promote the cell only after both repositories pass acceptance tests.
```

Consumers that understand only bundle v2 must reject bundle v3. They must not flatten v3 into a shift-only
payload or silently evaluate the old canonical model under the new version label.

## 10. Neighboring-cell boundary

A shared asset substrate does not imply shared hazard physics. Tropical-cyclone wind, nonconvective synoptic
wind, and convective straight-line wind may reuse turbine anatomy and value rows while retaining separate
pathways or cells whenever duration, veer, turbulence, control availability, or environmental loading changes
the demand model materially.
