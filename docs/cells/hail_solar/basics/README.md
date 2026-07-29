# Hail × Solar Basics

**Start here.** This page explains the hail × solar model in plain language: what hail intensity is measured,
why the curve applies to the PV-module glass/cell failure unit rather than the whole plant, how module
construction selects a curve, how tracker stow conditions an event, and how exposure and value turn the
failure-unit damage ratio into conditional physical loss.

```yaml
cell_id: hail_solar
audience: first-time reader
basics_set_revision: r1
cell_model_version: model v1.0
human_documentation_revision: docs r8
canonical_runtime_documentation_revision: docs r7
canonical_runtime_pin: hail_solar@model_v1_0__docs_r7
canonical_artifact_sha256: 8c52f3442eb606f55aa0502fbb2738df70076f8a181de463c029061020b3cf32
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

All site, module, stow, exposure, and monetary values in the worked example are **illustrative class-template
inputs**. They are not observations for a real solar plant and are not universal defaults.

## How to use this basics folder

| If you want to... | Read |
|---|---|
| Understand the model in plain language | This `README.md` |
| Understand why the model was built this way | [How the model is built](HOW_THE_MODEL_IS_BUILT.md) |
| Look up fields, curves, evidence, capabilities, or versions | [Model reference](MODEL_REFERENCE.md) |
| Audit the governed derivation | [Canonical derivation dossier](../current/hail_solar_curve_derivation_dossier_v1_3.md) |
| Inspect the exact runtime records | [Canonical JSON artifact](../current/hail_solar__model_v1_0__docs_r7__curve_artifact.json) |

The three basics pages are a reader-friendly synthesis. The governed `current/` package and runtime JSON
remain the technical sources of truth. A future Google Drive or DOCX document may use any subset of this
material.

---

## 1. Five ideas to remember

1. **The operational intensity is hail diameter**, specifically MESH-equivalent maximum hail diameter in
   millimetres. It is not event frequency, impact energy flux, or annual loss.
2. **The curve belongs to the PV-module glass/cell failure unit.** It must not be applied directly to the
   entire plant value.
3. **Module construction is a selector.** Fragile thin glass/glass, default glass/backsheet, and supported
   hail-hardened construction use different curve records.
4. **Tracker stow is an event-time conditioner.** `P(stowed)` means the chance the tracker actually reached
   its defensive state when damaging hail arrived; it is not the probability of hail.
5. **Exposure and value come after fragility.** The hail swath fraction and selected value profile determine
   how much value the module DR touches.

---

## 2. What question does the model answer?

For one specified hail event and one specified solar asset, the current cell asks:

```text
How large was the event's MESH-equivalent hail at the array?
    -> Which module archetype is installed?
    -> Was the tracker stowed, unstowed, or uncertain at event time?
    -> What module glass/cell replacement DR follows?
    -> What fraction of the array and module value was actually touched?
    -> What is the conditional direct physical event loss?
```

It does **not** ask for one whole-plant hail damage ratio.

```text
event hail diameter + fixed module attributes + event-time stow state
                                  |
                                  v
                     PV-module failure-unit DR
                                  |
                                  v
           DR × exposed module-value share × swath exposure
                                  |
                                  v
                   conditional direct physical loss
```

Hail frequency, site-hit probability, EAL, PML, insurance terms, business interruption, and portfolio
aggregation remain downstream.

---

## 3. The physical picture

```text
                          hail-producing storm
                    o   O   o   O   o   O
                 o    O   o   O   o   O
                               wind --->
                                  \
                                   \ impact direction

        damaging hail swath         v
     +-------------------------------+
     |  row A   / / / / / /          |  exposed
     |  row B   / / / / / /          |  exposed
     |  row C   / / / / / /          |  exposed
     +-------------------------------+
             row D   / / / / / /        outside swath

     module face: glass -> cells -> backsheet/rear glass
                         ^
                         modeled glass/cell replacement trigger
```

The hazard product supplies a hail-size estimate at a location or footprint. It does not claim that every
stone has the same diameter or that every square metre of the plant receives the same impacts. The
`array_exposure_fraction` separately describes how much module value the damaging swath reaches.

### Diameter is the operational input

```text
mesh_diameter_mm = MESH-equivalent maximum hail diameter at the array
```

The runtime accepts millimetres and supports an inch-to-millimetre source conversion. For example:

```text
2.0 in × 25.4 mm/in = 50.8 mm
```

Diameter is used because operational hail catalogs commonly report hail size. The optional physics bridge is:

```text
diameter D
   -> estimated stone mass m(D)
   -> estimated terminal/reference velocity v(D)
   -> per-stone impact-energy proxy E = 0.5 × m × v²
