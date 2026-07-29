# Wind / Tornado × Wind Model Reference

**Use this page for exact lookup.** It separates the canonical current-v1 runtime from the noncanonical-v2
proposal, then consolidates current parameters, height/IEC bridges, fields, value shares, capabilities,
validation gaps, proposal-only state tables, hurricane boundaries, and reviewer checks.

For a first explanation, use the [basics README](README.md). For the reasoning chain, use
[How the model is built](HOW_THE_MODEL_IS_BUILT.md).

```yaml
cell_id: wind_tornado_wind
damage_code_id: WIND_TORNADO_WIND_V1
cell_model_version: model v1.0
human_documentation_revision: docs r5
canonical_runtime_pin: wind_tornado_wind@model_v1_0__docs_r4
artifact_schema_version: damage_curve_record_bundle.v2
capability_schema_version: capability_declaration.v2
canonical_artifact_sha256: 908f386953d062a62a33b6714020374b9b9d8a4538006e80d37047686c2c127a
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

---

## 1. Authority and current/proposed interpretation rules

| Question | Authority |
|---|---|
| Current runtime fields, parameters, curve records, and capability | [Canonical v1 JSON artifact](../current/wind_tornado_wind__model_v1_0__docs_r4__curve_artifact.json) |
| Current derivation/evidence narrative | [Current derivation dossier](../current/wind_tornado_wind_curve_derivation_dossier_v1_0.md) |
| Current human-readable fields and outputs | [Current metadata specification](../current/wind_tornado_wind_damage_code_metadata_spec_v1_0.md) |
| Current audit workbook | [Current workbook](../current/damage_curve_records_v1_0_wind_tornado_wind.xlsx) |
| Current pin and artifact SHA | [Artifact index](../../../contracts/machine_readable_artifact_index.json) |
| Proposed-v2 behavior | [Proposed artifact](../proposed/wind_tornado_wind__model_v2_0__docs_r1__curve_artifact.json), never current runtime |
| Proposed-v2 validation/promotion state | [Proposed validation report](../proposed/VALIDATION_REPORT_wind_tornado_wind__model_v2_0__docs_r1.md) |

Interpretation guardrails:

```text
- model v1.0/docs r4 is the only canonical runtime pin.
- model v2.0/docs r1 is a proposal even where its tests pass.
- current v1 logistics emit deterministic expected severity, not failure probabilities.
- IEC class/design gust selects the horizontal scale; it is not event intensity.
- exposure fraction scales repeated-unit value, not intrinsic turbine fragility.
- EF rating is damage-estimated context/proxy, not direct turbine-local wind measurement.
- equal numeric speed does not prove straight-line, tornado, and hurricane equivalence.
- current component summation retains a dependency/double-count warning.
- the latest canonical artifact/index wins over stale historical paths in older narrative addenda.
```

---

## 2. Canonical current-v1 identity

| Field | Current value |
|---|---|
| Cell | `wind_tornado_wind` |
| Damage code | `WIND_TORNADO_WIND_V1` |
| Semantic model | `model v1.0` |
| Runtime documentation | `docs r4` |
| Canonical runtime artifact | `true` |
| Package baseline | `library v2.5` |
| Package inclusion | Portable v2.5 carried docs r3; repository runtime advanced to docs r4 |
| Curve records | 5 |
| Populated emit mode | `scalar_mean` |
| Curve-intrinsic spread | Not carried |
| Public-source-derived | Yes |
| Claims/OEM-calibrated universal fragility | No |

The current package's earliest README header contains historical package labels. Use the artifact index,
current cell entrypoint, and complete consumer pin above for repository-current identity.

---

## 3. Current failure-unit inventory and coverage

| ID | Subsystem/component | Treatment | Failure mode | Physical-base share | Default aggregate? |
|---|---|---|---|---:|---:|
| `WT_BLADE_STRUCT` | Rotor assembly / blade | Primary nonzero | Structural overload, debris, blade strike | 0.173 | Yes |
| `WT_TOWER_STRUCT` | Tower / tower section | Primary nonzero | Buckling/collapse | 0.169 | Yes |
| `WT_NACELLE_CONSEQ` | Nacelle / gearbox, generator, yaw | Primary; dependency-sensitive in dossier | Direct/consequential damage | 0.345 | Yes |
| `WT_FOUNDATION_OT` | Foundation/base | Conditional-primary in dossier; serialized primary | Overturning/support failure | 0.062 | Yes |
| `WT_POWER_ELEC_ACCEL` | Power electronics / converter | Secondary/conditional/open seam | Acceleration-sensitive damage | 0.037 | No |

Coverage roles described but not represented by separate current numeric records:

```text
conditioner-only: pitch/feather, yaw, brake, operating state
secondary review: SCADA, collection, substation, civil/access
exposure: turbine count/fraction, swath, shared-system footprint
DR approximately 0 concept: units outside damaging footprint or below threshold
```

The four default shares total `0.749`; all five stored shares total `0.786`. Uncovered reference value is not
automatically immune. It remains outside the simple current default structural calculation unless separately
qualified.

---

## 4. Current axis, design scale, and height bridge

### 4.1 Canonical current axis

```text
preferred input: hub_height_3s_gust_mps
accepted upstream: ten_meter_3s_gust_mps, only with bridge lineage
internal axis: r = V_3s_hub / Ve50_class
unit: dimensionless
current extrapolation policy: warn
```

### 4.2 IEC speed table

| IEC class | `Vref` m/s | `Ve50` m/s | `Ve50` mph |
|---|---:|---:|---:|
| IEC I | 50.0 | 70.0 | 156.6 |
| IEC II | 42.5 | 59.5 | 133.1 |
| IEC III | 37.5 | 52.5 | 117.4 |

```text
Ve50 = 1.4 x Vref
```

### 4.3 Height formulas

```text
power law:
V_hub = V_10m x (hub_height_m / 10)^alpha

