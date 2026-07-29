# Flood-wind shared-electrical assumptions

## FWSE-A1 — FERC configuration is class anatomy, not an observed site

**Status:** active.

The wind/solar Plant-GSU configuration supports a reusable class template. It does not assert that every project has one transformer, shares equipment, or uses a particular voltage, owner, elevation, or value.

## FWSE-A2 — the same delivered contact state can be source-peril neutral

**Status:** active with conditions.

Riverine, pluvial, and coastal water can use the same intrinsic contact response only after local depth, datum, duration, water quality/salinity/contamination, velocity/debris routing, and event identity are preserved. Equal grade depth alone is not equality.

## FWSE-A3 — flood-solar numerics are candidate evidence

**Status:** active.

`FS_SWG`, `FS_XFMR`, `FS_SCADA`, and `FS_CABLE` are deterministic T3 engineering proxies. Their canonical status inside `flood_solar` does not make them universally calibrated common curves.

## FWSE-A4 — CWER is a reference value archetype

**Status:** active.

The 72 2023 USD/kW wind electrical row is a mixed external-electrical bucket. It is not a GSU value and does not support the consumer's separate 9% electrical plus 9% substation split.

## FWSE-A5 — spatial and ownership facts are site-specific

**Status:** active.

The class-template asset model intentionally omits geometry, owner, contract, and finance records. A real binding requires a site asset schedule, one-line, elevations, ownership/insurance evidence, and component values.

## FWSE-A6 — current Hazard code remains a regression fixture

**Status:** active.

The pinned code is reproducible and useful for old-versus-new characterization. Its curve parameters, value shares, zero/dry defaults, centroid fallback, and aggregate buckets are not evidence.

## FWSE-A7 — no runtime release is implied by complete documentation

**Status:** active.

Validation of the scaffold proves governance coherence and fail-closed behavior only. Numeric promotion requires a separately reviewed semantic model v1.0 or later.

## FWSE-A8 — the Hazus-MH 2.1 series is source-native but legacy screening-grade

**Status:** active with strict limits.

The exact Table 7.9 ordinates may be reproduced without re-fitting, but their publication does not establish renewable-specific calibration, modern equipment applicability, conditioner effects, or component-level causation. Hazus-MH 2.1 itself says electric-power implementation was deferred; current Hazus 7.0 mapping-only treatment and disabled default electric curves reinforce that negative authority signal. The grade cannot be upgraded by calling the numbers FEMA-derived.

## FWSE-A9 — the Hazus ordinate uses one whole-substation denominator

**Status:** active.

The percentage applies to the full replacement cost of one physical substation assembly. A binding requires the same substation's direct replacement value and ownership/inclusion evidence. The mixed CWER `72 USD/kW` electrical row, total project TIV, and a controls-only value are not valid denominators.

## FWSE-A10 — assembly and component modes do not coexist

**Status:** active.

For one substation and event, the model may evaluate either the legacy whole-substation screening assembly or separately qualified switchgear, transformer, auxiliary/control, protection/SCADA, station-service/DC, and termination units. It may not emit or value both. Component deep curation is intended to replace or demote the assembly, not accumulate on top of it.
