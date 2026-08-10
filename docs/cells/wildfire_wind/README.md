# Exogenous wildfire × onshore wind

## Current model — partial electrical screening

```yaml
damage_code_id: WILDFIRE_WIND_PARTIAL_ELECTRICAL_SCREENING_V1
semantic_damage_model_version: model v1.0
human_documentation_revision: docs r1
model_grade: screening_engineering_proxy_t4
supported_failure_units:
  - WT_PAD_ELECTRICAL
  - WT_GSU_PROTECTION_CONTROL_DC
curve_records: 2
canonical_runtime_artifact: true
runtime_pin: wildfire_wind@model_v1_0__docs_r1
scenario_loss: supported_only_with_explicit_same_unit_value_and_exposure
annual_and_tail_metrics: withheld
```

The current screening model makes two real physical risks visible: turbine/pad electrical equipment and the
shared GSU protection-control-DC package. It is deliberately **partial**. It does not publish a whole-wind-
farm curve, infer zero for unmodeled units, bind the mixed 72 USD/kW electrical value, or auto-activate a
Hazard registry row.

The exact FSim-class state tables are cell-local Tier-4 assumptions adopted under explicit owner direction.
Primary research and equipment guidance support the mechanism and relative ordering, not numerical
calibration. Start with the [curve request guide](../../extra/guides/wildfire_wind_curve_request_guide.md),
[current model-v1 package](current/README.md),
[deep-research memo](proposed/DEEP_RESEARCH_AND_DECISION_MEMO_wildfire_wind__model_v1_0__docs_r1.md), and
[Hazard proposal](../../contracts/hazard_handoff/wildfire_wind_model_v1_0_partial_screening_proposal.md).

The remainder of this page preserves the strict evidence-earned model-v0.1 baseline. It remains the
strict fail-closed alternative and audit baseline; it is no longer the current runtime pointer.

## Preserved strict baseline — model v0.1/docs r1

```yaml
cell_id: wildfire_wind
pathway_ids:
  - wildfire_thermal_attack
  - wildfire_firebrand_ignition
  - wildfire_residue_destructive_contamination
damage_code_id: WILDFIRE_WIND_PROPOSED_V0_1
semantic_damage_model_version: model v0.1
human_documentation_revision: docs r1
runtime_documentation_revision: none
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested
model_grade: no_runtime_curve_research_scaffold
canonical_runtime_artifact: false
curve_records: 0
runtime_reason: NO_RUNTIME_CURVE
package_release: unreleased
```

This is the first governed exogenous-wildfire cell for modern land-based wind facilities. It completes the
last intended hazard × asset coverage row without publishing a weak numerical curve. Model v0.1 establishes
the pathway boundary, dependency-safe failure units, evidence and value lineage, site adapter, consumer
contract, tests, and promotion gates. Every numeric damage and loss output fails closed.

## 2. Snapshot tree

```text
exogenous wildfire × onshore wind
├─ repeated per-turbine failure unit — no curve
│  └─ WT_TURBINE_FIRE_ASSEMBLY
│     ├─ rotor/blade zone
│     ├─ nacelle and uptower equipment zone
│     ├─ tower shell/base/door/cable-entry zone
│     └─ mutually exclusive local repair → dependent internal fire → replacement states
│
├─ separately located BOP — no curve
│  ├─ WT_PAD_ELECTRICAL
│  ├─ WT_COLLECTION_NETWORK
│  ├─ WT_GSU_MAIN_TRANSFORMER
│  ├─ WT_GSU_SWITCHGEAR_BUS
│  ├─ WT_GSU_PROTECTION_CONTROL_DC
│  ├─ WT_GSU_CABLE_TERMINATIONS
│  └─ WT_CONTROL_MET_OM
│
├─ geometry/material review — withheld, not zero
│  ├─ WT_FOUNDATION
│  └─ WT_CIVIL_INFRA
│
├─ SUPPORT_FIELDWORK / SUPPORT_TRANSPORT_LOGISTICS — allocate once
└─ every numeric DR and loss output withheld in model v0.1
```

## 3. Scope and exclusions

In scope is occurrence-based physical destruction from an external wildland fire reaching a land-based wind
facility. Direct flame/radiant/convective attack and firebrand ignition are separate candidate pathways.
Soot or residue is included only in a deferred pathway when it causes attributable destructive electrical
contamination, corrosion, flashover damage, or replacement—not routine cleaning, derating, or telemetry loss.

Equipment-origin turbine fire, lightning-initiated fire, maintenance fire, BESS thermal runaway, generic
smoke/ash fouling, PSPS, emergency shutdown, business interruption, revenue, responder liability,
suppression-agent damage, and post-fire erosion/flood/landslide are excluded or separately deferred. A fire
that externally ignites a turbine and then propagates internally is a dependent state transition within the
same turbine assembly, not a second additive loss.

## 4. Primary nonzero failure-unit(s)

There is **no released nonzero failure unit** in model v0.1. The primary repeated candidate is:

| Candidate | Intended mechanism | Model v0.1 treatment | Release blocker |
|---|---|---|---|
| `WT_TURBINE_FIRE_ASSEMBLY` | Component-zone thermal/firebrand attack followed by mutually exclusive local repair, dependent internal fire, or terminal replacement | Candidate; no curve | No matched exogenous dose → inspected assembly disposition → same-unit direct cost chain |

The assembly avoids adding blade, nacelle, tower, and internal-cable replacement after one ignition cascade.
Component zones remain explicit because local demand, selectors, and inspected repair scope differ.

## 5. Conditioner-only equipment

Turbine shutdown, attained rotor position, pitch/azimuth, ventilation, de-energization, suppression availability,
vegetation state, access, and responder action are event-time conditioners. They are not occurrence frequency
and do not earn an automatic mitigation credit. A shutdown command is not proof of a protected material state.

Fixed selectors include turbine/rotor geometry, lower blade-tip height, blade resin/fire-retardancy, nacelle
enclosure and ventilation, tower door and penetration/firestop construction, internal/external transformer
location, cable burial, GSU equipment class, building construction, and design/maintenance vintage.

## 6. Reviewed secondary / low-materiality equipment

| Unit | Coverage role | Why no model v0.1 curve | Required future evidence |
|---|---|---|---|
| `WT_PAD_ELECTRICAL` | Turbine-adjacent point/pad unit | Location, enclosure, transformer/switchgear configuration, and dependent turbine allocation vary | Local attack, exact BOM/SOV, disposition, and cost |
| `WT_COLLECTION_NETWORK` | Segment/network unit | Buried cable, exposed risers, joints, cabinets, overhead spans, and protective trips differ | Segment topology, attack, permanent damage, and cost |
| GSU transformer/switchgear/control/DC/terminations | Shared yard units | Fire/heat/contamination endpoints and values differ by apparatus; one generic substation curve would hide dependencies | Yard-zone attack, ownership, BOM/SOV, inspected disposition, same-unit cost |
| `WT_CONTROL_MET_OM` | Point/building/yard split | Buildings, met equipment, controls, spares, and O&M property cannot share one response | Exact inventory, construction, geometry, and cost |
| `WT_FOUNDATION` | Geometry/material review | Ground-level concrete may see heat, but exposure time, spalling/strength state, inspection, and replacement are unknown | Local dose plus engineering disposition |
| `WT_CIVIL_INFRA` | Mixed-subject split | Roads, pads, fences, gates, culverts, drainage, and lighting differ; vegetation remediation is not owned physical damage | Subject split and pathway-specific evidence |

“Withheld” means no supported numeric output. It does not mean immune.

## 7. DR≈0 / not-directly-affected buckets

Model v0.1 publishes no numeric DR≈0 record. Elevation, burial, noncombustible construction, clearance, or a
past no-damage event can screen geometry and prioritize evidence; none proves a population-wide zero curve.
Soft, finance, development, warranty, contingency, and other nonphysical values are excluded from the physical
denominator rather than assigned a wildfire zero.

| Bucket type | Model v0.1 disposition |
|---|---|
| Primary nonzero | None released; turbine fire assembly candidate withheld |
| Conditioner-only | Shutdown/position, ventilation, energization, suppression, vegetation/access state |
| Secondary / unresolved | Pad, collection, GSU, controls/met/O&M, foundation, civil |
| DR≈0 direct effect | None published numerically |
| Out of scope | Endogenous/lightning fire, disruption, routine cleaning, suppression damage, post-fire perils |

## 8. Hazard x-axis decision

FSim burn probability and six conditional flame-length classes are source-native hazard objects. Burn
probability stays in Hazard's frequency layer. Flame-length class is not component heat flux, duration,
firebrand dose, or a permitted class midpoint.

No runtime x-axis is frozen. Future delivered-load objects are pathway specific:

```text
wildfire_thermal_attack:
  time-resolved radiant + convective heat flux
  + direct-flame-contact duration + gas state at the component zone

wildfire_firebrand_ignition:
  particle-number flux/count + size/mass + combustion state
  + deposition/accumulation/ingress + wind/contact history
```

Fuel, flame geometry, slope, wind, distance/view factor, component elevation/orientation, and protection state
belong in one qualified regional-to-local bridge. A fixed distance or scalar hub-height attenuation is not
adopted.

## 9. Curve form and y-axis meaning

There is no runtime curve form or ordinate in model v0.1. The artifact has `curve_records: []`; all declared
metrics return `NO_RUNTIME_CURVE`.

A future turbine ordinate must use dependency-safe mutually exclusive states:

```text
DR_turbine(x,s) = Σ_k P(state_k | delivered pathway load x, verified selectors/state s)
                       × E(direct same-turbine repair/replacement cost ratio | state_k)
```

Local coating/cable repairs and terminal turbine replacement cannot be added for the same material state.
Outage and production loss remain outside the curve.

## 10. Selector / conditioner / exposure map

