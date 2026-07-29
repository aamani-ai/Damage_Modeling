# Flood × wind — model reference

**Purpose:** dense lookup for the proposed failure units, fields, evidence, audit candidates, validation, and
release state. This reference describes a fail-closed research scaffold; it does not document a runtime
flood-wind curve.

## 1. Authority and identity

| Field | Exact value |
|---|---|
| Cell / damage code | `flood_wind` / `FLOOD_WIND_PROPOSED_V0_1` |
| Semantic model / human docs | `model v0.1` / `docs r1` |
| Runtime docs / consumer pin | `none` / `none` |
| Package baseline / release | `library v2.5` / `unreleased` |
| Lifecycle / promotion | `scaffold` / `proposed` |
| Canonical runtime artifact | `false`; absent from artifact index |
| Curve records / emit modes | `0` / none |
| Artifact schema | `damage_curve_record_bundle.v1`; noncanonical zero-curve envelope only |
| Artifact schema file SHA-256 | `76966b8cf892f26d5d6c6a574d8329793201e77fafde15edc9ea80f7e176d424` |
| Capability schema | `capability_declaration.v1` |
| Capability schema file SHA-256 | `60ace16d97cca9099882d5fbe3a2c221f4ed889f2e81aeaa57b52502299c96f5` |
| Zero-curve artifact SHA-256 | `8dde717bee7fb12db21b4a9b3b81f9927978edb7e2dc3e77691a64c578a6c9b3` |
| Standalone capability SHA-256 | `09b5909c4672f4ddbed583c6c098a61242ef4adf45a57c98dcef754150b3ddc2` |
| Change/non-change | Initial noncanonical scaffold documentation; no runtime behavior or consumer action |

Authority order for this unreleased workstream:

1. The [zero-curve JSON artifact](../proposed/flood_wind__model_v0_1__docs_r1__curve_artifact.json) defines the
   exact machine-readable scaffold and withholding state.
2. The [metadata specification](../proposed/flood_wind_damage_code_metadata_spec__model_v0_1__docs_r1.md) and
   [derivation dossier](../proposed/flood_wind_curve_derivation_dossier__model_v0_1__docs_r1.md) define the
   research contract and derivation decision.
3. The [workbook](../proposed/damage_curve_records_flood_wind__model_v0_1__docs_r1.xlsx), governed CSVs, and
   [KAT fixture](../proposed/known_answer_tests_flood_wind__model_v0_1__docs_r1.json) are auditable supporting
   views.
4. These basics pages explain but do not override the proposed package. The artifact index remains the
   authority for runtime availability—and contains no `flood_wind` row.

`observed`, `designed`, `derived`, `class_template`, `placeholder`, and `unknown` must remain explicit.
Examples below are `class_template` unless a source ID says otherwise.

## 2. Failure-unit inventory and coverage reconciliation

