# Seven-step audit — hail_wind model v0.1/docs r1

## Governing endpoint

```text
DR_u(x,s) = E[direct repair-or-replacement cost of failure unit u
              / pre-event direct replacement value of the same failure unit u
              | delivered hail-impact history x, verified selector/conditioner state s]
```

BI, derating, revenue, insurance, frequency, annual/tail analytics, and unrelated value are excluded.
Fieldwork and transport are allocated once after qualified disposition.

## 1 — Define the asset and boundary

```yaml
asset: modern_land_based_multi_megawatt_horizontal_axis_wind_facility
reference_value_vintage: NREL_CWER_2024_2023_USD_per_kW
included: direct_occurrence_hail_impact_physical_destruction
neighboring_routes: convective_wind, tornado, lightning, rain_erosion, ice, flood
excluded: chronic_degradation, BI, derating, frequency, finance, annual_tail_metrics
```

The wind facility is repeated turbine points plus separately located BOP subjects, not one solid lease area.

## 2 — Decompose into failure units

| Unit | Treatment |
|---|---|
| `WT_BLADE_ASSEMBLY` | Primary candidate; dependency-safe coating/structure states; no curve |
| `WT_NACELLE_EXPOSED_ASSEMBLY` | Exposed-subject split and evidence blocked |
| `WT_TOWER_AND_EXTERNAL_FIXTURES` | Tower/appurtenance split and evidence blocked |
| `WT_PAD_ELECTRICAL` | Point-subject BOM/protection/evidence blocked |
| `WT_COLLECTION_NETWORK` | Buried/overhead topology and response blocked |
| `WT_GSU_SUBSTATION` | Shared point/yard BOM, ownership, value, response blocked |
| `WT_CONTROL_AND_MET_STATION` | Instrument/building split blocked |
| `WT_FOUNDATION` | Direct-impact geometry screen only; no numeric zero |
| `WT_CIVIL_INFRA` | Mixed subjects; split required |
| support/logistics | Allocate once; no intrinsic curve |

## 3 — Choose y-axis and value basis

The future ordinate is same-failure-unit direct cost ratio. NREL reference values provide denominator
anatomy only:

| Basis | 2023 USD/kW |
|---|---:|
| Blade hardware | 282 |
| Turbine equipment | 1,090 |
| Other direct foundation/civil/electrical | 239 |
| Support/logistics | 294 |
| Physical | 1,623 |
| Excluded | 345 |
| Installed | 1,968 |

## 4 — Split the value basis row by row

```text
1968 installed = 1623 physical + 345 excluded
1623 physical  = 1090 turbine equipment + 239 other direct + 294 support
1090 turbine equipment = 282 blades + 808 other turbine equipment
```

The electrical and civil rows remain mixed. The blade row is aggregate equipment value, not a separate
coating denominator.

## 5 — Allocate physical value and exposure

Future loss requires turbine/subject IDs, actual geometry, direct replacement value, value source,
ownership, observation date, and at-risk fraction. Turbines use per-turbine point/rotor exposure;
collection uses line/network intersection; GSU uses a shared point/yard polygon. Unknown exposure does not
default to one, and the lease polygon is not charged as hardware.

## 6 — Site/event adapter

The adapter separates source hail fields, wind/trajectory bridge inputs, fixed blade/turbine selectors,
event-time rotor/control conditioners, derived contact demand, exposure, value, and support. Unknown
shutdown, LEP, operating state, BOP location, or mitigation gives no numerical credit.

## 7 — Apply curves and reconcile loss

```yaml
failure_unit_scalar_dr: withheld
scenario_loss: withheld
scalar_eal: withheld
pml_var_tvar: withheld
reason: NO_RUNTIME_CURVE
```

The coating-lifetime model, lab tests, simulations, repair-cost anchors, and legacy arrays remain outside
runtime-shaped `curve_records`.

## Audit outcome

| Step | Status | Blocking seam |
|---|---|---|
| Define asset | `PASS_REFERENCE_ARCHETYPE_ONLY` | site/OEM configuration external |
| Decompose | `PARTIAL_DEPENDENCY_SAFE_SKELETON` | BOP and exposed-subject splits open |
| Choose basis | `PASS_REFERENCE_BASIS` | site/unit values external |
| Split basis | `PARTIAL_ROW_GROUPS_ONLY` | blade coating and mixed BOP allocation unresolved |
| Allocate value/exposure | `PARTIAL_FAIL_CLOSED` | subject geometries/fractions/support rule absent |
| Site/event adapter | `SPECIFIED_NOT_PARAMETERIZED` | no approved local-impact bridge/modifiers |
| Curves/loss | `WITHHELD_NO_RUNTIME_CURVE` | no occurrence economic curve |
