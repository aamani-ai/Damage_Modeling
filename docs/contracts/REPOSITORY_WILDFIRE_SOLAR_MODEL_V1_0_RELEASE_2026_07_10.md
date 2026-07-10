# Repository release — wildfire_solar screening model v1.0

## Classification

```yaml
operating_mode: inside_repo
primary_change_class: NEW_CELL_MODEL_RELEASE
cell_id: wildfire_solar
prior_model: model v0.1
new_model: model v1.0
prior_docs: docs r2
new_docs: docs r3
runtime_outputs_change: true
portable_package_release: unchanged_at_library_v2.5
repository_contract_revision: 2026-07-10.wildfire-screening-v1
```

## Reason

The user authorized a reasonable, referenced approximation for a hard hazard × asset pair. The release
publishes the first numerical runtime model while keeping its evidence grade explicit: source-native hazard
semantics and value basis are Tier 2; field materiality/diagnostics are Tier 3; absolute ordinates and the
support allocation are Tier 4 engineering proxies.

## Runtime change

Model v0.1 returned `NO_RUNTIME_CURVE`. Model v1.0 returns ten failure-unit scalar DRs from exact FSim
conditional class state tables and can assemble physical or installed-CAPEX loss with an explicit value
profile.

## Explicit non-changes

- Portable package v2.5 was not rebuilt or relabeled.
- No existing hail, flood, wind/tornado, or strong-wind curve changed.
- No FSim midpoint, FIL6 cap, Byram conversion, heat flux, or equipment duration is inferred.
- No mitigation/control percentage is introduced.
- No claims or field calibration is claimed.
- No curve-intrinsic probability distribution is emitted.
- Hazard frequency, annual aggregation, financial terms, and frequency-driven tails remain consumer-owned.

## Release contents

- canonical bundle-v2 artifact and capability-v2 declaration;
- ten exact-state failure-unit records;
- explicit physical and installed value linkage;
- executable state, aggregate, distribution, and contract KATs;
- formula-driven eight-sheet audit workbook;
- derivation, metadata, changelog, registry/index, and Hazard migration records.

## Validation target

Release is valid only when schema validation, artifact SHA, runtime KATs, workbook formula/visual QA,
governance tests, links, CSV rectangularity, and whitespace checks pass. The final validation report records
the executed results.
