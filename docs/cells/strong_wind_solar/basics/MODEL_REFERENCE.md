# Strong Wind × Solar Model Reference

This is the lookup page for exact repository-current v1 parameters, equations, fields, value logic,
capabilities, validation gaps, and version identity. Section 13 records the separate proposed-v2 research
boundary so that it cannot be mistaken for current runtime behavior.

```yaml
cell_id: strong_wind_solar
basics_set_revision: r1
cell_model_version: model v1.0
human_documentation_revision: docs r4
canonical_runtime_documentation_revision: docs r3
canonical_runtime_pin: strong_wind_solar@model_v1_0__docs_r3
damage_code_id: STRONG_WIND_SOLAR_V1
artifact_schema_version: damage_curve_record_bundle.v2
capability_schema_version: capability_declaration.v2
canonical_artifact_sha256: 832f47d69372ec54723a61b8a956addccef07bb39338c3ec99907e116f1855ca
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

All site, event, exposure, and monetary values in examples are **illustrative class-template inputs**. They
are not observations for a real plant and are not universal engineering defaults.

---

## 1. Authority and interpretation rules

| Priority | Source | What it controls |
|---:|---|---|
| 1 | [Canonical current JSON](../current/strong_wind_solar__model_v1_0__docs_r3__curve_artifact.json) | Current runtime records and serialized logic |
| 2 | [Current derivation dossier](../current/strong_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md) | Current rationale, evidence and documented assembly |
| 3 | [Current metadata spec](../current/strong_wind_solar_damage_code_metadata_spec__model_v1_0__docs_r1.md) | Current input/output vocabulary and capability statement |
| 4 | This basics set | Reader-friendly synthesis |

Interpretation rules:

1. `DR` always uses the replacement value of the same failure unit as its denominator.
2. `R_eff` is a demand proxy, not damage, probability, wind category, or asset capacity certificate.
3. A design gust is a reference input, not an observed point of failure.
4. A stow command is not proof of attained stow position.
5. Current default shares are illustrative T4 value links, not site facts.
6. Unknown or unsupported must not be reported as zero damage.
7. Proposed-v2 identities, axes, records, and rejection rules never enter a current-v1 evaluation.

```text
current runtime identity                     noncanonical research identity
--------------------------------------       ----------------------------------------
STRONG_WIND_SOLAR_V1                         STRONG_WIND_SOLAR_CONVECTIVE_V2_PROPOSED
model v1.0 / docs r3                         model v2.0 / docs r1
bundle v2                                    proposed bundle v3
CAN load with exact current pin              CANNOT load as current
```

---

## 2. Canonical current-v1 failure-unit inventory

| Failure-unit ID | Subsystem | Component | Treatment | Default physical-base share |
|---|---|---|---|---:|
| `SWS_TRACKER_STRUCT` | `MOUNTING` | `TRACKER` | Primary nonzero | 0.08 |
| `SWS_RACKING_STRUCT` | `MOUNTING` | `RACKING_STRUCTURE` | Primary nonzero | 0.06 |
| `SWS_MODULE_ATTACH` | `PV_ARRAY` | `PV_MODULE` | Primary nonzero | 0.40 |
| `SWS_FOUNDATION_UPLIFT` | `FOUNDATION` | `FOUNDATION_BASE` | Primary nonzero | 0.08 |
| `SWS_SCADA_EXPOSED` | `SCADA` | `MET_STATION \| MONITORING_SYSTEM` | Secondary | 0.02 |

```text
current selected value coverage = 0.08 + 0.06 + 0.40 + 0.08 + 0.02 = 0.64
```

The remaining `0.36` of the reference physical base is not an immune bucket and is not an automatic zero.
It means current v1 publishes no intrinsic curve/value share for every other physical dollar.

### Coverage and dependency cautions

```text
tracker architecture:   tracker structure and module attachment may interact
fixed-tilt architecture:racking structure and module attachment may interact
structural collapse:    can make colocated modules nonsalvageable
foundation:             depends on pile, soil and geotechnical state
SCADA:                  depends on location and direct exposure
```

Current v1 does not serialize architecture-exclusive routing or a cascade/salvage rule. Keep monetary
buckets non-overlapping and disclose the limitation.

---

## 3. Current-v1 curve records and ordinates

### 3.1 Hazard and native axes

```text
hazard input field:    gust_3s_mph
hazard axis ID:        SWS_GUST_3S_ARRAY_HEIGHT
hazard unit:           mph
valid hazard range:    0 to 200 mph
extrapolation:         warn_or_clamp
native curve axis:     effective demand ratio R_eff
```

```text
R_eff = (gust_3s_mph / design_gust_mph)^2 x demand_multipliers
```

The event and design gusts must be comparable in averaging time, height/reference, and engineering basis.

### 3.2 Evaluation equation

For each failure unit `i`:

```text
if R_eff < R0_i:
    DR_i = 0
