# strong_wind_solar — proposed model v2.0, docs r1

> **Status: proposed, noncanonical screening model.** Current
> `strong_wind_solar@model_v1_0__docs_r3` remains the runtime artifact. This package is absent from the
> artifact index, current changelog, and portable library v2.5.

## Outcome

This package rebuilds the cell for one explicit physical pathway:

```text
straight_line_convective
├─ fixed_tilt_ground_mount_screening_v1
│  ├─ module field
│  └─ above-ground support structure
└─ single_axis_tracker_qualified_screening_v1
   ├─ module field
   └─ tracker structural-BOS assembly
```

Included hazard mechanisms are downburst, microburst, macroburst, non-tornadic thunderstorm outflow, gust
front, and a locally resolved derecho outflow. Hurricane/tropical-cyclone wind, tornado, nonconvective
synoptic/downslope wind, hail, debris impact, wind-driven rain, lightning, flood, fatigue and disruption are
not delivered by these curves.

## What changes from v1

| Current v1.0 | Proposed v2.0 |
|---|---|
| Straight-line, hurricane and derecho-style wind combined | Exact `straight_line_convective` pathway; neighboring wind rejects |
| One gust/design-speed family for fixed tilt and trackers | Fixed-tilt event/design pressure-demand ratio; tracker `V_normal/Ucrit` |
| Five independent thresholded logistics | Four architecture-routed state curves plus bounded cascade/salvage treatment |
| Generic stow multipliers, including probabilistic demand averaging | No universal stow credit; exact attained state belongs in tracker qualification |
| Tracker, racking, modules, foundation and SCADA summed | Module and structure value atoms; unsupported units withheld |
| T4 value shares | Row-complete reference/sensitivity crosswalk; explicit site value required |
| No known-answer tests | Equation, state, proxy, Ucrit, cascade, value and rejection tests |
| Bundle v2 / emit v1 / capability v2 | Proposed bundle v3 / emit v2 / capability v3 |

The legacy workbook also contains a concrete bug: `Dashboard!G7` reads mounting type `B7`, not stow state
`B8`. The proposal records that defect but does not silently patch the current canonical version.

## Scientific grade

This is a **screening engineering proxy**, not a claims-calibrated fragility model. Direct downburst testing,
tracker aeroelastic research, field cases, design standards and field guidance support the architecture and
mechanisms. No retained source supplies a population joining local convective demand, exact system state,
physical disposition and same-unit cost. The lower/central/upper scenarios are broad unweighted engineering
assumptions, not percentiles. Promotion is blocked pending independent review and stronger calibration.

## Axes

Fixed tilt preferred:

```text
x_fixed = event peak net-pressure demand / comparable same-zone qualified design net-pressure demand
```

Flagged fixed proxy:

```text
x_fixed_proxy = (array-height 3-second gust / qualified design array-height gust)^2
```

The proxy requires named non-synoptic profile and aerodynamic-demand bridges. A 10 m gust is never evaluated
directly.

Tracker preferred:

```text
x_tracker = tracker-normal local 3-second gust / exact-system critical-instability 3-second gust
```

`Ucrit` requires a named third-party aeroelastic test or qualified model for the exact 1P/2P configuration,
attained angle, row/layout and drive state. The event must exactly match the qualification's 3-second,
array-height tracker-normal, profile, configuration, layout, position, angle, zone and drive/lock basis;
unknown or mismatch rejects. Only then, at `x_tracker >= 0.75`, the evaluator emits an operational stow
action flag; it does not force damage.

## Value and dependency rule

The repository reference in 2024 USD is:

```text
module hardware            291.21485143992487 USD/kWdc
mounting hardware           109.98972602739727 USD/kWdc
array direct reference      401.20457746732210 USD/kWdc
physical reference          877.79570236266680 USD/kWdc
installed reference        1120.00000000000000 USD/kWdc
```

Thus the array direct reference is `45.705917%` of physical and `35.821837%` of installed value. Neither is
an intrinsic curve cap. Explicit site module/structure values and exposure are required for loss.

Module and structure states are evaluated separately. Structure DS2 assumes replacement with module hardware
salvageable; DS3 represents destructive collapse with module hardware nonsalvageable. The central loss uses
the DS3 rule and also exposes full-salvage and no-salvage-on-any-replacement bounds. Salvage and conditional
dependence are explicitly T4. Replacement support is allocated once outside intrinsic DR.

## Package map

Governance/research: change classification, decision log, bounded search log, source register, claim register,
parameter tiers, legacy audit and pressure test.

Design/contract: derivation dossier, metadata spec, seven-step audit, neighboring-wind boundary, value
crosswalk, curve artifact, capability declaration, KAT fixture, workbook and sheet manifest.

Validation/promotion: old-vs-new comparison, validation report, promotion gate matrix, detailed request guide,
and Hazard migration proposal.

## Explicit non-changes

```yaml
current_v1_artifact: unchanged
artifact_index: unchanged
cell_changelog: unchanged
portable_package_v2_5: unchanged
Hazard_runtime: unchanged
runtime_promotion: not_performed
hurricane_or_tornado_curve: not_created
annual_frequency_and_financial_tail: downstream_owned
```
