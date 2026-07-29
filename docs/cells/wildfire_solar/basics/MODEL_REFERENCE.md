# Wildfire × Solar Model Reference

**Use this page for exact lookup.** It consolidates the canonical pin, class map, ten state tables, value
crosswalk, formulas, fields, error codes, capabilities, tests, limitations, and update triggers for the
released wildfire × solar screening model.

For a first explanation, use the [basics README](README.md). For the derivation story, use
[How the model is built](HOW_THE_MODEL_IS_BUILT.md).

```yaml
cell_id: wildfire_solar
damage_code_id: WILDFIRE_SOLAR_FSIM_SCREENING_V1
cell_model_version: model v1.0
human_documentation_revision: docs r4
canonical_runtime_pin: wildfire_solar@model_v1_0__docs_r3
artifact_schema_version: damage_curve_record_bundle.v2
capability_schema_version: capability_declaration.v2
canonical_artifact_sha256: 598512fbe2f0a3c8db48df69fdb2cd00ca5e0cc8e7ef761555837a3d76d166d8
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

---

## 1. Authority and interpretation rules

| Question | Authority |
|---|---|
| Exact runtime states, records, parameters, logic, and embedded capability | [Canonical JSON artifact](../current/wildfire_solar__model_v1_0__docs_r3__curve_artifact.json) |
| Standalone capability | [Capability declaration](../current/wildfire_solar__model_v1_0__docs_r3__capability.json) |
| Executable expected results and rejects | [Known-answer tests](../current/known_answer_tests_wildfire_solar__model_v1_0__docs_r3.json) |
| Derivation/evidence narrative | [Derivation dossier](../current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md) |
| Human-readable callable contract | [Metadata specification](../current/wildfire_solar_damage_code_metadata_spec__model_v1_0__docs_r3.md) |
| Exact review tables | [Ordinate CSV](../current/ORDINATE_TABLE_wildfire_solar__model_v1_0__docs_r3.csv) and [value-linkage CSV](../current/VALUE_LINKAGE_wildfire_solar__model_v1_0__docs_r3.csv) |
| Release checks and workbook hash | [Validation report](../current/VALIDATION_REPORT_wildfire_solar__model_v1_0__docs_r3.md) |
| Repository pin and artifact SHA | [Artifact index](../../../contracts/machine_readable_artifact_index.json) |

Interpretation guardrails:

```text
- State numbers are categorical lookup keys, not continuous fire measurements.
- State 0 is a no-event control and not an FSim conditional class.
- The piecewise-linear JSON container does not authorize interpolation for this cell.
- A failure-unit DR is conditional same-unit direct replacement severity, not annual probability.
- Aggregate reference rows are derived from ten records and values; they are not a hidden plant curve.
- All exact class ordinates are T4 engineering judgments.
- Sensitivity stresses are not confidence intervals or distributions.
- The runtime artifact wins if an older research file or consumer proxy conflicts.
```

---

## 2. Canonical identity and lifecycle

| Field | Current value |
|---|---|
| Cell | `wildfire_solar` |
| Damage code | `WILDFIRE_SOLAR_FSIM_SCREENING_V1` |
| Semantic model | `model v1.0` |
| Runtime documentation | `docs r3` |
| Lifecycle/promotion | `released_v1_0` / `released` |
| Model grade | `screening_engineering_proxy` |
| Canonical runtime artifact | `true` |
| Package baseline | `library v2.5` |
| Portable package inclusion | Repository canonical; not in portable v2.5 |
| Curve records | 10 |
| Claims/field calibrated | No |

The superseded model v0.1 scaffold under `proposed/` has zero runtime curves and remains an audit trail only.

---

## 3. Canonical hazard class map

| State | Exact class ID | Conditional flame-length bin | Runtime status |
|---:|---|---|---|
| 0 | `no_event` | Not an FSim class | Control; all DRs zero |
| 1 | `lt_2_ft` | `<2 ft` | Valid exact lookup |
| 2 | `gte_2_lt_4_ft` | `2-<4 ft` | Valid exact lookup |
| 3 | `gte_4_lt_6_ft` | `4-<6 ft` | Valid exact lookup |
| 4 | `gte_6_lt_8_ft` | `6-<8 ft` | Valid exact lookup |
| 5 | `gte_8_lt_12_ft` | `8-<12 ft` | Valid exact lookup |
| 6 | `gte_12_ft` | `>=12 ft`, open ended | Valid exact lookup; no upper midpoint |

```text
valid internal domain:     integer states 0..6
interpolation:             prohibited
extrapolation:             prohibited
burn probability in M3:    prohibited
```

---

## 4. Canonical failure-unit state tables

All percentages below are conditional same-unit DRs from the canonical artifact.

| Failure unit | Role | `<2` | `2-<4` | `4-<6` | `6-<8` | `8-<12` | `>=12` |
|---|---|---:|---:|---:|---:|---:|---:|
| `WSV1_MODULE_THERMAL` -- PV module | Primary | 0.2% | 1.0% | 4.0% | 12.0% | 32.0% | 65.0% |
| `WSV1_RACKING_THERMAL` -- tracker/racking | Secondary | 0.0% | 0.1% | 0.5% | 2.0% | 8.0% | 25.0% |
| `WSV1_FOUNDATION_THERMAL` -- pile/pad | Reviewed low | 0.0% | 0.0% | 0.1% | 0.3% | 1.0% | 4.0% |
| `WSV1_INVERTER_THERMAL` -- central inverter | Primary | 0.2% | 1.0% | 5.0% | 18.0% | 45.0% | 80.0% |
| `WSV1_COMBINER_THERMAL` -- combiner box | Primary | 0.3% | 1.5% | 6.0% | 20.0% | 50.0% | 85.0% |
| `WSV1_CABLE_EXPOSED` -- exposed AC/DC cable | Primary/exposed | 0.5% | 2.0% | 8.0% | 25.0% | 60.0% | 90.0% |
| `WSV1_MV_EQUIPMENT_THERMAL` -- transformer/switchgear | Primary | 0.1% | 0.6% | 3.0% | 12.0% | 35.0% | 70.0% |
| `WSV1_GROUNDING_THERMAL` -- grounding/lightning | Reviewed low | 0.0% | 0.1% | 0.4% | 1.5% | 5.0% | 12.0% |
| `WSV1_SCADA_THERMAL` -- monitoring/communications | Secondary | 0.4% | 2.0% | 8.0% | 25.0% | 60.0% | 90.0% |
| `WSV1_CIVIL_DIRECT` -- mixed direct civil | Mixed bucket | 0.1% | 0.5% | 2.0% | 7.0% | 18.0% | 40.0% |

Every state-0 ordinate is `0`. Every table is monotone and bounded in `[0,1]`.

### Severe-class ranking

ASCII view for state 6 (`#` is approximately five percentage points):

