# Example — governed multi-pathway `wind_tornado_wind` rebuild

This is a governance example, not a numerical curve release. It shows how to rebuild an existing cell when an old straight-wind curve plus tornado boolean/shift no longer represents the physics or the consumer seam. It deliberately supplies no curve parameters or ordinates.

## Request

```text
Reassess high wind, tornado, and hurricane coverage for wind turbines from first principles.
Deliver strong/convective wind and tornado correctly, update the governance skill, and explain
whether one run also produces a hurricane curve.
```

## Operating and lifecycle decision

```yaml
operating_mode: inside_repo
existing_cell_id: wind_tornado_wind
current_model: model v1.0
proposed_model: model v2.0
proposed_documentation_revision: docs r1
proposal_package_release: unreleased
proposal_package_inclusion_status: not_included
proposal_canonical_runtime_artifact: false
current_runtime_action_during_research: preserve_current_pin
```

Build the research package under a proposed folder. Do not replace `current/`, update the canonical runtime index, archive/deprecate v1.0, or ask Hazard to cut over until the proposal and consumer fixture pass.

## Change classification

Treat the request as separate, coupled events:

```yaml
- event_id: skill_process_revision
  change_class: SKILL_REVISION
  skill_revision: 0.5 -> 0.6
  runtime_impact_by_itself: none

- event_id: wind_tornado_behavior_rebuild
  change_class: MODEL_BEHAVIOR_CHANGE
  cell_id: wind_tornado_wind
  outputs_can_change_for_same_inputs: true
  cell_model_version: model v1.0 -> proposed model v2.0
  reason: pathway axes, curve forms, coverage, parameters, and assembly may change

- event_id: first_class_pathway_contract
  change_class: SCHEMA_CONTRACT_CHANGE
  compatibility_type: additive_required_and_semantic_change
  reason: pathway_id replaces an implicit/boolean mechanism branch and must propagate through records and emits
  schema_version: bump_required_before_release
```

Do not collapse the schema change into the model-version rationale or claim the skill revision itself migrated a live schema.

## Scope and pathway decision

Use one shared cell for the common onshore wind-turbine asset/value substrate, with two independently governed pathways:

| pathway_id | Physical mechanism | Included in this rebuild | Separate numerical governance |
|---|---|---:|---:|
| `straight_line_convective` | Non-tornadic thunderstorm/downburst/gust-front wind demand | yes | yes |
| `tornado_direct_hit` | Tornado wind-field/direct-hit demand | yes | yes |
| `tropical_cyclone_wind` | Hurricane/typhoon/tropical-cyclone wind environment | no; neighboring cell/workstream | yes, in its own cell |

This single rebuild delivers high-wind/convective and tornado research. It does not deliver a hurricane curve. Similar units or high wind speed do not establish a common load pathway. Tropical-cyclone wind needs a separate evidence/axis/event-identity decision and cannot be accepted as an alias for either pathway.

Damage Modeling documents the conditional vulnerability boundary. Hazard owns event occurrence, footprint, frequency, and catalog de-duplication. The handoff must still warn that tornadoes embedded in a tropical cyclone cannot be applied as independent duplicate events/value loss without a consumer-side compound-event rule.

## First-principles research sequence

### 1. Audit the legacy behavior

Reproduce, do not assume:

```text
- every old equation, parameter, cap, shift, selector, and value share;
- the exact x-axis, wind-speed averaging time, height, exposure/terrain basis, and conversion;
- representative failure-unit and aggregate outputs;
- how the tornado boolean changes output;
- every downstream hardcoded curve/value branch that claims equivalence;
- discrepancies between canonical Damage Modeling and Hazard consumer behavior.
```

Mark a legacy mapping `unmappable_legacy_semantics` when a boolean does not uniquely define a physical pathway.

### 2. Reconfirm failure units and value coverage

Start from the asset/BOM and row-level value ledger, not the old curve count. Candidate families may include rotor/blade, tower/support, nacelle/drivetrain, foundation/interface, and electrical/control, but the seven-step audit decides the final units.

For every material value row, record:

```text
direct vulnerable failure unit;
shared support allocation applied once;
excluded/nonphysical value;
applicable_pathway_ids or all_shared;
unresolved split and withholding consequence.
```

The same physical value ledger may support both pathways. Event exposure fractions and DRs remain pathway-specific and may not be counted twice in a compound event.

### 3. Build independent pathway evidence chains

For each pathway, complete source, claim, parameter-tier, bounded-search, and legacy-audit records. A source adopted for one pathway cannot qualify the other without an explicit permitted transfer.

At minimum, resolve independently:

