---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-11-17
status: proposed
---

# Winter storm × solar

```yaml
cell_id: winter_storm_solar
current: none (no canonical runtime artifact)
proposed: model v0.2 / docs r1 — screening engineering proxy, snow_gravity_load pathway, compliant rack branch only
previous_proposal: model v0.1 / docs r1 (kept unchanged in proposed/)
canonical_runtime_pin: none
calibration: no US calibration
```

This cell governs physical damage to ground-mount solar plants from the weight of snow, with glaze ice as a
separate upper-bound scenario. It is a proposed screening model and is not indexed or released. Start at the
[model v0.2 README](proposed/README_winter_storm_solar__model_v0_2__docs_r1.md); one plain-language file per
curve is in [methodology/](methodology/). It was built as "model v0.1 / docs r2" and renamed model v0.2 / docs r1 on 17 Nov because it changes results
([change classification](proposed/CHANGE_CLASSIFICATION_winter_storm_solar__model_v0_2__docs_r1.md)).
After the split into compliant and under-designed racks, compliant racks fail below their design load 27.7 % of the
time (central) and 9 % (upper); the 46 % SJ quoted came only from the parked 0.56 scenario, which is unused.
A tighter compliant spread is carried as a sensitivity only, not served: over β 0.09 to 0.20 the compliant below-design share is 0.1 % to 8 %, against 27.7 % at the served β 0.47. The low end, 0.09, is a single-member value (steel beam flexural resistance, Bartlett et al. 2003, AISC Engineering Journal 40(1), Table 9; WSS-S042); the high end, 0.20, is a procedural floor (the smallest dispersion the FEMA P-58 fitting procedure allows a component fragility, Cremen & Baker 2019, p. 4; WSS-S043). Neither is a rack measurement.

The docs r1 proposal remains at [README r1](proposed/README_winter_storm_solar__model_v0_1__docs_r1.md) for
comparison. The companion wind cell is [`winter_storm_wind`](../winter_storm_wind/README.md), a fail-closed
scaffold (parked).
