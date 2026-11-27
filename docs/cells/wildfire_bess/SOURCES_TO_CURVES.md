Damage-curve review · wildfire × battery storage

# Wildfire × battery curve, where its numbers come from

A wildfire curve for a battery storage plant answers one question: **when a wildfire with flames of a given length burns through the 270 m cell around a battery container or an inverter unit, what share of that unit’s value is lost?** Unlike hail and solar there is nothing measured to draw a line through, and no wildfire at a battery yard has been inspected unit by unit.

Every number is a choice: the class weights are the wildfire and solar cell’s tables for inverters and transformers, copied unchanged; the cost is the owner’s ruling to replace a container whose batteries are compromised. The dashboard calls every curve “our judgment” (T4). It does not say “borrowed”, because on the dashboard that word means a tier T3 number inferred or extrapolated from evidence; here the copying is literal, from another asset, and the numbers copied were judgment to begin with.

## Curves 1a and 1b: battery container, approved policy (replace the container if its batteries are compromised)

Curves 1a and 1b · battery container: half passed only at the 12 ft and up class (80 %) · our judgment (T4), solar inverter table reused

- **Curve 1a:** Battery container · central: the solar inverter table
- **Curve 1b:** Battery container · alternative: the solar transformer table

**What each source says, and what that means for the line**

