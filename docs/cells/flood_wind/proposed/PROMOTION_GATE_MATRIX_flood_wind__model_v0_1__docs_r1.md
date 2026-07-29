# Promotion gate matrix — flood_wind model v0.1 / docs r1

| Gate | Required evidence or control | Current status | Owner / next action |
|---|---|---|---|
| G1 cell and pathway boundary | Direct-contact scope, exclusions, stable pathway_id | pass | maintain |
| G2 failure-unit decomposition | Same replacement units and dependency-safe assemblies | partial | curate OEM/SOV anatomy |
| G3 axis and datum | Component-local exposure with common vertical datum | method pass; site blocked | obtain survey/GIS/equipment elevations |
| G4 selectors and conditioners | Equipment construction and event state vocabulary | capture contract pass; effects blocked | collect inventory and event records |
| G5 disposition evidence | Water state to inspect/repair/replace endpoint | blocked | OEM/utility/claims curation |
| G6 same-unit economic endpoint | Direct repair/replacement cost and denominator | blocked | claims/cost evidence |
| G7 representativeness | Target population and uncertainty | blocked | stratified evidence or elicitation |
| G8 value allocation | Split 72 USD/kW rollup, count, SOV/BOM | blocked | site/OEM schedules |
| G9 ownership/insured inclusion | Agreement, one-line, asset register, policy schedule | blocked | site documents |
| G10 numeric response review | Reproducible candidate, monotonicity, domain, extrapolation | blocked | derive after G5-G7 |
| G11 runtime artifact | Repository-current schema, curve records, SHA | blocked | model-release workflow |
| G12 KAT and capability | Positive, boundary, mismatch, missing-state, no-fallback tests | fail-closed tests only | add numerical KATs after G10 |
| G13 shared compatibility | Two cells pass exact equipment/mechanism/axis/ordinate key | blocked | solar/wind joint review |
| G14 consumer migration | M3 and M4 dual-read, pins, bypass tests, rollback | not started | Hazard integration |
| G15 independent review | Science, value, contract, and consumer signoff | not started | review board |

## Release rule

Model v0.1 cannot be promoted by filling only G10. G2 through G9 must establish the physical and economic
meaning of every output-bearing record. G11 through G15 then govern publication and consumption.

## Recommended curation order

1. Facility GSU switchgear and protection/control/DC inventory, because shallow contact can be operationally
   material and FS_SWG is the nearest candidate.
2. Main-transformer versus auxiliaries/controls state and value split.
3. Turbine-base and pad/turbine step-up electrical equipment.
4. Wind MV collection terminations, joints, pull boxes, and conduit pathways.
5. Civil/access/drainage and foundation scour as separately governed pathways.
6. Elevated turbine equipment only where a site-specific water path defeats the normal geometry screen.

