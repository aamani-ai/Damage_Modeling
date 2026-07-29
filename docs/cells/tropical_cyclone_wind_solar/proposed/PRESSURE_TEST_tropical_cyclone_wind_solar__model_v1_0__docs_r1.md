# Pressure test — tropical_cyclone_wind_solar proposed model v1.0/docs r1

## Decision

```yaml
strict_evidence_earned_gate: NO_GO_RETAIN_V0_1
coverage_first_screening_gate: CONDITIONAL_PROPOSAL_ONLY
canonical_promotion_gate: BLOCKED
numeric_atom: PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT
runtime_range_mps: [17.4, 39.1]
scenario_dollar_loss: withheld
uncertainty_distribution: not_carried
```

The curve is reproducible, bounded, and fail-closed at its declared atom. It does not pass the ordinary
evidence gate for economic DR. The checks below document why it can exist as a noncanonical screening
exception and why it cannot be promoted or generalized.

## 1. Source-file and cohort reproduction

| Check | Result | Interpretation |
|---|---|---|
| manual CSV SHA-256 | `edb34e74cc078bba1fdbe34463abadc794fd416caa66eb64ac3d0ed176ac5e00` | exact public source file pinned |
| source records | 47 | file count; not an effective sample size |
| `mounting_type=ground` | 37 | source field only |
| ground + `tracking=False` | 35 | full source-cohort audit set |
| runtime fit after tail quarantine | 34 | 17.4–39.1 m/s |
| excluded tail | one row: 48.2 m/s, DR fraction 0.4142383192 | audit-only; not treated as erroneous |

The 35 rows are mixed scale. The CSV does not contain a `site_type` column, and missing system-power values
prevent a defensible all-row utility-scale filter. The selector therefore says `MIXED_SCALE`; it does not
silently use the paper's broad utility/residential/commercial discussion to label each manual record.

Source-version QA also finds that the paper's Methods describes 48 manually located hurricane installations,
while the released manual CSV and dataset description contain 47. The paper says site type was compiled, but
the released manual CSV omits that field. These differences do not alter the pinned n=35 filter; they do block
an assumption that the published narrative and released table are a complete one-to-one schema.

## 2. Hazard-axis pressure test

The full manual file reports `max_wind_gust_(m/s)` but does not pin a common provider, station or grid cell,
reference height, averaging period, terrain/exposure convention, query rule, or uncertainty for every event.
Perry attributes Visual Crossing to the Irma/Maria aggregated map; that statement is insufficient to assign
Visual Crossing semantics to the full multi-hurricane manual cohort.

The model therefore uses:

```yaml
axis_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST_MPS
source_wind_product_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST
```

The following are rejected, even when numerically expressed in m/s:

- NHC one-minute sustained wind;
- ASCE 3-second gust;
- array-height, 10 m, station, reanalysis, or another vendor's gust;
- Saffir-Simpson category; and
- an unversioned conversion from mph, knots, or another duration/height.

This makes ordinary Hazard coupling unavailable. Exact source-field identity is a research selector, not a
portable meteorological contract.

## 3. Endpoint and economic-bridge pressure test

The observed source endpoint is a manually labeled/estimated post-event visible or missing module fraction.
It is not repair cost. Two load-bearing assumptions create the proxy:

| Bridge | Tier | Failure mode if false |
|---|---|---|
| uniform module-hardware value across visible area | `T4_placeholder_or_expert_judgment` | area fraction differs from value fraction because modules differ by type, vintage, power, or acquisition cost |
| full material replacement for every visibly missing/damaged module | `T4_placeholder_or_expert_judgment` | salvage, reuse, partial repair, or replacement mismatch changes consequence |

Imagery can also miss hidden cell cracking, electrical damage, rear-side damage, loosening, and later-discovered
defects. Consequently the bridge can overstate or understate true module loss. Calling it conservative in one
direction would be unjustified.

## 4. PAVA reproduction and imposed shape

The fit minimizes equal-site-weighted squared error subject to a nondecreasing response. It is not weighted by
module count, capacity, area, hurricane, or statistical independence because a consistent module denominator
is unavailable. Exact-x replicate sites each retain one vote.

| Block | x low | x high | n | Sum DR | Mean/PAVA DR |
|---:|---:|---:|---:|---:|---:|
| B01 | 17.4 | 17.4 | 1 | 0 | 0 |
| B02 | 18.3 | 18.3 | 1 | 0 | 0 |
| B03 | 20.7 | 24.6 | 14 | 0.00381873184 | 0.000272766560000 |
| B04 | 24.8 | 25.1 | 2 | 0.00191035167 | 0.000955175835000 |
| B05 | 25.9 | 29.5 | 7 | 0.01297233485 | 0.001853190692857 |
| B06 | 29.8 | 29.8 | 2 | 0.00810955181 | 0.004054775905000 |
| B07 | 31.7 | 37.9 | 3 | 0.01324364415 | 0.004414548050000 |
| B08 | 38.9 | 39.1 | 4 | 0.07309175053 | 0.018272937632500 |

The metadata must always carry `PAVA_DERIVED_KNOTS` and `EQUAL_SITE_WEIGHT_NOT_MODULE_WEIGHTED`. PAVA is a
transparent screening regularizer, not a source-published fragility, causal curve, probability of failure,
or claims-calibrated model. Block-edge linearization further imposes continuous ramps across gaps where no
observations exist.

## 5. Event clustering and leave-one-event sensitivity

The 34 fit rows are clustered by six hurricanes:

