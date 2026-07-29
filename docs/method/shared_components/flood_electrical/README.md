# Flood-electrical shared component substrate v0.2

```yaml
status: non_runtime_method_reference
runtime_loadable: false
curve_bundle_schema_conformance: none
shared_substrate_version: 0.2
primary_pathway: flood_inundation_contact
```

This substrate records the electrical equipment concepts that can be common to solar and wind generation facilities. It also preserves one legacy FEMA source-native whole-substation screening candidate and its limits. It does not publish runtime curves, allocate value, or assert that a component is project-owned.

## Common anatomy

    facility substation
    |-- FE_SUBSTATION_SWITCHGEAR
    |-- FE_GSU_TRANSFORMER_MAIN
    |   `-- FE_GSU_TRANSFORMER_AUX_CONTROLS
    |-- FE_PROTECTION_SCADA_CONTROL
    |-- FE_STATION_SERVICE_DC
    `-- FE_CABLE_TERMINATIONS

    mutually exclusive screening representation
    `-- FE_HAZUS_SUBSTATION_SCREENING_ASSEMBLY

FERC describes both typical wind and solar facilities as collecting at a facility-substation bus and using a high-voltage Plant GSU to reach interconnection voltage. This supports shared anatomy; it does not supply vulnerability or ownership.

## Shared axis

    h_i = max(0, WSE - z_i_crit)

`WSE` and `z_i_crit` must use the same vertical datum. The component datum is the lowest load-bearing vulnerable point for the modeled disposition—not automatically grade or the transformer tank bottom.

The legacy Hazus assembly has a different, source-native axis and response identity:

    shared_response_id: FE_HAZUS21_SUBSTATION_ASSEMBLY_SCREENING_V1
    d_grade_ft = local flood depth above substation grade, ft

    depth_ft:  0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10
    DR:        0, .02, .04, .06, .07, .08, .09, .10, .12, .14, .15

FEMA Hazus-MH 2.1 Table 7.9 gives the same series for low-, medium-, and high-voltage substations (`ESSL`, `ESSM`, and `ESSH`). The ordinate is percent damage relative to the full replacement cost of that same substation assembly. It is not a switchgear, transformer, or control-room component curve. The source's 4 ft functionality threshold is a separate operational field, not a damage-ratio breakpoint. Section 7.2.4 also says electric-power implementation was deferred, so the table is source-native numerical evidence with an explicit legacy implementation conflict.

Hazus 7.0 now identifies electric-power plants and substations as mapping-only, and its Flood Model Technical Manual says the viewable default electric-power damage functions are not enabled and produce no results. The 2.1 series is therefore retained only as a **legacy screening reference** for a separately governed, flood-wind-local noncanonical assembly. Interpolation is confined to 0–10 ft; negative, nonfinite, or above-range depths withhold rather than clamp or extrapolate. It is not current Hazus calibration or shared runtime authority.

## Files

- [`failure_unit_catalog.csv`](failure_unit_catalog.csv) — common concept registry and current evidence status.
- [`evidence_register.csv`](evidence_register.csv) — resolves every shared evidence ID to a reviewed source,
  exact locator, and transfer limit.
- [`binding_rules.md`](binding_rules.md) — exact compatibility, cell-binding, and missing-state rules.
- [`../../../cells/flood_wind/proposed/SHARED_COMPONENT_REUSE_CROSSWALK_flood_wind__model_v0_1__docs_r1.csv`](../../../cells/flood_wind/proposed/SHARED_COMPONENT_REUSE_CROSSWALK_flood_wind__model_v0_1__docs_r1.csv) — phase-1 component binding; it predates the v0.2 Hazus assembly concept.
- [`../../../plans/flood_wind_shared_electrical/README.md`](../../../plans/flood_wind_shared_electrical/README.md) — phase-2 decision and implementation record.

## Current numerical status

`FS_SWG` from canonical `flood_solar` remains the strongest pinned candidate for a common switchgear response. Its ordinates are still T3 engineering proxies. `FS_XFMR`, `FS_SCADA`, and `FS_CABLE` require semantic decomposition before numeric reuse.

`FE_HAZUS_SUBSTATION_SCREENING_ASSEMBLY` preserves the source-native response `FE_HAZUS21_SUBSTATION_ASSEMBLY_SCREENING_V1` from legacy Hazus-MH 2.1. It can support a flood-wind-local noncanonical screening record only when the cell binds one physical substation, its full same-substation replacement value, local grade exposure, ownership, and an assembly-versus-components exclusivity gate. No item in this folder can itself populate an emit.
