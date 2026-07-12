# Seven-step audit — wind_tornado_wind proposed model v2.0

Status: proposed, noncanonical, screening engineering proxy
Audit cutoff: 2026-07-11
Current runtime preserved: `wind_tornado_wind@model_v1_0__docs_r4`

## Governing y-axis and loss contract

The only numerically supported failure unit in this proposal is one repeated turbine-equipment assembly:

```text
DR_turbine(x, pathway, scenario)
  = E[direct physical replacement cost of rotor + pitch + nacelle + drivetrain
      + power electronics + yaw + tower
      / pre-event direct replacement value of those same turbine-equipment rows
      | delivered local pathway demand, generic screening archetype]
```

The reference denominator is `1,090 2023 USD/kW`. It excludes foundation, external electrical, civil,
fieldwork, transport/logistics, sunk/soft value, BI, revenue, insurance terms, and annual frequency. Support
costs are allocated once after the damaged-unit scope is known; this proposal supplies no default allocation
coefficient.

The cell has two first-class pathways. The audit repeats axis, exposure, evidence, and curve decisions for each:

```text
straight_line_convective
tornado_direct_hit
```

No pathway may be inferred from wind speed. Hurricane/tropical-cyclone wind is outside this cell revision.

## Step 1 — define the asset and boundary

Reference asset: a generic modern, land-based, multi-MW, horizontal-axis turbine with a tubular steel tower,
repeated within a wind farm. It is a screening archetype, not an OEM type certificate or site appraisal.

Included physical boundary:

- rotor, hub, pitch, nacelle structure, drivetrain/generator, power electronics, yaw, and tower in the supported
  turbine-equipment assembly;
- foundation, collection/substation, and civil rows as explicitly withheld candidate failure units;
- fieldwork and transport/logistics as once-only support rows, not vulnerable hardware.

Excluded boundary:

- BI, downtime, curtailment, derating, lost revenue, land, insurance terms, and annual metrics;
- nonconvective synoptic wind, downslope windstorms, tropical-cyclone wind, hail, and lightning;
- offshore wave/surge/corrosion interaction;
- cumulative fatigue outside the occurrence-destruction endpoint.

Value vintage and geography: NREL CWER 2024 Edition, land-based reference plant, 2023 USD. Site values override
the reference only through an explicit row-level crosswalk.

## Step 2 — decompose the asset into failure units

| Candidate failure unit | Material mechanisms | Proposed treatment | Why |
|---|---|---|---|
| `WT_TURBINE_EQUIPMENT_ASSEMBLY` | pitch/control repair, rotor replacement, terminal tower/equipment replacement | Conditional screening curve for both pathways | Rotor, nacelle, and tower consequences are strongly dependent; mutually exclusive ordered states prevent consequential double counting. |
| `WT_FOUNDATION` | overturning, anchor/support failure, post-collapse disposition | Withheld | No pathway-specific same-unit damage calibration or reliable post-collapse disposition rule. |
| `WT_EXTERNAL_ELECTRICAL` | collection conductor/cable, transformer, switchgear | Withheld | Source value is mixed; line and point exposure differ; no unit-specific curve. |
| `WT_CIVIL_INFRA` | roads, staging, access, facilities | Withheld | Source row is mixed and lacks asset-specific exposure and damage evidence. |
| `WT_REPLACEMENT_SUPPORT` | field assembly, cranes/site work, transport/logistics | Allocate once outside intrinsic DR | Support is conditional on repair scope and site access, not an independently vulnerable failure unit. |

Pitch, yaw, brake/control, operating state, grid/backup power, ramp, direction change, vertical velocity,
turbulence, debris environment, and tornado-profile provenance are conditioners or bridge metadata. They are not
separate default loss curves.

## Step 3 — choose the y-axis and value basis

The y-axis is the same-unit turbine-equipment DR defined above. The state consequences reconcile to the
`1,090 USD/kW` direct denominator:

| State | Consequence | Cost ratio |
|---|---|---:|
| `DS0_NO_DIRECT_DAMAGE` | no direct destruction cost | 0 |
| `DS1_CONTROL_PITCH_REPAIR_PROXY` | pitch/control physical repair proxy (`13 USD/kW`) | 0.0119266055045872 |
| `DS2_ROTOR_ASSEMBLY_REPLACEMENT` | blades + pitch + hub (`337 USD/kW`) | 0.309174311926606 |
| `DS3_TERMINAL_TURBINE_EQUIPMENT_REPLACEMENT` | all turbine-equipment rows (`1,090 USD/kW`) | 1.0 |

These ratios are consequences, not empirical state probabilities. The state capacities and dispersions remain
Tier-4 screening judgments.

Pathway-specific axis decisions:

| pathway_id | Source/delivered axis | Bridge decision | Axis status |
|---|---|---|---|
| `straight_line_convective` | rotor-effective local 3-second gust, normalized by explicit turbine `iec_ve50_mps` | Hub-height 3-second gust is a flagged proxy. A 10 m gust requires a named convective-profile bridge; no silent power law. | Conditional |
| `tornado_direct_hit` | rotor-effective peak horizontal speed in m/s after turbine intersection | Qualified hub-height or radar/profile bridge is permitted with provenance. EF class alone is rejected. | Conditional |

