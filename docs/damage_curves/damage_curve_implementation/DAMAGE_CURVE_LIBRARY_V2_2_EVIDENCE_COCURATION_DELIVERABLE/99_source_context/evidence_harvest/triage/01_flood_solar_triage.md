# Stage B · flood × solar co-curation triage — adopt / park / reject

**Decisions** on the old repo's flood evidence (facts: [`research/flood_solar.md`](research/flood_solar.md)).

## Verdict

**Richer than hail.** Still **no new curve** (our piecewise/state depth-% structure stands), but the old repo
holds **real empirical anchors** for several of our v1.0 *engineering-assumed* seams — and some imply candidate
*model* refinements, not just references.

## ✅ Adopt — references / anchors (into the evidence map + assumption register)

| Evidence | Strengthens (our seam) | Note |
|---|---|---|
| **Ketjoy et al. (2022)** | module depth-% ordinates (currently engineering-assumed) | empirical post-flood module-failure field anchor |
| **NERC (2022)** substation case | shallow-depth switchgear/SCADA damage | 8 in → 495 MW outage anchors the low-depth knee |
| **DOE/FEMP conduit mechanism** | conduit water-path open seam | documents the ingress pathway we flagged |
| **ANZGeo (2023)** scour | velocity/scour **placeholder** | upgrades it from placeholder to mechanism-validated |
| **IEEE C57** | transformer-type salvageability | basis for a liquid-vs-dry selector |
| **IEC 61701** + duration taxonomy | salinity / duration (deferred conditioners) | baseline for future conditioners |

## ⚠️ Candidate v1.1 **model** changes (separate, bigger decision — not v1 ingestion)

These would change DR for the same inputs, so they are **model-version** changes, not docs revisions:
- **transformer-type selector** (IEEE C57) · **salinity multiplier** (IEC 61701) · **duration conditioner**.
Flag now; decide later. v1 ingestion stays references-only.

## ⏸️ Park / ❌ redundant

- Park: claims-calibration (neither repo has it); exact depth-% ordinates remain engineering even with
  Ketjoy as a sanity anchor.
- Redundant: DOE/FEMP, NEMA GD-1, FEMA, USACE HEC-FIA (already cited); old curve params (we keep ours).

## Cross-validation (no conflict)

Transformer & cable curves agree old-vs-ours; inverter/switchgear ours steeper (consistent with NEMA
total-loss). Record as independent corroboration.

## Ingestion (standard 16) + version call

v1 ingestion = **references + the cross-validation note → docs revision only** (no DR change → no
cell-model bump, per [standard 17](../../../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_1_EVIDENCE_UPDATE_AND_VERSIONING_DELIVERABLE/00_global_method/17_versioning_policy.md)).
The transformer-selector / salinity / duration items are logged as **candidate model v1.1** changes for a
separate pass. One [standard-16](../../../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_1_EVIDENCE_UPDATE_AND_VERSIONING_DELIVERABLE/00_global_method/16_reference_ingestion_and_curve_update_protocol.md)
update to the [flood×solar dossier](../../../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_1_EVIDENCE_UPDATE_AND_VERSIONING_DELIVERABLE/01_cells/flood_solar/current/flood_solar_curve_derivation_dossier_v1_0.md).

---
*Stage B · facts → [`research/flood_solar.md`](research/flood_solar.md) · workstream → [`README.md`](README.md).*
