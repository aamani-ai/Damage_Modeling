# Tropical-cyclone wind × utility-scale solar

## 1. Cell identity

```yaml
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_PROPOSED_V0_1
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

This is the first governed tropical-cyclone/hurricane wind cell for utility-scale ground-mounted solar. It
closes the last active gap in the supplied hazard × asset planning table. Model v0.1 is a noncanonical,
fail-closed research scaffold: it establishes scope, units, evidence, value, interfaces, and promotion gates
without publishing a numeric damage curve.

## 2. Snapshot tree

```text
tropical-cyclone wind × utility-scale solar
├─ selected array architecture — mutually exclusive
│  ├─ rigid fixed tilt
│  │  ├─ PV_FIXED_TILT_MODULE_FIELD
│  │  └─ PV_FIXED_TILT_SUPPORT_STRUCTURE
│  └─ exact-system-qualified single-axis tracker
│     ├─ PV_TRACKER_MODULE_FIELD
│     └─ PV_TRACKER_SBOS_ASSEMBLY
│
├─ explicit withheld physical units — not DR≈0
│  ├─ PV_FOUNDATION
│  ├─ PV_POWER_CONVERSION_AND_COLLECTION
│  ├─ PV_GSU_SUBSTATION
│  ├─ PV_SCADA_COMMUNICATIONS
│  └─ PV_CIVIL_INFRA
│
├─ PV_REPLACEMENT_SUPPORT — allocate once; no intrinsic DR
└─ every numeric DR/loss output withheld in model v0.1
```

## 3. Scope and exclusions

In scope is occurrence-based direct physical destruction from tropical-cyclone boundary-layer, eyewall, and
rainband wind acting on utility-scale ground-mounted rigid fixed-tilt or exact-system-qualified single-axis-
tracker PV facilities.

Routed separately or deferred are TC-spawned tornadoes; storm surge, flood, scour, and saturated-soil
failure; debris impact; wind-driven rain/water ingress; hail; lightning; rooftop/residential/carport/floating
PV; and business interruption, derating, revenue, insurance, frequency, EAL, PML, VaR, TVaR, and portfolio
accumulation. Child pathways retain one `event_family_id` so the consumer can prevent duplicate charges.

## 4. Primary nonzero failure-unit(s)

There are **no released nonzero failure units in model v0.1**. Four architecture-specific units are primary
candidates, but every numeric DR remains withheld:

| Candidate unit | Intended mechanism or role | Model v0.1 treatment | Release blocker |
|---|---|---|---|
| `PV_FIXED_TILT_MODULE_FIELD` | Module/frame/clamp/retention damage | Candidate; no curve | No all-severity same-unit probability/cost chain |
| `PV_FIXED_TILT_SUPPORT_STRUCTURE` | Fixed rails/posts/braces/connections | Candidate; no curve | No qualified pressure bridge, response states, and cost |
| `PV_TRACKER_MODULE_FIELD` | Module/retention damage on exact tracker | Candidate; no curve | No TC-specific response/disposition/cost model |
| `PV_TRACKER_SBOS_ASSEMBLY` | Torque tube, bearings, drive, and structural BOS | Exact-system candidate; no curve | No qualified demand/history/state and economic chain |

Fixed and tracker units are mutually exclusive for one array subject. A future model must control
module/structure cascade and terminal-state precedence rather than sum overlapping replacement scopes.

## 5. Conditioner-only equipment

Tracker command, drive/lock, power, backup, and control systems are conditioner-only when their event-time
state changes physical response. They do not receive an independent array curve or automatic resilience
credit. Commanded stow is not attained stow.

Duration, cycling, wind direction/change, turbulence, maintenance condition, and damage precursors are also
conditioners. Unknown state receives no favorable or worst-case numerical default. The full role contract is
in the [site-condition adapter](proposed/SITE_CONDITION_ADAPTER_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md).

## 6. Reviewed secondary / low-materiality equipment

| Unit | Coverage role | Why no model v0.1 curve | Update trigger |
|---|---|---|---|
| `PV_FOUNDATION` | Separate physical candidate | Mixed boundary and no qualified wind-only disposition/cost chain | Architecture/geotechnical split and matched evidence |
| `PV_POWER_CONVERSION_AND_COLLECTION` | Split-required physical candidate | Point, line, network, enclosure, debris, and ingress mechanisms differ | Component split with direct-wind demand/disposition/cost |
| `PV_GSU_SUBSTATION` | Separate shared-component binding | Shared point/yard exposure and site value unresolved; no TC-wind response | Site BOM/ownership/value plus matched wind/disposition/cost |
| `PV_SCADA_COMMUNICATIONS` | Split-required candidate | Location, exposure, dependency, and cost unresolved | Subject-specific evidence and value |
| `PV_CIVIL_INFRA` | Split-required candidate | Roads, fencing, drainage, and buildings mix subjects/mechanisms | Asset-specific split and evidence |
| `PV_REPLACEMENT_SUPPORT` | Post-damage support allocation | Support is consequence cost, not a wind-fragility subject | Reviewed allocate-once reinstatement rule |

“Secondary” here does not assert low physical importance. It means the unit is explicit but not yet eligible
for a numerical curve.

## 7. DR≈0 / not-directly-affected buckets

Model v0.1 assigns **no physical bucket DR≈0 merely because evidence is missing**. Foundation, electrical,
GSU/substation, SCADA, and civil units remain withheld. Soft, sunk, financing, development, insurance, and
other nonphysical installed-cost rows are outside the direct-physical denominator; they are excluded rather
than given a physical zero curve.

| Bucket type | Model v0.1 disposition |
|---|---|
| Primary nonzero | None released; four array candidates withheld |
| Conditioner-only | Event-time tracker/control and history fields |
| Secondary / unresolved | Foundation, electrical/collection, GSU, SCADA, civil, support |
| DR≈0 direct effect | None asserted |
| Out of scope | Neighboring hazards, other PV archetypes, disruption, finance, annual/tail analytics |

## 8. Hazard x-axis decision

No runtime x-axis is frozen. NHC one-minute sustained surface wind at 10 m is an upstream storm-field object,
not local array demand. Saffir–Simpson category is context only.

The fixed-tilt research direction is a matched local event/design net-pressure ratio. The tracker research
direction is tracker-normal local wind divided by exact-system Ucrit plus duration/cycling and attained
angle/drive/lock/control state. Both require named, versioned bridges with exact source/target definitions,
uncertainty, and validity. No global converter or cross-architecture fallback is adopted.

## 9. Curve form and y-axis meaning

There is no runtime curve form or damage-ratio ordinate in model v0.1. The proposed artifact has
`curve_records: []`; numeric damage and loss outputs are withheld with `NO_RUNTIME_CURVE`.

The retained Ceferino candidate is a lognormal probability of site-level extensive structural failure for a
14-site Caribbean ground-mounted population. Its atom, architecture, composite clip/racking endpoint, and
lack of same-unit cost prevent use as component or whole-site economic DR. A future economic curve requires:

```text
DR_u = sum_s P(mutually_exclusive state_s | delivered demand, verified conditions)
             × E(same-unit cost ratio | state_s, selectors)
