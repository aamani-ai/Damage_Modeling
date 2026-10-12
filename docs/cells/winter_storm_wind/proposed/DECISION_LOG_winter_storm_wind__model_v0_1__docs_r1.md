---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_wind — decision log (model v0.1 / docs r1)

All decisions below are JL's, recorded as proposed with reasons.

| # | Date | Checkpoint | Decision | Reason |
|---|---|---|---|---|
| D1 | 2026-10-12 | 1 | One cell per asset with winter mechanisms as separate `pathway_id`s | Standard 18 |
| D2 | 2026-10-12 | 1 | Wind v0.1 primary pathway: ice accretion; axis radial ice thickness (mm, ASCE 7 convention); concurrent gust captured; ice + wind deferred | Turbine-relevant winter mechanism; design-governing combined case needs evidence first |
| D3 | 2026-10-12 | 1 | Propose winter storm = snow + ice with physical outputs to the hazard modeller; cold to the cold-wave grid | Feeds the ice pathway; cold is business interruption for wind farms |
| D4 | 2026-10-12 | 2 | Fail-closed scaffold: no numbers in v0.1 | No located evidence links ice thickness to repair cost; legacy curves rejected |
| D5 | 2026-10-12 | 2 | Turbine equipment under ice load is "withheld (evidence lacking)", not "reviewed near zero" | Absence of damage reports is bounded evidence, not proof of zero |
| D6 | 2026-10-12 | 2 | Overhead-line curve not added in v0.1; Québec 1998 anchor documented as the first candidate | Reference farm assumes buried collection; value row unsplit |
