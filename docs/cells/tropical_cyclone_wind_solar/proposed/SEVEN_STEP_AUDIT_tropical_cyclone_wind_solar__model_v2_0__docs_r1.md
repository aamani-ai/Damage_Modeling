# Seven-step audit — tropical_cyclone_wind_solar model v2.0/docs r1

## 1. Define the asset and boundary — PASS WITH LIMITS

Supported generic assets are ground-mounted rigid fixed tilt and exactly qualified 1P/2P single-axis
trackers. The Perry route retains its mixed-scale source cohort. Rooftop, carport, floating, dual-axis,
vertical/elevated agrivoltaic, and CSP are unsupported.

Physical destruction only is in scope. BI, downtime, revenue, insurance, land, soft/sunk value, and financing
are excluded.

## 2. Decompose failure units — PASS

Module and structure units are architecture specific. Foundation, electrical/collection, GSU, controls,
civil, and support remain separate. No whole-site curve is used. The Perry source atom is mutually exclusive
with generic fixed modules.

## 3. Choose y-axis and value basis — SYNTHETIC T4

Generic ordinate:

```text
DR_u = expected direct repair/replacement cost of unit u
       / pre-event replacement value of the same unit u
```

State probabilities are not DR. Explicit T4 state-cost ratios create the synthetic consequence bridge.
Scenario dollars are disabled.

## 4. Split value row by row — PASS FOR AUDIT, NOT RUNTIME

The value crosswalk splits modules, mounting, foundation, inverter, combiner, cable, MV/GSU, grounding,
SCADA, support, civil, and excluded value. Module/mounting values remain reference-only. Mixed and
unsupported rows remain withheld.

## 5. Allocate physical value — WITHHELD FOR LOSS

No value or exposed fraction defaults. Array value/exposure cannot be copied to GSU, collection, inverter,
SCADA, foundation, or civil subjects. Support is allocated once only after qualified direct disposition.

## 6. Build site-condition exposure adapter — CONDITIONAL

Fixed tilt requires a named TC wind-field, direction-history, duration-cycling, and aerodynamic bridge.
Trackers require those bridges plus exact attained-state/qualification matching. Rain, debris, tornado,
flood, and surge are separate pathways under one event family and have no modifier here.

## 7. Apply curves or withhold — CONDITIONAL SYNTHETIC OUTPUT

The Perry route evaluates only its exact source envelope. Generic fixed/tracker routes evaluate four
synthetic T4 curves only after their full gates. Six other units remain null. Scenario loss, whole-plant DR,
and annual/tail metrics remain withheld.

## Result

```yaml
curve_records: 5
source_derived_records: 1
synthetic_T4_records: 4
withheld_or_allocation_only_units: 6
canonical_runtime_artifact: false
scenario_loss: withheld
promotion: blocked
```