```

That proxy is **joules per impact**, not joules per square metre of the event. Stone concentration, wind
vector, trajectory, module orientation, and contact-normal energy are not fully resolved in v1.0.

---

## 4. Essential terminology

| Term | Plain-language meaning | Hail × solar example | Common mistake |
|---|---|---|---|
| **Hail diameter** | Width of a hailstone, not its radius. | `50 mm` | Reading `50 mm` as radius or depth. |
| **MESH** | Maximum Estimated Size of Hail, a radar-derived maximum-size product. | MRMS MESH at the array | Treating it as a measured size for every stone. |
| **MESH-equivalent diameter** | Operational model input normalized to millimetres. | `mesh_diameter_mm=50` | Confusing it with hail frequency or footprint. |
| **Observed report** | Human or instrument report of hail size at a place/time. | A 2-inch report near the site | Assuming it exactly represents every array row. |
| **Impact energy** | Energy of one stone based on mass and velocity. | `0.5mv²` bridge | Confusing per-impact energy with areal energy flux. |
| **Glass/glass module** | Cells enclosed between front and rear glass. | Thin 2.0 mm glass/glass archetype | Assuming all glass/glass modules have equal hail resistance. |
| **Glass/backsheet module** | Front glass with a polymer/composite rear backsheet. | Default 3.2 mm glass/backsheet | Treating construction label as exact BOM evidence. |
| **Tempered/heat-strengthened glass** | Glass treatment affecting resistance and breakage behavior. | Module selector metadata | Treating the words as a guaranteed damage curve. |
| **Breakage probability proxy** | Public lab glass-breakage fraction used as module replacement DR. | `DR≈0.39` at 50 mm for default curve | Calling it site failure probability without exposure context. |
| **Damage ratio (DR)** | Direct repair/replacement cost divided by the failure-unit replacement value. | `0.39` of module bucket | Multiplying it by whole-plant TIV. |
| **D50** | Diameter where the logistic curve reaches half its maximum DR. | Default `52.696 mm` | Calling D50 a design or no-damage threshold. |
| **k** | Logistic steepness around the transition. | Default `0.165912/mm` | Treating it as uncertainty or frequency. |
| **Module archetype** | Fixed asset classification selecting a curve family. | fragile/default/hardened | Changing it from event to event. |
| **Stow** | Tracker position intended to reduce event loading/impact. | High-angle hail stow | Confusing a command with confirmed physical position. |
| **Stow state** | Actual event-time tracker state. | stowed, unstowed, uncertain | Treating it as a permanent module property. |
| **P(stowed)** | Probability the tracker was actually stowed when damaging hail arrived. | `0.60` when state is uncertain | Confusing it with hail occurrence probability. |
| **Array exposure fraction** | Fraction of module value reached by damaging hail swath. | `0.72` | Modifying the fragility curve instead of touched value. |
| **Failure unit** | Atomic physical/value record evaluated by one curve. | `PV_MODULE_GLASS_CELL` | Treating the solar plant as the failure unit. |
| **Value profile** | Governed mapping from failure-unit DR to a labeled value denominator. | Direct hardware or Hazard adapter | Treating the profile share as intrinsic fragility. |
| **Installed capex** | Whole installed-cost reporting denominator. | `$1,120/kWdc` reference | Calling every installed-cost item physically damageable. |
| **Physical replaceable base** | Reference physical-damage denominator after excluded value is removed. | `$877.796/kWdc` | Mixing it with installed-capex percentages. |

### Three different probabilities

```text
P(hail event occurs)                 -> Hazard frequency, downstream
P(site/array is hit | event)         -> Spatial exposure/hit model, downstream
P(tracker was stowed | damaging hit) -> Event-time conditioner in this cell
```

They answer different questions and must never be substituted for one another.

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

## 5. Where do the inputs come from?

| Input/evidence | Possible source | Use in the model | Qualification |
|---|---|---|---|
| Hail diameter | NOAA report, MRMS MESH, vendor hazard layer, scenario | Runtime x-axis | Preserve source type, location, time, unit, and resolution. |
| Module construction | BOM, module datasheet, EPC record, procurement ledger | Select archetype | Manufacturer/model alone is not enough without construction evidence. |
| Hail test result | Exact BOM qualification or enhanced hail test report | Potential supported override | Preserve test diameter, velocity, angle, sequence, and failure endpoint. |
| Mounting type | EPC/as-built equipment inventory | Determines whether active stow applies | Fixed tilt generally has no active tracker stow. |
| Tracker position/angle | SCADA position sensor, event log, field observation | Establish event-time state | A command log alone may not confirm attained position. |
| Hail swath footprint | Radar polygon/raster, event reconstruction, scenario | Array exposure | A point or coarse raster cell is not an exact component footprint. |
| Module replacement value | Site valuation ledger, EPC cost split, claims estimate | Failure-unit value basis | Keep module hardware and support allocation explicit. |

Record whether each input is observed, reported, derived, inferred, class-template, or unknown. A generic
module archetype is a class template; it does not prove a specific site's BOM.

---

## 6. Which physical subject is measured?

The current primary unit is:

```text
solar generation asset
`-- PV_ARRAY
    `-- PV_MODULE
        `-- PV_MODULE_GLASS_CELL failure unit
```

