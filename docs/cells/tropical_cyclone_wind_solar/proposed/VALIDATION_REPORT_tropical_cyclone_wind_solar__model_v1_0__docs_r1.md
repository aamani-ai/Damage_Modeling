# Validation report — tropical_cyclone_wind_solar proposed model v1.0/docs r1

## Result

```yaml
status: PASS_INTERNAL_NONCANONICAL_SCREENING_PROPOSAL
cell_id: tropical_cyclone_wind_solar
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_PERRY_MODULE_SCREENING_V1
semantic_damage_model_version: model v1.0
documentation_revision: docs r1
canonical_runtime_artifact: false
promotion_status: proposed_blocked
validation_date: 2026-07-29
strict_evidence_earned_gate: NO_GO_RETAIN_V0_1
coverage_first_exception: deliberate_noncanonical_screening_proposal
consumer_cutover: none
```

The package is internally consistent and reproducible as one quarantined screening proposal. This PASS does
not reverse the strict evidence judgment, create a canonical artifact, activate a dollar denominator, enter
the artifact index, or authorize Hazard to load the curve.

## Main validator result

The final validator was run with the exact downloaded Perry manual CSV as an optional source-reproduction
input and with JSON Schema dependencies available.

```text
PASS tropical_cyclone_wind_solar model v1.0/docs r1 noncanonical screening exception
checks=1172
schema_validation=bundle v3 + capability v3 + damage emit v2 validated
source_derivation=source SHA, schema, cohort, PAVA, tail, and event sensitivity reproduced
formula_kats=8
rejection_kats=9
withheld_unit_kats=4
fit_stat_rows=9
event_sensitivity_rows=6
cross_method_matches=4
cross_method_mean_absolute_difference_pp=12.1631605215
sources=10
claims=18
parameters=17
value_rows=11
old_vs_new_rows=16
workbook_sheets=13
workbook_formulas=83
workbook_qa_passes=18
local_links=10
missing_allowed=0
```

## Source and derivation checks

| Check | Result |
|---|---|
| exact Perry manual CSV SHA-256 | PASS |
| released row count | PASS — 47 |
| ground rows | PASS — 37 |
| ground + `tracking=False` source cohort | PASS — 35 |
| ground + `tracking=True` audit count | PASS — 2 |
| runtime fit rows | PASS — 34 |
| sparse-tail audit rows | PASS — 1 |
| percent-to-fraction conversion | PASS |
| eight PAVA sufficient-statistic blocks | PASS |
| thirteen serialized block-edge knots | PASS |
| event counts | PASS — Dorian 3, Florence 20, Ian 2, Idalia 1, Maria 4, Michael 4 |
| omit-Maria high-block diagnostic | PASS — 0.003376381028 |
| omit-Florence high-block diagnostic | PASS — 0.024363916843333 |
| 48.2 m/s / 0.4142383192 observation retained but runtime-rejected | PASS |
| Ceferino threshold inconsistency retained as governed claim | PASS — strict `>50%` gives 4/14; reported 36% requires including the 50% row |
| raw CSV/PDF/DOCX absent from the proposed package | PASS |

The source replay uses the exact file hash and released column schema. It does not silently supply the paper-
described 48th record or omitted `site_type` field. The repository stores only sufficient statistics and
provenance because the data archive reports no license.

## Artifact, capability, and evaluator checks

| Check | Result |
|---|---|
| bundle v3 schema | PASS |
| capability v3 schema | PASS |
| damage emit v2 schema | PASS |
| embedded/standalone capability semantic equality | PASS |
| exact cell/model/docs/schema/SHA pin | PASS |
| corrupted SHA pin rejection | PASS |
| one and only one runtime curve | PASS |
| exact source-specific failure unit | PASS |
| exact source-axis identity and no proxy fields | PASS |
| all six selector/assumption acknowledgements required | PASS |
| bounded and nondecreasing evaluation over the full retained range | PASS |
| no clamp/extrapolation below 17.4 or above 39.1 m/s | PASS |
| NHC/generic wind-product fallback rejection | PASS |
| tracker fallback rejection | PASS |
| missing economic-bridge acknowledgement rejection | PASS |
| extra exposure-fraction rejection | PASS |
| value-input/scenario-loss rejection | PASS |
| wrong pathway rejection | PASS |
| generic module, tracker, support, and GSU null/withheld fixtures | PASS |
| scenario loss and annual/tail capability | WITHHELD AS DESIGNED |

