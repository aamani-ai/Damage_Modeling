# Evidence update memo · wind/tornado × wind · model v1.0 · docs r2

## 1. Update type

```text
cell_id: WIND_TORNADO_WIND
semantic_damage_model_version: v1.0
new_documentation_revision: docs r2
update_type: evidence co-curation / cross-validation and physics-support ingestion
runtime_DR_change: no
```

This memo records the standard-16 ingestion of the legacy wind/tornado × wind evidence triage. The ingestion
is **documentation-only** for v2.2: the current design-normalized logistic fragility-style v1.0 model is retained.

---

## 2. Adopted as validation / physics support

| Evidence | Strengthens current seam | Disposition | Runtime effect |
|---|---|---|---:|
| Typhoon Usagi 2013 | Single-EF4-anchor gap | Adopt as second empirical validation point / cross-check | None |
| Rose et al. 2012 PNAS | Engineering-fit tower curve | Adopt as tower fragility cross-validation | None |
| Kareem et al. 2023 | Tornado D50-shift rationale | Adopt as physics support for tornado-shift seam | None |
| Kapoor et al. 2020 | Yaw/feather conditioner | Adopt as conditioner support, numeric adoption deferred | None |
| Punta Lima / Maria 2017 | High-severity total-loss plausibility | Adopt as case evidence for upper-tail plausibility | None |
| UTM 2024 collapse review | Tower failure mechanism | Adopt as failure-mechanism / stress-concentration context | None |

---

## 3. Honest gap statement added

```text
Measured tornado-on-turbine fragility remains sparse.
```

The current tornado treatment should be described as:

```text
informed by physics,
checked against sparse case anchors,
not calibrated from a full measured tornado-on-turbine fragility dataset.
```

---

## 4. Candidate model v1.1 changes, not adopted in v2.2

```text
numeric yaw-error conditioner
tornado D50-shift refinement
IEC Class II / III offsets
```

---

## 5. Version call

```text
same inputs before update → same DR after update
cell damage-model version: unchanged at wind_tornado_wind model v1.0
documentation revision: docs r2
```

---

## 6. Source pointers

```text
source triage:
    99_source_context/evidence_harvest/triage/01_wind_tornado_wind_triage.md

raw research file desired for future deeper refit:
    research/wind_tornado_wind.md
```
