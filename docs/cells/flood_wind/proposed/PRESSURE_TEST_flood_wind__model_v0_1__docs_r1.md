# Evidence pressure test — flood_wind model v0.1 / docs r1

## Test

A numerical failure-unit response can advance only if it preserves the target equipment, mechanism, axis,
ordinate, same-unit denominator, selectors/conditioners, representative endpoint, value binding, provenance,
and missing-state behavior.

| Candidate | Equipment/grain | Axis | Economic endpoint | Value denominator | Representative transfer | Decision |
|---|---|---|---|---|---|---|
| flood_solar FS_SWG | partial/direct | pass method | T3 proxy | plausible but unverified | not proven | withhold candidate |
| flood_solar FS_XFMR | mixed main/aux | partial | T3 proxy | fails dependency-safe match | not proven | reject direct reuse |
| flood_solar FS_SCADA | partial semantic | pass method | T3 proxy | subject differs | not proven | withhold |
| flood_solar FS_CABLE | mechanism only | unresolved construction | T3 proxy | rollup differs | not proven | withhold |
| NERC 2022 relay-room case | direct mechanism | shallow contact observed | operational outage, not cost | absent | single event | mechanism only |
| NERC 2015 substation case | adjacent/direct mechanism | flood contact | disposition/operations, no cost ratio | absent | utility station cases | mechanism only |
| NEMA GD 1 | equipment categories | water exposure | guidance, not probability/cost curve | absent | broad guidance | disposition vocabulary |
| Hazard M3/M4 logistics | aggregated project buckets | generic depth | unsupported | hardcoded project shares | none | reject; regression only |

## Transfer traps rejected

1. Same asset role does not mean same equipment construction.
2. Same unit of metres does not mean the same datum, duration, salinity, or water path.
3. Equipment failure or outage is not a repair-cost ratio.
4. A component DR cannot be multiplied by a mixed project bucket without a same-unit value crosswalk.
5. A public archetype is not site ownership or insured inclusion.
6. A canonical curve in one cell is not authority to populate a neighboring cell.
7. Missing elevation is not zero depth.
8. A facility substation is not repeated once per turbine.

## Evidence tiers

The axis method and public value-row definitions are T2. Case studies and adjacent mechanisms are T3.
Flood-solar numerical candidates remain T3. Legacy formulas and governance defaults are T4. No T1 claims or
field-calibrated economic response is present.

## Result

The anatomy, pathway, local-depth transform, and curation priorities are supportable. A numerical curve and
scenario loss are not. The correct version-one behavior for this scaffold is null/withheld with
NO_RUNTIME_CURVE, not a caveated number.

