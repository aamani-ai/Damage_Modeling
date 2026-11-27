Damage-curve review · wildfire × real estate

# Wildfire × real estate curve, where its numbers come from

A wildfire curve for a building answers one question: **if a wildfire burns through the area with flames of a given length, what share of the cost of rebuilding the building is lost?** Unlike hail and solar, no laboratory counted anything here.

The curve is a short table published by the US Forest Service, one number for each of six flame-length classes, used as printed for a house, and then scaled for a warehouse and an office by ratios measured in California’s post-fire inspections. The bottom axis is not a measurement at the building: it is the flame length of the wildland fire in the surrounding 270 metre cell, which Hazard supplies.

These curves have not been formally released yet: in the Damage repository they are still marked as a proposal (model v0.1). Hazard already uses the same curves, through a newer release (model v1.0) on a Damage branch.

The dashboard calls these curves “borrowed” (tier T3): here that means a published agency table whose numbers are a stated assumption, and measured ratios carried over from similar buildings, not anything copied from another asset. The dashboard’s word covers the curve’s shape; reading the result as a share of rebuild cost is a separate tier T4 choice, which the dashboard shows as “our judgment”.

## Curves 1a to 1c: one-storey wood house

Curves 1a to 1c · house: half lost at the 4 to 6 ft class · borrowed (T3); reading as rebuild cost our judgment (T4)

- **Curve 1a:** House · the cell’s curve, any flame source
- **Curve 1b:** House · tree fire (in the source, not used)
- **Curve 1c:** House · grass fire (in the source, not used)

**What each source says, and what that means for the line**

