# wildfire_solar derivation and evidence dossier — model v0.1 research scaffold

## 1. Scientific conclusion and scope

This cell addresses direct physical damage from exogenous wildfire burnover to ground-mounted utility-scale solar PV. It excludes smoke/ash production effects, cleaning, PSPS, business interruption, equipment-origin fire, BESS thermal runaway, and financial terms. Ember/firebrand attack is recorded as a separate deferred exposure pathway.

```yaml
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested
documentation_status: working_revision
canonical_runtime_artifact: false
curve_records: 0
failure_unit_DR: withheld
scenario_loss: withheld
reason: NO_RUNTIME_CURVE
scientific_reason: no_reviewed_source_maps_local_wildfire_exposure_to_same_unit_solar_replacement_cost_ratio
```

The correct pressure-tested outcome is no numerical damage curve. The sources establish hazard semantics, mechanisms, laboratory constraints, and site-control variables; they do not establish economic damage ratio by FSim class.

## 2. Seven-step derivation and gate result

### Step 1 — define the reference asset

The research archetype is a 100 MWdc ground-mounted utility PV plant using the repository's NREL Q1-2025 UPV MMP crosswalk in 2024 USD (`NREL_NLR_Q1_2025_PV_BENCHMARK`; `VALUE_SOLAR_WORKBOOK`). It is a value-reconciliation proxy, not a site geometry, BOM, appraisal, or fragility definition.

Status: `PASS_VALUE_ARCHETYPE_ONLY`.

### Step 2 — decompose into failure units

The candidate inventory distinguishes module laminate/glass; module J-box/leads/frame; exposed and protected cable segments; connectors/combiners; inverter/control enclosures; SCADA/tracker drives; transformer/switchgear/breaker equipment; steel/aluminum mounting; foundations; grounding; and mixed civil assets. Fences, walls, firebreaks, and vegetation are exposure controls, not failure-unit DR curves by default.

Status: `PARTIAL_COVERAGE_UNRECONCILED`. Electrical, MV, control, mounting, foundation, grounding, and civil boundaries remain open.

### Step 3 — choose the value basis and future y-axis

| Reference basis | USD/kWdc | 100 MWdc value | Lineage |
|---|---:|---:|---|
| installed | 1,120.000000 | $112.000000M | `Inputs!B6`; `Summary!B5/B8` |
| physical | 877.795702 | $87.779570M | `Inputs!B7`; `Summary!B6/B9` |
| direct hardware, rows 2–10 | 656.981457 | $65.698146M | `Solar_Map!2:10` |
| civil/replacement/support, rows 12–15 | 220.814245 | $22.081424M | `Solar_Map!12:15` |
| excluded soft/sunk/nonphysical | 242.204298 | $24.220430M | `Inputs!B8`; `Summary!B7` |

The proposed future ordinate is the conditional expected direct replacement-cost ratio of the same failure unit, given delivered local exposure and BOM/protection state. It excludes support/logistics, BI, revenue, insurance terms, and unrelated plant value (`GOVERNANCE_CONTRACT`; claim `WS-C046`).

Status: `PASS_REFERENCE_BASIS_Y_AXIS_PROPOSED`; no runtime ordinate exists.

### Step 4 — split and reconcile the basis

```text
1,120.000000 = 877.795702 physical + 242.204298 excluded
877.795702 physical = 656.981457 direct hardware + 220.814245 civil/replacement/support
```

`VALUE_CROSSWALK_wildfire_solar__model_v0_1__docs_r1.csv` classifies all `Solar_Map!2:17` rows. Row 14 remains a mixed civil asset/pathway bucket. Rows 12, 13, and 15 are support allocations and receive no independent DR.

Status: `PARTIAL_ROW_GROUPS_ONLY`.

### Step 5 — allocate value to failure unit and zone

