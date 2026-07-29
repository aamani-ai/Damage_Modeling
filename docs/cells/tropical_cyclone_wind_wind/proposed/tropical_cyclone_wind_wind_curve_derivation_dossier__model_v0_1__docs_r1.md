# Tropical-cyclone wind × onshore wind derivation dossier — model v0.1/docs r1

## 1. Identity and disposition

```yaml
cell_id: tropical_cyclone_wind_wind
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_PROPOSED_V0_1
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
package_release: unreleased
package_baseline: library v2.5
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested
model_grade: no_runtime_curve_research_scaffold
canonical_runtime_artifact: false
curve_record_count: 0
runtime_reason: NO_RUNTIME_CURVE
```

This dossier documents the first governed tropical-cyclone wind × onshore wind-farm cell. Its main result is
negative but useful: public evidence supports narrow structural fragility candidates and a strong mechanism/
field design, but it does not yet close the chain to a representative all-severity same-unit economic DR.

## 2. Modeling question and boundary

For one tropical-cyclone occurrence, the intended future model asks:

```text
Given delivered turbine- or plant-unit TC-wind demand and verified asset/control state,
what is expected direct repair-or-replacement cost divided by the same failure unit's value?
```

### In scope

- direct physical destruction caused by the tropical-cyclone boundary-layer, eyewall, and rainband wind field;
- modern land-based multi-megawatt horizontal-axis turbines;
- repeated turbine equipment, foundations, and split plant electrical/civil systems;
- event-time duration, direction/veer, turbulence, yaw, pitch, operating, grid, and backup state;
- occurrence-based, single-site, current-climate modeling.

### Routed elsewhere or deferred

- TC-spawned tornadoes;
- surge, pluvial flooding, scour, saturated-soil/slope failure;
- debris impact and wind-driven-rain ingress as independent physical pathways;
- offshore wave/surge/corrosion and fixed/floating support structures;
- fatigue, rain erosion, lightning, fire, business interruption, curtailment, revenue;
- frequency, EAL, PML, VaR, TVaR, insurance and portfolio accumulation.

All compound child pathways retain the same `event_family_id` so the consumer can prevent duplicate charges.

## 3. Change classification

Primary class is `NEW_CELL_SCAFFOLD`; secondary classes are `EVIDENCE_ONLY_NO_OUTPUT_CHANGE` and `DOCS_ONLY`.
No current artifact, model pin, package release, schema, or consumer behavior changes. The scaffold lives under
`proposed/` because its output-bearing gates have not passed.

## 4. Reuse and re-derivation boundary

The strong-wind/tornado cell supplied useful asset substrate, not hurricane calibration.

| Reused | Re-earned or withheld |
|---|---|
| repeated-turbine anatomy and physical subject grains | every tropical-cyclone curve/threshold/probability |
| dependency concern among tower/rotor/nacelle | mutually exclusive hurricane damage states and consequences |
| NREL CWER row-level reference ledger | site/OEM values and unit-specific support rules |
| per-turbine versus line/point/network exposure discipline | hurricane wind footprint and bridge |
| exact pathway/event-family guardrails | numerical conditioner effects and consumer cutover |

The legacy Hazard hurricane/wind-farm code is copied convective logistics on fixed full-TIV shares with a
0.65 cap and zero tower/foundation/civil. It is frozen as a migration/regression fixture only.

## 5. Evidence strategy and bounded search

The evidence protocol prioritized:

1. official wind definitions/design standards;
2. peer-reviewed onshore turbine fragility and forensic cases;
3. peer-reviewed/technical mechanism evidence for eyewall wind, duration, direction, and controls;
4. public turbine value sources;
5. matched loss/disposition/cost evidence.

The bounded search log records surfaces, queries, inclusion/exclusion, and cutoff. Exact claims and parameter
decisions live in the claim and parameter registers. A reference is input, not authority; every permitted and
prohibited inference is explicit.

### Evidence conclusion

| Evidence endpoint | Finding |
|---|---|
| source wind semantics | sufficient for upstream metadata |
| TC-specific design/mechanisms | sufficient for selectors/conditioner inventory |
| exact modeled tower fragility | sufficient for audit candidates only |
| event/case terminal failures | sufficient for mechanism plausibility/selectors |
| representative modern-fleet applicability | insufficient |
| all-severity inspected disposition | insufficient |
| same-unit repair/replacement cost | insufficient |
| foundation/electrical/civil probability and cost | insufficient |

