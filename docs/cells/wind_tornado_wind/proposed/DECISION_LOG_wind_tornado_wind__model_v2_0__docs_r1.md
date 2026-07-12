# Decision log — wind_tornado_wind proposed model v2.0

Decision date: 2026-07-11
Status: proposed, noncanonical

## D-WTW2-01 — retain one cell identity

Keep `wind_tornado_wind` as one governed cell because both pathways act on the same onshore wind-turbine
anatomy, repeated-unit value substrate, and farm interface. Do not create two independently versioned cells or
a second runtime parent package.

## D-WTW2-02 — make two pathways first class

The cell contains exactly two proposed runtime pathways:

```text
straight_line_convective
tornado_direct_hit
```

`pathway_id` is required and has no default. Tornado is no longer a Boolean conditioner or a horizontal shift
of the straight-line curve.

## D-WTW2-03 — narrow straight-line scope

`straight_line_convective` includes local downburst/microburst/macroburst, gust-front, and derecho-outflow
loading. Derecho remains the Hazard occurrence/footprint identity; the local turbine demand is the damage
input. Nonconvective synoptic, downslope, and tropical-cyclone wind are excluded.

## D-WTW2-04 — keep tropical cyclone separate

Tropical-cyclone/hurricane wind requires a separate Damage Modeling cell or workstream. It may reuse the
turbine/value substrate, but its sustained duration, eyewall veer, turbulence, precipitation, grid-loss/yaw
state, and offshore wave/corrosion seams prohibit automatic reuse of either convective pathway.

## D-WTW2-05 — use the repeated turbine equipment assembly as the primary loss atom

Blade, nacelle, and tower damage are strongly dependent. A tower-collapse state usually makes independent
component summation invalid. The proposed numeric record therefore uses one repeated turbine-equipment
assembly with mutually exclusive ordered damage states. State descriptions identify affected subsystems.

Foundation, collection/substation, civil works, and support/logistics remain separate rows and are not scaled
by the turbine curve.

## D-WTW2-06 — define a hardware-only direct denominator

The curve y-axis is expected direct replacement cost of turbine equipment divided by the pre-event direct
replacement value of the same turbine equipment. The NREL CWER reference denominator is `$1,090/kW`:

```text
rotor + pitch                 337 USD/kW
nacelle + drivetrain + power 477 USD/kW
tower                         276 USD/kW
------------------------------------------------
turbine equipment           1,090 USD/kW
```

Foundation (`$120/kW`), external electrical (`$72/kW`), civil (`$47/kW`), replacement fieldwork
(`$100/kW`), and transport/logistics (`$194/kW`) are outside that curve denominator. Support costs are
allocated once after damaged units are known.

## D-WTW2-07 — use ordered damage-state lognormal fragility

Adopt `ordered_damage_state_lognormal` for the screening proposal. State exceedance probabilities use a common
log-dispersion, ordered median capacities, and mutually exclusive exact-state probabilities. This prevents
negative probabilities and double counting.

The three capacity scenarios are a nonprobabilistic epistemic envelope. They are not percentiles and carry no
weights.

## D-WTW2-08 — retain fail-closed coverage

Straight-line convective evidence supports only a Tier-4 screening assembly envelope constrained by blade and
tower load/failure evidence. It does not directly calibrate nacelle, drivetrain, foundation, or plant
infrastructure DR. Tornado evidence supports rotor-damage and terminal-collapse anchors, but not a complete
foundation or external-plant curve. Unsupported unit/pathway pairs are serialized as withheld.

## D-WTW2-09 — separate source-native intensity from effective turbine demand

Preferred inputs are rotor-effective local wind measures. Hub-point gusts may be explicit proxies. A 10 m
ASCE gust, EF rating, derecho label, or tornado swath intersection is never silently treated as the curve axis.
Every proxy requires a named bridge and quality flag; an EF class alone is rejected.

## D-WTW2-10 — keep exposure in Hazard M2

Hazard owns event identity, frequency, track/footprint, point/line/area intersection, exposed turbine count,
and multi-turbine spatial dependence. Damage Modeling returns conditional severity for one delivered repeated
turbine unit. Substation points, collection lines, civil polygons, and turbine points receive distinct exposure
objects.

## D-WTW2-11 — introduce a draft v3 contract

Use proposed bundle v3, emit v2, and capability v3. Existing canonical bundle-v2 artifacts and consumers are
unchanged. Promotion requires an explicit migration rather than compatibility coercion.

## D-WTW2-12 — do not preserve old headline losses

The new model is not calibrated to reproduce Traverse/Shepherds Flat EAL or PML values. Those results used
different hardcoded curves, denominators, exposure grains, and frequency assumptions. Old-vs-new comparison is
diagnostic only.

## D-WTW2-13 — current v1.0 stays live during research

No current registry, artifact index, package release, or Hazard production path changes in this work. The
proposal must pass every promotion gate before v1.0 is archived or superseded.
