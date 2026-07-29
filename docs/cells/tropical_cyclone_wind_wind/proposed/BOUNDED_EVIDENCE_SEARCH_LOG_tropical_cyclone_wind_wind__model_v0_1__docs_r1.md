# Bounded evidence search log — tropical_cyclone_wind_wind

## Claim boundary

Within the English-language public sources, repository materials, queries, endpoint tests, and cutoff below,
the review did not locate a matched dataset or validated model that joins representative modern onshore
turbine-local tropical-cyclone demand and event/control state to inspected all-severity component disposition
and same-unit direct repair/replacement cost.

This is not a universal absence claim. Private OEM/type-certificate data, insurer claims, unpublished plant
inspections, non-English reports, non-indexed proceedings, and evidence released after the cutoff may exist.

## Protocol

```yaml
review_cutoff: 2026-07-28
language_scope: English; translated titles/abstracts reviewed where available
access_scope: public web, official/government repositories, peer-reviewed records, local repositories
target_hazard: tropical-cyclone/hurricane atmospheric wind on land
target_asset: modern utility-scale land-based horizontal-axis wind turbine and wind-farm external systems
target_failure_units:
  - turbine-equipment assembly
  - tower collapse and lesser tower states
  - blades/rotor/pitch/yaw/nacelle/drivetrain
  - foundation
  - pad/collection/substation electrical
  - civil and replacement support
target_endpoint: conditional same-unit direct repair-or-replacement cost ratio
search_surfaces:
  - NREL/DOE/OSTI
  - IEC official catalog
  - EPRI public report service
  - Crossref/DOI and publisher records
  - PNAS/PMC
  - Google Scholar-style web discovery
  - DTU and university repositories
  - current Damage Modeling, Hazard Modeling, and legacy curve repositories
```

## Query families

| Family | Representative terms/variants | Endpoint sought | Result |
|---|---|---|---|
| Onshore TC fragility | hurricane/typhoon/cyclone + land-based wind turbine + fragility/vulnerability/damage curve | component damage-state probability and cost | Jaimes/related tower models found; economics assumed, component coverage incomplete |
| Tower collapse | tower buckling/collapse + hurricane + wind speed + lognormal/log-logistic | population or exact-archetype collapse fragility | Jaimes direct onshore modeled family; Rose adjacent NREL 5-MW family; forensic cases found |
| Blade/rotor | typhoon blade failure/fracture + field survey + wind speed | failure probability and repair scope/cost | field mechanisms and counts found; no matched intensity-to-cost population curve |
| Nacelle/control | yaw/pitch/grid loss/nacelle + hurricane + failure | state-conditioned physical disposition | load/mechanism evidence found; no economic curve |
| Foundation | typhoon foundation failure/overturning/anchor + turbine | wind-only fragility and post-collapse cost | case mechanisms found; surge/scour often mixed; no transferable curve |
| Electrical/civil | hurricane wind farm substation/collection/civil damage | line/point/network fragility and value | no target-matched curve with required spatial/value grain |
| Wind bridge | 1-minute 10 m to hub/rotor, 3-second gust, 10-minute mean, TC boundary layer | validated onshore event-to-turbine demand interface | hazard/design conversion studies found; no universal vulnerability bridge |
| Duration/direction | eyewall duration, veer, rapid direction, turbulence, yaw misalignment | load and state sensitivity | strong simulation/review evidence; no generic numeric DR modifier |
| Economic loss | insurance claims/repair cost/inspection + wind turbine + hurricane | same-unit numerator/denominator | EPRI reports sparse record; Jaimes explicitly assumes state cost ratios |
| U.S. events | Maria/Punta Lima/Harvey/Laura/Ida + wind turbine damage | turbine-local demand, denominator, unaffected units | event narratives/leads found; chain not closed publicly |
| Value basis | land-based wind component CAPEX/replacement cost | row-complete direct/support/excluded values | NREL CWER reference ledger found; not a damage source |
| Standards | IEC typhoon class/tropical cyclone/tower/foundation | design selectors and load cases | official scope found; standards anchor design, not fragility |
| Consumer seam | Hazard hurricane wind farm M3 curve/cap/exposure | existing behavior and migration boundary | copied convective curve and mixed full-TIV treatment verified |

