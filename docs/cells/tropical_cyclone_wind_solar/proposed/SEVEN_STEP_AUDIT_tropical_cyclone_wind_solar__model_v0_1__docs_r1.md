# Seven-step audit — tropical_cyclone_wind_solar model v0.1/docs r1

## Status and change classification

```yaml
change_class: NEW_CELL_SCAFFOLD
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
asset: utility_scale_ground_mounted_solar
asset_configurations:
  - rigid_fixed_tilt
  - qualified_single_axis_tracker
cell_model_version: v0.1
cell_docs_revision: r1
canonical_runtime_artifact: false
curve_records: []
standard_reason: NO_RUNTIME_CURVE
```

This is a coverage-first, fail-closed scaffold. It defines a reviewable cell boundary and reusable solar
asset/value anatomy without inheriting any numerical curve from `strong_wind_solar`, a flood cell, a wind
farm cell, or another neighboring mechanism.

## Governing y-axis and loss contract

The candidate future failure-unit ordinate is:

```text
DR_u(x,s) = E[direct repair-or-replacement cost of failure unit u
              / pre-event direct replacement value of the same failure unit u
              | delivered local tropical-cyclone wind demand x,
                architecture and attained event state s]
```

The numerator and denominator must refer to the same failure unit. Replacement support, mobilization, site
management, rental, inspection, and other logistics are allocated once after the qualified direct repair
scope is known. They receive no intrinsic damage ratio.

No candidate x-axis is frozen in model v0.1, and the equation above does not authorize a numerical curve.

## Step 1 — define the asset and boundary

```yaml
asset_boundary:
  included:
    - utility-scale ground-mounted rigid fixed-tilt PV arrays
    - utility-scale ground-mounted single-axis trackers with exact-system qualification
    - direct physical destruction caused by the tropical-cyclone wind pathway
  reference_value_profile:
    source: NLR Q1-2025 utility-scale PV-only anatomy
    vintage: 2024_USD_per_kWdc
    use: reference_and_reconciliation_only
  excluded:
    - storm_surge
    - inland_or_coastal_flood
    - tropical_cyclone_spawned_tornado
    - hail
    - windborne_debris_or_missiles
    - wind_driven_rain_or_water_ingress
    - lightning
    - business_interruption
    - downtime_or_derating
    - insurance_and_financial_terms
    - occurrence_frequency_and_annual_or_tail_metrics
```

The value profile is not a site appraisal. It does not establish the site BOM, design wind basis, module or
racking system, tracker qualification, topography, local pressure, event state, exposure fraction, or
replacement cost.

The cell owns conditional physical vulnerability only. Upstream hazard/event systems own occurrence and
wind-field construction; the consumer owns compound-event coordination and financial aggregation.

## Step 2 — decompose the asset into failure units

| Failure unit | Architecture | Coverage role | v0.1 treatment | Value bucket | Blocking seam |
|---|---|---|---|---|---|
| `PV_FIXED_TILT_MODULE_FIELD` | rigid fixed tilt | candidate primary nonzero | withheld | module hardware | no qualified TC-wind axis/curve/economic states |
| `PV_FIXED_TILT_SUPPORT_STRUCTURE` | rigid fixed tilt | candidate primary nonzero | withheld | fixed-tilt racking/support hardware | no qualified pressure bridge or response/cost states |
| `PV_TRACKER_MODULE_FIELD` | exact-system-qualified tracker | candidate primary nonzero | withheld | module hardware | no qualified TC-specific module response/cost states |
| `PV_TRACKER_SBOS_ASSEMBLY` | exact-system-qualified tracker | candidate primary nonzero | withheld | tracker/racking hardware | no exact-system TC demand/history curve or economic states |
| `PV_FOUNDATION` | either | out-of-scope deferred | withheld, not zero | driven piers and inverter-pad foundation row | mixed foundation boundary and no qualified curve |
| `PV_POWER_CONVERSION_AND_COLLECTION` | either | out-of-scope deferred | withheld, not zero | inverter, combiner, cable, and grounding rows | point/line/enclosure mechanisms and exposure unresolved |
| `PV_GSU_SUBSTATION` | either | out-of-scope deferred | withheld, not zero | transformer, switches, breakers, and substation row | GSU/yard split, point/polygon exposure, and wind response unresolved |
| `PV_SCADA_COMMUNICATIONS` | either | out-of-scope deferred | withheld, not zero | system-monitor row | enclosure/location/mechanism unresolved |
| `PV_CIVIL_INFRA` | either | out-of-scope deferred | withheld, not zero | grading, fencing, roads, and buildings | mixed line/area/point subjects unresolved |
| `PV_REPLACEMENT_SUPPORT` | either | support allocation only | no intrinsic DR | field labor, site management, rental, inspection, eligible electrical labor | allocate once after direct repair scope; rule open |

