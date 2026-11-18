<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: draft
-->

# Validation report — freeze_pipes_real_estate model v0.1 / docs r1

## 1. Package files

Artifact (60 records: 3 buildings × 4 climate bands × 5 outage bands), capability, known-answer tests, workbook, ordinates,
sensitivity, illustration, four registers, dossier, decision log, search log, three methodology files, claims request log,
chart.

## 2. Validator result (2026-11-17)

`python scripts/reference_helpers/validate_freeze_pipes_real_estate_v0_1_package.py` — **10 / 10 gates pass and the
all-T4 rule holds** (24 / 24 parameters T4); **1,047 / 1,047 known-answer tests** pass through the reference evaluator.

Schema: artifact and capability validate against the bundle-v3 and capability-v3 schemas (0 errors each).

## 3. Hand checks

- DR never exceeds the loss given a burst (house 8 %, office 2 %, warehouse 3 %).
- DR is zero below 77 °C·h; monotone in dose; higher with longer outages; lower in colder climate bands.
- Outage of 10 h in a 100 h spell routes to the 0.25 band; an outage longer than the spell routes to 1.0.

## 4. Not validated here

- No claims comparison (the calibration path; nothing in hand).
- Gordon (1996) not read directly (download blocked); figures via SJ v8.
- No Hazard loader probe (the spell layer does not exist yet).