## Step 4 — split the value basis row by row

Every NREL wind row is mapped in
`VALUE_CROSSWALK_wind_tornado_wind__model_v2_0__docs_r1.csv`:

```text
turbine equipment direct                      1,090 USD/kW
foundation + civil + external electrical       239 USD/kW  (withheld/split required)
fieldwork + transport/logistics                 294 USD/kW  (support once)
-----------------------------------------------------------
physical replaceable reference                1,623 USD/kW
excluded sunk/soft/nonphysical                  345 USD/kW
-----------------------------------------------------------
installed reference                           1,968 USD/kW
reconciliation difference                         0 USD/kW
```

No pooled full-plant DR is authorized. The turbine-equipment share (`0.671595810227973` of physical or
`0.553861788617886` of installed reference value) is a denominator conversion, not a curve cap.

## Step 5 — allocate physical value by failure unit and zone

The curve evaluates one delivered turbine. Hazard must provide turbine identity/archetype group, exposed count
or fraction, and explicit turbine-equipment value. The same turbine-equipment row must not be charged through
both an assembly state and independent blade/tower/nacelle curves.

Separate exposure/value objects are required for:

- turbine points;
- foundation points, if a future foundation curve is added;
- collection lines;
- substation points;
- civil/access polygons or networks.

Unknown exposed shares do not default to one. Foundation and external-plant values do not inherit the turbine
DR. Support is not included in state consequences and is allocated once only after direct repair scope is known.

## Step 6 — specify the site-condition exposure adapter

### Selector / conditioner / exposure split

| Class | Fields | Governed treatment | Missing/default behavior |
|---|---|---|---|
| Pathway routing | `pathway_id` | Exact required identity | Reject; no default or speed inference. |
| Fixed selector | `turbine_archetype` | Must equal the supported screening archetype | Reject unsupported archetype. |
| Fixed selector, convective | `iec_ve50_mps` | Positive explicit design gust normalization | Reject if absent; IEC II is allowed only when the consumer explicitly supplies `59.5`, not as an evaluator default. |
| Axis bridge, convective | rotor-effective or hub 3-second gust; named 10 m bridge inputs | Deliver local turbine demand | Reject unbridged 10 m input; flag hub proxy. |
| Axis bridge, tornado | rotor-effective peak or qualified hub/radar proxy; `tornado_input_basis`; `tornado_profile_bridge_id` | Deliver local turbine demand with height/profile provenance | Reject EF-only input or missing profile bridge. |
| Conditioners | operating, pitch, yaw, grid/backup, ramp, direction change, turbulence; tornado debris | Preserve metadata and all scenarios | `unknown` is permitted but earns no protection credit. |
| Exposure | event/turbine identity, hit/intersection, exposed turbine count/fraction | Applied once outside intrinsic DR | Loss withheld if explicit exposure/value is absent. |

### Double-counting matrix

| Related fields or controls | Single governed treatment | Prohibited double count | Missing/default behavior |
|---|---|---|---|
| 10 m/hub/rotor wind and derived local demand | One named bridge produces the curve input. | Apply a profile multiplier and then reinterpret the result as 10 m wind again. | Reject load-bearing missing bridge. |
| Pitch/yaw/grid state and resistance scenario | State is metadata; uncertainty remains in all three scenarios. | Apply a numeric protection discount and also select the higher-resistance scenario for the same assumption. | Unknown receives no credit. |
| Derecho parent event and local outflow | Hazard retains one parent event; Damage consumes local turbine demand. | Apply derecho-wide duration/intensity to every turbine or count nested outflows as independent occurrences. | Withhold event loss if identity is ambiguous. |
| Tornado track intersection and swept/exposed turbines | Hazard resolves turbine hits/counts. | Apply a lease-overlap probability and then multiply the same event by a swept full-TIV fraction. | Farm overlap alone is insufficient. |
| Turbine assembly states and blade/tower/nacelle value | One mutually exclusive equipment state. | Add independent component DRs after selecting a terminal assembly state. | Use only the assembly result. |
| Foundation/external plant/civil | Separate withheld units with separate exposure. | Inherit turbine DR or turbine exposed fraction. | No numeric loss. |
| Direct damage and support/logistics | Direct assembly DR first; support allocated once afterward. | Put support in the denominator and add it again downstream. | Total physical loss remains incomplete until a qualified rule exists. |
| Tropical cyclone and TC-spawned tornado | Separate TC workstream; one event-family partition. | Run convective and TC curves on the same wind field or double count a spawned tornado. | Reject TC routing in this evaluator. |

## Step 7 — apply qualified curves and reconcile loss, or withhold

For the turbine-equipment assembly, the proposal applies an ordered damage-state lognormal model:

```text
Q_j(x) = Phi( ln(x / theta_j) / beta_ln )

P(DS0) = 1 - Q_1
P(DS1) = Q_1 - Q_2
P(DS2) = Q_2 - Q_3
P(DS3) = Q_3

DR(x) = sum_s P(DS_s) * cost_ratio_s
```

