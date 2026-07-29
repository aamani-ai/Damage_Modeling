# Hazard handoff boundary — wildfire_wind model v0.1 scaffold

## Consumer disposition

```yaml
cell_id: wildfire_wind
damage_code_id: WILDFIRE_WIND_PROPOSED_V0_1
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
canonical_runtime_artifact: false
curve_record_count: 0
artifact_index_entry: none
consumer_pin: none
hazard_runtime_change: none
action: do_not_load_or_cut_over
```

This boundary records a governed coverage scaffold. It does not authorize Hazard M3 to emit a wildfire-wind
damage ratio, load the rejected legacy rotor/nacelle/tower logistics, transfer wildfire-solar ordinates, apply
generic building thresholds to turbines, or convert a null result to zero.

The scaffold uses the v1 research envelope honestly because repository-current v2 and v3 bundle schemas
require output-bearing records. A future released bundle must migrate to the then-current schema; model v0.1
is not a compatibility shortcut.

## Ownership

| Damage Modeling owns | Hazard/consumer owns |
|---|---|
| pathway definitions and future delivered-load-to-damage records | wildfire occurrence catalog, burn/frequency products, and event identity |
| dependency-safe failure units, selectors, conditioners, and direct physical DR | site inventory, turbine/BOP geometry, and local exposure coupling |
| curve/version/provenance/capability and physical-destruction boundary | project/utility ownership, insured inclusion, and site value binding |
| support-allocation and cross-pathway double-count rules | scenario aggregation, compound-event coordination, and duplicate-loss prevention |
| future exact equipment compatibility rules | frequency, EAL/tail metrics, BI, insurance, and portfolio treatment |

Damage Modeling does not emit business interruption, temporary shutdown, derating, revenue, EAL, PML, VaR,
TVaR, or insurance results. Cleaning without destructive physical damage is also outside the damage ratio.

## Required future common input envelope

```yaml
event_id:
event_family_id:
pathway_id:
source_wildfire_product_id:
hazard_valid_time:
asset_id:
asset_subject_id:
asset_subject_grain:
failure_unit_id:
subject_geometry:
geometry_provenance:
selectors:
  equipment_family_and_model:
  material_or_insulation_family:
  enclosure_openings_and_filtration:
  installation_and_burial_state:
conditioners:
  operating_and_energization_state:
  shutdown_or_isolation_state:
  suppression_or_response_availability:
  weather_and_wind_history:
exposure:
  pathway_specific_delivered_load:
  exposure_fraction:
  exposure_fraction_basis:
ownership:
value_basis:
provenance:
```

Model v0.1 may preserve structurally valid fields for research, but it always withholds numeric damage and
loss.

## Pathway-specific delivered-load contracts

### `wildfire_thermal_attack`

The future local demand object must preserve, where applicable:

- incident radiant and convective heat-flux time histories;
- gas temperature and velocity histories;
- direct flame-contact history and duration;
- fuel/flame geometry, distance, slope, view factor, shielding, wind, and duration;
- component elevation, orientation, enclosure, material state, and model/measurement uncertainty.

FSim burn probability or conditional flame-length class remains source/frequency context. It is not by itself
a turbine or BOP heat-flux history and cannot select an economic curve.

### `wildfire_firebrand_ignition`

The future local demand object must preserve, where applicable:

- particle number flux and count;
- size, mass, and combustion-state distribution;
- deposition and accumulation state;
- ingress or penetration state;
- local wind, contact history, component openings, elevation, enclosure, and combustible material inventory.

Firebrand attack remains separate from spatially smoother thermal attack, even when both are children of the
same wildfire event family.

### `wildfire_residue_destructive_contamination`

The future local demand/disposition object must demonstrate destructive physical damage, not smoke presence
alone. Candidate fields include residue loading and composition, moisture/energization state, surface
conductivity or insulation-resistance change, verified flashover, insulation failure, or material damage.
Cleaning, temporary outage, smoke derating, and precautionary inspection alone do not enter the ordinate.

## Event and neighboring-pathway rules

- Exact `pathway_id` is required; missing or unknown values fail closed.
- Thermal, firebrand, and destructive-residue requests never default to one another.
- Exogenous wildfire is separate from turbine-origin electrical/mechanical/maintenance fire and
  lightning-origin fire.
- Consequential internal spread after wildfire ignition is a dependent state within the original occurrence,
  not an additive second event.
- Children of one wildfire preserve `event_family_id` so the consumer can prevent duplicate physical-state
  and value charges.
- Post-fire flood, scour, erosion, slope failure, and debris loading require their separately governed
  pathways. They are not wildfire-curve extensions.
