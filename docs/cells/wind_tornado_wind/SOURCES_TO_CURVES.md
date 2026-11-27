Damage-curve review · convective wind × wind farm

# Convective wind × wind farm curve, where its numbers come from

A convective-wind curve for a wind farm answers one question: **when a thunderstorm gust or a tornado reaches a turbine at some multiple of the gust it was designed for, what share of the turbine’s value is lost?** Unlike hail and solar, there are no laboratory counts behind it.

The cell gives four parts of a turbine (blades, tower, nacelle, foundation) an S-shaped curve each, with a midpoint, a steepness and a cap that the Damage team chose, then adds them up by value. The bottom axis is a ratio: the 3-second gust at hub height over the 50-year design gust of the turbine’s IEC class, so a class I machine built for 70 m/s and a class III machine built for 52.5 m/s share one curve.

Tornado uses the same curves moved to lower wind. The dashboard calls the curves “our judgment” (tier T4); the axis rule behind them is published.

## Curves 1a and 1b: blades and tower (straight-line wind)

Curves 1a and 1b · blades and tower: blades half lost at 1.38 times the design gust (184 mph for class II), tower at 1.48 · our judgment (T4)

- **Curve 1a:** Blades · straight-line wind
- **Curve 1b:** Tower · straight-line wind

**What each source says, and what that means for the line**

