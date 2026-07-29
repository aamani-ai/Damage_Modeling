# Hazard handoff boundary — hail_wind model v0.1 scaffold

## Consumer disposition

```yaml
cell_id: hail_wind
damage_code_id: HAIL_WIND_PROPOSED_V0_1
semantic_damage_model_version: model v0.1
documentation_revision: docs r2
runtime_scaffold_revision: docs r1
canonical_runtime_pin: none
canonical_runtime_artifact: false
curve_record_count: 0
artifact_index_entry: none
consumer_pin: none
hazard_runtime_change: none
action: do_not_load_or_cut_over
```

This boundary records a governed coverage scaffold. It does not authorize Hazard M3 to emit a hail damage
ratio, use the rejected legacy real-estate hail array, transfer the solar-hail curve, or convert a null result
to zero.

The docs-r2 deep-curation review is a strict v1 `NO_GO`. New coupon, field, simulation, test-method, and
engineering-guidance evidence improves acquisition and inspection design but still does not provide a
blade-local occurrence disposition-to-cost curve. The docs-r1 artifact, capability, KATs, and workbook remain
unchanged.

## Ownership

| Damage Modeling owns | Hazard/consumer owns |
|---|---|
| future blade-contact demand bridge and economic damage records | hail event catalog, swath/product lineage, and event identity |
| failure-unit identities, selectors, conditioners, and direct physical DR | site inventory, turbine/BOP geometry, value, and exposure coupling |
| curve/version/provenance/capability | compound-event coordination and duplicate-loss prevention |
| support-allocation boundary | frequency, conditional loss assembly, annual/tail metrics, and financial terms |

Damage Modeling does not emit EAL, PML, VaR, TVaR, business interruption, derating, revenue, or insurance
results.

## Required future input envelope

```yaml
event_id:
event_family_id:
pathway_id: hail_impact
observed_or_radar_hail_product_id:
maximum_reported_hail_diameter_mm:
mesh_mm:
hail_size_distribution_id:
hail_density_basis_kg_m3:
hail_duration_s:
hail_event_wind_vector_and_basis:
asset_id:
asset_subject_id:
asset_subject_grain:
selectors:
  turbine_model:
  blade_model:
  leading_edge_protection:
conditioners:
  operating_state:
  rotor_speed_rpm:
  pitch_and_azimuth_history:
exposure:
value_basis:
```

Model v0.1 may preserve supplied fields for research, but it always withholds numeric output.

## Pathway and compound-event rules

- Exact `pathway_id=hail_impact` is required; hail size or wind speed cannot silently select a pathway.
- Convective straight-line wind, tornado, lightning, rain erosion, ice, and accumulation/meltwater flood are
  neighboring pathways, not curve fallbacks.
- Children of the same storm preserve one `event_family_id` so the consumer can prevent duplicate charges.
- Source diameter and MRMS MESH are distinct event descriptors. Neither is a blade-economic-damage axis.
- `mesh_mm`, hail-solar `mesh_diameter_mm`, and any Hazard `peak_intensity_in/mm` fields require an explicit
  versioned normalization; field-name similarity is not a unit or semantic conversion.
- If a future contact-demand bridge uses hail and wind inputs, those inputs enter once; no second generic
  hail-size or rotor-state multiplier is allowed downstream.

## Physical and spatial grains

| Damage unit/treatment | Consumer subject | Required allocation |
|---|---|---|
| `WT_BLADE_ASSEMBLY` | individual blade/rotor at one turbine | per-turbine contact demand, state, exposure, and same-unit value |
| `WT_NACELLE_EXPOSED_ASSEMBLY` | exposed cover/cooler/sensor subject | split exposed from protected internals before damage/value |
| `WT_TOWER_AND_EXTERNAL_FIXTURES` | tower shell and named external fixtures | vertical subject split; no blade-response transfer |
| `WT_PAD_ELECTRICAL` | turbine pad/transformer/switchgear subject | point or pad-polygon geometry plus BOM/SOV |
| `WT_COLLECTION_NETWORK` | named line/network segments | segment topology, direct-hit subject, and value |
| `WT_GSU_SUBSTATION` | shared switchyard/control-building subjects | separate yard geometry, ownership, BOM/SOV, and response |
| `WT_CONTROL_AND_MET_STATION` | control/met point or polygon | separate inventory, dependency, exposure, and value |
| `WT_FOUNDATION` | turbine point/base | direct hail path remains unqualified; route accumulation/flood separately |
| `WT_CIVIL_INFRA` | roads, crane pads, buildings, fences, drainage | split by subject and geometry before treatment |
| support rows | qualified repair/replacement scope | allocate once after disposition; never assign an independent hail DR |

A wind-farm lease polygon is not a solid damaged-value footprint. Turbines, lines, yards, and civil subjects
must retain their own spatial grains.

## Model v0.1 response

```yaml
failure_unit_scalar_dr:
  value: null
  status: withheld
  reason_codes: [NO_RUNTIME_CURVE]
scenario_loss_given_value_basis:
  value: null
  status: withheld
  reason_codes_include:
    - NO_RUNTIME_CURVE
    - MISSING_VALUE_BASIS
    - MISSING_EXPOSURE_OR_COUPLING
scalar_eal:
  value: null
  status: withheld
  reason_codes_include:
    - NO_RUNTIME_CURVE
    - MISSING_HAZARD_FREQUENCY_OR_INTENSITY_DISTRIBUTION
```

Coupon response, blade-impact simulation output, cumulative coating-lifetime ADF, generic repair-cost
anatomy, and the rejected legacy array remain audit evidence only.

## Future cutover checklist

1. A reviewed occurrence-specific bridge maps a governed hail history and turbine state to local blade or
   component demand, with uncertainty and KATs.
2. Evidence connects that demand to mutually exclusive inspected disposition states and same-unit direct
   repair/replacement cost.
3. Blade/OEM/LEP selectors and unknown-state behavior are calibrated rather than assumed.
4. Turbine points, BOP lines/yards/points, ownership, at-risk value, and support allocation reconcile.
5. A model v1.0+ runtime bundle uses the repository-current schema and contains reviewed curve records.
6. Artifact/capability schemas validate and the exact cell/model/docs/schema/SHA tuple is published.
7. Hazard deliberately updates its pin and validates compound-event and duplicate-value behavior.
8. Every legacy `Real Estate_Hail` wind mapping is removed or quarantined, and per-turbine exposure is
   applied exactly once with same-blade rather than equal whole-turbine value.

Until every applicable gate passes, the correct runtime result is withheld—not zero and not a neighboring
curve.
