# Numerical candidate audit — hail_wind model v0.1/docs r1

## Candidate inventory

| Candidate | Native endpoint | Numerical content | Runtime disposition |
|---|---|---|---|
| Macdonald repeated simulated hail | GFRP coupon mass/optical/SEM response after repeated impacts | 5–20 mm stones; 50–95 m/s test conditions | Candidate mechanism/threshold constraint only |
| Fiore et al. blade simulation | Impact/delamination area for one 1.5-MW blade/material setup | Large-hail simulation and blade-section response | Candidate bridge/mechanism only |
| Pryor/Barthelmie 2026 | Multi-year accumulated distance to coating failure | Coating-lifetime atlas and hail contribution | Chronic degradation candidate; reject occurrence DR |
| Leading-edge classification | Visual, mass loss, aerodynamic, structural categories | State vocabulary | Candidate state definitions; no probabilities/costs |
| Blade repair literature | Repair-cost and logistics anatomy | General repair/replacement anchors | Pressure test only; no hail-state mapping |
| Legacy alleged wind hail MDR | Buildings/cars real-estate hail array mislabeled as wind | Approx. 0.12%–5.78% table | Reject |

## Physics reproduction boundary

The following identity is valid for a spherical stone with a declared density and relative speed:

```text
m = rho × pi × d^3 / 6
KE = 0.5 × m × v_relative^2
```

It is retained as a transparent research calculation only. It does not determine terminal speed,
trajectory, contact angle, blade-section velocity, strike count, material damage state, or cost.

## Endpoint mismatch

```text
coupon microdamage ≠ inspected field blade repair state
coating lifetime ≠ one-event damage ratio
visual/mass-loss category ≠ repair cost ratio
general blade repair cost ≠ probability of that repair after hail
```

No permissible multiplication or curve fit closes these gaps without new evidence or approved elicitation.

## Pressure-test rule

General repair and NREL value figures may test whether a proposed future state/cost table is economically
plausible. They cannot seed probabilities, thresholds, caps, or exposure. BI/downtime values are excluded.

## Decision

```yaml
runtime_curve_count: 0
candidate_numbers_in_runtime_shape: false
canonical_runtime_artifact: false
standard_reason: NO_RUNTIME_CURVE
```
