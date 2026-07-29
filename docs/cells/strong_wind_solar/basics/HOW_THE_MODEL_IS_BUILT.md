# Strong Wind × Solar -- How the Model Is Built

This page follows the reasoning chain from physical mechanism to the repository-current runtime package. It
also explains why a separate model-v2 research package exists without mixing that proposal into the current
calculation.

```yaml
cell_id: strong_wind_solar
basics_set_revision: r1
cell_model_version: model v1.0
human_documentation_revision: docs r4
canonical_runtime_documentation_revision: docs r3
canonical_runtime_pin: strong_wind_solar@model_v1_0__docs_r3
canonical_artifact_sha256: 832f47d69372ec54723a61b8a956addccef07bb39338c3ec99907e116f1855ca
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

## Source hierarchy

Use the sources in this order when two descriptions differ:

```text
1. Canonical runtime artifact (current model behavior)
   ../current/strong_wind_solar__model_v1_0__docs_r3__curve_artifact.json

2. Governed current-v1 derivation and interface documents
   ../current/strong_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md
   ../current/strong_wind_solar_damage_code_metadata_spec__model_v1_0__docs_r1.md

3. Noncanonical research package (possible future architecture only)
   ../proposed/README_strong_wind_solar__model_v2_0__docs_r1.md
   ../proposed/strong_wind_solar__model_v2_0__docs_r1__curve_artifact.json

4. These basics pages (reader-friendly synthesis)
```

The current JSON determines v1 runtime behavior. The proposal is deliberately isolated under `proposed/`;
it cannot be used as a silent correction, fallback, or replacement for current v1.

All numerical site and event values below are illustrative class-template inputs unless explicitly labeled
as governed runtime parameters.

---

## The complete build path

```text
STAGE 0       STAGE 1       STAGE 2       STAGE 3       STAGE 4
question  --> evidence  --> grain     --> axis      --> curve form
                                                            |
                                                            v
STAGE 7       STAGE 6       STAGE 5
SHIP      <-- emit      <-- adjustments + exposure + value
```

The order matters. A smooth curve does not rescue a mixed hazard pathway, an ambiguous wind basis, an
overlapping failure unit, or an incorrect value denominator.

---

## Stage 0 -- The modeling question

### Decisive question

```text
For one occurrence-level wind event:

what direct physical repair/replacement fraction occurs
for each explicitly defined solar failure unit,
given a 3-second gust, design reference, event-time state,
local demand treatment, value, and exposure?
```

Current v1 represents a broad conventional wind-loading pathway:

```text
3-second gust
    |
    v
dynamic pressure / uplift / torsion / attachment demand
    |
    +--> tracker structure
    +--> racking/support structure
    +--> module attachment
    +--> foundation uplift
    `--> exposed SCADA
```

The current dossier discusses straight-line severe wind, hurricane wind, and derecho-like gusts together.
Tornado and debris remain deferred. The proposed v2 would narrow the pathway to locally resolved
straight-line convective wind, but that narrowing is not current runtime behavior.

### Boundary

The cell owns:

- hazard intensity to failure-unit physical damage ratio;
- the v1 failure-unit records, selectors, conditioners, and exposure fields;
- provenance and parameter-tier statements; and
- capability limits for downstream use.

The cell does not own:

- event frequency, EAL, PML, VaR, or TVaR;
- business interruption, downtime, derating, or revenue loss;
- insurance terms or portfolio accumulation;
- tornado/debris damage;
- project-specific structural capacity or geotechnical certification; or
- a universal whole-plant wind damage ratio.

```text
physical destruction here                    downstream or separate stage
-------------------------                    ----------------------------
clamp release / module loss                  lost generation
tracker/racking deformation                  downtime and repair duration
foundation uplift repair                     insurance recovery
exposed instrument replacement               annual/tail risk metrics
```

---

## Stage 1 -- Evidence

### Decisive question

