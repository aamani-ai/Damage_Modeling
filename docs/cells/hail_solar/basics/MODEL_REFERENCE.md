# Hail × Solar Model Reference

**Use this page for exact lookup.** It collects the canonical runtime identity, failure-unit grain, logistic
parameters, known-answer ordinates, fields, value profiles, evidence tiers, capabilities, validation status,
and a complete illustrative event assembly.

For a first explanation, use the [basics README](README.md). For the evidence-to-SHIP reasoning, use
[How the model is built](HOW_THE_MODEL_IS_BUILT.md).

```yaml
cell_id: hail_solar
damage_code_id: HAIL_SOLAR_PV_MODULE_V1
basics_set_revision: r1
cell_model_version: model v1.0
human_documentation_revision: docs r8
canonical_runtime_documentation_revision: docs r7
canonical_runtime_pin: hail_solar@model_v1_0__docs_r7
artifact_schema: damage_curve_record_bundle.v2
capability_schema: capability_declaration.v2
canonical_artifact_sha256: 8c52f3442eb606f55aa0502fbb2738df70076f8a181de463c029061020b3cf32
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

---

## 1. Authority and interpretation rules

| Question | Authority |
|---|---|
| Exact runtime fields, records, parameters, value profiles, and capability | [Canonical JSON artifact](../current/hail_solar__model_v1_0__docs_r7__curve_artifact.json) |
| Executable evaluator/value expectations | [Known-answer fixture](../current/known_answer_tests_hail_solar__model_v1_0__docs_r7.json) |
| Derivation rationale and evidence narrative | [Derivation dossier](../current/hail_solar_curve_derivation_dossier_v1_3.md) |
| Human-readable input/output contract | [Metadata specification](../current/damage_code_metadata_spec_hail_solar_v1_3.md) |
| Repository-current consumer seam | [Hail consumer contract](../../../contracts/hazard_handoff/hail_solar_consumer_contract_v2.md) |
| Repository-current pin and SHA | [Artifact index](../../../contracts/machine_readable_artifact_index.json) |

Interpretation guardrails:

```text
- The runtime JSON and KAT fixture win over older notebook or publication snapshots.
- Module glass-breakage probability is used as a replacement-DR proxy, not universal site failure probability.
- Logistic ordinates are deterministic scalar severity values, not a vulnerability distribution.
- Example BOM, stow, exposure, and monetary values are class-template inputs, not observations.
- A value-profile share is a denominator/allocation choice, not intrinsic module fragility.
- Missing exact module/stow/exposure evidence must create defaults/flags or withheld loss, not invented precision.
```

---

## 2. Canonical failure-unit inventory

The runtime artifact carries one primary record:

| ID | Subsystem | Component | Treatment | Y-axis | Value bucket | `f_kind` |
|---|---|---|---|---|---|---|
| `PV_MODULE_GLASS_CELL` | `PV_ARRAY` | `PV_MODULE` | `primary_nonzero` | Module replacement DR approximated by glass breakage | `PV_ARRAY_MODULE_EXPOSED` | `failure_unit_value_share` |

Reference shares on the failure-unit record:

```text
direct hardware share of physical base:  0.3317569801903719
direct hardware share of installed capex: 0.2600132602142186
```

These are value-link reference numbers. They are not the curve's maximum DR and do not prove a site's
module valuation or exposure.

### Coverage reconciliation

| Subject | Current disposition |
|---|---|
| Mounting/tracker | Conditioner-only because stow/angle changes module impact; direct steel damage not serialized |
| Racking structure | Secondary/open; no separate current curve |
| SCADA/met instruments | Optional secondary; not a canonical curve record |
| Inverter and substation | DR≈0 for direct-hail v1 |
| Civil infrastructure, foundation, drainage | DR≈0 for direct-hail v1 |
| Wind-driven hail contact effect | Deferred conditioner/physics bridge candidate |
| Latent cracking without replacement | Outside current direct replacement curve |

DR≈0 is a coverage decision for this direct-hail pathway, not a claim that damage is physically impossible.

---

## 3. Canonical curves and known ordinates

### 3.1 Evaluation equation

```text
DR(D) = max_DR / [1 + exp(-k_per_mm × (D - D50_mm))]
```

```text
input field:          mesh_diameter_mm
runtime unit:         mm
source units:         mm, in
valid range:          0 to 100 mm
extrapolation policy: clamp_or_warn
record match:         exactly one module_archetype
```

### 3.2 Unstowed archetype parameters

| Curve ID | Selector value | D50 mm | k/mm | max DR | Tier |
|---|---|---:|---:|---:|---|
| `HAIL_SOLAR_FRAGILE_THIN_GG` | `fragile_thin_glass_glass` | 41.074 | 0.220633 | 1.0 | T2 |
| `HAIL_SOLAR_DEFAULT_3P2_GBS` | `default_3_2mm_glass_backsheet` | 52.696 | 0.165912 | 1.0 | T2 |
| `HAIL_SOLAR_HARDENED_THICKER` | `hail_hardened_thicker_glass` | 64.114 | 0.135331 | 1.0 | T3 |

### 3.3 Runtime known-answer ordinates

Values below come from the canonical docs-r7 KAT fixture.

| Diameter | Fragile DR | Default DR | Hardened DR |
|---:|---:|---:|---:|
| 25 mm | 0.0280189609 | 0.0100002089 | 0.0049998413 |
| 50 mm | 0.8775434459 | 0.3900032036 | 0.1289739168 |
| 75 mm | 0.9994389813 | 0.9758847776 | 0.8135452954 |

Additional KATs:

| Test | Expected result |
|---|---|
| Missing selector at 50 mm | Default curve, DR `0.3900032036`, flag `DEFAULT_SELECTOR_USED` |
| 2 inches | Normalize to `50.8 mm`; default DR `0.4219998543` |
| Unknown selector | Reject with `CURVE_SELECTOR_MATCH_NOT_FOUND` |
| Duplicate selector record | Reject with `CURVE_SELECTOR_MATCH_NOT_UNIQUE` |

### 3.4 Stow transformation

```text
D50_stowed    = D50_selected + 8 mm
k_stowed      = k_selected
max_DR_stowed = 0.90

