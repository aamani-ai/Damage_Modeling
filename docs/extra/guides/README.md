# docs/extra/guides/

Practical walkthroughs for common repo operations and user questions.

These are not canonical curve artifacts, contracts, or source drops. They are operating guides that point to
the canonical files and explain the normal process.

## Guides

| Guide | Use when |
|---|---|
| [`hail_solar_curve_request_guide.md`](hail_solar_curve_request_guide.md) | Someone asks for the current solar hail curve or how Hazard should consume it. |
| [`wildfire_solar_curve_request_guide.md`](wildfire_solar_curve_request_guide.md) | Someone asks for a wildfire x solar curve, multi-subsystem damage treatment, or why the current scaffold must withhold numerical outputs. |
| [`wind_tornado_wind_curve_request_guide.md`](wind_tornado_wind_curve_request_guide.md) | Someone asks for an onshore-wind curve for convective wind, tornado, generic “strong wind,” or hurricane and needs the correct pathway, lifecycle version, inputs, limits, and fail-closed rule. |
| [`source_drop_ingestion_guide.md`](source_drop_ingestion_guide.md) | A new ZIP/source drop arrives and needs inventory, classification, promotion, or staging. |
| [`damage_curve_skill_usage_guide.md`](damage_curve_skill_usage_guide.md) | Deciding whether `damage_curve_skill` should operate directly in-repo or through an outside package/ZIP flow. |

## Rule

Guides explain how to navigate the repo. They should not become a second source of truth. When guide content
names a curve, contract, manifest, or artifact, it should link back to the canonical file.
