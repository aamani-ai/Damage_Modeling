# tropical_cyclone_wind_solar — proposed model v1.0, docs r1

> **Status: coverage-first, noncanonical screening exception.** This proposal can return one scalar proxy for
> one source-specific visible-module unit. The strict evidence-earned release gate remains **NO-GO**. The
> proposal is absent from the canonical artifact index and cannot be used for whole-array, whole-plant,
> dollar, annual, or tail loss.

## 1. Cell identity and outcome

```yaml
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_PERRY_MODULE_SCREENING_V1
semantic_damage_model_version: model v1.0
documentation_revision: docs r1
lifecycle_state: release_candidate
promotion_status: proposed
review_status: pressure_tested_pending_independent_review
model_grade: screening_remote_sensing_labeled_visible_fraction_with_T4_economic_bridge
canonical_runtime_artifact: false
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: not_included
strict_evidence_earned_gate: NO_GO_RETAIN_V0_1
coverage_first_exception: deliberate_noncanonical_proposal
```

Model v0.1 correctly withheld every numeric output. A deeper review recovered the public Perry et al. manual
hurricane CSV and makes a narrower research product reproducible: an equal-site-weighted monotone fit to the
visible/missing module fraction for ground-mounted, explicitly nontracking records. Model v1.0 does **not**
claim that this source cohort represents utility-scale solar, that its wind axis is portable, or that visible
module area is an observed repair-cost ratio.

## 2. Strict gate result and why the exception exists

The evidence-first answer remains to stop at model v0.1 and publish an evidence revision:

- the selected Perry cohort is mixed scale; the released manual CSV has no `site_type` field;
- the source axis is a dataset-reported event maximum gust whose provider, height, averaging period,
  exposure standard, query semantics, and uncertainty are unresolved for the full manual cohort;
- Perry's visible/missing module fraction and Ceferino's estimated damaged-panel extent conflict materially
  in the governed [apparent-coordinate match audit](CROSS_METHOD_MATCH_AUDIT_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv)
  and are not interchangeable endpoints or identity-adjudicated site labels;
- the selected observations span multiple events, locations, installation vintages, and unknown designs;
- the visible-fraction-to-material-DR bridge depends on two explicit T4 assumptions; and
- no independent validation event, uncertainty band, disposition record, or repair-cost record is available.

The user has prioritized portfolio coverage before deeper v2 refinement. The exception therefore exposes a
quarantined screening atom with unusually strict selectors and range withholding. Repository presence,
`model v1.0`, and a passing structural validator do not override the strict-gate result or promote the model.

## 3. Snapshot tree

```text
tropical-cyclone wind x solar
|
+-- conditional numeric source unit
|   `-- PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT
|       |-- Perry manual hurricane CSV only
|       |-- ground mounting + tracking=False only
|       |-- mixed-scale source cohort; no utility-scale claim
|       `-- visible/missing module-hardware full-replacement proxy only
|
+-- conditioner-only / context fields
|   |-- exact source-population and architecture acknowledgements
|   |-- source-native wind-product identity
|   `-- causal-scope acknowledgement; no numeric modifier or protection credit
|
+-- reviewed physical units withheld, not zero
|   |-- fixed-tilt rack, clamps, posts, and support structure
|   |-- tracker module field and tracker SBOS
|   |-- foundations
|   |-- power conversion and collection
|   |-- GSU/substation
|   |-- SCADA/communications
|   `-- civil infrastructure
|
`-- replacement support
    `-- labor, mobilization, inspection, freight, and site management withheld
```

## 4. Scope and exclusions

In scope is one source-specific screening proxy for direct visible or missing module hardware after a named
hurricane, conditional on Perry's ground-mounted, explicitly nontracking manual-data cohort and exact
source-native event maximum gust field.

The proposal excludes or withholds:

- any claim that the cohort is a representative utility-scale or CONUS fixed-tilt population;
- trackers, roofs, carports, floating PV, and any architecture fallback;
- rack, rail, clamp, fastener, post, foundation, inverter, collection, GSU, SCADA, civil, and support loss;
- hidden module damage, cell cracking, electrical damage, water ingress, debris, flood/surge, and tornado;
- partial repair, salvage, module mismatch/obsolescence, labor, freight, mobilization, and reinstatement cost;
- full-array or full-plant DR, site TIV loss, business interruption, EAL, PML, VaR, TVaR, and portfolio loss.

Related tropical-cyclone child pathways retain a common `event_family_id`. This wind screening proxy cannot
be added to flood, surge, debris, tornado, or rain-ingress loss without a governed physical-value partition.

## 5. Primary numeric failure unit and y-axis

| Failure unit | Grain | Conditional v1 output | Denominator | Prohibited interpretation |
|---|---|---|---|---|
| `PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT` | one source-cohort ground/nontracking PV site module field | scalar monotone screening DR proxy | same site's pre-event module-hardware **material** value under uniform-value assumption | rack/structure DR, installed module cost, whole-array DR, utility-scale curve, or observed economic loss |

The source field is converted from percent to fraction. The economic proxy is:

```text
DR_visible_module_material_proxy
  = visible_or_missing_module_area_fraction
  x 1.0 full-replacement disposition per visibly affected area
```

This identity is valid only when both T4 assumptions are acknowledged:

```yaml
module_value_distribution_assumption_id: UNIFORM_MODULE_HARDWARE_VALUE
visible_damage_disposition_assumption_id: FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING
```

It excludes installed labor and all nonmodule value. The proxy can overstate material loss when affected
modules are reusable or partially repairable and understate it when imagery misses hidden damage; its bias
direction is not known.

## 6. Hazard x-axis and runtime range

```yaml
axis_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST_MPS
input_field: perry_event_max_gust_mps
quantity: source-dataset maximum wind gust over the associated hurricane duration
unit: m/s
source_product_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST
reference_height: unknown_in_released_source
averaging_period: unknown_in_released_source
exposure_standard: unknown_in_released_source
fit_range_mps: [17.4, 39.1]
extrapolation: prohibited
```

The full manual cohort's wind provider, query, reference height, averaging period, exposure convention, and
uncertainty are unresolved in the released data. The paper attributes Visual Crossing to the Irma/Maria
aggregated map, not to every row in the multi-hurricane manual file; this proposal therefore does not carry
that provider name into the axis. The axis is dataset-native and intentionally awkward. NHC one-minute sustained wind, 3-second gust at 10 m,
hub/array-height wind, Saffir-Simpson category, mph, knots, or a generic gridded gust are not aliases. A
consumer cannot unit-convert an otherwise different wind object into this field. Below 17.4 m/s and above
39.1 m/s the proposal withholds; it does not clamp, set zero, or extend the curve.

## 7. Cohort, tail quarantine, and curve form

The reproducible cohort filter is:

```text
source file: hurricane_sites_manual.csv
mounting_type == "ground"
tracking == "False"
finite max_wind_gust_(m/s)
finite pct_modules_damaged (%)
```

That yields 35 mixed-scale records. The lone `(48.2 m/s, 0.4142383192)` row is retained as a sparse-tail audit
observation but excluded from fitting. It is also the strongest selected source-cohort severe
observation in the manual file. Excluding it avoids creating an unsupported 9.1 m/s interpolation ramp, but
it predictably biases the retained fit downward for severe events. The runtime fit uses 34 rows over
17.4–39.1 m/s and must be described as low/moderate source-domain screening, not hurricane-tail coverage.

Equal-site-weighted isotonic regression is fitted with PAVA. Exact-x replicates retain one vote per site.
The constant fitted blocks are serialized as block-edge knots and adjacent block edges are connected linearly:

| PAVA block | x span (m/s) | Rows | Fitted proxy DR |
|---:|---:|---:|---:|
| 1 | 17.4 | 1 | 0.000000000000000 |
| 2 | 18.3 | 1 | 0.000000000000000 |
| 3 | 20.7–24.6 | 14 | 0.000272766560000 |
| 4 | 24.8–25.1 | 2 | 0.000955175835000 |
| 5 | 25.9–29.5 | 7 | 0.001853190692857 |
| 6 | 29.8 | 2 | 0.004054775905000 |
| 7 | 31.7–37.9 | 3 | 0.004414548050000 |
| 8 | 38.9–39.1 | 4 | 0.018272937632500 |

The PAVA monotonicity constraint and block-edge interpolation are engineering choices, not source-published
curve methodology. No capacity, module-count, site-area, hurricane, or independence weighting is claimed.

## 8. Selectors, conditioners, and exposure map

Every numeric request must match all six fixed acknowledgements:

```yaml
array_architecture_id: PERRY_GROUND_NONTRACKING_SOURCE_COHORT_V1
source_population_match_id: PERRY_MANUAL_GROUND_NONTRACKING_MIXED_SCALE_V1
module_value_distribution_assumption_id: UNIFORM_MODULE_HARDWARE_VALUE
visible_damage_disposition_assumption_id: FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING
source_wind_product_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST
causal_scope_acknowledgement_id: SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS
```

The last acknowledgement is essential: the imagery endpoint is associated with a hurricane occurrence and
cannot isolate aerodynamic wind from debris, attachment cascade, rain, or other unobserved causal contributors.
The proposal has no conditioner multipliers, stow credit, design-standard credit, sheltering discount, or
site transfer model. Unknown or different selector values withhold rather than choosing a nearest archetype.

The response already represents a site module-field fraction. Applying a second array `at_risk_fraction`
would double-discount the same spatial share. Exposure for every other physical subject remains separate and
withheld.

## 9. Reviewed withheld and DR-near-zero buckets