Loss requires a site inventory that maps direct replacement value, at-risk fraction, construction/protection state, and location to each failure unit and zone. Exposed, buried, conduit, tray, enclosure, and equipment-type value cannot be pooled. Support/civil cost is allocated once only after damaged units are identified.

Unknown at-risk or attack fractions never default to one; they withhold the result.

Status: `PARTIAL_FAIL_CLOSED`.

### Step 6 — bridge site/event fire behavior to delivered exposure

FSim FIL is landscape fire behavior, not component heat dose. The adapter must resolve fuels, maintenance, distance, slope/wind, fence/wall/firebreak geometry, row/component position, direct flame contact, heat flux and duration, cable protection, enclosure, access, suppression, and de-energization. Ember/firebrand attack remains separate.

The site adapter assigns each field one role—selector, conditioner, bridge input, derived exposure, allocation, or deferred pathway—and prohibits overlapping credits. A wall, for example, is not both an exposure attenuation and a vulnerability discount; cable burial cannot reduce both mapped at-risk value and DR for the same share.

Status: `SPECIFIED_NOT_PARAMETERIZED`.

### Step 7 — apply damage curves and reconcile loss

No local-exposure-to-failure-unit economic curve passes the evidence gate. Support costs cannot be computed before damaged units and repair scope are known. Structural known-answer tests therefore assert withholding and the absence of numerical DR/loss.

Status: `WITHHELD_NO_RUNTIME_CURVE`.

The binding, more detailed audit is `SEVEN_STEP_AUDIT_wildfire_solar__model_v0_1__docs_r1.md`.

## 3. Source-native hazard contract

The Gen-1 upstream input is the exact FSim conditional flame-length class or the six-bin conditional distribution (`USFS_FSIM_RDS_2023`; claims `WS-C001`–`WS-C004`):

| Canonical input class ID | FSim FIL / FLP layer | Source-native flame-length bin |
|---|---|---|
| `lt_2_ft` | FIL1 / FLP1 | `< 2 ft` |
| `gte_2_lt_4_ft` | FIL2 / FLP2 | `2 to < 4 ft` |
| `gte_4_lt_6_ft` | FIL3 / FLP3 | `4 to < 6 ft` |
| `gte_6_lt_8_ft` | FIL4 / FLP4 | `6 to < 8 ft` |
| `gte_8_lt_12_ft` | FIL5 / FLP5 | `8 to < 12 ft` |
| `gte_12_ft` | FIL6 / FLP6 | `>= 12 ft` |

The six FLPs are proportions of simulated burns in each bin and sum to one conditional on burning. Burn probability is annual frequency and remains outside M3. The dataset is a strategic 270 m product; it does not supply component heat flux, exposure duration, direct contact, ember dose, or economic damage.

No continuous fireline-intensity midpoint, surface/crown diagnostic band, interpolation, or FIL6 upper cap is reconstructed. `USFS_FARSITE_1998` defines fireline intensity in `kW/m`; this is not incident component heat flux in `kW/m²`. A qualified local transfer must preserve geometry, location, orientation, duration, convection/contact, and applicability domain.

## 4. Primary evidence spine and transfer limits

