# Hail × solar M3 canonicalization handoff

## Problem

The curated hail × solar damage-library cell is a failure-unit curve:

```text
MESH-equivalent hail diameter → PV_MODULE_GLASS_CELL replacement DR
```

The known legacy M3 implementation path used an asset-level capex-weighted blend. That blend is not the canonical curated curve because it disagrees on both grain and parameters.

## Required external M3 behavior

M3 should load:

```text
01_cells/hail_solar/current/hail_solar__model_v1_0__docs_r5__curve_artifact.json
```

and evaluate one of the canonical archetype curves:

```text
HAIL_SOLAR_FRAGILE_THIN_GG
HAIL_SOLAR_DEFAULT_3P2_GBS
HAIL_SOLAR_HARDENED_THICKER
```

## Blocked/non-canonical artifact

```text
hail_solar_asset_capex_weighted.json
```

Status:

```text
non_canonical_legacy_placeholder
```

M3 may retain it only for back-testing or historical comparison, and must label outputs as legacy-placeholder, not curated-library EAL.

## Migration rule

```text
old: M3 embeds/vends curve parameters
new: M3 imports canonical damage-library JSON and emits failure-unit DRs + flags
```

A downstream value layer may then convert the PV module DR into loss using the physical replaceable value basis.
