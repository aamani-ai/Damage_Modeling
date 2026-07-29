# Wildfire × Solar -- How the Model Is Built

**Use this page to understand the reasoning chain from curated evidence to the released screening package.**
For plain-language terminology and the introductory example, start with the [basics README](README.md). For
exact states, ordinates, values, errors, tests, and versions, use the [model reference](MODEL_REFERENCE.md).

```yaml
cell_id: wildfire_solar
cell_model_version: model v1.0
human_documentation_revision: docs r4
canonical_runtime_pin: wildfire_solar@model_v1_0__docs_r3
canonical_artifact_sha256: 598512fbe2f0a3c8db48df69fdb2cd00ca5e0cc8e7ef761555837a3d76d166d8
model_grade: screening_engineering_proxy
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

## Source hierarchy

```text
canonical runtime behavior
    ../current/wildfire_solar__model_v1_0__docs_r3__curve_artifact.json
    ../current/wildfire_solar__model_v1_0__docs_r3__capability.json
    ../current/known_answer_tests_wildfire_solar__model_v1_0__docs_r3.json

governed rationale and interface
    ../current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md
    ../current/wildfire_solar_damage_code_metadata_spec__model_v1_0__docs_r3.md

reader-friendly synthesis
    basics/README.md
    basics/HOW_THE_MODEL_IS_BUILT.md
    basics/MODEL_REFERENCE.md

preserved research/rejection history
    ../proposed/   model v0.1, zero runtime curves, superseded for execution
