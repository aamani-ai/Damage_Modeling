---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_wind — bounded evidence search log (model v0.1 / docs r1)

This log supports absence only within its recorded scope.

## 1. Scope

| Item | Value |
|---|---|
| Review cutoff | 2026-10-12 |
| Target chain | radial ice (± concurrent wind) → turbine/BOP physical state → same-unit repair cost |
| Surfaces | web search (standard); original publisher documents (NERC, FERC, PNNL, IEA Wind, Hydro-Québec, journals); legacy library @12653b2c |
| Passes | two bounded passes (~21 queries, plus a direct download of the NERC final report, which was too large for the fetch tool) |
| Inclusion | originals read; press and snippets recorded as T3/T4 pointers; no third-party mirrors |

## 2. Query families

1. Legacy citation verification (PNNL-33587, Rezaei 2015, NERC/FERC Feb 2021, ArcVera, CanWEA/NRC).
2. Design anchors (ASCE 7-22 Ch.10, IEC 61400-1 Annex L, ISO 12494, IEA Task 19).
3. Field physical damage: turbine blade or tower failures from ice; met-mast and collection-line failures in
   ice storms (1998 Québec, 2009 Kentucky, 2010 Oklahoma, 2021/2023 Texas, 2008 China).
4. Fragility: turbine ice or ice+wind; distribution/transmission lines and poles under ice + wind.
5. Cost-based icing damage functions (cat models, Hazus, CLIMADA, academic).
6. Overhead vs underground share of US wind-farm collection.

## 3. Results by link

| Link | Found |
|---|---|
| Ice → turbine structural failure | **not located** (no documented modern turbine blade/tower failure from ice load) |
| Feb 2021 icing → physical damage | outages only, no damage reported (NERC p.76, pp.169–170; FERC slides) |
| Ice-related wind-farm damage | one case (Blue Canyon 2010, ~$1M, mostly falling ice; local news, T4) |
| Overhead line withstand | 1998 Québec field account (13 mm design → ~30–50 mm withstand) |
| Line/pole ice+wind fragility | Li et al. 2024 exists; coefficients paywalled |
| Cost-based turbine icing damage function | **not located** |
| Overhead share of US collection | not quantified in located sources |

## 4. Blocked (JL to obtain if wanted)

- Rezaei 2015 (UBC block page)
- ArcVera 2021 (DNS failure)
- ASCE 7-22 Ch.10 (paywalled)
- IEC 61400-1 (paywalled)
- Li et al. 2024 (Taylor & Francis paywall)
- IJDRS 2026 full text (Springer auth redirect)
- S&P Global 2021 (HTTP 403)
- Mulherin 1998 (Elsevier)
- Oklahoma Climatological Survey January 2010 summary (redirect)
