# Machine-readable artifact index — repository current

The portable package baseline remains **library v2.5**. The repository-current runtime state has advanced
to `2026-08-09.hurricane-wind-partial-screening-v1-v3`; it is canonical in this checkout but has not been assembled into a new
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
| `flood_wind` | `flood_wind@model_v1_0__docs_r1` | bundle v3 | capability v3 | `docs/cells/flood_wind/current/flood_wind__model_v1_0__docs_r1__curve_artifact.json` | `37da745d87a4722e…` |
| `wildfire_wind` | `wildfire_wind@model_v1_0__docs_r1` | bundle v3 | capability v3 | `docs/cells/wildfire_wind/current/wildfire_wind__model_v1_0__docs_r1__curve_artifact.json` | `3f923f506a2082dd…` |
| `tropical_cyclone_wind_wind` | `tropical_cyclone_wind_wind@model_v1_1__docs_r1` | bundle v3 | capability v3 | `docs/cells/tropical_cyclone_wind_wind/current/tropical_cyclone_wind_wind__model_v1_1__docs_r1__curve_artifact.json` | `0c33499183deb517…` |

## Consumer sequence

```text
poll index
  -> compare model + docs + artifact schema + SHA
  -> read cell CHANGELOG.json
  -> validate JSON payload
  -> run known-answer tests when published
  -> deliberately update the consumer pin
```

The v2 schema fixes the original curve-form payloads and repository-relative source paths. Bundle v3 adds
first-class pathway, axis, coverage, selector/conditioner, and explicit-withholding records. Capability v2 permits a consumer
to compute frequency-driven annual metrics from a validated annual loss distribution while separately flagging
that the curve does not carry intrinsic vulnerability spread.

`wildfire_solar` is explicitly `screening_engineering_proxy`: exact FSim categorical states, no interpolation,
ten failure-unit state tables, explicit value linkage, and mandatory not-field-calibrated flags.

`flood_wind`, `wildfire_wind`, and `tropical_cyclone_wind_wind` are explicitly partial-screening releases. They support only their named
failure units, run v3 KATs through the shared Hazard loader, and allow scenario dollars only with explicit
same-unit direct replacement value and exposure when the individual capability permits it. The TC-wind source
denominator is not approved, so it withholds scenario dollars. Annual/tail/portfolio completeness is not implied.
