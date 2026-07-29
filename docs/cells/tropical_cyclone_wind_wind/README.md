# Tropical-cyclone wind × onshore wind

## 1. Cell identity

```yaml
cell_id: tropical_cyclone_wind_wind
pathway_id: tropical_cyclone_wind
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_PROPOSED_V0_1
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

This is the first governed tropical-cyclone/hurricane wind model workstream for a land-based wind farm. It
reuses the wind-turbine anatomy, repeated-unit exposure pattern, and row-level value ledger developed for
`wind_tornado_wind`; it does **not** reuse that cell's convective or tornado curve parameters. Model v0.1 is a
noncanonical, fail-closed research scaffold: it defines the cell boundary and candidate units without
publishing a numeric damage curve.

## 2. Snapshot tree

```text
tropical-cyclone wind × onshore wind
├─ primary candidates — all numeric DR withheld in model v0.1
│  ├─ WT_TURBINE_EQUIPMENT_ASSEMBLY / rotor + nacelle + tower
│  ├─ WT_FOUNDATION / turbine foundation and base
│  └─ WT_EXTERNAL_ELECTRICAL / split required before modeling
│     ├─ pad or cluster equipment
│     ├─ collection line or network
│     └─ substation and control point or polygon
│
├─ conditioner-only systems and states
│  ├─ yaw, pitch, brake, grid, and backup-power state
│  └─ control history, operating state, duration, veer, and turbulence
│
├─ reviewed secondary / unresolved units
│  ├─ WT_CIVIL_INFRA / roads, crane pads, buildings, and fences
│  ├─ SUPPORT_FIELDWORK / allocate once after qualified damage
│  └─ SUPPORT_TRANSPORT_LOGISTICS / allocate once when required
│
└─ no DR≈0 direct-TC-wind bucket is asserted in model v0.1
   └─ absent evidence is withheld, never converted to zero
