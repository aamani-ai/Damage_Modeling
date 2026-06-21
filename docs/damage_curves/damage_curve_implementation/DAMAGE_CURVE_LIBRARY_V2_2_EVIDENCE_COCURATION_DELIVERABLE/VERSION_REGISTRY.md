# Version registry — Damage Curve Library package v2.2

This registry separates **package release labels** from **semantic damage-model versions**.

The current package is an evidence co-curation documentation release. It adds:

```text
00_global_method/16_reference_ingestion_and_curve_update_protocol.md
    expanded with validation / caveat / curve-changing evidence rules

02_evidence_ingestion/
    evidence update memos and structured register for hail_solar, flood_solar, and wind_tornado_wind

99_source_context/evidence_harvest/
    uploaded legacy evidence co-curation kickoff and triage files
```

No curve parameters, curve forms, failure-unit outputs, or runtime damage-code logic were changed in this
package release.

---

## Current cells

| Cell folder | Current semantic damage-model version | Current documentation revision | Current status | Notes |
|---|---:|---:|---|---|
| `hail_solar` | **model v1.0** | docs r4 | Current cell files still carry legacy `v1_3` labels | v2.2 adds validation/caveats only; no DR change. |
| `flood_solar` | **model v1.0** | docs r2 | Current | v2.2 adds reference anchors and candidate v1.1 flags; no DR change. |
| `wind_tornado_wind` | **model v1.0** | docs r2 | Current | v2.2 adds cross-validation/physics support and candidate v1.1 flags; no DR change. |

---

## Package release history summary

| Package release | Main change | Cell model changes? |
|---|---|---:|
| v1.3 | Hail × solar derivation audit package | Hail model already at v1.0 behavior; docs improved. |
| v1.6 | Flood × solar v1.0 derived cell | Yes: flood_solar model v1.0 introduced. |
| v2.0 | Wind/tornado × wind v1.0 derived cell | Yes: wind_tornado_wind model v1.0 introduced. |
| v2.1 | Evidence-ingestion and versioning governance | No. |
| v2.2 | Legacy evidence co-curation ingestion; validation/caveat/model-change distinction added to standard 16 | No. |

---

## Future naming recommendation

Use this semantic form in future cell files when possible:

```text
<cell_id>__model_v<MAJOR_MINOR>__docs_r<N>__<artifact>.md/xlsx
```

Example:

```text
hail_solar__model_v1_0__docs_r4__curve_derivation_dossier.md
```

The package itself can still use a simple release version:

```text
DAMAGE_CURVE_LIBRARY_V2_2_...
```

---

## Practical rule

```text
Package version changed ≠ damage curve changed.
Cell damage-model version changed = damage-code behavior changed.
```