log law:
V_hub = V_10m x ln(hub_height_m/z0) / ln(10/z0)
```

Current artifact bridge fields:

| Field/rule | Current value |
|---|---|
| Bridge required for 10 m input | `true` |
| Default `alpha` if no better data | `1/7` |
| Required default flag | `DEFAULT_POWER_LAW_ALPHA_USED` |
| Fail-closed flag | `MISSING_HEIGHT_BRIDGE` |

The handoff also documents `ASSUMED_10M_EQUALS_HUB_HEIGHT_BIAS_WARNING` as an explicit fallback that should
not be used for production annual metrics.

### 4.4 Spatial/measurement metadata to preserve

```text
wind reference height and averaging duration
horizontal location/footprint and turbine subject
terrain/exposure or roughness basis
hub height and rotor geometry
source CRS/location accuracy where spatial exposure is used
bridge method, parameters, units, date, and provenance
whether the record is observed, derived, class-template, or unknown
```

Coordinate precision, raster resolution, and positional accuracy are separate. A broad wind raster or lease
polygon does not prove turbine-point demand or intersection.

---

## 5. Current canonical curve records

Current form:

```text
DR_i(r) = max_DR_i / (1 + exp[-k_i x (r - D50_i)])

current tornado variant:
D50_i,tornado = D50_i,straight + tornado_D50_shift_i
```

| Curve ID | `max_DR` | Straight D50 | `k` | Tornado shift | Tier summary |
|---|---:|---:|---:|---:|---|
| `WT_BLADE_STRUCT` | 1.00 | 1.38 | 12.0 | -0.10 | Cap T3; shape/shift T4 |
| `WT_TOWER_STRUCT` | 1.00 | 1.48 | 11.0 | -0.12 | Cap T3; shape/shift T4 |
| `WT_NACELLE_CONSEQ` | 0.85 | 1.44 | 10.0 | -0.10 | Cap T3; shape/shift T4 |
| `WT_FOUNDATION_OT` | 0.65 | 1.62 | 9.0 | -0.08 | Cap T3; shape/shift T4 |
| `WT_POWER_ELEC_ACCEL` | 0.30 | 1.20 | 8.0 | -0.05 | Cap/shape/shift T4 |

The tornado shift is negative, so the current tornado variant reaches any given fraction of its cap at a
lower normalized speed ratio. It remains an engineering proxy, not a tornado population fit.

---

## 6. Current calculated curve views

These rounded values reproduce the current formula for the straight-line variant. Runtime authority remains
the exact parameter payload.

| `r` | Blade | Tower | Nacelle | Foundation | Power electronics |
|---:|---:|---:|---:|---:|---:|
| 0.8 | 0.000948 | 0.000564 | 0.001410 | 0.000405 | 0.011750 |
| 1.0 | 0.010354 | 0.005067 | 0.010309 | 0.002443 | 0.050394 |
| 1.2 | 0.103400 | 0.043940 | 0.070697 | 0.014504 | 0.150000 |
| 1.4 | 0.559714 | 0.293178 | 0.341115 | 0.078857 | 0.249606 |
| 1.6 | 0.933392 | 0.789182 | 0.707216 | 0.295829 | 0.288250 |
| 1.8 | 0.993568 | 0.971252 | 0.827393 | 0.542617 | 0.297551 |
| 2.0 | 0.999413 | 0.996731 | 0.846868 | 0.629410 | 0.299502 |

ASCII comparison (`#` is approximately five percentage points):

