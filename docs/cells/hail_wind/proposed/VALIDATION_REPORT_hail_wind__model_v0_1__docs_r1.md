# Validation report — hail_wind model v0.1/docs r1

> **Historical validation record.** This page preserves the docs-r1 result obtained on 2026-07-28. The
> validator was subsequently extended for the docs-r2 evidence revision; its current binding output is in
> the [docs-r2 validation report](VALIDATION_REPORT_hail_wind__model_v0_1__docs_r2.md). The runtime-shaped
> docs-r1 artifact, capability, KATs, and workbook remain unchanged.

## Result

```yaml
validation_date: 2026-07-28
result: PASS
lifecycle: scaffold
promotion_status: proposed
runtime_scaffold_revision: docs r1
canonical_runtime_pin: none
canonical_runtime_artifact: false
runtime_curve_records: 0
runtime_reason: NO_RUNTIME_CURVE
consumer_cutover_authorized: false
```

The package is coherent as a **noncanonical, fail-closed coverage scaffold**. This PASS does not qualify a
numeric damage curve. It confirms that scientific candidates stay in the audit layer, every damage/loss
metric remains null or withheld, and the package cannot silently enter the runtime artifact index.

## Historical package-validator result

This command produced the recorded result below on 2026-07-28. Running it now validates the combined
model-v0.1/docs-r2 evidence revision rather than reproducing the old check count.

Command used:

```bash
python3.12 scripts/reference_helpers/validate_hail_wind_v0_1_scaffold.py
```

Result:

```text
PASS hail_wind model v0.1/docs r1 scaffold
checks=2807
sources=21
claims=26
parameters=38
value_rows=26
failure_units=11
fail_closed_contract_tests=14
workbook_sheets=12
local_links_checked=38
artifact_pointers_checked=11
```

The docs-r1 validator state checked:

- selected v1 bundle/capability schema `required`, `const`, `type`, and `items` constraints;
- noncanonical lifecycle, zero `curve_records`, fully withheld capability, and no artifact-index entry;
- equality of the embedded and standalone capability declarations;
- artifact pointers, source/claim/parameter lineage, CSV rectangularity, and local links;
- exact 282 / 808 / 1,090 / 239 / 294 / 1,623 / 345 / 1,968 USD/kW reference reconciliation;
- all 11 failure units, including a separately grained GSU/substation subject;
- 14 fail-closed fixtures with no numeric damage/loss expected output;
- candidate-evidence isolation, XLSX ZIP integrity, sheet manifest, and all formula QA results.

The v1 schema envelope is retained solely because repository-current runtime schemas require output-bearing
records. `runtime_publication_allowed=false` is binding. A future numerical release must use the current
runtime schema and receive a new semantic cell-model version.

## Workbook QA

Workbook: `damage_curve_records_hail_wind__model_v0_1__docs_r1.xlsx`

- Built with the workspace spreadsheet runtime and exported to the governed package and task-output folder.
- All 13 formula-driven QA rows return `PASS`.
- The formula-error scan found no error-typed cells.
- All 12 sheets were rendered and visually inspected. The README width issue found on first inspection was
  corrected and the workbook re-rendered; no material clipping, overlap, or legibility defect remains.
- The wide provenance registers are intentionally dense; source fields remain available without being
  turned into numerical runtime parameters.
- The XLSX archive integrity test passed.

## Regression checks

| Check | Result |
|---|---|
| Damage-curve skill-bundle validator | `PASS` — 103 files |
| Damage-curve governance self-tests | `PASS` — 8 cases |
| Repository-current runtime contracts | `PASS` — 5 canonical artifacts |
| Existing `wind_tornado_wind` v2 proposal validator | `PASS` — 14,902 semantic assertions plus KATs |

## Integrity hashes

These hashes identify the validated working-revision files. They are audit fingerprints, not consumer pins.

| File | SHA-256 |
|---|---|
| curve artifact JSON | `9872c601c15770c4e830fc473d3728f1dce0b44e515c2cdef8e3bcf85962401e` |
| standalone capability JSON | `4fa89511161cbbeb61adad52a58e44f3be89fbf26c54f8f8382bc7e8e4b8bcef` |
| known-answer/contract tests JSON | `8560f297b08da219f2c042abc931c8f71e3f04b968ab514bf56fe5014b628f27` |
| workbook XLSX | `14c256d71ae673184b868ba5d3fd056ab292ba3b85f8d0da750d7b6e6891adef` |

## Remaining promotion blockers

Validation does not close the scientific gates. A numerical model remains blocked by:

1. an occurrence-specific, product-qualified bridge from hail-size distribution, density, duration, wind,
   trajectory, and rotor state to local component contact demand;
2. target blade/OEM/LEP applicability and calibrated unknown-state behavior;
3. field or test evidence linking demand to mutually exclusive inspected dispositions;
4. same-unit direct repair/replacement cost and support-allocation evidence;
5. site value plus per-turbine, point, line/network, and GSU-yard exposure data;
6. compound-event treatment that prevents duplicate wind, tornado, rain/erosion, ice, and flood charges.

Until those gates close, damage and loss remain withheld rather than defaulted to zero or borrowed from a
neighboring asset/hazard curve.
