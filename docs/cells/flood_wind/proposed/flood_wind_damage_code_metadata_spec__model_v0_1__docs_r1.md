# Flood × wind damage-code metadata specification — model v0.1 / docs r1

## Contract status

This is a research-state validation contract. It defines fields needed to curate and later bind a model, but
model v0.1 has no runtime curve and returns no numeric damage or loss. The canonical schema contracts are
unchanged.

## Identity fields

| Field | Type | Requirement | Rule |
|---|---|---|---|
| event_id | string | required | occurrence identity |
| event_family_id | string | required | links compound child pathways |
| pathway_id | enum | required | exactly flood_inundation_contact |
| source_peril_id | string | required | preserve riverine/pluvial/coastal provenance |
| hazard_product_id | string | required | product/version lineage |
| hazard_valid_time | timestamp | required | event-time alignment |
| asset_id | string | required | wind facility identity |
| component_instance_id | string | required | real component or governed class-template identity |
| failure_unit_id | enum | required | exact proposed unit; aggregate substation is invalid |

## Spatial and exposure fields

| Field | Type | Requirement | Rule |
|---|---|---|---|
| component_geometry | point/line/polygon reference | required | grain must match failure unit |
| geometry_provenance | enum | required | observed, designed, derived, class_template, placeholder, unknown |
| water_surface_elevation_m | number | required for contact evaluation | no missing-to-zero |
| component_vulnerable_elevation_m | number | required for contact evaluation | component-specific contact point |
| vertical_datum_id | string | required | exact shared datum |
| local_depth_above_component_datum_m | derived number | computed only | max(0, WSE minus component datum) |
| exposure_fraction | number [0,1] | required for value touch | inventory/spatial basis required |
| exposure_fraction_basis | string | required with fraction | no turbine-count proxy for facility GSU |

## Fixed selectors

Equipment family and function; voltage class; make/model; indoor/outdoor; enclosure/submersion listing;
transformer insulation, cooling, sealing, and bushing/terminal configuration; cable/termination construction;
control/DC architecture; design vintage; permanent elevation/protection; and source provenance.

These fields are capture-only until a reviewed numeric response specifies exact selector behavior.

## Event conditioners

Duration and contact history; salinity/water-quality/contamination class; velocity/debris indicator; energized,
shutdown, and isolation state; warning time; temporary protection deployment; pumping/drainage performance;
water ingress path; inspection timing; and conditioner provenance.

Unknown is explicit. No favorable, worst-case, or borrowed modifier is applied in model v0.1.

## Value and ownership fields

| Field | Requirement | Rule |
|---|---|---|
| owner_entity_id | required for baseline loss | functional association is insufficient |
| project_owned | required boolean or unknown | unknown excludes baseline project physical loss |
| insured_inclusion | required boolean or unknown | policy schedule controls insured view |
| value_basis_id | required for scenario loss | version and date required |
| same_unit_direct_replacement_value_usd | required for scenario loss | same failure unit only |
| quantity | required when value is unit-based | component inventory basis |
| at_risk_value_usd | derived | value times exposure fraction; no pooled rollup |
| support_allocation_rule_id | required if support added | allocate once after disposition |

## Proposed failure-unit enumeration

FW_GSU_SWITCHGEAR; FW_GSU_TRANSFORMER_MAIN; FW_GSU_TRANSFORMER_AUX_CONTROLS;
FW_GSU_PROTECTION_SCADA; FW_GSU_STATION_SERVICE_DC; FW_GSU_CABLE_TERMINATIONS;
FW_TURBINE_BASE_ELECTRICAL; FW_PADMOUNT_STEPUP_TRANSFORMER;
FW_COLLECTION_CABLE_TERMINATIONS; FW_TURBINE_FOUNDATION; FW_CIVIL_ACCESS_DRAINAGE;
FW_ELEVATED_TURBINE_EQUIPMENT; SUPPORT_FIELDWORK; SUPPORT_TRANSPORT_LOGISTICS.

## Validation and withholding order

1. Reject missing event, family, or pathway identity.
2. Reject unsupported pathway; no solar or legacy fallback.
3. Reject unknown/aggregate failure-unit aliases.
4. Reject geometry-grain or datum mismatch.
5. Preserve missing WSE/component elevation as unknown, not dry.
6. Validate selectors and conditioners without applying modifiers.
7. Return failure-unit DR null/withheld with NO_RUNTIME_CURVE.
8. Return scenario loss null/withheld; value completeness cannot bypass step 7.
9. Withhold annual and tail metrics; those also require downstream hazard distribution.

## Future emit shape

Any future output must carry event and component identity, pathway, curve ID and pin, axis value and metadata,
selector/conditioner state, DR and status, same-unit value basis, physical loss when permitted, reason codes,
and provenance. It must exclude BI, revenue, insurance terms, and hazard-frequency calculations.

