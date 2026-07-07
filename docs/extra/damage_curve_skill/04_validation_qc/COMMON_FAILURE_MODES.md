# Common failure modes

## Versioning failures

```text
- docs-only change bumps model version;
- parameter change does not bump model version;
- new scaffold labeled v1.0;
- package version interpreted as curve version.
```

## Grain failures

```text
- component curve used as whole-asset DR;
- subsystem blend used instead of canonical failure-unit curve;
- value denominator silently changes.
```

## Axis failures

```text
- 10 m gust fed into hub-height curve;
- feet/meters or mph/mps mismatch;
- water depth datum not tied to component datum;
- source-native hazard variable differs from curve-native demand.
```

## Reportability failures

```text
- scalar EAL reported without cap preflight;
- PML/VaR emitted from scalar DR;
- insurance premium treated as expected loss;
- BI/downtime mixed with physical damage.
```
