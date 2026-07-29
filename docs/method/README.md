# docs/method/

Index for durable damage-modeling method docs.

This is the durable method surface. `foundations/` contains the canonical principles and question docs;
`standards/` contains the global method standards; `templates/` contains package templates; `value_basis/`
contains reader-facing valuation support.

## Shared component substrates

- [`shared_components/README.md`](shared_components/README.md)
- [`shared_components/flood_electrical/`](shared_components/flood_electrical/README.md) — non-runtime
  equipment/mechanism vocabulary and binding rules shared by flood-solar and proposed flood-wind work.
- [`shared_components/solar_wind_normalized_response/`](shared_components/solar_wind_normalized_response/README.md)
  — comparison-only, solar-specific synthetic normalized-response fingerprint. It is not runtime approved and
  cannot populate a cell bundle; the tropical-cyclone wind × solar v2 candidate adopts its parameters
  independently as cell-local Tier-4 decisions and checks equality only for audit.
- Governing standard:
  [`20_shared_component_substrate_standard.md`](standards/20_shared_component_substrate_standard.md).

## Value Basis

- [`value_basis/README.md`](value_basis/README.md)
- [`value_basis/supporting_evaluation_guide.md`](value_basis/supporting_evaluation_guide.md)
- [`value_basis/solar_wind_value_breakdown.xlsx`](value_basis/solar_wind_value_breakdown.xlsx)

The value-basis workbook is a method support artifact. The original source-drop copy remains in the raw ZIP.

## Foundations

- [`foundations/README.md`](foundations/README.md)
- [`00_assembled_curve_record.md`](foundations/00_assembled_curve_record.md)
- Principles:
  [`P1`](foundations/principles/P1_system_coherence_over_local_elegance.md),
  [`P2`](foundations/principles/P2_discussion_before_commitment.md),
  [`P3`](foundations/principles/P3_reference_is_input_not_authority.md)

## Question docs

- [`01_granularity.md`](foundations/questions/01_granularity.md)
- [`02_x_axis_intensity_variable.md`](foundations/questions/02_x_axis_intensity_variable.md)
- [`03_valuation_guide.md`](foundations/questions/03_valuation_guide.md)
- [`04_curation_derivation.md`](foundations/questions/04_curation_derivation.md)
- [`05_emit_object.md`](foundations/questions/05_emit_object.md)
- [`06_metrics_and_tail_honesty.md`](foundations/questions/06_metrics_and_tail_honesty.md)

## Global method standards

- [`00_index.md`](standards/00_index.md)
- [`02_cell_package_standard.md`](standards/02_cell_package_standard.md)
- [`03_failure_unit_coverage_standard.md`](standards/03_failure_unit_coverage_standard.md)
- [`04_x_axis_decision_standard.md`](standards/04_x_axis_decision_standard.md)
- [`05_curve_derivation_dossier_standard.md`](standards/05_curve_derivation_dossier_standard.md)
- [`06_curve_form_and_adjustment_standard.md`](standards/06_curve_form_and_adjustment_standard.md)
- [`07_selector_conditioner_exposure_standard.md`](standards/07_selector_conditioner_exposure_standard.md)
- [`08_evidence_provenance_and_links_standard.md`](standards/08_evidence_provenance_and_links_standard.md)
- [`16_reference_ingestion_and_curve_update_protocol.md`](standards/16_reference_ingestion_and_curve_update_protocol.md)
- [`17_versioning_policy.md`](../contracts/standards/17_versioning_policy.md)
- [`18_hazard_pathway_scope_splitting_standard.md`](standards/18_hazard_pathway_scope_splitting_standard.md)
- [`20_shared_component_substrate_standard.md`](standards/20_shared_component_substrate_standard.md)

## Cell basics templates

- [`TEMPLATE_cell_basics_README.md`](templates/TEMPLATE_cell_basics_README.md) — first-reader concepts,
  terminology, ASCII physical picture, and worked example.
- [`TEMPLATE_cell_basics_HOW_THE_MODEL_IS_BUILT.md`](templates/TEMPLATE_cell_basics_HOW_THE_MODEL_IS_BUILT.md)
  — evidence-to-SHIP reasoning chain.
- [`TEMPLATE_cell_basics_MODEL_REFERENCE.md`](templates/TEMPLATE_cell_basics_MODEL_REFERENCE.md) — exact
  curves/state tables, fields, value links, capability, tests, and sources.