EPRI specifically notes the sparsity of modern utility-scale TC loss records and distinguishes short gusts
from duration-dependent component effects. Jaimes supplies reproducible structural fragilities but states
that its economic ratios are assumptions in the absence of matching wind-farm loss data.

## 6. Asset, physical tree, and failure units

```text
LAND-BASED WIND FARM
|
+-- repeated turbine point
|   +-- WT_TURBINE_EQUIPMENT_ASSEMBLY
|   |   +-- rotor: blades + pitch + hub
|   |   +-- nacelle: structure + drivetrain + electrical + yaw
|   |   +-- tower
|   +-- WT_FOUNDATION
|   +-- pad/cluster electrical [future split from WT_EXTERNAL_ELECTRICAL]
|
+-- shared systems
|   +-- collection line/network [future split]
|   +-- substation/control point/polygon [future split]
|   +-- WT_CIVIL_INFRA network/polygons [future split]
|
+-- support after qualified damage
    +-- SUPPORT_FIELDWORK
    +-- SUPPORT_TRANSPORT_LOGISTICS
```

### Why one turbine-equipment assembly?

Tower collapse or foundation overturning can destroy or require replacement of rotor and nacelle. Blade
failure can also damage tower/nacelle. Independent component curves risk charging terminal value more than
once. A later numeric model must therefore use exhaustive mutually exclusive states or another precedence-
safe dependency construction. Component substructure remains in the value ledger and inspection state; it is
not a license to add terminal losses.

Foundation failure creates a second dependency seam because foundation overturning or replacement can force
replacement of the turbine-equipment assembly. Promotion is blocked until foundation/equipment states and
their value precedence are jointly defined; separate unit identities do not authorize adding two terminal
replacement charges.

### Coverage roles

| Unit | Role | v0.1 |
|---|---|---|
| turbine-equipment assembly | primary candidate | no curve |
| foundation | primary/exception review | withheld, not DR≈0 |
| external electrical | split-required primary candidates | withheld |
| civil | split-required primary candidates | withheld |
| fieldwork/transport | support allocation | rule open, no curve |
| soft/sunk/financial | outside physical cell | excluded |

## 7. Hazard axis and bridge

### Source-native objects

- NHC maximum sustained surface wind: highest one-minute average at 10 m in unobstructed exposure.
- Jaimes: 3-second peak gust at 10 m in km/h, modeled from 108–252 km/h.
- Rose: 10-minute hub-height wind in knots.

These are not interchangeable. Saffir–Simpson category is context, not the curve x-axis.

### Future target

No runtime target axis is frozen. A preferred research direction is a named TC bridge that produces
hub-height 10-minute wind, hub/rotor 3-second demand, duration, direction/veer, and turbulence descriptors
with uncertainty. The bridge contract must preserve:

```text
source model/product/version
source height, averaging, exposure, units, valid time
terrain/topography and vertical-profile method
gust/averaging conversion and definition
rotor-effective or point-demand method
duration threshold and time window
direction/veer and turbulence definition
validity domain, uncertainty, flags
```

No global exponent or gust factor is adopted.

## 8. Candidate fragility records

### Jaimes DS3

```text
P(DS3|v) = Phi((ln(v_km/h)-mu)/sigma)
```

| Model | Rating/hub/rotor | `mu` | `sigma` | Use |
|---|---|---:|---:|---|
| J-1 | 1 MW / 44 m / 50 m | 5.3165 | 0.0485 | audit only |
| J-2 | 2.5 MW / 80 m / 90 m | 5.2276 | 0.0516 | audit only |
| J-3 | 3.3 MW / 100 m / 114 m | 5.1642 | 0.0567 | audit only |

Endpoint: DS3 tower-wall buckling/collapse. Applicability: exact generic fixed-base simulation archetype,
paper-native state and axis only. The Table 2/Figure 5 1-MW hub-height discrepancy is flagged.

### Rose

```text
P(buckling|v) = 1 / (1 + (alpha_knots/v_knots)^beta)
```

| State | `alpha` | `beta` | Use |
|---|---:|---:|---|
| active yaw aligned | 174 knots | 19.3 | adjacent validation only |
| perpendicular non-yaw | 140 knots | 18.6 | adjacent validation only |

Endpoint: binary tower buckling for the NREL 5-MW reference turbine. Unknown yaw is not mapped to either
state. The PNAS correction affects risk equations 6 and 8, not Eq. 5/Table 1.

### Rejected economic conversion

Fragility `P(DS)` is not DR. The required state assembly would be:

```text
DR = sum_s P(mutually_exclusive_state_s | demand, conditions)
             × E[same_unit_cost_ratio | state_s, selectors]
```

