# Tropical-cyclone wind × onshore wind — how the model is built

Use the [basics README](README.md) for a first explanation and the [model reference](MODEL_REFERENCE.md) for
exact fields and candidate parameters.

```yaml
cell_id: tropical_cyclone_wind_wind
cell_model_version: model v0.1
human_documentation_revision: docs r1
canonical_runtime_pin: none
canonical_runtime_artifact: false
proposed_artifact_sha256: bfb846d411f430d6e62123e462439b9edc2df9be88cccbda80044b7adfe63d81
change_class: NEW_CELL_SCAFFOLD
runtime_behavior_changed: false
```

## Authority order

```text
proposed JSON artifact + standalone capability
    -> exact fail-closed behavior

derivation dossier + metadata specification + governed registers
    -> rationale, evidence, fields, and promotion gates

basics folder
    -> reader-friendly synthesis
```

There is no current/canonical cell. Any numerical hurricane/wind-farm function in the Hazard consumer is a
legacy migration fixture until an approved artifact is indexed and pinned.

## Complete build path

```text
STAGE 0  QUESTION     Direct TC-wind physical destruction, not annual loss
STAGE 1  EVIDENCE     Preserve source-native fragility and mechanism evidence
STAGE 2  GRAIN        Repeated turbine assembly plus separate plant systems
STAGE 3  AXIS         Require a named TC height/time/direction bridge
STAGE 4  FORM         Retain collapse candidates; withhold economic DR
STAGE 5  ADJUSTMENTS  Separate selectors, conditioners, bridges, exposure, value
STAGE 6  EMIT         Null numeric metrics with NO_RUNTIME_CURVE
STAGE 7  SHIP         Proposed package only; no index, pin, or consumer change
```

## Stage 0 — modeling question

The intended endpoint is conditional direct repair/replacement cost ratio for the same failure unit after a
single tropical-cyclone wind occurrence. It excludes TC-spawned tornado, surge, flood, scour, debris, rain
ingress, offshore wave loading, fatigue, BI, financial terms, frequency, and annual/tail aggregation.

Neighboring mechanisms remain separate from this cell. TC-spawned tornado has a proposed, noncanonical
`tornado_direct_hit` route in the `wind_tornado_wind` v2/v3 work, but no current consumer cutover; the other
neighboring route IDs remain TBD. The same `event_family_id` coordinates compound hazards so the consumer
can prevent duplicate value charges.

## Stage 1 — evidence

| Source | Supports | Does not support |
|---|---|---|
| NHC glossary (`TCWW-S001`) | one-minute/10 m upstream wind semantics | hub/rotor demand or DR |
| IEC product page (`TCWW-S002`) | TC/high-turbulence design treatment and selector lineage | a failure median |
| Jaimes et al. (`TCWW-S005`) | three exact tower DS3 fragilities on 3-second/10 m/km/h axis | generic turbine economic DR |
| Rose et al. (`TCWW-S003`) | yaw-state sensitivity for NREL 5-MW tower buckling on 10-minute hub knots | onshore fleet or other components |
| EPRI (`TCWW-S006`) | evidence sparsity; duration/component and yaw/grid mechanisms | numerical calibration |
| Kapoor et al. (`TCWW-S007`) | eyewall veer/direction/turbulence load relevance | DR conversion |
| Usagi/Jangmi cases (`TCWW-S008`, `S009`) | terminal modes and asset-specific selectors | population probability/cost curve |
| NREL CWER (`TCWW-S010`) | row-level reference value ledger | damage probability or site value |

Candidate fragility parameters are Tier 3 because they are modeled and only partially match the target
asset. The NHC and CWER definitions are Tier 2 inputs. The support allocation and runtime withholding rules
remain Tier 4 governance decisions until claims or a governed elicitation improve them.

## Stage 2 — grain and coverage

```text
wind farm
|
+-- repeated turbine points
|   +-- WT_TURBINE_EQUIPMENT_ASSEMBLY
|   |   +-- blades/pitch/hub
|   |   +-- nacelle/drivetrain/power/yaw
|   |   +-- tower
|   +-- WT_FOUNDATION
|   +-- pad/cluster electrical equipment [future split]
|
+-- shared plant systems
|   +-- collection lines/network [future split]
|   +-- substation/control point [future split]
|   +-- civil/access network and polygons [future split]
|
+-- support after damage
    +-- fieldwork and installation
    +-- turbine transport/logistics
```

