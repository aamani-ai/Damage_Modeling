# Validation report — wildfire_solar model v1.0 docs r3

Validation date: 2026-07-10.

## Release identity

```yaml
change_class: NEW_CELL_MODEL_RELEASE
semantic_damage_model_version: model v1.0
documentation_revision: docs r3
model_grade: screening_engineering_proxy
canonical_runtime_artifact: true
curve_records: 10
artifact_schema_version: damage_curve_record_bundle.v2
capability_schema_version: capability_declaration.v2
portable_package_release: unchanged_at_library_v2.5
```

## Machine and contract checks

| Check | Result |
|---|---|
| Canonical JSON parse | `PASS` |
| Bundle v2 JSON Schema | `PASS` |
| Standalone capability v2 JSON Schema | `PASS` |
| Embedded/standalone capability equality | `PASS` |
| Changelog v1 JSON Schema | `PASS` |
| Artifact index v2 JSON Schema | `PASS` |
| Index path/model/docs/schema/SHA pin | `PASS` |
| Canonical runtime artifact uniqueness | `PASS` through repository runtime validator |
| Legacy `01_cells/` or downstream filesystem path in artifact | `PASS` — none |

Artifact SHA-256:

```text
598512fbe2f0a3c8db48df69fdb2cd00ca5e0cc8e7ef761555837a3d76d166d8
```

## Numerical and scientific checks

| Check | Result |
|---|---|
| Failure-unit/curve/value coverage | `PASS` — ten of ten IDs reconcile |
| Exact state domain | `PASS` — state 0 plus source-native states 1–6 |
| Interpolation/extrapolation guard | `PASS` — prohibited |
| Zero-event boundary | `PASS` — all ten curves return zero |
| Monotonicity | `PASS` — all ten state tables nondecreasing |
| DR bounds | `PASS` — all ordinates in `[0,1]` |
| Effective source register | `PASS` — 41 unique source/control IDs |
| Parameter source resolution | `PASS` — every artifact source ID resolves |
| CSV rectangularity | `PASS` — ordinate and value-linkage tables |
| Direct + civil value | `PASS` — 688.2052014426097 USD/kWdc |
| Physical reconciliation | `PASS` — direct/civil + support = 877.7957023626668 USD/kWdc |
| Installed reconciliation | `PASS` — physical + excluded = 1120 USD/kWdc |
| Physical/installed ratio | `PASS` — 0.7837461628238097 |
| Class-6 physical/installed DR | `PASS` — 0.5831044761134818 / 0.45700589567932914 |

## Executable known-answer tests

```text
wildfire failure-unit state KATs:   15 PASS
wildfire aggregate value KATs:       7 PASS
wildfire FLP-distribution KATs:       1 PASS
wildfire contract/guardrail tests:    6 PASS
total wildfire tests:                29 PASS
```

The repository-wide runtime validator also passed all five indexed artifacts and retained all hail KAT,
selector, and value-linkage results.

## Workbook validation

| Check | Result |
|---|---|
| Sheet count and manifest | `PASS` — 8 sheets |
| Formula/error scan | `PASS` — zero `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, or `#N/A` |
| Formula-driven QA panel | `PASS` — all 14 checks |
| Aggregate formula cross-check | `PASS` against independent Python arithmetic and JSON KAT values |
| Visual QA | `PASS` — every sheet rendered and inspected |
| XLSX archive/XML integrity | `PASS` — `unzip -t` |

Workbook SHA-256:

```text
55426dd2bfdf6e67cc9f8d0ac483bfd54082c678d8d89ee4cb431526c0126b05
```

## Repository and governance checks

```text
damage-curve governance bundle: PASS — 102 files
governance self-tests:          PASS — 6 cases
local Markdown links:          PASS
git diff whitespace:           PASS
```

## Honest disposition

```text
RUNTIME_RELEASE: PASS
MODEL_GRADE: SCREENING_ENGINEERING_PROXY
FAILURE_UNIT_DR: SUPPORTED
SCENARIO_LOSS: SUPPORTED_WITH_EXPLICIT_VALUE_BASIS
CLAIMS_OR_FIELD_CALIBRATION: NO
CURVE_INTRINSIC_SPREAD: NOT_CARRIED
SITE_APPRAISAL_USE: PROHIBITED
PORTABLE_PACKAGE_V2_5_CHANGED: NO
```

The release passes because the approximation is explicit, testable, bounded, and correctly versioned—not
because Tier 4 ordinates have been upgraded into empirical evidence.