```

If this explanation conflicts with the canonical artifact, stop and reconcile the documentation. Do not
silently change runtime behavior to make the prose look consistent.

---

## The complete build path

```text
STAGE 0  QUESTION     What physical destruction is inside this cell?
STAGE 1  EVIDENCE     What does each public source actually support?
STAGE 2  GRAIN        What fails, and what value does each DR divide by?
STAGE 3  AXIS         What exact FSim state reaches the damage code?
STAGE 4  FORM         Why categorical tables rather than a continuous fire curve?
STAGE 5  ADJUSTMENTS  What selects value, conditions attack, or changes exposure?
STAGE 6  EMIT         What outputs and limitation flags may be populated?
STAGE 7  SHIP         What passed, what remains screening-only, and who owns tails?
```

The stages are sequential. A clean equation cannot repair a wrong hazard meaning, failure-unit grain, or
value denominator.

---

## Stage 0 -- The modeling question

### Decisive question

```text
Conditional on one source-native FSim flame-length class or distribution given burn,
what direct repair/replacement DR applies to each physical solar failure unit
in the generic reference screening archetype?
```

### Included boundary

```text
direct physical destruction from exogenous geographic wildfire burnover
ground-mounted utility-scale PV
same-occurrence repair/replacement cost
ten physical/direct-civil failure-unit records
```

### Excluded boundary

```text
equipment-origin fire                 battery-storage thermal runaway
smoke/ash production loss             cleaning and temporary derating
PSPS and ordinary outage              downtime and business interruption
post-fire erosion/landslide           environmental remediation
fire-service liability                insurance and financial terms
annual frequency and portfolio tails
```

The y-axis is physical destruction. An inspection endpoint matters only insofar as it leads to direct
repair/replacement of the same failure-unit value bucket.

---

## Stage 1 -- Evidence

### Decisive question

What may a source support without stretching it beyond its endpoint, grain, or units?

| Evidence family | What it supports | What it does **not** support |
|---|---|---|
| USFS FSim | Six conditional flame-length classes; burn probability separated from conditional severity | Local inverter heat flux, equipment duration, or class-specific economic DR |
| USFS field heat measurements | Large dependence on fuels, flame regime, convection, geometry, distance, and environment | One universal class-to-flux converter |
| DOE/FEMP PV wildfire guidance | Multi-subsystem burn mechanisms, rebuild/inspection endpoints, protection variables | Exact numerical class ordinates or generic mitigation discounts |
| PV thermal/fire tests and wildfire field diagnostics | Material/BOM sensitivity, latent degradation, EL/IR inspection endpoints | Utility-scale population fragility or replacement-cost calibration |
| NEMA fire/heat-damaged equipment guidance | Category-specific evaluation/replacement logic | A solar-site DR table |
| NREL/NLR cost benchmark crosswalk | Reference value denominator and subsystem allocation | Physical vulnerability or site appraisal value |

### Parameter evidence tiers

```text
T2  hazard semantics and reference value basis
T3  field materiality, mechanism, and diagnostic/endpoint evidence
T4  every absolute class-to-DR ordinate
T4  proportional-once support-cost allocation
```

This distinction is the core honesty rule. Public evidence supports the **direction, relative ordering,
mechanism, and endpoint logic**. It does not fit the exact ten-by-six ordinate table.

### Why a screening release was still permitted

The model was released because the approximation is:

```text
explicit       every ordinate is visible
bounded        every DR is in [0,1]
monotone       severity does not decrease with higher class
replaceable    one unit/state can be updated independently
tested         states, values, guards, and distributions have KATs
restricted     screening and not-calibrated flags are mandatory
```

Passing those conditions does not upgrade T4 parameters into empirical evidence.

---

## Stage 2 -- Grain and coverage

### Decisive question

What is the shallowest physical unit whose mechanism, response, value, or update evidence differs enough to
require separate treatment?

```text
wildfire_solar
|
+-- WSV1_MODULE_THERMAL         primary nonzero
+-- WSV1_RACKING_THERMAL        secondary nonzero
+-- WSV1_FOUNDATION_THERMAL     reviewed low nonzero
+-- WSV1_INVERTER_THERMAL       primary nonzero
+-- WSV1_COMBINER_THERMAL       primary nonzero
+-- WSV1_CABLE_EXPOSED          primary; exposed reference profile
+-- WSV1_MV_EQUIPMENT_THERMAL   primary nonzero
+-- WSV1_GROUNDING_THERMAL      reviewed low nonzero
+-- WSV1_SCADA_THERMAL          secondary nonzero
+-- WSV1_CIVIL_DIRECT           mixed direct-civil screening bucket
```

### Why not one whole-site curve?

Because polymer cable, electronics, modules, heavy electrical equipment, metallic racking, foundations, and
civil assets have different mechanisms, endpoints, values, and likely update evidence. A whole-site curve
would hide which value was touched and prevent one parameter from being replaced cleanly.

### Class template versus observed site

The ten-unit package is a reusable asset-class representation. It does not confirm the exact equipment,
routing, protection, quantity, or value at a real site. Site-specific use would need observed/as-built
inventory and explicit mappings. Unknown detail must remain unknown rather than inheriting class-template
precision.

### Coverage reconciliation

The ten runtime records cover the current reference direct/civil value subtotal. Support/fieldwork is not an
eleventh fragility curve; it is allocated once. Soft and nonphysical costs are outside the physical base.

Deferred or separate pathways include:

```text
ember-only recipient ignition
smoke/ash/soiling production effect
post-fire erosion and access consequences
battery fire and equipment-origin fire
```

---

## Stage 3 -- Axis

### Decisive question

What hazard quantity is actually supplied, and can it be connected to component response without inventing a
physical conversion?

### Selected source-native axis

```text
input mode A: one exact conditional_flame_length_class
input mode B: six conditional_flame_length_probability_by_bin values

