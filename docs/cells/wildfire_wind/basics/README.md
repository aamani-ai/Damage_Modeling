# Wildfire × wind — basics

## The short answer

This cell asks how much direct physical repair or replacement an **external wildland fire** causes to an
onshore wind facility. It does not price turbine-origin fires, lightning, PSPS, outage, smoke-related
derating, routine cleaning, or post-fire erosion.

Model v0.1 has no numerical curve. That is intentional: we can identify what must be measured and what may
fail, but public evidence does not yet join local wildfire attack to inspected disposition and same-unit cost.

## Three things that must stay separate

```text
FSim landscape state
  burn probability + conditional flame-length class
       ↓ qualified site/zone bridge (missing)
delivered component load
  thermal flux/contact over time OR firebrand deposition/ingress
       ↓ component/assembly response (missing)
economic physical damage ratio
  same-unit direct repair/replacement cost ÷ same-unit replacement value
```

FSim class is not heat flux. Heat flux is not a damage ratio. A turbine shutdown is not physical damage.

## Why the turbine is one dependent assembly

A fire may scorch a tower-base coating, damage cable penetrations, enter the tower, and ultimately burn
uptower equipment. If each zone carried an independent additive curve, one ignition could charge the same
turbine several times. The candidate `WT_TURBINE_FIRE_ASSEMBLY` therefore owns mutually exclusive/nested
states while retaining rotor, nacelle, and tower zones for demand and inspection.

## Why the GSU is not “just the wind turbine”

The facility GSU is a shared yard with distinct transformer, switchgear/bus, protection/control/DC, and
cable-termination subjects. It has its own geometry, ownership, value, protection, and disposition. The
equipment anatomy may be reused across solar and wind facilities, but the wildfire exposure and release
decision remain cell local.

## Valid model-v0.1 result

```yaml
curve_records: []
canonical_runtime_artifact: false
all_damage_and_loss_metrics: withheld
reason: NO_RUNTIME_CURVE
```

Continue with [how the model is built](HOW_THE_MODEL_IS_BUILT.md) and the [exact model reference](MODEL_REFERENCE.md).