```text
exposed cable       90%  |##################
SCADA/comms         90%  |##################
combiner boxes      85%  |#################
inverter            80%  |################
MV equipment        70%  |##############
PV modules          65%  |#############
direct civil        40%  |########
tracker/racking     25%  |#####
grounding           12%  |##
foundation/pads      4%  |#
```

The ranking reflects the current screening assumptions about exposed polymers/electronics versus protected,
metallic, or buried structures. It is not a universal material law.

---

## 5. Reference aggregate outputs

These rows are recalculated from the ten DRs and the explicit reference value profile.

| State | Class | Physical-base DR | Installed-CAPEX DR |
|---:|---|---:|---:|
| 0 | no event | 0.000000000000 | 0.000000000000 |
| 1 | `<2 ft` | 0.001681315618 | 0.001317724664 |
| 2 | `2-<4 ft` | 0.008229710540 | 0.006450004057 |
| 3 | `4-<6 ft` | 0.034521860939 | 0.027056376045 |
| 4 | `6-<8 ft` | 0.112130612692 | 0.087881937433 |
| 5 | `8-<12 ft` | 0.299248521323 | 0.234534880318 |
| 6 | `>=12 ft` | 0.583104476113 | 0.457005895679 |

```text
physical DR
0.60 |                                      o state 6
0.50 |
0.40 |
0.30 |                           o state 5
0.20 |
0.10 |                 o state 4
0.00 | o state 1  o state 2  o state 3
     +------------------------------------------------
       <2         2-<4       4-<6       6-<8  8-<12  >=12

categorical order only; horizontal spacing is not a continuous flame-length scale
```

