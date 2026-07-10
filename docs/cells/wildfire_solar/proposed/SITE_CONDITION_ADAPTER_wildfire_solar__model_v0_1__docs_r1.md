# Site-condition adapter — wildfire_solar

## Purpose and boundary

Wildfire attack on solar PV is strongly site-conditioned. The adapter converts coarse landscape/event fire behavior into component-zone attack states; component vulnerability is a separate layer. `NIST_TN_1796` defines exposure as fire and ember assault at a location in space and time and calls for exposure to be uncoupled from construction vulnerability.

```text
source-native FIL / event fire behavior
  + fuels, wind, slope, distance, geometry, maintenance state
  + fence, wall, firebreak, burial/enclosure, access and suppression state
  → local contact + radiant/convective heat flux + duration + ember state
  → separately governed BOM-specific failure model
```

This document specifies fields and guardrails only. It contains no validated numeric transfer function, no mitigation coefficient, and no runtime damage output.

## Field roles

| Role | Meaning | Permitted action |
|---|---|---|
| `selector` | Fixed construction or installation class that chooses an applicable future model. | Select one qualified archetype; do not also apply a duplicate discount. |
| `conditioner` | Maintained or event-time state that may alter local attack. | Enter a qualified response model; unknown receives no credit. |
| `bridge_input` | Measured geometry, fuel, terrain, or event input used to derive local exposure. | Use once in the site-transfer calculation. |
| `derived_exposure` | Output of a qualified site model or measurement. | Feed the component vulnerability model; do not reapply its inputs. |
| `allocation` | Spatial/value share used to reconcile exposed value. | Multiply once at its declared conditional grain. |
| `deferred_pathway` | Captured for later work but unable to emit damage now. | Preserve evidence state; return withheld if load-bearing. |

## Canonical site and event fields

