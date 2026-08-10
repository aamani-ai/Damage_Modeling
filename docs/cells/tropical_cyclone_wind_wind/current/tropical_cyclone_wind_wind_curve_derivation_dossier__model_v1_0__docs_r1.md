# Tropical-cyclone wind x onshore wind derivation dossier — model v1.0/docs r1

## 1. Identity and disposition

```yaml
cell_id: tropical_cyclone_wind_wind
pathway_id: tropical_cyclone_wind
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_SCREENING_V1
semantic_damage_model_version: model v1.0
documentation_revision: docs r1
package_release: unreleased
package_baseline: library v2.5
lifecycle_state: released_v1_0
promotion_status: released
review_status: reviewed_partial_screening_release
model_grade: screening_source_derived_engineering_proxy
artifact_schema_version: damage_curve_record_bundle.v3
artifact_schema_status: released
emit_schema_version: damage_emit.v2
capability_schema_version: capability_declaration.v3
canonical_runtime_artifact: true
current_canonical_pin: model v1.0 / docs r1 / bundle v3 / capability v3 / emit v2 / full artifact SHA
```

This dossier supports the repository-canonical partial-screening release. It creates a current pointer and
consumer-readable artifact, but it does not authorize scenario dollars, whole-farm damage, or portfolio
metrics beyond the declared source-native scalar turbine/tower response.

## 2. Modeling question and boundary

The narrowly supported question is:

```text
For one exact Jaimes generic turbine class and a delivered three-second peak gust at 10 m,
what source-published conditional expected economic damage ratio applies to the paper's
own turbine-tower exposure/replacement-cost unit?
```

It is not yet possible to answer the broader production question:

```text
What direct dollar loss occurs across a modern wind farm's turbines, foundations,
collection network, GSU, controls, civil assets, and support costs?
```

### In scope

- direct tropical-cyclone wind loading only;
- three generic fixed-base land-based turbine classes modeled by Jaimes et al.;
- the paper-native 3-second peak gust at 10 m in km/h;
- the paper's scalar expected economic vulnerability function;
- per-source-unit, occurrence-conditional screening output;
- exact selector, axis, range, provenance, and fail-closed rules.

### Routed elsewhere or withheld

- tropical-cyclone frequency, catalog construction, and wind-field production;
- TC-spawned tornadoes, surge, flood, scour, saturated-soil/slope failure, debris, and rain ingress;
- offshore structures and wave/surge/corrosion;
- actual modern-fleet transfer without an approved exact mapping;
- standard turbine equipment, foundation, pad electrical, collection, GSU, control/SCADA, and civil DR;
- dollar/scenario/plant loss, support allocation, BI, curtailment, EAL, PML, VaR, TVaR, and insurance.

## 3. Why model v1.0 is now justified

Model v0.1 had no runtime curve. It reproduced the Jaimes structural fragilities but rejected a generic
fragility-to-economic conversion because the state costs were assumed and the denominator was not aligned to
the InfraSure asset/value substrate.

The deeper review changes one decision without erasing those limitations:

1. Jaimes explicitly defines damage as expected repair cost divided by replacement cost of the selected
   structure.
2. Equations 12-13 combine mutually exclusive modeled damage-state probabilities with stated cost ratios.
3. Equation 1 is the paper's fitted continuous expected-damage function, not merely the DS3 collapse
   fragility.
4. The published model can therefore be preserved as an economic DR for its own source-defined unit.
5. The assumed state costs and ambiguous source denominator prevent claims-grade or CWER/full-plant use, so
   the correct grade is a source-derived engineering proxy and the unit must remain quarantined.

The same valid inputs can now return a numeric scalar mean where v0.1 returned null. Under the repository's
versioning policy, this earns a new semantic model version.

## 4. Evidence lineage and decision audit

Primary source: `TCWW-S005`, Jaimes, Garcia-Soto, Martin del Campo, and Pozos-Estrada (2020), *Probabilistic
risk assessment on wind turbine towers subjected to cyclone-induced wind loads*, DOI `10.1002/we.2436`.

Load-bearing locators:

