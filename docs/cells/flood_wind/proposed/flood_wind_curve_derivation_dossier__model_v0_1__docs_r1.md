# Flood × wind curve derivation dossier — model v0.1 / docs r1

> Proposed, pressure-tested, noncanonical, and fail-closed. This dossier derives the model boundary and
> curation plan; it does not derive a runtime numerical curve.

## 1. Decision question

For each wind-farm component reached by flooding, what fraction of that same component's direct replacement
value is expected to be repaired or replaced? Which intrinsic component responses can be shared with solar
without copying asset-specific exposure, value, ownership, or instances?

## 2. Asset and pathway scope

The reference asset is a land-based wind generation facility with repeated turbines, array collection
equipment, site civil assets, and a facility-level GSU/substation when present. The primary proposed pathway
is flood_inundation_contact.

Riverine, pluvial, and coastal sources can feed the pathway only after producing the same complete delivered
exposure and conditioner vector. Scour, erosion, saturated-soil support loss, debris impact, and wave loading
are different pathways. Outage, downtime, BI, curtailment, revenue, frequency, tail risk, financial terms, and
portfolio accumulation are downstream or out of scope.

## 3. Physical model

Flood damage is not modeled at whole-farm grain. The principal contact-sensitive subjects are:

- facility GSU switchgear;
- main GSU transformer;
- transformer auxiliaries and controls;
- protection, SCADA, relay, and communications equipment;
- station service and DC power;
- cable terminations, pull boxes, and water pathways;
- turbine-base electrical equipment;
- pad or turbine step-up transformers;
- wind MV collection terminations.

Foundation and civil rows are preserved for reconciliation but routed to future hydraulic/geotechnical or
split civil pathways. Elevated turbine equipment is retained as a geometry-screened subject; it is not
declared universally immune.

## 4. Axis derivation

For component i:

    h_i = max(0, WSE - z_i_crit)

WSE is event water-surface elevation and z_i_crit is the elevation of the component's vulnerable contact
point. Both must use the same vertical datum and spatial support. A component can therefore be dry while site
grade is wet, or contacted at shallow grade depth when vulnerable controls are low.

The method is supported by public flood-elevation guidance, transparent depth-damage practice, and the
canonical flood-solar axis. It does not imply that depth alone is sufficient. Duration, salinity and
contamination, energized/isolation state, enclosure, equipment construction, water path, and protection state
remain load-bearing.

Runtime valid range is withheld because no curve record is approved. The 0–2 m neighboring-cell grid is an
audit candidate domain only.

## 5. Ordinate and value basis

The proposed ordinate is:

    E[direct repair or replacement cost_u / pre-event direct replacement value_u
      | delivered exposure, selectors, conditioners]

The numerator and denominator must refer to the same failure unit. Operational MW removed from service is not
the numerator. Whole-project TIV and the mixed 72 USD/kW electrical row are not component denominators.

The 2023 reference ledger reconciles 1,090 turbine equipment + 120 foundation + 47 civil + 72 electrical +
294 support = 1,623 physical USD/kW; adding 345 excluded/soft/nonphysical gives 1,968 installed USD/kW. These
are reference reporting values, not a site appraisal or damage caps.

## 6. Shared component decision

FERC's typical configurations support a common facility Plant-GSU role for wind and solar. Thus asset label is
not an intrinsic selector when equipment, mechanism, axis, ordinate, selectors, conditioners, and evidence
endpoint are materially identical.

The shared flood-electrical substrate owns vocabulary, compatibility, axis semantics, and evidence lineage.
The flood-wind cell owns component presence, spatial instance, delivered exposure, ownership, value, coverage,
capability, version, and release. The common layer is non-runtime in model v0.1.

## 7. Evidence synthesis

NEMA supports equipment-specific water-damage evaluation. NERC cases demonstrate that controls, station
service, protection, and telecommunication equipment can drive severe operational outcomes at relatively
shallow contact states. FEMA, USACE, and DOE/FEMP support elevation-aware exposure and water-path concepts.
NREL supplies a wind value ledger but not the required electrical split. FERC's LGIA makes ownership
demarcation site-agreement dependent.

None supplies a representative same-unit depth/state-to-direct-cost response. The bounded search and claim
register preserve the exact permitted and prohibited inferences.

## 8. Candidate numerical audit

The canonical flood-solar artifact is pinned by:

    flood_solar@model_v1_0__docs_r4
    SHA-256 a08e77ef034e1ecea3e7cd05d13c825921b54d610fca9de8651ebda8e857082d

FS_SWG is the closest transfer candidate but remains audit-only. FS_XFMR is rejected for direct reuse because
main-transformer value and control/terminal contact semantics are mixed. FS_SCADA and FS_CABLE provide partial
concept or mechanism matches only. Exact candidate ordinates live in the numerical audit and workbook, never
in curve_records.

The Hazard M3/M4 logistics are reproducible legacy characterization fixtures. Their grain, provenance, value
shares, zero anchoring, missing-state behavior, and bypass architecture fail promotion.

## 9. Site adapter and missing states

The metadata contract separates identity, fixed selectors, event conditioners, delivered exposure, ownership,
and value. Missing or mismatched datum rejects. A synthetic centroid does not establish a component or its
value. Unknown ownership excludes baseline project physical loss. Unknown protection receives no credit.
Unsupported pathways and neighboring-cell curves do not serve as fallback.

## 10. Coverage and capability

All twelve physical subjects are withheld; two support rows are non-curve allocation subjects.
curve_records is empty. Failure-unit DR, scenario loss, EAL, PML, VaR, and TVaR are all withheld. Valid
identity and exposure fields may be checked, but no valid input can produce numeric damage.

## 11. Promotion path

Deep curation should begin with GSU switchgear and protection/control/DC, then main transformer versus
auxiliaries, turbine-base/pad equipment, and collection terminations. Each record needs equipment-specific
disposition and cost evidence, representative applicability, a site value/ownership binding, reproducible
curve derivation, boundary and mismatch KATs, and independent review.

A future shared runtime response is a schema-contract change. The preferred design authors the intrinsic
response once and materializes a pinned copy into self-contained cell bundles. Every bound cell retains an
explicit semantic-version decision.

## 12. Controlled records

This dossier is governed with the source register, claim/parameter register, parameter-tier table, value
crosswalk, shared reuse crosswalk, seven-step audit, site adapter, pressure test, promotion matrix, zero-curve
JSON artifact, capability declaration, known-answer tests, audit workbook, and Hazard handoff.

