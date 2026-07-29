# flood_wind — proposed model v1.0, docs r1

> **Status: proposed, noncanonical, legacy-FEMA source-native screening model.** The package adds one
> conditional whole-substation assembly curve. It does not make the component-level GSU records numeric,
> enter the artifact index, create a consumer pin, or authorize Hazard cutover.

## 1. Cell identity and outcome

```yaml
cell_id: flood_wind
pathway_id: flood_inundation_contact
damage_code_id: FLOOD_WIND_FEMA_HAZUS_SUBSTATION_SCREENING_V1
semantic_damage_model_version: model v1.0
documentation_revision: docs r1
lifecycle_state: release_candidate
promotion_status: proposed
review_status: pressure_tested_pending_independent_review
model_grade: screening_source_native_legacy_fema_proxy
artifact_schema_version: damage_curve_record_bundle.v3
artifact_schema_status: proposed_draft_additive_piecewise_linear_extension
emit_schema_version: damage_emit.v2
capability_schema_version: capability_declaration.v3
canonical_runtime_artifact: false
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: not_included
```

Model v0.1 correctly withheld all numeric output under the evidence then reviewed. The evidence search is now
reopened because FEMA's Hazus-MH 2.1 Flood Technical Manual publishes a whole-electric-substation depth-
percent-damage function in Table 7.9. Proposed model v1.0 carries that function exactly and narrowly. It is a
legacy official screening function, not component-level, OEM, claims, or current-Hazus calibration.

## 2. Snapshot tree

```text
flood x wind
|
+-- conditional numeric source assembly
|   `-- FW_HAZUS_GSU_SUBSTATION_ASSEMBLY
|       |-- class selector: ESSL | ESSM | ESSH
|       |-- full same-facility substation replacement-value denominator
|       `-- mutually exclusive with every component GSU failure unit
|
+-- component GSU units withheld, not zero
|   |-- FW_GSU_SWITCHGEAR
|   |-- FW_GSU_TRANSFORMER_MAIN
|   |-- FW_GSU_TRANSFORMER_AUX_CONTROLS
|   |-- FW_GSU_PROTECTION_SCADA
|   |-- FW_GSU_STATION_SERVICE_DC
|   `-- FW_GSU_CABLE_TERMINATIONS
|
+-- wind-specific electrical units withheld
|   |-- FW_TURBINE_BASE_ELECTRICAL
|   |-- FW_PADMOUNT_STEPUP_TRANSFORMER
|   `-- FW_COLLECTION_CABLE_TERMINATIONS
|
+-- separate/deferred pathway subjects
|   |-- FW_TURBINE_FOUNDATION
|   `-- FW_CIVIL_ACCESS_DRAINAGE
|
+-- geometry-screened, not universal DR=0
|   `-- FW_ELEVATED_TURBINE_EQUIPMENT
|
`-- support after qualified damage only
    |-- SUPPORT_FIELDWORK
    `-- SUPPORT_TRANSPORT_LOGISTICS
```

The assembly record and component records are alternative representations of the same facility GSU value.
They must never be evaluated or valued together for one event and asset.

## 3. Numeric failure unit

| Field | Model-v1 decision |
|---|---|
| Failure unit | `FW_HAZUS_GSU_SUBSTATION_ASSEMBLY` |
| Curve ID | `FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL` |
| Grain | one complete same-facility electric-power substation |
| Source classes | `ESSL`, `ESSM`, or `ESSH`; identical published ordinates |
| Axis | `FLOOD_DEPTH_ABOVE_SUBSTATION_GRADE_FT_HAZUS`; delivered depth above substation grade, feet |
| Ordinate | direct physical percent damage divided by 100 |
| Denominator | full direct replacement value of that same facility substation assembly |
| Curve form | source-tabulated piecewise linear |
| Valid source domain | 0 through 10 ft, inclusive |
| Maximum source DR | 0.15 at 10 ft |
| Model grade | `screening_source_native_legacy_fema_proxy` |

The curve does not represent one transformer, switchgear lineup, relay cabinet, or cable system. It is also
not a wind-farm-wide curve or a probability of failure.

## 4. Exact source-native curve

| Local delivered depth (ft) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Assembly DR | 0.00 | 0.02 | 0.04 | 0.06 | 0.07 | 0.08 | 0.09 | 0.10 | 0.12 | 0.14 | 0.15 |

Linear interpolation is permitted only between adjacent source knots. Depth above 10 ft is withheld rather
than clamped or extrapolated. A negative or nonfinite delivered depth is invalid. The three Hazus voltage
classes select the same values but remain required source-taxonomy metadata.

## 5. Required compatibility gate

A numeric result is permitted only when all of the following are true:

- `pathway_id = flood_inundation_contact`;
- `failure_unit_id = FW_HAZUS_GSU_SUBSTATION_ASSEMBLY`;
- `substation_hazus_class` is exactly `ESSL`, `ESSM`, or `ESSH`;
- `delivered_depth_basis = unprotected_or_internal_post_bypass_depth`;
- `water_quality_class = freshwater_non_contaminated`;
- `flood_depth_above_substation_grade_ft` or the complete same-datum metre bridge supplies a depth in
  `[0, 10] ft`, but never both payloads;
