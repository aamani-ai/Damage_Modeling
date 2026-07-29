# Wind / Tornado × Wind -- How the Model Is Built

**Use this page to understand the reasoning chain behind the current model and the reason a pathway-aware
replacement was proposed.** Start with the [basics README](README.md) for terminology and the first worked
example. Use the [model reference](MODEL_REFERENCE.md) for exact parameters, hashes, validation status, and
proposal-only state tables.

```yaml
cell_id: wind_tornado_wind
cell_model_version: model v1.0
human_documentation_revision: docs r5
canonical_runtime_pin: wind_tornado_wind@model_v1_0__docs_r4
canonical_artifact_sha256: 908f386953d062a62a33b6714020374b9b9d8a4538006e80d37047686c2c127a
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

## Source hierarchy

```text
CANONICAL CURRENT RUNTIME
    ../current/wind_tornado_wind__model_v1_0__docs_r4__curve_artifact.json

CURRENT GOVERNED RATIONALE / INTERFACE
    ../current/wind_tornado_wind_curve_derivation_dossier_v1_0.md
    ../current/wind_tornado_wind_damage_code_metadata_spec_v1_0.md
    ../current/damage_curve_records_v1_0_wind_tornado_wind.xlsx

READER-FRIENDLY SYNTHESIS
    basics/README.md
    basics/HOW_THE_MODEL_IS_BUILT.md
    basics/MODEL_REFERENCE.md

NONCANONICAL RESEARCH PROPOSAL
    ../proposed/  model v2.0/docs r1
    never substitute these equations into current execution
```

If a current explanation conflicts with the canonical v1 artifact, stop and reconcile it. If a proposed-v2
document conflicts with current v1 behavior, that difference is expected and must remain visibly labeled.

---

## The complete build path

```text
STAGE 0  QUESTION     What wind mechanisms and physical destruction are in scope?
STAGE 1  EVIDENCE     What do design standards, cases, and methods actually support?
STAGE 2  GRAIN        What repeated unit and failure buckets are modeled?
STAGE 3  AXIS         What gust, height, design scale, and tornado bridge enter?
STAGE 4  FORM         Why bounded logistics, and what are their limits?
STAGE 5  ADJUSTMENTS  What selects design, conditions loads, or changes exposure/value?
STAGE 6  EMIT         What severity and capability may current v1 return?
STAGE 7  SHIP         What is validated, what is missing, and who owns annual metrics?

