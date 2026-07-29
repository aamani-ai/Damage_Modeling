# Flood × wind model v1.0 Hazard handoff proposal

> **Shadow/research contract only.** This model-v1.0/docs-r1 package is a noncanonical screening proposal.
> It is absent from the canonical artifact index, has no `current/` folder, and authorizes no Hazard cutover.

## What the proposal adds

The historical model-v0.1 boundary remains correct for component-level electrical and wind-facility subjects.
Model v1.0 adds one different-grain record: the exact legacy FEMA Hazus-MH 2.1 Table 7.9 whole-substation
depth-damage series for `FW_HAZUS_GSU_SUBSTATION_ASSEMBLY`.

```text
depth_ft = [0,1,2,3,4,5,6,7,8,9,10]
DR       = [0,.02,.04,.06,.07,.08,.09,.10,.12,.14,.15]
```

The evaluator uses linear interpolation only between adjacent knots. Negative depth rejects; depth above 10
ft withholds without clamping. The record is a legacy screening sensitivity, not a current Hazus result:
Hazus 7.0 marks electric power mapping-only and disables the visible default damage functions.

## Exact input boundary

If this package is later promoted, Hazard must supply:

```yaml
pathway_id: flood_inundation_contact
failure_unit_id: FW_HAZUS_GSU_SUBSTATION_ASSEMBLY
substation_hazus_class: ESSL | ESSM | ESSH
source_assumption_set_id: FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION
water_quality_class: freshwater_non_contaminated
delivered_depth_basis: unprotected_or_internal_post_bypass_depth
```

It must also supply exactly one of:

```yaml
flood_depth_above_substation_grade_ft: <finite number>
```

or:

```yaml
water_surface_elevation_m: <finite number>
substation_grade_elevation_m: <finite number>
water_surface_vertical_datum_id: <exact ID>
substation_grade_vertical_datum_id: <same exact ID>
```

The bridge is `(WSE_m - grade_m) × 3.280839895013123`. Missing/partial/ambiguous payloads, datum mismatch,
nonfinite values, negative depth, unknown source class, or absent source acknowledgement fail closed.
Saltwater, brackish, contaminated, chemically contaminated, and unknown water states withhold.

## Failure-unit and value boundary

The response belongs to one complete facility-level substation and its full same-substation direct
replacement-value denominator. It is mutually exclusive with:

- `FW_GSU_SWITCHGEAR`
- `FW_GSU_TRANSFORMER_MAIN`
- `FW_GSU_TRANSFORMER_AUX_CONTROLS`
- `FW_GSU_PROTECTION_SCADA`
- `FW_GSU_STATION_SERVICE_DC`
- `FW_GSU_CABLE_TERMINATIONS`

Those units, turbine-base/pad/collection/foundation/civil/elevated equipment, and support rows remain
null/withheld—not zero.

Hazard must never bind the assembly DR to full-project TIV, the mixed NREL `72 USD/kW` electrical row, the
legacy 9% substation share, or a turbine-count multiplier. One shared or hybrid-site physical substation is
represented and valued once across solar and wind. Canonical promotion is required before any scenario-loss
value binding; the review evaluator emits DR only.

## Compound-event boundary

Preserve one `event_family_id` while routing direct inundation, tropical-cyclone wind, tornado, surge/wave,
scour/erosion, debris, wildfire, outage, and interruption through their own causal pathways. No pathway may
charge the same physical substation or component value twice.

## Required pre-promotion tests

1. Reproduce all 15 formula, 6 withheld, and 16 error-code KATs.
2. Verify bundle-v3/capability-v3/emit-v2 plus exact model/docs/schema/SHA pins.
3. Prove direct-depth and WSE bridge modes are mutually exclusive and datum safe.
4. Prove out-of-range and unsupported water states withhold without a clamp or fallback.
5. Prove the assembly and every component record cannot be charged together.
6. Prove one physical GSU is not repeated by turbine count or duplicated across a hybrid site.
7. Complete independent FEMA transcription/method and wind-substation applicability review.
8. Acquire and technically review NEMA CS 70006-2026.
9. Approve the proposed pathway-aware piecewise-linear schema contract.
10. Shadow the exact adapter through M3 and independent M4 with rollback and no bypass.
11. Record an explicit canonical promotion decision.

Until those gates pass, scenario loss, EAL, PML, VaR, TVaR, portfolio accumulation, and financial metrics
remain withheld. The model-v0.1 handoff remains the execution rule; model v1.0 is reviewable implementation
evidence only.