The curve represents the front-glass/cell/module replacement trigger. It excludes latent performance loss
that does not lead to physical replacement, and it does not create separate direct curves for every piece of
steel or enclosed electrical equipment.

| Physical subject | Current treatment | Why |
|---|---|---|
| Module glass/cell | Primary nonzero | Direct impact mechanism and material value |
| Tracker/mounting | Conditioner-only for stow; direct steel damage reviewed | Tracker position changes module contact severity |
| Racking structure | Secondary/open | No first-order public direct-hail curve |
| SCADA/met instruments | Optional secondary | Exposed but usually low materiality |
| Inverter/substation | DR≈0 direct hail v1 | Enclosed internals are not exposed like module glass |
| Civil/foundation/drainage | DR≈0 direct hail v1 | Direct hail is not the normal replacement mechanism |

DR≈0 means “reviewed and not assigned a material direct-hail curve in v1,” not “physically indestructible.”

---

## 7. Worked example: diameter, stow, exposure, and value

Illustrative event and site inputs:

```text
MESH-equivalent diameter             = 50 mm
module archetype                     = default 3.2 mm glass/backsheet
stow state                           = unknown/probabilistic
P(stowed | damaging hail arrived)    = 0.60
array exposure fraction              = 0.72
selected value profile               = HAIL_HAZARD_REFERENCE_ADAPTER_V1
illustrative installed capex         = $112.0M
```

### Step 1 -- Select the base curve

```text
DR_unstowed(D)
  = 1 / [1 + exp(-0.165912 × (D - 52.696))]

DR_unstowed(50 mm) = 0.390003
```

### Step 2 -- Evaluate the stowed placeholder

```text
DR_stowed(D)
  = 0.90 / [1 + exp(-0.165912 × (D - (52.696 + 8)))]

DR_stowed(50 mm) = 0.130475
```

### Step 3 -- Blend only because event-time state is uncertain

```text
DR_conditioned
  = 0.60 × 0.130475 + 0.40 × 0.390003
  = 0.234286
```

The `+8 mm` shift and `0.90` cap are T4 placeholders. The example demonstrates current runtime mechanics; it
does not claim tracker-specific calibration.

### Step 4 -- Apply exposure and the named value profile

The selected reference adapter assigns `0.3554318023` of installed capex to the module/support scenario:

```text
installed-capex loss fraction
  = 0.234286 × 0.72 × 0.3554318023
  = 0.059956
  = about 6.00% of installed capex

illustrative conditional loss
  = 0.059956 × $112.0M
  = about $6.72M
```

The same event with the direct-module-hardware profile would use its smaller installed-capex share. The value
profile changes the reported asset-loss view; it does not change the module fragility curve.

---

## 8. What the current model assumes -- and does not assume

### Runtime behavior

```text
mesh_diameter_mm valid range: 0 to 100 mm
curve family:                  three module archetypes
missing archetype:             default curve + DEFAULT_SELECTOR_USED
stow adjustment:               +8 mm D50 and max_DR 0.90 placeholder
array exposure:                default 1.0 for DR-to-value assembly
value profile:                 explicit selection required for asset-loss output
curve-intrinsic spread:        not carried
```

