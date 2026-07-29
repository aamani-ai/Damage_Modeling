# Bounded evidence search - tropical_cyclone_wind_solar model v1.0/docs r2

```yaml
search_cutoff: 2026-07-29
prior_review_cutoff: 2026-07-29
target_chain: local_TC_wind -> inspected_failure_unit_state -> final_disposition -> same_unit_direct_cost -> same_unit_replacement_value
target_asset: utility_scale_ground_mounted_solar_with_fixed_and_tracker_routes
target_endpoint: occurrence_physical_repair_or_replacement_cost_ratio
search_outcome: evidence_improved_runtime_behavior_unchanged
```

This review asks whether the existing Perry screen can become portable, cover trackers or severe wind, or
expand to economic and whole-plant damage. It is a bounded public-primary-source review, not a claim that
private owner, insurer, adjuster, contractor, OEM, non-English, unindexed, or future evidence does not exist.

## Search surfaces

- DOE, NLR/NREL, OSTI, FEMA, and government field-investigation records;
- Florida Public Service Commission owner testimony, exhibits, and storm-cost filings;
- SEC issuer filings and owner project records for event loss and final disposition;
- peer-reviewed remote-sensing and field studies with official data repositories;
- official weather-provider documentation and design/meteorological wind definitions;
- tracker OEM case records, treated as adjacent engineering evidence rather than independent field
  calibration;
- local `damage_modeling`, `Hazard_modeling`, `strong_wind_solar`, legacy curve, value-basis, and consumer
  contract records.

## Query families

```text
utility scale solar hurricane damage modules racks invoices replacement value
PV hurricane fixed tilt tracker field inspection repair cost
solar storm restoration cost public service commission panels inverter erosion
Perry Visual Crossing max wind gust API query station semantics
Typhoon Mawar ground mounted PV tracker module damage wind gust
Typhoon Yagi photovoltaic damage area direct economic loss wind scale
US Virgin Islands FEMA solar modules posts racking hurricane Maria
solar hurricane owner SEC loss repair replace salvage
```

## Qualification tests

A candidate numerical record had to answer every applicable question:

1. Is the pathway ambient tropical-cyclone wind, with tornado, flood, surge, rain ingress, debris, and other
   pathways either separated or explicitly labeled as composite?
2. Is the local wind descriptor versioned, time- and site-paired, and defined for duration, height, terrain,
   exposure, direction, and uncertainty?
3. Is the fixed-tilt or tracker architecture identified at the response unit?
4. For trackers, are command, attained angle, drive lock, controller power/backup, and cycling observed?
5. Are affected and unaffected units inspected under a comparable protocol?
6. Is the response atom one nonoverlapping failure unit with repair, replace, salvage, and no-action states?
7. Is direct physical cost paired to the same unit and separated from BI, financial terms, upgrades, and
   support charged elsewhere?
8. Is the denominator the event-date replacement value of that same unit?
9. Are support, exposure, ownership, and compound-event double counting controlled?
10. Is there enough event and architecture breadth for interpolation, severe-tail treatment, uncertainty, and
    independent validation?

A source can support mechanism, anatomy, occurrence bounds, selectors, or acquisition design after failing
one of these tests. It cannot supply the missing economic ordinate.

## Results by evidence family

