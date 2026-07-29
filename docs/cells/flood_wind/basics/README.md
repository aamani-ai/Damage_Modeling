# Flood × wind — basics

**Start here.** This page explains what can flood at a land-based wind facility, why the facility GSU is a
component system rather than “the wind farm,” and why the current package deliberately returns no damage
ratio.

```yaml
cell_id: flood_wind
audience: first-time reader
basics_set_revision: r1
cell_model_version: model v0.1
human_documentation_revision: docs r1
runtime_documentation_revision: none
canonical_runtime_pin: none
research_artifact_schema: damage_curve_record_bundle.v1 (zero-curve envelope only)
research_artifact_sha256: 8dde717bee7fb12db21b4a9b3b81f9927978edb7e2dc3e77691a64c578a6c9b3
change_class: initial_noncanonical_scaffold_documentation
runtime_behavior_changed: false
```

Every number in the examples below is labeled `class_template`: it is fictional teaching data, not a
surveyed asset fact or universal default. The governed proposed package is the technical authority; this
folder is a reader view. Any later Google Drive or DOCX publication is also a derived view.

## How to use this folder

| Need | File |
|---|---|
| Plain-language physical and calculation view | This page |
| Evidence-to-SHIP reasoning | [How the model is built](HOW_THE_MODEL_IS_BUILT.md) |
| Exact fields, inventory, candidates, sources, tests, and versions | [Model reference](MODEL_REFERENCE.md) |
| Governed cell entrypoint | [Cell README](../README.md) |

## 1. Five ideas to remember

1. Flood risk at a wind site often sits in low electrical equipment, not the elevated rotor or nacelle.
2. The curve-driving quantity is water depth above each component’s **first vulnerable point**, not one site
   depth applied to every asset.
3. A GSU transformer, switchgear, relay/control equipment, station DC, and cable terminations are different
   failure and value units even when people casually call all of them “the substation.”
4. Solar and wind may share an intrinsic component response only when equipment, mechanism, axis, ordinate,
   selectors, conditioners, and evidence endpoint match; the site still supplies exposure, owner, and value.
5. Model v0.1 has zero approved curves. Complete input still produces `NO_RUNTIME_CURVE`, not zero and not a
   borrowed solar or legacy result.

## 2. What question does this workstream answer?

The target question is:

```text
For one flood event, which physical wind-facility component was contacted by water,
what same-unit direct repair/replacement ratio follows, and what value was actually touched?
```

The intended future chain is:

```text
event water state + component geometry
        -> local component intensity
        -> qualified failure-unit response
        -> DR × same-unit value × exposure fraction
        -> conditional direct physical event loss
```

The **current** v0.1 chain stops after input/axis validation because no response is approved. Outage,
restoration, BI, revenue, frequency, EAL/PML/VaR/TVaR, insurance terms, and portfolio aggregation remain
downstream or outside scope.

## 3. Physical picture and measurement

```text
                         land-based wind facility

        rotor/nacelle                              usually high above water
             |
           tower
             |
      [base controls]  z_crit differs by component
             |
      [pad transformer]
             |
   ===== MV collection ===== [joint / termination / pull box]
             |
      facility substation — one physical shared system
      ├─ switchgear
      ├─ Plant GSU main transformer
      ├─ transformer auxiliaries/controls
      ├─ protection/SCADA/control
      ├─ station service/DC
      └─ cable terminations and water paths

WSE  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ event water-surface elevation
     ↑ h_i = max(0, WSE - z_i_crit), metres, common vertical datum
```

Preferred axis bridge:

```text
h_i = max(0, WSE - z_i_crit)
```

`WSE` and `z_i_crit` are absolute elevations in the same documented vertical datum. The fact that both
numbers use metres does not make them compatible if one is NAVD88 and the other is local grade. Duration,
contamination/salinity, energized/isolation state, enclosure, and water path remain separate event or
equipment state; they are not hidden inside `h_i`.

## 4. Essential terminology

