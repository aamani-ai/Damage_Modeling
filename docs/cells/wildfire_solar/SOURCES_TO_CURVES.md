Damage-curve review · wildfire × solar farm

# Wildfire × solar curve, where its numbers come from

A wildfire curve for a solar plant answers one question: **if a wildfire reaches the plant with flames of a given length, what share of the cost of rebuilding the plant is lost?**

There are no laboratory counts and no published agency table for this. The Damage team gave each of ten plant parts six values, one per flame-length class, kept in a sensible order by fire tests and equipment guidance, then added the parts up by each part's published share of the plant's value. The bottom axis is the flame length of the wildfire in the surrounding 270 m patch of land, not the heat at any panel.

### What the labels on this page mean

A cell is one hazard × asset pair in the Damage repository, and its dossier is the write-up of how its curves were built.

Each curve is marked by how well it is backed:

- **published (T2)**: taken from a published source and used unchanged
- **borrowed (T3)**: a published result carried over to a case it was not made for
- **our judgment (T4)**: numbers the Damage team chose

Withheld means no number is given, because nobody knows; it is not the same as zero.

## Curve 1: PV modules

**What each source says, and what that means for the line**

- **[Damage team (dossier section 5.2)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md#52-absolute-anchors)** (the Damage team’s own choice)
  - Did: chose how much of the modules is lost in each flame class, from the smallest (1) to the biggest (6): 0.2, 1, 4, 12, 32 and 65 %
  - So: these six values are the line (our judgment, T4)
- **[#6 · Yang and colleagues 2015, module fire tests](https://doi.org/10.3390/ma8074210)** (no number on the curve comes from it)
  - Says: in a lab, module material catches fire at 26 kW/m² of heat; gives no damage number
  - So: no number on the curve; it only confirms fire can damage modules
- **[#9 · DOE/FEMP, PV hardening for wildfire](https://www.energy.gov/cmei/femp/solar-photovoltaic-hardening-resilience-wildfire)** (no number on the curve comes from it)
  - Says: burned sections of a plant are rebuilt; gives no damage number
  - So: no number on the curve; backs counting burned parts as rebuilt, not repaired

**On the Damage dashboard:** [1 · PV modules](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_solar/curves/WSV1_MODULE_THERMAL)

This is the table the cell uses for the solar modules, which are about a third of what it would cost to rebuild the plant. The six numbers, 0.2, 1, 4, 12, 32 and 65 % from the smallest flame class to the largest, were chosen by the Damage team ([section 5.2 of the dossier](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md#52-absolute-anchors)). They are our judgment (T4), and nothing on the curve was measured.

The sources shape the choice without giving a number for any class. Laboratory tests show small pieces of module material catching fire at a radiant heat of 26 kW/m² [[#6](https://doi.org/10.3390/ma8074210)], and DOE's wildfire guidance says burned sections generally need rebuilding and heat-exposed modules need infrared and electroluminescence checks [[#9](https://www.energy.gov/cmei/femp/solar-photovoltaic-hardening-resilience-wildfire)]. Neither ties damage to a flame-length class, which is why there are no dots.

The dossier's rules for the numbers are that class 1 stays near zero, class 4 means a noticeable number of local replacements, and class 6 allows major loss without assuming the whole field is lost; no part goes above 90 %. Half the modules are lost only when the flames are 12 ft or longer.

The curve only says what happens when a fire reaches the plant. How often fires happen is a separate number that Hazard works out from the fire data and combines with the curve later; it is not built into the curve.

Each flame-length class is a range of flame lengths, and every flame length in a range gets the same value: 7 ft and 7.9 ft both use the 6 to 8 ft value. When Hazard simulates a single fire, it uses the value for that fire's class. When it only knows how likely each class is at a place, it takes the average of the six values, weighted by how likely each class is.

## Curves 2a to 2e: the heat-sensitive electrical parts (five tables)

- **Curve 2a:** Heat-sensitive parts · exposed cable
- **Curve 2b:** Heat-sensitive parts · SCADA and communications
- **Curve 2c:** Heat-sensitive parts · combiner boxes
- **Curve 2d:** Heat-sensitive parts · inverters
- **Curve 2e:** Heat-sensitive parts · transformers and switchgear

**What each source says, and what that means for the line**

- **[Damage team (dossier section 5.2)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md#52-absolute-anchors)** (the Damage team’s own choice)
  - Did: chose how much of each part is lost in each flame class. In the biggest flames (class 6, 12 ft and up): cable and SCADA 90 %, combiners 85 %, inverters 80 %, transformers and switchgear 70 %
  - So: these tables are curves 2a, 2b, 2c, 2d, 2e (our judgment, T4)
- **[#26 · NEMA GD 2-2016, fire-damaged equipment](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-2-2016-evaluating-fire-and-heat-damaged-electrical-equipment-guide.pdf)** (no number on the curve comes from it)
  - Says: how to judge fire-damaged electrical equipment; gives no damage number
  - So: no number on the curve; helped rank electronics above transformers
- **[#7 · Zhang and colleagues 2022, cable fire tests](https://doi.org/10.3390/en15051904)** (no number on the curve comes from it)
  - Says: lab tests on how cable burns; gives no damage number
  - So: no number on the curve; helped rank cable at the top, level with SCADA

**On the Damage dashboard:** [2a · exposed cable](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_solar/curves/WSV1_CABLE_EXPOSED) · [2b · SCADA](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_solar/curves/WSV1_SCADA_THERMAL) · [2c · combiner boxes](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_solar/curves/WSV1_COMBINER_THERMAL) · [2d · inverters](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_solar/curves/WSV1_INVERTER_THERMAL) · [2e · transformers and switchgear](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_solar/curves/WSV1_MV_EQUIPMENT_THERMAL)

These five tables cover the parts made of plastics and electronics. From the smallest flame class to the largest, they lose:

- exposed cable: 0.5, 2, 8, 25, 60, 90 %
- SCADA and communications kit: 0.4, 2, 8, 25, 60, 90 %
- combiner boxes: 0.3, 1.5, 6, 20, 50, 85 %
- inverters: 0.2, 1, 5, 18, 45, 80 %
- medium-voltage transformers and switchgear: 0.1, 0.6, 3, 12, 35, 70 %

Every one of those numbers is the Damage team's choice ([section 5.2 of the dossier](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md#52-absolute-anchors)), our judgment (T4), and no source gives any of them. The sources only helped decide which part sits higher than another.

In a lab test on one 9 mm cable [[#7](https://doi.org/10.3390/en15051904)], the cable caught fire at about 16 kW/m², lower than the 26 kW/m² for module material [[#6](https://doi.org/10.3390/ma8074210)]. The test is not about solar plants or wildfire, but it backs the dossier's rule that plastic-covered cable is among the most heat-sensitive parts, so cable is set at the top, level with the monitoring kit.

NEMA's guide to electrical equipment after a fire [[#26](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-2-2016-evaluating-fire-and-heat-damaged-electrical-equipment-guide.pdf)] says heat-damaged electronics should be replaced, while some heavier power equipment can be checked and repaired. That helped set the electronics above the transformers and switchgear. The transformers still reach 70 % because the dossier says protected heavy equipment can need major replacement when flames reach it directly. The guide does not mention inverters by name, and the cell gives no written reason for the exact order among the monitoring kit, combiner boxes and inverters.

Exposed cable, the monitoring kit and the combiner boxes are half lost once flames reach 8 to 12 ft; inverters and transformers pass half only at 12 ft and up. The cell treats all cable as exposed, which the review notes pushes the result up wherever cable is buried. These tables are used for every plant, together with curves 1 and 3.

## Curves 3a to 3d: metal, buried and civil parts (four tables)

- **Curve 3a:** Metal and civil parts · fences, roads, buildings
- **Curve 3b:** Metal and civil parts · racking and trackers
- **Curve 3c:** Metal and civil parts · grounding and lightning
- **Curve 3d:** Metal and civil parts · foundations

**What each source says, and what that means for the line**

- **[Damage team (dossier section 5.2)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md#52-absolute-anchors)** (the Damage team’s own choice)
  - Did: chose low losses for steel, buried and civil parts, never zero. In the biggest flames (class 6): civil works 40 %, racking 25 %, grounding 12 %, foundations 4 %
  - So: these tables are curves 3a, 3b, 3c, 3d (our judgment, T4)
- **[#28 · Frankman and colleagues 2012](https://doi.org/10.1071/WF11097)** (no number on the curve comes from it)
  - Says: heat from wildland fires varies widely with fuel and setting
  - So: no number on the curve; supports the order of the parts only
- **[#27 · FM Data Sheet 7-106 (April 2026)](https://www.fm.com/-/media/project/publicwebsites/fmglobal/documentum-new/data-sheet-individual/07-hazards/fmds07106.pdf)** (no number on the curve comes from it)
  - Says: site controls such as buffers and fences lower fire damage
  - So: no number on the curve; this version gives no credit for them

**On the Damage dashboard:** [3a · fences, roads, buildings](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_solar/curves/WSV1_CIVIL_DIRECT) · [3b · racking](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_solar/curves/WSV1_RACKING_THERMAL) · [3c · grounding and lightning](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_solar/curves/WSV1_GROUNDING_THERMAL) · [3d · foundations](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_solar/curves/WSV1_FOUNDATION_THERMAL)

Steel, concrete and buried parts get low tables. Some lose nothing in the smallest one or two flame classes, but the cell does not call any part immune, so every one of them loses something in the larger classes. From the smallest flame class to the largest, they lose:

- fences, roads and buildings: 0.1, 0.5, 2, 7, 18, 40 %
- racking and trackers: 0, 0.1, 0.5, 2, 8, 25 %
- grounding and lightning protection: 0, 0.1, 0.4, 1.5, 5, 12 %
- foundations: 0, 0, 0.1, 0.3, 1, 4 %

These are the Damage team's choices ([section 5.2 of the dossier](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md#52-absolute-anchors)), our judgment (T4), and nothing was measured. Field measurements of wildland fires [[#28](https://doi.org/10.1071/WF11097)] show heat that varies about tenfold with fuel and setting, which supports giving the severe classes some damage but gives no number. None of these tables reaches half, even at the top class: on this curve a wildfire never destroys most of the racking or foundations.

The FM data sheet [[#27](https://www.fm.com/-/media/project/publicwebsites/fmglobal/documentum-new/data-sheet-individual/07-hazards/fmds07106.pdf)] lists the site controls that would matter, such as cleared buffers. The current version gives no credit for them, which is the review's main caveat: a cleared, gravelled plant scores the same as an overgrown one on the same patch of land.

## Curves 4a and 4b: the whole plant, all ten parts added up by value

- **Curve 4a:** Whole plant · share of physical rebuild value (878 $/kW)
- **Curve 4b:** Whole plant · share of installed cost (1,120 $/kW)

**What each source says, and what that means for the line**

- **[#18 · NLR Q1 2025 cost benchmark, with the](https://doi.org/10.7799/3009689)** (numbers on the curve come from it)
  - value workbook #20
  - Says: value per kW: modules 291, racking 110, transformers 107; 688 dollars direct, 878 physical, 1,120 installed
  - So: these weights add the ten part lines into curves 4a and 4b
- **[Damage team: assembly rule (dossier section 6)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md#6-value-linkage-and-assembly)** (the Damage team’s own choice)
  - Did: add each part's loss weighted by its value; support costs follow once, in proportion
  - So: this rule turns the ten tables into curves 4a and 4b
- **[Damage team: stress test (dossier section 7)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md#7-aggregate-pressure-test)** (the Damage team’s own choice)
  - Did: multiplied every class value by 0.6 and by 1.5
  - So: this is the shaded band: scenarios, not a confidence range

**On the Damage dashboard:** [the cell page (curves 4a and 4b add up the ten parts; they have no curve page of their own)](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_solar)

This is the whole plant: the ten part tables added up, each weighted by its share of the plant’s value from the national lab cost benchmark [[#18](https://doi.org/10.7799/3009689) and [#20](https://data.nrel.gov/submissions/304)]. The weights are published; the class values are the Damage team’s, so the plant curve is our judgment (T4).

Line 4a measures the loss against the cost of rebuilding the physical plant: 0.2, 0.8, 3.5, 11.2, 29.9 and 58.3 % from class 1 to class 6, so only the top class (flames of 12 ft or more) costs more than half. Line 4b measures it against the full installed cost, which also includes soft costs no fire can destroy, so it stops at 46 %.

A worked example for flames of 8 to 12 ft (class 5) on a 100 MW plant: the ten parts lose 20.6 million dollars of their 68.8 million, or 29.9 %; modules alone lose 9.3 million (32 % of 29.1 million). Support costs are charged at the same 29.9 %, so the plant loses 26.3 million dollars: 29.9 % of its 87.8 million physical value (line 4a), or 23.5 % of its 112.0 million installed cost (line 4b).

Not covered: fires started by the plant’s own equipment, smoke and soiling, downtime, and erosion after the fire.

## What the review checked, and why it is usable for screening

The damage-curve review judged every curve by one question: is it good enough for a rough national map? That means the size of the loss is about right, places come out in a sensible order, and the curve says what it leaves out. For each curve it checked that the numbers come from the documents cited, whether it is the right curve for a national map, and whether Hazard feeds it the right input.

### What was checked

The review compared the curve with real fires at solar plants. The outcomes span the whole range the curve allows: two plants in Australia had fire burn around their fences and took no damage, and a 20 MW plant in Kern County, California, lost more than 100,000 modules.

A physical check shows the limit of the approach. Modules catch fire at about 26 kW/m² of radiant heat, and the heat that reaches them depends on distance, flame width and how long the fire burns much more than on the fire class, so one number per class cannot capture it.

The outside check recorded for this cell on the dashboard turned out to be circular, because Hazard's ceiling repeats the cell's own hardware rows.

### Why it is usable for screening

A more intense fire always means more loss, so regions rank in a sensible order.

The ways the plant gets damaged are the right ones: flames and heat destroy modules, smoke and heat damage connectors, cables and inverters, and foundations suffer least.

### What to keep in mind

The fire class comes from the Forest Service's fire model and describes the vegetation of the surrounding land, not the plant. A plant kept as mowed gravel with a cleared firebreak, sitting in brushland, scores worse than an overgrown plant in grassland. Until the curve knows the state of the site, read it as a regional indicator, not a ranking of plants.

Every loss share per class was chosen by the author; only the replacement costs are real figures.

The cell counts all cable as exposed, which reads high where cable is buried.

### What would change the verdict

Real fires at solar plants, recorded with the fire class at the plant's pixel, the state of the site's vegetation and clearance, and what happened to each part, would test it.

In short: the wildfire and solar cell is a set of ten tables whose every class value the Damage team chose, kept in a sensible order by fire tests, equipment guidance and field reports, weighted into a plant number by published part values. No source in it gives an observed solar loss at a known flame class, so there are no dots, and the curve says nothing about a particular plant’s own clearance or fuel. In the source table, the Damage team’s tables and the tests, guidance and field reports that order them are group D, and the published part values are group F.

## All 38 listed sources (and 3 repository rules), sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’. The register ID is in brackets. Long titles are shortened; the register has them in full.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| — | **The numbers themselves: Damage team ordinate table, dossier section 5.2**<br>[github.com … ORDINATE\_TABLE\_wildfire\_solar\_\_model\_v1\_0\_\_docs\_r3.csv](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/current/ORDINATE_TABLE_wildfire_solar__model_v1_0__docs_r3.csv)<br>Where to look: dossier section 5.2. | Gives every number on curves 1 to 3 and, through the value weights, curve 4: the class values for all ten parts, chosen by the Damage team (T4). |
| 5 | **Wang, Y.; Xiao, C.; Bedon, C. Performance of photovoltaic panels with different inclinations under uniform thermal loading. International Journal of Thermal Sciences … (WANG\_2025\_PV\_THERMAL)**<br>[doi.org … j.ijthermalsci.2024.109489](https://doi.org/10.1016/j.ijthermalsci.2024.109489)<br>Where to look: the lab results: heat level (kW/m²), panel tilt, time to failure and temperature difference. | Gives no number. Small glass panel samples cracked or charred at roughly 8 to 15 kW/m² of heat in the lab, and tilt mattered. It supports the idea that wildfire heat can damage modules (curve 1), but small samples cannot be scaled up to a whole plant. |
| 6 | **Yang, H.-Y.; Zhou, X.-D.; Yang, L.-Z.; Zhang, T.-L. Experimental Studies on the Flammability and Fire Hazards of Photovoltaic Modules. Materials 8(7), 4210–4225 (2015). (YANG\_2015\_PV\_IGNITION)**<br>[doi.org … ma8074210](https://doi.org/10.3390/ma8074210)<br>Where to look: heat level (kW/m²) and the time until the module material keeps burning. | Gives no number. Small module samples catch fire at 26 kW/m² of heat, which shows fire can physically damage modules (curve 1). |
| 7 | **Zhang, H.; Yao, J.; Zhu, H.; Wang, X. Study on Combustion Characteristics of Cable Based on Cone Calorimeter. Energies 15(5), 1904 (2022). (ZHANG\_2022\_XLPE)**<br>[doi.org … en15051904](https://doi.org/10.3390/en15051904)<br>Where to look: heat level (kW/m²) and the time until the cable keeps burning. | Gives no number. Helped decide: cable sits at the top of curve 2, level with the monitoring kit. One 9 mm lab cable ignited at 16.24 kW/m², below the module figure; the paper is not about solar plants or wildfire. |
| 8 | **Zhao, J.; Zhang, S.; Li, X.; Kong, X.; Zhao, L.; Shen, J. Experimental Investigation of Thermal Response of Single-Glass Photovoltaic Modules with Different Inclination … (ZHAO\_2026\_PV\_POOL\_FIRE)**<br>[doi.org … fire9020062](https://doi.org/10.3390/fire9020062)<br>Where to look: a full-size module over a pool fire: tilt, whether the glass stayed whole, temperature over time. | Gives no number. Cracked glass and tilt changed how fast a full-size module burned through, so a module’s condition matters. The curves do not use this yet. |
| 9 | **U.S. Department of Energy, Federal Energy Management Program. Solar Photovoltaic Hardening for Resilience – Wildfire. (DOE\_FEMP\_PV\_WILDFIRE)**<br>[energy.gov … solar-photovoltaic-hardening-resilience-wildfire](https://www.energy.gov/cmei/femp/solar-photovoltaic-hardening-resilience-wildfire)<br>Where to look: the guidance on design, maintenance, access and inspection. | Gives no number. Helped decide: burned sections count as rebuilt, and heat-affected modules need infrared and electroluminescence checks (curve 1 and the site-control fields). |
| 13 | **Cohen, J.D. Preventing Disaster: Home Ignitability in the Wildland-Urban Interface. Journal of Forestry 98(3), 15–21 (2000). (COHEN\_USDA\_2000)**<br>[research.fs.usda.gov … 4688.pdf](https://research.fs.usda.gov/treesearch/download/4688.pdf)<br>Where to look: heat at a house wall against distance and duration. | Gives no number. Heat drops quickly with distance and depends on how long the fire burns (a model gave 70 kW/m² at 10 m, measurements 46 kW/m²). It is one reason the cell does not convert flame length into heat at the equipment. |
| — | **Governed provenance marker: no direct calibration source supports the withdrawn proposed parameter. (NO\_DIRECT\_SOURCE\_T4)**<br>[github.com … SOURCE\_REGISTER\_wildfire\_solar\_\_model\_v0\_1\_\_docs\_r1.csv](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/proposed/SOURCE_REGISTER_wildfire_solar__model_v0_1__docs_r1.csv) | Repository rule, not a source: the dashboard lists it separately, without a number. It marks a proposed value that was withdrawn because no source supports it. |
| — | **Governed provenance marker: the input was created as an illustrative synthetic fixture and has no empirical source. (NO\_SOURCE\_SYNTHETIC)**<br>[github.com … SOURCE\_REGISTER\_wildfire\_solar\_\_model\_v0\_1\_\_docs\_r1.csv](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/proposed/SOURCE_REGISTER_wildfire_solar__model_v0_1__docs_r1.csv) | Repository rule, not a source: the dashboard lists it separately, without a number. It marks a made-up test input that may only be used to check the code, never in the curves. |
| 21 | **Wildfire × solar bounded public-evidence review and reproducibility log; review date 2026-07-09. (SOURCE\_REVIEW\_2026\_07\_09)**<br>[github.com … BOUNDED\_EVIDENCE\_SEARCH\_LOG\_wildfire\_solar\_\_model\_v0\_1\_\_docs\_r1.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/proposed/BOUNDED_EVIDENCE_SEARCH_LOG_wildfire_solar__model_v0_1__docs_r1.md)<br>Where to look: the search log: what was searched, how, and what was found. | Gives no number. It records that a search on 9 July 2026 found no data linking solar plant damage and cost to wildfire exposure. |
| 22 | **IEA PVPS Task 13. Extreme Weather Impacts on PV Power Plants. Report IEA-PVPS T13-33:2025; DOI 10.69766/FFNG4976. (IEA\_PVPS\_T13\_33\_2025)**<br>[doi.org … FFNG4976](https://doi.org/10.69766/FFNG4976)<br>Where to look: the shares of insurance claims and costs by type of hazard. | Gives no number. It shows fire is a real source of insurance losses for solar plants, while published data on heat damage stays thin. |
| 23 | **Jang, J.-H.; Kim, J.-M.; Oh, S.-J.; Kang, H.-G. Analysis of degradation diagnosis methods of PV modules depending on wildfires. Transactions of the Korean Institute of … (KIEE\_JANG\_2026\_WILDFIRE\_PV)**<br>[kci.go.kr … ciSereArtiView.kci](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003300065)<br>Where to look: performance and imaging checks (infrared, electroluminescence) on a plant hit by wildfire. | Gives no number. A real wildfire-affected plant showed module damage that only imaging found, which supports DOE’s advice (#9) to check heat-affected modules. |
| 24 | **Yonhap News Agency report, reprinted by Financial News. Wildfire damage at a 1 MW photovoltaic facility in Uiseong, Republic of Korea, 24 March 2025. (YONHAP\_UISEONG\_PV\_2025)**<br>[fnnews.com … 202503241420097473](https://www.fnnews.com/news/202503241420097473)<br>Where to look: the news report: a 1 MW plant, about 5,500 modules, shut down, with a badly damaged electrical room. | Gives no number. It shows a wildfire can badly damage both modules and electrical equipment at a working plant. |
| 25 | **Maeil Business Newspaper. Solar facilities hit by wildfires and operating shutdowns, based on data submitted to a National Assembly member, 2025. (KOREA\_SOLAR\_WILDFIRE\_CASES\_2025)**<br>[pulse.mk.co.kr … 11403773](https://pulse.mk.co.kr/news/english/11403773)<br>Where to look: the reported damage cases and shutdowns. | Gives no number. It shows wildfire damage to solar plants in Korea is not a one-off. |
| 26 | **National Electrical Manufacturers Association. NEMA GD 2-2016: Evaluating Fire- and Heat-Damaged Electrical Equipment. (NEMA\_GD2\_2016)**<br>[nema.org … nema-gd-2-2016-evaluating-fire-and-heat-damaged-electrical-equipment-guide.pdf](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-2-2016-evaluating-fire-and-heat-damaged-electrical-equipment-guide.pdf)<br>Where to look: the guidance on which fire- or heat-damaged equipment to inspect, repair or replace. | Gives no number. Helped decide: electronics sit above transformers and switchgear on curve 2, since heat-damaged electronics should be replaced while some power equipment can be evaluated and repaired. It does not mention inverters by name. |
| 28 | **Frankman, D.; Webb, B.W.; Butler, B.W.; Jimenez, D.; Forthofer, J.M.; Sopko, P.; Shannon, K.S.; Hiers, J.K.; Ottmar, R.D. Measurements of convective and radiative … (FRANKMAN\_2012\_WILDLAND\_HEAT)**<br>[doi.org … WF11097](https://doi.org/10.1071/WF11097)<br>Where to look: measured heat from surface, shrub and crown fires. | Gives no number. Heat from wildland fires varies a lot with the kind of fire and fuel. It supports ranking the parts rather than converting flames into heat. |
| 29 | **Butler, B.W. Characterization of convective heating in full scale crown fires. USDA Forest Service Research Paper RMRS-RP-50WWW, 2010. (BUTLER\_2010\_CROWN\_HEAT)**<br>[research.fs.usda.gov … 39348](https://research.fs.usda.gov/treesearch/39348)<br>Where to look: gas temperature, speed and heat in full-scale crown fires. | Gives no number. Short heat peaks and longer steady heating are different, so a future heat model would need time as well as intensity. |
| 30 | **Mueller, E.V.; Skowronski, N.; Clark, K.; Gallagher, M.; Hadden, R.M.; Mell, W.; Simeoni, A. Local measurements of wildland fire dynamics in a field-scale experiment. … (MUELLER\_2018\_FIELD\_FIRE)**<br>[doi.org … j.combustflame.2018.05.028](https://doi.org/10.1016/j.combustflame.2018.05.028)<br>Where to look: local temperature and heating in a field-scale fire. | Gives no number. Ground fires and crown fires heat things in different ways; another reason the cell does not turn flame class into heat. |
| 31 | **Modarres, M.; et al. Experimental investigation of wildfire flame geometry and incident heat flux. Fire Safety Journal 146 (2024) 104205; DOI … (MODARRES\_2024\_WILDFIRE\_FLUX)**<br>[doi.org … j.firesaf.2024.104205](https://doi.org/10.1016/j.firesaf.2024.104205)<br>Where to look: heat against fuel, flame shape, slope and distance. | Gives no number. It lists what a heat model at the equipment would need (fuel, flame shape, slope, distance). The cell has none of these, so it uses the flame class directly. |
| 32 | **Bedon, C.; Wang, Y. Experimental and Numerical Analysis of Glass-Glass BIPV Facade Modules in Fire. Challenging Glass Conference Proceedings 10 (2026); DOI … (BEDON\_WANG\_2026\_BIPV\_FIRE)**<br>[doi.org … cgc.10.769](https://doi.org/10.47982/cgc.10.769)<br>Where to look: glass-glass façade modules exposed to 50 kW/m² for 10 minutes. | Gives no number. How the glass is built and how long the heat lasts change how modules respond. These are building-façade modules, not utility plants. |
| 38 | **Wildfire x solar deep bounded public-evidence review and reproducibility log; review date 2026-07-10. (SOURCE\_REVIEW\_2026\_07\_10)**<br>[github.com … BOUNDED\_EVIDENCE\_SEARCH\_LOG\_wildfire\_solar\_\_model\_v0\_1\_\_docs\_r2.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/proposed/BOUNDED_EVIDENCE_SEARCH_LOG_wildfire_solar__model_v0_1__docs_r2.md)<br>Where to look: the second, deeper search log. | Gives no number. It records that no source found covers the whole chain from regional fire data to a dollar loss at a solar plant. |
| **E · Decides what the bottom axis means** | | |
| 2 | **Dillon, G.K., et al. Spatial datasets of probabilistic wildfire risk components for the conterminous United States, 3rd edition. USDA Forest Service Research Data … (USFS\_FSIM\_RDS\_2023)**<br>[doi.org … RDS-2016-0034-3](https://doi.org/10.2737/RDS-2016-0034-3)<br>Where to look: the 270 m burn probability and the six flame-length classes. | Gives the bottom axis: the six flame-length classes, for the land around the plant. |
| 3 | **Finney, M.A., et al. A simulation of probabilistic wildfire risk components for the continental United States. Stochastic Environmental Research and Risk Assessment 25, … (FINNEY\_2011\_FSIM)**<br>[doi.org … s00477-011-0462-z](https://doi.org/10.1007/s00477-011-0462-z)<br>Where to look: how burn probability and the flame-length odds are simulated. | Gives no number. It explains how FSim simulates many fire seasons to produce the class odds the grid uses. |
| 4 | **Finney, M.A. FARSITE: Fire Area Simulator—Model Development and Evaluation. USDA Forest Service RMRS-RP-4, 1998. (USFS\_FARSITE\_1998)**<br>[fs.usda.gov … rmrs\_rp004.pdf](https://www.fs.usda.gov/rm/pubs/rmrs_rp004.pdf)<br>Where to look: the definition of fireline intensity. | Gives no number. It defines fireline intensity (kW/m) and shows it depends on fuel and spread rate; one reason it is not used as the axis. |
| **F · Turns the curve into dollars** | | |
| 18 | **Basore, P.; Dummit, K.; Thomas, A.; Taylor, M.; Benoliel, P.; Feldman, D.; Narayanaswami, M.; Ramasamy, V.; Woodhouse, M.; Zuboy, J.; Braid, J.; Jost, N.; Sproul, E. … (NREL\_NLR\_Q1\_2025\_PV\_BENCHMARK)**<br>[doi.org … 3009689](https://doi.org/10.7799/3009689)<br>Where to look: the cost rows, in 2024 dollars per kW. | Gives the value of each part per kW, which weights the ten part lines into lines 4a and 4b. |
| 20 | **damage\_modeling/docs/method/value\_basis/solar\_wind\_value\_breakdown.xlsx; Solar\_Map rows 2:17. (VALUE\_SOLAR\_WORKBOOK)**<br>[data.nrel.gov … 304](https://data.nrel.gov/submissions/304)<br>Where to look: sheet Solar\_Map, rows 2 to 17. | Gives the same part values in the repository’s workbook, which is the file the cell reads. |
| **H · Method and template** | | |
| 10 | **Maranghides, A., et al. A Case Study of a Community Affected by the Witch and Guejito Fires: Report #2—Evaluating the Effects of Hazard Mitigation Actions on Structure … (NIST\_TN\_1796)**<br>[doi.org … NIST.TN.1796](https://doi.org/10.6028/NIST.TN.1796)<br>Where to look: how fire and embers reached homes over time, and how the homes responded. | Gives no number. A case study of homes in two California fires. It supports keeping ‘how much heat reaches the equipment’ separate from ‘how the equipment responds’, which is how the cell is built. |
| 12 | **Maranghides, A., et al. WUI Structure/Parcel/Community Fire Hazard Mitigation Methodology. NIST TN 2205 (2022). (NIST\_TN\_2205)**<br>[doi.org … NIST.TN.2205](https://doi.org/10.6028/NIST.TN.2205)<br>Where to look: how fire exposure, fuels and hardening interact for a building, a parcel and a community. | Gives no number. A method for treating fire exposure, fuels and protective measures together; the cell keeps the same structure for future site adjustments. |
| — | **Damage Modeling repository governance contracts: seven-step failure-unit/value workflow, evidence gate, reportability contract, and fail-closed output policy. (GOVERNANCE\_CONTRACT)**<br>[github.com … SOURCE\_REGISTER\_wildfire\_solar\_\_model\_v0\_1\_\_docs\_r1.csv](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/proposed/SOURCE_REGISTER_wildfire_solar__model_v0_1__docs_r1.csv)<br>Where to look: the model boundary and release controls. | Repository rule, not a source: the dashboard lists it separately, without a number. It sets rules this cell follows, for example that support costs are added once and that missing parts are withheld, not zero. |
| 36 | **Perry, K.; Jordan, D.C.; Nguyen, Q. Assessing the Impacts of Extreme Weather Events on Photovoltaic Installations Using Remote Sensing Imagery. Progress in … (NREL\_PERRY\_2025\_REMOTE\_SENSING)**<br>[osti.gov … 2574727](https://www.osti.gov/biblio/2574727)<br>Where to look: before-and-after satellite images and labelled damage for hail and hurricane events. | Gives no number. A method for collecting real damage data from satellite images, suggested for building a future wildfire dataset. |
| 37 | **Read-only audit of the local Hazard\_modeling wildfire consumer implementation and documentation on 2026-07-10. (HAZARD\_WILDFIRE\_CONSUMER\_AUDIT\_2026\_07\_10)**<br>[github.com … BOUNDED\_EVIDENCE\_SEARCH\_LOG\_wildfire\_solar\_\_model\_v0\_1\_\_docs\_r2.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/proposed/BOUNDED_EVIDENCE_SEARCH_LOG_wildfire_solar__model_v0_1__docs_r2.md)<br>Where to look: Hazard’s wildfire code: flame-class midpoints, fireline intensity, and how damage was turned into dollars. | Gives no number. A check of how Hazard used the earlier wildfire curve, which showed the steps this cell had to replace. |
| **I · Background only, no number taken** | | |
| 11 | **Butler, K., et al. Wind-Driven Fire Spread to a Structure from Fences and Mulch. NIST TN 2228 (2022). (NIST\_TN\_2228)**<br>[doi.org … NIST.TN.2228](https://doi.org/10.6028/NIST.TN.2228)<br>Where to look: 187 tests of fences and mulch in wind of 6 to 14 m/s. | Gives no number. Burning fences and mulch can carry fire to a structure, so fences and debris around a plant matter. Recorded for future site adjustments; not in the curves. |
| 14 | **Energy Safe Victoria. General duties of solar farm owners and operators. (ENERGY\_SAFE\_VICTORIA\_SOLAR)**<br>[energysafe.vic.gov.au … general-duties-solar-farm-owners-and-operators](https://www.energysafe.vic.gov.au/industry-guidance/electrical/installations-and-infrastructure/general-duties-solar-farm-owners-and-operators)<br>Where to look: the rules on grass height, firebreak width, water and access. | Gives no number. Victoria’s rules for solar farms: grass no higher than 100 mm near equipment and a firebreak of at least 10 m. Recorded as site facts a future version could use; no credit is given today. |
| 15 | **NSW Rural Fire Service. OP 1.2.22 Photovoltaic Arrays, version accessed 2026-07-09. (NSW\_RFS\_OP\_1\_2\_22)**<br>[rfs.nsw.gov.au … OP-1.2.22-Photovoltaic-Arrays.pdf](https://www.rfs.nsw.gov.au/__data/assets/pdf_file/0004/247891/OP-1.2.22-Photovoltaic-Arrays.pdf)<br>Where to look: de-energising the plant, the 8 m exclusion zone and emergency planning. | Gives no number. Firefighters stay 8 m away from solar equipment unless it is confirmed switched off, so a plant may burn for longer. Recorded as context; not in the curves. |
| 16 | **Walker, H., et al. Best Practices for Operation and Maintenance of Photovoltaic and Energy Storage Systems; 3rd Edition. NREL/TP-7A40-73822 (2018). (NREL\_PV\_OM\_2018)**<br>[nrel.gov … 73822.pdf](https://www.nrel.gov/docs/fy19osti/73822.pdf)<br>Where to look: how equipment and wiring are installed and maintained. | Gives no number. It describes which wiring runs in the open and which is buried or in conduit, which supports exposed cable being the most fire-sensitive part (curve 2a). |
| 17 | **Syphard, A.D.; Brennan, T.J.; Keeley, J.E. The role of defensible space for residential structure protection during wildfires. International Journal of Wildland Fire … (SYPHARD\_2014)**<br>[doi.org … WF13158](https://doi.org/10.1071/WF13158)<br>Where to look: house survival against cleared distance, vegetation and slope. | Gives no number. For houses, cleared space helps, but there is no single safe distance. It supports not giving a fixed credit for clearance. |
| 19 | **Department of Transport and Planning Victoria. Solar Energy Facilities Design and Development Guideline, October 2022. (PLANNING\_VICTORIA\_SOLAR\_GUIDE)**<br>[planning.vic.gov.au … Solar-Energy-Facilities-Design-and-Development-Guideline.pdf](https://www.planning.vic.gov.au/__data/assets/pdf_file/0037/659917/Solar-Energy-Facilities-Design-and-Development-Guideline.pdf)<br>Where to look: site planning, vegetation, access, firebreaks and water. | Gives no number. A checklist of site fire controls, used to list the site facts a future version could take in. |
| 27 | **FM. Property Loss Prevention Data Sheet 7-106: Ground-Mounted Solar Power, April 2026. (FM\_DS\_7\_106\_2026)**<br>[fm.com … fmds07106.pdf](https://www.fm.com/-/media/project/publicwebsites/fmglobal/documentum-new/data-sheet-individual/07-hazards/fmds07106.pdf)<br>Where to look: the recommendations on separation from wildland, access, vegetation and construction. | Gives no number. It recommends buffers, fences and vegetation control; this version gives no credit for them (curves 3a to 3d). |
| 33 | **ASTM International. ASTM E108-25: Standard Test Methods for Fire Tests of Roof Coverings. (ASTM\_E108\_2025)**<br>[store.astm.org … e108.html](https://store.astm.org/e108.html)<br>Where to look: the fire tests for roof coverings. | Gives no number. A module’s fire rating only describes this roof test, not how it survives a wildfire, so the rating is not used as a damage credit. |
| 34 | **International Electrotechnical Commission. IEC 61730-2:2023, Photovoltaic module safety qualification - Part 2: Requirements for testing. (IEC\_61730\_2\_2023)**<br>[webstore.iec.ch … 63895](https://webstore.iec.ch/en/publication/63895)<br>Where to look: the module safety test requirements. | Gives no number. Passing the module safety approval does not show a module survives wildfire; listed so the approval is not mistaken for that. |
| 35 | **IEA PVPS Task 15. Mapping of Fire Safety Laboratories and Tests for BIPV, Report T15-15:2023. (IEA\_PVPS\_T15\_15\_2023)**<br>[iea-pvps.org … Report\_IEA-PVPS\_T15-15-2023\_Mapping-of-Fire-Safety-Laboratories.pdf](https://iea-pvps.org/wp-content/uploads/2023/07/Report_IEA-PVPS_T15-15-2023_Mapping-of-Fire-Safety-Laboratories.pdf)<br>Where to look: the map of fire tests and where they are required. | Gives no number. It shows module fire tests differ by country and are only loosely linked to safety approval. |
| **J · Not used by this curve: listed to show what was looked at, and why it was left out** | | |
| 1 | **InfraSure Damage Curve Library. WILDFIRE × SOLAR: Deep Research for Damage Curve Derivation. Version 1.0, March 2026. Commit 12653b2c3d5a013c9524228243ea666c35bb3814; … (LEGACY\_DIVI\_WILDFIRE\_SOLAR\_2026)**<br>[github.com … WILDFIRE\_x\_SOLAR.md](https://github.com/Divi-patel/infrasure-damage-curves/blob/12653b2c3d5a013c9524228243ea666c35bb3814/research/WILDFIRE_x_SOLAR.md)<br>Where to look: mixed; it proposed fireline intensity (kW/m) as the axis. | Not used: an earlier research memo. Kept for its leads and scope; none of its numbers were used. |

**Gaps worth knowing, found while building this page.** (1) The current version 1.0 folder has no source register of its own: the artifact points to the version 0.1 register and its addendum (41 sources), and the dashboard numbers sources in that order. (2) The workbook has no Evidence\_Log or Evidence\_Params sheets; its Sources sheet lists ten key sources and the tier table carries the rest. (3) The register’s first source is the legacy research memo, rejected for calibration; it is listed under “not used”.
