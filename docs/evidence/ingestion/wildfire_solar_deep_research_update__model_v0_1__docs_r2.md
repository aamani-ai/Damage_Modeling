# Wildfire × solar deep-research update — model v0.1, docs r2

> Historical evidence decision. Model v1.0 docs r3 was later released as an explicitly screening-grade Tier 4
> engineering proxy. This memo remains authoritative for what the public evidence does and does not calibrate.

Review date: 2026-07-10
Change class: `EVIDENCE_ONLY_NO_OUTPUT_CHANGE` + `DOCS_ONLY`
Runtime effect: none

## Executive verdict

The additional research materially improves the scientific runway, but it does not justify changing
`wildfire_solar` from model v0.1 to model v1.0.

The new evidence establishes that wildfire damage to solar facilities is real, can involve several
subsystems at once, and may include module degradation that simple performance or I–V checks do not reveal.
It also reinforces that a physically meaningful vulnerability model must use local component attack — heat
flux, direct contact, duration, geometry, ember state, and BOM/protection — rather than a landscape fireline
intensity value by itself.

No reviewed source closes the complete calibration chain:

```text
regional hazard state
  -> component-zone local attack
  -> inspected failure / replace decision
  -> same-unit direct replacement-cost ratio
```

The correct result is therefore a stronger, more operational v0.1 scaffold with zero curve ordinates, not a
renamed v1.0 proxy.

## What changed in docs r2

| Area | New result | Runtime consequence |
|---|---|---|
| Field evidence | An actual wildfire-affected PV study and reported operating-plant events were added. | Confirms materiality and diagnostic needs; does not calibrate a curve. |
| Insurance evidence | IEA PVPS reports broad `fire` claim materiality. | Supports priority only; category is not exogenous-wildfire-specific and lacks denominators. |
| Wildland-fire physics | Field measurements show strong variation in radiant/convective exposure by fuel and fire regime. | Strengthens rejection of a universal FSim/FLI converter. |
| PV fire response | New glass-glass/BIPV work adds BOM- and protocol-specific thermal evidence. | Supports selectors and test design; not population fragility. |
| Electrical endpoints | NEMA provides inspect/evaluate/replace logic after fire/heat damage. | Helps define outcomes; does not supply pre-event probability. |
| Site controls | FM ground-mounted-solar guidance adds explicit wildland-fire controls. | Adds fields/covariates; no automatic mitigation percentages. |
| Consumer seam | The current Hazard proxy was traced from FSim class midpoint through whole-TIV loss. | Defines an explicit migration stop rule and two-mode architecture. |

The effective docs r2 source and claim registers are the r1 base registers plus the r2 addenda. Stable r1
IDs were not rewritten.

## Evidence assessment by load-bearing link

### Link A — regional wildfire hazard

FSim remains a valid regional hazard input when used in source-native form:

- burn probability is frequency;
- FLP1–FLP6 are conditional flame-length probabilities given burning;
- the 270 m product is strategic landscape information, not uniform equipment attack;
- the open-ended sixth class has no source-provided upper midpoint;
- simulation active periods are not component exposure durations.

This link is usable for screening and frequency modeling. It is not a vulnerability axis by itself.

### Link B — regional state to local component attack

Wildland-fire measurements support the variables that belong in a local transfer model. They also show why
the transfer is not a constant. Surface, shrub, and crown fire settings can produce different radiant and
convective histories; fuel, flame geometry, distance/view factor, wind, slope, component height, barriers,
and duration all matter.

No reviewed study estimates the joint distribution of those variables at utility-scale solar component
zones conditional on an FSim class. This link remains a blocking gate.

### Link C — local attack to component disposition

Laboratory studies establish mechanisms and applicability boundaries:

- module glass state, layup, tilt and boundary conditions affect thermal response;
- cable materials can have test-specific critical flux and ignition-time behavior;
- direct flame exposure differs from uniform radiant loading;
- controls, wiring, power equipment, and module populations require different endpoints.

The accessible 2026 wildfire-affected PV field-study abstract is especially useful because it shows that EL
and IR can reveal degradation that performance or I–V evaluation alone may not settle. NEMA guidance helps
map observed post-fire states to inspect/evaluate/replace decisions for electrical equipment.

But the reviewed literature does not provide representative utility-scale populations with measured local
exposure, affected and unaffected units, BOM, and final disposition. This link remains uncalibrated.

### Link D — disposition to same-unit economic damage ratio

The r1 value crosswalk remains the correct starting point. Direct physical value, protected/unexposed value,
mixed civil value, and support/fieldwork costs must remain separate. Support costs are allocated once after
the damaged work scope is known; they do not receive their own fragility curve.

The new field-event and insurance sources do not provide paired repair invoices or same-unit replacement
denominators. Applying an aggregate curve to full TIV would mix vulnerability, exposure, coverage, and value.
This link remains a blocking gate.

## Transferability decisions