The assembly is one candidate loss atom because tower collapse, blade loss, nacelle damage, and controls are
dependent. A later model must use mutually exclusive states or an equivalent precedence-safe construction.
Foundation, external electrical, and civil value remain separate and withheld; none is assigned DR≈0.

## Stage 3 — axis

Source-native evidence axes remain explicit:

| Source | Native axis | Domain |
|---|---|---|
| NHC | one-minute wind at 10 m | storm-field descriptor, no damage domain |
| Jaimes | 3-second peak gust at 10 m, km/h | 108–252 km/h simulation range |
| Rose | 10-minute hub-height wind, knots | paper-native tower-buckling function |

The runtime target axis is `WITHHELD_PENDING_QUALIFIED_TC_BRIDGE`. A future bridge must name its model and
version and carry source height/averaging/exposure, target height/rotor/time meaning, terrain/topography,
gust conversion, duration, direction/veer, turbulence, and uncertainty. It must not silently apply one
global exponent or gust factor.

## Stage 4 — curve form

The Jaimes audit candidate is a lognormal fragility:

```text
P(DS3 | v) = Phi((ln(v_km/h) - mu_ln_km/h) / sigma_ln_km/h)
```

The Rose audit candidate is the paper's log-logistic tower-buckling form:

```text
P(buckling | v) = 1 / (1 + (alpha_knots / v_knots)^beta)
```

Both output a probability of a narrow structural state. Neither is an economic damage ratio. Jaimes'
economic state ratios are explicitly treated as assumptions, so no curve is placed in `curve_records`.

```text
candidate structural probability       retained for audit
all-severity state probabilities        missing
same-unit cost consequence by state     missing
runtime economic DR                     WITHHELD
```

## Stage 5 — adjustments

| Concept | Examples | Correct role in v0.1 |
|---|---|---|
| Selector | rating, hub/rotor size, tower geometry, IEC/TC class, TMD | capture; choose a future verified archetype |
| Conditioner | yaw, pitch, parked/operating, brake, grid, backup | preserve state; unknown earns no credit |
| Axis bridge | height/time/gust/duration/direction/turbulence | named transformation with provenance; none approved |
| Exposure | turbine count/fraction, line length, shared point/polygon intersection | identify value touched after severity |
| Value | same-unit direct replacement value | denominator, not fragility |
| Support | fieldwork and transport | allocate once after qualified damaged units |

No numerical state modifier, design-class credit, TMD credit, site shielding credit, or exposure default is
enabled in model v0.1.

## Stage 6 — emit

```yaml
spread_carried: false
emit_modes_populated_by_cell: []
failure_unit_scalar_dr: withheld
scenario_loss_given_value_basis: withheld
scalar_eal: withheld
pml: withheld
var: withheld
tvar: withheld
primary_reason: NO_RUNTIME_CURVE
```

Candidate audit probabilities cannot appear in a damage emit. A valid research input can pass field/axis
validation while the numeric result remains `null`.

## Stage 7 — ship

```text
cell/model/docs: tropical_cyclone_wind_wind / model v0.1 / docs r1
artifact schema: damage_curve_record_bundle.v1
capability schema: capability_declaration.v1
runtime SHA/pin: none
artifact index: unchanged
consumer migration: not authorized
```

Promotion to a numerical model requires an approved target axis and bridge, target-fleet applicability,
all-severity states, same-unit economic consequences, unit-specific value/exposure, uncertainty treatment,
KATs, independent review, index publication, and an explicit Hazard cutover.

## Cross-reference map

| Question | Source |
|---|---|
| Why no curve? | [Pressure test](../proposed/PRESSURE_TEST_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md) |
| What numbers were retained? | [Numerical candidate audit](../proposed/NUMERICAL_CANDIDATE_AUDIT_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md) |
| What fields are required? | [Metadata contract](../proposed/tropical_cyclone_wind_wind_damage_code_metadata_spec__model_v0_1__docs_r1.md) |
| How is value mapped? | [Value crosswalk](../proposed/VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv) |
| What would permit release? | [Promotion gates](../proposed/PROMOTION_GATE_MATRIX_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md) |
| What may Hazard consume? | [Handoff boundary](../../../contracts/hazard_handoff/tropical_cyclone_wind_wind_model_v0_1_boundary.md) |

## Non-change statement

This work does not change any current runtime input, equation, parameter, selector, conditioner, exposure,
value assembly, emit, artifact hash, package release, or consumer output. It creates a reviewable, fail-closed
starting point for the first tropical-cyclone wind × wind cell.
