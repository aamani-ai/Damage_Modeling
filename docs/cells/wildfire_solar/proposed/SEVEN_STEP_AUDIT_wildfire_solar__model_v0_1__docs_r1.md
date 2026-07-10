# Seven-step audit — wildfire_solar

## Governing loss and y-axis contracts

The proposed future curve ordinate is:

```text
DR_u(s) = E[direct replacement cost of failure unit u
            / pre-event direct replacement value of the same unit u
            | delivered local exposure state s, BOM/protection state]
```

It excludes support/logistics, BI, revenue, insurance terms, and unrelated plant value. A future zonal loss assembly is:

```text
Direct loss = Σ_u,z V_direct_u,z × at_risk_f_u,z × burned_f_u,z
                        × attack_f_u,z|burned × DR_u(local_state_u,z)

Direct loss includes any eligible row-14 civil failure units only after the mixed bucket is split.
Total physical loss = Direct failure-unit loss + support costs from rows 12, 13, and 15 allocated once
```

Burn probability and annual aggregation remain outside M3. Multiplying an aggregate mean DR by an aggregate exposure fraction is prohibited unless independence between intensity, equipment location, and value is demonstrated.

## Step 1 — define the asset

```yaml
asset: ground-mounted utility-scale solar PV generator/plant
reference_capacity: 100_MWdc
reference_value_vintage: NREL_Q1_2025_UPV_MMP_2024_USD
reference_configuration: generic_single_axis_tracker_central_inverter_cost_archetype
included_boundary: mapped generator hardware and physical civil/replacement rows
excluded_boundary: BESS, unmapped transmission, land, soft/sunk value, BI, smoke/ash production effects, PSPS, financial terms
```

The archetype supports value reconciliation only. It does not define a site's geometry, component elevation, cable routing, fence/wall construction, fuels, maintenance condition, or thermal vulnerability.

## Step 2 — decompose the asset

| Failure-unit candidate | Value/subsystem link | Evidence status | Current treatment |
|---|---|---|---|
| module laminate/glass | PV module | thermal/ignition tests have BOM and setup limits | evidence constraint; no DR curve |
| module J-box/leads/frame | module/collection/mounting seam | value and failure boundary unresolved | split required |
| exposed DC lead/cable segment | collection | one generic XLPE test is adjacent evidence | construction/installation split; no curve |
| buried/conduit/tray cable segment | collection | guidance supports distinct protection states | separately allocated protected archetype |
| connector/combiner | combiner/collection | no calibrated curve | separate candidate |
| inverter/control enclosure | inverter | mechanism/guidance only | enclosure/BOM split; no curve |
| SCADA/tracker drive | SCADA/mounting | spatially distinct; no calibrated curve | separate candidate |
| transformer/switchgear/breaker | substation | distinct equipment and fluid/enclosure states | equipment-type split; no curve |
| steel racking / aluminum frame | mounting/module | generic material evidence only | material/member model required |
| pile/concrete foundation | foundation | insufficient exposure/replacement evidence | exception review; no assumed zero |
| grounding/lightning | grounding row | no forced wildfire response | retain for reconciliation; review |
| roads/fencing/buildings/site prep | mixed civil row | mixed asset and pathway bucket | split before allocation |
| fence/wall/firebreak/vegetation | exposure control | site-transfer evidence only | not a component DR curve by default |

There is no approved curve count until this coverage map reconciles every material value row and failure unit.

## Step 3 — choose the basis

Source workbook: `docs/method/value_basis/solar_wind_value_breakdown.xlsx`.

| Basis | Value | Exact lineage |
|---|---:|---|
| installed reference basis | $1,120.000000/kWdc | `Inputs!B6`; `Summary!B5` |
| physical reference basis | $877.795702/kWdc | `Inputs!B7`; `Summary!B6` |
| excluded soft/sunk/nonphysical | $242.204298/kWdc | `Inputs!B8`; `Summary!B7` |
| direct-hardware subtotal | $656.981457/kWdc | `Solar_Map!2:10`; value crosswalk summary |
| civil/replacement/support rows | $220.814245/kWdc | `Solar_Map!12:15`; value crosswalk summary |
| 100 MWdc installed reference | $112.000000M | `Summary!B8` |
| 100 MWdc physical reference | $87.779570M | `Summary!B9` |

