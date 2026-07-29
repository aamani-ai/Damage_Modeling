# Hail × Solar -- How the Model Is Built

**Use this page to understand the reasoning chain from curated evidence to the runtime damage-code package.**
For terminology and an intuitive example, start with the [basics README](README.md). For exact fields,
parameters, known-answer tests, versions, and sources, use the [model reference](MODEL_REFERENCE.md).

```yaml
cell_id: hail_solar
basics_set_revision: r1
cell_model_version: model v1.0
human_documentation_revision: docs r8
canonical_runtime_documentation_revision: docs r7
canonical_runtime_pin: hail_solar@model_v1_0__docs_r7
canonical_artifact_sha256: 8c52f3442eb606f55aa0502fbb2738df70076f8a181de463c029061020b3cf32
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

## Source hierarchy

```text
canonical runtime behavior
    ../current/hail_solar__model_v1_0__docs_r7__curve_artifact.json
    ../current/known_answer_tests_hail_solar__model_v1_0__docs_r7.json

governed rationale and interface
    ../current/hail_solar_curve_derivation_dossier_v1_3.md
    ../current/damage_code_metadata_spec_hail_solar_v1_3.md

reader-friendly synthesis
    basics/README.md
    basics/HOW_THE_MODEL_IS_BUILT.md
    basics/MODEL_REFERENCE.md
```

The `v1_3` labels on human source files are legacy package/file revisions. The semantic damage model is
`model v1.0`, and the repository-current runtime contract is docs r7. If this explanation conflicts with the
canonical artifact or KAT fixture, stop and reconcile the documentation; do not silently change runtime
behavior to fit the prose.

---

## The complete build path

```text
STAGE 0  QUESTION     What physical loss are we modeling?
STAGE 1  EVIDENCE     What may each source support?
STAGE 2  GRAIN        What actually fails, at what unit?
STAGE 3  AXIS         What event intensity indexes the curve?
STAGE 4  FORM         What mathematical representation fits the evidence?
STAGE 5  ADJUSTMENTS  What selects, conditions, or exposes the curve/value?
STAGE 6  EMIT         What may the damage cell honestly return?
STAGE 7  SHIP         What exact package does the consumer pin?
```

---

## Stage 0 -- The modeling question

### Decisive question

> What direct physical replacement loss is being modeled, and why is a whole-plant hail curve wrong?

The current cell models replacement damage to the **PV-module glass/cell failure unit** for a specified hail
intensity. It does not assign the same response to inverters, foundations, roads, or the entire installed-cost
base.

```text
NOT: hail diameter -> whole solar plant DR

YES: hail diameter + module construction + event-time stow
       -> module glass/cell replacement DR
       -> explicit exposure/value assembly
```

The modeled y-axis is:

```text
failure_unit_damage_ratio
    = direct repair/replacement cost for the exposed PV-module glass/cell unit
      divided by that failure unit's replacement value
```

Public hail-stress evidence reports glass breakage. In v1.0, glass-breakage probability is used as the best
public proxy for module replacement DR. That approximation excludes latent cell cracking that does not lead
to physical replacement and may not match every insurer/OEM repair policy.

### Boundary

| Included | Downstream or excluded |
|---|---|
| Direct PV-module glass/cell replacement DR | Hail-event frequency and annual occurrence sampling |
| Fixed module-archetype selection | Site-hit probability and storm-track generation |
| Event-time stow conditioning | Business interruption, derating, and downtime |
| Array exposure and explicit value-profile loss views | Insurance terms and portfolio accumulation |
| Provenance and limitation flags | EAL/PML/VaR/TVaR calculation |

Wind-driven hail is a documented contact-intensity/stow-interaction seam. It does not create a second current
axis or a hidden modifier.

---

## Stage 1 -- Evidence

### Decisive question

> What does each source authorize, and what does it explicitly not authorize?

The cell combines evidence classes with different jobs.

| Evidence class/source | Supports | Does not support |
|---|---|---|
| NOAA Storm Events / NOAA-NWS MESH | Operational hail-size axis, reporting units, MESH meaning | Module damage parameters |
| IEC 61215 hail table through DOE/FEMP | Qualification boundary; diameter-to-mass/velocity bridge | A field-loss curve for all modules |
| PVEL/Kiwa Hail Stress Sequence | Public aggregate glass-breakage anchors by module construction | Site-specific claims replacement policy |
| NREL/PVEL field-performance context | Glass breakage versus latent cracking/performance caveat | Universal module replacement DR percentages |
| VDE and DOE/FEMP stow guidance | Direction of high-angle/stow benefit | Universal `+8 mm` or `0.90` magnitudes |
| FTC Solar high-angle stow release | Operational feasibility of high-angle stow | Generic vulnerability credit |
| VDE wind-driven hail material | Wind vector and orientation can change impact direction/energy | A current calibrated normal-energy conditioner |

### From source statements to model parameters

```text
source-native facts
    |
    +-- NOAA/MESH size semantics ----------------> choose diameter axis
    |
    +-- IEC qualification table ----------------> near-zero interpreted anchor
    |                                             + diameter/energy bridge
    |
    +-- PVEL/Kiwa breakage aggregates ----------> curve anchors by archetype
    |
    +-- field/operations guidance --------------> caveats and adjustment direction
    |
    `-- no matched claims population -----------> no curve-intrinsic spread
```

