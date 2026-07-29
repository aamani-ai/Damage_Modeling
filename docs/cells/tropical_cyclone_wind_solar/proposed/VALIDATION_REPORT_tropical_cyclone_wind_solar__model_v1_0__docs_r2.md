# Validation report - tropical_cyclone_wind_solar model v1.0/docs r2

## Result

```yaml
validation_date: 2026-07-29
result: PASS
primary_change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
semantic_damage_model_version: model v1.0
documentation_revision: docs r2
runtime_proposal_revision: docs r1
canonical_runtime_pin: none
canonical_runtime_artifact: false
runtime_curve_records: 1
strict_evidence_gate: NO_GO_RETAIN_V0_1
consumer_cutover_authorized: false
```

This report validates an evidence and governance revision. It does not validate a generic tropical-cyclone
solar curve or authorize package publication, artifact-index entry, scenario loss, or Hazard cutover.

## Binding validator

Command:

```bash
python3.12 scripts/reference_helpers/validate_tropical_cyclone_wind_solar_v1_proposal.py
```

Result:

```text
PASS tropical_cyclone_wind_solar model v1.0/docs r2 evidence revision
runtime_proposal_revision=docs_r1_unchanged
checks=1755
schema_validation=bundle v3 + capability v3 + damage emit v2 validated
source_derivation=not supplied; governed sufficient statistics validated
formula_kats=8
rejection_kats=9
withheld_unit_kats=4
fit_stat_rows=9
event_sensitivity_rows=6
cross_method_matches=4
cross_method_mean_absolute_difference_pp=12.1631605215
base_sources=10
base_claims=18
effective_sources=28
effective_claims=39
parameters=17
value_rows=11
old_vs_new_rows=16
workbook_sheets=13
workbook_formulas=83
workbook_qa_passes=18
local_links=168
unchanged_runtime_hashes=4
unchanged_helper_schema_hashes=5
missing_allowed=0
```

The validator confirms:

- bundle-v3, capability-v3, and a sample damage-emit-v2 object validate formally;
- the 18 docs-r2 source rows and 21 docs-r2 claim/rule rows are rectangular, uniquely identified,
  tier-valid, and fully source-resolved against the 10-source/18-claim base;
- the study-level Visual Crossing correction, no portable axis bridge, no tracker route, no tail extension,
  no new economic route, and no model bump are binding;
- all docs-r2 package, planning, handoff, and local Markdown links exist;
- the 13 original PAVA points, 17.4-39.1 m/s range, 15 always-on flags, 8 formula KATs, 9 rejection
  KATs, and 4 withheld-unit KATs remain unchanged;
- all 13 workbook sheets, 83 formulas, and 18 formula QA assertions pass; and
- the docs-r1 artifact, capability, KATs, and workbook match their pinned hashes and the cell remains absent
  from the canonical artifact index.

## Required scientific disposition

```text
PERRY_SOURCE_SPECIFIC_SCREEN: RETAINED_NONCANONICAL
PREDICTIVE_RELATIONSHIP: NOT_VALIDATED_EVEN_FOR_UNSEEN_SOURCE_COMPATIBLE_SITE
STUDY_LEVEL_GUST_PROVIDER: VISUAL_CROSSING_IDENTIFIED
ROW_LEVEL_AXIS_SEMANTICS: UNRESOLVED
HAZARD_3S_GUST_BRIDGE: WITHHELD
TRACKER_ROUTE: WITHHELD
SEVERE_TAIL_ABOVE_39_1_MPS: WITHHELD
SAME_UNIT_ECONOMIC_DR_EXPANSION: WITHHELD
MODEL_V1_1_OR_V2_0: NOT_EARNED
RUNTIME_PROPOSAL: DOCS_R1_UNCHANGED
```

## Regression checks

| Check | Result |
|---|---|
| Damage-curve skill-bundle validator | `PASS` - 103 files |
| Damage-curve governance self-tests | `PASS` - 8 cases |
| Repository-current runtime contracts | `PASS` - 5 canonical artifacts |
| TC-wind x solar model v0.1 scaffold | `PASS` - 923 checks |
| TC-wind x wind model v1.0 proposal | `PASS` - 5,759 checks |
| Flood x wind model v1.0 proposal | `PASS` - 1,999 checks |
| Hail x wind model v0.1/docs r2 | `PASS` - 3,033 checks |
| Wildfire x wind model v0.1 scaffold | `PASS` - 3,078 checks |
| Strong-wind x solar model v2 proposal | `PASS` - formal artifact/capability/sample-emit schema validation and KAT suite |

## Unchanged runtime-shaped hashes

| File | SHA-256 |
|---|---|
| curve artifact JSON | `bb01300d3e76114203dd826be5bff4bb9f2b98490880327dd57575007a180840` |
| standalone capability JSON | `5cd4f5501961a9d7f2c21259b4cfabd9e74eef30b5fdd9ceff72729b83ffc4fc` |
| known-answer tests JSON | `2e18603a9efb5cbb8bdd1c7f3b162e1a3e0c4b0723df5e1afbdc27def84f7cd2` |
| workbook XLSX | `748031c226187e3b43d83f6a57b2dbd5554457edc01a06debe16b7ef640f3105` |

Additional unchanged helper/schema guards:

| File | SHA-256 |
|---|---|
| reference evaluator | `a483b00df1e8f7647945f1e69daf8eb8e9c473bb27cf282e68ab46667868e7b5` |
| fit derivation helper | `cf6c244eb8e86fda12c53bc0afb008822385d8632d69a00dead08e430734f03e` |
| bundle-v3 schema | `a2287a7dc6d5ec19a04a1e25c4d130c282af5956318dcee6d3c137a1a50e33cb` |
| capability-v3 schema | `73e76744b6ae5c39f5503d2be454e5407674f301c24b0de0f586ade0980fd5b9` |
| emit-v2 schema | `9dda3b0dd831d14668526f9ed5aa653a98c7230412410f0286e9eedabc526060` |

Docs r2 intentionally adds no new artifact, capability, KAT, workbook, schema, evaluator behavior, package
release, or consumer pin.
