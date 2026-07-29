# Tropical-cyclone wind × solar derivation dossier — proposed model v1.0/docs r1

## 1. Identity and disposition

```yaml
cell_id: tropical_cyclone_wind_solar
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_PERRY_MODULE_SCREENING_V1
pathway_id: tropical_cyclone_wind
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
```

This dossier records an intentionally narrow exception. The physical source endpoint is real and the fit is
reproducible. The economic ordinate is not observed: it is created by two explicit T4 assumptions. The model
exists for noncanonical coverage-first screening only.

## 2. Modeling question

The only supported question is:

```text
For the Perry manual ground/nontracking source cohort, at the dataset-reported event maximum gust,
what monotone mean fraction of module-hardware material would be replaced if module value is uniform
and every visibly missing/damaged module area is fully replaced?
```

It does not answer:

- generic utility-scale fixed-tilt module vulnerability;
- probability of rack, clamp, post, foundation, or electrical failure;
- pure aerodynamic wind loss separated from debris or cascade;
- total module installed repair cost;
- array, facility, GSU, or whole-plant loss; or
- annual/tail financial risk.

## 3. Change from model v0.1

Model v0.1 is a zero-curve scaffold and remains scientifically preferred under the strict evidence-earned
gate. Model v1.0 adds a conditional scalar proxy for one quarantined source unit. The behavior change is
therefore null-to-numeric, but only within an exact selector/range envelope. Nothing is promoted, and every
standard solar failure unit remains withheld.

## 4. Evidence reopening

### 4.1 Perry paper and public dataset

The v0.1 review treated Perry's published aggregate statistics as insufficient for a target curve. The public
dataset DOI `10.21948/2562917` changes one fact: the manual CSV exposes row-level mounting, tracking, hurricane,
maximum gust, and visible-damage percentage fields. The pinned manual file SHA-256 is
`edb34e74cc078bba1fdbe34463abadc794fd416caa66eb64ac3d0ed176ac5e00`.

This supports a reproducible physical-response cohort. The paper describes 48 manually located hurricane
installations, whereas the released manual CSV and dataset description contain 47. The paper also says site
type was compiled, but the manual CSV lacks that field. These version/schema differences do not change the
pinned cohort filter. They do prevent a claim that every narrative field is present or that the release is a
one-to-one export. The data do not supply site type for every manual record,
wind-product semantics for every event, inspected disposition, or repair cost.

### 4.2 Dataset endpoint

The paper describes manual comparison of pre-/post-hurricane imagery and approximating the percentage of
modules missing. The dataset description calls the material visible damage and, for the aggregated hurricane
set, percentage of modules that blew away. The manual CSV field is `pct_modules_damaged (%)`. The proposal
preserves the broader phrase “visibly missing/damaged module fraction” and does not claim detection of hidden
damage.

### 4.3 Ceferino supplementary challenge

Ceferino Supplementary Table 2 reports approximate panel damage extents at 14 Caribbean ground-mounted sites
using reports/web sources with visual verification. Perry and Ceferino overlap storms/sites and are therefore
correlated, cross-method evidence rather than independent validation. The
[governed four-match audit](CROSS_METHOD_MATCH_AUDIT_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv)
uses an analyst-defined nearest-coordinate rule after filtering the Perry aggregate file to Maria, utility,
and ground records; every retained distance is at most 500 m. No authoritative shared site ID adjudicates
identity. Those apparent matches differ by 12.1631605215 percentage points mean absolute difference. The
values are not pooled and never enter the manual-cohort fit.

The discrepancy reinforces endpoint/labeling uncertainty and blocks canonical promotion. It does not prove
that either source is wrong.

## 5. Asset and failure-unit boundary

