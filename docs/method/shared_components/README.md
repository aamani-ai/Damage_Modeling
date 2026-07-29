# Shared component substrates

This folder holds reusable equipment/mechanism vocabulary and binding rules across hazard × asset cells.
Each substrate declares its scope: some are asset-neutral, while others—such as the solar-wind comparison
profile—are explicitly asset-specific.

Shared substrates are not cells and are not runtime artifacts. They prevent independent reinvention while preserving each cell's ownership of exposure, value, ownership, capability, and release.

| Substrate | Status | Cells |
|---|---|---|
| [`flood_electrical/`](flood_electrical/README.md) | non-runtime method/reference v0.1 | canonical `flood_solar`; proposed `flood_wind` |
| [`solar_wind_normalized_response/`](solar_wind_normalized_response/README.md) | comparison-only candidate v0.1; solar-specific; `runtime_approved: false` | derived from the SHA-pinned proposed `strong_wind_solar` v2 assumptions and used only as a post-adoption audit fingerprint by proposed `tropical_cyclone_wind_solar` v2; no cell may load it as runtime parameters |

Governing standard: [`20_shared_component_substrate_standard.md`](../standards/20_shared_component_substrate_standard.md).
