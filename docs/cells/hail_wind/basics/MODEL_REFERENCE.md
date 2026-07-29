# Hail × wind — model reference

## Identity and status

| Field | Value |
|---|---|
| Cell / pathway | `hail_wind` / `hail_impact` |
| Semantic model / human docs | `model v0.1` / `docs r2` |
| Runtime scaffold revision | `docs r1` |
| Canonical runtime pin | none |
| Schema pin | none |
| Canonical runtime artifact | no |
| Runtime curves | 0 |
| Standard reason | `NO_RUNTIME_CURVE` |
| Package | unreleased; baseline library v2.5 |

## Failure-unit reference

| Failure unit | Role | Spatial grain | Direct denominator / disposition |
|---|---|---|---|
| `WT_BLADE_ASSEMBLY` | Primary candidate, withheld | Per blade/rotor at turbine point | Blade row; mutually exclusive inspect/repair/replace states needed |
| `WT_NACELLE_EXPOSED_ASSEMBLY` | Withheld | Per turbine point | Nacelle subrows require exposed-subject split |
| `WT_TOWER_AND_EXTERNAL_FIXTURES` | Withheld | Per turbine point/vertical subject | Tower and appurtenance split required |
| `WT_PAD_ELECTRICAL` | Withheld | Per turbine point | Exact enclosure/bushing/control split required |
| `WT_COLLECTION_NETWORK` | Withheld | Line/network | Buried/overhead topology and components required |
| `WT_GSU_SUBSTATION` | Withheld | Shared point/yard polygon | Ownership, BOM, SOV, protection, and exposure required |
| `WT_CONTROL_AND_MET_STATION` | Withheld | Point/polygon | Instrument/building split required |
| `WT_FOUNDATION` | Geometry-screened, no numeric zero | Turbine point | Direct-hail path not qualified; meltwater routes separately |
| `WT_CIVIL_INFRA` | Split-required | Line/network/polygon | Roads, pads, buildings, fences, drainage must be separated |
| `SUPPORT_FIELDWORK` | Support only | Post-damage repair scope | Allocate once; no curve |
| `SUPPORT_TRANSPORT_LOGISTICS` | Support only | Post-damage replacement scope | Allocate once; no curve |

## Candidate demand dictionary

| Field | Role | Unit / meaning | v0.1 behavior |
|---|---|---|---|
| `maximum_reported_hail_diameter_mm` | Source input | Observed largest diameter | Capture only |
| `mesh_mm` | Source input | MRMS Maximum Estimated Size of Hail | Capture only; not interchangeable with observation |
| `hail_size_distribution_id` | Bridge input | Versioned size distribution | Required future input |
| `hail_density_basis_kg_m3` | Bridge input | Density/model basis | Required future input; no default |
| `hail_event_wind_speed_mps` | Bridge input | Speed on declared height/time basis | Capture only |
| `hail_event_wind_direction_deg` | Bridge input | Event wind direction | Capture only |
| `rotor_speed_rpm` | Conditioner/kinematics | Measured or reconstructed | Capture only |
| `blade_pitch_deg` / `rotor_azimuth_deg` | Conditioner/kinematics | Event history, not one universal scalar | Capture only |
| `impact_duration_s` | Bridge/history | Duration of qualified hail exposure | Capture only |
| `contact_normal_energy_j` | Derived demand | Qualified local blade-section output | No current bridge/runtime use |
| `strike_count_by_energy_bin` | Derived demand | Qualified impact-history output | No current bridge/runtime use |

## Physics identity—not a damage curve

For an idealized spherical stone:

```text
mass = density × π × diameter³ / 6
kinetic energy = 1/2 × mass × relative speed²
contact-normal energy requires the impact angle and blade-section motion
```

This identity does not specify terminal velocity, trajectories, strike count, material response, repair
state, or cost. It cannot populate `curve_records` by itself.

## Current state view

```text
DR
1.0 |                                      no runtime line
    |
    |     mechanism evidence  ───────►     [WITHHELD]
    |
0.0 +----------------------------------------------------
     observed/MESH     local impact      state      cost
       available         blocked        blocked    blocked
```

## Value reference

```text
installed 1968 = physical 1623 + excluded 345
physical  1623 = turbine equipment 1090 + other direct 239 + support 294
turbine equipment 1090 = blades 282 + all other turbine equipment 808
```

All values are 2023 USD/kW from the NREL reference ledger. Site loss requires actual subject values and
exposure. Support rows do not receive DR.