```text
PERRY SOURCE-COHORT SITE
|
+-- supported physical observation/proxy atom
|   `-- PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT
|       `-- visible/missing module material only
|
+-- standard array units withheld
|   |-- PV_FIXED_TILT_MODULE_FIELD (generic all-damage field)
|   |-- PV_FIXED_TILT_SUPPORT_STRUCTURE
|   |-- PV_TRACKER_MODULE_FIELD
|   |-- PV_TRACKER_SBOS_ASSEMBLY
|   `-- PV_FOUNDATION
|
+-- plant units withheld
|   |-- PV_POWER_CONVERSION_AND_COLLECTION
|   |-- PV_GSU_SUBSTATION
|   |-- PV_SCADA_COMMUNICATIONS
|   `-- PV_CIVIL_INFRA
|
`-- PV_REPLACEMENT_SUPPORT withheld; allocate once after qualified disposition
```

The source unit is mutually exclusive with a generic `PV_FIXED_TILT_MODULE_FIELD` output. It is not a renamed
generic module curve. Missing modules can result from attachment/rack cascade, but the proxy does not assign
or value structural damage.

## 6. Cohort derivation

The source filter is exact:

```python
mounting_type == "ground"
and tracking == "False"
and finite(max_wind_gust_(m/s))
and finite(pct_modules_damaged (%))
```

Counts:

```text
manual source rows                      47
ground rows                             37
ground + explicitly nontracking rows    35
runtime fit rows                        34
audit-only sparse-tail rows              1
```

The runtime rows span Florence (20), Michael (4), Maria (4), Dorian (3), Ian (2), and Idalia (1). This is six
event clusters, not 34 independent hurricane realizations. System power is missing for some rows and the
released manual CSV lacks site type, so the cohort is deliberately named `MIXED_SCALE`.

## 7. Hazard axis

```yaml
axis_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST_MPS
input_field: perry_event_max_gust_mps
unit: m/s
fit_range: [17.4, 39.1]
source_product_selector: PERRY_DATASET_REPORTED_EVENT_MAX_GUST
provider: unresolved_for_full_manual_cohort
reference_height: unresolved
averaging_period: unresolved
exposure_standard: unresolved
query_semantics: unresolved
```

The data-description document describes a maximum gust over hurricane duration. The paper names Visual
Crossing for the Irma/Maria aggregated map, not for all events in the manual CSV. The more specific but
unsupported `Visual Crossing` axis label is therefore rejected for this multi-event fit.

No source-to-Hazard bridge is included. Exact numerical equality after a unit conversion does not create axis
compatibility.

## 8. Ordinate bridge

For source row `i`:

```text
z_i = pct_modules_damaged_i / 100
```

The source supplies `z_i` as a visible physical fraction. Proposed DR semantics require:

```text
V_module_before = sum_j v_j
V_module_replace = sum_j I_j * v_j

Assumption A: v_j is uniform across source-visible module area
Assumption B: I_j = 1 for every visibly missing/damaged module area, otherwise 0

