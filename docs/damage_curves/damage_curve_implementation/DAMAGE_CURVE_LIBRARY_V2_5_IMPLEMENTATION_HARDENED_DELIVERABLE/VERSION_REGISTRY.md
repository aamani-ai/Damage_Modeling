# Version registry — Damage Curve Library package v2.5

This registry separates **package release labels** from **semantic damage-model versions**.

The current package is an implementation-hardening release. It adds machine-readable JSON artifacts, capability declarations, cap-binding preflight gates, derivation-rationale addenda, and downstream handoff notes. It does **not** change the damage-code behavior of any current cell.

> Note: v2.5 increments documentation revisions because addenda and runtime contracts were appended. Some current source filenames still carry earlier labels (`v1_3`, `v1_0`, or `docs_r1`) for continuity; the registry and JSON artifacts are the authoritative current docs-revision references.


---

## Current cells

| Cell folder | Current semantic damage-model version | Current documentation revision | Current status | v2.5 implementation note |
|---|---:|---:|---|---|
| `hail_solar` | **model v1.0** | docs r5 | Current; current source filenames still carry legacy `v1_3` labels | Canonical JSON artifact now exposes the dossier curve and marks the legacy capex-weighted M3 curve as non-canonical. |
| `flood_solar` | **model v1.0** | docs r3 | Current | Canonical JSON artifact serializes the piecewise/state depth curves and capability gate. |
| `wind_tornado_wind` | **model v1.0** | docs r3 | Current | Canonical JSON artifact includes the hub-height axis, 10m→hub bridge contract, and capability gate. |
| `strong_wind_solar` | **model v1.0** | docs r2 | Current derived cell | Canonical JSON artifact serializes the thresholded logistic demand-ratio curves and capability gate. |

---

## Package release history summary

| Package release | Main change | Cell model changes? |
|---|---|---:|
| v1.3 | Hail × solar derivation audit package | Hail model already at v1.0 behavior; docs improved. |
| v1.6 | Flood × solar v1.0 derived cell | Yes: flood_solar model v1.0 introduced. |
| v2.0 | Wind/tornado × wind v1.0 derived cell | Yes: wind_tornado_wind model v1.0 introduced. |
| v2.1 | Evidence-ingestion and versioning governance | No. |
| v2.2 | Legacy evidence co-curation ingestion; validation/caveat/model-change distinction added to standard 16 | No. |
| v2.3 | Hazard-pathway scope splitting standard + strong_wind_solar v0.1 scaffold | New scaffold only; no DR curve parameters. |
| v2.4 | Strong wind × solar model v1.0 derived curve package | Yes: strong_wind_solar model v1.0 introduced. |
| v2.5 | Implementation hardening: JSON runtime artifacts, capability declarations, cap-binding gates, field-name alignment, handoff notes | No semantic DR changes. |

---

## Practical rule

```text
Package version changed ≠ damage curve changed.
Cell damage-model version changed = damage-code behavior changed.
Documentation revision changed = proof trail / contract / implementation wrapper changed, but same inputs produce the same DRs.
v0.1 scaffold = structure accepted but runtime DR not yet parameterized.
v1.0 = first derived runtime curve package for the cell.
```