| Decision | Source locator | What is adopted | What is not inferred |
|---|---|---|---|
| damage definition | section 2.3, pages 5-6 | expected repair cost / replacement cost | claims calibration or modern-fleet transfer |
| axis and threshold | sections 2.3.1-2.3.2; Eq. 1 | 3-second peak gust at 10 m, km/h; zero through 90 km/h | NHC one-minute/category equivalence |
| modeled classes | section 3.3.1; Table 2 | rating, hub height, rotor diameter tuples | actual make/model equivalence |
| structural simulation | sections 3.3.2-3.3.4; Tables 2-3; Figure 5 | source applicability and 108-252 km/h core range | response outside the modeled range |
| economic bridge | section 3.3.5; Eqs. 12-13; Figure 6 | the paper's state-weighted expected DR construction | empirical repair-cost calibration |
| continuous fits | section 3.3.5; Figure 6 | three Eq. 1 parameter pairs | interpolation across archetypes |

The evidence source ID is reused rather than duplicated. The v1 adoption decisions are governed in:

- [v1 source register](SOURCE_REGISTER_tropical_cyclone_wind_wind__model_v1_0__docs_r1.csv)
- [v1 claim/parameter register](CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_wind__model_v1_0__docs_r1.csv)
- [v1 parameter-tier table](PARAMETER_TIER_TABLE_tropical_cyclone_wind_wind__model_v1_0__docs_r1.csv)
- [v1 value crosswalk](VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v1_0__docs_r1.csv)

The underlying discovery, reproduction, and rejection trail remains in:

- [v0.1 source register](../proposed/SOURCE_REGISTER_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv)
- [v0.1 claim/parameter register](../proposed/CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv)
- [bounded evidence search](../proposed/BOUNDED_EVIDENCE_SEARCH_LOG_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md)
- [candidate formula audit](../proposed/NUMERICAL_CANDIDATE_AUDIT_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md)
- [legacy ingestion/reproduction](../proposed/LEGACY_EVIDENCE_INGESTION_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md)
- [pressure test](../proposed/PRESSURE_TEST_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md)
- [value crosswalk](../proposed/VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv)

Governed rows `TCWW-C025` through `TCWW-C043` record the Eq. 1 form, parameter pairs, assumed state costs,
source-denominator boundary, exact selector rule, runtime domain, omitted component modes, facility-grain GSU
rule, source-state acknowledgement, and screening capability. They refine the decision attached to
`TCWW-S005`; they do not turn the source into Tier-1 claims evidence.

## 5. Source economic construction

### Damage-state foundation

Jaimes defines three tower performance states:

- `DS1`: displacement-based state;
- `DS2`: material-yield/flexural state;
- `DS3`: tower-wall buckling with assumed collapse.

The paper assigns approximate ratios of total turbine cost by modeled class:

| Source class | DS1 | DS2 | DS3 |
|---|---:|---:|---:|
| 1 MW / 44 m hub | 0.02 | 0.43 | 1.00 |
| 2.5 MW / 80 m hub | 0.04 | 0.48 | 1.00 |
| 3.3 MW / 100 m hub | 0.05 | 0.50 | 1.00 |

These consequences were assumed/proposed because matched Mexican wind-farm loss values were unavailable;
lower and intermediate states were informed by adjacent household/NREL rebuilding-cost material. They are
not observed turbine claims. That limitation controls the model grade.

The paper then computes expected damage from mutually exclusive state probabilities:

```text
E[L | intensity] = sum_i P(DS = dsi | intensity) * loss_ratio_i
```

Equation 1 is the continuous fit to that expected-damage construction. The v1 runtime uses the fitted mean
directly; it does not reconstruct an independent ordered-state model or invent new state probabilities.

This construction is all-severity only within the modeled **tower** sequence DS1-DS3. Rotor, blades, and
nacelle enter the structural analysis as loads or masses but receive no independent component failure states.
Adjacent Chen field evidence reports blade replacements without tower collapse under Dujuan and broken
blades on surviving towers under Usagi. That omitted mode is material and is a primary reason the Eq. 1 result
does not become `WT_TURBINE_EQUIPMENT_ASSEMBLY` even though section 3.3.5 describes state costs as percentages
of total turbine cost.

### Why the variance model is not emitted

The paper also describes a Beta loss distribution and fitted variance behavior. Model v1.0 does not serialize
that distribution because the current task is a scalar expected DR, the source denominator is not harmonized,
and response variability must not be confused with archetype/model-form transfer uncertainty. Therefore:

```yaml
populated_emit_mode: scalar_mean
curve_intrinsic_spread: not_carried
epistemic_selector_transfer: prohibited
```

