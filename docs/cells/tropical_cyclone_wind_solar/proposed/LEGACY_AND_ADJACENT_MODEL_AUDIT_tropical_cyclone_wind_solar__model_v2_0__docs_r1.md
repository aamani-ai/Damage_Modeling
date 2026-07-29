# Legacy and adjacent-model audit — tropical_cyclone_wind_solar model v2.0/docs r1

## Legacy hurricane-solar implementation

The legacy logistics remain `regression_fixture_only` and runtime prohibited. The audit retains five
independent defects:

| Defect | v2 treatment |
|---|---|
| Ceferino parameters materially mis-transcribed | no legacy parameter reused |
| probability of extensive failure treated as DR | state probability and state cost typed separately |
| 42% missing asset response set to zero | every unsupported unit remains null |
| successful tracker stow defaulted | attained state and exact qualification required |
| zero-wind logistic subtraction changed parameter meaning | native ordered-state form; no intercept subtraction |

The old 3-second-gust-mph axis was internally consistent in units. Correcting units would not fix its endpoint,
denominator, coverage, or state problems.

The legacy full-asset DR is not numerically compared with v2 failure-unit DR because axis, unit, denominator,
covered value, and architecture differ. The approximate legacy 48-percent ceiling is an artifact of weights
and zeroed remainder, not a v2 target.

## Ceferino

Ceferino's source-native quantity remains probability of a composite site extensive-failure state. It is an
external pressure test, not a generic module, rack, tracker, GSU, or economic-DR record. The approximate
`v=90 m/s`, `beta=0.15` diagnostic is not used in v2.

## Strong-wind-v2 adjacent proposal

The adjacent package donates architecture, state taxonomy, evaluator patterns, and an explicit synthetic
response envelope. Its numerical values are not treated as convective empirical evidence and are not called
TC evidence.

The v2 assumption is narrower:

```text
if a cell-local bridge creates materially compatible normalized delivered demand,
then reuse one common synthetic response envelope rather than invent a hazard-label shift.
```

The shared profile remains non-runtime and audit-only. Each cell separately adopts and owns its governed
records; no output-bearing bundle loads the candidate.

## Other neighboring cells

- `tropical_cyclone_wind_wind` Jaimes curves are turbine/tower source records and never transfer to solar.
- flood-solar/flood-wind substation response never transfers to TC wind.
- the Perry route remains mutually exclusive with the generic fixed route.