```text
Which sources support:
  (a) the physical mechanism,
  (b) the axis and curve form,
  (c) a numerical parameter,
  (d) a value or exposure rule?
```

| Evidence family | What it supports | What it does not establish |
|---|---|---|
| DOE/FEMP severe-weather PV guidance | Failure mechanisms, hardening actions, stow context | Generic numerical fragility |
| NREL storm-resilience work | Clamps, fasteners, bracing, liberation and cascade mechanisms | A wind-speed-to-DR table |
| CPP PV wind-load work | Wind loading, dynamic effects, axis rationale | Claims-calibrated ordinates |
| CPP tracker torsion work | Aeroelastic/torsional behavior and importance of attained state | Universal stow credit |
| DuraMAT/PVade research | Need for aeroelastic modeling and validation | A production-ready generic curve |
| SEAC/ASCE summaries and standards | Design/scoping vocabulary and load context | Observed damage probability at a site |

### From source statements to model parameters

```text
source says: wind pressure changes approximately with V squared
    -> supports speed-squared physics bridge (T2)

source says: stow and tracker state affect aerodynamic response
    -> supports conditioner direction/mechanism
    -> does NOT calibrate 0.80 or 1.25 universally

source documents clamp, fastener, racking and uplift failures
    -> supports separate failure units
    -> does NOT calibrate R0, R50, k or max_DR

source provides a solar cost breakdown
    -> supports a transparent reference value crosswalk
    -> does NOT prove an individual site's value split
```

### Evidence-to-parameter conclusion

Current v1 uses this evidence grade:

| Parameter family | Tier | Meaning |
|---|---|---|
| `R_eff=(V/Vdesign)^2` physics bridge | T2 | Public physics/engineering support |
| `R0`, `R50`, `k`, `max_DR` | T4 | Mechanism-informed engineering fit |
| Stow multipliers `0.80` and `1.25` | T4 | Direction supported; magnitude uncalibrated |
| Default failure-unit value shares | T4 | Illustrative replacement until site values exist |
| Zone multiplier supplied by a user/adapter | T4 unless independently qualified | Local-demand assumption, not intrinsic curve evidence |

```text
public mechanism evidence  !=  claims calibration
design standard            !=  damage curve
engineering fit            !=  observed probability
```

---

## Stage 2 -- Grain and coverage

### Decisive question

```text
What fails, and what same-unit replacement value is the DR allowed to multiply?
```

Current v1 uses five runtime records:

```text
strong_wind_solar v1
|
+-- SWS_TRACKER_STRUCT
|      tracker/torque-tube/drive-row structural bucket
|
+-- SWS_RACKING_STRUCT
|      racking/support structural bucket
|
+-- SWS_MODULE_ATTACH
|      module clamp, fastener, retention and detachment bucket
|
+-- SWS_FOUNDATION_UPLIFT
|      generic foundation/pile support bucket
|
`-- SWS_SCADA_EXPOSED
       exposed instrument/monitoring secondary bucket
```

### Repository-current runtime coverage

| Failure-unit ID | Role | Runtime treatment | Important caveat |
|---|---|---|---|
| `SWS_TRACKER_STRUCT` | Primary | Nonzero curve | Tracker-specific qualification is not encoded |
| `SWS_RACKING_STRUCT` | Primary | Nonzero curve | Architecture-exclusive routing is incomplete |
| `SWS_MODULE_ATTACH` | Primary | Nonzero curve | Clamp/fastener variants are not parameterized |
| `SWS_FOUNDATION_UPLIFT` | Primary | Nonzero curve | Generic T4 proxy, not geotechnical analysis |
| `SWS_SCADA_EXPOSED` | Secondary | Nonzero curve | Exposed location/value grain remains generic |

### Coverage reconciliation

Current v1 sums independent-looking failure-unit contributions. In reality, structural failure, module
detachment, and module salvage can be dependent.

```text
racking/tracker deformation
       |
       +--> structural repair
       `--> possible module release or nonsalvage

naive sum can double count shared disposition
```

