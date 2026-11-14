Damage-curve review · flood × real estate

# Flood × real estate curve, where its numbers come from

A flood curve for a building answers one question: **when water stands at a given depth above the first floor, what share of the cost of rebuilding the building is lost?**

FEMA's Hazus program publishes a depth-damage table for each kind of building. The Damage team uses the right table for each of Hazard's three reference buildings exactly as printed, joining the printed one-foot rows with straight lines. Every point on these curves is a number FEMA printed.

The claim averages are real losses: the average building damage on paid claims from the US National Flood Insurance Program (NFIP), grouped by how deep the water stood. The Damage team pulled these claims from FEMA's public data while building the cell [[#12](https://www.fema.gov/api/open/v3/NfipClaims)], to see how close FEMA's tables come to real floods. The curves were not changed to fit them.

These curves have not been formally released yet: in the Damage repository they are still marked as a proposal, although Hazard already uses them. The tables cover the building itself. Its contents (furniture, stock, equipment), damage from waves and damage from fast-moving water are not covered, so they get no number (withheld).

### What the labels on this page mean

A cell is one hazard × asset pair in the Damage repository, and its dossier is the write-up of how its curves were built.

Each curve is marked by how well it is backed:

- **published (T2)**: taken from a published source and used unchanged
- **borrowed (T3)**: a published result carried over to a case it was not made for
- **our judgment (T4)**: numbers the Damage team chose

Withheld means no number is given, because nobody knows; it is not the same as zero.

## Curve 1 · one-storey house on a slab (FEMA damage function 129), for river, rain and still coastal water

**What each source says, and what that means for the line**

