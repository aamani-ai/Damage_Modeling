Damage-curve review · flood × wind farm

# Flood × wind farm curve, where its numbers come from

A flood curve for a wind farm should answer one question: **when water stands at a given depth, what share of the farm's rebuild cost is lost?** This cell answers a narrower question, which is what share of the substation's rebuild cost is lost, and it says "withheld" for everything else. Unlike hail and solar there are no measured dots. Unlike flood and solar, the team did not write its own tables.

The one curve is FEMA's whole-substation table from the 2.1 flood manual, eleven numbers from 0 % to 15 %, used exactly as printed. It is the same curve that the substation cell uses, but with a stricter rule on the type of water, and it needs the substation's own value before it can produce a dollar figure.

## Curve 1 · the wind farm’s substation, fresh water only (FEMA Hazus-MH 2.1, Table 7.9)

Curve 1 · substation: never reaches half · 15 % at 10 ft, then withheld · borrowed (T3)

**What each source says, and what that means for the line**

- **[#11 · FEMA Hazus-MH 2.1 flood manual, Table 7.9](https://www.fema.gov/sites/default/files/2020-09/fema_hazus_flood-model_technical-manual_2.1.pdf)** (numbers on the curve come from it)
  - 0 % at 0 ft, 7 % at 4 ft, 15 % at 10 ft; whole station
- **[#12 · FEMA Hazus 7.0 flood manual](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-fltm_06272025_0.pdf)** (numbers on the curve come from it)
  - substations ‘mapping only’; these functions disabled
- **[#6 · Army Corps HEC-FIA reference](https://www.hec.usace.army.mil/confluence/fiadocs/fiatechref/latest/direct-damage/depth-percent-damage-relationships-direct-damage)** (numbers on the curve come from it)
  - depth-percent tables: straight lines between the rows
- **Damage team · freshwater-only gate (T4)** (numbers on the curve come from it)
  - salt, brackish, dirty or unknown water: withheld

**On the Damage dashboard:** [1 · the wind farm’s substation](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_wind/curves/FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL)

The cell lists fifteen parts of a wind farm, and only one of them has a flood curve: the substation, where the farm's collection cables meet the grid. That curve is FEMA's whole-substation table, the same eleven numbers that the substation cell uses. Nothing in it was measured. The points are FEMA's printed rows, taken from section 6 of the dossier and the workbook sheet called Hazus\_Source. No number was changed.

The team made three choices around the table: to treat the whole station as one block (dossier section 3), to stop at 10 ft, and to accept only clean fresh water. Salt, brackish, contaminated or unknown water returns "withheld" (tier T4, dossier sections 4 and 8).

The dashboard says "borrowed" (T3) rather than "published" because the table is public but no longer current: FEMA's Hazus 7.0 lists substations as mapping-only and disables these functions (source [#12](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-fltm_06272025_0.pdf)), so the dossier grades it a T3 screening proxy in section 11. There is no halfway point. A fully wet substation under 10 ft of water loses 15 % of its rebuild cost on this table.

The curve produces a number only when three things are supplied: a flood depth at the substation itself, clean fresh water, and the substation's own replacement value. Today Hazard supplies none of the three for wind farms, so no number comes out (review v5, A.6, item M12).

## The other fourteen parts · withheld, not zero

Fourteen units: no curve · every request returns ‘withheld’ with a reason, never 0

**What each source says, and what that means for the line**

- **[#17 · Bounded evidence search log (v0.1)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_wind/proposed/BOUNDED_EVIDENCE_SEARCH_LOG_flood_wind__model_v0_1__docs_r1.md)** (numbers on the curve come from it)
  - no public depth: damage: cost chain for any part
- **[#10 · flood × solar component curves](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_solar/current/flood_solar__model_v1_0__docs_r4__curve_artifact.json)** (numbers on the curve come from it)
  - similar cabinets, but kept as audit candidates only
- **[#14 · Hazard’s old wind-farm flood code (M3)](https://github.com/aamani-ai/Hazard_Modeling/blob/d876ef7190ef6baf7339cb32cb95a77bde89af4d/Notebooks/flood/wind_farm/m3_damage/01_damage.py)** (numbers on the curve come from it)
  - four hard-coded S-curves and fixed shares: rejected
- **[#3 · NERC lesson learned, 2022](https://www.nerc.com/pa/rrm/ea/Lessons%20Learned%20Document%20Library/LL20220404_Substation_Flooding_Events_Highlight_Potential_Design_Deficiencies.pdf)** (numbers on the curve come from it)
  - 8 inches at relay connections caused false trips; no cost

**On the Damage dashboard:** [the cell page (the other fourteen parts are withheld and have no curve)](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_wind)

Everything else on a wind farm that water can reach has no curve: the electronics and the transformer at the foot of each tower, the buried cable joints, the foundations, the roads, and the station's own parts taken one by one. Nothing was measured, and that is the point.

The version 0.1 search (source [#17](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_wind/proposed/BOUNDED_EVIDENCE_SEARCH_LOG_flood_wind__model_v0_1__docs_r1.md)) found no public source that goes from water depth to a repair or replace decision to a cost for any of these parts, and that finding still stands (dossier section 2). The team chose to withhold rather than guess. The flood and solar cabinet curves (source [#10](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_solar/current/flood_solar__model_v1_0__docs_r4__curve_artifact.json)) were looked at and kept only as candidates for audit, because their datum and value basis do not match (claims FW-C006 to C008).

Hazard's older hard-coded wind-farm curves (source [#14](https://github.com/aamani-ai/Hazard_Modeling/blob/d876ef7190ef6baf7339cb32cb95a77bde89af4d/Notebooks/flood/wind_farm/m3_damage/01_damage.py)) were rejected outright (FW-C013). The six substation parts are listed separately because they could one day replace curve 1, but they must never be added to it, or the same equipment would be counted twice (FW-C025). What this means for a number is simple: a wind farm's flood loss is the substation's loss and nothing else, so "whole facility" on the dashboard means the whole substation.

The cell does not state what share of the farm that is. For orientation only, NREL puts the entire electrical row, substation and collection cables together, at 72 of 1,968 dollars per kW, which is under 4 % of an installed farm. The review (v5, A.6) proposes a labelled judgment curve for the tower-base cabinet and pad transformer, so that per-tower exposure is at least a number.

In short: flood and wind farm prices exactly one thing, the substation, using FEMA's legacy whole-station table as printed and only for clean fresh water. The other fourteen parts are withheld because no source links water depth to a repair cost for them. The cell will not produce a dollar figure until the substation's own value is supplied, and today it is not. In the source table, the number of sources in each group is: A (the curve itself) 1, D (shape and choices) 4, E (bottom axis) 2, F (dollars) 2, H (method) 2, I (background) 4, J (not used) 3.

## All 17 listed sources (and 1 repository rule), sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’. The register ID is in brackets. No source here gives a measured point that the curve was built from, and none is a pass or fail test turned into a point, so there are no groups for those.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **A · Gives the curve itself: a published curve or table used as printed, or a curve copied from another cell** | | |
| 11 | **FEMA Hazus-MH 2.1 Flood Model Technical Manual, Table 7.9 (FW-S011)**<br>[fema.gov … fema\_hazus\_flood-model\_technical-manual\_2.1.pdf](https://www.fema.gov/sites/default/files/2020-09/fema_hazus_flood-model_technical-manual_2.1.pdf)<br>§7.2.2, §7.2.4, §7.2.6; Table 7.9 pp. 7-20 to 7-21 and footnote 2; transcribed in [the workbook](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_wind/current/damage_curve_records_flood_wind__model_v1_0__docs_r1.xlsx), sheet Hazus\_Source. | Gives the curve: all eleven squares. The same for ESSL, ESSM and ESSH. |
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| 12 | **FEMA Hazus 7.0 Flood Technical Manual (FW-S012)**<br>[fema.gov … fema\_rsl\_hazus-7-fltm\_06272025\_0.pdf](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-fltm_06272025_0.pdf)<br>Where to look: Table 9-1 pp. 9-1 to 9-2; §9.4.1 footnote 21 p. 9-3. | Gives no number. Electric-power substations are mapping-only now → the table is a legacy T3 proxy, and nothing may call it a current FEMA result. |
| 17 | **Bounded evidence search log, flood × wind v0.1 (BOUNDED\_SEARCH\_LOG)**<br>[BOUNDED\_EVIDENCE\_SEARCH\_LOG\_flood\_wind\_\_model\_v0\_1\_\_docs\_r1.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_wind/proposed/BOUNDED_EVIDENCE_SEARCH_LOG_flood_wind__model_v0_1__docs_r1.md)<br>Where to look: Search surfaces, endpoint tests, limitations. | Gives no number. Why the fourteen other parts are withheld: no matched component chain was found. |
| 3 | **NERC, Substation Flooding Events Highlight Potential Design Deficiencies, 2022 (FW-S003)**<br>[nerc.com … LL20220404\_Substation\_Flooding\_Events\_Highlight\_Potential\_Design\_Deficiencies.pdf](https://www.nerc.com/pa/rrm/ea/Lessons%20Learned%20Document%20Library/LL20220404_Substation_Flooding_Events_Highlight_Potential_Design_Deficiencies.pdf)<br>Where to look: Section ‘Details’: about 8 inches over 250 VDC control connections in a basement relay room; false trips removed two 230 kV circuits and six units (495 MW). | Gives no number. Shallow water at controls matters, so a curve that starts rising at 0 ft is right in kind. Gives no cost (FW-C005). |
| 1 | **FERC order on accounting for renewable generating assets, 174 FERC ¶ 61,033 (FW-S001)**<br>[ferc.gov … E-7-011921.pdf](https://www.ferc.gov/sites/default/files/2021-01/E-7-011921.pdf)<br>Where to look: pp. 2–3, wind items a–e. | Gives no number. Wind and solar farms share the same collection-bus-to-substation layout, so the substation is one facility-level unit. |
| **E · Decides what the bottom axis means** | | |
| 5 | **FEMA P-348, Protecting Building Utility Systems From Flood Damage, 2017 (FW-S005)**<br>[fema.gov … fema\_p-348\_protecting\_building\_utility\_systems\_from\_flood\_damage\_2017.pdf](https://www.fema.gov/sites/default/files/2020-07/fema_p-348_protecting_building_utility_systems_from_flood_damage_2017.pdf)<br>Where to look: §5.2, electrical-system flood risk and mitigation. | Sets the bottom axis: depth is measured at the equipment’s own ground, and elevation counts — the basis of the water-surface-to-grade bridge (tier table) and of future component datums. |
| 6 | **Army Corps HEC-FIA Technical Reference, Depth-Percent Damage Relationships (FW-S006)**<br>[hec.usace.army.mil … depth-percent-damage-relationships-direct-damage](https://www.hec.usace.army.mil/confluence/fiadocs/fiatechref/latest/direct-damage/depth-percent-damage-relationships-direct-damage)<br>Where to look: Direct damage, depth-percent relationship and linear interpolation. | Sets the bottom axis: why the curve is a table with straight lines between the rows. |
| **F · Turns the curve into dollars** | | |
| 8 | **NREL, Cost of Wind Energy Review: 2024 Edition (FW-S008)**<br>[nrel.gov … 91775.pdf](https://www.nrel.gov/docs/fy25osti/91775.pdf)<br>Land-based reference plant capital-cost breakdown; carried in [solar\_wind\_value\_breakdown.xlsx](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/value_basis/solar_wind_value_breakdown.xlsx) sheet Wind\_Map rows 2–19. | Turns the curve into dollars: shows the electrical row is one mixed 72 $/kW bucket (substation + collection), so it cannot be used as the substation’s value; neither can the farm total. Dollars need the site’s own substation value. |
| 9 | **FERC pro forma Large Generator Interconnection Agreement (FW-S009)**<br>[ferc.gov … LGIA.pdf](https://www.ferc.gov/sites/default/files/2020-04/LGIA.pdf)<br>Where to look: Definitions of Point of Change of Ownership and Point of Interconnection; Appendix A. | Turns the curve into dollars: whether the substation belongs to the project or the grid owner depends on each site’s agreement, so ownership must be supplied, not assumed. |
| **H · Method and template** | | |
| — | **Damage Modeling method, contracts and governance (GOVERNANCE\_CONTRACT)**<br>[docs/method/standards/00\_index.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/standards/00_index.md)<br>Where to look: Standards 02, 07, 08, 18, 20; fail-closed workflow. | Repository rule, not a source: the dashboard lists it separately, without a number. The withhold-not-zero rule and the release gates. |
| 16 | **Flood-electrical shared component substrate v0.1 (SHARED\_SUBSTRATE)**<br>[docs/method/shared\_components/flood\_electrical/README.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/shared_components/flood_electrical/README.md)<br>Where to look: Catalogue and binding rules. | Gives no number. Method: the common names for the fourteen parts, shared across the flood-electrical cells. |
| **I · Background only, no number taken** | | |
| 2 | **NEMA GD 1-2016, Evaluating Water-Damaged Electrical Equipment (FW-S002)**<br>[nema.org … nema-gd-1-2016-evaluating-water-damaged-electrical-equipment-guide.pdf](https://www.nema.org/docs/default-source/secure-document-library/nema-gd-1-2016-evaluating-water-damaged-electrical-equipment-guide.pdf)<br>Where to look: §4.3 Power Equipment, §4.4 Transformers. | Gives no number. Background: historical repair-or-replace context for the parts; superseded (see #13). |
| 13 | **NEMA Standards Action, April 2026 (FW-S013)**<br>[nema.org … nema-standards-action-april-2026.pdf](https://www.nema.org/docs/default-source/default-document-library/public/standards-actions/nema-standards-action-april-2026.pdf?sfvrsn=73934d20_2)<br>Where to look: Recently Published Documents, p. 5: NEMA CS 70006-2026. | Gives no number. Background: names the 2026 successor guide; not yet acquired or reviewed — an improvement trigger, not a number. |
| 4 | **NERC, Severe Flooding Damages Transformer Substations, 2015 (FW-S004)**<br>[nerc.com … LL20150402\_Severe\_Flooding\_Damages\_Transformer\_Substations\_final.pdf](https://www.nerc.com/pa/rrm/ea/Lessons%20Learned%20Document%20Library/LL20150402_Severe_Flooding_Damages_Transformer_Substations_final.pdf)<br>Where to look: Problem statement, details, corrective actions. | Gives no number. Background: supports splitting the station into parts for future work; no cost. |
| 7 | **DOE/FEMP, Preventing and Mitigating Flood Damage to Solar PV Systems (FW-S007)**<br>[energy.gov … preventing-and-mitigating-flood-damage-solar-photovoltaic-systems](https://www.energy.gov/cmei/femp/preventing-and-mitigating-flood-damage-solar-photovoltaic-systems)<br>Where to look: Total submersion, equipment elevation, conduit water path. | Gives no number. Background: shared electrical water-path ideas from solar sites; no wind number. |
| **J · Not used by this curve: listed to show what was looked at, and why it was left out** | | |
| 10 | **flood × solar artifact, model v1.0 / docs r4 (FW-S010)**<br>[flood\_solar\_\_model\_v1\_0\_\_docs\_r4\_\_curve\_artifact.json](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_solar/current/flood_solar__model_v1_0__docs_r4__curve_artifact.json)<br>Where to look: Records FS\_SWG, FS\_XFMR, FS\_SCADA, FS\_CABLE. | Not used: pinned as audit candidates only; not reused (FW-C006 to C008). |
| 14 | **Hazard M3 wind-farm flood damage notebook (LEG-FW-001)**<br>[github.com … 01\_damage.py](https://github.com/aamani-ai/Hazard_Modeling/blob/d876ef7190ef6baf7339cb32cb95a77bde89af4d/Notebooks/flood/wind_farm/m3_damage/01_damage.py)<br>Where to look: Lines 65–84, dr() and loss assembly. | Not used: four hard-coded S-curves and fixed project shares: kept as regression fixtures, rejected as evidence. |
| 15 | **Hazard M4 wind-farm loss-metrics notebook (LEG-FW-002)**<br>[github.com … 01\_loss\_metrics.py](https://github.com/aamani-ai/Hazard_Modeling/blob/d876ef7190ef6baf7339cb32cb95a77bde89af4d/Notebooks/flood/wind_farm/m4_loss_metrics/01_loss_metrics.py)<br>Where to look: Lines 204–245: a second hard-coded coastal curve. | Not used: A bypass to remove when Hazard migrates; not evidence. |

**Gaps worth knowing, found while building this page.** (1) The same curve has opposite salt-water rules in the two cells that use it: this cell withholds anything but clean fresh water; flood × substation applies the curve to coastal water as a T4 transfer. (2) The workbook’s Hazus\_Source sheet still describes the decision as a “model v1.0 proposal … promotion gate blocked”; the README and artifact say released. (3) Table 7.9 and the Hazus 7.0 manual were checked by the Damage team against the PDFs for review v5; the NERC 2022 lesson was re-read for this page.
