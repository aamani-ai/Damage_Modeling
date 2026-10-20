---
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: draft
scope: Search log for field-report (occurrence) evidence — Lightning × Battery storage. Not searched yet; this stub fixes the claim boundary and the surfaces so the first search is bounded.
---

# Does it happen? — Lightning × Battery storage

**Question.** Has lightning physically damaged a battery storage subsystem in the field, outside a test?

**State.** `not_searched` for every value bucket — nobody has looked for field reports yet. This is the default, not a finding.

**Claim boundary.** A hit must name the hazard, the equipment class, a comparable installation and physical damage, with a date and a place. A failure with no named cause is adjacent at most. The register's `none_after_search` state needs at least two surfaces below that can see an outside cause.

## Surfaces

| Surface | Can it see this hazard? | Public | Searched | Queries | Hits | Note |
|---|---|---|---|---|---|---|
| EPRI BESS Failure Incident Database | no — excludes outside causes | yes | — | — | — | Excludes exogenous causes by definition (EPRI white paper, May 2024); internal failures only. |
| NOAA Storm Events Database | yes | yes | — | — | — | Narrative keyword search by county and event type. |
| NITE accident reports (Japan) | yes | yes | — | — | — | Statutory reports; CSV download. |
| Insurer and broker loss notes | yes | partly | — | — | — | Gated summaries; cite the note, not the claim. |
| News, OEM and site notices | yes | yes | — | — | — | Date, place, what broke, intensity if stated. |

## Log

*(no searches yet — add one row per pass: date · surface · exact query · cutoff · result)*
