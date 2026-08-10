# Repository release — tropical_cyclone_wind_wind partial-screening model v1

```yaml
release_date: 2026-08-09
repository_contract_revision: 2026-08-09.hurricane-wind-partial-screening-v1-v3
portable_package_release: unchanged_at_library_v2.5
released_cell: tropical_cyclone_wind_wind@model_v1_0__docs_r1
contracts:
  - damage_curve_record_bundle.v3
  - capability_declaration.v3
  - damage_emit.v2
```

## Decision

Promote the already pressure-tested Jaimes v1 package as a canonical, source-native partial-screening cell.
The earlier model-v0.1 scaffold remains the phase-one evidence and fail-closed history; the noncanonical v1
package remains the pre-promotion record. This release does not invent a generic hurricane curve or reuse the
convective-wind placeholder.

The only supported numerical atom is `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT`. Three exact generic turbine
selectors evaluate the paper's expected economic damage ratio on its native 3-second peak-gust-at-10-m axis.
No nearest-neighbor, rating-only, hub-height, category, sustained-wind, or modern-fleet mapping is allowed.

## Reportability boundary

This release can support conditional scalar screening for an exact source-native selector. It cannot support:

- a standard CWER turbine-equipment, tower-only, balance-of-plant, or full-farm damage ratio;
- scenario dollars or project-TIV loss because the source denominator is not approved;
- a substitute curve for unmatched real assets, including the current Amazon Gamesa G114-2.0 MW example; or
- EAL, PML, VaR, TVaR, BI, insurance, or portfolio aggregation.

Those outcomes remain structured `withheld`, never zero and never a legacy fallback.

## Seasonal outlook is a different input

NOAA's seasonal hurricane outlook changes the Hazard-side frequency/context assumption; it does not change
the Damage-side intensity-to-damage response. The outlook is not a landfall forecast, and a below-normal basin
season can still contain an infrastructure-damaging event. Hazard must combine a governed occurrence/intensity
model with this conditional response before any annual-risk statement is made.

## Consumer and publication state

The repository artifact index now carries the exact current path and full SHA. The common Hazard loader and
its v3 fixtures evaluate the new curve form and preserve every selector, domain, value, and coverage guard.
No external GCS publish or database/registry activation is performed by this repository edit; that remains an
explicit immutable publish → register → load operation.

Primary context: [NOAA's 2026 Atlantic hurricane outlook](https://www.cpc.ncep.noaa.gov/products/outlooks/hurricane.shtml?vm=r)
and the [Jaimes et al. turbine-tower vulnerability paper](https://onlinelibrary.wiley.com/doi/abs/10.1002/we.2436).