DR_conditioned
  = P(stowed) × DR_stowed
  + [1-P(stowed)] × DR_unstowed
```

For the default curve at 50 mm:

| State | `P(stowed)` | DR |
|---|---:|---:|
| Unstowed | 0.0 | 0.3900032036 |
| Uncertain example | 0.6 | 0.2342860841 |
| Confirmed stowed | 1.0 | 0.1304746711 |

The middle row is an illustrative calculation. The runtime fixture does not currently publish stow KATs;
the formula and T4 parameters are serialized in the artifact/dossier.

---

## 4. ASCII curve views

Each bar uses approximately 20 characters for DR `1.00`.

### Unstowed archetypes

```text
diameter  fragile                  default                  hardened
25 mm    |#           0.028       |            0.010       |            0.005
50 mm    |################## 0.878 |########    0.390       |###         0.129
75 mm    |#################### 0.999|#################### 0.976|################ 0.814
```

### Default curve with stow at 50 mm

```text
unstowed        0.390 |########
P(stowed)=0.60  0.234 |#####
stowed          0.130 |###
```

### D50 comparison

```text
hail diameter (mm)
25        35        45        55        65        75
|---------|---------|---------|---------|---------|
                ^                 ^           ^
             fragile           default     hardened
             D50 41.1          D50 52.7    D50 64.1
