# Legacy evidence ingestion — Hazard flood/wind placeholders

## Frozen source pins

| Object | Pin |
|---|---|
| Hazard repository commit | d876ef7190ef6baf7339cb32cb95a77bde89af4d |
| M3 file | Hazard_modeling/Notebooks/flood/wind_farm/m3_damage/01_damage.py |
| M3 git blob | 1c50b845064a1f168090bfe3180bf23779375d90 |
| M3 SHA-256 | b45fba70544d348638be4f3ad6af65193a272bbe2b4b25098128fa8b810a159e |
| M4 file | Hazard_modeling/Notebooks/flood/wind_farm/m4_loss_metrics/01_loss_metrics.py |
| M4 git blob | 11a28fd72557847dd2fe12a48bdc5972d9f58352 |
| M4 SHA-256 | 7f91344b4495a2899be6475350728dd8d5f114052270f6221e2c4c7b82f7adfa |

## Characterized behavior

The legacy code hardcodes seven project shares: rotor 0.26, nacelle 0.21, tower 0.16, foundation 0.12,
electrical 0.09, civil 0.07, and substation 0.09. Flood logistics exist for electrical, substation, civil,
and foundation. The stated logistic ceiling L is not the emitted asymptote because raw damage at zero is
subtracted without renormalization.

| Bucket | L | k | x0 ft | Actual asymptote after anchoring | Maximum TIV contribution |
|---|---:|---:|---:|---:|---:|
| electrical | 0.90 | 3.00 | 0.75 | 0.814185 | 0.073277 |
| substation | 0.95 | 2.50 | 1.50 | 0.928171 | 0.083535 |
| civil | 0.70 | 1.20 | 2.00 | 0.641779 | 0.044925 |
| foundation | 0.40 | 0.80 | 3.00 | 0.366731 | 0.044008 |

The combined maximum is approximately 0.245744 of TIV, not the prose-implied 0.37. Electrical plus
substation alone maxes near 0.156812. These are characterization fixtures only.

## Rejection reasons

- no curve provenance or representative calibration;
- project-level buckets do not match physical replacement units;
- 9% substation is unsupported and can double count the public 72 USD/kW mixed electrical row;
- the input depth is not tied to a component datum;
- a synthetic centroid can stand in for a real substation;
- missing ground/elevation state can be converted into dry exposure;
- M4 independently reconstructs the response, creating a bypass.

## Permitted use

Use the exact frozen formula and vectors only for regression comparison, shadow migration, and explaining
historical outputs. Do not use them as calibration, fallback, evidence tiers above T4, or values in the new
cell.

## Retirement condition

Retire the legacy path only after a reviewed flood-wind model is pinned by model/docs/schema/SHA, M3 and M4
both read the same governed artifact, shadow results are reviewed, no-bypass tests pass, and rollback is
documented.

