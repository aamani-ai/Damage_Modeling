# Flood × wind — how the model is built

**Purpose:** explain the governed reasoning from question through SHIP. For the physical introduction and one
worked example, start with the [basics README](README.md). For exact records, fields, sources, tests, and
versions, use the [model reference](MODEL_REFERENCE.md).

```yaml
cell_id: flood_wind
semantic_model: model v0.1
human_docs: docs r1
runtime_docs: none
consumer_pin: none
artifact_schema: damage_curve_record_bundle.v1 (noncanonical zero-curve envelope)
capability_schema: capability_declaration.v1
artifact_sha256: 8dde717bee7fb12db21b4a9b3b81f9927978edb7e2dc3e77691a64c578a6c9b3
change_class: initial_noncanonical_scaffold_documentation
runtime_behavior_changed: false
```

## Source hierarchy

```text
no canonical flood_wind runtime artifact or consumer pin exists

governed proposed JSON artifact + capability
    -> exact fail-closed scaffold fields and zero-curve behavior

derivation dossier + metadata specification + governed CSVs/workbook
    -> evidence, rationale, interface, candidates, and audit trail

basics folder
    -> reader-friendly synthesis only
```

If basics conflicts with the proposed JSON or dossier, stop and reconcile the documentation. Do not promote
prose, workbook candidates, or neighboring-cell numerics into runtime behavior.

## Complete build path

```text
STAGE 0  QUESTION     Define the direct-physical endpoint and exclusions.
STAGE 1  EVIDENCE     Bound what each source may support.
STAGE 2  GRAIN        Identify the physical failure/value units and coverage roles.
STAGE 3  AXIS         Deliver component-local contact intensity on one datum.
STAGE 4  FORM         Choose a mechanism-compatible form; withhold unsupported numbers.
STAGE 5  ADJUSTMENTS  Separate selectors, conditioners, exposure, and value.
STAGE 6  EMIT         Return only what the cell can honestly support.
STAGE 7  SHIP         Publish only an exact reviewed model/docs/schema/SHA tuple.
```

## Stage 0 — QUESTION

The decisive question is:

> What same physical unit is contacted, repaired or replaced, and valued when floodwater reaches a wind
> facility component?

```text
NOT: site flood depth -> one whole-wind-farm DR

YES: event state + component instance/geometry
       -> local failure-unit intensity
       -> qualified same-unit DR
       -> explicit value/exposure assembly
```

The direct endpoint is repair/replacement destruction for one occurrence. Scour/erosion, debris, and wave
loading route separately. Outage, downtime, BI, revenue, frequency, EAL/PML/VaR/TVaR, insurance, and portfolio
aggregation are not part of the intrinsic DR.

## Stage 1 — EVIDENCE

| Evidence ID | Role | Permitted support | Does not support |
|---|---|---|---|
| `FW-S001` | Wind/solar facility anatomy | Common facility bus and Plant GSU concept | Flood response, value, ownership, universal configuration |
| `FW-S002` | Wet electrical-equipment disposition | Split equipment families and inspect/recondition/replace logic | Continuous depth-to-cost ordinates |
| `FW-S003`, `FW-S004` | Flooded-substation cases | Controls/protection/station-service mechanisms and operational materiality | Same-unit economic DR; outage-to-damage conversion |
| `FW-S005` | Elevation/protection method | Component vulnerable datum and protection framing | Wind-component curve numerics |
| `FW-S006` | Curve-form precedent | Transparent tabular form and interpolation | Electrical ordinates |
| `FW-S007` | Adjacent solar flood mechanisms | Elevation, submersion, conduit/water-path concepts where equipment matches | Wind-specific value or universal curve |
| `FW-S008` | Wind reference value ledger | Reference categories and mixed `72 USD/kW` electrical row | GSU allocation, fragility, ownership, site value |
| `FW-S009` | Interconnection boundary | Require agreement-specific ownership evidence | Ownership from proximity or function |
| `FW-S010` | Canonical flood-solar neighbor | Local-depth method and exact pinned audit candidates | Automatic flood-wind runtime inheritance |
| `LEG-FW-001`, `LEG-FW-002` | Legacy regression fixtures | Characterize M3/M4 formulas for migration tests | Scientific calibration, value basis, or fallback |

Evidence-to-parameter conclusion:

```text
component-local depth bridge                         T2 source/physics anchored
asset-neutral equipment vocabulary/compatibility     governed method, non-runtime
solar candidate ordinates                            T3 adjacent proxy, audit only
legacy anchored logistics                            T4/rejected, regression only
flood_wind numerical response                        WITHHELD — endpoint chain incomplete
```