```

D50 marks the midpoint of each logistic record; it is not a safe/no-damage line.

---

## 5. Input and output field dictionary

### 5.1 Hazard input

| Field | Unit | Requirement | Meaning | Missing/incompatible behavior |
|---|---:|---|---|---|
| `mesh_diameter_mm` | mm | Required | MESH-equivalent maximum hail diameter | Withhold/reject if no convertible size exists. |
| `hail_size_source` | enum | Recommended | observed report, MRMS MESH, vendor map, lab test, scenario | Preserve provenance and spatial grain. |
| `source_unit` | mm or in | Conditional | Source-native hail-size unit | Convert explicitly; do not guess. |
| `impact_ke_proxy_j` | J/impact | Optional/derived | Per-stone reference energy proxy | Requires bridge assumption version and notes. |

### 5.2 Static selectors

| Field | Requirement | Current effect |
|---|---|---|
| `module_archetype` | Runtime selector; missing permitted through flagged default | Chooses exactly one curve record. |
| `front_glass_thickness_mm` | Recommended | Maps to an archetype; no continuous formula. |
| `tempered_glass` | Recommended narrative metadata | Supports archetype mapping. |
| `glass_glass_vs_backsheet` | Recommended | Supports archetype mapping. |
| `hail_test_rating` | Optional/high value | May justify hardened selection or a future exact override. |
| `manufacturer_model` | Optional | Identifies equipment; not itself a curve. |
| `bom_test_report_id` | Optional/high value | Evidence for a module-specific future override. |

Default mapping guidance:

| Available evidence | Archetype treatment |
|---|---|
| Thin 2.0 mm glass/glass | Fragile, when construction is supported |
| 3.2 mm fully tempered glass/backsheet | Default |
| Supported enhanced/thicker-glass hail testing | Hardened or exact override |
| Unknown modern utility module | Default + missing-selector flag |

### 5.3 Conditioners

| Field | Requirement | Meaning/current effect |
|---|---|---|
| `mounting_type` | Required in narrative interface | Establishes whether tracker stow is applicable. |
| `stow_state` | Conditional | stowed, unstowed, not applicable, or unknown/probabilistic. |
| `stow_success_probability` | Required for uncertain state | `P(stowed | damaging hail arrived)`. |
| `stow_angle_deg` | Conditional metadata | Stored, but no continuous angle formula in v1.0. |
| `stow_trigger` | Optional | Manual/automatic/alert/none context. |
| `stow_confirmation` | Optional/high value | Separates commanded from confirmed position. |

Deferred fields such as event wind speed/direction, tracker orientation, and normal-energy multiplier have no
current output-changing runtime effect.

### 5.4 Exposure and value inputs

| Field | Requirement | Meaning |
|---|---|---|
| `array_exposure_fraction` | Required by artifact, default `1.0` | Fraction of module value reached by damaging hail swath. |
| `exposure_basis` | Recommended | Full-site default, footprint overlay, or scenario. |
| `value_profile_id` | Required for reference asset-loss output | Selects one published profile; no implicit default. |
| `site_value_basis` | Alternative | Site module value, denominator, and support-cost allocation. |
| `at_risk_fraction` | Optional/site-specific | Further narrows applicable module inventory only when justified. |
| `denominator` | Required for reported percentage | Physical replaceable base, installed capex, or named insured TIV. |

### 5.5 Outputs

| Output | Meaning |
|---|---|
| `failure_unit_damage_ratio` | Deterministic module glass/cell replacement DR |
| `curve_id` | Selected archetype record |
| `physical_base_loss_fraction` | Optional explicit-profile/site-basis loss view |
| `installed_capex_loss_fraction` | Optional labeled installed-capex view |
| `value_profile_id_used` | Named value allocation used |
| `loss_denominator_used` | Denominator attached to percentage |
| `metadata_flags` | Default selector, stow placeholder, cap/exposure limitations |
| `reviewed_secondary_units` | Coverage reconciliation metadata |

---

## 6. Failure-unit value crosswalk

### 6.1 Reference basis

```text
basis ID:                     NLR_Q1_2025_UPV_PV_ONLY_2024_USD
installed capex:              1120.000000 USD/kWdc
physical replaceable base:     877.795702 USD/kWdc
physical / installed ratio:      0.783746
```

### 6.2 Published profiles

| Profile | Included rows | Physical share | Installed share | Interpretation |
|---|---|---:|---:|---|
| `HAIL_DIRECT_MODULE_HARDWARE_ONLY_V1` | `Solar_Map!2` | 0.3317569802 | 0.2600132602 | Direct module hardware floor; support fieldwork not preallocated. |
| `HAIL_HAZARD_REFERENCE_ADAPTER_V1` | `Solar_Map!2` + `Solar_Map!15` | 0.4535037224 | 0.3554318023 | T4 compatibility scenario allocating all general replacement fieldwork to modules. |

No profile is implicit. The asymptotic asset-loss cap for a profile is its share only when module DR and
exposure both equal `1.0`.

```text
loss_physical_fraction
  = DR × exposure × selected physical-base share

loss_installed_fraction
  = DR × exposure × selected installed-capex share
