# Bounded evidence search log — wind_tornado_wind proposed model v2.0

Review cutoff: 2026-07-11

## Claim boundary

Within the documented public, English-language surfaces and endpoint tests, the review located enough evidence
to define pathway physics, axes, turbine damage states, and screening anchors. It did **not** locate a matched
dataset that joins modern onshore turbine-level rotor-effective convective/tornado wind, operational state,
post-event component disposition, and same-unit repair/replacement cost across a population.

That is a bounded negative-evidence statement. Private OEM type-certificate loads, SCADA, insurer claims,
owner inspection files, unpublished reconnaissance, non-English material, and papers released after the cutoff
may change it.

## Protocol

```yaml
review_cutoff: 2026-07-11
language_scope: English
access_scope: public abstracts, open full text, official reports/pages, licensed-standard metadata
target_hazard:
  - straight-line convective outflow
  - tornado direct hit
target_asset: utility-scale onshore horizontal-axis wind turbine and wind farm
target_failure_units:
  - rotor/blade/pitch
  - nacelle/yaw/drivetrain/power electronics
  - tower
  - foundation
  - collection/substation/civil
target_endpoint: conditional same-unit direct physical replacement-cost ratio
search_surfaces:
  - NREL/NLR and OSTI
  - NOAA/NWS/NSSL/SPC and AMS
  - NIST and FEMA
  - IEC official catalog
  - ASCE Library
  - ScienceDirect
  - Wiley
  - Springer/Natural Hazards
  - MDPI
  - Copernicus/Wind Energy Science
  - university repositories at Western, TU Delft, NCSU, UCD, Birmingham, and CMU
```

## Endpoint test

Evidence was admitted to numerical calibration only if its supported chain was explicit:

```text
source/event wind
  -> local turbine or rotor demand with height/time basis
  -> matched turbine configuration and control state
  -> observed or modeled failure/damage state
  -> same-unit component disposition or replacement-cost fraction
```

Sources missing the final link may constrain axis, mechanism, relative loading, state ordering, or an
engineering envelope. They may not be presented as direct damage-ratio calibration.

## Query families and results

| Family | Representative terms/variants | Endpoint sought | Result |
|---|---|---|---|
| Convective observed damage | wind turbine downburst, microburst, derecho, Buffalo Ridge, blade failure, tower buckling | local wind + turbine damage state | Buffalo Ridge and SPC cases found; wind/configuration confounding prevents direct modern calibration |
| Convective load physics | turbine downburst LES, OpenFAST, microburst experiment, gust-front, transient inflow | rotor/tower loads vs local field and controls | strong direct load evidence; no repair-cost mapping |
| Convective vertical profile | downburst nose profile, hub-height, rotor-effective gust, 10 m bridge | 10 m-to-rotor transfer | nose profiles and variability found; no universal scalar bridge |
| Control/operational state | pitch, yaw, shutdown, grid loss, direction change, ramp rate | load modifier by event-time state | strong evidence that state is material; no universal DR shift |
| Tornado observed damage | Greenfield, Jacksboro, Kansas, Ontario, wind-turbine DI/DOD | turbine damage state with local speed | Jacksboro rotor damage and Greenfield collapse transition found |
| Tornado wind field | tornado profile, vertical/radial/tangential components, moving vortex, debris | turbine-effective demand and height bridge | NIST profile and multiple turbine simulations found; speed-only transfer remains limited |
| Tornado fragility | turbine tornado vulnerability curve, DOD, damage indicator | ordered states and probability/cost | one published screening vulnerability and proposed EF damage indicator found; expert/engineering basis, not population fragility |
| Value and denominator | NREL land-based turbine component CapEx, replacement cost | row-complete same-unit direct value | CWER 2024 component and BOS rows found; support allocation remains assumption |
| Neighboring tropical cyclone | hurricane/typhoon turbine fragility, Usagi, Maemi, eyewall, yaw/grid loss | transferability boundary | useful adjacent capacity/control evidence; rejected as direct convective calibration |
| Consumer seam | Hazard M2/M3/M4 wind/tornado curves, exposure, frequency, value | routing and double-count audit | two hardcoded curve copies, wrong height seam, mixed exposure grains, and frequency issues verified |

## Straight-line convective evidence disposition

| Evidence link | Located evidence | Missing link | Governed action |
|---|---|---|---|
| Hawbecker, Basu, Manuel 2017 | Buffalo Ridge blade loss and tower buckling; estimated 30–50 m/s near-surface downbursts | pure pathway attribution, turbine-level hub wind, modern turbine, repair cost | retain observed failure ordering; prohibit direct curve fit |
| Lu et al. 2019 | 28.8–55 m/s simulated cases; ramp 1.0–1.6 m/s²; direction changes 21.3–110°; blade/yaw loads | capacity and disposition | retain axis/conditioner/load constraints only |
| Zhang, Sarkar, Hu 2015 | mean loads up to 4× ABL and fluctuations up to 10× in scaled microburst experiment | full-scale capacity and DR | retain mechanism validation only |
| Nguyen & Manuel 2014 | pitch/yaw and transition state materially change loads | general state-to-DR relation | require state metadata; no universal modifier |
| Ahmed et al. 2023 | downburst-specific load profiles from more than one million parametric analyses | same-unit damage/cost | future demand-surrogate route; no direct DR adoption |
| NOAA/NSSL | microburst 2–5 min, macroburst about 5–20 min; derecho is an extended event family | local turbine duration/intensity | retain taxonomy and Hazard/Damage boundary |
| NOAA/SPC 2006 | turbine blade snapped in thunderstorm wind | measured gust and asset state | qualitative validation only |

