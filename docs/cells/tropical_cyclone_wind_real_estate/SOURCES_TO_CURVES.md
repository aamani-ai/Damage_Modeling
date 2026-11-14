Damage-curve review · hurricane wind × real estate

# Hurricane × real estate curve, where its numbers come from

A hurricane curve for a building answers one question: **when a gust of a given speed hits, what share of the cost of rebuilding the building is lost?**

FEMA's Hazus program publishes a loss table for each type of building, at every 5 mph from 50 to 250 mph and for five kinds of surrounding terrain. The Damage team copies the right table for each of Hazard's buildings exactly.

The table already covers everything the wind does to a building: roof covering, roof deck, roof-to-wall ties, windows, flying debris and the rain that gets in afterwards. Nothing is added on top.

The Damage team's part is choosing which of FEMA's building types matches each Hazard building. No source gives a measured storm loss, so there are no dots on these curves.

In each group, curves a to c are the terrains Hazard shows as separate map layers: open, suburban and tree-covered. Curves d and e are two more terrains that are in FEMA's table but that Hazard does not run. Curves 1f and 2f are shown for comparison only and are not used.

### What the labels on this page mean

A cell is one hazard × asset pair in the Damage repository, and its dossier is the write-up of how its curves were built.

Each curve is marked by how well it is backed:

- **published (T2)**: taken from a published source and used unchanged
- **borrowed (T3)**: a published result carried over to a case it was not made for
- **our judgment (T4)**: numbers the Damage team chose

Withheld means no number is given, because nobody knows; it is not the same as zero.

## Curves 1a to 1f · one-storey wood house (Hazus WSF1), five terrain records

