# Machine-readable artifact index — repository current

The portable package baseline remains **library v2.5**. The repository-current runtime state has advanced
to `2026-07-10.wildfire-screening-v1`; it is canonical in this checkout but has not been assembled into a new
portable package.

Consumers should poll [`machine_readable_artifact_index.json`](machine_readable_artifact_index.json) and pin
the full cell tuple, not `package_release` alone.

| Cell | Consumer pin | Artifact schema | Capability schema | Artifact | SHA-256 |
|---|---|---|---|---|---|
| `hail_solar` | `hail_solar@model_v1_0__docs_r7` | bundle v2 | capability v2 | `docs/cells/hail_solar/current/hail_solar__model_v1_0__docs_r7__curve_artifact.json` | `8c52f3442eb606f5…` |
| `flood_solar` | `flood_solar@model_v1_0__docs_r4` | bundle v2 | capability v2 | `docs/cells/flood_solar/current/flood_solar__model_v1_0__docs_r4__curve_artifact.json` | `a08e77ef034e1ece…` |
| `wind_tornado_wind` | `wind_tornado_wind@model_v1_0__docs_r4` | bundle v2 | capability v2 | `docs/cells/wind_tornado_wind/current/wind_tornado_wind__model_v1_0__docs_r4__curve_artifact.json` | `908f386953d062a6…` |
| `strong_wind_solar` | `strong_wind_solar@model_v1_0__docs_r3` | bundle v2 | capability v2 | `docs/cells/strong_wind_solar/current/strong_wind_solar__model_v1_0__docs_r3__curve_artifact.json` | `832f47d69372ec54…` |
| `wildfire_solar` | `wildfire_solar@model_v1_0__docs_r3` | bundle v2 | capability v2 | `docs/cells/wildfire_solar/current/wildfire_solar__model_v1_0__docs_r3__curve_artifact.json` | `598512fbe2f0a3c…` |

## Consumer sequence

```text
poll index
  -> compare model + docs + artifact schema + SHA
  -> read cell CHANGELOG.json
  -> validate JSON payload
  -> run known-answer tests when published
  -> deliberately update the consumer pin
```

The v2 schema fixes curve-form payloads and repository-relative source paths. Capability v2 permits a consumer
to compute frequency-driven annual metrics from a validated annual loss distribution while separately flagging
that the curve does not carry intrinsic vulnerability spread.

`wildfire_solar` is explicitly `screening_engineering_proxy`: exact FSim categorical states, no interpolation,
ten failure-unit state tables, explicit value linkage, and mandatory not-field-calibrated flags.
