# Source Drop Manifest — v2.5 Implementation Hardened ZIP

Status: raw ZIP preserved in repo; useful contents promoted into canonical docs/source-context paths. A local
extracted source mirror may be recreated for inspection, but extracted contents are not canonical docs.

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

The ZIP was opened and compared byte-for-byte during cleanup. The opened copy matched the ZIP exactly. The
tracked duplicate deliverable tree was removed after useful contents were promoted into `docs/method/`,
`docs/contracts/`, `docs/cells/`, `docs/evidence/`, `scripts/reference_helpers/`, and
`docs/source_drops/context/`.

A local extracted mirror is allowed under:

```text
docs/source_drops/extracted/v2_5_implementation_hardened/
```

That mirror is for inspection and comparison only. It should be recreated from the raw ZIP when needed and is
ignored by Git by default.

## Notable Source-Context Items

| Item | Current treatment |
|---|---|
| `99_source_context/solar_wind_value_breakdown.xlsx` | Reader-facing copy lives at `docs/method/value_basis/solar_wind_value_breakdown.xlsx`; original remains in the ZIP. |
| `99_source_context/damage_curve_foundations/` | Canonical foundation docs live under `docs/method/foundations/`; original source-context copy remains in the ZIP. |
| `99_source_context/evidence_harvest/` | Current discussion history remains under `docs/extra/discussion/evidence_harvest/`; original source-context copy remains in the ZIP. |

## Placement Rule

Raw ZIP stays in `docs/source_drops/raw_zips/`.

Extracted source mirrors may live under `docs/source_drops/extracted/` as ignored local staging copies.

Extracted/canonical material should be split only by role:

```text
method foundations/standards -> docs/method/
Hazard-facing contracts       -> docs/contracts/
current cell packages         -> docs/cells/
cross-cell evidence protocol  -> docs/evidence/
reference helper scripts      -> scripts/reference_helpers/
source/provenance context     -> docs/source_drops/context/
runtime artifacts            -> deferred until publishing/loading design
```
