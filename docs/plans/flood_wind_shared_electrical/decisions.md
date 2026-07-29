# Flood-wind shared-electrical decisions

## FWSE-D1 — retain the hazard × asset cell

**Date:** 2026-07-28 · **Status:** implemented.

`flood_wind` remains the cell and consumer-facing governance unit. The common electrical layer sits below cells and does not replace them.

## FWSE-D2 — make intrinsic GSU concepts asset-neutral

Matched equipment does not receive a different intrinsic response because its facility generates solar or wind. The compatibility key is equipment, mechanism, axis, ordinate, selectors, and conditioners—not the asset label.

## FWSE-D3 — keep the common layer non-runtime in phase 1

The shared catalog is method/reference material. It cannot populate a damage emit or bypass a cell's withheld state. Runtime reuse requires a later schema-contract event.

## FWSE-D4 — split the GSU/substation

At minimum, preserve switchgear, main GSU transformer, transformer auxiliaries/controls, protection/SCADA/control, station service/DC, and cable terminations as distinct candidate failure units. Do not apply one aggregated substation curve or datum to the whole yard except for the explicitly labeled, mutually exclusive legacy screening assembly in `FWSE-D10`; that assembly cannot coexist with component outputs.

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

## FWSE-D10 — accept the Hazus-MH 2.1 substation series only as a source-native screening assembly

**Date:** 2026-07-28 · **Status:** accepted for flood-wind-local noncanonical v1 implementation.

FEMA Hazus-MH 2.1 Table 7.9 publishes one identical whole-substation percent-damage series for `ESSL`, `ESSM`, and `ESSH`:

    shared_response_id = FE_HAZUS21_SUBSTATION_ASSEMBLY_SCREENING_V1
    depth_ft = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    DR       = [0, .02, .04, .06, .07, .08, .09, .10, .12, .14, .15]

The denominator is the full replacement value of the same physical substation. The record is an alternative assembly representation and is mutually exclusive with every GSU component unit and value charge. The 4 ft functionality threshold remains downstream operational information. Interpolation is limited to the 0–10 ft table; outside-range values withhold.

Hazus-MH 2.1 section 7.2.4 says electric-power implementation was deferred even though Table 7.9 publishes the series. Hazus 7.0 resolves the present-use boundary by classifying electric-power facilities as mapping-only and stating that the viewable default electric-power damage functions are disabled. The 2.1 series is therefore a legacy screening reference, not current Hazus calibration or endorsement.

## FWSE-D11 — keep the Hazus numerical record flood-wind-local

The shared v0.2 substrate owns the concept, exact source lineage, and exclusivity rule but remains `runtime_loadable: false`. Any numerical materialization belongs in a self-contained `flood_wind` v1 proposal with its own model/docs/schema/SHA decision, limitation flags, value gate, and KATs. It does not alter canonical `flood_solar`, create an external shared-response loader, or authorize canonical promotion.
