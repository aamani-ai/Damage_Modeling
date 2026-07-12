# Hurricane and neighboring-wind boundary — wind_tornado_wind model v2.0 proposal

## Decision

This proposal does not create a hurricane/tropical-cyclone damage curve and does not authorize either proposed
convective pathway for hurricane execution.

```yaml
straight_line_convective:
  tropical_cyclone_wind: excluded
tornado_direct_hit:
  tropical_cyclone_wind: excluded
future_neighboring_workstream:
  candidate_cell_id: tropical_cyclone_wind_wind
  shared_asset_substrate_allowed: true
  shared_numeric_curve_allowed: false_without_equivalence_review
```

## Why tropical cyclone is separate

The turbine and value rows can be shared, but the demand process differs materially:

| Dimension | Convective straight-line | Tornado direct hit | Tropical cyclone |
|---|---|---|---|
| Duration | local transient minutes | seconds to minutes | hours, repeated eyewall/rainband loading |
| Wind field | outflow/gust front; transient nose profile | rotating, radial, vertical, translating vortex | boundary-layer field with eyewall shear/veer and storm translation |
| Direction | rapid outflow changes possible | rapid rotation and sign change | sustained veer and eyewall direction change |
| Debris/pressure | possible but not base calibrated | integral unresolved mechanism | windborne debris/pressure possible but distinct environment |
| Controls | shutdown transition may be load-bearing | yaw cannot reliably track the vortex | grid loss, backup yaw, prolonged parked state are load-bearing |
| Additional loads | no wave loading in this onshore cell | no wave loading | offshore route may require waves, surge, corrosion, foundation interaction |
| Hazard ownership | local outflow footprint/event family | track, swath, turbine intersection | storm catalog, wind field, duration, spatial correlation |

Hurricane studies may inform neighboring structural-capacity or control-state bounds, but only with an exact
transferability statement. They do not calibrate the convective occurrence-damage curve by default.

## Current Hazard seam that must be retired during migration

The local Hazard hurricane × wind-farm route currently reuses a generic straight-wind fragility. That is a
legacy convenience path, not a governed equivalence decision. Future migration must:

1. stop calling the convective curve for tropical-cyclone events;
2. create a distinct tropical-cyclone pathway/cell pin;
3. resolve one-minute/10-minute sustained wind, gust, hub-height, duration, veer, turbulence, yaw, and grid-loss
   fields;
4. partition tropical-cyclone-spawned tornadoes so the hurricane and convective catalogs do not double count the
   same occurrence;
5. retain common turbine values only through an explicit shared value profile.

## Synoptic and downslope boundary

Nonconvective synoptic wind and downslope windstorms are also excluded from `straight_line_convective`. They
may eventually share a resistance model after duration, turbulence, vertical-profile, and control-state
equivalence are demonstrated. Until then, a common 3-second-gust unit is not sufficient evidence of common
damage response.

## Consumer rejection rule

An event with any of the following must be rejected by this proposed evaluator:

```text
event_family = tropical_cyclone
hazard_mechanism = synoptic_nonconvective_wind
hazard_mechanism = downslope_windstorm
pathway_id missing or inferred
```

The rejection is a routing decision, not a zero-damage assertion.
