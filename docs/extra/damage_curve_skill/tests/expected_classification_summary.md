# Expected classification summary

| Case | Expected class | Key version rule |
|---|---|---|
| docs_evidence_update_hail_solar | EVIDENCE_ONLY_NO_OUTPUT_CHANGE | docs revision only; model unchanged |
| new_cell_scaffold_tornado_solar | NEW_CELL_SCAFFOLD | no false v1.0 release |
| fail_closed_site_conditioned_scaffold | NEW_CELL_SCAFFOLD | rigorous evidence package and no-curve withholding gates required |
| strong_wind_solar_parameter_update | MODEL_BEHAVIOR_CHANGE | model bump required |
| damage_emit_required_field | SCHEMA_CONTRACT_CHANGE | schema bump required |
| wind_tornado_wind_multi_pathway_model_revamp | MODEL_BEHAVIOR_CHANGE | major model bump plus pathway-specific evidence/KAT/consumer gates |
| required_pathway_id_schema_contract | SCHEMA_CONTRACT_CHANGE | schema bump plus pathway migration/pin gates |
| legacy_curve_deprecation | DEPRECATION_OR_LEGACY_STATUS_CHANGE | no model bump unless runtime routing changes |
