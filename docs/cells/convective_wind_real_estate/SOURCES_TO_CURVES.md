Damage-curve review · convective wind × real estate

# Convective wind × real estate curve, where its numbers come from

A convective-wind curve for a building answers one question: **if a thunderstorm gust or a tornado of a given speed hits a house, a warehouse or an office, what share of the building’s replacement cost is lost?** Unlike hail and solar, there are no laboratory counts. The evidence is the Enhanced Fujita scale, the table that storm surveyors use to rate tornadoes, which says at what gust each kind of damage appears for each type of building.

The Damage team priced each kind of damage with FEMA’s cost ladder. So every dot here sits at a published gust, and its height is a cost we assigned. Each building has two curves on the same evidence: one for a tornado, used directly, and one for straight-line storm wind, which only starts at 96 mph.

## Curves 1a and 1b: house (one-storey wood frame)

Curves 1a and 1b · house: half lost at 125 mph in a tornado, 126 mph in a storm · speeds borrowed (T3), costs and onset our judgment (T4)

- **Curve 1a:** House · tornado direct hit
- **Curve 1b:** House · straight-line storm wind (zero up to 96 mph)

**What each source says, and what that means for the line**

- **[#1 · Texas Tech EF report, FR12 table](https://www.spc.noaa.gov/efscale/ef-ttu.pdf)** (numbers on the curve come from it)
  - the gust at which each degree of damage is expected, in mph: ①65 ②79 ③96 ④97 ⑤121 ⑥132
- **[#3 · FEMA Hazus cost ladder](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-hutm_06272025_0.pdf)** (numbers on the curve come from it)
  - Slight 2 %, Moderate 10 %, Extensive 50 %, Complete 100 %: the heights of dots ②④⑥
- **Damage team, decisions D-CWRE-07 and -09** (the Damage team’s own choice)
  - which state each degree matches; heights ①1 % ③5 % ⑤50 %; storm wind counts from 96 mph

**On the Damage dashboard:** [1a · house, tornado](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/convective_wind_real_estate/curves/CWRE_RES_EF_FR12_TORNADO) · [1b · house, straight-line wind](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/convective_wind_real_estate/curves/CWRE_RES_EF_FR12_STRAIGHT_LINE_ONSET96)

The house curve is built from the Enhanced Fujita scale’s table for one- and two-family homes (damage indicator FR12), which gives, for each of 10 degrees of damage, the gust that most likely caused it and a lower and upper bound. All 10 rows were re-read on Texas Tech’s copy of the report for this review (source [#1](https://www.spc.noaa.gov/efscale/ef-ttu.pdf)). Each dot is one degree at its expected gust.

Its height is what the cell charges once that degree happens: FEMA’s Hazus cost ladder (source [#3](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-hutm_06272025_0.pdf)) gives 2 % for Slight, 10 % for Moderate, 50 % for Extensive and 100 % for Complete, and the Damage team matched each EF description to a Hazus state (decision D-CWRE-07).

Three of the dots are numbers we set ourselves: 1 % for the first visible damage (half of Slight), 5 % for broken windows, and 50 % for a house that shifts off its foundation, which no Hazus table describes. Only 6 of the 10 degrees appear as dots, because the curve adds cost only where the charge rises; walls collapsing at 152 mph or a slab swept clean at 200 mph are already at 100 %.

Because real houses vary, the curve reaches about halfway up each step at the dot’s speed rather than at the dot itself; the spread comes from reading the EF bounds as a 90 % range, our judgment. The halfway point means that a tornado gust of about 125 mph costs about half of the house’s replacement cost; a straight-line storm gust needs about 126 mph, because storm winds only count above 96 mph (decision D-CWRE-09).

At 120 mph the house loses 36 % in a tornado and 32 % in a storm. Pricing the foundation shift as Complete instead of Extensive would lift the storm value at 120 mph from 32 % to 48 %, the largest single choice in the cell.

## Curves 2a and 2b: warehouse (metal building)

Curves 2a and 2b · warehouse: half lost at 129 mph in a tornado, 131 mph in a storm · speeds borrowed (T3), costs and onset our judgment (T4)

- **Curve 2a:** Warehouse · tornado direct hit
- **Curve 2b:** Warehouse · straight-line storm wind (zero up to 96 mph)

**What each source says, and what that means for the line**

- **[#1 · Texas Tech EF report, MBS table](https://www.spc.noaa.gov/efscale/ef-ttu.pdf)** (numbers on the curve come from it)
  - the gust at which each degree of damage is expected, in mph: ①67 ②89 ③95 ④117 ⑤143
- **[#3 · FEMA Hazus cost ladder](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-hutm_06272025_0.pdf)** (numbers on the curve come from it)
  - Slight 2 %, Moderate 10 %, Extensive 50 %, Complete 100 %: the heights of dots ②③④⑤
- **Damage team, decisions D-CWRE-07 and -09** (the Damage team’s own choice)
  - which state each degree matches; heights ①1 %; storm wind counts from 96 mph

**On the Damage dashboard:** [2a · warehouse, tornado](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/convective_wind_real_estate/curves/CWRE_IND_EF_MBS_TORNADO) · [2b · warehouse, straight-line wind](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/convective_wind_real_estate/curves/CWRE_IND_EF_MBS_STRAIGHT_LINE_ONSET96)

The warehouse uses the EF table for metal building systems (damage indicator MBS), 8 degrees from the first visible damage at 67 mph to total destruction at 155 mph, re-read on the report (source [#1](https://www.spc.noaa.gov/efscale/ef-ttu.pdf)). Overhead doors collapsing is Slight (2 %), panels pulled off is Moderate (10 %), failed column anchors are Extensive (50 %) and progressive frame collapse is Complete (100 %), each matched by the Damage team to the Hazus state for a metal building (source [#3](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-hutm_06272025_0.pdf)); the 1 % for first visible damage is our choice.

Buckled purlins and failed bracing are already at 50 %, and total destruction already at 100 %, so they add nothing and have no dot. The halfway point means a tornado gust of about 129 mph costs about half of the warehouse; a storm gust needs about 131 mph. At 120 mph the warehouse loses 36 % in a tornado and 31 % in a storm.

## Curves 3a and 3b: office (three-storey low-rise)

Curves 3a and 3b · office: half lost at 157 mph in a tornado, 162 mph in a storm · speeds borrowed (T3), costs and onset our judgment (T4)

- **Curve 3a:** Office · tornado direct hit
- **Curve 3b:** Office · straight-line storm wind (zero up to 96 mph)

**What each source says, and what that means for the line**

- **[#1 · Texas Tech EF report, LRB table](https://www.spc.noaa.gov/efscale/ef-ttu.pdf)** (numbers on the curve come from it)
  - the gust at which each degree of damage is expected, in mph: ①68 ②80 ③101 ④133 ⑤188
- **[#3 · FEMA Hazus cost ladder](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-hutm_06272025_0.pdf)** (numbers on the curve come from it)
  - Slight 2 %, Moderate 10 %, Extensive 50 %, Complete 100 %: the heights of dots ②③④⑤
- **Damage team, decisions D-CWRE-07 and -09** (the Damage team’s own choice)
  - which state each degree matches; heights ①1 %; storm wind counts from 96 mph

**On the Damage dashboard:** [3a · office, tornado](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/convective_wind_real_estate/curves/CWRE_OFF_EF_LRB_TORNADO) · [3b · office, straight-line wind](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/convective_wind_real_estate/curves/CWRE_OFF_EF_LRB_STRAIGHT_LINE_ONSET96)

The office uses the EF table for low-rise buildings (damage indicator LRB), 7 degrees from 68 mph to complete destruction at 188 mph, re-read on the report (source [#1](https://www.spc.noaa.gov/efscale/ef-ttu.pdf)). Lost roofing is Slight (2 %), lifted deck at the eaves and broken windows are Moderate (10 %), an uplifted roof structure is Extensive (50 %) and destruction is Complete (100 %), matched by the Damage team to Hazus (source [#3](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-hutm_06272025_0.pdf)); 1 % for first visible damage is our choice.

The halfway point means a tornado gust of about 157 mph costs about half of the office; a storm gust needs about 162 mph. At 120 mph the office loses 15 % in a tornado and 11 % in a storm.

The curve stays near half from about 150 to 175 mph, because the last degree sits far out at 188 mph; the review (v5, A.18) notes the office diverges from FEMA’s hurricane curve above 150 mph, a tornado-only range, and lists it as a ceiling to fix.

In short: convective wind and real estate is the Enhanced Fujita scale’s damage table for each building type, where each step of damage happens and at what gust, priced on FEMA’s cost ladder. The gusts are published expert estimates; which cost each step gets, the spread between buildings, and the 96 mph start for storm winds are our judgment. The curves agree closely with FEMA’s hurricane curves for the same buildings up to 150 mph (review, A.18), which is as good as screening evidence gets. In the source table, the number of sources in each group is: C (dots we chose) 3, D (shape and choices) 2, E (bottom axis) 1, F (dollars) 1, I (background) 2.

## All 8 listed sources, sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’. The register ID is in brackets.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **C · Puts a dot whose height we chose** | | |
| 1 | **Wind Science and Engineering Center, Texas Tech University. A Recommendation for an Enhanced Fujita Scale (EF-Scale), submitted to the National Weather Service and other interested users. October 10, 2006, Revision 2. (CWRE-S001)**<br>[spc.noaa.gov … ef-ttu.pdf](https://www.spc.noaa.gov/efscale/ef-ttu.pdf)<br>Where to look: PDF p. 9 (report p. 4: expected, lower and upper bound wind speed per DOD; expected value under normal conditions — no weak links, traditional construction, code compliance; bounds account for deviation; expert elicitation, means of experts' estimates); PDF p. 15 (Fujita speeds converted to a 3-second gust frame); PDF pp. 17-18 (rating: evaluator judges within the bounds); Appendix A tables: FR12 PDF p. 25, LRB PDF p. 64, MBS PDF p. 74 | Gives a dot whose height we chose: the gust of every dot: expected, lower and upper speed for each degree of damage of FR12, MBS and LRB (25 rows). All 25 checked against Texas Tech’s copy (www.depts.ttu.edu/nwi/pubs/fscale/efscale.pdf, Appendix A); the SPC copy refuses automated reading. The speeds are expert elicitation, not measurements. |
| 3 | **FEMA. Hazus 7.0 Hurricane Model Technical Manual (June 2025). (CWRE-S003)**<br>[fema.gov … fema\_rsl\_hazus-7-hutm\_06272025\_0.pdf](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-hutm_06272025_0.pdf)<br>Where to look: section 8.1.4.3 p. 8-15 (None, Slight, Moderate, Extensive, Complete assumed to correspond to mean building loss ratios 0%, 2%, 10%, 50%, 100%, identified from the damage descriptions and expert judgment; linear interpolation over 0-2, 2-5, 5-10, 10-50, 50-100%); Table 5-44 pp. 5-185 to 5-186 (residential damage states); Table 5-74 p. 5-239 (metal buildings); Table 5-78 p. 5-242 (engineered steel buildings) | Gives a dot whose height we chose: the heights of the ink dots: 2, 10, 50 and 100 % for Slight to Complete. |
| 2 | **NOAA Storm Prediction Center. The Enhanced Fujita Scale (EF Scale): damage indicator pages 2 (FR12), 17 (LRB) and 21 (MBS), and the EF scale overview page. (CWRE-S002)**<br>[spc.noaa.gov … ef-scale.html](https://www.spc.noaa.gov/efscale/ef-scale.html)<br>Where to look: ef-scale.html ("three-second gusts estimated at the point of damage"; "These estimates vary with height and exposure"); efscale/2.html + 2.jpg (sha256 6c0d70ca1b77eb71ebadb00942d04fb2aa2d04971e359b45e5b55952cd8d7622); efscale/17.html + 17.jpg (sha256 f7d95f61c8e9c9fd3c539de5707b3f924b0f4f998276f3a9eb390c92500f7520); efscale/21.html + 21.jpg (sha256 f4becdda78dc9025be13fed82427ece6d5a57778e228e5799a58d983c72eed0d) | Gives a dot whose height we chose: the same EF tables as the National Weather Service operates them, and the statement that EF speeds are gusts at the point of damage. |
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| — | **The numbers themselves: Damage team, decisions D-CWRE-07 to D-CWRE-10**<br>[github.com … DECISION\_LOG\_convective\_wind\_real\_estate\_\_model\_v0\_1\_\_docs\_r1.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/convective_wind_real_estate/proposed/DECISION_LOG_convective_wind_real_estate__model_v0_1__docs_r1.md)<br>Where to look: decision log; EF\_DEGREE\_OF\_DAMAGE\_TABLE cost\_basis column; tier table rows marked T4 | Gives the numbers: which Hazus state each EF degree matches, the 1 % and 5 % points, the foundation-shift cost, reading the bounds as a 90 % range, the 96 mph storm onset and using tornado evidence for storm wind. Our judgment. |
| 7 | **Damage\_Modeling repository precedents: strong\_wind\_solar model v1.0 thresholded demand curves; wind\_tornado\_wind model v1.0 tornado shift; damage-curve skill common failure modes. (CWRE-S007)**<br>[github.com … docs](https://github.com/aamani-ai/Damage_Modeling/tree/81d5309313d53f37d6bac91e22dd55b498101d0f/docs)<br>Where to look: main 81d5309: docs/cells/strong\_wind\_solar/basics/MODEL\_REFERENCE.md section 3.3 (R0 0.70-0.90 on a pressure ratio: zero damage below); docs/cells/wind\_tornado\_wind/basics/MODEL\_REFERENCE.md (tornado = straight D50 shifted -0.05 to -0.12); docs/extra/damage\_curve\_skill/04\_validation\_qc/COMMON\_FAILURE\_MODES.md lines 35-40 | Gives no number. Repository precedents: thresholded solar wind curves and the turbine tornado shift; support for an onset and for keeping the two pathways apart. |
| **E · Decides what the bottom axis means** | | |
| 5 | **Hazard convective-wind hazard layer (strong wind [W] from ASCE 7-22 gust maps; tornado [T] from the SPC record), aamani-ai/Hazard\_Modeling. (CWRE-S005)**<br>[github.com … convective\_wind](https://github.com/aamani-ai/Hazard_Modeling/tree/f19c604830954a43e293749be390fd37b6eb6e11/perils/convective_wind)<br>Where to look: main f19c604830954a43e293749be390fd37b6eb6e11, perils/convective\_wind/src/convective\_wind/config.py (blob a56ff98c53961f7201b63a84e5d96b93496d8078: MU\_STRONG\_WIND\_MS 25.92, PHYSICAL\_BOUND\_L\_MS 113.0, EF\_GUST\_LO/HI\_MPH, TORNADO\_POOL\_RADIUS\_KM 150), spc\_m0.py (blob 1df31c92a95e84249bb62633ab7af4cdacebb425: national\_path\_geometry), m1\_hazard\_layer.py (blob 5fe515d465399f7e01bbb1508b335fda8de85de6); M1 parquet sha256 386e274d3c109915244c75a0852d3b41ae7aa348f2eb6cd73b050ada6cafa3c8; SPC csv sha256 2b2679ead1920ab96eaa390baeb41aeeaeef49d067f613dfcc5e233403b82d76 | Sets the bottom axis: hazard’s two gust fields: ASCE storm gusts, and the midpoint of the EF band for a tornado (75, 98, 123, 150.5, 183, 227 mph); also the 96 mph onset as 90 % of the median 700-year gust. |
| **F · Turns the curve into dollars** | | |
| 4 | **Hazard reference profiles r1 (real-estate CONUS reference candidates), aamani-ai/Hazard\_Modeling. (CWRE-S004)**<br>[github.com … reference\_candidates.yml](https://github.com/aamani-ai/Hazard_Modeling/blob/8b0d61c88fbcf85daa1c098516cee22398cdb524/docs/plans/_cross_cutting/real_estate_conus/reference_candidates.yml)<br>Where to look: commit 8b0d61c88fbcf85daa1c098516cee22398cdb524, reference\_candidates.yml (git blob a74fb72b0a2edce593b5505e0fd8852f4c0253f8): re\_house\_1s\_wood\_slab, re\_warehouse\_1s\_steel\_slab, re\_office\_3s\_slab | Turns the curve into dollars: the three reference buildings and their replacement budgets; the curve is a share of structure replacement cost new. |
| **I · Background only, no number taken** | | |
| 6 | **FEMA National Risk Index, December 2025 edition, county building expected annual loss for strong wind and tornado (Hazard team's 0.25° CONUS copy). (CWRE-S006)**<br>[github.com … NRI\_CHECK\_RECEIPT\_convective\_wind\_real\_estate\_\_model\_v0\_1\_\_docs\_r1.json](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/convective_wind_real_estate/proposed/NRI_CHECK_RECEIPT_convective_wind_real_estate__model_v0_1__docs_r1.json)<br>Where to look: columns swnd\_ealb, swnd\_expb, trnd\_ealb, trnd\_expb; 13,085 cells keyed by cell\_id; sha256 bc4f8dff7ab9c465677d7a8b94f2fe3038ff03da4632d7b044bcff2afcb3d82b | Gives no number. Background: FEMA’s National Risk Index: an order-of-magnitude and ranking check (dossier section 13), not a calibration. |
| 8 | **Damage\_Modeling consumer binding: substation convective-wind screening v1 (hurricane station response reused for strong wind and tornado as a T4 cross-hazard proxy). (CWRE-S008)**<br>[github.com … README.md](https://github.com/aamani-ai/Damage_Modeling/blob/81d5309313d53f37d6bac91e22dd55b498101d0f/docs/contracts/hazard_handoff/substation_convective_wind_screening_v1/README.md)<br>Where to look: main 81d5309, README lines 13-31 (T4 cross-hazard proxy with exact source identity; no hurricane duration conversion; EF midpoint gust as an explicit T4 bridge; ASCE overlap with hurricane a downstream decision) | Gives no number. Background: the substation binding that reuses a hurricane curve for convective wind: the documented alternative route, not built here. |

**Gaps worth knowing, found while building this page.** (1) This cell is a proposal, not live (promotion status “proposed”). (2) The EF speeds are gusts estimated at the point of damage, of unstated height and exposure; Hazard’s gusts are at 10 m in open terrain. The cell flags the difference and makes no conversion (decision D-CWRE-05). (3) The yearly storm-wind loss is 13 to 35 times FEMA’s National Risk Index in the cell’s own check; the review (v5, A.18) puts that on Hazard’s storm-gust frequency below the ten-year return period, not on these curves. (4) The dashboard calls the cell’s shape “borrowed” (T3) and its cost “our judgment” (T4); its tile word is “our judgment” because the tile reports the full tier span.
