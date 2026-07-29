# Validation report — flood_wind model v0.1 / docs r1

**Date:** 2026-07-28  
**Result:** PASS for a noncanonical, zero-curve research scaffold.

## Package validator

Command:

    python3 scripts/reference_helpers/validate_flood_wind_v0_1_scaffold.py

Result:

    PASS
    checks: 701
    sources: 15
    claims: 18
    parameters: 13
    value rows: 18
    shared reuse rows: 6
    shared catalog rows: 6
    shared evidence rows: 7
    failure units: 14
    contract KATs: 16
    workbook sheets: 13
    checked local links: 87

The validator executes every required/const/type keyword used by the selected v1 bundle and capability
schemas, checks embedded/standalone capability equality, validates governed CSV rectangularity and source-ID
resolution, requires pinned-source/CSV/workbook equality for governed candidate ordinates, reproduces legacy
math, inspects the XLSX package, confirms local links, and proves
absence from the runtime artifact index. The optional jsonschema dependency is not installed; no schema
keyword used by these two selected schemas is skipped by the dependency-free subset validator.

## Controlled hashes

| Object | SHA-256 |
|---|---|
| zero-curve artifact | 8dde717bee7fb12db21b4a9b3b81f9927978edb7e2dc3e77691a64c578a6c9b3 |
| standalone capability | 09b5909c4672f4ddbed583c6c098a61242ef4adf45a57c98dcef754150b3ddc2 |
| fail-closed KAT fixture | 0fe0ecae11ec0d78c8e79dd39810380df0bce0d6d33a5e0702cb4cfc707e2540 |
| audit workbook | 434dd7a68afaa3be9eff7d977a90c11e639dc0da46678e9fa2b65c228b9a6100 |
| pinned canonical flood-solar artifact | a08e77ef034e1ecea3e7cd05d13c825921b54d610fca9de8651ebda8e857082d |

The governed and outputs workbook copies are byte-identical.

## Workbook validation

- authored with the bundled artifact-tool runtime;
- 13 expected sheets present in order;
- exported workbook re-imported and inspected;
- QA_Checks reports 13 of 13 PASS;
- no standard formula-error token found;
- exact candidate ordinates retained and runtime approvals equal zero;
- legacy combined maximum reproduced as 0.24574437665595447 of TIV;
- missing/mismatched datum fixtures return blank local depth;
- all sheets rendered and visually inspected;
- no inspection sidecar remains.

## Asset-model validation

Command:

    python3 /Users/divy/.codex/skills/model-infrastructure-assets/scripts/validate_asset_model.py --strict --canonical-hash docs/plans/flood_wind_shared_electrical/asset_model.json

Result:

    VALID: 0 errors, 0 warnings, strict=true
    canonical SHA-256: 2f0a25fb85baaebc32de0d91d050d2c837908a7d8effc03374a3d43ef57b3fa6

The model represents the facility substation once and links it to solar and wind consumers through serves
relationships; it does not duplicate the GSU below each technology.

## Repository regressions

| Check | Result |
|---|---|
| repository-current runtime contracts, five artifacts | PASS |
| strong_wind_solar model-v2 proposal | PASS |
| wind_tornado_wind model-v2 proposal | PASS |
| tropical_cyclone_wind_wind model-v0.1 scaffold | PASS |
| damage-curve governance self-tests, eight cases | PASS |
| damage-curve skill bundle, 103 files | PASS |
| git diff whitespace/error check | PASS |

## Runtime and release assertions

- curve_records remains empty;
- all damage, loss, annual, and tail metrics remain withheld;
- the shared substrate is non-runtime and every runtime_loadable/runtime_approved flag is false;
- the machine-readable artifact index has no flood_wind entry;
- no contract schema, current cell pin, package release, Hazard notebook, or stable src API changed;
- the handoff requires both M3 and independent M4 bypass removal in any future cutover.

## Remaining gates

This PASS means the scaffold is internally consistent and reviewable. It is not evidence that a flood-wind
curve exists. Component disposition/cost evidence, site values, ownership, inventory, elevations, numeric
response review, shared compatibility, and consumer migration remain blocked as recorded in the promotion
matrix.
