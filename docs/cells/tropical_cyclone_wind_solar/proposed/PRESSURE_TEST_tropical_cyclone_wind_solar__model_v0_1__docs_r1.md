# Pressure test — tropical_cyclone_wind_solar model v0.1/docs r1

## Decision

This coverage-first scaffold fails closed with zero runtime curves. It preserves the shared solar asset/value
substrate and architecture-specific research candidates without converting plausibility, neighboring curves,
design standards, qualification guidance, or damage observations into numerical economic response.

```yaml
pathway_id: tropical_cyclone_wind
curve_records_populated: false
candidate_axes_frozen: false
candidate_calculations_runtime_enabled: false
canonical_runtime_artifact: false
capability: all_metrics_withheld
standard_reason: NO_RUNTIME_CURVE
```

## Scope and pathway stress tests

| Proposed shortcut or request | Stress-test finding | Disposition |
|---|---|---|
| Reuse `strong_wind_solar` because both pathways contain wind | Shared solar anatomy does not establish TC duration/cycling/direction, demand bridges, response states, or economic calibration. | reject numerical inheritance |
| Infer `tropical_cyclone_wind` from speed or Saffir-Simpson category | Pathway identity is an upstream event contract, not an intensity threshold. | reject/withhold |
| Include storm surge or inland/coastal flood | Water level/depth/velocity and hydrodynamic mechanisms require separately governed flood/surge routes. | route separately; no curve |
| Include TC-spawned tornado | Tornado wind field/direct hit is a separate physical pathway under the same event family. | route separately; no curve |
| Include hail, debris, rain/ingress, or lightning | Each changes the physical demand, affected unit, and evidence chain. | route separately; no curve |
| Treat downtime, derating, or grid outage as destruction | Operational/revenue effects are outside the physical DR ordinate. | exclude |
| Charge several pathways for one damaged state/value | A shared storm family does not authorize duplicate physical cost. | require consumer event/value precedence |

## Architecture and demand stress tests

| Proposed shortcut or request | Stress-test finding | Disposition |
|---|---|---|
| Use one speed/design ratio for fixed tilt and tracker | Rigid pressure response and tracker aeroelastic qualification require different candidate contracts. | reject shared axis |
| Apply a source 10 m or one-minute wind value directly | Source height, averaging, exposure, terrain, direction, and local geometry do not automatically match component demand. | require reviewed bridge; no curve |
| Use event/design pressure ratio now | Pressure sign/load case, geometry, coefficient, gust/duration basis, design capacity, and validity domain are not frozen. | audit candidate only |
| Use tracker `Vnormal/Ucrit` now | Exact-system qualification, normal component, layout/row state, stiffness/damping, duration/cycling, and attained state are unresolved. | audit candidate only |
| Borrow Ucrit from another tracker/product/angle/layout | Qualification is not transferable merely because nominal architecture or units match. | reject |
| Treat commanded stow as attained stow | Command, power, drive/lock, timing, and actual angle can differ. | no credit/withhold |
| Ignore duration/cycling after computing peak ratio | TC response may require history/state in addition to peak demand; representation remains open. | withhold until reviewed |
| Default unknown architecture to fixed or tracker | Different candidate units and demand contracts make fallback unsafe. | reject |

## Failure-unit, value, and exposure stress tests

| Proposed shortcut or request | Stress-test finding | Disposition |
|---|---|---|
| Apply a module curve to mounting/support or vice versa | Failure mechanisms, economic states, and denominators are not interchangeable. | reject |
| Apply fixed-tilt records to tracker or tracker records to fixed tilt | The architecture split is first-order and mutually exclusive. | reject cross-architecture fallback |
| Treat foundation, electrical, GSU, SCADA, or civil as zero | No qualified curve is not immunity. | withhold, not zero |
| Pool inverter, collection, and GSU as generic electrical | `PV_POWER_CONVERSION_AND_COLLECTION` and the shared `PV_GSU_SUBSTATION` point/yard have different subject and exposure grains. | preserve separate withheld units |
| Reuse GSU response from flood, wind-farm, or another solar pathway | Asset-neutral `PV_GSU_SUBSTATION` identity/value anatomy can be shared; numerical hazard response cannot. | reject numerical inheritance |
| Apply array-zone exposure to GSU substation | The GSU is a shared point/yard polygon and needs local exposure/value. | reject |
| Apply array-zone exposure to collection/cable | Collection is a line/network subject. | reject |
| Use Q1-2025 reference values as site replacement values | The benchmark is a reconciliation profile, not a site BOM or appraisal. | withhold monetary loss |
| Default unknown at-risk/intersected fraction to one | That silently converts local/unknown impact into whole-plant exposure. | prohibit; withhold monetary loss |
| Apply DR to installed or physical total | Candidate array units cover only same-unit direct value; other direct units/support/exclusions differ. | prohibit pooled loss |
| Give replacement support its own DR and add it downstream | This charges the same repair scope more than once. | allocate once after direct damage |

## Reference-value reconciliation stress test

The exact Q1-2025 solar anatomy retained from `strong_wind_solar` reconciles as:

```text
direct hardware subtotal       656.9814571503722  2024 USD/kWdc
physical replaceable reference 877.7957023626668  2024 USD/kWdc
excluded soft/nonphysical      242.20429763733296 2024 USD/kWdc
installed reference            1120.0              2024 USD/kWdc
module + mounting anatomy      401.2045774673221  2024 USD/kWdc
```

These numbers test row completeness and denominator boundaries only. The module-plus-mounting subtotal is
45.705917% of the physical reference and 35.821837% of the installed reference; neither share is a DR, cap,
default exposure, or supported loss estimate. Because `curve_records` is empty, no damage parameter exists
to multiply by any of these values.

## Required no-curve known-answer behavior

| Test | Input condition | Required result |
|---|---|---|
| `TCWS-KAT-NC-001` | complete valid fixed-tilt request at any nonnegative source wind | no numeric DR/loss; `NO_RUNTIME_CURVE` |
| `TCWS-KAT-NC-002` | complete valid tracker request including exact identity and event state | no numeric DR/loss; `NO_RUNTIME_CURVE` |
| `TCWS-KAT-NC-003` | missing or nonmatching `pathway_id` | reject/withhold; never default pathway |
| `TCWS-KAT-NC-004` | fixed request with tracker candidate unit or reverse | reject cross-architecture fallback |
| `TCWS-KAT-NC-005` | request for foundation, power conversion/collection, GSU, SCADA, or civil | no numeric DR/loss; withheld, not zero |
| `TCWS-KAT-NC-006` | missing unit value or at-risk/intersected fraction | no monetary loss; never use benchmark or whole-plant default |
| `TCWS-KAT-NC-007` | request using surge/flood/tornado/hail/debris/ingress/lightning pathway | reject/route separately; no neighboring fallback |
| `TCWS-KAT-NC-008` | request for scalar EAL, PML, VaR, or TVaR | withheld; `NO_RUNTIME_CURVE` plus metric reason |

## Evidence chain required before any curve activation

```text
source-native TC wind field and event identity
  -> reviewed architecture-specific local demand bridge with uncertainty
  -> exact architecture/unit response across relevant intensity and history
  -> mutually exclusive damage/repair disposition states
  -> same-unit direct replacement cost by state
  -> explicit site/unit value and point/line/polygon/zone exposure
  -> support-cost allocation once
  -> calibration/validation, KATs, independent review, and consumer pin
```

If this chain remains incomplete, `NO_RUNTIME_CURVE` is the successful governed outcome. A future screening
curve based on structured elicitation would be a new model release, not an extension of this scaffold.