else:
    DR_i = max_DR_i / (1 + exp[-k_i x (R_eff - R50_i)])
```

The comparison is strict: exactly `R_eff=R0` evaluates the logistic branch.

### 3.3 Exact governed parameters

| Curve/failure unit | `max_DR` | `R0` | `R50` | `k` |
|---|---:|---:|---:|---:|
| `SWS_TRACKER_STRUCT` | 0.80 | 0.75 | 1.15 | 9.0 |
| `SWS_RACKING_STRUCT` | 0.75 | 0.80 | 1.25 | 8.0 |
| `SWS_MODULE_ATTACH` | 0.65 | 0.70 | 1.05 | 10.0 |
| `SWS_FOUNDATION_UPLIFT` | 0.45 | 0.90 | 1.35 | 7.0 |
| `SWS_SCADA_EXPOSED` | 0.15 | 0.70 | 0.95 | 6.0 |

Every value in this table is T4 screening-grade engineering judgment.

### 3.4 Recomputed reference ordinates

These values are direct evaluations of the governed equation and parameters. They are useful reviewer
fixtures, but they are not a published current-v1 KAT file.

| `R_eff` | Tracker | Racking | Module attach. | Foundation | SCADA |
|---:|---:|---:|---:|---:|---:|
| 0.69 | 0 | 0 | 0 | 0 | 0 |
| 0.70 | 0 | 0 | 0.019052950 | 0 | 0.027363829 |
| 0.75 | 0.021277595 | 0 | 0.030826818 | 0 | 0.034721282 |
| 0.80 | 0.032873023 | 0.019947745 | 0.049307817 | 0 | 0.043357575 |
| 0.90 | 0.076279572 | 0.042993132 | 0.118576590 | 0.018491075 | 0.063833622 |
| 1.00 | 0.164696297 | 0.089402192 | 0.245401435 | 0.035747347 | 0.086166378 |
| 1.049375 | 0.230316745 | 0.125462967 | 0.323984378 | 0.048902544 | 0.096719685 |
| 1.20 | 0.488511387 | 0.300984255 | 0.531423410 | 0.116651295 | 0.122636171 |
| 1.50 | 0.767126977 | 0.660597808 | 0.642858487 | 0.333348705 | 0.144664322 |
| 2.00 | 0.799619346 | 0.748145533 | 0.649951350 | 0.445294482 | 0.149725059 |

### 3.5 Current stow and zone transformation

```text
M_stow = 0.80                                  confirmed_stowed
M_stow = 1.25                                  unstowed_or_failed
M_stow = p x 0.80 + (1-p) x 1.25               probabilistic