Every conditional emit carries the noncanonical, remote-sensing, mixed-population, source-axis, composite-
mechanism, hidden-damage, PAVA-derived, equal-site-weight, event-cluster, sparse-tail, partial-coverage,
cross-method-conflict, no-spread, and no-extrapolation flags.

## Workbook QA

The workbook was generated with `@oai/artifact-tool` and contains 13 sheets, 83 formulas, and 18 formula-
driven QA assertions. All 18 return `PASS`; the formula-error scan found no `#REF!`, `#DIV/0!`, `#VALUE!`,
`#NAME?`, or `#N/A` cells.

All 13 rendered sheet previews were visually inspected. Titles, headers, tables, warnings, numeric precision,
and complete provenance text are visible without overlap or clipped cells in the review renders. The long
source/claim/parameter tables are deliberately wide. The workbook is optimized for on-screen audit rather
than one-page printing; a separate print/PDF layout would require an explicit page-design pass.

## Regression checks

| Validator | Result | Key count |
|---|---|---:|
| tropical-cyclone wind × solar model v0.1 scaffold | PASS | 901 checks |
| tropical-cyclone wind × wind model v1.0 proposal | PASS | 5,759 checks |
| flood × wind model v1.0 proposal | PASS | 1,999 checks |
| repository-current runtime contracts | PASS | 5 canonical artifacts |
| JSON parsing and helper syntax | PASS | current package |
| `git diff --check` | PASS | no whitespace errors |
| canonical artifact-index exclusion for this cell | PASS | no entry |
| `current/` pointer exclusion for this cell | PASS | absent |

The preserved model-v0.1 package remains independently valid and is the strict fail-closed alternative. The
new proposal does not alter the five canonical runtime artifacts.

## Frozen digests

```text
curve artifact SHA-256: bb01300d3e76114203dd826be5bff4bb9f2b98490880327dd57575007a180840
capability SHA-256:     5cd4f5501961a9d7f2c21259b4cfabd9e74eef30b5fdd9ceff72729b83ffc4fc
known-answer tests:     2e18603a9efb5cbb8bdd1c7f3b162e1a3e0c4b0723df5e1afbdc27def84f7cd2
audit workbook:         748031c226187e3b43d83f6a57b2dbd5554457edc01a06debe16b7ef640f3105
Perry manual CSV:       edb34e74cc078bba1fdbe34463abadc794fd416caa66eb64ac3d0ed176ac5e00
```

## Promotion blockers independent of package QA

Machine consistency does not close:

1. unresolved full-cohort gust provider, station, height, averaging, exposure, query, and uncertainty;
2. mixed-scale source population and unearned utility-scale transfer;
3. uniform module-value and full-visible-replacement Tier-4 assumptions;
4. correlated Perry/Ceferino endpoint disagreement;
5. event clustering and leave-one-event instability;
6. severe-tail evidence gap and downward bias from quarantining the strongest tail observation;
7. absent curve-intrinsic uncertainty and independent validation;
8. absent tracker, rack, foundation, electrical, GSU, SCADA, civil, support, and hidden-damage coverage;
9. absent site-specific value binding and full-plant reconciliation; and
10. absent Hazard adapter, exact consumer pin, compound-event partition, shadow test, rollback, and explicit
    promotion decision.

## Release decision

```text
PASS as an internally consistent noncanonical screening proposal.
BLOCKED for canonical runtime, scenario dollars, annual/tail metrics, and consumer cutover.
```

No validation result may recharacterize this proposal as evidence-earned, field-calibrated economic DR,
generic fixed-tilt vulnerability, hurricane-tail coverage, or a released Hazard input.
