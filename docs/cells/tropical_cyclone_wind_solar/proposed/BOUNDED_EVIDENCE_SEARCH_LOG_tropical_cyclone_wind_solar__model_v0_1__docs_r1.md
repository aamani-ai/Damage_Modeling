# Bounded evidence search — tropical-cyclone wind × solar

**Cell:** `tropical_cyclone_wind_solar`

**Pathway:** `tropical_cyclone_wind`

**Model / docs:** model v0.1 / docs r1

**Search cutoff:** 2026-07-28

**Decision supported:** `NO_RUNTIME_CURVE`

## Question and stopping rule

The search asked whether public evidence could support at least one utility-scale, ground-mounted fixed-tilt or single-axis-tracker failure-unit record through this complete chain:

1. source-native tropical-cyclone wind field;
2. qualified conversion to local array or component demand;
3. architecture, geometry, condition, and event-state match;
4. failure-unit physical state or repair disposition across relevant severity;
5. same-unit direct repair or replacement cost divided by the same-unit replacement-value denominator; and
6. provenance and uncertainty adequate for a versioned runtime damage record.

Search stopped after the named high-yield primary surfaces, backward/forward source trails, the adjacent governed solar-wind package, and the two legacy code paths had been checked, and every numerical candidate still failed at least the physical-state/economic-consequence seam. The stopping rule establishes bounded negative evidence, not universal absence.

## Surfaces reviewed

| Surface | What was checked | Result |
|---|---|---|
| NOAA/NHC official glossary and technical-product semantics | source storm-wind height, averaging period, and exposure convention | source-native axis semantics only (`TCWS-S001`) |
| NSF public-access repository and DOI record | Ceferino et al. full paper, source population, limit state, posterior summaries, and transfer limits | site extensive-structural-failure probability candidate only (`TCWS-S002`) |
| DOE OSTI / NREL publication record and full paper | Perry et al. remote-sensing method, population, visible-damage statistics, and limitations | fleet-scale visible-damage constraint, not DR (`TCWS-S003`) |
| DOE/FEMP report library | St. Croix post-Maria investigation and rebuild study | mechanism and compound-event case only (`TCWS-S004`) |
| ASCE official standard page and source trail | fixed-tilt ground-mount design-wind provisions and axis lineage | design/demand anchor only (`TCWS-S005`) |
| FM official data sheet | fixed-tilt and tracker engineering controls, third-party qualification, stow action margin, debris guidance | selector and operating-control evidence only (`TCWS-S006`) |
| IEC official webstore scopes | tracker and module qualification standards | product/test provenance, not fragility (`TCWS-S007`, `TCWS-S008`) |
| DOE/FEMP PV owner guidance | field-audit anatomy and weather-vulnerability mechanisms | mechanism and inspection fields (`TCWS-S009`) |
| Publisher DOI and primary paper records | fixed-tilt ABL loads; tracker aeroelastic benchmark; tracker layout sensitivity; joint cyclic demand | engineering bridges and selectors, no target economic endpoint (`TCWS-S010`–`TCWS-S012`, `TCWS-S014`) |
| NLR Data Catalog | Q1-2025 utility-scale PV cost rows and model lineage | reference value denominator only (`TCWS-S013`) |
| Governed `strong_wind_solar` proposal | reviewed solar anatomy, source trail, value basis, and neighboring-wind boundary | cross-cell reuse at anatomy/governance grain only (`TCWS-S015`) |
| Legacy `infrasure-damage-curves` repository | hurricane-solar memo, cited sources, curve index, and parameter lineage | source-discovery value; numerical bundle rejected (`LEG-TCWS-001`) |
| Hazard consumer repository | provisional hurricane-solar M3 code, weights, formula, and outputs | migration fixture; runtime fallback rejected (`LEG-TCWS-002`) |

## Reproducible query families

The following query families were run against general scholarly discovery and then resolved to primary or official records where available. Capitalization and punctuation variants were also checked.

- `"Ceferino" 2023 ground-mounted solar photovoltaic hurricane fragility 14 sites 90 m/s beta 0.15`
- `"Bayesian updating of solar panel fragility curves" ground mounted 14`
- `site:par.nsf.gov Ceferino Lin Xi solar fragility hurricane`
- `site:osti.gov Perry Jordan Nguyen 2025 remote sensing photovoltaic hurricane damage`
- `"Assessing the Impacts of Extreme Weather Events on Photovoltaic Installations"`
- `site:energy.gov St Croix solar Hurricane Maria 469 kW total loss photovoltaic`
- `"Toward Solar Photovoltaic Storm Resilience"`
- `site:nhc.noaa.gov glossary maximum sustained surface wind one minute 10 m`
- `site:asce.org ASCE 7-22 ground-mounted solar wind`
- `site:fm.com 7-106 ground-mounted solar tracker instability speed stow`
- `site:iec.ch IEC 62817 tracker qualification`
- `site:iec.ch IEC 61730-2 module safety qualification`
- `ground-mounted multi-row solar arrays wind tunnel Browne Taylor Gamble 104294`
- `single-axis solar tracker aeroelastic instability benchmark 105838`
- `solar tracker row position pitch wind direction aeroelastic 113232`
- `cyclic demands solar structural joints wind loading 04025156`
- `site:data.nrel.gov Q1-2025 solar photovoltaic system cost benchmarks submission 304`
- `solar hurricane damage repair cost utility-scale ground-mounted claims`
- `solar tracker hurricane fragility repair cost ground mount`
- `photovoltaic hurricane failure module rack substation repair replacement cost dataset`

