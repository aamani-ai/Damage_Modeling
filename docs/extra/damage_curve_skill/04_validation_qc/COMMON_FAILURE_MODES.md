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
- source-native hazard variable differs from curve-native demand;
- coarse hazard class is silently converted to local component demand;
- a universal converter hides geometry, duration, shielding, contact, or event state.
- metadata, JSON, site-adapter, and known-answer-test inputs use different field names without an explicit alias/group mapping.
```

## Pathway failures

```text
- tornado, straight-line wind, or another mechanism is represented by a boolean/curve shift;
- pathway_id is treated as a selector, conditioner, exposure, or inferred from intensity;
- one global axis/bridge/evidence chain is reused across physically different pathways;
- unsupported pathway × failure-unit pairs borrow a neighboring curve;
- KATs cover one pathway but the cell is declared globally supported;
- a hurricane/tropical-cyclone pathway is implied by a high-wind/tornado cell without separate governance;
- consumer cutover occurs without exact model/docs/schema/SHA pin verification.
```

## Evidence failures

```text
- bibliography exists but load-bearing claims have no exact locators;
- source observation is promoted from ignition to failure, replacement, or economic DR;
- legacy equation is adopted without reproducing its own table;
- citation identity or endpoint does not match the claim;
- plausible-looking low/base/high values are called uncertainty without calibration;
- an unsupported curve is merely lowered and labeled conservative.
```

## Site-condition and value failures

```text
- fence, wall, firebreak, vegetation, burial, enclosure, or suppression gets blanket credit;
- a control is applied in both delivered exposure and vulnerability/value allocation;
- code/guidance requirement is treated as a measured efficacy coefficient;
- unknown mitigation receives credit or unknown exposure defaults to one;
- protected and exposed value are pooled silently;
- support/logistics receive a DR and are also scaled with direct loss;
- whole-site value is used as a component-curve denominator.
```

## Reportability failures

```text
- scalar EAL reported without cap preflight;
- PML/VaR emitted from scalar DR;
- insurance premium treated as expected loss;
- BI/downtime mixed with physical damage;
- no-curve scaffold contains numeric DR/loss fixtures that downstream users can mistake for outputs;
- caveated numbers are emitted where capability should be withheld.
```
