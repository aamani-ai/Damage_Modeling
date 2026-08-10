# Hazard migration — flood_wind model v1.0 / docs r1

> Canonical partial-screening producer contract. Repository pin exists; GCS publication and
> `damage_artifact_ref` activation remain deliberate publish/register acts.

Practical request example: [flood × wind curve request guide](../../extra/guides/flood_wind_curve_request_guide.md).

Hazard loads `flood_wind@model_v1_0__docs_r1` through the shared registry → manifest → SHA → bundle-v3 schema
→ KAT seam. The supported numeric request names pathway `flood_inundation_contact`, failure unit
`FW_HAZUS_GSU_SUBSTATION_ASSEMBLY`, exact Hazus class/assumption set, freshwater, delivered depth basis, and
either direct 0–10 ft substation-grade depth or the complete same-datum WSE/grade bridge.

The loader must preserve these fail-closed outcomes: non-freshwater withholds, depth above 10 ft withholds,
negative depth rejects, component/wind units withhold, and no endpoint clamp or curve fallback occurs.

Scenario loss uses only:

```text
DR × same physical substation direct replacement value × exposed fraction
```

The shared substation is represented once; full-project TIV, mixed electrical defaults, per-turbine
repetition, and assembly-plus-component charging are prohibited. Every downstream product labels the result
partial legacy-source screening. Annual/tail metrics require separate consumer evidence and remain withheld by
this release.
