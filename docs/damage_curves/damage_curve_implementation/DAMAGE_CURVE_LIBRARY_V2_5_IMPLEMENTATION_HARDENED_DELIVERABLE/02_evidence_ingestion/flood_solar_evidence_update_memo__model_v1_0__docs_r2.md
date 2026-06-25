# Evidence update memo · flood × solar · model v1.0 · docs r2

## 1. Update type

```text
cell_id: FLOOD_SOLAR
semantic_damage_model_version: v1.0
new_documentation_revision: docs r2
update_type: evidence co-curation / reference-anchor ingestion
runtime_DR_change: no
```

This memo records the standard-16 ingestion of the legacy flood × solar evidence triage. The ingestion is
**documentation-only** for v2.2: the current piecewise/state depth-damage structure remains the active v1.0
model.

---

## 2. Adopted as references / anchors

| Evidence | Strengthens current seam | Disposition | Runtime effect |
|---|---|---|---:|
| Ketjoy et al. 2022 | Module depth-percent context | Adopt as empirical post-flood module-failure anchor / sanity check | None |
| NERC 2022 substation case | Shallow-depth switchgear / SCADA damage | Adopt as shallow-depth knee support / case evidence | None |
| DOE/FEMP conduit mechanism | Conduit water-path open seam | Adopt as mechanism support | None |
| ANZGeo 2023 scour | Velocity/scour placeholder | Adopt as mechanism validation for scour pathway | None |
| IEEE C57 | Transformer-type salvageability | Adopt as future selector support | None now |
| IEC 61701 + duration taxonomy | Salinity / duration deferred conditioners | Adopt as future conditioner support | None now |

---

## 3. Candidate model v1.1 changes, not adopted in v2.2

```text
transformer-type selector
salinity multiplier
duration conditioner
```

These would change DR for the same flood depth and metadata, so they require a separate model-update memo.

---

## 4. Version call

```text
same inputs before update → same DR after update
cell damage-model version: unchanged at flood_solar model v1.0
documentation revision: docs r2
```

---

## 5. Source pointers

```text
source triage:
    99_source_context/evidence_harvest/triage/01_flood_solar_triage.md

raw research file desired for future deeper refit:
    research/flood_solar.md
```
