# Workbook sheet manifest — tropical_cyclone_wind_solar model v1.0/docs r1

## Identity

```yaml
workbook: damage_curve_records_tropical_cyclone_wind_solar__model_v1_0__docs_r1.xlsx
cell_id: tropical_cyclone_wind_solar
semantic_damage_model_version: model v1.0
documentation_revision: docs r1
status: noncanonical_coverage_first_screening_exception
sheet_count: 13
formula_count: 83
workbook_qa_checks: 18
workbook_qa_result: PASS
```

The workbook is the review companion for one source-specific, visible-module-hardware material replacement
proxy. It is not a canonical runtime artifact, a source-data redistribution, a scenario-loss model, or a
whole-solar-plant curve.

## Sheet order and purpose

| Order | Sheet | Purpose | Main checks or lineage |
|---:|---|---|---|
| 1 | `README` | Identity, status, package map, and strict-gate warning | canonical flag false; package excluded; scenario/annual outputs withheld |
| 2 | `Scope_Coverage` | Included source atom and every excluded/withheld layer | no generic module, tracker, support, electrical, GSU, civil, or whole-plant transfer |
| 3 | `Source_Evidence` | Perry evidence, four-row apparent-coordinate audit, Ceferino conflict, and strict-gate decision | source hashes/DOI; distances and percentage-point deltas; noncanonical exception only |
| 4 | `Cohort_Fit` | Eight runtime PAVA blocks plus one audit-only tail record | 34 runtime rows; one 48.2 m/s tail row; published means independently recalculated |
| 5 | `PAVA_Curve` | Thirteen serialized block-edge knots and interpolation examples | strictly increasing x; nondecreasing DR; four interpolation deltas below `1e-9` |
| 6 | `Event_Sensitivity` | Event counts and leave-one-event-out high-block sensitivity | event counts sum to 34; Maria/Florence sensitivity remains visible |
| 7 | `Failure_Units` | Full failure-unit inventory and withholding reasons | exactly one `primary_nonzero` source atom; all other units remain null-capable |
| 8 | `Value_Crosswalk` | Same-unit material denominator boundary | no active dollar denominator; NLR benchmark anatomy-only; full TIV prohibited |
| 9 | `KATs` | Formula, rejection, and withheld-unit fixture inventory | 21 represented fixtures; execution occurs in the Python validator |
| 10 | `Source_Register` | Source locators and permitted/prohibited inference | 10 governed rows, including Perry data, Ceferino supplement, and governance contract |
| 11 | `Claim_Register` | Load-bearing claims, source IDs, and update triggers | 18 governed rows; source-release, Ceferino-threshold, and strict-gate discrepancies retained |
| 12 | `Parameter_Tiers` | Evidence tier of every fit, bridge, selector, and release rule | 17 rows; observed labels separate from Tier-3 fit and Tier-4 economic bridge |
| 13 | `QA` | Formula-driven workbook assertions | 18/18 `PASS`; no formula-error tokens found |

## Source and redistribution boundary

The workbook contains only governed sufficient statistics, model knots, source citations, and four governed
cross-method audit rows. It does not contain the public archive's raw CSV rows, imagery, GeoJSON, PDF, or
Ceferino DOCX.
The reviewed source identities are pinned in the source register:

- Perry manual CSV SHA-256:
  `edb34e74cc078bba1fdbe34463abadc794fd416caa66eb64ac3d0ed176ac5e00`;
- Perry aggregate CSV SHA-256:
  `c1ab48731f875142c571efcfd6323d7e048b35b2d2525418e25e6fefb3487062`;
- Perry data-description PDF SHA-256:
  `852ff0128c99e188127a3d789ab217f55c98dba4952db590e07c140bf45219d5`;
- Ceferino supplement SHA-256:
  `6a9e9f36e8e13ae2d9ea266258608a031fe6489bd31155f27b784f1ac7e06756`.

The raw Perry files are not vendored because the archive metadata supplies no license. The reproducibility
helper accepts a user-supplied DOI download, verifies the exact hash, and prints derived statistics without
writing source rows.

## Generation and validation

Generate and render the workbook with:

```bash
ARTIFACT_TOOL_MODULE=/path/to/@oai/artifact-tool/dist/artifact_tool.mjs \
  node scripts/reference_helpers/build_tropical_cyclone_wind_solar_v1_workbook.mjs
```

Validate it together with the source file when available:

```bash
python scripts/reference_helpers/validate_tropical_cyclone_wind_solar_v1_proposal.py \
  --source-csv /path/to/hurricane_sites_manual.csv
```

The final build was visually inspected sheet-by-sheet from the rendered PNG previews. Long registers are
intentionally wide audit tables; they remain frozen at the header row and preserve full cell text rather than
truncating provenance.