## 6. Failure-unit and denominator decision

### Adopted source-specific unit

```yaml
failure_unit_id: WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT
grain: one source-defined turbine-tower exposure
y_axis: conditional expected direct repair-or-replacement cost ratio
denominator: paper per-turbine replacement-cost proxy
denominator_harmonized_to_CWER: false
```

The paper is internally inconsistent at the boundary:

- section 2.3 says replacement cost of the selected structure;
- section 3.2 repeatedly describes turbine towers and a hub-height replacement-cost proxy;
- section 3.3.5 describes damage-state ratios as percentages of total turbine cost.

It would be false precision to relabel the ordinate as either a physical tower-only DR or the InfraSure
rotor+nacelle+tower equipment-assembly DR. The source-specific atom retains the function and its ambiguity.

### Units that remain withheld

```text
WT_TURBINE_EQUIPMENT_ASSEMBLY  denominator harmonization missing
WT_FOUNDATION                   no wind-only response/disposition/cost curve
WT_PAD_MOUNTED_ELECTRICAL       no component-local TC curve
WT_COLLECTION_SYSTEM            no line/network TC curve
WT_GSU_SUBSTATION               no facility-level pathway curve
WT_CONTROL_BUILDING_AND_SCADA   no control/communications curve
WT_CIVIL_INFRA                  no subject-specific curve
SUPPORT_FIELDWORK               no intrinsic DR; allocation rule open
SUPPORT_TRANSPORT_LOGISTICS     no intrinsic DR; allocation rule open
```

No source-unit DR may be broadcast to any of these units, and null may not be converted to zero.

## 7. Physical tree and coverage

```text
LAND-BASED WIND FARM
|
+-- repeated turbine point
|   |-- WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT  conditional source DR
|   |-- WT_TURBINE_EQUIPMENT_ASSEMBLY          withheld standard unit
|   |-- WT_FOUNDATION                           withheld
|   `-- WT_PAD_MOUNTED_ELECTRICAL               withheld
|
+-- network and shared systems
|   |-- WT_COLLECTION_SYSTEM                    withheld
|   |-- WT_GSU_SUBSTATION                       withheld; one facility-level exposure
|   |-- WT_CONTROL_BUILDING_AND_SCADA           withheld
|   `-- WT_CIVIL_INFRA                          withheld / split required
|
`-- support after qualified damage
    |-- SUPPORT_FIELDWORK                        allocate once; no curve
    `-- SUPPORT_TRANSPORT_LOGISTICS              allocate once; no curve
```

The source unit is an evidence quarantine, not an extra physical asset to be added beside the standard
turbine equipment. A future harmonization must replace or bind it through an explicit one-to-one rule; it
must never be summed as a second turbine loss.

## 8. Hazard axis and applicability domain

### Native axis

```yaml
hazard_axis_id: TC_PEAK_GUST_3S_10M_KMH_JAIMES
evaluated_input_field: tc_peak_gust_3s_10m_kmh
curve_record_x_axis: tc_peak_gust_3s_10m_kmh
quantity: peak gust wind speed
averaging_period_s: 3
reference_height_m: 10
unit: km/h
source_simulation_intensities: 20 levels from 108 to 252 km/h
```

The source structural analyses cover 30-70 m/s, equivalent to 108-252 km/h. Equation 1 separately declares
zero expected damage for `V <= 90 km/h`.

### Runtime range policy

| Range | Evidence meaning | v1 behavior |
|---|---|---|
| `V < 0` or nonfinite | invalid physical/numeric input | reject |
| `0 <= V <= 90` | source-assumed zero branch, below simulated structural range | emit `0` with `SOURCE_ASSUMED_NO_DAMAGE_THRESHOLD_NOT_EMPIRICAL` |
| `90 < V < 108` | positive fitted curve outside structural simulations | withhold `BELOW_SOURCE_SIMULATION_RANGE` |
| `108 <= V <= 252` | core modeled/fitted interval | evaluate |
| `V > 252` | unvalidated source-fit tail | withhold `ABOVE_SOURCE_SIMULATION_RANGE` |

The open interval 90-108 is intentionally withheld even though the equation is mathematically defined there.
This prevents the fit from quietly expanding its evidence range. Values may be shown in formula audits only
when visibly labelled non-runtime.

### Rejected input substitutions

