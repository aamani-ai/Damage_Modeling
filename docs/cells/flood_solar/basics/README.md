# Flood × Solar Basics

**Start here.** This page explains the flood × solar model from the ground up: what is being measured,
where equipment height enters, why one site flood depth is not enough, and how local water depth becomes a
failure-unit damage ratio and conditional physical loss.

```yaml
cell_id: flood_solar
audience: first-time reader
basics_set_revision: r1
cell_model_version: model v1.0
human_documentation_revision: docs r5
canonical_runtime_pin: flood_solar@model_v1_0__docs_r4
canonical_artifact_sha256: a08e77ef034e1ecea3e7cd05d13c825921b54d610fca9de8651ebda8e857082d
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

All numbers in the worked examples are **illustrative class-template inputs**. They are not surveyed facts
for a real solar site and are not universal equipment-height or value defaults.

## How to use this basics folder

| If you want to... | Read |
|---|---|
| Understand the model in plain language | This `README.md` |
| Understand why the model was built this way | [How the model is built](HOW_THE_MODEL_IS_BUILT.md) |
| Look up fields, curves, evidence, capabilities, or versions | [Model reference](MODEL_REFERENCE.md) |
| Audit the governed derivation | [Canonical derivation dossier](../current/flood_solar_curve_derivation_dossier_v1_0.md) |
| Inspect the exact runtime records | [Canonical JSON artifact](../current/flood_solar__model_v1_0__docs_r4__curve_artifact.json) |

The three basics pages are a reader-friendly synthesis. The governed `current/` package remains the technical
source of truth. A future Google Drive or DOCX document may use any subset of this material.

---

## 1. Five ideas to remember

1. **Ground elevation is an absolute position**, measured from a vertical reference surface; it is not a
   hole below the ground being walked on.
2. **Equipment height is relative to local ground.** Add it to ground elevation to obtain the equipment's
   absolute critical elevation.
3. **The model measures water above the first vulnerable point**, not merely water above the site ground.
4. **Each failure unit has its own curve and value bucket.** Do not apply an inverter damage ratio to the
   entire plant value.
5. **The current curves are screening-grade engineering parameterizations.** The mechanisms and form are
   source-anchored; most exact electrical ordinates are T3 and the foundation/scour proxy is T4.

---

## 2. What question does the model answer?

For one specified flood event and one specified solar asset, the model asks:

```text
How far did water rise above each component's first vulnerable point?
    -> What physical damage ratio does that local intensity imply?
    -> What component value was actually exposed?
    -> What is the conditional physical loss for this event?
```

It does **not** begin with one site flood depth and apply one damage ratio to the whole plant. An inverter,
switchgear cabinet, transformer control section, combiner box, SCADA cabinet, cable pull box, PV-module
lower edge, and foundation can experience different conditions during the same event.

```text
event water level + component geometry
                 |
                 v
local intensity at each failure unit
                 |
                 v
failure-unit curve -> damage ratio (DR)
                 |
                 v
DR x value bucket x fraction exposed
                 |
                 v
conditional physical event loss
```

Frequency, EAL, PML, insurance terms, business interruption, repair downtime, and portfolio aggregation
remain downstream.

---

## 3. The physical picture

The preferred calculation compares absolute elevations measured from one common vertical reference:

```text
                    common vertical datum

elevation
  (m)
101.10  ---------- PV-module lower edge
101.00  ~~~~~~~~~~ event water surface (WSE)
100.92  ---------- SCADA vulnerable opening
100.84  ---------- switchgear vulnerable opening
100.72  ---------- inverter vulnerable opening
100.65  ---------- transformer control/terminal point
100.55  ---------- combiner-box vulnerable opening
100.35  ---------- cable pull-box/conduit pathway
100.00  __________ finished ground / grade, illustrative
  0.00  ========== vertical datum origin
```

The `100.00 m` ground elevation means the walking surface is 100 m above the selected datum origin. It does
**not** mean that the ground lies 100 m beneath the visible surface.

### Absolute-elevation method -- preferred

Use this when water and equipment elevations share one documented vertical datum:

```text
local_depth_i = max(0, WSE - z_i_crit)
```

```text
WSE       = absolute water-surface elevation
z_i_crit  = absolute elevation of component i's first vulnerable point
```

### Height-above-grade method -- accepted fallback

Use this when the hazard input is water depth above local ground:

```text
local_depth_i = max(0, site_flood_depth - component_critical_height_above_grade_i)
```

The two methods agree when their ground point, unit, and reference are compatible:

```text
component critical elevation = ground elevation + critical height above grade
site flood depth             = WSE - ground elevation

