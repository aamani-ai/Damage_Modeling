# Hazard migration — wildfire_wind model v1.0 / docs r1

Practical request example: [wildfire × wind curve request guide](../../extra/guides/wildfire_wind_curve_request_guide.md).

> Canonical Tier-4 partial-screening producer contract. Repository pin exists; GCS publication and
> `damage_artifact_ref` activation remain deliberate publish/register acts.

Hazard loads `wildfire_wind@model_v1_0__docs_r1` through the shared registry → manifest → SHA → bundle-v3
schema → KAT seam. The only numerical units are `WT_PAD_ELECTRICAL` and
`WT_GSU_PROTECTION_CONTROL_DC` on exact integer FSim conditional flame-length class states 0–6.

The request must preserve the source product ID `USFS_RDS_2016_0034_3_270M` and explicitly acknowledge
assumption set `WW_T4_PARTIAL_ELECTRICAL_SCREENING_2026_08_08`. The axis is not heat flux, duration, ignition
probability, or a permitted class midpoint. Wrong source, missing acknowledgement, unknown pathway,
noninteger/out-of-range state, and cross-cell fallback all reject.

All other units return null DR plus reason codes. Scenario loss is allowed only from each same named unit's
direct replacement value and local exposure fraction; the shared GSU package is counted once. No mixed
electrical row, full-project TIV, whole-farm DR, annual/tail result, or automatic mitigation credit is inferred.
Every downstream product carries `SCREENING_ENGINEERING_PROXY_T4` and `PARTIAL_FAILURE_UNIT_COVERAGE`.