REDESIGN  PROPOSED v2 separates pathways, states, exposure, and denominators
```

---

## Stage 0 -- The modeling question and boundary

### Current v1 question

```text
Given a delivered hub-height 3-second gust or tornado wind proxy,
and a selected IEC design gust,
what deterministic direct-physical DR does the current logistic family assign
to each repeated-turbine failure-unit value bucket?
```

### Current modeled subjects

```text
blade/rotor structural response
tower buckling/collapse response
nacelle direct/consequential response
foundation overturning/support response
secondary acceleration-sensitive power-electronics response
partial turbine exposure through count/fraction
```

### Current exclusions and boundaries

```text
annual frequency and event catalogs
EAL/PML/VaR/TVaR and financial terms
business interruption and curtailment
claims-calibrated universal OEM fragility
fully coupled component damage-state precedence
intrinsic vulnerability uncertainty distribution
governed tropical-cyclone/hurricane response
```

The current documents describe strong straight-line/severe wind and a tornado proxy variant. They do not
provide a first-class event-family router. That seam is one reason proposed v2 makes pathway identity
required.

---

## Stage 1 -- Evidence

### Evidence-to-parameter map

| Evidence | Supports | Does not support |
|---|---|---|
| IEC/DTU design framework | `Vref`, design class, extreme-wind/load context | Failure-unit repair-cost curve |
| IEC extreme-event equation source | `Ve50 = 1.4 x Vref` bridge | Site event speed or DR |
| DOE severe-weather guidance | Shutdown, feathering, yaw, direct-hit caveats | Universal numeric conditioner multipliers |
| NOAA/NWS EF scale | Damage-estimated 3-second gust ranges and uncertainty | Direct turbine-local measurement |
| NASA Greenfield tornado case | High-severity turbine-collapse plausibility | Population fragility or exact D50 shift |
| NIST fragility/damage-matrix method | Bounded monotone fragility form and dependency discipline | Current numeric D50/k values |
| Acceleration-sensitive research | Power-electronics/control acceleration mechanism | Wind-speed-only acceleration curve calibration |
| Solar/wind value workbook | Reference component shares | Vulnerability or complete site appraisal |

### Current parameter tiers

```text
T2  Ve50 = 1.4 x Vref and IEC class table
T3  10 m-to-hub height bridge, with site/terrain documentation
T3  max_DR caps for blade, tower, nacelle, and foundation
T4  max_DR cap for secondary power electronics
T4  every D50 ratio, k value, and tornado D50 shift
```

Case studies are high-severity plausibility/cross-validation evidence, not full empirical curves. Current v1
is public-source-derived and auditable, but not private claims- or OEM-calibrated.

### Co-curated evidence update

Later evidence added cross-validation and mechanism context—Typhoon Usagi, tower fragility work, tornado
physics, yaw/feather studies, Punta Lima/Maria loss plausibility, and failure-mechanism review—without changing
model v1.0 outputs. Numeric yaw effects, tornado-shift refinement, and IEC offsets remained candidates rather
than silently adopted behavior.

---

## Stage 2 -- Grain and coverage

### Repeated physical grain

The physical subject is a wind farm containing repeated turbines plus shared plant systems. An EIA generator
or market resource may represent many turbines; it must not be assumed to be one physical turbine.

```text
wind farm / asset
|
+-- repeated turbine equipment
|   +-- rotor assembly / blade             WT_BLADE_STRUCT
|   +-- tower section                      WT_TOWER_STRUCT
|   +-- nacelle internals/housing          WT_NACELLE_CONSEQ
|   +-- foundation/base                    WT_FOUNDATION_OT
|   +-- power converter/control            WT_POWER_ELEC_ACCEL
|
+-- conditioner-only states
|   +-- pitch/feathering
|   +-- yaw alignment
|   +-- brake and operating state
|
+-- plant systems reviewed narratively
    +-- SCADA
    +-- electrical collection
    +-- substation
    +-- civil/access
```

### Current numeric records

| Current record | Role | Default structural aggregate? |
|---|---|---:|
| `WT_BLADE_STRUCT` | Primary nonzero | Yes |
| `WT_TOWER_STRUCT` | Primary nonzero | Yes |
| `WT_NACELLE_CONSEQ` | Primary, dependency-sensitive | Yes |
| `WT_FOUNDATION_OT` | Conditional-primary in dossier; serialized primary | Yes |
| `WT_POWER_ELEC_ACCEL` | Secondary/conditional/open seam | No |

### Dependency seam

```text
tower collapse       -> nacelle and rotor are likely consequentially damaged
foundation overturn  -> tower, nacelle, and rotor may be destroyed
blade strike         -> tower/nacelle damage may follow
```

Current v1 stores separate curves because the framework needs separate physical/value records, but it does
not provide a full mutually exclusive damage-state/precedence matrix. Simple summation must retain that
warning.

### Exposure grain

The natural loss grain is repeated turbines:

```text
per-turbine DR
    x value of the matching unit/bucket
    x exposed turbine count or fraction
```

Collection lines, substations, foundations, and civil networks have different spatial subjects and exposure
geometries. One farm lease or swath fraction should not be copied onto all of them automatically.

---

## Stage 3 -- Axis and bridges

### Current preferred axis

```text
preferred event field: hub_height_3s_gust_mps
internal axis:         r = V_3s_hub / Ve50_class
unit:                  dimensionless
```

### IEC selector bridge

```text
Ve50 = 1.4 x Vref
```

| Class | `Vref` m/s | `Ve50` m/s |
|---|---:|---:|
| IEC I | 50.0 | 70.0 |
| IEC II | 42.5 | 59.5 |
| IEC III | 37.5 | 52.5 |

`Vref` and `Ve50` describe turbine design environment. They are selectors/anchors, not the event x-axis by
themselves.

### Height bridge

If the source gives a 10 m 3-second gust:

```text
power law: V_hub = V_10m x (hub_height_m / 10)^alpha
log law:   V_hub = V_10m x ln(hub_height_m/z0) / ln(10/z0)
```

The bridge must preserve method, exponent or roughness, height, terrain/exposure, units, and warnings. The
current artifact's `alpha=1/7` default requires an explicit flag. Missing height/method is a fail-closed seam;
`ASSUMED_10M_EQUALS_HUB_HEIGHT_BIAS_WARNING` is not suitable for production EAL/PML.

### Current tornado bridge

The narrative v1 design is:

```text
EF rating / damage-estimated wind range
    -> qualified 3-second gust proxy
    -> current design-normalized ratio
    -> tornado D50-shift variant
