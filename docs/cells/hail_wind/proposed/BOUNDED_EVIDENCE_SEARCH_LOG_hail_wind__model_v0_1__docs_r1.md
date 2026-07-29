# Bounded evidence search — hail_wind model v0.1/docs r1

## Boundary

```yaml
review_cutoff: 2026-07-28
target_chain: event_hail_field -> blade_local_impact_history -> inspected_disposition -> same_blade_direct_cost
target_asset: modern_onshore_horizontal_axis_wind_turbine_and_separate_BOP
target_endpoint: occurrence_based_physical_repair_or_replacement_cost_ratio
```

This is a reproducible scoped search, not a universal claim that no private, non-English, unindexed, or
future evidence exists.

## Surfaces reviewed

- DOE/OSTI, NREL, Sandia/IEA Wind, NOAA/NWS/NSSL, IEC, and DNV pages;
- Crossref/DOI and publisher/repository pages for hail-impact, blade erosion, damage classification, and
  blade repair research;
- open full text and author repositories, including Strathprints, Illinois, Copernicus, and Zenodo;
- NOAA Storm Events bulk-record surface for modern wind-turbine hail disposition/cost cases;
- local `damage_modeling`, `Hazard_modeling`, `infrasure-damage-curves`, `hazard_analysis`, `Learning`, and
  wind engineering/value substrates.

## Query families

```text
wind turbine blade hail impact damage
simulated hail ice GFRP blade velocity delamination
hail wind turbine failure repair replacement cost claim
hail leading edge erosion turbine coating lifetime
MRMS MESH wind turbine blade damage
wind turbine hail substation nacelle sensor damage
Schmid hail MDR wind turbine building car
```

## Inclusion rules

Evidence was retained when it had an identifiable source, exact asset/material/endpoint, locatable method or
result, and a permissible role in hazard semantics, physical mechanism, disposition, cost, value, or
governance. Adjacent and cumulative evidence was retained with explicit transfer limits.

## Results by missing link

| Link | Result through cutoff |
|---|---|
| Event hail field | Observed diameter, MESH, radar/precipitation fields and climatologies available |
| Blade-local impact | Physics, lab coupon, simulation, and cumulative-energy candidates available; no qualified generic field bridge |
| Inspected disposition | Leading-edge classification exists, but no representative hail-event blade state dataset located |
| Same-unit direct cost | General blade repair/cost anatomy available; no matched hail-state same-blade cost dataset located |
| BOP subjects | No public hail-specific disposition/cost chain located for nacelle, pad electrical, collection, GSU, controls/met, or civil |
| Legacy curve | Alleged wind array is a mislabeled/converted real-estate curve and is rejected |

## NOAA event-record check

The accessible 1995–2026 Storm Events bulk surface was searched for clean modern utility-turbine cases.
Apparent turbine-loss records were attributable to wind or lightning, not a hail-only component
disposition/cost chain. This supports withholding within the recorded surface only.

## Update triggers

- OEM or owner blade inspection records tied to radar/observed hail and event operating state;
- claims/work-order/SOV data with coating, structural-repair, and replacement disposition;
- validated trajectory/contact model for a declared blade/turbine family;
- hail-specific BOP equipment tests or claims;
- improved public event datasets or a formal structured elicitation approved for screening use.