```

Deprecated:

```text
f_hail_material_share = 0.75 or 0.80
```

Those examples narrowed a bucket that was already module hardware and produced inconsistent caps. Use a
named profile, site value basis, and only a justified site-specific at-risk fraction.

---

## 7. Parameter tier and update-trigger register

| Parameter/rule | Curve(s) | Tier | Current basis | Update trigger |
|---|---|---|---|---|
| Fragile `D50=41.074` | Fragile | T2 | PVEL/Kiwa aggregate lab anchors | Larger BOM-specific lab or claims dataset |
| Fragile `k=0.220633` | Fragile | T2 | Logit-space fit to public anchors | Same |
| Default `D50=52.696` | Default | T2 | IEC near-zero + PVEL 50 mm/39% anchors | Claims/OEM/BOM calibration |
| Default `k=0.165912` | Default | T2 | Two-anchor logistic slope | Same |
| Hardened `D50=64.114` | Hardened | T3 | Sparse IEC/public hardened anchors; extrapolated tail | Hardened module lab/claims data |
| Hardened `k=0.135331` | Hardened | T3 | Sparse two-anchor fit | Same |
| Stowed D50 shift `+8 mm` | All archetypes | T4 | Direction source-supported; magnitude not calibrated | Tracker/stow-angle impact testing |
| Stowed `max_DR=0.90` | All archetypes | T4 | Placeholder residual severe-hail cap | Claims/lab stow-performance evidence |
| Direct module-hardware profile | Value link | Reference arithmetic | Governed module value row | Site valuation/BOM |
| Hazard adapter support allocation | Value link | T4 | All general fieldwork assigned to module replacement | Claims/site repair-scope allocation |
| Wind-driven contact intensity | Deferred | Open seam | Mechanism documented; no runtime magnitude | Event wind + orientation + validated impact model |

### Evidence status vocabulary used here

```text
T2  public laboratory evidence, engineering standard, or physics bridge
T3  engineering proxy or adjacent empirical evidence
T4  expert judgment / explicit placeholder
```

No T1 private claims calibration is present. Tier describes support for a parameter at its endpoint and grain;
it is not a generic rating of the source organization.

---

## 8. Capability and reportability

### 8.1 What the cell populates

```text
failure-unit scalar DR                         supported
scenario loss with explicit value/exposure     supported
curve-intrinsic vulnerability spread           not carried
populated emit mode                             scalar_mean
```

### 8.2 What a downstream consumer may compute

| Metric/object | Rule |
|---|---|
| Conditional event loss | Requires explicit named/site value and exposure basis. |
| Frequency-driven annual loss distribution | Requires sampled event frequency/intensity/coupling and caps inside simulation. |
| EAL | Consumer-computable only when prerequisites and cap-binding preflight pass. |
| PML/VaR/TVaR | Consumer-computable only from a validated annual loss distribution. |
| Vulnerability uncertainty distribution | Not supported by this deterministic artifact. |

Required limitation flags:

```text
CURVE_INTRINSIC_SPREAD_NOT_CARRIED
TAIL_CONDITIONAL_ON_DETERMINISTIC_VULNERABILITY
STOW_ADJUSTMENT_PLACEHOLDER_IF_USED
```

Cap policy:

```text
owner: downstream consumer
mode:  fail closed
if checks fail: withhold affected metric or use a full capped simulation
```

---

## 9. Complete illustrative event assembly

This is class-template teaching material, recalculated from the canonical default curve and stow formula.

```text
diameter:                         50 mm
archetype:                        default_3_2mm_glass_backsheet
P(stowed):                        0.60
array exposure:                   0.72
installed reference:              $112.0M
physical reference:               $87.779570M
```

| Step | Value |
|---|---:|
| Unstowed module DR | 0.3900032036 |
| Stowed placeholder DR | 0.1304746711 |
| Conditioned module DR | 0.2342860841 |
| DR × array exposure | 0.1686859805 |

Value-profile results:

| Profile | Installed share | Installed loss fraction | Conditional loss on $112M |
|---|---:|---:|---:|
| Direct module hardware | 0.2600132602 | 0.0438605918 | $4.9124M |
| Hazard reference adapter | 0.3554318023 | 0.0599563621 | $6.7151M |

ASCII assembly:

```text
50 mm event
   |
   +-- default unstowed curve -------------------- DR 0.3900
   |
   +-- P(stowed)=0.60 placeholder blend ---------- DR 0.2343
   |
   +-- array exposure 0.72 ------------------------ touched DR 0.1687
   |
   `-- Hazard adapter installed share 0.3554 ------ loss 5.996% / $6.715M
```

This is conditional physical loss if the modeled event/exposure occurs. It is not annual expected loss.

---

## 10. Validation and reviewer checklist

### Current validation status