Therefore current users must keep value buckets non-overlapping and flag the dependency seam. The proposed
v2 responds by routing architecture-specific module and structure units and by showing explicit salvage
bounds. That research response is not retroactively part of v1.

---

## Stage 3 -- Axis

### Decisive question

```text
What intensity measure best represents the demand that reaches the failure unit?
```

### Current operational input

```text
axis ID:     SWS_GUST_3S_ARRAY_HEIGHT
input:       gust_3s_mph
meaning:     3-second gust at array/tracker height
range:       0 to 200 mph
policy:      warn or clamp outside the supported range
native axis: effective demand ratio R_eff
```

Wind speed must keep its averaging time, height, unit, location, direction context, and hazard pathway. A
10 m gust, hourly mean, one-minute wind, and array-height 3-second gust are different measurements.

### Current physics bridge

```text
dynamic pressure q = 0.5 x air_density x V^2

base demand ratio = (event 3-second gust / design 3-second gust)^2

R_eff = base demand ratio x demand multipliers
```

For current v1, the demand multipliers can include the stow-state multiplier and a local zone multiplier.

Example:

```text
V_event   = 120 mph
V_design  = 120 mph
stow mix  = 0.9125
zone      = 1.15

R_eff = (120/120)^2 x 0.9125 x 1.15
      = 1.049375
```

`R_eff` is a dimensionless demand proxy. It is neither a damage ratio nor a probability.

### Why height/reference reconciliation matters

```text
source product at 10 m
        |
        | named height/profile conversion
        v
array-height 3-second gust
        |
        | comparable asset design basis
        v
speed ratio and R_eff
```

Do not silently combine a regional design wind, a weather-station gust, and an OEM qualification speed.
They may have different height, terrain, averaging, direction, and load conventions.

### Rejected alternatives for current v1

| Alternative | Why it is not the selected current axis |
|---|---|
| Raw wind speed alone | Ignores the asset's design reference |
| Linear `V/Vdesign` demand | Wind pressure is approximately proportional to speed squared |
| EF tornado rating | Damage-derived tornado category mixes a different pathway |
| Whole-site footprint-average gust | Can hide local downburst and array-zone variation |
| Unlabeled design-code wind | Basis may not match event averaging/height/terrain |

### Separate proposed-v2 axis response

The noncanonical proposal does not reuse one generic `R_eff` axis:

```text
fixed tilt: event/design comparable net-pressure-demand ratio
             or named-bridge (array-height gust/design gust)^2 proxy

tracker:    exact local tracker-normal 3-second gust
             / exact-system critical-instability 3-second gust (Ucrit)
```

That change is a proposed semantic model change, not documentation for current-v1 evaluation.

---

## Stage 4 -- Curve form

### Decisive question

```text
How does effective demand become bounded physical damage for each current failure unit?
```

Current v1 uses a thresholded logistic:

```text
             0                                      if R_eff < R0_i
DR_i =
             max_DR_i                               otherwise
             -------------------------------
             1 + exp[-k_i(R_eff - R50_i)]
```

Parameter meanings:

| Parameter | Meaning |
|---|---|
| `R0` | Hard-zero cutoff used by current v1 |
| `R50` | Demand ratio at half the curve's `max_DR` |
| `k` | Transition steepness |
| `max_DR` | Failure-unit damage-ratio cap |

```text
DR
1.0 |                                      cap
    |                                _________
    |                           ____/
    |                       ___/
    |                    __/
0.0 |___________________|________________________ R_eff
                       R0        R50
```

The hard-zero rule creates a discontinuity at `R0`: the value just below `R0` is zero, while the logistic
ordinate is used exactly at `R0`. This is governed current behavior, not a physical proof that all damage is
impossible below the cutoff.

### Why this form was selected

