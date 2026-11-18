---
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: proposed
---

# winter_storm_solar — gate matrix (model v0.2 / docs r1)

## A. The ten build-brief gates (brief §3): needed before the cell is reviewable

| # | Gate | Status | Evidence |
|---|---|---|---|
| 1 | Bounded evidence search log | **pass** | [search log v0.2](BOUNDED_EVIDENCE_SEARCH_LOG_winter_storm_solar__model_v0_2__docs_r1.md) (F1–F8, unavailable texts recorded) |
| 2 | Source and claim registers with locators; every number its own row | **pass** | 40 sources, 77 claims; validator checks locators, orphans and 51 key numbers |
| 3 | Parameter tier table; chosen anchors judgment | **pass** | 44 parameters; validator checks 17 chosen anchors are T4 |
| 4 | Artifact + capability + KATs with the evidence-chain gate | **pass** | three runtime curves, each hazard → exposure → failure state → same-unit cost; withheld units declared; KATs pass through the evaluator |
| 5 | Dossier with assumption register and decision log | **pass** | dossier §8 (A1–A24); decision log D7–D19 |
| 6 | One methodology file per curve | **pass** (format is JL's choice; markdown beside the cell used) | `methodology/` three files |
| 7 | Uncertainty: bands kept, sensitivity on every assumption, non-propagation stated | **pass, with stated exceptions** | uncertainty file §6; four assumptions have no numeric run (under-designed share, tilt shedding, Risk Category, flags) and say why |
| 8 | No cross-asset proxy | **pass** | validator scans curve records; claim WSS2-C077 |
| 9 | Coverage stated | **pass** | README v0.2 coverage table; artifact `value_coverage_by_failure_unit` (45.7% direct, 58.9% ceiling) |
| 10 | Folder state matches claim | **pass** | proposed/ only, no current/, not indexed, no Hazard pin; renamed model v0.2 / docs r1 on 17 Nov because it changes results (standard 17) |

## B. Promotion gates (unchanged in kind from r1; all still block canonical use)

| Gate | Status | What closes it |
|---|---|---|
| Version label decision | **blocked** | JL: keep model v0.2 or relabel model v0.2 |
| Governing load of the tested racks | **blocked** | NEDO/JPEA reply (draft not sent) |
| Under-designed share and capacity | **blocked** | a population source (unowned) |
| 0.85 lower-edge factor | **blocked** | source or depth + clearance input (SJ) |
| SWE product and snow depth | **blocked** | SJ (draft not sent) |
| IEC 61215-2, IEC 62938, ASCE 7-22 Ch.7/10, ASCE 2025 snow book read | **blocked** | purchase approval (approver not named) |
| Tracker transfer | **blocked** | tracker snow capacity evidence |
| US field / forensic / claims check | **blocked** | any US event with load, design load and damaged share |
| Independent engineering review; Hazard dual-read | **blocked** | reviewer; Hazard |
| Maintainer promotion decision + index/registry/changelog | **blocked** | JL / maintainer |
