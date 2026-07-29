# Flood-wind shared-electrical decisions

## FWSE-D1 — retain the hazard × asset cell

**Date:** 2026-07-28 · **Status:** implemented.

`flood_wind` remains the cell and consumer-facing governance unit. The common electrical layer sits below cells and does not replace them.

## FWSE-D2 — make intrinsic GSU concepts asset-neutral

Matched equipment does not receive a different intrinsic response because its facility generates solar or wind. The compatibility key is equipment, mechanism, axis, ordinate, selectors, and conditioners—not the asset label.

## FWSE-D3 — keep the common layer non-runtime in phase 1

The shared catalog is method/reference material. It cannot populate a damage emit or bypass a cell's withheld state. Runtime reuse requires a later schema-contract event.

## FWSE-D4 — split the GSU/substation

At minimum, preserve switchgear, main GSU transformer, transformer auxiliaries/controls, protection/SCADA/control, station service/DC, and cable terminations as distinct candidate failure units. Do not apply one aggregated substation curve or datum to the whole yard.

## FWSE-D5 — direct inundation first; scour separate

Phase 1 frames `flood_inundation_contact`. Foundation scour, erosion, saturated-soil support loss, and debris impact are separate/deferred pathways with their own axes and evidence.

## FWSE-D6 — ownership and value are cell bindings

Functional association or a mapped generation substation is not proof of project ownership or insured inclusion. Unknown/utility-owned assets stay out of baseline project physical loss while dependency exposure and a labeled sensitivity may remain.

## FWSE-D7 — fail closed at model v0.1

`flood_wind` publishes zero runtime records and all numeric damage/loss capability is withheld with `NO_RUNTIME_CURVE`. Canonical `flood_solar` ordinates are pinned audit candidates, not inherited outputs.

## FWSE-D8 — future shared responses materialize into cell bundles

The preferred first runtime design authors once from a shared intrinsic record and materializes that record into each self-contained cell bundle with source/version/SHA lineage. Hazard should not require an implicit multi-artifact join.

## FWSE-D9 — both Hazard bypasses are migration scope

Future cutover must remove or disable local reconstruction in both flood/wind M3 and the independent coastal recomputation in M4. Replacing M3 alone is incomplete.
