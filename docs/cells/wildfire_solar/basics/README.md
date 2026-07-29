# Wildfire × Solar Basics

**Start here.** This page explains the released wildfire × solar screening model in plain language: what an
FSim flame-length class means, why burn probability stays outside the damage curve, how one categorical fire
state produces ten different failure-unit damage ratios, and why those ratios must be applied to matching
value buckets rather than whole-plant value.

```yaml
cell_id: wildfire_solar
audience: first-time reader
basics_set_revision: r1
cell_model_version: model v1.0
human_documentation_revision: docs r4
canonical_runtime_pin: wildfire_solar@model_v1_0__docs_r3
canonical_artifact_sha256: 598512fbe2f0a3c8db48df69fdb2cd00ca5e0cc8e7ef761555837a3d76d166d8
model_grade: screening_engineering_proxy
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

> **Read the grade before the number.** The six hazard states, physical mechanisms, value basis, and
> endpoint logic are source-constrained. The exact class-to-damage ordinates are explicit Tier 4 engineering
> judgments. This is a transparent screening model, not a field- or claims-calibrated site appraisal.

## How to use this basics folder

| If you want to... | Read |
|---|---|
| Understand the model without repository jargon | This `README.md` |
| Understand the evidence-to-runtime reasoning | [How the model is built](HOW_THE_MODEL_IS_BUILT.md) |
| Look up exact states, curves, values, flags, tests, or versions | [Model reference](MODEL_REFERENCE.md) |
| Audit the governed reasoning | [Canonical derivation dossier](../current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md) |
| Inspect the exact runtime payload | [Canonical JSON artifact](../current/wildfire_solar__model_v1_0__docs_r3__curve_artifact.json) |

The three basics pages are a reader-friendly synthesis. The governed `current/` package remains the
technical source of truth. A later Google Drive or DOCX review document may use any subset of these pages.

---

## 1. Six ideas to remember

1. **FSim burn probability is frequency, not damage.** It belongs in the downstream Hazard frequency layer.
2. **The curve receives a conditional flame-length class, not local equipment heat flux.** The class is a
   source-native regional screening state.
3. **The states are categorical.** State 4 is looked up exactly; it is not interpolated between states 3 and
   5, and the open-ended `>=12 ft` class has no invented midpoint.
4. **Each physical failure unit has its own state table.** Cable and SCADA can be more heat-sensitive than
   foundations or metallic racking.
5. **A failure-unit DR applies only to that unit's value bucket.** Support cost is allocated once; soft and
   nonphysical costs are excluded from the physical denominator.
6. **Every result must carry the screening limitations.** The numbers are useful for regional screening,
   ranging, sensitivity work, and integration development—not claims settlement or adaptation credit.

---

## 2. What question does the model answer?

For a modeled wildfire occurrence, the current cell asks:

```text
Given one exact FSim conditional flame-length class,
what direct physical repair/replacement ratio should be assigned
to each of ten solar failure units in the reference screening archetype?
```

It then permits an optional value assembly:

```text
burn probability                         downstream frequency; not M3 curve input
       |
       v
conditional FSim class or six-bin FLP vector
       |
       v
exact categorical lookup for each failure unit
       |
       v
failure-unit DR x matching failure-unit value
       |
       v
allocate replacement support cost once
       |
       v