- **[#3 · FEMA Hazus 5.1 table, DF 129](https://rdrr.io/cran/hazus/man/haz_fl_dept.html)** (numbers on the curve come from it)
  - Says: FEMA table DF 129: 13 % at the floor, 32 % at 2 ft, 84 % at 24 ft
  - So: the line is this table, copied as published
- **[#2 · FEMA Hazus 7.0 manual, Table 5-2](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-fltm_06272025_0.pdf)** (no number on the curve comes from it)
  - Says: FEMA's own pick for a one-storey house with no basement is DF 129
  - So: no number on the curve; it backs the choice of table
- **[#12 · NFIP flood-insurance claims](https://www.fema.gov/api/open/v3/NfipClaims)** (numbers on the curve come from it)
  - Says: ● river/rain: 42,527 claims ● storm surge: 17,462 claims
  - So: the claim averages come from paid claims, a check only; they do not move the line
- **[#9 · National Structure Inventory 2026](https://www.hec.usace.army.mil/confluence/nsi/technicalreferences/2026/technical-documentation)** (no number on the curve comes from it)
  - Says: slab houses sit 0.75 ft above the ground by default
  - So: not on the line; Hazard subtracts 0.75 ft from the water depth before reading it
- **Damage team · our judgment (T4)** (the Damage team’s own choice)
  - Did: used the same table for still coastal water
  - So: no separate coastal line, because the storm-surge claims fit this one

**On the Damage dashboard:** [1 · house, damage function 129](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_real_estate/curves/FRE_RES_HAZUS_DF129)

This is FEMA's standard flood curve for a one-storey house with no basement. In FEMA's library it is damage function 129 (DF 129): FEMA numbers each of its depth-damage tables, and 129 is the one for this kind of house. FEMA took it over from the Army Corps of Engineers.

Every point is a number printed in FEMA's table, and it matches the Army Corps' own copy [[#5](https://github.com/USACE/go-consequences/blob/dff647cabbc1abae3f084e80b7f6a166651d05d8/structures/occtypes.json)] at 18 of 19 depths; the 15 ft row differs by less than one point. None of the curve's numbers were chosen by the Damage team.

The claim averages here are the average damage on paid flood insurance claims for one-storey houses on a slab, for river and rain floods and for storm surge. They are a check only.

The Damage team made two choices around the curve. First, it uses the same curve for still coastal water (storm surge that rises without waves), because the surge claims sit closer to this curve than to the Army Corps' coastal curve. Second, before reading the curve, Hazard subtracts how high the floor sits above the ground. For the house that is 0.75 ft, the National Structure Inventory's standard value for slab houses [[#9](https://www.hec.usace.army.mil/confluence/nsi/technicalreferences/2026/technical-documentation)], not a measurement of real houses.

Reading the curve: half the cost of rebuilding the house is lost when water stands about 4.5 ft above the floor, which is about 5.25 ft above the ground outside.

Where the curve and the claims differ: in shallow water the real claims are higher. Just above the floor, claims average 26 % while the curve gives 15 %. Most of that gap comes from the floor height: if the floor were at ground level instead of 0.75 ft up, the curve would be only 3 points below the claims instead of 10. That is why the floor height matters more than the curve in shallow water.

For 2 ft of water above the ground, the house loses 32 % with its floor at the ground, 25 % with the floor 0.75 ft up, and 13 % with the floor 2 ft up.

Hazard uses this curve for every house on its real-estate map, for river, rain and still coastal flooding.

## Curve 2 · one-storey steel warehouse (FEMA damage function 341), for river, rain and still coastal water

**What each source says, and what that means for the line**

- **[#3 · FEMA Hazus 5.1 table, DF 341](https://rdrr.io/cran/hazus/man/haz_fl_dept.html)** (numbers on the curve come from it)
  - Says: FEMA table DF 341: 0 % at the floor, 8 % at 2 ft, 32 % at 10 ft, 73 % at 24 ft
  - So: the line is this table, copied as published
- **[#7 · Army Corps, Galveston district](https://rdrr.io/cran/hazus/man/haz_fl_dept.html)** (no number on the curve comes from it)
  - Says: its Galveston office built DF 341 as an average of 22 kinds of wholesale and warehouse building, all in that one district
  - So: no number of its own on the curve; it tells us the line is a broad average, not a curve measured for this warehouse
- **[#12 · NFIP flood-insurance claims](https://www.fema.gov/api/open/v3/NfipClaims)** (numbers on the curve come from it)
  - Says: ● 365 river/rain claims, all under 3 ft ◆ 14 storm-surge claims at 1–3 ft: average 14 %
  - So: the claim averages are a check only; they do not move the line
- **[#11 · Structure Inventory, 3 counties](https://nsi.sec.usace.army.mil/nsiapi/structures?fips=25019)** (no number on the curve comes from it)
  - Says: slab warehouses carry a 0.25 ft floor height (a default with no documentation)
  - So: not on the line; Hazard subtracts 0.25 ft from the water depth before reading it

**On the Damage dashboard:** [2 · warehouse, damage function 341](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_real_estate/curves/FRE_IND_HAZUS_DF341)

This is FEMA's default flood curve for a wholesale or warehouse building, damage function 341 (DF 341). It is the Army Corps' Galveston district average over 22 kinds of warehouse [[#7](https://rdrr.io/cran/hazus/man/haz_fl_dept.html)]. None of its numbers were chosen.

The claim averages here come from 365 paid claims on one-floor warehouses in river and rain floods, all with less than 3 ft of water. The 14 storm-surge claims at 1 to 3 ft of water average 14 %.

The Damage team chose to use the curve for still coastal water as well, although the 14 surge claims come out about twice the curve. The dossier leaves this as an open question, because 14 claims are too few to rely on.

Half is lost only when water stands about 14 ft above the floor. In shallow water the curve is near zero, about 1 % at a few inches, while the claims average 8 to 9 %, so the review says the warehouse curve reads low, at about 0.44 times the claims. Hazard uses this curve for every warehouse on its map, for river, rain and still coastal water.

## Curve 3 · three-storey office (FEMA damage function 431), for river, rain and still coastal water

**What each source says, and what that means for the line**

- **[#3 · FEMA Hazus 5.1 table, DF 431](https://rdrr.io/cran/hazus/man/haz_fl_dept.html)** (numbers on the curve come from it)
  - Says: FEMA table DF 431: 2 % at the floor, 16 % at 2 ft, 50 % at 10 ft, 80 % at 24 ft
  - So: the line is this table, copied as published
- **[#10 · FEMA Hazus 6.1 extract](https://os-climate-physical-risk.s3.amazonaws.com/vulnerability/HazusFloodDamageFunctions_Hazus61.xlsx)** (no number on the curve comes from it)
  - Says: FEMA uses DF 431 for offices of every height, for river and for coastal flooding
  - So: no number on the curve; it backs using DF 431 for a three-storey office
- **[#12 · NFIP business claims by floors](https://www.fema.gov/api/open/v3/NfipClaims)** (numbers on the curve come from it)
  - Says: ● one floor: 6,529 claims ● three or more floors: 228 claims, all under 3 ft
  - So: the claim averages are a check only; the three-or-more-floor claims sit below the line
- **Damage team · our judgment (T4)** (the Damage team’s own choice)
  - Did: kept DF 431 exactly as published
  - So: on claims, DF 431 runs about 1.6 times too high for buildings of three or more floors in shallow water; this is written down, not corrected

**On the Damage dashboard:** [3 · office, damage function 431](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_real_estate/curves/FRE_OFF_HAZUS_DF431)

This is FEMA's default flood curve for professional and technical offices, damage function 431 (DF 431), also an Army Corps Galveston average. FEMA uses the same curve for offices of any height [[#10](https://os-climate-physical-risk.s3.amazonaws.com/vulnerability/HazusFloodDamageFunctions_Hazus61.xlsx)].

The claim averages here are paid flood-insurance claims on business buildings, sorted by number of floors [[#12](https://www.fema.gov/api/open/v3/NfipClaims)]: one-floor buildings, and buildings with three or more floors. The claims on three or more floors sit well below the curve: when only the ground floor floods, a three-storey building loses a smaller share of its total value. On these claims, buildings with three or more floors lose about half the share that one-floor buildings lose, and the curve is about 1.6 times their average in shallow water.

So the curve reads high for Hazard's three-storey office. FEMA does not say this; the Damage team found it by comparing the curve with the claims. The Damage team kept FEMA's curve as printed and wrote the bias down instead of scaling the curve, because no other office curve in Hazus fits the claims better.

Half is lost at 10 ft of water above the ground floor, which for a real three-storey office is probably too high. Hazard uses this curve for every office on its map, so the office layer of the flood map reads high: the review puts it at about 1.6 to 2.3 times the claims.

## Curves 4a and 4b · low-rise retail: kept from an earlier version, used by no Hazard building (Hazus 217 river; NACCS prototype 2 coast)

- **Curve 4a:** Low-rise retail · river and rain, Hazus table 217
- **Curve 4b:** Low-rise retail · coast, NACCS prototype 2 (with its minimum and maximum)

**What each source says, and what that means for the line**

- **[#3 · FEMA Hazus 5.1 table, DF 217](https://rdrr.io/cran/hazus/man/haz_fl_dept.html)** (numbers on the curve come from it)
  - Says: FEMA table DF 217, river and rain: 14 % at 2 ft, 38 % at 10 ft (an average of 47 retail classes)
  - So: curve 4a is this table
- **[#4 · Army Corps NACCS 2015, Table 25](https://www.nad.usace.army.mil/Portals/40/docs/NACCS/10A_PhysicalDepthDmgFxSummary_26Jan2015.pdf)** (numbers on the curve come from it)
  - Says: storm surge: 5 % at the floor, 30 % at 2 ft, 58 % at 10 ft, with minimum and maximum variants
  - So: curve 4b and its minimum and maximum
- **[#12 · NFIP business claims](https://www.fema.gov/api/open/v3/NfipClaims)** (numbers on the curve come from it)
  - Says: 5,753 river/rain and 1,134 surge claims on one-floor shops
  - So: the claim averages are a check only; they do not move the lines

**On the Damage dashboard:** [4a · retail, river and rain (Hazus 217)](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_real_estate/curves/FRE_COM_FRESH_HAZUS_DF217) · [4b · retail, coast (NACCS prototype 2)](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_real_estate/curves/FRE_COM_COAST_NACCS_P2) · [4b minimum](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_real_estate/curves/FRE_COM_COAST_NACCS_P2_MIN) · [4b maximum](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_real_estate/curves/FRE_COM_COAST_NACCS_P2_MAX)

This retail record is the one place where the cell keeps two separate curves, one for each type of water, and never mixes them. The river and rain curve is FEMA's damage function 217 [[#3](https://rdrr.io/cran/hazus/man/haz_fl_dept.html)]. The coastal curve is printed in the Army Corps' North Atlantic Coast study, Table 25 on page 62 [[#4](https://www.nad.usace.army.mil/Portals/40/docs/NACCS/10A_PhysicalDepthDmgFxSummary_26Jan2015.pdf)], with a minimum and a maximum curve for different building variants. None of the numbers were chosen.

The claim averages here are claims on one-floor shops in river and rain floods; FEMA's curve stays within about six points of them. On surge claims, the Army Corps curve reads 6 to 12 points high. Half is lost at 12.8 ft of river water or about 6.5 ft of surge. Today Hazard uses neither curve, because its building profiles have no retail building.

## What the review checked, and why it is usable for screening

The damage-curve review judged every curve by one question: is it good enough for a rough national map? That means the size of the loss is about right, places come out in a sensible order, and the curve says what it leaves out. For each curve it checked that the numbers come from the documents cited, whether it is the right curve for a national map, and whether Hazard feeds it the right input.

### What was checked

The cell compared its curves with paid National Flood Insurance Program claims for similar buildings, on the same measure (building damage as a share of building value), depth by depth.

Dividing the curve's prediction by the real average claim, the house reads about 0.7 to 0.8 (a bit low, mostly at shallow depths), the warehouse about 0.44 (less than half, near zero below 1 ft), and the three-storey office 1.6 to 2.3 (too high). The office reads high because the Hazus office curve was built for a one-storey building and does not know that a three-storey office loses only about a third of its value when the ground floor floods.

The review also checked the first-floor heights Hazard subtracts before reading the curve: 0.75 ft for the house (from the National Structure Inventory) and 0.25 ft for the office and warehouse (from three county surveys).

### Why it is usable for screening

Water reaching finishes, drywall, floors and building services is the right way slab buildings get damaged, and the Hazus whole-building tables are the standard source for it.

Every curve lands within two to three times the real claims, and we know which way each one is off. For a rough national map that is good enough, as long as the direction is stated.

### What to keep in mind

Because the building types are off in opposite directions, comparisons between them are skewed: an office looks worse than it is and a warehouse looks better.

At shallow depths the first-floor height matters more than the choice of curve. A house in 2 ft of water above the ground reads 32 %, 25 % or 13 % for a floor at 0, 0.75 or 2 ft.

On the coast, still water uses the river curve and waves are withheld, so the costliest strip of coast shows 'no number' rather than 'low'.

### What would change the verdict

A county-by-county comparison with FEMA's National Risk Index, once Hazard computes a yearly loss, would test it (a ratio outside roughly 0.3 to 3 would send it back), and so would measured floor heights showing that slab buildings usually sit at ground level.

In short: flood and real estate has no curve built by the Damage team. Every point is a number printed by FEMA or the Army Corps and re-checked against an independent copy. The only measured points are paid insurance claims, used as a check, and that check shows the house and warehouse curves reading low near the floor and the office curve reading high for a three-storey building. The Damage team's own choices are which printed curve each building gets, the decision to use it for still coastal water, and the floor heights that Hazard subtracts first. In the source table, the printed tables are group A, FEMA’s own rules for which table goes where are group D, and the insurance claims are group G.

## All 13 listed sources, sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’. None of these sources gives a measured point that a curve was built from: the curves are FEMA's and the Army Corps' printed tables. The flood-insurance claims are real measurements, but they are only used as a check.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **A · Gives the curve itself: a published curve or table used as printed, or a curve copied from another cell** | | |
| 3 | **FEMA Hazus 5.1 flood depth-damage library, structure curves (FRE-S003)**<br>[rdrr.io … haz\_fl\_dept.html](https://rdrr.io/cran/hazus/man/haz_fl_dept.html)<br>Where to look: damage functions 129, 217, 341 and 431; columns −4 to +24 ft; values in % of the building’s value. | Gives the numbers: every point on curves 1 to 4 that comes from FEMA. #5 has the same numbers at all 29 depths. |
| 4 | **Army Corps, NACCS Physical Depth-Damage Function Summary Report, 2015 (FRE-S004)**<br>[nad.usace.army.mil … 10A\_PhysicalDepthDmgFxSummary\_26Jan2015.pdf](https://www.nad.usace.army.mil/Portals/40/docs/NACCS/10A_PhysicalDepthDmgFxSummary_26Jan2015.pdf)<br>Where to look: Table 25 on page 62, Prototype 2 ‘Commercial Engineered’: minimum, most likely and maximum loss from −1 to 10 ft. | Gives the numbers for line 4b (the shop in storm surge) and its minimum and maximum. Its house and warehouse curves are no longer used. |
| 1 | **Pollack (2023), Hazus and NACCS depth-damage functions, Zenodo (FRE-S001)**<br>[doi.org … zenodo.10027236](https://doi.org/10.5281/zenodo.10027236)<br>Where to look: files haz\_fl\_dept.csv, naccs\_ddfs.csv and riverine\_ids.csv. | Gives no new number: it is the machine-readable copy of the FEMA and Army Corps tables that the cell’s records were built from. Four filled-in NACCS values (at 4, 6, 8 and 9 ft) are flagged and not used. |
| 5 | **Army Corps go-consequences, occtypes.json @ dff647c (FRE-S005)**<br>[github.com … occtypes.json](https://github.com/USACE/go-consequences/blob/dff647cabbc1abae3f084e80b7f6a166651d05d8/structures/occtypes.json)<br>Where to look: the structure curves for building types COM1, COM2, COM4 and RES1-1SNB in occtypes.json. | Gives no new number: an independent copy that confirms #3. The shop, warehouse and office tables match at all 29 depths; the house table matches at 18 of 19. |
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| 2 | **FEMA Hazus 7.0 Flood Technical Manual, Tables 5-2, 5-3, 5-4 (FRE-S002)**<br>[fema.gov … fema\_rsl\_hazus-7-fltm\_06272025\_0.pdf](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-fltm_06272025_0.pdf)<br>Where to look: Table 5-2 on pages 5-3 to 5-6 (FEMA’s default table for each building type) and the note to Table 5-3 on page 5-8 (only houses have their own coastal tables). | Gives no number. It says which FEMA table belongs to which building (house 129, shop 217, warehouse 341, office 431), and its coastal note supports using the same tables for still coastal water. |
| 7 | **Army Corps Galveston district commercial class averages, as carried in Hazus (FRE-S007)**<br>[rdrr.io … haz\_fl\_dept.html](https://rdrr.io/cran/hazus/man/haz_fl_dept.html)<br>Where to look: the ‘Source’ column for tables 217, 341 and 431, which reads ‘USACE – Galveston’. | Gives no number. It shows the business tables were built by the Army Corps’ Galveston office as averages over many building types in one district, so each business curve is flagged as a regional average. |
| 10 | **FEMA Hazus 6.1 flood damage-function extract (FRE-S010)**<br>[os-climate-physical-risk.s3.amazonaws.com … HazusFloodDamageFunctions\_Hazus61.xlsx](https://os-climate-physical-risk.s3.amazonaws.com/vulnerability/HazusFloodDamageFunctions_Hazus61.xlsx)<br>Where to look: sheet flBldgStructDmgFinal: FEMA’s default table by building type, height and flood zone. | Gives no new number. It shows FEMA itself uses DF431 for offices of every height and DF341 for warehouses on the coast, which is why the cell does too. It is also a third copy of the numbers. |
| **E · Decides what the bottom axis means** | | |
| 9 | **Army Corps National Structure Inventory 2026, technical documentation (FRE-S009)**<br>[hec.usace.army.mil … technical-documentation](https://www.hec.usace.army.mil/confluence/nsi/technicalreferences/2026/technical-documentation)<br>Where to look: the sections ‘Foundation Type and Height’ (slab houses 0.75 ft) and ‘Full Replacement Cost’. | Gives the 0.75 ft house floor height that Hazard subtracts before reading curve 1. It also confirms the dollars are the full cost of rebuilding, the same basis the curves use. |
| 11 | **NSI API structure records, three counties (FRE-S011)**<br>[nsi.sec.usace.army.mil … structures](https://nsi.sec.usace.army.mil/nsiapi/structures?fips=25019) | Gives the 0.25 ft floor height for the warehouse, office and shop. It is the inventory’s default value, seen in 91–100 % of records, not a measurement. |
| **F · Turns the curve into dollars** | | |
| 13 | **Hazard\_Modeling real-estate reference profiles r1 (FRE-S013)**<br>[github.com … reference\_candidates.yml](https://github.com/aamani-ai/Hazard_Modeling/blob/8b0d61c88fbcf85daa1c098516cee22398cdb524/docs/plans/_cross_cutting/real_estate_conus/reference_candidates.yml) | Gives the three standard buildings and a rebuild budget for each. The dollars stay held back until Hazard confirms the budget means the full cost of rebuilding the structure. |
| **G · Checks or compares the curve, not used to build it** | | |
| 12 | **FEMA OpenFEMA NFIP Redacted Claims v3 (FRE-S012)**<br>[fema.gov/api/open/v3/NfipClaims](https://www.fema.gov/api/open/v3/NfipClaims) | Gives every claim average used to check curves 1 to 4: the average paid damage in each depth band, as a share of the building’s value. Used only as a check, never to fit the curves. Most house claims come from Gulf states. The claims are also why the same curve is used for still coastal water. |
| **H · Method and template** | | |
| 8 | **Plymouth / Salem coastal flood trial, methodology and fit catalogue (FRE-S008)**<br>[Hazard\_Modeling @ 09b95acb (branch feature/plymouth\_trial)](https://github.com/aamani-ai/Hazard_Modeling/tree/09b95acb)<br>Where to look: plymouth\_modelling\_methodology.md, sections 3, 6 and 7. | Gives no number. The cell reused its conventions: water depth above the first floor, and choosing a table by building use, foundation and storeys. Its curves for buildings with basements were rejected. |
| **I · Background only, no number taken** | | |
| 6 | **Army Corps Economic Guidance Memorandum residential curves, via go-consequences (FRE-S006)**<br>[github.com … occtypes.json](https://github.com/USACE/go-consequences/blob/dff647cabbc1abae3f084e80b7f6a166651d05d8/structures/occtypes.json)<br>Where to look: RES1-1SNB structure default: mean and standard deviation per foot, −2 … 16 ft. Original EGM not accessed (register status ‘pending’). | Gives no number. Explains where FEMA’s house table (DF129) comes from, and records a spread around it that the cell does not use. |
| **J · Not used by this curve: listed to show what was looked at, and why it was left out** | | |
| — | **Model v0.1 of this cell (previous version, the one Hazard pinned at intake)**<br>[flood\_real\_estate\_\_model\_v0\_1\_\_docs\_r1\_\_curve\_artifact.json](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_real_estate/proposed/flood_real_estate__model_v0_1__docs_r1__curve_artifact.json) | Used NACCS 5A (house) and prototype 3 (warehouse) for surge. Superseded by D-FRE-28; kept for reproducibility. |
| — | **Hazus DF 658 (FEMA’s coastal-A house default, in #10)**<br>Where to look: flBldgStrucDmgFn row 658: 12 % at the floor, 50 % at 2 ft, 100 % from 4 ft (FRE-C020). | Includes wave damage, so not used for still water; waves are a separate, withheld pathway. |

**Gaps between the dossier and the evidence files, found while building this page.** (1) The v0.2 workbook has no Evidence\_Log, Evidence\_Params or Assumption\_Register sheets; the 37-row claim register plays that role, and every number above traces to a claim or a source table. (2) The parameter tier table carried into the v0.2 artifact is still the v0.1 table: it lists NACCS ordinates for house and warehouse surge and “coastal → NACCS” routing, and has no row for the office’s DF 431 or its 0.25 ft floor height, although the v0.2 records use DF 129, 341 and 431 for both water types. (3) Claim FRE-C004 says DF 129 “equals” the rounded Army Corps EGM means; re-reading the go-consequences file, 18 of 19 depths match and at 15 ft the EGM mean is 80.2 % against DF 129’s 81 %. (4) The NFIP comparison CSV was computed with the v0.1 records (its house-surge “curve” column is NACCS 5A); the claim averages used here do not depend on that.
