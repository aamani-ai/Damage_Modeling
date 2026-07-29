# Wind / Tornado × Wind Basics

**Start here.** This page explains the repository-current wind/tornado × wind-farm model from the ground up:
why gust height and duration matter, how IEC design class changes the speed scale, why a tornado swath is an
exposure question, how the current v1.0 component logistics work, and where the noncanonical v2.0 redesign
fits.

```yaml
cell_id: wind_tornado_wind
audience: first-time reader
basics_set_revision: r1
cell_model_version: model v1.0
human_documentation_revision: docs r5
canonical_runtime_pin: wind_tornado_wind@model_v1_0__docs_r4
canonical_artifact_sha256: 908f386953d062a62a33b6714020374b9b9d8a4538006e80d37047686c2c127a
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

> **Current-versus-proposed warning.** Model v1.0/docs r4 is the only canonical runtime artifact. The
> pathway-aware model v2.0/docs r1 package is a pressure-tested **proposal**, not indexed, released, or
> approved for Hazard execution. This page never substitutes proposed equations for current runtime facts.

> **Hurricane warning.** Neither the current wind/tornado scope nor either proposed v2 pathway is a governed
> tropical-cyclone/hurricane curve. Shared units such as `m/s` do not prove equivalent duration, profile,
> controls, debris, exposure, or damage response.

## How to use this basics folder

| If you want to... | Read |
|---|---|
| Understand the current model in plain language | This `README.md` |
| Understand why v1 was built this way and why v2 was proposed | [How the model is built](HOW_THE_MODEL_IS_BUILT.md) |
| Look up exact parameters, values, validation, or proposal boundaries | [Model reference](MODEL_REFERENCE.md) |
| Audit current governed reasoning | [Current derivation dossier](../current/wind_tornado_wind_curve_derivation_dossier_v1_0.md) |
| Inspect current runtime records | [Canonical JSON artifact](../current/wind_tornado_wind__model_v1_0__docs_r4__curve_artifact.json) |

The three basics pages are a reader-friendly synthesis. The current artifact remains runtime truth. A future
Google Drive or DOCX review document may use a selected subset of this material.

---

## 1. Six ideas to remember

1. **A turbine is tall.** The curve expects a hub-height 3-second gust, not an unqualified 10 m weather value.
2. **IEC class is a design selector, not event intensity.** It supplies the design gust scale `Ve50` used to
   normalize the delivered event gust.
3. **A wind farm is a set of repeated turbines.** Per-turbine severity and the number/fraction of turbines in
   the damaging footprint are separate calculations.
4. **Blade, tower, nacelle, and foundation losses are physically dependent.** Current v1 stores separate
   curves and flags dependency; its simple aggregate is not a final damage-state precedence model.
5. **Current tornado behavior is only a D50 shift on the same logistic family.** It is not a measured
   tornado-on-turbine fragility curve.
6. **The v2 proposal is an upgrade path, not current behavior.** It separates convective outflow and tornado
   direct hit, changes the failure atom and curve form, and explicitly withholds hurricane.

---

## 2. What question does the current model answer?

For one delivered severe-wind or tornado-proxy event, the current cell asks:

```text
How large is the hub-height 3-second gust relative to the selected turbine design gust?
    -> What conditional physical DR does that imply for each turbine failure unit?
    -> What fraction of repeated turbine value lies in the damaging footprint?
    -> What modeled structural loss contribution follows from explicit value shares?
```

It does not begin with one wind speed and apply one DR to full wind-farm TIV.

```text
delivered wind + height bridge + IEC selector
                       |
                       v
                speed ratio r
                       |
          +------------+-------------+-------------+
          v            v             v             v
       blade DR     tower DR      nacelle DR   foundation DR
          |            |             |             |
          +------------+-------------+-------------+
                       |
           matching values x turbine exposure
                       |
                       v
          conditional modeled loss contribution
```

Frequency, occurrence catalogs, annual aggregation, insurance terms, EAL, PML, VaR, and TVaR remain
downstream.

---

## 3. The physical picture

### One turbine

```text
                              blade / rotor
                           \      |      /
                            \     |     /
                             \    |    /
                              [ hub ]
                                 |
                         +---------------+
hub height ------------> |    nacelle    |  yaw, gearbox, generator,
                         +---------------+  converter/control equipment
                                 |
                                 | tower
                                 |
                                 |
grade ___________________________|____________________
                           foundation/base
```

Pitch, yaw, brake, operating, and grid/control states can affect load. Current v1 records several of them as
qualitative conditioners; it does not have sourced universal numerical multipliers for those states.

### A repeated-unit wind farm

```text
o = turbine outside damaging footprint
X = turbine inside damaging footprint

farm row A       o     o     X     X
farm row B       o     X     X     o
farm row C       o     o     o     o
                           \\
                            \\\ damaging swath