| Event | Rows |
|---|---:|
| Florence | 20 |
| Michael | 4 |
| Maria | 4 |
| Dorian | 3 |
| Ian | 2 |
| Idalia | 1 |

Rows are not 34 independent hurricane experiments. A concrete leave-one-event sensitivity demonstrates the
instability:

| Fit | High-end fitted level | Change from all-event fit |
|---|---:|---:|
| all six events | 0.01827294 over 38.9–39.1 m/s | baseline |
| omit Maria | 0.00337638 at the retained high end | about 5.41 times lower |
| omit Florence | 0.02436392 at 38.9 m/s | higher, with only 14 rows remaining |

This sensitivity requires the always-on `EVENT_CLUSTERED_SAMPLE` flag and blocks an iid confidence interval,
bootstrap spread based on rows, or claim that the mean is stable. No curve-intrinsic spread is emitted.

## 6. Sparse-tail pressure test

The excluded 48.2 m/s row has source fraction 0.4142383192, about 22.67 times the retained curve's high-end
value 0.0182729376325. It is the strongest selected source-cohort severe observation in the
manual file. Exclusion prevents one row from defining a long 39.1–48.2 m/s ramp, but it also biases the
retained response downward for severe events.

Required interpretation:

```text
17.4–39.1 m/s = low/moderate source-domain screening range
39.1–48.2 m/s = withheld evidence gap
48.2 m/s row   = audit-only severe observation
>48.2 m/s      = unsupported tail
```

This proposal does not provide hurricane-tail coverage. `SPARSE_SEVERE_TAIL_WITHHELD` must travel on every
numeric emit, not only appear in the dossier.

## 7. Cross-method, same-event endpoint discrepancy

Ceferino Supplementary Table 2 and Perry cover overlapping Caribbean events/sites using different source and
labeling methods. They are correlated evidence, not independent validation populations. The
[governed four-match audit](CROSS_METHOD_MATCH_AUDIT_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv)
uses an analyst-defined nearest-coordinate rule after filtering Perry aggregate rows to Maria, utility, and
ground records; all retained distances are at most 500 m, but no authoritative shared site ID adjudicates
identity. The apparent matches have mean absolute difference 12.1631605215 percentage points. Ceferino's
supplement contains exactly one 50% row. A strict `>50%` classification gives
4/14, whereas the reported 36% = 5/14 requires `>=50%`. The binary fragility count must not be reproduced
without resolving that threshold inconsistency.

The discrepancy may reflect endpoint definition, imagery selection/timing, source reports, coordinate
matching, panel-area estimation, or compound damage interpretation. It cannot be resolved by averaging or
pooling the two sources. The Perry PAVA remains one method-specific screening view and canonical promotion is
blocked pending adjudication.

## 8. Boundary and interpolation tests

| Input/condition | Expected proposal behavior |
|---|---|
| 17.3 m/s | withhold below source range |
| 17.4 m/s | proxy DR `0` |
| 20.0 m/s | linearly interpolated proxy DR `0.000193209646667` |
| 24.7 m/s | proxy DR `0.000613971197500` |
| 29.65 m/s | proxy DR `0.002953983298929` |
| 35.0 m/s | proxy DR `0.004414548050000` |
| 38.4 m/s | proxy DR `0.011343742841250` |
| 39.1 m/s | proxy DR `0.018272937632500` |
| 39.2 or 48.2 m/s | withhold; tail observation is not a runtime knot |
| missing/wrong selector | withhold/reject; no nearest-source fallback |
| tracker/generic fixed tilt/other failure unit | withhold; no numeric fallback |

Zero at the lower observed knots is not permission to emit zero below 17.4 m/s. The model has no asymptote,
cap, or tail law.

## 9. Dollar-denominator misuse test

The following arithmetic is synthetic audit math, not a reportable scenario:

```text
at 39.1 m/s, proxy DR = 0.0182729376325

if exact module-hardware material value were $10,000,000:
  proxy material amount = $182,729.38

if misapplied to $100,000,000 full-plant TIV:
  apparent amount = $1,827,293.76  <- prohibited denominator
```

The tenfold difference shows why value-boundary enforcement matters. Neither number is emitted in the
noncanonical proposal. The NLR benchmark cannot substitute for an exact site module-material value.

## 10. Double-count and neighboring-pathway checks

| Risk | Governed treatment |
|---|---|
| second module-field exposure fraction | prohibited; source response already carries affected fraction |
| rack/attachment loss inferred from missing modules | withheld; no structure curve or terminal precedence rule |
| debris and wind proxy both applied to same modules | prohibited without overlap partition |
| module proxy applied to GSU/electrical/civil | prohibited; distinct subject/value grain |
| support/logistics scaled independently | prohibited; allocate once after qualified disposition |
| hidden damage added as blanket uplift | prohibited; no calibrated modifier |
| v0.1, legacy, or strong-wind fallback outside v1 range | prohibited |

## 11. Promotion conclusion

The proposal passes deterministic reproduction, boundedness, monotonicity, selector specificity, and
withhold-not-caveat design. It fails representative-population, portable-axis, observed-economic-consequence,
tail, spread, cross-method reconciliation, independent-validation, value-binding, and consumer-cutover gates.

Therefore:

```yaml
repository_research_proposal: acceptable_if_validation_passes
canonical_runtime: blocked
scenario_loss: blocked
general_fixed_tilt_transfer: blocked
utility_scale_transfer: blocked
hurricane_tail_use: blocked
strict_gate_outcome: retain_v0_1_until_evidence_chain_closes
```
