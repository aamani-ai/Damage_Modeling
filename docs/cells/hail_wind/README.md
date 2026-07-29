# Hail × onshore wind

## 1. Cell identity

```yaml
cell_id: hail_wind
pathway_id: hail_impact
damage_code_id: HAIL_WIND_PROPOSED_V0_1
semantic_damage_model_version: model v0.1
human_documentation_revision: docs r2
runtime_scaffold_revision: docs r1
canonical_runtime_pin: none
lifecycle_state: scaffold
promotion_status: proposed
review_status: deep_curated_strict_no_go
model_grade: no_runtime_curve_research_scaffold
canonical_runtime_artifact: false
curve_records: 0
runtime_reason: NO_RUNTIME_CURVE
package_release: unreleased
```

This is the first governed direct-hail cell for modern land-based, multi-megawatt horizontal-axis wind
facilities. It closes the first of the two intentionally deferred hazard × asset coverage gaps. Model v0.1
is a fail-closed research package: it establishes the physical boundary, failure units, evidence trail,
value ledger, metadata contract, tests, and promotion gates without publishing a numeric damage curve.

The docs-r2 deep-curation pass independently reopened public primary evidence, legacy/runtime mappings, and
the Hazard consumer seam. It found stronger coated-coupon, operational-field, simulation, draft-test-method,
and inspection evidence, but no defensible economic curve. The semantic model therefore remains v0.1; the
machine-shaped docs-r1 artifact, capability, KATs, and workbook are unchanged.

## 2. Snapshot tree

```text
hail × onshore wind
├─ primary physical candidate — no curve
│  └─ WT_BLADE_ASSEMBLY
│     ├─ leading-edge protection / coating
│     ├─ shell and laminate
│     └─ mutually exclusive inspect / repair / replace states required
│
├─ operating-state conditioners — no independent hail DR
│  ├─ rotor speed / parked or operating state
│  ├─ blade pitch and azimuth history
│  └─ shutdown command versus attained state
│
├─ explicit withheld units — not DR≈0
│  ├─ WT_NACELLE_EXPOSED_ASSEMBLY
│  ├─ WT_TOWER_AND_EXTERNAL_FIXTURES
│  ├─ WT_PAD_ELECTRICAL
│  ├─ WT_COLLECTION_NETWORK
│  ├─ WT_GSU_SUBSTATION
│  └─ WT_CONTROL_AND_MET_STATION
│
├─ direct-hail neighboring / geometry-screened units
│  ├─ WT_FOUNDATION
│  └─ WT_CIVIL_INFRA
│
├─ SUPPORT_FIELDWORK / SUPPORT_TRANSPORT_LOGISTICS — allocate once
└─ every numeric DR and loss output withheld in model v0.1
```

## 3. Scope and exclusions

In scope is occurrence-based direct physical impact of atmospheric hail on an onshore wind facility. The
primary subject is a turbine blade assembly exposed while rotating, idling, or parked. Known turbine
coordinates are point subjects for consumer coupling; the lease polygon is not a damageable solid asset.

Separately routed or deferred are convective straight-line wind, tornado, lightning, rain-only leading-edge
erosion, ice accretion, chronic multi-year hydrometeor fatigue, hail accumulation/meltwater flooding,
debris, offshore wave/support loading, business interruption, derating, revenue, insurance, frequency,
EAL, PML, VaR, TVaR, and portfolio accumulation. A single thunderstorm may contain hail, wind, tornado,
lightning, and flood pathways; downstream systems must preserve one `event_family_id` and reconcile the
same physical state/value only once.

## 4. Primary nonzero failure-unit(s)

There is **no released nonzero failure unit** in model v0.1. `WT_BLADE_ASSEMBLY` is the primary candidate:

| Candidate | Intended mechanism | Model v0.1 treatment | Release blocker |
|---|---|---|---|
| `WT_BLADE_ASSEMBLY` | Hail impact on leading-edge protection, coating, shell, laminate, and bonded blade structure | Candidate; no curve | No matched event demand → inspected disposition → same-blade direct cost chain |

The blade is kept as a dependency-safe assembly because a coating repair, laminate repair, and terminal
blade replacement are mutually exclusive or nested states. A future model must not add a coating DR to a
full-blade replacement DR for the same damaged material.

## 5. Conditioner-only equipment

Rotor speed, parked/operating state, blade pitch, azimuth, control availability, shutdown command and
attained state affect relative impact speed, impact angle, and cumulative strikes. They are event-time
conditioners, not turbine identity and not occurrence frequency. Unknown operating state receives no
automatic resilience credit or worst-case numeric substitution.

Leading-edge protection system, coating/laminate construction, blade make/model, design vintage, prior
condition, repair history, rotor diameter, and rated speed are fixed selectors. The complete separation is
in the [site-condition adapter](proposed/SITE_CONDITION_ADAPTER_hail_wind__model_v0_1__docs_r1.md).

## 6. Reviewed secondary / low-materiality equipment

