# Strong Wind × Solar Basics

**Start here.** This page explains the repository-current strong-wind × solar model in plain language: what a
3-second gust means, why wind speed is normalized to design wind speed, how wind demand reaches trackers,
racking, modules, foundations, and exposed controls, and how failure-unit damage becomes conditional physical
loss.

```yaml
cell_id: strong_wind_solar
audience: first-time reader
basics_set_revision: r1
cell_model_version: model v1.0
human_documentation_revision: docs r4
canonical_runtime_documentation_revision: docs r3
canonical_runtime_pin: strong_wind_solar@model_v1_0__docs_r3
canonical_artifact_sha256: 832f47d69372ec54723a61b8a956addccef07bb39338c3ec99907e116f1855ca
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

All site, wind, equipment-state, exposure, and monetary inputs in the worked example are **illustrative
class-template inputs**. They are not observed facts for a real solar plant and are not universal design or
value defaults.

## How to use this basics folder

| If you want to... | Read |
|---|---|
| Understand the canonical v1 model in plain language | This `README.md` |
| Understand the current reasoning and the separate v2 research direction | [How the model is built](HOW_THE_MODEL_IS_BUILT.md) |
| Look up exact current parameters, fields, proposal boundaries, capabilities, or versions | [Model reference](MODEL_REFERENCE.md) |
| Audit the governed current derivation | [Current derivation dossier](../current/strong_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md) |
| Inspect exact current runtime records | [Canonical JSON artifact](../current/strong_wind_solar__model_v1_0__docs_r3__curve_artifact.json) |

The three basics pages are a reader-friendly synthesis. The canonical `current/` JSON remains the runtime
source of truth. A future Google Drive or DOCX document may use any subset of this material.

> **Important current/proposed boundary.** A pressure-tested
> [model-v2 convective proposal](../proposed/README_strong_wind_solar__model_v2_0__docs_r1.md) exists, but it
> is noncanonical and promotion-blocked. It does not change the v1 runtime pin. Proposed axes, records,
> rejection rules, and numerical envelopes must not be blended into a current-v1 calculation.

---

## 1. Five ideas to remember

1. **Wind intensity must have a time and height basis.** The current input is a 3-second gust at array or
   tracker height, not an unlabeled weather-station wind speed.
2. **Wind demand grows approximately with speed squared.** Current v1 uses
   `R_eff=(V_event/V_design)^2 × demand multipliers`.
3. **Each physical failure unit has its own curve and value share.** Tracker, racking, module attachment,
   foundation, and exposed SCADA are not one interchangeable whole-plant response.
4. **Stow is event-time state, not a permanent asset type.** Current v1 uses generic stow demand
   multipliers, but those magnitudes are T4 placeholders.
5. **Current and proposed models are different.** Canonical v1 combines broad wind types; proposed v2 narrows
   to resolved straight-line convective wind and is not authorized for runtime use.

---

## 2. What question does the current model answer?

For one specified wind event and one specified ground-mounted solar asset, current v1 asks:

```text
What was the 3-second gust at the array/tracker height?
    -> How does it compare with the asset's design gust?
    -> What stow and local-zone demand multipliers apply?
    -> What effective demand ratio reaches each failure unit?
    -> What deterministic physical DR follows for each unit?
    -> What unit value and array fraction were exposed?
    -> What is the conditional direct physical loss for this event?
```

```text
event gust / design gust
          |
          v
speed-squared demand ratio × stow/zone multipliers
          |
          +--> tracker structural DR
          +--> racking structural DR
          +--> module attachment DR
          +--> foundation uplift DR
          `--> exposed SCADA DR
                    |
                    v
          DR × value share × exposure
```

Event frequency, EAL, PML, business interruption, downtime, insurance terms, and portfolio accumulation
remain downstream.

---

## 3. The physical picture