### Not universal defaults

The model does not establish universal module BOM, tracker angle, stow success, hail swath, replacement
policy, support-cost allocation, or site value. Use asset/event evidence whenever available.

### Documented but deferred in v1.0

```text
wind-driven hail contact-normal impact bridge
continuous glass-thickness formula
manufacturer/BOM-specific curves
claims-calibrated replacement policy
latent cracking/performance-loss pathway
tracker-angle-specific stow calibration
curve-intrinsic vulnerability distribution
```

---

## 9. Fail-closed checks

```text
[ ] Is hail size a diameter with a documented unit and source?
[ ] Is MESH/report location and resolution suitable for the array or exposure zone?
[ ] Is the module archetype evidenced, or is the default explicitly flagged?
[ ] Is a hardened curve used only with supporting test/BOM evidence?
[ ] Is stow based on attained event-time position rather than a command alone?
[ ] Is P(stowed) kept separate from event frequency and site-hit probability?
[ ] Is wind-driven hail treated as an open seam rather than silently hidden in diameter?
[ ] Is array exposure based on a footprint/scenario rather than assumed whole-site without a label?
[ ] Is module DR applied only to a module-linked value profile or site-specific value basis?
[ ] Is the loss denominator labeled physical base, installed capex, or named TIV?
[ ] Are deterministic DR and downstream annual/tail uncertainty kept separate?
```

### Frequent mistakes

```text
wrong: 50 mm MESH means every stone at every module was exactly 50 mm
right: it is the operational maximum-size intensity; exposure and residual variability remain

wrong: P(stowed)=0.60 means a 60% chance of hail
right: it means a 60% chance the tracker attained hail stow when damaging hail arrived

wrong: stronger glass lowers event frequency
right: stronger glass selects a different vulnerability curve

wrong: module DR × whole-plant TIV
right: module DR × explicit module/value-profile share × array exposure

wrong: 35.543% is the logistic curve's maximum DR
right: it is an installed-capex cap under one explicit T4 value profile at full module DR/exposure

wrong: the stow placeholder proves all trackers receive the same benefit
right: it is a transparent v1 assumption awaiting tracker/BOM-specific calibration
```

---

## 10. A short explanation to reuse

```text
The hail × solar model converts MESH-equivalent maximum hail diameter into a direct replacement damage
ratio for the PV-module glass/cell failure unit. Fixed module construction selects one of three logistic
archetype curves. Event-time tracker stow can shift and cap the selected curve, although the current numeric
stow effect is a placeholder. The damaging hail swath and an explicit module-linked value profile are then
applied separately, so module damage is never treated automatically as whole-plant damage.
```

---

## 11. Read next

1. [How the model is built](HOW_THE_MODEL_IS_BUILT.md) -- evidence through SHIP, step by step.
2. [Model reference](MODEL_REFERENCE.md) -- exact parameters, KATs, fields, values, and sources.
3. [Cell entrypoint](../README.md) -- current package map.
4. [Metadata specification](../current/damage_code_metadata_spec_hail_solar_v1_3.md) -- governed I/O narrative.
5. [Derivation dossier](../current/hail_solar_curve_derivation_dossier_v1_3.md) -- governed proof trail.
6. [Curation notebook](../../../../notebooks/hail/solar/00_curve_curation_walkthrough.ipynb) and
   [runtime notebook](../../../../notebooks/hail/solar/01_runtime_curve_walkthrough.ipynb) -- saved historical
   teaching companions.

> The notebooks' saved outputs are useful, but their source cells still point to removed legacy paths, load
> the superseded docs-r5 artifact, and retain deprecated value/capability wording. Repair and rerun them before
> treating fresh output as repository-current.

---

## 12. Version and non-change statement

```text
cell damage-model version:       model v1.0 unchanged
human docs revision:             docs r8
runtime artifact pin:            model v1.0 / docs r7 unchanged
artifact/schema version:         unchanged
D50, k, and max_DR:              unchanged
module selector logic:           unchanged
stow conditioner formula:        unchanged
exposure logic:                  unchanged
value profiles and denominators: unchanged
damage-code outputs:             unchanged for identical inputs
```
