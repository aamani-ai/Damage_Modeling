# Tropical-cyclone wind × onshore wind model reference

```yaml
cell_id: tropical_cyclone_wind_wind
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_PROPOSED_V0_1
semantic_damage_model_version: model v0.1
human_documentation_revision: docs r1
runtime_documentation_revision: none
consumer_pin: none
canonical_runtime_artifact: false
artifact_schema: damage_curve_record_bundle.v1
capability_schema: capability_declaration.v1
proposed_artifact_sha256: bfb846d411f430d6e62123e462439b9edc2df9be88cccbda80044b7adfe63d81
change_class: NEW_CELL_SCAFFOLD
runtime_behavior_changed: false
```

## Authority and interpretation

The [curve artifact](../proposed/tropical_cyclone_wind_wind__model_v0_1__docs_r1__curve_artifact.json) and
[standalone capability](../proposed/tropical_cyclone_wind_wind__model_v0_1__docs_r1__capability.json) control
the exact fail-closed behavior. The [dossier](../proposed/tropical_cyclone_wind_wind_curve_derivation_dossier__model_v0_1__docs_r1.md),
[metadata contract](../proposed/tropical_cyclone_wind_wind_damage_code_metadata_spec__model_v0_1__docs_r1.md),
registers, and workbook explain the decision. No example is an observation unless explicitly labelled.

## Canonical failure-unit inventory

| ID | Subsystem/component | Treatment | Axis | Value/exposure basis |
|---|---|---|---|---|
| `WT_TURBINE_EQUIPMENT_ASSEMBLY` | rotor + nacelle + tower | candidate dependency-safe state model; no curve | future delivered TC turbine demand | 1,090 2023 USD/kW reference; per turbine |
| `WT_FOUNDATION` | foundation/base | separate candidate; no zero assumption | future wind-only foundation demand | 120; turbine point |
| `WT_EXTERNAL_ELECTRICAL` | pad equipment, collection, substation/control | split required; no curve | unit-specific future demand | 72; point/line/network |
| `WT_CIVIL_INFRA` | roads, pads, buildings, fence/facilities | split required; no curve | unit-specific future demand | 47; network/polygon |
| `SUPPORT_FIELDWORK` | assembly/installation | support once | none | 100; allocate after damage |
| `SUPPORT_TRANSPORT_LOGISTICS` | turbine transport | support once | none | 194; allocate after damage |

Soft/sunk/nonphysical rows are excluded in the value crosswalk and are not failure units. Coverage reconciles
to 1,623 physical and 1,968 installed 2023 USD/kW. Withheld means unknown/not released, not zero.

## Candidate structural functions — audit only

### Jaimes DS3 tower-wall buckling/collapse

```text
axis: 3-second peak gust at 10 m, km/h
valid simulated range: 108 to 252 km/h
P_DS3(v) = Phi((ln(v) - mu) / sigma)
runtime enabled: false
```

| Exact generic model | Hub / rotor | `mu ln(km/h)` | `sigma` | Median km/h |
|---|---|---:|---:|---:|
| 1 MW | 44 m / 50 m | 5.3165 | 0.0485 | 203.669789 |
| 2.5 MW | 80 m / 90 m | 5.2276 | 0.0516 | 186.345038 |
| 3.3 MW | 100 m / 114 m | 5.1642 | 0.0567 | 174.897485 |

The 1 MW paper record has a source discrepancy: Table 2 says 44 m hub height while Figure 5's caption says
40 m. This package uses Table 2 and flags the mismatch. All three are generic fixed-base, parked/feathered
simulation archetypes and are not generic modern-fleet selectors.

### Rose tower-buckling validation

```text
axis: 10-minute hub-height wind, knots
P(v) = 1 / (1 + (alpha/v)^beta)
runtime enabled: false
```

| NREL 5-MW state | `alpha` knots | `beta` |
|---|---:|---:|
| active yaw, rotor aligned | 174 | 19.3 |
| non-yaw, rotor perpendicular | 140 | 18.6 |

These two functions are not averaged and unknown yaw does not default to either one.

### Exact-value audit view

```text
Jaimes DS3 probability at selected native-axis speeds

model       160 km/h       180 km/h       200 km/h       220 km/h
1 MW          ~0.0000         0.0054         0.3539         0.9441
2.5 MW         0.0016         0.2510         0.9147         0.9994
3.3 MW         0.0582         0.6940         0.9910         ~0.9999

0.00 |--------------------------------------------------| 1.00
                         audit probability only
```

No y-value in this section is a damage ratio or runtime output.

## Input field dictionary

### Identity and source fields

| Field | Unit/reference | Requirement | Meaning | Missing behavior |
|---|---|---|---|---|
| `event_id` | identifier | required | physical occurrence | reject |
| `event_family_id` | identifier | required | compound-event parent | reject |
| `pathway_id` | enum | required exact `tropical_cyclone_wind` | route identity | reject; no fallback |
| `source_wind_speed_mps` | m/s | required for research-state validation | upstream wind value | withhold |
| `source_wind_height_m` | m AGL | required | source reference height | withhold |
| `source_wind_averaging_period_s` | seconds | required | source averaging period | withhold |
| `source_wind_exposure_standard` | identifier | required | terrain/exposure convention | withhold |
| `source_wind_product_id` | identifier | required | hazard lineage | withhold |

`saffir_simpson_category` may accompany storm metadata but is prohibited as the damage x-axis.

### Bridge and delivered demand