R_eff = (V_event/V_design)^2 x M_stow x zone_multiplier
```

`M_stow`, including both endpoint multipliers, is T4. `zone_multiplier` defaults to `1.0` when applicable
and is also not an intrinsic curve parameter.

---

## 4. ASCII curve views

The sketches are explanatory; use Section 3 for exact values.

### 4.1 Relative current-v1 transitions

```text
DR
0.8 |                                         TTTTTTTT  tracker cap 0.80
0.7 |                                  RRRRRRRR         racking cap 0.75
0.6 |                         MMMMMMMMMM                 module cap 0.65
0.5 |                    MMMM      TTT
0.4 |                                  FFFFFFF          foundation cap 0.45
0.3 |              MMM        TTT
0.2 |         SSSSS      TTT
0.1 |___M__S______R_______________________________       SCADA cap 0.15
0.0 +----+----+----+----+----+----+----+----+---- R_eff
        0.7  0.8  0.9  1.0  1.1  1.2  1.3  1.5

T = tracker       R = racking       M = module attachment
F = foundation    S = exposed SCADA
```

### 4.2 Hard-zero boundaries

```text
R0=0.70  | module attachment, exposed SCADA begin logistic branch
R0=0.75  | tracker structure begins logistic branch
R0=0.80  | racking structure begins logistic branch
R0=0.90  | foundation uplift begins logistic branch
          0.7       0.8       0.9       1.0  -> R_eff
```

### 4.3 One gust, three event-state cases

For `V_event=V_design` and `zone_multiplier=1.0`:

```text
confirmed stowed:      R_eff = 0.80
probabilistic p=0.75:  R_eff = 0.9125
unstowed/failed:       R_eff = 1.25

lower demand <------------------------------> higher demand
    stowed          probabilistic                 unstowed
```

This is the current T4 behavior. It must not be presented as universally measured stow effectiveness.

---

## 5. Current-v1 input and output field dictionary

### 5.1 Hazard input

| Field | Status | Unit/example | Meaning and check |
|---|---|---|---|
| `gust_3s_mph` | Required | mph | 3-second event gust; preserve height and source basis |
| `wind_height_basis` | Conditional in metadata spec | array height, 10 m, source native | Names basis/conversion when needed |
| `wind_direction_deg` | Optional/context | degrees | Future orientation/local-demand input |
| `event_duration_hr` | Optional/context | hours | Not a current numerical axis |

### 5.2 Static selectors

| Field | Current status | Allowed/example | Numeric effect |
|---|---|---|---|
| `design_gust_mph` | Required/serialized | e.g. `120` | Denominator in speed-squared bridge |
| `mounting_type` | Required/serialized | tracker, fixed tilt, dual axis, unknown | Stow applicability/context; current routing remains coarse |
| `racking_design_type` | Optional documented | vendor/generic/unknown | Future selector only |
| `module_clamp_type` | Optional/serialized as future | top clamp, through-bolt, unknown | No current numerical variant |
| `foundation_type` | Optional/serialized as future | driven pile, ground screw, concrete | No current numerical variant |
| `design_code_basis` | Optional documented | project-specific/ASCE edition | Provenance only in current v1 |

### 5.3 Event-time conditioners

| Field | Current status | Allowed/example | Effect |
|---|---|---|---|
| `stow_state` | Conditional/serialized | confirmed, failed, probabilistic, N/A | Chooses current T4 demand multiplier |
| `stow_success_probability` | Conditional | 0 to 1 | Used only for probabilistic state |
| `stow_angle_deg` | Optional/context | degrees | Not numerically parameterized |
| `control_availability` | Optional/context | yes/no/unknown | Open seam; does not itself prove stow |
| `construction_state` | Optional/context | operating/incomplete | Future modifier only |

The current artifact uses the vocabulary `confirmed_stowed`, `unstowed_or_failed`, and `probabilistic` in its
formula. An adapter should normalize interface labels explicitly rather than relying on loose text matching.

### 5.4 Exposure and local-demand fields

| Field | Status | Range/example | Effect |
|---|---|---|---|
| `array_exposure_fraction` | Required/serialized | 0 to 1 | Scales affected value/loss |
| `zone_multiplier` | Conditional/serialized; default 1.0 | e.g. 1.15 | Multiplies current `R_eff` |
| `terrain_topography_multiplier` | Optional/context | qualified multiplier | Future treatment; avoid silent use |
| `debris_environment` | Optional/flag only | low/medium/high | Tornado/debris remains deferred |

### 5.5 Failure-unit outputs

| Output | Meaning | Denominator |
|---|---|---|
| Tracker structural DR | Direct tracker structural repair/replacement fraction | Tracker failure-unit value |
| Racking structural DR | Direct support/racking fraction | Racking failure-unit value |
| Module attachment DR | Direct module/attachment replacement fraction | Module-attachment failure-unit value |
| Foundation uplift DR | Direct generic foundation/pile fraction | Foundation failure-unit value |
| Exposed SCADA DR | Direct secondary exposed-instrument fraction | Exposed SCADA failure-unit value |

Do not multiply any one of these by full installed TIV.

---

## 6. Current-v1 value crosswalk

### 6.1 Reference basis used by current examples

```text
installed capex:          1120.000000 USD/kWdc
physical replaceable:      877.795702 USD/kWdc