4 exposed turbines / 12 total = exposed_turbine_fraction 0.3333
```

The swath changes **how much repeated-unit value is exposed**. It does not automatically make an individual
turbine intrinsically weaker.

---

## 4. Essential terminology

| Term | Plain-language meaning | Wind/tornado × wind use | Common mistake |
|---|---|---|---|
| **3-second gust** | Short-duration average/peak wind definition. | Current event input at hub height. | Mixing it with 1-minute or 10-minute sustained wind. |
| **Hub height** | Height of the rotor center/nacelle above ground. | Reference height of current preferred gust. | Feeding a 10 m gust directly into the curve. |
| **Rotor-effective wind** | Spatially combined wind over the rotor, preserving a chosen load-equivalent meaning. | Preferred in proposed v2 convective/tornado axes. | Calling one point gust rotor-effective automatically. |
| **`Vref`** | IEC 10-minute average reference wind speed at hub height. | Design-class input to `Ve50`. | Treating it as the event gust. |
| **`Ve50`** | IEC bridge to a 50-year extreme 3-second design gust, `1.4 x Vref`. | Current horizontal speed scale. | Calling it a damage threshold or event probability. |
| **Speed ratio `r`** | Delivered hub gust divided by `Ve50`. | Dimensionless current x-axis. | Comparing equal `r` values without checking design class/input provenance. |
| **IEC wind class** | Generic turbine design-environment category. | Selector for `Ve50`; default current archetype is IEC II. | Treating every installed turbine as IEC II observed fact. |
| **D50 ratio** | Ratio at which a logistic reaches half of its `max_DR`. | Current curve transition parameter. | Reading it as 50% whole-plant loss. |
| **`k` ratio** | Logistic steepness on normalized speed ratio. | Controls how rapidly DR rises. | Calling it measured uncertainty. |
| **`max_DR`** | Upper response cap for one failure-unit value bucket. | Blade/tower 1.0, nacelle 0.85, etc. | Applying the cap to full TIV. |
| **Tornado D50 shift** | Negative horizontal shift used by current v1 tornado variant. | Makes current tornado variant rise earlier. | Calling it a tornado-specific calibrated curve. |
| **EF rating** | Damage-estimated tornado wind range based on observed indicators. | Proxy/context input only. | Treating EF as a direct turbine-level wind measurement. |
| **Failure unit** | Physical/value atom evaluated by one curve. | Blade, tower, nacelle, foundation, power electronics. | Treating an EIA generator record as one physical turbine. |
| **Conditioner** | Event-time state that may change response. | Feathering, yaw, operating state. | Hiding unknown state inside the base curve. |
| **Exposure fraction** | Fraction of turbine value/count in the damaging footprint. | Multiplies repeated-unit value after DR. | Using lease overlap as proof every turbine was hit. |
| **Damage ratio** | Direct repair/replacement cost divided by the same unit's value. | Failure-unit physical severity. | Reading it as failure probability or annual loss. |
| **Curve-intrinsic spread** | Uncertainty distribution carried by the vulnerability curve itself. | Not carried in current v1. | Calling deterministic curves a vulnerability distribution. |

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

## 5. From 10 m wind to the current x-axis

### Preferred input

```text
hub_height_3s_gust_mps
```

### Accepted upstream value only with a documented bridge

Power law:

```text
V_hub = V_10m x (hub_height_m / 10)^alpha
```

Log law:

```text
V_hub = V_10m x ln(hub_height_m / z0) / ln(10 / z0)
```

`alpha` or roughness `z0`, bridge method, reference heights, terrain/exposure, and warnings are part of the
lineage. The current artifact contains a default `alpha = 1/7` only with an explicit
`DEFAULT_POWER_LAW_ALPHA_USED` flag. A 10 m input with no hub height and no bridge must not be silently
treated as hub-height wind.

### IEC design bridge

| IEC class | `Vref` m/s | `Ve50 = 1.4 x Vref` m/s |
|---|---:|---:|
| IEC I | 50.0 | 70.0 |
| IEC II | 42.5 | 59.5 |
| IEC III | 37.5 | 52.5 |

Then:

```text
r = hub_height_3s_gust_mps / Ve50_class
```

Example:

```text
hub-height gust = 70.0 m/s
IEC class       = IEC II
Ve50            = 59.5 m/s

