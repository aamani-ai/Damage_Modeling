# Promotion gate matrix — flood_wind proposed model v1.0 / docs r1

| Gate | Required evidence or control | Proposed-v1 status | Canonical consequence / next action |
|---|---|---|---|
| G1 cell/pathway boundary | `flood_inundation_contact` and exclusions explicit | pass | maintain exact pathway |
| G2 source-unit identity | one `ESSL`/`ESSM`/`ESSH` whole-substation assembly | pass with legacy-source limitation | independent source interpretation review |
| G3 source reproduction | `FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL`; 11 exact knots, percent-to-ratio conversion, monotone interpolation | pass subject to artifact/workbook/KAT validation | byte/payload equality review |
| G4 axis and spatial datum | `FLOOD_DEPTH_ABOVE_SUBSTATION_GRADE_FT_HAZUS`; direct feet or complete same-datum metre bridge | method pass; site conditional | obtain observed/site-qualified depth lineage |
| G5 source assumptions | exact `source_assumption_set_id` and `delivered_depth_basis`; protection resolved once in delivered internal depth | conditional pass | require exact values in every numeric request |
| G6 water quality and current disposition guide | freshwater/non-contaminated only; NEMA GD 1-2016 is historical and NEMA CS 70006-2026 is published but not yet acquired/reviewed | conservative T4 gate; promotion caveat open | acquire/register/review the 2026 guide, compare it with the historical edition, and curate saltwater/contamination evidence; FEMA knots remain unchanged |
| G7 current-source status | Hazus 7.0 mapping-only and disabled warning preserved | pass as limitation | prohibit current-Hazus-enabled claim |
| G8 component decomposition | assembly mutually exclusive with six component GSU units | design pass | tiling and duplicate-value KATs |
| G9 same-unit denominator | full same-facility substation direct replacement value | definition pass; site value blocked | SOV/BOM/appraisal and owner/insured inclusion |
| G10 representativeness/uncertainty | target population and curve spread | blocked | retain T3 screening grade and no intrinsic spread |
| G11 v3 schema extension | pathway-aware `piecewise_linear` payload | proposed, noncanonical | schema review and compatible consumer required |
| G12 evaluator and KATs | positive, interpolation, boundary, class/assumption/water/depth-basis/axis mismatch, no-fallback, exclusivity | separate implementation work | must execute against exact artifact |
| G13 workbook/audit view | source table, formulas, QA, visual inspection | separate implementation work | validate governed workbook and manifest |
| G14 capability/reportability | assembly scalar only; explicit withheld units and metrics | proposed | independent capability review |
| G15 shared-response compatibility | no component-level solar/wind numeric inheritance | pass as non-reuse | keep source assembly cell-local |
| G16 consumer migration | M3 and M4 dual-read one governed result | not started | exact pin, shadow comparison, no-bypass, rollback |
| G17 independent review | science, source, schema, value, and consumer signoff | not started | required before any current/index change |

## Release-candidate rule

G1–G9 support a narrow noncanonical numerical proposal. They do not make it canonical. Model v1.0 may remain
in `proposed/` while G10–G17 are blocked or incomplete, provided every limitation and unsupported branch
fails closed.

## Canonical promotion rule

Promotion requires all of the following in one governed decision:

1. exact bundle/capability/emit schema validation and model-specific semantic validation;
2. executed KATs against the reference evaluator;
3. independent acceptance of the legacy-source screening grade and source-unit denominator;
4. acquisition and technical review of NEMA CS 70006-2026, with any disposition/water-quality implications
   reconciled without silently changing the FEMA source knots;
5. site-value, ownership, and exposure contracts that prevent component/assembly duplication;
6. a Hazard consumer able to carry the exact pathway, `substation_hazus_class`, axis payload,
   `water_quality_class`, `delivered_depth_basis`, and `source_assumption_set_id`;
7. M3/M4 dual-read, shadow results, no-bypass tests, and rollback;
8. atomically updated current/index/registry/changelog/handoff/model/docs/schema/SHA records.

Until then, no consumer cutover or reportable annual/tail metric is authorized.
