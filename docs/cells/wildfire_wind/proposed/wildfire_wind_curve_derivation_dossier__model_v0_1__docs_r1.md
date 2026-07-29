# Wildfire × onshore wind derivation dossier — model v0.1/docs r1

## 1. Decision

The reviewed package is a governed coverage scaffold with zero runtime curves. Public evidence supports the
existence and structure of external wildfire attack on wind turbines and balance-of-plant (BOP) equipment,
but it does not close the required chain:

```text
source wildfire field
  -> delivered local attack at one physical subject
  -> inspected mutually exclusive disposition
  -> same-unit direct repair/replacement cost ratio
```

The honest result is `curve_records: []`, `canonical_runtime_artifact: false`, and
`NO_RUNTIME_CURVE` for all three pathways.

## 2. Scope and causal boundary

The cell covers direct physical destruction from an **exogenous wildfire** during one occurrence. The fixed
pathways are:

1. `wildfire_thermal_attack` — radiation, convection, and direct flame contact;
2. `wildfire_firebrand_ignition` — deposited or ingressed burning particles and dependent ignition; and
3. `wildfire_residue_destructive_contamination` — only inspected conductive, corrosive, or otherwise
   destructive residue effects.

Equipment-origin, electrical, lightning, maintenance, and other endogenous fires are not calibration
substitutes. They may inform anatomy, propagation, and post-ignition disposition only. Suppression water or
agent damage has no separate v0.1 pathway and remains deferred. Ordinary smoke/ash cleaning, soot/odor,
derating, downtime, telemetry loss, and business interruption are outside the physical-destruction ordinate.

## 3. Asset boundary and failure units

The wind farm is not one damageable lease polygon. It is a repeated set of turbine subjects plus separately
located point, line, yard, building, foundation, and civil subjects. The exact model-v0.1 inventory is:

| Failure-unit ID | Physical/value role | Natural exposure grain | v0.1 response |
|---|---|---|---|
| `WT_TURBINE_FIRE_ASSEMBLY` | Repeated turbine equipment; dependency-safe rotor/nacelle/tower/base/cable-entry state assembly | Per-turbine point, rotor/zone geometry | Withheld |
| `WT_PAD_ELECTRICAL` | Turbine-adjacent transformer/switching equipment | Point or pad footprint | Withheld |
| `WT_COLLECTION_NETWORK` | Buried/overhead collection segments and joints | Line/segment network | Withheld |
| `WT_GSU_MAIN_TRANSFORMER` | Shared-yard main transformer | Apparatus point/footprint in one GSU yard | Withheld |
| `WT_GSU_SWITCHGEAR_BUS` | Shared-yard switchgear and bus | Apparatus point/footprint in one GSU yard | Withheld |
| `WT_GSU_PROTECTION_CONTROL_DC` | Relays, controls, communications, batteries/DC | Cabinet/building/yard subject | Withheld |
| `WT_GSU_CABLE_TERMINATIONS` | Yard cable entries, terminations, trenches/risers | Point/line/zone | Withheld |
| `WT_CONTROL_MET_OM` | Plant controls, met equipment, O&M/control building equipment | Point/building footprint | Withheld |
| `WT_FOUNDATION` | Concrete, anchor, seal, and surface assembly | Per-turbine footprint/zone | Withheld; not zero |
| `WT_CIVIL_INFRA` | Roads, pads, gates, fences, drainage, culverts, buildings/lighting after site split | Line/network/polygon by physical subject | Withheld |
| `SUPPORT_FIELDWORK` | Inspection, assembly, installation, and field reinstatement | Support record after disposition | No intrinsic DR |
| `SUPPORT_TRANSPORT_LOGISTICS` | Transport/crane/logistics support | Support record after disposition | No intrinsic DR |

The turbine assembly is repeated per physical turbine; the shared GSU exists once and serves the relevant
resource units. The four GSU units are separated because apparatus location, protection, failure mode,
inspection endpoint, replacement scope, and value grain differ. The source value ledger does not resolve
their individual values, so the split is structural rather than a fabricated allocation.

## 4. Hazard-axis alternatives

| Candidate | Disposition | Reason |
|---|---|---|
| FSim burn probability | Upstream hazard/frequency field only | Not delivered load or asset damage probability |
| Six FSim conditional flame-length classes | Source-hazard capture only | Preserve exact classes; no invented midpoint or equipment response |
| Byram fireline intensity, kW/m | Upstream fire-behavior field only | Heat release per unit fireline length is not incident target flux, kW/m² |
| Peak radiant flux | Incomplete local-demand candidate | Omits duration, convection, flame contact, target geometry, and time history |
| Radiant + convective + flame-contact histories | Leading thermal-demand candidate | Requires validated landscape-to-target bridge and target response |
| Firebrand presence | Reject as response axis | Omits size/mass, combustion state, count/flux, contact, deposition, accumulation, ingress, wind, and time |
| Firebrand deposition/ingress/contact history | Leading firebrand-demand candidate | Requires target-zone ignition/response and disposition/cost evidence |
| Smoke or ash presence | Reject as physical DR axis | Does not establish destructive residue or inspected equipment disposition |
| Residue dose/composition/wetness/conductivity plus inspected state | Deferred candidate | No matched target-equipment probability/cost chain located |

No runtime x-axis is frozen. The research-state contract nevertheless fixes candidate field names so
workbook, metadata, KAT, and consumer-facing records cannot drift:

```text
thermal:
  incident_radiant_heat_flux_time_history_kw_m2
  incident_convective_heat_flux_time_history_kw_m2
  gas_temperature_time_history_c
  gas_velocity_time_history_m_s
  direct_flame_contact_time_history

firebrand:
  firebrand_number_flux_time_history_m2_s
  firebrand_count_by_size_mass_and_combustion_state
  firebrand_deposition_accumulation_state
  firebrand_ingress_or_penetration_state
  firebrand_contact_and_wind_history

residue:
  residue_deposition_mass_loading_g_m2
  residue_composition_and_combustion_state
  surface_conductivity_or_insulation_resistance_change
  moisture_and_energization_state
  verified_flashover_insulation_failure_or_material_damage_state
```

They are capture-only candidates in model v0.1, never an implicit numerical bridge.

## 5. Evidence spine and transfer limits

### Source-hazard semantics

The 2023 FSim risk-component dataset supplies 270 m burn probability and six conditional flame-length
probability classes. FARSITE defines fireline intensity in kW/m. These are useful upstream fields, but
neither is an equipment heat-flux history, ignition probability, exposure fraction, or economic response.
The legacy fixed-distance conversion is therefore prohibited.

### Delivered thermal attack

USFS-hosted field research shows that radiant and convective heating vary through time and with fire/fuel
conditions, and that short peaks differ from sustained crown-fire heating. A future bridge must preserve
the local target geometry, distance, view/shielding, flame contact, gas state, and duration—or validate a
reduced representation. The blade cone-calorimeter study establishes a combustible-matrix mechanism under
15–75 kW/m² radiant tests; it does not establish full-blade field fragility or direct cost.

### Firebrand attack

NIST firebrand work shows that particle size/type, combustion state, substrate, wind, contact history,
deposition, pile accumulation, and thermal footprint matter. A short local peak from one firebrand is not
equivalent to sustained cone exposure, and neither paper supplies turbine/GSU ingress, ignition
probability, population disposition, or cost.

### Electrical and residue disposition

NEMA GD 2 supplies a useful post-fire evaluate/replace/recondition vocabulary for transformers,
switchgear, cable, electronics, batteries, and residue-affected equipment. It is not a pre-event wildfire
fragility, severity threshold, or cost source. Destructive residue remains a visible pathway so a future
conductive/corrosive state is not lost; generic smoke, soot, and cleaning remain excluded.

### Wind anatomy and dependent damage

The BSEE-hosted assessment and the RWE Scroby Sands event identify turbine zones, combustible loads,
internal propagation, and dependent blade/nacelle/upper-tower disposition after a fire. They do not supply
exogenous wildfire initiation or matched cost. That transfer limit is the reason for one dependency-safe
turbine assembly rather than three additive legacy curves.

### Site controls

The Uungula onshore bushfire assessment, AFAC, CFA, FM, and DNV sources provide auditable vegetation,
clearance, access, water, shutdown, containment, detection, and suppression fields. Compliance or
certification is not a numerical damage credit. Unknown state receives no favorable default.

## 6. Value lineage

The NREL CWER reference ledger reconciles:

```text
turbine equipment (rows 2-9)                 1090
foundation + civil + aggregate electrical     239
fieldwork + transport support                  294
physical reference basis                      1623
excluded soft/sunk/nonphysical                  345
installed reference basis                     1968  2023 USD/kW
```

These are reference relationships, not site values or loss caps. The 72 USD/kW electrical row is mapped to
seven separate electrical failure units but remains unallocated. It must not become 72 USD/kW for each
unit, a default GSU value, or an equal split. Fieldwork and transport are allocated once after a final
qualified disposition and never receive intrinsic wildfire DR.

## 7. Exposure and site condition

Actual subject geometries must be used: turbine/rotor or zone, pad point, collection line, shared GSU yard
and apparatus, control/O&M building or point, foundation footprint, and split civil network. A lease,
permitted, or development envelope is retained with that geometry role; it is not silently promoted to a
physical footprint or full-value exposure envelope.

Fixed selectors include turbine platform/BOM, rotor/lower-tip geometry, blade material, enclosure openings,
transformer configuration, cable burial, equipment/fire-protection identity, and prior condition. Event
conditioners include fire approach and duration, shutdown attained state, de-energization/isolation,
ventilation/damper state, suppression availability/activation/outcome, and responder/access state. Each
field may enter one governed bridge or selector once.

## 8. Curve-form decision

No continuous curve, fragility, step, or categorical response table is adopted. A possible future design
would keep pathways separate and use dependency-safe inspected states:

```text
delivered local attack history
  -> P(no_action, inspect_only, clean_if_physical, local_repair,
       major_repair, apparatus_replacement, terminal_assembly_replacement)
  -> same-failure-unit direct state cost ratios
  -> expected DR with epistemic and aleatory uncertainty
```

The state vocabulary is illustrative only. Every state boundary, probability, cost, selector effect,
dependency rule, and support allocation requires a source ID or explicit approved assumption ID.

## 9. Legacy and neighboring-cell pressure test

The old wildfire-wind research contains rotor, nacelle, and tower logistics driven by FLI, a fixed 10 m
flux conversion, height attenuation, and expert caps. It also mixes endogenous/internal-fire cases and
omits BOP. Its axes, curves, thresholds, caps, and ordinates are rejected. The `wildfire_solar` package is
retained for shared FSim semantics and governance structure only; its solar ordinates, weights, caps, and
value shares do not transfer.

## 10. Capability and promotion

All failure-unit DR and loss metrics are withheld. EAL and tail metrics additionally require downstream
frequency/distribution and cap-binding controls that this cell does not own. Promotion to model v1.0
requires a reviewed local-attack bridge, representative response evidence or explicitly governed
screening elicitation, same-unit direct costs, exact site exposure/value bindings, dependency/support
rules, numerical KATs, independent review, a current-schema bundle with hashes, and Hazard migration.

Running the workflow does not itself authorize promotion.