- Saffir-Simpson category;
- NHC one-minute maximum sustained wind;
- generic `wind_speed` without height/averaging/unit metadata;
- hub-height or rotor-effective demand without a governed inverse bridge to the source axis;
- Rose 10-minute hub-height knots;
- legacy one-minute 10 m mph;
- current Hazard mph merely renamed km/h without exact conversion and metadata.

## 9. Curve form and parameters

The exact adopted form is:

```text
let V_zero_kmh = 90 km/h

DR(V) = 0,                                                              V <= V_zero_kmh
DR(V) = max_dr * [1 - 0.5^(((V-V_zero_kmh)/delta_V50_kmh)^rho)],        V > V_zero_kmh

max_dr = 1
```

The runtime schema names the source increment `delta_V50_kmh`. This avoids interpreting the source's reported
`Vh50` value as the absolute wind speed at 50% damage. `V_at_DR50_kmh` is also serialized and must equal
`V_zero_kmh + delta_V50_kmh`.

| Curve/selector | `V_zero_kmh` | `delta_V50_kmh` | `rho` | `V_at_DR50_kmh` |
|---|---:|---:|---:|---:|
| `TCWW_JAIMES_GENERIC_1MW_HH44_V1` | 90 | 106.77 | 8.94 | 196.77 |
| `TCWW_JAIMES_GENERIC_2P5MW_HH80_V1` | 90 | 82.52 | 4.54 | 172.52 |
| `TCWW_JAIMES_GENERIC_3P3MW_HH100_V1` | 90 | 73.30 | 4.99 | 163.30 |

All speeds in this table are km/h. No rounding-derived knots or alternate ordinates are runtime parameters.

## 10. Exact selectors and source-state limitations

| `turbine_archetype_id` | Required tuple | Selection status |
|---|---|---|
| `TCWW_JAIMES_GENERIC_1MW_HH44_V1` | 1.0 MW, 44 m hub, 50 m rotor | exact source class only |
| `TCWW_JAIMES_GENERIC_2P5MW_HH80_V1` | 2.5 MW, 80 m hub, 90 m rotor | exact source class only |
| `TCWW_JAIMES_GENERIC_3P3MW_HH100_V1` | 3.3 MW, 100 m hub, 114 m rotor | exact source class only |

The ID and all numeric tuple members must agree. There is no default, nearest curve, interpolation, or generic
multi-MW selector. An actual turbine make/model requires a separately reviewed exact mapping; the Amazon
Gamesa G114-2.0 is not silently mapped to the 2.5 MW/90 m source class.

For the 1 MW class, Table 2 gives a 44 m hub height while Figure 5, Figure 6, and conclusion prose use 40 m.
Model v1.0 selects 44 m because Table 2 is the governing property table and always emits
`SOURCE_1MW_HUB_HEIGHT_TABLE_44M_FIGURE_CAPTION_40M`. An author correction would trigger review.

The source also contains a control-state description inconsistency: section 3.3.1 describes blades as
feathered/minimum drag, while section 3.3.2 describes a parked chord-horizontal setup with no pitch angle;
simulations use wind parallel to the rotor axis and no yawing. The required acknowledgement is therefore
`source_model_assumption_set_id=JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED`. It is not a
generic protected or failed-control state and earns no numeric control credit.

## 11. Selector, conditioner, and exposure separation

```text
selector     = fixed source archetype tuple
conditioner  = event-time operating/yaw/pitch/grid/duration state
exposure     = which repeated turbine/source unit received the delivered demand
```

Model v1.0 selects by the fixed archetype ID whose artifact record pins the rating/hub/rotor tuple. It carries,
but does not numerically modify for, operating state, yaw, pitch, brake, grid, backup power, duration,
direction change, turbulence, and control-history quality. Unknown operating/control state is retained with
`SOURCE_MODEL_CONTROL_STATE_UNKNOWN`; a state known to conflict with the required source assumption withholds
`SOURCE_MODEL_CONTROL_STATE_MISMATCH`.

Per-turbine exposure is required for any later aggregation. A farm polygon fraction is not a turbine count.
Foundation points, collection lines, shared GSU apparatus, controls/buildings, and civil subjects require
their own exposure objects and cannot inherit the turbine fraction.

## 12. Value linkage and the no-dollar-loss decision

The NREL CWER reference remains:

```text
rotor+nacelle+tower equipment = 1,090 2023 USD/kW
foundation+civil+electrical   =   239 2023 USD/kW
fieldwork+transport support   =   294 2023 USD/kW
physical reference            = 1,623 2023 USD/kW
excluded soft/nonphysical     =   345 2023 USD/kW
installed reference           = 1,968 2023 USD/kW
```

That ledger does not resolve the Jaimes denominator. Model v1.0 therefore emits no currency result even when
a consumer supplies CWER or site value. A future value binding must establish that the numerator and
denominator refer to the same physical scope and that the source unit is not double-counted with the standard
turbine equipment assembly.

For audit only, the source proxy is:

```text
Ct(h) = 1307.9 * h^1.82 USD per source turbine/turbine-tower record

h = 44 m  -> 1,281,322.377752261 source-nominal USD
h = 80 m  -> 3,803,630.455372714 source-nominal USD
h = 100 m -> 5,709,190.569869134 source-nominal USD
```

The currency vintage is not stated as a runtime-compatible modern site value. Even this source-native proxy
cannot produce scenario loss because its physical/value denominator has not been approved for runtime use.

Support remains outside the intrinsic curve and may be allocated once only after a qualified supported direct
damage/disposition result exists.

## 13. Numerical reproduction and known answers

Selected source-range values are:

| V km/h | 1 MW DR | 2.5 MW DR | 3.3 MW DR |
|---:|---:|---:|---:|
| 108 | 0.000000084844835 | 0.000689340900421 | 0.000627523692330 |
| 150 | 0.004002127367618 | 0.150493549871006 | 0.225261551399666 |
| 180 | 0.139686727984598 | 0.642205900008322 | 0.854896589996166 |
| 200 | 0.595366445773527 | 0.922389325279681 | 0.994774445020964 |
| 220 | 0.982198894878260 | 0.995733421640076 | 0.999994401418475 |
| 252 | 0.999999999999693 | 0.999999633725535 | 1.000000000000000 within shown precision |

Each curve returns exactly `0.5` at its own absolute midpoint. Runtime KATs must also prove:

- `V=90` returns zero and `90<V<108` withholds;
- `V=108` and `V=252` evaluate; `V>252` withholds rather than clamps;
- every supported curve is bounded and monotone;
- missing or unknown selector IDs reject; artifact validation rejects any drift in a pinned selector tuple,
  and consumer asset mapping must reject a real-asset tuple mismatch before assigning the ID;
- wrong unit, height, or averaging period rejects;
- unsupported failure units return null with reason codes;
- no legacy/Hazard fallback is reachable;
- source-unit DR cannot become CWER, dollar, or plant loss;
- artifact, capability, KAT, schema, and full SHA pins fail closed when stale.

## 14. Old-versus-new disposition

Model v0.1 always returned null. The v1 release returns a scalar expected DR only for the source unit, exact
selector, exact axis, and accepted domain.

The current Hazard hurricane/wind-farm M3 placeholder is not a regression target. It copies convective-wind
logistics into rotor, nacelle, substation, and electrical full-TIV shares, sets tower/foundation/civil to zero,
and caps near 0.65. Its intensity can be unit-converted for an audit, but its endpoint, denominator, exposure,
and coverage differ.

The older research memo is even less comparable: it uses ordinary component logistics on one-minute 10 m mph
and contains printed-table/formula and aggregate/component inconsistencies. The companion CSV shows numbers
only as frozen audit fixtures with an explicit `not_like_for_like` disposition.

## 15. Rejected alternatives

| Alternative | Decision | Reason |
|---|---|---|
| publish DS3 probability as DR | reject | wrong endpoint; ignores DS1/DS2 expected cost |
| rebuild an independent ordered-state v3 curve | reject for v1 | Eq. 1 already publishes the expected economic observable; reconstruction adds synthetic semantics |
| map Eq. 1 to `WT_TURBINE_EQUIPMENT_ASSEMBLY` | reject | paper denominator is not proven equal to CWER equipment |
| map Eq. 1 to CWER tower value only | reject | source states percentages of total turbine cost as well as turbine-tower wording |
| interpolate by rating/hub/rotor | reject | only three modeled class fits exist |
| default to 2.5 MW for an actual 2 MW turbine | reject | unearned proxy transfer |
| evaluate 90-108 because the formula exists | reject for runtime | outside structural simulation range |
| clamp above 252 | reject | silently asserts tail behavior |
| use one curve for foundation/electrical/GSU/civil | reject | different mechanisms, denominators, and exposure grains |
| output full-plant dollars from a source-unit DR | reject | denominator and coverage are incomplete |