Neither paper supplies a representative all-severity/cost chain for the target cell. Consequently the
artifact retains the candidates as non-runtime evidence objects and sets `curve_records: []`.

## 9. Selectors, conditioners, exposure, and value

### Selectors

Make/model, rating, hub/rotor dimensions, tower geometry/material, foundation, design standard/class, TC class,
TMD, and design vintage select a future archetype. IEC/TC design class is not event intensity or automatic
damage credit.

### Conditioners

Operating/parked/emergency state, yaw, pitch, brake, grid, backup power, control-history basis, duration,
direction change, and turbulence may affect response. Mechanism evidence is sufficient to require their
capture, not to assign universal multipliers. Unknown receives no protection credit and does not default to a
chosen structural curve.

### Exposure

Turbines, foundations, and pad assets use point/per-unit exposure. Collection uses line/network exposure;
substation/control uses a shared point/polygon; civil requires asset-specific split. Lease overlap or exposed
turbine fraction cannot be copied to all systems.

### Value

NREL CWER provides a reference ledger in 2023 USD/kW:

```text
turbine equipment = 1090
other direct       = 239
support            = 294
physical           = 1623
excluded           = 345
installed          = 1968
```

The assembly share is 0.671595810228 of physical and 0.553861788618 of installed value. These are denominator
conversions, not DR caps. Reference values do not substitute for a site appraisal. Support is allocated once.

## 10. Legacy audit

The legacy research memo is rejected for runtime use because it contains contradictory axis conversions,
formula/table mismatches, component/aggregate inconsistencies, endpoint conflation, and citation identity
errors. The Hazard placeholder is rejected as calibration because it copies convective curves, uses fixed
full-TIV shares, caps total at 0.65, and converts missing tower/foundation/civil evidence into zero.

One factual source identity is corrected in the governed record: *Hurricane Resilient Wind Plant Concept
Study* is NREL/TP-5000-66869, not NREL/TP-5000-88195.

## 11. Capability and emit

Model v0.1 populates no numeric emit mode. Failure-unit DR, scenario loss, EAL, PML, VaR, and TVaR are all
withheld. Complete input data cannot bypass `NO_RUNTIME_CURVE`. Missing bridge, value, exposure, or frequency
may add reason codes; they never convert null to zero.

Intrinsic vulnerability spread is not carried. Any future probabilistic curve must distinguish response
variability from model-form/parameter uncertainty and paper-fit dispersion.

## 12. Validation and known-answer design

Validation covers:

- JSON parsing and v1 schema conformance;
- embedded/standalone capability equality;
- zero curves/canonical false/index absence;
- CSV rectangularity, unique IDs, and source resolution;
- exact value reconciliation and candidate formula reproduction;
- axis/pathway rejection and cross-axis guardrails;
- no numeric DR/loss output in all KATs;
- workbook formulas, error scan, rendering, and XLSX integrity;
- cell-local links and diff whitespace.

Passing these checks means the scaffold is coherent, not that a curve is calibrated. The v1 bundle schema is
used only as a noncanonical zero-curve scaffold envelope: repository-current v2/v3 schemas require at least
one curve record and therefore cannot represent an honest fail-closed new-cell scaffold. This exception is
recorded in the artifact and validation report and must not be used for a published runtime bundle.

## 13. Promotion plan

The preferred deep-curation sequence is:

1. define target fleet/archetypes and obtain exact turbine/control/value inventory;
2. freeze a turbine-local TC demand axis and validate the bridge;
3. acquire turbine-level affected/unaffected observations, control history, inspection/disposition, and cost;
4. build exhaustive mutually exclusive equipment states and separate plant-unit models;
5. estimate/calibrate state probabilities and same-unit economic consequences with uncertainty;
6. validate out of sample and pressure-test overlap, caps, denominators, and support allocation;
7. issue model v1.0, review, publish/index, hash-pin, and explicitly migrate Hazard.

If private data are unavailable, a structured elicitation may create a clearly Tier-4 screening model, but it
must be approved as such and must not be described as claims-calibrated.

## 14. Binding companions

- `SOURCE_REGISTER_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv`
- `CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv`
- `PARAMETER_TIER_TABLE_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv`
- `VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv`
- `BOUNDED_EVIDENCE_SEARCH_LOG_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `NUMERICAL_CANDIDATE_AUDIT_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `SITE_CONDITION_ADAPTER_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `PRESSURE_TEST_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `SEVEN_STEP_AUDIT_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `PROMOTION_GATE_MATRIX_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