## Complete class-template event assembly

```yaml
identity:
  event_id: example_only
  event_family_id: example_compound_storm
  pathway_id: hail_impact
hazard_source:
  maximum_reported_hail_diameter_mm: unknown_or_observed
  mesh_mm: unknown_or_product_value
  product_id: required
  valid_time: required
selectors:
  turbine_make_model: required_for_future_curve
  blade_model: required_for_future_curve
  leading_edge_protection_id: required_for_future_curve
conditioners:
  operating_state: required_for_future_curve
  rotor_speed_rpm: measured_or_reconstructed
  pitch_azimuth_history_id: required_for_future_curve
exposure_value:
  turbine_subject_id: required
  turbine_point_geometry: required
  blade_direct_replacement_value_usd: required_for_loss
result:
  scalar_dr: null
  scenario_loss: null
  status: withheld
  reason: NO_RUNTIME_CURVE
```

The template documents the future interface. It is not an asset observation.

## Known-answer contract

The KAT set verifies that:

- complete valid metadata still emits no number;
- missing or unknown `pathway_id` does not default;
- solar hail, convective wind, tornado, lightning, rain/erosion, ice, and flood inputs cannot select this cell;
- MESH and observed diameter cannot be swapped silently;
- unknown operating state receives no favorable credit;
- a lease-polygon exposure default is rejected;
- GSU/BOP value is withheld rather than treated as zero;
- annual and tail metrics remain withheld.

## Promotion gates

| Gate | v0.1 status |
|---|---|
| Scope and compound boundary | pass for scaffold |
| Failure-unit and value anatomy | partial / reference only |
| Source hail semantics | pass for capture |
| Delivered blade demand bridge | withheld |
| Physical response states | candidate only |
| Same-unit economic consequence | withheld |
| Site value/exposure | withheld |
| Runtime curve/capability | fail-closed only |
| Independent review | strict NO-GO independently reproduced; output-bearing review still pending |
| Publish and consumer cutover | not started |

## Reviewer checks

```text
[ ] Is occurrence damage kept separate from chronic coating degradation?
[ ] Are MESH, observed diameter, and delivered blade demand distinct?
[ ] Are rotor state and blade identity explicit?
[ ] Are coating repair and blade replacement dependency-safe?
[ ] Are turbine points and BOP geometries separate from the lease polygon?
[ ] Are direct value, support, and excluded value reconciled without double count?
[ ] Does every valid v0.1 request still withhold numeric DR/loss?
[ ] Is the cell absent from the canonical artifact index?
```

## Source and artifact pointers

- [Cell dossier](../proposed/hail_wind_curve_derivation_dossier__model_v0_1__docs_r1.md)
- [Metadata specification](../proposed/hail_wind_damage_code_metadata_spec__model_v0_1__docs_r1.md)
- [Source register](../proposed/SOURCE_REGISTER_hail_wind__model_v0_1__docs_r1.csv)
- [Docs-r2 source addendum](../proposed/SOURCE_REGISTER_ADDENDUM_hail_wind__model_v0_1__docs_r2.csv)
- [Docs-r2 strict v1 decision](../proposed/DEEP_CURATION_DECISION_hail_wind__model_v0_1__docs_r2.md)
- [Docs-r2 promotion gates](../proposed/PROMOTION_GATE_MATRIX_hail_wind__model_v0_1__docs_r2.md)
- [Value crosswalk](../proposed/VALUE_CROSSWALK_hail_wind__model_v0_1__docs_r1.csv)
- [Fail-closed artifact](../proposed/hail_wind__model_v0_1__docs_r1__curve_artifact.json)
- [Known-answer tests](../proposed/known_answer_tests_hail_wind__model_v0_1__docs_r1.json)
- [Workbook](../proposed/damage_curve_records_hail_wind__model_v0_1__docs_r1.xlsx)
- [Hazard handoff](../../../contracts/hazard_handoff/hail_wind_model_v0_1_boundary.md)

## Version history

| Model | Human docs | Runtime scaffold | Canonical runtime pin | Meaning |
|---|---|---|---|---|
| model v0.1 | docs r1 | docs r1 | none | First governed, pressure-tested zero-curve scaffold |
| model v0.1 | docs r2 | docs r1 unchanged | none | Independent deep-curation review; seven source and nine claim addenda; strict v1 NO-GO |

Google Drive, DOCX, slides, and dashboards are derived publication views. They are not technical authority.
