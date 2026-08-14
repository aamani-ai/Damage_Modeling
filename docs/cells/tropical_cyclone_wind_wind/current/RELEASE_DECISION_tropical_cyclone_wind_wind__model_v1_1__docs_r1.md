# Release decision — tropical-cyclone wind × Wind Farm model v1.1/docs r1

Decision date: 2026-08-14  
Decision: **release the exact owner-approved canonical-Wind-Farm partial-screening proxy**

## Why this is model v1.1

An identical canonical 5 MW request changes from rejected in v1.0 to conditionally supported in v1.1. That
is a semantic model change. The source axis, equation and all three existing Jaimes records remain unchanged.

## Exact decision

- use the Jaimes 3.3 MW / 100 m / 114 m numerical record for the canonical 5 MW / 100 m target only when all
  named proxy identities match;
- apply no `5/3.3` or other capacity-ratio adjustment;
- cover rotor+nacelle+tower only: 0.63 of project TIV;
- withhold the remaining 0.37 rather than reporting it as zero damage;
- assign a flagged zero only in the proxy's 90–108 km/h completion band;
- cap the proxy at `max_dr=1` above 252 km/h with an explicit flag; and
- retain model-v1.0 selector and out-of-range behavior exactly.

## Evidence that closed promotion

| Gate | Result |
|---|---:|
| model-v1.0 reproduction | 24 / 24 pass |
| proxy known answers | 9 / 9 pass |
| negative request-contract tests | 4 / 4 pass |
| value/cap tests | 2 / 2 pass |
| Hurricane M2 population | 1,773 active cells · 113,526 events · 20 nodes |
| Hurricane M2 decision | node-aware field selected; M1 centroid reproduces with 0.0 mph max error |
| Hurricane M2–M4 recipient | 13,085 / 13,085 rows pass; 0 QA failures |
| occurrence cap | max loss = `$88.2M` covered value |

The owner approved this limited screen for Version-1 use while target-matched modern 5 MW evidence remains a
replacement trigger. The release does not claim field, claims, bankability, full-plant coverage or generic
modern-turbine transfer.

## Migration and rollback

```yaml
prior_pin: tropical_cyclone_wind_wind@model_v1_0__docs_r1
new_pin: tropical_cyclone_wind_wind@model_v1_1__docs_r1
cutover: exact model/docs/schema/SHA plus proxy, asset-profile and value-basis identities
rollback: disable the v1.1 consumer pin and withhold; v1.0 is an offline archive, not a registered GCS pin
never_do: load archive bytes directly, invent a v1.0 registry row, rewrite v1.1, or silently select a nearest turbine curve
```