| ID | Physical subject | Coverage/treatment | Axis grain | Value/exposure basis |
|---|---|---|---|---|
| `FW_GSU_SWITCHGEAR` | Facility switchgear | Primary candidate; pinned neighbor only; no curve | Component point/polygon | Same switchgear instance/value; site owner and footprint |
| `FW_GSU_TRANSFORMER_MAIN` | Plant GSU main transformer | Primary candidate; dependency-safe state required; no curve | Component point/polygon | Main-body value only; do not charge controls twice |
| `FW_GSU_TRANSFORMER_AUX_CONTROLS` | Transformer auxiliaries/controls | Primary candidate; decomposition required; no curve | Component or dependency-safe assembly | Separate SOV/BOM value or governed assembly |
| `FW_GSU_PROTECTION_SCADA` | Protection/relay/control/SCADA/communications | Primary candidate; partial neighbor match; no curve | Cabinet/control room/assembly | Direct equipment value, never outage MW/BI |
| `FW_GSU_STATION_SERVICE_DC` | Station service and DC power | Primary candidate; new shared concept; no curve | Station-service/DC component | Separate site schedule; avoid control-value overlap |
| `FW_GSU_CABLE_TERMINATIONS` | GSU terminations/pull boxes/water paths | Secondary candidate; mechanism only; no curve | Point/pathway segment | Termination/path value, not full cable rollup |
| `FW_TURBINE_BASE_ELECTRICAL` | Base cabinet/converter/switchgear/control | Primary candidate; wind inventory required; no curve | Per turbine or verified cluster | Local unit value/count and local contact fraction |
| `FW_PADMOUNT_STEPUP_TRANSFORMER` | Pad/turbine step-up transformer | Primary candidate; wind inventory required; no curve | Per transformer or cluster | Installed unit value/count/owner |
| `FW_COLLECTION_CABLE_TERMINATIONS` | MV joints/terminations/pull boxes/conduit paths | Secondary candidate; network split required; no curve | Point-and-line network | Segment/termination schedule; no turbine-count proxy |
| `FW_TURBINE_FOUNDATION` | Foundation and supporting soil | Outside primary pathway; scour/erosion model required | Per-turbine hydraulic/geotechnical point | Foundation value only under separate pathway |
| `FW_CIVIL_ACCESS_DRAINAGE` | Roads/pads/drainage/buildings/fences | Mixed/outside primary pathway; split first | Line/network/polygon | Subject-specific civil value and mechanism |
| `FW_ELEVATED_TURBINE_EQUIPMENT` | Rotor/nacelle/tower equipment | Geometry-screened; not universal DR≈0 | Per turbine | Include only where verified water path reaches a subject |
| `SUPPORT_FIELDWORK` | Assembly/installation | Support once after disposition; no curve | Repair scope | Allocate once; not intrinsic denominator |
| `SUPPORT_TRANSPORT_LOGISTICS` | Transport/logistics | Support once after disposition; no curve | Replacement scope | Allocate once; not intrinsic denominator |

Coverage-role reconciliation:

| Standard role | Model v0.1 resolution |
|---|---|
| Primary nonzero | None approved; eight `primary_candidate` units are withheld |
| Conditioner-only | Drainage/pumping/flood defense, temporary protection, warning/isolation, and water-path state |
| Secondary / low-materiality | Two cable/termination units plus geometry-screened elevated equipment |
| DR≈0 direct effect | None encoded; verified no-contact is exposure state, not a fabricated runtime DR |
| Out of scope / separate pathway | Foundation scour/erosion, mixed civil until split, debris, wave, disruption/financial metrics |
| Support | Fieldwork and logistics allocated once after disposition; no independent curve |

## 3. Canonical curves, states, and audit candidates

### Runtime records

```json
"curve_records": []
```

There is no runtime valid range, interpolation, extrapolation, cap, parameter, or ordinate. Every otherwise
valid input reaches `null / withheld / NO_RUNTIME_CURVE`.

Proposed future x-axis:

```text
h_i = max(0, water_surface_elevation_m - component_vulnerable_elevation_m)
unit: m; exact common vertical datum required
```

Proposed future y-axis:

```text
conditional same-unit direct repair-or-replacement cost ratio
= E[cost_i / pre-event direct replacement value_i | qualified contact state]
```

### Pinned flood-solar neighbors — audit only

Depth grid in metres: `0, .02, .05, .15, .30, .60, 1.0, 1.5, 2.0`.

| Candidate | Exact DR ordinates | Flood-wind decision |
|---|---|---|
| `FS_SWG` | `0, .10, .40, .85, 1, 1, 1, 1, 1` | Nearest candidate; applicability/economic validation blocked |
| `FS_XFMR` | `0, .03, .10, .25, .45, .65, .80, .95, 1` | Reject direct reuse; split main versus auxiliaries/controls |
| `FS_SCADA` | `0, .15, .45, .90, 1, 1, 1, 1, 1` | Partial semantic match only |
| `FS_CABLE` | `0, .02, .05, .10, .15, .25, .40, .55, .65` | Mechanism transfer only |