```

## 3. Scope and exclusions

In scope is occurrence-based direct physical destruction from the tropical-cyclone boundary layer, eyewall,
and rainband wind field acting on modern land-based, multi-megawatt, horizontal-axis turbines. The intended
future grain includes repeated turbine equipment and foundations plus appropriately split electrical and
civil plant units.

Routed elsewhere or deferred are TC-spawned tornadoes; storm surge, pluvial flooding, scour, saturated-soil
or slope failure; debris impact and wind-driven-rain ingress as independent pathways; offshore wind systems;
fatigue, rain erosion, lightning, and fire; and business interruption, curtailment, revenue, insurance,
frequency, EAL, PML, VaR, TVaR, and portfolio accumulation. Compound child pathways must retain the same
`event_family_id` so the consumer can coordinate occurrence loss without duplicate charges.

## 4. Primary nonzero failure-unit(s)

There are **no released nonzero failure units in model v0.1**. The following are primary candidates, but every
numeric DR remains withheld:

| Candidate unit | Intended mechanism or role | Model v0.1 treatment | Release blocker |
|---|---|---|---|
| `WT_TURBINE_EQUIPMENT_ASSEMBLY` | Dependency-safe rotor, nacelle, and tower damage states | Primary candidate; no curve | No representative all-severity probability-to-cost chain |
| `WT_FOUNDATION` | Wind-driven overturning, capacity loss, and post-collapse disposition | Primary/exception review; withheld, not DR≈0 | Wind-only demand, state precedence, and disposition unresolved |
| `WT_EXTERNAL_ELECTRICAL` | Pad equipment, collection, and substation/control damage | Primary candidates after required split; no curve | Different point, line, network, and shared-asset exposure grains |

Tower collapse can destroy or force replacement of rotor and nacelle, and foundation replacement can force
equipment replacement. A future model must use mutually exclusive states or another precedence-safe
construction rather than summing independent terminal component losses.

## 5. Conditioner-only equipment

Yaw, pitch, brake, grid, backup-power, and control systems are conditioner-only in this scaffold when their
event-time state changes turbine response. They do not receive independent TC-wind curves or universal
protection multipliers. Operating state, control-history basis, duration, direction change, veer, and
turbulence are also retained as conditioners. Unknown state receives no protective or worst-case default.

The complete field-role contract lives in the
[site and event-condition adapter](proposed/SITE_CONDITION_ADAPTER_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md).

## 6. Reviewed secondary / low-materiality equipment

| Unit | Coverage role | Why no model v0.1 curve | Update trigger |
|---|---|---|---|
| `WT_CIVIL_INFRA` | Reviewed secondary; split required | Roads, crane pads, buildings, fences, and facilities mix different mechanisms and exposure grains | Asset-specific split plus matched demand, disposition, and cost evidence |
| `SUPPORT_FIELDWORK` | Post-damage support allocation | Support is consequence cost, not a wind-fragility subject | Reviewed rule linking qualified repair scope to fieldwork once |
| `SUPPORT_TRANSPORT_LOGISTICS` | Post-damage support allocation | Distance, crane, access, and replacement scope are unresolved | Reviewed rule linking qualified replacement scope to transport once |

These roles are not permanent low-materiality judgments. They prevent unsupported aggregation while the
required unit splits and evidence are developed.

## 7. DR≈0 / not-directly-affected buckets

Model v0.1 assigns **no physical bucket DR≈0 merely because evidence is missing**. Foundation, electrical,
and civil units remain explicitly withheld. Soft, sunk, financing, development, tax, insurance, and other
nonphysical installed-cost rows are outside the direct-physical damage denominator; they are excluded rather
than assigned a physical zero curve.

| Bucket type | Model v0.1 disposition |
|---|---|
| Primary nonzero | None released; candidate units withheld |
| Conditioner-only | Turbine control and event-time response states |
| Secondary / unresolved | Civil units and post-damage support allocation |
| DR≈0 direct effect | None asserted |
| Out of scope | Neighboring hazards, offshore mechanisms, disruption, finance, and annual/tail analytics |

## 8. Hazard x-axis decision

No runtime x-axis is frozen. NHC one-minute sustained surface wind at 10 m is a valid upstream storm-field
quantity, not turbine-local demand. The Jaimes candidate uses a 3-second peak gust at 10 m; the Rose candidate
uses 10-minute hub-height wind. Saffir–Simpson category is context only, and those quantities are not
interchangeable.

The preferred research direction is a versioned TC bridge that preserves source height, averaging period,
exposure, terrain/topography, gust treatment, hub/rotor demand, duration, direction/veer, turbulence,
validity, and uncertainty. No global power-law exponent or gust factor is adopted.

## 9. Curve form and y-axis meaning

There is no runtime curve form or damage-ratio y-axis in model v0.1. The proposed artifact has
`curve_records: []`; numeric damage and loss outputs are withheld with `NO_RUNTIME_CURVE`.

Two source-native candidate fragilities are retained for audit only: Jaimes lognormal probability of DS3
tower-wall buckling/collapse and Rose logistic probability of tower buckling for narrowly specified turbine
and control states. Probability of a structural state is not expected repair-or-replacement cost divided by
same-unit value. A future economic curve must assemble mutually exclusive states and same-unit consequences:

```text
DR = sum_s P(state_s | delivered demand, verified conditions)
             × E(same-unit cost ratio | state_s, selectors)