---

## 6. Evaluation formulas

### Exact event-class mode

```text
state = exact_map(conditional_flame_length_class)
DR_u  = exact_lookup(curve_u.points, state)
```

### Conditional-distribution mode

For all six class probabilities `FLP_s`:

```text
0 <= FLP_s <= 1
sum_s(FLP_s) = 1

E[DR_u | burn] = sum_s [ FLP_s x DR_u(s) ]
```

The published example vector is:

```text
(0.25, 0.25, 0.20, 0.15, 0.10, 0.05)

expected physical-base DR      = 0.085281796569
expected installed-CAPEX DR    = 0.066839280820
```

### Value assembly

```text
C_direct(s)  = sum_u [ DR_u(s) x V_u ]
DR_direct(s) = C_direct(s) / sum_u(V_u)
C_support(s) = DR_direct(s) x V_support

DR_physical(s) = [C_direct(s) + C_support(s)] / V_physical
DR_installed(s) = DR_physical(s) x V_physical / V_installed
```

Reference support is allocated in proportion to aggregate direct/civil DR once. Do not evaluate support as
an independent failure unit.

---

## 7. Input, selector, conditioner, and output dictionary

### 7.1 Hazard input modes

| Field | Requirement | Meaning | Guard |
|---|---|---|---|
| `conditional_flame_length_class` | Exactly one mode | One recognized FSim class ID | No numeric midpoint or interpolation |
| `conditional_flame_length_probability_by_bin` | Exactly one mode | Complete six-bin vector conditional on burn | Each in `[0,1]`; sum to one |
| `burn_probability` | Prohibited in damage call | Frequency input owned by Hazard | Reject from M3 request |

### 7.2 Value and exposure fields

| Field | Requirement | Current effect |
|---|---|---|
| `value_profile_id` | Required for reference scenario loss | Select `WILDFIRE_SOLAR_REFERENCE_100MWDC_V1` explicitly |
| `site_failure_unit_values_usd` | Alternative for scenario loss | Complete values keyed by all ten IDs |
| `screening_exposure_basis` | Required declaration | `integrated_reference_archetype_conditional_on_FSim_class` |
| `cable_installation` | Site/value-profile selector | Remove protected/buried value from exposed-cable profile |

Missing value does not prevent failure-unit DR. It withholds scenario loss.

### 7.3 Site-condition metadata

| Field | Current numeric effect | Default |
|---|---:|---|
| `vegetation_management_state` | None | No credit |
| `barrier_state` | None | No credit |
| `suppression_system_state` | None | No credit |
| `firefighter_access_state` | None | No credit |
| `deenergization_state` | None | No credit |

### 7.4 Outputs

| Output | Meaning |
|---|---|
| `conditional_failure_unit_damage_ratio` | Central screening DR for one unit, conditional on class/burn |
| `screening_fire_state_id` | Exact state used |
| FLP weights and expected conditional DR | Added in distribution mode |
| `direct_and_civil_loss_fraction` | Optional with explicit value basis |
| `physical_base_loss_fraction` | Optional physical-denominator result |
| `installed_capex_loss_fraction` | Optional installed-denominator view of same loss |
| `support_cost_allocation_fraction` | Explicit support allocation result |
| `value_profile_id` | Value provenance |
| metadata/limitation flags | Screening, calibration, axis, and spread warnings |

