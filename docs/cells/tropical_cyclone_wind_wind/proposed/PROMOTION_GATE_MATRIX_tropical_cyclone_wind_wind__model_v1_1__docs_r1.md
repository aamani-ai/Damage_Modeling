# Promotion gates — tropical_cyclone_wind_wind model v1.1

| Gate | Requirement | State |
|---|---|---|
| source preservation | all three v1.0 records and 24 formula answers reproduce | **pass** |
| proxy identity | exact policy, asset profile, value basis and target selector required | **pass** |
| no invented scaling | proxy parameters equal source; `5/3.3` scaling prohibited and tested | **pass** |
| axis | exact 10 m, 3-second, km/h input; incompatible axes fail closed | **pass** |
| value | rotor+nacelle+tower = 0.63; remainder = 0.37 withheld | **pass** |
| schema | bundle v3, capability v3 and emit v2 execute | **pass** |
| proxy speed completion | full active-grid boundary exposure measured; zero/cap branches flagged and KAT-gated | **pass** |
| consumer M2 | all 1,773 active cells measured; node-aware selected | **pass** |
| consumer cap | occurrence and annual loss cannot exceed covered value | **pass** — max event loss `$88.2M` |
| consumer full grid | all governed cells, zeros, geography and event identities pass | **pass** — 13,085/13,085 |
| durable publication | create-only Damage artifact and Hazard output, manifest last | **Damage pass**; Hazard recipient pending |
| owner review | screening grade and partial-value display approved | **pass** |

**Outcome, 2026-08-14:** model v1.1 moved to `current/` after the exact local Hazard consumer passed. Damage
published create-only at `gs://infrasure-benchmark/damage_artifacts/dev/tropical_cyclone_wind_wind/model_v1_1__docs_r1/`.
The v1.0 exact bytes remain an offline reproduction archive, not a live GCS pin. Hazard recipient publication
is the remaining half of the controlled cutover.