- PSPS, shutdown, outage, BI, derating, cleaning, and revenue loss remain downstream or out of scope unless a
  separate destructive physical pathway is proved.

## Failure-unit, spatial, and value grains

| Failure unit | Consumer subject | Required allocation/guardrail |
|---|---|---|
| `WT_TURBINE_FIRE_ASSEMBLY` | one turbine point with named rotor/nacelle/tower/internal-service zones | one mutually exclusive turbine economic state; no additive rotor+nacelle+tower replacement charges |
| `WT_PAD_ELECTRICAL` | turbine pad, transformer, switchgear, and enclosure subject | per-unit point/pad polygon, BOM, local load, ownership, and same-unit value |
| `WT_COLLECTION_NETWORK` | named buried, exposed, or overhead line/point segments | preserve topology and construction; no turbine-count shortcut |
| `WT_GSU_MAIN_TRANSFORMER` | actual shared transformer point/footprint | project ownership, auxiliaries, disposition, and site SOV; value once |
| `WT_GSU_SWITCHGEAR_BUS` | named switchgear/bus/yard apparatus | split voltage class, indoor/outdoor state, enclosure, local attack, and value |
| `WT_GSU_PROTECTION_CONTROL_DC` | control building, room, cabinet, station-service, or DC subject | preserve building protection, filtration, dependency, and value |
| `WT_GSU_CABLE_TERMINATIONS` | termination, pull-box, conduit entry, or ingress path | preserve construction, openings, local load, disposition, and value |
| `WT_CONTROL_MET_OM` | separate control, met, and O&M points/polygons | split inventories, buildings, exposed instruments, stored items, ownership, and value |
| `WT_FOUNDATION` | turbine point and base interface | direct wildfire response remains unqualified; route post-fire hydraulic/geotechnical damage separately |
| `WT_CIVIL_INFRA` | named road, crane-pad, building, fence, drainage, or site-prep subject | split physical assets from controls/access and post-fire consequences |
| support rows | qualified repair/replacement disposition | allocate fieldwork and transport/logistics once; never assign an independent wildfire DR |

A wind-farm lease polygon is not a solid damaged-value footprint. Turbines, pads, collection segments, GSU
apparatus, buildings, and civil subjects retain separately located spatial grains. Reference USD/kW values
support anatomy and reconciliation only; they do not unlock scenario loss or replace site SOV.

## GSU common-substrate rule

The four GSU failure units intentionally use asset-neutral electrical-equipment anatomy that can also support
solar and hybrid facilities. This does not authorize numerical inheritance:

1. the same physical component instance is valued once even if it serves multiple host assets;
2. project ownership and insured inclusion are explicit rather than inferred from functional association;
3. local wildfire attack, installation, enclosure, energization, disposition, and value remain tied to the
   actual component instance;
4. future shared numerical response requires an exact compatibility key, version, provenance, and a deliberate
   per-cell release review;
5. solar asset labels, solar ordinates, and an aggregate `SUBSTATION` alias cannot select a wind-cell curve.

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

Wildland-fire protection guidance, heat-transfer studies, firebrand experiments, electrical-contamination
mechanism evidence, internal turbine-fire statistics, wildfire-solar profiles, and the rejected legacy arrays
remain evidence or audit inputs. None is a runtime economic damage curve for this cell.

## Future cutover checklist

1. At least one declared pathway and failure unit has a reviewed local delivered-load bridge, with uncertainty
   and canonical-field known-answer tests.
2. Evidence connects that local load to mutually exclusive inspected physical disposition and same-unit direct
   repair/replacement cost.
3. Turbine assembly, pad, collection, GSU, control/O&M, foundation, and civil inventories retain dependency-safe
   and spatially correct grains.
4. Site ownership, insured inclusion, SOV, exposure fractions, and support allocation reconcile without
   duplicate shared GSU or turbine charges.
5. Any mitigation, clearance, barrier, filtration, shutdown, or response credit is calibrated at the intended
   pathway/endpoint; unknown state gets no favorable default.
6. A model v1.0+ runtime bundle uses the repository-current output-bearing schema and contains reviewed curve
   records.
7. Artifact and capability schemas validate, KATs pass, and the exact cell/model/docs/schema/SHA tuple is
   published.
8. Hazard deliberately updates its pin, dual-reads where needed, verifies no solar/legacy fallback, validates
   event-family and duplicate-value behavior, and retains rollback.

Until every applicable gate passes, the correct runtime result is withheld—not zero and not a neighboring
curve.
