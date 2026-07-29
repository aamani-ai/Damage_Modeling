# How tropical-cyclone wind × onshore wind model v1.0 is built

Use the [basics README](README.md) for a first explanation and the [model reference](MODEL_REFERENCE.md) for
the exact interface.

```yaml
cell_id: tropical_cyclone_wind_wind
cell_model_version: model v1.0
human_documentation_revision: docs r1
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_SCREENING_V1
lifecycle_state: release_candidate
promotion_status: proposed
canonical_runtime_pin: none
canonical_runtime_artifact: false
runtime_behavior_changed_in_Hazard: false
```

## Authority order

```text
proposed curve artifact + standalone capability + KATs
    -> exact proposal behavior

derivation dossier + metadata specification + governed registers
    -> evidence, interpretation, field contracts, and promotion gates

basics folder
    -> reader-friendly synthesis
```

There is no current/canonical cell artifact. The root cell README is the current documentation anchor, while
the proposed JSON remains a release candidate that production consumers must reject.

## Complete build path

```text
STAGE 0  QUESTION      Narrow source-unit conditional DR, not wind-farm loss
STAGE 1  EVIDENCE      Re-read Jaimes' economic vulnerability derivation
STAGE 2  GRAIN         Quarantine the paper-native denominator and exposure atom
STAGE 3  AXIS          Preserve 3-second peak gust at 10 m in km/h
STAGE 4  FORM          Serialize three exact thresholded expected-DR curves
STAGE 5  ROUTING       Require exact archetype and source-state acknowledgement
STAGE 6  COVERAGE      Keep every standard wind-farm unit explicit and withheld
STAGE 7  EMIT          Conditional source-unit scalar only; no dollar/scenario metrics
STAGE 8  SHIP          Proposed package only; no index, pin, current pointer, or cutover
```

## Stage 0 — ask the narrow question

The supported question is:

```text
For one exact Jaimes generic turbine class and a delivered 3-second peak gust at 10 m,
what expected economic damage ratio applies to the paper's own turbine-tower exposure unit?
```

The broader production question remains unanswered:

```text
What direct dollar loss occurs across a modern wind farm's turbine equipment,
foundations, electrical systems, GSU, controls, civil assets, and support costs?
```

Direct TC wind is the only pathway in this cell. TC-spawned tornado, surge, flood, scour, debris, rain
ingress, lightning, fire, and offshore loading remain separate. Disruption, finance, frequency, EAL, PML,
VaR, TVaR, and portfolio accumulation remain downstream.

## Stage 1 — recover the source's actual product

The historical v0.1 review correctly reproduced Jaimes tower damage-state fragilities and blocked their
generic application to a full turbine or wind farm. It incorrectly stopped short of recognizing the paper's
fitted economic vulnerability function as its own source-native product.

The v1 review distinguishes two things:

| Source object | Meaning | v1 use |
|---|---|---|
| individual DS fragilities | probabilities of modeled tower damage states | derivation evidence only |
| fitted Equation 1 | expected economic DR assembled from mutually exclusive modeled states and assumed cost ratios | adopted as a source-derived screening curve for the quarantined source unit |

The state costs are assumptions and the denominator is ambiguous. Those limitations lower the model grade;
they do not change Equation 1 into a mere collapse probability.

The [v1 derivation dossier](../proposed/tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_0__docs_r1.md)
records the source sections, equations, tables, discrepancies, and rejected transfers. The
[v0.1 numerical candidate audit](../proposed/NUMERICAL_CANDIDATE_AUDIT_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md)
remains the historical discovery trail.

## Stage 2 — choose the failure-unit and value boundary

The numeric atom is:

```text
WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT
    grain: one modeled turbine point
    ordinate: source-defined expected repair/replacement cost ratio
    denominator: Jaimes Ct(h) per-turbine/turbine-tower proxy
    model grade: source-derived screening engineering proxy
```

The source alternates among “selected structure,” “turbine tower,” and “total cost of the turbine.” Rather
than silently deciding which standard InfraSure value bucket it means, v1 preserves a quarantined unit. That
unit is mutually exclusive with `WT_TURBINE_EQUIPMENT_ASSEMBLY` and cannot be added beside it.

The source proxy `Ct(h) = 1307.9 * h^1.82` is retained for audit, not approved for runtime dollar binding.
The NREL CWER turbine-equipment, physical, installed, and site-TIV bases are not substitute denominators.

## Stage 3 — freeze the native axis

```yaml
axis_id: TC_PEAK_GUST_3S_10M_KMH_JAIMES
field: tc_peak_gust_3s_10m_kmh
averaging_period_s: 3
reference_height_m: 10
unit: km/h
source_simulation_range_kmh: [108, 252]
```

The proposal performs no unit, height, averaging, terrain, gust, or rotor conversion. NHC one-minute wind,
Saffir-Simpson category, hub-height wind, Rose 10-minute wind, mph, knots, and m/s cannot be renamed into the
field. A future bridge must be independently versioned and preserve both source and target semantics.

Runtime domain policy is:

```text
V < 0 or nonfinite    reject
0 <= V <= 90         DR = 0, with source-assumption flag
90 < V < 108         withhold below source simulation range
108 <= V <= 252      evaluate
V > 252              withhold above source simulation range
```

