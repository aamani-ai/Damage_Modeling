# Tropical-cyclone wind × solar — how proposed model v2 is built

## 1. Classify the change honestly

Model v2 changes supported architectures, x-axis contracts, curve records, emitted state information, and
consumer behavior relative to v1. It is therefore a semantic model bump, not a documentation revision.
Because public evidence did not calibrate generic TC response, every new generic numerical parameter is
Tier 4 and the proposal is blocked from canonical promotion.

## 2. Preserve the source-derived compatibility route

The Perry model-v1 record is copied exactly, including its 13 knots, 17.4–39.1 m/s source-native range, six
fixed acknowledgements, composite-hurricane limitation, and value/scenario-loss withholding. It remains a
source-cohort visible-module material proxy and is not generalized to utility-scale fixed tilt.

## 3. Split the generic architectures

The generic routes are:

- `fixed_tilt_ground_mount_tc_synthetic_t4_v1` for module field and support structure; and
- `single_axis_tracker_tc_qualified_synthetic_t4_v1` for tracker module field and SBOS assembly.

They are mutually exclusive. No default, nearest archetype, or cross-architecture fallback exists.

## 4. Build qualified normalized-demand axes

Fixed tilt prefers a same-zone event/design net-pressure ratio. A squared array-height gust ratio is allowed
only as a flagged screening proxy with named TC wind-field, direction-history, duration-cycling, and
aerodynamic bridges.

Tracker demand is `Vnormal/Ucrit`. The event and qualification must exactly match system, configuration,
layout, attained angle/position, zone, drive/lock state, reference, averaging period, direction basis, and
duration basis. A command-only stow state rejects.

The normalized research domain is `[0, 2]`. Values outside it withhold. No evidence-anchor or
high-extrapolation threshold is asserted inside that synthetic domain. The tracker-only `0.75 Ucrit`
threshold is an action flag, not a damage threshold.

## 5. Keep probability and DR as different objects

Each generic failure-unit record has ordered damage states with explicit same-unit state-cost ratios. For
each unweighted resistance scenario:

```text
state exceedance Q_j(x) = Phi(ln(x/theta_j) / beta_ln)
exact-state probabilities = ordered differences of Q_j
expected same-unit DR = sum(exact-state probability × state-cost ratio)
```

The validator checks probability closure, nonnegative exact-state probabilities, `[0,1]` DR bounds,
monotonicity, scenario ordering, and exact zero at zero demand on a dense grid. There is no positive
hard-zero threshold and no intercept subtraction.

## 6. Adopt cell-local values and audit their shared fingerprint

The owner adopts the four records as cell-local Tier-4 assumptions. Their numerical payload is then compared
with
[`SHARED_SOLAR_WIND_NORMALIZED_RESPONSE_SYNTHETIC_T4_V0_1`](../../../method/shared_components/solar_wind_normalized_response/README.md).
This is a non-runtime, audit-only method substrate derived from the existing strong-wind synthetic scenario
envelope. It does not populate the bundle or act as a runtime dependency. Every median, dispersion, and
state-cost ratio remains a cell-local Tier-4 decision; no strong-wind observation is cited as hurricane
calibration.

## 7. Preserve incomplete coverage as null

Foundation, power conversion/collection, GSU/substation, SCADA, and civil infrastructure remain withheld.
Replacement support is allocation-only and has no intrinsic fragility. The GSU retains separate yard/point
exposure and value. Missing units cannot be assigned zero or absorbed into an implicit whole-plant cap.

## 8. Keep value and annual metrics outside the proposal

The curves emit conditional same-unit DR scenarios and state probabilities. They reject value payloads and
do not calculate scenario dollars, full-plant DR, EAL, PML, VaR, TVaR, BI, downtime, or portfolio results.
Those outputs require calibrated same-unit consequence/value, complete or explicitly partial coverage, and
a promoted consumer contract.

## 9. Fail closed at every routing seam

The reference evaluator requires event and event-family identity, exact pathway, exact artifact pin, and
either an exact numerical architecture route or a direct common-withheld-unit route. It rejects
wrong/missing pins, unbridged ordinary gust, mixed axes, unknown tracker state, qualification mismatch,
unknown or cross-architecture units, neighboring pathways, compound-pathway ambiguity, value input, and
out-of-range demand. A known common-withheld unit such as GSU is accepted directly and emits null without an
array architecture or axis.

## 10. Separate validation from promotion

The package includes a v3 artifact, v3 capability declaration, v2 emit fixtures, workbook, source/claim/
parameter/value registers, known-answer and rejection tests, pressure test, promotion matrix, Hazard
handoff, builder, evaluator, and validator. These prove internal consistency and reproducibility only.

Canonical promotion still requires calibrated or formally accepted parameters, validated portable TC
demand bridges, same-unit economics, complete/explicit partial coverage, independent engineering/economic
review, Hazard dual-read and rollback tests, and a deliberate atomic registry/index/changelog update.

## Binding package

- [Model-v2 overview](../proposed/README_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [Derivation dossier](../proposed/tropical_cyclone_wind_solar_curve_derivation_dossier__model_v2_0__docs_r1.md)
- [Metadata contract](../proposed/tropical_cyclone_wind_solar_damage_code_metadata_spec__model_v2_0__docs_r1.md)
- [Seven-step audit](../proposed/SEVEN_STEP_AUDIT_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [Pressure test](../proposed/PRESSURE_TEST_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [Promotion gates](../proposed/PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [Request guide](../../../extra/guides/tropical_cyclone_wind_solar_v2_curve_request_guide.md)
- [Exact model reference](MODEL_REFERENCE.md)
