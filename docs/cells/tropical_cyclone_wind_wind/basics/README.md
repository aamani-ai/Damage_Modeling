# Tropical-cyclone wind × onshore wind basics

**Start here.** This page explains the proposed research scaffold for direct tropical-cyclone wind damage to
land-based wind farms. It deliberately does not publish a damage curve.

```yaml
cell_id: tropical_cyclone_wind_wind
audience: first-time reader
basics_set_revision: r1
cell_model_version: model v0.1
human_documentation_revision: docs r1
canonical_runtime_pin: none
canonical_runtime_artifact: false
proposed_artifact_sha256: bfb846d411f430d6e62123e462439b9edc2df9be88cccbda80044b7adfe63d81
change_class: NEW_CELL_SCAFFOLD
runtime_behavior_changed: false
```

The proposed package under `../proposed/` is the governed technical source for this scaffold. There is no
`current/` package and no runtime pin. The existing Hurricane/Hazard notebook is a legacy regression fixture,
not this cell's model.

## Five ideas to remember

1. **A hurricane category is not turbine demand.** NHC maximum sustained wind is a one-minute value at 10 m;
   the candidate structural studies use different heights and averaging periods.
2. **A turbine is a repeated physical unit.** Turbine-local severity and the count or value exposed are
   separate calculations.
3. **Collapse evidence is not an economic damage curve.** Credible tower-buckling probabilities do not tell
   us the cost ratio for blades, nacelle, foundation, electrical systems, or non-collapse damage.
4. **Control and wind history matter.** Yaw, pitch, grid/backup state, duration, veer, turbulence, and rapid
   direction change must remain visible; unknown state receives no protective credit.
5. **Model v0.1 fails closed.** Every numeric damage and loss output is `null` with `NO_RUNTIME_CURVE`.

## What question is being prepared?

```text
tropical-cyclone wind field
    + named height/time/direction/turbulence bridge
    + turbine design and event-time control state
    -> turbine- or plant-unit demand
    -> failure-unit direct replacement-cost ratio
    -> matching value × explicit exposure
    -> conditional physical event loss
```

Only direct physical destruction is in scope. Frequency, business interruption, curtailment, insurance,
EAL, PML, VaR, and TVaR remain downstream. Tornado, surge, flood, scour, debris, rain ingress, and offshore
wave loading are separate pathways.

## The physical picture

```text
NHC/source storm field: 1-min mean at 10 m
                    |
                    | named TC bridge; not a silent factor
                    v
hub/rotor demand: height + averaging + gust + duration + direction + turbulence
                    |
       +------------+-------------+
       |                          |
  fixed selectors            event conditioners
  design class, size,         yaw, pitch, parked/
  hub/rotor, tower, TMD       operating, grid, backup
       |                          |
       +------------+-------------+
                    v
       one turbine-equipment assembly state
       tower + rotor + nacelle dependencies respected
                    |
           DR is WITHHELD in v0.1
                    |
          repeated-turbine exposure
```

Other physical grains stay separate:

```text
foundation = turbine point
pad transformer = turbine/cluster point
collection = line/network
substation/control building = shared point/polygon
civil/access = mixed network/polygon
```

## Essential terminology

| Term | Plain-language meaning | This cell | Common mistake |
|---|---|---|---|
| NHC maximum sustained wind | Highest one-minute average wind at 10 m in unobstructed exposure | Source-native upstream field | Feeding it directly to a hub-height/3-second curve |
| 3-second gust | Short-duration wind average/peak with an explicit height | Jaimes candidate: 10 m; future target unresolved | Treating it as equal to one- or ten-minute wind |
| 10-minute hub wind | Longer average at turbine hub height | Rose validation candidate | Converting it with an undocumented constant |
| Axis bridge | Named transformation with inputs, domain, and uncertainty | Height/time/gust/direction/turbulence bridge | Hiding `1.10`, `1.20`, or a power law in a spreadsheet |
| Selector | Fixed asset property choosing an archetype | turbine size, design class, tower, TMD | Using it as event intensity |
| Conditioner | Event-time state that may change response | yaw, pitch, grid, parked/operating | Defaulting unknown state to protected |
| Failure unit | Physical/value atom evaluated together | turbine-equipment assembly | Adding tower, rotor, and nacelle terminal losses twice |
| Fragility | Probability of a named damage state | Jaimes DS3 tower-wall buckling/collapse | Calling it a damage ratio |
| Damage ratio | Direct repair/replacement cost divided by the same unit's value | Future y-axis; absent in v0.1 | Applying collapse probability to whole-site TIV |
| Exposure | Which units/value the event touches | per-turbine, line, point, or network | Using one farm-wide fraction for every subsystem |
| Class-template | Representative teaching/screening input, not a site fact | Examples below | Presenting it as observed |

## Where inputs should come from

| Input | Represents | Preferred source | Main limitation |
|---|---|---|---|
| `source_wind_speed_mps` plus explicit height/averaging fields | NHC/source storm-field wind | event hazard model with NHC-compatible metadata | not turbine demand |
| `tc_bridge_model_id` | approved height/time/direction conversion | versioned hazard-to-demand model | none is approved for runtime v0.1 |
| turbine coordinates/count | repeated-unit geometry | as-built GIS/inventory | lease area is not turbine exposure |
| turbine selectors | rating, hub/rotor, tower, design class, controls | OEM/as-built/design documents | class template cannot replace site evidence |
| conditioner history | yaw, pitch, operating, grid, backup | SCADA/event reconstruction | unknown receives no credit |
| direct replacement value | same-unit denominator | site appraisal/OEM schedule | NREL ledger is reference only |

