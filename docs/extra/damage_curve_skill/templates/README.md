# templates

Copy these when creating or updating cells. Templates are intentionally strict so the output stays machine-checkable.

For a new or deeply re-researched cell, use this minimum set:

```text
TEMPLATE_NEW_CELL_README.md
TEMPLATE_CELL_DERIVATION_DOSSIER.md
TEMPLATE_CELL_METADATA_SPEC.md
TEMPLATE_CURVE_ARTIFACT.json
TEMPLATE_CAPABILITY_DECLARATION.json
TEMPLATE_SOURCE_REGISTER.csv
TEMPLATE_BOUNDED_EVIDENCE_SEARCH_LOG.md    when a negative-evidence claim is load-bearing
TEMPLATE_CLAIM_PARAMETER_REGISTER.csv
TEMPLATE_PARAMETER_TIER_TABLE.csv
TEMPLATE_VALUE_CROSSWALK.csv
TEMPLATE_LEGACY_EVIDENCE_INGESTION.md       when legacy material exists
TEMPLATE_SITE_CONDITION_ADAPTER.md          when site conditions matter
TEMPLATE_SEVEN_STEP_AUDIT.md
TEMPLATE_VALIDATION_REPORT.md
```

The templates do not require a numerical curve. A no-curve scaffold keeps `curve_records: []` and uses `NO_RUNTIME_CURVE` consistently.
