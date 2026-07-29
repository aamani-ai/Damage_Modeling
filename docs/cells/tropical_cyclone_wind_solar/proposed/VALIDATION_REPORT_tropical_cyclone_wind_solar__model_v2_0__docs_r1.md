# Validation report — tropical_cyclone_wind_solar model v2.0/docs r1

## Result

```yaml
validation_date: 2026-07-29
result: PASS_AS_NONCANONICAL_PROPOSAL
semantic_damage_model_version: model v2.0
documentation_revision: docs r1
model_grade: experimental_synthetic_T4_scenario
canonical_runtime_artifact: false
lifecycle_state: candidate
promotion_status: proposed_blocked
independent_proposal_review: complete
independent_promotion_review: pending
curve_records: 5
source_compatibility_records: 1
generic_synthetic_T4_records: 4
consumer_cutover_authorized: false
```

The package is complete and internally coherent for bounded research, contract integration, and review. The
result does **not** make the synthetic curves empirical, calibrated, conservative, probabilistic, or
production-ready. It authorizes no artifact-index entry, `current/` pointer, package release, or Hazard
cutover.

## Binding proposal validation

Command:

```bash
.venv/bin/python scripts/reference_helpers/validate_tropical_cyclone_wind_solar_v2_proposal.py
```

Result:

```text
PASS tropical_cyclone_wind_solar model v2.0/docs r1 synthetic-T4 proposal
checks=36425
schema_validation=bundle v3 + capability v3 + four damage-emit v2 modes validated
curve_records=5
generic_synthetic_T4_records=4
runtime_kats=15
rejection_kats=18
pin_kats=3
sources=71
claims=87
claim_supersession_rows=8
parameters=53
value_rows=18
old_vs_new_rows=11
workbook_sheets=17
workbook_formulas=190
workbook_qa_passes=19
preserved_prior_hashes=8
local_links=39
```

The validator independently checks:

- exact lifecycle, promotion, cell, schema, pathway, architecture, failure-unit, capability, and request-field
  contracts;
- formal bundle-v3, capability-v3, and damage-emit-v2 schema conformance across Perry, fixed, tracker, and
  direct-withheld modes;
- 401-point sweeps for each generic record/scenario, including bounds, monotonicity, probability closure,
  resistance ordering, positive-demand response, and independent `DR = sum(P exact state × cost ratio)`
  recomposition;
- exact KAT identities, state probabilities, route-specific flags, selector and event lineage, pin failures,
  foreign-field failures, value/exposure rejection, compound handling, tracker qualification, and direct GSU
  no-array behavior;
- exact source, claim, supersession, parameter, value, and old/new registers, including Tier-4 provenance for
  every generic numerical parameter;
- workbook-to-artifact/CSV/KAT reconciliation, formulas, QA cells, Perry knot equality, and state definitions;
- the comparison-only shared-profile identity and SHA plus the pinned neighboring strong-wind artifact SHA;
  and
- byte preservation of eight v0.1/v1 machine files, absence from the canonical artifact index, absence of a
  `current/` pointer, and no prohibited raw-source vendoring.

## Regression matrix and executable guide

| Check | Result |
|---|---|
| TC-wind × solar model v2 proposal | `PASS` — 36,425 checks |
| TC-wind × solar model v1/docs-r2 evidence revision | `PASS` — 1,754 checks; four runtime-shaped hashes unchanged |
| TC-wind × solar model v0.1 scaffold | `PASS` — 946 checks |
| Strong-wind × solar model v2 proposal | `PASS` — artifact, capability, sample emit, KAT, monotonicity, probability, value, and pin checks |
| Repository-current runtime contracts | `PASS` — five canonical artifacts |
| Damage-curve skill bundle | `PASS` — 103 files |
| Damage-curve governance self-tests | `PASS` — 8 cases |
| Request-guide runnable fixed-tilt CLI | `PASS` — exact artifact pin verified and conditional module result emitted |
| Request-guide JSON examples | `PASS` — fixed proxy, tracker, Perry, and direct GSU-withheld requests evaluated |

