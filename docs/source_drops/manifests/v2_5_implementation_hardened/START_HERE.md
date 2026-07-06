# START HERE — Damage Curve Library package v2.5

This package contains the current damage-curve library framework plus four worked cells:

```text
01_cells/
├─ hail_solar/             semantic model v1.0; docs r5; current filenames still carry legacy v1.3 labels
├─ flood_solar/            semantic model v1.0; docs r3
├─ wind_tornado_wind/      semantic model v1.0; docs r3
└─ strong_wind_solar/      semantic model v1.0; docs r2
```

**v2.5 is an implementation-hardening release.** It does **not** change the semantic damage behavior of any existing cell. It makes the built artifacts enforceable and easier for downstream notebooks/code to consume.

The v2.5 upgrade adds:

```text
- machine-readable canonical JSON curve artifacts for every current cell;
- a distribution-ready damage-code emit contract;
- per-cell capability declarations for metric honesty;
- fail-closed cap-binding preflight declarations before scalar EAL is allowed;
- per-parameter tier / source / parameter-role tables;
- named derivation-rationale addenda for each cell;
- canonical field-name alignment for selector / conditioner / exposure fields;
- Hazard_modeling handoff notes for hail M3 canonicalization and wind M2 height conversion;
- runtime helper code for JSON curve evaluation and 10m→hub wind conversion.
```

Existing workbooks are retained as derivation/audit views. The new JSON artifacts are the preferred runtime contract.

> Note: v2.5 increments documentation revisions because addenda and runtime contracts were appended. Some current source filenames still carry earlier labels (`v1_3`, `v1_0`, or `docs_r1`) for continuity; the registry and JSON artifacts are the authoritative current docs-revision references.


---

## Recommended read order

```text
1. VERSION_REGISTRY.md
2. IMPLEMENTATION_HARDENING_SUMMARY_v2_5.md
3. MACHINE_READABLE_ARTIFACTS.md
4. 00_global_method/00_index.md
5. 00_global_method/09_damage_code_interface_standard.md
6. 00_global_method/20_machine_readable_artifact_standard.md
7. 00_global_method/21_capability_and_cap_binding_standard.md
8. 00_global_method/hazard_modeling_handoff/README.md
9. current cell JSON artifacts in 01_cells/*/current/
```

For the strong-wind solar model itself, read:

```text
01_cells/strong_wind_solar/current/README_strong_wind_solar__model_v1_0__docs_r1.md
01_cells/strong_wind_solar/current/strong_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md
01_cells/strong_wind_solar/current/strong_wind_solar__model_v1_0__docs_r2__curve_artifact.json
```

---

## Key implementation stance

The library’s damage-code layer emits vulnerability/severity. It does not own hazard frequency catalogs, EAL/PML aggregation, policy terms, downtime, or financial metrics.

The new capability declaration makes that stance machine-checkable:

```text
failure-unit scalar DR                      supported
scenario loss with explicit value basis     supported
scalar EAL                                  conditional, requires cap-binding preflight
PML / VaR / TVaR / tail metrics             withheld unless spread is actually carried
```

A downstream notebook should treat an unsupported metric as **withheld**, not as supported-with-caveat.
