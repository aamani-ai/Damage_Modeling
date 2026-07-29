# Pressure test — tropical_cyclone_wind_solar model v2.0/docs r1

## Answer first

```yaml
implementation_coherent: true
Perry_compatibility_exact: validated
generic_curve_monotonicity_bounds_and_recomposition: validated
request_contract_fail_closed: validated
generic_scientific_calibration: false
scenario_dollars: withheld
full_plant_DR: withheld
canonical_promotion: blocked
```

## Numerical checks

For every generic record and each resistance scenario, the validator checks a dense 0–2 grid:

- exact-state probabilities stay in `[0,1]` and sum to one;
- DR stays in `[0,1]` and is nondecreasing;
- lower-resistance DR ≥ central DR ≥ upper-resistance DR;
- x=0 returns exact state-0 probability one and DR zero;
- no positive hard-zero parameter exists;
- a representative positive demand produces positive DR using stable lower-tail CDF evaluation;
- values above 2 reject; and
- every emitted DR independently equals `sum(P_s*c_s)`.

## Probability/DR check

The artifact exposes state probabilities and explicit state-cost ratios independently. The validator
recomputes `sum(P_s*c_s)` and rejects a malformed state or median payload. Ceferino's extensive-failure
probability is not used as an ordinate or parameter.

## Architecture and state checks

- fixed calls reject tracker fields and unbridged 10 m gust;
- tracker calls reject fixed fields, missing Ucrit, generic system identity, mismatched qualification,
  missing qualification SHA, command-only stow, unknown zone/spatial object/angle/lock, or mismatched
  duration/direction basis;
- cross-architecture failure-unit requests reject;
- Perry calls reject generic aliases, missing acknowledgements, inputs outside 17.4–39.1 m/s, and positively
  identified compound pathways that cannot be separated from the source-composite endpoint; and
- undeclared, foreign-route, value, exposure, numeric-boolean, and malformed pin fields reject.

## Coverage checks

Foundation, collection, GSU, SCADA, civil, and support emit null plus reason codes. No whole-plant view is
formed. Therefore v2 neither inherits the legacy approximately 48-percent cap nor claims a higher complete
asset loss. The two are denominator- and coverage-incomparable.

A direct GSU query bypasses array architecture and array demand. When withheld units accompany an array
call, the emit explicitly says the array axis was not applied to them.

## Evidence pressure

Perry, Ceferino, Mawar, Yagi, FPL, FEMA, DOE/NLR, owner/SEC, OEM, standards, and tracker studies remain
important constraints. None calibrates the four generic response records. Passing this pressure test proves
that the synthetic decision is transparent and controlled—not that it is scientifically validated.