| Unit | Coverage role | Why no model v0.1 curve | Update trigger |
|---|---|---|---|
| `WT_NACELLE_EXPOSED_ASSEMBLY` | Withheld candidate | Covers, coolers, instruments, and exposed appurtenances have different impact resistance and value | Inspected hail-specific disposition and same-unit cost |
| `WT_TOWER_AND_EXTERNAL_FIXTURES` | Withheld candidate | Steel tower, coating, ladder/cabling fixtures, and sensors cannot share one impact endpoint | Subject split plus matched evidence |
| `WT_PAD_ELECTRICAL` | Withheld point subject | Enclosures, bushings, arresters, and controls differ | Exact BOM, position, protection, disposition, and cost |
| `WT_COLLECTION_NETWORK` | Withheld line/network subject | Mostly buried/overhead topology and direct-impact relevance vary | Site topology and component evidence |
| `WT_GSU_SUBSTATION` | Withheld shared point/yard subject | Exposed equipment and buildings require separate impact, ownership, and value binding | Site BOM/SOV/ownership plus matched response evidence |
| `WT_CONTROL_AND_MET_STATION` | Withheld point subject | Sensors/buildings and dependencies differ | Exact subject inventory and evidence |
| `WT_FOUNDATION` | Geometry-screened; no numeric zero | Direct atmospheric impact is not a qualified damage pathway; accumulation/flood is separate | Evidence of direct hail destruction or a new pathway |
| `WT_CIVIL_INFRA` | Split-required | Roads, crane pads, buildings, fencing, and drainage mix physical subjects | Subject-specific split and evidence |

“Withheld” means no supported numeric output. It does not mean undamaged.

## 7. DR≈0 / not-directly-affected buckets

Model v0.1 publishes no numeric DR≈0 record. Foundation and most buried civil/collection assets are
geometry-screened from direct atmospheric impact, while hail accumulation or meltwater effects route to
other pathways. Soft, sunk, finance, warranty, insurance, development, and other nonphysical rows are
excluded from the physical denominator rather than assigned a physical zero curve.

| Bucket type | Model v0.1 disposition |
|---|---|
| Primary nonzero | None released; blade assembly candidate withheld |
| Conditioner-only | Rotor/control/operating state |
| Secondary / unresolved | Nacelle, tower fixtures, pad electrical, collection, GSU, controls/met, civil |
| DR≈0 direct effect | None published numerically |
| Out of scope | Neighboring hazards, chronic degradation, disruption, finance, annual/tail analytics |

## 8. Hazard x-axis decision

No runtime x-axis is frozen. NOAA/NWS observed hail diameter and MRMS MESH are source-native event
descriptors, not blade demand. Direct blade response depends on the hail size distribution, hail density,
fall/event wind vector, local blade velocity, impact angle, strike count/duration, blade section, and
material/protection state.

The leading research axis is a qualified **contact-normal impact-energy/history object**, not diameter
alone:

```text
source hail field + wind vector + rotor/pitch/azimuth history
  -> hailstone trajectory and relative velocity at blade section
  -> contact-normal energy and strike history
  -> inspected blade state
```

Until a versioned bridge and validation domain exist, MESH, observed maximum diameter, severe-hail class,
or a solar-module diameter curve cannot select a wind-turbine damage record.

## 9. Curve form and y-axis meaning

There is no runtime curve form or ordinate in model v0.1. The proposed artifact has
`curve_records: []`, and all damage/loss metrics are withheld with `NO_RUNTIME_CURVE`.

The strongest recent public wind evidence predicts cumulative blade-coating life from rain and hail over
years. That is useful mechanism and lifecycle evidence, but it is not the occurrence-based physical
replacement-cost ratio owned by this repository. A future ordinate would be:

```text
DR_blade(x,s) = Σ_k P(mutually_exclusive state_k | delivered impact history x, verified state s)
                    × E(direct same-blade repair/replacement cost ratio | state_k, selectors)
```

Power-production loss and downtime remain outside this curve.

## 10. Selector / conditioner / exposure map

| Role | Examples | Model v0.1 rule |
|---|---|---|
| Pathway | `hail_impact` | Exact match; no wind, tornado, rain, lightning, ice, or flood fallback |
| Selector | blade/OEM model, LEP/coating, laminate, rotor geometry, design/repair vintage | Capture exact identity; no cross-blade numeric transfer |
| Conditioner | rotor speed, operating/parked, pitch, azimuth, shutdown/attained state, prior condition | Capture event state; no generic modifier or favorable unknown default |
| Bridge inputs | hail diameter/distribution, density basis, event wind vector, duration, turbine kinematics | Feed one qualified trajectory/contact model when available |
| Derived demand | blade-section contact-normal energy and strike history | Required future demand; no current runtime bridge |
| Exposure | per-turbine point/rotor; BOP point, line/network, or yard polygon | Intersect the actual subject; do not use the lease polygon as fully damaged value |
| Value | same-unit direct replacement value | Convert qualified DR to cost only; not fragility or exposure |
| Support | inspection, rope/crane access, fieldwork, transport | Allocate once after disposition; no intrinsic hail DR |