- `source_assumption_set_id = FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION`;
- the assembly is not combined with a component-level GSU response or value.

Freshwater-contaminated, brackish, saltwater, chemically contaminated, and unknown water quality withhold.
Protection is handled exactly once upstream in the delivered internal depth: unprotected depth and internal
post-bypass depth may use the one accepted basis, while other or missing depth-basis values reject. Missing
class, assumption set, axis payload, or exact pathway also rejects according to the metadata contract.

The assumption-set value explicitly accepts the source's whole-substation grain, control-room damage beginning
at zero feet, assumed switchgear elevation of three feet above grade, legacy/manual status, absence of
claims calibration, and Hazus 7.0 warning that electric-power substation functions are not enabled.

## 6. Axis, exposure, and value

The preferred source-native evaluated field is:

```text
flood_depth_above_substation_grade_ft
```

The mutually exclusive optional bridge is:

```text
flood_depth_above_substation_grade_ft
  = (water_surface_elevation_m - substation_grade_elevation_m)
    * 3.280839895013123
```

The bridge requires both `water_surface_vertical_datum_id` and
`substation_grade_vertical_datum_id`, and they must match exactly. The request must represent the actual
substation point/polygon support. Turbine-centroid depth, site-average depth, missing elevation converted to
dry, and a synthetic substation centroid are prohibited. Negative depth rejects; it is not silently floored
to zero.

For scenario loss, the denominator is the complete direct replacement value of the same physical
substation, counted once. It must come from a site SOV/BOM/appraisal with owner and insured-inclusion status.
The NREL `72 2023 USD/kW` mixed electrical row and the legacy 9% substation share are not substitutes.

## 7. Evidence interpretation

Hazus-MH 2.1 Table 7.9 is an official source-native function, but its surrounding text limits the claim:

- section 7.2.4 says electric-power implementation was deferred even though Table 7.9 publishes values;
- the table uses one function for low-, medium-, and high-voltage substations;
- the notes describe control-room, cable, transformer, and switchgear damage at whole-facility grain;
- no claims sample, OEM test population, dispersion, or uncertainty distribution is supplied.

Hazus 7.0 sharpens the limitation: Table 9-1 lists electric-power substations as mapping-only, and section
9.4.1 footnote 21 says the default electric-power functions are viewable but disabled and produce no results.
That does not erase the legacy table; it prevents treating it as a current enabled Hazus default or as
validated calibration.

The mechanism/disposition reference NEMA GD 1-2016 is also historical: NEMA's April 2026 publication
register lists the same-titled successor guide `NEMA CS 70006-2026`. This package has not acquired or
reviewed the successor's technical content. That review is a promotion caveat for water-quality and
equipment-disposition policy; it does not alter the numeric knots copied from FEMA Table 7.9.

## 8. Capability and explicit withholding

The proposed evaluator may emit a conditional scalar assembly DR for the exact compatibility gate above.
Curve-intrinsic spread is not carried. Scenario dollar loss remains unavailable before canonical promotion
and is then conditional on a complete, non-overlapping site value/ownership binding. Frequency, EAL, PML,
VaR, TVaR, BI, restoration, insurance, and portfolio
accumulation remain consumer-owned and unapproved for this noncanonical proposal.

Every prior component, turbine, collection, foundation, civil, elevated-equipment, and support unit remains
withheld or non-curve. Unsupported units return no numeric fallback. Neither `FS_SWG` nor the Hazard M3/M4
logistics may fill a withheld result.

## 9. Package contents and non-changes

The v1 governance package includes the evidence-reopening memo, change classification, seven-step audit,
pressure test, promotion matrix, dossier, metadata specification, source/claim/parameter/value registers,
old-versus-new comparison, and shared-reuse crosswalk. Machine artifact, capability, KAT, workbook, schema,
and validator work is governed separately in the same proposed release candidate.

This proposal does not change:

- the preserved model-v0.1 files;
- the canonical artifact index or any `current/` pointer;
- the portable package release;
- canonical flood-solar behavior;
- Hazard M3/M4 code or consumer pins;
- the asset-neutral shared method substrate; or
- any reportable annual or tail metric.

Promotion requires independent scientific, source-interpretation, schema, evaluator, value, and consumer
review; acquisition and technical comparison of NEMA CS 70006-2026; and an atomic model/docs/schema/SHA
cutover. Repository presence is not promotion.

## 10. Review artifacts

- [Curve artifact](flood_wind__model_v1_0__docs_r1__curve_artifact.json)
- [Capability declaration](flood_wind__model_v1_0__docs_r1__capability.json)
- [Known-answer tests](known_answer_tests_flood_wind__model_v1_0__docs_r1.json)
- [Review workbook](damage_curve_records_flood_wind__model_v1_0__docs_r1.xlsx)
- [Workbook manifest](workbook_sheet_manifest_flood_wind__model_v1_0__docs_r1.md)
- [Validation report](VALIDATION_REPORT_flood_wind__model_v1_0__docs_r1.md)