| Source ID | Directly supported observation or rule | Permitted role | Explicitly prohibited inference |
|---|---|---|---|
| `USFS_FSIM_RDS_2023` | Six conditional flame-length probability bins and burn-probability product at strategic scale. | Upstream hazard input semantics. | Component load, continuous midpoint, or solar DR. |
| `FINNEY_2011_FSIM` | FSim architecture separates simulated annual occurrence and conditional intensity distribution. | Hazard-model context. | Asset exposure or solar damage. |
| `USFS_FARSITE_1998` | Fireline intensity depends on heat yield, consumed fuel, and spread rate. | Axis definition and converter rejection. | Unique local heat-flux/time state. |
| `WANG_2025_PV_THERMAL` | Fifteen four-edge-shielded 300 × 300 × 4.7 mm specimens at five inclinations; test-specific thermal failure behavior. | Module mechanism and future flux/time constraint. | Universal modern-module threshold, population fragility, or economic DR. |
| `YANG_2015_PV_IGNITION` | Small 2014 module specimens; empirical CHF about 26 kW/m²; ignition times 913/636/218/133/83 s at 28/30/35/40/45 kW/m². | BOM-specific sustained-flame ignition constraint. | First functional damage, replacement threshold, FIL mapping, or DR. |
| `ZHANG_2022_XLPE` | One 9 mm self-developed XLPE construction; CHF 16.24 kW/m²; mean ignition 83.5/25/13.3 s at 20/30/40 kW/m². | Test-construction ignition constraint. | All installed PV cable, conduit/burial response, or collection DR. |
| `ZHAO_2026_PV_POOL_FIRE` | Full-size single-glass pool-fire tests; glass integrity, flame-contact zone, and tilt affected response; tested tilt effect was nonmonotonic. | Selector and zonal-mechanism design. | Universal tilt/stow multiplier or field replacement ratio. |
| `DOE_FEMP_PV_WILDFIRE` | PV-specific qualitative vegetation, undergrounding, enclosure, barrier, access, and inspection guidance. | Site-field and inspection design. | Numeric protection factor or fragility. |
| `NIST_TN_1796` | Fire/ember exposure should be described in space/time and separated from vulnerability. | Architecture and field-study protocol. | Solar coefficient. |
| `NIST_TN_2228` | 187 fence/mulch experiments; combustible and parallel-fence/fuel combinations can propagate or intensify fire. | Fence/fuel pathway design. | Solar multiplier or universal wall credit. |
| `COHEN_USDA_2000` | Local radiant exposure depends on distance and duration; a severe simple model overestimated measured heat flux in the cited comparison. | Reject a universal `q = C I/d` bridge; require site geometry. | Replacement converter or solar DR. |
| `ENERGY_SAFE_VICTORIA_SOLAR` | Cited jurisdictional 100 mm grass and 10 m firebreak controls. | Auditable site/compliance fields. | Universal efficacy coefficient. |
| `NSW_RFS_OP_1_2_22` | Cited response restriction without de-energization assurance. | Access/de-energization conditioner. | Automatic suppression credit. |
| `NREL_PV_OM_2018` | Exposed module/combiner wiring and buried/conduit/tray states require distinct inspection/installation treatment. | Asset and exposure decomposition. | Numeric wildfire survival factor. |

Exact citations, links, locators, tiers, and prohibited uses are controlled in `SOURCE_REGISTER_wildfire_solar__model_v0_1__docs_r1.csv` and `CLAIM_PARAMETER_REGISTER_wildfire_solar__model_v0_1__docs_r1.csv`. Guidance and residential transfer evidence cannot be promoted into solar coefficients.

## 5. Legacy evidence ingestion and numerical QA

`LEGACY_DIVI_WILDFIRE_SOLAR_2026` is pinned by an immutable commit URL and a separately recorded file-blob SHA. It is a source-discovery input, not a calibration authority. The governed intake memo retains pathway separation, mechanisms, site-variable hypotheses, source leads, and the research agenda. It rejects the converter, fixed distance, component thresholds/weights, curves, modifiers, event anchors, and uncertainty assertions.

Two reproducible failures independently disqualify the legacy numeric proposal:

- its six logistic equations imply 5.82%–9.84% damage at zero intensity and yield 7.41%–11.49% at `I=200`, while the displayed table reports only 1%–4% at that intensity;
- inverting its displayed `F_H = 0.0775 I^0.46` equation yields approximately 386, 1,742, 3,715, 7,167, 21,349, and 93,601 kW/m for the six listed flame lengths, not the displayed 130, 450, 880, 1,500, 3,500, and 10,000 kW/m.

Those values remain in the legacy audit only; they cannot enter the runtime-shaped artifact or workbook curve records.

## 6. Pressure test and overestimation controls