| Evidence | Endpoint actually observed | Tier/use | Why it cannot become an ordinate |
|---|---|---|---|
| Jang et al. wildfire-affected PV study | Diagnostic degradation signals in an actual affected system | T3 field-diagnostic protocol | Accessible abstract lacks local dose, full denominator, BOM, final disposition, and cost. |
| Uiseong 1 MW facility report | Severe multi-subsystem damage and shutdown | T3 event materiality | No engineering inventory, unaffected control, local attack, or claims ledger. |
| IEA PVPS/GCube chart | Broad fire claim and incurred-cost shares | T3 portfolio materiality | `Fire` may include internal electrical fires; exposures and component records are unavailable. |
| Wildland heat-flux studies | Radiant/convective flux and time in specific fires | T2 physics/field support | No mapping to solar zones conditional on FSim and no component outcomes. |
| PV specimen fire studies | Test-specific fracture, temperature, ignition, or burn behavior | T2 mechanism evidence | Specimen/BOM/protocol-specific; not replacement-cost population response. |
| NEMA GD 2 | Post-event equipment disposition guidance | T2 endpoint protocol | Not a pre-event probability or heat threshold. |
| FM DS 7-106 | Site controls and recommendations | T2 control-field design | No matched effectiveness coefficient or uncertainty distribution. |
| ASTM/IEC fire/safety tests | Scope-limited classification/qualification | T2 selector metadata | Not actual all-condition wildfire performance or ground-mounted population fragility. |

## The correct first-runtime architecture

The research does not support a single whole-asset `DR(FIL)` curve. The first defensible runtime should be a
site-loss model assembled from qualified failure-unit responses:

```text
regional screening mode
  FSim BP + conditional FLPs
  -> hazard ranking / frequency only
  -> no wildfire-solar physical loss

site-loss mode
  measured or qualified local attack by component zone
  + BOM / installation / protection selectors
  -> failure-unit disposition probability or conditional replacement DR
  x same-unit exposed replacement value
  -> sum across units and zones
  -> allocate support costs once
```

Candidate local-attack fields are:

```text
zone_id
direct_flame_contact_state
incident_radiant_heat_flux_kw_m2
incident_convective_heat_flux_kw_m2
exposure_duration_s
firebrand_or_ember_attack_state
fuel and geometry provenance
measurement_or_model_id
uncertainty_basis
```

These fields are candidate interface requirements, not calibrated parameters. Ember attack remains a
separate pathway until recipient-specific ignition/failure evidence exists.

## Minimum calibration-ready field program

A useful future dataset must preserve both successes and failures. The minimum event package is:

1. **Event and footprint:** ignition/perimeter/timing, local fuel consumption, wind and slope, fire path,
   high-resolution before/after imagery, and sensor or reconstructed heat/contact/time by zone.
2. **Pre-event asset inventory:** geolocated module strings and BOM, glass integrity, racking, cable routing,
   combiner/inverter/control/MV equipment, enclosures, barriers, vegetation and maintenance state.
3. **Denominators:** all exposed and unexposed units by the same selector strata, not damage cases alone.
4. **Inspection:** visual, IR, EL, I–V/performance, insulation/continuity/protection tests, OEM or qualified
   disposition, repeated monitoring where latent degradation is possible.
5. **Economic endpoint:** repair/replacement work order by failure unit, quantity, unit cost, salvage,
   temporary work, and separately identified support/logistics cost.
6. **Controls:** unaffected zones/sites with comparable BOM and inspection intensity.
7. **Provenance:** source ID, measurement/model uncertainty, missingness, decision maker and inspection date.

An insurer or operator claims extract can contribute only if it includes exposure denominators and a peril
taxonomy that separates exogenous wildfire from internal PV fire.

## Promotion decision

`model v1.0` remains withheld. The [promotion-gate matrix](../../cells/wildfire_solar/proposed/PROMOTION_GATE_MATRIX_wildfire_solar__model_v0_1__docs_r2.md)
turns the remaining gaps into acceptance tests. The [Hazard handoff](../../contracts/hazard_handoff/wildfire_solar_research_to_runtime_handoff__model_v0_1__docs_r2.md)
states how the downstream consumer must behave until those tests pass.

No numerical DR, scenario loss, EAL, PML, VaR, or TVaR is authorized by this evidence update.

## Governed records

- [Bounded evidence search](../../cells/wildfire_solar/proposed/BOUNDED_EVIDENCE_SEARCH_LOG_wildfire_solar__model_v0_1__docs_r2.md)
- [Source-register addendum](../../cells/wildfire_solar/proposed/SOURCE_REGISTER_ADDENDUM_wildfire_solar__model_v0_1__docs_r2.csv)
- [Claim-register addendum](../../cells/wildfire_solar/proposed/CLAIM_PARAMETER_REGISTER_ADDENDUM_wildfire_solar__model_v0_1__docs_r2.csv)
- [Change classification](../../cells/wildfire_solar/proposed/CHANGE_CLASSIFICATION_wildfire_solar__model_v0_1__docs_r2.md)
