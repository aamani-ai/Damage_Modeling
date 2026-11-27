Damage-curve review · hurricane wind × battery storage

# Hurricane × battery curve, where its numbers come from

A hurricane curve for a battery storage plant answers one question: **when a storm’s wind loads the plant to some multiple of a reference pressure, what share of the value of each battery container, and of each power conversion unit, is lost?**

Unlike hail and solar there is nothing measured here, and unlike most cells nothing was built for this asset either: the shape of every curve is copied from the hurricane and solar cell’s inverter curve, and only the costs of the damage states are new. The dashboard calls all three curves “our judgment” (tier T4).

It does not say “borrowed”, because on the dashboard that word means a tier T3 number inferred or extrapolated from evidence; here the copying is literal, from another asset, and the numbers copied were judgment to begin with.

## Curves 1a and 1b: battery container, approved policy (replace the cabinet after major damage)

Curves 1a and 1b · battery container: half lost at 1.20 times the reference pressure · our judgment (T4), copied shape from the solar inverter curve

- **Curve 1a:** Battery container · before: the solar inverter and collection curve it is taken from (reference)
- **Curve 1b:** Battery container · approved policy, central (the cell’s curve)

**What each source says, and what that means for the line**

- **[#2 · hurricane and solar cell, inverter record](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_solar/current/)** (numbers on the curve come from it)
  - damage states centred at 0.9, 1.25, 1.65 × reference pressure, spread 0.35; copied unchanged
- **[#12 · NREL PV and storage cost model 2024](https://data.nlr.gov/system/files/307/1764611886-PVSCM%202024.zip)** (numbers on the curve come from it)
  - limited damage costs 20 of 141.3 dollars of a cabinet, 14.2 %; our mapping of that row to the state
- **Owner ruling BW-Q01, 19 October** (the Damage team’s own choice)
  - after major damage, replace the whole 1.05 million dollar cabinet (100 %), as a conservative choice

**On the Damage dashboard:** [1a · the solar inverter and collection curve it starts from](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_solar/curves/TCWS21_POWER_COLLECTION_SCREENING_T4_ORDERED_STATES) · [1b · battery container, approved policy](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_bess/curves/BESS_ENCLOSURE_TC_REPLACE_MAJOR_V0_1)

The battery container curve is the solar plant’s inverter and collection curve with the cost of each damage state changed. Nothing on it was measured. The three damage states and where they sit on the axis, centred at 0.9, 1.25, 1.65 times the reference pressure with a spread of 0.35, are copied unchanged from the hurricane and solar cell (source [#2](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_solar/current/)), where they are themselves the Damage team’s choice.

Curve 1a is that solar curve; curve 1b is the container. The costs are new and also our judgment: limited damage is priced at 20 of the 141.3 dollars of a cabinet’s cost rows in NREL’s cost model, 14.2 % (source [#12](https://data.nlr.gov/system/files/307/1764611886-PVSCM%202024.zip)), and major or destructive damage at the whole cabinet, because the owner ruled on 19 October to replace a compromised cabinet rather than assume it can be repaired (ruling BW-Q01).

Tesla’s emergency guide (source [#11](https://digitalassets.tesla.com/tesla-contents/image/upload/Lithium-Ion_Battery_Emergency_Response_Guide_en.pdf)) says a mechanically damaged unit must be evaluated; it does not say it must be replaced. The halfway point means that a storm loading the yard to 1.20 times the reference pressure would, on this curve, cost about half the value of the containers. What that is in wind speed depends on the reference pressure, which the cell leaves to Hazard (decision BW-P08); the tested Hazard case uses a regional reference.

The curve is used for all 84 million dollars of battery cabinets in the reference plant. The review (v5, section A.11) cannot say whether it is too high or too low: a sealed steel box bolted to a pad is more likely to lose its cooling unit to debris or take in driven rain than to fail structurally, and the cell lists debris and rain ingress as missing.

## Curve 2: battery container, repair sensitivity (repair after major damage)

Curve 2 · battery container, repair sensitivity: half lost at 1.52 times the reference pressure · our judgment (T4)

- **Curve 2:** Battery container · repair sensitivity, central
- **Curve 1 (for comparison):** Battery container · approved policy, as above

**What each source says, and what that means for the line**

- **[#2 · hurricane and solar cell, inverter record](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_solar/current/)** (numbers on the curve come from it)
  - the same three states and spread as curve 1
- **[#12 · NREL PV and storage cost model 2024](https://data.nlr.gov/system/files/307/1764611886-PVSCM%202024.zip)** (numbers on the curve come from it)
  - major damage repaired: enclosure, racks, safety and cooling groups, 27.5 of 141.3, 19.5 %
- **Owner ruling BW-Q01** (the Damage team’s own choice)
  - kept as a sensitivity only; not what Hazard runs

**On the Damage dashboard:** [2 · battery container, repair sensitivity](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_bess/curves/BESS_ENCLOSURE_TC_REPAIR_SENSITIVITY_V0_1)

The second container record keeps everything from curve 1 except one cost: after major damage, the cabinet is repaired instead of replaced. The repair is priced at the enclosure, rack, safety and cooling rows of NREL’s cost model, 27.5 of 141.3 dollars, or 19.5 % (source [#12](https://data.nlr.gov/system/files/307/1764611886-PVSCM%202024.zip)), assuming the batteries and their management system can be reused, which the cell says has not been shown.

That single change pulls the curve well down until the destructive state takes over: the halfway point moves from 1.20 to 1.52 times the reference pressure. Both costs are our judgment; the owner chose full replacement and kept repair as a sensitivity (ruling BW-Q01). The gap between curves 1b and 2 is the size of the question the review raises: whether a wind-damaged container is usually a repair or a write-off.

The curve is not used by Hazard; it exists so that the difference can be shown.

## Curve 3: separate power conversion units (inverters), solar curve unchanged

Curve 3 · power conversion: half lost at 1.44 times the reference pressure · our judgment (T4), solar inverter curve used as is

**What each source says, and what that means for the line**

- **[#2 · hurricane and solar cell, inverter record](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_solar/current/)** (numbers on the curve come from it)
  - states at 0.9, 1.25, 1.65, spread 0.35; costs 10 %, 40 %, 100 %; all copied unchanged
- **[#3 · SMA medium-voltage power station manual](https://files.sma.de/downloads/MVPS-S2-SCS-US-B8-SH-en-11.pdf)** (numbers on the curve come from it)
  - a storm package and anchorage are separate options, so the match must be checked; no number
- **Damage team, decision BW-P07** (the Damage team’s own choice)
  - use the solar curve for the 20 separate inverter units, as a related-equipment proxy (our judgment)

**On the Damage dashboard:** [3 · separate inverter units](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_bess/curves/BESS_SEPARATE_PCS_TC_PROXY_V0_1)

The battery plant’s 20 separate power conversion units, worth 10.4 million dollars, use the solar plant’s inverter and collection curve exactly as it is, states and costs alike (source [#2](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_solar/current/), decision BW-P07). Nothing was measured, and the solar numbers are themselves the Damage team’s choice, so this is our judgment twice over.

The SMA manual (source [#3](https://files.sma.de/downloads/MVPS-S2-SCS-US-B8-SH-en-11.pdf)) is why the cell flags the match as unproven: the storm package and anchorage of these units are separate options, so whether a given unit resembles the solar equipment depends on how it was bought and installed. The halfway point is the same as the solar inverter curve’s: about half the value of the units is lost at 1.44 times the reference pressure.

The curve is used for the power conversion units only; the medium-voltage gear, civil works and fieldwork, 15.4 million dollars, have no wind curve and are withheld, not zero.

In short: every number on these three curves is a choice. The states and their spread come unchanged from the hurricane and solar cell, where the Damage team chose them for panels and inverters; the costs come from a related cost model and an owner ruling to replace any badly damaged cabinet. No source gives a battery container’s loss at a known wind, and the review cannot tell whether the result is too high or too low. In the source table, the number of sources in each group is: A (the curve itself) 1, D (shape and choices) 6, E (bottom axis) 1, F (dollars) 2, I (background) 2, J (not used) 2.

## All 13 listed sources, sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’. The register ID is in brackets.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **A · Gives the curve itself: a published curve or table used as printed, or a curve copied from another cell** | | |
| 2 | **Solar TC-wind model v2.1 docs r2 (BW-S02)**<br>[github.com … current](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_solar/current/)<br>Where to look: curve\_artifact site-facility records and derivation dossier sections Curve architecture and Honest limitations | Gives the curve: the states, their centres and the spread of all three curves, and the costs of curve 3. Identical to the solar inverter and collection record at all three scenarios. |
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| — | **The numbers we chose: owner ruling BW-Q01 and decisions BW-P02 to BW-P07**<br>[parameter register](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_bess/current/parameter_register.csv)<br>Where to look: All nine parameters are tier T4 except the unbound value row (T3). | Gives the numbers: full replacement after major damage; the transfer of the solar states; the cost mapping. Labelled our judgment on every curve. |
| 11 | **Tesla Industrial Lithium-Ion Battery Emergency Response Guide revision2.8 2026-04-10 (BW-S11)**<br>[digitalassets.tesla.com … Lithium-Ion\_Battery\_Emergency\_Response\_Guide\_en.pdf](https://digitalassets.tesla.com/tesla-contents/image/upload/Lithium-Ion_Battery_Emergency_Response_Guide_en.pdf)<br>Where to look: Printedp13 section3.4 and p20 section8; PDFpp15 and22 rendered/inspected; p22 section10 text read | Gives no number. Mechanically damaged units must be evaluated and can create internal hazards: the reason for the conservative replacement policy. It does not require replacement. |
| 3 | **SMA MVPS-S2-SCS-US-B8-SH-en-11 system manual (BW-S03)**<br>[files.sma.de … MVPS-S2-SCS-US-B8-SH-en-11.pdf](https://files.sma.de/downloads/MVPS-S2-SCS-US-B8-SH-en-11.pdf)<br>Where to look: Section6.7 printed/PDF pp74-75; section17.14 p282; p75 rendered and inspected | Gives no number. Storm package and anchorage are separate options, so target matching comes before any transfer. |
| 5 | **Burns Engineering BESS Accel-Cheshire foundation drawing issued for permits 2025-08-29 (BW-S05)**<br>[portal.ct.gov … pe1587\_ack-conditions\_staffchange\_110325\_a.pdf](https://portal.ct.gov/-/media/csc/3_petitions-medialibrary/petitions_medialibrary/mediapetitionnos1501-1600/pe1587/proceduralcorrespondence/pe1587_ack-conditions_staffchange_110325_a.pdf)<br>Where to look: PDFp20 drawing S-102 sheet16 of19 details3-4; rendered and inspected | Gives no number. One real project’s anchor-to-pad load path; shows anchorage is designed per site. |
| 4 | **Sungrow ST2752UX system manual SEN-Ver21-202204 (BW-S04)**<br>[info-support.sungrowpower.com … E049-ST2752UX-SEN-Ver21-202204-IEC.pdf](https://info-support.sungrowpower.com/application/pdf/2022/11/10/E049-ST2752UX-SEN-Ver21-202204-IEC.pdf)<br>Where to look: Section4.2.1 printed p24 PDFp34; section4.2.2 printed p25 PDFp35 | Gives no number. Trees and debris can block cooling inlets: a separate pathway the cell names but does not model. |
| 10 | **Tesla Marshall Medical Center public permit drawing set 2022 (BW-S10)**<br>[evogov.s3.us-west-2.amazonaws.com … 629.pdf](https://evogov.s3.us-west-2.amazonaws.com/meetings/17/staff_reports/629.pdf)<br>Where to look: PDFpp14 and29; S-101 PDFp29 rendered and inspected; structural criteria | Gives no number. A real permit with a 105 mph design wind: why the cell asks for an explicit reference rather than a product label. |
| **E · Decides what the bottom axis means** | | |
| 13 | **Existing Hazard Substation Hurricane demand-reference binding (BW-S13)**<br>[github.com … binding.json](https://github.com/aamani-ai/Hazard_modeling/tree/main/perils/hurricane/src/hurricane/resources/substation_screening/binding.json)<br>Where to look: demand block; parent-cell ASCE MRI300 screening reference | Sets the bottom axis: the squared gust-ratio pattern reused for the axis; the reference itself is not chosen (decision BW-P08). |
| **F · Turns the curve into dollars** | | |
| 1 | **Hazard BESS r1 selected profile and budget (BW-S01)**<br>[github.com … bess\_conus](https://github.com/aamani-ai/Hazard_modeling/tree/main/docs/plans/_cross_cutting/bess_conus/)<br>Where to look: asset\_model.json; layout.csv; reference\_budget.csv; 01\_reference\_profile\_and\_value.md | Turns the curve into dollars: the reference plant: 84 million dollars of cabinets, 10.4 million of power conversion, 15.4 million with no wind response, inside 109.8 million. |
| 12 | **PVSCM2024 original inputs and prior same-budget allocation (BW-S12)**<br>[data.nlr.gov … 1764611886-PVSCM 2024.zip](https://data.nlr.gov/system/files/307/1764611886-PVSCM%202024.zip)<br>Where to look: UPV2024Q1.txt ESS.Li-IonCells BatteryPacks and Enclosure; prior evidence/r3/value\_allocations.csv | Turns the curve into dollars: the cost rows that set the 14.2 % limited-damage cost and the 19.5 % repair cost of curves 1 and 2. |
| **I · Background only, no number taken** | | |
| 6 | **SYL manufacturer specification submitted in CEC Enterprise air-quality filing TN268070 (BW-S06)**<br>[efiling.energy.ca.gov … GetDocument.aspx](https://efiling.energy.ca.gov/GetDocument.aspx?DocumentContentId=105086&tn=268070)<br>Where to look: PDFp193 supplier sheet printed28; wind-load row and battery/system parameters; rendered and inspected | Gives no number. Background: an adjacent product sheet lists 66 m/s wind load; its averaging and height are not stated, so it is not used as a threshold. |
| 7 | **AES Dominicana operational press release 2017-10-17 on Fluence website (BW-S07)**<br>[blog.fluenceenergy.com … dominican-republics-first-energy-storage-arrays-help-grid-operator-prevent-blackouts](https://blog.fluenceenergy.com/dominican-republics-first-energy-storage-arrays-help-grid-operator-prevent-blackouts)<br>Where to look: Body describing two10MW arrays at Andres and Los Mina during Irma/Maria | Gives no number. Background: two Dominican Republic battery arrays kept running through Irma and Maria; survival context, no wind or cost. |
| **J · Not used by this curve: listed to show what was looked at, and why it was left out** | | |
| 8 | **Tesla Powerwall2 anchoring installation guidance (BW-S08)**<br>[energylibrary.tesla.com … GUID-EF498B4A-9E0A-4A04-9BE1-512C14DB415E.html](https://energylibrary.tesla.com/docs/Public/EnergyStorage/Powerwall/2/InstallManual/BackupGateway/2/en-us/GUID-EF498B4A-9E0A-4A04-9BE1-512C14DB415E.html)<br>Where to look: AppendixA1 Table1 and exceptions below it | Not used: residential Powerwall anchoring; rejected for a utility container. |
| 9 | **Moradi-Sepahvand et al2023 hurricane resilient co-planning preprint (BW-S09)**<br>[arxiv.org … 2310.05814](https://arxiv.org/abs/2310.05814)<br>Where to look: Abstract only; full paper not reviewed in this pass | Not used: planning preprint; abstract only, rejected as a source of a curve. |

**Gaps worth knowing, found while building this page.** (1) The cell has no derivation dossier or workbook of its own; derivation.md points to the proposal folder, and the parameter and claim registers stand in. (2) The bottom axis has no reference pressure: the cell leaves it to Hazard (decision BW-P08), so where these curves sit in wind speed is undefined until Hazard declares one. (3) 15.4 million of the 109.8 million dollar plant has no wind curve and is withheld. (4) The review (v5, A.11) notes that the cell lists windborne debris and wind-driven rain as missing mechanisms, which are the likely ways a container is damaged, while it models a structural failure copied from solar equipment.