100 MWdc illustrative plant:
installed capex:          $112.000000M
physical replaceable:      $87.779570M
```

These are reference-basis values, not a site valuation.

### 6.2 Current failure-unit links

| Failure unit | Share of physical base | USD/kWdc at reference | 100 MWdc value |
|---|---:|---:|---:|
| Tracker structure | 0.08 | 70.223656 | $7.022366M |
| Racking structure | 0.06 | 52.667742 | $5.266774M |
| Module attachment | 0.40 | 351.118281 | $35.111828M |
| Foundation uplift | 0.08 | 70.223656 | $7.022366M |
| Exposed SCADA | 0.02 | 17.555914 | $1.755591M |
| **Selected modeled buckets** | **0.64** | **561.789250** | **$56.178925M** |

Values are the reference physical base multiplied by the current artifact shares. They are illustrative and
can overlap real EPC cost categories unless a project crosswalk is built carefully.

### 6.3 Aggregate cap interpretation

If all current curves approach their individual caps and all selected value buckets are exposed:

```text
aggregate physical-base contribution cap
  = 0.80x0.08 + 0.75x0.06 + 0.65x0.40 + 0.45x0.08 + 0.15x0.02
  = 0.408
```

`0.408` is an arithmetic result of current caps and default shares. It is not a certified maximum
whole-plant wind loss: unmodeled buckets, cascade effects, site values, and other pathways remain outside it.

---

## 7. Parameter tier and update-trigger register

| Parameter family | Current tier | Current basis | Replace/update when... |
|---|---|---|---|
| Speed-squared bridge | T2 | Wind-pressure physics and PV wind-load sources | Qualified structural demand model changes bridge |
| `R0`, `R50`, `k`, `max_DR` | T4 | Mechanism-informed engineering fit | Claims, forensic, test, or qualified structural calibration exists |
| Stow multipliers | T4 | Mechanism/direction evidence only | Exact tracker-state aeroelastic evidence supports a value |
| Zone multiplier | T4 unless qualified | User/adapter local-demand assumption | Pressure/CFD/wind-tunnel/design treatment supplies demand directly |
| Default value shares | T4 | Reference cost breakdown | Project BOM/valuation ledger is reconciled |
| Exposure fraction | Input evidence grade | Hazard footprint and array mapping | Better spatial intersection becomes available |

### Evidence-status vocabulary

```text
observed       measured at the event/site
designed       declared design/qualification value
derived        reproducibly computed from named inputs
inferred       estimated from incomplete evidence
class-template illustrative archetype, not site fact
unknown        unavailable or unresolved
```

Do not rename `class-template` or `inferred` values as observed facts during document generation.

---

## 8. Capability and reportability

### 8.1 What current v1 populates

```text
failure-unit scalar DR:                 supported
scenario loss with value/exposure:      supported with explicit basis
curve-intrinsic vulnerability spread:   not carried
```

Current v1 emits deterministic ordinates. It does not say that the displayed DR is a percentile or draw from
a calibrated vulnerability distribution.

### 8.2 What a downstream consumer may compute

| Metric | Status | Prerequisites |
|---|---|---|
| Conditional event loss | Supported | Exact pin, valid axis, explicit value/exposure, cap checks |
| EAL | Consumer-computable | Validated event frequency/intensity coupling and loss assembly |
| PML | Consumer-computable | Validated annual loss distribution |
| VaR/TVaR | Consumer-computable | Validated annual loss distribution and declared financial layer |
| Vulnerability uncertainty distribution | Not supported by this curve | New calibrated spread model required |

```text
DR curve alone  !=  EAL
one severe-event example  !=  PML
T4 parameter variation  !=  probability distribution
```

Consumer cap binding is fail-closed. If model/docs/SHA identity, axis, value, exposure, or cap checks fail,
the affected metric should be withheld.

---

## 9. Complete illustrative current-v1 event assembly

### 9.1 Inputs

```text
event gust                      120 mph, 3-second, array-height
design gust                     120 mph, comparable basis
mounting context                single-axis tracker
stow state                      probabilistic
stow success probability        0.75
zone multiplier                 1.15
array exposure fraction         1.00
physical reference              $87.779570236M
installed reference             $112.000000000M
```

### 9.2 Effective demand

```text
M_stow = 0.75x0.80 + 0.25x1.25 = 0.9125