```text
              blade                  tower                  nacelle
r=1.0  1.04%  |              0.51%  |              1.03%  |
r=1.2 10.34%  |##            4.39%  |#             7.07%  |#
r=1.4 55.97%  |###########  29.32%  |######       34.11%  |#######
r=1.6 93.34%  |################### 78.92% |################ 70.72% |##############
r=1.8 99.36%  |#################### 97.13% |################### 82.74% |#################
```

Nacelle asymptotically approaches `0.85`; foundation approaches `0.65`; power electronics approaches `0.30`.
The caps are per-value-bucket severity caps, not full-plant caps.

---

## 7. Current selectors, conditioners, exposure, and outputs

### 7.1 Selectors

| Field | Allowed/default | Runtime role |
|---|---|---|
| `iec_wind_class` | IEC I, II, III, site specific; current default IEC II | Chooses `Ve50` |
| `turbine_model_or_design_speed` | Text/numeric | Overrides generic IEC class when known |
| `hub_height_m` | Positive height | Required for non-hub-height source input |
| `rotor_diameter_m`, `blade_length_m`, rated power, survival speed | Recommended narrative metadata | Future archetype/refinement; no current parameter switch |

### 7.2 Conditioners

| Field | Narrative values | Current serialized effect |
|---|---|---|
| `operating_state` | operating, parked, curtailed, faulted, unknown | Qualitative flag only |
| `feathered_state` | feathered, not feathered, unknown | Qualitative flag only |
| `yaw_alignment` | aligned, yaw error, unknown | Qualitative flag only |
| `tornado_variant` | Boolean/current variant | T4 horizontal D50 shift |
| `brake_status` | available, failed, unknown | Documented in metadata; no serialized numeric logic |
| `grid_availability` | available, unavailable, unknown | Documented in metadata; no serialized numeric logic |

### 7.3 Exposure

| Field | Meaning | Guard |
|---|---|---|
| `total_turbine_count` | Repeated-unit denominator | Must describe the same modeled farm/group |
| `turbines_exposed_count` | Turbines in damaging footprint | Requires defensible point/swath intersection |
| `exposed_turbine_fraction` | Exposed count / total count | Canonical artifact-required exposure field |
| `substation_in_footprint` | Shared point asset affected? | Do not infer from turbine fraction |
| `collection_in_footprint` | Line/network affected? | Do not infer from turbine fraction |

