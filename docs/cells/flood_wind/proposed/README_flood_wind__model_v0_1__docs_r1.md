# flood_wind — model v0.1 research scaffold

> **Status: proposed, pressure-tested, noncanonical, zero runtime curves.** No current Damage Modeling or Hazard Modeling runtime pin changes.

## Outcome

```yaml
cell_id: flood_wind
pathway_id: flood_inundation_contact
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
canonical_runtime_artifact: false
curve_records: 0
runtime_reason: NO_RUNTIME_CURVE
```

The package establishes a dependency-safe electrical/foundation/civil decomposition, a local component-datum axis, a shared solar/wind equipment crosswalk, a row-complete value audit, ownership guardrails, and a pinned legacy characterization. It does not publish a numeric damage curve.

## Central decision

Use one intrinsic response for exactly matched GSU/substation equipment, regardless of solar or wind label—but only after equipment, mechanism, axis, ordinate, selectors, and conditioners match. Exposure, value, owner, and component instance remain cell-local.

## Why numbers are withheld

- The canonical flood-solar electrical curves are T3 engineering proxies, not claims-calibrated common curves.
- `FS_XFMR` mixes main-transformer value with a control/terminal datum.
- public NERC cases demonstrate outage mechanisms but not same-unit repair cost;
- the CWER wind electrical row is unsplit;
- site ownership, component values, elevations, and inventories are absent;
- the Hazard placeholder aggregates equipment and contains formula/value/bypass defects.

## Package contents

Governance/evidence: change classification, decision log, bounded search, legacy audit, source register, claim register, parameter tiers, numerical candidate audit, pressure test, and promotion gates.

Design/contract: seven-step audit, site adapter, shared-component crosswalk, value crosswalk, dossier, metadata spec, zero-curve artifact, capability, KATs, workbook, manifest, and validation report.

## Explicit non-changes

```yaml
artifact_index: unchanged
portable_package: unchanged
canonical_flood_solar: unchanged
contracts_schemas: unchanged
Hazard_runtime: unchanged
numeric_damage_emit: not_created
model_v1_0: not_released
```
