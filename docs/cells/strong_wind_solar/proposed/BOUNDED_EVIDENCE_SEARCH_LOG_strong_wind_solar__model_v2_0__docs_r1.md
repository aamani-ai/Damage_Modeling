# Bounded evidence search log — strong_wind_solar proposed model v2.0/docs r1

## Question and cutoff

Search cutoff: **2026-07-12**. The target was public evidence joining local non-tornadic convective demand,
utility-PV architecture/state, inspected physical disposition, and same-failure-unit repair/replacement cost.
The negative result is scoped to the recorded English-language public surfaces; it is not a universal claim.

## Surfaces and query families

- DOE/FEMP, NREL/NLR, LBNL, Sandia, OSTI and IEA PVPS;
- NIST, NOAA/NWS/NSSL and public full-scale downburst research;
- ASCE, ASTM, IEC, UL, SEAOC and FM public standard records/guidance;
- Crossref/DOI and publisher searches for downburst, derecho, fixed-tilt, tracker, galloping, Ucrit, clamps,
  fasteners, row position, stow, loss and failure investigation;
- repository source workbook, current v1 artifact/workbook, and adjacent hail/wildfire/wind-tornado work.

Representative searches combined: `downburst solar tracker pressure`, `convective wind utility PV damage`,
`derecho solar array failure`, `fixed tilt wind fragility`, `tracker torsional galloping failure`,
`solar tracker critical velocity 1P 2P`, `PV clamp fastener storm failure`, and `PV repair cost wind loss`.

## Endpoint test

Each retained source was classified by what it actually measures:

| Endpoint | Found? | Use |
|---|---:|---|
| Convective/downburst pressure-time history on a tracker array | Yes | Mechanism, row/tilt/transient axis only |
| Tracker instability/critical velocity for named configurations | Yes | Exact-system normalized axis and qualification gate |
| Fixed-tilt ABL pressure/load coefficients | Yes | Fixed-tilt demand bridge; not downburst fragility |
| Field cases with approximate wind and component narrative | Yes | Broad screening constraints; not fitting data |
| Matched local convective demand + architecture + disposition + cost population | **No** | Prevents claims-calibrated curve |
| Fixed-tilt convective fragility | **No** | T4 scenario parameters |
| Tracker fragility conditional on `V/Ucrit` | **No** | T4 scenario parameters |
| Public same-unit repair-cost distribution | **No** | T4 localized state costs |

## Retained and rejected transfer

The machine-readable endpoint and transfer-limit record is
`SOURCE_REGISTER_strong_wind_solar__model_v2_0__docs_r1.csv`.

- Álvarez et al. is the closest direct downburst×tracker experiment; it supplies pressure histories, not
  failure or loss.
- IEA PVPS and the Valentín case show damage can occur below nominal project/design speeds, but their local
  wind, architecture, denominator and population support are insufficient for fitting.
- ASCE/FM/IEC/ASTM anchor design, testing and action gates; standards are inputs, not curves.
- Hurricane panel fragility studies were rejected for numerical transfer because TC duration, pressure,
  debris, building interaction and asset populations differ.
- DOE hardening premiums were rejected as repair costs.
- The current v1 parameters were retained only for exact legacy comparison, never calibration.

## Result

The evidence is strong enough for scope, architecture split, axes, failure mechanisms, selectors,
conditioners, value rows, rejection rules and broad scenario pressure testing. It is not strong enough for
public-source-derived ordinates. All medians, dispersions, hard-zero boundary and localized repair ratios are
therefore T4 assumptions and promotion remains blocked.
