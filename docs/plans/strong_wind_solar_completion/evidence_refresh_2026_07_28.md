# Strong-wind × solar evidence refresh — 2026-07-28

Purpose: pressure-test the proposed model v2 axes and calibration status after the package's
`2026-07-12` bounded-search cutoff. This is a planning-stage evidence note, not a mutation of the governed
proposal source register. Candidate-package changes belong to Step 4 of the
[completion plan](README.md).

## Questions

1. Is there new primary evidence that changes the fixed-tilt convective demand bridge?
2. Is there new primary evidence that changes the exact-system tracker `Vnormal/Ucrit` axis?
3. Is there a public matched dataset joining local demand, architecture/state, inspected damage and
   same-failure-unit repair/replacement cost?

## Search boundary

Searches covered publisher/DOI records, DOE/NREL/OSTI and public research pages for:

- downburst or convective loading on ground-mounted fixed-tilt PV and tracker arrays;
- tracker critical speed, flutter/instability, tilt, row/layout, turbulence and uncertainty;
- utility-scale PV field damage, fragility, claims and same-unit repair cost;
- material published or surfaced after the prior cutoff, including a specific `2026-07-13` through
  `2026-07-28` check.

Standards, design guidance and loading studies were screened as mechanism/contract evidence only. They were
not treated as damage curves. Hurricane, typhoon, rooftop, cable-supported/flexible-array and non-PV evidence
were not transferred numerically into the straight-line-convective ground-mount pathway.

## Candidate additions and dispositions

| Candidate source | Native endpoint | Disposition for `strong_wind_solar` | Transfer limit |
|---|---|---|---|
| [Carbajosa et al., *Self-excited critical wind speed and uncertainty determinations*](https://doi.org/10.1016/j.renene.2025.123640) | Semi-empirical and experimental criteria for identifying tracker critical wind speed; uncertainty framework for isolated 2D trackers | **Retain for tracker axis/qualification review** | Supports recording the critical-speed identification criterion and uncertainty; does not supply a production-system fragility, convective transfer or economic DR |
| [Ma et al., *Interference mechanisms of aerodynamic instability in single-axis solar tracker arrays*](https://doi.org/10.1016/j.solener.2026.114532) | CFD study of six-row array instability versus row and tilt angle | **Retain with mechanism transfer limit** | Strengthens row/zone and attained-angle matching; study-specific critical speeds and the reported 34% difference are not portable thresholds |
| [Wu et al., *Amplitude-dependent analyses on nonlinear flutter performance of single-axis solar trackers*](https://doi.org/10.1016/j.solener.2026.114381) | Sectional wind-tunnel/CFD analysis of nonlinear flutter, damping, stiffness and turbulence | **Retain with qualification transfer limit** | Supports exact dynamic-property and turbulence provenance; not a utility-array failure or cost population |
| [Zhang, Li and DeJong, *A novel simulation framework to estimate dynamic response of a solar panel array under stationary stochastic wind loads*](https://doi.org/10.3389/fbuil.2026.1749310) | Stationary spatially correlated wind-load simulation and structural response for a ground-mounted array | **Record as adjacent fixed-array method; do not transfer to convective fragility** | Uses stationary wind, smooth-inflow mean pressure coefficients and an edge-row example; explicitly does not validate a downburst bridge or damage curve |
| [Perry, Jordan and Nguyen, *Assessing the Impacts of Extreme Weather Events on Photovoltaic Installations Using Remote Sensing Imagery*](https://doi.org/10.1002/pip.70001) | Site-level post-event remote-sensing damage after a hailstorm and hurricanes | **Reject for v2 numeric calibration; retain as neighboring-hazard evidence only** | Hurricane wind, installation-mixed site damage and no same-failure-unit repair-cost denominator do not match local convective demand or v2 failure-unit grain |

## Axis conclusions

### Fixed tilt

No new matched fixed-tilt downburst/convective failure dataset was found. New and recent stationary-wind
studies continue to support geometry-, direction-, row- and pressure-aware structural analysis, but they do
not justify a silent conversion from an atmospheric-boundary-layer pressure coefficient or a 10 m gust to a
convective fragility curve.

Decision: preserve the preferred event/design net-pressure-demand ratio and keep the squared-speed route a
named, limited proxy. The independent wind/structural review gate remains open.

### Tracker

The additional evidence strengthens the proposed normalized critical-speed concept but makes the exact-match
contract more—not less—important. `Ucrit` depends on the method used to identify onset and on configuration,
angle, row/interference, stiffness, damping, inertia, turbulence and model dimensionality.

Candidate Step 4 contract additions:

```text
ucrit_identification_criterion_id
ucrit_value_uncertainty_or_interval
qualification_structural_stiffness_basis
qualification_structural_damping_basis
qualification_inertia_basis
qualification_turbulence_basis
qualification_row_interference_basis
```

These fields should first be classified as required, optional-but-provenance-carried or research-only by an
independent aeroelastic reviewer. They must not receive invented defaults.

Decision: retain `Vnormal/Ucrit`; do not promote a generic critical speed or weaken the exact-system
qualification gate.

## Calibration conclusion

The refresh did not find a public dataset matching all four required elements:

```text
site-local non-tornadic convective demand
  + exact fixed/tracker architecture and attained state
  + inspected same-failure-unit physical disposition
  + same-failure-unit repair/replacement cost
```

The numerical curve gate therefore remains **blocked**. Existing lower/central/upper medians, beta, hard-zero,
localized repair ratios and cascade rule remain unweighted T4 screening assumptions. The refresh supports
contract hardening; it does not support a parameter-tier upgrade.

## Post-cutoff result

No primary publication surfaced in the focused `2026-07-13` through `2026-07-28` check that changes the above
conclusion. A July product announcement concerning a tracker stow configuration was screened out because it
does not provide a reproducible aerodynamic qualification, fragility population or repair-cost dataset.

## Step 2 disposition

| Gate | Result after refresh |
|---|---|
| Fixed-tilt axis concept | Retain, independent review still required |
| Fixed speed proxy | Retain only with named convective-profile and aerodynamic bridges |
| Tracker normalized axis | Retain and strengthen qualification provenance |
| 0.75 `Ucrit` action flag | No change; operational flag, not damage onset |
| Numerical medians/beta/zero/state costs | No tier upgrade; remain T4 |
| Matched damage-and-cost evidence | Not found within the recorded search boundary |
| Promotion | Remains blocked |

Next action: translate the tracker evidence into an independent-review checklist, then decide whether the
candidate contract needs the seven additional provenance fields before any synchronized proposal revision.