therefore V_module_replace / V_module_before ~= z_i
```

Both assumptions are T4. Material acquisition value is the only potential denominator. Removal/reinstall
labor, freight, inspection, rack repair, electrical work, support, and hidden damage are absent. The equality
is a transparent proxy construction, not a source finding.

## 9. Tail decision

The 35th row is `(48.2 m/s, 0.4142383192)`. It is the strongest selected source-cohort severe
observation in the manual file. There are no selected observations between 39.1 and 48.2 m/s.

Using it as a knot would make one row determine a 9.1 m/s rising tail. Excluding it avoids that interpolation,
but lowers the retained severe-event response and removes hurricane-tail coverage. The point remains pinned in
the sufficient statistics and pressure test. This is a governance range decision, not an outlier rejection.

## 10. PAVA fit

Let `(x_i,z_i)` be the 34 runtime rows. Equal-site-weighted isotonic regression solves:

```text
minimize_m  sum_i (z_i - m_i)^2
subject to  m_i <= m_j whenever x_i < x_j
```

Exact-x rows share the same fitted level through pooling. The pool-adjacent-violators algorithm yields:

| Block | x low | x high | n | Fitted level |
|---:|---:|---:|---:|---:|
| 1 | 17.4 | 17.4 | 1 | 0.000000000000000 |
| 2 | 18.3 | 18.3 | 1 | 0.000000000000000 |
| 3 | 20.7 | 24.6 | 14 | 0.000272766560000 |
| 4 | 24.8 | 25.1 | 2 | 0.000955175835000 |
| 5 | 25.9 | 29.5 | 7 | 0.001853190692857 |
| 6 | 29.8 | 29.8 | 2 | 0.004054775905000 |
| 7 | 31.7 | 37.9 | 3 | 0.004414548050000 |
| 8 | 38.9 | 39.1 | 4 | 0.018272937632500 |

The artifact serializes these at block edges:

```text
(17.4, 0)
(18.3, 0)
(20.7, 0.000272766560000)
(24.6, 0.000272766560000)
(24.8, 0.000955175835000)
(25.1, 0.000955175835000)
(25.9, 0.001853190692857)
(29.5, 0.001853190692857)
(29.8, 0.004054775905000)
(31.7, 0.004414548050000)
(37.9, 0.004414548050000)
(38.9, 0.018272937632500)
(39.1, 0.018272937632500)
```

Linear interpolation is used between knots. No endpoint clamp or extrapolation is allowed. Equal-site
weighting is not module weighting; module counts are not consistently available. PAVA and the continuous
linearization are T3 engineering method choices, not procedures published by Perry. Serialized ordinates are
rounded to 15 decimal places; the derivation helper and validator must apply the same rule before exact knot
comparison.

## 11. Fit sensitivity and uncertainty

The raw gust relationship is weak and scattered. Leave-one-event checks show material instability:

- all-event high-end level: `0.01827294`;
- without Maria: `0.00337638`, about 5.41 times lower; and
- without Florence: `0.02436392` at 38.9 m/s, with 14 rows remaining.

No iid or row-bootstrap uncertainty band is permitted. A future spread requires an event-aware hierarchical or
other reviewed predictive model and independent validation. Runtime flags must state event clustering, PAVA
derivation, equal-site weighting, and missing spread.

## 12. Selector and evaluation contract

All selector values are exact:

```yaml
array_architecture_id: PERRY_GROUND_NONTRACKING_SOURCE_COHORT_V1
source_population_match_id: PERRY_MANUAL_GROUND_NONTRACKING_MIXED_SCALE_V1
module_value_distribution_assumption_id: UNIFORM_MODULE_HARDWARE_VALUE
visible_damage_disposition_assumption_id: FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING
source_wind_product_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST
causal_scope_acknowledgement_id: SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS
```

The causal acknowledgement prevents the imagery association from being mislabeled pure aerodynamic
fragility. There is no selector default, nearest-neighbor transfer, generic fixed-tilt alias, tracker fallback,
or numeric conditioner. Wrong pathway, source unit, source product, architecture, population, assumption, or
range withholds without fallback.

## 13. Exposure and value linkage

The response is already the realized fraction of the source site's module field. A second array exposure or
at-risk fraction is prohibited. GSU, collection, inverter, SCADA, rack, foundation, and civil subjects retain
their own point/line/network/yard/row exposure grains and receive no proxy value.

Before promotion only scalar proxy DR is supported. A future scenario amount would require exact site module-
hardware material value, currency/vintage, ownership and subject identity, value-source proof, and end-to-end
consumer review. The NLR benchmark is anatomy-only; no benchmark row becomes a runtime value.

## 14. Capability and reportability

```yaml
source_unit_scalar_mean_proxy_dr: conditional_noncanonical
scenario_loss: withheld_before_promotion
generic_fixed_tilt_module_DR: withheld
tracker_DR: withheld
rack_foundation_electrical_GSU_SCADA_civil_support: withheld
full_array_or_plant_loss: withheld
scalar_EAL: withheld
PML_VaR_TVaR: withheld
spread_carried: false
```

Withheld units are unknown, not zero. A valid scalar request must carry the always-on limitations defined in
the promotion matrix and capability declaration.

## 15. Alternatives rejected

| Alternative | Decision | Reason |
|---|---|---|
| remain only v0.1/docs revision | strict-gate preferred | evidence chain is incomplete; retained as explicit recommendation |
| generic utility-scale fixed-tilt curve | reject | mixed-scale source cohort and incomplete target transfer |
| exact utility-ground n=6 aggregate fit | reject for this proposal | architecture unresolved for half; only one row has explicit module counts; nonmonotone sparse tail |
| include 48.2 m/s point | reject runtime, retain audit | single severe point creates unsupported long tail ramp |
| pool Ceferino and Perry | reject | correlated events/sites and different endpoint methods |
| use Ceferino fragility as economic DR | reject | site extensive-failure probability/extent is not same-unit cost ratio |
| use NHC or ASCE wind by conversion | reject | source axis semantics not bridged |
| apply proxy to full TIV | reject | wrong denominator and partial physical coverage |
| add hidden-damage or support uplift | reject | no calibrated modifier or allocation rule |

## 16. Provenance and reproducibility

Runtime inputs and derived records must resolve through:

- `SOURCE_REGISTER_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv`;
- `CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv`;
- `PARAMETER_TIER_TABLE_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv`;
- `FIT_SUFFICIENT_STATISTICS_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv`;
- `FIT_EVENT_SENSITIVITY_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv`;
- the source-to-fit derivation helper;
- the curve artifact, capability, KATs, workbook, and validation report.

Raw source files are not redistributed because the dataset metadata provides no license. The DOI, file IDs,
hashes, schema, row filter, and sufficient statistics provide a reproducible path for a reviewer who obtains
the source directly.

## 17. Open seams and promotion decision

The strict gate remains NO-GO because the source population, portable axis, economic bridge, tail, endpoint
reconciliation, uncertainty, and validation chain remain open. The noncanonical model-v1 proposal is useful
for testing the contract and closing portfolio coverage; it is not evidence that those seams are solved.

Promotion requires every blocked item in the promotion matrix to close and a deliberate change to the artifact
index and consumer pin. New evidence will likely change model behavior and therefore trigger a governed model
version update rather than a silent docs edit.
