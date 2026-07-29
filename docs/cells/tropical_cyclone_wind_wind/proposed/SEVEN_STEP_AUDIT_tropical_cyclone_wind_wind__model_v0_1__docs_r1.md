# Seven-step audit — tropical_cyclone_wind_wind model v0.1

## Governing endpoint

The proposed future ordinate is:

```text
DR_u(x,s) = E[direct repair-or-replacement cost of failure unit u
              / pre-event direct replacement value of the same failure unit u
              | delivered TC-wind demand x, selector/conditioner state s]
```

It excludes BI, revenue, insurance, frequency, annual/tail metrics, and unrelated site value. Support and
transport are allocated once after qualified damaged units and repair dispositions are known.

## Step 1 — define the asset

```yaml
asset: modern_land_based_multi_megawatt_horizontal_axis_wind_farm
reference_value_vintage: NREL_CWER_2024_2023_USD_per_kW
included_boundary: direct TC-wind physical destruction of turbines and in-scope plant systems
neighboring_mechanisms_or_routes: TC_tornado, surge/flood/scour, debris, wind_driven_rain, offshore_wave
excluded_boundary: BI, curtailment, frequency, financial terms, annual/tail metrics
```

The reference plant is a value archetype only. It does not assert the actual turbine model, geometry,
controls, foundation, electrical topology, terrain, or replacement schedule.

Only TC-spawned tornado currently has a proposed neighboring route ID: the noncanonical
`tornado_direct_hit` route in the `wind_tornado_wind` v2/v3 work. That ID is not a current consumer cutover.
The other neighboring mechanisms remain conceptually separate with governed route IDs still TBD.

## Step 2 — decompose the asset

| Candidate unit | Evidence | Treatment |
|---|---|---|
| turbine-equipment assembly | narrow tower collapse + mechanism/cases | mutually exclusive states required; no curve |
| foundation | case/mechanism context only | separate, withheld; no zero |
| pad electrical | value row only | split from electrical rollup |
| collection line/network | value row only | split and spatially intersect |
| substation/control point | value row only | split and model separately |
| roads/crane pads/buildings/fence | mixed civil row | split before curve/allocation |
| fieldwork/transport | reference support costs | allocate once; no independent fragility |

The primary assembly prevents terminal tower collapse from being independently added to destroyed rotor and
nacelle states. A future model needs exhaustive, mutually exclusive states or equivalent dependency logic.

## Step 3 — choose the basis

| Basis | Value (2023 USD/kW) | Lineage |
|---|---:|---|
| turbine equipment | 1,090 | `Wind_Map!2:9` |
| foundation + civil + external electrical | 239 | `Wind_Map!10:12` |
| support/logistics | 294 | `Wind_Map!13:14` |
| physical reference | 1,623 | `Wind_Map!2:14` |
| excluded soft/sunk | 345 | `Wind_Map!15:19` |
| installed reference | 1,968 | `Wind_Map!2:19` |

The future curve denominator is same-unit direct replacement value. Physical and installed bases are
reporting/reconciliation denominators, not intrinsic curve denominators.

## Step 4 — split the basis

```text
1968 installed = 1623 physical + 345 excluded
1623 physical  = 1090 turbine equipment + 239 other direct + 294 support
```

Rows 2–9 can form a candidate turbine-equipment assembly. Foundation, civil, and electrical remain separate.
Electrical must be split into pad, collection, substation, and control assets. Civil must be split into its
actual physical subjects. Fieldwork and transport remain support buckets.

## Step 5 — allocate value and exposure

Future loss requires:

```yaml
value_basis_id:
failure_unit_id:
direct_replacement_value_usd:
value_source_row:
asset_subject_id:
geometry_role:
horizontal_crs:
observation_or_design_date:
at_risk_fraction:
at_risk_fraction_basis:
support_cost_allocation_rule:
```

Turbine assemblies use per-turbine demand and exposure. Collection uses line/network intersection;
substations use shared point/polygon exposure. Unknown fractions do not default to one.

## Step 6 — apply the TC site/event adapter

The adapter separates fixed selectors, event-time conditioners, the source-to-demand bridge, exposure, and
value. Required source metadata include height, averaging period, exposure standard, product, timestamp, and
units. Candidate conditioners include duration, direction/veer, turbulence, yaw, pitch, parked/operating,
brake, grid, and backup state. None has a numeric modifier in v0.1.

The adapter also preserves `event_id`, `event_family_id`, and exact `pathway_id`, routes TC-spawned tornadoes
separately, and prevents coastal ASCE/TC wind overlap.

## Step 7 — apply curves and reconcile loss

```yaml
failure_unit_DR: withheld
scenario_loss: withheld
scalar_EAL: withheld
PML_VaR_TVaR: withheld
reason: NO_RUNTIME_CURVE
```

Structural candidate calculations are allowed only in explicitly labelled audit fixtures. No candidate can
populate a runtime damage emit.

## Audit outcome

| Step | Status | Blocking seam |
|---|---|---|
| 1 Define asset | `PASS_REFERENCE_ARCHETYPE_ONLY` | site/OEM configuration external |
| 2 Decompose | `PARTIAL_DEPENDENCY_SAFE_SKELETON` | external electrical/civil splits open |
| 3 Choose basis | `PASS_REFERENCE_BASIS` | site value and replacement rules external |
| 4 Split basis | `PARTIAL_ROW_GROUPS_ONLY` | component/unit allocation incomplete |
| 5 Allocate value/exposure | `PARTIAL_FAIL_CLOSED` | site subjects/fractions/support rule absent |
| 6 Site/event adapter | `SPECIFIED_NOT_PARAMETERIZED` | no approved bridge or state modifiers |
| 7 Curves/loss | `WITHHELD_NO_RUNTIME_CURVE` | no all-severity economic curve |

The source register, claim register, parameter-tier table, value crosswalk, numerical audit, and site adapter
are binding companions to this result.
