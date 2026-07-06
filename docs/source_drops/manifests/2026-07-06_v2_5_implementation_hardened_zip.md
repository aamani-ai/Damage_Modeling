# Source Drop Manifest — v2.5 Implementation Hardened ZIP

Status: raw ZIP preserved in repo.

## Source Drop

| Field | Value |
|---|---|
| Source file | `DOWNLOAD_THIS_damage_curve_library_v2_5_implementation_hardened.zip` |
| Original local path | `/Users/divy/Downloads/DOWNLOAD_THIS_damage_curve_library_v2_5_implementation_hardened.zip` |
| Repo path | `docs/source_drops/raw_zips/DOWNLOAD_THIS_damage_curve_library_v2_5_implementation_hardened.zip` |
| Size | `4,670,372` bytes |
| SHA-256 | `d92b4194ccddcf720172e7ccdc1623491f8adbb35780e7cdac4bb7e6dcec406e` |
| ZIP root | `DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/` |
| Received / recorded | `2026-07-06` |

## Classification

The ZIP is the raw source drop. Preserve it unchanged.

The extracted directory currently under
`docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/`
is a mixed extracted deliverable bundle. It contains current cell packages, method standards, contracts,
schemas, helper scripts, evidence-ingestion material, and source context. Do not move the whole extracted
bundle into `docs/source_drops/` as if it were only raw research.

## Notable Source-Context Items

| Item | Current treatment |
|---|---|
| `99_source_context/solar_wind_value_breakdown.xlsx` | Preserved inside the extracted deliverable. A byte-identical reader-facing copy lives at `docs/method/value_basis/solar_wind_value_breakdown.xlsx`. |
| `99_source_context/damage_curve_foundations/` | Source-context copy of foundation material bundled into v2.5. Canonical foundation docs remain under `docs/damage_curves/damage_curve_foundations/` until a reviewed move to `docs/method/foundations/`. |
| `99_source_context/evidence_harvest/` | Source-context evidence-harvest copy bundled into v2.5. Current discussion history remains under `docs/extra/discussion/evidence_harvest/`. |

## Placement Rule

Raw ZIP stays in `docs/source_drops/raw_zips/`.

Extracted/canonical material should be split only by role:

```text
method/foundations/standards -> docs/method/
Hazard-facing contracts      -> docs/contracts/
current cell navigation      -> docs/cells/
cross-cell evidence protocol -> docs/evidence/
source/provenance context    -> docs/source_drops/extracted/ after reviewed mapping
runtime artifacts            -> deferred until publishing/loading design
```
