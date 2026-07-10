# Validation report — wildfire_solar model v0.1 docs r2

Validation date: 2026-07-10.

## Release boundary

```yaml
primary_change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
secondary_change_classes:
  - DOCS_ONLY
semantic_damage_model_version: model v0.1
documentation_revision: docs r2
canonical_runtime_artifact: false
curve_records_before: 0
curve_records_after: 0
runtime_index_inclusion: false
package_release: unreleased
```

This report validates a research, promotion, and consumer-contract revision. It does not validate a
wildfire-solar numerical fragility or authorize loss output.

## Checks

| Check | Result | Evidence |
|---|---|---|
| Change classification | `PASS` | Output behavior remains absent; docs-only/evidence-only classification is consistent with version policy. |
| Source register | `PASS` | Effective r1 base + r2 addendum contains 41 unique source/control IDs. |
| Claim register | `PASS` | Effective r1 base + r2 addendum contains 69 unique claims; every semicolon-separated source ID resolves. |
| CSV rectangularity | `PASS` | Both r2 addenda parse with the declared headers and no overflow columns. |
| Transferability | `PASS_FAIL_CLOSED` | Every new source states direct support and prohibited inference; no event, claim, lab or standard source is promoted beyond its endpoint. |
| Bounded negative-evidence finding | `PASS` | Cutoff, surfaces, query families, qualification tests, results, access limits and update triggers are recorded. |
| Consumer seam | `PASS` | Current Hazard proxy assumptions are explicitly identified and excluded from canonical/reportable use. |
| Promotion gates | `PASS` | Each v1.0 blocker has an acceptance test and candidate evidence package; no calendar-only promotion is allowed. |
| Markdown links | `PASS` | Six governing wildfire docs checked; zero broken local links. |
| Diff whitespace | `PASS` | `git diff --check`. |
| Governance skill bundle | `PASS` | `validate_skill_bundle.py`: 102 files. |
| Governance self-tests | `PASS` | `run_self_tests.py`: 6 cases. |
| Repository runtime contracts | `PASS` | 4 canonical artifacts; hail KAT/selector/value checks pass; wildfire remains absent. |
| Research workbook package | `PASS` | `unzip -t` reports no error across workbook XML/archive members. |

## Scientific disposition

```text
REGIONAL_FSIM_SCREENING: QUALIFIED_WITH_SOURCE_NATIVE_SEMANTICS
FSIM_TO_COMPONENT_LOCAL_ATTACK: WITHHELD
LOCAL_ATTACK_TO_POPULATION_DISPOSITION: WITHHELD
DISPOSITION_TO_SAME_UNIT_ECONOMIC_DR: WITHHELD
SITE_CONTROL_NUMERIC_CREDITS: WITHHELD
WHOLE_SITE_ASSET_CURVE: REJECTED_ARCHITECTURE
CANONICAL_RUNTIME_CURVES: 0
MODEL_V1_0_PROMOTION: NOT_AUTHORIZED
```

The deep-research pass improves endpoint design and makes the acquisition plan concrete. It does not close
the load-bearing transfer and calibration links, so `WITHHELD: NO_RUNTIME_CURVE` is the intended validated
result.
