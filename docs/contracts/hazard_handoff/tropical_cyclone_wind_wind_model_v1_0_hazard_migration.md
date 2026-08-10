# Hazard migration — tropical_cyclone_wind_wind model v1.0 / docs r1

> Canonical source-native partial-screening producer contract. The repository pin exists; external GCS
> publication and `damage_artifact_ref` activation remain deliberate publish/register acts.

Practical request example: [hurricane × wind curve request guide](../../extra/guides/tropical_cyclone_wind_wind_curve_request_guide.md).

Hazard loads `tropical_cyclone_wind_wind@model_v1_0__docs_r1` through the shared index/registry → manifest →
SHA → bundle-v3 schema → KAT seam. A supported request must name:

- pathway `tropical_cyclone_wind`;
- failure unit `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT`;
- the exact source-native `tc_peak_gust_3s_10m_kmh` axis;
- one exact declared turbine selector; and
- the source-model assumption acknowledgement and control-state semantics.

The source-supported runtime domain is 108–252 km/h. Values at or below 90 km/h use the paper's assumed zero
branch with an explicit limitation flag; 90–108 km/h withholds below the simulation range; values above
252 km/h withhold rather than clamp or extrapolate.

Every standard wind-farm turbine/BOP/GSU/civil/support unit remains withheld. The source DR must not be bound
to CWER tower, turbine-equipment, or project value, so scenario dollars and all annual/tail outputs remain
withheld. A real turbine is eligible only after exact selector matching. In particular, the Amazon Gamesa
G114-2.0 MW fixture does not match the 1 MW, 2.5 MW, or 3.3 MW source archetypes and must not default to one.

The prior hurricane wind-farm notebook's copied convective-wind logistic is not a compatible fallback. On a
disabled or failed pin, rollback means all-results-withheld; it never means restoring that placeholder.
