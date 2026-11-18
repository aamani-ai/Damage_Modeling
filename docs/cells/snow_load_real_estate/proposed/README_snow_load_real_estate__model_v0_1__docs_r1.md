<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
-->

# snow_load_real_estate — snow × real estate, model v0.1 proposal

## Status

Noncanonical proposal (`proposed/`), scaffold, not yet reviewed. Not indexed, not released, no Hazard pin (gate 10).
Sharing is JL's call (brief §0).

## 1. The modelling question

At a given event ground snow load, what share of a reference building's structure replacement cost is lost through
the roof system (serviceability damage, partial failure, collapse)?

## 2. Scope

### In scope
- Uniform roof snow on the house, office and warehouse roof structures.

### Withheld, not zero
- Contents (`SRE_BUILDING_CONTENTS`); interior water damage beyond the state definitions (`SRE_INTERIOR_WATER_AFTER_BREACH`).

### Out of scope
- Drift and unbalanced snow; rain-on-snow surcharge (input accepted, ignored); sliding snow; ice dams (gap); tree fall
  under ice weight (recorded only); defects and age; loss of use and business interruption.

## 3. Reference buildings (selector `reference_building_id`)

| ID | Profile | Roof read as | Curve |
|---|---|---|---|
| `RE_RES_SFD_1S_SLAB` | re_house_1s_wood_slab | light-frame wood (Li & van de Lindt test house, R1) | adopted |
| `RE_IND_WAREHOUSE` | re_warehouse_1s_steel_slab | wide-flange beam roof (Kozak & Liel), T4 reading of a PEMB | constructed; losses from Strobel & Liel (T3) |
| `RE_COM_OFFICE_3S_SLAB` | re_office_3s_slab | open-web steel joists under membrane (Kozak & Liel) | constructed; losses from Strobel & Liel (T3) |

## 4. Coverage (gate 9)

Roof system: response for all three buildings, 100 % of structure RCN. Contents and interior water: withheld. In the
dashboard's subsystem terms: BUILDING structure priced; BUILDING contents withheld.

## 5. Change classification

New cell, new pathway `snow_load_roof`, new failure unit. No existing cell, record, pin or index entry changes.

## 6. Existing-coverage check

No snow cell exists on `main` or `cell/real-estate`. The `winter_storm_solar` proposal (branch
`cell/winter-storm-solar-wind`) covers solar racks and modules, a different asset; nothing is borrowed from it.

## 7. Gates (brief §3)

| Gate | State |
|---|---|
| 1 Search log | present |
| 2 Source and claim registers | present (16 sources, 39 claims) |
| 3 Parameter tier table | present (43 parameters: 3 T2, 18 T3, 22 T4) |
| 4 Artifact, capability, KATs, evidence chain | present; 98 records; 942 / 942 KATs pass |
| 5 Dossier with assumption register and decision log | present |
| 6 Methodology file per curve | present (3) |
| 7 Uncertainty | bands kept, every assumption run, compounding not propagated (stated) |
| 8 No cross-asset proxy | met (archetype transfers within the asset flagged) |
| 9 Coverage stated | met |
| 10 Folder state matches claim | met (`proposed/` only) |

**Run gate (brief §4 step 2) not met:** SJ has not confirmed the per-cell design snow-load layer; ASCE 7-22 Ch. 7 is
absent (absence recorded). Strobel & Liel 2013 is in hand since 17 Nov.

## 8. Explicit non-changes

No change to `main`, `cell/real-estate`, the artifact index, VERSION_REGISTRY, the catalogue, any Hazard pin or any
other cell.
