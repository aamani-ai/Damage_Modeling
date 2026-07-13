# strong_wind_solar model v2.0 convective migration proposal

> Shadow/research contract only. Current runtime remains
> `strong_wind_solar@model_v1_0__docs_r3` with artifact SHA
> `832f47d69372ec54723a61b8a956addccef07bb39338c3ec99907e116f1855ca`.

## Consumer-facing changes

1. Require exact `pathway_id=straight_line_convective`; reject TC/tornado/synoptic fallback.
2. Require exact fixed-tilt or qualified single-axis-tracker architecture.
3. Produce a qualified fixed event/design net-pressure-demand ratio or exact-system tracker `Vnormal/Ucrit`.
4. Preserve named profile/aerodynamic/aeroelastic bridge identity and tracker 1P/2P/attained state.
5. Carry two active failure-unit state ensembles, not one whole-asset scalar.
6. Preserve DS2-salvage/DS3-destructive states, the central T4 module-salvage rule, and both salvage bounds.
7. Supply explicit failure-unit values and local array-zone exposure for loss.
8. Keep foundation/electrical/SCADA/civil null and replacement support outside intrinsic DR.
9. Pin model/docs/schema/SHA exactly after, and only after, promotion.

## Shadow tests required before cutover

- exact fixture replay for all runtime and rejection KATs;
- local convective event/parent-event partition and derecho embedded-mechanism tests;
- fixed direct-pressure and speed-proxy bridge tests;
- tracker Ucrit/qualification/1P/2P/0.75-action-flag tests;
- cross-architecture and neighboring-hazard negative tests;
- module/structure bounded cascade/salvage and no-double-charge tests;
- site value/exposure and withheld-unit tests;
- v1 versus v2 dual-read on explicitly different denominators;
- current v1 rollback pin and removal of any downstream hardcoded curve copy.

No runtime integration or promotion is performed by this research package.
