<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
-->

# Bounded evidence search log — freeze_pipes_real_estate

## Claim boundary

```text
Within the documented surfaces, queries, endpoint tests, and cutoff, the review did not locate a public damage function
(burst probability or loss ratio versus a cold-spell intensity) for water pipes in buildings, nor county-level claim
counts for Winter Storms Uri, Elliott or Fern.
```

Vendor functions (Verisk, Moody's RMS, KCC) exist but are proprietary; insurer and regulator data may exist that were not
accessible.

## Protocol

```yaml
review_cutoff: 2026-11-17
language_scope: English
access_scope: open web and files on the build machine; no purchases
target_hazard: cold spell (freezing degree-hours)
target_asset: house, warehouse, office (Hazard reference buildings r1)
target_failure_units: water pipes and the water damage after a burst
target_endpoint: P(burst) vs dose; loss given burst as a share of building value
search_surfaces:
  - SJ's recommendations v8 §3.3 and its reference list (searched 2 Nov 2026)
  - review v5 N3, W1, Q8 (9-12 Nov 2026)
  - this build (16 Nov 2026): Gordon 1996 at the Illinois IDEALS repository (download blocked, HTTP 403);
    State Farm newsroom (re-read)
```

## Query families

| Family | Representative terms | Endpoint sought | Result |
|---|---|---|---|
| Physics of pipe freezing | Gordon 1996 freezing bursting pipes; time to ice blockage | dose to blockage | Gordon via SJ (77–84 °C·h); PDF blocked to download |
| Damage functions | burst pipe damage function; freeze vulnerability curve; frozen pipe fragility | P(burst) or loss vs intensity | none public; Koumoutsaris 2019 and Ali 2025 are hazard-only |
| Claim statistics | frozen pipe claims average payment; water damage and freezing severity | severity, frequency | State Farm (> $30,000 average, re-read); ISO via III ($15,400, mixed causes) |
| Event attribution | Uri insured losses freezing pipes; Fern freeze sub-peril | event evidence | TDI (Uri), Verisk and KCC (Fern) — evidence, not curves |
| County counts | TDI statistical plan Uri county claims | calibration | not located; request logged, not sent |

## Inclusion and exclusion

```text
required evidence chain:
source hazard -> local exposure -> matched failure/replacement state -> same-unit economic denominator

included: physics of pipe freezing; insurer claim severities for freeze; event attributions as evidence.
excluded: proprietary vendor functions; flat-threshold rules (20 F) as curves; other assets' cold curves.
```

## Results and disposition

| Evidence link | Located evidence | Missing link | Governed action |
|---|---|---|---|
| hazard → exposure (outdoor air → pipe surroundings) | none quantitative | the building attenuation | T4 climate-relative median |
| exposure → failure (burst) | Gordon freezer dose | field burst rates | T4 dispersion and floor |
| failure → cost | State Farm, ISO severities | structure share; commercial severities | T4 loss given burst |
| calibration | none | county counts | defer; request logged |

## Reproducibility and update triggers

Source IDs and locators are in the source register. Re-run when county claims, Gordon's report, or a published freeze
damage function becomes available.
