# Legacy and consumer reopening - hail_wind model v0.1/docs r2

## Decision

The legacy curve remains rejected, and the deep pass found a stronger reason to treat it as an active
migration risk: legacy wind configuration files still assign the wrong-asset `Real Estate_Hail` curve to
multiple wind-facility subjects.

## Curve lineage

| Location | Finding |
|---|---|
| `../hazard_analysis/tools/damage_curves/tables/damage_curve_tables_DEPRECATED.py:132-140` | Table is keyed as `('Real Estate', 'Hail')` and cites Schmid buildings/cars |
| `../hazard_analysis/tools/damage_curves/data/damage_curves_data.csv:11-24` | Current array remains `Real Estate_Hail` |
| `../hazard_analysis/tools/damage_curves/data/damage_curves_metadata.csv:3` | Metadata has no `Wind_Hail` row |
| `../hazard_analysis/tools/damage_curves/parameters/damage_curve_parameters_anchored_logistic.json:23-42` | Wrong-asset logistic fit: `L=0.05803692546`, `k=6.20155374175/in`, `offset=0.00051415527`, `x0=0.7606820875 in` |

The source's 0-4 cm grid was converted to approximately 0-1.57 inches and then its 5.78% plateau was
extended through 4 inches. Wrong asset, wrong endpoint, unit/grid mismatch, and invented extension are each
independently disqualifying.

## Active legacy mappings

| Location | Wrong mapping |
|---|---|
| `../hazard_analysis/config/subsystems/wind_config_default.csv:15,22` | Nacelle and rotor hail response use `Real Estate_Hail` |
| `../hazard_analysis/config/subsystems/wind_config_as_asset.csv:2,12,22,32,42,52,62` | Rotor, nacelle, substation, electrical, tower, foundation, and civil all use `Real Estate_Hail` |
| `../hazard_analysis/config/subsystems/subsystem_configurations.csv:125,138,153,168,178,185,195,201,213` | Consolidated configuration repeats the wrong-asset mappings |
| `Learning/Risk/Hazard Risk/Reference/infrasure_l2_l3/Layer_2_hazard_risk_modeling/damage_modeling.md:133-142,631` | Learning note mislabels the array as empirical wind-turbine evidence |

The old `infrasure-damage-curves/data/master_curve_index.json` has HAIL x solar but no governed HAIL x wind
family. There is no canonical predecessor to migrate.

## Hazard consumer seam

The current Hazard planning material is useful for spatial structure:

- `Hazard_modeling/docs/plans/hail/hail-wind-farm.md:53-86` uses per-turbine point coupling but describes
  the missing curve and equal-value approach as provisional/experimental;
- `Hazard_modeling/docs/discussion/hail/hail-wind-farm-exposure-model.md:51-116` separates sparse turbine
  points from BOP and says the curve must be source locked; and
- no `Hazard_modeling/Notebooks/hail/wind/` implementation exists.

Four future adapter controls are mandatory:

1. normalize `mesh_mm`, hail-solar `mesh_diameter_mm`, and Hazard `peak_intensity_in/mm` explicitly;
2. preserve event-peak MESH as a source descriptor, not blade-local contact demand;
3. bind `WT_BLADE_ASSEMBLY` DR only to same-blade value, not equal whole-turbine value; and
4. after per-turbine intersection, do not multiply damage by a second farm-level `hit_fraction`.

## Negative regression requirements

A future candidate or cutover must prove:

```text
[ ] no Real Estate_Hail record can select hail_wind
[ ] no legacy anchored-logistic parameters are present
[ ] no source-diameter field silently becomes blade contact demand
[ ] no solar hail curve can select a blade record
[ ] no blade DR is applied to whole-turbine or BOP value
[ ] per-turbine exposure is applied exactly once
[ ] unknown BOP geometry/value remains withheld, not zero or fully exposed
```

This audit changes no external repository. It records the migration target and guards this cell against
accidental legacy reuse.
