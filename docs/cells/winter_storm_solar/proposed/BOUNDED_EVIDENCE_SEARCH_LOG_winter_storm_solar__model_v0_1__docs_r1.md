---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_solar — bounded evidence search log (model v0.1 / docs r1)

This log supports absence claims **only within its recorded scope**, never universal nonexistence.

## 1. Scope

| Item | Value |
|---|---|
| Review cutoff | 2026-10-12 |
| Target chain | snowpack/glaze load → array demand vs design → racking/module failure state → same-unit replacement cost |
| Surfaces | web search (standard); original publisher pages and PDFs (agency, standards-body previews, J-STAGE, NEDO, NITE, AIST, manufacturer sites); in-repo legacy library `infrasure-damage-curves` @12653b2c |
| Languages | English, Japanese, Chinese |
| Passes | three bounded passes: anchors (~23 queries), gap-fill (~14 queries plus J-STAGE site search), and a physics check on the glaze bridge (1 query plus NOAA report) |
| Inclusion | original publisher documents read in full or in an official preview; secondary pages recorded as pointers and demoted; third-party mirrors of paywalled documents not used |

## 2. Query families

1. **ASCE 7-22 snow provisions.** Risk-targeted ground snow load, load factor, Eq 7.3-1, slope factor for PV, ground-mounted PV.
2. **Module mechanical tests.** IEC 61215 MQT 16, IEC 62938 non-uniform snow, test-to-failure (Kiwa PVEL, CFV Labs, RETC, Fraunhofer).
3. **Field events.** February 2014 Kanto–Koshin snow (JA), NITE accident releases (JA), Andorra 2026, Turkish forensic cases, US/Canada ground-mount collapses.
4. **Racking strength.** Full-scale rack tests (NEDO technical annex D, JSME/J-STAGE), PV support fragility or reliability under snow (EN/JA/ZH).
5. **Claims.** kWh Analytics Solar Risk Assessment, GCube, AXIS, insurer snow share.
6. **Trackers.** Snow stow and snow ratings (Nextracker, Array, GameChange, NOV).
7. **Glaze bridge.** Jones Simple ice-accretion model (NOAA/NCDC TR 2002-01).

## 3. Results by link

| Link | Found | Strongest sources |
|---|---|---|
| Hazard → load | yes (physics) | WSS-S031 (verified Eq. 1), WSS-S002, WSS-S025 |
| Load vs design → structural failure | **yes, measured** (7 full-scale tests) | WSS-S022, WSS-S023 (both verified in originals) |
| Mapping test design load → ASCE 7-22 pg | **no** | none; carried as three scenarios |
| Module capacity | yes (uniform TtF populations) | WSS-S011, WSS-S010, WSS-S009 |
| Non-uniform (lower-edge) module capacity | mechanism only | WSS-S003, WSS-S006, WSS-S016 |
| Failure → damaged share | yes, thin (3 cases) | WSS-S030, WSS-S021 |
| US field or forensic data with loads | **not located** | — |
| Insurance snow share | **not located** | GCube, kWh and AXIS public material lack a snow share |
| PV-specific snow fragility/reliability study | **not located** (EN/JA/ZH) | — |
| Tracker snow capacity tiers | partial | WSS-S012 (verified 5–60 psf); WSS-S026 unverified |
| Snow stow efficacy | **not located** | WSS-S018 describes the feature only |

## 4. Blocked or unavailable (JL to obtain if wanted)

| Item | Status |
|---|---|
| ASCE 7-22 Ch.7 text; O'Rourke *Snow Loads guide to ASCE 7-22* Ch.13 | paywalled |
| ASCE Press 2025 *Design Snow Loads for Ground Mounted Solar Panels* | paywalled; the most valuable missing source |
| IEC 61215-2:2021, IEC 62938:2020 full text, JIS C 8955:2017, UL 3703/2703 | paywalled |
| METI working-group document `011_s02_00.pdf` (2014 damage) | HTTP 403 |
| kWh Analytics SRA and GCube full reports | gated |
| Nextracker datasheets / pages | HTTP 404 / 429 |
| GameChange datasheet | HTTP 404 |
| METU thesis (Yalcin 2020) | connection refused |
| NITE 2024-12 release | not verified in original |

## 5. Update triggers

Any item in §4, US forensic reports with event load and design load, or tracker-specific snow tests.