## 16. Contract architecture

The current release uses:

```yaml
bundle: damage_curve_record_bundle.v3
bundle_status: released
curve_form: thresholded_weibull_expected_damage
emit: damage_emit.v2
emit_mode: scalar_mean
capability: capability_declaration.v3
```

The thresholded-Weibull record is an additive extension to the unreleased v3 draft. It requires `pathway_id`,
the source axis, exact selector tuple, `V_zero_kmh`, `delta_V50_kmh`, `rho`, `V_at_DR50_kmh`, and `max_dr`.
Existing canonical bundle-v2 artifacts are unchanged. A consumer that does not understand this bundle-v3
record must reject it.

## 17. Capability and emit

For `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT`:

```yaml
failure_unit_scalar_dr: conditional
conditions:
  - exact_pathway
  - exact_native_axis
  - exact_supported_selector_tuple
  - accepted_runtime_domain
scenario_loss_given_value_basis: withheld
curve_intrinsic_spread: not_carried
populated_emit_modes: [scalar_mean]
```

Every standard physical/support unit is withheld. Annual metrics are downstream-owned but remain withheld:
they require an approved denominator/value binding, occurrence model, turbine exposure, dependency/cap logic,
and exact pins. This partial release does not satisfy those prerequisites.

## 18. Validation and release gates

The partial release requires all of the following to pass together:

1. draft v3 schema validation for the exact curve form and selector payload;
2. independent formula reproduction at boundaries, midpoints, and a dense supported grid;
3. evaluator equality against direct equation evaluation;
4. rejection KATs for axis, range, selector, failure unit, and denominator misuse;
5. embedded/standalone capability semantic equality;
6. workbook formula, error, round-trip, ZIP, and visual checks;
7. source/claim/parameter/value linkage resolution;
8. old-vs-new denominator-labelled review;
9. canonical-index inclusion and current-runtime pin checks;
10. Hazard dual-read fixture, exact model/docs/schema/SHA pin, and rollback rehearsal.

These repository-local checks establish the bounded release. They do not broaden its declared capability or
constitute external object-store/database activation.

## 19. Release and update triggers

The v1.0 partial release has:

- frozen and hashed the artifact/capability/KAT/workbook set;
- retained the source-unit reportability boundary as an explicit withholding condition;
- proved consumer fixtures for exact source-axis metadata and supported selectors;
- preserved nulls for all unsupported turbine/BOP units in the governed consumer path;
- demonstrated no hardcoded consumer curve or legacy fallback in that path; and
- recorded the reviewed release decision, index/current pointer, changelog, registry update, and rollback
  rule.

Author clarification, exact turbine-class validation, matched claims/repair-cost data, denominator
harmonization, new supported classes, range extension, or conditioner effects are model-behavior changes and
must be classified/versioned before adoption.

## 20. Binding companions

- `README_tropical_cyclone_wind_wind__model_v1_0__docs_r1.md`
- `tropical_cyclone_wind_wind_damage_code_metadata_spec__model_v1_0__docs_r1.md`
- `CHANGE_CLASSIFICATION_tropical_cyclone_wind_wind__model_v1_0__docs_r1.md`
- `PROMOTION_GATE_MATRIX_tropical_cyclone_wind_wind__model_v1_0__docs_r1.md`
- `OLD_VS_NEW_COMPARISON_tropical_cyclone_wind_wind__model_v1_0__docs_r1.csv`
- `workbook_sheet_manifest_tropical_cyclone_wind_wind__model_v1_0__docs_r1.md`
- `SOURCE_REGISTER_tropical_cyclone_wind_wind__model_v1_0__docs_r1.csv`
- `CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_wind__model_v1_0__docs_r1.csv`
- `PARAMETER_TIER_TABLE_tropical_cyclone_wind_wind__model_v1_0__docs_r1.csv`
- `VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v1_0__docs_r1.csv`
- `tropical_cyclone_wind_wind__model_v1_0__docs_r1__curve_artifact.json`
- `tropical_cyclone_wind_wind__model_v1_0__docs_r1__capability.json`
- `known_answer_tests_tropical_cyclone_wind_wind__model_v1_0__docs_r1.json`
- v0.1 evidence, audit, site-adapter, and value records linked in section 4