The GSU substation is a shared physical subasset that may reuse an asset-neutral anatomy and governance
contract across solar and wind facilities. That does not authorize reuse of flood, convective-wind, or other
numerical response. Its natural exposure grain is a shared point or yard polygon, not the array exposure
fraction.

Fixed-tilt and tracker records are mutually exclusive for a selected array architecture. No architecture
receives the other architecture's candidate unit or future curve as a fallback.

## Step 3 — choose the y-axis and value basis

The y-axis candidate is same-unit direct physical replacement-cost ratio. Whole-site installed TIV,
physical replaceable value, insured value, claims, BI, and support/logistics are not intrinsic denominators.

The architecture-specific x-axis candidates remain deliberately unfrozen:

| Architecture × unit | Candidate demand representation | Required bridge/review before adoption | v0.1 status |
|---|---|---|---|
| fixed tilt × module/support | event-to-qualified-design net-pressure demand ratio | matched pressure definitions, sign/load case, geometry, coefficients, height, duration/gust basis, design capacity, validity domain, and independent wind/structural review | candidate only; withheld |
| tracker × module/SBOS | local normal wind demand divided by exact-system qualified critical wind speed, with duration/cycling and attained tracker/control state carried explicitly | exact 1P/2P system, layout/row position, angle, drive/lock state, damping/stiffness, profile/turbulence, speed basis, duration history, qualification lineage, and independent aeroelastic review | candidate only; withheld |

A scalar speed, Saffir-Simpson category, or a curve from `strong_wind_solar` cannot silently stand in for
either candidate. Pathway identity is explicit and cannot be inferred from wind speed.

## Step 4 — split the value basis row by row

The companion value crosswalk preserves the exact Q1-2025 reference rows used by `strong_wind_solar` and
adds explicit `tropical_cyclone_wind` applicability. The reference reconciliation is:

```text
direct hardware subtotal            = 656.9814571503722  2024 USD/kWdc
physical replaceable reference      = 877.7957023626668  2024 USD/kWdc
excluded soft/sunk/nonphysical      = 242.20429763733296 2024 USD/kWdc
installed reference                 = 1120.0              2024 USD/kWdc

candidate module + mounting anatomy = 401.2045774673221  2024 USD/kWdc
```

The module-plus-mounting subtotal is anatomy, not supported coverage or a damage cap. Foundation,
power-conversion/collection, GSU substation, SCADA, and civil value remain withheld unknowns rather than
zeros. Mixed rows must be split before unit-level loss. Replacement support is allocated once.

## Step 5 — allocate physical value by failure unit and zone

A future scenario-loss request must supply, at minimum:

```yaml
event_id:
event_family_id:
pathway_id: tropical_cyclone_wind
asset_id:
array_zone_id:
array_architecture:
asset_subject_id:
failure_unit_id:
direct_replacement_value:
currency_and_vintage:
value_source_and_boundary:
intersected_or_at_risk_fraction:
fraction_basis:
support_cost_allocation_rule:
```

Rules:

1. Use only the selected architecture's unit values.
2. Reference values never become implicit site defaults.
3. Unknown unit value, event-zone intersection, or at-risk fraction never defaults to whole-plant value or
   a fraction of one.
4. Array-zone exposure cannot be copied to the shared GSU point/yard, collection network, inverter, SCADA,
   or mixed civil assets.
5. Withheld units remain unresolved, not zero.
6. Replacement support is allocated once after qualified direct damage and repair disposition are known.

## Step 6 — specify the site-condition exposure adapter

The companion adapter is a field-role specification only. It separates:

- exact pathway and parent-event identity;
- fixed architecture selectors;
- event-time tracker/control and maintenance states;
- source-wind, terrain, geometry, direction, duration, and cycling bridge inputs;
- any future qualified local pressure or normal-velocity demand output;
- spatial/value allocation by array zone, line/network, or shared point/yard subject.

It contains no validated numerical transfer function, generic terrain/gust multiplier, stow credit, barrier
credit, or whole-site exposure default. Complete metadata cannot remove `NO_RUNTIME_CURVE` in model v0.1.