The guide checks use the literal documented payloads. The validator additionally rejects mixed/stale guide
pins, a stale handoff pin, stale report hashes/counts, and a stale shared-profile SHA.

## Adversarial-review corrections

Three independent read-only reviews challenged the initial package. The final proposal closes the material
issues they found:

| Review finding | Final treatment |
|---|---|
| state probability could be mistaken for DR | generic DR is independently recomposed from exact-state probabilities and explicit same-unit T4 cost ratios |
| lower-tail CDF could cancel to exact zero | stable `erfc` CDF; exact zero exists only at `x=0` |
| tracker artifact/evaluator field drift | exact request-helper parity and full qualification repeat fields, including qualification SHA and spatial ID |
| unknown, foreign, value, or exposure fields were ignored | strict per-route allowlists and explicit value/exposure rejection |
| GSU inherited an array route | direct withheld routing occurs before architecture/axis evaluation; `array_axis_applied=false` |
| event and selector lineage was dropped | event IDs and complete route selectors are retained in the emit |
| Perry could overlap identified compound children | positive child indicators reject because the source-composite endpoint cannot be partitioned |
| numeric `1`/`0` could masquerade as booleans | compound indicators require actual booleans or `unknown` |
| shared candidate could act as an unapproved runtime source | synthetic parameters are governed cell-locally; the hazard-label-neutral solar profile is audit-only and SHA-pinned |
| historical claims contradicted v2 | complete eight-row claim-supersession map scopes every affected v0.1/v1 claim |
| workbook/KAT mutation could false-pass | exact KAT sets and workbook-to-machine reconciliation are mandatory |

## Legacy-curve defects explicitly prevented

The v2 design does not reuse the legacy hurricane-solar curve's four defining errors:

1. Ceferino-style probability of reaching a damage state is not treated as a damage ratio.
2. The legacy parameter mis-transcription is not reused.
3. Missing value or unsupported units are withheld as null, never converted to zero or immunity.
4. Tracker response is conditioned on attained, verified configuration state; commanded stow is insufficient.

The generic form also avoids anchored-logistic intercept subtraction. Old whole-asset DR and the v2
failure-unit DRs have different denominators and may not be interpreted as a direct like-for-like level
comparison.

## Scientific and product boundary

```text
Perry source-compatible route: retained, narrow, noncanonical
fixed/tracker generic curves: cell-local synthetic Tier 4
shared solar-wind profile: comparison-only, runtime_approved=false
same-unit scenario dollars: withheld
full-plant DR or loss: withheld
annual loss and tail metrics: withheld
GSU TC-wind curve: withheld
formal parameter calibration or elicitation: still required for promotion
Hazard dual-read/cutover: not started / prohibited
```

## Final machine hashes

| File | SHA-256 |
|---|---|
| curve artifact JSON | `06ee048096f3a54344e18e00cb8831a7a33910e61034f23fd1f4c33415658428` |
| capability JSON | `1eeae101c4fd22dded0eb62414b0aca092bd1c1458bfc4c4931d8696369e5a84` |
| known-answer tests JSON | `dca28b2b09c39aeb68155a15b8529f7c8526c59311fdf20c6b6d45c3b4da9892` |
| audit workbook XLSX | `91d75e4cdec52e2c073c32dc20b81832d3de9c7286475600b50de0559baeb190` |
| audit-only shared profile JSON | `4a8a37d45b24cc7dfa080fd132fa061e94dab9791d8aee9dfefb723eb7344a8e` |

The workbook builder normalizes document and ZIP-member timestamps before hashing. Three consecutive clean
rebuilds produced the workbook hash above byte for byte.

## Promotion blockers

Formal elicitation or matched TC demand/state/cost calibration, held-out bridge validation, same-unit value
and support-allocation closure, unsupported failure-unit coverage, independent promotion review, and consumer
dual-read evidence remain open. A later promotion must be an explicit governed decision; it cannot be
inferred from this report's `PASS_AS_NONCANONICAL_PROPOSAL` result.
