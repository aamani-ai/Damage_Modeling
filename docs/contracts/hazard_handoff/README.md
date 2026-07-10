# Hazard_modeling handoff notes

These notes are the implementation-side contract for external M2/M3 notebooks. They are included here because the separate `Hazard_modeling` repository was not part of the uploaded package.

| File | External action |
|---|---|
| `hail_solar_m3_canonicalization.md` | Replace any legacy capex-weighted hail asset curve in M3 with the canonical failure-unit JSON artifact. |
| `wind_tornado_wind_m2_height_bridge.md` | Convert 10m gusts to hub-height gusts before evaluating the wind/tornado wind-farm damage curve. |
| `m3_to_m4_distribution_ready_emit.md` | Ensure the parquet/schema seam can carry scalar and distribution emit objects. |
| `wildfire_solar_research_to_runtime_handoff__model_v0_1__docs_r2.md` | Keep FSim wildfire screening separate from physical solar loss; isolate the current legacy proxy and fail closed until a canonical wildfire_solar model is released. |
| `wildfire_solar_model_v1_0_hazard_migration.md` | Replace the legacy midpoint/Byram/logistic proxy with the canonical exact-FSim-state screening model, explicit value linkage, KATs, SHA pin, and limitation flags. |

The v1.0 migration file supersedes the v0.1 no-runtime instruction for execution; the v0.1 file remains the
research and promotion audit.