## Tornado evidence disposition

| Evidence link | Located evidence | Missing link | Governed action |
|---|---|---|---|
| Marshall & Dunn, Jacksboro | four turbines with shredded blades and intact towers; typical resistance about 51 m/s | exact rotor wind/time history, repair scope, turbine population | central rotor-damage state anchor; screening only |
| Wurman & Kosiba, Greenfield | all turbines below 65 m/s survived; all at or above 69 m/s toppled; mixed 65–69 m/s | published counts/configuration detail, final height/time bridge, cost | central terminal-state transition anchor; engineering dispersion/envelope |
| Aslam & Alipour 2026 | forensic observations and finite-element confirmation of local inelastic tower buckling | population fragility and repair cost | mechanism/terminal-state validation |
| Bouchard & Romanic 2023 | published turbine DOD screening curve with 36/45/49/58 m/s thresholds | empirically fitted fragility and current US value basis | lower-resistance scenario/reference prior; do not copy value shares |
| Marshall et al. 2022 | proposed commercial wind-turbine EF damage-indicator/DOD framework | final standard and population calibration | engineering state taxonomy only |
| AbuGazia et al. 2020 | F2 tornado blade loads can exceed IEC extreme load; pitch/tornado position material | actual failure probability and cost | physics/conditioner evidence only |
| Lombardo et al. 2024 | 36 mobile-radar profiles; median peak near 50 m; nominal ASCE tornado profile | turbine-specific full 3-D rotor field | require tornado profile/height provenance |
| NWS EF guidance | EF is a damage-based estimated 3-second gust; estimates vary with height/exposure | measured turbine intensity | reject EF class as direct numeric curve input |
| Baker & Sterling 2018 | direct wind, pressure, and debris are distinct tornado load processes | turbine debris fragility | retain unresolved-mechanism flag; no debris multiplier |

## Value and assembly disposition

The NREL CWER 2024 reference provides a complete installed-cost ledger and component rows. It supports the
`$1,090/kW` turbine-equipment denominator and reconciliation to `$1,623/kW` physical and `$1,968/kW`
installed bases. It does not prove damage states or that fieldwork/logistics scale linearly with hardware DR.

The proposal therefore:

- uses component values only to define state consequences;
- keeps foundation and external plant units separate;
- allocates `$294/kW` fieldwork/transport once after damaged units are known;
- excludes `$345/kW` sunk/soft/nonphysical rows;
- publishes no implicit full-TIV cap or value profile.

## Included and excluded evidence types

Included:

- official observations and damage surveys;
- peer-reviewed field, experimental, numerical, and forensic turbine studies;
- official standards pages and government design/research reports;
- public component-value sources;
- adjacent tropical-cyclone evidence only for explicit transfer tests and boundary setting.

Excluded from direct numerical calibration:

- secondary summaries when the primary source was available;
- general building/transmission fragilities;
- event photographs or news without wind/configuration/disposition;
- load ratios interpreted as damage ratios;
- EF class midpoint or uniform EF-band speed treated as a measurement;
- tropical-cyclone or synoptic curves copied into convective pathways;
- OEM/type-certificate values that were not publicly verifiable;
- cumulative fatigue, downtime, curtailment, BI, and financial terms.

## Bounded conclusion

The research supports a materially better screening model, not an underwriting-grade fragility. The proposed
curves are Tier 4 capacity/consequence envelopes constrained by Tier 1–3 observations, standards, experiments,
and simulations. Exact central ordinates remain replaceable assumptions.

## Update triggers

Re-run the review and reconsider the model if any of the following becomes available:

1. the final ASCE/SEI/AMS wind-speed-estimation standard and commercial wind-turbine damage indicator;
2. the complete Greenfield turbine/radar/video paper with turbine configuration and counts;
3. public modern-turbine downburst/tornado OpenFAST or HIW-TUR demand surfaces tied to ultimate capacities;
4. OEM/type-certificate component capacity or load-case data suitable for this archetype;
5. turbine-level SCADA/reconstructed wind joined to inspection and repair/claims data;
6. a public plant-electrical/foundation damage dataset;
7. a new CWER value vintage or site-specific replacement schedule;
8. Hazard adoption of rotor-effective wind, point/line exposure, and pathway-aware event identity.