The default curve uses two interpreted anchors:

| Diameter | Replacement/breakage proxy | Evidence role |
|---:|---:|---|
| 25 mm | 0.01 | IEC baseline treated as a near-zero replacement anchor |
| 50 mm | 0.39 | PVEL public glass/backsheet aggregate breakage anchor |

The fragile curve uses five public aggregate points in logit-space. The hardened curve uses only a 25 mm
near-zero assumption and a 45 mm / 0.07 public result, so its tail is explicitly lower-confidence.

### Evidence-to-parameter conclusion

```text
fragile/default unstowed D50 and k      -> T2 public lab/standard/physics
hardened D50 and k                      -> T3 engineering/adjacent empirical
stowed +8 mm D50 shift                  -> T4 placeholder
stowed max_DR 0.90                      -> T4 placeholder
direct module-hardware value profile    -> governed reference arithmetic
Hazard-compatible support allocation    -> T4 compatibility scenario
```

No T1 private claims calibration is present. See the exact
[parameter tier table](MODEL_REFERENCE.md#7-parameter-tier-and-update-trigger-register).

---

## Stage 2 -- Grain and coverage

### Decisive question

> Which physical subject has the direct impact mechanism, evidence, and non-overlapping value denominator?

```text
solar generation asset
|
+-- PV_ARRAY
|   `-- PV_MODULE
|       `-- PV_MODULE_GLASS_CELL          primary nonzero
|
+-- MOUNTING / TRACKER                    conditioner-only for stow
|
+-- SCADA / MET_STATION                   optional secondary
|
+-- INVERTER_SYSTEM / SUBSTATION          reviewed DR≈0 direct hail v1
|
`-- CIVIL / FOUNDATION / DRAINAGE         reviewed DR≈0 direct hail v1
```

### Repository-current runtime coverage

The canonical artifact serializes one primary failure unit:

| ID | Subsystem | Component | Treatment | Value bucket |
|---|---|---|---|---|
| `PV_MODULE_GLASS_CELL` | `PV_ARRAY` | `PV_MODULE` | `primary_nonzero` | `PV_ARRAY_MODULE_EXPOSED` |

The direct-hardware physical-base and installed-capex shares on that failure-unit record are reference value
links, not proof that all module value at a real site is exposed.

### Coverage reconciliation

| Subject | Current disposition | Reason |
|---|---|---|
| Tracker/mounting steel | Conditioner-only for stow; direct curve not carried | Position changes module impact; direct steel hail loss is secondary |
| Racking structure | Secondary/open | No material public direct-hail curve in v1 |
| SCADA/met instruments | Optional secondary | Exposed but small and not separately serialized |
| Inverter/substation | Direct-hail DR≈0 | Enclosed internals do not share module-glass mechanism |
| Civil/foundation/drainage | Direct-hail DR≈0 | Direct impact is not the ordinary replacement mechanism |

This prevents two errors:

```text
1. applying module DR to whole-plant TIV;
2. inventing weak direct-hail curves merely because other subsystems exist.
```

---

## Stage 3 -- Axis

### Decisive question

> What hazard quantity is available operationally and remains physically interpretable?

The selected axis is:

```text
id:          HAIL_DIAMETER_MESH_EQUIV
field:       mesh_diameter_mm
unit:        mm
source unit: mm or in
range:       0 to 100 mm
policy:      clamp_or_warn
```

### Optional physics bridge

```text
E_proxy(D) = 0.5 × m(D) × v(D)²
```

The dossier fits these IEC-table reference relationships:

```text
mass_g(D)       = 0.0005290357 × D^2.973997
velocity_mps(D) = 4.812461 × D^0.486643
```

| Diameter mm | Mass g | Velocity m/s |
|---:|---:|---:|
| 25 | 7.54 | 23.0 |
| 35 | 20.7 | 27.2 |
| 45 | 43.9 | 30.7 |
| 55 | 80.2 | 33.9 |
| 65 | 132 | 36.7 |
| 76 | 203 | 39.5 |

The bridge is a vertical-fall/reference interpretation. It is not a complete wind-driven contact model.

### Rejected alternatives

| Candidate | Decision | Why |
|---|---|---|
| Whole-event kinetic-energy flux | Rejected for v1 | Operational products do not supply stone density/flux consistently. |
| Hail frequency/return period | Rejected as curve x-axis | Frequency belongs downstream and is not impact severity. |
| One certification pass/fail rating | Rejected as complete axis | It gives a qualification boundary, not a continuous field-loss response. |
| Wind speed as a replacement hail axis | Rejected | Wind is a future contact-intensity conditioner/bridge, not hail size. |
| MESH-equivalent diameter | Accepted | Available operationally and aligned with public lab test diameters. |

---

## Stage 4 -- Curve form

### Decisive question

> What bounded form represents threshold-like glass breakage without overfitting sparse public anchors?

The current model uses:

```text
DR(D) = max_DR / [1 + exp(-k × (D - D50))]
```

| Parameter | Meaning |
|---|---|
| `D` | MESH-equivalent hail diameter, mm |
| `D50` | Diameter at half of maximum replacement DR |
| `k` | Transition steepness, 1/mm |
| `max_DR` | Failure-unit cap; `1.0` for unstowed archetypes |

### How the parameters are fit

For a two-anchor curve:

```text
logit(p) = ln[p/(1-p)]

k   = [logit(p2)-logit(p1)] / (D2-D1)
D50 = D1 - logit(p1)/k
```

For more than two points, the fragile curve is fit by least squares in logit space:

```text
logit(p_i) ≈ k × D_i - k × D50
```

### Alternatives

| Form | Decision | Reason |
|---|---|---|
| Hard step | Rejected | Certification pass/fail would create an unrealistic discontinuity. |
| Piecewise linear | Rejected for runtime | Sparse anchors create artificial kinks and unstable extrapolation. |
| Bounded logistic | Accepted | Monotone, bounded, interpretable, and suitable for sparse threshold-like evidence. |
| Damage-state ensemble | Deferred | Public evidence does not support multiple economic states/probabilities. |
| Claims empirical curve | Preferred future | No matched claims calibration exists in the current package. |

```text
DR
1.0 |                         fragile ______ default ___
0.8 |                    ____/          ____/       ___ hardened
0.6 |                ___/           ___/        ___/
0.4 |             __/           ___/        ___/
0.2 |         ___/         ____/       _____/
0.0 +----+---------+---------+---------+---------- diameter
     25  35        50        65        75       mm
```

This plot is schematic. Use the exact [parameter and KAT tables](MODEL_REFERENCE.md#3-canonical-curves-and-known-ordinates).

---

## Stage 5 -- Adjustments

### Decisive question

> What selects a curve, changes event-time response, or scales the touched value?

| Concept | Hail examples | Correct effect |
|---|---|---|
| **Selector** | Module archetype, glass thickness/construction, exact hail-test rating | Choose one supported curve record or exact future override. |
| **Conditioner** | Stow state and `P(stowed)` | Select/blend the current stowed transformation. |
| **Exposure** | `array_exposure_fraction` | Scale the module value reached by the swath. |
| **Value** | Named value profile or site module value | Supply a labeled asset-loss denominator. |
| **Deferred bridge** | Event wind vector + tracker orientation | Future contact-normal energy calculation; no current numeric effect. |

### Selector rule

```text
fragile_thin_glass_glass           -> HAIL_SOLAR_FRAGILE_THIN_GG
default_3_2mm_glass_backsheet      -> HAIL_SOLAR_DEFAULT_3P2_GBS
hail_hardened_thicker_glass        -> HAIL_SOLAR_HARDENED_THICKER
missing archetype                  -> default + DEFAULT_SELECTOR_USED
unknown unregistered archetype     -> reject
```

The hardened curve requires supporting construction/test evidence. Marketing language alone is insufficient.

### Conditioner rule

```text
DR_stowed(D)
  = 0.90 × logistic(D; D50+8 mm, k)

DR_conditioned(D)
  = P(stowed) × DR_stowed(D)
  + [1-P(stowed)] × DR_unstowed(D)
```

The direction of stow benefit is source-supported. Both numeric adjustment values are T4 placeholders.

### Exposure and value rule

```text
physical_base_loss_fraction
  = module_DR × array_exposure_fraction
    × selected_profile.failure_unit_share_physical_base

installed_capex_loss_fraction
  = module_DR × array_exposure_fraction
    × selected_profile.failure_unit_share_installed_capex
```

No value profile is selected implicitly. The older generic `f_hail_material_share` examples are deprecated
because they double-concentrated value after the bucket was already narrowed to module hardware.

---

## Stage 6 -- Emit

### Decisive question

> What may this cell honestly return, and what must a downstream consumer supply?

```text
event intensity + module selector + stow conditioner
    -> curve ID
    -> deterministic module failure-unit DR
    -> optional explicit-profile scenario loss
    -> versions, flags, and limitations
```

### Capability v2 interpretation

| Item | Current status |
|---|---|
| Failure-unit scalar DR | Supported |
| Scenario loss | Supported with explicit value and exposure basis |
| Intrinsic vulnerability spread | Not carried |
| Populated emit mode | `scalar_mean` |
| Frequency-driven annual distribution | Downstream only with sampled frequency/intensity/coupling and caps |
| EAL | Consumer-computable with prerequisites |
| PML/VaR/TVaR | Consumer-computable only from validated annual loss distribution |

Required downstream limitation flags include:

```text
CURVE_INTRINSIC_SPREAD_NOT_CARRIED
TAIL_CONDITIONAL_ON_DETERMINISTIC_VULNERABILITY
STOW_ADJUSTMENT_PLACEHOLDER_IF_USED
```

The damage artifact does not create an annual loss distribution from one mean loss. Cap binding remains
consumer-owned and fail-closed.

---

## Stage 7 -- Ship

### Decisive question

> What exact object does the consumer receive and pin?

```text
cell:                 hail_solar
damage code:          HAIL_SOLAR_PV_MODULE_V1
semantic model:       model v1.0
runtime docs:         docs r7
artifact schema:      damage_curve_record_bundle.v2
capability schema:    capability_declaration.v2
consumer pin:         hail_solar@model_v1_0__docs_r7
SHA-256:              8c52f3442eb606f55aa0502fbb2738df70076f8a181de463c029061020b3cf32
known-answer fixture: known_answer_tests_hail_solar__model_v1_0__docs_r7.json
```

This basics set is human docs r8 without republishing the runtime artifact. Runtime consumers remain on the
exact docs-r7 tuple until a deliberate contract release occurs.

```text
poll artifact index
    -> compare cell + model + runtime docs + schemas + SHA
    -> validate bundle v2
    -> run 11 runtime + 2 selector + 4 value KATs
    -> select named value profile or provide site value basis
    -> evaluate module DR and assemble loss downstream
```

---

## Cross-reference map

| Question | Friendly explanation | Exact/governed detail |
|---|---|---|
| What is MESH? | [Basics §3](README.md#3-the-physical-picture) | [Dossier §2](../current/hail_solar_curve_derivation_dossier_v1_3.md#2-x-axis-decision-hail-diameter-as-operational-axis-kinetic-energy-as-bridge) |
| What fails? | [Stage 2](#stage-2----grain-and-coverage) | [Artifact `failure_units`](../current/hail_solar__model_v1_0__docs_r7__curve_artifact.json) |
| Where did the parameters come from? | [Stage 1](#stage-1----evidence) | [Dossier §§7--9](../current/hail_solar_curve_derivation_dossier_v1_3.md#7-default-32-mm-glassbacksheet-curve-derivation) |
| What are the exact curves? | [Model reference §3](MODEL_REFERENCE.md#3-canonical-curves-and-known-ordinates) | [Artifact `curve_records`](../current/hail_solar__model_v1_0__docs_r7__curve_artifact.json) |
| How does stow work? | [Stage 5](#stage-5----adjustments) | [Dossier §13](../current/hail_solar_curve_derivation_dossier_v1_3.md#13-stow-mode-stow-state-and-probability-of-stow) |
| What fields are needed? | [Model reference §5](MODEL_REFERENCE.md#5-input-and-output-field-dictionary) | [Metadata specification](../current/damage_code_metadata_spec_hail_solar_v1_3.md) |
| What may consumers report? | [Stage 6](#stage-6----emit) | [Hail consumer contract](../../../contracts/hazard_handoff/hail_solar_consumer_contract_v2.md) |
| What remains uncertain? | [Model reference §7](MODEL_REFERENCE.md#7-parameter-tier-and-update-trigger-register) | [Dossier §17](../current/hail_solar_curve_derivation_dossier_v1_3.md#17-what-would-make-v2-better) |

---

## Documentation-only non-change statement

This page explains the existing model. It does not alter failure-unit coverage, diameter-axis semantics,
curve form, D50/k/max_DR values, selector behavior, stow formula, exposure logic, value profiles,
artifact/schema, or output meanings. Identical inputs still produce identical runtime DRs under
`hail_solar` model v1.0/docs r7.
