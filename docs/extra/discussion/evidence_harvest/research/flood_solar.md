# Stage A · Old-repo flood × solar evidence — factual inventory

**Facts only, no recommendations.** Decisions → [`../01_flood_solar_triage.md`](../01_flood_solar_triage.md).
What the legacy [`infrasure-damage-curves`](../../../../../infrasure-damage-curves) repo *contains* for flood
× solar — numbers **as stated there** (public-derived, not claims-calibrated).

*Sources read:* `research/FLOOD_x_SOLAR.md` (~991 lines, ~47 citations), `data/master_curve_index.json`,
`docs/confidence-framework.md`, `docs/curve-derivation-methodology.md`.

## 1 · The old repo's flood curves

Per-component **logistic** curves (depth-driven) across the same equipment our cell covers — inverter,
switchgear, transformer, combiner/DC, SCADA, cable, module, foundation (params in `master_curve_index.json`).
Our cell instead uses **piecewise/state** depth-% curves; the agent's spot-check found the two forms broadly
**agree** where comparable (old transformer logistic slope ≈ our piecewise slope).

## 2 · Reference inventory by class (~47 citations)

- **Standards / government** — DOE/FEMP (flood PV); NEMA GD-1 (water-damaged equipment); NEMA enclosure types;
  FEMA; USACE **HEC-FIA** (depth-% form); **IEEE C57** (transformer liquid-vs-dry salvageability); **IEC 61701**
  (salt-mist corrosion).
- **Empirical / case** — **Ketjoy et al. (2022)** Thailand field study: ~66% module IR failure post-flood;
  **NERC (2022)** substation case: ~8 in of water → 495 MW outage (shallow-depth electrical damage anchor);
  **ANZGeo (2023)** foundation scour case study.
- **Peer-reviewed / industry** — duration-sensitivity taxonomy (per-component), tracker-stow elevation
  protocol (3–6 ft lift), plus market/portfolio context.

## 3 · Overlap with our cell

**Already cited (redundant):** DOE/FEMP · NEMA GD-1 · NEMA enclosure types · FEMA · USACE HEC-FIA.

**In the old repo, NOT in our cell (candidate new evidence):** Ketjoy et al. (2022) · IEEE C57 · NERC (2022) ·
ANZGeo (2023) scour · IEC 61701 salt-mist · the duration-sensitivity taxonomy · tracker-stow elevation.

## 4 · Factual observations carried to triage (mapped to our flagged seams)

| Our flagged seam (v1.0) | Old-repo evidence |
|---|---|
| module depth-% ordinates are engineering-assumed | **Ketjoy (2022)** empirical post-flood module-failure anchor |
| transformer-type salvageability (one generic curve) | **IEEE C57** liquid-filled vs dry-type distinction |
| shallow-depth electrical damage | **NERC (2022)**: 8 in → 495 MW outage |
| conduit water-path routing (open seam) | **DOE/FEMP** detailed pull-box/conduit ingress mechanism |
| velocity / scour proxy (placeholder) | **ANZGeo (2023)** scour case → mechanism-validated |
| duration / contamination / **salinity** (deferred) | duration taxonomy + **IEC 61701** salt-mist baseline |

**Cross-validation:** transformer & cable curves agree old-vs-ours; inverter/switchgear our curves are steeper
(consistent with NEMA total-loss guidance). No form conflicts found. **Claims-calibrated curves: absent in
both.**

---
*Stage A (facts) · decisions → [`../01_flood_solar_triage.md`](../01_flood_solar_triage.md) · our cell →
[flood×solar dossier](../../../../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_1_EVIDENCE_UPDATE_AND_VERSIONING_DELIVERABLE/01_cells/flood_solar/current/flood_solar_curve_derivation_dossier_v1_0.md).*