ground elevation                         = 100.00 m
inverter critical height above grade     =   0.72 m
inverter critical elevation              = 100.72 m
WSE                                      = 101.00 m

absolute method:  101.00 - 100.72        =   0.28 m
relative method:    1.00 -   0.72        =   0.28 m
```

---

## 4. Essential terminology

| Term | Plain-language meaning | Flood × solar example | Common mistake |
|---|---|---|---|
| **Vertical datum** | Shared zero/reference surface for elevations. | NAVD88 or surveyed project datum | Comparing values that are both in metres but use different datums. |
| **Ground elevation** | Absolute elevation of the relevant ground surface. | `100.00 m` | Using one site-wide value across sloping or graded terrain. |
| **Finished grade** | Ground after construction and grading. | Grade beside an inverter pad | Substituting pre-construction terrain. |
| **Water-surface elevation (WSE)** | Absolute elevation of floodwater. | `101.00 m` | Calling WSE a depth. |
| **Site flood depth** | Water height above local ground. | `101.00 - 100.00 = 1.00 m` | Applying it unchanged to every component. |
| **Component critical point** | First vulnerable opening, terminal, control section, lower edge, or pathway. | Inverter bottom vent | Using the equipment top, center, or pad automatically. |
| **Component critical elevation** | Absolute elevation of the critical point. | `100.72 m` | Mixing it with WSE from another reference. |
| **Critical height above grade** | Distance from local ground to the critical point. | `0.72 m` | Treating it as an absolute elevation. |
| **Local depth above component datum** | Water height above that critical point. | `0.28 m` | Treating it as whole-site depth or total submersion. |
| **Freeboard** | Positive vertical margin between a design water level and a critical point. | Opening 0.30 m above design WSE | Calling it stronger intrinsic fragility. |
| **Inundation** | Water reaching or covering the modeled subject. | Water enters switchgear | Assuming the entire site is submerged. |
| **Flood duration** | Time water remains above a defined threshold. | `8 hr` | Assuming duration has a numeric v1.0 modifier. |
| **Flow velocity** | Speed of moving water. | `1.6 m/s` | Treating it as water depth. |
| **Scour** | Erosion/removal of supporting soil by moving water. | Soil removed around piles | Using the generic proxy as site geotechnical analysis. |
| **Damage ratio (DR)** | Repair/replacement cost divided by the failure-unit replacement value. | `0.50` means 50% of that value bucket | Reading it as failure probability unless explicitly defined that way. |
| **Failure unit** | Atomic record evaluated by one governed curve. | `FS_INV` | Treating the entire plant as one failure unit. |
| **Value bucket** | Replacement-value denominator linked to one failure unit. | Inverter equipment value | Applying DR to total plant TIV. |
| **Exposure fraction** | Fraction of that value bucket reached by the event. | `0.80` of inverter value | Changing fragility instead of scaling touched value. |

### Evidence/status words used in the examples

| Status | Meaning |
|---|---|
| **Observed** | Measured or directly recorded for the actual asset/site, with source and date. |
| **Designed** | Taken from an approved design, drawing, or specification; it may still need as-built confirmation. |
| **Derived** | Calculated from documented inputs and a reproducible transformation. |
| **Class-template** (`class_template`) | Representative class-level assumption used for screening or teaching, not claimed as site fact. |
| **Placeholder** | Temporary explicit value or rule awaiting better evidence; never silently promoted to fact. |
| **Unknown** | Not established from available evidence. Unknown is preferable to invented precision. |

### Same unit, different quantities

All of these may be in metres, but they are not interchangeable:

| Quantity | Reference | Meaning |
|---|---|---|
| `ground_elevation_m` | Vertical datum | Absolute ground position |
| `water_surface_elevation_m` | Same vertical datum | Absolute water position |
| `component_critical_elevation_m` | Same vertical datum | Absolute vulnerable-point position |
| `component_critical_height_above_grade_m` | Local ground | Equipment geometry |
| `site_flood_depth_m` | Local ground | Water above walking surface |
| `local_depth_above_component_datum_m` | Component critical point | Curve-driving local water depth |

In the runtime field name, **component datum** means the component-specific critical point. It is not the
same thing as the dataset's **vertical datum**.

---

## 5. Where do ground and equipment elevations come from?

| Record or dataset | What it may represent | How to use it |
|---|---|---|
| Surveyed as-built points/surface | Finished grade, pads, benchmarks, equipment | Preferred when datum and survey date are known |
| EPC/civil grading model | Designed or as-built grade | Strong if revision/status and datum are controlled |
| Bare-earth DTM/DEM | Approximate terrain | Screening only; may miss pads, channels, and small grade changes |
| DSM/surface model | Vegetation, structures, panels, or terrain tops | Do not assume it is bare ground |
| GNSS equipment measurement | Point elevation, sometimes ellipsoidal | Confirm vertical reference before combining with WSE |
| Global/default equipment height | Class-template assumption | Never present as observed site geometry |

Preserve the subject/location, datum, unit, date, source, resolution, accuracy, and transformation. Resolution,
precision, and accuracy are different: a 1 m raster cell is not automatically accurate to 1 m.

---

## 6. Which point is measured on each component?

The point follows the physical failure mechanism, not whichever dimension is easiest to find.

| Failure unit | Candidate critical point for the depth pathway | Qualification |
|---|---|---|
| Inverter | Lowest vent, door seal, cable entry, or control/electronics section | Pad elevation alone may not equal entry elevation. |
| Switchgear | Lowest opening, breaker/control section, or cable entry | Indoor/control-house configurations may differ. |
| Transformer | Controls, terminals, bushings, or another vulnerable section | Construction and salvageability matter. |
| Combiner/DC protection | Lowest enclosure opening or sensitive-device elevation | Outdoor rating does not automatically mean submersion resistance. |
| SCADA/monitoring | Cable entry or lowest electronic/control section | Contamination can matter. |
| Cable/conduit | Pull box, splice, termination, trench, or conduit entry | Water may travel to nominally elevated equipment. |
| PV module | Lower module edge for direct submersion | Debris impact is a different/additional mechanism. |
| Foundation/pile | No ordinary cabinet-style datum | Use velocity/scour and site hydraulic/geotechnical information. |

Unknown is preferable to invented precision. Record which point was selected and why.

---

## 7. Worked example: one event, several local depths

The following is an educational class-template example:

```text
event WSE                    = 101.00 m
local ground elevation      = 100.00 m
site flood depth            =   1.00 m
```

| Failure unit | Critical height above grade | Critical elevation | Local depth |
|---|---:|---:|---:|
| Cable/pull-box pathway | 0.35 m | 100.35 m | 0.65 m |
| Combiner/DC enclosure | 0.55 m | 100.55 m | 0.45 m |
| Transformer controls | 0.65 m | 100.65 m | 0.35 m |
| Inverter opening | 0.72 m | 100.72 m | 0.28 m |
| Switchgear opening | 0.84 m | 100.84 m | 0.16 m |
| SCADA opening | 0.92 m | 100.92 m | 0.08 m |
| PV-module lower edge | 1.10 m | 101.10 m | 0.00 m |

```text
101.10 m  ----- module lower edge                 local depth = 0.00 m
101.00 m  ~~~~~ water surface ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
100.92 m  ----- SCADA opening                     local depth = 0.08 m
100.84 m  ----- switchgear opening                local depth = 0.16 m
100.72 m  ----- inverter opening                  local depth = 0.28 m
100.65 m  ----- transformer controls              local depth = 0.35 m
100.55 m  ----- combiner opening                  local depth = 0.45 m
100.35 m  ----- cable/pull-box pathway            local depth = 0.65 m
100.00 m  _____ ground being walked on _____________________________
```

### From local depth to inverter DR

The canonical inverter curve has neighboring points:

```text
0.15 m -> DR 0.75
0.30 m -> DR 0.95
```

At `0.28 m`, piecewise-linear interpolation gives:

```text
position = (0.28 - 0.15) / (0.30 - 0.15) = 0.8667
DR       = 0.75 + 0.8667 x (0.95 - 0.75) = 0.9233
```

This is a deterministic physical DR, not a 92.33% probability of failure.

If the illustrative inverter value bucket is `$12,000,000` and 80% is exposed:

```text
conditional loss = DR x value x fraction exposed
                 = 0.9233 x $12,000,000 x 0.80
                 = $8,864,000