### 7.4 Current output object

```text
failure_unit_damage_ratio
selected curve variant
selected IEC class
speed_ratio_to_iec
exposure fraction used
dependency flags
source confidence
open seams
```

The canonical artifact populates only deterministic `scalar_mean` vulnerability mode. Generic distribution
fields remain null.

---

## 8. Current failure-unit value crosswalk and assembly rules

Current reference shares:

| Failure unit | Physical-base share | Default inclusion |
|---|---:|---:|
| Blade | 0.173 | Yes |
| Tower | 0.169 | Yes |
| Nacelle | 0.345 | Yes |
| Foundation | 0.062 | Yes |
| Power electronics | 0.037 | No |

Illustrative current simple assembly:

```text
loss contribution_i
    = DR_i
    x explicit physical-base value_i
    x exposed_turbine_fraction

simple current structural contribution
    = sum of four default records
```

Guardrails:

```text
- Current artifact has no top-level explicit value profile.
- Capability requires explicit value and exposure for scenario loss.
- Shares do not sum to the full physical base; uncovered value is not declared immune.
- Power electronics is excluded from the current default aggregate.
- Component dependency/precedence is unresolved; simple sum carries a warning.
- EAL/PML/TIV reporting is downstream.
```

### Current worked calculation at 70 m/s, IEC II

```text
r = 70 / 59.5 = 1.176470588
exposed_turbine_fraction = 0.25
```

| Unit | Straight DR | Share × DR | After 25% exposure |
|---|---:|---:|---:|
| Blade | 0.079999565 | 0.013839925 | 0.003459981 |
| Tower | 0.034263065 | 0.005790458 | 0.001447614 |
| Nacelle | 0.056866024 | 0.019618778 | 0.004904695 |
| Foundation | 0.011785960 | 0.000730730 | 0.000182682 |
| **Simple four-unit sum** | -- | **0.039979890** | **0.009994973** |

At the same numeric speed, the current tornado-shift variant gives a simple four-unit full-exposure sum of
`0.107874320`, or `0.026968580` after 25% exposure. That is a demonstration of current-v1 shift behavior,
not an equivalence study.

---

## 9. Current evidence-tier and update-trigger register

| Parameter family | Tier | Current basis | Update trigger |
|---|---|---|---|
| `Ve50 = 1.4 x Vref`, IEC table | T2 | Standards/method bridge | Site-specific turbine design speed |
| 10 m-to-hub bridge | T3 | Engineering transfer; exponent/roughness site dependent | Direct hub/rotor-effective hazard field |
| Main structural `max_DR` caps | T3 | Bounded severity/value judgment | Claims/OEM/forensic value-loss data |
| Power-electronics `max_DR` | T4 | Open-seam engineering judgment | Acceleration-demand/outcome data |
| All current D50 ratios | T4 | Engineering fits constrained by design/case evidence | Empirical turbine fragility dataset |
| All current `k` values | T4 | Engineering-fit steepness | Empirical turbine fragility dataset |
| Tornado D50 shifts | T4 | Direct-hit plausibility/case evidence | Tornado-specific turbine fragility |
| Numeric yaw/feather/brake effects | Withheld | Mechanism relevant; transfer not calibrated | Qualified matched state/outcome evidence |
| Intrinsic spread | Not carried | No governed distribution | Claims/field/elicitation uncertainty model |

Tier vocabulary:

```text
T2  public laboratory/standard/method or physics bridge
T3  engineering proxy or adjacent empirical evidence
T4  explicit placeholder or expert judgment
```

---

## 10. Current capability and reportability

### Damage emit

```text
failure-unit scalar DR                         supported
scenario loss                                 supported with explicit value/exposure
curve-intrinsic spread                         not carried
populated emit mode                            scalar_mean
```

### Downstream annual metrics