Repository searches also covered `hurricane`, `tropical cyclone`, `solar`, `PV`, `tracker`, `fixed tilt`, `substation`, `GSU`, `fragility`, `damage ratio`, `repair cost`, `replacement cost`, `Ceferino`, and the legacy logistic parameter names.

## Candidate-chain result

| Candidate | Hazard / local demand | Target architecture | Physical state or disposition | Same-unit cost | Runtime result |
|---|---|---|---|---|---|
| Ceferino ground-mounted posterior (`TCWS-S002`) | reconstructed 3-second gust using a tropical-cyclone wind model; uncertainty retained | large ground-mounted sites, but fixed tilt versus tracker not reported | probability of a site-level composite condition: clip/racking failure in more than 50% of panels | absent | candidate-only; probability is not economic DR |
| Perry Irma/Maria imagery (`TCWS-S003`) | third-party estimated maximum gust joined to imagery | mixed residential, commercial, and utility; target subset not separately calibrated | manually estimated visible module-area damage | absent; hidden damage and repair disposition unobserved | audit and field-data-method constraint only |
| St. Croix investigation (`TCWS-S004`) | site event and design estimates in a compound wind/rain/flood case | one 469 kW fixed-tilt site | detailed mechanisms and an assessed total-loss outcome | project repair/rebuild discussion, but no transferable same-unit state-cost population | anatomy and case pressure test only |
| Fixed-tilt design/wind-tunnel sources (`TCWS-S005`, `TCWS-S010`) | code/design pressure and ABL coefficients | fixed tilt within stated geometry and rigidity limits | no population failure disposition | absent | bridge input only |
| Tracker FM/IEC/aeroelastic sources (`TCWS-S006`, `TCWS-S007`, `TCWS-S011`, `TCWS-S012`) | tested or modeled exact-system response / critical speed | source-specific tracker, angle, layout, and state | qualification or instability, not population damage states | absent | selector and future bridge input only |
| NLR cost benchmark (`TCWS-S013`) | none | reference UPV cost architecture | none | reference component and support rows, not post-event repair disposition | denominator only |
| Legacy hurricane-solar bundle (`LEG-TCWS-001`, `LEG-TCWS-002`) | asserted 3-second-gust mph without a governed event/site bridge | unsupported fixed/tracker and subsystem splits | ordinary logistics labeled as DR | hardcoded caps and TIV shares, not same-unit observed cost | rejected; audit/regression only |

No row completes all columns. In particular, combining Ceferino probability with NLR component shares would join different atoms and endpoints: a site-level probability of extensive structural failure is not the fraction of module, rack, GSU, or whole-plant replacement value physically destroyed.

## Negative endpoint tests

The search did **not** locate a public, transfer-qualified record that simultaneously provided:

- fixed-tilt versus tracker identity for the Ceferino 14-site population;
- event-specific local array demand with an exact averaging, height, terrain, direction, and architecture bridge;
- component-level mutually exclusive damage states, repair versus replacement disposition, and module salvage after structural failure;
- itemized direct costs tied to those same failure units and events;
- an exact-system tracker critical-speed population paired with field failure and repair-cost observations;
- a GSU/substation-specific tropical-cyclone wind response paired with point/yard exposure and same-unit direct cost; or
- a clean wind-only causal allocation for the St. Croix compound loss.

These statements are bounded to the surfaces, queries, languages, and cutoff above. Private owner/OEM/insurer data, non-indexed engineering reports, and later publications may close the gaps.

## What would change the decision

A search refresh is required if any of the following appears or is authorized:

1. record-level release for the Ceferino or Perry sites with array architecture, design basis, local demand reconstruction, inspection, disposition, salvage, and invoice data;
2. owner, OEM, EPC, insurer, or lender event files linking pre-event configuration and controls to post-event component work orders and costs;
3. a validated tropical-cyclone storm-field-to-array-demand bridge for fixed tilt or an exact-system tracker qualification catalog with compatible speed semantics;
4. component-state cost evidence for `PV_FIXED_TILT_MODULE_FIELD`, `PV_FIXED_TILT_SUPPORT_STRUCTURE`, `PV_TRACKER_MODULE_FIELD`, or `PV_TRACKER_SBOS_ASSEMBLY`;
5. GSU-specific tropical-cyclone wind evidence with point/yard exposure and transformer/switchgear disposition and cost;
6. a forensic compound-event attribution that separates pressure, windborne debris, driven rain, flood/surge, and corrosion consequences; or
7. a formally governed elicitation package approved to supply screening assumptions, followed by a separately classified behavior-change review.

Until then, the source register and candidate audits may expand, but `curve_records` remains empty and scalar damage and monetary loss remain withheld.
