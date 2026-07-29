# 01 — Existing reuse and gap audit

> Status: reviewed · Date: 2026-07-28.

## Canonical flood-solar source

The current reusable reference is `flood_solar@model_v1_0__docs_r4`, artifact SHA-256 `a08e77ef034e1ecea3e7cd05d13c825921b54d610fca9de8651ebda8e857082d`.

| Solar record | Reuse level for flood_wind v0.1 | Finding |
|---|---|---|
| `FS_SWG` | definition + axis + pinned candidate ordinates | Best common candidate, but the ordinates are T3 engineering proxies and are not silently promoted. |
| `FS_XFMR` | concept only; decomposition required | Current record mixes main-transformer value with a control/terminal datum. Split main active system from auxiliaries and controls. |
| `FS_SCADA` | partial semantic reuse | Plant monitoring is not automatically the same as substation protection, relays, communications, and control-house equipment. |
| `FS_CABLE` | mechanism only | AC/DC cable rollup lacks a pinned construction formula; wind MV cable, terminations, pull boxes, and conduits need separation. |
| `FS_FOUND` | no numeric reuse | Existing scour response is a T4 placeholder and belongs to a separate pathway. |
| `FS_INV`, `FS_COMB`, `FS_PVMOD` | no direct reuse | Solar-specific, or only adjacent to wind equipment. |

Reusable method facts are stronger than the reusable numbers:

- local water depth above the vulnerable component datum;
- state-like/tabular response rather than one plant-level curve;
- equipment type, enclosure/submersion rating, transformer construction, and cable construction as selectors;
- duration, contamination/salinity, and energized/shutdown state as conditioners;
- component value and exposed fraction outside intrinsic fragility.

## Hazard consumer placeholder

The current Hazard flood/wind M3 code is a useful regression fixture, not calibration. It uses fixed project shares and four anchored logistics:

| Bucket | L | k | x0 ft | Audit disposition |
|---|---:|---:|---:|---|
| turbine electrical | 0.90 | 3.0 | 0.75 | borrowed solar-inverter analogy; reject as wind equipment calibration |
| aggregated substation | 0.95 | 2.5 | 1.50 | blends transformer, switchgear, controls, and value |
| civil | 0.70 | 1.2 | 2.00 | mechanism and depth conflated |
| foundation | 0.40 | 0.8 | 3.00 | judgment; scour/soil pathway mixed into inundation |

The code subtracts the logistic value at zero but does not renormalize. Therefore `L` is not its actual asymptote. The actual maximum TIV contributions are approximately 0.16221 for turbine-base buckets and 0.08354 for the substation, totaling 0.24574—not the documented 0.28/0.09/0.37 ceilings.

The fixed substation share of 9% is also not supported by the current CWER ledger. That ledger contains one mixed external-electrical row of 72 2023 USD/kW and requires a split. A mapped substation location or OSM role proves neither ownership nor insured-value inclusion.

## Gap that blocks a runtime curve

No reviewed public chain currently joins, for representative wind-farm electrical equipment:

    local depth + duration + water quality + state
      -> inspected component disposition
      -> same-unit direct repair/replacement cost
      -> selector-qualified population response

`flood_wind` therefore begins as a noncanonical zero-curve scaffold. Candidate solar ordinates remain visible and pinned in the audit layer; they cannot populate a damage emit.
