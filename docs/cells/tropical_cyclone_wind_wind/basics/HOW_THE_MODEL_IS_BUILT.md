# How tropical-cyclone wind × onshore Wind Farm model v1.2 is built

Use the [basics README](README.md) for the short explanation and the [model reference](MODEL_REFERENCE.md) for
exact request fields and pins.

## Authority order

```text
current artifact + capability + KATs
    → exact runtime behavior

release decision + dossier + registers + value crosswalk
    → why that behavior is allowed and where it stops

Hazard production package
    → node-aware coupling, annual risk and recipient publication
```

## Complete build path

| Step | What happens | Guardrail |
|---|---|---|
| 1 · preserve | carry all three model-v1.0 Jaimes records | 24 reproduction answers must remain exact |
| 2 · name target | identify `CONUS_WIND_FARM_REFERENCE_V1` and its 5 MW / 100 m turbine | no generic modern-fleet alias |
| 3 · admit proxy | map only the named target to the 3.3 MW / 100 m source curve | exact opt-in IDs; no `5/3.3` scaling |
| 4 · complete range | add flagged proxy-only behavior below 108 and above 252 km/h | source-native selectors do not change |
| 5 · bind value | apply DR to tower = 0.16 of TIV | other 0.84 stays withheld |
| 6 · validate M2 | compare centroid and node-aware coupling on all active Hurricane cells | node-aware selected from measured evidence |
| 7 · validate M3/M4 | run every governed cell and preserve event identity/zeros | 13,085/13,085 pass; covered cap enforced |
| 8 · release | promote one current artifact, update index/SHA, publish create-only | manifest is written last; prior prefix immutable |

## Why node-aware coupling matters

The canonical farm covers 30 km². One storm can produce different gusts across its 20 turbine nodes. The
full-population comparison found a maximum within-farm event spread of 84.09 mph. The CONUS-wide EAL change
was small (`−0.037%`), but local differences were real, so production retains the spatially honest choice.

## Why the two proxy-only range rules exist

- The `90–108 km/h` interval is below the paper's simulation range. Assigning flagged zero prevents silent
  event deletion; its full-active-population summed placement-EAL upper bound was `$10,564.85`.
- Above `252 km/h`, extrapolating the fitted equation is unnecessary and unsafe. The source declares
  `max_dr=1`, so the proxy caps there and records the branch.

These are governed screening completion rules, not new empirical evidence.

## What would replace this model

A target-matched 5 MW damage curve, improved component valuation, additional governed failure-unit curves,
or claims/field calibration would trigger a separately versioned model. They do not silently modify v1.2.

See the [release decision](../current/RELEASE_DECISION_tropical_cyclone_wind_wind__model_v1_2__docs_r2.md)
and [validation report](../current/VALIDATION_REPORT_tropical_cyclone_wind_wind__model_v1_2__docs_r2.md).