R_eff = (120/120)^2 x 0.9125 x 1.15
      = 1.049375
```

### 9.3 Failure-unit calculation

| Failure unit | DR | Share | Physical-base contribution | Loss, USD |
|---|---:|---:|---:|---:|
| Tracker | 0.230316745 | 0.08 | 0.018425340 | $1.617M |
| Racking | 0.125462967 | 0.06 | 0.007527778 | $0.661M |
| Module attachment | 0.323984378 | 0.40 | 0.129593751 | $11.375M |
| Foundation | 0.048902544 | 0.08 | 0.003912204 | $0.343M |
| Exposed SCADA | 0.096719685 | 0.02 | 0.001934394 | $0.170M |
| **Total** | -- | -- | **0.161393466** | **$14.167M** |

Exact aggregate results:

```text
conditional loss                         $14.167049099M
loss / physical reference                0.1613934662 = 16.1393%
loss / installed-capex reference         0.1264915098 = 12.6492%
```

### 9.4 What this example proves and does not prove

It proves that the documented arithmetic reproduces current v1 parameters. It does not prove that:

- the event/design wind bases are valid for a real plant;
- a 75% stow probability or 1.15 zone multiplier is correct;
- current value shares match a project;
- failure-unit losses are independent;
- the result has an annual probability; or
- v1 is scientifically calibrated.

---

## 10. Validation and reviewer checklist

### 10.1 Current validation status

| Check | Status | Interpretation |
|---|---|---|
| JSON parse and generic runtime-contract validation | Pass | Canonical artifact is structurally consumable |
| Exact current artifact SHA | Pinned | `832f47...f1855ca` |
| Curve bounds/monotonic form | Reproducible from equation | Five records are bounded and increasing after `R0` |
| Current cell-specific KAT fixture | **Missing** | Recomputed table here is not a governed fixture |
| Current evaluation/value-linkage contract blocks | **Not serialized separately** | Logic lives across artifact and current docs |
| Strong-wind notebook | **Missing** | Use artifact/dossier/workbook for current audit |
| Workbook stow selector | **Known defect** | `Dashboard!G7` reads `B7`, not displayed stow state `B8` |
| Dependency/cascade serialization | **Open seam** | Avoid overlapping value assembly |

### 10.2 Reviewer checklist

```text
[ ] Exact current model/docs/schema/SHA pin verified
[ ] Wind unit, 3-second averaging, height, and source basis preserved
[ ] Event and design gust bases reconciled
[ ] Mounting architecture known and not guessed
[ ] Stow condition reflects attained event state or uncertainty
[ ] T4 stow and zone effects labeled
[ ] R_eff computed once; no duplicate zone/terrain multiplier
[ ] Correct failure-unit curve used
[ ] DR multiplied only by same-unit, non-overlapping value
[ ] Local exposure applied rather than whole-site convenience
[ ] Foundation result not presented as geotechnical analysis
[ ] Tornado/debris excluded from the aerodynamic v1 curve
[ ] Curve-intrinsic spread limitation preserved downstream
[ ] Proposed-v2 data excluded from current output
```

---

## 11. Current-v1 source register

The [current derivation dossier](../current/strong_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md)
and workbook `Sources` sheet are the governed provenance entrypoints.

| Source ID/family | Current role | Numerical authority? |
|---|---|---|
| `WIND_PRESSURE_PHYSICS` | `V^2` axis bridge | Supports form, not DR ordinates |
| `CPP_PV_WIND_LOAD` | PV loading, dynamic effects, design normalization | Supports mechanism/bridge |
| `CPP_TORSIONAL_TRACKER` | Tracker torsion and stow-state mechanism | Does not calibrate universal multiplier |
| `DOE_FEMP_SEVERE_WEATHER_PV` | Failure mechanisms and resilience guidance | Does not calibrate generic curves |
| `NREL_STORM_RESILIENCE` | Clamp/fastener/bracing/cascade context | Does not calibrate generic curves |
| DuraMAT/PVade work | Need for qualified aeroelastic modeling | Research direction only |
| SEAC/ASCE context | Design and tornado-scoping terminology | Standard/design anchor, not curve |
| `SOLAR_WIND_VALUE_BREAKDOWN` | Reference value shares | Illustrative T4, not site valuation |

No retained current-v1 source supplies a matched population of local gust, exact system state, physical
disposition, and same-failure-unit repair cost. That is why the numerical curves remain T4.

---

## 12. Version history and non-change statement

| Layer | Before basics set | After basics set |
|---|---|---|
| Cell semantic model | `model v1.0` | Unchanged |
| Human documentation | `docs r3` | `docs r4` |
| Canonical runtime docs | `docs r3` | Unchanged |
| Canonical artifact SHA | `832f47...f1855ca` | Unchanged |
| Bundle/capability schema | v2/v2 | Unchanged |
| Curve/selector/conditioner/value behavior | Current v1 | Unchanged |
| Proposed v2 status | Noncanonical, blocked | Unchanged |

This basics set is `DOCS_ONLY`. Identical current-v1 inputs must produce identical damage-code outputs.

---

## 13. Noncanonical model-v2.0 research boundary

This section is intentionally separate. It helps a reader understand the direction of work without turning
research content into current runtime instructions.

### 13.1 Exact proposal identity

```text
damage code:          STRONG_WIND_SOLAR_CONVECTIVE_V2_PROPOSED
semantic model:       model v2.0
documentation:        docs r1
artifact schema:      damage_curve_record_bundle.v3
capability schema:    capability_declaration.v3
emit schema:          damage_emit.v2
artifact SHA-256:     32fe982548139cda846fb2e1da63568bcdcc689a87d6b21bd0110f23676c58fb
canonical runtime:    false
promotion status:     blocked
```

Proposal audit identities are not consumer pins.

### 13.2 Narrow hazard scope

```text
included: straight_line_convective
          downburst / microburst / macroburst
          non-tornadic thunderstorm outflow / gust front
          locally resolved derecho outflow