## Inclusion and exclusion

Required evidence chain:

```text
source hazard with height and averaging period
  -> turbine-local wind/load state and duration
  -> matching turbine archetype and control/operating state
  -> inspected or validated damage state
  -> same-unit repair/replacement scope and denominator
```

Included evidence types:

- peer-reviewed field/forensic studies with defined turbine/event endpoints;
- peer-reviewed structural simulation with exact axis, model, damage state, and limitations;
- official standards/product records for design scope and selectors;
- government/industry technical reports for method, boundary, and evidence gaps;
- public value studies with auditable row-level reconciliation;
- repository code and prior research for reproducible legacy audit only.

Excluded as direct calibration:

- generic building damage, radar-dome analogy, or transmission-system fragility;
- event category without turbine-local demand;
- operational shutdown/curtailment without inspected physical damage;
- video/news/blog narrative without denominator and control/configuration data;
- load ratio without capacity/disposition/cost bridge;
- design speed treated as a failure median;
- offshore wind+wave/foundation response transferred to onshore wind-only response;
- unsupported global height/gust conversion, topographic multiplier, or mitigation discount;
- smooth expert ordinates presented as empirical calibration.

## Results and disposition

| Evidence link | Located evidence | Missing link | Governed action |
|---|---|---|---|
| `TCWW-S005` Jaimes | Three onshore generic tower DS fragility families, exact native axis and model state | representative fleet transfer; lesser-state disposition; same-unit cost; non-tower units | retain candidate parameters in audit; withhold runtime curve |
| `TCWW-S003` Rose | NREL 5-MW tower-buckling probability under two yaw states | onshore/general transfer; all components; economic endpoint | retain native-axis validation only |
| `TCWW-S008` Usagi | 25-turbine field damage counts plus stop-state structural analysis | population variation, exact per-turbine demand/cost, modern transfer | retain mechanism/case severity; no fit |
| `TCWW-S009` Jangmi | One tower collapse with construction/bolt findings | population denominator and fragility | retain selector/mechanism warning |
| `TCWW-S007` Kapoor | Eyewall veer/direction/yaw effects on loads | capacity/disposition/cost and general-event distribution | require fields; prohibit numeric modifier |
| `TCWW-S006` EPRI | Explicit scarcity of modern utility-scale TC claims and component-dependent duration/gust discussion | calibration data itself | use as fail-closed support |
| `TCWW-S010` CWER | Row-complete reference values | site appraisal, repair scope, probability | adopt reference ledger only |
| `LEG-TCWW-001` | Seven legacy logistics and source leads | reproducibility, endpoint, conversion, denominator | reject numbers; retain audit |
| `LEG-TCWW-002` | Existing consumer behavior | governed artifact, correct value/exposure/physics | freeze regression; propose retirement after v1 |

## Numerical candidate stop rule

The search found enough to reproduce `P(tower wall buckling/collapse | V)` for narrowly defined simulated
archetypes. It did not find enough to label that probability as full tower or equipment DR. Even the possible
screening bridge:

```text
collapse-only contribution = P(DS3 | V) × severity_given_DS3
```

would require an explicit Tier-4 consequence assumption, exact archetype routing, a partial-output label, and
consumer handling that does not mistake the lower-bound terminal contribution for all-severity loss. That is a
future reviewed model-behavior decision, not part of this scaffold.

## Reproducibility and update triggers

Re-run the bounded review when any of the following appears:

1. turbine-level post-TC wind/SCADA or reconstructed local demand joined to inspected repair disposition;
2. OEM/type-certificate or public component-capacity data for current onshore archetypes;
3. insurer/owner claims with unaffected units and same-unit value denominators;
4. a validated TC height-duration-direction bridge for the intended hazard product;
5. new blade, nacelle, foundation, pad, collection, substation, or civil fragilities;
6. a structured expert-elicitation program approved for a screening v1.0;
7. a new NREL value vintage or site-specific replacement schedule;
8. consumer event/pathway/exposure schema changes.

Exact citations, URLs, locators, roles, tiers, and transfer limits are in the source and claim/parameter
registers. `TCWW-C023` is the load-bearing bounded negative-evidence claim.