conditional physical-base and installed-CAPEX loss fractions
```

The cell models direct physical destruction from an **external geographic wildfire**. It does not model
smoke/ash derating, cleaning, PSPS, business interruption, equipment-origin fire, battery thermal runaway,
post-fire erosion, insurance terms, or annual frequency.

---

## 3. Essential wildfire terminology

| Term | Plain-language meaning | Correct use here | Common mistake |
|---|---|---|---|
| **Wildfire occurrence** | One exogenous landscape-fire event. | The event whose conditional severity is evaluated. | Mixing equipment-origin fire into the same curve. |
| **Burn probability (BP)** | Probability that the landscape cell burns over the modeled period. | Hazard frequency input downstream. | Multiplying BP into a conditional M3 damage record. |
| **Conditional flame-length probability (FLP)** | Probability of each flame-length bin, given that burning occurs. | Six probabilities that sum to one. | Treating them as six independent event probabilities. |
| **FSim class** | One source-native conditional flame-length bin. | Exact class ID supplied or sampled by Hazard. | Replacing the class with a midpoint. |
| **State index** | Internal integer `1..6` used only to locate a class row. | Exact lookup key. | Treating the index spacing as physical distance. |
| **State 0** | Damage-code control for `no_event`. | Returns zero for all ten units. | Calling it a seventh FSim class. |
| **Flame length** | A fire-behavior descriptor related to local fire intensity. | Source-native FSim class semantics. | Claiming it is measured at the inverter or cable. |
| **Fireline intensity** | Fire energy release per unit flame-front length, often `kW/m`. | Context only in this model. | Treating `kW/m` as incident equipment heat flux `kW/m2`. |
| **Heat flux** | Energy arriving per unit equipment surface area, often `kW/m2`. | Future local-attack input candidate. | Deriving it from FSim class with an unsupported universal converter. |
| **Local attack** | Flame contact, radiant/convective heating, embers, geometry, distance, wind, and duration at equipment. | Integrated implicitly into the v1 screening ordinate. | Assuming a burned landscape pixel means uniform whole-site attack. |
| **Damage ratio (DR)** | Direct repair/replacement cost divided by the same failure unit's pre-event replacement value. | `0.18` means 18% of that unit's value. | Reading it as an 18% failure probability or 18% of plant TIV. |
| **Failure unit** | The atomic physical/value record evaluated by one table. | Module, inverter, exposed cable, etc. | Using one hidden whole-plant curve. |
| **Value bucket** | Replacement-value denominator matched to one failure unit. | Inverter DR × inverter value. | Applying inverter DR to installed CAPEX. |
| **Screening proxy** | An approximate, explicit engineering representation for comparison/ranging. | Correct grade for v1.0. | Calling the values empirical fragilities. |
| **Calibration** | Fitting/validating parameters against endpoint-matched field, test, forensic, or claims data. | A future upgrade need. | Assuming public mechanism evidence calibrates exact ordinates. |
| **Sensitivity stress** | Deliberately changed inputs to see response. | The documented `0.6x/1.5x` stress. | Calling the stress range a confidence interval. |

`kW/m` and `kW/m2` are deliberately written plainly above because the essential point is their different
physical denominators. Equal-looking power units do not make them interchangeable quantities.

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

## 4. The categorical intensity ladder

FSim supplies six conditional classes. The runtime maps the class ID to one exact state:

```text
state 0   no_event control                    not an FSim class
state 1   lt_2_ft                [ < 2 ft )
state 2   gte_2_lt_4_ft          [ 2, 4 ft )
state 3   gte_4_lt_6_ft          [ 4, 6 ft )
state 4   gte_6_lt_8_ft          [ 6, 8 ft )
state 5   gte_8_lt_12_ft         [ 8, 12 ft )
state 6   gte_12_ft              [ 12 ft, open ended )
```

The brackets show interval logic: a value at 4 ft belongs in state 3, not state 2. More importantly, the
runtime receives the **class ID**, not a reconstructed continuous flame length.

```text
wrong:  state 4 -> choose 7 ft -> calculate fireline intensity -> calculate heat flux
right:  gte_6_lt_8_ft -> exact state 4 lookup in each governed failure-unit table
```

If Hazard supplies a complete six-bin conditional probability vector instead, the model evaluates every
state and computes the probability-weighted DR **given burn**. Burn probability still remains separate.

---

## 5. What physically gets modeled?

```text
utility-scale solar plant
|
+-- PV array
|   +-- PV modules                         primary nonzero screening response
|   +-- tracker/racking                    secondary nonzero response
|   +-- piles and inverter pads            reviewed low nonzero response
|
+-- inverter and DC system
|   +-- central inverter                   primary nonzero response
|   +-- combiner boxes                     primary nonzero response
|   +-- exposed AC/DC cable                primary; protected value must be removed
|
+-- medium-voltage/substation equipment
|   +-- transformer and switchgear         primary nonzero response
|
+-- controls and protection
|   +-- grounding/lightning protection     reviewed low nonzero response
|   +-- SCADA/communications               secondary nonzero response
|
+-- direct civil bucket
    +-- fencing, roads, buildings, prep    mixed screening bucket
