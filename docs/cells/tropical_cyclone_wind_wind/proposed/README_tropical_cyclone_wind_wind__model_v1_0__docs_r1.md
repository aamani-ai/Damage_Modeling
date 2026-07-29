# tropical_cyclone_wind_wind — proposed model v1.0, docs r1

> **Status: proposed, noncanonical, source-derived screening model.** This package introduces a numeric
> expected-damage-ratio curve for one quarantined, paper-native Jaimes exposure unit. It is not a canonical
> runtime artifact, is absent from the artifact index, and does not authorize full-turbine, plant, dollar,
> EAL, or PML output.

## 1. Cell identity and outcome

```yaml
cell_id: tropical_cyclone_wind_wind
pathway_id: tropical_cyclone_wind
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_SCREENING_V1
semantic_damage_model_version: model v1.0
documentation_revision: docs r1
lifecycle_state: release_candidate
promotion_status: proposed
review_status: pressure_tested_pending_independent_review
model_grade: screening_source_derived_engineering_proxy
artifact_schema_version: damage_curve_record_bundle.v3
artifact_schema_status: proposed_draft
emit_schema_version: damage_emit.v2
capability_schema_version: capability_declaration.v3
canonical_runtime_artifact: false
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: not_included
```

The v0.1 scaffold correctly withheld a generic turbine-equipment curve. Deeper review of Jaimes et al.
(`TCWW-S005`) recovered a different, narrower product that can be serialized honestly: the paper's own
expected economic vulnerability function for each of three exact generic turbine-tower classes. Model v1.0
therefore supports only the source-defined unit and leaves the standard InfraSure asset/value units withheld.

## 2. Snapshot tree

```text
tropical-cyclone wind x onshore wind
|
+-- conditional primary numeric unit
|   `-- WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT
|       |-- exact 1 MW / 44 m hub / 50 m rotor selector
|       |-- exact 2.5 MW / 80 m hub / 90 m rotor selector
|       `-- exact 3.3 MW / 100 m hub / 114 m rotor selector
|
+-- standard turbine/BOP units withheld, not zero
|   |-- WT_TURBINE_EQUIPMENT_ASSEMBLY
|   |-- WT_FOUNDATION
|   |-- WT_PAD_MOUNTED_ELECTRICAL
|   |-- WT_COLLECTION_SYSTEM
|   |-- WT_GSU_SUBSTATION
|   |-- WT_CONTROL_BUILDING_AND_SCADA
|   `-- WT_CIVIL_INFRA
|
`-- support after qualified direct damage
    |-- SUPPORT_FIELDWORK
    `-- SUPPORT_TRANSPORT_LOGISTICS
