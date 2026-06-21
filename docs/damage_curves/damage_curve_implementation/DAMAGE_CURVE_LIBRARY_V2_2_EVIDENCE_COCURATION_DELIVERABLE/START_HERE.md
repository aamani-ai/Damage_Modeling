# START HERE — Damage Curve Library package v2.2

This package contains the current damage-curve library framework plus three worked cells:

```text
01_cells/
├─ hail_solar/           semantic model v1.0; docs r4; current filenames still carry legacy v1.3 labels
├─ flood_solar/          semantic model v1.0; docs r2
└─ wind_tornado_wind/    semantic model v1.0; docs r2
```

**v2.2 is an evidence co-curation documentation release.** It ingests useful legacy evidence triage notes into
the current framework, expands the reference-ingestion guide with the validation/caveat/model-change distinction,
and adds evidence update memos for all three current cells.

```text
No curve parameters changed.
No curve forms changed.
No runtime damage-code behavior changed.
No cell damage-model version changed.
```

---

## Recommended read order

```text
1. VERSION_REGISTRY.md
2. 00_global_method/00_index.md
3. 00_global_method/13_end_to_end_damage_work_architecture.md
4. 00_global_method/14_coverage_role_taxonomy.md
5. 00_global_method/16_reference_ingestion_and_curve_update_protocol.md
6. 00_global_method/17_versioning_policy.md
7. 02_evidence_ingestion/README_evidence_cocuration_v2_2.md
8. The cell folder you are working on under 01_cells/
```

---

## What is new in v2.2

```text
Updated:
    00_global_method/16_reference_ingestion_and_curve_update_protocol.md
        now explicitly separates validation, caveat, open-seam support, and curve-changing evidence

Added:
    02_evidence_ingestion/README_evidence_cocuration_v2_2.md
    02_evidence_ingestion/hail_solar_evidence_update_memo__model_v1_0__docs_r4.md
    02_evidence_ingestion/flood_solar_evidence_update_memo__model_v1_0__docs_r2.md
    02_evidence_ingestion/wind_tornado_wind_evidence_update_memo__model_v1_0__docs_r2.md
    02_evidence_ingestion/evidence_ingestion_register_v2_2.xlsx

Added source context:
    99_source_context/evidence_harvest/README_evidence_cocuration_kickoff.md
    99_source_context/evidence_harvest/triage/01_hail_solar_triage.md
    99_source_context/evidence_harvest/triage/01_flood_solar_triage.md
    99_source_context/evidence_harvest/triage/01_wind_tornado_wind_triage.md
```

---

## Key reminder

The purpose of this library is not to own EAL, PML, or portfolio metrics. It defines the right **damage-code
granularity**, x-axis, curve form, metadata, coverage roles, source evidence, and value linkage so downstream
hazard and financial systems can compute those metrics correctly.

---

## Source context note

The evidence co-curation triage files are included under:

```text
99_source_context/evidence_harvest/
```

The raw research files referenced by the triage notes were not included in the upload. For any future model-changing
refit, pull those raw files or source PDFs before changing curve parameters.