excluded: hurricane/tropical cyclone
          tornado and debris
          nonconvective synoptic/downslope wind
          hail, lightning, rain ingress, flood/surge
          fatigue, downtime, business interruption
```

If the pathway is unknown or neighboring, proposed v2 rejects. It does not fall back to current v1 or guess
from wind speed.

### 13.3 Architecture-specific axes

```text
fixed tilt preferred:
  x_fixed = event peak net-pressure demand
            / comparable same-zone qualified design net-pressure demand

fixed tilt proxy:
  x_fixed = (array-height 3-second gust / qualified design array-height gust)^2
  only with named convective-profile and aerodynamic-demand bridges

qualified single-axis tracker:
  x_tracker = tracker-normal local 3-second gust
              / exact-system critical-instability 3-second gust
```

Tracker evaluation requires exact qualification matching for 3-second basis, array-height tracker-normal
reference, profile bridge, 1P/2P configuration, layout, attained position and angle, zone, and drive/lock
state. At `x_tracker>=0.75`, a stow-action flag may be emitted only after matching; it is not a damage step.

### 13.4 Proposed conditional curve records

| Architecture | Failure unit | `beta_ln` | Hard zero | Central state medians |
|---|---|---:|---:|---|
| Fixed tilt | Module field | 0.300 | 0.10 | 0.85, 1.55 |
| Fixed tilt | Support structure | 0.300 | 0.10 | 1.15, 1.55, 1.90 |
| Qualified tracker | Module field | 0.275 | 0.10 | 0.95, 1.40 |
| Qualified tracker | Structural BOS | 0.275 | 0.10 | 1.15, 1.40, 1.65 |

Each record also carries lower- and upper-resistance scenarios. They are unweighted T4 epistemic scenarios,
not percentiles or a probability distribution.

| Record | Lower medians | Upper medians | State cost ratios |
|---|---|---|---|
| Fixed module | 0.65, 1.20 | 1.05, 1.95 | DS0 0; DS1 0.10; DS2 1.00 |
| Fixed structure | 0.90, 1.20, 1.50 | 1.45, 1.95, 2.35 | DS0 0; DS1 0.15; DS2 1.00; DS3 1.00 |
| Tracker module | 0.80, 1.15 | 1.10, 1.70 | DS0 0; DS1 0.10; DS2 1.00 |
| Tracker structural BOS | 0.95, 1.15, 1.35 | 1.35, 1.70, 2.00 | DS0 0; DS1 0.15; DS2 1.00; DS3 1.00 |

### 13.5 Proposed coverage and value rules

```text
curves delivered conditionally:
  fixed module field + fixed support structure
  tracker module field + tracker structural-BOS assembly