- **[#3 · wildfire and solar cell, two tables](https://github.com/aamani-ai/Damage_Modeling/tree/36fbdaaf68736a2a8f9e8ed1e536039098e086d2/docs/cells/wildfire_solar/current)** (numbers on the curve come from it)
  - inverters: 0.2, 1, 5, 18, 45, 80 %; transformers and switchgear: 0.1, 0.6, 3, 12, 35, 70 %; both copied unchanged
- **Owner ruling BWF-Q01, 19 October** (the Damage team’s own choice)
  - compromised batteries mean replacing the whole 1.05 million dollar container (100 %)
- **Damage team, parameter BWF-P07** (the Damage team’s own choice)
  - use the inverter table for the container; the transformer table is the lower alternative (our judgment)

**On the Damage dashboard:** [1a · battery container, inverter table](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_bess/curves/BWF01_ENC_approved_replacement_electronics_ordinal) · [1b · battery container, transformer table](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_bess/curves/BWF01_ENC_approved_replacement_heavy_electrical_ordinal)

Each of the 80 battery containers in the reference plant is worth 1.05 million dollars. For each flame-length class the cell multiplies a weight by the cost of replacing the whole container. The weights are the wildfire and solar cell’s table for inverters, 0.2, 1, 5, 18, 45, 80 % from class 1 to class 6 (source [#3](https://github.com/aamani-ai/Damage_Modeling/tree/36fbdaaf68736a2a8f9e8ed1e536039098e086d2/docs/cells/wildfire_solar/current)), copied unchanged (curve 1a); curve 1b is that cell’s lower table for transformers and switchgear, 0.1, 0.6, 3, 12, 35, 70 %, kept as an alternative shape.

Nothing was measured. Both solar tables were chosen by the wildfire and solar author and are graded T4 there; their use for a battery container is a new T4 choice by the Damage team (parameter BWF-P07, claim BWF-C13). The cost, the whole container, comes from the owner’s ruling of 19 October that compromised batteries mean replacement (BWF-Q01), not from a repair estimate. The sources only bound the reasoning.

Tesla’s emergency guide says outside flame can start thermal runaway (source [#4](https://www.tesla.com/sites/default/files/downloads/Lithium-Ion_Battery_Emergency_Response_Guide_en.pdf)), which is why the weight is not zero; Sungrow’s test report shows target containers surviving a neighbour’s fire (source [#5](https://info-support.sungrowpower.com/market-material/eeb93c64-dfba-4f4c-a481-b6853ec90cea.pdf)), which is why the weight is not 100 % at every class. Neither gives a number for a class.

The halfway point means that only when the fire around the unit has flames of 12 ft or more does the container lose most of its value on this curve, 80 % or about 840,000 dollars; at 8 to 12 ft it loses 45 %. The curve is used for every battery container on Hazard’s grid.

The review (v5, A.12) judges it fine for ranking, but says the top two classes are probably high for a sealed steel container, because the weights were written for inverters with circuit boards behind louvres; no clearance or gravel buffer changes the result.

## Curves 2a to 2d: battery container, two repair sensitivities (the batteries are assumed reusable)

Curves 2a to 2d · repair sensitivities: at most 25 % and 16 % at the top class, never half · our judgment (T4)

- **Curve 2a:** Battery container · replace non-cell parts, inverter weights
- **Curve 2b:** Battery container · replace non-cell parts, transformer weights
- **Curve 2c:** Battery container · replace cooling and enclosure only, inverter weights
- **Curve 2d:** Battery container · replace cooling and enclosure only, transformer weights
- **Curve 1 (for comparison):** Battery container · approved policy, as above

**What each source says, and what that means for the line**

- **Owner ruling BWF-Q01** (the Damage team’s own choice)
  - kept only as sensitivities; Hazard runs curve 1
- **[#9 · earlier battery cost allocation](https://github.com/aamani-ai/Damage_Modeling/tree/36fbdaaf68736a2a8f9e8ed1e536039098e086d2/docs/extra/discussion/bess_damage/evidence/r3)** (numbers on the curve come from it)
  - non-cell parts: 31.8 % of the container (about 334 thousand dollars); cooling and enclosure: 19.5 % (about 204 thousand)
- **Damage team, parameter BWF-P08** (the Damage team’s own choice)
  - same class weights as curve 1, times a cheaper repair cost (our judgment)

**On the Damage dashboard:** [2a · non-cell parts, inverter weights](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_bess/curves/BWF01_ENC_noncell_repair_sensitivity_electronics_ordinal) · [2b · non-cell parts, transformer weights](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_bess/curves/BWF01_ENC_noncell_repair_sensitivity_heavy_electrical_ordinal) · [2c · cooling and enclosure only, inverter weights](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_bess/curves/BWF01_ENC_limited_repair_sensitivity_electronics_ordinal) · [2d · cooling and enclosure only, transformer weights](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_bess/curves/BWF01_ENC_limited_repair_sensitivity_heavy_electrical_ordinal)

These four records keep the class weights of curve 1 and change only the cost. If the cells inside a burned container could be reused, replacing all the other parts would cost about 334,395 dollars, 31.8 % of the container; if the cells and their management boards could both be reused, replacing only the cooling and the enclosure group would cost about 204,352 dollars, 19.5 %.

Both costs come from an earlier cost split of the same 84 million dollars of containers (source [#9](https://github.com/aamani-ai/Damage_Modeling/tree/36fbdaaf68736a2a8f9e8ed1e536039098e086d2/docs/extra/discussion/bess_damage/evidence/r3)), which the cell itself grades T4: it is not a manufacturer quote or a verified repair method. That each cost is applied with the same weights as curve 1 is our judgment too (parameter BWF-P08). None of these lines reaches half: at the top class the container loses at most about a quarter of its value.

The gap between curve 1a and curves 2a to 2d is the size of the open question the owner’s ruling settled in favour of replacement. Hazard does not run these curves unless a request names the reusable-cells counterfactual; they exist so that the difference can be shown.

## Curve 3: separate inverter units (the solar inverter table, unchanged)

Curve 3 · inverter units: half passed only at the 12 ft and up class (80 %) · our judgment (T4)

**What each source says, and what that means for the line**

- **[#3 · wildfire and solar cell, inverter table](https://github.com/aamani-ai/Damage_Modeling/tree/36fbdaaf68736a2a8f9e8ed1e536039098e086d2/docs/cells/wildfire_solar/current)** (numbers on the curve come from it)
  - 0.2, 1, 5, 18, 45, 80 % from class 1 to class 6; copied unchanged
- **Damage team, parameter BWF-P09** (the Damage team’s own choice)
  - a battery plant’s inverter units resemble a solar plant’s; use the same table (our judgment)

**On the Damage dashboard:** [3 · separate inverter units](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_bess/curves/BWF01_PCS_ELECTRONICS)

The 20 separate inverter units, worth 520,000 dollars each and 10.4 million dollars in all, use the wildfire and solar inverter table exactly as it is (source [#3](https://github.com/aamani-ai/Damage_Modeling/tree/36fbdaaf68736a2a8f9e8ed1e536039098e086d2/docs/cells/wildfire_solar/current), parameter BWF-P09). The table was chosen by the wildfire and solar author, and its reuse here is our judgment, so nothing on the curve was measured.

The halfway point is the same as for curve 1: an inverter unit loses most of its value only when flames of 12 ft or more reach its cell. With curves 1 and 3 together the cell prices 94.4 million dollars of the 109.8 million dollars plant.

The medium-voltage gear, civil works and fieldwork, 15.4 million dollars, have no wildfire curve and are withheld, not zero; fire spreading from one container to the next, smoke, and fires that start inside a battery are outside the cell.

In short: wildfire and battery is two tables written for solar inverters and transformers, applied to a battery container and multiplied by the cost of replacing it. The owner chose replacement; the class weights are the solar author’s choice reused by the Damage team; the sources explain why the weights are neither zero nor total, and none gives a number for any flame class. The ranking by fire class is sensible; the level at the two top classes has nothing behind it. In the source table, the number of sources in each group is: A (the curve itself) 1, D (shape and choices) 8, E (bottom axis) 1, F (dollars) 2, I (background) 1.

## All 12 listed sources, sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’. The register ID is in brackets.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **A · Gives the curve itself: a published curve or table used as printed, or a curve copied from another cell** | | |
| 3 | **Canonical wildfire\_solar model v1.0 docs r3 (BWF-S03)**<br>[github.com … current](https://github.com/aamani-ai/Damage_Modeling/tree/36fbdaaf68736a2a8f9e8ed1e536039098e086d2/docs/cells/wildfire_solar/current)<br>Where to look: curve\_artifact; ORDINATE\_TABLE; dossier sections3-5; exact index pin | Gives the curve: the inverter table (curves 1 to 3) and the transformer table (the dashed alternatives). Identical to the wildfire and solar records WSV1\_INVERTER\_THERMAL and WSV1\_MV\_EQUIPMENT\_THERMAL. Both are T4 in that cell. |
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| — | **The numbers themselves: owner ruling BWF-Q01 and Damage team parameters BWF-P07 to BWF-P10**<br>[github.com … parameter\_register.csv](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_bess/current/parameter_register.csv)<br>Where to look: parameter register, all four rows T4 | Gives the numbers: using the solar tables for a battery container, the 1.05 million dollar replacement, the two repair costs, and the rule of no protection credit. Our judgment on every curve. |
| 12 | **Owner BWF-Q01 ruling2026-10-19 (BWF-S12)**<br>[github.com … 09\_wildfire\_damage\_intake.md](https://github.com/aamani-ai/Damage_Modeling/blob/36fbdaaf68736a2a8f9e8ed1e536039098e086d2/docs/extra/discussion/bess_damage/09_wildfire_damage_intake.md)<br>Where to look: BWF-Q01; experiment\_spec.json owner\_ruling | Gives no number. The owner’s ruling: test full replacement, keep repair as sensitivities. |
| 4 | **Tesla Industrial Lithium-Ion Battery ERG rev2.8 (existing captured bytes) (BWF-S04)**<br>[tesla.com … Lithium-Ion\_Battery\_Emergency\_Response\_Guide\_en.pdf](https://www.tesla.com/sites/default/files/downloads/Lithium-Ion_Battery_Emergency_Response_Guide_en.pdf)<br>Where to look: printed13 / PDF15 section3.3; printed17 / PDF19 section5.2; printed20 / PDF22 section8 | Gives no number. Outside flame can start thermal runaway: why the weights are not zero. |
| 5 | **Sungrow A Holistic Approach to Safety whitepaper (BWF-S05)**<br>[info-support.sungrowpower.com … eeb93c64-dfba-4f4c-a481-b6853ec90cea.pdf](https://info-support.sungrowpower.com/market-material/eeb93c64-dfba-4f4c-a481-b6853ec90cea.pdf)<br>Where to look: printed24 / PDF25 Figures36-39; embedded test report cover 10522343-SHA-R-01 IssueE dated2025-04-22 | Gives no number. Some target containers survive a neighbouring fire in tests: why the weights are not 100 % at every class. |
| 7 | **CFA Victorian Big Battery incident account (2021-07-30; updates through2021-08-03) (BWF-S07)**<br>[news.cfa.vic.gov.au … firefighters-bring-large-battery-fire-near-geelong-under-control](https://news.cfa.vic.gov.au/news/firefighters-bring-large-battery-fire-near-geelong-under-control)<br>Where to look: Original article and incident-controller statement; cause undetermined in this account | Gives no number. The Victorian Big Battery fire spread between units: why containment cannot be assumed everywhere. |
| 6 | **UL Solutions large-scale fire testing announcement (2026-04-23) (BWF-S06)**<br>[ul.com … ul-solutions-launches-large-scale-fire-testing-battery-energy-storage-systems](https://www.ul.com/news/ul-solutions-launches-large-scale-fire-testing-battery-energy-storage-systems)<br>Where to look: main body paragraphs test scope; internally initiated BESS enclosure fire and targets | Gives no number. Large-scale fire testing of battery containers is under way; no results used. |
| 8 | **DOE FEMP Solar Photovoltaic Hardening for Resilience - Wildfire (BWF-S08)**<br>[energy.gov … solar-photovoltaic-hardening-resilience-wildfire](https://www.energy.gov/cmei/femp/solar-photovoltaic-hardening-resilience-wildfire)<br>Where to look: Physical Measures; containers; fuel removal; access and local fire-crew consultation | Gives no number. Fuel removal, spacing and barriers matter; no credit given in this version. |
| 11 | **NEMA fire/heat equipment guide and2026 resource update (BWF-S11)**<br>[makeitelectric.org … nema-issues-guidance-on-evaluating-damaged-electrical-equipment-after-natural-disasters-and-extreme-weather-events](https://www.makeitelectric.org/newsroom/news/nema-issues-guidance-on-evaluating-damaged-electrical-equipment-after-natural-disasters-and-extreme-weather-events/)<br>Where to look: May28,2026 announcement; CS70008-2026 metadata;2016 guide discovery | Gives no number. Fire-damaged equipment needs the maker’s disposition; the 2026 guide body could not be read. |
| **E · Decides what the bottom axis means** | | |
| 2 | **USFS A Wildfire Risk Assessment Framework RMRS-GTR-315 (2013) (BWF-S02)**<br>[fs.usda.gov … rmrs\_gtr315.pdf](https://www.fs.usda.gov/rm/pubs/rmrs_gtr315.pdf)<br>Where to look: printed25 / PDF31 Table5 and Wildfire Likelihood; native catalog RDS-2016-0034-3 | Sets the bottom axis: the six flame-length classes and the rule that a class is a landscape severity, not heat at the equipment. |
| **F · Turns the curve into dollars** | | |
| 1 | **Selected BESS r1 profile and fixed-2024 budget (BWF-S01)**<br>[github.com … bess\_conus](https://github.com/aamani-ai/Hazard_Modeling/tree/d12718f713925ebc75f6efcc82285e5bc11e0458/docs/plans/_cross_cutting/bess_conus)<br>Where to look: asset\_model.json; layout.csv; reference\_budget.csv | Turns the curve into dollars: the reference plant: 80 containers at 1.05 million dollars, 20 inverter units at 520,000, 109.8 million dollars in all, 15.4 million dollars with no wildfire curve. |
| 9 | **NREL-related same-budget battery hardware allocation from prior BESS review (BWF-S09)**<br>[github.com … r3](https://github.com/aamani-ai/Damage_Modeling/tree/36fbdaaf68736a2a8f9e8ed1e536039098e086d2/docs/extra/discussion/bess_damage/evidence/r3)<br>Where to look: value\_allocations.csv MMP\_related\_allocation; parent source and receipt in r3 README/audit | Turns the curve into dollars: the two repair costs of curve 2, from an earlier cost split of the same container budget. |
| **I · Background only, no number taken** | | |
| 10 | **Current native Substation Wildfire Hazard route (BWF-S10)**<br>[github.com … substation.py](https://github.com/aamani-ai/Hazard_Modeling/blob/03f7999473f719c4e986e6cb84ac420dbe9e08c9/perils/wildfire/src/wildfire/substation.py)<br>Where to look: station\_fire\_native\_response; station\_fire\_annual; docs/hazards/wildfire/implementation/substation/conus\_grid/version\_1/m0.md through m4.md | Gives no number. Background: hazard’s substation wildfire code: its sampling and yearly-loss pieces may be reused; the battery coupling is not yet admitted. |

**Gaps worth knowing, found while building this page.** (1) The cell has no derivation dossier or workbook of its own: derivation.md and the source, claim and parameter registers in the cell folder stand in. (2) The review (v5, A.12) quotes an FSRI installation test in which a container across a 35-inch aisle stayed below ignition while the one at zero spacing went into runaway; that test is not in the cell’s register. (3) Hazard’s yearly-loss code couples all hundred units to the same fire class, so the worst year, about 75 million dollars, is a ceiling and not a typical bad year (review, A.12). (4) 15.4 million dollars of the 109.8 million dollars plant has no wildfire curve and is withheld, not zero.