r = 70.0 / 59.5 = 1.17647
```

The same 70 m/s produces a smaller ratio for a higher design class and a larger ratio for a lower design
class. This is why IEC class must not be silently defaulted for an observed turbine when better information
exists.

---

## 6. The current v1.0 curves

Current structural curves use:

```text
DR_i(r) = max_DR_i / (1 + exp[-k_i x (r - D50_i)])
```

For the current tornado variant:

```text
D50_tornado = D50_straight + tornado_D50_shift
```

| Failure unit | `max_DR` | Straight D50 | `k` | Tornado shift | Default aggregate? |
|---|---:|---:|---:|---:|---:|
| Blade | 1.00 | 1.38 | 12.0 | -0.10 | Yes |
| Tower | 1.00 | 1.48 | 11.0 | -0.12 | Yes |
| Nacelle | 0.85 | 1.44 | 10.0 | -0.10 | Yes |
| Foundation | 0.65 | 1.62 | 9.0 | -0.08 | Yes |
| Power electronics acceleration | 0.30 | 1.20 | 8.0 | -0.05 | No; open seam |

The first four curves are engineering fits. The power-electronics curve is stored as secondary/conditional
and excluded from the default structural aggregate because acceleration response cannot be inferred reliably
from wind speed alone.

### Current straight-line curve table

| Speed ratio `r` | Blade DR | Tower DR | Nacelle DR | Foundation DR |
|---:|---:|---:|---:|---:|
| 0.8 | 0.09% | 0.06% | 0.14% | 0.04% |
| 1.0 | 1.04% | 0.51% | 1.03% | 0.24% |
| 1.2 | 10.34% | 4.39% | 7.07% | 1.45% |
| 1.4 | 55.97% | 29.32% | 34.11% | 7.89% |
| 1.6 | 93.34% | 78.92% | 70.72% | 29.58% |
| 1.8 | 99.36% | 97.13% | 82.74% | 54.26% |

ASCII blade curve (`#` is approximately five percentage points):

```text
r=0.8     0.09%  |
r=1.0     1.04%  |
r=1.2    10.34%  |##
r=1.4    55.97%  |###########
r=1.6    93.34%  |###################
r=1.8    99.36%  |####################
```

These calculated rows help understanding; the exact runtime parameters, not this rounded table, are
authoritative.

---

## 7. Worked example: one event and partial farm exposure

Assume the **current v1.0** model receives:

```yaml
hub_height_3s_gust_mps: 70.0
iec_wind_class: IEC II
tornado_variant: false
exposed_turbine_fraction: 0.25
```

### Step 1 -- normalize the speed

```text
r = 70.0 / 59.5 = 1.176470588
```

### Step 2 -- evaluate the four default structural units

| Unit | Current DR | Physical-base value share | Full-exposure contribution |
|---|---:|---:|---:|
| Blade | 7.99996% | 17.3% | 1.38399% |
| Tower | 3.42631% | 16.9% | 0.57905% |
| Nacelle | 5.68660% | 34.5% | 1.96188% |
| Foundation | 1.17860% | 6.2% | 0.07307% |
| **Simple current-v1 sum** | -- | **74.9% covered share** | **3.99799%** |

### Step 3 -- apply the repeated-unit exposure fraction

```text
modeled contribution after exposure
    = 3.997989% x 0.25
    = 0.999497% of the stated physical-base denominator
```

If that physical-base denominator were explicitly `$100M`, the illustrative modeled contribution would be
about `$0.9995M`.

This is **not a complete plant loss claim**. It uses only the current four default structural buckets, leaves
power electronics outside the aggregate, and retains the known blade/tower/nacelle/foundation dependency
seam.

### What the current tornado shift would do at the same numeric speed

| Unit | Straight v1 DR | Tornado-shift v1 DR |
|---|---:|---:|
| Blade | 8.00% | 22.40% |
| Tower | 3.43% | 11.72% |
| Nacelle | 5.69% | 13.86% |
| Foundation | 1.18% | 2.38% |

The current shift produces a higher response at equal numeric speed. That comparison demonstrates v1's
mechanics; it does **not** prove physical equivalence between straight-line and tornado demand. The proposed
v2 redesign removes this Boolean-shift architecture and makes pathways first class.

---

## 8. What the current model assumes -- and does not assume

### Current load-bearing assumptions

```text
IEC II is the generic default selector.
Structural response can be represented by design-normalized logistics.
D50 and k values are engineering-fit parameters.
Tornado direct-hit response is a D50 shift plus explicit exposure.
Four structural unit contributions may be summed with a dependency warning.
Power-electronics acceleration is not in the default aggregate.
Conditioner states have no governed universal numeric multiplier.
Curve-intrinsic vulnerability spread is not carried.
```

### Current open seams

```text
measured tornado-on-turbine fragility
blade/tower/nacelle/foundation damage-state precedence
acceleration-specific power-electronics demand
numeric yaw, feather, brake, and operating-state effects
component versus plant value reconciliation
formal event-family routing and hurricane rejection
cell-specific executable known-answer tests
```

---

## 9. Straight-line wind, tornado, and hurricane are not synonyms

