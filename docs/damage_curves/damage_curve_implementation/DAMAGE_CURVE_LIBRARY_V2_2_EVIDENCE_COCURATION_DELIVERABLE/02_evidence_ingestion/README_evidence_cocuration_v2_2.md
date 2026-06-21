# Evidence co-curation ingestion · v2.2

This folder records the first **standard-16 evidence-ingestion pass** using the legacy
`infrasure-damage-curves` evidence triage files supplied after the current cell models were built.

This is a **documentation / evidence-governance release only**:

```text
No curve parameters changed.
No runtime damage-code behavior changed.
No cell damage-model version changed.
```

The purpose is to improve auditability and make the derivation dossiers more honest: stronger validation
references are noted, caveats are documented, and candidate future model changes are separated from current
v1 adoption.

---

## What this folder contains

| File | Purpose |
|---|---|
| `README_evidence_cocuration_v2_2.md` | This overview. |
| `hail_solar_evidence_update_memo__model_v1_0__docs_r4.md` | Hail × solar evidence ingestion memo. |
| `flood_solar_evidence_update_memo__model_v1_0__docs_r2.md` | Flood × solar evidence ingestion memo. |
| `wind_tornado_wind_evidence_update_memo__model_v1_0__docs_r2.md` | Wind/tornado × wind evidence ingestion memo. |
| `evidence_ingestion_register_v2_2.xlsx` | Structured register of adopt / park / reject / candidate model-change decisions. |

The source triage files are stored in:

```text
99_source_context/evidence_harvest/triage/
├─ 01_hail_solar_triage.md
├─ 01_flood_solar_triage.md
└─ 01_wind_tornado_wind_triage.md
```

---

## How this pass should be interpreted

```text
The old evidence is useful.
The old curve parameters are not adopted wholesale.
```

Each uploaded triage file was treated as a decision memo, not as raw source data. It tells us which
references appear useful, which are redundant, which are parked, and which items could become future
model updates.

For a full future refit, the raw research files should also be reviewed:

```text
research/hail_solar.md
research/flood_solar.md
research/wind_tornado_wind.md
```

Those raw files were not included in this upload, so v2.2 does not claim new source extraction beyond the
triage-level decisions.

---

## Summary by cell

| Cell | Current semantic model version | Evidence ingestion outcome | Model version change? | Candidate future model changes |
|---|---:|---|---:|---|
| `hail_solar` | model v1.0 | Validation + caveats only | No | None adopted; `f_hail` remains open |
| `flood_solar` | model v1.0 | References + anchors into evidence map | No | Transformer-type selector; salinity; duration conditioner |
| `wind_tornado_wind` | model v1.0 | Cross-validation + physics support + honest gap statement | No | Numeric yaw-error conditioner; tornado D50-shift refinement; IEC class offsets |

---

## Decision rule used

```text
same inputs → same DR:
    documentation revision only

same inputs → different DR:
    model-version update
```

All three ingestions are currently the first case.
