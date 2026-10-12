---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_wind — metadata contract (model v0.1 / docs r1)

```yaml
cell_id: winter_storm_wind
pathway_id: ice_accretion
canonical_runtime_artifact: false
runtime_curve_count: 0
```

This is a research-state input contract and a fail-closed output contract. Supplying every field still yields
no numeric damage in model v0.1.

## Required identity

| Field | Rule |
|---|---|
| `event_id` | non-empty |
| `event_family_id` | parent winter storm id (`EVENT_FAMILY_ID_REQUIRED` if absent) |
| `pathway_id` | exactly `ice_accretion`; deferred pathways rejected (`PATHWAY_DEFERRED_NOT_IMPLEMENTED`); no default |
| `failure_unit_id` | one of the 11 declared units (`FAILURE_UNIT_ID_UNKNOWN` otherwise) |

## Capture fields (no runtime effect)

```yaml
ice_radial_thickness_mm: number >= 0
ice_concurrent_gust_3s_10m_mps: number >= 0 | null
design_ice_thickness_mm: number > 0 | null
collection_topology: overhead | buried | mixed | unknown
turbine_cold_climate_package: yes | no | unknown
ice_detection_or_deicing: yes | no | unknown
```

## Output

Every metric (`failure_unit_scalar_dr`, `scenario_loss_given_value_basis`, `scalar_eal`, `pml`, `var`, `tvar`)
is `{value: null, status: withheld, reason_codes: [NO_RUNTIME_CURVE]}`.
