# Numerical candidate audit — wildfire_wind model v0.1/docs r1

## Candidate inventory

| Candidate | Native endpoint | Numerical content | Runtime disposition |
|---|---|---|---|
| FSim risk components | 270 m source wildfire probability fields | Burn probability plus six conditional flame-length probability classes | Source-hazard capture only; no equipment ordinate |
| Byram/FARSITE fireline intensity | Fire-front heat release per unit length | kW/m | Axis definition only; direct kW/m² conversion prohibited |
| Frankman/Butler field heating | Local wildland-fire radiation/convection/gas histories | Time-resolved flux, temperature, velocity, peaks/duration | Local-attack research constraints only |
| Wang et al. blade specimens | GFR-UPR specimen ignition/heat-release/smoke under cone exposure | 15–75 kW/m² radiant test conditions | Material mechanism/test-design candidate only |
| NIST individual firebrands | Individual firebrand heat transfer | Peak heat flux and total heating versus particle/substrate/wind/contact | Firebrand-variable candidate only |
| NIST firebrand piles | Deposited pile thermal footprint | Surface temperature, heat flux, spatial contact footprint | Deposition/accumulation candidate only |
| NEMA GD 2 | Post-fire electrical equipment disposition | Categorical evaluate/replace/recondition guidance | State-vocabulary candidate; no probability/cost |
| NREL CWER | Land-based wind component-cost anatomy | 1,090 turbine equipment; 1,623 physical; 1,968 installed 2023 USD/kW | Value reconciliation only |
| Legacy rotor/nacelle/tower logistics | Expert response from FLI and fixed converters | Three logistics with caps/slopes/midpoints | Reject |

## Unit and endpoint guardrails

```text
kW/m fireline intensity != kW/m2 incident target flux
FSim conditional flame-length probability != equipment exposure fraction
specimen ignition/heat release != full-blade inspected repair state
firebrand peak/contact heat != turbine or GSU ignition probability
post-fire evaluation guidance != pre-event fragility
component reference value != repair cost or loss cap
internal-fire disposition != exogenous-wildfire calibration
```

No unit conversion, curve fit, or multiplication can close those endpoint gaps without a separately
validated bridge and matched response/consequence evidence.

## Transparent calculations retained for reconciliation only

```text
turbine equipment = 282 + 13 + 42 + 76 + 236 + 137 + 28 + 276 = 1090
other direct physical = 120 + 47 + 72 = 239
support = 100 + 194 = 294
physical = 1090 + 239 + 294 = 1623
installed = 1623 + 345 = 1968  2023 USD/kW

turbine equipment / physical = 1090 / 1623 = 0.671595810228
turbine equipment / installed = 1090 / 1968 = 0.553861788618
physical / installed = 1623 / 1968 = 0.824695121951
```

These verify the value ledger only. They are not vulnerability, exposure, probability, caps, or site loss.

## Why the blade experiment is not a curve

The 15–75 kW/m² specimen range is a laboratory loading program on a named material construction. It does
not supply a representative full-blade population, external wildfire bridge, field duration/geometry,
mutually exclusive structural disposition, or direct repair/replacement ratio. The tested range must not
be converted to curve knots or used as an economic threshold.

## Why the firebrand studies are not a curve

Individual-particle and pile studies quantify local heat transfer under controlled conditions. They do not
quantify deposition at turbine openings, ingress to protected zones, ignition of a named equipment
population, dependent fire spread, inspection disposition, or cost. Short local peaks are not silently
equated to sustained cone-calorimeter flux.

## Why NEMA is not a curve

NEMA supplies equipment-specific post-fire evaluation and replacement considerations. It is valuable for
future state definitions but has no external wildfire severity variable, population probabilities, direct
cost ratios, or support allocation.

## Legacy reproduction disposition

The legacy logistics are not admitted even as provisional candidates. Their numerical values are retained
only to recognize and reject regressions. Reproducing the formulas successfully would confirm code
execution, not scientific validity.

## Decision

```yaml
runtime_curve_count: 0
candidate_numbers_in_runtime_shape: false
canonical_runtime_artifact: false
standard_reason: NO_RUNTIME_CURVE
```