internal lookup key: exact integer state 1..6
control state:       0 = no_event
```

Class mapping:

| FSim class ID | State |
|---|---:|
| `lt_2_ft` | 1 |
| `gte_2_lt_4_ft` | 2 |
| `gte_4_lt_6_ft` | 3 |
| `gte_6_lt_8_ft` | 4 |
| `gte_8_lt_12_ft` | 5 |
| `gte_12_ft` | 6 |

### Frequency separation

```text
burn probability                 Hazard frequency layer
conditional FLP/class            Damage-model severity input
conditional failure-unit DR      Damage-model output
annual aggregation and tails     Hazard consumer
```

`burn_probability` is prohibited in the damage call. Keeping it separate prevents a conditional DR from
being frequency-weighted twice.

### Rejected axis bridges

```text
FSim bin -> invented midpoint
midpoint flame length -> Byram fireline intensity in kW/m
fireline intensity -> equipment heat flux in kW/m2
heat flux -> generic duration
duration/flux -> logistic component loss
```

Each arrow would require a calibrated, domain-specific transfer model. The v0.1 audit found no such complete
chain. The open-ended sixth bin makes midpoint reconstruction especially misleading.

### Future higher-fidelity axis

A site-calibrated model could use component-zone flame contact, radiant/convective heat-flux histories,
duration, ember state, geometry, BOM, and transfer-model provenance. Those fields are an upgrade path, not
hidden inputs to the current class table.

---

## Stage 4 -- Curve form

### Decisive question

Does the mathematical representation match the information content of the hazard input and evidence?

### Selected form

```text
one exact categorical state table per failure unit
```

The bundle-v2 JSON uses the generic `piecewise_linear` record container, but the evaluation contract is:

```text
state lookup:                  exact_integer_only
interpolation between states: prohibited
extrapolation:                 prohibited
```

The numeric state index is only a key. A value such as `3.5` is invalid because there is no half-category
physical meaning in this contract.

### How absolute anchors were chosen

The engineering rules were:

1. State 1 remains near zero, with small nonzero response for exposed polymers/electronics.
2. State 3 marks a detectable multi-component transition without broad replacement.
3. State 4 represents material local replacement.
4. State 5 permits substantial replacement of exposed/electronic units.
5. State 6 permits major multi-subsystem loss but not automatic whole-site total loss.
6. No failure-unit ordinate exceeds `0.90` in the central table.
7. Predominantly metallic/buried structural buckets remain below electronics/polymers.

### Why not a smooth continuous curve?

| Alternative | Reason rejected for v1.0 |
|---|---|
| Continuous fireline-intensity logistic | No validated FSim-to-local-demand bridge |
| Midpoint-based class interpolation | Invents values, especially for the open-ended class |
| One aggregate plant curve | Hides failure units and value denominators |
| Generic low/base/high distributions | No sample or elicitation protocol to assign probabilities |
| Automatic zero for metal/concrete | Ignores localized severe damage and inspection/replacement |

The exact ordinate table and ASCII plots are in the [model reference](MODEL_REFERENCE.md#4-canonical-failure-unit-state-tables).

---

## Stage 5 -- Selectors, conditioners, exposure, and value

### Decisive question

Does a field select a stable archetype, describe event-time state, change value touched, or change intrinsic
response? These roles must not be blended.

### Runtime selector logic

| Field | Role | Current numerical effect |
|---|---|---|
| `model_grade` | Declares released central screening table | No alternate grade exists in v1.0 |
| `value_profile_id` | Selects reference value or requires complete site values | Required only for scenario loss; no implicit default |

### Conditioner logic

```text
vegetation_management_state
barrier_state
suppression_system_state
firefighter_access_state
deenergization_state
```

All are relevant metadata, but their numeric effect is `none_in_model_v1_0`. The default policy is
`no_credit` because guidance does not calibrate universal modifiers.

### Exposure/value logic

The central class ordinate integrates unresolved local attack and population heterogeneity for the reference
archetype. A site loss still requires either:

```text
explicit reference profile WILDFIRE_SOLAR_REFERENCE_100MWDC_V1
or
complete site_failure_unit_values_usd for all ten failure units
```

The reference cable row is treated as exposed. Verified buried/protected value must be removed in the site
value profile. It must not receive both a value reduction and a curve discount.

### Assembly

For state `s`:

```text
C_direct(s)   = sum_u [ DR_u(s) x V_u ]
DR_direct(s)  = C_direct(s) / sum_u(V_u)
C_support(s)  = DR_direct(s) x V_support
DR_physical   = [C_direct(s) + C_support(s)] / V_physical
DR_installed  = DR_physical x V_physical / V_installed
```

In the reference profile, proportional support allocation makes `DR_physical = DR_direct`. This is a T4
compatibility rule, not evidence that every mobilization/support cost scales linearly.

---

## Stage 6 -- Emit

### Decisive question

What can the damage code populate without implying unsupported precision?

### Event-class mode

For each of ten failure units:

```yaml
failure_unit_id:
screening_fire_state_id:
conditional_failure_unit_damage_ratio:
evidence_tier: T4_placeholder_or_expert_judgment
metadata_flags:
  - SCREENING_ENGINEERING_PROXY
  - NOT_FIELD_CALIBRATED