Source pin: `flood_solar@model_v1_0__docs_r4`; artifact SHA-256
`a08e77ef034e1ecea3e7cd05d13c825921b54d610fca9de8651ebda8e857082d`. None is runtime-enabled here.

### ASCII state/curve views

```text
AUDIT-ONLY NEIGHBOR: FS_SWG (not flood_wind runtime)

h (m)  0    .02   .05   .15   .30   .60   1.0   1.5   2.0
DR     .00   .10   .40   .85  1.00  1.00  1.00  1.00  1.00
bar          #     ####  #########  ########## ...

FLOOD_WIND model v0.1 RUNTIME

h (m)  any validated value
curve  [no record]
DR     null / withheld / NO_RUNTIME_CURVE
```

```text
identity/pathway invalid? -------- yes --> REJECT / not evaluated
             |
            no
             v
geometry or datum incomplete? ---- yes --> REJECT / not dry
             |
            no
             v
curve lookup ----------------------------- EMPTY
                                               |
                                               `--> WITHHOLD DR and loss
```

## 4. Input and output field dictionary

| Field/group | Unit/reference | Requirement | Meaning | Missing/default behavior |
|---|---|---|---|---|
| `event_id`, `event_family_id` | identifiers | Required | Occurrence and compound-family identity | Reject; no fallback |
| `pathway_id` | enum | Required; exactly `flood_inundation_contact` | Mechanism route | Reject unsupported pathway |
| `source_peril_id` | identifier | Required | Riverine/pluvial/coastal source provenance | Reject missing; do not erase source peril |
| `hazard_product_id`, `hazard_valid_time` | ID/timestamp | Required | Hazard lineage/time | Reject missing |
| `asset_id` | identifier | Required | Wind-facility identity | Reject missing |
| `component_instance_id` | identifier | Required | One real or governed class-template subject | Reject missing/aggregate alias |
| `failure_unit_id` | proposed enum | Required | Atomic response/value subject | Reject `SUBSTATION` aggregate |
| `component_geometry` | point/line/polygon reference | Required | Geometry matching failure-unit grain | Reject mismatch |
| `geometry_provenance` | evidence-status enum | Required | Observed/designed/derived/class-template/placeholder/unknown | Preserve; no silent upgrade |
| `water_surface_elevation_m` | m, named vertical datum | Required for contact | Absolute event water level | Withhold/reject; not zero |
| `component_vulnerable_elevation_m` | m, same datum | Required for contact | First mechanism-specific contact point | Withhold/reject; not dry |
| `vertical_datum_id` | exact identifier | Required | Shared elevation reference | Mismatch rejects |
| `local_depth_above_component_datum_m` | m | Derived only | `max(0, WSE-z_i_crit)` | Never supplied from an incompatible grade depth |
| Equipment selectors | categorical/provenance | Capture required for compatibility | Family/function, voltage, make/model, enclosure, construction, vintage, permanent protection | Unknown explicit; no numeric variant |
| Event conditioners | state/provenance | Capture when available | Duration, contamination/salinity, energized/isolation, warning, pumping/protection, water path | Unknown explicit; no modifier/credit |
| `exposure_fraction` | `[0,1]` | Required for value touch | Fraction of same-unit value contacted | Withhold scenario loss if absent |
| `exposure_fraction_basis` | text/ID | Required with fraction | Inventory/spatial derivation | Turbine count cannot proxy facility GSU |
| `owner_entity_id`, `project_owned` | ID/bool/unknown | Required for baseline project loss | Ownership boundary | Unknown withholds baseline; dependency view may remain |
| `insured_inclusion` | bool/unknown | Required for insured view | Policy inclusion | Unknown withholds insured view |
| `value_basis_id` | versioned ID/date | Required for scenario loss | Valuation authority | Withhold scenario loss |
| `same_unit_direct_replacement_value_usd` | USD | Required for scenario loss | DR denominator for the same unit | Never substitute project TIV/mixed rollup |
| `quantity` | count | Required when unit-based | Installed inventory basis | Withhold assembly |
| `at_risk_value_usd` | USD | Derived | Value × exposure fraction | Does not create DR |
| `support_allocation_rule_id` | ID | Required if support added | One-time post-disposition fieldwork/logistics rule | Do not add automatically |
| `failure_unit_scalar_dr` | ratio `[0,1]` | Output | Direct physical same-unit DR | Always null/withheld in v0.1 |
| `scenario_loss_given_value_basis` | USD | Output | Conditional direct loss | Always null/withheld in v0.1 |
| Annual/tail metrics | distribution metrics | Downstream | EAL/PML/VaR/TVaR | Withheld; no curve/frequency/distribution |

## 5. Selector–conditioner–exposure–value separation

| Role | Fixed/event-time? | Select examples | Must not do |
|---|---|---|---|
| Selector | Fixed | Equipment family/construction, voltage, enclosure, transformer/cable/control architecture | Use “wind” versus “solar” as a sufficient selector |
| Conditioner | Event-time | Duration, contamination, energized/isolation, temporary protection, water path | Apply an unsourced modifier or favorable unknown default |
| Axis bridge | Event + geometry | WSE, vulnerable point, common datum | Mix datums or treat missing as dry |
| Exposure | Event + inventory | Geometry, count, fraction touched, basis | Change intrinsic fragility or allocate facility GSU by turbine count |
| Value/ownership | Valuation/contract | Same-unit value, owner, project/insured inclusion | Apply DR to project TIV or double-count shared equipment |

An intrinsic response may be shared across solar and wind only when equipment/construction, mechanism,
axis/datum, ordinate/denominator, fixed selectors, event conditioners, and evidence endpoint all match. The
shared substrate supplies vocabulary and compatibility checks; it does not supply runtime numerics.

## 6. Failure-unit value crosswalk

| Failure-unit group | Required denominator/bucket | Current source/status | Double-count guardrail |
|---|---|---|---|
| GSU switchgear | Same switchgear instance | Site USD/owner required | Not full substation, mixed electrical row, or TIV |
| GSU main transformer | Main active transformer system | Site USD/owner required | Do not charge low controls against full main value without safe state model |
| GSU auxiliaries/controls | Non-overlapping auxiliary/control assembly | SOV/BOM split required | Exclude value already in main transformer |
| Protection/SCADA and station DC | Direct physical equipment assemblies | Site schedule required | Exclude outage/BI and overlapping controls |
| GSU/collection terminations | Construction-specific termination/pathway subjects | Segment schedule required | Not full cable/network value |
| Turbine-base electrical | Per turbine/verified cluster equipment | Wind inventory and site USD required | Not solar inverter value or external-electrical rollup |
| Pad/turbine transformer | Installed unit | Count/owner/site USD required | Avoid overlap with turbine equipment and external electrical |
| Foundation | Foundation only under scour/erosion pathway | `120 2023 USD/kW` reference; site value required | No inundation curve or pooled value |
| Mixed civil | Split roads/pads/drainage/buildings/fences | `47 2023 USD/kW` reference; split required | No single mixed civil DR |
| Elevated turbine equipment | Only verified water-reached subject | `1,090 2023 USD/kW` reconciliation rollup | Geometry screen is not a DR cap or universal immunity |
| Fieldwork / transport | Post-disposition support | `100 + 194 = 294 2023 USD/kW` reference | Allocate once; no independent fragility |

The public reference has a mixed `72 2023 USD/kW` external-electrical row. It is not a GSU allocation and is
excluded from direct component denominators until split. Reference reconciliation is
`1,090 + 120 + 47 + 72 + 294 = 1,623 physical`; adding `345` excluded soft/sunk/nonphysical items gives
`1,968 installed`. These are class-reference ledgers, not observed site values, damage caps, or loss outputs.
See the full [value crosswalk](../proposed/VALUE_CROSSWALK_flood_wind__model_v0_1__docs_r1.csv).

## 7. Parameter tiers and update triggers

| Parameter/rule | Tier/status | Basis | Update trigger |
|---|---|---|---|
| Runtime curve count = 0 | Governed T4 withholding | No economic DR record passed audit | Reviewed model v1.0 output-bearing release |
| `h_i=max(0,WSE-z_i_crit)` | T2 method | FEMA/USACE/DOE local-datum framing | Validated stronger equipment demand measure |
| Runtime axis range | Withheld | Candidate grid is not an approved domain | Qualified numeric record |
| `FS_SWG` candidate points | T3 adjacent proxy; audit only | Pinned canonical flood-solar engineering curve | Exact equipment/economic validation |
| `FS_XFMR` reuse | Rejected | Main value and low control datum are not dependency-safe | Main/aux state and value model |
| `FS_SCADA` reuse | T3 partial match; audit only | Plant monitoring differs from protection/control | Equipment crosswalk and direct-cost evidence |
| `FS_CABLE` reuse | T3 mechanism only; audit only | Solar AC/DC rollup differs from wind MV subjects | Construction disposition/value evidence |
| Electrical reference value `72 USD/kW` | T2 reference; split blocked | NREL CWER mixed row | Site/OEM SOV split or newer value vintage |
| Foundation/civil/support references | T2 reference; response withheld | NREL CWER rows | Site split and pathway/claims evidence |
| Unknown ownership | Governed withholding | Agreement-specific boundary | Executed agreement/one-line/asset register |
| Missing component datum | Governed withholding | Exposure unknown cannot become dry | Approved uncertainty/default policy |

## 8. Capability and reportability

| Object | Cell v0.1 | Consumer consequence |
|---|---|---|
| Populated emit modes | None | No scalar/state output can be consumed |
| Failure-unit scalar DR | Withheld: `NO_RUNTIME_CURVE` | Cannot compute component loss |
| Scenario loss | Withheld: curve/value/exposure prerequisites | Complete value cannot bypass absent curve |
| Intrinsic vulnerability spread | Not carried | No probabilistic vulnerability claim |
| Scalar EAL | Withheld: also no hazard frequency/intensity distribution | Consumer must not annualize audit candidates |
| PML/VaR/TVaR | Withheld: also no annual loss distribution | No tail reporting |
| Cap binding | Fail closed; preflight not executed | Future scalar EAL requires cap/distribution validation |

`NO_RUNTIME_CURVE`, `MISSING_VALUE_BASIS`, `MISSING_EXPOSURE_OR_COUPLING`, and
`MISSING_HAZARD_FREQUENCY_OR_INTENSITY_DISTRIBUTION` remain explicit reason codes. The discrete candidate
tables are neither runtime emits nor uncertainty distributions.

## 9. Complete illustrative class-template event assembly

Every value in this example is `class_template` and fictional. It demonstrates routing and accounting, not a
site or CONUS default.

```text
event_id/family        teaching_event_001 / teaching_family_001
pathway/source peril   flood_inundation_contact / riverine_flood
hazard product/time    teaching_wse_v1 / 2026-01-01T00:00:00Z
asset                  teaching_wind_facility
WSE/datum              101.20 m / NAVD88
geometry provenance    class_template for every component
conditioners           8 hr; freshwater fixture; de-energized/isolated fixture
ownership/value basis  class_template project-owned fixture / teaching_value_v1
direct component value $100 per row solely for arithmetic; never export as an asset value
```

| Failure/support unit | Component elevation / derived state | Exposure fraction | At-risk value | DR / conditional loss |
|---|---:|---:|---:|---|
| `FW_GSU_SWITCHGEAR` | `101.00 m / h=.20 m` | `1.00` | `$100` | Withheld / withheld |
| `FW_GSU_TRANSFORMER_MAIN` | `101.40 m / h=0 m` | `0.00` | `$0` | Withheld / withheld; no curve means no numeric DR even at no contact |
| `FW_GSU_TRANSFORMER_AUX_CONTROLS` | `100.90 m / h=.30 m` | `1.00` | `$100` | Withheld / withheld |
| `FW_GSU_PROTECTION_SCADA` | `101.00 m / h=.20 m` | `1.00` | `$100` | Withheld / withheld |
| `FW_GSU_STATION_SERVICE_DC` | `100.80 m / h=.40 m` | `1.00` | `$100` | Withheld / withheld |
| `FW_GSU_CABLE_TERMINATIONS` | `100.60 m / h=.60 m` | `.50` | `$50` | Withheld / withheld |
| `FW_TURBINE_BASE_ELECTRICAL` | `100.75 m / h=.45 m` | `.50` | `$50` | Withheld / withheld |
| `FW_PADMOUNT_STEPUP_TRANSFORMER` | `100.95 m / h=.25 m` | `.50` | `$50` | Withheld / withheld |
| `FW_COLLECTION_CABLE_TERMINATIONS` | `100.50 m / h=.70 m` | `.25` | `$25` | Withheld / withheld |
| `FW_TURBINE_FOUNDATION` | Scour/erosion route required | — | — | Not evaluated: wrong pathway |
| `FW_CIVIL_ACCESS_DRAINAGE` | Mixed subject; split/route required | — | — | Not evaluated |
| `FW_ELEVATED_TURBINE_EQUIPMENT` | `110.00 m / h=0 m` | `0.00` | `$0` | Withheld / withheld; geometry screen, not universal DR≈0 |
| `SUPPORT_FIELDWORK` | Post-disposition only | — | — | No independent curve/allocation |
| `SUPPORT_TRANSPORT_LOGISTICS` | Post-disposition only | — | — | No independent curve/allocation |
| **Current-pathway direct at-risk value** | Non-overlapping illustrative rows | — | **`$575`** | **Loss total withheld; do not sum null outputs** |

```text
illustrative at-risk value contribution (not loss)