| Role | Examples | Model v0.1 rule |
|---|---|---|
| Pathway | thermal, firebrand, destructive residue | Exact ID; no automatic pathway or asset fallback |
| Source hazard | FSim class/distribution, event/burn identity | Preserve source semantics; no midpoint or damage mapping |
| Bridge input | fuel, flame geometry, wind, slope, distance/view, zone elevation/orientation | Feed one qualified local-load model |
| Selector | turbine/BOM, lower-tip height, resin, ventilation, transformer location, cable burial, GSU equipment | Exact applicability; unknown cannot inherit a curve |
| Conditioner | shutdown/position, de-energization, suppression, vegetation/access state | No automatic favorable credit |
| Derived demand | flux-time/contact object or firebrand deposition/ingress object | Required future object; currently disabled |
| Exposure | turbine point/vertical zones; pad/yard polygon; collection segment/network; building footprint | Actual subject only; lease polygon is prohibited as solid damaged value |
| Value | same-unit SOV/replacement value | Convert qualified DR to cost; never create vulnerability |
| Support | inspection, NDT, fieldwork, crane, transport | Allocate once after final disposition |

## 11. Value-link basis

The NREL Cost of Wind Energy Review ledger supplies reference anatomy, not a site appraisal:

| Value layer | 2023 USD/kW |
|---|---:|
| Turbine equipment, including blades and tower | 1,090 |
| Foundation + civil + mixed electrical | 239 |
| Fieldwork + transport/logistics support | 294 |
| Physical reference | 1,623 |
| Excluded soft/sunk/nonphysical | 345 |
| Installed reference | 1,968 |

The 72 USD/kW electrical row must be split across pad, collection, GSU, and control subjects. The 1,090
USD/kW turbine-equipment total is a reference assembly value; it is neither fully exposed nor immune. Site
SOV, ownership, geometry, turbine count, GSU allocation, and support rules are mandatory before loss.

## 12. Evidence and derivation pointer

The [derivation dossier](proposed/wildfire_wind_curve_derivation_dossier__model_v0_1__docs_r1.md) joins the
source, claim/parameter, tier, legacy, value, pathway, and promotion decisions. FSim and wildfire-physics
sources define upstream states and candidate delivered-load variables. AFAC/CFA/FM guidance defines relevant
site controls. NEMA and fire-damaged-turbine evidence define inspection/disposition concepts. None supplies a
matched exogenous wildfire dose-to-same-unit economic curve.

The old three logistics and the current solar screening ordinates remain audit inputs only.

## 13. Workbook map

Workbook: [damage_curve_records_wildfire_wind__model_v0_1__docs_r1.xlsx](proposed/damage_curve_records_wildfire_wind__model_v0_1__docs_r1.xlsx)

| Question | Workbook sheet |
|---|---|
| What is the package state? | `README` |
| Which seven gates are open? | `Seven_Steps` |
| How does reference value reconcile? | `Asset_Value`, `Value_Crosswalk` |
| Which units and dependencies are explicit? | `Failure_Units` |
| Which public/legacy candidates were reviewed? | `Candidate_Audit`, `Legacy_Audit` |
| How are source state, local attack, selectors, exposure, and value separated? | `Site_Adapter` |
| Which claims, sources, and tiers govern the result? | `Claim_Register`, `Source_Register`, `Parameter_Tiers` |
| Do reconciliation and withholding checks pass? | `QA_Checks` |

## 14. Open seams and update triggers

Promotion remains blocked until all of these close:

1. validated FSim/event-to-zone bridges for thermal and firebrand attack;
2. turbine/BOP/GSU configurations and complete affected/unaffected inventories;
3. exogenous attribution separated from internal, lightning, and maintenance fires;
4. inspected mutually exclusive dispositions with NDT/OEM/engineer decisions;
5. same-unit repair/replacement work orders and non-overlapping SOV values;
6. per-turbine, segment, yard, and building exposure plus shared-event correlation; and
7. independent wildfire, turbine/fire, electrical, value, contract, and consumer review.

A later Tier-4 categorical screening proxy is possible only as an explicit business decision; it must not be
described as empirical or silently inherit solar or legacy ordinates.

## 15. Implementation notes

Start with [basics](basics/README.md), [build reasoning](basics/HOW_THE_MODEL_IS_BUILT.md), and the
[model reference](basics/MODEL_REFERENCE.md). The [package overview](proposed/README_wildfire_wind__model_v0_1__docs_r1.md),
[fail-closed JSON](proposed/wildfire_wind__model_v0_1__docs_r1__curve_artifact.json),
[contract tests](proposed/known_answer_tests_wildfire_wind__model_v0_1__docs_r1.json), and
[validation report](proposed/VALIDATION_REPORT_wildfire_wind__model_v0_1__docs_r1.md) define the boundary.

No artifact-index row, package release, canonical pin, schema, or Hazard runtime changes. A future v1.0
cutover requires an output-bearing repository-current artifact and an exact model/docs/schema/SHA migration.
