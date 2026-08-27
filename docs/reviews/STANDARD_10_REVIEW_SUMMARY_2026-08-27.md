# Standard 10 Review — Cross-Cell Summary

**Date:** 2026-08-27 · **Scope:** 10 hazard × asset cells in `docs/cells/` · **Standard:** `docs/method/standards/10_review_checklist.md` (sections 1–9, §10 readiness, §11 reviewer questions)
**Companion:** per-cell scorecards in `STANDARD_10_REVIEW_SCORECARDS_2026-08-27.md`

This was a judgment pass on curation logic and transparency — grain, x-axis, curve-form argument, withholding honesty, value linkage, metrics contract. Per-number sourcing is the parameter checker's scope and was not re-audited.

## FLAG matrix (cells × Standard 10 sections)

Counts are FLAGs only (PASS and N-A not shown). §1 Package · §2 Coverage · §3 X-axis · §4 Derivation · §5 Selectors · §6 Value · §7 Interface · §8 Metrics honesty · §9 Artifact QA.

| Cell | §1 | §2 | §3 | §4 | §5 | §6 | §7 | §8 | §9 | Total | Readiness |
|---|---|---|---|---|---|---|---|---|---|---|---|
| hail_solar (v1.0/r7) | – | – | – | – | – | – | – | – | 1 | 1 | SITE-ADAPTABLE |
| flood_solar (v1.0/r4) | – | – | – | – | – | – | – | – | – | 0 | SITE-ADAPTABLE |
| wildfire_solar (v1.0/r3) | 1 | – | – | 2 | – | – | – | – | – | 3 | SITE-ADAPTABLE |
| strong_wind_solar (v1.0/r3) | – | – | 1 | – | 1 | 1 | – | – | 1 | 4 | SITE-ADAPTABLE |
| wind_tornado_wind (v1.0/r4) | – | – | – | 1 | – | – | – | – | 1 | 2 | SITE-ADAPTABLE |
| flood_wind (v1.0/r1) | 1 | – | – | – | – | – | 1 | – | – | 2 | SITE-ADAPTABLE |
| wildfire_wind (v1.0/r1) | – | – | – | – | – | – | – | – | – | 0 | REVIEWABLE |
| tropical_cyclone_wind_wind (v1.2/r2) | 2 | – | – | 1 | – | – | – | – | 1 | 4 | SITE-ADAPTABLE |
| tropical_cyclone_wind_solar (proposed v2.1/r1) | – | – | – | – | – | – | – | – | 1 | 1 | SITE-ADAPTABLE (non-canonical proposal)* |
| hail_wind (proposed v0.1/r2) | – | – | – | – | 1 | – | – | 1 | – | 2 | DRAFT |

*tropical_cyclone_wind_solar meets SITE-ADAPTABLE mechanics (implemented selectors/conditioners/exposure, working evaluator, passing KATs) but remains an unreleased proposal: `canonical_runtime_artifact: false`, promotion gates G05–G11 blocked, 82 of 93 parameters T4. Treat the status as "SITE-ADAPTABLE capability at DRAFT governance."

No cell reached CALIBRATED, and none claims to — every cell explicitly self-labels as not field/claims calibrated. That honesty is a repo-wide strength.

## Top structural issues, ranked by how many cells share them

**1. Parameter-tier-table structural drift (5 cells: hail_solar, wildfire_solar, wind_tornado_wind, tropical_cyclone_wind_wind, tropical_cyclone_wind_solar).** The tier table is the checklist's central provenance instrument, and it is the single most-repeated failure point — never for weak sourcing, always for shape/coverage drift. hail_solar's unstowed `max_DR=1.0` has no tier row; wildfire_solar's table lacks `param_role` and inline values; wind_tornado_wind's load-bearing value shares (0.173/0.169/0.345/…) sit outside the table; tropical_cyclone_wind_wind's v1.2 CSV dropped the source/role columns and per-archetype rows its v1.0 table carried; tropical_cyclone_wind_solar's v2.1 artifact embeds a stale verbatim-v2.0 table (5 rows, "scenario loss: withheld") contradicting its own `value_linkage` — verified directly. Recommended fix: a repo-level tier-table schema check (columns + every evaluation-contract parameter present + embedded copy equals CSV) run at release.

**2. Companion-artifact staleness after promotion or revision (5 cells: wildfire_solar, flood_wind, tropical_cyclone_wind_wind, wildfire_wind, tropical_cyclone_wind_solar).** The JSON artifacts are current; the surrounding package lags. Stale/missing previews (wildfire_solar has only v0.1 PNGs, flood_wind and tc_wind_wind none); flood_wind's governing spec still says every result carries `NONCANONICAL_PROPOSAL` despite canonical release (verified — 1 live occurrence); tc_wind_wind never revved its metadata spec past v1.0; wildfire_wind's reference helper emits a `capability_declaration_ref` pointing at `proposed/`; tc_wind_solar's governance docs (gate matrix, pressure test, sheet manifest) stop at v2.0. Recommended fix: a promotion checklist step that sweeps companion files for proposal-era pointers and re-renders previews.

**3. Missing machine verification in canonical packages (3 cells: strong_wind_solar FLAG; flood_solar and wind_tornado_wind noted-as-PASS gaps).** strong_wind_solar ships no KAT file or helper at all (verified: none in `current/`); flood_solar's KAT gap is self-declared and its runtime notebook references removed docs-r3 paths; wind_tornado_wind relies on the shared helper with no cell-local KATs. The newer bundle-v3 cells (flood_wind, wildfire_wind, tc_wind_wind, both proposals) all ship KATs — the gap is a generation marker of the older v2 releases.

**4. Older-generation v1 gaps fixed only in non-canonical proposals (1 cell, structurally important: strong_wind_solar).** The height/terrain bridge is named but not implemented or fail-closed, and unknown-selector behavior is principled but not operationalized — both closed in the pending, explicitly non-canonical v2.0 proposal. Until promotion, the canonical cell carries the weakest x-axis discipline in the repo (contrast wind_tornado_wind's exemplary implemented-and-flagged bridge).

**5. Vocabulary and schema-version drift across cell generations (hail_wind FLAG; several noted).** Capability declarations span v1 (hail_wind, undocumented why), v2 (solar cells), v3 (newer wind cells) — the checklist itself still says "v2." hail_wind uses `mesh_mm` where std 07's canonical example is `mesh_diameter_mm`, with no alias record; strong_wind_solar dropped the `f_kind` label between v0.1 and v1.0 with no alias note. Cheap fixes, and Standard 10 §8.1's wording should be updated to "v2 or later."

## What consistently passed

Coverage & granularity (§2) and metrics honesty (§8) are near-uniformly clean: withheld-not-zero discipline with per-unit reason codes (flood_wind's 14 withheld units, wildfire_wind's 10, hail_wind's total withhold), no false spread claims anywhere, and the r7/r3/r4-era correction from blanket PML/VaR/TVaR withholding to "consumer-computable from a validated annual loss distribution" is exactly Standard 10 §8's intended nuance. The tropical_cyclone_wind_wind v1.1→v1.2 scope correction (fix the failure unit/denominator, not the curve) and hail_wind's refusal to ship any curve rather than relabel mismatched evidence are model-curation exemplars.