## 11. Value-link basis

The NREL Cost of Wind Energy Review reference ledger is reusable for anatomy and reconciliation, not as a
site appraisal:

| Value layer | 2023 USD/kW |
|---|---:|
| Blade hardware | 282 |
| Other turbine equipment | 808 |
| Turbine equipment total | 1,090 |
| Foundation + civil + external electrical | 239 |
| Fieldwork + transport/logistics support | 294 |
| Physical reference | 1,623 |
| Excluded soft/sunk/nonphysical | 345 |
| Installed reference | 1,968 |

The blade row is about 17.375% of physical and 14.329% of installed reference value. Those percentages are
denominator relationships, not loss caps or default exposure shares. Site/OEM blade values, turbine count,
mixed electrical allocation, replacement logistics, and subject coordinates remain mandatory for loss.

## 12. Evidence and derivation pointer

Curve and withholding proof lives in the
[derivation dossier](proposed/hail_wind_curve_derivation_dossier__model_v0_1__docs_r1.md). The source,
claim/parameter, and parameter-tier registers; bounded search; numerical audit; legacy audit; pressure test;
and promotion matrix make the decision reviewable.

Public evidence supports the hail/rotating-blade mechanism, candidate demand variables, blade-state
classification, lifecycle relevance, and repair-cost anatomy. It does not yet join one occurrence's local
impact history to mutually exclusive inspected blade disposition and same-blade direct economic
consequence for a representative onshore population.

The current [docs-r2 evidence overview](proposed/README_hail_wind__model_v0_1__docs_r2.md),
[strict v1 decision](proposed/DEEP_CURATION_DECISION_hail_wind__model_v0_1__docs_r2.md), and
[updated promotion matrix](proposed/PROMOTION_GATE_MATRIX_hail_wind__model_v0_1__docs_r2.md) supersede the
docs-r1 evidence cutoff for planning. They do not supersede or modify the docs-r1 runtime-shaped scaffold.

## 13. Workbook map

Workbook: [damage_curve_records_hail_wind__model_v0_1__docs_r1.xlsx](proposed/damage_curve_records_hail_wind__model_v0_1__docs_r1.xlsx)

| Question | Workbook sheet |
|---|---|
| What is the package state? | `README` |
| Which seven gates are open or closed? | `Seven_Steps` |
| How does wind value reconcile? | `Asset_Value`, `Value_Crosswalk` |
| Which failure units are candidates or withheld? | `Failure_Units` |
| Which public numerical candidates were reviewed? | `Candidate_Audit` |
| How are identity, state, demand, exposure, and value separated? | `Site_Adapter` |
| What local placeholder or neighboring material exists? | `Legacy_Audit` |
| Which claims, sources, and parameter tiers govern the result? | `Claim_Register`, `Source_Register`, `Parameter_Tiers` |
| Do reconciliation, counts, and fail-closed controls pass? | `QA_Checks` |

The workbook is an audit view. JSON, governed registers, dossier, and metadata contract remain authoritative.

## 14. Open seams and update triggers

Promotion remains blocked until all of these close:

1. an occurrence-compatible hail field with size distribution, timing, wind vector, and uncertainty;
2. an independently reviewed source-to-blade contact-demand bridge;
3. exact blade/LEP/laminate and turbine operating-state applicability;
4. inspected, mutually exclusive coating/repair/structural/replacement states across severity;
5. same-blade repair/replacement cost excluding BI and allocating access/logistics once;
6. turbine point, BOP geometry, ownership, value, and compound-event reconciliation; and
7. independent science, blade engineering, value, contract, and consumer review.

If public or private evidence remains insufficient, a separately approved Tier-4 screening elicitation is
possible, but it must not be described as field- or claims-calibrated.

## 15. Implementation notes

Start with [basics](basics/README.md), then [build reasoning](basics/HOW_THE_MODEL_IS_BUILT.md) and the
[model reference](basics/MODEL_REFERENCE.md). The [docs-r2 package overview](proposed/README_hail_wind__model_v0_1__docs_r2.md),
[deep-curation decision](proposed/DEEP_CURATION_DECISION_hail_wind__model_v0_1__docs_r2.md), and
[validation report](proposed/VALIDATION_REPORT_hail_wind__model_v0_1__docs_r2.md) define the latest human
and evidence boundary. The unchanged [fail-closed JSON](proposed/hail_wind__model_v0_1__docs_r1__curve_artifact.json),
[known-answer tests](proposed/known_answer_tests_hail_wind__model_v0_1__docs_r1.json), and
[workbook](proposed/damage_curve_records_hail_wind__model_v0_1__docs_r1.xlsx) remain the machine-shaped
implementation boundary.

No artifact-index row, package release, canonical pin, schema, or Hazard runtime is changed. The Hazard
hail/wind-farm planning notes remain consumer geometry guidance, not a vulnerability curve. A future
model-v1.0 cutover requires a reviewed output-bearing artifact on the repository-current schema and an
exact model/docs/schema/SHA migration.