```

The source-specific unit is deliberately not renamed as a CWER tower or turbine-equipment assembly. Jaimes
uses "turbine tower," "selected structure," and "total cost of the turbine" around one internally mixed
replacement-cost proxy. Quarantining that denominator preserves the published ordinate without pretending
that its boundary has been harmonized to InfraSure's value ledger.

## 3. Scope and exclusions

In scope is direct physical damage from tropical-cyclone wind for the three modeled, fixed-base, generic
land-based turbine classes, evaluated per source-defined turbine-tower exposure unit on the native wind axis.

The proposal excludes or withholds:

- transfer to an actual make/model or any unlisted rating, hub height, or rotor diameter;
- interpolation between the three source archetypes or a default/proxy selector;
- a generic modern onshore turbine-equipment result;
- foundation, pad electrical, collection, GSU/substation, control/SCADA, and civil damage;
- surge, pluvial flooding, scour, saturated-soil failure, TC-spawned tornadoes, debris, and rain ingress;
- support/logistics allocation, business interruption, curtailment, revenue, insurance, and financial terms;
- farm/plant dollar loss, full-TIV DR, EAL, PML, VaR, TVaR, and portfolio accumulation.

Related child pathways must retain a common `event_family_id`; this cell never authorizes additive counting of
wind, flood/surge, and TC-spawned-tornado loss merely because each leg exists.

## 4. Primary numeric failure unit

| Failure unit | Grain | v1 treatment | Ordinate | Important limitation |
|---|---|---|---|---|
| `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT` | one paper-defined turbine-tower exposure | conditional scalar mean DR for one exact selector | expected direct repair-or-replacement cost ratio relative to the paper's per-turbine replacement-cost proxy | denominator is source-defined and internally ambiguous; it is not mapped to CWER or plant TIV |

This is a source-derived engineering proxy, not a claims-calibrated loss curve. Jaimes constructs the curve
from modeled tower damage-state probabilities and assumed damage-state cost ratios because matched Mexican
wind-farm loss data were unavailable. The calculation is nevertheless an explicit published expected DR,
which is stronger and more faithful than treating only the DS3 collapse fragility as the product.

"All severity" here means tower states DS1-DS3. Rotor, blades, and nacelle participate in the structural
model as loads or masses but do not have independent failure states. Observed blade replacement on surviving
towers in adjacent field evidence is a direct warning against calling this an all-component turbine curve.

## 5. Reviewed withheld and support units

| Unit or family | Role | v1 result | Why |
|---|---|---|---|
| `WT_TURBINE_EQUIPMENT_ASSEMBLY` | standard repeated-turbine direct unit | withheld | Jaimes denominator has not been harmonized to the CWER rotor+nacelle+tower denominator |
| `WT_FOUNDATION` | separate repeated foundation | withheld, not DR near zero | no wind-only probability, disposition, cost, or precedence rule |
| `WT_PAD_MOUNTED_ELECTRICAL` | turbine-adjacent point/pad | withheld | no local TC-wind response/cost curve |
| `WT_COLLECTION_SYSTEM` | line/segment/network | withheld | different exposure grain; no response/cost curve |
| `WT_GSU_SUBSTATION` | one shared facility-level GSU/substation | withheld | not a turbine proxy; no pathway-specific facility curve or approved value split |
| `WT_CONTROL_BUILDING_AND_SCADA` | control building/SCADA/communications subject | withheld | mixed construction and response |
| `WT_CIVIL_INFRA` | split line/network/polygon subjects | withheld | roads, pads, buildings, fences, and drainage cannot share one turbine-point curve |
| fieldwork and transport/logistics | support once | no intrinsic DR | allocate once only after supported damaged units and disposition are known |

Withheld means unknown or unsupported. It never means undamaged, zero dollars, or permission to inherit the
Jaimes curve.

## 6. Hazard x-axis decision and runtime domain

```yaml
hazard_axis_id: TC_PEAK_GUST_3S_10M_KMH_JAIMES
evaluated_input_field: tc_peak_gust_3s_10m_kmh
curve_record_x_axis: tc_peak_gust_3s_10m_kmh
quantity: three-second peak gust wind speed
reference_height_m: 10
unit: km/h
source_assumed_zero_branch: V <= 90
source_simulation_range_kmh: [108, 252]
runtime_numeric_range_kmh: [108, 252]
```

The runtime behavior is intentionally discontinuous in capability, not in the mathematical curve:

| Delivered `V` | Runtime behavior |
|---:|---|
| nonfinite or `< 0` | reject |
| `0 <= V <= 90` | emit source-assumed scalar DR `0` with `SOURCE_ASSUMED_NO_DAMAGE_THRESHOLD_NOT_EMPIRICAL` |
| `90 < V < 108` | withhold `BELOW_SOURCE_SIMULATION_RANGE`; formula values may appear only in audit material |
| `108 <= V <= 252` | evaluate the selected published curve |
| `V > 252` | withhold `ABOVE_SOURCE_SIMULATION_RANGE`; no clamp or tail extrapolation |

NHC one-minute sustained wind, Saffir-Simpson category, hub-height wind, knots, mph, m/s, and Rose's 10-minute
hub-height wind are not aliases. A consumer must deliver the exact native quantity or a separately governed
bridge that preserves source and target definitions; this proposal does not approve such a bridge.

## 7. Curve form and y-axis

For each exact selector:

```text
DR(V) = 0,                                                        V <= V_zero_kmh
DR(V) = max_dr * [1 - 0.5^(((V-V_zero_kmh)/delta_V50_kmh)^rho)], V > V_zero_kmh
```

Serialized curve form: `thresholded_weibull_expected_damage`; `V_zero_kmh = 90`; `max_dr = 1`.

| Selector ID | Rating / hub / rotor | `delta_V50_kmh` | `rho` | `V_at_DR50_kmh` |
|---|---|---:|---:|---:|
| `TCWW_JAIMES_GENERIC_1MW_HH44_V1` | 1 MW / 44 m / 50 m | 106.77 | 8.94 | 196.77 km/h |
| `TCWW_JAIMES_GENERIC_2P5MW_HH80_V1` | 2.5 MW / 80 m / 90 m | 82.52 | 4.54 | 172.52 km/h |
| `TCWW_JAIMES_GENERIC_3P3MW_HH100_V1` | 3.3 MW / 100 m / 114 m | 73.30 | 4.99 | 163.30 km/h |

The runtime field is named `delta_V50_kmh` because the 50% point is `V_zero_kmh + delta_V50_kmh`, not the
increment alone. `V_at_DR50_kmh` serializes that identity explicitly. Table 2's 44 m hub height controls the
1 MW selector; the paper's 40 m figure/caption and conclusion wording is retained as
`SOURCE_1MW_HUB_HEIGHT_TABLE_44M_FIGURE_CAPTION_40M`.

## 8. Selector, conditioner, and exposure map

### Fixed selector

Selection requires one exact `turbine_archetype_id`. Each artifact record locks that ID to its published
rating, hub height, and rotor diameter; the consumer may assign the ID only after its asset mapping proves that
exact tuple. There is no default, nearest-neighbor, rating interpolation, generic-fleet fallback, or Gamesa
G114-2.0 proxy. Missing or unknown selector IDs fail closed.

### Event-time conditioners

Jaimes modeled a specific structural/control configuration with wind parallel to the rotor axis and no
yawing. The source itself describes blades as feathered/minimum-drag in one section and parked,
chord-horizontal with no pitch angle in another. The request must acknowledge
`source_model_assumption_set_id=JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED`, not a
generic protected state. `actual_operating_control_state=unknown` is allowed with
`SOURCE_MODEL_CONTROL_STATE_UNKNOWN` and no credit; a state known to be inconsistent with the source
assumption withholds `SOURCE_MODEL_CONTROL_STATE_MISMATCH`. Other operating, yaw, pitch, brake, grid,
backup-power, duration, veer, and turbulence fields should be retained by the consumer, but model v1.0 has no
supported multiplier or alternate curve for them.

### Exposure

The numeric unit is repeated per selected turbine. Turbine exposure cannot be reused for foundations,
collection lines, the shared GSU yard, control buildings, or civil assets. Those subjects require distinct
point, line/network, shared-yard, or polygon exposure objects and remain withheld here.

## 9. Value linkage and reportability

The existing NREL CWER reference ledger remains useful for reconciliation:

```text
turbine equipment = 1,090 USD/kW
other direct       =   239 USD/kW
support            =   294 USD/kW
physical           = 1,623 USD/kW
excluded           =   345 USD/kW
installed          = 1,968 USD/kW
```

None of those values is the approved denominator for the Jaimes source unit. Consequently:

Jaimes' audit-only replacement proxy is `Ct(h) = 1307.9 * h^1.82 USD`, which yields approximately
`1,281,322`, `3,803,630`, and `5,709,191` source-nominal dollars for the 44 m, 80 m, and 100 m classes. Its
vintage and physical boundary are not clean enough for runtime dollar binding; preserving the values aids
denominator review but does not make them a site appraisal.

```yaml
source_unit_scalar_mean_dr: conditional
standard_turbine_equipment_dr: withheld
scenario_dollar_loss: withheld
farm_or_plant_dr: withheld
full_tiv_loss: withheld
consumer_annual_metrics_before_promotion: withheld_noncanonical_proposal
```

The 1,090/1,623 and 1,090/1,968 ratios are denominator conversions for the standard CWER assembly, not caps or
bridges for the Jaimes curve.

## 10. Evidence and derivation

The governing source is Jaimes et al. 2020, source ID `TCWW-S005`, DOI `10.1002/we.2436`, especially sections
2.3.1-2.3.2 and 3.3.1-3.3.5, Tables 2-3, Figures 5-6, and Equations 1 and 11-13.

The v1 governed adoption records reuse the stable v0.1 source IDs instead of duplicating them:

- [v1 source register](SOURCE_REGISTER_tropical_cyclone_wind_wind__model_v1_0__docs_r1.csv)
- [v1 claim and parameter register](CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_wind__model_v1_0__docs_r1.csv)
- [v1 parameter-tier table](PARAMETER_TIER_TABLE_tropical_cyclone_wind_wind__model_v1_0__docs_r1.csv)
- [v1 value crosswalk](VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v1_0__docs_r1.csv)

The detailed discovery, reproduction, and rejection trail remains inherited from v0.1:

- [source register](SOURCE_REGISTER_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv)
- [claim and parameter register](CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv)
- [bounded search log](BOUNDED_EVIDENCE_SEARCH_LOG_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md)
- [numerical candidate audit](NUMERICAL_CANDIDATE_AUDIT_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md)
- [legacy evidence ingestion and reproduction](LEGACY_EVIDENCE_INGESTION_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md)
- [pressure test](PRESSURE_TEST_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md)
- [site-condition adapter inventory](SITE_CONDITION_ADAPTER_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md)
- [row-level value crosswalk](VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv)

The v1 dossier records the changed adoption decision: Eq. 1 is now retained as a source-derived screening DR
for the quarantined source unit, while claims calibration, target-fleet transfer, and denominator
harmonization remain explicitly unearned.

## 11. Workbook map

Workbook: `damage_curve_records_tropical_cyclone_wind_wind__model_v1_0__docs_r1.xlsx`

| Question | Sheet |
|---|---|
| What is proposed and what remains withheld? | `README`, `Scope_Coverage` |
| What exact input/selector rules apply? | `Inputs` |
| How are the three curves calculated? | `Jaimes_Curves` |
| What is the source unit versus InfraSure's units? | `Failure_Units`, `Value_Crosswalk` |
| How does this differ from v0.1 and Hazard's placeholder? | `Old_vs_New` |
| Which values must executable tests reproduce? | `KATs`, `QA` |
| Where do source and claim decisions live? | `Source_Register`, `Claim_Register`, `Parameter_Tiers` |

The workbook is an audit companion. The frozen JSON artifact is runtime truth after any future promotion;
the dossier and governed registers are derivation truth.

## 12. Package contents

Proposal package files:

- `README_tropical_cyclone_wind_wind__model_v1_0__docs_r1.md`
- `tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_0__docs_r1.md`
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
- `VALIDATION_REPORT_tropical_cyclone_wind_wind__model_v1_0__docs_r1.md`

The workbook and validation report use the same model/docs identity. The Hazard handoff lives under
`docs/contracts/hazard_handoff/`; all three remain proposed until independent review and explicit promotion.

## 13. Open seams and update triggers

Promotion remains blocked until all of the following are closed:

1. the proposed v3 shifted-power record and selector rules pass schema/evaluator/KAT review;
2. the source denominator is either explicitly accepted as its own reportable unit or harmonized without
   changing its meaning;
3. an actual consumer fixture carries exact 3-second/10 m/km/h semantics and an exact supported selector;
4. unsupported-unit withholding survives end-to-end Hazard M2/M3/M4 tests;
5. model/docs/schema/full-SHA pinning, dual-read comparison, rollback, and explicit promotion are complete.

New matched inspection/cost data, an author clarification of the denominator or 1 MW hub height, a qualified
archetype transfer, or a changed validity range triggers a governed model review and likely model-version
change.

## 14. Explicit non-changes

```yaml
artifact_index: unchanged
current_cell_pointer: not_created
portable_package_v2_5: unchanged
Hazard_runtime: unchanged
v0_1_scaffold: preserved
proxy_transfer_to_amazon_gamesa_g114_2mw: prohibited
standard_CWER_turbine_equipment_curve: not_created
full_plant_loss: not_supported
promotion: not_performed
```