State medians are strictly ordered. Three nonprobabilistic resistance scenarios are returned; they are not
percentiles and have no weights. Straight-line input above `70 m/s` is withheld. Tornado EF class without a
qualified speed proxy is withheld. Unsupported failure units return no numeric fallback.

Reference loss arithmetic, after explicit site value and exposure are supplied:

```text
direct_turbine_equipment_loss
  = sum_exposed_turbines(DR_turbine * site_turbine_equipment_value)

total_physical_loss
  = direct_turbine_equipment_loss
  + qualified_separate_foundation/external/civil losses
  + support allocated once
```

The second equation is incomplete in v2.0 because the separate curves/allocation rule are withheld.

## Pathway × failure-unit support matrix

| pathway_id | failure_unit_id | axis/bridge status | evidence/curve status | value status | final support | reason code |
|---|---|---|---|---|---|---|
| `straight_line_convective` | `WT_TURBINE_EQUIPMENT_ASSEMBLY` | Conditional rotor/hub axis; explicit `Ve50` | Tier-4 ordered-state screening envelope constrained by Tier-1/2 case/load evidence | Reconciled direct denominator | Conditional screening curve | `SCREENING_ENGINEERING_PROXY` |
| `straight_line_convective` | `WT_FOUNDATION` | Local demand conceptually available | No same-unit calibration | Value mapped | Withheld | `NO_CONVECTIVE_FOUNDATION_DAMAGE_CALIBRATION` |
| `straight_line_convective` | `WT_EXTERNAL_ELECTRICAL` | Line/point demand not resolved | No unit-specific curve | Mixed value requires split | Withheld | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` |
| `straight_line_convective` | `WT_CIVIL_INFRA` | Civil exposure not resolved | No unit-specific curve | Mixed value requires split | Withheld | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` |
| `straight_line_convective` | `WT_REPLACEMENT_SUPPORT` | Not an intrinsic hazard axis | No independent fragility | Value mapped as support | Allocate once outside curve | `SUPPORT_ALLOCATION_RULE_REQUIRED` |
| `tornado_direct_hit` | `WT_TURBINE_EQUIPMENT_ASSEMBLY` | Conditional rotor/hub/profile axis; EF-only rejected | Tier-4 envelope constrained by Jacksboro rotor and Greenfield collapse evidence | Reconciled direct denominator | Conditional screening curve | `PARTIALLY_FIELD_ANCHORED_NOT_POPULATION_CALIBRATED` |
| `tornado_direct_hit` | `WT_FOUNDATION` | Tornado demand conceptually available | Post-collapse disposition and fragility absent | Value mapped | Withheld | `POST_COLLAPSE_FOUNDATION_DISPOSITION_UNRESOLVED` |
| `tornado_direct_hit` | `WT_EXTERNAL_ELECTRICAL` | Track/line/point exposure not resolved | No unit-specific curve | Mixed value requires split | Withheld | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` |
| `tornado_direct_hit` | `WT_CIVIL_INFRA` | Civil exposure not resolved | No unit-specific curve | Mixed value requires split | Withheld | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` |
| `tornado_direct_hit` | `WT_REPLACEMENT_SUPPORT` | Not an intrinsic hazard axis | No independent fragility | Value mapped as support | Allocate once outside curve | `SUPPORT_ALLOCATION_RULE_REQUIRED` |

## Audit outcome

| Step | Status | Evidence passed | Blocking seam | Required next evidence |
|---|---|---|---|---|
| 1. Define asset | Pass for screening archetype | Asset/value/hazard boundary explicit | No OEM/site-specific certification | Type-certificate and site value schedule for higher grade |
| 2. Decompose asset | Pass with withheld units | Every material value row has a treatment | Foundation/external/civil mechanisms unresolved | Unit-level inspection/disposition data and row splits |
| 3. Choose basis | Pass for equipment assembly | Same-unit numerator/denominator and both pathway axes explicit | Proxy bridges remain lower fidelity | Rotor-effective event reconstructions |
| 4. Split basis | Pass | `1,968 USD/kW` ledger reconciles to zero | External/civil rows are mixed | Collection/substation/civil source split |
| 5. Allocate value | Conditional | Turbine equipment value is row-complete | Exposed count/site value/support rule are consumer inputs | Site asset register and claims-based support allocation |
| 6. Site adapter | Conditional | Required selectors/conditioners/exposure contracts named | Numeric conditioner effects are uncalibrated | SCADA/control/load-to-disposition evidence |
| 7. Curves/loss | Conditional for equipment; withheld elsewhere | Ordered states, bounds, rejection rules, and denominator conversions defined | Tier-4 probabilities; full physical loss incomplete | Population fragility/claims and separate-unit curves |

## Audit conclusion

The proposal qualifies a **conditional screening curve only** for turbine equipment in each declared pathway.
It does not qualify a whole-farm, full-physical-base, or installed-TIV curve. Model v1.0 remains canonical until
the promotion matrix, executable KATs, workbook verification, and Hazard migration gates pass.