The `V <= 90` branch comes from the paper's assumed no-damage threshold and is explicitly flagged as
non-empirical. The open interval `90 < V < 108` is not filled merely because Equation 1 is calculable there.

## Stage 4 — serialize the three curves

The exact form is:

```text
curve_form = thresholded_weibull_expected_damage

DR(V) = 0,                                                        V <= V_zero
DR(V) = max_dr * [1 - 0.5^(((V - V_zero) / delta_V50)^rho)],     V > V_zero
```

| Curve ID | Selector | `V_zero` | `delta_V50` | `rho` | `V_at_DR50` |
|---|---|---:|---:|---:|---:|
| `TCWW_JAIMES_1MW_44M_SCREENING` | `TCWW_JAIMES_GENERIC_1MW_HH44_V1` | 90 | 106.77 | 8.94 | 196.77 |
| `TCWW_JAIMES_2P5MW_80M_SCREENING` | `TCWW_JAIMES_GENERIC_2P5MW_HH80_V1` | 90 | 82.52 | 4.54 | 172.52 |
| `TCWW_JAIMES_3P3MW_100M_SCREENING` | `TCWW_JAIMES_GENERIC_3P3MW_HH100_V1` | 90 | 73.30 | 4.99 | 163.30 |

`max_dr = 1` for all records, and `V_at_DR50 = V_zero + delta_V50`. The v3 draft schema extension makes the
form explicit rather than forcing it into an unrelated curve type.

## Stage 5 — route only exact source cases

The evaluator requires:

```yaml
turbine_archetype_id: <one exact v1 enum>
source_model_assumption_set_id: JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED
```

The artifact locks each selector ID to its exact rating, hub height, and rotor diameter. There is no default,
nearest-neighbor choice, interpolation, fleet mixture, or automatic actual-make/model transfer. The 1 MW
class uses Table 2's 44 m hub height and carries the paper's conflicting 40 m wording as a limitation flag.

Jaimes also contains internally inconsistent feathered/minimum-drag versus parked/no-pitch wording and models
wind parallel to the rotor with no yawing. The source-assumption ID preserves that state without pretending
it is generic or protected. A known-inconsistent actual state withholds; unknown state is flagged and earns
no credit. No yaw, pitch, brake, grid, backup-power, duration, veer, or turbulence modifier is enabled.

## Stage 6 — keep incomplete coverage visible

```text
numeric source-native unit
`-- WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT

withheld standard direct units
+-- WT_TURBINE_EQUIPMENT_ASSEMBLY
+-- WT_FOUNDATION
+-- WT_PAD_MOUNTED_ELECTRICAL
+-- WT_COLLECTION_SYSTEM
+-- WT_GSU_SUBSTATION
+-- WT_CONTROL_BUILDING_AND_SCADA
`-- WT_CIVIL_INFRA

support without an independent fragility
+-- SUPPORT_FIELDWORK
`-- SUPPORT_TRANSPORT_LOGISTICS
```

All omitted units return explicit null/withheld results. The GSU is one facility-level point/yard and is
never repeated by turbine count. Collection is a line/network exposure. Civil is a mixed bucket that needs
further splitting. None may inherit turbine-point severity or the Jaimes DR.

## Stage 7 — emit only earned capability

```yaml
failure_unit_scalar_dr: conditional
supported_failure_unit: WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT
populated_emit_modes: [scalar_mean]
curve_intrinsic_spread: not_carried
scenario_loss_given_value_basis: withheld
standard_asset_units: withheld
consumer_annual_metrics_before_promotion: withheld_noncanonical_proposal
consumer_annual_metrics_after_promotion: withheld
```

Even an otherwise complete request cannot produce dollar, scenario, farm, full-TIV, EAL, PML, VaR, or TVaR
outputs. The capability declaration, not the presence of a numeric curve or user-supplied value, controls
reportability.

## Stage 8 — stop at a proposed release candidate

```text
model/docs: model v1.0 / docs r1
artifact schema: damage_curve_record_bundle.v3, proposed draft
capability schema: capability_declaration.v3
emit schema: damage_emit.v2
canonical artifact: false
artifact index: unchanged
current pointer: absent
Hazard adapter/cutover: absent
```

Promotion requires independent equation and known-answer reproduction, valuation review of the source
denominator, engineering applicability review, schema-form approval, an exact-axis/selector/pin-aware Hazard
adapter, partial-coverage and compound-event tests, shadow comparison, rollback readiness, and an explicit
promotion decision.

## Old versus new

| Topic | model v0.1/docs r1 | proposed model v1.0/docs r1 |
|---|---|---|
| Curve records | none | three exact source-native expected-DR records |
| Numeric failure unit | none | quarantined Jaimes turbine-tower exposure unit |
| Generic turbine assembly | withheld | still withheld |
| Axis | candidate evidence only | exact 3-second/10 m/km/h field |
| Selector | captured for research | exact source enum; no interpolation/transfer |
| Dollar/scenario/annual output | withheld | still withheld |
| Canonical/consumer status | none | still none |

The [historical v0.1 package](../proposed/README_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md) remains
preserved. Model v1 does not erase its evidence gaps; it narrows the adoption boundary enough to retain the
paper's own expected-DR equation honestly.
