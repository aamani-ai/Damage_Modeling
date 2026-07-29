# docs/contracts/

Repo-level contracts for the damage-modeling seam consumed by downstream systems such as `Hazard_modeling`
M3.

These files are the current Hazard-facing contract surface. They do not create a stable importable API; that
remains deferred until runtime publishing and Hazard loading are designed.

Repository-current change records:

- [`REPOSITORY_CONTRACT_RELEASE_2026_07_10.md`](REPOSITORY_CONTRACT_RELEASE_2026_07_10.md) — consumer seam r1.
- [`REPOSITORY_WILDFIRE_SOLAR_MODEL_V1_0_RELEASE_2026_07_10.md`](REPOSITORY_WILDFIRE_SOLAR_MODEL_V1_0_RELEASE_2026_07_10.md) — first canonical wildfire_solar screening model.

## Runtime contract

| Contract | Authoritative file |
|---|---|
| Damage-code interface | [`09_damage_code_interface_standard.md`](standards/09_damage_code_interface_standard.md) |
| Machine-readable artifact standard | [`20_machine_readable_artifact_standard.md`](standards/20_machine_readable_artifact_standard.md) |
| Capability and cap-binding standard | [`21_capability_and_cap_binding_standard.md`](standards/21_capability_and_cap_binding_standard.md) |
| Pathway-aware artifact/emit draft | [`22_pathway_aware_artifact_and_emit_standard.md`](standards/22_pathway_aware_artifact_and_emit_standard.md) |
| Versioning policy | [`17_versioning_policy.md`](standards/17_versioning_policy.md) |

## Schemas

- [`curve_artifact_bundle.v2.schema.json`](schemas/curve_artifact_bundle.v2.schema.json) — repository-current, curve-form-specific payload validation
- [`curve_artifact_bundle.v3.schema.json`](schemas/curve_artifact_bundle.v3.schema.json) — proposed pathway-aware bundle; not yet canonical
- [`curve_artifact_bundle.schema.json`](schemas/curve_artifact_bundle.schema.json) — portable v2.5 / bundle-v1 compatibility
- [`damage_emit.schema.json`](schemas/damage_emit.schema.json)
- [`damage_emit.v2.schema.json`](schemas/damage_emit.v2.schema.json) — proposed required-pathway emit
- [`capability_declaration.v2.schema.json`](schemas/capability_declaration.v2.schema.json) — consumer-distribution-aware capability contract
- [`capability_declaration.v3.schema.json`](schemas/capability_declaration.v3.schema.json) — proposed per-pathway capability contract
- [`capability_declaration.schema.json`](schemas/capability_declaration.schema.json) — v1 compatibility
- [`artifact_index.v2.schema.json`](schemas/artifact_index.v2.schema.json)
- [`cell_runtime_changelog.v1.schema.json`](schemas/cell_runtime_changelog.v1.schema.json)

## Hazard handoff notes

- [`hail_solar_m3_canonicalization.md`](hazard_handoff/hail_solar_m3_canonicalization.md)
- [`hail_solar_consumer_contract_v2.md`](hazard_handoff/hail_solar_consumer_contract_v2.md)
- [`wind_tornado_wind_m2_height_bridge.md`](hazard_handoff/wind_tornado_wind_m2_height_bridge.md)
- [`wind_tornado_wind_model_v2_0_hazard_migration_proposal.md`](hazard_handoff/wind_tornado_wind_model_v2_0_hazard_migration_proposal.md) — noncanonical v2 shadow/migration plan; v1 remains current
- [`tropical_cyclone_wind_wind_model_v1_0_proposal.md`](hazard_handoff/tropical_cyclone_wind_wind_model_v1_0_proposal.md) — noncanonical source-native screening v1 shadow contract; no consumer cutover
- [`flood_wind_model_v1_0_proposal.md`](hazard_handoff/flood_wind_model_v1_0_proposal.md) — noncanonical legacy FEMA whole-substation screening shadow contract; no value binding or consumer cutover
- [`tropical_cyclone_wind_solar_model_v1_0_proposal.md`](hazard_handoff/tropical_cyclone_wind_solar_model_v1_0_proposal.md) — noncanonical Perry source-cohort visible-module screening shadow contract; strict execution remains v0.1 and no consumer cutover is authorized
- [`tropical_cyclone_wind_solar_model_v1_0_docs_r2_no_cutover.md`](hazard_handoff/tropical_cyclone_wind_solar_model_v1_0_docs_r2_no_cutover.md) — deep-curation no-cutover addendum; no ordinary Hazard gust bridge, tracker/tail/value expansion, or model bump was earned
- [`m3_to_m4_distribution_ready_emit.md`](hazard_handoff/m3_to_m4_distribution_ready_emit.md)
- [`wildfire_solar_model_v1_0_hazard_migration.md`](hazard_handoff/wildfire_solar_model_v1_0_hazard_migration.md)

## Guardrail

This folder does not create a stable importable API. Do not add `src/` until the runtime publishing and Hazard
loading path are designed.