```text
source-native intensity variable and measurement convention;
height, duration, terrain/datum, directionality, profile, and local-demand bridge;
failure mechanism and endpoint;
asset/population transfer;
curve form and each adopted parameter;
operational state as conditioner rather than pathway;
valid range, extrapolation, saturation/cap, and update triggers.
```

If only mechanism evidence exists, do not convert it into a damage-ratio parameter. If a bridge or endpoint calibration fails for one pair, withhold that pathway × failure-unit pair.

### 4. Create the pathway coverage matrix

Use one row for every declared pair:

| pathway_id | failure_unit_id | support | curve_ids | reason/update trigger |
|---|---|---|---|---|
| `straight_line_convective` | `<unit>` | supported / conditional / withheld | `<ids or none>` | `<reason>` |
| `tornado_direct_hit` | `<unit>` | supported / conditional / withheld | `<ids or none>` | `<reason>` |

An unsupported pair returns no number with `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`. It does not receive the other pathway's curve, the closest failure-unit curve, or an analyst-selected zero/full-loss default.

### 5. Propose numerical behavior only after the gates above

Each curve record contains exactly one `pathway_id`, one failure-unit ID, its own axis/bridge and source-parameter references. Do not preserve the old tornado behavior as a negative D50 shift inside a straight-wind record. Even when two records happen to have equal values, keep their identities and provenance separate.

## Old-versus-new comparison

For every pathway × failure-unit pair, compare:

| Physical scenario | pathway_id | failure unit | v1.0 result | proposed v2.0 result | delta | disposition/reason |
|---|---|---|---:|---:|---:|---|
| same governed low input | `<id>` | `<unit>` |  |  |  |  |
| same governed transition input | `<id>` | `<unit>` |  |  |  |  |
| same governed high input | `<id>` | `<unit>` |  |  |  |  |

Use the same denominator, exposure, selector, conditioner, and unit conversion. Compare aggregate convenience views only after the failure-unit table. If the v1.0 branch does not describe the same physical scenario, do not compute a misleading delta.

## Schema migration

The proposed contract requires `pathway_id` in:

```text
request/damage-code input;
top-level pathway registry;
pathway-specific axis registry;
curve record;
failure-unit output;
pathway × failure-unit capability row;
known-answer test;
consumer fixture and audit emit.
```

Migration rules:

```text
- no default pathway for the multi-pathway cell;
- no inference from gust speed, selector, conditioner, or missing field;
- map a legacy boolean only when semantics are exact and documented;
- otherwise reject/withhold and require explicit pathway_id;
- retain a time-bounded dual-read adapter only if it is tested and reversible;
- publish cutover and rollback rules.
```

## Known-answer and negative tests

Run low/transition/high/edge fixtures for each supported pathway and failure-unit family, plus:

```text
missing pathway_id -> withheld/rejected;
unknown pathway_id -> withheld/rejected;
straight_line_convective request cannot select tornado_direct_hit record;
tornado_direct_hit request cannot select straight_line_convective record;
same numeric speed on both pathways does not bypass pathway-specific routing;
unsupported pair -> null DR + NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT;
tropical_cyclone_wind -> not accepted as alias in this cell;
every output repeats requested pathway_id and resolved curve_id;
stale model/docs/schema/SHA consumer pin -> integration failure.
```

## Consumer migration and promotion gate

Record and test:

```yaml
consumer: Hazard M3
prior_pin:
new_pin:
pin_fields:
  - cell_model_version
  - documentation_revision
  - schema_version
  - artifact_sha256
explicit_pathway_selection: required
legacy_boolean_mapping:
dual_read_or_cutover_rule:
rollback_rule:
integration_fixture:
status: pending | pass | fail
```

Promotion requires all of the following:

```text
[ ] pathway architecture and neighboring hurricane boundary approved;
[ ] seven-step/value/evidence/legacy audits complete;
[ ] every supported numerical record has endpoint-matched provenance;
[ ] unsupported pairs fail closed;
[ ] old-vs-new and pathway-specific KATs pass;
[ ] bundle/emit/capability schemas and migration validate;
[ ] Hazard loads the canonical JSON and verifies the exact new pin;
[ ] current v1.0 is archived/deprecated only as part of the approved cutover;
[ ] registry, artifact index, release notes, hashes, and rollback pointer are updated atomically.
```

## Explicit non-changes in the research proposal

```text
- no current v1.0 runtime replacement;
- no package release or canonical-index promotion;
- no hurricane/tropical-cyclone numerical curve;
- no hazard frequency, event footprint, EAL, PML, VaR, TVaR, BI, or insurance logic;
- no unsupported pathway/unit fallback presented as an approximation.
```