```

EF is damage-estimated context, not direct wind measurement. The current artifact does not serialize a
first-class pathway ID or complete EF-to-local-wind contract; this remains a material seam.

### Current extrapolation behavior

The current artifact says `extrapolation_policy: warn` and does not serialize pathway-specific evidence
domains. Do not import the proposed v2 `28/55/70 m/s` rules into current v1 execution; they belong only to the
noncanonical proposal.

---

## Stage 4 -- Curve form

### Selected current form

```text
DR_i(r) = max_DR_i / (1 + exp[-k_i x (r - D50_i)])
```

For current tornado variant:

```text
D50_i,tornado = D50_i,straight + shift_i
```

### Why bounded logistic?

```text
monotone with normalized event speed
bounded by failure-unit max_DR
parameter-light for sparse public component-loss data
easy to shift by design class and current tornado proxy
compatible with later fragility/uncertainty upgrades
```

### Parameter table

| Record | `max_DR` | Straight D50 | `k` | Tornado shift |
|---|---:|---:|---:|---:|
| Blade | 1.00 | 1.38 | 12.0 | -0.10 |
| Tower | 1.00 | 1.48 | 11.0 | -0.12 |
| Nacelle | 0.85 | 1.44 | 10.0 | -0.10 |
| Foundation | 0.65 | 1.62 | 9.0 | -0.08 |
| Power electronics | 0.30 | 1.20 | 8.0 | -0.05 |

### Rejected or deferred alternatives

| Alternative | Reason |
|---|---|
| Single step threshold | Implies simultaneous failure at one speed |
| One whole-farm curve | Hides repeated-unit exposure, components, and value |
| Flood-like piecewise state curve | Less natural for the original continuous structural-exceedance framing |
| Direct claims curve | Not publicly available at required grain |
| Full aeroelastic simulation | Not portable as a generic cell damage code |
| Independent probability interpretation of each logistic | Current DRs are deterministic expected severity, not separate failure probabilities |

### Why the form is now under redesign

The v1 form uses the same family for straight wind and tornado, then sums dependent components. Proposed v2
instead uses first-class pathways and mutually exclusive ordered equipment damage states. That proposal is
discussed separately below and is not current runtime behavior.

---

## Stage 5 -- Selectors, conditioners, exposure, and value

### Current selectors

| Field | Requirement | Effect |
|---|---|---|
| `iec_wind_class` | Required, default IEC II | Chooses `Ve50` speed scale |
| `turbine_model_or_design_speed` | Optional | Overrides generic IEC class where known |
| `hub_height_m` | Conditional | Required for non-hub-height source input |

Recommended descriptive selectors include rotor diameter, blade length, rated power, survival speed, and
manufacturer/model. They do not create deeper physical hierarchy levels.

### Current conditioners

| Field | Current effect |
|---|---|
| `operating_state` | Qualitative flag; future numeric load-state adjustment |
| `feathered_state` | Qualitative flag; future pitch-protection adjustment |
| `yaw_alignment` | Qualitative flag; future yaw-error adjustment |
| `tornado_variant` | Current T4 horizontal D50 shift |
| `brake_status`, `grid_availability` | Documented in narrative metadata; not serialized as current numeric artifact logic |

Do not invent numeric multipliers for the qualitative fields.

### Current exposure

The canonical artifact serializes `exposed_turbine_fraction` as required. The narrative metadata also allows
explicit total/exposed counts and flags for substation/collection footprint. Exposure changes value touched,
not per-turbine intrinsic DR.

### Current value shares

| Record | Share of reference physical base |
|---|---:|
| Blade | 0.173 |
| Tower | 0.169 |
| Nacelle | 0.345 |
| Foundation | 0.062 |
| Power electronics | 0.037, excluded from default aggregate |

The first four default shares total `0.749`; all five total `0.786`. The current artifact carries these shares
inside failure-unit records but has no top-level `value_linkage` profile. Its capability says scenario loss is
supported only with explicit value and exposure. Therefore a consumer must not infer that uncovered physical
value is immune or that these shares are a complete site schedule of values.

---

## Stage 6 -- Emit and capability

### Current populated output

```text
primary grain:           failure_unit
populated emit mode:     scalar_mean
failure-unit scalar DR:  supported
scenario loss:           supported with explicit value and exposure basis
intrinsic spread:        not carried
```

The artifact lists possible generic emit modes, but only `scalar_mean` is populated for this cell. Null
distribution fields do not become an uncertainty model.

### Current annual-metric capability

Downstream consumers may compute a frequency-driven annual loss distribution, EAL, PML, VaR, and TVaR only
when they supply and validate:

```text
explicit value basis
explicit exposure basis
sampled hazard frequency and intensity
frequency/intensity coupling
caps applied inside the simulation
```

Required limitations include:

```text
CURVE_INTRINSIC_SPREAD_NOT_CARRIED
TAIL_CONDITIONAL_ON_DETERMINISTIC_VULNERABILITY
```

The consumer owns failure-unit and annual aggregate cap enforcement. A current DR artifact does not validate
the event catalog or annual simulation.

---

## Stage 7 -- SHIP and current validation boundary

### What repository runtime validation currently proves

The repository validator verifies the current wind artifact's:

```text
indexed path and existence
exact SHA-256 match
bundle-v2 identity/model/docs pin
canonical-runtime flag
source path hygiene
wind_tornado_logistic_ratio parameter-key shape
default-aggregate Boolean on every curve record
capability-v2 semantics
changelog/current consumer pin
```

The current artifact passes those checks as one of five indexed runtime artifacts.

### What is not currently published for v1

```text
no cell-specific known-answer-test path in the current artifact
no standalone current-v1 validation report in the current folder
no executable numeric formula/value/exposure KAT suite comparable to wildfire
```

The current workbook's `QA_Checks` sheet reports coverage/x-axis/curve/value checks as passing, evidence as
`PASS_WITH_ASSUMPTIONS`, dependency as `PASS_WITH_FLAG`, and formula scan as `TO_VERIFY`.

This is a documentation and validation gap, not automatic evidence that the current curves are wrong. It is
also a reason the basics pages must avoid saying current v1 is numerically KAT-complete.

### Consumer boundary

The M2/M3 seam must deliver the right gust height and lineage. M3 owns current failure-unit severity. Hazard
owns exposure/event identity, frequency, annual aggregation, values/caps, and financial terms. M4 should
consume M3 output rather than rebuilding curve dictionaries.

---

## Proposed model v2.0 redesign -- not current runtime

### Why it exists

Proposed v2 addresses four load-bearing v1 seams:

```text
one shared straight/tornado curve family
Boolean tornado shift instead of first-class pathway
independent component sum despite physical dependence
incomplete/reconciled value and exposure boundaries
```

### Proposed first-class pathways

```text
straight_line_convective
    downburst / microburst / macroburst / gust front / local derecho outflow

