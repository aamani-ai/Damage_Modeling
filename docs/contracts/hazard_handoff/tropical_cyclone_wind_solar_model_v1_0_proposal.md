# Tropical-cyclone wind × solar model v1.0 Hazard handoff proposal

> **Shadow/research contract only.** This model-v1.0/docs-r1 package is a deliberate, noncanonical
> coverage-first screening exception. The strict evidence-earned gate would retain model v0.1. The proposal
> is absent from the canonical artifact index, has no `current/` folder, and authorizes no Hazard cutover.

> **Docs-r2 correction.** The [deep-curation no-cutover addendum](tropical_cyclone_wind_solar_model_v1_0_docs_r2_no_cutover.md)
> supersedes the earlier provider and equal-site wording while leaving the runtime proposal unchanged.

## What the proposal adds

Model v0.1 remains the fail-closed execution boundary. Model v1.0 adds one narrower research record for the
source-specific atom `PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT`:

```text
Perry manually labeled hurricane data
  -> ground-mounted + tracking=False source cohort
  -> percent visibly missing/damaged modules / 100
  -> equal-record-weighted PAVA (historical machine flag says equal-site-not-module-weighted)
  -> linear interpolation between 13 governed block-edge knots
  -> module-hardware material full-replacement screening proxy
```

The curve is `TCWS_PERRY_GROUND_FIXED_VISIBLE_REPLACEMENT_PROXY_V1`. It is a remote-sensing-labeled physical
fraction joined to two explicit T4 economic assumptions:

```yaml
module_value_distribution_assumption_id: UNIFORM_MODULE_HARDWARE_VALUE
visible_damage_disposition_assumption_id: FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING
```

It is not observed repair cost, a claims-calibrated DR, a generic fixed-tilt module curve, a utility-scale
fleet curve, or hurricane-tail coverage.

## Exact shadow input boundary

An isolated Hazard shadow wrapper must provide the full event envelope below. The curve evaluator itself
requires the pathway, source-specific failure unit, exact Perry axis, and six selectors; Hazard must
additionally carry `event_id` and `event_family_id` without defaults:

```yaml
pathway_id: tropical_cyclone_wind
failure_unit_id: PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT
perry_event_max_gust_mps: <finite numeric>
array_architecture_id: PERRY_GROUND_NONTRACKING_SOURCE_COHORT_V1
source_population_match_id: PERRY_MANUAL_GROUND_NONTRACKING_MIXED_SCALE_V1
module_value_distribution_assumption_id: UNIFORM_MODULE_HARDWARE_VALUE
visible_damage_disposition_assumption_id: FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING
source_wind_product_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST
causal_scope_acknowledgement_id: SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS
event_id: <occurrence identifier>
event_family_id: <compound-event parent identifier>
```

The pinned artifact/adapter must separately verify
`hazard_axis.id=PERRY_DATASET_REPORTED_EVENT_MAX_GUST_MPS`. Perry identifies Visual Crossing API at study
level, while row-level station/product, reference height, averaging period, exposure convention, query,
retrieval version, time-of-maximum, and uncertainty semantics remain unresolved for the manual cohort. NHC
sustained wind, Hazard or ASCE 3-second gust, Saffir-Simpson category, array-height wind, a new Visual Crossing
query, or another gust product is not an accepted alias.

Range handling is contractual:

| Input | Shadow evaluator result |
|---:|---|
| nonfinite | reject |
| `< 17.4 m/s` | null/withheld; no low-wind zero default |
| `17.4–39.1 m/s` | conditionally supported scalar screening proxy DR |
| `> 39.1 m/s` | null/withheld; no clamp or extrapolation |
| `48.2 m/s` source observation | audit-only severe-tail evidence; never a runtime knot |

The 13 knots are:

```text
x_mps = [17.4, 18.3, 20.7, 24.6, 24.8, 25.1, 25.9,
         29.5, 29.8, 31.7, 37.9, 38.9, 39.1]
DR    = [0, 0, 0.000272766560000, 0.000272766560000,
         0.000955175835000, 0.000955175835000,
         0.001853190692857, 0.001853190692857,
         0.004054775905000, 0.004414548050000,
         0.004414548050000, 0.018272937632500,
         0.018272937632500]
```

These are analyst-derived PAVA block-edge knots, not source-published curve points. The fit gives equal weight
to 34 rows from six clustered hurricanes; at least one physical site recurs across storms, so those are not
34 unique or independent sites. It is not module weighted, has no validated predictive relationship, and
carries no intrinsic spread. The isolated 48.2 m/s / 0.4142383192 observation is excluded from the fit, which
prevents one row from creating a 9.1 m/s tail ramp but biases severe-event response downward.

## Required limitation flags

Every numeric shadow response must carry the artifact's always-on limitation flags, including:

