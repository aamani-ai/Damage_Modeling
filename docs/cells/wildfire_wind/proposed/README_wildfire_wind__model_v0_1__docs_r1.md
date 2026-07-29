# Wildfire × wind — proposed model v0.1/docs r1

## Outcome

This package establishes the final missing hazard × asset cell as a pressure-tested, noncanonical research
scaffold. It publishes no numerical damage curve.

```yaml
curve_records: []
canonical_runtime_artifact: false
runtime_reason: NO_RUNTIME_CURVE
artifact_index_entry: none
consumer_pin: none
```

## Central design decisions

1. Exogenous wildfire is separate from turbine-origin and lightning fire.
2. Thermal and firebrand attack retain separate delivered-load contracts.
3. A turbine fire is assembled as one dependency-safe repeated unit with explicit component zones.
4. Pad, collection, GSU apparatus, controls/met/O&M, foundation, and civil subjects remain separately located.
5. FSim semantics and wildfire site fields are reusable; wildfire-solar ordinates are not.
6. The old three logistics are rejected, including their fixed-distance/height proxies and conflicting tables.
7. Reference value supports anatomy and reconciliation only; site SOV/exposure remains external.

## Package map

1. [Change classification](CHANGE_CLASSIFICATION_wildfire_wind__model_v0_1__docs_r1.md)
2. [Seven-step audit](SEVEN_STEP_AUDIT_wildfire_wind__model_v0_1__docs_r1.md)
3. [Dossier](wildfire_wind_curve_derivation_dossier__model_v0_1__docs_r1.md)
4. [Source register](SOURCE_REGISTER_wildfire_wind__model_v0_1__docs_r1.csv) and
   [claim register](CLAIM_PARAMETER_REGISTER_wildfire_wind__model_v0_1__docs_r1.csv)
5. [Bounded search](BOUNDED_EVIDENCE_SEARCH_LOG_wildfire_wind__model_v0_1__docs_r1.md),
   [candidate audit](NUMERICAL_CANDIDATE_AUDIT_wildfire_wind__model_v0_1__docs_r1.md), and
   [legacy audit](LEGACY_EVIDENCE_INGESTION_wildfire_wind__model_v0_1__docs_r1.md)
6. [Value crosswalk](VALUE_CROSSWALK_wildfire_wind__model_v0_1__docs_r1.csv),
   [site adapter](SITE_CONDITION_ADAPTER_wildfire_wind__model_v0_1__docs_r1.md), and
   [shared-method crosswalk](SHARED_WILDFIRE_METHOD_CROSSWALK_wildfire_wind__model_v0_1__docs_r1.md)
7. [Artifact](wildfire_wind__model_v0_1__docs_r1__curve_artifact.json),
   [capability](wildfire_wind__model_v0_1__docs_r1__capability.json), and
   [contract tests](known_answer_tests_wildfire_wind__model_v0_1__docs_r1.json)
8. [Pressure test](PRESSURE_TEST_wildfire_wind__model_v0_1__docs_r1.md),
   [promotion gates](PROMOTION_GATE_MATRIX_wildfire_wind__model_v0_1__docs_r1.md), and
   [validation](VALIDATION_REPORT_wildfire_wind__model_v0_1__docs_r1.md)

The workbook is an audit companion. JSON, CSV registers, dossier, metadata, and handoff remain authoritative.
