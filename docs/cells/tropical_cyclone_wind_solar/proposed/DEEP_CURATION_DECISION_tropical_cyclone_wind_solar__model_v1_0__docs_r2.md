# Deep-curation decision - tropical_cyclone_wind_solar model v1.0/docs r2

## Answer first

```yaml
existing_finite_sample_transformation_internally_coherent: true
predictive_relationship_validated: false
general_hurricane_solar_curve: false
portable_Hazard_axis_bridge: NO_GO
tracker_route: NO_GO
severe_tail_extension: NO_GO
same_unit_economic_DR_expansion: NO_GO
model_v1_1_earned: false
model_v2_0_earned: false
semantic_model_action: retain_model_v1_0_noncanonical
documentation_action: advance_to_docs_r2
runtime_proposal_action: retain_docs_r1_unchanged
strict_evidence_earned_action: retain_model_v0_1_fail_closed_alternative
canonical_or_consumer_change: none
```

The current curve has no identified computational, monotonicity, selector, range, or evaluator defect as a
pinned finite-sample transformation. That is weaker than predictive validity. PAVA imposes monotonicity and
block-edge interpolation on a convenience cohort with event clustering and repeated physical sites. No
validated predictive relationship exists even for a new site that appears source-compatible, and the curve
is not a portable utility-scale tropical-cyclone solar damage model. The package must keep those distinctions
visible.

## Independent review synthesis

The deep pass used separate axis, tracker/tail, source-evidence, economic/value, and full-failure-unit review
tracks. They converged on the same release result.

| Question | Strongest new finding | Decision |
|---|---|---|
| Can Hazard's ordinary 3-second gust enter the curve? | Perry identifies Visual Crossing API at study level, but the released rows omit the station/product/query/reference-frame lineage needed for a transfer | `NO_GO` |
| Can the curve cover trackers? | Perry has two ground-tracker rows; Mawar has no tracker systems; OEM cases lack calibrated demand, state, inventory, and cost | `NO_GO` |
| Can the curve extend beyond 39.1 m/s? | One Perry tail row, incompatible Mawar/Yagi audits, and material cross-site dispersion do not define tail shape | `NO_GO` |
| Can visible-module fraction become observed economic DR? | Regulatory and owner records show repair/replacement actions and cost buckets, but no matched same-unit cost/value chain | `NO_GO` |
| Can other solar failure units be released? | Physical mechanisms and cases exist for racks, posts, inverters, electrical, transformers, and civil work; numerical disposition/cost chains do not | `NO_GO` |
| Is v1.0 unusable for everything? | No. Its exact Perry finite-sample transformation remains reproducible and fail-closed for descriptive/experimental research | `RETAIN_NONCANONICAL` |

## Predictive-validity decision

The 34 retained rows are not 34 independent sites. They are records from six storm clusters, with Florence
contributing 20 rows, and at least one physical site appears in more than one storm record. The implementation
therefore gives each record one vote; “equal-site weighted” in the historical machine flag means
not-module-weighted equal-record weighting, not unique-site independence.

Further, the cohort has no probability sampling frame or selection model, architecture and design are
uncontrolled, leave-one-event sensitivity is large, PAVA imposes monotonicity, and linear ramps between
pooled-block edges are an additional analyst construction. The correct interpretation is:

> No computational defect was found in the pinned finite-sample transformation; no scientifically validated
> predictive relationship has been established, including for unseen source-compatible sites.

The docs-r1 flag remains byte-stable because this is an evidence-only revision. Docs r2 supersedes any human
reading of `EQUAL_SITE_WEIGHT_NOT_MODULE_WEIGHTED` that implies unique-site or independent sampling.

## Axis decision

Perry's paper identifies `Max wind gust speed (Visual Crossing API)` in its method diagram. That corrects the
older human wording that the provider itself was wholly unresolved. The defensible statement is:

> Study-level provider: Visual Crossing API. Row-level station, product, query, averaging duration,
> reference height/exposure, retrieval version, time-of-maximum, and uncertainty lineage: unresolved.