| Field | Role | Source basis | Governed behavior when missing or unqualified |
|---|---|---|---|
| `zone_id` | allocation grain | `NIST_TN_1796`; `NIST_TN_2205`; `GOVERNANCE_CONTRACT` | No whole-site default; required to bind exposure and value to a component zone. |
| `local_fire_state_basis` | bridge provenance | `NIST_TN_1796`; `GOVERNANCE_CONTRACT` | Must identify measured, physics-modelled, event-modelled, screening, or unknown basis; unknown/unsupported withholds. |
| `fuel_surface_class` | bridge_input | `DOE_FEMP_PV_WILDFIRE`; `NIST_TN_2228` | No fuel-transfer assumption. |
| `grass_height_mm` | bridge_input | `ENERGY_SAFE_VICTORIA_SOLAR` | No maintenance credit; 100 mm is a cited control, not an efficacy coefficient. |
| `vegetation_clearance_m` | bridge_input | `DOE_FEMP_PV_WILDFIRE`; `SYPHARD_2014` | Measured by zone; no universal safe distance. |
| `nearest_external_fuel_distance_m` | bridge_input | `COHEN_USDA_2000`; `DOE_FEMP_PV_WILDFIRE` | Measured by boundary/zone; no fixed 10 m default. |
| `vegetation_management_state` | conditioner | `DOE_FEMP_PV_WILDFIRE`; `ENERGY_SAFE_VICTORIA_SOLAR` | Unknown/undated state receives no credit. |
| `fuel_continuity_to_component` | bridge_input | `NIST_TN_1796`; `NIST_TN_2228` | Unknown withholds a propagation-dependent exposure result. |
| `firebreak_width_m` | bridge_input | `ENERGY_SAFE_VICTORIA_SOLAR`; `PLANNING_VICTORIA_SOLAR_GUIDE` | Measured only; a 10 m control is not proof a fire stops. |
| `firebreak_surface` | selector | `DOE_FEMP_PV_WILDFIRE`; `ENERGY_SAFE_VICTORIA_SOLAR` | No credit without a qualified fuel-continuity model. |
| `perimeter_fence_material` | selector | `NIST_TN_2228` | Combustible/open-metal/solid-noncombustible/other/unknown; no automatic protection. |
| `parallel_combustible_fence_state` | conditioner | `NIST_TN_2228` | Flag spacing/configuration; no generic multiplier. |
| `fuel_accumulation_at_fence` | conditioner | `NIST_TN_2228` | Unknown receives no credit; maintenance date retained. |
| `solid_barrier_material` | selector | `DOE_FEMP_PV_WILDFIRE`; `NIST_TN_2228` | No automatic wall effectiveness. |
| `solid_barrier_height_m` | bridge_input | `DOE_FEMP_PV_WILDFIRE`; `COHEN_USDA_2000` | Measured; requires flame/view/bypass model. |
| `solid_barrier_continuity` | bridge_input | `DOE_FEMP_PV_WILDFIRE`; `NIST_TN_2205`; `GOVERNANCE_CONTRACT` | Measured gap/gate continuity; no default. |
| `barrier_component_distance_m` | bridge_input | `COHEN_USDA_2000`; `GOVERNANCE_CONTRACT` | Measured by component zone. |
| `solid_barrier_geometry_model_id` | bridge provenance | `COHEN_USDA_2000`; `NIST_TN_2205`; `GOVERNANCE_CONTRACT` | Must identify a qualified geometry, wind, continuity, and bypass model; null/unknown means no barrier credit. |
| `barrier_line_of_sight_fraction` | derived_exposure | `COHEN_USDA_2000`; `GOVERNANCE_CONTRACT` | Qualified model output only; never entered as an uncited user discount. |
| `slope_pct` | bridge_input | `FINNEY_2011_FSIM`; `USFS_FARSITE_1998` | Use only for local transfer not already represented by the upstream hazard state. |
| `wind_direction_relative_to_row_deg` | bridge_input | `NIST_TN_2228`; `USFS_FARSITE_1998` | Event input; no scalar DR modifier. |
| `component_setback_m` | bridge_input | `DOE_FEMP_PV_WILDFIRE`; `COHEN_USDA_2000` | Measured from relevant fuel/fire source by zone. |
| `component_elevation_m` | bridge_input | `COHEN_USDA_2000`; `GOVERNANCE_CONTRACT` | Measured; no default. |
| `module_construction` | selector | `YANG_2015_PV_IGNITION`; `ZHAO_2026_PV_POOL_FIRE` | Unknown BOM cannot inherit a tested-specimen threshold. |
| `module_glass_integrity` | selector | `ZHAO_2026_PV_POOL_FIRE` | Capture intact/pre-cracked/unknown; no numeric effect now. |
| `module_tilt_deg` | selector | `WANG_2025_PV_THERMAL`; `ZHAO_2026_PV_POOL_FIRE` | Capture event-time state; no universal stow/tilt credit. |
| `racking_primary_material` | selector | `GOVERNANCE_CONTRACT` | Steel/aluminum/mixed/unknown; no pooled thermal response. |
| `cable_installation` | selector/allocation | `DOE_FEMP_PV_WILDFIRE`; `NREL_PV_OM_2018` | Exposed/buried/conduit/tray/mixed/unknown; protected value cannot enter an exposed pathway silently. |
| `equipment_enclosure` | selector | `DOE_FEMP_PV_WILDFIRE` | Verified fire resistance requires an applicable rating/model; ingress rating alone receives no fire credit. |
| `suppression_system_state` | conditioner | `DOE_FEMP_PV_WILDFIRE` | No credit without event availability/effectiveness and a response model. |
| `firefighter_access_state` | conditioner | `DOE_FEMP_PV_WILDFIRE`; `NSW_RFS_OP_1_2_22` | No automatic suppression probability. |
| `deenergization_state` | conditioner | `NSW_RFS_OP_1_2_22`; `DOE_FEMP_PV_WILDFIRE` | Affects response/cascade pathway; not radiant fragility by itself. |
| `component_burned_fraction_by_zone` | allocation | `GOVERNANCE_CONTRACT` | Never defaults to one; indicates intersection only. |
| `component_attack_fraction_by_zone` | allocation | `NIST_TN_1796`; `GOVERNANCE_CONTRACT` | Conditional on burned fraction; required for loss and never conflated with it. |
| `direct_flame_contact_state` | derived_exposure | `NIST_TN_1796`; `DOE_FEMP_PV_WILDFIRE` | Required for contact-only pathways; unknown withholds. |
| `incident_heat_flux_kw_m2` | derived_exposure | `COHEN_USDA_2000`; `GOVERNANCE_CONTRACT` | Requires provenance, location/orientation, and uncertainty. |
| `exposure_duration_s` | derived_exposure | `YANG_2015_PV_IGNITION`; `ZHANG_2022_XLPE`; `COHEN_USDA_2000` | Required alongside heat flux for time-dependent response. |
| `firebrand_or_ember_attack_state` | deferred_pathway | `NIST_TN_1796`; `NIST_TN_2205`; `NIST_TN_2228` | Capture none/present/unknown plus measurement basis; no damage emission in this scaffold. |
| `at_risk_fraction_by_failure_unit_zone` | allocation | `VALUE_SOLAR_WORKBOOK`; `GOVERNANCE_CONTRACT` | No default; protected/inapplicable share must be evidenced. |
| `at_risk_fraction_basis` | allocation provenance | `GOVERNANCE_CONTRACT` | Required source/method identifier; no undocumented fraction. |

## Fence, wall, and access interpretation

