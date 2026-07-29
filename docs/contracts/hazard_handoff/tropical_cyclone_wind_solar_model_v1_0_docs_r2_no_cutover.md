# Tropical-cyclone wind x solar model v1.0/docs r2 - Hazard no-cutover handoff

## Consumer instruction

```yaml
consumer_cutover: prohibited
canonical_pin: none
runtime_proposal_revision: docs r1
human_evidence_revision: docs r2
ordinary_Hazard_3s_gust_compatible: false
generic_fixed_tilt_compatible: false
tracker_compatible: false
tail_above_39_1_mps_compatible: false
scenario_loss_compatible: false
strict_execution_alternative: model v0.1 / NO_RUNTIME_CURVE
```

Docs r2 does not authorize Hazard to load the noncanonical Perry curve. The existing docs-r1 proposal remains
available only for an explicit research call that already supplies the exact Perry dataset-reported event
maximum-gust field and all six source/assumption acknowledgements.

This addendum supersedes the older handoff's human statement that the provider itself was unresolved and any
reading of “equal-site weighted” that implies 34 unique or independent sites. The fit is equal-record
weighted and predictively unvalidated. This addendum does not supersede or modify the docs-r1 artifact,
selector, limitation flag, evaluator, or no-cutover rule.

## Required rejection behavior

Hazard must not:

- pass its ordinary modeled 3-second gust into `perry_event_max_gust_mps`;
- derive that field through an identity map, constant gust factor, category lookup, or new vendor query;
- select the curve for a generic fixed-tilt facility, tracker, rack, foundation, inverter, collection, GSU,
  SCADA, civil, support, or whole plant;
- clamp or extrapolate above 39.1 m/s, including at the 48.2 m/s audit observation;
- bind module, plant, or portfolio value to obtain dollars;
- use the proposal for EAL, PML, VaR, TVaR, or annual/tail loss; or
- fall back to strong-wind, legacy hurricane-solar, flood, v0.1, or another unit's curve for a rejected call.

## Why the provider clarification changes no adapter

Perry identifies Visual Crossing API at the study level. The released rows do not carry the contributing
station/product, query settings, duration, height/exposure, retrieval version, time of maximum, or uncertainty
needed to reproduce the original field or bridge it to Hazard's modeled 3-second gust. The source-product and
query-semantics limitation therefore remains load bearing.

## Future adapter gate

A future portable adapter requires:

1. a versioned local wind object and uncertainty;
2. reviewed fixed and tracker demand routes with attained-state handling;
3. architecture-resolved response and same-unit economic consequence;
4. event-held-out validation and a supported severe domain;
5. complete failure-unit, exposure, value, support, and compound-event rules;
6. new artifact/capability/KAT/schema/full-SHA pins; and
7. shadow, negative-fallback, rollback, and explicit promotion approval.

Until then, the [model-v0.1 boundary](tropical_cyclone_wind_solar_model_v0_1_boundary.md) remains the
operational fail-closed rule.