```text
CURRENT v1 RUNTIME
    broad severe/straight-line wind on Vhub/Ve50
    tornado represented by a D50 shift on the same family
    no first-class pathway_id

PROPOSED v2, NOT RUNTIME
    straight_line_convective
        downburst, microburst, macroburst, gust front, local derecho outflow

    tornado_direct_hit
        only after Hazard resolves turbine intersection and local demand

EXCLUDED / FUTURE NEIGHBOR
    tropical-cyclone/hurricane wind
    nonconvective synoptic wind and downslope wind in proposed v2
```

Why hurricane is separate:

```text
convective outflow: local transient minutes, outflow/gust-front profile
tornado direct hit: seconds to minutes, rotating vortex, debris, localized track
tropical cyclone:   hours, eyewall/rainbands, sustained veer, grid loss, repeated loading
```

A common `m/s` unit is not a common damage mechanism. Rejecting a route means **not modeled**, not zero
damage.

---

## 10. Fail-closed checks and frequent mistakes

```text
[ ] Is the gust a 3-second value at hub height, or is the height bridge documented?
[ ] Is IEC class/design speed observed or an explicitly flagged default?
[ ] Are speed units and reference heights explicit?
[ ] Is tornado input a qualified speed proxy rather than EF alone?
[ ] Is the event family actually inside this cell's scope?
[ ] Is exposure based on turbine count/points rather than lease-area overlap alone?
[ ] Does each DR apply to its own failure-unit value share?
[ ] Is power electronics excluded from the default current aggregate?
[ ] Are blade/tower/nacelle/foundation dependency warnings retained?
[ ] Are current v1 and proposed v2 equations clearly separated?
[ ] Are annual/tail metrics left to a validated downstream consumer?
```

```text
wrong:  10 m gust = hub-height gust
right:  use delivered hub gust or a documented bridge

wrong:  IEC II is the event severity
right:  IEC II chooses the design scale; the event gust supplies the demand

wrong:  tornado touches 20% of lease area -> 20% of full TIV is exposed
right:  resolve turbine intersection/count and unit-specific values

wrong:  EF4 is a direct measured turbine hub-height wind
right:  EF is damage-estimated context/proxy with transfer uncertainty

wrong:  hurricane wind is covered because the axis is also m/s
right:  hurricane requires a separately governed pathway/cell

wrong:  proposed v2 validation means v2 is current
right:  current runtime remains model v1.0/docs r4 until explicit promotion
```

---

## 11. A short explanation to reuse

```text
The current wind/tornado × wind model converts a documented hub-height 3-second gust into a ratio to the
selected IEC design gust, then evaluates separate logistic curves for blade, tower, nacelle, foundation, and
a secondary power-electronics pathway. Farm exposure is applied through the fraction or count of turbines in
the damaging footprint, not by changing per-turbine fragility.

The current tornado option is only an engineering D50 shift, and the curves carry no intrinsic vulnerability
distribution. A pathway-aware v2 redesign exists as a noncanonical proposal. Hurricane/tropical-cyclone wind
is not a governed output of either branch.
```

---

## 12. Read next

1. [How the model is built](HOW_THE_MODEL_IS_BUILT.md) -- current evidence-to-SHIP path and proposal rationale.
2. [Model reference](MODEL_REFERENCE.md) -- exact current parameters, fields, validation gaps, and proposal tables.
3. [Cell entrypoint](../README.md) -- canonical/proposed package map.
4. [Current metadata specification](../current/wind_tornado_wind_damage_code_metadata_spec_v1_0.md) -- human-readable interface.
5. [Current derivation dossier](../current/wind_tornado_wind_curve_derivation_dossier_v1_0.md) -- governed proof trail.
6. [M2 height-bridge handoff](../../../contracts/hazard_handoff/wind_tornado_wind_m2_height_bridge.md) -- current 10 m/hub seam.
7. [Proposed v2 entrypoint](../proposed/README_wind_tornado_wind__model_v2_0__docs_r1.md) -- clearly noncanonical redesign.
8. [Proposed hurricane boundary](../proposed/HURRICANE_AND_NEIGHBORING_WIND_BOUNDARY_wind_tornado_wind__model_v2_0__docs_r1.md) -- neighboring-hazard rules.

---

## 13. Version and non-change statement

```text
cell damage-model version:  model v1.0 unchanged
human docs revision:        docs r4 -> docs r5
runtime artifact pin:       model v1.0 / docs r4 unchanged
artifact/schema version:    bundle v2 unchanged
curve forms and parameters: unchanged
height/IEC bridge behavior: unchanged
selector/conditioner logic: unchanged
exposure/value behavior:    unchanged
proposed model v2.0:        remains noncanonical and unpromoted
damage-code outputs:        unchanged for identical current-v1 inputs
```