| Metric/object | Capability |
|---|---|
| Frequency-driven annual loss distribution | Consumer-supported with sampled frequency/intensity/coupling/caps |
| EAL | Consumer-computable with prerequisites |
| PML/VaR/TVaR | Consumer-computable from a validated annual loss distribution |
| Vulnerability-uncertainty distribution | Not supported; intrinsic spread absent |

Required current limitation flags:

```text
CURVE_INTRINSIC_SPREAD_NOT_CARRIED
TAIL_CONDITIONAL_ON_DETERMINISTIC_VULNERABILITY
```

Cap binding is downstream-owned and fail-closed. Failure-unit caps and annual aggregate caps must be applied
at the correct event/value grain inside the simulation.

---

## 11. Current validation status -- precise wording

### 11.1 What passes now

The repository-wide runtime validator passes all five indexed artifacts, including current wind v1. For this
artifact it verifies:

| Check | Current result |
|---|---|
| Artifact exists and SHA matches index | PASS |
| Bundle-v2 model/docs/cell/canonical identity | PASS |
| Current source paths resolve and avoid legacy/downstream paths | PASS |
| Five `wind_tornado_logistic_ratio` parameter payloads have exact keys | PASS |
| Every record carries Boolean default-aggregate flag | PASS |
| Embedded capability-v2 semantics | PASS |
| Changelog current pin matches index | PASS |

### 11.2 What is missing now

| Check/artifact | Current status |
|---|---|
| Cell-specific v1 known-answer JSON | **Not published** |
| Current artifact `known_answer_tests` pointer | **Absent** |
| Standalone current-v1 validation report | **Absent** |
| Numeric equation/value/exposure KAT execution in repository validator | **Not implemented for current wind v1** |

Current workbook QA status:

| Workbook check | Recorded result |
|---|---|
| Coverage | PASS |
| X-axis | PASS |
| Curve form | PASS |
| Evidence | `PASS_WITH_ASSUMPTIONS` |
| Value link | PASS |
| Double count | `PASS_WITH_FLAG` |
| Tail/EAL | `NOT_IN_SCOPE` |
| Formula scan | `TO_VERIFY` |

Do not translate the repository contract PASS into a claim that current wind v1 has a complete independent
numeric KAT suite. That gap is a future validation task.

---

## 12. Proposed model v2.0 reference -- NONCANONICAL

```yaml
damage_code_id: WIND_TORNADO_WIND_PATHWAY_V2_PROPOSED
semantic_damage_model_version: model v2.0
documentation_revision: docs r1
canonical_runtime_artifact: false
artifact_schema: damage_curve_record_bundle.v3
emit_schema: damage_emit.v2
capability_schema: capability_declaration.v3
review_snapshot_sha256: 736ffa95a4ae4afd05e54d2a4256ab3712f921bcd334af89a8ac28b8cf859bcd
promotion_status: blocked
```

The SHA above identifies one proposal review snapshot. It is not a canonical consumer pin.

### 12.1 Proposed pathway boundaries

| Pathway | Included | Excluded |
|---|---|---|
| `straight_line_convective` | Downburst micro/macroburst, gust front, local derecho outflow | Tornado, nonconvective synoptic, tropical cyclone, downslope, hail, lightning |
| `tornado_direct_hit` | Conditional severity after turbine intersection and local demand are resolved | Frequency, track probability, lease overlap alone, straight-line, tropical cyclone, unpartitioned TC tornado |

### 12.2 Proposed axes

| Pathway | Preferred input | Permitted proxy | Main guards |
|---|---|---|---|
| Straight convective | `rotor_effective_3s_gust_mps / iec_ve50_mps` | Hub-height 3-second gust, flagged | Flag below 28 or above 55 m/s; withhold above 70; named 10 m profile bridge |
| Tornado direct hit | `tornado_rotor_effective_peak_horizontal_speed_mps` | Qualified hub-height peak 3-second/radar bridge | Zero below 25 m/s; flag above 80; reject EF-only input |

### 12.3 Proposed failure-unit/value boundary

