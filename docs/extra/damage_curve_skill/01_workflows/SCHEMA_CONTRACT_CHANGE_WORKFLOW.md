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

## Step 3 — cell impact

A schema change does not necessarily change model behavior. For each cell:

```text
[ ] runtime outputs unchanged?
[ ] artifact migrated?
[ ] capability declaration migrated?
[ ] known-answer tests still pass?
[ ] registry updated?
```

## Step 4 — release note

Explicitly state:

```text
schema changed: yes/no
cell model behavior changed: yes/no per cell
consumer migration required: yes/no
```
