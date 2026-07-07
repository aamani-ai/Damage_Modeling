# Decision log standard

Every material governance decision should be logged. The log does not need to be long; it must be specific.

## Required decision record

```yaml
decision_id: <stable_id>
date: YYYY-MM-DD
affected_scope: package | global_method | cell | schema | handoff
cell_id: <cell_id or null>
change_class: <classifier value>
decision: <what was decided>
reason: <why>
alternatives_considered:
  - option:
    outcome: adopted | rejected | deferred
    reason:
version_impacts:
  package_release:
  cell_model_version:
  docs_revision:
  schema_version:
validation_required:
  - <gate>
reviewer_notes:
  - <note>
```

## Good decision log examples

```text
Good:
  "Mark legacy hail capex-weighted JSON as non_canonical_legacy_placeholder because canonical hail_solar model v1.0 is failure-unit PV module curve. No model bump; downstream routing handoff required."

Bad:
  "Cleaned hail stuff."
```
