# Site-condition adapter — flood_wind model v0.1 / docs r1

## Causal order

    source flood peril and event identity
      -> water-surface field with datum and timestamp
      -> component geometry and vulnerable datum
      -> delivered local contact state
      -> selectors and event conditioners
      -> qualified intrinsic response
      -> same-unit value and ownership binding
      -> direct physical loss

Model v0.1 stops before qualified intrinsic response and therefore emits no numeric damage.

## Required identity

- event_id and event_family_id;
- pathway_id = flood_inundation_contact;
- source_peril_id such as riverine, pluvial, or coastal;
- hazard product/version and valid time;
- asset_id, component_instance_id, and failure_unit_id.

## Exposure transform

    local_depth_above_component_datum_m
      = max(0, water_surface_elevation_m - component_vulnerable_elevation_m)

Both elevations require the same vertical_datum_id. The vulnerable datum must identify the physical point at
which water contacts the governed component or susceptible internal part. Grade depth is not a substitute.

## Fixed selectors

Equipment family/function, voltage class, indoor/outdoor construction, enclosure and submersion listing,
transformer insulation/cooling and sealing, cable/termination construction, control/DC architecture, design
vintage, and permanent flood protection.

Unknown selectors do not choose a favorable or neighboring response.

## Event conditioners

Duration/contact history, freshwater/saline/contaminant class, velocity/debris indicator, energized state,
shutdown/isolation state, warning time, temporary protection/deployment state, drainage/pumping state, and
water ingress path.

No modifier is adopted in v0.1. Capturing a field does not authorize a numerical credit or penalty.

## Spatial and value binding

| Subject | Exposure grain | Value rule |
|---|---|---|
| Facility GSU components | actual facility component point/polygon | component value once; owner required |
| Turbine-base/pad equipment | per turbine or verified cluster point | installed-unit value and count |
| Collection terminations | point/line-network location | segment/termination inventory |
| Foundation | turbine point plus hydraulic/geotechnical support | separate pathway |
| Civil/access/drainage | line/network/polygon split | split before response |

## Missing and invalid states

- missing WSE, datum, or component elevation: withhold, not dry;
- datum mismatch: reject;
- synthetic centroid without verified component identity: placeholder, not priceable;
- unknown ownership: exclude baseline project physical loss;
- unknown conditioner: preserve unknown and give no protective credit;
- source peril without complete delivered exposure vector: withhold;
- unsupported mechanism: reject without fallback.

## Protection treatment

Permanent elevation can change z_i_crit when observed. Barriers, pumps, drainage, temporary sandbags, isolation,
maintenance, and response actions can affect delivered exposure or state only when their event performance is
observed or governed by a calibrated model. Never lower both exposure and vulnerability for the same action.

