# Tropical-cyclone wind × solar — how the model-v1 screening proposal is built

## The decision before the math

The ordinary evidence-earned decision is `NO_GO_RETAIN_V0_1`. Proposed model v1.0 exists because portfolio
coverage was prioritized before deeper calibration. The exception is deliberately narrow, noncanonical, and
source specific. It does not relax the promotion gate.

```text
strict evidence gate  -> model v0.1: no runtime curve
coverage-first choice -> model v1.0: one quarantined screening atom
canonical release     -> blocked
```

## 1. Freeze the pathway and source atom

The pathway is exactly `tropical_cyclone_wind`. The only numeric unit is:

```text
PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT
```

It represents one complete Perry-compatible ground-mounted, explicitly nontracking site module population.
It is mutually exclusive with generic `PV_FIXED_TILT_MODULE_FIELD` and does not cover racks, trackers,
foundations, electrical equipment, GSU/substation, SCADA, civil assets, support, or hidden module damage.

The source endpoint is associated with a hurricane occurrence but does not isolate wind pressure from
attachment cascade, debris, or other unobserved causal contributors. The exact
`SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS` acknowledgement is therefore mandatory.

## 2. Pin and filter the source

The Perry manual CSV is hash pinned. Its governed filter is:

```text
mounting_type == "ground"
tracking == "False"
finite max_wind_gust_(m/s)
finite pct_modules_damaged (%)
```

The released file contains 47 rows, including 37 ground rows and 35 ground/nontracking rows. Thirty-four
rows form the retained fit. The source cohort is named mixed scale because the released CSV has no
`site_type` field and some system-power values are missing; no utility-scale transfer is claimed.

## 3. Preserve the source-native axis

The x-axis is exactly `PERRY_DATASET_REPORTED_EVENT_MAX_GUST_MPS`, supplied as
`perry_event_max_gust_mps`. The retained numeric range is 17.4–39.1 m/s.

The full manual cohort does not resolve one provider, station/grid location, height, averaging period,
exposure convention, query method, or uncertainty. NHC sustained wind, ASCE gust, Saffir-Simpson category,
array-height wind, and other products are rejected rather than converted into the source field. There is no
source-to-Hazard bridge in the proposal.

## 4. Convert the observed endpoint without hiding assumptions

For each source record:

```text
visible module fraction = pct_modules_damaged / 100
```

Two explicit Tier-4 assumptions create the material replacement proxy:

```yaml
module_value_distribution_assumption_id: UNIFORM_MODULE_HARDWARE_VALUE
visible_damage_disposition_assumption_id: FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING
```

The first maps visible area/count-like fraction to module-hardware value fraction. The second maps visible or
missing condition to full material replacement. Neither is observed repair cost. Labor, removal/reinstall,
freight, inspection, racking, electrical work, support, and hidden damage are outside the ordinate.

## 5. Fit only the retained source domain

The 34 retained rows are fitted with equal-site-weighted PAVA. The monotone fit has eight pooled blocks,
serialized at 13 block edges and connected by ordinary linear interpolation. It is not module weighted,
hurricane weighted, or a source-published method.

One `(48.2 m/s, 0.4142383192)` source observation is retained for audit but excluded from runtime fitting.
There are no selected observations between 39.1 and 48.2 m/s. The proposal withholds beyond 39.1 rather than
letting one observation define a 9.1 m/s severe-tail ramp. That decision also biases the retained severe
response downward, so the curve is not hurricane-tail coverage.

## 6. Keep clustering and disagreement visible

The 34 fit rows come from six hurricanes; Florence contributes 20. Leaving Maria out reduces the highest
fitted block by about 5.41 times. The proposal therefore carries `EVENT_CLUSTERED_SAMPLE` and no
curve-intrinsic uncertainty distribution.

Perry and Ceferino contain overlapping Caribbean sites/events but use different endpoint methods and show
materially different values. They are correlated cross-method evidence, not independent validation, and are
not pooled. The unresolved disagreement is a promotion blocker.

## 7. Require exact selectors and fail closed

Numeric research evaluation requires exact pathway, source unit, source-axis product, and all six fixed
selector/assumption acknowledgements. No selector has a default. The evaluator:

- withholds below 17.4 or above 39.1 m/s;
- rejects NHC/generic wind-product aliases;
- rejects tracker and generic fixed-tilt fallback;
- rejects missing economic-bridge acknowledgements;
- rejects a second array exposure fraction;
- rejects value input and scenario-loss calculation; and
- returns explicit nulls for every unsupported unit.

Every numeric result remains labeled noncanonical, source-cohort mixed scale, composite-mechanism,
visible-only, PAVA-derived, equal-site weighted, event clustered, sparse-tail withheld, partial coverage,
without intrinsic spread, and without extrapolation.

## 8. Keep value outside the active proposal

The curve can emit only a conditional scalar proxy DR for its exact source unit. Scenario dollars are
withheld. A future promoted value binding would need exact site-specific module-hardware material value,
currency/vintage, ownership, and source-population proof.

The NLR module benchmark is anatomy-only. It cannot substitute for site value or be expanded to installed
module cost, array value, physical value, insured value, or full TIV. The observed source response already
contains the module-field affected fraction, so another array exposure fraction is prohibited.

## 9. Preserve all other units as withheld

Generic fixed-tilt modules, fixed support structure, tracker modules, tracker SBOS, foundation, power
conversion and collection, GSU/substation, SCADA, civil infrastructure, and replacement support remain
withheld rather than zero. Support has no independent fragility and can be allocated only once after a
qualified repair disposition.

Full-array and full-plant DR, scenario loss, EAL, PML, VaR, TVaR, and portfolio metrics are unavailable.

## 10. Separate validation from authorization

The v1 proposal passes internal source, fit, schema, capability, evaluator, KAT, workbook, link, and canonical
regression checks. Those checks establish reproducibility and fail-closed behavior only.

The artifact remains noncanonical, absent from the artifact index and `current/`, excluded from the package
release, and unpinned by Hazard. Independent review, evidence-gate closure, a named consumer migration,
shadow/rollback testing, and an explicit promotion decision are still required.

## Binding package

- [Model-v1 seven-step audit](../proposed/SEVEN_STEP_AUDIT_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md)
- [Model-v1 derivation dossier](../proposed/tropical_cyclone_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md)
- [Model-v1 metadata contract](../proposed/tropical_cyclone_wind_solar_damage_code_metadata_spec__model_v1_0__docs_r1.md)
- [Model-v1 pressure test](../proposed/PRESSURE_TEST_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md)
- [Model-v1 promotion gates](../proposed/PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md)
- [Model-v1 validation](../proposed/VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md)
- [Strict model-v0.1 alternative](../proposed/README_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
- [Exact model reference](MODEL_REFERENCE.md)
