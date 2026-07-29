# Tropical-cyclone wind × solar

## 1. Cell identity

```yaml
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
documentation_lead: model v1.0 / docs r1 noncanonical screening proposal
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_PERRY_MODULE_SCREENING_V1
semantic_damage_model_version: model v1.0
human_documentation_revision: docs r1
lifecycle_state: release_candidate
promotion_status: proposed_blocked
review_status: pressure_tested_pending_independent_review
model_grade: screening_remote_sensing_labeled_visible_fraction_with_T4_economic_bridge
strict_evidence_earned_gate: NO_GO_RETAIN_V0_1
coverage_first_exception: deliberate_noncanonical_screening_proposal
canonical_runtime_artifact: false
package_release: unreleased
package_inclusion_status: not_included
consumer_cutover: none
numeric_source_atoms: 1
scenario_dollar_loss: withheld
annual_and_tail_metrics: withheld
strict_fail_closed_alternative: model v0.1 / docs r1 / NO_RUNTIME_CURVE
```

The lead research state is proposed model v1.0/docs r1. It adds one narrowly quarantined scalar screening
proxy because portfolio coverage was prioritized ahead of deeper calibration. The ordinary evidence-earned
decision remains **NO-GO**: model v0.1 is preserved as the strict alternative and withholds every numeric
damage and loss output.

The v1 package passed its internal noncanonical validation. That does not make it canonical, place it in the
artifact index, create a `current/` pointer, include it in a package release, or authorize Hazard or another
runtime consumer to load it.

## 2. Snapshot tree

```text
tropical-cyclone wind × solar
├─ model v1.0/docs r1 — lead research proposal
│  └─ one conditional source-specific atom
│     └─ PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT
│        ├─ Perry manual CSV: ground + tracking=False
│        ├─ mixed-scale source cohort; no utility-scale transfer claim
│        ├─ dataset-reported event maximum gust only
│        └─ visible/missing module-material full-replacement proxy
│
├─ every standard solar unit remains withheld, not zero
│  ├─ generic fixed-tilt module field and support structure
│  ├─ tracker module field and tracker SBOS
│  ├─ foundation
│  ├─ power conversion and collection
│  ├─ GSU/substation
│  ├─ SCADA/communications
│  └─ civil infrastructure and replacement support
│
└─ model v0.1/docs r1 — strict fail-closed alternative
   └─ curve_records: [] / NO_RUNTIME_CURVE
```

## 3. Scope and exclusions

Model v1.0 covers only the Perry manual-data source cohort's visible or missing module fraction after named
hurricanes for ground-mounted records explicitly marked `tracking=False`. It is conditional on the exact
source-native event maximum-gust field and all six required selector/assumption acknowledgements.

The source cohort is mixed or unknown in scale. The proposal does not claim a representative utility-scale,
CONUS, or generic fixed-tilt population. It also cannot isolate pure aerodynamic wind from attachment
cascade, debris, rain, or other unobserved contributors, so every numeric result carries the
`SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS` limitation.

Excluded or withheld are trackers, roofs, carports, floating PV, rack and attachment loss, foundations,
electrical and collection systems, GSU/substation, SCADA, civil assets, hidden module damage, partial repair,
salvage, labor, freight, mobilization, water ingress, flood/surge, tornado, hail, lightning, BI, derating,
insurance, scenario dollars, EAL, PML, VaR, TVaR, and portfolio loss.

## 4. Primary nonzero failure unit

Exactly one source-specific atom has a conditional numeric screening curve:

| Failure unit | Source grain | Conditional output | Prohibited interpretation |
|---|---|---|---|
| `PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT` | one complete Perry-compatible ground/nontracking site module population | monotone mean visible-module-hardware material full-replacement proxy | generic fixed-tilt module DR, utility-scale curve, rack/structure DR, installed-cost loss, whole-array DR, or observed economic loss |

This atom is mutually exclusive with `PV_FIXED_TILT_MODULE_FIELD`. It is not a renamed generic module curve.
The source field becomes an economic proxy only through two explicit Tier-4 acknowledgements: uniform module
hardware value and full replacement of every visibly missing/damaged module area.

## 5. Conditioner-only equipment and context

The proposal has no numerical conditioner multipliers. Stow, design-standard, sheltering, terrain,
maintenance, attachment-quality, and hidden-damage adjustments are all absent. Tracker state cannot affect
the curve because trackers are unsupported.

Instead, a numeric research request must exactly match six fixed acknowledgements:

```yaml
array_architecture_id: PERRY_GROUND_NONTRACKING_SOURCE_COHORT_V1
source_population_match_id: PERRY_MANUAL_GROUND_NONTRACKING_MIXED_SCALE_V1
module_value_distribution_assumption_id: UNIFORM_MODULE_HARDWARE_VALUE
visible_damage_disposition_assumption_id: FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING
source_wind_product_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST
causal_scope_acknowledgement_id: SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS
```

These values acknowledge limitations; they do not prove that a target facility matches the source cohort.
Missing or different values reject or withhold rather than selecting a nearest archetype.

## 6. Reviewed secondary and unsupported equipment

| Unit | v1 treatment | Reason |
|---|---|---|
| `PV_FIXED_TILT_MODULE_FIELD` | withheld, not zero | source atom does not represent generic all-damage module response |
| `PV_FIXED_TILT_SUPPORT_STRUCTURE` | withheld, not zero | imagery fraction does not provide rack/attachment disposition or cost |
| `PV_TRACKER_MODULE_FIELD` | withheld, not zero | tracker population unsupported; no fixed-to-tracker fallback |
| `PV_TRACKER_SBOS_ASSEMBLY` | withheld, not zero | no exact-system response or cost chain |
| `PV_FOUNDATION` | withheld, not zero | no applicable response/disposition/cost chain |
| `PV_POWER_CONVERSION_AND_COLLECTION` | withheld, not zero | point, line, and network units are outside the source endpoint |
| `PV_GSU_SUBSTATION` | withheld, not zero | shared point/yard subasset requires cell-local wind, exposure, value, and release |
| `PV_SCADA_COMMUNICATIONS` | withheld, not zero | no observed endpoint or value chain |
| `PV_CIVIL_INFRA` | withheld, not zero | mixed physical subjects require separate curves and values |
| `PV_REPLACEMENT_SUPPORT` | withheld support; no intrinsic DR | allocate once only after qualified repair disposition |

The GSU/substation may reuse asset-neutral identity and value anatomy across asset classes. It inherits no
flood, wind-farm, or array-module numerical response.

## 7. DR≈0 and excluded buckets

No omitted physical unit is assigned DR≈0. Withheld means unsupported, not immune. Soft, sunk, financing,
development, insurance, BI, and other nonphysical value are outside the direct-physical denominator rather
than represented by zero-damage curves.

| Bucket type | Proposed model-v1 disposition |
|---|---|
| Conditional primary nonzero | one Perry source-specific visible-module-hardware atom |
| Standard solar physical units | withheld, not zero |
| Conditioner adjustments | none active |
| DR≈0 direct effect | none asserted |
| Scenario/full-asset/annual/tail outputs | withheld |

## 8. Hazard x-axis decision

```yaml
axis_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST_MPS
input_field: perry_event_max_gust_mps
unit: m/s
valid_range_mps: [17.4, 39.1]
interpolation: linear_between_governed_PAVA_block_edge_knots
extrapolation: prohibited
```

The released source does not resolve one provider, station/grid location, reference height, averaging period,
exposure convention, query method, or uncertainty for the full manual cohort. NHC sustained wind, ASCE
3-second gust, array-height wind, Saffir-Simpson category, Visual Crossing generally, and other wind products
are not aliases. Below 17.4 m/s and above 39.1 m/s the proposal withholds without clamping or fallback.

## 9. Curve form and y-axis meaning

The public manual CSV yields 35 ground/nontracking source-cohort records. Thirty-four records from
17.4–39.1 m/s form an equal-site-weighted isotonic fit. Eight pooled blocks are serialized as 13 block-edge
knots and connected linearly. The isolated `(48.2 m/s, 0.4142383192)` observation remains audit-only and is
not a runtime knot.

The ordinate is:

```text
visible/missing module fraction
  × assumed uniform module-hardware material value
  × assumed full replacement of every visibly affected area
  = source-specific module-material replacement proxy DR
```

The fit is PAVA-derived, equal-site weighted rather than module weighted, clustered across six hurricanes,
and carries no curve-intrinsic spread. It is not a source-published fragility, a pure wind-pressure curve, a
claims-calibrated curve, or observed repair cost.

## 10. Selector, conditioner, exposure, and value map

| Role | Proposed model-v1 rule |
|---|---|
| Pathway | exact `tropical_cyclone_wind`; wrong or missing pathway rejects |
| Selector | all six source/architecture/assumption acknowledgements must match exactly; no defaults |
| Conditioner | no numerical adjustments or mitigation credit |
| Axis | exact Perry dataset-reported event maximum-gust object only |
| Exposure | response already contains the source site's affected module fraction; a second array exposure fraction is prohibited |
| Value | scalar proxy DR only; dollar value binding is disabled before promotion |
| Other subjects | GSU, collection, inverter, rack, foundation, SCADA, civil, and support keep separate grains and remain withheld |