---

## 8. Fail-closed reason codes

| Condition | Required result/code |
|---|---|
| Neither class nor FLP vector | `MISSING_WILDFIRE_SEVERITY_INPUT` |
| Both modes supplied | `AMBIGUOUS_WILDFIRE_SEVERITY_INPUT` |
| Unknown class | `FSIM_CLASS_NOT_RECOGNIZED` |
| FLP outside `[0,1]` | `FLP_VALUE_OUT_OF_RANGE` |
| FLPs do not sum to one | `FLP_VECTOR_MUST_SUM_TO_ONE` |
| Burn probability supplied to M3 | `FREQUENCY_FIELD_NOT_ALLOWED_IN_DAMAGE_CALL` |
| No explicit value basis | Return unit DR; withhold loss with `EXPLICIT_VALUE_PROFILE_OR_SITE_VALUE_BASIS_REQUIRED` |
| Unknown control/mitigation state | No credit; central table unchanged |
| Fractional class/interpolation | `EXACT_STATE_LOOKUP_REQUIRED` |

---

## 9. Failure-unit value crosswalk

Reference values use 2024 USD per kWdc from the governed NREL/NLR benchmark crosswalk.

| Failure unit | Direct value USD/kWdc | Share of physical base | Share of installed CAPEX |
|---|---:|---:|---:|
| `WSV1_MODULE_THERMAL` | 291.214851 | 33.1757% | 26.0013% |
| `WSV1_RACKING_THERMAL` | 109.989726 | 12.5302% | 9.8205% |
| `WSV1_FOUNDATION_THERMAL` | 31.124487 | 3.5458% | 2.7790% |
| `WSV1_INVERTER_THERMAL` | 32.306366 | 3.6804% | 2.8845% |
| `WSV1_COMBINER_THERMAL` | 6.826250 | 0.7777% | 0.6095% |
| `WSV1_CABLE_EXPOSED` | 69.320112 | 7.8971% | 6.1893% |
| `WSV1_MV_EQUIPMENT_THERMAL` | 106.504664 | 12.1332% | 9.5093% |
| `WSV1_GROUNDING_THERMAL` | 8.385000 | 0.9552% | 0.7487% |
| `WSV1_SCADA_THERMAL` | 1.310000 | 0.1492% | 0.1170% |
| `WSV1_CIVIL_DIRECT` | 31.223744 | 3.5571% | 2.7878% |

Summary:

| Basis | USD/kWdc | Treatment |
|---|---:|---|
| Direct + civil | 688.205201 | Ten failure-unit values |
| Replacement support | 189.590501 | Allocate once; no curve |
| Physical replaceable | 877.795702 | Direct/civil + support |
| Excluded soft/nonphysical | 242.204298 | Outside physical DR |
| Installed CAPEX | 1120.000000 | Physical + excluded |
| Physical / installed ratio | 0.783746163 | Denominator bridge |

Value guardrails:

```text
- Reference cable value is treated as exposed; site profiles must split protected value.
- The mixed civil row is provisional; site schedules should split direct assets and consequences/support.
- No implicit value profile exists.
- The reference archetype is not a site appraisal.
```

---

## 10. Parameter tiers and update triggers

| Parameter/rule | Tier | Basis | Update trigger |
|---|---|---|---|
| Six FSim class semantics and frequency separation | T2 | Source product/method | Source-product contract change |
| Reference value basis | T2 | Governed public benchmark crosswalk | Benchmark/site valuation update |
| Mechanism and relative-vulnerability ordering | T3 | Field, test, guidance, and disposition evidence | Representative endpoint-matched evidence |
| All ten absolute class-to-DR tables | T4 | Explicit engineering judgment | Paired exposure, disposition, and cost data by unit |
| Support proportional-once allocation | T4 | Compatibility assumption | Claims/site support allocation evidence |
| Generic site-control credit | Withheld | Causal relevance but no transferable calibration | Qualified geometry/control effectiveness model |
| Curve-intrinsic spread | Not carried | No calibrated distribution | Governed uncertainty/elicitation model |

