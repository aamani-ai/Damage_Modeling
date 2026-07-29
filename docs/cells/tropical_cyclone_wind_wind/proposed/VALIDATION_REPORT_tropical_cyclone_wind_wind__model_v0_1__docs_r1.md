# Validation report — tropical_cyclone_wind_wind model v0.1/docs r1

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

The package is coherent as a **noncanonical, fail-closed research scaffold**. This PASS does not qualify a
numeric damage curve. It confirms that candidate structural fragilities remain isolated in the audit layer,
all damage/loss metrics remain null or withheld, and the package cannot silently enter the runtime index.

## Binding package validator

Command:

```bash
python3 scripts/reference_helpers/validate_tropical_cyclone_wind_wind_v0_1_scaffold.py
```

Result:

```text
PASS tropical_cyclone_wind_wind model v0.1/docs r1 scaffold
checks=705
sources=19
claims=24
parameters=19
value_rows=24
failure_units=6
fail_closed_contract_tests=14
workbook_sheets=12
local_links_checked=58
```

The validator checks:

- selected v1 bundle/capability schema `required`, `const`, `type`, and `items` constraints;
- noncanonical lifecycle, zero `curve_records`, and no artifact-index entry;
- byte-for-byte equality of the embedded and standalone capability declarations;
- `NO_RUNTIME_CURVE` coverage for every declared metric;
- artifact pointers, registered source IDs, claim/parameter lineage, CSV rectangularity, and local links;
- failure-unit registry, value-row identities, and exact 1,090 / 239 / 294 / 1,623 / 345 / 1,968
  USD/kW reconciliation;
- 14 fail-closed contract fixtures with no numeric damage/loss expected output;
- absence of runtime-shaped candidate parameters from the artifact;
- independent Jaimes/Rose audit-formula checks and the reproduced legacy rotor-cap mismatch;
- XLSX ZIP integrity, 12-sheet manifest, visible speed-fixture formula references, and cross-sheet QA
  references.

The environment does not include the optional `jsonschema` package. The selected v1 schemas use only the
keywords listed above, all of which are executed by the dependency-free validator. This does not authorize
use of the v1 envelope for a runtime publication.

## Schema-envelope exception

Repository-current v2/v3 runtime bundles require output-bearing curve records and cannot represent this
honest zero-curve result. The artifact therefore uses the older v1 envelope solely for a noncanonical
research scaffold, with `runtime_publication_allowed=false`. Any future numerical release must use the
repository-current schema, pass its full contract, and receive a new semantic cell-model version.

## Workbook QA

Workbook:
`damage_curve_records_tropical_cyclone_wind_wind__model_v0_1__docs_r1.xlsx`

- Built with the workspace spreadsheet runtime and exported to both the governed package and the task output
  folder.
- All 11 formula-driven QA rows return `PASS`.
- The formula-error scan found zero `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, or `#N/A` cells.
- The CWER `value` column is numeric and the direct-denominator flag is boolean.
- Jaimes and Rose candidate calculations reference visible, editable native-axis speed cells; none is a
  runtime damage ratio.
- All 12 sheets were rendered and visually inspected. No material clipping, overlap, or legibility defect was
  found; the two wide register sheets are intentionally dense.
- The XLSX archive integrity test passed.

## Regression checks

| Check | Result |
|---|---|
| Damage-curve skill-bundle validator | `PASS` — 103 files |
| Damage-curve skill self-tests | `PASS` — 8 cases |
| Repository-current runtime contracts | `PASS` — 5 canonical artifacts |
| Existing `wind_tornado_wind` v2 proposal validator | `PASS` — 14,902 semantic assertions plus KATs |

The final source-identity correction in the neighboring wind/tornado proposal therefore does not break its
existing proposed contract.

## Integrity hashes

These hashes identify the validated working-revision files. They are audit fingerprints, not consumer pins.

| File | SHA-256 |
|---|---|
| curve artifact JSON | `bfb846d411f430d6e62123e462439b9edc2df9be88cccbda80044b7adfe63d81` |
| standalone capability JSON | `3690069ab2bd8ccc1436ee996bf4012eed28411e8637195a338c4876ad485b3e` |
| known-answer/contract tests JSON | `7bf2db243ab9ed3fa4ef5c9918077463293fb9ef4b29df674339593f9692d027` |
| workbook XLSX | `5208b70afb377da4a437685fd37114b4cf109a4cb35cd4139f96a1d4d9fce860` |

## Remaining promotion blockers

Validation does not close the scientific gates. A numerical model remains blocked by:

1. a reviewed, turbine-local tropical-cyclone demand bridge with height, averaging, terrain, gust, duration,
   direction/veer, and uncertainty lineage;
2. target-fleet applicability for turbine design, controls, tower/foundation archetype, and operating state;
3. all-severity, mutually exclusive disposition evidence rather than tower-collapse probability alone;
4. same-unit repair/replacement cost evidence and a reviewed support-allocation rule;
5. site/OEM value and per-subject point/line/network exposure data;
6. separate treatment and compound-event coordination for tornado, surge/flood/scour, debris, rain ingress,
   and coastal strong-wind overlap.

Until those gates close, the only valid numeric runtime outcome is no numeric outcome: damage and loss remain
withheld rather than defaulted to zero or borrowed from a neighboring hazard.
