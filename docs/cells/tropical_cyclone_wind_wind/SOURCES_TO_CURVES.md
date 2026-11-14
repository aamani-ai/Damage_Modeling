Damage-curve review · hurricane wind × wind farm

# Hurricane × wind farm curve, where its numbers come from

A hurricane curve for a wind farm answers one question: **when a storm's strongest gust at a turbine reaches a given speed, what share of the value is lost?**

Here the curve comes from a published study: the 2020 tower fragility study by Jaimes and colleagues [[#1](https://doi.org/10.1002/we.2436)]. It simulated how the steel towers of three turbine sizes bend, yield and collapse in hurricane winds, and fitted one smooth curve per tower size.

The Damage team uses that curve exactly as printed, on the study's own wind measure, and applies it only to the tower, because the study models nothing else.

### What the labels on this page mean

A cell is one hazard × asset pair in the Damage repository, and its dossier is the write-up of how its curves were built.

Each curve is marked by how well it is backed:

- **published (T2)**: taken from a published source and used unchanged
- **borrowed (T3)**: a published result carried over to a case it was not made for
- **our judgment (T4)**: numbers the Damage team chose

Withheld means no number is given, because nobody knows; it is not the same as zero.

## Curves 1a to 1c: the three published tower curves

- **Curve 1a:** Turbine tower · 1 MW, 44 m hub
- **Curve 1b:** Turbine tower · 2.5 MW, 80 m hub
- **Curve 1c:** Turbine tower · 3.3 MW, 100 m hub

**What each source says, and what that means for the line**

- **[#1 · Jaimes and colleagues 2020 (Wind Energy)](https://doi.org/10.1002/we.2436)** (numbers on the curve come from it)
  - Says: fitted tower-loss curves for 1, 2.5 and 3.3 MW turbines, from simulated storms of 108 to 252 km/h
  - So: curves 1a, 1b, 1c, copied as published
- **[#1 · same paper: repair cost per damage state](https://doi.org/10.1002/we.2436)** (numbers on the curve come from it)
  - Says: to turn tower damage into money, the authors assumed a bent tower costs 5 % of the turbine's value to fix, a permanently deformed one 50 % and a collapsed one 100 %
  - So: built into curves 1a to 1c; these costs were assumed, never measured

**On the Damage dashboard:** [1a · 1 MW tower](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_wind/curves/TCWW_JAIMES_1MW_44M_SCREENING) · [1b · 2.5 MW tower](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_wind/curves/TCWW_JAIMES_2P5MW_80M_SCREENING) · [1c · 3.3 MW tower](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_wind/curves/TCWW_JAIMES_3P3MW_100M_SCREENING)

**Where these three curves come from.** The study by Jaimes and colleagues [[#1](https://doi.org/10.1002/we.2436)] built a structural computer model of the steel tower of three typical turbines (1 MW, 2.5 MW and 3.3 MW) and worked out how likely the tower is to bend, yield or collapse at each hurricane wind speed. They then turned those chances into a cost: 5 % of the turbine for bending, 50 % for yielding, 100 % for collapse.

The paper says these three costs were assumed, because no real loss data existed. The result is one smooth curve per tower size, printed in Table 3 of the paper, and the cell copies all three exactly.

**How to read the curve.** The bottom axis is the strongest 3-second gust at 10 m above ground, in km/h. The curve is zero up to 90 km/h, because turbines shut down in such wind and the authors assumed no damage there. It then rises steeply. Half the tower's value is lost at 163.3 km/h (about 101 mph) for the 3.3 MW tower, 172.52 km/h for the 2.5 MW and 196.77 km/h for the 1 MW.

**The withheld ranges.** The paper only ran its model for winds between 108 and 252 km/h. For these three curves the cell gives no number between 90 and 108 km/h or above 252 km/h, because the paper has no results there: those ranges are withheld, not zero. The curve the Hazard grid runs (Curve 2a, below) fills both ranges with rules the Damage team chose.

**What is published and what the Damage team chose.** The shape of the curve is the paper's: borrowed (T3), because it is a published model of generic towers applied to real ones. Three things are our judgment (T4): the repair cost given to each damage state, the zero below 90 km/h, and the share of the farm the curve is applied to.

The repair costs and the zero are assumptions the paper's authors made rather than measurements, so the cell grades them as judgment too. The three curves can be checked in Table 3 of the paper [[#1](https://doi.org/10.1002/we.2436)].

## Curves 2a and 2b: the wind farm, priced on the tower only

- **Curve 2a:** Turbine tower · the 3.3 MW curve (the same numbers as Curve 1c), used for the platform's standard 5 MW turbine, as a share of the tower. This is the fourth curve on the Damage dashboard
- **Curve 2b:** Wind farm · Curve 2a × 0.16, as a share of the whole farm (this is not on the Damage dashboard; it is shown on the explainer page only to show what the tower loss means for the whole farm)

**What each source says, and what that means for the line**

- **Damage team and project owner: tower only** (the Damage team’s own choice)
  - Did: kept the 5 MW turbine on the 3.3 MW curve as it is and priced the tower only: 16 % of the farm; the other 84 % is withheld
  - So: curve 2b is curve 2a × 0.16 (version 1.2 decision log; our judgment, T4)
- **[#3 · standard wind farm reference profile](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_wind/current/VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v1_2__docs_r2.csv)** (numbers on the curve come from it)
  - Says: 20 turbines of 5 MW: 100 MW, 140 million dollars; tower share 16 %
  - So: the 16 % that scales curve 2b comes from here
- **[#6 · NREL Cost of Wind Energy Review 2024](https://www.nrel.gov/docs/fy25osti/91775.pdf)** (no number on the curve comes from it)
  - Says: the tower is 17.0 % of the plant's physical value (276 of 1,623 dollars per kW)
  - So: not on the curve yet: curve 2b still uses the older 16 % from #3. A proposed update would switch to 17 %, which raises the farm loss by about 6 %

**On the Damage dashboard:** [2a and 2b · the tower curve the grid runs](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/tropical_cyclone_wind_wind/curves/TCWW_JAIMES_3P3MW_AS_CANONICAL_5MW_TOWER_PROXY_V1)

**Which curve the Hazard grid uses.** The Damage dashboard shows four curves for this pair. Three are the paper's own curves above (1a to 1c). The fourth, Curve 2a, is the one the Hazard grid actually runs: the 3.3 MW curve, unchanged, labelled as standing in for the platform's standard 5 MW turbine. No published curve exists for a 5 MW tower, so the project owner approved using the nearest one as it is, without scaling.

**Why the farm line never goes above 16 %.** The paper models the tower and nothing else, so the curve is applied only to the tower's value: 16 % of the standard 140 million dollar farm [[#3](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_wind/current/VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v1_2__docs_r2.csv)]. NREL's 2024 cost review [[#6](https://www.nrel.gov/docs/fy25osti/91775.pdf)] puts the tower at 17.0 %. A proposed update, not yet released, would switch to that figure, and the dashboard already shows 17 %.

Curve 2a is the tower curve as a share of the tower, and curve 2b is the same curve times 0.16, as a share of the whole farm. Even if every tower collapses, the farm line stops at 16 %.

**What happens to the other 84 %.** Blades, nacelle, foundations, pad electrical, collection cables, the substation and roads have no curve. For them the cell gives no number: they are withheld, neither counted as zero nor counted as damaged. Any total built from this curve must carry the label "tower only".

**Two rules added so the grid always has an answer.** The grid has to give a number at every wind speed, so the fourth record fills the two gaps the paper left. Between 90 and 108 km/h it returns zero and marks it "flagged zero". Above 252 km/h it holds the tower at total loss and marks it "beyond the data: our judgment". Both are our judgment (T4).

**Two cautions from the review.** First, an earlier version (1.1) applied the same curve to the rotor, nacelle and tower together (63 % of the farm's value). The hurricane team found that the paper models the tower only, and the current version (1.2) applies it to the tower alone [[#4](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_wind/current/tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_2__docs_r2.md)].

Second, real storms break other parts first. At Punta Lima in Puerto Rico, inside Hurricane María's strongest winds in 2017, the blades snapped on most of the 13 turbines and one tower buckled: the farm was nearly a total loss, while this curve can never show more than 16 %. The curve prices the part that usually holds. Hazard's asset-level runs for real wind farms use a different curve from the same paper, Curve 1b (2.5 MW, 80 m).

## What the review checked, and why it is usable for screening

The damage-curve review judged every curve by one question: is it good enough for a rough national map? That means the size of the loss is about right, places come out in a sensible order, and the curve says what it leaves out. For each curve it checked that the numbers come from the documents cited, whether it is the right curve for a national map, and whether Hazard feeds it the right input.

### What was checked

The review obtained and read the paper behind the curve [[#1](https://doi.org/10.1002/we.2436)]. It confirms what the cell says: three tower sizes (1, 2.5 and 3.3 MW), no damage below 90 km/h, results up to 252 km/h, and the curve numbers in its Table 3.

The review also checked which curve Hazard runs. Hazard's map grid runs Curve 2a: the 3.3 MW, 100 m curve, standing in for a 5 MW turbine. Hazard's asset-level runs for real wind farms use Curve 1b, the 2.5 MW, 80 m curve, placed at the farms' 118 real turbine positions. Both curves come from the same paper.

The review compared the curve with two real wind farms hit by Hurricane María in Puerto Rico in 2017. Santa Isabel (101 MW) was on the weak edge of the storm and reported no real damage, which matches the curve: at those wind speeds it predicts little or no tower damage.

Punta Lima (13 turbines of 2 MW) was inside the strongest winds: the blades broke on most turbines, one tower buckled, and the farm was written off at about $50 million. The tower curve cannot show that, because blades have no curve.

### Why it is usable for screening

It is a published curve, used exactly as published, on the right wind measure (the strongest 3-second gust at 10 m).

At the design gust of the strongest turbine class, the curve reaches its top about where you would expect a tower to fail once its design wind is exceeded.

Hazard labels the result honestly as tower only, with the rest of the farm withheld, and the dashboard shows that label.

### What to keep in mind

It covers the tower only, about a sixth of the farm's value. Blades, nacelle, foundations and electrical parts have no curve, and those are the parts that broke at Punta Lima. Any total built on this curve has to carry the tower-only label, and a wind farm cannot be compared with a solar plant on this number.

Two things sit outside the curve. Hazard turns the storm model's 10-minute average wind into a 3-second gust with a conversion factor that the cell does not write down. And when a turbine loses grid power in a storm it cannot turn its rotor out of the wind; that case, which made the damage at Punta Lima worse, is withheld.

### What would change the verdict

The verdict would improve with curves for the blades and nacelle. A search of 18 sources found no published curve to copy, so they have to be built from the loads in the turbine design standard (IEC 61400-1) and tested against Punta Lima (about 100 % loss) and Santa Isabel (about 0 %).

In short: hurricane and wind farm is one published analytical tower curve, used exactly as printed, priced on the tower alone. The curve’s shape comes from a peer-reviewed structural model, not from observed losses, and the repair costs inside it are the authors’ assumptions; everything that turns it into a wind farm number (the 5 MW stand-in, the 16 % share, the rules that fill the paper's gaps) is the Damage team’s choice, and the parts that usually fail in hurricanes have no curve. In the source table, the paper is group A, the Damage team’s choices and the field reports are group D, and the reference farm and its value split are group F.

## All 7 listed sources (and 1 repository rule), sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’. The register ID is in brackets.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **A · Gives the curve itself: a published curve or table used as printed, or a curve copied from another cell** | | |
| 1 | **Jaimes, M. A.; García-Soto, A. D.; Martín del Campo, J. O.; Pozos-Estrada, A. Probabilistic risk assessment on wind turbine towers subjected to cyclone-induced wind loads. Wind Energy 23(3), 528-546 (2020). DOI 10.1002/we.2436. (JAIMES\_2020\_TC\_WIND\_TURBINE)**<br>[doi.org … we.2436](https://doi.org/10.1002/we.2436)<br>Where to look in the paper: sections 2.3.1 to 2.3.2 and 3.2 to 3.3.5, Tables 2 and 3, Figures 5 and 6, and equations 1 and 11 to 13. | Gives the numbers: the three fitted tower curves drawn as curves 1a to 1c, and the 3.3 MW curve that curve 2 is built from. It also sets the bottom axis (the strongest 3-second gust at 10 m). The paper is behind a paywall. |
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| — | **The numbers themselves: Damage team and owner, decision logs for versions 1.1 and 1.2**<br>[github.com … DECISION\_LOG\_tropical\_cyclone\_wind\_wind\_\_model\_v1\_2\_\_docs\_r2.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_wind/current/DECISION_LOG_tropical_cyclone_wind_wind__model_v1_2__docs_r2.md)<br>Where to look: the decision logs for versions 1.1 and 1.2. | Gives the choices behind curve 2: the 5 MW turbine uses the 3.3 MW curve, zero loss from 90 to 108 km/h, the cap above 252 km/h, and the 16 % tower share (our judgment, T4). |
| 4 | **The Hazard team’s review of 14 August 2026, which found the tower curve was being applied to far more of the farm than the tower (HAZARD\_HURRICANE\_WIND\_FARM\_EAL\_REVIEW\_2026\_08\_14)**<br>[github.com … tropical\_cyclone\_wind\_wind\_curve\_derivation\_dossier\_\_model\_v1\_2\_\_docs\_r2.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_wind/current/tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_2__docs_r2.md)<br>Where to look: the review’s section headed ‘What changed’. | Gives no number. It found that the curve, which only describes the tower, was being multiplied by 63 % of the farm’s value. Version 1.2 fixed this by applying it to the tower’s 16 % only. |
| 5 | **Chen, X.; Xu, J. Z. Structural failure analysis of wind turbines impacted by super typhoon Usagi. Engineering Failure Analysis 60, 391-404 (2016). DOI 10.1016/j.engfailanal.2015.11.028. (TCWW-S008)**<br>[sciencedirect.com … S1350630715301552](https://www.sciencedirect.com/science/article/pii/S1350630715301552)<br>Where to look in the paper: the sections ‘Wind farm damage overview’, ‘Design wind speed’ and ‘Conclusions’. | Gives no number. Its records from Typhoon Usagi show blades and other parts failing, not only towers. That is why those parts are withheld rather than priced with the tower curve. |
| 7 | **Chen, X.; Li, C.; Xu, J. Failure investigation on a coastal wind farm damaged by super typhoon: A forensic engineering study. Journal of Wind Engineering and Industrial Aerodynamics 147, 132-142 (2015). DOI 10.1016/j.jweia.2015.10.007. (TCWW-S014)**<br>[doi.org … j.jweia.2015.10.007](https://doi.org/10.1016/j.jweia.2015.10.007)<br>Where to look in the paper: pages 132 to 136, Tables 1 and 2. | Gives no number. Its field cases include farms where only blades broke and others where towers fell, which is why the curve is limited to the tower. |
| **F · Turns the curve into dollars** | | |
| 2 | **Tower-only scope correction for model v1.2. (OWNER\_SCOPE\_CORRECTION\_2026\_08\_14)**<br>[github.com … DECISION\_LOG\_tropical\_cyclone\_wind\_wind\_\_model\_v1\_2\_\_docs\_r2.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_wind/current/DECISION_LOG_tropical_cyclone_wind_wind__model_v1_2__docs_r2.md)<br>Where to look: decisions TCWW12-D01 and TCWW12-D02 in the cell’s decision log. | Gives the decision behind curve 2: price the tower only, at 16 % of the farm, and withhold the other 84 %. |
| 3 | **Canonical wind-farm screening reference profile. (CONUS\_WIND\_FARM\_REFERENCE\_V1)**<br>[github.com … VALUE\_CROSSWALK\_tropical\_cyclone\_wind\_wind\_\_model\_v1\_2\_\_docs\_r2.csv](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/tropical_cyclone_wind_wind/current/VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v1_2__docs_r2.csv)<br>Where to look: the rows named CONUS\_WIND\_FARM\_TOWER\_16PCT\_V1. | Gives the standard farm the grid uses (20 turbines of 5 MW, 100 MW, $140M) and the tower’s 16 % share that scales curve 2. |
| 6 | **Stehly, T.; Duffy, P.; Mulas Hernando, D. Cost of Wind Energy Review: 2024 Edition. NREL/TP-5000-91775. (TCWW-S010)**<br>[nrel.gov … 91775.pdf](https://www.nrel.gov/docs/fy25osti/91775.pdf)<br>Where to look in the report: the cost breakdown for the land-based reference wind farm. | Gives no number on the curve today. Its cost breakdown puts the tower at 17.0 % of the plant’s physical value (276 of 1,623 dollars per kW); a proposed update would use that in place of 16 %. |
| **H · Method and template** | | |
| — | **Damage Modeling foundations and standards. (GOVERNANCE\_CONTRACT)**<br>[github.com … 00\_index.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/standards/00_index.md)<br>Where to look: standards 02, 06 to 10, 17 and 20 to 23, and contracts 20 and 21. | Repository rule, not a source: the dashboard lists it separately, without a number. The repository’s rules: withheld means withheld, not zero; no silent value mapping. |

**Gaps worth knowing, found while building this page.** The current dossier (version 1.2) is only 19 lines long and points back to the version 1.0 and 1.1 dossiers for how the curve was built, so this page reads those for the evidence and for the two rules that fill the paper's gaps.