| Reason | Interpretation |
|---|---|
| Threshold-like structural behavior | Avoids small positive loss at every low gust |
| Heterogeneous assets | Smooth transition represents varied capacity in a screening way |
| Bounded output | DR remains below each failure-unit cap |
| Limited public calibration | Transparent engineering fit is easier to audit than false precision |

### Alternatives and limitations

| Alternative | Current decision |
|---|---|
| One whole-plant curve | Rejected; hides unit/value grain |
| One hard step | Rejected; too brittle for heterogeneous plants |
| Vendor structural model | Preferred when qualified, but not generic catalog input |
| Claims-calibrated empirical curve | Not available in retained v1 evidence |
| Ordered damage-state lognormal | Used only in noncanonical proposed v2 research |

All current ordinates appear in [Model reference](MODEL_REFERENCE.md#3-current-v1-curve-records-and-ordinates).

---

## Stage 5 -- Adjustments, exposure, and value

### Decisive question

```text
Which inputs choose a curve, which describe event-time state,
which change local demand, and which change value touched?
```

```text
SELECTOR             CONDITIONER          EXPOSURE / VALUE
fixed asset fact     event-time state     what the event reaches
----------------     ----------------     ----------------------
design gust          stow state           array exposure fraction
mounting type        stow probability     local array zone
clamp/foundation     attained condition   failure-unit value
```

### Selector rule

- `design_gust_mph` is required and normalizes the event gust.
- `mounting_type` is required and states tracker/fixed-tilt context.
- `module_clamp_type` and `foundation_type` are documented future selectors; current v1 does not numerically
  vary the curves with them.
- An unknown fixed attribute must not be silently upgraded to a favorable class.

### Conditioner rule

Current v1 stow demand treatment is:

```text
confirmed_stowed:      multiplier = 0.80
unstowed_or_failed:    multiplier = 1.25
probabilistic:         multiplier = p x 0.80 + (1-p) x 1.25
```

This rule is T4. Sources support the mechanism and direction, not a universal numerical credit. A stow
command does not prove that the tracker reached and held the intended position.

The current workbook has a documented defect: `Dashboard!G7` reads mounting type `B7` instead of stow state
`B8`. Changing the displayed stow state there does not change workbook curves as intended. The canonical JSON
still declares the stow formula above. This basics set records the issue; it does not patch runtime or the
workbook.

### Local demand and exposure rule

```text
zone multiplier          -> changes R_eff in current v1
array exposure fraction  -> changes affected failure-unit value
```

Do not apply a zone factor twice. If a supplied pressure/demand already includes edge or corner loading, a
second generic zone multiplier would double count it.

### Value rule

```text
loss_i = DR_i x value_share_i x physical_base_USD x exposure_fraction
```

The current artifact carries illustrative physical-base shares:

| Failure unit | Share |
|---|---:|
| Tracker structure | 0.08 |
| Racking structure | 0.06 |
| Module attachment | 0.40 |
| Foundation uplift | 0.08 |
| Exposed SCADA | 0.02 |

The shares total `0.64`, not `1.00`, because they cover selected wind-relevant buckets rather than asserting
that every physical-base dollar has an intrinsic v1 wind curve. Replace them with site-specific,
non-overlapping values when possible.

---

## Stage 6 -- Emit

### Decisive question

```text
What may the damage code state, and what must remain downstream or withheld?
```

Current v1 can populate deterministic failure-unit scalar DR and conditional scenario loss when explicit
value and exposure bases are supplied.

```text
v1 inputs
  -> exact artifact/model/docs identity
  -> axis and R_eff
  -> five failure-unit DRs
  -> value/exposure-linked scenario loss
  -> limitation and provenance flags
```

It does not carry curve-intrinsic vulnerability spread.

### Capability-v2 interpretation

| Output/metric | Current status |
|---|---|
| Failure-unit scalar DR | Supported |
| Scenario loss | Supported with explicit value and exposure basis |
| Curve-intrinsic vulnerability distribution | Not supported |
| EAL | Downstream-computable only with validated frequency/intensity prerequisites |
| PML/VaR/TVaR | Downstream-computable only from a validated annual loss distribution |
| Insurance/portfolio output | Downstream-owned |

```text
one deterministic severity curve
        +
validated event frequency/intensity model
        +
exposure, value, dependency and cap logic
        =
possible downstream annual distribution
```

The consumer must preserve the limitation that intrinsic vulnerability spread is absent.

---

## Stage 7 -- Ship

### Decisive question

```text
Which exact artifact may a consumer load, and what checks prevent drift?
```

Current consumer identity:

```text
cell:                  strong_wind_solar
damage code:           STRONG_WIND_SOLAR_V1
model:                 model v1.0
runtime docs:          docs r3
bundle schema:         damage_curve_record_bundle.v2
capability schema:     capability_declaration.v2
artifact SHA-256:      832f47d69372ec54723a61b8a956addccef07bb39338c3ec99907e116f1855ca
```

Shipping means more than having a JSON file:

```text
[x] current artifact is machine-readable and indexed
[x] artifact identity is pin-able
[x] five runtime curve records are present
[x] capability limits are declared in governed current documentation
[ ] current cell-specific known-answer fixture exists
[ ] strong-wind notebook exists
[ ] dependency/cascade behavior is explicitly serialized
[ ] proposed v2 promotion gates are cleared
```

The generic runtime-contract validator checks the current artifact structurally. Unlike hail and wildfire,
current strong-wind v1 has no cell-specific KAT fixture. This is a validation gap, not permission to use the
proposal's KATs as v1 tests.

### The noncanonical proposal cannot ship as current

```text
STRONG_WIND_SOLAR_CONVECTIVE_V2_PROPOSED
model v2.0 / docs r1
bundle v3 / capability v3 / emit v2
proposal SHA-256: 32fe982548139cda846fb2e1da63568bcdcc689a87d6b21bd0110f23676c58fb
promotion status: BLOCKED
```

It needs independent wind/structural review, evidence review of T4 envelopes, Hazard shadow/negative/rollback
tests, and an explicit atomic promotion decision. Until then, it remains research/shadow material only.

---

## Cross-reference map

| Question | Canonical/current source | Separate proposal source |
|---|---|---|
| What runs now? | [Current JSON artifact](../current/strong_wind_solar__model_v1_0__docs_r3__curve_artifact.json) | Not applicable |
| Why these v1 curves? | [Current derivation dossier](../current/strong_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md) | [Proposed derivation dossier](../proposed/strong_wind_solar_curve_derivation_dossier__model_v2_0__docs_r1.md) |
| What fields exist? | [Current metadata spec](../current/strong_wind_solar_damage_code_metadata_spec__model_v1_0__docs_r1.md) | [Proposed metadata spec](../proposed/strong_wind_solar_damage_code_metadata_spec__model_v2_0__docs_r1.md) |
| What is the proposal status? | Current remains pinned | [Promotion gate matrix](../proposed/PROMOTION_GATE_MATRIX_strong_wind_solar__model_v2_0__docs_r1.md) |
| What is exact reference detail? | [Model reference](MODEL_REFERENCE.md) | [Model reference proposal appendix](MODEL_REFERENCE.md#13-noncanonical-model-v20-research-boundary) |

---

## Documentation-only non-change statement

This basics set explains existing material. It does not modify:

```text
model v1.0 numerical behavior
docs r3 runtime artifact or SHA
failure-unit records or value shares
R0, R50, k, max_DR
stow/zone/exposure behavior
capability meaning
portable package contents
proposed model v2.0 promotion status
Hazard consumer behavior
```

Continue with [Model reference](MODEL_REFERENCE.md) for exact tables, fields, checks, and proposal boundaries.