GSU switchgear       $100  ##########
GSU aux/controls     $100  ##########
GSU protection      $100  ##########
GSU station DC      $100  ##########
GSU terminations     $50  #####
turbine base          $50  #####
pad transformer       $50  #####
collection terms      $25  ##.
main/elevated           $0
                      ----
total                 $575 class_template at-risk value
conditional loss      WITHHELD — no approved DR exists
```

The facility GSU component instances are entered once. A `serves` relationship to both solar and wind would
not duplicate those values. Replacing the fictional `$100` rows with complete observed values still cannot
produce loss while `curve_records` is empty.

## 10. Validation status and reviewer checklist

Actual validation status from the [validation report](../proposed/VALIDATION_REPORT_flood_wind__model_v0_1__docs_r1.md):

| Check | Result |
|---|---|
| Scaffold validator | PASS: 698 checks |
| Governed registers | 15 sources, 18 claims, 13 parameter rows, 18 value rows, 6 shared-reuse rows |
| Failure units / fail-closed KATs | 14 / 16 |
| Workbook | 13 sheets; `QA_Checks` 13/13 PASS; rendered/inspected; no formula-error token |
| Runtime isolation | Empty curve records; no artifact-index row; no runtime-approved shared row |
| Regression checks | Five current artifacts plus adjacent proposals/scaffold and governance tests passed |
| Numerical curve KATs | **Absent by design**; no curve exists, so only contract/rejection tests run |

Reviewer checks before accepting this scaffold:

- Recompute the artifact, capability, KAT, and workbook hashes recorded in the validation report.
- Confirm `curve_records=[]`, all capability metrics are withheld, and no `flood_wind` artifact-index row exists.
- Confirm complete input still withholds and missing/mismatched datum never becomes dry.
- Confirm aggregate substation, wrong-pathway scour, solar fallback, and legacy fallback are rejected.
- Confirm one GSU/value instance, agreement-specific ownership, and same-unit denominators.
- Confirm every numeric candidate is labeled audit-only and its source pin resolves.
- Confirm no outage, BI, annual, or tail metric has entered the direct ordinate.
- Treat all promotion gates G2–G15 as unresolved unless their stated evidence and release controls are met.

## 11. Source register

The full governed register—with URL, access date, exact locator, permitted/prohibited inference, decision, and
notes—is [SOURCE_REGISTER_flood_wind__model_v0_1__docs_r1.csv](../proposed/SOURCE_REGISTER_flood_wind__model_v0_1__docs_r1.csv).

| Stable ID | Source role / locator | Tier | Central limit |
|---|---|---|---|
| `FW-S001` | FERC renewable-asset order, pp. 2–3 | T2 | Anatomy only; no flood response/value/owner |
| `FW-S002` | NEMA GD 1, §§4.3–4.4 | T2 | Disposition logic, not depth ordinates |
| `FW-S003` | NERC 2022 lesson, p. 1 | T3 adjacent case | Operational sensitivity, not same-unit cost DR |
| `FW-S004` | NERC 2015 severe-flood lesson | T3 adjacent case | Mechanism transfer only |
| `FW-S005` | FEMA P-348, §5.2 | T2 | Elevation/protection method, not wind curve |
| `FW-S006` | USACE HEC-FIA depth-percent reference | T2 | Tabular form only |
| `FW-S007` | DOE/FEMP PV flood guidance | T2 adjacent | Shared water-path/elevation concept only |
| `FW-S008` | NREL CWER 2024 land-based value breakdown | T2 | Reference ledger; no 9% GSU split or fragility |
| `FW-S009` | FERC pro forma LGIA definitions | T2 | Ownership is agreement-specific |
| `FW-S010` | Canonical `flood_solar@model_v1_0__docs_r4` | T3 neighbor | Candidates/method only; no runtime inheritance |
| `LEG-FW-001` | Hazard M3 wind-flood implementation, pinned commit/SHA | T4/rejected | Regression characterization only |
| `LEG-FW-002` | Hazard M4 coastal reconstruction, pinned commit/SHA | T4/rejected | Independent bypass characterization only |
| `GOVERNANCE_CONTRACT` | Damage-modeling standards/contracts | T4 governance | Control, not scientific calibration |
| `SHARED_SUBSTRATE` | Flood-electrical vocabulary/binding rules v0.1 | T4 governance | Non-runtime; no emit or approval |
| `BOUNDED_SEARCH_LOG` | Governed endpoint search and negative boundary | T3 bounded finding | Cannot claim universal evidence absence |

## 12. Version history and non-change statement

| Semantic model | Human docs | Runtime docs | Schema envelope | Artifact SHA-256 | Status / consumer action |
|---|---|---|---|---|---|
| `model v0.1` | `docs r1` | none | bundle v1 + capability v1, noncanonical empty scaffold | `8dde717bee7fb12db21b4a9b3b81f9927978edb7e2dc3e77691a64c578a6c9b3` | Proposed/unreleased; no pin, no consumer action |

Current capability SHA-256 is
`09b5909c4672f4ddbed583c6c098a61242ef4adf45a57c98dcef754150b3ddc2`; package baseline is
`library v2.5`. The [handoff](../../../contracts/hazard_handoff/flood_wind_model_v0_1_boundary.md) is a future
migration boundary, not authorization to load this package.

This reference completes human documentation only. It changes no semantic model, runtime docs, artifact or
schema bytes, curve/form/parameter, axis, selector, conditioner, exposure/value rule, emit meaning,
capability, package release, artifact index, M3/M4 logic, or consumer output. A future output-bearing release
must receive a new governed model/docs/schema/SHA tuple and explicit consumer migration.
