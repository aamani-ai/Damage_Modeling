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

## Portable-package boundary

`wildfire_solar` is repository-current and canonical but is not included in the preserved portable package
v2.5. Its model v0.1 scaffold remains under `wildfire_solar/proposed/` as the research and rejection audit.

Authoritative package registry:
[`VERSION_REGISTRY.md`](VERSION_REGISTRY.md).

Runtime artifact index:
[`MACHINE_READABLE_ARTIFACTS.md`](../contracts/MACHINE_READABLE_ARTIFACTS.md).
