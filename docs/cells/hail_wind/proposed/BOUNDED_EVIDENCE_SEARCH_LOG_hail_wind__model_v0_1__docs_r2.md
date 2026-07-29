# Bounded evidence search - hail_wind model v0.1/docs r2

```yaml
search_cutoff: 2026-07-29
prior_review_cutoff: 2026-07-28
target_chain: source_hail -> blade_local_contact_history -> inspected_disposition -> same_blade_direct_cost
target_asset: modern_onshore_horizontal_axis_wind_turbine_and_separate_BOP
target_endpoint: occurrence_physical_repair_or_replacement_cost_ratio
```

This update asks whether newly located public evidence can support any honest output-bearing hail x wind
record. It is a reproducible scoped review, not a universal claim about private, non-English, unindexed, or
future evidence.

## Search surfaces

- DOE/OSTI, NREL, Sandia/IEA Wind, NOAA/NWS/NSSL/NCEI, and institutional research repositories;
- Crossref/DOI and publisher records for hail impact, blade materials, leading-edge erosion, inspection,
  repair, and operational-field studies;
- TU Delft and Strathclyde primary theses and papers;
- official ISO work-item status and FM property-loss-prevention guidance;
- NOAA Storm Events detail records through archive revisions available on 2026-07-28;
- local `damage_modeling`, `Hazard_modeling`, `hazard_analysis`, `infrasure-damage-curves`, and Learning
  records.

## Query families

```text
wind turbine blade hail impact damage field inspection
coated GFRP simulated hail failure threshold energy
wind farm hail leading edge erosion operational inspection
wind turbine hail repair replacement cost claims
hailstone blade stress strain damage map
hail resistance coating wind turbine ISO test
FM land-based wind turbine hail inspection
NOAA Storm Events turbine hail blade loss
```

## Qualification tests

A candidate numerical record had to answer every applicable question:

1. Is the pathway direct atmospheric hail impact rather than rain erosion, wind, lightning, ice, or flood?
2. Is the hazard descriptor source-native and paired to the affected turbine/time?
3. Can the source be bridged to blade-section contact demand using observed turbine state?
4. Is the blade, coating, laminate, and prior-condition population identified?
5. Are affected and unaffected units inspected under a comparable protocol?
6. Is the endpoint a mutually exclusive no-action/monitor/repair/replace disposition?
7. Is direct repair/replacement cost paired to the same blade unit and denominator?
8. Are value, exposure, support, and compound-event double counting controlled?
9. Is the domain sufficient for interpolation without unsupported severe-tail extrapolation?
10. Can an independent reviewer reproduce the source-to-parameter decision?

Sources failing a test can still support mechanism, selectors, inspection protocol, or research design. They
cannot supply a runtime economic ordinate.

## Results

| Evidence family | Strongest reviewed result | Permitted use | Numerical decision |
|---|---|---|---|
| Coated-blade-material test | Savana 2022 gas-cannon tests on one coated GFRP construction | Protocol-specific damage-initiation and selector design | No curve: coupon threshold/matrix cracks are not field disposition or cost |
| Repeated uncoated impacts | Macdonald et al. 2019 | Diameter, speed, repetition, material-response mechanism | No curve: mass/optical/SEM endpoints and test population do not match |
| Numerical impact response | Macdonald and Stack 2024; Fiore et al. 2015 | Diameter/velocity/angle/section/material bridge requirements | No curve: stress, strain, and delamination area are non-economic |
| Operational field observation | Law and Koutsos 2020 | Bounded affected/unaffected cohort-design lesson | No zero curve: two hail-prone groups had climatological, not event-resolved, exposure |
| Chronic degradation | Pryor and Barthelmie 2026 plus open code/atlas | Lifecycle materiality and data-gap definition | No occurrence curve: mixed rain/hail coating life has wrong temporal grain |
| Test method | ISO/CD TS 19392-7 | Future protocol/certificate selector | No curve: draft method contains no population response or economics |
| Engineering guidance | FM DS 13-10 | Hail verification, sensors, inspection, rating, and disposition fields | No curve or mitigation credit |
| Event/claims search | NOAA Storm Events current detail surface | Bounded negative evidence | No representative utility-scale blade disposition/cost chain located |
| Legacy implementation | `Real Estate_Hail` array and active wind mappings | Negative regression and migration blocker | Reject: wrong asset/endpoint plus unit/grid/extension defects |

## NOAA event-record check

The current Storm Events detail surface from 1995 through available 2026 revisions was queried for exact
utility-turbine narrative terms. Seventy-three exact turbine-related event narratives were found; the sole
`Hail`-typed match was a 1995 rooftop turbine reported blown off by winds. It is not a modern utility-scale
hail-to-blade disposition/cost chain. This supports withholding only within the recorded surface and query.

## Why a source-specific screening exception still fails

The strongest candidates do not expose a source-native economic or even disposition fraction that can be
quarantined to one exact cohort. A numerical atom would require at least:

```text
coupon/simulation response -> field blade state probabilities       [unsupported]
field blade state          -> same-blade direct cost ratios         [unsupported]
event hail product         -> local strike/contact-history demand   [unsupported]
```

Those are load-bearing mappings, not harmless labels. A smaller invented curve would not solve them.

## Scoped negative finding

Within the recorded public review, no dataset paired:

```text
event-resolved hail and turbine operating state
+ exact blade/coating/laminate identity
+ affected and unaffected inspected blades
+ mutually exclusive final repair/replacement disposition
+ same-blade direct cost and replacement-value denominator
```

This does not assert that owner, OEM, insurer, forensic, or contractor records do not exist.

## Update triggers

- OEM or owner pre/post-event blade inspections tied to local hail and SCADA state;
- a validated source-hail-to-blade-contact bridge for a declared turbine/blade family;
- final ISO 19392-7 text plus product-specific test results and field transfer evidence;
- work orders/claims/SOVs separating coating, laminate repair, replacement, and support costs;
- hail-specific sensor/nacelle/BOP inspection and cost records;
- a governed structured elicitation with named experts, calibration questions, uncertainty, and update
  triggers if the owner deliberately chooses a Tier-4 screening model.

Until one of these packages closes the response and economic gates, `HW-C034` and `NO_RUNTIME_CURVE` remain
in force.