```

This is a **class template**, not proof that a particular solar site contains exactly this configuration or
that all its cable is exposed. A site inventory must preserve observed equipment, routing, value, geometry,
and protection state rather than silently inheriting the template.

### Why the curves differ

```text
more heat-sensitive in severe states
    exposed polymer cable, small electronics, combiner contents, SCADA

middle response
    inverter, transformer/switchgear, PV modules

lower response
    metallic racking, grounding, piles/pads
```

Lower response does not mean automatic immunity. It means the current screening table assigns a smaller
same-unit expected replacement ratio.

---

## 6. What does the current model produce?

The table below is the reference aggregate after ten unit-level lookups and value assembly. It is a useful
summary, but it is **not** a hidden whole-plant curve.

| Conditional FSim class | Physical-base DR | Installed-CAPEX DR |
|---|---:|---:|
| `<2 ft` | 0.1681% | 0.1318% |
| `2-<4 ft` | 0.8230% | 0.6450% |
| `4-<6 ft` | 3.4522% | 2.7056% |
| `6-<8 ft` | 11.2131% | 8.7882% |
| `8-<12 ft` | 29.9249% | 23.4535% |
| `>=12 ft` | 58.3104% | 45.7006% |

ASCII view (`#` is approximately two percentage points of physical-base DR):

```text
<2 ft       0.17%  |
2-<4 ft     0.82%  |
4-<6 ft     3.45%  |##
6-<8 ft    11.21%  |######
8-<12 ft   29.92%  |###############
>=12 ft    58.31%  |#############################
```

The installed-CAPEX percentage is lower because physical replaceable value is only `78.3746%` of the
reference installed-CAPEX denominator. The dollar loss is the same; only the denominator changes.

---

## 7. Worked example: exact state 4

Assume Hazard supplies:

```yaml
conditional_flame_length_class: gte_6_lt_8_ft
value_profile_id: WILDFIRE_SOLAR_REFERENCE_100MWDC_V1
reference_capacity: 100 MWdc
```

### Step 1 -- map the class exactly

```text
gte_6_lt_8_ft -> state 4
```

Do not convert the class to `7 ft`; no midpoint is evaluated.

### Step 2 -- look up one failure unit

The inverter state-4 ordinate is `0.18`:

```text
inverter failure-unit DR = 18%
reference inverter value = 32.306366 USD/kWdc
100 MWdc                = 100,000 kWdc

inverter loss = 0.18 x 32.306366 x 100,000
              = $581,514.60
```

That 18% is not applied to the module, cable, physical-base, or installed-CAPEX denominator.

### Step 3 -- repeat for all ten units and allocate support once

For state 4, the governed reference assembly gives:

```text
direct + civil loss                     $7.7169M
support allocated once                  $2.1259M
total conditional physical loss         $9.8428M

physical replaceable denominator       $87.7796M
physical-base DR                           11.2131%

installed-CAPEX denominator            $112.0000M
installed-CAPEX DR                          8.7882%
```

```text
same dollar loss / different denominators

$9.8428M / $87.7796M  = 11.2131% physical-base DR
$9.8428M / $112.0000M =  8.7882% installed-CAPEX DR
```

The complete ten-unit ordinate and value tables are in the [model reference](MODEL_REFERENCE.md).

---

## 8. Site controls: relevant, but not automatic discounts

These conditions can affect real wildfire attack:

```text
vegetation and fuel continuity
setback and component distance
barrier material, height, gaps, and line of sight
wind, slope, flame geometry, and ember bypass
cable burial or conduit protection
enclosure construction
suppression and firefighter access
de-energization and post-event inspection
```

In model v1.0 they carry **no universal numeric credit**. Guidance supports their causal relevance but does
not supply one transferable multiplier. Unknown mitigation receives no credit. Verified buried/protected
cable is handled by removing that value from the exposed-cable value profile, not by discounting both value
and DR.

