# Seven-step audit — strong_wind_solar proposed model v2.0/docs r1

| Step | Required question | Result | Status |
|---|---|---|---|
| 1. Asset/boundary | What exact asset and physical loss is modeled? | Ground-mounted rigid fixed tilt and exact-system-qualified single-axis trackers; direct occurrence damage only; neighboring hazards/disruption excluded. | Pass |
| 2. Failure units | What fails and can be priced without overlap? | Architecture-specific module and support-structure units; terminal cascade; foundation/electrical/SCADA/civil withheld; support once. | Conditional pass |
| 3. Axis/value basis | Does x match physics and y match a declared denominator? | Fixed event/design net-pressure-demand ratio with T4 capacity medians; tracker `Vnormal/Ucrit`; same-unit DR; explicit site value required. | Conditional pass |
| 4. Row split | Is every reference value row mapped once? | Q1-2025 rows reconcile to direct, support, civil, excluded and installed totals; no pooled DR. | Pass |
| 5. Allocation | Are component/value and dependency rules explicit? | DS2/DS3 separate module salvage; central T4 rule plus salvage bounds; conditional dependence flagged; support rule open. | Conditional pass |
| 6. Site adapter | Are selectors, conditioners and exposure separated? | Architecture/Ucrit are selectors; stow/zone/transient state are conditioners/bridge inputs; exposure/value explicit. | Pass with uncalibrated conditioners |
| 7. Curve/loss | Are outputs supported and unsupported outputs withheld? | Four screening records; broad T4 scenarios; unsupported units/full plant/annual metrics withheld. | Conditional screening only |

## Rectangular coverage matrix

| Architecture × unit | Numeric DR | Monetary loss | Reason/condition |
|---|---|---|---|
| Fixed × module | Conditional | Conditional | Qualified fixed demand + explicit value/exposure |
| Fixed × structure | Conditional | Conditional | Same |
| Tracker × module | Conditional | Conditional | Exact-system Ucrit/qualification + explicit value/exposure |
| Tracker × SBOS | Conditional | Conditional | Same |
| Either × other architecture’s records | Reject | Reject | No cross-architecture fallback |
| Either × foundation/electrical/SCADA/civil | Withheld | Withheld | No qualified curve/value/exposure grain |
| Either × replacement support | No intrinsic DR | Conditional allocation only | Allocate once after direct state |
| Either × full physical/installed TIV | Incomplete | Withheld | Other failure units unresolved |

The conditional result is appropriate for research/shadow use only. Promotion is blocked.
