# Legacy evidence ingestion — wildfire_wind model v0.1/docs r1

## Materials reviewed

1. `infrasure-damage-curves/research/WILDFIRE_x_WIND.md`.
2. The legacy master-curve index entries for wildfire × wind rotor, nacelle, and tower.
3. The current `wildfire_solar` package as a governed neighboring-cell reference.
4. Repository method, pathway, value, evidence, capability, and release standards.

## What the legacy material contains

The legacy note proposes three independent logistics:

| Legacy target | Logistic form | Reported parameters | Legacy input treatment |
|---|---|---|---|
| Rotor | Logistic | `L=0.10`, `k=0.00008`, `x0=75000 kW/m` | FLI converted through fixed 10 m radiation factor and height attenuation |
| Nacelle | Logistic | `L=0.15`, `k=0.00006`, `x0=80000 kW/m` | Same general bridge, plus enclosure/internal-fire narrative |
| Tower | Logistic | `L=0.50`, `k=0.00045`, `x0=6000 kW/m` | Same general bridge, plus tower/internal cable/oil narrative |

The numerical forms are transparent enough to inventory but not qualified enough to reuse.

## Independent disqualifiers

1. **Axis mismatch.** FLI in kW/m is not target incident flux in kW/m², firebrand deposition, or residue
   dose.
2. **Unsupported bridge.** A fixed 10 m distance, `q = 0.35 I / d`, and generic height attenuation do not
   preserve flame geometry, view, shielding, convection, contact, duration, or target orientation.
3. **Wrong causal evidence.** Several incident examples are equipment-origin, electrical, lightning, or
   maintenance fires, not exogenous wildfire attack.
4. **Unproven curve form and parameters.** Logistic caps, slopes, and midpoints are expert logistics rather
   than source-derived failure-unit response.
5. **Overlapping dependency.** Separate rotor, nacelle, and tower terminal losses can double-charge one
   turbine fire/replacement state.
6. **Coverage omission.** Pad electrical, collection, GSU apparatus, controls/met/O&M, foundation, civil,
   and support/value treatment are absent or unresolved.
7. **Economic seam.** No inspected state to same-unit direct-cost calibration is supplied.

## Governed disposition

```yaml
decision: REJECT_RUNTIME_RETAIN_AUDIT
FLI_to_flux_conversion_reuse: prohibited
height_attenuation_reuse: prohibited
curve_form_reuse: prohibited
threshold_cap_ordinate_reuse: prohibited
incident_calibration_reuse: prohibited
validation_use: negative_regression_and_migration_warning_only
```

The legacy rotor/nacelle/tower parameters do not enter `curve_records`, candidate thresholds, KAT numeric
expectations, or default selectors. They remain visible only so future work cannot silently reproduce them.

## Neighboring wildfire_solar disposition

The solar cell is governed more strongly than the legacy wind note and may be used for:

- FSim product semantics and exact class handling;
- source discovery followed by independent wildfire-wind registration;
- pathway/selector/conditioner/exposure vocabulary; and
- fail-closed governance patterns.

The following do not transfer: solar categorical ordinates, weights, caps, vulnerability ordering, module/
tracker/GSU value shares, runtime release status, or evidence-tier conclusions about wind equipment.

## Runtime rule

No legacy or solar numerical response appears in the wildfire-wind runtime envelope. Every valid model-v0.1
request returns a null/withheld response with `NO_RUNTIME_CURVE`.