## Step 7 — apply qualified curves and reconcile loss, or withhold

```yaml
curve_records: []
failure_unit_scalar_dr: withheld
scenario_loss: withheld
scalar_eal: withheld
pml: withheld
var: withheld
tvar: withheld
canonical_runtime_artifact: false
standard_reason: NO_RUNTIME_CURVE
```

No numerical curve, monetary loss, full-array DR, or full-plant DR is reportable. Candidate calculations may
appear only in clearly labeled audit fixtures and cannot populate runtime-shaped curve records.

## Pathway × failure-unit coverage matrix

| `pathway_id` | Failure unit | Axis/bridge status | Curve/economic status | Value status | Final support | Reason code |
|---|---|---|---|---|---|---|
| `tropical_cyclone_wind` | `PV_FIXED_TILT_MODULE_FIELD` | candidate, not frozen | no qualified curve | reference anatomy only | withheld | `NO_RUNTIME_CURVE` |
| `tropical_cyclone_wind` | `PV_FIXED_TILT_SUPPORT_STRUCTURE` | candidate, not frozen | no qualified curve | reference anatomy only | withheld | `NO_RUNTIME_CURVE` |
| `tropical_cyclone_wind` | `PV_TRACKER_MODULE_FIELD` | candidate, not frozen | no qualified curve | reference anatomy only | withheld | `NO_RUNTIME_CURVE` |
| `tropical_cyclone_wind` | `PV_TRACKER_SBOS_ASSEMBLY` | candidate, not frozen | no qualified curve | reference anatomy only | withheld | `NO_RUNTIME_CURVE` |
| `tropical_cyclone_wind` | `PV_FOUNDATION` | absent | no qualified curve | mixed row withheld | withheld | `NO_RUNTIME_CURVE` |
| `tropical_cyclone_wind` | `PV_POWER_CONVERSION_AND_COLLECTION` | absent | no qualified curve | point/line rows withheld | withheld | `NO_RUNTIME_CURVE` |
| `tropical_cyclone_wind` | `PV_GSU_SUBSTATION` | absent | no qualified curve | shared point/yard row withheld | withheld | `NO_RUNTIME_CURVE` |
| `tropical_cyclone_wind` | `PV_SCADA_COMMUNICATIONS` | absent | no qualified curve | point asset withheld | withheld | `NO_RUNTIME_CURVE` |
| `tropical_cyclone_wind` | `PV_CIVIL_INFRA` | absent | no qualified curve | mixed row withheld | withheld | `NO_RUNTIME_CURVE` |
| `tropical_cyclone_wind` | `PV_REPLACEMENT_SUPPORT` | not applicable | no intrinsic DR | allocation rule open | allocation withheld | `NO_RUNTIME_CURVE` |

## Audit outcome

| Step | Status | Evidence passed | Blocking seam | Required next evidence |
|---|---|---|---|---|
| 1. Define asset | `PASS_REFERENCE_BOUNDARY` | exact architectures, pathway, value vintage, and exclusions declared | site/OEM/BOM configuration external | site asset records when moving beyond scaffold |
| 2. Decompose asset | `PASS_CANDIDATE_WITHHOLDING` | array candidates and explicit GSU/other withheld units separated | failure states and mixed-row splits unresolved | architecture/unit engineering review and disposition taxonomy |
| 3. Choose basis | `PARTIAL_CANDIDATES_ONLY` | same-unit DR basis and two architecture candidates declared | axes/bridges not frozen or validated | independent wind/structural and tracker-aeroelastic review |
| 4. Split basis | `PASS_REFERENCE_RECONCILIATION` | 18 reference crosswalk rows reconcile | reference values are not site replacement values | site BOM/value evidence and mixed-row splits |
| 5. Allocate value | `PARTIAL_FAIL_CLOSED` | allocation grain and prohibited defaults specified | site values, zones/fractions, and support rule absent | site/unit value and spatial allocation contract |
| 6. Site adapter | `SPECIFIED_NOT_PARAMETERIZED` | roles, fields, double-count controls, and adjacent-hazard routing specified | no qualified transfer or modifier | reviewed bridge and state-response evidence |
| 7. Curves/loss | `WITHHELD_NO_RUNTIME_CURVE` | fail-closed outcome explicit | full demand-to-disposition-to-cost chain absent | qualified evidence or governed elicitation plus KATs/review |
