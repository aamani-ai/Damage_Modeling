# Tropical-cyclone wind × Wind Farm — model v1.1 screening-proxy plan

> **Plan of record — owner-approved behavior change, not yet promoted.** Preserve the current
> `tropical_cyclone_wind_wind@model_v1_0__docs_r1` source-native partial screen while building a proposed
> model-v1.1 capability for Hazard's canonical `20 × 5 MW`, `100 MW`, `$140M` Wind Farm.

## Decision in plain language

The best available source curve for the canonical turbine is the Jaimes `3.3 MW / 100 m` record. Version 1.1
will allow that exact numerical curve to screen the canonical `5 MW / 100 m` turbine only when the caller
explicitly requests the owner-approved bridge. This is a named bridge, not nearest-neighbour selection.

- Do **not** multiply or divide damage by `5 / 3.3`.
- Do **not** change the curve's `3-second peak gust at 10 m, km/h` axis.
- Do **not** relabel the source record as evidence for a 5 MW turbine.
- Do **not** apply the curve to every dollar of the plant.
- Do carry `OWNER_APPROVED_SCREENING_PROXY` and exact source/target identities in every result.

## Version and release identities

| Coordinate | Decision |
|---|---|
| Damage cell | `model v1.0 → model v1.1`, because an identical request can gain a newly supported route only through the explicit proxy fields |
| Damage docs | new `docs r1` package for model v1.1 |
| Bundle / emit schema | remain `damage_curve_record_bundle.v3` / `damage_emit.v2` unless validation proves an incompatible required field is unavoidable |
| Hazard scientific delivery | Hurricane × Wind Farm remains **Version 1**; this work completes that delivery rather than creating Hazard Version 2 |
| Current Damage pointer | remains v1.0 until the Hazard consumer migration, KATs, cap, full-grid and rollback gates pass |

The governed classification is in
[`CHANGE_CLASSIFICATION_tropical_cyclone_wind_wind__model_v1_1__docs_r1.md`](../../cells/tropical_cyclone_wind_wind/proposed/CHANGE_CLASSIFICATION_tropical_cyclone_wind_wind__model_v1_1__docs_r1.md).

## Covered-value contract

The canonical Wind Farm's installed TIV is `$140,000,000`. Model v1.1 deliberately covers only the shared
profile's rotor, nacelle and tower value shares:

| Subsystem | Share of project TIV | Treatment |
|---|---:|---|
| rotor | 0.26 | covered by the screening proxy |
| nacelle | 0.21 | covered by the screening proxy |
| tower | 0.16 | covered by the screening proxy |
| **covered total** | **0.63** | Damage ratio may act only on this value |
| foundation, substation, electrical, civil | **0.37** | withheld, never treated as zero |

At the current canonical value, the covered-value cap is `$88,200,000`; `$51,800,000` remains outside this
wind-only model. Damage owns the failure-unit and value-crosswalk declaration. Hazard owns event loss,
frequency, EAL/PML and the aggregate cap. Hazard must report both loss as `% of covered value` and `% of full
project TIV` so the partial scope cannot be mistaken for complete plant coverage.

## Implementation sequence

### D1 · Build the proposed v1.1 package

- preserve every v1.0 artifact and source-native selector byte-for-byte;
- add one exact proxy policy ID for `CONUS_WIND_FARM_REFERENCE_V1`;
- bind requested `5 MW / 100 m` to the unchanged Jaimes `3.3 MW / 100 m` curve;
- add the `WT_TURBINE_EQUIPMENT_ASSEMBLY` screening result only under that policy;
- add the 0.63 value crosswalk and partial-coverage capability; and
- keep all other selectors, units, axes and whole-farm defaults fail-closed.

### D2 · Prove behavior

- old-v-new identity for all exact v1.0 requests;
- the 5 MW proxy DR equals the 3.3 MW source DR at representative speeds;
- calls without explicit opt-in fail closed;
- unsupported turbine sizes remain withheld;
- no capacity-ratio scaling occurs;
- covered dollars never exceed `0.63 × TIV`; and
- the uncovered 0.37 is present as withheld metadata, not folded into zero damage.

### D3 · Consumer migration and promotion

- Hazard pins cell/model/docs/schema/artifact SHA exactly;
- the Hurricane M2 decision is measured independently of this model;
- Hazard passes event-identity, zero, cap, full-grid, geography and reproduction gates;
- promotion is create-only with the manifest written last; and
- v1.0 remains the rollback pin until the migrated consumer is verified.

## Done when

This plan is complete only when the proposed Damage package and Hazard Version-1 consumer agree on the exact
asset profile, proxy policy, wind axis, covered-value cap and limitation flags; all KATs pass; and production
can reproduce the published package without a notebook dependency.