```yaml
- NONCANONICAL_PROPOSAL
- SCREENING_REMOTE_SENSING_LABELED_VISIBLE_FRACTION_WITH_T4_ECONOMIC_BRIDGE
- SOURCE_COHORT_MIXED_SCALE
- SOURCE_AXIS_PRODUCT_QUERY_SEMANTICS_UNRESOLVED
- SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS
- VISIBLE_DAMAGE_ONLY_HIDDEN_DAMAGE_UNOBSERVED
- PAVA_DERIVED_KNOTS
- EQUAL_SITE_WEIGHT_NOT_MODULE_WEIGHTED
- EVENT_CLUSTERED_SAMPLE
- SPARSE_SEVERE_TAIL_WITHHELD
- CROSS_METHOD_SAME_EVENT_ENDPOINT_CONFLICT
- PARTIAL_FAILURE_UNIT_COVERAGE
- CURVE_INTRINSIC_SPREAD_NOT_CARRIED
- NO_EXTRAPOLATION
- SCENARIO_DOLLAR_LOSS_WITHHELD
```

Missing a load-bearing flag fails the shadow test. Perry and Ceferino contain correlated, materially different
same-event/site endpoint labels; neither is independent validation for the other.

## Failure-unit, value, and exposure boundary

The scalar belongs only to one complete source-compatible site's visible/missing module-hardware material
population under the two named assumptions. It is mutually exclusive with generic
`PV_FIXED_TILT_MODULE_FIELD`.

Consequently:

- Hazard may not multiply the scalar by module value, installed PV cost, the NLR benchmark, array value,
  physical replacement value, insured value, or full-project TIV. Scenario dollars remain withheld before a
  separate canonical promotion and exact site-value review.
- The observed response already includes the affected site-module fraction. A second `at_risk_fraction` or
  array exposure multiplier is prohibited.
- `PV_FIXED_TILT_MODULE_FIELD`, fixed-tilt support structure, tracker modules/SBOS, foundation, power
  conversion/collection, GSU/substation, SCADA/communications, civil infrastructure, and replacement support
  all remain explicit null/withheld—not zero.
- `PV_GSU_SUBSTATION` remains a separate facility-level point/yard exposure with cell-local wind response and
  value binding. It never receives the module proxy.
- Fieldwork, freight, removal/reinstall, inspection, and logistics are allocated once after a governed repair
  disposition; they do not receive an independent module DR.

## Compound-event boundary

Keep one `event_family_id` while routing direct TC wind, debris, TC-spawned tornado, wind-driven rain,
surge/flood, scour, lightning/fire, and interruption through their own causal pathways. The Perry imagery
endpoint cannot isolate pure aerodynamic uplift from attachment cascade or debris. Do not add another visible-
module wind/debris curve to this proxy without a physical-value overlap review.

## Required pre-promotion shadow tests

1. Reproduce the 5 source-data fixtures, 8 formula KATs, 9 rejection tests, and 4 withheld-unit tests.
2. Verify bundle-v3/capability-v3/emit-v2 plus exact model/docs/schema/full-SHA pins.
3. Prove every required selector and acknowledgement has no default and every mismatch fails closed.
4. Prove NHC/category/ASCE/other-gust inputs cannot enter the Perry axis without a separately governed bridge.
5. Prove below-range, above-range, and the 48.2 m/s audit point withhold without zeroing, clamping, or fallback.
6. Prove all limitation flags travel with every numeric shadow result.
7. Prove generic fixed tilt, trackers, rack/support, electrical, GSU, civil, hidden damage, and support rows
   remain explicit nulls and cannot enter whole-array or whole-plant loss.
8. Prove extra module exposure, any value input, scenario loss, EAL, PML, VaR, TVaR, and portfolio aggregation
   are rejected from the noncanonical proposal.
9. Independently reproduce the source hash/filter, percent conversion, PAVA, serialization, event sensitivity,
   and sparse-tail decision.
10. Resolve the source-axis, population-transfer, T4 economic-bridge, Perry/Ceferino discrepancy, event-
    clustering, tail, spread, and independent-validation gates.
11. Shadow the proposed evaluator without changing the existing model-v0.1 fail-closed adapter or any
    canonical artifact pin.
12. Define exact cutover, dual-read, and rollback fixtures before a separate explicit promotion decision.

## Execution rule

Until every gate passes and maintainers explicitly promote a pinned artifact:

```yaml
Hazard_operational_model: tropical_cyclone_wind_solar model v0.1
operational_behavior: fail_closed_NO_RUNTIME_CURVE
model_v1_0_use: isolated_shadow_and_research_only
consumer_cutover: prohibited
scenario_and_annual_tail_outputs: withheld
```

The governing proposal files are the
[artifact](../../cells/tropical_cyclone_wind_solar/proposed/tropical_cyclone_wind_solar__model_v1_0__docs_r1__curve_artifact.json),
[capability](../../cells/tropical_cyclone_wind_solar/proposed/tropical_cyclone_wind_solar__model_v1_0__docs_r1__capability.json),
[metadata contract](../../cells/tropical_cyclone_wind_solar/proposed/tropical_cyclone_wind_solar_damage_code_metadata_spec__model_v1_0__docs_r1.md),
[KATs](../../cells/tropical_cyclone_wind_solar/proposed/known_answer_tests_tropical_cyclone_wind_solar__model_v1_0__docs_r1.json),
and [promotion matrix](../../cells/tropical_cyclone_wind_solar/proposed/PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md).
The [model-v0.1 boundary](tropical_cyclone_wind_solar_model_v0_1_boundary.md) remains the operational rule.
