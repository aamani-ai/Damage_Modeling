<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: draft
-->

# Validation report — snow_load_real_estate model v0.1 / docs r1

## Summary

**The serviceability (span/240) threshold fails out of sample at Telluride: 0 of 2 signs right** (office joist roof U3:
computed −0.67 against the paper's +0.03; warehouse beam roof WU3: −2.10 against +0.29). It is fitted to the basic
Boulder building and gets Lamar's sign right (2 of 2), so it is unreliable at high design snow loads. The sag state is
therefore kept as an unpriced state (loss 0) and flagged `SERVICEABILITY_FIT_FAILS_HIGH_DESIGN_LOAD_SITE`.

Everything else passes: 10 of 10 brief gates; 942 of 942 known-answer tests (re-run after the 17 Nov loss-share
re-derivation); 16 of 16 house reproduction rows; 6 of 6
commercial safety indices within 0.2; bundle-v3 and capability-v3 schemas. 98 records.

## 1. Package files

Artifact (98 records: 2 house, 48 office, 48 warehouse; identical design bands merged), capability, known-answer
tests, workbook, ordinates, state probabilities, reproduction check, sensitivity, four registers, dossier, decision
log, search log, three methodology files, chart. The grid-input request letter is kept outside the repository.

## 2. Validator result (2026-11-17)

`python scripts/reference_helpers/validate_snow_load_real_estate_v0_1_package.py` — **10 / 10 gates pass**, including
**942 / 942 known-answer tests** run through the reference evaluator (the count fell from 1,130 because 48 duplicate
records were merged; tests now also check that any design load inside a merged band routes to the merged record). Gate 10
now also checks that no request letter sits in `docs/cells/`.

Schema: the artifact validates against `curve_artifact_bundle.v3.schema.json` and the capability against
`capability_declaration.v3.schema.json` (0 errors each; jsonschema 3.2, Draft-7 validator with a local `$ref` store).

## 3. Reproduction of the sources

| Check | Result |
|---|---|
| Kozak & Liel serviceability index, out of sample | **Telluride: sign wrong (0 / 2)**; Lamar: sign right (2 / 2); U and WU are the calibration targets |
| Li & van de Lindt Table 4 annual probabilities (Yakima, Fargo; R1, R2; 4 states) | 16 / 16 match (exact closed form at the printed precision, or within 6 %) |
| Kozak & Liel 50-year safety index, U, U1, U3, WU, WU1, WU3 | 6 / 6 within 0.2 (largest gap U3: 2.71 vs 2.85) |
| SJ's span/240 count (8 of 10) | re-checked from Tables 6–7: holds |
| Strobel & Liel loss shares (re-derived 17 Nov) | upper-band midpoint $969 and lowest-band midpoint $27.5 × Turner factor 1.8586 over $3,154 and $1,636 per m²: office 0.571 / 0.0162; warehouse 1.10 capped at 1.0 / 0.0312 (checked in the derivation script) |

## 4. Hand checks

- 100 mm SWE → 0.980665 kPa (KAT `SWE_100MM_BRIDGE_HOUSE`).
- Merged bands: ASCE 7-22 office and warehouse records cover 0–50 psf, ASCE 7-10 records 0–30 psf; values equal the
  former per-band records.
- With loss 0 on the sag state, the fitted serviceability threshold no longer changes any DR (κ_serv ±20 % rows equal
  the central row).

## 5. Not validated here

- No US claims or forensic comparison (none in hand). Strobel & Liel is a 40-building survey, used as a loss source,
  not as a validation of the fragility.
- ASCE 7-22 text; the NSLS model's primary text (formula from two transcriptions).
- Hazard loader probe (no Hazard checkout used; the design-load layer does not exist yet).
- Repository-wide `validate_runtime_contracts.py`: run on the branch, see the commit message notes.
