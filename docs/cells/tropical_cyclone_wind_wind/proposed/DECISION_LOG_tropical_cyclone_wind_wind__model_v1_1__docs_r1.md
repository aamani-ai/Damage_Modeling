# Decision log — tropical_cyclone_wind_wind model v1.1

## TCWW11-D01 · Add one named bridge, not generic nearest-neighbour behavior

**Decision:** admit the Jaimes 3.3 MW / 100 m record for the canonical 5 MW / 100 m target only through exact
proxy, asset-profile and value-basis IDs.

**Reason:** the owner wants a usable Version-1 screen now, while the evidence remains target-mismatched. A
named bridge keeps that choice visible and replaceable. Generic nearest-neighbour behavior would silently
extend the model to assets the owner did not approve.

## TCWW11-D02 · Preserve the source equation

**Decision:** copy the source record's parameters exactly and apply no `5 / 3.3` multiplier, axis conversion,
hub-height conversion or empirical adjustment.

**Reason:** there is no evidence-backed capacity scaling law. Inventing one would add false precision on top
of the already explicit turbine mismatch.

## TCWW11-D03 · Cover 63% of project TIV

**Decision:** map the proxy DR to rotor, nacelle and tower shares (`0.26 + 0.21 + 0.16 = 0.63`) and cap covered
event loss at that value. Leave the other 0.37 withheld.

**Reason:** the canonical asset already declares those subsystem shares. A partial value product is honest
only when the numerator and denominator match and the missing units remain visible.

## TCWW11-D04 · Keep current v1.0 until consumer proof

**Decision:** build v1.1 under `proposed/`; do not change `current/`, the artifact index, changelog or portable
package until Hazard passes exact-pin, M2, cap, full-grid, publication and rollback gates.

**Reason:** source-package validation alone does not prove a downstream annual-loss product.