```text
regional/source wind record
         |
         | height/profile conversion, if required
         v
array-height 3-second gust V_event  --------------------------->

                         airflow ------------------------------>
                                         uplift       drag
                                           ^           -->
fixed-tilt row                         ____/________
                                      / PV modules /|  clamps/rails
                   ground __________/____________/ |____________
                                           |  posts/braces
                                           |  foundation

single-axis tracker                    / / / / / /  modules
                              --------- torque tube ---------
                                     bearing / drive
                                           |
                                         pile
```

Wind pressure follows the physical bridge:

```text
q = 0.5 × air_density × V²
```

The current runtime therefore normalizes event gust to the design gust:

```text
R_eff = (gust_3s_mph / design_gust_mph)² × demand_multipliers
```

`R_eff=1` means the modeled demand proxy is near the declared design-demand reference after multipliers. It
does **not** mean the whole plant has failed, and design wind is not the same as an observed failure threshold.

### Why measurement height matters

```text
10 m weather/design wind
         |
         | named height/profile bridge
         v
array/tracker-height gust
```

Wind speed changes with height, terrain, obstacles, storm type, and flow profile. A value measured or modeled
at 10 m cannot silently be called an array-height gust. Current v1 asks for `wind_height_basis`; the proposed
v2 contract makes this bridge fail-closed for its narrower convective pathway.

---

## 4. Essential terminology

| Term | Plain-language meaning | Strong-wind × solar example | Common mistake |
|---|---|---|---|
| **Wind speed** | Speed of moving air with a stated averaging time and height. | `120 mph, 3-second gust` | Omitting time/height basis. |
| **Sustained wind** | Longer averaging-period wind. | 1-minute mean | Substituting it directly for a 3-second gust. |
| **3-second gust** | Peak wind averaged over three seconds under a declared reference. | Runtime `gust_3s_mph` | Treating an instantaneous spike or hourly mean as equivalent. |
| **Array height** | Height relevant to module/racking loading. | Near panel/tracker elevation | Assuming a 10 m product is already array-height. |
| **Design gust** | Wind-speed basis used for asset design/qualification. | `design_gust_mph=120` | Calling it actual capacity or failure speed. |
| **Dynamic pressure** | Wind demand proxy proportional to speed squared. | `q∝V²` | Assuming damage grows linearly with speed. |
| **Demand ratio** | Event demand relative to a reference/design demand. | `(V/Vdesign)²` | Reading it as damage ratio. |
| **Effective demand ratio (`R_eff`)** | Speed-squared ratio after current demand multipliers. | `1.049375` | Calling it a probability. |
| **Damage ratio (DR)** | Repair/replacement cost divided by the failure-unit replacement value. | Module-attachment DR `0.324` | Applying it to total plant TIV. |
| **Threshold `R0`** | Current v1 hard-zero boundary for one failure-unit curve. | Module `R0=0.70` | Calling it a proven no-damage theorem. |
| **R50** | Effective demand ratio at half of a curve's maximum DR. | Tracker `R50=1.15` | Confusing it with design wind. |
| **Tracker** | Moving mounting system with torque tube, bearings, and drive rows. | Single-axis tracker | Treating “tracker” as a module type. |
| **Racking/support structure** | Rails, posts, braces, and structural connections. | Fixed-tilt racking | Double-counting it with tracker structure. |
| **Module attachment** | Clamps/fasteners/retention that keep modules connected. | Clamp release/detachment | Treating all module glass damage as aerodynamic attachment loss. |
| **Foundation uplift** | Pile/post/anchor support failure under uplift/pullout demand. | Generic v1 foundation curve | Treating it as site geotechnical analysis. |
| **Stow** | Tracker position intended to reduce wind demand. | Confirmed wind stow | Treating a command as attained position. |
| **Zone multiplier** | Current v1 local-demand factor for interior/edge/corner exposure. | `1.15` mixed zone | Applying it twice when hazard demand already includes zoning. |
| **Array exposure fraction** | Fraction of array value reached by damaging wind footprint. | `0.50` | Using full plant value for a local downburst. |
| **Straight-line wind** | Nonrotating broad wind loading category in current v1. | Severe gust/outflow | Assuming every high wind is meteorologically identical. |
| **Derecho** | Parent convective event that may contain different local mechanisms. | Local outflow inside derecho | Applying one footprint-average gust everywhere. |
| **Tropical-cyclone/hurricane wind** | Long-duration rotating-storm wind environment. | Included broadly in current v1 narrative | Assuming the proposed convective v2 supplies it; it does not. |
| **Tornado** | Rotating narrow-swath wind/debris mechanism. | Deferred from this cell | Inferring tornado from speed alone. |
| **Pathway** | Explicit physical hazard mechanism routed by the hazard layer. | Proposed `straight_line_convective` | Treating it as an optional boolean or guessing from intensity. |

