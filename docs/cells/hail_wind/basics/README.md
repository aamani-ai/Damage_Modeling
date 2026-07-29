# Hail × wind — first-reader basics

## What is being modeled?

This cell asks one narrow question:

> Given that hail physically reaches a named wind-facility subject, what fraction of that same subject's
> direct replacement value is destroyed or must be repaired?

It does not calculate how frequently hail occurs, whether a storm footprint hits the facility, business
interruption, energy-production degradation, or insurance recovery. Those are separate stages.

## Physical picture

```text
hail field (size distribution, wind, timing)
                 │
                 ▼
       turbine rotor at event state
     ┌─────────────────────────────┐
     │ blade velocity + pitch      │
     │ azimuth + parked/operating  │
     │ material + LEP condition    │
     └──────────────┬──────────────┘
                    ▼
      contact speed / angle / energy
                    ▼
    inspect → no action / coating repair /
       structural repair / blade replace
                    ▼
       same-blade direct cost ratio
```

A hailstone's reported diameter is not enough to determine blade damage. The blade may be moving much
faster than the falling stone, and the relative velocity and contact angle vary along the blade and through
the rotor's motion.

## Current model state

```text
source-native hail observation     AVAILABLE
mechanism / candidate demand       PARTIAL
blade-specific impact bridge       WITHHELD
inspected all-severity states       WITHHELD
same-blade direct cost mapping      WITHHELD
runtime curve                       NONE
```

Therefore model v0.1 returns no numeric DR or loss. `NO_RUNTIME_CURVE` is the designed outcome.

The docs-r2 deep-curation pass reached the same strict result after adding coated-GFRP threshold tests, a
bounded operational non-damage observation, a 2024 stress/strain simulation, the developing ISO hail-test
procedure, and FM post-hail inspection guidance. Those sources improve test and data-collection design; none
supplies occurrence state probabilities or same-blade repair/replacement cost.

## Natural failure unit

The primary candidate is `WT_BLADE_ASSEMBLY`, including the leading-edge protection/coating and structural
blade. The states must be mutually exclusive or nested so the same material is not charged as both a
surface repair and full replacement.

Balance-of-plant subjects remain explicit but withheld. A substation is a point/yard subject; collection is
a line/network subject; turbines are repeated point/rotor subjects. A lease polygon is not damageable
hardware.

## Worked fail-closed example

Assume a consumer supplies:

```yaml
pathway_id: hail_impact
maximum_reported_hail_diameter_mm: 50
turbine_make_model: verified
blade_model: verified
operating_state: operating
rotor_speed_rpm: measured
turbine_point_intersects_hail_footprint: true
blade_value_usd: supplied
```

Those fields can establish event identity and a research-state record, but they do not provide a qualified
blade contact-demand bridge or an inspected state/cost curve. The correct output is:

```yaml
failure_unit_scalar_dr: null
scenario_loss: null
status: withheld
reason: NO_RUNTIME_CURVE
```

No arithmetic on the supplied value is permitted.

## Terminology

| Term | Meaning here |
|---|---|
| Hail diameter | Source-native observed or radar-estimated stone size descriptor |
| MESH | MRMS Maximum Estimated Size of Hail product; not automatically blade demand |
| Contact-normal energy | Candidate local impact quantity after trajectory, blade motion, and angle are resolved |
| LEP | Leading-edge protection system/coating |
| Selector | Fixed blade/turbine identity or construction state |
| Conditioner | Event-time operating, pitch, azimuth, or control state |
| Exposure | Which physical subject and value were actually intersected/touched |
| DR | Same-unit direct repair/replacement cost ratio, not downtime or AEP loss |

## Common mistakes

- Applying the solar-module hail curve to blades because both use hail diameter.
- Treating the wind-farm lease polygon as fully damaged value.
- Treating long-term coating-life research as a single-event economic DR curve.
- Adding coating repair and full blade replacement for one terminal state.
- Giving an unknown shutdown/parked state resilience credit.
- Treating the NREL blade cost share as a hail loss cap.

## Fail-closed checklist

```text
[ ] exact pathway_id = hail_impact
[ ] event_family_id preserves compound-storm identity
[ ] actual turbine/BOP subject geometry is known
[ ] source hail field and uncertainty are known
[ ] blade/turbine identity and event state are verified
[ ] qualified contact-demand bridge exists
[ ] disposition and same-unit cost curve exists
[ ] exact runtime artifact pin is canonical
```

Model v0.1 intentionally fails the final three checks.

## Reusable short explanation

Hail × wind is structurally governed but not numerically released. Public research shows that hail can
contribute to blade leading-edge damage and that rotor motion, hail size distribution, and wind control the
impact demand. It does not yet provide an occurrence-level, blade-specific, disposition-to-direct-cost
curve. InfraSure therefore records the evidence and interface and emits no number.

Continue with [how the model is built](HOW_THE_MODEL_IS_BUILT.md) and the [exact model reference](MODEL_REFERENCE.md).
