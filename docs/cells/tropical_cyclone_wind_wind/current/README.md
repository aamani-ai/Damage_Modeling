# tropical_cyclone_wind_wind current — model v1.0 / docs r1

> **Canonical source-native partial-screening release · 2026-08-09.** This package makes three published
> Jaimes turbine/tower expected-damage curves available through the common bundle-v3 Damage/Hazard seam. It
> is not a generic modern-turbine or whole-wind-farm loss model.

## Released numerical scope

| Failure unit | Exact selector | Native axis | Result |
|---|---|---|---|
| `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT` | generic 1 MW / 44 m / 50 m | 3-second peak gust at 10 m, km/h | conditional scalar mean DR |
| same source-native unit | generic 2.5 MW / 80 m / 90 m | same | conditional scalar mean DR |
| same source-native unit | generic 3.3 MW / 100 m / 114 m | same | conditional scalar mean DR |

All records use the published thresholded expected-damage form. Inputs from 108 through 252 km/h evaluate;
90 km/h and below return the paper's assumed zero branch with a limitation flag; the open interval from 90
to 108 km/h and values above 252 km/h withhold. Saffir-Simpson category, one-minute sustained wind,
hub-height wind, other units, nearest-neighbor turbine selection, and modern-fleet substitution are not
accepted aliases.

The standard turbine-equipment assembly, foundation, pad electrical, collection, GSU/substation,
control/SCADA, civil, and support units remain explicit `withheld`, not zero. The paper-native denominator is
not approved as a CWER tower value, turbine-equipment value, wind-farm physical value, or project TIV.
Consequently scenario dollars, whole-farm DR, EAL, PML, VaR, and TVaR remain withheld.

## Canonical files

- [Curve artifact](tropical_cyclone_wind_wind__model_v1_0__docs_r1__curve_artifact.json)
- [Capability declaration](tropical_cyclone_wind_wind__model_v1_0__docs_r1__capability.json)
- [Known-answer tests](known_answer_tests_tropical_cyclone_wind_wind__model_v1_0__docs_r1.json)
- [Derivation dossier](tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_0__docs_r1.md)
- [Metadata specification](tropical_cyclone_wind_wind_damage_code_metadata_spec__model_v1_0__docs_r1.md)
- [Audit workbook](damage_curve_records_tropical_cyclone_wind_wind__model_v1_0__docs_r1.xlsx)
- [Release decision](RELEASE_DECISION_tropical_cyclone_wind_wind__model_v1_0__docs_r1.md)
- [Validation report](VALIDATION_REPORT_tropical_cyclone_wind_wind__model_v1_0__docs_r1.md)

The v0.1 zero-curve scaffold and the pre-promotion v1 research package remain under `../proposed/`. They are
audit history, not alternate runtime pointers. The artifact index is the authoritative repository-current
pin; the portable v2.5 package is unchanged.
