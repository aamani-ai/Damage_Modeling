# Validation report — strong_wind_solar proposed model v2.0/docs r1

Validation date: **2026-07-12**

## Outcome

**PASS for a noncanonical screening proposal.** Technical validation does not clear scientific or consumer
promotion gates. Current model v1.0/docs r3 remains canonical.

## Artifact identities

| File | SHA-256 |
|---|---|
| Curve artifact | `32fe982548139cda846fb2e1da63568bcdcc689a87d6b21bd0110f23676c58fb` |
| Standalone capability | `581ab1395c8af061737129cbd665a465a3b22d04125e5bd8fd5c100a75165f19` |
| Known-answer fixture | `72282a26e6fce591316639e6d915de0e86695022f2121f5487e98f9e26343e7f` |
| Workbook | `efe8ff1bdb963b2141e93b7a6e2d04a867e16e12e0f966874b00f91768123443` |

These are proposal audit identities, not canonical consumer pins.

## Proposal validator

`validate_strong_wind_solar_v2_proposal.py` passed:

- formal JSON Schema validation for bundle v3, capability v3 and a sample damage-emit v2 object;
- standalone/embedded capability semantic equality;
- one pathway, two architectures, four uniquely routed records and five withheld/allocation units;
- dense 401-point monotonicity, `[0,1]` bounds, state probability closure and resistance ordering for every
  record/scenario;
- 29-source register, 31-claim register and 36-parameter table with resolved source IDs;
- row-level direct/support/civil/excluded/physical/installed value reconciliation;
- 6 runtime/withholding KATs;
- 1 bounded-cascade monetary-loss KAT plus 4 malformed-value/exposure rejection KATs;
- 4 exact consumer-pin KATs;
- 16 contract rejection tests;
- required workbook sheet presence and ZIP structure;
- exact current v1 artifact SHA and artifact-index preservation.

Formal validation was run with the bundled workspace Python and a task-local `jsonschema` dependency:

```bash
PYTHONPATH=/tmp/damage-modeling-convective-solar-20260712/python_deps \
  /Users/divy/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 \
  scripts/reference_helpers/validate_strong_wind_solar_v2_proposal.py
```

That run reported `PASS(artifact+capability+sample emit)`. The dependency-free default invocation still runs
all structural/semantic/KAT/value/workbook/current-pin checks and explicitly reports formal schema validation
as skipped when `jsonschema` is unavailable.

## Workbook validation

- 14 sheets created and rendered.
- Dashboard, curve records, QA, source, value, claim and parameter views visually inspected.
- Formula-backed equation grid and central curve series inspected.
- All 14 workbook QA rows display `PASS`.
- Formula-result scan found no `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, `#N/A`, `#NUM!`, `#NULL!`,
  `#SPILL!` or `#CALC!` tokens.
- `unzip -t` passed every workbook XML, relationship, drawing and chart member.

## Repository regressions

| Check | Result |
|---|---|
| Current runtime contract validator | PASS: 5 canonical artifacts; hail 11 runtime + 2 selector + 4 value KATs; wildfire 15 state + 7 aggregate + 1 distribution + 6 contract KATs |
| Damage-curve skill bundle validator | PASS: 103 files |
| Damage-curve skill self-tests | PASS: 8 cases |
| Wind/tornado v2 proposal validator | PASS: 14,902 semantic assertions; 13 runtime/withholding, 13 rejection, 1 cross-pathway, 4 pin KATs |
| Python compilation | PASS |
| `git diff --check` | PASS |

## Scientific boundaries that remain open

The validator cannot convert T4 assumptions into calibration evidence. Promotion remains blocked on:

1. independent wind/structural review of fixed pressure and tracker Ucrit bridges;
2. review or replacement of T4 medians, beta, zero boundary and localized state costs;
3. stronger matched field/structural evidence or formal elicitation;
4. nonterminal module/structure dependence and replacement-support allocation;
5. Hazard dual-read, event/exposure/compound-hazard, exact pin, negative and rollback tests;
6. explicit maintainer promotion decision and atomic registry/index/changelog update.

## Canonical preservation

Current artifact SHA remains:

```text
832f47d69372ec54723a61b8a956addccef07bb39338c3ec99907e116f1855ca
```

The proposal is absent from the machine-readable artifact index and cell runtime changelog.