| Term | Plain-language meaning | Example here | Common mistake |
|---|---|---|---|
| Facility/collector substation | Plant-side bus and associated GSU/electrical systems | One site facility serving its generating units | Duplicating it beneath every turbine or technology |
| Plant GSU | Main high-voltage generator step-up transformer | `FW_GSU_TRANSFORMER_MAIN` | Treating “GSU” as the whole substation |
| Pad/turbine step-up transformer | Transformer near or in a turbine feeding MV collection | `FW_PADMOUNT_STEPUP_TRANSFORMER` | Using the Plant GSU curve/value |
| Vulnerable datum | First point where the modeled contact mechanism begins | Lowest control connection or cable entry | Using equipment top, centroid, or grade automatically |
| WSE | Absolute floodwater elevation | `101.20 m NAVD88` | Calling it depth |
| Local depth `h_i` | Water above one component datum | `0.30 m` above switchgear contact point | Applying one grade depth to every component |
| Failure unit | Atomic response and value subject | Switchgear, not aggregate “substation” | Applying one response to mixed equipment/value |
| Direct physical DR | Same-unit repair/replacement cost divided by same-unit pre-event replacement value | Future switchgear cost ratio | Treating outage MW as DR |
| Exposure fraction | Share of that value reached by the event | Fraction of component inventory contacted | Altering intrinsic fragility |
| Selector | Fixed equipment attribute choosing a compatible response | Construction, voltage, enclosure | Letting the asset label “wind” select a curve |
| Conditioner | Event-time state that may qualify a response | Duration, contamination, isolation | Giving unknown protection credit |
| Disruption | Outage, derating, restoration, or revenue consequence | GSU trip | Putting it in the physical DR ordinate |

Evidence/status labels are also contractual:

| Label | Meaning |
|---|---|
| `observed` | Measured or recorded for the actual asset, with source/date |
| `designed` | From a controlled drawing/specification; may still need as-built confirmation |
| `derived` | Reproducibly calculated from documented inputs |
| `class_template` | Representative teaching/screening assumption, never a claimed site fact |
| `placeholder` | Explicit temporary value/rule awaiting stronger evidence |
| `unknown` | Not established; must not be converted into dry, protected, owned, or zero damage |

## 5. Where do inputs come from?

| Input | Preferred evidence | Required context | Main limitation |
|---|---|---|---|
| Component identity/construction | OEM nameplate, BOM, one-line, equipment schedule | make/model, function, voltage, enclosure, vintage | Generic “substation” label is insufficient |
| Geometry and vulnerable point | As-built survey/drawing plus equipment inspection | horizontal/vertical CRS, datum, date, accuracy, selected contact point | Terrain or pad elevation may not equal entry elevation |
| Event WSE | Versioned hazard product or surveyed high-water level | product ID, valid time, datum, spatial support | Site-wide depth may miss local grading/pathways |
| Conditioner state | Event log, relay/operations record, inspection | duration, contamination, energized/isolation state, provenance | Unknown state gets no modifier |
| Ownership/inclusion | Executed agreement, one-line, asset register, policy schedule | owner, project-owned flag, insured inclusion | Functional association is not ownership proof |
| Same-unit value | SOV, valuation ledger, OEM/EPC split | value basis/version/date, quantity, non-overlap | The public `72 USD/kW` electrical row is mixed, not GSU value |

Spatial records preserve subject grain, geometry role, CRS/datum, date, resolution, accuracy, provenance, and
transformation. A turbine-cloud centroid cannot stand in for the facility GSU point.

## 6. Which point or state is evaluated?

| Failure-unit family | Candidate vulnerable point/state | Qualification |
|---|---|---|
| Switchgear | Lowest opening, breaker/control section, or cable entry | Indoor/outdoor and construction matter |
| Main GSU transformer | Construction-specific active/main-system contact state | Keep lower auxiliaries and controls separate unless dependency-safe |
| Transformer auxiliaries/control | Cabinet, terminal, cooler control, marshalling equipment | Do not charge full main-transformer value automatically |
| Protection/SCADA and station DC | Lowest sensitive connection, cabinet entry, battery/charger/control point | Operational sensitivity is not repair-cost calibration |
| Cable/terminations/pathways | Joint, termination, pull box, trench, or conduit entry | Water can travel beyond the mapped footprint |
| Turbine-base electrical | Lowest cabinet/converter/switchgear/control vulnerability | Resolve per turbine or verified cluster |
| Pad/turbine transformer | Construction-specific terminal/control/body point | Distinct from Plant GSU |
| Foundation/supporting soil | Scour/erosion state, not cabinet local depth | Route to a separate hydraulic/geotechnical pathway |

## 7. Worked example — complete input still withholds

All values below are `class_template` and fictional:

