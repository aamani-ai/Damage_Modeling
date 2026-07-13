# docs/cells/

Shallow entrypoints for the current hazard x asset damage-curve cells.

These pages are the current cell entrypoints. Current packages, archives, previews, and runtime JSON artifacts
live under each cell folder.

| Cell | Model/docs | Damage code | Entry point |
|---|---|---|---|
| `hail_solar` | model v1.0 / docs r7 | `HAIL_SOLAR_PV_MODULE_V1` | [`hail_solar/`](hail_solar/README.md) |
| `flood_solar` | model v1.0 / docs r4 | `FLOOD_SOLAR_ELECTRICAL_INUNDATION_V1` | [`flood_solar/`](flood_solar/README.md) |
| `wind_tornado_wind` | model v1.0 / docs r4 | `WIND_TORNADO_WIND_V1` | [`wind_tornado_wind/`](wind_tornado_wind/README.md) |
| `strong_wind_solar` | model v1.0 / docs r3 | `STRONG_WIND_SOLAR_V1` | [`strong_wind_solar/`](strong_wind_solar/README.md) |
| `wildfire_solar` | model v1.0 / docs r3; screening engineering proxy | `WILDFIRE_SOLAR_FSIM_SCREENING_V1` | [`wildfire_solar/`](wildfire_solar/README.md) |

Active research proposal: `wind_tornado_wind` has a noncanonical
[`model v2.0 / docs r1` pathway-aware package](wind_tornado_wind/proposed/README_wind_tornado_wind__model_v2_0__docs_r1.md).
It does not change the current model/docs row above, is absent from the artifact index, and excludes
hurricane/tropical-cyclone wind.

`strong_wind_solar` also has a noncanonical
[`model v2.0 / docs r1` convective-wind package](strong_wind_solar/proposed/README_strong_wind_solar__model_v2_0__docs_r1.md).
It separates fixed tilt from exact-system-qualified trackers, excludes hurricane/tornado/synoptic wind, and
leaves model v1.0/docs r3 canonical.

## Portable-package boundary

`wildfire_solar` is repository-current and canonical but is not included in the preserved portable package
v2.5. Its model v0.1 scaffold remains under `wildfire_solar/proposed/` as the research and rejection audit.

Authoritative package registry:
[`VERSION_REGISTRY.md`](VERSION_REGISTRY.md).

Runtime artifact index:
[`MACHINE_READABLE_ARTIFACTS.md`](../contracts/MACHINE_READABLE_ARTIFACTS.md).
