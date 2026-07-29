# Hazard handoff boundary — flood_wind model v0.1 scaffold

## Consumer disposition

    cell_id: flood_wind
    damage_code_id: FLOOD_WIND_PROPOSED_V0_1
    semantic_damage_model_version: model v0.1
    documentation_revision: docs r1
    canonical_runtime_artifact: false
    curve_record_count: 0
    artifact_index_entry: none
    consumer_pin: none
    hazard_runtime_change: none
    action: do_not_load_or_cut_over

This handoff defines a future boundary. It does not authorize Hazard M3 or M4 to load this scaffold, replace
their current placeholders, copy flood-solar curves, or convert null to zero.

## Ownership boundary

| Damage Modeling owns | Hazard/consumer owns |
|---|---|
| failure-unit definitions and intrinsic response evidence | flood occurrence/family and source-peril catalog |
| component-local axis semantics and compatibility | water-surface field, spatial coupling, and site inventory |
| direct physical DR and same-unit value rules | project/utility ownership evidence and value binding |
| curve provenance, artifact, capability, and KATs | scenario aggregation, frequency, annual/tail metrics |
| support-allocation boundary | BI, outage, insurance, financial, and portfolio treatment |

Operational unavailability can be material even when direct component cost is modest, but it remains a
separate downstream object.

## Required future input envelope

    event_id:
    event_family_id:
    pathway_id: flood_inundation_contact
    source_peril_id:
    hazard_product_id:
    hazard_valid_time:
    asset_id:
    component_instance_id:
    failure_unit_id:
    component_geometry:
    geometry_provenance:
    water_surface_elevation_m:
    component_vulnerable_elevation_m:
    vertical_datum_id:
    fixed_selectors:
    event_conditioners:
    exposure_fraction:
    ownership:
    value_basis:

Model v0.1 may be used to validate this research envelope but always withholds numeric damage.

## Spatial and value rules

| Subject | Consumer grain | Guardrail |
|---|---|---|
| Facility GSU/substation | actual shared component point/polygon | value once; no per-turbine repetition |
| Turbine-base and pad equipment | per installed unit or verified cluster | no site-average depth shortcut |
| Collection terminations | point/line network | no turbine-count allocation |
| Foundation | turbine hydraulic/geotechnical point | separate scour/erosion pathway |
| Civil/access/drainage | split line/network/polygon | no mixed-bucket logistic |

Functional association does not establish project ownership or insured inclusion. A utility-owned POI asset is
excluded from baseline project physical loss; dependency and explicitly labeled sensitivity views may remain
downstream.

## Model v0.1 response

    failure_unit_scalar_dr:
      value: null
      status: withheld
      reason_codes: [NO_RUNTIME_CURVE]

    scenario_loss_given_value_basis:
      value: null
      status: withheld
      reason_codes_include:
        - NO_RUNTIME_CURVE
        - MISSING_VALUE_BASIS
        - MISSING_EXPOSURE_OR_COUPLING

    scalar_eal:
      value: null
      status: withheld
      reason_codes_include:
        - NO_RUNTIME_CURVE
        - MISSING_HAZARD_FREQUENCY_OR_INTENSITY_DISTRIBUTION

Flood-solar candidates and legacy logistics are audit evidence only. Null is not zero.

## Missing-state and pathway rules

- Exact pathway_id is required; direct contact cannot stand in for scour, debris, or wave loading.
- WSE and component elevation must share a verified vertical datum.
- Missing component identity, WSE, or elevation is unknown, not dry.
- An aggregated SUBSTATION alias is rejected.
- Unknown selector or conditioner gets no favorable default or protective credit.
- Source peril alone cannot select a curve; the delivered exposure/conditioner vector must be complete.
- The asset label solar or wind is not an intrinsic selector for exactly matched equipment.

## Legacy and migration rule

Hazard M3 and the independent coastal M4 path both reconstruct flood/wind curves and value shares. A future
cutover is incomplete unless both paths consume one pinned governed result or M4 consumes the M3 emit without
local reconstruction.

## Future cutover checklist

1. At least one failure-unit response closes the equipment-state-to-same-unit-cost evidence chain.
2. Component inventory, local elevations, value split, ownership, and insured inclusion are available.
3. A reviewed model v1.0+ uses the repository-current output-bearing schema.
4. Numeric, boundary, mismatch, missing-state, ownership, and double-count KATs pass.
5. Any shared response has an exact compatibility key, version, SHA, and per-cell semantic-version review.
6. The artifact index publishes the exact model/docs/schema/SHA tuple.
7. M3 and M4 dual-read the same governed path and no-bypass tests pass.
8. Shadow differences, cap binding, compound-event handling, and rollback are reviewed.

Until all gates pass, Hazard runtime remains unchanged.

