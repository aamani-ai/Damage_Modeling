# docs/contracts/

Repo-level contracts for the damage-modeling seam consumed by downstream systems such as `Hazard_modeling`
M3.

These files are exposed here as an index only. The authoritative v2.5 files remain in the implementation
bundle until a reviewed migration is planned.

## Runtime contract

| Contract | Authoritative file |
|---|---|
| Damage-code interface | [`09_damage_code_interface_standard.md`](../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/09_damage_code_interface_standard.md) |
| Machine-readable artifact standard | [`20_machine_readable_artifact_standard.md`](../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/20_machine_readable_artifact_standard.md) |
| Capability and cap-binding standard | [`21_capability_and_cap_binding_standard.md`](../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/21_capability_and_cap_binding_standard.md) |
| Versioning policy | [`17_versioning_policy.md`](../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/17_versioning_policy.md) |

## Schemas

- [`curve_artifact_bundle.schema.json`](../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/schemas/curve_artifact_bundle.schema.json)
- [`damage_emit.schema.json`](../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/schemas/damage_emit.schema.json)
- [`capability_declaration.schema.json`](../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/schemas/capability_declaration.schema.json)

## Hazard handoff notes

- [`hail_solar_m3_canonicalization.md`](../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/hazard_modeling_handoff/hail_solar_m3_canonicalization.md)
- [`wind_tornado_wind_m2_height_bridge.md`](../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/hazard_modeling_handoff/wind_tornado_wind_m2_height_bridge.md)
- [`m3_to_m4_distribution_ready_emit.md`](../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/hazard_modeling_handoff/m3_to_m4_distribution_ready_emit.md)

## Guardrail

This folder does not create a stable importable API. Do not add `src/` until the runtime publishing and Hazard
loading path are designed.