Related TC pathways retain one `event_family_id`, but no wind, debris, tornado, flood/surge, or rain-ingress
loss may be added without a governed physical-value partition.

## 11. Value-link basis

The potential future denominator is exact site-specific module-hardware **material acquisition value** for
the compatible source-cohort subject. It excludes mounting, removal/reinstallation, freight, inspection,
electrical, GSU, civil, support, BI, and full TIV.

The NLR Q1-2025 module benchmark (`291.21485143992487` 2024 USD/kWdc) is anatomy and reconciliation evidence
only. It is not a site default, runtime denominator, coverage weight, or cap. Model v1.0 rejects value input
and withholds scenario dollars even when the scalar proxy could otherwise be evaluated.

## 12. Evidence and derivation pointer

The fitted response comes from the Perry public manual hurricane CSV and its data-description file. The
source file, cohort filter, percent conversion, PAVA blocks, knots, range, tail quarantine, and event
sensitivity are reproducible from pinned sufficient statistics and hashes.

The evidence still fails the ordinary economic-DR release gate. The source population is mixed scale; the
wind-product semantics are incomplete; two Tier-4 assumptions create the economic meaning; Perry and
Ceferino give materially different correlated same-event/site endpoint views; the sample is event clustered;
the severe tail is sparse; and no independent validation or spread is available.

Start with the [model-v1 derivation dossier](proposed/tropical_cyclone_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md),
[pressure test](proposed/PRESSURE_TEST_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md), and
[validation report](proposed/VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md).

## 13. Workbook map

Workbook:
[damage_curve_records_tropical_cyclone_wind_solar__model_v1_0__docs_r1.xlsx](proposed/damage_curve_records_tropical_cyclone_wind_solar__model_v1_0__docs_r1.xlsx)

| Question | Workbook sheet |
|---|---|
| What is supported and withheld? | `README`, `Scope_Coverage` |
| Which source and conflict evidence governs the proposal? | `Source_Evidence` |
| How are the cohort and PAVA fit reproduced? | `Cohort_Fit`, `PAVA_Curve` |
| How event-sensitive is the fit? | `Event_Sensitivity` |
| Which units and value rows remain withheld? | `Failure_Units`, `Value_Crosswalk` |
| Which tests, claims, sources, and tiers govern it? | `KATs`, `Source_Register`, `Claim_Register`, `Parameter_Tiers`, `QA` |

The 13-sheet workbook is an audit view, not canonical runtime truth. Its 18 formula-driven QA assertions pass.

## 14. Open seams and update triggers

Canonical promotion remains blocked until the promotion matrix closes, including:

1. independent acceptance or replacement of the two Tier-4 economic bridges;
2. authoritative source-axis semantics or a reviewed Hazard bridge;
3. justified target-population transfer or a permanently source-cohort-only product decision;
4. Perry/Ceferino endpoint reconciliation;
5. cluster-aware uncertainty, independent validation, and a supported severe tail;
6. failure-unit and value/exposure treatment beyond the one source atom;
7. evaluator, artifact, KAT, schema, consumer, exact-pin, compound-event, shadow, and rollback review; and
8. an explicit maintainer promotion action.

Closing these seams can change the cohort, axis, curve, range, selectors, or output meaning and therefore
requires governed model-version review.

## 15. Implementation notes

The proposed model-v1 package is internally consistent for research review:

- [proposal overview](proposed/README_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md)
- [curve artifact](proposed/tropical_cyclone_wind_solar__model_v1_0__docs_r1__curve_artifact.json)
- [capability](proposed/tropical_cyclone_wind_solar__model_v1_0__docs_r1__capability.json)
- [known-answer tests](proposed/known_answer_tests_tropical_cyclone_wind_solar__model_v1_0__docs_r1.json)
- [metadata contract](proposed/tropical_cyclone_wind_solar_damage_code_metadata_spec__model_v1_0__docs_r1.md)
- [promotion gates](proposed/PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md)

The strict alternative remains independently available:

- [model-v0.1 fail-closed overview](proposed/README_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
- [model-v0.1 zero-curve artifact](proposed/tropical_cyclone_wind_solar__model_v0_1__docs_r1__curve_artifact.json)
- [model-v0.1 validation](proposed/VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)

Neither proposal is canonical. The artifact index, package release, `current/` pointer, and Hazard consumer
pin remain unchanged.
