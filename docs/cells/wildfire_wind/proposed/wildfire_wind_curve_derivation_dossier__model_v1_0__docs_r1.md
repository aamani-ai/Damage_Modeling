# Derivation dossier — wildfire_wind model v1.0/docs r1

## Model statement

For either supported failure unit `u` and exact class state `s ∈ {0,…,6}`:

```text
DR_u(s) = table_u[s]
```

No physical interpolation is implied. The bundle uses the repository-current piecewise-linear record shape,
but the evaluator rejects noninteger states before lookup.

## Axis

`conditional_flame_length_class_state` is pinned to USFS RDS-2016-0034-3 at 270 m support. State 0 is a
no-event control. States 1–6 mean `<2 ft`, `2–<4 ft`, `4–<6 ft`, `6–<8 ft`, `8–<12 ft`, and `≥12 ft`.
Burn probability is not passed to Damage; it remains a Hazard frequency input.

The axis is a coverage-first screening ordinal. It is not component heat flux, gas temperature, flame-contact
duration, firebrand load, or ignition probability.

## Failure units

`WT_PAD_ELECTRICAL` is one physical turbine/pad electrical unit: its step-up transformer, local switchgear,
enclosure, and local terminations on one same-unit direct-replacement denominator.

`WT_GSU_PROTECTION_CONTROL_DC` is one physical shared protection, relay, control, SCADA, communications,
station-service, and DC package. The main transformer, switchgear/bus, and cable-termination units are not
inside this denominator.

One repeated pad unit is evaluated at its own point or small footprint. The shared GSU package is evaluated
once at its actual footprint, including for a hybrid site. A lease polygon is never treated as a solid
damaged-value footprint.

## Response construction

The owner authorized a two-unit Tier-4 screening model after the evidence-only v0.1 review. The pad profile
is lower than the controls profile because steel exterior construction supplies relative resistance while
polymeric/electronic/cable contents preserve nonzero risk. The GSU controls profile rises more steeply because
fire/heat-damaged electronic, relay, communications, UPS, and cable endpoints are replacement-prone.

Those statements support ordering only. Every ordinate remains `T4_placeholder_or_expert_judgment` and is
linked to assumption `WW1-A001`.

## Value and loss

The curve denominator is the same named failure-unit direct replacement value. The local NREL reference
contains only a mixed 72 USD/kW electrical row, so it cannot value either curve. The evaluator emits DR only.
Scenario dollars, aggregate electrical DR, whole-plant DR, EAL, PML, VaR, and TVaR are withheld.

## Unsupported pathways and units

Firebrand ignition and destructive residue remain separate and have no numerical fallback. Internal turbine
fire and lightning-origin fire are neighboring occurrences. All omitted wind-farm units emit null plus reason
codes; missing coverage never becomes zero.

## Provenance and replacement

The machine artifact, source/claim/tier/value registers, KATs, and workbook carry the exact proposal. The
first qualified local-attack/inspection/cost dataset or structured expert elicitation should replace the
Tier-4 arrays through a new semantic model version.
