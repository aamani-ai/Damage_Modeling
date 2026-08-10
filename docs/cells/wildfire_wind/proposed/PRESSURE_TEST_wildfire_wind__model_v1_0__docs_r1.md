# Pressure test — wildfire_wind model v1.0/docs r1

## Claims that survived

- External wildfire can create nonzero physical risk for ground-adjacent wind-farm electrical equipment.
- Polymeric, electronic, communications, UPS/DC, relay, and cable content creates a credible replacement-
  prone high-severity endpoint.
- Common steel exterior construction supports lower relative response for pad apparatus than for the
  protection-control-DC package; it does not support immunity.
- Two failure-unit results are more defensible than a false full-farm aggregate.

## Claims that did not survive

- FSim class is local heat flux or fireline intensity at equipment.
- The Severino PMMA ignition probit is a wind-farm economic damage curve.
- NEMA disposition guidance is pre-event fragility.
- A blade coupon ignition result supports a full-turbine DR.
- A mixed 72 USD/kW electrical row can value either numerical unit.
- Numerical identity to wildfire-solar proves evidence transfer.

## Numerical stress cases

| Case | Required behavior |
|---|---|
| State 0 | Both units return DR 0 as a no-event control |
| State 4 | Pad returns 0.12; GSU controls returns 0.25 |
| State 6 | Pad returns 0.70; GSU controls returns 0.90 |
| State 3.5 | Reject; do not interpolate |
| Wrong FSim product | Reject selector mismatch |
| Firebrand pathway | Reject; no thermal fallback |
| Main transformer | Return null plus reason codes, not zero |
| Full-project value | Prohibited |

## Red-team conclusion

The proposal is useful only if its label remains load-bearing: **partial, noncanonical, Tier-4 screening**.
Removing any of those three qualifiers would overstate the evidence. Within those bounds, the model is
coherent, monotone, spatially meaningful, machine-testable, and preferable to hiding all risk behind a
zero-curve scaffold.