```

## 10. Selector / conditioner / exposure map

| Role | Examples | Model v0.1 rule |
|---|---|---|
| Selector | make/model, rating, hub/rotor dimensions, tower, foundation, design class, TMD, vintage | Select only a verified archetype; no generic transfer or automatic resilience credit |
| Conditioner | operating, yaw, pitch, brake, grid, backup, duration, veer, turbulence | Capture state; no universal multiplier or favorable unknown default |
| Axis bridge | height, averaging, gust, terrain, duration, direction, turbulence | Produce delivered demand with named method, provenance, uncertainty, and validity |
| Exposure | turbine/cluster point, collection line/network, substation point/polygon, civil geometry | Match local demand and value at the same subject grain; no whole-site default |
| Value | same-unit direct replacement value | Convert qualified DR to cost; never substitute for fragility or exposure |
| Support | fieldwork and transport | Allocate once after qualified repair/replacement scope; never use as a wind curve |

## 11. Value-link basis

The reference NREL CWER ledger, in 2023 USD/kW, is reusable for structure and reconciliation but is not a
site appraisal:

| Value layer | Reference value |
|---|---:|
| Turbine equipment | 1,090 |
| Other direct | 239 |
| Support | 294 |
| Physical | 1,623 |
| Excluded nonphysical | 345 |
| Installed | 1,968 |

The turbine-equipment assembly is 67.1596% of physical value and 55.3862% of installed value. Those are
denominator conversions, not DR caps. Exact site/OEM value, matching exposed subject, and a support-allocation
rule are required before loss can be reported.

## 12. Evidence and derivation pointer

Curve and withholding proof lives in the
[model v0.1 derivation dossier](proposed/tropical_cyclone_wind_wind_curve_derivation_dossier__model_v0_1__docs_r1.md).
The `BOUNDED_EVIDENCE_SEARCH_LOG`, `NUMERICAL_CANDIDATE_AUDIT`, source/claim/parameter registers,
`PRESSURE_TEST`, and `PROMOTION_GATE_MATRIX` in `proposed/`
carry the evidence limits and release decision.

The evidence supports source-wind semantics, required selectors/conditioners, and narrow structural
fragility candidates. It does not yet join representative modern turbine-local TC demand, all-severity
inspection/disposition, and same-unit repair or replacement cost.

## 13. Workbook map

Workbook:
[damage_curve_records_tropical_cyclone_wind_wind__model_v0_1__docs_r1.xlsx](proposed/damage_curve_records_tropical_cyclone_wind_wind__model_v0_1__docs_r1.xlsx)

| Question | Workbook sheet |
|---|---|
| What is the scaffold status and where should I look? | `README` |
| Which seven modeling gates are open or closed? | `Seven_Steps` |
| How do physical, support, excluded, and installed values reconcile? | `Asset_Value`, `Value_Crosswalk` |
| Which failure units and spatial grains are proposed? | `Failure_Units` |
| How are Jaimes and Rose candidates reproduced without becoming DR? | `Candidate_Fragility` |
| Which selectors, conditioners, bridge fields, and missing-state rules apply? | `Site_Adapter` |
| Why are legacy numbers rejected? | `Legacy_Audit` |
| Which claims, sources, and parameter tiers govern the decision? | `Claim_Register`, `Source_Register`, `Parameter_Tiers` |
| Do value, formula, count, and withholding checks pass? | `QA_Checks` |

The workbook is an audit companion. The proposed JSON, governed registers, dossier, and metadata contract
remain authoritative.

## 14. Open seams and update triggers

Promotion remains blocked until all of the following close:

1. a reviewed turbine-local TC demand bridge with height, averaging, terrain, gust, duration, direction/veer,
   and uncertainty lineage;
2. target-fleet applicability for turbine design, controls, tower/foundation archetype, and operating state;
3. all-severity, mutually exclusive disposition evidence rather than collapse probability alone;
4. same-unit repair/replacement cost evidence and a reviewed support-allocation rule;
5. site/OEM value plus point, line, network, and shared-asset exposure data; and
6. compound-event coordination for tornado, surge/flood/scour, debris, rain ingress, and coastal strong-wind
   overlap.

If suitable private data remain unavailable, a separately approved Tier-4 elicitation may create a clearly
labelled screening model. It must not be described as claims-calibrated.

## 15. Implementation notes

Start with the [first-reader basics](basics/README.md), then the
[build reasoning](basics/HOW_THE_MODEL_IS_BUILT.md) and [exact model reference](basics/MODEL_REFERENCE.md).
The proposed package overview and metadata specification in `proposed/`, the
[fail-closed artifact](proposed/tropical_cyclone_wind_wind__model_v0_1__docs_r1__curve_artifact.json), and
[validation report](proposed/VALIDATION_REPORT_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md) define the
governed implementation boundary.

No artifact index, package release, canonical cell pin, or Hazard runtime is changed. The existing Hazard
hurricane/wind-farm implementation remains a legacy regression fixture and must not be treated as this cell's
curve. A future cutover requires a reviewed model v1.0 artifact using the repository-current runtime schema,
exact model/docs/schema/SHA pinning, and explicit pathway-aware consumer migration.