### Same number, different meanings

```text
120 mph event gust       = event intensity
120 mph design gust      = asset reference
(120/120)² = 1.0         = base demand ratio
R_eff = 1.049375         = ratio after illustrative multipliers
DR_module = 0.323984     = module-attachment physical severity
12.65% installed loss    = value-linked aggregate under illustrative shares
```

These quantities cannot be substituted for one another.

### Evidence/status words used in the examples

| Status | Meaning |
|---|---|
| **Observed** | Measured or directly recorded for the actual asset/site, with source and date. |
| **Designed** | Taken from an approved design, drawing, or specification; it may still need as-built confirmation. |
| **Derived** | Calculated from documented inputs and a reproducible transformation. |
| **Class-template** (`class_template`) | Representative class-level assumption used for screening or teaching, not claimed as site fact. |
| **Placeholder** | Temporary explicit value or rule awaiting better evidence; never silently promoted to fact. |
| **Unknown** | Not established from available evidence. Unknown is preferable to invented precision. |

---

## 5. Where do wind and equipment inputs come from?

| Input/evidence | Possible source | Use | Qualification |
|---|---|---|---|
| Event gust | Hazard model, anemometer, event reconstruction, vendor layer | Runtime intensity | Preserve averaging time, height, direction, storm type, unit, and location. |
| Design gust | Structural drawings, wind report, OEM qualification, design basis | Demand normalization | Do not use a regional number without asset-basis reconciliation. |
| Mounting architecture | EPC/as-built inventory, OEM documentation | Tracker/fixed-tilt context | Treat as a fixed asset attribute. |
| Stow state | Position sensor, SCADA, field observation | Event-time conditioner | Commanded is not necessarily confirmed. |
| Array zone | Layout/row map and wind-demand model | Local demand/exposure | Interior, edge, and end rows can differ. |
| Terrain/topography | Site survey, roughness/topography study, CFD/wind tunnel | Local bridge/context | Do not infer a universal multiplier from a label alone. |
| Foundation design | Geotechnical report, pile tests, drawings | Future/site-specific foundation model | Current curve is generic T4 only. |
| Failure-unit value | EPC cost split, valuation ledger, claims estimate | Conditional loss | Prevent overlap between tracker/racking/modules/foundation/support. |

Preserve whether each input is observed, designed, derived, inferred, class-template, or unknown. A generic
design gust or mounting type is not proof of the exact as-built capacity of every row.

---

## 6. What physical subjects are modeled in canonical v1?

```text
solar generation asset
|
+-- MOUNTING
|   +-- SWS_TRACKER_STRUCT       tracker structural unit
|   `-- SWS_RACKING_STRUCT       racking/support unit
|
+-- PV_ARRAY
|   `-- SWS_MODULE_ATTACH        clamps/attachment/detachment unit
|
+-- FOUNDATION
|   `-- SWS_FOUNDATION_UPLIFT    pile/support unit
|
`-- SCADA
    `-- SWS_SCADA_EXPOSED        exposed secondary instruments
