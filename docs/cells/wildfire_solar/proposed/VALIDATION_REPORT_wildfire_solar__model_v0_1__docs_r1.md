# Validation report — wildfire_solar model v0.1 research scaffold

Validation date: 2026-07-09.

## Classification and release boundary

```yaml
package_release: unreleased
release_event: none
package_baseline: library v2.5
package_inclusion_status: not_included
change_class: NEW_CELL_SCAFFOLD
secondary_change_classes:
  - EVIDENCE_ONLY_NO_OUTPUT_CHANGE
  - DOCS_ONLY
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested
documentation_status: working_revision
canonical_runtime_artifact: false
curve_record_count: 0
runtime_index_inclusion: false
```

The validated deliverable is a proposed research/evidence package, not a released damage model. Structural `PASS` means that provenance, field contracts, value reconciliation, withholding, and package integrity are internally coherent. It does not mean a wildfire-to-solar fragility has been calibrated.

## Machine-readable and provenance checks

| Check | Result | Evidence |
|---|---|---|
| JSON parse | `PASS` | Curve artifact, standalone capability, and known-answer files parse. |
| Curve-artifact JSON Schema | `PASS` | Validated against `curve_artifact_bundle.schema.json` with Ajv draft 2020 mode. |
| Capability JSON Schema | `PASS` | Validated against `capability_declaration.schema.json` with Ajv draft 2020 mode. |
| Canonical/runtime guard | `PASS` | `canonical_runtime_artifact=false`; `curve_records=[]`; proposed cell is absent from `machine_readable_artifact_index.json`. |
| Canonical input-field contract | `PASS` | Metadata, artifact logic, site adapter, and KATs use canonical fields; documentation groups and legacy aliases are explicit and non-callable. |
| Capability equality | `PASS` | Embedded capability deep-equals the standalone declaration. |
| Capability enums | `PASS` | All six metrics use exact `withheld`; cap policy/status use allowed fail-closed enums. |
| Source register | `PASS` | 24 unique sources/control records. |
| CSV register rectangularity | `PASS` | Every governed CSV row has exactly its header field count; no missing or extra columns. |
| Bounded negative-evidence search | `PASS` | Search cutoff, surfaces, query families, endpoint tests, inclusion/exclusion, scoped result, limitations, and update triggers are recorded. |
| Claim register | `PASS` | 51 unique claims; every semicolon-separated source ID resolves to the source register. |
| Parameter-tier table | `PASS` | 23 unique rows; every row has resolving provenance and a canonical `T1`–`T4` tier enum. |
| Failure-unit/value coverage | `PASS` | 11 candidate/decomposition/allocation records; every `WS_*` treatment named by the value crosswalk exists in the JSON inventory. |
| Known-answer tests | `PASS` | 13 axis, withholding, missing-site-state, site, legacy, and deferred-pathway tests; runtime-curve test list is empty. |
| Numeric KAT output guard | `PASS` | Zero numeric DR, loss, EAL, PML, VaR, or TVaR expected outputs. |
| Cell-local Markdown links | `PASS` | Zero broken relative links. |
| Diff whitespace check | `PASS` | `git diff --check` returned no errors. |

## Scientific and overestimation checks

| Check | Result | Governed conclusion |
|---|---|---|
| Source-native hazard contract | `PASS` | Six FSim conditional flame-length probability bins are retained; burn probability remains in the frequency layer. |
| Continuous FIL/FLI reconstruction | `PASS` | Prohibited; no midpoint or FIL6 cap is invented. |
| FSim duration interpretation | `PASS` | The 1/3/5-hour active periods are fire-growth simulation windows, not equipment exposure duration. |
| FIL/FLI-to-component demand | `WITHHELD` | No universal `kW/m` or class-to-`kW/m²`/time converter was validated. |
| Component demand-to-economic DR | `WITHHELD` | Laboratory endpoints are test/BOM specific and do not establish replacement-cost ratios. |
| Legacy logistic equations | `REJECTED` | Formula tests reproduce 5.82%–9.84% DR at zero intensity and disagreement with the legacy low-intensity table. |
| Legacy flame-length conversion | `REJECTED` | The inverse of the displayed equation does not reproduce the displayed intensity table. |
| Withdrawn FLP-weighted arithmetic | `PASS_AUDIT_ONLY` | Displayed weights and ordinates reproduce 7.2033%, $4.732M on direct hardware, and $6.323M on the broader physical basis; none is reportable. |
| Value reconciliation | `PASS` | Installed 1,120.000000 = physical 877.7957023626668 + excluded 242.20429763733296 USD/kWdc. |
| Direct/support separation | `PASS` | Direct hardware 656.9814571503722 USD/kWdc is separate from 220.81424521229468 USD/kWdc civil/replacement/support rows. |
| Mixed civil row 14 | `PASS_FAIL_CLOSED` | Direct civil failure units must be split from pathway/support treatment before loss; only rows 12, 13, and 15 are pure support allocations. |
| Whole-site exposure default | `PASS` | Prohibited; at-risk, burned, and attack fractions do not default to one. |
| Fence/wall/firebreak credit | `PASS` | Generic numeric credits are disabled; geometry, fuel continuity, wind, gaps, maintenance, and ember bypass remain explicit. |
| Protected/buried allocation | `PASS` | Protected value cannot silently enter an exposed component pathway. |
| Ember pathway | `PASS` | Captured separately and unable to emit damage in this scaffold. |
| Support-cost double count | `PASS` | Support costs are allocated once after damaged units are known and receive no independent curve. |

## Workbook checks

| Check | Result | Evidence |
|---|---|---|
| Sheet manifest | `PASS` | 13 sheets in the governed order: README through QA_Checks. |
| Formula/error scan | `PASS` | Artifact-tool scan found zero `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, or `#N/A` cells. |
| Formula-driven reconciliation | `PASS` | Asset, crosswalk, pressure-test, legacy-audit, count, and QA formulas recalculate to expected values. |
| Visual QA | `PASS` | All 13 sheets were rendered and inspected after final edits. |
| XLSX package integrity | `PASS` | `unzip -t` reports no archive/XML errors. |
| Damage-curve chart guard | `PASS` | Workbook contains no released curve and no damage-curve chart. |
| Preview cleanup | `PASS` | Only the evidence-constraint and site-adapter previews remain; misleading curve-preview names were removed. |

Workbook SHA-256:

```text
32ad048cff661928d0bcb5ffe80ce3dc160daed9e6e17baccb22d1eb5995823c
```

## Governance-skill checks

| Check | Result |
|---|---|
| `validate_skill_bundle.py` | `PASS` — 102 files |
| `run_self_tests.py` | `PASS` — 6 cases |

## Final disposition

```text
STRUCTURAL_PASS
PROVENANCE_AND_VALUE_RECONCILIATION_PASS
SITE_ADAPTER_SPECIFIED_NOT_PARAMETERIZED
FIL_TO_LOCAL_EXPOSURE_CALIBRATION_WITHHELD
COMPONENT_TO_ECONOMIC_DR_CALIBRATION_WITHHELD
ZERO_RUNTIME_CURVES
ALL_PRODUCTION_METRICS_WITHHELD: NO_RUNTIME_CURVE
```

This is the intended conservative outcome: preserve useful evidence and site-condition structure, reject internally inconsistent or unsupported numerical shortcuts, and emit no damage or loss number until the promotion gates are satisfied.
