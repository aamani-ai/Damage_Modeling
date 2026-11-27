Damage-curve review · flood × substation

# Flood × substation curve, where its numbers come from

A flood curve for a substation answers one question: **when water stands at a given depth on the station's ground, what share of the cost of rebuilding the whole station is lost?** Unlike hail and solar, there are no laboratory or field counts to draw a line through. Unlike flood and solar, there are no tables for individual components.

There is one whole-station table from FEMA's 2.1 flood manual, eleven numbers from 0 % to 15 %, and the cell uses it exactly as printed, with straight lines between the rows. The substation is treated as one block, with the control room, relays, batteries, cables, breakers and transformers all together, and no separate curve for any part. Two things are easy to miss.

The curve never gets anywhere near half, and above 10 ft of water it returns no number at all.

## Curve 1 · whole substation, river and rain flooding (FEMA Hazus-MH 2.1, Table 7.9)

Curve 1 · whole station: never reaches half · 15 % at 10 ft, then withheld · borrowed (T3)

**What each source says, and what that means for the line**

- **[#1 · FEMA Hazus-MH 2.1 flood manual, Table 7.9](https://www.fema.gov/sites/default/files/2020-09/fema_hazus_flood-model_technical-manual_2.1.pdf)** (numbers on the curve come from it)
  - 0 % at 0 ft, 2 % at 1 ft, 7 % at 4 ft, 15 % at 10 ft; same for all classes
- **[#2 · FEMA Hazus 7.0 flood manual](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-fltm_06272025_0.pdf)** (numbers on the curve come from it)
  - substations now ‘mapping only’; these functions disabled
- **[#3 · Substation binding (SUB-A01)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/contracts/hazard_handoff/substation_flood_screening_v1/binding.json)** (numbers on the curve come from it)
  - one 345/138 kV station, class ESSM, worth $27.35 M

**On the Damage dashboard:** [1 · whole substation](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_substation/curves/FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL)

This is the one flood curve that FEMA ever printed for an electric substation as a whole: Table 7.9 of the 2.1 flood manual, which gives the same percentages for small, medium and large stations. Nothing in it was measured. The eleven points are FEMA's printed rows.

The table publishes no claims, tests or spread behind them, and its own comments describe it as control-room damage from 0 ft plus additional damage to cables, transformers and switchgear, as recorded in section 2 of the flood and wind dossier. The cell changed none of the numbers.

What was chosen is the station they are applied to, which is one design reference: a 345/138 kV open-air yard of 150 by 178 metres with two 336 MVA transformers, classed as ESSM, a decision recorded in the binding (source [#3](https://github.com/aamani-ai/damage_modeling/blob/main/docs/contracts/hazard_handoff/substation_flood_screening_v1/binding.json)). The cell also chose to stop at 10 ft rather than extend the table.

The dashboard says "borrowed" (T3) rather than "published" because the table is public but FEMA has since switched it off: Hazus 7.0 lists substations as mapping-only and says that the electric-power damage functions produce no results (source [#2](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-fltm_06272025_0.pdf), Table 9-1 and footnote 21 of section 9.4.1, as recorded in the flood and wind register). The table is kept as a legacy screening proxy.

It is also borrowed in the plain sense, because this cell reuses the wind-farm cell's record, and its unit ID still starts with FW. There is no halfway point. The curve stops at 15 % at 10 ft, which for the reference station is 15 % of 27.35 million dollars, or about 4.1 million dollars. The curve is used for every substation placement in river and rain flooding.

Above 10 ft the cell returns no number, and the review (v5, A.13, item M11) found that Hazard's yearly-loss code then counts that as zero, so a deep site can rank below a shallow one.

## Curve 2 · the same curve reused for coastal flooding (a judgment transfer)

Curve 2 · coastal use: same numbers as curve 1 · our judgment (T4) · salt, waves, scour not counted

- **Curve 2:** Substation · the same table used for coastal flooding
- **Curve 1 (for comparison):** Substation · river and rain table, as above

**What each source says, and what that means for the line**

- **[#4 · Owner scope and coastal transfer (SUB-A02)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_substation/current/derivation.md)** (numbers on the curve come from it)
  - use the same depth curve for coast; no salt or wave factor
- **[#1 · FEMA Hazus-MH 2.1, Table 7.9](https://www.fema.gov/sites/default/files/2020-09/fema_hazus_flood-model_technical-manual_2.1.pdf)** (numbers on the curve come from it)
  - built for fresh water; says nothing about salt water or waves
- **[#3 · Substation binding (SUB-A01)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/contracts/hazard_handoff/substation_flood_screening_v1/binding.json)** (numbers on the curve come from it)
  - same station, same $27.35 M; coastal annual sum capped once

**On the Damage dashboard:** [2 · the same curve, used for coastal flooding](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_substation/curves/FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL)

For coastal flooding the cell applies the river and rain curve again. Nothing new is measured and no number moves. What was chosen is the decision itself, made by the cell's owner for the first national screening grid and recorded in derivation.md under "Coastal transfer (SUB-A02, Tier 4)". The derivation is explicit that this is a depth-only screening index and not a coastal loss.

Salt-water corrosion, wave loading, scour and debris are left out, and the number must not be called a complete surge loss or a lower bound. The review (v5, A.13) gives a reason to expect it to read low on the coast: Con Edison's East 13th Street station had breakers fail under salt surge during Sandy. The review also found that Hazard's screening code hard-codes fresh water for every cell. There is no halfway point, as for curve 1.

The curve is used for every coastal substation placement on the grid. The wind-farm cell, which owns the same curve, refuses salt water instead.

In short: flood and substation is one FEMA table used exactly as printed. Its eleven numbers rise to 15 % at 10 ft, and FEMA itself no longer runs them. The table is applied to one reference-design 345/138 kV station, not a real one, worth 27.35 million dollars. Nothing in the cell is measured, the coastal use is a stated judgment, and the two things that most change the answer, what happens above 10 ft and what salt water does, are left as unknowns. In the source table, the number of sources in each group is: A (the curve itself) 1, D (shape and choices) 2, E (bottom axis) 1, F (dollars) 1, H (method) 2, J (not used) 1.

## All 4 listed sources, sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’. The register ID is in brackets. No source here gives a measured point that the curve was built from, and none is a pass or fail test turned into a point, so there are no groups for those. The utility flood stories that the review cites, Sandy and Helene, give no share of value lost and are not in the cell.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **A · Gives the curve itself: a published curve or table used as printed, or a curve copied from another cell** | | |
| 1 | **FEMA Hazus-MH 2.1 Flood Model Technical Manual, Table 7.9 (FW-S011)**<br>[fema.gov … fema\_hazus\_flood-model\_technical-manual\_2.1.pdf](https://www.fema.gov/sites/default/files/2020-09/fema_hazus_flood-model_technical-manual_2.1.pdf)<br>Table 7.9 ‘Electric Power Classifications, Functionality Thresholds and Damage Functions’, pp. 7-20 to 7-21, footnote 2 (switchgear 3 ft above grade). Copied in [curve\_audit.csv](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_substation/current/curve_audit.csv). | Gives the curve: all eleven squares, 0–10 ft. ESSL, ESSM and ESSH print the same values. |
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| 2 | **FEMA Hazus 7.0 Flood Technical Manual (FW-S012, via the flood × wind register)**<br>[fema.gov … fema\_rsl\_hazus-7-fltm\_06272025\_0.pdf](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-fltm_06272025_0.pdf)<br>Where to look: Table 9-1 pp. 9-1 to 9-2 (substations ‘Mapping Only’); §9.4.1 footnote 21 p. 9-3 (electric-power functions not enabled). | Gives no number. Why the table is graded T3 and labelled a legacy proxy, and why no current FEMA result can be quoted for it. |
| 4 | **Owner-selected screening scope and coastal equal-depth transfer (SUB-A02)**<br>[flood\_substation/current/derivation.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_substation/current/derivation.md)<br>Where to look: Sections ‘Coastal transfer (SUB-A02, Tier4)’ and ‘Rare depth and caps’. | Gives no number. The coastal reuse (curve 2), no extension above 10 ft, and the once-only value cap for coastal annual sums. A decision, tier T4. |
| **E · Decides what the bottom axis means** | | |
| 1 | **FEMA Hazus-MH 2.1, Table 7.9 (again)**<br>Where to look: Same table: depth above the substation’s grade, in feet, with switchgear assumed 3 ft up and the control room damaged from 0 ft. | Sets the bottom axis: the axis is water above the station’s ground level at one point, with no equipment-height correction, area factor or flood-wall credit (derivation.md, audit step 6). |
| **F · Turns the curve into dollars** | | |
| 3 | **Substation flood consumer binding: canonical station and value (SUB-A01)**<br>[docs/contracts/hazard\_handoff/substation\_flood\_screening\_v1/binding.json](https://github.com/aamani-ai/damage_modeling/blob/main/docs/contracts/hazard_handoff/substation_flood_screening_v1/binding.json)<br>Value rows in [value\_crosswalk.csv](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_substation/current/value_crosswalk.csv) (31 rows, MISO MTEP24 published cost tables, unescalated, via Hazard’s [valuation source receipt](https://github.com/aamani-ai/Hazard_modeling/blob/509bf435e1990a5d04d59c0c34621cc2d9a82fdb/docs/plans/_cross_cutting/substation_conus/valuation_source_receipt.json)). | Turns the curve into dollars: the denominator: $27,353,236.37 for the fenced station (breakers, transformers, relays, control house, cable, site work …); $3,061,823.44 more (access road, project management, engineering) sits outside the curve. Also fixes the station, its class (ESSM) and an exposure fraction of 1.0. |
| **H · Method and template** | | |
| — | **flood × wind derivation dossier (the full argument this cell inherits)**<br>[flood\_wind\_curve\_derivation\_dossier\_\_model\_v1\_0\_\_docs\_r1.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_wind/current/flood_wind_curve_derivation_dossier__model_v1_0__docs_r1.md)<br>Where to look: §2 evidence reopening, §6 exact derivation, §11 tier. | Gives no number. Method: source proof for Table 7.9 and the reason for T3. Not in this cell’s own register. |
| — | **Cell package standard, documented deviation**<br>[flood\_substation/current/README.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_substation/current/README.md) — ‘Audit workbook map and documented deviation’. | Gives no number. Method: why this cell has CSV audit files instead of a workbook and dossier of its own. |
| **J · Not used by this curve: listed to show what was looked at, and why it was left out** | | |
| — | **The flood × wind cell’s other 17 sources and 14 withheld units**<br>[github.com … SOURCE\_REGISTER\_flood\_wind\_\_model\_v1\_0\_\_docs\_r1.csv](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_wind/current/SOURCE_REGISTER_flood_wind__model_v1_0__docs_r1.csv) | Not used: NEMA, NERC, FEMA P-348, NREL and the flood × solar component candidates support the wind cell’s component research, which this cell explicitly defers (README: ‘Detailed component research remains a separate future task’). |

**Gaps between the documents, found while building this page.** (1) The cell has no derivation dossier or workbook of its own: derivation.md and a CSV audit set stand in (a documented deviation), and the source proof for Table 7.9 lives in the flood × wind dossier. (2) The three rows of the tier table inside the artifact carry no source IDs. (3) The same curve has opposite salt-water rules in the two cells that use it: flood × wind withholds anything but clean fresh water; flood × substation applies it to coastal water as a T4 transfer. Both are recorded decisions. (4) Table 7.9 was checked by the Damage team against the PDF for review v5 (pp. 7-20 to 7-21, footnote 2); the eleven values also match the flood × wind workbook’s transcription sheet.
