# Tropical-cyclone wind × solar — the physical idea

## What this cell is asking

A hurricane can damage a solar plant in several different ways. This cell asks only about **direct physical
destruction from the tropical-cyclone wind field**:

```text
local TC-wind demand at a specific solar-plant subject
  -> physical damage/repair state
  -> direct repair or replacement cost
  -> divide by that same subject's replacement value
```

It does not calculate outage duration, lost generation, insurance terms, EAL, PML, VaR, or portfolio loss.

## Why one “solar curve” is not enough

Rigid fixed-tilt tables and single-axis trackers do not respond in the same way. Fixed tilt is primarily a
pressure/capacity problem; a tracker can also experience exact-system aeroelastic instability and depends on
attained angle, drive/lock, power, and control state. Modules, attachments, supporting structure,
foundations, collection, a GSU/substation, SCADA, and civil works also have different physical and spatial
grains.

```text
fixed tilt                         tracker
event/design net-pressure ratio    tracker-normal wind / exact-system Ucrit
           |                                  |
module + support states            module + tracker-SBOS states
```

Those are research directions, not active curves in model v0.1.

## What the evidence can and cannot do

Public hurricane studies show that large ground-mounted sites can experience extensive clip/racking/module
damage, visible module loss, and cascades. They also show that installation details and local conditions
matter. However, the reviewed studies do not join all of these at one compatible grain:

```text
local demand + exact architecture/state
  + inspected failure-unit disposition
  + same-unit repair/replacement cost
```

Without that chain, a site failure probability is not an economic damage ratio.

## Current result

```yaml
model: v0.1
docs: r1
canonical_runtime_artifact: false
curve_records: 0
numeric_damage_and_loss: withheld
reason: NO_RUNTIME_CURVE
```

This is deliberate. The cell is structurally complete enough to prevent accidental fallback to a strong-wind
curve or an old hurricane placeholder, while remaining honest about missing calibration.

## Where the GSU/substation belongs

The GSU/substation is a subasset of the solar facility in this portfolio row, but it has its own point/yard
exposure and value. It is represented separately as `PV_GSU_SUBSTATION`.

The same equipment anatomy can be useful in a wind-farm cell. That does not make flood, convective-wind, and
tropical-cyclone numerical response interchangeable. Each hazard × asset cell still owns its local demand,
exposure, value, evidence, curve, and release.

## Read next

- [How the model is built](HOW_THE_MODEL_IS_BUILT.md)
- [Exact model reference](MODEL_REFERENCE.md)
- [Cell package](../README.md)
- [Derivation dossier](../proposed/tropical_cyclone_wind_solar_curve_derivation_dossier__model_v0_1__docs_r1.md)