---

## 9. Fail-closed checks and frequent mistakes

Before accepting a result, ask:

```text
[ ] Is the input an exact recognized class or a complete six-bin FLP vector?
[ ] Are all FLPs between 0 and 1 and do they sum to one?
[ ] Has burn probability stayed in the frequency layer?
[ ] Is interpolation or a midpoint conversion disabled?
[ ] Does each DR use its matching failure-unit value?
[ ] Is exposed versus buried/protected cable value explicit?
[ ] Is mixed civil value understood rather than treated as pure support?
[ ] Is support cost allocated exactly once?
[ ] Are screening and not-calibrated flags preserved?
[ ] Is the requested use screening/ranging rather than appraisal or claims settlement?
```

```text
wrong:  state 6 means 15 ft because the open-ended class needs a number
right:  state 6 is exact gte_12_ft categorical lookup

wrong:  FSim class is local inverter heat flux
right:  local attack heterogeneity is integrated into a Tier 4 screening ordinate

wrong:  80% inverter DR x total project TIV
right:  80% inverter DR x inverter value, followed by governed assembly

wrong:  burn probability x DR inside the failure-unit curve call
right:  conditional DR in Damage Modeling; frequency/event aggregation in Hazard

wrong:  a firebreak or wall always reduces DR by a fixed percentage
right:  no credit without a qualified transfer/control model

wrong:  0.6x to 1.5x sensitivity range is an uncertainty distribution
right:  it is an unweighted scenario stress only
```

---

## 10. Current model versus preserved research history

```text
model v0.1 / docs r1-r2
    research scaffold
    zero runtime curves
    rejected midpoint -> fireline intensity -> logistic proxy chain
    status now: superseded audit history

model v1.0 / runtime docs r3
    released repository-current screening model
    exact FSim categorical state tables
    ten failure units + explicit value linkage + executable KATs
    status now: canonical runtime

future calibrated model
    local attack, BOM, field/claims disposition, site controls, uncertainty
    status now: not delivered
```

The v0.1 rejection was not erased. It explains why v1.0 uses categorical state tables and why its Tier 4
absolute ordinates are labeled so prominently.

---

## 11. A short explanation to reuse

```text
The wildfire × solar model does not turn a regional FSim class into local equipment heat flux. It takes one
exact conditional flame-length class, looks up a separate screening damage ratio for each of ten physical
failure units, applies each ratio only to the matching value bucket, and allocates support cost once.

Burn probability remains in the downstream frequency model. The current ordinates are explicit Tier 4
engineering judgments constrained by public evidence, so every output must remain labeled as screening and
not field- or claims-calibrated.
```

---

## 12. Read next

1. [How the model is built](HOW_THE_MODEL_IS_BUILT.md) -- evidence, grain, axis, form, assembly, emit, and SHIP.
2. [Model reference](MODEL_REFERENCE.md) -- exact tables, fields, KATs, values, flags, and sources.
3. [Cell entrypoint](../README.md) -- current package map and aggregate snapshot.
4. [Metadata specification](../current/wildfire_solar_damage_code_metadata_spec__model_v1_0__docs_r3.md) -- governed callable interface.
5. [Derivation dossier](../current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md) -- governed proof trail.
6. [Hazard migration handoff](../../../contracts/hazard_handoff/wildfire_solar_model_v1_0_hazard_migration.md) -- downstream replacement rules.
7. [Preserved v0.1 research scaffold](../proposed/README_wildfire_solar__model_v0_1__docs_r1.md) -- rejected alternatives and empirical upgrade gates.

---

## 13. Version and non-change statement

```text
cell damage-model version:  model v1.0 unchanged
human docs revision:        docs r3 -> docs r4
runtime artifact pin:       model v1.0 / docs r3 unchanged
artifact/schema version:    bundle v2 unchanged
curve states and ordinates: unchanged
selector logic:             unchanged
conditioner/control logic:  unchanged
exposure and value logic:   unchanged
damage-code outputs:        unchanged for identical inputs
```

This basics set explains the existing model. It does not promote a new runtime artifact or convert the
screening model into a calibrated one.
