# Version registry — Damage Curve Library package v2.1

This registry separates **package release labels** from **semantic damage-model versions**.

The current package is a framework/documentation release. It adds:

```text
00_global_method/16_reference_ingestion_and_curve_update_protocol.md
00_global_method/17_versioning_policy.md
00_global_method/_templates/TEMPLATE_evidence_update_memo.md
```

No curve parameters, curve forms, failure-unit outputs, or runtime damage-code logic were changed in
this package release.

---

## Current cells

| Cell folder | Current semantic damage-model version | Current documentation revision | Current status | Notes |
|---|---:|---:|---|---|
| `hail_solar` | **model v1.0** | docs r3 | Current cell files still carry legacy `v1_3` labels | Hail curve was derived earlier; v1.2/v1.3 labels mainly reflect packaging, derivation dossier, and audit improvements. |
| `flood_solar` | **model v1.0** | docs r1 | Current | Derived multi-failure-unit flood model. |
| `wind_tornado_wind` | **model v1.0** | docs r1 | Current | Derived repeated-unit structural wind/tornado model. |

---

## Package release history summary

| Package release | Main change | Cell model changes? |
|---|---|---:|
| v1.3 | Hail × solar derivation audit package | Hail model already at v1.0 behavior; docs improved. |
| v1.6 | Flood × solar v1.0 derived cell | Yes: flood_solar model v1.0 introduced. |
| v2.0 | Wind/tornado × wind v1.0 derived cell | Yes: wind_tornado_wind model v1.0 introduced. |
| v2.1 | Evidence-ingestion and versioning governance | No. |

---

## Future naming recommendation

Use this semantic form in future cell files when possible:

```text
<cell_id>__model_v<MAJOR_MINOR>__docs_r<N>__<artifact>.md/xlsx
```

Example:

```text
hail_solar__model_v1_0__docs_r3__curve_derivation_dossier.md
```

The package itself can still use a simple release version:

```text
DAMAGE_CURVE_LIBRARY_V2_1_...
```

---

## Practical rule

```text
Package version changed ≠ damage curve changed.
Cell damage-model version changed = damage-code behavior changed.
```
