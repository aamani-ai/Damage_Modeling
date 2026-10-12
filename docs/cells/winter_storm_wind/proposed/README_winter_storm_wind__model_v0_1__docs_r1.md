---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# Winter storm × onshore wind — model v0.1 / docs r1 (fail-closed scaffold)

```yaml
cell_id: winter_storm_wind
pathway_id: ice_accretion
damage_code_id: WINTER_STORM_WIND_PROPOSED_V0_1
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
lifecycle_state: scaffold
promotion_status: proposed
canonical_runtime_artifact: false
curve_records: 0
runtime_reason: NO_RUNTIME_CURVE
package_release: unreleased
```

## What this is

This is the governed home for winter-storm physical damage to wind farms, built **without numbers**. When asked
for a damage ratio, the cell answers "not available" (`NO_RUNTIME_CURVE`). It does not say zero. The reason is
that the evidence is lacking: no located source links ice thickness to repair cost for turbines or BOP units.
Everything else is in place: scope, pathways, failure units, the evidence trail, the value ledger, the input
contract and tests. Numbers can be added later without restarting.

## Why no numbers (bounded search, 2026-10-12)

- **Turbines.** No located case of ice weight structurally damaging a modern turbine. In February 2021 blade
  icing caused "48 outages or derates at 41 wind facilities" (NERC report p.76). These were protective
  shutdowns; no physical damage was reported.
- **The one damage case** (Blue Canyon, Oklahoma, January 2010: about $1M across 195 turbines) came mostly from
  **falling ice**, which belongs to the deferred shedding pathway.
- **Legacy curves rejected.** The legacy `WINTER_WEATHER_x_WIND` logistic curves give about 3% nacelle and
  electrical damage at **zero** ice. They predict 17–35% at 0.75 in, where their own Texas case shows none.
  They misread PNNL-33587 and ignore design ice. See the
  [legacy ingestion](LEGACY_EVIDENCE_INGESTION_winter_storm_wind__model_v0_1__docs_r1.md).
- **Overhead collection lines** have a usable field anchor: in 1998, lines designed for 13 mm withstood
  about 30–50 mm. It is documented as the first candidate but not activated. The value row merges collection
  and substation, and the reference farm assumes buried collection.

## Snapshot

```text
winter storm × wind farm
├─ ice_accretion (v0.1 primary candidate) — all units withheld
│  ├─ WT_BLADE_ASSEMBLY (primary candidate)  · WT_NACELLE_AND_HUB · WT_TOWER_AND_EXTERNAL_FIXTURES
│  ├─ WT_PAD_ELECTRICAL · WT_COLLECTION_NETWORK (first candidate: overhead lines) · WT_GSU_SUBSTATION
│  ├─ WT_CONTROL_AND_MET_STATION (met masts: most ice-fragile, qualitative)
│  ├─ WT_FOUNDATION (geometry-screened, no numeric zero) · WT_CIVIL_INFRA (split required)
│  └─ SUPPORT_FIELDWORK · SUPPORT_TRANSPORT_LOGISTICS (allocate once)
├─ deferred: ice_with_concurrent_wind · ice_shedding_impact · snow on buildings · extreme-cold physical effects
└─ excluded: icing downtime, curtailment, freeze-off, cold shutdown (business interruption)
```

## Inputs the hazard grid should still send

`ice_radial_thickness_mm` (equivalent uniform radial glaze, 25.4 mm cylinder at 10 m),
`ice_concurrent_gust_3s_10m_mps`, `design_ice_thickness_mm` (per cell) and `event_family_id`. These let a future
curve attach without re-running the grid.

## Package

[artifact](winter_storm_wind__model_v0_1__docs_r1__curve_artifact.json) ·
[capability](winter_storm_wind__model_v0_1__docs_r1__capability.json) ·
[KATs](known_answer_tests_winter_storm_wind__model_v0_1__docs_r1.json) ·
[dossier](winter_storm_wind_curve_derivation_dossier__model_v0_1__docs_r1.md) ·
[metadata spec](winter_storm_wind_damage_code_metadata_spec__model_v0_1__docs_r1.md) ·
[decision log](DECISION_LOG_winter_storm_wind__model_v0_1__docs_r1.md) ·
[change classification](CHANGE_CLASSIFICATION_winter_storm_wind__model_v0_1__docs_r1.md) ·
[sources](SOURCE_REGISTER_winter_storm_wind__model_v0_1__docs_r1.csv) ·
[claims](CLAIM_PARAMETER_REGISTER_winter_storm_wind__model_v0_1__docs_r1.csv) ·
[parameters](PARAMETER_TIER_TABLE_winter_storm_wind__model_v0_1__docs_r1.csv) ·
[search log](BOUNDED_EVIDENCE_SEARCH_LOG_winter_storm_wind__model_v0_1__docs_r1.md) ·
[legacy ingestion](LEGACY_EVIDENCE_INGESTION_winter_storm_wind__model_v0_1__docs_r1.md) ·
[pressure test](PRESSURE_TEST_winter_storm_wind__model_v0_1__docs_r1.md) ·
[seven-step audit](SEVEN_STEP_AUDIT_winter_storm_wind__model_v0_1__docs_r1.md) ·
[value crosswalk](VALUE_CROSSWALK_winter_storm_wind__model_v0_1__docs_r1.csv) ·
[promotion gates](PROMOTION_GATE_MATRIX_winter_storm_wind__model_v0_1__docs_r1.md) ·
[validation report](VALIDATION_REPORT_winter_storm_wind__model_v0_1__docs_r1.md) ·
[workbook](damage_curve_records_winter_storm_wind__model_v0_1__docs_r1.xlsx).
Validator: `scripts/reference_helpers/validate_winter_storm_wind_v0_1_scaffold.py`.