The future curve denominator is the direct replacement value of the same failure unit, not the full installed or physical plant basis. The generic archetype is not a site appraisal.

## Step 4 — split the basis

```text
$1,120.000000 = $877.795702 physical + $242.204298 excluded
$877.795702 physical = $656.981457 direct hardware + $220.814245 civil/replacement/support
```

Physical rows are `Solar_Map!2:10` and `Solar_Map!12:15`; excluded rows are `Solar_Map!11` and `Solar_Map!16:17`. `VALUE_CROSSWALK_wildfire_solar__model_v0_1__docs_r1.csv` maps every row to a candidate failure unit or treatment and records the open split. Row 14 is a mixed civil asset/pathway bucket; rows 12, 13, and 15 are support allocations, not independent vulnerable units.

## Step 5 — allocate physical value

Allocation is incomplete until site data split exposed from buried/protected collection, separate equipment/control types, locate value by zone, and define support-cost treatment.

```yaml
required_fields:
  - value_basis_id
  - value_source_row
  - failure_unit_id
  - zone_id
  - local_fire_state_basis
  - direct_replacement_value_usd
  - at_risk_fraction_by_failure_unit_zone
  - at_risk_fraction_basis
  - component_burned_fraction_by_zone
  - component_attack_fraction_by_zone
  - support_cost_allocation_rule
  - mixed_civil_row_14_split_rule
  - reconciliation_rule
```

Unknown at-risk or attack fractions withhold loss and never default to one. Support/logistics are allocated once after damaged units are known; they cannot receive an independent DR.

## Step 6 — apply site-condition exposure logic

Landscape FIL is not equipment demand. The governed adapter captures fuels/vegetation, distance, wind/slope, component height and setback, fences/walls/firebreaks, row geometry, direct flame contact, heat-flux duration, cable protection, enclosure state, ember state, suppression, access, and de-energization.

Selectors, conditioners, bridge inputs, derived exposure, and vulnerability effects have distinct roles. The double-counting matrix in `SITE_CONDITION_ADAPTER_wildfire_solar__model_v0_1__docs_r1.md` prevents the same control from reducing loss twice. Unknown mitigation receives no credit; a missing load-bearing exposure state withholds loss.

## Step 7 — apply damage curves and reconcile loss

No curve passes the evidence and calibration gates:

```yaml
failure_unit_DR: withheld
scenario_loss: withheld
scalar_EAL: withheld
PML_VaR_TVaR: withheld
reason: NO_RUNTIME_CURVE
```

Structural lookup tests can verify withholding and field validation, but they are not scientific calibration. Step 7 activates only after a local exposure bridge, component failure/replacement rule, value coverage, parameter provenance, and runtime review pass.

## Audit outcome

| Step | Status | Blocking seam |
|---|---|---|
| 1 Define asset | `PASS_VALUE_ARCHETYPE_ONLY` | Site/BOM configuration remains external. |
| 2 Decompose asset | `PARTIAL_COVERAGE_UNRECONCILED` | Electrical, control, MV, mounting, and civil splits remain open. |
| 3 Choose basis | `PASS_REFERENCE_BASIS_Y_AXIS_PROPOSED` | Site value and operational replacement rule remain external. |
| 4 Split basis | `PARTIAL_ROW_GROUPS_ONLY` | Failure-unit and mixed-civil allocations are incomplete. |
| 5 Allocate value | `PARTIAL_FAIL_CLOSED` | At-risk, protected/exposed, zone, and support allocations are absent. |
| 6 Site adapter | `SPECIFIED_NOT_PARAMETERIZED` | No validated local attack transfer or numeric control credit. |
| 7 Curves/loss | `WITHHELD_NO_RUNTIME_CURVE` | No calibrated failure-unit curve. |

The source register, claim register, parameter-tier table, value crosswalk, and legacy-ingestion memo are binding evidence companions to this audit.
