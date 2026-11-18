---
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: proposed
---

# winter_storm_solar — decision log (model v0.2 / docs r1)

D1–D6 (docs r1, 2026-10-12) stand except where a row below replaces them; see the
[r1 log](DECISION_LOG_winter_storm_solar__model_v0_1__docs_r1.md). The v0.2 decisions implement the owner build
brief of 2026-11-16 (§1.3, §3, §4 item 4), which records the accept / partly-accept verdicts of review v5 W3 on
SJ's eight objections. None has been reviewed by SJ, CF or DP yet. Sharing is JL's call.

| # | Date | Decision | Replaces | Reason / source |
|---|---|---|---|---|
| D7 | 2026-11-17 | Relabel the seven rack tests: six wind downforce design-pressure tests + one snow design test; test ratio 1.88 and spread 0.47 graded T4 | r1 grading T2 | annex D is a wind-resistance test (WSS-S022 pp. D-1, D-3); brief row 1 |
| D8 | 2026-11-17 | Draft (not send) a question to NEDO and JPEA on which load governed each rack | — | brief row 1; nothing leaves the machine in this revision |
| D9 | 2026-11-17 | Record SJ's possible derivation 1.8 ≈ 1.6 × 1.12 as unverified; park ×0.56 in the under-designed branch | D6 (three scenarios) | brief row 2 |
| D10 | 2026-11-17 | Keep 0.47; print the 95% interval from the unrounded spread (0.307 to 1.050) | — | brief row 3; v5's printed interval re-checked (see dossier §3) |
| D11 | 2026-11-17 | Split racks into compliant / under-designed; under-designed share is an input with no default; curve runs on the compliant branch only and says so | r1 claim WSS-C015 (deficiency inside the spread) | brief row 4; NITE shows existence, not size |
| D12 | 2026-11-17 | Exposed fraction: default 1.0 for screening, selector by NITE plant size class; NITE shares are a calibration target | r1 "no default exposed fraction" | brief row 5; v5 Q6 |
| D13 | 2026-11-17 | Module breakage conditional on rack survival; module curve split by mounting; fixed-tilt anchor IEC 61215 MQT 16 (unchecked, T4); northern flag at ≥ 5% breakage at design (T4) | r1 single module curve and cascade rule | brief row 6; v5 Q7 |
| D14 | 2026-11-17 | Clearance-versus-depth flag beside SWE; 0.85 kept interim, flagged unsourced; grid request for depth and clearance drafted (not sent) | — | brief row 7 |
| D15 | 2026-11-17 | State "no US calibration" in the cell | — | brief row 8 |
| D16 | 2026-11-17 | Glaze: separate flagged upper bound, never summed with SWE; ASCE 7-10 §10.4.1 flat-plate rule with plate factors 0.6 and 0.8, no midpoint; applied as a plate load on the array | D3 (glaze folded into the snow load) | brief glaze row; v5 Q4; WSS-S037 |
| D17 | 2026-11-17 | Risk Category I is the screening default for racks; override where known | r1 "capture only" | brief §1.3 intro; v5 Q3 |
| D18 | 2026-11-17 | **JL decided:** rename the revision from the brief's working label "model v0.1 / docs r2" to **model v0.2 / docs r1**, because it changes results (standard 17) | keep the docs-r2 label | [CHANGE_CLASSIFICATION model v0.2](CHANGE_CLASSIFICATION_winter_storm_solar__model_v0_2__docs_r1.md) |
| D19 | 2026-11-17 | New v0.2-only builder, evaluator and validator; r1 files and the parked `winter_storm_wind` files untouched | — | the shared r1 builder also writes wind files |

## Owner decisions still open

1. Version label: decided 17 Nov, model v0.2 / docs r1 (D18).
2. Whether to send the NEDO/JPEA query and the SJ grid-input request (drafts only).
3. Who approves purchase of IEC 61215-2, IEC 62938, ASCE 7-22 and the ASCE 2025 ground-mount snow book (none bought).
4. Whether the parked under-designed branch should ever run before a share source exists.
