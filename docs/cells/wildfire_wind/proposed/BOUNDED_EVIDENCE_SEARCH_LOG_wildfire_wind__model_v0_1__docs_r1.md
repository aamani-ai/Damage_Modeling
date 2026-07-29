# Bounded evidence search — wildfire_wind model v0.1/docs r1

## Boundary

```yaml
review_cutoff: 2026-07-28
target_chain: exogenous_wildfire_field -> local_equipment_attack -> inspected_disposition -> same_unit_direct_cost
target_asset: modern_onshore_horizontal_axis_wind_farm_with_repeated_turbines_and_separate_BOP
target_endpoint: occurrence_based_physical_repair_or_replacement_cost_ratio
pathways:
  - wildfire_thermal_attack
  - wildfire_firebrand_ignition
  - wildfire_residue_destructive_contamination
```

This is a reproducible scoped review. It is not a universal claim that no private, claims-based,
non-English, unindexed, inaccessible, or future evidence exists.

## Qualification test

A numerical candidate could advance only if its chain preserves:

- external wildfire origin and source-field semantics;
- delivered local demand at a named wind-equipment failure unit;
- a representative target population and applicability selectors;
- inspected, non-overlapping physical disposition states;
- same-unit direct repair/replacement cost and denominator; and
- locatable provenance sufficient to reproduce the inference.

Evidence missing one or more links was retained only for its permissible adjacent role.

## Surfaces reviewed

- USDA Forest Service Research Data Archive and Treesearch for FSim, FARSITE, and wildland-fire heating;
- NIST publications for individual and accumulated firebrand heat transfer;
- Crossref/DOI and publisher pages for wind-blade fire/thermal research;
- BSEE/government-hosted wind-fire technical assessments;
- onshore wind-farm planning and bushfire-risk records in government portals;
- NEMA, AFAC, CFA, FM, and DNV public guidance/certification surfaces;
- NREL land-based wind component-value references;
- operator/public event statements for post-fire wind-turbine disposition;
- local `damage_modeling`, `Hazard_modeling`, `infrasure-damage-curves`, and `Learning` materials.

## Query families

```text
external wildfire wind turbine damage inspection repair cost
wind farm bushfire turbine substation loss claim replacement
wind turbine blade radiant heat flux ignition cone calorimeter
wildfire firebrand ember wind turbine nacelle ingress ignition
fire smoke ash residue transformer switchgear corrosion replacement
wind farm wildfire GSU substation cable control equipment damage
wind turbine wildfire fragility vulnerability curve damage ratio
FSim flame length wind turbine damage heat flux conversion
```

## Results by pathway and missing link

| Link | `wildfire_thermal_attack` | `wildfire_firebrand_ignition` | `wildfire_residue_destructive_contamination` |
|---|---|---|---|
| Source wildfire field | FSim burn probability/conditional flame-length classes and FARSITE fireline intensity available | General external-wildfire/firebrand context available; no qualified wind-site particle field | Smoke/ash/residue presence can be described, but no qualified equipment dose product selected |
| Local equipment attack | Time-resolved radiant/convective field measurements and blade-specimen tests available; no universal landscape-to-equipment bridge | Individual/pile firebrand physics available; no turbine/GSU ingress/deposition bridge | Conductive/corrosive physical mechanisms recognized; no dose-to-equipment bridge |
| Inspected disposition | General post-fire wind-zone/electrical disposition context available; no representative exogenous event-conditioned population | No representative wind-equipment firebrand-conditioned state dataset located | NEMA disposition guidance available; no wildfire residue-conditioned wind-equipment population located |
| Same-unit direct cost | NREL value anatomy and general component context only; no matched repair invoice/SOV chain | No matched ignition-state/cost chain located | No matched destructive residue state/cost chain located |

## Results by failure-unit group

| Group | Bounded result through cutoff |
|---|---|
| Repeated turbine assembly | Material tests, internal-fire anatomy, one operator post-fire component event, and onshore risk assessments located; no external local-demand → state → direct-cost chain |
| Pad/collection | Site-field and electrical disposition guidance located; no pathway-conditioned fragility/cost chain |
| GSU apparatus | Transformer/switchgear/cable/control disposition categories located; no external wildfire demand, apparatus population response, or same-unit cost chain |
| Control/met/O&M | Site and emergency fields located; no physical-destruction response/cost chain |
| Foundation/civil | Site materiality/geometry fields located; no near-zero or nonzero response evidence at the required endpoint |
| Support/logistics | NREL reference rows only; support is not an intrinsic physical response |

## Strongest negative-evidence item

The Uungula onshore wind-farm bushfire assessment explicitly recognizes turbine and electrical-facility
attack pathways while leaving equipment impact unknown. It supports materiality and site-field design, not
a numerical curve. This source is especially important because it is closer to the target setting than
offshore/internal-fire incident evidence and still does not close the response/cost seam.

## Legacy and neighboring-cell check

The old wildfire-wind logistics fail the qualification test because their FLI-to-flux conversion,
distance/height attenuation, thresholds, caps, and response shapes are not source-locked to external
wildfire wind-equipment disposition/cost. The current `wildfire_solar` package supplies shared FSim
semantics and workflow structure only; target response does not transfer.

## Decision

```yaml
matched_public_chains_located: 0
runtime_curve_count: 0
canonical_runtime_artifact: false
standard_reason: NO_RUNTIME_CURVE
```

## Update triggers

- owner/OEM event records linking external wildfire fields, local equipment conditions, and inspections;
- work orders, claims, invoices, or SOVs tied to those inspected states;
- validated local radiant/convective/flame-contact bridge for declared target geometry;
- validated firebrand deposition/ingress model and target-equipment ignition tests;
- residue composition/dose and destructive electrical-equipment inspection/cost evidence;
- site BOM/SOV and exact turbine/BOP geometries; or
- a formally approved structured elicitation designed for an explicit screening-grade v1 release.