- **[#1 · DOE, how wind turbines survive severe weather](https://www.energy.gov/cmei/wind/articles/how-do-wind-turbines-survive-severe-weather-and-storms)** (numbers on the curve come from it)
  - ① ratio 1: turbines built for 156 mph 3-second gusts, read as low damage at the design gust (our judgment; the curve gives 1.0 %)
- **[#5 · NASA Earth Observatory, Greenfield tornado 2024](https://science.nasa.gov/earth/earth-observatory/tornado-damage-in-greenfield-152870/)** (numbers on the curve come from it)
  - ② EF4, peak winds 185 mph, downed wind turbines: blade midpoint placed near 184 mph for class II (our judgment)
- **Damage team, engineering fit (dossier section 7)** (the Damage team’s own choice)
  - blades: midpoint 1.38, steepness 12, cap 100 %; tower: midpoint 1.48, steepness 11, cap 100 % (our judgment)

**On the Damage dashboard:** [1a · blades](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wind_tornado_wind/curves/WT_BLADE_STRUCT) · [1b · tower](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wind_tornado_wind/curves/WT_TOWER_STRUCT)

These two curves cover the parts that fail first when a turbine is overloaded: the blades and the steel tower. Nothing on them was measured. Every midpoint and steepness is the Damage team’s engineering fit, set in section 7 of the dossier and graded T4, our judgment: the blades pass the middle of their rise at 1.38 times the class’s 50-year design gust and the tower at 1.48, because the tower is the stronger support.

Two points steered the choice, and both heights are our judgment. DOE’s article on severe weather (source [#1](https://www.energy.gov/cmei/wind/articles/how-do-wind-turbines-survive-severe-weather-and-storms), re-read on 13 November) says most turbines are built to withstand peak 3-second gusts of 156 mph, which is the class I design gust; the team reads that as low but not zero damage at a ratio of 1, where the blade curve gives 1.0 % (dot 1).

NASA’s Earth Observatory (source [#5](https://science.nasa.gov/earth/earth-observatory/tornado-damage-in-greenfield-152870/), re-read on 13 November) reports that the EF4 Greenfield tornado of 21 May 2024, with peak winds of 185 mph, downed wind turbines; the workbook says the blade midpoint was set near 184 mph for a class II turbine to agree with that case (dot 2). The Greenfield speed is a damage-based estimate near the ground, not a measured gust at hub height, and the case says nothing about what share of a turbine was lost.

The halfway point means that once the gust at hub height reaches 1.38 times the turbine’s 50-year design gust, about 184 mph for a class II machine, half of the blades’ value is lost on this curve. The curves are used for every wind farm on Hazard’s grid, for straight-line wind directly and for tornado after the shift on curve 3.

## Curves 2a to 2c: nacelle and foundation, plus the optional power-electronics curve

Curves 2a to 2c · nacelle and foundation: nacelle half lost at 1.48 times the design gust, foundation at 1.75; caps 85 % and 65 % · our judgment (T4)

- **Curve 2a:** Nacelle · straight-line wind
- **Curve 2b:** Foundation · straight-line wind
- **Curve 2c:** Power electronics · optional, not in the total

**What each source says, and what that means for the line**

- **Damage team, engineering fit (dossier section 7)** (the Damage team’s own choice)
  - nacelle: midpoint 1.44, steepness 10, cap 85 %; foundation: midpoint 1.62, steepness 9, cap 65 %; power electronics: midpoint 1.2, steepness 8, cap 30 %, left out of the total (our judgment)
- **[#6 · NIST, fragility curves and damage matrices](https://www.nist.gov/publications/fragility-curves-damage-matrices-and-wind-induced-loss-estimation)** (numbers on the curve come from it)
  - no number; fragility curves with damage states and no double counting: why a bounded S-curve per part
- **[#7 · Rice, wind-induced accelerations](https://duenas-osorio.rice.edu/sisrra/current-projects-and-sponsors/long-term-unavailability-wind-turbines-wind-induced-accelerations)** (numbers on the curve come from it)
  - no number; converters and controls are sensitive to tower shaking: why electronics get an optional curve

**On the Damage dashboard:** [2a · nacelle](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wind_tornado_wind/curves/WT_NACELLE_CONSEQ) · [2b · foundation](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wind_tornado_wind/curves/WT_FOUNDATION_OT) · [2c · power electronics](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wind_tornado_wind/curves/WT_POWER_ELEC_ACCEL)

The nacelle (gearbox, generator and yaw drive) and the foundation get curves that rise later and stop short of total loss: the nacelle levels off at 85 % because much of its damage follows a blade or tower failure, and the foundation at 65 % because it often survives when the turbine above it falls. Their midpoints, 1.44 and 1.62 times the design gust, and their steepness are the Damage team’s choices (section 7 of the dossier), graded T4, our judgment.

The caps are graded T3 in the tier table, citing NIST’s fragility method (source [#6](https://www.nist.gov/publications/fragility-curves-damage-matrices-and-wind-induced-loss-estimation)) and the value workbook, but neither gives a cap. A fifth curve for the power electronics in the nacelle (curve 2c, cap 30 %) is stored but left out of the total, because the Rice group’s work (source [#7](https://duenas-osorio.rice.edu/sisrra/current-projects-and-sponsors/long-term-unavailability-wind-turbines-wind-induced-accelerations)) ties that damage to tower shaking, which wind speed alone cannot predict.

The halfway points mean that the nacelle loses half of its value at about 1.48 times the design gust and the foundation at about 1.75. The dossier warns that the four parts are not independent, since a falling tower wrecks its nacelle, and that version 1.0 simply adds them; the caps are its way of not counting the same loss twice.

## Curves 3a and 3b: the tornado version, the same curves moved to lower wind

Curves 3a and 3b · tornado: a turbine half lost at 1.44 times the design gust instead of 1.55; never above 68 % · our judgment (T4)

- **Curve 3a:** One turbine · straight-line wind, four parts added by value (reference)
- **Curve 3b:** One turbine · tornado, the same parts with midpoints moved left

**What each source says, and what that means for the line**

- **Damage team, tornado shift (dossier section 8)** (the Damage team’s own choice)
  - every midpoint moved left: blades and nacelle by 0.10, tower by 0.12, foundation by 0.08 (our judgment)
- **[#4 · NWS, Enhanced Fujita scale](https://www.weather.gov/grb/efscale)** (numbers on the curve come from it)
  - EF3 = 136 to 165 mph 3-second gust, ‘wind estimates (not measurements) based on damage’
- **[#5 · NASA Earth Observatory, Greenfield 2024](https://science.nasa.gov/earth/earth-observatory/tornado-damage-in-greenfield-152870/)** (numbers on the curve come from it)
  - no number; an EF4 direct hit downed turbines, so a direct hit is treated as worse than the same straight-line gust

**On the Damage dashboard:** [the cell page (curves 3a and 3b add up the parts of one turbine; they have no curve page of their own)](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wind_tornado_wind)

For tornadoes the cell does not build a new curve. It moves each part’s midpoint to a lower wind, by 0.10 for blades and nacelle, 0.12 for the tower and 0.08 for the foundation, to stand for the turbulence, debris and swinging wind direction of a direct hit (section 8 of the dossier). The shifts are the Damage team’s choices, graded T4, our judgment, and the dossier calls the tornado version a placeholder.

Curve 3a is one turbine under straight-line wind, the four parts added up by value; curve 3b is the same turbine under a tornado. Neither can pass 68 % of the turbine’s physical value, because the nacelle and foundation curves stop short of total loss.

The Enhanced Fujita scale (source [#4](https://www.weather.gov/grb/efscale), re-read on 13 November) gives each tornado rating a band of 3-second gusts, EF3 being 136 to 165 mph, and states that these are wind estimates based on damage, not measurements. Fed straight into the tornado curve, the middle of the EF3 band gives about 7 % for a turbine hit by the tornado.

Hazard first raises the EF speed to hub height as if it were ordinary wind (exponent 0.105), which moves the band up the wind axis and gives about 50 %. The review (v5, A.8) calls this two wrongs making a plausible number: the height step has no physical basis for a tornado, and the curve without it gives a loss no documented direct hit supports.

The halfway point means that a tornado gust of about 1.44 times the design gust at hub height destroys about half of a turbine’s value on this curve, against 1.55 times for straight-line wind. For a whole farm the result is multiplied by the share of turbines inside the tornado’s path, which the workbook’s example sets at 10 %.

## Curves 4a to 4c: the whole farm, four parts added up by value, for the three turbine classes

Curves 4a to 4c · whole farm: 0.6 % at the design gust, 5 % at 1.2 times, 43 % at 1.5 times; never above 68 % · our judgment (T4)

- **Curve 4a:** Whole farm · class III turbines (design gust 52.5 m/s)
- **Curve 4b:** Whole farm · class II turbines, the default (59.5 m/s)
- **Curve 4c:** Whole farm · class I turbines (70 m/s)

**What each source says, and what that means for the line**

- **[#9 · value breakdown workbook (cited)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/value_basis/solar_wind_value_breakdown.xlsx)** (numbers on the curve come from it)
  - blades 17.3, tower 16.9, nacelle 34.5, foundation 6.2 % of 324.6 million dollars physical (75 %); its current rows differ
- **[#3 · Ashes, IEC extreme wind equations](https://www.simis.io/docs/wind-iec-extreme-events)** (numbers on the curve come from it)
  - Ve50 = 1.4 × Vref: class I 70, class II 59.5, class III 52.5 m/s at hub height
- **Damage team, assembly rule (dossier section 10)** (the Damage team’s own choice)
  - add the four parts by value; power electronics left out; a destroyed turbine reads at most 68 % (our judgment)

**On the Damage dashboard:** [the cell page (curves 4a to 4c add up the parts; they have no curve page of their own)](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wind_tornado_wind)

This is the farm-level result with every turbine in the wind: the four part curves added up, each weighted by its share of the farm’s 324.6 million dollar physical value. The cell cites the value breakdown workbook (source [#9](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/value_basis/solar_wind_value_breakdown.xlsx)) for the shares, blades 17.3 %, tower 16.9 %, nacelle 34.5 % and foundation 6.2 %, together 75 % of the farm; collection, substation and roads have no curve and are left out.

The workbook’s current wind rows give different shares (blades 17.4 %, tower 17.0 %, nacelle without electronics 20.9 %, foundation 7.4 %), so the nacelle share in particular could not be traced. The turbine class decides where the curve sits on the wind axis: the IEC standard’s 50-year gust is 1.4 times the reference wind (source [#3](https://www.simis.io/docs/wind-iec-extreme-events), Ashes documentation, section 5.1, re-read on 13 November), 70 m/s for class I, 59.5 for class II and 52.5 for class III, and the same shape is stretched to each.

At its design gust a class II farm loses 0.6 % of its physical value, at 1.2 times 5 % and at 1.5 times 43 %; it can never lose more than 68 %, because the nacelle and foundation stop short of total loss, which the review asks to remove so the tornado tail is not a hidden lower bound.

The halfway point means that a class II farm loses half of its value when the hub-height gust reaches about 92 m/s, about 206 mph. The review (v5, A.8) judges the straight-line curve fine for screening, with the numbers labelled as judgment; the cell’s version 2.0 proposal places tornado collapse near 65 to 69 m/s, which this curve does not reach.

In short: convective wind and wind farm is a set of four chosen S-curves on a sound, standard axis. The turbine class and its 50-year design gust are published; every midpoint, steepness, cap and tornado shift was chosen by the Damage team, steered by a design rating and one tornado case whose heights are also our judgment. The tornado version is a placeholder, and the number Hazard shows for tornado depends on a height step the cell does not own. In the source table, the number of sources in each group is: C (dots we chose) 2, D (shape and choices) 3, E (bottom axis) 4, F (dollars) 1.

## All 9 listed sources, sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’.

The number in the first column is the source’s position in the dashboard’s source list for this cell. The cell has no source register file: the dashboard lists the seven sources on the workbook’s Sources sheet (1 to 7) and then two IDs the tier table cites that have no workbook row (8 and 9); the tier table names sources [#1](https://www.energy.gov/cmei/wind/articles/how-do-wind-turbines-survive-severe-weather-and-storms) to [#6](https://www.nist.gov/publications/fragility-curves-damage-matrices-and-wind-induced-loss-estimation) under longer IDs. The ID is in brackets.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **C · Puts a dot whose height we chose** | | |
| 1 | **DOE Wind Energy Technologies Office, How do wind turbines survive severe weather and storms? (SRC\_DOE\_WIND\_STORMS)**<br>[energy.gov … how-do-wind-turbines-survive-severe-weather-and-storms](https://www.energy.gov/cmei/wind/articles/how-do-wind-turbines-survive-severe-weather-and-storms)<br>Where to look: section ‘Siting and Design’: turbines built to withstand sustained winds of 112 mph and peak 3-second gusts of 156 mph; cut-out near 55 mph | Gives a dot whose height we chose: dot 1 on curve 1: the design gust read as low but nonzero damage. The height is our judgment. |
| 5 | **NASA Earth Observatory, Tornado Damage in Greenfield (SRC\_NASA\_GREENFIELD)**<br>[science.nasa.gov … tornado-damage-in-greenfield-152870](https://science.nasa.gov/earth/earth-observatory/tornado-damage-in-greenfield-152870/)<br>Where to look: body text: EF-4 tornado of 21 May 2024, peak winds of 185 mph, ‘downed wind turbines and power lines’ | Gives a dot whose height we chose: dot 2 on curve 1: the blade midpoint was placed near this case. The 50 % height is our judgment; the case gives no damage share. |
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| — | **The numbers themselves: Damage team, dossier sections 7 and 8 and workbook sheet Wind\_Base\_Curve\_Fit**<br>[wind\_tornado\_wind\_curve\_derivation\_dossier\_v1\_0.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wind_tornado_wind/current/wind_tornado_wind_curve_derivation_dossier_v1_0.md)<br>Where to look: Every midpoint, steepness, cap and tornado shift; 16 of the 22 tiered parameters are T4. Not one of the 9 listed sources. | Gives the numbers: every number on curves 1 to 4 apart from the class design gusts. |
| 6 | **NIST, Fragility curves, damage matrices, and wind-induced loss estimation (SRC\_NIST\_FRAGILITY)**<br>[nist.gov … fragility-curves-damage-matrices-and-wind-induced-loss-estimation](https://www.nist.gov/publications/fragility-curves-damage-matrices-and-wind-induced-loss-estimation)<br>Where to look: abstract: a framework of damage states and fragility curves, with care not to double count | Gives no number. Helped decide: a bounded S-curve per part and the caps against double counting (curves 1 and 2); cited by the tier table for every midpoint, slope and cap. |
| 7 | **Rice University (Dueñas-Osorio group), long-term unavailability of wind turbines from wind-induced accelerations (SRC\_RICE\_ACCEL)**<br>[duenas-osorio.rice.edu … long-term-unavailability-wind-turbines-wind-induced-accelerations](https://duenas-osorio.rice.edu/sisrra/current-projects-and-sponsors/long-term-unavailability-wind-turbines-wind-induced-accelerations)<br>Where to look: project page: generator, brakes, yaw drive and converters are sensitive to tower accelerations | Gives no number. Helped decide: the power-electronics curve is optional and left out of the total (curve 2). |
| **E · Decides what the bottom axis means** | | |
| 2 | **DTU Wind Energy, IEC 61400-1 turbine safety standard explainer (SRC\_DTU\_IEC)**<br>[wasp.dtu.dk … iec-61400-1](https://wasp.dtu.dk/software/windfarm-assessment-tool/iec-61400-1)<br>Where to look: explainer: turbine classes by reference wind, extreme wind and gust load cases, yaw error | Sets the bottom axis: the turbine class as the selector that sets the design gust on the bottom axis. |
| 3 | **Simis Ashes documentation, IEC extreme wind events (SRC\_ASHES\_IEC\_EWM)**<br>[simis.io … wind-iec-extreme-events](https://www.simis.io/docs/wind-iec-extreme-events)<br>Where to look: section 5.1 ‘Steady EWM’ and equation 3: Ve50 = 1.4 Vref (z / z\_hub)^0.11 | Sets the bottom axis: the 1.4 factor that turns each class’s reference wind into the 50-year gust on the bottom axis (curves 1 to 4). |
| 4 | **NOAA National Weather Service, The Enhanced Fujita scale (SRC\_NWS\_EF)**<br>[weather.gov … efscale](https://www.weather.gov/grb/efscale)<br>Where to look: table of 3-second gusts: EF0 65 to 85, EF1 86 to 110, EF2 111 to 135, EF3 136 to 165, EF4 166 to 200, EF5 over 200 mph; ‘wind estimates (not measurements) based on damage’ | Sets the bottom axis: the speed band for each tornado rating used to feed the tornado version (curve 3). |
| 8 | **Damage repository, declared 10 m to hub-height bridge (internal ID) (AWN\_15\_DECLARED\_BRIDGE)**<br>[github.com … wind\_tornado\_wind\_curve\_derivation\_dossier\_v1\_0.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wind_tornado_wind/current/wind_tornado_wind_curve_derivation_dossier_v1_0.md)<br>Where to look: artifact height\_bridge and MODEL\_REFERENCE.md: power law with exponent 1/7 by default, or log law; no external document | Sets the bottom axis: the rule for raising a 10 m gust to hub height before it reaches the curve; Hazard uses its own exponent, 0.105. |
| **F · Turns the curve into dollars** | | |
| 9 | **Damage repository, solar and wind value breakdown workbook (SOLAR\_WIND\_VALUE\_BREAKDOWN)**<br>[github.com … solar\_wind\_value\_breakdown.xlsx](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/value_basis/solar_wind_value_breakdown.xlsx)<br>Where to look: sheet Wind\_Map: blades 17.4 %, tower 17.0 %, drivetrain, structure and yaw 20.9 %, nacelle electrical 8.4 %, foundation 7.4 % of 1,623 dollars per kW | Turns the curve into dollars: cited for the four value shares on curve 4; the cell’s shares (17.3, 16.9, 34.5, 6.2 %) match it only for blades and tower. |

**Gaps worth knowing, found while building this page.** (1) The documentation revision r2 memo adopts six more pieces of evidence (Typhoon Usagi, Rose and colleagues 2012, Kareem and colleagues 2023, Kapoor and colleagues 2020, Punta Lima, a 2024 tower-collapse review) as cross-checks, but none appears in the workbook’s Sources sheet or the dashboard’s list, and none changed a number. (2) The value shares cite the value breakdown workbook, but its current rows match only the blade and tower shares; the nacelle’s 34.5 % could not be traced. (3) The tier table grades the caps of the blade, tower, nacelle and foundation curves T3 (borrowed) while citing a method paper and the value workbook, neither of which gives a cap; the dashboard therefore shows the dollar half as “borrowed and our judgment”. (4) The 10 m to hub-height rule cites an internal ID with no document, and the cell’s default exponent (1/7) differs from the one Hazard uses (0.105).
