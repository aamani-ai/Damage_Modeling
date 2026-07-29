# Decision log — tropical_cyclone_wind_wind model v0.1

## D-TCWW-01 — create a separate tropical-cyclone cell

```yaml
date: 2026-07-28
decision: Create tropical_cyclone_wind_wind with pathway_id tropical_cyclone_wind.
reason: Duration, veer, turbulence, control state, and bridge requirements differ materially from convective and tornado pathways.
alternative_rejected: Reuse wind_tornado_wind because both consume wind speed.
```

## D-TCWW-02 — reuse anatomy and value, not numeric fragility

Reuse the onshore turbine-equipment assembly, separate external-unit topology, NREL reference ledger, and
per-turbine exposure discipline. Re-earn all curve forms, state probabilities, state consequences, axes,
bridges, conditioner effects, and support rules.

## D-TCWW-03 — keep the axis provisional

NHC one-minute 10 m wind is preserved as a source-native upstream field. A runtime curve input must instead be
the output of a named tropical-cyclone bridge carrying height, averaging period, terrain/topography, gust,
duration, direction, turbulence, and uncertainty. No global `alpha=0.077`, `1.10`, or `1.20` conversion is
adopted.

## D-TCWW-04 — use one dependency-safe turbine-equipment atom

`WT_TURBINE_EQUIPMENT_ASSEMBLY` is the primary candidate failure unit because tower collapse, blade loss,
nacelle damage, and control failures can be dependent. A future model should use mutually exclusive states or
another precedence-safe construction; independent blade+tower+nacelle curves must not double count a terminal
failure.

## D-TCWW-05 — retain Jaimes DS3 only as a candidate fragility

The reproduced Jaimes DS3 parameters describe tower-wall buckling/collapse probability for three exact generic
fixed-base tower models on a 3-second 10 m gust axis. They may support future exact-archetype structural
screening. They do not supply all-severity economic DR, modern-fleet transfer, blade/nacelle/foundation
response, or a general operating-state adjustment.

## D-TCWW-06 — do not convert Rose tower buckling into economic DR

Rose's active-yaw and perpendicular non-yaw curves remain on their native 10-minute hub-height, knot axis.
They are useful for control-state sensitivity and validation but do not calibrate a generic onshore turbine,
other components, or same-unit repair cost.

## D-TCWW-07 — fail closed at model v0.1

```yaml
curve_records: []
failure_unit_scalar_dr: withheld
scenario_loss: withheld
scalar_eal: withheld
pml_var_tvar: withheld
reason: NO_RUNTIME_CURVE
```

The alternative—publishing a smooth curve with assumed state costs—would create precision without closing
the evidence chain. A future screening v1.0 remains possible after explicit approval of its Tier-4 economic
bridge and narrow applicability domain.

## D-TCWW-08 — preserve compound-event identity

Every future emit requires `event_id`, `event_family_id`, and exact `pathway_id`. TC-spawned tornado, surge,
pluvial rain, and other child pathways retain the parent family identity. The consumer prevents duplicate
failure-unit/value charges and must not sum the hurricane-inclusive coastal ASCE strong-wind result with this
future TC pathway.