withheld:
  foundation
  power conversion/electrical
  SCADA/communications
  civil infrastructure

allocation only:
  replacement support, applied once outside intrinsic DR
```

The proposal has no implicit value profile. It requires explicit architecture-specific module and structure
values plus structured local exposure. Its repository reference says module plus mounting hardware is
`45.705917%` of the physical reference and `35.821837%` of installed reference, but these are informational
crosswalks, not curve caps.

Structure DS3 is the central proposed trigger for colocated module nonsalvage; DS2 assumes modules remain
salvageable. Full-salvage and no-salvage-on-any-replacement bounds remain visible because this dependence is
T4.

### 13.6 Proposal validation and promotion gates

The [proposal validation report](../proposed/VALIDATION_REPORT_strong_wind_solar__model_v2_0__docs_r1.md)
reports a pass for a **noncanonical screening proposal**, including structural/semantic checks, six runtime
or withholding KATs, one bounded-cascade loss KAT, four malformed value/exposure rejections, four pin KATs,
sixteen contract rejection tests, and a 14-sheet workbook review.

Promotion nevertheless remains blocked on:

1. independent review of fixed-pressure and tracker-`Ucrit` axes;
2. review or replacement of T4 medians, beta, hard-zero, state-cost and dependence assumptions;
3. stronger matched field/structural evidence or formal elicitation;
4. Hazard dual-read, event/exposure, negative-path and rollback testing; and
5. explicit maintainer approval with atomic registry/index/changelog changes.

See the [promotion gate matrix](../proposed/PROMOTION_GATE_MATRIX_strong_wind_solar__model_v2_0__docs_r1.md).

```text
proposal passes internal consistency checks
                !=
proposal is scientifically calibrated
                !=
proposal is approved for runtime
```
