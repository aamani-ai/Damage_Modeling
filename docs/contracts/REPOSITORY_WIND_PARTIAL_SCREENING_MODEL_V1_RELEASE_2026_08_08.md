# Repository release — flood_wind and wildfire_wind partial-screening model v1

```yaml
release_date: 2026-08-08
repository_contract_revision: 2026-08-08.wind-partial-screening-v1-v3
portable_package_release: unchanged_at_library_v2.5
released_cells:
  - flood_wind@model_v1_0__docs_r1
  - wildfire_wind@model_v1_0__docs_r1
released_contracts:
  - damage_curve_record_bundle.v3
  - capability_declaration.v3
  - damage_emit.v2
```

## Decision

The two wind missing-piece proposals are promoted as honest canonical version-one screening models. This is
not a completeness claim. It gives Hazard a governed, SHA-pinned way to represent the evidence-supported
portion of each cell while every unsupported unit remains explicit null/withheld.

| Cell | Released numerical scope | Evidence label | Whole-farm default |
|---|---|---|---|
| `flood_wind` | one source-native whole GSU/substation assembly curve | legacy official FEMA source; screening applicability | prohibited |
| `wildfire_wind` | pad electrical + shared GSU protection/control/DC | Tier-4 cell-local screening assumptions | prohibited |

Both models support scenario loss only from explicit same-failure-unit direct replacement value and exposure.
Neither supplies an implicit value profile, whole-project DR, annual/tail result, BI, or portfolio aggregation.

## Common-core change

This release graduates the pathway-aware v3 bundle/capability/emit seam from proposal-only to released use.
The Damage publisher now validates and publishes v3 plus its sibling schemas. The Hazard common loader now
validates v3 from the governed namespace, resolves exact pathways/selectors/conditioners/axes, preserves
withheld reason codes, evaluates piecewise-linear records, and runs formula plus fail-closed KATs.

The release does not change the five existing bundle-v2 cell pins. Portable package v2.5 remains preserved.
Durable GCS publication and Hazard registry activation follow the immutable publish → register → load seam;
repository promotion alone does not silently alter a production run.