- Combustible fencing can become a fuel bridge. `NIST_TN_2228` reports 187 fence/mulch experiments and shows that combustible-fence, mulch, and close parallel-fence combinations can propagate fire and generate firebrands. This is transfer evidence, not a solar multiplier.
- Open-metal or chain-link fencing receives no radiant-shield credit. That is a no-credit guardrail, not a claim of measured zero flux or zero damage.
- A solid noncombustible wall may interrupt flame spread or line of sight, but effectiveness depends on material, height, continuity, gaps/gates, relative distances, flame geometry, wind, and ember bypass. No blanket wall coefficient is adopted.
- Debris or vegetation accumulated at either fence type can create a new fuel path; maintenance state must accompany construction type.
- Gates and access lanes influence response only when usable under event and electrical-safety conditions. `NSW_RFS_OP_1_2_22` demonstrates why an access plan cannot be converted directly into suppression credit.
- Firebrands/embers can bypass a barrier. Ember attack remains a separate deferred pathway and is never hidden inside a radiant-wall adjustment.

## Regulatory controls are auditable fields, not damage credits

`ENERGY_SAFE_VICTORIA_SOLAR` specifies grass no higher than 100 mm near equipment during the declared Fire Danger Period and at least 10 m fuel-free noncombustible firebreaks around key infrastructure/perimeters. These are jurisdictional controls and valuable inspection fields; they are not universal wildfire efficacy coefficients. Planning and residential defensible-space observations likewise transfer only as field-design evidence.

## Double-counting prevention matrix

| Related fields | Correct single treatment | Prohibited double count |
|---|---|---|
| `vegetation_management_state`, `grass_height_mm`, `fuel_surface_class`, `fuel_continuity_to_component` | Maintenance state establishes evidence quality; measured fuel fields enter one local propagation model. | Independent vegetation discounts stacked on a derived attack fraction. |
| `firebreak_width_m`, `firebreak_surface`, `vegetation_clearance_m`, `component_setback_m` | Represent non-overlapping geometry or derive one effective path/distance with documented definitions. | Adding overlapping distances or multiplying separate clearance/firebreak credits. |
| Fence material, parallel-fence state, debris, and fuel continuity | Enter one fence/fuel propagation assessment. | Fence penalty plus a second fuel-continuity penalty for the same path. |
| Barrier material/height/continuity/distance and `barrier_line_of_sight_fraction` | Geometry inputs produce the derived line-of-sight/exposure result. | Applying both a wall discount and the derived exposure reduction. |
| `cable_installation`, at-risk fraction, and attack fraction | Installation state first partitions value; local attack applies only to the applicable partition. | Reducing protected cable in both value allocation and vulnerability. |
| `equipment_enclosure` and delivered heat flux/contact | Either choose a qualified protected vulnerability archetype or model enclosure attenuation into delivered exposure. | Attenuating exposure and applying an enclosure curve credit for the same protection. |
| Burned fraction and attack fraction | `attack_fraction` is conditional on the burned/intersected share. | Treating each as an unconditional whole-site factor or setting both from the same overlay. |
| Upstream FIL/FLP and slope/wind/fuels | Use local fields only to bridge from the upstream state to site attack. | Re-rating upstream probability/intensity and then reusing the same fields in the site bridge. |
| Suppression, access, and de-energization | One event-response model determines any change in duration/spread. | Stacking three independent credits for the same intervention. |
| Component DR and support/logistics | Curve emits direct same-unit replacement ratio; support is allocated once afterward. | Giving support rows their own DR and also scaling them with direct loss. |

## Zonal assembly and default policy

```text
Direct loss = Σ_u,z V_direct_u,z × at_risk_f_u,z × burned_f_u,z
                        × attack_f_u,z|burned × DR_u(local_state_u,z)
```

```yaml
unknown_mitigation: NO_CREDIT
unknown_load_bearing_site_state: WITHHOLD
whole_site_exposure_default: PROHIBITED
chain_link_radiant_shield_credit: DISABLED_NO_QUALIFIED_MODEL
solid_wall_credit_without_qualified_model: DISABLED_NO_QUALIFIED_MODEL
suppression_credit_without_event_response_model: DISABLED_NO_EVENT_RESPONSE_MODEL
buried_or_protected_value_in_exposed_pathway: PROHIBITED
ember_damage_emission: WITHHELD_DEFERRED_PATHWAY
runtime_damage_output: WITHHELD_NO_RUNTIME_CURVE
```

The disabled-credit states mean “do not reduce attack because of an unevaluated control.” They do not assert zero damage, zero exposure, or measured zero effectiveness.

## Source controls

Exact citations, URLs, locators, transfer limits, and evidence tiers are in `SOURCE_REGISTER_wildfire_solar__model_v0_1__docs_r1.csv` and `CLAIM_PARAMETER_REGISTER_wildfire_solar__model_v0_1__docs_r1.csv`. Site fields cannot be numerically parameterized from guidance alone.