| Unit or family | Coverage role | v1 treatment | Reason |
|---|---|---|---|
| fixed-tilt support structure | primary physical candidate | withheld, not zero | visible module fraction does not value rack/attachment state |
| tracker module and SBOS | unsupported architecture | withheld | `tracking=True` records are excluded; no transfer |
| foundation | separate physical unit | withheld, not zero | no response/disposition/cost chain |
| power conversion and collection | point/line/network units | withheld | imagery module endpoint does not observe them |
| GSU/substation | shared point/yard unit | withheld | no local exposure, wind response, or site value split |
| SCADA/communications | point/network unit | withheld | no observed endpoint or value chain |
| civil infrastructure | mixed subjects requiring split | withheld | no applicable response curve |
| replacement support | consequence allocation only | withheld | no repair scope or allocation rule |
| soft/sunk/nonphysical value | out of scope | excluded | not direct physical destruction |

No bucket is assigned DR near zero merely because this narrow source unit omits it.

## 10. Value linkage and reportability

The NLR Q1-2025 solar benchmark remains anatomy and reconciliation evidence only. Its module row is not a
site default, runtime denominator, coverage weight, or cap.

```yaml
source_unit_scalar_proxy_dr: conditional_noncanonical
scenario_dollar_loss: withheld_before_promotion
full_array_dr: withheld
full_plant_dr: withheld
scalar_eal: withheld
pml_var_tvar: withheld
```

A future promoted scenario-loss view would additionally require an exact site-specific module-hardware
material replacement value, ownership and exposure checks, currency/vintage lineage, and consumer validation.
Even then it would not authorize multiplying this proxy by installed module cost, array value, physical value,
insured value, or full TIV.

## 11. Evidence and derivation pointers

The proposal is grounded in the Perry et al. paper, the public NLR dataset DOI `10.21948/2562917`, and the
dataset description. The Ceferino supplementary table is retained as contradicting/complementary severity
evidence, not pooled calibration. The detailed record-level lineage lives in:

- [source register](SOURCE_REGISTER_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv)
- [claim and parameter register](CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv)
- [parameter tiers](PARAMETER_TIER_TABLE_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv)
- [screening-fit sufficient statistics](FIT_SUFFICIENT_STATISTICS_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv)
- [event-cluster sensitivity](FIT_EVENT_SENSITIVITY_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv)
- [derivation dossier](tropical_cyclone_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md)
- [pressure test](PRESSURE_TEST_tropical_cyclone_wind_solar__model_v1_0__docs_r1.md)

The v0.1 bounded search, legacy audit, site-condition inventory, and row-level value crosswalk remain part of
the inherited proof trail. The changed decision is not that the evidence gap disappeared; it is that a tightly
quarantined screening proxy is being exposed for coverage-first research.

## 12. Workbook map

Workbook: `damage_curve_records_tropical_cyclone_wind_solar__model_v1_0__docs_r1.xlsx`

| Question | Expected sheet |
|---|---|
| What is supported and withheld? | `README`, `Scope_Coverage` |
| Which evidence and source files are used? | `Source_Evidence` |
| Which cohort and sufficient statistics are selected? | `Cohort_Fit` |
| How is PAVA reproduced and serialized? | `PAVA_Curve` |
| How sensitive is the curve to event omission? | `Event_Sensitivity` |
| Which units and value rows are supported or withheld? | `Failure_Units`, `Value_Crosswalk` |
| What must executable tests reproduce? | `KATs`, `QA` |
| Which evidence and assumptions are load-bearing? | `Source_Register`, `Claim_Register`, `Parameter_Tiers` |

The workbook is an audit view. The proposed JSON artifact is executable truth for review only; neither is a
canonical runtime pin.

## 13. Open seams and update triggers

Canonical promotion is blocked until:

1. an independent reviewer accepts or replaces the two T4 economic bridges;
2. the correlated, same-event Perry/Ceferino matched-site endpoint differences are reconciled and the selected
   population is justified;
3. the source wind height, averaging period, exposure convention, uncertainty, and Hazard bridge are governed;
4. a target-population transfer study supports utility-scale fixed-tilt use or the output remains explicitly
   source-cohort-only;
5. multiple independent upper-tail observations support a runtime range beyond 39.1 m/s;
6. an independent validation event and uncertainty treatment are added;
7. artifact, evaluator, KAT, workbook, schema, consumer, exact-pin, rollback, and negative-fallback review pass;
8. an explicit promotion decision changes the artifact index and consumer pin.

Any changed knot, cohort rule, tail policy, selector, bridge, valid range, or output meaning requires a governed
model-version review.

## 14. Implementation notes

The proposed curve ID is `TCWS_PERRY_GROUND_FIXED_VISIBLE_REPLACEMENT_PROXY_V1`. Evaluation is permitted only
between source knots using linear interpolation. Out-of-range, selector-mismatch, unsupported-unit, and
wrong-pathway calls return withholding/rejection reason codes and never a numeric fallback. The prior v0.1
scaffold remains preserved and reachable for audit.

## 15. Explicit non-changes

```yaml
artifact_index: unchanged
current_cell_pointer: not_created
portable_package_v2_5: unchanged
Hazard_runtime: unchanged
v0_1_scaffold: preserved
strict_gate_recommendation: unchanged_NO_GO
scenario_dollar_loss: not_released
full_plant_or_annual_loss: not_supported
promotion: not_performed
```