Per-unit update triggers are recorded in the
[ordinate CSV](../current/ORDINATE_TABLE_wildfire_solar__model_v1_0__docs_r3.csv).

Tier vocabulary:

```text
T2  public laboratory evidence, standard, method, or physics/value bridge
T3  engineering proxy or adjacent empirical/mechanism evidence
T4  explicit placeholder or expert judgment
```

---

## 11. Capability and reportability

### 11.1 Damage emit

```text
failure-unit scalar DR                         supported
scenario loss                                 supported with explicit value/exposure basis
curve-intrinsic spread                         not carried
populated emit mode                            scalar_mean
```

### 11.2 Downstream annual metrics

| Metric/object | Capability |
|---|---|
| Frequency-driven annual loss distribution | Consumer-supported if frequency/intensity coupling and caps are validated |
| EAL | Consumer-computable with prerequisites |
| PML | Consumer-computable from validated annual loss distribution |
| VaR/TVaR | Consumer-computable from validated annual loss distribution |
| Vulnerability-uncertainty distribution | Not supported; curve-intrinsic spread absent |

Prerequisites include source-native burn probability, one exact class or six-bin FLP vector, explicit values,
validated event sampling/aggregation, and caps/financial terms applied after physical loss.

Required limitation flags:

```text
SCREENING_ENGINEERING_PROXY
NOT_FIELD_CALIBRATED
NOT_CLAIMS_CALIBRATED
FSIM_CLASS_IS_NOT_LOCAL_HEAT_FLUX
CURVE_INTRINSIC_SPREAD_NOT_CARRIED
```

Cap binding is downstream-owned and fail-closed. A damage artifact cannot certify the consumer's annual
simulation, policy caps, or financial terms.

---

## 12. Complete worked reference event

This is an **illustrative class-template assembly**, not a site observation, appraisal, or universal value
allocation.

For `gte_6_lt_8_ft` / state 4 and the explicit 100 MWdc reference profile:

| Failure unit | State-4 DR | Value USD/kWdc | Loss at 100 MWdc |
|---|---:|---:|---:|
| Module | 0.12 | 291.214851 | $3.4946M |
| Racking | 0.02 | 109.989726 | $0.2200M |
| Foundation/pads | 0.003 | 31.124487 | $0.0093M |
| Inverter | 0.18 | 32.306366 | $0.5815M |
| Combiner | 0.20 | 6.826250 | $0.1365M |
| Exposed cable | 0.25 | 69.320112 | $1.7330M |
| MV equipment | 0.12 | 106.504664 | $1.2781M |
| Grounding | 0.015 | 8.385000 | $0.0126M |
| SCADA | 0.25 | 1.310000 | $0.0328M |
| Direct civil | 0.07 | 31.223744 | $0.2186M |
| **Direct + civil** | -- | **688.205201** | **$7.7169M** |
| Support allocated once | 0.1121306 | 189.590501 | $2.1259M |
| **Total physical loss** | -- | **877.795702** | **$9.8428M** |

Rounded values may differ by a few dollars from full-precision JSON arithmetic.

ASCII direct-loss contribution:

```text
modules          $3.495M  |########################
exposed cable    $1.733M  |############
MV equipment     $1.278M  |#########
inverter         $0.582M  |####
racking          $0.220M  |##
direct civil     $0.219M  |##
combiner         $0.137M  |#
SCADA            $0.033M  |
grounding        $0.013M  |
foundation       $0.009M  |
```

This demonstrates why the highest unit DR need not create the highest dollar contribution: value and DR are
different axes.