| Evidence family | Strongest reviewed result | Permitted use | Numerical decision |
|---|---|---|---|
| Perry sampling and fit | Six clustered events, Florence-dominated rows, repeated physical site, imposed PAVA and block-edge interpolation | Reproducible finite-sample descriptive replay | No predictive relationship, including for a new source-compatible site |
| Perry axis provenance | Visual Crossing API identified at study level; released row-level query and station lineage absent | Correct provider wording; retain source-native axis | No Hazard bridge |
| Perry severe observation | One 48.2 m/s ground/nontracking row with 41.42383192% visible damage | Audit severe discontinuity | No tail fit or extrapolation |
| Typhoon Mawar | Four ground fixed systems with very low visible module loss under severe estimated gusts; no trackers | External fixed-tilt severe audit and design/installation lesson | No pooling; report has incompatible axis and internal count inconsistencies |
| Typhoon Yagi | Regional satellite PV-area loss and generic area-cost estimate on a modeled 10 m/wind-scale field | Event-scale external screening comparison | No failure-unit DR or Perry-axis transfer |
| FPL Ian/Milton/Helene | Fleet panel damage/replacement fractions below 0.04%, around 0.06%, and below 0.07%; recorded module, inverter, electrical, erosion, and inspection work | Censored occurrence bounds and acquisition fields | Count fractions are not economic DR |
| FPL restoration costs | Contractor, logistics, materials, labor, vehicle, and capitalization buckets | Demonstrate cost-scope and once-only support requirements | Mixed generation/restoration costs are not solar-unit DR |
| FEMA/owner USVI cases | Modules, posts, racks, connectors, electrical, removal, repair, and rebuild dispositions | Strong physical mechanism and state evidence | No matched direct cost and replacement value |
| SEC/owner loss estimates | Plant-level estimated losses and availability effects | Audit economic materiality and prohibited numerators | No isolated direct physical numerator or same-unit denominator |
| DOE/FEMP forensic cases | In-person inspection of module, rack, conduit, inverter, switchgear, transformer, water, and civil pathways | Failure-unit coverage and compound-event boundary | No occurrence cost/value pair |
| Tracker OEM cases | Claimed survival under stow or terrain-following design | Candidate selectors, inspection fields, and negative-case design | No inventory, local demand, state probability, disposition, or cost calibration |
| NLR/NREL cost benchmarks | Component and installed-cost anatomy | Value crosswalk and reconciliation only | No vulnerability or reinstatement-cost curve |

## Reproducible observations that remain non-DR

The following are useful audit quantities but cannot be serialized as damage ratios:

- FPL panel count fractions: `<0.0004`, approximately `0.0006`, and `<0.0007` for their stated fleet/event
  scopes;
- FEMA Spanish Town physical fractions: `106/16,748` damaged modules, `64/16,748` partly blown-off modules,
  about `400/3,044` damaged posts, and fewer than `50/3,044` posts identified for replacement;
- AES estimated loss intensities derived from reported plant MW, because reported loss is not isolated direct
  physical cost and MW is not replacement value;
- insurance deductibles, recovery amounts, capitalizable shares, loan guarantees, program contracts, and
  hardening premiums;
- plant availability or generation availability as a substitute for physical destruction; and
- new-build benchmark weights as vulnerability or occurrence reinstatement cost.

## Scoped negative finding

Within the recorded public review, no dataset paired:

```text
portable local tropical-cyclone demand and uncertainty
+ exact fixed/tracker architecture and attained state
+ affected and unaffected inspected failure units
+ final no-action / repair / replace / salvage disposition
+ same-unit direct materials and labor cost
+ event-date same-unit replacement value
+ separated support, BI, upgrades, insurance and compound pathways
```

## Update triggers

- archived Perry/Visual Crossing request-response records with station contributors, query settings,
  timestamp/version, and time-of-maximum lineage;
- owner or adjuster event datasets with exact local 3-second gust or a reviewed source-to-demand bridge;
- fixed and tracker inventories with command and attained tracker state;
- component inspection, repair/replace/salvage schedule, invoices/work orders, and matching SOV/RCV;
- author clarification of Mawar ground-module counts and site wind summaries;
- stable unique-site/event identifiers, a representative sampling frame, cluster-aware inference, and
  event-held-out predictive validation;
- architecture-resolved severe observations across independent events; and
- explicit support allocation and ambient-wind versus tornado/flood/surge attribution.

Until a package crosses these gates, the current curve remains a source-cohort research screen and all new
numerical routes remain withheld.
