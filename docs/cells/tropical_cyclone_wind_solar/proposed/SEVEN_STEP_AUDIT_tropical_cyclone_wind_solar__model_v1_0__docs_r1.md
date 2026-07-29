# Seven-step audit — tropical_cyclone_wind_solar proposed model v1.0/docs r1

## Status

```yaml
change_class: NEW_CELL_MODEL_RELEASE
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
cell_model_version: model v1.0
cell_docs_revision: docs r1
canonical_runtime_artifact: false
strict_evidence_earned_gate: NO_GO_RETAIN_V0_1
coverage_first_exception: deliberate_noncanonical_screening_proxy
numeric_failure_units: 1
all_other_units: withheld
```

The audit separates the source observation, the imposed monotone fit, and the economic bridge. Completing the
seven steps does not change the strict-gate result: this is a reviewable screening exception, not an
evidence-earned release.

## Governing source observation and proxy ordinate

Perry's manual-data endpoint approximates the fraction of the module field visibly missing or damaged in
poststorm imagery. The proposed ordinate adds two explicit assumptions:

```text
y_i = pct_modules_damaged_i / 100

DR_proxy(x)
  = E_PAVA[y_i | Perry source-cohort event maximum gust x]
  x uniform module-hardware material value per module area
  x full replacement of every visibly missing/damaged module area
```

The fitted value is a screening module-hardware **material** replacement proxy. It excludes racking,
attachments, labor, freight, inspection, hidden damage, electrical systems, and every other asset bucket.

## Step 1 — define the asset and boundary

| Item | Decision |
|---|---|
| source population | Perry manual hurricane CSV, ground mount, `tracking=False`, mixed scale |
| target runtime identity | exact source-cohort screening archetype only |
| included physical boundary | visible/missing module hardware material |
| excluded physical boundary | rack/SBOS, foundation, electrical, GSU, SCADA, civil, support, hidden module damage |
| hazard pathway | event-associated tropical-cyclone wind screening scope |
| compound mechanisms | not separable in source; carried by explicit causal-scope acknowledgement |
| geography/vintage | heterogeneous source records; no target transfer claimed |
| financial scope | no BI, revenue, insured loss, terms, frequency, annual or tail metrics |

The source cohort is not presented as a site appraisal, utility-scale fleet sample, or CONUS reference class.
The exact selector makes the nontransferable research population part of the model identity.

## Step 2 — decompose into failure units

| Failure unit | Coverage role | v1 treatment | Blocking seam outside supported atom |
|---|---|---|---|
| `PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT` | conditional primary numeric source unit | scalar screening proxy | economic meaning relies on T4 assumptions |
| fixed-tilt support structure | primary physical candidate | withheld | no rack/attachment state, disposition, or same-unit cost |
| tracker module field | unsupported architecture | withheld | tracking rows excluded; no transfer |
| tracker SBOS | unsupported architecture | withheld | no source-cohort response/cost chain |
| foundation | separate physical unit | withheld, not zero | no applicable endpoint |
| power conversion and collection | split point/line/network units | withheld | not visible in module endpoint |
| GSU/substation | shared point/yard unit | withheld | no local wind response, value, or disposition |
| SCADA/communications | split point/network unit | withheld | no applicable endpoint |
| civil infrastructure | mixed split-required units | withheld | no applicable endpoint |
| replacement support | allocate after supported repair scope | withheld; no intrinsic DR | no repair scope or rule |

The source unit is deliberately not aliased to `PV_FIXED_TILT_MODULE_FIELD`: the latter would imply a portable
asset class the mixed-scale source does not earn.

## Step 3 — choose the y-axis and value basis

The numerator is the assumed material value of modules requiring replacement because their area is visibly
missing/damaged. The denominator is the pre-event material value of modules in the same source-cohort site.

Required bridge IDs:

```yaml
module_value_distribution_assumption_id: UNIFORM_MODULE_HARDWARE_VALUE
visible_damage_disposition_assumption_id: FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING
```

Both are `T4_placeholder_or_expert_judgment`. The first maps an area/count-like fraction to an equal-value
fraction. The second maps visible condition to complete material replacement. No source repair records prove
either assumption. Installed module value, array value, physical replacement value, insured value, and full
TIV are prohibited denominators.

The hazard axis is exact:

```yaml
axis_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST_MPS
input_field: perry_event_max_gust_mps
unit: m/s
source_product_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST
source_height: unknown
source_averaging_period: unknown
valid_numeric_range_mps: [17.4, 39.1]
```

No generic wind conversion or category mapping is approved.

## Step 4 — split the value basis row by row

Only a site-specific module-hardware **material** row could eventually bind to the proxy. The Q1-2025 NLR
module row remains a reference anatomy row and cannot become a default. The following treatments are
mandatory:

