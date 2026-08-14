# Promotion gates — tropical_cyclone_wind_wind model v1.1

| Gate | Requirement | State |
|---|---|---|
| source preservation | all three v1.0 records and 24 formula answers reproduce | **pass** |
| proxy identity | exact policy, asset profile, value basis and target selector required | **pass** |
| no invented scaling | proxy parameters equal source; `5/3.3` scaling prohibited and tested | **pass** |
| axis | exact 10 m, 3-second, km/h input; incompatible axes fail closed | **pass** |
| value | rotor+nacelle+tower = 0.63; remainder = 0.37 withheld | **pass** |
| schema | bundle v3, capability v3 and emit v2 execute | **pass** |
| consumer M2 | centroid-versus-node decision measured | open |
| consumer cap | occurrence and annual loss cannot exceed covered value | open |
| consumer full grid | all governed cells, zeros, geography and event identities pass | open |
| durable publication | create-only Damage artifact and Hazard output, manifest last | open |
| owner review | screening grade and partial-value display approved | open |

**Promotion rule:** the source package passing does not move `current/`. Promotion occurs only with the exact
Hazard consumer in the same controlled cutover and with model v1.0 retained as rollback.