- **[#1 · US Forest Service response table](https://www.fs.usda.gov/rds/archive/products/RDS-2020-0016-2/_metadata_RDS-2020-0016-2.html)** (numbers on the curve come from it)
  - ① to ⑥: 20, 35, 50, 65, 80 and 95 % for flame classes 1 to 6 (shrub); a stated assumption, no field data behind it
- **[#2 · CAL FIRE inspections, 2013 to 2025](https://gis.data.cnra.ca.gov/api/download/v1/items/994d3dc4569640caadbbc3198d5a3da1/csv?layers=0)** (numbers on the curve come from it)
  - 12,188 one-storey wood or vinyl houses lost 29 to 65 % on average, depending on which fires are counted; no flame length recorded
- **Damage team, D-WFRE-05 and D-WFRE-06** (the Damage team’s own choice)
  - shrub numbers everywhere (Hazard gives no vegetation type); loss read as a share of rebuild cost (our judgment)

**On the Damage dashboard:** [1a · house](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_real_estate/curves/WFRE_RES_WRC_SHRUB) (curves 1b and 1c, tree and grass fire, are in the source but not used, so they are not on the dashboard)

The six dots are the six numbers the US Forest Service printed for a home in shrub country, one for each flame-length class, in its Wildfire Risk to Communities data (source [#1](https://www.fs.usda.gov/rds/archive/products/RDS-2020-0016-2/_metadata_RDS-2020-0016-2.html), process step 5 of the metadata page, re-read on 13 November): 20 % when the flames are under 2 ft, then 35, 50, 65 and 80 %, and 95 % when they reach 12 ft or more.

The Forest Service describes these numbers as an assumption about the relative effect of fire on a structure and publishes no inspections or tests behind them, so nothing on this curve was measured in the way the hail counts were. That is why the dashboard calls the curve borrowed rather than published. Three choices around the numbers are our judgment. The Forest Service’s degree of loss is read as the share of the cost of rebuilding the house (decision D-WFRE-06).

The shrub numbers are used everywhere because Hazard does not say whether a place is forest, shrub or grass (decision D-WFRE-05); the tree version (curve 1b) is 5 points higher and the grass version (curve 1c) 10 to 15 points lower. And the Forest Service’s 30 metre flame classes are treated as the same thing as Hazard’s 270 metre classes, because they share the same boundaries (claim WFRE-C005).

The CAL FIRE range is a check, not a dot: CAL FIRE inspected 12,188 one-storey wood or vinyl-sided houses after California fires, and their average loss lies between 29 and 65 % depending on which fires are counted (source [#2](https://gis.data.cnra.ca.gov/api/download/v1/items/994d3dc4569640caadbbc3198d5a3da1/csv?layers=0)). Those inspections record no flame length, so the band covers every class. The halfway point means that where the wildfire burning through the area has flames of 4 to 6 ft, about half of the cost of rebuilding the house is lost.

The curve is used for every house on the real-estate grid once a fire reaches its cell; how often a fire comes is a separate Hazard number and never enters the curve. Contents are withheld. The review (v5, section A.19) thinks the level is probably high: a national count of buildings inside every US fire perimeter from 2000 to 2013 found about 11 % destroyed (Kramer and colleagues, 2018), and CAL FIRE inspectors mostly visit damaged buildings.

## Curve 2: one-storey steel warehouse

Curve 2 · warehouse: half passed at the 6 to 8 ft class · borrowed (T3); factor applied to this building our judgment (T4)

- **Curve 2:** Warehouse · the house curve × 0.8
- **Curve 1 (for comparison):** House, as above

**What each source says, and what that means for the line**

- **[#1 · US Forest Service response table](https://www.fs.usda.gov/rds/archive/products/RDS-2020-0016-2/_metadata_RDS-2020-0016-2.html)** (numbers on the curve come from it)
  - the house numbers, 20 to 95 % (curve 1, for comparison)
- **[#2 · CAL FIRE inspections, same fires](https://gis.data.cnra.ca.gov/api/download/v1/items/994d3dc4569640caadbbc3198d5a3da1/csv?layers=0)** (numbers on the curve come from it)
  - metal commercial buildings lost 0.79 times as much as wood houses; 90 % range 0.61 to 0.99
- **Damage team, decision D-WFRE-07** (the Damage team’s own choice)
  - rounded to 0.8, used at every flame class and for this warehouse (our judgment)

**On the Damage dashboard:** [2 · warehouse](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_real_estate/curves/WFRE_IND_WRC_SHRUB_X0_8)

This curve is the house curve multiplied by 0.8. The 0.8 comes from CAL FIRE’s inspections (source [#2](https://gis.data.cnra.ca.gov/api/download/v1/items/994d3dc4569640caadbbc3198d5a3da1/csv?layers=0)): inside the same fires, metal-wall, metal-roof commercial buildings lost 0.79 times as much of their value as the wood houses, counted over 258 buildings in 38 fires, with a 90 % range of 0.61 to 0.99. That ratio is measured, but it is a group average for California commercial buildings of any size and use.

The reference warehouse is far larger (100,000 square feet) and sprinklered, which could make it do better (claim WFRE-C010); the cell keeps 0.3 and 1.0 as sensitivities. Applying it to this warehouse, rounding it to 0.8 and using the same factor at every flame class are our judgment (decision D-WFRE-07; CAL FIRE records no flame length, so a ratio per class cannot be estimated).

Pooled over all fires instead of fire by fire, the ratio would look much smaller, but that mostly reflects which fires hit which buildings (section 6 of the dossier). On this curve the warehouse loses 40 % of its rebuild cost at the 4 to 6 ft class and 52 % at 6 to 8 ft, so about half is lost once flames reach 6 to 8 ft.

The curve is used for every warehouse on the real-estate grid once a fire reaches its cell; contents are withheld.

## Curve 3: three-storey office

Curve 3 · office: half passed at the 6 to 8 ft class · borrowed (T3); factor applied to this building our judgment (T4)

- **Curve 3:** Office · the house curve × 0.9
- **Curve 1 (for comparison):** House, as above

**What each source says, and what that means for the line**

- **[#1 · US Forest Service response table](https://www.fs.usda.gov/rds/archive/products/RDS-2020-0016-2/_metadata_RDS-2020-0016-2.html)** (numbers on the curve come from it)
  - the house numbers, 20 to 95 % (curve 1, for comparison)
- **[#2 · CAL FIRE inspections, same fires](https://gis.data.cnra.ca.gov/api/download/v1/items/994d3dc4569640caadbbc3198d5a3da1/csv?layers=0)** (numbers on the curve come from it)
  - masonry commercial buildings lost 0.93 times as much as wood houses; 90 % range 0.66 to 1.38
- **Damage team, decision D-WFRE-07** (the Damage team’s own choice)
  - rounded to 0.9, used at every flame class and for this office (our judgment)

**On the Damage dashboard:** [3 · office](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_real_estate/curves/WFRE_OFF_WRC_SHRUB_X0_9)

This curve is the house curve multiplied by 0.9. The 0.9 comes from CAL FIRE’s inspections (source [#2](https://gis.data.cnra.ca.gov/api/download/v1/items/994d3dc4569640caadbbc3198d5a3da1/csv?layers=0)): inside the same fires, multi-storey stucco, brick or cement commercial buildings lost 0.93 times as much of their value as the wood houses, counted over 204 buildings in 17 fires, with a 90 % range of 0.66 to 1.38. That ratio is measured, but it is a group average for California commercial buildings of any size and use.

The 90 % range goes above 1, which means the data cannot rule out offices doing worse than houses; the reference office is 54,000 square feet and sprinklered, unlike most of the inspected buildings (claim WFRE-C010). Applying it to this office, rounding it to 0.9 and using the same factor at every flame class are our judgment (decision D-WFRE-07; CAL FIRE records no flame length, so a ratio per class cannot be estimated).

Pooled over all fires instead of fire by fire, the ratio would look much smaller, but that mostly reflects which fires hit which buildings (section 6 of the dossier). On this curve the office loses 45 % of its rebuild cost at the 4 to 6 ft class and 58.5 % at 6 to 8 ft, so about half is lost once flames reach 6 to 8 ft.

The curve is used for every office on the real-estate grid once a fire reaches its cell; contents are withheld.

In short: every number on these curves starts from six values the Forest Service states as an assumption for homes in shrub country; CAL FIRE’s inspections give the two measured ratios that scale them for the warehouse and the office and a rough check on the house level; and the team’s own choices are the vegetation default, reading the values as rebuild-cost shares, and applying commercial-building ratios to these two particular buildings. In the source table, the number of sources in each group is: A (the curve itself) 1, B (measured dots) 1, D (shape and choices) 2, E (bottom axis) 2, F (dollars) 1, H (method) 1, I (background) 1.

## All 8 listed sources, sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’. The register ID is in brackets.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **A · Gives the curve itself: a published curve or table used as printed, or a curve copied from another cell** | | |
| 1 | **US Forest Service, Wildfire Risk to Communities, 2nd edition (RDS-2020-0016-2), metadata (WFRE-S001)**<br>[fs.usda.gov … \_metadata\_RDS-2020-0016-2.html](https://www.fs.usda.gov/rds/archive/products/RDS-2020-0016-2/_metadata_RDS-2020-0016-2.html)<br>Where to look: Process step 5: “20, 35, 50, 65, 80, 95 for FLP1 – FLP6 respectively, for shrub life form”; 0 means no damage and −100 complete loss. | Gives the curve: the six green dots on curve 1 and, through the factors, every number on curves 2 and 3. Also the tree and grass rows used as sensitivities. The page calls them an assumption and gives no derivation (claim WFRE-C003). |
| **B · Puts a measured dot on a curve** | | |
| 2 | **CAL FIRE Damage Inspection (DINS) master table, 2013 to 2025 (WFRE-S002)**<br>[gis.data.cnra.ca.gov … csv](https://gis.data.cnra.ca.gov/api/download/v1/items/994d3dc4569640caadbbc3198d5a3da1/csv?layers=0)<br>Columns Damage, Structure Type, Exterior Siding, Roof Construction, Incident Name; 132,522 rows. Ratios and levels in [the CAL FIRE comparison CSV](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_real_estate/proposed/DINS_BUILDING_COMPARISON_wildfire_real_estate__model_v0_1__docs_r1.csv). Computed by the cell’s script. | Gives measured dots: the 0.79 and 0.93 same-fire ratios behind the 0.8 and 0.9 factors (the blue bands on curves 2 and 3), and the 29 to 65 % house level shown as the blue band on curve 1. A check on level, not a calibration. |
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| — | **The numbers we chose: Damage team decisions D-WFRE-05, D-WFRE-06 and D-WFRE-07**<br>[decision log](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_real_estate/proposed/DECISION_LOG_wildfire_real_estate__model_v0_1__docs_r1.md)<br>Where to look: Shrub as the default vegetation; loss read as rebuild-cost share; factors rounded to 0.8 and 0.9 and applied at every class. Not one of the 8 listed sources. | Gives the numbers: the choices labelled our judgment on curves 1 to 3. |
| 7 | **Syphard and Keeley 2019, Factors Associated with Structure Loss in the 2013 to 2018 California Wildfires, Fire 2(3):49 (WFRE-S007)**<br>[mdpi-res.com … fire-02-00049.pdf](https://mdpi-res.com/d_attachment/fire/fire-02-00049/article_deploy/fire-02-00049.pdf)<br>Where to look: Abstract, p. 1: features that keep embers out explained more than defensible space; any single factor explained little; many fire-safe houses were destroyed. | Gives no number. Why no credit is given for vents, materials or clearance, and why a class-based curve is a screening average, not a prediction for one building. |
| **E · Decides what the bottom axis means** | | |
| 3 | **US Forest Service FSim 270 m wildfire risk components, 3rd edition (RDS-2016-0034-3), metadata (WFRE-S003)**<br>[fs.usda.gov … \_metadata\_RDS-2016-0034-3.html](https://www.fs.usda.gov/rds/archive/products/RDS-2016-0034-3/_metadata_RDS-2016-0034-3.html)<br>Where to look: Entity and attribute section: FLP1 under 2 ft, FLP2 2 to under 4 ft … FLP6 12 ft and more; the classes are conditional on a fire and must be used with burn probability. | Sets the bottom axis: the six classes on the bottom axis. |
| 5 | **Hazard wildfire layer and its damage consumer, Hazard\_Modeling @ 08748ae (WFRE-S005)**<br>[github.com … wildfire](https://github.com/aamani-ai/Hazard_Modeling/tree/08748ae5217e18e2f6c3aec482ee579e32d9f7b6/perils/wildfire)<br>Where to look: perils/wildfire/src/wildfire/damage.py (exact class 0 to 6, burn probability refused in the damage call); docs/hazards/wildfire/modeling\_choices.md; drivers/conus\_grid/…/adapter.py (fire couples to the whole cell). | Sets the bottom axis: hazard delivers the exact class and no vegetation type; also the inputs for the National Risk Index check. |
| **F · Turns the curve into dollars** | | |
| 4 | **Hazard reference profiles r1 (WFRE-S004)**<br>[github.com … reference\_candidates.yml](https://github.com/aamani-ai/Hazard_Modeling/blob/8b0d61c88fbcf85daa1c098516cee22398cdb524/docs/plans/_cross_cutting/real_estate_conus/reference_candidates.yml)<br>Profiles re\_house\_1s\_wood\_slab, re\_warehouse\_1s\_steel\_slab, re\_office\_3s\_slab; value rows in [the value crosswalk](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_real_estate/proposed/VALUE_CROSSWALK_wildfire_real_estate__model_v0_1__docs_r1.csv). | Turns the curve into dollars: names the three buildings and their construction (vented attic, vinyl siding; metal panels and sprinklers; masonry veneer and sprinklers) and carries the screening rebuild budgets. Dollars stay withheld until those budgets are qualified as structure replacement cost new. |
| **H · Method and template** | | |
| 8 | **Damage repository wildfire cells and station binding (wildfire × solar, wildfire × wind, substation wildfire binding) (WFRE-S008)**<br>[github.com … docs](https://github.com/aamani-ai/Damage_Modeling/tree/81d5309313d53f37d6bac91e22dd55b498101d0f/docs)<br>Where to look: wildfire\_wind v1.0 artifact: hazard axis and selector logic. | Gives no number. Method: the exact-class axis with no interpolation, copied from the sibling cells. |
| **I · Background only, no number taken** | | |
| 6 | **FEMA National Risk Index, December 2025, county building loss for wildfire (Hazard team copy) (WFRE-S006)**<br>[github.com … SOURCE\_REGISTER\_wildfire\_real\_estate\_\_model\_v0\_1\_\_docs\_r1.csv](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_real_estate/proposed/SOURCE_REGISTER_wildfire_real_estate__model_v0_1__docs_r1.csv)<br>gs://infrasure-benchmark/…/nri\_raw\_conus.parquet, columns wfir\_ealb and wfir\_expb; results in [the NRI check CSV](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_real_estate/proposed/NRI_CHECK_wildfire_real_estate__model_v0_1__docs_r1.csv). | Gives no number. Background: an order-of-magnitude check of yearly loss on Hazard’s grid: about 2 times NRI for houses, ranking correlation 0.88. It sets no number on the curve. |

**Gaps worth knowing, found while building this page.** (1) The workbook has no Evidence\_Log, Evidence\_Params or Assumption\_Register sheets; the 14-row claim register and the decision log play those roles, and every number above traces to one of them. (2) The dossier calls the Forest Service level “consistent” with CAL FIRE. The review (v5, A.19) points out that the inspections mostly visit damaged buildings, so the agreement says less than it seems; no number in the cell measures the level at a known flame class. (3) The Forest Service writes loss on a scale where −100 means complete loss; the cell uses the size of the number (20 for 20 %). That reading is labelled our judgment (decision D-WFRE-06).