| Check | Status |
|---|---|
| Canonical JSON parses and validates | Passing repository runtime validation |
| Artifact SHA matches index | `8c52f344...` matches |
| Failure-unit/curve IDs reconcile | One failure unit / three selector-matched records |
| Runtime KATs | 11 passing |
| Selector contract tests | 2 passing |
| Value-linkage KATs | 4 passing |
| KAT numeric tolerance | `1e-12` |
| Capability v2 embedded | Yes |
| Notebook walkthroughs available | Yes; historical saved outputs |
| Notebook source paths repository-current | **No**; removed paths/docs-r5 semantics remain |

### Reviewer checklist

```text
[ ] Correct cell, semantic model, runtime docs, schemas, SHA, and KAT file are pinned.
[ ] Hail diameter unit/source/location/time and conversion are explicit.
[ ] Exactly one supported module archetype record is selected.
[ ] Hardened selection has module/BOM/test support.
[ ] Stow state is event-time state; command is not silently treated as confirmation.
[ ] P(stowed) is not confused with hail frequency or site-hit probability.
[ ] Wind-driven hail remains an open seam unless a governed bridge is supplied.
[ ] Array exposure scales touched value and has a named basis.
[ ] A named value profile or site-specific value basis is explicit.
[ ] Denominator is labeled physical base, installed capex, or named insured TIV.
[ ] Stow and support-allocation T4 assumptions travel with the result.
[ ] Annual/tail metrics remain downstream and satisfy capability prerequisites.
```

---

## 11. Source register

| Evidence/source | Main use | Link |
|---|---|---|
| NOAA/NCEI Storm Events FAQ | Hail-size reporting axis | [NOAA/NCEI](https://www.ncei.noaa.gov/stormevents/faq.jsp) |
| NOAA/NWS WDTD MESH | MESH operational-axis meaning | [NOAA/NWS](https://vlab.noaa.gov/web/wdtd/-/maximum-estimated-size-of-hail-mes-2) |
| DOE/FEMP hail mitigation | IEC context, diameter bridge, stow direction | [DOE/FEMP](https://www.energy.gov/femp/hail-damage-mitigation-solar-photovoltaic-systems) |
| PVEL 2023 Hail Stress Sequence | Public aggregate breakage anchors | [PVEL 2023](https://2023modulescorecard.pvel.com/hail-stress-sequence/) |
| Kiwa PVEL Hail Stress Sequence | Fragile/hardened public anchors | [Kiwa PVEL](https://scorecard.pvel.com/hail-stress-sequence/) |
| PVEL HSS white paper | Lab/field and breakage/performance context | [PVEL white paper](https://www.pvel.com/wp-content/uploads/PVEL_White-Paper_Hail-Stress-Sequence-for-PV-Modules.pdf) |
| NREL extreme weather and PV performance | Field-performance context | [NREL](https://research-hub.nrel.gov/en/publications/extreme-weather-and-pv-performance-2) |
| VDE hail-stow memo | Direction of stow benefit | [VDE](https://www.vde.com/en/vde-americas/newsroom/hail-stow-tech-memo) |
| VDE wind-driven hail update | Contact-intensity/stow interaction caveat | [VDE update](https://www.vde.com/en/vde-americas/newsroom/return-of-hail-season) |
| FTC Solar 80-degree stow | Operational high-angle stow availability | [FTC Solar](https://investor.ftcsolar.com/news-releases/news-release-details/ftc-solar-launches-automated-80deg-high-angle-stow-1p-pioneer/) |
| Solar/wind value workbook | Governed reference denominators/profile rows | [Value-basis folder](../../../method/value_basis/README.md) |

Sources are inputs, not universal authorities. Consult the dossier for exact permitted and prohibited
inference.

---

## 12. Version history and non-change statement

| Layer | Current state |
|---|---|
| Semantic damage model | model v1.0 |
| Canonical runtime artifact | docs r7, bundle v2, capability v2 |
| Human basics documentation | docs r8 |
| Portable package baseline | library v2.5 |
| Repository publication status | Canonical runtime in repository; basics update does not assemble a package |

Docs r8 adds this reader-friendly three-file basics set. It does not change curve form, D50/k/max_DR,
axis semantics, failure-unit coverage, selectors, stow formula, exposure logic, value profiles,
artifact/schema, or output meaning. Identical inputs still produce identical runtime DRs under the docs-r7
artifact.