```

| ID | Current role | Why separate? |
|---|---|---|
| `SWS_TRACKER_STRUCT` | Primary nonzero | Torque-tube, drive-row, torsion/stow-related structural demand |
| `SWS_RACKING_STRUCT` | Primary nonzero | Fixed/support uplift, deformation, and collapse |
| `SWS_MODULE_ATTACH` | Primary nonzero | Clamp/fastener release and module detachment |
| `SWS_FOUNDATION_UPLIFT` | Primary nonzero | Uplift/pullout support mechanism |
| `SWS_SCADA_EXPOSED` | Secondary | Exposed instruments with smaller value/materiality |

Current v1 does not serialize clean architecture-exclusive routing or a module/structure cascade. That is one
reason the proposed v2 research package exists.

---

## 7. Worked example: one canonical-v1 event

Illustrative current-v1 inputs:

```text
event 3-second gust             = 120 mph
design 3-second gust            = 120 mph
stow state                      = probabilistic
P(stowed)                       = 0.75
zone multiplier                 = 1.15
array exposure                  = 1.00
reference physical base        = $87.779570M for 100 MWdc
reference installed capex      = $112.0M for 100 MWdc
```

### Step 1 -- Build the current demand multiplier

```text
stow demand multiplier
  = 0.75 × 0.80 + 0.25 × 1.25
  = 0.9125

total demand multiplier
  = 0.9125 × 1.15
  = 1.049375
```

### Step 2 -- Calculate effective demand

```text
R_eff = (120/120)² × 1.049375 = 1.049375
```

### Step 3 -- Evaluate each thresholded logistic

| Failure unit | DR | Physical-base share | DR × share |
|---|---:|---:|---:|
| Tracker structure | 0.230317 | 0.08 | 0.018425 |
| Racking structure | 0.125463 | 0.06 | 0.007528 |
| Module attachment | 0.323984 | 0.40 | 0.129594 |
| Foundation uplift | 0.048903 | 0.08 | 0.003912 |
| Exposed SCADA | 0.096720 | 0.02 | 0.001934 |
| **Aggregate contribution** | -- | -- | **0.161393** |

### Step 4 -- Apply the illustrative value basis

```text
conditional physical loss
  = 0.1613934662 × $87.779570M
  = about $14.167M

physical-base loss fraction = 16.14%
installed-capex loss fraction = $14.167M / $112.0M = 12.65%
```

Every curve parameter, stow multiplier, zone multiplier, and current default share in this example is a T4
engineering assumption. The result reproduces the canonical v1 mechanics; it is not calibration evidence or
an annual risk metric.

---

## 8. What is the proposed v2, in one page?

The noncanonical proposal responds to known v1 weaknesses. It is not a runtime update.

```text
proposed pathway: straight_line_convective only

fixed tilt
  -> event/design net-pressure-demand ratio
  -> module-field + support-structure state curves

exact-system-qualified single-axis tracker
  -> tracker-normal gust / exact-system Ucrit
  -> module-field + tracker-SBOS state curves
```

The proposal:

- rejects hurricane, tornado, synoptic/downslope, hail, debris, and rain-ingress fallback;
- requires fixed-tilt versus qualified-tracker architecture routing;
- gives no universal stow credit;
- uses ordered damage-state screening ensembles with explicit T4 numerical bounds;
- preserves module/structure dependency and salvage bounds;
- withholds foundation, electrical, SCADA, and civil instead of inheriting array DR;
- requires explicit local exposure and failure-unit values;
- publishes KATs and exact rejection rules;
- remains promotion-blocked and absent from the canonical index/changelog.

See the [model reference proposal appendix](MODEL_REFERENCE.md#13-noncanonical-model-v20-research-boundary) for
exact identity and gates.

---

## 9. What the current model assumes -- and does not assume

### Canonical-v1 runtime behavior

```text
gust input range:               0 to 200 mph
native curve axis:              effective demand ratio
curve form:                     thresholded logistic demand
failure-unit records:           five
stow multipliers:               0.80 stowed / 1.25 unstowed
exposure:                       explicit array exposure fraction
curve-intrinsic spread:         not carried
```

### Not universal defaults

The model does not establish universal design gust, mounting architecture, stow reliability, zone factor,
terrain factor, foundation capacity, value allocation, or site exposure. Replace illustrative inputs with
asset/event evidence.

### Current open seams

```text
claims/forensic calibration
tracker-specific aeroelastic response
fixed-tilt versus tracker routing
clamp/fastener selectors
foundation/soil/pile capacity
module/racking cascade dependence
height/profile/direction bridge
hurricane versus convective versus synoptic pathway separation
tornado debris/narrow-swath pathway
curve-intrinsic vulnerability distribution
```

---

## 10. Fail-closed checks

```text
[ ] Is the event wind a 3-second gust with documented unit, height, location, and pathway context?
[ ] If source height differs, is the height/profile bridge named and reproducible?
[ ] Is design gust asset-specific and comparable to the event basis?
[ ] Is mounting architecture known rather than guessed?
[ ] Is stow based on actual event-time state, with uncertainty explicitly labeled?
[ ] Is the current T4 stow multiplier identified as a placeholder?
[ ] Is zone/local-demand treatment applied once rather than twice?
[ ] Does each DR apply to a non-overlapping failure-unit value bucket?
[ ] Is exposure local to the damaging footprint rather than full-site by convenience?
[ ] Is tornado/debris kept outside the canonical v1 aerodynamic curve?
[ ] Are proposed-v2 fields/results kept out of canonical-v1 output?
[ ] Are annual/tail metrics left to a validated downstream distribution?
```

### Frequent mistakes

```text
wrong: 120 mph weather-station value -> array-height gust automatically
right: preserve height/averaging/pathway and use a documented bridge