```

## 10. Selector / conditioner / exposure map

| Role | Examples | Model v0.1 rule |
|---|---|---|
| Selector | architecture, exact system/BOM, module/clamp, row geometry, foundation, design basis, tracker qualification | Select only verified candidate context; no numerical transfer or automatic credit |
| Conditioner | commanded/attained state, angle, drive/lock, power/control, duration, cycling, direction, turbulence, maintenance | Capture state; no universal multiplier or favorable unknown default |
| Axis bridge | source height/averaging/exposure, terrain/topography, gust/pressure, Ucrit, history | Produce one matching local demand with provenance, uncertainty, and validity |
| Exposure | module/row/block, point, line/network, GSU point/yard, civil geometry | Match demand and value at the same subject grain; no whole-site default |
| Value | same-unit direct replacement value | Convert qualified DR to cost; never substitute for fragility or exposure |
| Support | field labor, management, rental, inspection | Allocate once after qualified disposition; no intrinsic DR |

## 11. Value-link basis

The NLR Q1-2025 reference ledger in 2024 USD/kWdc is reusable for anatomy and reconciliation, not as a site
appraisal:

| Value layer | Reference value |
|---|---:|
| Module hardware | 291.21485143992487 |
| Mounting hardware | 109.98972602739727 |
| Direct hardware | 656.9814571503722 |
| Civil | 31.223744292237445 |
| Replacement support | 189.59050092005714 |
| Physical | 877.7957023626668 |
| Excluded nonphysical | 242.20429763733296 |
| Installed | 1120.0 |

Module plus mounting is `401.2045774673221`, or about 45.706% of physical and 35.822% of installed
reference value. Those are denominator relationships, never DR caps or supported loss shares. The mixed
`106.50466417910448` MV/substation row requires site BOM allocation before GSU loss can be reported.

## 12. Evidence and derivation pointer

Curve and withholding proof lives in the
[model v0.1 derivation dossier](proposed/tropical_cyclone_wind_solar_curve_derivation_dossier__model_v0_1__docs_r1.md).
The `BOUNDED_EVIDENCE_SEARCH_LOG`, `NUMERICAL_CANDIDATE_AUDIT`, source/claim/parameter registers,
`PRESSURE_TEST`, and `PROMOTION_GATE_MATRIX` carry the evidence limits and release decision.

The evidence supports field prevalence, mechanism plausibility, architecture-specific demand concepts, and
inspectable selectors/conditioners. It does not yet join representative local TC demand, exact architecture
and attained state, failure-unit disposition, same-unit cost, site value, and spatial exposure.

## 13. Workbook map

Workbook:
[damage_curve_records_tropical_cyclone_wind_solar__model_v0_1__docs_r1.xlsx](proposed/damage_curve_records_tropical_cyclone_wind_solar__model_v0_1__docs_r1.xlsx)

| Question | Workbook sheet |
|---|---|
| What is the scaffold status and where should I look? | `README` |
| Which seven modeling gates are open or closed? | `Seven_Steps` |
| How does the reference value basis reconcile? | `Asset_Value`, `Value_Crosswalk` |
| Which failure units and spatial grains are proposed? | `Failure_Units` |
| How is the Ceferino candidate reproduced without becoming DR? | `Candidate_Fragility` |
| Which selectors, conditioners, bridge fields, and missing-state rules apply? | `Site_Adapter` |
| Why are legacy numbers rejected? | `Legacy_Audit` |
| Which claims, sources, and parameter tiers govern the decision? | `Claim_Register`, `Source_Register`, `Parameter_Tiers` |
| Do value, formula, count, and withholding checks pass? | `QA_Checks` |

The workbook is an audit companion. The proposed JSON, governed registers, dossier, and metadata contract
remain authoritative.

## 14. Open seams and update triggers

Promotion remains blocked until all of the following close:

1. independently reviewed fixed-tilt and tracker source-to-local-demand bridges;
2. target-system applicability, exact architecture/BOM, and attained state;
3. all-severity, mutually exclusive disposition evidence rather than visible/extensive failure alone;
4. same-unit repair/replacement cost and dependency-safe module/structure consequences;
5. site values plus array, point, line/network, and GSU yard exposure;
6. foundation/electrical/GSU/SCADA/civil coverage or justified treatment; and
7. compound-event coordination for surge/flood, tornado, debris, rain ingress, hail, and lightning.

If private data remain unavailable, a separately approved Tier-4 elicitation may create a clearly labelled
screening model. It must not be described as claims- or field-calibrated.

## 15. Implementation notes

Start with the [first-reader basics](basics/README.md), then the
[build reasoning](basics/HOW_THE_MODEL_IS_BUILT.md) and [exact model reference](basics/MODEL_REFERENCE.md).
The proposed package overview and metadata specification in `proposed/`, the
[fail-closed artifact](proposed/tropical_cyclone_wind_solar__model_v0_1__docs_r1__curve_artifact.json), and
[validation report](proposed/VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md) define
the governed implementation boundary.

No artifact index, package release, canonical cell pin, or Hazard runtime is changed. The existing Hazard
hurricane/solar implementation remains a legacy regression fixture. A future cutover requires a reviewed
model v1.0 artifact using the repository-current runtime schema, exact model/docs/schema/SHA pinning, and an
explicit pathway-aware consumer migration.
