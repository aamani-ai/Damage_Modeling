# Validation report — wildfire_wind model v0.1/docs r1

## Result

```yaml
validation_date: 2026-07-28
result: PASS
lifecycle: scaffold
promotion_status: proposed
canonical_runtime_artifact: false
runtime_curve_records: 0
runtime_reason: NO_RUNTIME_CURVE
consumer_cutover_authorized: false
```

The package is coherent as a **noncanonical, fail-closed coverage scaffold**. This PASS does not qualify a
numeric damage curve. It confirms that regional wildfire context and mechanism evidence stay in the audit
layer, every damage/loss metric remains null or withheld, and the package cannot silently enter the runtime
artifact index.

## Binding package validator

Command:

```bash
python3.12 scripts/reference_helpers/validate_wildfire_wind_v0_1_scaffold.py
```

Result:

```text
PASS wildfire_wind model v0.1/docs r1 scaffold
checks=3078
sources=21
claims=30
parameters=55
value_rows=26
failure_units=12
pathways=3
fail_closed_contract_tests=18
workbook_sheets=12
local_links_checked=38
artifact_pointers_checked=14
```

The validator checks:

- selected v1 bundle/capability schema `required`, `const`, `type`, and `items` constraints;
- noncanonical lifecycle, zero `curve_records`, fully withheld capability, and no artifact-index entry;
- equality of the embedded and standalone capability declarations;
- all three pathway identities and all 12 dependency-safe failure/support units, including four separately
  addressable GSU/substation groups;
- artifact pointers, source/claim/parameter lineage, CSV rectangularity, and local links;
- exact 282 / 808 / 1,090 / 239 / 294 / 1,623 / 345 / 1,968 USD/kW reference reconciliation;
- 18 fail-closed fixtures with no numeric damage/loss expected output;
- candidate-evidence isolation, XLSX ZIP integrity, sheet manifest, and all formula QA results.

The v1 schema envelope is retained solely because repository-current runtime schemas require output-bearing
records. `runtime_publication_allowed=false` is binding. A future numerical release must use the current
runtime schema and receive a new semantic cell-model version.

## Workbook QA

Workbook: `damage_curve_records_wildfire_wind__model_v0_1__docs_r1.xlsx`

- Built with the workspace spreadsheet runtime and exported to the governed package and task-output folder.
- All 13 formula-driven QA rows return `PASS`.
- The formula-error scan found no error-typed cells.
- All 12 sheets were rendered and visually inspected; the dependency-unit sheet was reformatted and
  re-rendered after the first pass to make exact pathway and GSU decomposition legible.
- The wide provenance registers are intentionally dense; source fields remain available without becoming
  numerical runtime parameters.
- The XLSX archive integrity test passed.

## Regression checks

| Check | Result |
|---|---|
| Damage-curve skill-bundle validator | `PASS` — 103 files |
| Damage-curve governance self-tests | `PASS` — 8 cases |
| Repository-current runtime contracts | `PASS` — 5 canonical artifacts |
| Five model-v0.1 coverage-cell validators | `PASS` — hail, wildfire, flood, TC-wind × solar, and TC-wind × wind |
| Existing `wind_tornado_wind` v2 proposal validator | `PASS` — 14,902 semantic assertions plus KATs |
| Existing `strong_wind_solar` v2 proposal validator | `PASS` — dense contract, KAT, value, probability, capability, and current-pin checks |

## Integrity hashes

These hashes identify the validated working-revision files. They are audit fingerprints, not consumer pins.

| File | SHA-256 |
|---|---|
| curve artifact JSON | `d92ab4e11e25dd8ec3d83d4d2afd51ffc84dbf2933fb0422b7e42dc345fff221` |
| standalone capability JSON | `bdee01e2192b95d0ed0d8119fa1c6ac6c9ed959c2e185bbfb148927fd0bc8ad8` |
| known-answer/contract tests JSON | `b0335791d030ac3d4f8afe1b6bf85aaa65686b2931a3a973da935a4ec5266c24` |
| workbook XLSX | `19211e267c0b819db0daafb1574799fa1e3c0bfba1f6d5a831b19d236de54af2` |

## Remaining promotion blockers

Validation does not close the scientific gates. A numerical model remains blocked by:

1. a validated bridge from the regional wildfire event to component-zone radiant/convective heat histories,
   direct-flame contact, and firebrand deposition/ingress at each named subject;
2. target turbine/OEM/BOM, blade material, nacelle enclosure, pad/collection construction, and GSU equipment
   applicability with calibrated unknown-state behavior;
3. exogenous-wildfire attribution plus affected and unaffected unit counts with inspected, mutually exclusive
   dispositions;
4. same-unit direct repair/replacement cost and support/logistics allocation once;
5. site values plus per-turbine, point, line/network, building, and GSU-yard exposure data; and
6. compound-event and dependency controls that prevent duplicate thermal, firebrand, residue, internal-fire,
   flood/erosion, outage, cleaning, and business-interruption charges.

Until those gates close, damage and loss remain withheld rather than defaulted to zero or borrowed from a
solar, building, internal-fire, or legacy wind curve.
