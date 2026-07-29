# Validation report - hail_wind model v0.1/docs r2

## Result

```yaml
validation_date: 2026-07-29
result: PASS
primary_change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
semantic_damage_model_version: model v0.1
documentation_revision: docs r2
runtime_scaffold_revision: docs r1
canonical_runtime_pin: none
canonical_runtime_artifact: false
runtime_curve_records: 0
runtime_reason: NO_RUNTIME_CURVE
consumer_cutover_authorized: false
```

This report validates an evidence and governance revision. It does not validate a numerical hail x wind
curve or authorize any package publication, artifact-index entry, or Hazard runtime change.

## Binding validator

Command:

```bash
python3.12 scripts/reference_helpers/validate_hail_wind_v0_1_scaffold.py
```

Result:

```text
PASS hail_wind model v0.1/docs r2 evidence revision
runtime_scaffold_revision=docs_r1_unchanged
checks=3033
base_sources=21
base_claims=26
effective_sources=28
effective_claims=35
parameters=38
value_rows=26
failure_units=11
fail_closed_contract_tests=14
workbook_sheets=12
local_links_checked=62
artifact_pointers_checked=11
```

The validator confirms:

- the docs-r1 artifact remains noncanonical, empty, and fully withheld;
- the seven docs-r2 source rows and nine docs-r2 claims are rectangular, uniquely identified, tier-valid,
  and fully source-resolved;
- the strict `NO_GO` and no-output-change decisions are binding;
- all docs-r2 package files and local Markdown links exist;
- the 38 base parameter decisions, 26 value rows, 11 failure units, and 14 fail-closed KATs are unchanged;
- the original 12-sheet workbook remains structurally valid with every formula QA result passing; and
- `hail_wind` remains absent from the canonical artifact index.

## Scientific disposition

```text
SOURCE_HAIL_SEMANTICS: QUALIFIED_FOR_CAPTURE
COUPON_AND_SIMULATION_PHYSICS: RETAINED_WITH_TRANSFER_LIMITS
OPERATIONAL_NON_DAMAGE_OBSERVATION: RETAINED_NOT_ZERO
SOURCE_TO_BLADE_CONTACT_BRIDGE: WITHHELD
CONTACT_TO_INSPECTED_DISPOSITION: WITHHELD
DISPOSITION_TO_SAME_BLADE_ECONOMIC_DR: WITHHELD
SOURCE_SPECIFIC_SCREENING_ATOM: NOT_JUSTIFIED
MODEL_V1_0_PROMOTION: NO_GO
RUNTIME_CURVES: 0
```

## Regression checks

| Check | Result |
|---|---|
| Damage-curve skill-bundle validator | `PASS` - 103 files |
| Damage-curve governance self-tests | `PASS` - 8 cases |
| Repository-current runtime contracts | `PASS` - 5 canonical artifacts |
| `tropical_cyclone_wind_wind` v1 proposal | `PASS` - 5,757 checks |
| `flood_wind` v1 proposal | `PASS` - 1,996 checks |
| `tropical_cyclone_wind_solar` v1 proposal | `PASS` - 1,138 checks |
| `wildfire_wind` v0.1 scaffold | `PASS` - 3,078 checks |
| Git whitespace check | `PASS` |

## Unchanged runtime-shaped hashes

| File | SHA-256 |
|---|---|
| curve artifact JSON | `9872c601c15770c4e830fc473d3728f1dce0b44e515c2cdef8e3bcf85962401e` |
| standalone capability JSON | `4fa89511161cbbeb61adad52a58e44f3be89fbf26c54f8f8382bc7e8e4b8bcef` |
| known-answer tests JSON | `8560f297b08da219f2c042abc931c8f71e3f04b968ab514bf56fe5014b628f27` |
| workbook XLSX | `14c256d71ae673184b868ba5d3fd056ab292ba3b85f8d0da750d7b6e6891adef` |

These fingerprints match the validated docs-r1 runtime-shaped files. Docs r2 intentionally adds no new
artifact, capability, KAT, workbook, schema, package release, or consumer pin.