| Value row | Treatment |
|---|---|
| module hardware material | future conditional binding after promotion and site-specific proof |
| module installation labor | withheld; not in proxy denominator |
| mounting/racking/attachments | withheld separately |
| inverter/collection/grounding | withheld separately |
| GSU/substation | withheld as shared point/yard unit |
| foundation/civil/SCADA | withheld separately |
| freight/mobilization/inspection/site management | support once after repair scope; currently withheld |
| soft/sunk/nonphysical value | excluded from physical DR |

Mixed installed-cost or EPC rows must be split before use. No unresolved row receives zero damage.

## Step 5 — allocate physical value

The v1 proposal emits scalar proxy DR only and withholds dollars. A future promoted loss calculation would
require:

```yaml
asset_id:
asset_subject_id:
failure_unit_id: PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT
site_specific_module_hardware_material_value:
currency_and_vintage:
value_source_and_boundary:
ownership_fraction:
source_population_match_evidence:
support_cost_allocation_rule:
```

The curve response is already a site module-field fraction; an additional array exposure or at-risk fraction
for the same field is prohibited. Separate subjects such as GSU, collection lines, and civil assets do not
inherit module exposure.

## Step 6 — specify selectors, conditioners, and exposure

Numeric evaluation requires the exact fixed selector set:

```yaml
array_architecture_id: PERRY_GROUND_NONTRACKING_SOURCE_COHORT_V1
source_population_match_id: PERRY_MANUAL_GROUND_NONTRACKING_MIXED_SCALE_V1
module_value_distribution_assumption_id: UNIFORM_MODULE_HARDWARE_VALUE
visible_damage_disposition_assumption_id: FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING
source_wind_product_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST
causal_scope_acknowledgement_id: SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS
```

There are no numeric conditioner adjustments. Tilt, geometry, module type, design standard, terrain,
sheltering, maintenance, attachment quality, storm duration, direction, and event-time state remain
unresolved heterogeneity. Unknown fields receive no favorable or adverse modifier; they remain part of the
source-cohort limitation.

## Step 7 — apply curve or withhold

Fit preparation:

1. filter the public manual CSV to `ground` and `tracking=False`;
2. convert `pct_modules_damaged (%)` to fraction;
3. retain all 35 rows in audit lineage;
4. quarantine the lone 48.2 m/s/0.4142383192 severe-tail row while recording that it is the strongest selected
   source-cohort severe observation and that exclusion biases severe-event response down;
5. fit 34 rows from 17.4 through 39.1 m/s with equal-site-weighted PAVA;
6. serialize each constant block at its low/high x edges;
7. linearly interpolate only between governed analyst-derived PAVA knots; and
8. withhold outside the range or on any selector/axis/unit mismatch.

| x block (m/s) | n | PAVA proxy DR |
|---:|---:|---:|
| 17.4 | 1 | 0.000000000000000 |
| 18.3 | 1 | 0.000000000000000 |
| 20.7–24.6 | 14 | 0.000272766560000 |
| 24.8–25.1 | 2 | 0.000955175835000 |
| 25.9–29.5 | 7 | 0.001853190692857 |
| 29.8 | 2 | 0.004054775905000 |
| 31.7–37.9 | 3 | 0.004414548050000 |
| 38.9–39.1 | 4 | 0.018272937632500 |

No uncertainty band is emitted. Repeated rows from the same event are not treated as independent validation
events. Monotonicity is imposed; the source paper itself reports substantial scatter and a weak gust relation.
Every numeric emit must carry `PAVA_DERIVED_KNOTS`, `EQUAL_SITE_WEIGHT_NOT_MODULE_WEIGHTED`,
`EVENT_CLUSTERED_SAMPLE`, and `SPARSE_SEVERE_TAIL_WITHHELD`.

## Coverage and reportability matrix

| Requested output | v1 status | Required reason/condition |
|---|---|---|
| exact source-unit scalar proxy DR, matching selector, 17.4–39.1 m/s | conditional | noncanonical screening output plus T4/source limitations |
| below 17.4 or above 39.1 m/s | withheld | `OUTSIDE_SOURCE_SUPPORTED_RANGE` |
| tracker/roof/carport/unknown architecture | withheld | `UNSUPPORTED_SOURCE_ARCHITECTURE` |
| generic fixed-tilt or utility-scale module DR | withheld | `SOURCE_POPULATION_TRANSFER_NOT_SUPPORTED` |
| rack, foundation, electrical, GSU, SCADA, civil, support DR | withheld | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` |
| scenario dollar loss | withheld | `NONCANONICAL_PROPOSAL_NO_VALUE_BINDING` |
| full-array/full-plant loss | withheld | `PARTIAL_FAILURE_UNIT_COVERAGE` |
| EAL/PML/VaR/TVaR | withheld | consumer-owned frequency/tail objects absent; proposal noncanonical |

## Strict-gate exception record

The seven-step audit does not close four load-bearing seams: representative population, portable hazard axis,
observed economic consequence, and independent validation. Under the ordinary release standard the correct
outcome is `NO_RUNTIME_CURVE`. Model v1.0 exists only as a deliberately labeled, noncanonical coverage-first
screening exception. Canonical promotion requires re-opening this decision; it cannot be inferred from the
existence of a curve record.