```

### Distribution mode

```text
E[DR_u | burn] = sum_s [ FLP_s x DR_u(s) ]
```

The emit also carries the six weights. This is a conditional severity average, not annual expected loss.

### Optional scenario assembly

With an explicit value basis, the emit may add direct/civil, physical-base, installed-CAPEX, support-allocation,
and value-profile fields.

### Capability v2 interpretation

```text
failure-unit scalar DR                         supported
scenario loss with explicit value/exposure     supported
curve-intrinsic spread                         not carried
populated curve emit mode                      scalar_mean
frequency-driven annual metrics                consumer-computable with prerequisites
vulnerability uncertainty distribution         not supported
```

Required limitations include:

```text
SCREENING_ENGINEERING_PROXY
NOT_FIELD_CALIBRATED
NOT_CLAIMS_CALIBRATED
FSIM_CLASS_IS_NOT_LOCAL_HEAT_FLUX
CURVE_INTRINSIC_SPREAD_NOT_CARRIED
```

---

## Stage 7 -- SHIP and consumer boundary

### What passed

```text
bundle-v2 and capability-v2 schema/semantic checks
artifact index path/model/docs/schema/SHA pin
ten-of-ten failure-unit/curve/value reconciliation
state 0 plus exact states 1..6
monotonicity and [0,1] bounds
41 unique source/control IDs resolved
reference value reconciliation
29 executable wildfire KATs
workbook formula, QA, aggregate, and visual checks
```

### What the 29 KATs cover

```text
15  failure-unit exact-state results
 7  aggregate reference-profile results
 1  six-bin FLP distribution result
 6  contract and fail-closed behaviors
```

### What did not become supported

```text
site appraisal or claims settlement
field- or claims-calibrated fragility
local heat-flux or duration inference
generic adaptation/mitigation credit
curve-intrinsic confidence interval or probability distribution
business interruption, smoke/ash, PSPS, or equipment-origin fire
```

### Consumer ownership

Hazard owns burn frequency, occurrence sampling, annual aggregation, financial terms, caps, portfolio
accumulation, EAL, PML, VaR, and TVaR. It may compute frequency-driven annual metrics only after frequency,
class sampling, value basis, cap binding, and aggregation are validated. Damage Modeling's deterministic
screening curve does not validate those consumer steps by existing.

### Canonical migration rule

The consumer must retire the legacy midpoint/Byram/logistic path, pin the complete model/docs/schema/SHA
tuple, independently pass the wildfire KATs, and preserve every limitation flag. See the
[Hazard migration handoff](../../../contracts/hazard_handoff/wildfire_solar_model_v1_0_hazard_migration.md).

---

## Upgrade triggers

The model should change only when new evidence changes a governed parameter, coverage rule, or contract. Main
triggers are:

```text
local fire exposure paired with affected and unaffected component disposition
claims/work-order cost at the same failure-unit grain
representative utility-scale external-fire tests and BOMs
routing-specific exposed/buried cable data
validated FSim-to-site/local-attack transfer model
exogenous-wildfire claims separated from equipment-origin fire
project-specific value and support allocation adopted as a default
qualified site-control effectiveness evidence
```

A documentation clarification alone is `DOCS_ONLY`; it does not justify changing an ordinate.

---

## Cross-reference map

| Question | Governing source |
|---|---|
| Exact runtime records and parameters | [Canonical artifact](../current/wildfire_solar__model_v1_0__docs_r3__curve_artifact.json) |
| Capability semantics | [Standalone capability](../current/wildfire_solar__model_v1_0__docs_r3__capability.json) |
| Executable examples/guards | [Known-answer tests](../current/known_answer_tests_wildfire_solar__model_v1_0__docs_r3.json) |
| Derivation and evidence reasoning | [Derivation dossier](../current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md) |
| Input/output and rejection rules | [Metadata specification](../current/wildfire_solar_damage_code_metadata_spec__model_v1_0__docs_r3.md) |
| Exact human-readable ordinates | [Ordinate CSV](../current/ORDINATE_TABLE_wildfire_solar__model_v1_0__docs_r3.csv) |
| Exact value linkage | [Value-linkage CSV](../current/VALUE_LINKAGE_wildfire_solar__model_v1_0__docs_r3.csv) |
| Release checks and hashes | [Validation report](../current/VALIDATION_REPORT_wildfire_solar__model_v1_0__docs_r3.md) |
| Current pin/SHA | [Artifact index](../../../contracts/machine_readable_artifact_index.json) |
| Rejected research alternatives | [v0.1 research scaffold](../proposed/README_wildfire_solar__model_v0_1__docs_r1.md) |

---

## Documentation-only non-change statement

This three-file basics set is the human docs r4 explanation of the existing model v1.0/runtime docs r3
artifact. It does not change states, ordinates, selectors, conditioners, exposure, value assembly,
capability, schemas, KATs, or consumer output for identical inputs.
