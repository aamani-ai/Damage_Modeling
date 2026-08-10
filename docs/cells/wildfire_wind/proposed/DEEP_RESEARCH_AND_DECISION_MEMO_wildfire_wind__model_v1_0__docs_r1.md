# Deep research and decision memo — wildfire_wind model v1.0/docs r1

## Answer first

A partial wildfire-wind risk model is logically meaningful if it is reported at the **failure-unit level**.
It is not meaningful to relabel those two units as a whole-wind-farm curve.

The strongest first pair is:

| Failure unit | Why it is admitted | Why it is still only Tier 4 |
|---|---|---|
| `WT_PAD_ELECTRICAL` | Ground-adjacent electrical apparatus can receive external thermal attack; steel enclosure lowers but does not eliminate risk to polymeric, cable, seal, auxiliary, and internal content | No matched FSim class → local pad attack → inspected disposition → same-unit direct-cost dataset |
| `WT_GSU_PROTECTION_CONTROL_DC` | Substation research identifies polymeric components as vulnerable; NEMA guidance makes fire/heat-damaged relays, meters, communications, UPS, wire, and cable replacement-prone endpoints | The evidence supports mechanism and disposition, not pre-event probability or the chosen FSim-class DR ordinates |

The elevated turbine assembly, collection network, main transformer, switchgear/bus, cable terminations,
control/met/O&M, foundation, and civil units remain withheld-not-zero.

## What the deep review added

### Substation attack evidence

Severino et al. (2024) model an external wildfire reaching an operating electrical substation. They identify
transformers, structures, cables, isolators, switches, and other apparatus as targets and use a PMMA proxy
to model polymeric-material ignition under local radiant heat. Their case demonstrates a steep, nonlinear
relationship between **local** heat flux and ignition probability. It does not provide wind-farm economic
damage ratios, and its site frequency stays in Hazard.

That source is valuable as a pressure test: a model that assigns exact zero to polymeric/electrical contents
under severe local attack is physically implausible. It cannot be used to convert a 270 m FSim flame-length
class into a component heat flux.

### Disposition evidence

NEMA GD 2-2016 distinguishes equipment that may be evaluated or reconditioned from equipment whose fire- or
heat-damaged state generally points toward replacement. The latter includes electronic/digital protective
devices, communications systems, UPS equipment, and wire/cable. This supports a high-severity replacement
endpoint for the GSU protection-control-DC package. It still does not calibrate the probability of reaching
that endpoint from wildfire exposure.

### Negative and ordering evidence

The USFS preliminary study of power infrastructure found steel towers and steel transformer/junction
enclosures comparatively resistant in its simulations. That evidence argues against a copied high curve for
every electrical item; it supports placing common steel-enclosed pad apparatus below exposed or internally
vulnerable controls/electronics. It does not prove immunity or zero damage.

### Blade evidence

Wind-blade cone-calorimeter research establishes that common E-glass/unsaturated-polyester specimens can
ignite under sustained radiant flux. That is mechanism evidence, not a full-blade disposition or economic
curve. The blade/turbine assembly therefore stays outside this first numerical proposal.

## Numerical decision

The exact state tables are:

| FSim screening state | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---:|---:|---:|---:|---:|---:|---:|
| `WT_PAD_ELECTRICAL` DR | 0 | 0.001 | 0.006 | 0.03 | 0.12 | 0.35 | 0.70 |
| `WT_GSU_PROTECTION_CONTROL_DC` DR | 0 | 0.004 | 0.02 | 0.08 | 0.25 | 0.60 | 0.90 |

State 0 is a damage-code no-event control, not an FSim conditional class. States 1–6 preserve the exact
source-native class bins. Noninteger, unknown, and out-of-range values reject; the evaluator does not invent
interpolation between categories.

These arrays are Tier-4 assumptions. They are numerically identical to the neighboring wildfire-solar MV
equipment and SCADA profiles, but that identity is recorded only as an audit fingerprint. The solar package
is not scientific evidence, a runtime dependency, or a fallback. The wind cell independently owns the
assumption set, unit definitions, guards, version, tests, and future replacement.

## Why this is useful

For a valid FSim class and exact unit, the proposal returns a transparent conditional screening DR. That is
enough to compare which wind-farm electrical subjects deserve engineering review and to exercise the
Damage→Hazard interface. It is not enough to report total plant loss because the NREL 72 USD/kW electrical
row mixes pad, collection, GSU, and controls; no site SOV split or local exposure fraction is available.

## Research conclusion for the paired flood cell

`flood_wind` already has the stronger partial result: one source-native FEMA whole-substation depth-damage
curve. The deep review found official support that inundated dry-rated electrical components, cable, and pad
equipment can require replacement, but not a trustworthy component economic curve that can be added without
overlapping the whole-substation denominator. The right action is therefore to retain the existing flood
whole-substation proposal and **not** force a second flood curve.

## Release conclusion

This work creates a reviewable proposal, not a canonical model. Independent wildfire, electrical, value,
schema, and Hazard-consumer review remain required. Until a separate promotion decision, Hazard's operational
rule remains the v0.1 fail-closed boundary.