| Field | Unit/reference | Requirement | Meaning | Missing behavior |
|---|---|---|---|---|
| `tc_bridge_model_id` | versioned ID | required for future runtime | source-to-turbine demand bridge | no runtime curve |
| `hub_height_m` / `rotor_diameter_m` | m | future required selectors | turbine geometry | withhold |
| `hub_height_10min_wind_mps` | m/s | bridge output candidate | hub mean | capture only |
| `hub_height_3s_gust_mps` | m/s | bridge output candidate | hub short gust | capture only |
| `rotor_effective_3s_gust_mps` | m/s | bridge output candidate | rotor-area demand | capture only |
| `duration_above_threshold_s` | seconds plus threshold ID | candidate conditioner | duration | capture only |
| `direction_change_deg` | degrees plus window | candidate conditioner | rapid veer | capture only |
| `turbulence_descriptor` | model/value | candidate conditioner | fluctuation/load state | capture only |
| `bridge_uncertainty` | distribution/metadata | future required | transformation uncertainty | withhold if absent |

### Selectors, conditioners, exposure, and value

| Role | Fields | v0.1 rule |
|---|---|---|
| Selector | rating, make/model, tower geometry, IEC/TC class, TMD, design vintage | capture; no numeric credit |
| Conditioner | parked/operating, yaw, pitch, brake, grid, backup, control-history basis | preserve unknown; no silent favorable/worst default |
| Exposure | turbine IDs/count, per-turbine demand, line/polygon intersection, at-risk fractions and basis | explicit by physical subject; no whole-farm default |
| Value | basis ID, source row, same-unit direct value, support allocation | reference ledger only; loss disabled |

### Outputs

| Field | v0.1 value |
|---|---|
| `failure_unit_scalar_dr` | `null`, `withheld`, `NO_RUNTIME_CURVE` |
| `scenario_loss_given_value_basis` | `null`, `withheld`, `NO_RUNTIME_CURVE` |
| `scalar_eal` | `null`, withheld also for missing frequency/cap preflight |
| `pml`, `var`, `tvar` | `null`, withheld also for no tail distribution |

## Value crosswalk summary

| Bucket | 2023 USD/kW | Treatment | Key guardrail |
|---|---:|---|---|
| turbine-equipment assembly | 1,090 | candidate direct denominator | not a DR cap; per turbine |
| foundation + civil + electrical | 239 | separate/split/withheld | never inherit assembly DR |
| fieldwork + transport | 294 | support once | no independent curve |
| physical reference | 1,623 | reconciliation/reporting only | no pooled physical-base DR |
| excluded soft/sunk | 345 | outside physical cell | no reintroduction through scaling |
| installed reference | 1,968 | reporting only | not site TIV |

The exact 24-row map is in [VALUE_CROSSWALK](../proposed/VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv).

## Parameter tiers and update triggers

| Parameter/rule | Tier | Basis | Update trigger |
|---|---|---|---|
| NHC 60 s / 10 m semantics | T2 | official definition | definition change |
| Jaimes/Rose candidate parameters | T3 | modeled, partial/adjacent asset match | exact-archetype validation + economics |
| reference values | T2 with limits | NREL CWER | new vintage/site appraisal |
| support-once rule | T4 | governance/value interpretation | claims-backed allocation |
| no runtime curve | T4 governance | incomplete evidence chain | reviewed model v1.0 |

See the full [parameter-tier table](../proposed/PARAMETER_TIER_TABLE_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv).

## Capability and reportability

The cell carries no intrinsic spread and populates no numeric emit mode. A downstream consumer cannot turn
the candidate fragility, reference value, or complete site input into DR, loss, EAL, PML, VaR, or TVaR.
Frequency and cap binding are downstream prerequisites but cannot overcome `NO_RUNTIME_CURVE`.

## Complete illustrative event assembly

All inputs below are **class-template**.

| Item | Value | Status/result |
|---|---:|---|
| NHC-compatible 10 m, one-minute wind | 60 m/s | accepted upstream descriptor |
| event/pathway identity | complete/exact | accepted |
| turbine geometry/state | present | captured only |
| named approved TC bridge | absent | runtime demand withheld |
| turbine-equipment value | 1,090 USD/kW reference | reporting/audit only |
| exposed turbine fraction | 0.25 class-template | no loss implication |
| failure-unit DR | — | `null`; `NO_RUNTIME_CURVE` |
| scenario loss | — | `null`; `NO_RUNTIME_CURVE` |

```text
contribution to reportable loss
turbine equipment | [WITHHELD]
foundation        | [WITHHELD]
electrical        | [WITHHELD]
civil             | [WITHHELD]
support           | [WITHHELD]
```

## Validation checklist

The final validation report records JSON/schema checks, capability equality, zero curves, KAT and numeric
output guards, CSV rectangularity/source resolution, formula-driven value reconciliation, candidate-formula
reproduction, workbook formula/error scanning, rendering/visual inspection, and package-integrity checks.
Scientific promotion remains blocked; structural validation is not calibration.

## Source register — key records

| ID | Role | Permitted use |
|---|---|---|
| `TCWW-S001` | NHC axis | source wind semantics |
| `TCWW-S002` | IEC selector | TC design lineage |
| `TCWW-S003` | Rose validation | yaw-state tower-buckling audit |
| `TCWW-S005` | Jaimes candidate | exact-archetype DS3 audit |
| `TCWW-S006` | EPRI mechanism/gap | conditioner inventory and fail-closed basis |
| `TCWW-S007` | eyewall loads | veer/direction/turbulence relevance |
| `TCWW-S008`/`S009` | field cases | terminal-mode plausibility/selectors |
| `TCWW-S010` | NREL CWER | reference values |

## Version history and non-change

Model v0.1/docs r1 is an unreleased, pressure-tested scaffold on library v2.5 with zero curve records and no
artifact hash/pin. It does not change any current model or Hazard behavior. A numerical behavior change must
be released as at least model v1.0, reviewed, indexed, hash-pinned, and explicitly migrated by the consumer.
