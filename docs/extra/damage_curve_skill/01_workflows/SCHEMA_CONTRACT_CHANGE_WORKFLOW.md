# Schema / contract change workflow

Use when the machine contract changes.

Examples:

```text
- add required field to curve artifact JSON;
- change damage emit schema;
- change capability declaration semantics;
- change field-name canonicalization;
- change registry schema;
- change runtime helper expectations.
- replace a boolean/implicit hazard variant with required first-class `pathway_id` fields;
- add pathway-specific axis, curve-record, output, capability, or KAT contracts.
```

## Step 1 — compatibility decision

Classify the contract change:

| Type | Meaning | Package impact |
|---|---|---|
| additive_optional | New optional field; old consumers still work | patch/minor |
| additive_required | New required field; consumers must update | minor/major |
| enum_extension | New allowed enum value | minor |
| semantic_change | Existing field meaning changes | major or migration required |
| removal | Field removed | major |

## Step 2 — migration plan

Required fields:

```yaml
prior_schema_version:
new_schema_version:
compatibility_type:
affected_files:
affected_cells:
migration_rule:
consumer_action_required:
validation_rule:
```

For a required pathway contract, also record:

```yaml
pathway_field_required_in:
  - request_or_damage_code
  - pathway_registry
  - curve_record
  - failure_unit_output
  - capability_support_matrix
  - known_answer_test
legacy_boolean_or_branch:
legacy_to_pathway_mapping:
ambiguous_legacy_behavior: reject | withhold | documented_explicit_mapping
unknown_pathway_behavior: reject | withhold
default_pathway: prohibited_for_multi_pathway_cells
dual_read_window:
rollback_rule:
exact_pin_fields: [cell_model_version, documentation_revision, schema_version, sha256]
```

An old boolean can be mapped only when its semantics are exact and documented. Do not infer `pathway_id` from intensity, selector values, conditioner state, or a missing field.

## Step 3 — cell impact

A schema change does not necessarily change model behavior. For each cell:

```text
[ ] runtime outputs unchanged?
[ ] artifact migrated?
[ ] capability declaration migrated?
[ ] known-answer tests still pass?
[ ] registry updated?
[ ] every released pathway and pathway × failure-unit support state migrated?
[ ] old consumers fail clearly or follow a time-bounded dual-read rule?
[ ] exact model/docs/schema/SHA pin verified by a consumer fixture?
```

## Step 3A — pathway-specific schema checks

For multi-pathway bundles, validate:

```text
[ ] pathway IDs are unique, stable, and defined once;
[ ] every curve record references one declared pathway ID;
[ ] every failure-unit output and KAT carries one pathway ID;
[ ] axes/bridges resolve by pathway rather than one ambiguous global field;
[ ] capability is resolvable at pathway × failure-unit grain;
[ ] unsupported pairs withhold with a stable reason and no numeric fallback;
[ ] single-pathway cells have an explicit migration/default policy if the new field is globally required;
[ ] neighboring-cell identifiers are references, not callable aliases.
```

## Step 4 — release note

Explicitly state:

```text
schema changed: yes/no
cell model behavior changed: yes/no per cell
consumer migration required: yes/no
consumer pin verified: yes/no
```