```

The full eight-unit example and value assembly are in the [model reference](MODEL_REFERENCE.md#9-complete-illustrative-event-assembly).

---

## 8. What the current model assumes -- and does not assume

### Runtime inputs

```text
preferred:
    water_surface_elevation_m
    component_critical_elevation_m

or fallback:
    site_flood_depth_m
    component_critical_height_above_grade_m

and, when the corresponding result is requested:
    fraction_value_exposed for scenario-loss assembly
    flow_velocity_mps only when FS_FOUND is evaluated
```

### Not universal defaults

The model does not establish universal inverter, switchgear, transformer, combiner, SCADA, module, ground,
or WSE values. Notebook/workbook values are illustrative and must not silently become production metadata.

### Documented but not universally numerical in v1.0

```text
duration
salinity / contamination
energized or shutdown state
conduit routing
enclosure and transformer variants
flood-defense performance
site-specific foundation scour
```

For the exact treatment, tiers, and update triggers, use the [model reference](MODEL_REFERENCE.md).

---

## 9. Fail-closed checks

Do not calculate local depth until these are answered or explicitly flagged:

```text
[ ] Are WSE and component elevation in the same vertical datum/reference?
[ ] Are both in the same unit?
[ ] Do both describe the same supported horizontal location/grain?
[ ] Does the ground record represent finished/as-built grade?
[ ] Is the component point the physically relevant vulnerable point?
[ ] Is each input observed, designed, derived, class-template, or unknown?
[ ] Are date, resolution, accuracy, and transformation known?
[ ] Could a conduit or alternate water path bypass the apparent elevation?
[ ] Is a foundation/civil mechanism being forced incorrectly onto the depth axis?
[ ] Is the value denominator the failure unit rather than whole-plant TIV?
```

If datum compatibility or input grain is unknown, fail closed rather than produce precise-looking nonsense.

### Frequent mistakes

```text
wrong: 1.0 m site depth -> every component gets x = 1.0 m
right: subtract each component's critical height/elevation