tornado_direct_hit
    conditional severity after Hazard resolves turbine intersection and local demand
```

Both exclude tropical cyclone. Proposed straight-line also excludes nonconvective synoptic and downslope
wind. Missing pathway must reject; routing rejection is not zero damage.

### Proposed failure atom

```text
one repeated turbine-equipment assembly
    rotor + pitch + nacelle + power electronics + yaw + tower
    reference denominator: 1,090 2023 USD/kW

withheld/separate
    foundation                         120 USD/kW
    external electrical                72 USD/kW
    civil                              47 USD/kW
    replacement support               294 USD/kW, allocate once
```

### Proposed curve form

Both pathways use mutually exclusive ordered damage states with lognormal exceedances:

```text
DS0 no direct damage                         cost ratio 0
DS1 pitch/control repair proxy               cost ratio 0.0119266055
DS2 rotor assembly replacement               cost ratio 0.3091743119
DS3 terminal turbine-equipment replacement   cost ratio 1
```

Straight-line central medians are speed ratios `[0.90, 1.05, 1.30]`, with `beta_ln=0.10`. Tornado central
medians are `[36, 51, 67] m/s`, with `beta_ln=0.08`. Lower/central/upper resistance scenarios are unweighted
engineering envelopes, not percentiles.

### Proposed axes

```text
straight_line_convective
    preferred: rotor_effective_3s_gust_mps / explicit iec_ve50_mps
    hub-height gust: flagged proxy
    10 m wind: lineage only after named upstream bridge

