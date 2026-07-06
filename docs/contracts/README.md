# docs/contracts/

Repo-level contracts for the damage-modeling seam consumed by downstream systems such as `Hazard_modeling`
M3.

These files are the current Hazard-facing contract surface. They do not create a stable importable API; that
remains deferred until runtime publishing and Hazard loading are designed.

## Runtime contract

| Contract | Authoritative file |
|---|---|
| Damage-code interface | [`09_damage_code_interface_standard.md`](standards/09_damage_code_interface_standard.md) |
| Machine-readable artifact standard | [`20_machine_readable_artifact_standard.md`](standards/20_machine_readable_artifact_standard.md) |
| Capability and cap-binding standard | [`21_capability_and_cap_binding_standard.md`](standards/21_capability_and_cap_binding_standard.md) |
| Versioning policy | [`17_versioning_policy.md`](standards/17_versioning_policy.md) |

## Schemas

- [`curve_artifact_bundle.schema.json`](schemas/curve_artifact_bundle.schema.json)
- [`damage_emit.schema.json`](schemas/damage_emit.schema.json)
- [`capability_declaration.schema.json`](schemas/capability_declaration.schema.json)

## Hazard handoff notes

- [`hail_solar_m3_canonicalization.md`](hazard_handoff/hail_solar_m3_canonicalization.md)
- [`wind_tornado_wind_m2_height_bridge.md`](hazard_handoff/wind_tornado_wind_m2_height_bridge.md)
- [`m3_to_m4_distribution_ready_emit.md`](hazard_handoff/m3_to_m4_distribution_ready_emit.md)

## Guardrail

This folder does not create a stable importable API. Do not add `src/` until the runtime publishing and Hazard
loading path are designed.
