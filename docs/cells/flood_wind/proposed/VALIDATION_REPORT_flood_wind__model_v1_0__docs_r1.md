# Validation report — flood × wind model v1.0/docs r1

## Result

**PASS — noncanonical screening proposal only.** The package is internally coherent and reviewable as
`model v1.0 / docs r1`. This result does not authorize canonical promotion, a package release, scenario-loss
binding, or a Hazard consumer cutover.

```text
validator: scripts/reference_helpers/validate_flood_wind_v1_proposal.py
checks: 1999
schema execution: bundle v3 + capability v3 + emit v2 PASS
negative schema tests: 3 PASS
formula KATs: 15 PASS
withheld KATs: 6 PASS
error-code KATs: 16 PASS
workbook QA: 18/18 PASS
```

## Validated inventory

| Item | Count / result |
|---|---:|
| Source register | 18 rows |
| Claim register | 27 rows |
| Parameter/rule table | 33 rows |
| Value crosswalk | 19 rows |
| Old-versus-new comparison | 20 rows |
| Shared-reuse crosswalk | 7 rows |
| Shared flood-electrical catalog | 7 rows |
| Shared evidence register | 9 rows |
| Failure units | 15 total; 1 conditional numeric assembly and 14 withheld |
| Workbook sheets | 13 |
| Workbook formula cells | 112 |
| Local links checked by package validator | 8 |
| Missing required files | 0 |

The workbook validator compares the `Source_Register` and `Claim_Register` sheet IDs directly with the live
CSV IDs, so a stale workbook cannot pass merely because its cached QA counts are green.

## Numerical checks

The evaluator reproduced all 11 FEMA Table 7.9 knots and the governed interior interpolations, including:

- `0.5 ft → 0.01 DR`;
- `7.5 ft → 0.11 DR`;
- `9.5 ft → 0.145 DR`; and
- a same-datum `0.3048 m` WSE-minus-grade bridge → `1 ft → 0.02 DR`.

The full `0–10 ft` range was sampled at 0.025-ft increments for finite, bounded, nondecreasing behavior.
Negative depth, missing/ambiguous axes, partial WSE bridges, datum mismatch, unsupported class/assumption,
unknown inputs, salt/brackish/contaminated/unknown water, depth above 10 ft, unsupported units, and bad
artifact pins all fail closed with the governed result or reason code.

## Schema and semantic checks

The draft pathway-aware piecewise-linear record requires an exact `selector_match`. The validator and
evaluator separately enforce that the record pathway, `x_axis`, `valid_range`, and selector match agree with
the containing pathway contract. Negative mutations for missing points, unknown curve form, missing selector
match, wrong axis, reversed range, and empty selector match were rejected.

The standalone capability equals the embedded artifact capability byte-for-structure. Scenario loss is
explicitly conditional on future canonical promotion and same-substation value/ownership/exposure checks.
Annual and tail metrics remain withheld after promotion until their consumer-owned prerequisites are met.

## Value and shared-asset checks

- The curve denominator is the full direct replacement value of the same complete facility-level substation.
- The source-native assembly is mutually exclusive with all six GSU component units.
- Full-project TIV, the mixed NREL `72 USD/kW` electrical row, the legacy 9% share, and per-turbine GSU
  repetition are prohibited.
- One shared/hybrid-site physical substation is represented and valued once.
- The asset-neutral shared substrate remains `runtime_loadable=false`; its source crosswalks resolve to
  `FW-S011` and `FW-S012`.

## Evidence-pressure-test result

The exact legacy FEMA table is admissible only as a source-native whole-substation screening sensitivity.
FEMA Hazus-MH 2.1 also describes electric-power implementation as deferred; Hazus 7.0 lists electric-power
facilities as mapping-only and states that its visible default functions are disabled and produce no results.
No public primary evidence reviewed supports decomposing the aggregate table into component-level GSU or wind-
farm economic curves.

NEMA GD 1-2016 is classified historical. The official April 2026 publication register establishes the
successor `NEMA CS 70006-2026`, but its technical content was not acquired or inferred. Acquisition and review
remain a promotion gate; the FEMA knots do not depend on NEMA.

## Hashes

```text
artifact_sha256=79f850ea0685e58294d4965c76687e7b797540c36084b55084b9cb073b04d79c
capability_sha256=2b02274d12534fa1322cb512ad28ad017fa2df6752172a64f8604a69bd45a654
known_answer_tests_sha256=d67c8c45e0414c2a2f25d40cbcd0a4f8a4ef52049d5e37f021cdcb63e28ef0e4
workbook_sha256=a4a589fa30146c3523e0f6a2275518214b50a1c8d7fee67e5fa3eb2bbc48bd6f
```

## Release disposition

The proposal remains absent from `docs/contracts/machine_readable_artifact_index.json` and has no
`docs/cells/flood_wind/current/` folder. Promotion remains blocked on independent FEMA and engineering review,
NEMA CS 70006-2026 review, draft-schema approval, exact Hazard adapter/pinning, same-substation value and no-
double-count tests, M3/M4 shadow comparison and rollback, and an explicit SHIP decision.
