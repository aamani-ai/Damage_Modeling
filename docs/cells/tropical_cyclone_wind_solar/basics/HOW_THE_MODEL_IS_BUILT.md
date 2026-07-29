# How tropical-cyclone wind × solar model v2.1 is built

## 1. Preserve the valid earlier work

V2.1 keeps the v2.0 Perry compatibility record and four fixed/tracker array records unchanged. It does not
restore the old Ceferino/logistic notebook.

## 2. Complete direct/civil coverage

Five explicit Tier-4 ordered-state records cover foundation, power conversion/collection, GSU/substation,
SCADA/communications, and civil infrastructure. They use a qualified site-facility event/design pressure
ratio, separate from the array axis.

## 3. Keep probability and damage distinct

```text
P(exact state) = ordered exceedance differences
failure-unit DR = sum(P(exact state) × same-unit state cost ratio)
```

The model never assigns `P(failure)` directly as an economic damage ratio.

## 4. Attach a complete named value basis

The reference profile carries 877.7957023626668 2024 USD/kWdc of physical replacement value. All direct and
civil value is bound to numeric unit curves. Replacement support is not independently damaged; its value is
allocated once using the value-weighted direct/civil DR.

## 5. Emit the usable view

The helper emits schema-valid failure-unit results plus:

- physical loss per kWdc;
- physical replacement DR;
- installed-capex physical loss fraction;
- scenario dollars when capacity is supplied.

## 6. Preserve the real scope boundary

The curve is wind-only physical damage. Rain, debris, surge/flood, and tornado remain separate pathways.
Hazard owns frequency/EAL/annual tails, and the disruption layer owns downtime/BI.

## Governed files

- [Derivation dossier](../proposed/tropical_cyclone_wind_solar_curve_derivation_dossier__model_v2_1__docs_r1.md)
- [Metadata contract](../proposed/tropical_cyclone_wind_solar_damage_code_metadata_spec__model_v2_1__docs_r1.md)
- [Curve artifact](../proposed/tropical_cyclone_wind_solar__model_v2_1__docs_r1__curve_artifact.json)
- [Validation report](../proposed/VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v2_1__docs_r1.md)