wrong: event gust equals design gust -> DR is 100%
right: speed ratio becomes a demand index; each failure unit has its own transition curve

wrong: stow command -> confirmed protective state
right: distinguish commanded, attained, failed, and uncertain event state

wrong: zone multiplier × already zoned pressure demand
right: apply local-demand treatment once

wrong: sum tracker, racking, and module replacement without checking overlap
right: preserve failure-unit/value boundaries and flag current dependency limitations

wrong: proposed v2 excludes hurricane, so canonical v1 must already exclude it
right: that is a proposed conceptual change; current v1 remains the broad runtime model

wrong: no numeric curve means zero loss
right: unsupported or unresolved means withheld/null, especially in proposed fail-closed work
```

---

## 11. A short explanation to reuse

```text
The canonical strong-wind × solar model converts a 3-second array-height gust into an effective demand
ratio by comparing it with the asset's design gust and applying current stow/zone multipliers. Five
thresholded-logistic records then produce deterministic physical damage ratios for tracker structure,
racking, module attachment, foundation uplift, and exposed SCADA. Each ratio is linked to its own value
share and exposure rather than whole-plant TIV. All current numerical parameters are screening-grade T4
engineering assumptions except the speed-squared physics bridge.

A separate proposed v2 narrows the hazard to resolved straight-line convective wind and introduces
architecture-specific axes and fail-closed state curves, but it is not the current runtime model.
```

---

## 12. Read next

1. [How the model is built](HOW_THE_MODEL_IS_BUILT.md) -- current evidence through SHIP, plus the separate research boundary.
2. [Model reference](MODEL_REFERENCE.md) -- exact current parameters, fields, proposal identity, and sources.
3. [Cell entrypoint](../README.md) -- canonical and proposed package map.
4. [Current metadata specification](../current/strong_wind_solar_damage_code_metadata_spec__model_v1_0__docs_r1.md).
5. [Current derivation dossier](../current/strong_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md).
6. [Proposed v2 README](../proposed/README_strong_wind_solar__model_v2_0__docs_r1.md) -- research only.

> There is currently no strong-wind × solar notebook. Use the canonical JSON and dossier for v1. The
> proposed package has its own validator/KATs, but those do not authorize runtime promotion.

---

## 13. Version and non-change statement

```text
cell damage-model version:          model v1.0 unchanged
human docs revision:                docs r4
runtime artifact pin:               model v1.0 / docs r3 unchanged
artifact/schema version:            unchanged
R0, R50, k, and max_DR:             unchanged
stow and zone multipliers:          unchanged
failure-unit/value-share records:   unchanged
capability and output meanings:     unchanged
proposed model v2.0 status:         remains noncanonical and blocked
damage-code outputs:                unchanged for identical v1 inputs
```