| Step | Input or result | Value/status |
|---|---|---|
| 1 | Event WSE | `101.20 m NAVD88` |
| 2 | Switchgear vulnerable elevation | `100.90 m NAVD88` |
| 3 | Derived axis | `h = max(0, 101.20 - 100.90) = 0.30 m` |
| 4 | Fixed selectors | indoor metal-clad switchgear; fixture voltage/enclosure states |
| 5 | Event conditioners | 8 hr, freshwater/contamination fixture, de-energized and isolated |
| 6 | Same-unit value and exposure | `$500,000 × 0.80 = $400,000` at-risk value |
| 7 | Curve lookup | no record: `curve_records = []` |
| 8 | Failure-unit DR | `null / withheld / NO_RUNTIME_CURVE` |
| 9 | Conditional direct loss | `null / withheld / NO_RUNTIME_CURVE` |

There are no neighboring runtime ordinates to interpolate. The solar `FS_SWG` points are an audit candidate,
not a flood-wind curve.

```text
FAIL-CLOSED STATE VIEW (model v0.1)

complete identity + exposure + value
                |
                v
datum match? -- no --> REJECT; h = null; dry not assumed
      |
     yes
      v
derive h = 0.30 m
      |
      v
runtime curve lookup --> EMPTY
      |
      +--> DR   = null / NO_RUNTIME_CURVE
      `--> loss = null / NO_RUNTIME_CURVE

runtime DR
1.0 |                 no approved series
0.5 |                 no interpolation
0.0 +------------------------------- local depth (m)
     0       0.5       1.0       2.0
```

The [model reference](MODEL_REFERENCE.md#9-complete-illustrative-class-template-event-assembly) extends the
same event across every proposed failure/support unit.

## 8. Assumptions, open states, and unsupported shortcuts

| Class | Current treatment |
|---|---|
| Source-anchored method | Component-local depth, equipment decomposition, transparent tabular future form |
| Engineering candidates | Pinned solar ordinates are audit-only T3 neighbors; none is inherited |
| Class-template examples | Geometry/value examples teach assembly only |
| Placeholders/open seams | Exact response, valid range, transformer state split, numerical conditioner effects |
| Unknowns | Inventory, elevations, ownership, value, and conditioner state remain explicit |
| Unsupported | Aggregate plant curve, grade-depth default, outage-to-DR conversion, scour-by-depth fallback |

For CONUS screening, a future approved intrinsic response may bind class-template distributions. Per-asset
work binds observed/design component facts. Scale alone does not select a different curve, and missing site
facts do not silently fall back to CONUS assumptions.

## 9. Fail-closed checks and common mistakes

- Missing or mismatched datum is rejected; it is not dry.
- Unknown component identity cannot use an aggregate-substation alias.
- `substation=generation` does not prove owner or insured inclusion.
- One physical GSU and each component value are counted once.
- Component DR is never applied to the mixed `72 USD/kW` row or total project TIV.
- Exposure fraction scales value touched; it is not fragility.
- Scour, erosion, debris, and inundation contact do not substitute for one another.
- Unknown protection/isolation gets no favorable default.
- Solar and legacy curves are not fallbacks.
- Class-template numbers must never be relabeled observed.

## 10. Short reusable explanation

`flood_wind` evaluates water contact at the physical component that can actually get wet. A wind facility’s
GSU/substation equipment may eventually share intrinsic flood-response logic with matching solar equipment,
but each site still owns component identity, elevation, exposure, value, and ownership. Model v0.1 is a
noncanonical, zero-curve scaffold, so it validates the boundary and then withholds every numerical damage and
loss output.

## 11. Read next

- [Evidence-to-SHIP reasoning](HOW_THE_MODEL_IS_BUILT.md)
- [Exact model reference](MODEL_REFERENCE.md)
- [Derivation dossier](../proposed/flood_wind_curve_derivation_dossier__model_v0_1__docs_r1.md)
- [Metadata specification](../proposed/flood_wind_damage_code_metadata_spec__model_v0_1__docs_r1.md)
- [Zero-curve artifact](../proposed/flood_wind__model_v0_1__docs_r1__curve_artifact.json)
- [Audit workbook](../proposed/damage_curve_records_flood_wind__model_v0_1__docs_r1.xlsx)
- [Known-answer contract tests](../proposed/known_answer_tests_flood_wind__model_v0_1__docs_r1.json)
- [Hazard handoff boundary](../../../contracts/hazard_handoff/flood_wind_model_v0_1_boundary.md)

## 12. Version and non-change statement

These basics complete the human explanation of proposed `model v0.1 / docs r1`; they do not change the
semantic model, axis, curve form/parameters (none), selectors, conditioners, exposure/value rules, emit
meaning, schemas, artifact bytes/SHA, capability, package release, artifact index, runtime docs, consumer pin,
or Hazard outputs. No consumer action is authorized. Promotion requires a new governed model release rather
than treating this prose as runtime authority.