The bounded search did not locate a public, target-matched chain from depth/contact state through equipment
disposition to same-unit direct cost. That is a bounded negative finding, not a claim that private, later,
non-English, or unindexed evidence cannot exist.

## Stage 2 — GRAIN and coverage

The GSU/substation is decomposed because water may reach low controls before the main transformer body, and
those units have different disposition, value, and dependency semantics.

```text
land-based wind generation facility
├─ FACILITY_GSU_SUBSTATION — one physical shared system
│  ├─ FW_GSU_SWITCHGEAR                    primary candidate; withheld
│  ├─ FW_GSU_TRANSFORMER_MAIN              primary candidate; withheld
│  ├─ FW_GSU_TRANSFORMER_AUX_CONTROLS      primary candidate; withheld
│  ├─ FW_GSU_PROTECTION_SCADA              primary candidate; withheld
│  ├─ FW_GSU_STATION_SERVICE_DC            primary candidate; withheld
│  └─ FW_GSU_CABLE_TERMINATIONS            secondary candidate; withheld
├─ REPEATED_TURBINE_ELECTRICAL
│  ├─ FW_TURBINE_BASE_ELECTRICAL           primary candidate; withheld
│  └─ FW_PADMOUNT_STEPUP_TRANSFORMER       primary candidate; withheld
├─ PLANT_COLLECTION
│  └─ FW_COLLECTION_CABLE_TERMINATIONS     secondary candidate; withheld
├─ FW_ELEVATED_TURBINE_EQUIPMENT           geometry-screened; not universal DR≈0
├─ FW_TURBINE_FOUNDATION                   separate scour/erosion pathway
├─ FW_CIVIL_ACCESS_DRAINAGE                mixed subject; split/pathway work required
└─ SUPPORT_FIELDWORK / TRANSPORT_LOGISTICS post-disposition allocation once; no curve
```

Conditioner/exposure-only states include drainage, pumping, barriers, temporary protection, warning, and
isolation. There are no approved primary-nonzero or DR≈0 runtime records; “withheld” does not mean immune.
One physical GSU is represented and valued once even if it serves solar and wind consumers.

## Stage 3 — AXIS

```text
h_i = max(0, WSE - z_i_crit)

h_i       local depth above component i's vulnerable datum, metres
WSE       event water-surface elevation
z_i_crit  absolute component vulnerable elevation
```

| Axis property | Rule |
|---|---|
| Spatial grain | Component point/footprint, turbine/cluster point, or line/network as declared by unit |
| Vertical reference | Exact common `vertical_datum_id` required |
| Source peril | Preserve riverine/pluvial/coastal identity and event family |
| Missing component datum or WSE | Withhold/reject; never infer dry |
| Datum or geometry-grain mismatch | Reject |
| Runtime valid range | Withheld because no runtime curve exists |
| Candidate range | `0–2 m` only for pinned flood-solar audit records |
| Extrapolation | Rejected |

Rejected axes include grade depth applied uniformly, turbine-centroid depth for a GSU, outage MW, and cabinet
local depth used as a proxy for scour or debris.

## Stage 4 — FORM and y-axis

Piecewise/tabular state curves are the preferred future representation: water contact and the resulting
inspection/reconditioning/replacement disposition are threshold/state-like and should remain reviewable.

Proposed future ordinate:

```text
E[direct repair-or-replacement cost_i / pre-event direct replacement value_i
  | delivered contact state, verified selectors, verified conditioners]
```

The numerator and denominator use the same failure unit. The ordinate excludes outage, BI, revenue,
frequency, insurance terms, and unrelated project value.

```text
MODEL v0.1 RESPONSE STATE

validated h_i -> curve lookup -> no record
                                  |
                                  +-> DR = null / NO_RUNTIME_CURVE

runtime DR
1.0 |               [no approved curve]
0.5 |               [no approved points]
0.0 +------------------------------------ h_i (m)
     0       0.5       1.0       1.5   2.0
```

The exact `FS_SWG`, `FS_XFMR`, `FS_SCADA`, and `FS_CABLE` neighboring ordinates are retained only in the
[candidate audit](../proposed/NUMERICAL_CANDIDATE_AUDIT_flood_wind__model_v0_1__docs_r1.md). Direct transformer
reuse is rejected because a main-transformer value and a low control/terminal contact state are not a
dependency-safe unit. One plant logistic and the legacy M3/M4 curves are also rejected.

## Stage 5 — ADJUSTMENTS and assembly