| Proposed unit | Treatment | Reference denominator |
|---|---|---:|
| `WT_TURBINE_EQUIPMENT_ASSEMBLY` | One conditional screening curve per pathway | 1,090 2023 USD/kW |
| `WT_FOUNDATION` | Withheld | 120 USD/kW |
| `WT_EXTERNAL_ELECTRICAL` | Withheld | 72 USD/kW |
| `WT_CIVIL_INFRA` | Withheld | 47 USD/kW |
| `WT_REPLACEMENT_SUPPORT` | Allocate once outside intrinsic curve | 294 USD/kW |

Reference reconciliation:

```text
turbine equipment direct                 1090 USD/kW
withheld other direct                     239 USD/kW
support/fieldwork/logistics               294 USD/kW
physical replaceable                     1623 USD/kW
excluded soft/nonphysical                 345 USD/kW
installed CAPEX                          1968 USD/kW
physical / installed ratio                0.82469512195122
```

### 12.4 Proposed ordered damage states

| State | Meaning | Cost ratio on 1,090 USD/kW equipment denominator |
|---|---|---:|
| `DS0_NO_DIRECT_DAMAGE` | No occurrence physical-destruction cost | 0 |
| `DS1_CONTROL_PITCH_REPAIR_PROXY` | Pitch/control physical repair proxy | 0.0119266055045872 |
| `DS2_ROTOR_ASSEMBLY_REPLACEMENT` | Blades, hub, pitch replacement | 0.309174311926606 |
| `DS3_TERMINAL_TURBINE_EQUIPMENT_REPLACEMENT` | Rotor/pitch/nacelle/power/yaw/tower replacement | 1 |

Evaluation:

```text
q_j    = Phi( ln(x/theta_j) / beta_ln )
p0     = 1 - q1
pj     = qj - q(j+1)
p_last = q_last
EDR    = sum_j [ pj x cost_ratio_j ]
```

Exact states are mutually exclusive and exhaustive.

### 12.5 Proposed scenario parameters

Straight-line convective uses `beta_ln=0.10`, `zero_below=0.35` speed ratio:

| Resistance scenario | DS1/DS2/DS3 medians on `V/Ve50` |
|---|---|
| Lower resistance, higher-DR bound | `[0.75, 0.90, 1.15]` |
| Central screening | `[0.90, 1.05, 1.30]` |
| Upper resistance, lower-DR bound | `[1.05, 1.20, 1.45]` |

Tornado direct hit uses `beta_ln=0.08`, `zero_below=25 m/s`:

| Resistance scenario | DS1/DS2/DS3 medians, m/s |
|---|---|
| Lower resistance, higher-DR bound | `[32, 45, 58]` |
| Central screening | `[36, 51, 67]` |
| Upper resistance, lower-DR bound | `[40, 56, 80]` |

The scenario labels describe resistance ordering. They are unweighted epistemic engineering bounds, not
percentiles or probabilities and must not be averaged without weights.

### 12.6 Proposed validation and remaining blockers

The proposal report records:

```text
13 runtime/withholding KATs                      PASS
13 contract-rejection KATs                       PASS
1 cross-pathway identity assertion               PASS
4 consumer-pin tests                             PASS
equation/bounds/resistance ordering               PASS
12-sheet workbook, 15 QA checks, visual review   PASS
current-v1 regression                             PASS
```

Promotion remains blocked pending Hazard's pinned loader, height/profile and exposure repair, event-family
partitioning, value/support assembly, hardcoded-curve removal, dual-read explanation, rollback rehearsal, and
explicit repository promotion.

---

## 13. Hurricane and neighboring-wind boundary

The proposed evaluator rejects:

```text
event_family = tropical_cyclone
hazard_mechanism = synoptic_nonconvective_wind
hazard_mechanism = downslope_windstorm
pathway_id missing or inferred
```

That proposed rejection is a routing rule, not a zero-damage statement. Current v1 does not serialize this
first-class rejection contract, so consumers must not infer hurricane coverage from the current shared speed
axis.