The withdrawn aggregate base percentages ranged from 0.45% at FIL1 to 56.00% at FIL6. If applied indiscriminately at FIL6, they imply $36.791M on the direct-hardware reference subtotal or $49.157M on the whole physical reference base. The second arithmetic improperly applies one DR to pure support rows and to unsplit mixed civil row 14; it is retained only to demonstrate overestimation risk.

Other failed inferences include:

- ranking a generic cable construction against a module solely by CHF;
- treating ignition as first functional damage or replacement;
- assigning every collection/grounding dollar to an exposed-cable pathway;
- using generic material temperatures as racking economic DR;
- treating a regulatory control dimension as measured damage reduction;
- treating a synthetic low/high band as probability or uncertainty.

See `PRESSURE_TEST_wildfire_solar__model_v0_1__docs_r1.md`.

## 7. Site-condition architecture

```text
landscape/event state
  → component-zone fuel/contact/radiant/convective/duration/ember state
  → applicable BOM/protection response
  → inspection/failure/replacement rule
```

The governing site fields and double-counting matrix are in `SITE_CONDITION_ADAPTER_wildfire_solar__model_v0_1__docs_r1.md`. Key rules are:

- combustible fences may increase attack; open metal receives no shield credit;
- solid wall credit requires geometry, wind, gaps, and ember-bypass treatment;
- control dimensions are inputs, not universal coefficients;
- protected/buried value is partitioned before vulnerability, not discounted twice;
- burned fraction and attack fraction are separate and conditional;
- suppression, access, and de-energization enter one response model, not stacked credits;
- whole-site exposure never defaults to one.

## 8. Future loss assembly

```text
Direct loss = Σ_u,z V_direct_u,z × at_risk_f_u,z × burned_f_u,z
                        × attack_f_u,z|burned × DR_u(local_state_u,z)

Direct loss includes any eligible row-14 civil failure units only after the mixed bucket is split.
Total physical loss = Direct failure-unit loss + support costs from rows 12, 13, and 15 allocated once
```

Aggregate means cannot replace zonal assembly without a documented independence test. Unknown at-risk or local attack state withholds loss. The current cell has no `DR_u` implementation.

## 9. Evidence required for promotion

### Site and event reconstruction

- georeferenced component/failure-unit inventory and replacement values;
- pre-event fuel, maintenance, grass, debris, fence/wall/firebreak, access, and cable/enclosure records;
- event perimeter, arrival time, local fire behavior, wind, flame contact, heat flux/duration, and ember observations;
- unaffected zones and units, not only damaged examples;
- reconstruction uncertainty and exact source timestamps.

### Component and replacement calibration

- representative module BOM, age, glass integrity, tilt/contact, and full-size tests;
- exposed lead, installed cable, conduit, burial, connector, and combiner tests;
- enclosure, inverter, SCADA/tracker drive, transformer/switchgear, mounting, foundation, and civil response;
- post-fire EL/thermal/electrical/structural inspection criteria tied to repair/replacement decisions;
- invoices and support-cost records tied once to affected failure units.

### Statistical/governance calibration

- paired exposure, unaffected/affected population, damage state, and economic replacement data;
- declared likelihood/fit or structured elicitation protocol;
- uncertainty distribution, applicability domain, validation holdout, tail/cap tests, and change-control record;
- row-level source and parameter provenance satisfying promotion tiers.

## 10. Final status

```text
SOURCE_AND_VALUE_TRACEABILITY: PASS_FOR_RESEARCH_SCAFFOLD
STRUCTURAL_WITHHOLDING_QA: PASS
SITE_ADAPTER_SPECIFICATION: PASS_NOT_PARAMETERIZED
FIL_TO_LOCAL_EXPOSURE_CALIBRATION: MISSING
LOCAL_EXPOSURE_TO_ECONOMIC_DR_CALIBRATION: MISSING
RUNTIME_CURVE: NONE
PRODUCTION_REPORTABILITY: NONE
```