---

## 13. Validation status

Published validation date: 2026-07-10.

| Check | Result |
|---|---|
| Canonical JSON and bundle-v2 schema | PASS |
| Standalone/embedded capability-v2 equality | PASS |
| Index path/model/docs/schema/SHA | PASS |
| Failure-unit/curve/value coverage | PASS, 10 of 10 |
| Exact state domain and interpolation guard | PASS |
| State-0 boundary, monotonicity, `[0,1]` bounds | PASS |
| Effective source/control IDs | PASS, 41 unique IDs |
| Reference direct/physical/installed reconciliation | PASS |
| Failure-unit state KATs | 15 PASS |
| Aggregate value KATs | 7 PASS |
| Conditional-distribution KATs | 1 PASS |
| Contract/guardrail tests | 6 PASS |
| **Total wildfire tests** | **29 PASS** |
| Workbook sheets/formulas/QA/visual/XML integrity | PASS |

Published workbook SHA-256:

```text
55426dd2bfdf6e67cc9f8d0ac483bfd54082c678d8d89ee4cb431526c0126b05
```

The model passes because its approximation is explicit, bounded, tested, and correctly restricted—not
because the T4 ordinates are empirically calibrated.

---

## 14. Main sources and permitted inference

| Source | Main permitted use | Link |
|---|---|---|
| USFS FSim dataset/method | Conditional class definitions and BP/FLP separation | [USFS dataset DOI](https://doi.org/10.2737/RDS-2016-0034-3) |
| USFS field heat measurements | Local attack variability and rejection of universal converter | [USFS Treesearch](https://research.fs.usda.gov/treesearch/42185) |
| DOE/FEMP PV wildfire guidance | Multi-subsystem mechanisms, protection variables, inspection/rebuild endpoints | [DOE/FEMP](https://www.energy.gov/cmei/femp/solar-photovoltaic-hardening-resilience-wildfire) |
| NEMA GD 2 | Fire/heat-damaged electrical disposition logic | [NEMA PDF](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-2-2016-evaluating-fire-and-heat-damaged-electrical-equipment-guide.pdf) |
| Wildfire-affected PV field study | EL/IR degradation/monitoring endpoints; not numerical fragility | [KCI record](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003300065) |
| NREL/NLR benchmark | Reference cost/value basis | [NREL data](https://data.nrel.gov/submissions/304) |

A source is input, not universal authority. The exact claim/source role and transfer limits remain governed by
the canonical artifact, dossier, and preserved registers.

---

## 15. Reviewer checklist

```text
[ ] Exact cell/model/docs/schema/SHA tuple is pinned.
[ ] One and only one hazard input mode is supplied.
[ ] Class is recognized exactly; no midpoint/interpolation is introduced.
[ ] Burn probability remains outside the damage call.
[ ] Every returned DR maps to the same failure-unit value bucket.
[ ] Cable value is explicitly exposed or protected rather than double-discounted.
[ ] Mixed civil and support costs are not evaluated as interchangeable curves.
[ ] Scenario loss has an explicit reference or complete site value basis.
[ ] All screening/not-calibrated/spread flags travel with outputs.
[ ] Sensitivity scenarios are not described as statistical uncertainty.
[ ] Site controls receive no generic numeric credit.
[ ] Annual/tail metrics remain consumer-owned and pass their own cap/frequency gates.
```

---

## 16. Version history and non-change statement

| Layer | Current state |
|---|---|
| Semantic damage model | model v1.0 |
| Canonical runtime artifact | docs r3, bundle v2, capability v2 |
| Human basics documentation | docs r4 |
| Portable package baseline | library v2.5 |
| Runtime publication | Repository canonical; not in portable v2.5 |

Human docs r4 adds this three-file basics set. It does not change the model v1.0 class map, failure units,
ordinates, value profile, support allocation, capability, artifact SHA/schema, KATs, or output for identical
inputs.
