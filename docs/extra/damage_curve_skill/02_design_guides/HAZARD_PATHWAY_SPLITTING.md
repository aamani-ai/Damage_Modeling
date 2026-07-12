# Hazard pathway splitting

Separate mechanism identity from cell identity. A cell may share one asset/value substrate while carrying several independently governed physical pathways. Do not combine mechanisms merely because their headline peril name or intensity unit looks similar.

## First-class pathway contract

For a multi-pathway cell, require a stable `pathway_id` at runtime and carry it through:

```text
M2/M3 request
pathway definition and hazard-axis bridge
curve record
failure-unit output
capability declaration
known-answer test
old-vs-new comparison
consumer pin/migration test
```

`pathway_id` is not:

```text
- a boolean such as tornado_variant=true;
- a selector, because it does not describe fixed asset identity;
- a conditioner, because it does not describe event-time asset state;
- an exposure fraction, because it does not describe value touched;
- a curve shift or undocumented branch inferred from intensity;
- a substitute for hazard occurrence, footprint, or frequency modeling.
```

Do not infer a pathway from wind speed alone. Different mechanisms can overlap in speed while having different profiles, directionality, duration, debris, pressure, and load paths.

## One-cell versus separate-cell test

Keep mechanisms in one cell only when all of the following are true:

```text
[ ] the asset scope and value ledger are the same;
[ ] the failure-unit taxonomy can be reconciled without hiding mechanism-specific units;
[ ] a consumer benefits from one stable hazard × asset entry point;
[ ] every mechanism can retain its own pathway_id, axis/bridge, evidence chain, curve records,
    capability state, and KATs;
[ ] aggregation does not double-count the same event/value pathway;
[ ] neighboring mechanisms have an explicit include/defer/split decision.
```

Create a separate cell when any of these hold:

```text
- the asset/value boundary materially changes;
- the hazard generation or delivered-demand bridge requires a separate consumer contract;
- the dominant failure units or economic denominator are different;
- event identity or compound-peril treatment cannot be kept unambiguous;
- combining would encourage one pathway's curves or evidence to be reused for another;
- lifecycle, release, or calibration needs are independently managed.
```

## Required per-pathway dossier

For every declared pathway, record:

```yaml
pathway_id:
physical_mechanism:
in_scope:
out_of_scope:
source_native_axis:
runtime_input_field:
unit:
height_duration_datum_basis:
physics_bridge:
failure_units_supported:
failure_units_withheld:
source_and_claim_register_filter:
curve_record_ids:
capability_state:
known_answer_test_ids:
consumer_event_identity_rule:
neighboring_cell_boundaries:
update_triggers:
```

An axis or source used by one pathway does not qualify another. Shared failure-unit IDs and value rows are allowed, but the numerical record and provenance must remain pathway-specific.

## Partial-pathway fail-closed rule

Evaluate support at `pathway_id × failure_unit_id`, not only at cell level.

```text
supported pair     -> emit the governed DR and flags;
conditional pair   -> emit only after its named gate passes;
withheld pair      -> emit no numeric DR and return a stable reason code;
unknown pathway    -> reject/withhold; never default to a supported pathway;
```

Use `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` (or the repository's governed equivalent) when a cell has some curves but the requested pair is unsupported. Use `NO_RUNTIME_CURVE` only when the cell/pathway has no qualified runtime curve at all. Do not borrow a neighboring pathway's curve as a convenience fallback.

## Neighboring and compound hazards

Record event identity and ownership explicitly. Damage Modeling owns conditional vulnerability, not occurrence frequency or catalog de-duplication, but it must give the consumer enough information to avoid applying overlapping pathways blindly.

For wind-turbine work, a defensible starting partition is:

```text
wind_tornado_wind
  straight_line_convective  -> non-tornadic thunderstorm/downburst/gust-front pathway
  tornado_direct_hit        -> tornado wind-field/direct-hit pathway

separate neighboring cell/workstream
  tropical_cyclone_wind     -> hurricane/typhoon/tropical-cyclone wind pathway
```

The shared `wind_tornado_wind` cell does not, by itself, deliver a hurricane curve. Tropical-cyclone wind requires its own change classification, evidence/axis review, event-identity contract, and consumer migration. Tornadoes spawned by tropical cyclones require a consumer-side compound-event rule so the same event/value is not counted twice.

## Required split note

```yaml
cell_id:
declared_pathway_ids:
shared_asset_value_substrate:
independently_governed_fields:
event_identity_owner:
related_pathway:
relationship:
why_in_scope_or_deferred:
future_cell_id_if_split:
double_count_guardrail:
validation_implication:
```

## Promotion failures

Do not promote a multi-pathway artifact when:

```text
- a pathway is still represented only by a boolean/shift;
- one global axis or evidence claim silently stands in for materially different mechanisms;
- unsupported pathway × failure-unit pairs receive numeric fallbacks;
- pathway-specific KATs or cross-pathway negative tests are missing;
- the consumer cannot select the pathway explicitly or verify its exact artifact pin;
- a neighboring hurricane/compound-wind boundary remains implicit.
```
