# Flood-electrical shared component substrate v0.1

```yaml
status: non_runtime_method_reference
runtime_loadable: false
curve_bundle_schema_conformance: none
shared_substrate_version: 0.1
primary_pathway: flood_inundation_contact
```

This substrate records the electrical equipment concepts that can be common to solar and wind generation facilities. It does not publish curves, allocate value, or assert that a component is project-owned.

## Common anatomy

    facility substation
    |-- FE_SUBSTATION_SWITCHGEAR
    |-- FE_GSU_TRANSFORMER_MAIN
    |   `-- FE_GSU_TRANSFORMER_AUX_CONTROLS
    |-- FE_PROTECTION_SCADA_CONTROL
    |-- FE_STATION_SERVICE_DC
    `-- FE_CABLE_TERMINATIONS

FERC describes both typical wind and solar facilities as collecting at a facility-substation bus and using a high-voltage Plant GSU to reach interconnection voltage. This supports shared anatomy; it does not supply vulnerability or ownership.

## Shared axis

    h_i = max(0, WSE - z_i_crit)

`WSE` and `z_i_crit` must use the same vertical datum. The component datum is the lowest load-bearing vulnerable point for the modeled disposition—not automatically grade or the transformer tank bottom.

## Files

- [`failure_unit_catalog.csv`](failure_unit_catalog.csv) — common concept registry and current evidence status.
- [`evidence_register.csv`](evidence_register.csv) — resolves every shared evidence ID to a reviewed source,
  exact locator, and transfer limit.
- [`binding_rules.md`](binding_rules.md) — exact compatibility, cell-binding, and missing-state rules.
- [`../../../cells/flood_wind/proposed/SHARED_COMPONENT_REUSE_CROSSWALK_flood_wind__model_v0_1__docs_r1.csv`](../../../cells/flood_wind/proposed/SHARED_COMPONENT_REUSE_CROSSWALK_flood_wind__model_v0_1__docs_r1.csv) — proposed cell binding.

## Current numerical status

`FS_SWG` from canonical `flood_solar` is the strongest pinned candidate for a common switchgear response. Its ordinates are still T3 engineering proxies. `FS_XFMR`, `FS_SCADA`, and `FS_CABLE` require semantic decomposition before numeric reuse. No item in this folder can populate an emit.