wrong: WSE in NAVD88 - equipment elevation in an undocumented local datum
right: transform both to one documented reference first

wrong: pad elevation automatically equals inverter critical elevation
right: identify the vent/entry/electronics point that triggers the mechanism

wrong: notebook height 0.72 m -> all inverter openings are 0.72 m high
right: retain 0.72 m as illustrative until site evidence supplies the real value

wrong: higher equipment -> intrinsically stronger equipment curve
right: higher equipment -> smaller local x; the intrinsic curve need not change

wrong: inverter DR x total project TIV
right: inverter DR x inverter value bucket x inverter exposure fraction
```

---

## 10. A short explanation to reuse

```text
Ground elevation is the elevation of the walking surface measured from a common vertical reference.
Equipment height is the relative distance from that ground to a component's first vulnerable point.
Adding them gives the component's absolute critical elevation. Subtract that elevation from the event
water-surface elevation to obtain the local water depth that enters the component damage curve.

One flood event therefore creates different local depths and damage ratios across the same solar site.
Every example height remains illustrative until survey, EPC, as-built, or equivalent evidence supplies
the real geometry.
```

---

## 11. Read next

1. [How the model is built](HOW_THE_MODEL_IS_BUILT.md) -- evidence through SHIP, step by step.
2. [Model reference](MODEL_REFERENCE.md) -- exact curves, fields, capabilities, examples, and sources.
3. [Cell entrypoint](../README.md) -- current package map.
4. [Metadata specification](../current/flood_solar_damage_code_metadata_spec_v1_0.md) -- governed I/O narrative.
5. [Derivation dossier](../current/flood_solar_curve_derivation_dossier_v1_0.md) -- governed proof trail.
6. [Curation notebook](../../../../notebooks/flood/solar/00_curve_curation_walkthrough.ipynb) and
   [runtime notebook](../../../../notebooks/flood/solar/01_runtime_curve_walkthrough.ipynb) -- saved teaching/review companions.

> The notebooks' saved outputs are useful, but they are not currently fresh-run references: source cells
> still point to removed `docs/damage_curves/` / docs-r3 paths and read the former capability-v1
> `metrics_supportable` key instead of the capability-v2 `consumer_annual_metrics` and
> `vulnerability_emit` structure. Repair both issues before relying on a new execution.

---

## 12. Version and non-change statement

```text
cell damage-model version:  model v1.0 unchanged
human docs revision:        docs r4 -> docs r5
runtime artifact pin:       model v1.0 / docs r4 unchanged
artifact/schema version:    unchanged
curve forms and parameters: unchanged
selector logic:             unchanged
conditioner logic:          unchanged
exposure logic:             unchanged
value mapping:              unchanged
damage-code outputs:        unchanged for identical inputs
```