Spatial inputs must preserve turbine or network subject grain, geometry role, CRS, date, resolution, accuracy,
provenance, and any transformation. A point wind at a turbine and a line/network exposure are not
interchangeable merely because both use metres per second.

## What physical state is evaluated?

| Candidate failure unit | Critical state | Why it matters | v0.1 result |
|---|---|---|---|
| `WT_TURBINE_EQUIPMENT_ASSEMBLY` | mutually exclusive serviceable, repair, major replacement, terminal states | tower collapse can consequentially destroy rotor/nacelle | no curve |
| `WT_FOUNDATION` | wind-only structural state and post-collapse disposition | zero is not demonstrated | withheld |
| `WT_EXTERNAL_ELECTRICAL` | pad/collection/substation units with separate geometry | exposure and construction differ | split required |
| `WT_CIVIL_INFRA` | roads, crane pads, buildings, fences | mixed value/spatial grain | split required |
| `SUPPORT_FIELDWORK` | assembly/installation after damaged units are known | cost, not independent vulnerable hardware | allocation rule open |
| `SUPPORT_TRANSPORT_LOGISTICS` | transport after replacement scope is known | cost, not independent vulnerable hardware | allocation rule open |

## Worked fail-closed example

All values below are **class-template** inputs, not observations.

| Step | Class-template input or result |
|---|---|
| Upstream field | NHC-compatible 60 m/s, one-minute, 10 m |
| Pathway | `tropical_cyclone_wind` |
| Bridge | missing; no approved `tc_bridge_model_id` |
| Turbine state | yaw/grid history unknown |
| Candidate curve | none in `curve_records` |
| Failure-unit DR | `null`, `withheld`, `NO_RUNTIME_CURVE` |
| Direct scenario loss | `null`, `withheld`, `NO_RUNTIME_CURVE` |

Even if a site supplies a turbine count, coordinates, and value, the result remains withheld because the
model lacks an approved economic damage curve. The candidate Jaimes calculation can be reproduced for its
exact simulated tower on its native axis, but that output is labelled
`tower_wall_buckling_with_assumed_collapse_probability`, never
`damage_ratio`.

```text
candidate collapse probability  |  audit only
runtime damage ratio             |  [WITHHELD]
scenario loss                    |  [WITHHELD]
```

## Current assumptions, unknowns, and exclusions

| Status | Items |
|---|---|
| Source-anchored | NHC axis semantics; candidate paper-native axes/parameters; NREL reference value rows |
| Engineering structure | one dependency-safe turbine assembly; separate point/line/network units; support once |
| Placeholder/open seam | target runtime axis; state-transition/economic bridge; site value allocation |
| Unknown | fleet transfer, all-severity disposition, state probabilities, foundation/electrical/civil response |
| Unsupported | category-to-DR, convective/tornado fallback, full-TIV logistics, zero for missing evidence |
| Out of scope | surge/flood/scour, TC tornado, debris/rain, offshore waves, BI and annual/tail metrics |

## Fail-closed checks

- Reject a missing or non-exact `pathway_id`; never infer tropical cyclone from speed alone.
- Reject NHC category as the damage x-axis.
- Reject cross-use of Jaimes km/h/10 m/3-second and Rose knots/hub/10-minute parameters.
- Preserve unknown yaw, pitch, grid, backup, and operating state; do not choose a favorable curve.
- Keep per-turbine, line, point, and network exposures separate.
- Do not add coastal hurricane-inclusive strong-wind loss to a future TC-wind loss without a peril partition.
- Do not interpret missing foundation/electrical/civil evidence as zero damage.
- Do not convert candidate collapse probability into economic DR or loss.

## Short explanation to reuse

This cell prepares a tropical-cyclone wind damage model for land-based wind farms. It intelligently reuses
the strong-wind turbine anatomy and reference value ledger, but it re-earns the hurricane-specific demand,
fragility, controls, and economics. Public sources support narrow tower-collapse fragilities and show that
duration, veer, yaw, and grid state matter; they do not yet support an all-severity same-unit repair-cost
curve. Model v0.1 therefore returns no damage or loss number.

## Read next

- [How the model is built](HOW_THE_MODEL_IS_BUILT.md)
- [Model reference](MODEL_REFERENCE.md)
- [Cell entrypoint](../README.md)
- [Proposed package overview](../proposed/README_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md)
- [Derivation dossier](../proposed/tropical_cyclone_wind_wind_curve_derivation_dossier__model_v0_1__docs_r1.md)
- [Metadata contract](../proposed/tropical_cyclone_wind_wind_damage_code_metadata_spec__model_v0_1__docs_r1.md)
- [Fail-closed artifact](../proposed/tropical_cyclone_wind_wind__model_v0_1__docs_r1__curve_artifact.json)
- [Hazard handoff](../../../contracts/hazard_handoff/tropical_cyclone_wind_wind_model_v0_1_boundary.md)

## Version and non-change statement

This is a `NEW_CELL_SCAFFOLD` at model v0.1/docs r1. It creates no canonical runtime pin, schema revision,
curve form, curve parameter, enabled selector/conditioner, loss emit, artifact-index entry, or Hazard behavior.
All current cells and consumer outputs remain unchanged.
