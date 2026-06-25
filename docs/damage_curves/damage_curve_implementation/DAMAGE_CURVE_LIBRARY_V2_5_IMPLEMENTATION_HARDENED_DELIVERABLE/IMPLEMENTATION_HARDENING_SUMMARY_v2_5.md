# Implementation hardening summary — package v2.5

This release converts the review backlog into enforceable artifacts where the local damage-library package can be changed. The separate `Hazard_modeling` repository was not present in this upload, so notebook changes are expressed as handoff contracts and helper code rather than direct patches.

## What changed

| Review item | v2.5 treatment | Artifact(s) |
|---|---|---|
| A · hail cell has two curves in circulation | The damage-library now declares the dossier curve JSON as canonical and marks the legacy capex-weighted asset-blend curve as non-canonical / blocked for curated M3 use. | `01_cells/hail_solar/current/hail_solar__model_v1_0__docs_r5__curve_artifact.json`; `00_global_method/hazard_modeling_handoff/hail_solar_m3_canonicalization.md` |
| B · wind M2 10m gust is fed into hub-height curve | Added an explicit 10m→hub-height bridge contract and helper code. The actual M2 notebook still needs patching in the external repo. | `00_global_method/runtime_helpers/height_bridge.py`; `00_global_method/hazard_modeling_handoff/wind_tornado_wind_m2_height_bridge.md`; wind JSON artifact |
| C · capability declaration not wired | Added required capability declarations to global standard 09, template spec, and every current cell JSON/spec addendum. | `00_global_method/09_damage_code_interface_standard.md`; `00_global_method/21_capability_and_cap_binding_standard.md`; cell JSON artifacts |
| D · no cap-binding preflight | Added fail-closed cap-binding preflight policy. Scalar EAL is not supportable unless a downstream preflight result is present and passing. | `00_global_method/21_capability_and_cap_binding_standard.md`; cell JSON artifacts |
| E · distribution-ready emit seam | Added scalar/discrete/parametric/state-ensemble emit schema. Current cell content remains mostly scalar, but the interface can carry spread without M4 schema changes. | `00_global_method/schemas/damage_emit.schema.json`; `00_global_method/09_damage_code_interface_standard.md` |
| F · field-name divergence | Canonicalized toward the more precise live-cell names: `iec_wind_class` and `enclosure_rating`, with aliases recorded. | `00_global_method/07_selector_conditioner_exposure_standard.md`; cell JSON artifacts |
| G · per-parameter tier table | Added per-parameter tier/source/role tables in JSON and dossier addenda. | cell JSON artifacts; appended dossier addenda |
| I · Excel → JSON | Added canonical JSON curve artifacts for all current cells. Excel remains derivation/audit view. | `01_cells/*/current/*__curve_artifact.json`; `MACHINE_READABLE_ARTIFACTS.md` |
| M · derivation rationale | Added named derivation-rationale addenda and serialized rationale blocks, including adjustment form/source/reasoning. | appended cell dossiers; cell JSON artifacts |
| N · parameter map by nature | Added `param_role` / `parameter_nature` grouping in JSON and per-parameter tables. | cell JSON artifacts; `20_machine_readable_artifact_standard.md` |

## What did not change

No curve parameters were changed. Therefore all four current cells remain at semantic damage-model version `model v1.0`.

The workbooks were not edited in this release. They remain derivation and dashboard views. Runtime consumers should prefer the new JSON artifacts.

## External repo follow-through

The following are ready-to-apply external changes but cannot be completed inside this uploaded package alone:

```text
Hazard_modeling hail M3:
    stop loading hail_solar_asset_capex_weighted.json as the curated curve;
    load hail_solar__model_v1_0__docs_r5__curve_artifact.json or a generated callable from it.

Hazard_modeling wind M2:
    convert 10m Exposure-C gust to hub-height 3-second gust before M3;
    pass the conversion method, alpha/log-law inputs, and warning flags through the parquet seam.
```