| Concept | Cell examples | Correct effect in v0.1 |
|---|---|---|
| Fixed selector | equipment/construction, voltage, indoor/outdoor, enclosure, transformer/cable/control architecture | Capture and compatibility validation only |
| Event conditioner | duration/contact history, contamination/salinity, energized/shutdown/isolation, temporary protection, water path | Preserve explicit state; no numeric modifier |
| Axis bridge | WSE, vulnerable elevation, common datum | Reproducibly derive `h_i` |
| Exposure | geometry, component count, at-risk fraction and basis | Identify value touched; never change intrinsic response |
| Value/ownership | component owner, project/insured inclusion, same-unit value, quantity | Future scenario-loss denominator and scope |
| Support | fieldwork and transport | Allocate once after a qualified disposition; no independent curve |

Future direct loss is `Σ_i DR_i × value_i × exposure_fraction_i`. Unknown ownership excludes baseline
project physical loss but may remain in a clearly labeled dependency/sensitivity view. The mixed reference
electrical row cannot substitute for component values.

Shared response is allowed only when this complete compatibility key matches:

```text
equipment/construction + mechanism + axis/datum + ordinate/denominator
+ fixed selectors + event conditioners + evidence endpoint
```

The label “solar” or “wind” is not itself an intrinsic selector. Component instances, exposure, ownership,
value, capability, and release remain cell-local bindings.

## Stage 6 — EMIT

| Output/capability | Model v0.1 status |
|---|---|
| Failure-unit scalar DR | withheld: `NO_RUNTIME_CURVE` |
| Scenario loss given value | withheld: curve, value, and coupling prerequisites |
| Populated emit modes | none |
| Intrinsic spread | not carried |
| Scalar EAL | withheld; also needs hazard frequency/intensity and cap preflight |
| PML/VaR/TVaR | withheld; also needs a validated annual loss distribution |

Validation order is identity → pathway → failure-unit grain → geometry/datum → captured selectors and
conditioners → fail-closed DR → fail-closed loss/annual/tail metrics. No complete input may bypass the empty
curve set, and neither solar candidates nor legacy equations are fallback behavior.

## Stage 7 — SHIP

The exact research-state tuple is:

| Pin element | Exact value |
|---|---|
| Semantic model | `model v0.1` |
| Human docs | `docs r1` |
| Runtime docs / consumer pin | `none / none` |
| Package release | `unreleased`; absent from artifact index |
| Artifact schema | `damage_curve_record_bundle.v1`; selected only because output-bearing v2 cannot represent an honest empty bundle |
| Artifact schema file SHA-256 | `76966b8cf892f26d5d6c6a574d8329793201e77fafde15edc9ea80f7e176d424` |
| Capability schema | `capability_declaration.v1` |
| Capability schema file SHA-256 | `60ace16d97cca9099882d5fbe3a2c221f4ed889f2e81aeaa57b52502299c96f5` |
| Zero-curve artifact SHA-256 | `8dde717bee7fb12db21b4a9b3b81f9927978edb7e2dc3e77691a64c578a6c9b3` |
| Standalone capability SHA-256 | `09b5909c4672f4ddbed583c6c098a61242ef4adf45a57c98dcef754150b3ddc2` |
| Runtime authority | none; noncanonical scaffold only |

Promotion requires a new output-bearing model on the repository-current schema, model/docs/schema/SHA pins,
artifact-index publication, numerical KATs, and consumer migration. Hazard M3 and its independent M4 coastal
reconstruction both require dual-read/bypass/rollback treatment; changing M3 alone is insufficient.

## Cross-reference map

| Question | Authority/pointer |
|---|---|
| What does a first reader need? | [Basics README](README.md) |
| What are the exact records, candidates, inputs, and tests? | [Model reference](MODEL_REFERENCE.md) |
| What evidence and derivation support the decision? | [Derivation dossier](../proposed/flood_wind_curve_derivation_dossier__model_v0_1__docs_r1.md) |
| What is the exact research input contract? | [Metadata specification](../proposed/flood_wind_damage_code_metadata_spec__model_v0_1__docs_r1.md) |
| What does the machine-readable scaffold contain? | [Zero-curve artifact](../proposed/flood_wind__model_v0_1__docs_r1__curve_artifact.json) |
| What was tested? | [Validation report](../proposed/VALIDATION_REPORT_flood_wind__model_v0_1__docs_r1.md) |
| How may cross-asset reuse work later? | [Shared-component standard](../../../method/standards/20_shared_component_substrate_standard.md) |
| What must Hazard do on a future release? | [Handoff boundary](../../../contracts/hazard_handoff/flood_wind_model_v0_1_boundary.md) |

## Documentation non-change statement

This page completes the reader explanation inside unreleased `model v0.1 / docs r1`. It changes no runtime
artifact, schema, curve/form/parameter, axis, selector, conditioner, exposure/value behavior, emit meaning,
capability, package release, artifact-index row, consumer pin, M3/M4 logic, or output. Identical consumer
inputs therefore produce identical legacy consumer outputs; no consumer action is authorized by this
documentation.