tornado_direct_hit
    preferred: tornado_rotor_effective_peak_horizontal_speed_mps
    hub-height peak 3-second gust: qualified proxy
    EF alone: prohibited
    turbine intersection: required for loss
```

### Proposed validation versus promotion

The v2 proposal package passed its own schemas, equation semantics, 13 runtime/withholding KATs, 13 rejection
KATs, cross-pathway assertion, four pin tests, workbook QA, and current-v1 regression. Its review snapshot SHA
is `736ffa95...`, but that is **not a canonical consumer pin**.

Promotion remains blocked until Hazard integration, height/profile/exposure/event-overlap repair, dual-read,
rollback rehearsal, and an explicit repository promotion decision are complete. Current v1/docs r4 remains
the rollback and runtime pin.

---

## Hurricane and neighboring-wind boundary

The proposed boundary makes explicit what should not be inferred from a common speed unit:

| Dimension | Convective outflow | Tornado direct hit | Tropical cyclone |
|---|---|---|---|
| Duration | Local transient minutes | Seconds to minutes | Hours/repeated loading |
| Wind field | Outflow/gust-front profile | Rotating/translating vortex | Boundary-layer/eyewall field |
| Direction | Rapid outflow change possible | Rapid rotation/sign change | Sustained veer/eyewall change |
| Controls | Shutdown transition important | Yaw cannot track vortex reliably | Grid loss/backup yaw/parked state important |
| Exposure | Local outflow footprint | Turbine-track intersection | Storm wind field/spatial correlation |

A future neighboring cell may share turbine anatomy and a reviewed value profile. It may not silently reuse
numeric curves without an equivalence review. See the
[proposed hurricane boundary](../proposed/HURRICANE_AND_NEIGHBORING_WIND_BOUNDARY_wind_tornado_wind__model_v2_0__docs_r1.md).

---

## Cross-reference map

| Question | Governing source |
|---|---|
| Current runtime records/parameters/capability | [Canonical v1 artifact](../current/wind_tornado_wind__model_v1_0__docs_r4__curve_artifact.json) |
| Current derivation/evidence | [Current dossier](../current/wind_tornado_wind_curve_derivation_dossier_v1_0.md) |
| Current narrative fields | [Current metadata spec](../current/wind_tornado_wind_damage_code_metadata_spec_v1_0.md) |
| Current workbook and QA | [Current workbook](../current/damage_curve_records_v1_0_wind_tornado_wind.xlsx) |
| Current height seam | [M2 height bridge](../../../contracts/hazard_handoff/wind_tornado_wind_m2_height_bridge.md) |
| Current pin/SHA | [Artifact index](../../../contracts/machine_readable_artifact_index.json) |
| Proposed v2 overview | [Proposed README](../proposed/README_wind_tornado_wind__model_v2_0__docs_r1.md) |
| Proposed v2 exact artifact | [Proposed artifact](../proposed/wind_tornado_wind__model_v2_0__docs_r1__curve_artifact.json) |
| Proposed tests/status | [Proposed validation report](../proposed/VALIDATION_REPORT_wind_tornado_wind__model_v2_0__docs_r1.md) |
| Proposed consumer changes | [Hazard migration proposal](../../../contracts/hazard_handoff/wind_tornado_wind_model_v2_0_hazard_migration_proposal.md) |

---

## Documentation-only non-change statement

This three-file basics set is the human docs r5 explanation of current model v1.0/runtime docs r4.
It does not change current parameters, IEC/height behavior, tornado shift, exposure/value meaning, capability,
artifact/schema/SHA, or output. It also does not promote proposed model v2.0.