Future neighboring candidate:

```yaml
candidate_cell_id: tropical_cyclone_wind_wind
shared_asset_substrate_allowed: true
shared_numeric_curve_allowed: false_without_equivalence_review
```

TC-spawned tornadoes must be partitioned so one occurrence is not double counted in hurricane and tornado
catalogs.

---

## 14. Main current sources and permitted inference

| Source | Main permitted use | Link |
|---|---|---|
| DOE severe-weather article | Protection states, direct-hit caveats, design context | [DOE](https://www.energy.gov/cmei/wind/articles/how-do-wind-turbines-survive-severe-weather-and-storms) |
| DTU IEC explainer | IEC class/load framing | [DTU](https://wasp.dtu.dk/software/windfarm-assessment-tool/iec-61400-1) |
| IEC extreme-events equations | `Ve50 = 1.4 x Vref` | [Ashes documentation](https://www.simis.io/docs/wind-iec-extreme-events) |
| NOAA/NWS EF scale | Damage-estimated gust ranges and caveats | [NOAA/NWS](https://www.weather.gov/grb/efscale) |
| NASA Greenfield case | High-severity tornado/turbine collapse plausibility | [NASA](https://science.nasa.gov/earth/earth-observatory/tornado-damage-in-greenfield-152870/) |
| NIST fragility method | Fragility/damage-matrix framing and dependency discipline | [NIST](https://www.nist.gov/publications/fragility-curves-damage-matrices-and-wind-induced-loss-estimation) |
| Rice acceleration research | Secondary acceleration-sensitive mechanism | [Rice](https://duenas-osorio.rice.edu/sisrra/current-projects-and-sponsors/long-term-unavailability-wind-turbines-wind-induced-accelerations) |

Case reports and standards anchor mechanisms, axes, and reasonableness. They do not directly calibrate the
current T4 D50/k/shift values.

---

## 15. Reviewer checklist

### Current-v1 review

```text
[ ] Current model/docs/schema/SHA tuple is pinned exactly.
[ ] Current v1, not proposed v2, supplies runtime equations.
[ ] Wind duration and reference height are explicit.
[ ] A 10 m input carries a documented bridge; no silent equality is used.
[ ] IEC class/design speed is observed or an explicitly flagged default.
[ ] Tornado proxy is not presented as measured turbine-local wind.
[ ] Exposure uses turbine count/points and is applied once.
[ ] Each DR maps only to its matching value bucket.
[ ] Power electronics remains outside the default structural sum.
[ ] Component dependency/double-count warning is retained.
[ ] Missing current-v1 numeric KAT coverage is not hidden.
[ ] Curve-intrinsic spread is not invented.
[ ] Annual/tail metrics remain downstream and pass consumer gates.
```

### Proposed-v2 review

```text
[ ] Proposal is labeled noncanonical at every use.
[ ] Exact pathway_id is required; no pathway is inferred from speed.
[ ] Straight and tornado axes/proxies are not collapsed.
[ ] EF-only input rejects.
[ ] Hurricane/synoptic/downslope inputs reject from proposed pathways.
[ ] Turbine-equipment DR is not applied to foundation, external plant, civil, support, or full TIV.
[ ] Resistance scenarios are not averaged or called percentiles.
[ ] No reportable annual metric claims v2 before promotion.
```

---

## 16. Version history and non-change statement

| Layer | Current state |
|---|---|
| Semantic damage model | model v1.0 |
| Canonical runtime artifact | docs r4, bundle v2, capability v2 |
| Human basics documentation | docs r5 |
| Proposed redesign | model v2.0/docs r1; noncanonical and blocked |
| Portable package baseline | library v2.5 |

Human docs r5 adds this three-file basics set. It does not change current-v1 logistic curves, parameters, bridges,
shares, exposure semantics, capability, artifact SHA/schema, or output. It does not promote or alter proposed
model v2.0.