Visual Crossing documents gust as a short-term maximum, typically below 20 seconds, and historical outputs
as query-time blends of nearby stations whose contributors can change by hour. The Perry release retains the
event maximum field but not the contributing-station and query metadata. Hazard's tropical-cyclone adapter
instead produces a modeled 3-second gust at 10 m in Exposure C. Same units do not prove the same
meteorological object.

Permitted:

```yaml
axis_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST_MPS
input_field: perry_event_max_gust_mps
valid_range_mps: [17.4, 39.1]
```

Prohibited:

- identity mapping from Hazard 3-second gust;
- fixed gust-factor mapping;
- calling the Perry field site-measured, exact 3-second, or ASCE Exposure C;
- reconstructing the historical field from today's vendor API without the original query and station
  lineage.

## Source-release inconsistencies

The released manual file remains the reproducible object, but the audit records these limitations:

- the paper describes 48 manual sites while the CSV contains 47;
- one Florence row appears to be the count difference;
- paper and CSV event-window end dates differ for Florence, Ian, and Idalia;
- the paper discusses a combined Irma/Maria group, while the manual CSV labels those 12 rows Maria and uses a
  Maria-only window; and
- site type is discussed in the paper but absent from the manual CSV.

These findings do not alter the pinned fit. They further block row-level event-window transfer.

## Tracker decision

A tracker response must distinguish fixed identity from event-time attained state:

```text
fixed selectors
  = tracker make/model, row geometry, torque tube, module attachment,
    foundation, drive/lock, controller and design vintage

event conditioners
  = command, attained angle, power and backup state, drive lock,
    control availability, wind direction, duration and cycling
```

The current evidence does not observe that vector together with local demand, affected/unaffected inventory,
final disposition, and cost. A fixed-to-tracker fallback or generic stow credit would conceal the missing
state rather than model it.

## Severe-tail decision

The Perry runtime fit stops at 39.1 m/s. The 48.2 m/s / 41.42383192% row remains an audit-only observation,
not a second tail regime. Typhoon Mawar adds four ground fixed-tilt systems with near-zero visible module loss
under severe estimated gusts, but its report contains conflicting ground-module counts and some inconsistent
site wind summaries. Typhoon Yagi adds a regional satellite-area loss study on a modeled 10 m/wind-scale
field with unknown mixed architecture and a generic area-cost calculation. Neither source is axis-, atom-,
or disposition-compatible with Perry.

The correct tail remains:

```text
<= 39.1 m/s on exact Perry axis  -> conditional screening evaluation
> 39.1 m/s                       -> withhold
48.2 m/s Perry observation       -> audit only
Mawar and Yagi                   -> external audit only
```

## Economic and failure-unit decision

Primary field records materially improve what is known:

- FPL reports very small fleet-level panel damage/replacement fractions after Ian and Milton and records
  module replacement, inverter/electrical restoration, erosion repair, and aerial inspection;
- FEMA and owner records document damaged modules, racks, posts, connectors, electrical equipment, rebuild,
  and removal decisions in the U.S. Virgin Islands;
- DOE/NLR field teams document modules, clamps, racks, conduit, inverters, switchgear, transformers, water
  ingress, and compound-hazard pathways;
- regulatory cost schedules show that contractor, logistics, labor, material, and capitalizable categories
  can be large and must not be collapsed into a module-material multiplier; and
- SEC/owner loss amounts combine or fail to separate property, business interruption, cleanup, upgrades, or
  recovery scope.

These records support mechanism, anatomy, occurrence bounds, acquisition design, and explicit withholding.
They do not supply economic DR. Count fractions, availability, deductibles, insurance recoveries, program
contracts, loan guarantees, hardening premiums, and mixed restoration buckets are not the numerator.

## Why strong-wind work cannot fill the gap

The [strong-wind solar cell](../../strong_wind_solar/README.md) can contribute a mature component tree,
local-demand framing, selector/conditioner separation, value reconciliation, dependency rules, and negative
tests. It cannot contribute numerical response without showing that transient convective gust demand and
tropical-cyclone duration, direction history, rain, debris, control cycling, and compound pathways are
equivalent for the target unit.

## Version conclusion

A portable axis or a scientifically validated target-population model would change accepted inputs and
applicability, so that future path is expected to be model v2.0. A compatible new source-specific record
could be model v1.1, but none is earned. Docs r2 is the only honest current change.
