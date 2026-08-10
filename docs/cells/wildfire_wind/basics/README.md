# Wildfire × wind — basics

## The short answer

This cell asks how much direct physical repair or replacement an **external wildland fire** causes to an
onshore wind facility. It does not price turbine-origin fires, lightning, PSPS, outage, smoke-related
derating, routine cleaning, or post-fire erosion.

The current model-v1 release carries two deliberately partial Tier-4 screening curves: turbine/pad
electrical and the shared GSU protection-control-DC package. Public evidence supports nonzero vulnerability
and the relative ordering, but it still does not join local wildfire attack to inspected disposition and
same-unit cost. Model v0.1 therefore remains preserved as the strict zero-curve alternative.

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

## Valid current-screening result

```yaml
curve_records: 2
supported_units:
  - WT_PAD_ELECTRICAL
  - WT_GSU_PROTECTION_CONTROL_DC
axis: exact FSim conditional flame-length class state 0..6
output: conditional same-unit screening DR
whole_farm_DR: withheld
scenario_loss: withheld
canonical_runtime_artifact: true
```

Every other failure unit remains withheld-not-zero. Model v0.1 continues to provide the stricter result:

```yaml
curve_records: []
canonical_runtime_artifact: true
all_damage_and_loss_metrics: withheld
reason: NO_RUNTIME_CURVE
```

Continue with [how the model is built](HOW_THE_MODEL_IS_BUILT.md) and the [exact model reference](MODEL_REFERENCE.md).
