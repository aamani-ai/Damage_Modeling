# Tropical-cyclone wind × solar — the physical idea

## The lead result

Proposed model v2.0/docs r1 gives this cell bounded numerical **coverage**, not calibrated hurricane
fragility. It has three mutually exclusive routes:

```text
Perry compatibility -> one unchanged source-specific visible-module material proxy
fixed tilt          -> synthetic module and support-structure state/DR scenarios
single-axis tracker -> synthetic module and SBOS state/DR scenarios
```

The four generic records are explicitly Tier 4. Their central scenario is not a best estimate, and their
lower/upper scenarios are not percentiles. The package remains noncanonical and unavailable for Hazard
cutover, scenario dollars, whole-plant loss, or annual/tail metrics.

## The core physical chain

For fixed tilt, a qualified TC wind field and array aerodynamics produce an event-to-design net-pressure
ratio. For trackers, a qualified local tracker-normal gust is divided by the exact system's critical
instability speed at the attained configuration. Each normalized demand then drives ordered damage-state
probabilities.

```text
qualified TC event
  -> architecture-specific normalized demand
  -> probability of each exact damage state
  -> explicit same-unit state-cost ratios
  -> synthetic same-unit DR scenarios
```

This separation matters. A probability of extensive failure is not itself a damage ratio. The probability
only becomes expected DR after the consequence ratios are explicitly supplied.

## Why fixed tilt and trackers are separate

Fixed arrays respond through a qualified pressure-demand/design-capacity comparison. Tracker response also
depends on exact system, 1P/2P configuration, layout, angle, position, array zone, and drive/lock state.
Commanding stow does not prove the array attained that state. A tracker request therefore fails closed unless
the event and qualification bases match exactly.

## What remains outside the curves

Foundation, power conversion and collection, GSU/substation, SCADA, civil infrastructure, and replacement
support have no TC-wind curve in v2. They are null/withheld, not zero. The GSU is a separate facility
yard/point subasset and cannot inherit array response or exposure.

Rain, debris, tornado, flood, surge, and scour are separate pathways under the same event family. Downtime,
BI, insurance, scenario dollars, EAL, PML, VaR, TVaR, and portfolio aggregation belong outside this curve
package.

## Why model v2 is still useful

The package supports interface development, failure-unit decomposition, architecture routing, state/DR
typing, compound-event boundaries, and explicit uncertainty scenarios while the evidence acquisition
continues. Its usefulness comes from being bounded and honest about what is synthetic.

## Status

```yaml
lead_proposal: model v2.0 / docs r1
grade: experimental_synthetic_T4_scenario
canonical_runtime_artifact: false
Hazard_cutover: prohibited
artifact_index_entry: none
current_pointer: none
scenario_and_annual_tail_outputs: withheld
source_derived_alternative: model v1.0
strict_no_curve_alternative: model v0.1
```

## Read next

- [How model v2 is built](HOW_THE_MODEL_IS_BUILT.md)
- [Exact model-v2 reference](MODEL_REFERENCE.md)
- [Cell package](../README.md)
- [Request guide](../../../extra/guides/tropical_cyclone_wind_solar_v2_curve_request_guide.md)
- [Model-v2 proposal overview](../proposed/README_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [Model-v1 source-derived alternative](../proposed/README_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
- [Model-v0.1 strict alternative](../proposed/README_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