- **Curve 1a:** House · open terrain (one of Hazard's three map layers)
- **Curve 1b:** House · suburban (one of Hazard's three map layers)
- **Curve 1c:** House · trees (one of Hazard's three map layers)
- **Curve 1d:** House · light suburban (in FEMA's table, not run by Hazard)
- **Curve 1e:** House · light trees (in FEMA's table, not run by Hazard)
- **Curve 1f:** House · built to a modern coastal code (longer nails, metal roof straps), open terrain (for comparison only, not used)

**What each source says, and what that means for the line**

- **[#2 · FEMA Hazus 6.1 wind-function extract](https://os-climate-physical-risk.s3.amazonaws.com/vulnerability/HazusWindDamFunctions_Hazus61.xlsx)** (numbers on the curve come from it)
  - Says: building loss every 5 mph from 50 to 250 mph, one record per terrain
  - So: curves 1a, 1b, 1c (Hazard's map layers) and 1d, 1e (not run), copied as published
- **[#3 · SimCenter copy of Hazus 5.1](https://github.com/NHERI-SimCenter/DamageAndLossModelLibrary/blob/869423b9ad21a8bfe5c40eee8db9eee13e4f61b9/src/dlml/data/hurricane/building/portfolio/Hazus%20v5.1%20original/loss_repair.csv)** (numbers on the curve come from it)
  - Says: an independent copy of the same FEMA numbers, plus a house built to the coastal code
  - So: curve 1f, for comparison only; it also confirms #2 was copied correctly
- **[#1 · FEMA Hazus 7.0 hurricane manual](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-hutm_06272025_0.pdf)** (no number on the curve comes from it)
  - Says: FEMA's loss includes wind pressure, flying debris and rain through broken openings
  - So: no number on the curve; it says what the line covers
- **Damage team · our judgment (T4)** (the Damage team’s own choice)
  - Did: picked the roof nailing and roof-to-wall ties most common nationally
  - So: this picks which FEMA record becomes the line

**On the Damage dashboard:** [1a · open terrain](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_RES_HAZUS_WSF1_OPEN) · [1b · suburban](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_RES_HAZUS_WSF1_SUBURBAN) · [1c · trees](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_RES_HAZUS_WSF1_TREES) · [1d · light suburban](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_RES_HAZUS_WSF1_LIGHT_SUBURBAN) · [1e · light trees](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_RES_HAZUS_WSF1_LIGHT_TREES) (curve 1f, the coastal-code house, is a comparison only and is not on the dashboard)

This is FEMA's hurricane loss curve for a one-storey wood house, Hazus building type WSF1, printed for five kinds of surrounding terrain. The rougher the surroundings, the more the wind is slowed before it reaches the house, so the curve moves to the right. The numbers are copied from FEMA's spreadsheet of Hazus loss values [[#2](https://os-climate-physical-risk.s3.amazonaws.com/vulnerability/HazusWindDamFunctions_Hazus61.xlsx)], and SimCenter's separate copy [[#3](https://github.com/NHERI-SimCenter/DamageAndLossModelLibrary/blob/869423b9ad21a8bfe5c40eee8db9eee13e4f61b9/src/dlml/data/hurricane/building/portfolio/Hazus%20v5.1%20original/loss_repair.csv)] matches them at every wind speed.

None of them is a measured loss: they come from FEMA's own engineering model of roof cover, roof deck, roof-to-wall connections, windows, flying debris and rain getting in (FEMA's Hazus hurricane manual, section 2.1, [[#1](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-hutm_06272025_0.pdf)]).

What the Damage team chose is which of FEMA's 160 versions of this house to use; the versions differ in how the roof is built and held down. Hazard's description of the house gives a gable roof, shingles, no garage and no window shutters.

It does not say how the roof boards are nailed or how the roof is tied to the walls, so the Damage team used the most common setting nationally (Table C-2 of FEMA's Hazus hurricane manual, [[#1](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-hutm_06272025_0.pdf)]): ordinary 2-inch nails (the size called 6d, or "sixpenny"), 6 inches apart along the edges of each roof board and 12 inches apart in the middle, and rafters nailed to the wall at an angle, with no metal straps.

That choice is our judgment (T4).

A house built to a modern coastal building code, with longer nails and metal straps holding the roof down, would lose 19 % instead of 31 % at 120 mph in open terrain. This is curve 1f, taken from SimCenter's copy [[#3](https://github.com/NHERI-SimCenter/DamageAndLossModelLibrary/blob/869423b9ad21a8bfe5c40eee8db9eee13e4f61b9/src/dlml/data/hurricane/building/portfolio/Hazus%20v5.1%20original/loss_repair.csv)], for comparison only; Hazard does not use it.

Half the house's rebuild cost is lost at a 128 mph gust in open terrain, and at about 140 mph in a suburb. Hazard uses this curve for every house on its real-estate map. Because the surroundings change the result so much, Hazard makes three separate map layers, one each for open, suburban and tree-covered terrain, and anyone quoting a number should say which layer it comes from. Damage from falling trees is a separate Hazus add-on that has not been set up yet, so it is withheld.

## Curves 2a to 2f · large pre-engineered steel warehouse (Hazus SPMBL), roof deck new or average

- **Curve 2a:** Warehouse · open terrain (one of Hazard's three map layers)
- **Curve 2b:** Warehouse · suburban (one of Hazard's three map layers)
- **Curve 2c:** Warehouse · trees (one of Hazard's three map layers)
- **Curve 2d:** Warehouse · light suburban (in FEMA's table, not run by Hazard)
- **Curve 2e:** Warehouse · light trees (in FEMA's table, not run by Hazard)
- **Curve 2f:** Warehouse · old roof deck, open terrain (an earlier version; replaced, not used)

**What each source says, and what that means for the line**

- **[#2 · FEMA Hazus 6.1 wind-function extract](https://os-climate-physical-risk.s3.amazonaws.com/vulnerability/HazusWindDamFunctions_Hazus61.xlsx)** (numbers on the curve come from it)
  - Says: FEMA building record 1730: a loss value every 5 mph
  - So: curves 2a, 2b, 2c (Hazard's map layers) and 2d, 2e, 2f (not used), copied as published
- **[#3 · SimCenter copy of Hazus 5.1](https://github.com/NHERI-SimCenter/DamageAndLossModelLibrary/blob/869423b9ad21a8bfe5c40eee8db9eee13e4f61b9/src/dlml/data/hurricane/building/portfolio/Hazus%20v5.1%20original/loss_repair.csv)** (no number on the curve comes from it)
  - Says: an independent copy of the same FEMA numbers; matches at all 41 wind speeds
  - So: nothing new on the curve; it confirms the numbers were copied correctly
- **[#10 · Hazard building profile](https://github.com/aamani-ai/Hazard_Modeling/blob/8b0d61c88fbcf85daa1c098516cee22398cdb524/docs/plans/_cross_cutting/real_estate_conus/reference_candidates.yml)** (no number on the curve comes from it)
  - Says: 100,000 ft² (Hazus ‘large’), 10-year-old roof (Hazus deck ‘new or average’)
  - So: no number on the curve; it picks which FEMA record is used
- **[#1 · FEMA Hazus 7.0 hurricane manual](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-hutm_06272025_0.pdf)** (no number on the curve comes from it)
  - Says: Tables 5-76/77: bigger buildings and older roof decks lose more
  - So: no number on the curve; it is why size and roof age decide the record

**On the Damage dashboard:** [2a · open terrain](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_IND_HAZUS_SPMBL_NEWDECK_OPEN) · [2b · suburban](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_IND_HAZUS_SPMBL_NEWDECK_SUBURBAN) · [2c · trees](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_IND_HAZUS_SPMBL_NEWDECK_TREES) · [2d · light suburban](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_IND_HAZUS_SPMBL_NEWDECK_LIGHT_SUBURBAN) · [2e · light trees](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_IND_HAZUS_SPMBL_NEWDECK_LIGHT_TREES) (curve 2f, the old roof deck, is an earlier version and is not on the dashboard)

This is FEMA's curve for a large pre-engineered steel building of over 50,000 square feet, which is the kind of building most warehouses are. None of these numbers is a measured loss: they are FEMA's modelled numbers from its Hazus spreadsheet [[#2](https://os-climate-physical-risk.s3.amazonaws.com/vulnerability/HazusWindDamFunctions_Hazus61.xlsx)], checked against SimCenter's separate copy [[#3](https://github.com/NHERI-SimCenter/DamageAndLossModelLibrary/blob/869423b9ad21a8bfe5c40eee8db9eee13e4f61b9/src/dlml/data/hurricane/building/portfolio/Hazus%20v5.1%20original/loss_repair.csv)]. The Damage team chose two things, both read from Hazard's profile rather than guessed.

The profile's 100,000 square feet puts the building in Hazus' large class, a neighbouring category, so it is borrowed (T3). Its ten-year-old roof puts the deck in FEMA's "new or average" class, because FEMA calls metal roofs from 2008 onward new or average. An earlier version (0.1) had assumed an old deck, shown as curve 2f, which reads 39.5 % instead of 23.5 % at 120 mph in open terrain.

The profile's eight unprotected overhead doors cannot move the curve, because Hazus has no door setting for this building type. Half is lost at about 130 mph in open terrain and 147 mph in a suburb. The curve is used for every warehouse placement, in the three map layers that Hazard runs.

## Curves 3a to 3e · three-storey steel office (Hazus SECBM), membrane roof, medium windows

- **Curve 3a:** Office · open terrain (one of Hazard's three map layers)
- **Curve 3b:** Office · suburban (one of Hazard's three map layers)
- **Curve 3c:** Office · trees (one of Hazard's three map layers)
- **Curve 3d:** Office · light suburban (in FEMA's table, not run by Hazard)
- **Curve 3e:** Office · light trees (in FEMA's table, not run by Hazard)

**What each source says, and what that means for the line**

- **[#2 · FEMA Hazus 6.1 wind-function extract](https://os-climate-physical-risk.s3.amazonaws.com/vulnerability/HazusWindDamFunctions_Hazus61.xlsx)** (numbers on the curve come from it)
  - Says: FEMA building record 1840: a loss value every 5 mph
  - So: curves 3a, 3b, 3c (Hazard's map layers) and 3d, 3e (not run), copied as published
- **[#3 · SimCenter copy of Hazus 5.1](https://github.com/NHERI-SimCenter/DamageAndLossModelLibrary/blob/869423b9ad21a8bfe5c40eee8db9eee13e4f61b9/src/dlml/data/hurricane/building/portfolio/Hazus%20v5.1%20original/loss_repair.csv)** (no number on the curve comes from it)
  - Says: an independent copy of the same FEMA numbers; matches at all 41 wind speeds
  - So: nothing new on the curve; it confirms the numbers were copied correctly
- **[#10 · Hazard building profile](https://github.com/aamani-ai/Hazard_Modeling/blob/8b0d61c88fbcf85daa1c098516cee22398cdb524/docs/plans/_cross_cutting/real_estate_conus/reference_candidates.yml)** (no number on the curve comes from it)
  - Says: 3 storeys, TPO membrane roof, 33 % windows, no shutters
  - So: no number on the curve; it picks which FEMA record is used
- **[#1 · FEMA Hazus 7.0 hurricane manual](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-hutm_06272025_0.pdf)** (no number on the curve comes from it)
  - Says: a ‘medium’ window area is 25–40 % of the wall (section 9.6.10)
  - So: no number on the curve; it is why 33 % windows count as medium

**On the Damage dashboard:** [3a · open terrain](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_OFF_HAZUS_SECBM_OPEN) · [3b · suburban](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_OFF_HAZUS_SECBM_SUBURBAN) · [3c · trees](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_OFF_HAZUS_SECBM_TREES) · [3d · light suburban](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_OFF_HAZUS_SECBM_LIGHT_SUBURBAN) · [3e · light trees](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_OFF_HAZUS_SECBM_LIGHT_TREES)

This is FEMA's curve for a steel-framed commercial building of three to five storeys. None of these numbers is a measured loss: they are FEMA's modelled values from its Hazus spreadsheet [[#2](https://os-climate-physical-risk.s3.amazonaws.com/vulnerability/HazusWindDamFunctions_Hazus61.xlsx)], checked against SimCenter's copy [[#3](https://github.com/NHERI-SimCenter/DamageAndLossModelLibrary/blob/869423b9ad21a8bfe5c40eee8db9eee13e4f61b9/src/dlml/data/hurricane/building/portfolio/Hazus%20v5.1%20original/loss_repair.csv)]. Nothing was chosen by judgment, because every setting is read from Hazard's profile: three storeys, a single-ply membrane roof, 33 % windows, which Hazus calls medium, and no shutters.

The two settings that the profile does not state, the debris environment and the metal-deck fastening, take the most common value. Two oddities are FEMA's and are kept as printed. The curve flattens at about 81 % instead of reaching total loss, because Hazus caps commercial losses at the rebuild cost after adding its repair and overhead factors. And the light-suburban line sits above the open-terrain line from 105 mph upward.

Half is lost at about 147 mph in open terrain and 152 mph in a suburb. At 120 mph the office loses 14 %, against 31 % for the house. The curve is used for every office placement.

## Curves 4a to 4e · low-rise retail (Hazus SECBL): kept from an earlier version, used by no Hazard building

- **Curve 4a:** Low-rise retail · open terrain (not used by Hazard)
- **Curve 4b:** Low-rise retail · suburban (not used by Hazard)
- **Curve 4c:** Low-rise retail · trees (not used by Hazard)
- **Curve 4d:** Low-rise retail · light suburban (in FEMA's table, not run by Hazard)
- **Curve 4e:** Low-rise retail · light trees (in FEMA's table, not run by Hazard)

**What each source says, and what that means for the line**

- **[#2 · FEMA Hazus 6.1 wind-function extract](https://os-climate-physical-risk.s3.amazonaws.com/vulnerability/HazusWindDamFunctions_Hazus61.xlsx)** (numbers on the curve come from it)
  - Says: FEMA building record 1812: a loss value every 5 mph
  - So: curves 4a, 4b, 4c, 4d, 4e, copied as published; Hazard uses none of them
- **[#3 · SimCenter copy of Hazus 5.1](https://github.com/NHERI-SimCenter/DamageAndLossModelLibrary/blob/869423b9ad21a8bfe5c40eee8db9eee13e4f61b9/src/dlml/data/hurricane/building/portfolio/Hazus%20v5.1%20original/loss_repair.csv)** (no number on the curve comes from it)
  - Says: an independent copy of the same FEMA numbers; matches at all 41 wind speeds
  - So: nothing new on the curve; it confirms the numbers were copied correctly
- **Damage team · our judgment (T4)** (the Damage team’s own choice)
  - Did: picked the roof type, window area and debris setting most common nationally
  - So: this picks which FEMA record becomes the line

**On the Damage dashboard:** [4a · open terrain](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_COM_HAZUS_SECBL_OPEN) · [4b · suburban](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_COM_HAZUS_SECBL_SUBURBAN) · [4c · trees](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_COM_HAZUS_SECBL_TREES) · [4d · light suburban](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_COM_HAZUS_SECBL_LIGHT_SUBURBAN) · [4e · light trees](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_real_estate/curves/TCRE_COM_HAZUS_SECBL_LIGHT_TREES)

This record is kept from an earlier version (0.1) for continuity. It is an engineered commercial building of one or two storeys, and steel and masonry give identical Hazus curves. None of these numbers is a measured loss. The settings were chosen, and all of them are the most common national values: a built-up roof, a low window area and debris environment B, because there is no Hazard profile to read them from.

Like the office curve, it flattens below total loss, at 88 % in open terrain, and the light-suburban line sits above the open line at most speeds. Half is lost at about 153 mph in open terrain. Today nothing on the grid uses this record.

## What the review checked, and why it is usable for screening

The damage-curve review judged every curve by one question: is it good enough for a rough national map? That means the size of the loss is about right, places come out in a sensible order, and the curve says what it leaves out. For each curve it checked that the numbers come from the documents cited, whether it is the right curve for a national map, and whether Hazard feeds it the right input.

### What was checked

The review compared the curves with observed damage speeds. The Enhanced Fujita scale lists the wind speeds at which real houses, warehouses and offices were seen to reach each level of damage, and the review set those speeds against the speeds at which the Hazus curves reach 10 %, 50 % and nearly total loss.

It also compared the curve with one real storm. Insured claims after Hurricane Charley (2004) in Charlotte County, Florida, averaged about $24 per square foot for homes built before 1996 and $14 for homes built after, which is roughly 13 to 30 % of the cost to rebuild. At Charley's estimated gusts of 125 to 140 mph, the open-terrain curve gives 43 to 78 %.

Finally, it looked at the settings around the curve: which terrain Hazard uses, which roof connections the house record assumes, and how Hazard turns the storm model's wind into a gust.

### Why it is usable for screening

FEMA's Hazus model follows the whole chain of hurricane damage in one record: roof covering, roof deck, roof-to-wall connections, windows and doors, flying debris, and rain coming in through the breaks. Nothing is left out or counted twice.

The curves reach each damage level 6 to 15 mph above the Fujita speeds, inside every Fujita band. That is the right order and the right shape, and Fujita ratings are known to be on the cautious side.

### What to keep in mind

Three things push losses on the coast too high. Hazard's open-terrain setting assumes nothing slows the wind; on suburban housing it roughly triples the loss at 120 mph (31 % against 9 %), which is why the Charley claims came out several times lower than the curve. The house uses the national default roof connections everywhere, while Florida and Gulf homes built since 2002 follow the building code (19 % instead of 31 % at 120 mph).

One thing pulls the other way: Hazard converts the 10-minute storm wind to a gust with a factor of 1.364, where the standard open-terrain factor is about 1.43. On the steep part of the house curve that moves the loss by up to a third.

Wind and storm surge on the same building in the same storm cannot yet be capped together at 100 %.

### What would change the verdict

A county-by-county comparison with the hurricane losses in FEMA's National Risk Index would test it (a ratio outside roughly 0.3 to 3 would send the curve back), and so would Hazard confirming a different gust factor.

In short: hurricane and real estate adopts FEMA's printed loss tables whole, re-checked digit for digit against an independent copy, so the shape, the steepness and the speeds at which half is lost are all FEMA's. The Damage team's part is choosing which of FEMA's building variants matches each Hazard building, from the profile where it says and from the most common national setting where it does not. The Damage repository itself has no comparison of these curves with real storm losses; the review's comparisons are in the section above. In the source table, FEMA’s spreadsheet and its independent copy are group A, the manual behind the choices is group D, and the building profiles are group F.

## All 10 listed sources, sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’. The register ID is in brackets. No source here gives a measured point that the curve was built from, and none is a pass or fail test turned into a point, so there are no groups for those. No source in the cell compares the curve with real storm losses either.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **A · Gives the curve itself: a published curve or table used as printed, or a curve copied from another cell** | | |
| 2 | **FEMA Hazus 6.1 hurricane damage and loss function extract, HazusWindDamFunctions\_Hazus61.xlsx (TCRE-S002)**<br>[os-climate-physical-risk.s3.amazonaws.com … HazusWindDamFunctions\_Hazus61.xlsx](https://os-climate-physical-risk.s3.amazonaws.com/vulnerability/HazusWindDamFunctions_Hazus61.xlsx)<br>Where to look: sheet huDamLossFun, the building-loss rows for the house (wbID 6), warehouse (1730), office (1840) and retail (1812), terrains 1 to 5, wind speeds 50 to 250 mph. | Gives the numbers: every line on curves 1 to 4 except 1f is copied from this spreadsheet. FEMA’s Hazus team supplied it; OS-Climate hosts it (see #4). |
| 3 | **NHERI SimCenter Damage and Loss Model Library, Hazus v5.1 hurricane loss\_repair.csv @ 869423b (TCRE-S003)**<br>[github.com … loss\_repair.csv](https://github.com/NHERI-SimCenter/DamageAndLossModelLibrary/blob/869423b9ad21a8bfe5c40eee8db9eee13e4f61b9/src/dlml/data/hurricane/building/portfolio/Hazus%20v5.1%20original/loss_repair.csv)<br>Where to look: The rows for the same four buildings (house, warehouse, office and retail) and the column holding the loss values. | Gives line 1f, the house built to the coastal code. It is also a second, independent copy of FEMA’s numbers: all 20 curves match #2 exactly at all 41 wind speeds. |
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| 1 | **FEMA Hazus 7.0 Hurricane Model Technical Manual, June 2025 (TCRE-S001)**<br>[fema.gov … fema\_rsl\_hazus-7-hutm\_06272025\_0.pdf](https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-hutm_06272025_0.pdf)<br>Where to look: section 2.1 (what one curve includes), section 4.3 (the gust it is read with), section 8.1.7.2 (why business curves stop below 100 %), Table C-2 (the most common building settings) and sections 9.6.6 and 9.6.10 (roof-deck age and window classes). | Gives no number. It tells us what each curve already includes (wind, flying debris and rain), which FEMA version of each building is the most common one, and how the facts in Hazard’s building profiles map to Hazus settings. |
| **E · Decides what the bottom axis means** | | |
| 5 | **Hazard\_Modeling hurricane peril, consumer contract (TCRE-S005)**<br>[github.com … fundamentals.md](https://github.com/aamani-ai/Hazard_Modeling/blob/e8664800/docs/hazards/hurricane/fundamentals.md)<br>Where to look: fundamentals.md lines 10–14 and 64–71, and storm\_return\_periods.py lines 22–46 (the conversion from STORM’s 10-minute wind to a 3-second gust). | Gives no number to the curve. It shows Hazard delivers the same wind measure the curves are read with: the strongest 3-second gust at 10 m, open terrain, in mph. The conversion factor (1.364) is Hazard’s; the review thinks it is about 5 % low. |
| 9 | **Damage cells tropical\_cyclone\_wind\_wind v1.2 and tropical\_cyclone\_wind\_solar v2.1 (TCRE-S009)**<br>[github.com … current](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_wind/current/)<br>Where to look: the hazard\_axis and hazard\_scope entries in each cell’s curve file. | Gives no number. Keeps this cell consistent with the hurricane cells for wind farms and solar: the same wind measure, and hurricane category is not an input. |
| **F · Turns the curve into dollars** | | |
| 10 | **Hazard\_Modeling real-estate reference profiles r1 (TCRE-S010)**<br>[github.com … reference\_candidates.yml](https://github.com/aamani-ai/Hazard_Modeling/blob/8b0d61c88fbcf85daa1c098516cee22398cdb524/docs/plans/_cross_cutting/real_estate_conus/reference_candidates.yml) | Gives each building’s rebuild budget (the dollars, held back until Hazard confirms what they cover) and the facts that pick the Hazus settings for the office and warehouse: storeys, roof, windows and roof age. |
| 6 | **Damage flood\_real\_estate v0.1 (reference buildings and value basis) (TCRE-S006)**<br>[github.com … REFERENCE\_BUILDINGS\_flood\_real\_estate\_\_model\_v0\_1\_\_docs\_r1.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_real_estate/proposed/REFERENCE_BUILDINGS_flood_real_estate__model_v0_1__docs_r1.md)<br>Where to look: sections 1, 3 and 4: the same building IDs and the same value basis (the cost of rebuilding the structure new). | Gives no number. Puts wind and flood on the same buildings and the same dollar basis, so one storm’s wind and water losses can be added together and capped at 100 %. |
| **H · Method and template** | | |
| 7 | **Hazard plan doc 06, Real estate: asset types, OSM mapping and the first CONUS grid run (TCRE-S007)**<br>[listed in the cell’s source register](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_real_estate/proposed/SOURCE_REGISTER_tropical_cyclone_wind_real_estate__model_v0_1__docs_r1.csv)<br>Where to look: Sections 5 to 8. The plan document itself is not on GitHub, so the link goes to its entry in the cell’s source register. | Gives no number. It is the request that started this cell: which buildings to cover and the Hazus types to try (WSF1, SECBL, SPMBL). |
| **I · Background only, no number taken** | | |
| 4 | **OS-Climate physrisk documentation, Hazus wind damage functions (TCRE-S004)**<br>[physrisk.readthedocs.io … onboard.html](https://physrisk.readthedocs.io/en/latest/user_guide/vulnerability/vulnerability_functions/wind_hazus/onboard.html)<br>Where to look: the page text saying FEMA’s Hazus team supplied the 6.1 spreadsheet. | Shows where #2 comes from: FEMA’s Hazus team gave that spreadsheet to OS-Climate. Only the spreadsheet is used, none of OS-Climate’s own calculations. |
| **J · Not used by this curve: listed to show what was looked at, and why it was left out** | | |
| 8 | **Legacy hazard\_analysis curves: hurricane residential and strong-wind arrays (TCRE-S008)**<br>[github.com … damage\_curves\_data.csv](https://github.com/aamani-ai/hazards/blob/9bc9c30fd9c62f4bd72d5561220538968c846a5e/tools/damage_curves/data/damage_curves_data.csv)<br>Where to look: The file at commit 9bc9c30 of the older hazards repository. | Not used: the old curve does not say which gust it means, ignores terrain and building type, and stops rising near 37 %. Listed so it is clear why this existing curve was not reused. |
| — | **Model v0.1 of this cell**<br>[tropical\_cyclone\_wind\_real\_estate\_\_model\_v0\_1\_\_docs\_r1\_\_curve\_artifact.json](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_real_estate/proposed/tropical_cyclone_wind_real_estate__model_v0_1__docs_r1__curve_artifact.json) | Old-deck warehouse (wbID 1729, curve 2f) and no office record. Kept for reproducibility. |

**Gaps between the dossier and the evidence files, found while building this page.** (1) The v0.2 workbook has no Evidence\_Log, Evidence\_Params or Assumption\_Register sheets; the 31-row claim register plays that role. (2) The parameter tier table inside the v0.2 artifact is still the v0.1 table: it names the warehouse record wbID 1729 with an “old roof deck” and has no row for the office (SECBM, wbID 1840), although the v0.2 records use wbID 1730 (new or average deck) and add the office.
