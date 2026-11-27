Damage-curve review · convective wind × solar farm

# Convective wind × solar curve, where its numbers come from

A convective-wind curve for a solar plant answers one question: **when a thunderstorm or derecho gust loads the plant to some multiple of the wind pressure it was designed for, what share of the plant’s rebuild value is lost?** Unlike hail and solar, there are no laboratory counts behind it.

The cell gives five parts of the plant (tracker, racking, module clamps, foundations, monitoring kit) an S-shaped curve each, with a threshold, a midpoint, a steepness and a cap that the Damage team chose, then adds the parts up by value. The bottom axis is the same kind of pressure ratio as the hurricane and solar cell: the storm gust over the plant’s design gust, squared, then multiplied by a stow factor and an edge factor.

The dashboard calls every curve “our judgment” (tier T4), on both the damage and the dollar side; its one word on a tile reports the weaker of the two halves, so it does not show that the squared-speed rule behind the axis is physics.

## Curves 1a and 1b: tracker and racking structure (two curves)

Curves 1a and 1b · tracker and racking: tracker half lost at 1.21 times design pressure, racking at 1.34 · our judgment (T4)

- **Curve 1a:** Tracker and racking · tracker structure
- **Curve 1b:** Tracker and racking · racking structure

**What each source says, and what that means for the line**

- **Damage team, engineering fit (dossier section 7)** (the Damage team’s own choice)
  - tracker: starts at 0.75, midpoint 1.15, cap 80 %; racking: starts at 0.8, midpoint 1.25, cap 75 % (our judgment)
- **[#4 · CPP, wind loads on utility-scale PV plants](https://cppwind.com/wp-content/uploads/2020/12/Wind-Loads-on-Utility-Scale-Solar-PV-Power-Plants_DBanks_2015.pdf)** (numbers on the curve come from it)
  - no number; failures well below design wind and dynamic loads 2 to 10 times static: why a threshold on a pressure ratio
- **[#2 · NREL, toward PV storm resilience](https://www.osti.gov/servlets/purl/2448530)** (numbers on the curve come from it)
  - no number; field cases of racking and fastener failure, one array failing far below its 145 mph design wind

**On the Damage dashboard:** [1a · tracker structure](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/strong_wind_solar/curves/SWS_TRACKER_STRUCT) · [1b · racking structure](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/strong_wind_solar/curves/SWS_RACKING_STRUCT)

These two curves cover the steel that holds the panels up: the tracker’s torque tubes and drives, and the racking rails and supports. Nothing on them was measured. Every number is the Damage team’s engineering fit, set in section 7 of the dossier: the tracker curve starts at 0.75 times the design pressure, rises through its midpoint at 1.15 and levels off at 80 % of the tracker’s value; the racking curve starts at 0.8, has its midpoint at 1.25 and levels off at 75 %.

The cell’s tier table grades every one of these numbers T4, our judgment: 25 of its 26 tiered parameters are T4, and the one exception is the rule that wind pressure grows with the square of wind speed. The sources explain the shape without giving a number.

The CPP paper on wind loads (source [#4](https://cppwind.com/wp-content/uploads/2020/12/Wind-Loads-on-Utility-Scale-Solar-PV-Power-Plants_DBanks_2015.pdf)) reports trackers failing at winds well below their design speed and dynamic loads several times the static ones, which is why the curve is drawn on a pressure ratio with a threshold. NREL’s storm-resilience report (source [#2](https://www.osti.gov/servlets/purl/2448530)) describes racking and fastener failures in the Caribbean. The review’s source check (B, 9 to 10 November) found none of the 27 cited numbers in the sources named.

The halfway point means that if a storm loads a tracker to about 1.21 times the pressure it was designed for, about half of the tracker’s value is lost on this curve; the racking needs about 1.34 times. Each curve jumps from zero to a small value at its starting point, because the cell’s formula switches on there; that step is part of the stored curve.

The curves are used for every solar plant on Hazard’s grid, for both straight-line wind and tornado, although the cell itself says tornado is outside it.

## Curve 2: module clamps and detachment

Curve 2 · modules: half lost at 1.17 times design pressure; cap 65 % · our judgment (T4)

**What each source says, and what that means for the line**

- **Damage team, engineering fit (dossier section 7)** (the Damage team’s own choice)
  - modules: starts at 0.7, midpoint 1.05, cap 65 % (our judgment)
- **[#1 · DOE/FEMP, severe-weather PV design](https://www.energy.gov/cmei/femp/severe-weather-resilience-solar-photovoltaic-system-design)** (numbers on the curve come from it)
  - no number; mid-clamp release and cascading module loss as failure modes
- **[#2 · NREL, toward PV storm resilience](https://www.osti.gov/servlets/purl/2448530)** (numbers on the curve come from it)
  - no number; loose clamps and fasteners let one module’s loss pull out its neighbours

**On the Damage dashboard:** [2 · module clamps](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/strong_wind_solar/curves/SWS_MODULE_ATTACH)

This curve prices modules torn off or broken when their clamps let go. It is the most valuable of the five, because the cell gives modules 40 % of the plant’s physical value. Its numbers were chosen by the Damage team (section 7 of the dossier): damage starts at 0.7 times the design pressure, the midpoint is at 1.05, the steepest of the five, and the curve levels off at 65 %, because some modules survive even when the clamps fail.

All are graded T4, our judgment, and nothing was measured. DOE’s guidance (source [#1](https://www.energy.gov/cmei/femp/severe-weather-resilience-solar-photovoltaic-system-design)) and NREL’s field reports (source [#2](https://www.osti.gov/servlets/purl/2448530)) describe how modules come loose, with mid-clamps releasing and one lost module pulling out the next, which is why this curve starts earliest; neither gives a wind speed or a share lost. The halfway point means that once a storm loads the array to about 1.17 times its design pressure, about half of the modules’ value is lost on this curve.

The dossier warns that this curve and the racking curve overlap, since a collapsed rack also drops its modules, and that version 1.0 adds them without a rule against counting the same loss twice (assumption A\_SWS\_004).

## Curves 3a and 3b: foundations and exposed monitoring kit (two curves)

Curves 3a and 3b · foundations and SCADA: neither reaches half; caps 45 % and 15 % · our judgment (T4)

- **Curve 3a:** Foundations
- **Curve 3b:** Exposed monitoring kit · SCADA and met station

**What each source says, and what that means for the line**

- **Damage team, engineering fit (dossier section 7)** (the Damage team’s own choice)
  - foundations: starts at 0.9, midpoint 1.35, cap 45 %; SCADA: starts at 0.7, midpoint 0.95, cap 15 % (our judgment)
- **[#1 · DOE/FEMP, severe-weather PV design](https://www.energy.gov/cmei/femp/severe-weather-resilience-solar-photovoltaic-system-design)** (numbers on the curve come from it)
  - no number; pile and support failure listed among the mechanisms

**On the Damage dashboard:** [3a · foundations](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/strong_wind_solar/curves/SWS_FOUNDATION_UPLIFT) · [3b · monitoring kit](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/strong_wind_solar/curves/SWS_SCADA_EXPOSED)

The last two parts get gentle curves. Foundation piles pulling out of the ground start only at 0.9 times the design pressure, pass the middle of their rise at 1.35 and stop at 45 %; exposed monitoring and weather instruments start at 0.7 and stop at 15 %. Both are the Damage team’s choices (section 7 of the dossier), graded T4, our judgment.

The workbook itself calls the foundation curve the least source-anchored of the five and a placeholder until the soil and pile design are known (assumption A\_SWS\_005); no source in the list gives a foundation number. Neither curve reaches half of its part’s value at any wind: on this cell a storm never pulls out most of a plant’s piles. Together they carry 10 % of the plant’s value, so they move the plant total very little.

## Curves 4a to 4c: the whole plant, five parts added up by value, with the stow and edge rules

Curves 4a to 4c · whole plant: 16 % of physical value at the 120 mph design gust, never above 40.8 % · our judgment (T4)

- **Curve 4a:** Whole plant · before: no stow or edge factor (reference)
- **Curve 4b:** Whole plant · after: 75 % stowed, edge × 1.15 (the cell’s curve)
- **Curve 4c:** Whole plant · Hazard’s run: 75 % stowed, no edge factor

**What each source says, and what that means for the line**

- **Damage team, shares and rules (dossier sections 8 and 9)** (the Damage team’s own choice)
  - shares: modules 40 %, tracker 8 %, racking 6 %, foundations 8 %, SCADA 2 % (64 % of 87.8 million dollars); stowed × 0.80, not stowed × 1.25, 75 % stowed; edge × 1.15 (our judgment)
- **[#5 · CPP, torsional instability of trackers](https://cppwind.com/wp-content/uploads/2014/01/Torsional-Instability-of-Single-Axis-Solar-Tracking-Systems-Rohr-Bourke-Banks-2015.pdf)** (numbers on the curve come from it)
  - no number; stow changes the wind demand, and trackers stowed flat can gallop below 40 m/s
- **[#13 · value breakdown workbook](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/value_basis/solar_wind_value_breakdown.xlsx)** (numbers on the curve come from it)
  - cited for the shares; its own solar rows differ (modules 33 %, tracker and racking 13 %)

**On the Damage dashboard:** [the cell page (curves 4a to 4c add up the parts; they have no curve page of their own)](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/strong_wind_solar)

This is the plant-level result for the dossier’s default 100 MW plant: the five curves added up, each weighted by the share of the plant’s 87.8 million dollar physical value the cell gives it. Those shares, 40 %, 8 %, 6 %, 8 %, 2 % for modules, tracker, racking, foundations and SCADA, are the team’s illustrative defaults (section 9 of the dossier), graded T4; they cite the value breakdown workbook (source [#13](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/value_basis/solar_wind_value_breakdown.xlsx)), whose own solar rows give different numbers.

Together the five parts are 64 % of the plant; inverters, cables and the substation have no curve and are left out, not counted as zero. Because each part’s curve levels off, the plant can never lose more than 40.8 % of its physical value on this cell. Curve 4a is the plant before any adjustment.

Curve 4b applies the two rules the team chose: trackers that stow cut the wind demand by a factor of 0.80 and trackers that fail to stow raise it by 1.25, with 75 % assumed to stow (a combined factor of 0.9125), and edge rows add 1.15. Source [#5](https://cppwind.com/wp-content/uploads/2014/01/Torsional-Instability-of-Single-Axis-Solar-Tracking-Systems-Rohr-Bourke-Banks-2015.pdf) shows that stow changes the wind load on a tracker but gives no factor, so the rule is our judgment.

At the 120 mph design gust the default plant loses 16.1 % of its physical value, and the line passes half of its cap at about 123 mph. Hazard runs the same curve with no edge factor (curve 4c, review v5, A.4), which gives 6.5 % at 120 mph.

The curve is used for every solar plant on Hazard’s grid with a single national 120 mph design gust, which the review flags as the biggest single choice behind the result: real design gusts run from about 90 to 180 mph. Tornado is fed through the same curve, although the cell defers tornado to a separate pathway; the cell’s version 2.0 proposal, with separate fixed-tilt and tracker curves, is written and waiting for review.

In short: convective wind and solar is a set of five chosen curves on a well-founded axis. The rule that wind pressure grows with the square of wind speed is the only published element; every threshold, midpoint, slope, cap, stow factor and value share was chosen by the Damage team, and the guidance documents and field reports in the list explain which parts fail without giving a wind speed and a loss for the same plant. Nothing on any curve is a measurement. In the source table, the number of sources in each group is: D (shape and choices) 9, E (bottom axis) 3, F (dollars) 1, I (background) 2.

## All 14 listed sources, sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’.

The number in the first column is the source’s position in the dashboard’s source list for this cell. The cell has no source register file: the dashboard lists the nine sources on the workbook’s Sources sheet (1 to 9) and then the IDs the tier table cites (10 to 14), three of which repeat sources [#1](https://www.energy.gov/cmei/femp/severe-weather-resilience-solar-photovoltaic-system-design), [#2](https://www.osti.gov/servlets/purl/2448530) and [#4](https://cppwind.com/wp-content/uploads/2020/12/Wind-Loads-on-Utility-Scale-Solar-PV-Power-Plants_DBanks_2015.pdf) under another name; the ID is in brackets.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| — | **The numbers themselves: Damage team, dossier sections 7 to 9 and workbook sheet Base\_Curve\_Fit**<br>[strong\_wind\_solar\_curve\_derivation\_dossier\_\_model\_v1\_0\_\_docs\_r1.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/strong_wind_solar/current/strong_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md)<br>Where to look: Every threshold, midpoint, slope and cap, the stow and edge factors and the value shares; all tier T4. Not one of the 14 listed sources. | Gives the numbers: every number on curves 1 to 4. |
| 1 | **DOE/FEMP, Severe Weather Resilience in Solar Photovoltaic System Design (SRC\_DOE\_FEMP\_PV\_SEVERE\_WEATHER)**<br>[energy.gov … severe-weather-resilience-solar-photovoltaic-system-design](https://www.energy.gov/cmei/femp/severe-weather-resilience-solar-photovoltaic-system-design)<br>Where to look: web page: failure modes (fastened joints, racking flex, cascading mid-clamp release), ‘Wind and Tracker Position’, hardening cost table; no damage ratio | Gives no number. Helped decide: which parts get a curve (curves 1 to 3) and that stow state is a rule (curve 4). |
| 2 | **NREL/OSTI, Toward Solar Photovoltaic Storm Resilience (SRC\_NREL\_STORM\_RESILIENCE)**<br>[osti.gov … 2448530](https://www.osti.gov/servlets/purl/2448530)<br>Where to look: report p. vi and p. 6: arrays failing well below their design wind (St. Croix, 145 mph design), clamp and fastener failures | Gives no number. Helped decide: modules and racking fail first and can cascade (curves 1 and 2). |
| 3 | **NREL, Cost Considerations for Storm Hardening PV Systems for Resilience (SRC\_NREL\_STORM\_HARDENING\_COST)**<br>[docs.nrel.gov … 75804.pdf](https://docs.nrel.gov/docs/fy20osti/75804.pdf)<br>Where to look: report: loose fasteners and module-racking attachments as weak points; hardening measures and their cost | Gives no number. Mechanism support for the module curve (curve 2). |
| 5 | **CPP (Rohr, Bourke and Banks 2015), Torsional Instability of Single-Axis Solar Tracking Systems (SRC\_CPP\_TORSIONAL\_TRACKERS)**<br>[cppwind.com … Torsional-Instability-of-Single-Axis-Solar-Tracking-Systems-Rohr-Bourke-Banks-2015.pdf](https://cppwind.com/wp-content/uploads/2014/01/Torsional-Instability-of-Single-Axis-Solar-Tracking-Systems-Rohr-Bourke-Banks-2015.pdf)<br>Where to look: paper p. 6: torsional galloping below 40 m/s when stowed flat | Gives no number. Helped decide: stow state changes the demand (the stow rule on curve 4); the 0.80 and 1.25 factors are not in it. |
| 8 | **SEAC, Updates on ASCE 7 Standard for Solar PV Systems (SRC\_SEAC\_ASCE\_7\_22\_PV)**<br>[sustainableenergyaction.org … updates-asce-7-standard-solar-pv-systems](https://sustainableenergyaction.org/resources/updates-asce-7-standard-solar-pv-systems/)<br>Where to look: summary page: PV wind-load provisions in ASCE 7-22 and the new tornado chapter | Gives no number. Helped decide: tornado is kept out of this straight-line curve. |
| 9 | **ASCE, ASCE 7-22 wind load standard adds tornado chapter (SRC\_ASCE\_TORNADO\_CHAPTER)**<br>[asce.org … asce-7-22-wind-load-standard-adds-tornado-chapter](https://www.asce.org/publications-and-news/civil-engineering-source/civil-engineering-magazine/article/2022/02/asce-7-22-wind-load-standard-adds-tornado-chapter)<br>Where to look: magazine article: tornado loads treated apart from ordinary wind loads | Gives no number. Helped decide: tornado is a separate pathway (deferred). |
| 11 | **Tier-table ID for the DOE/FEMP guidance (same as source 1) (DOE\_FEMP\_SEVERE\_WEATHER\_PV)**<br>[github.com … MODEL\_REFERENCE.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/strong_wind_solar/basics/MODEL_REFERENCE.md)<br>Where to look: MODEL\_REFERENCE.md, evidence table | Gives no number. The same DOE guidance as #1, under the ID the tier table uses. The tier table cites it for the caps and the stow rule; it gives none of their numbers. |
| 12 | **Tier-table ID for the NREL storm-resilience report (same as source 2) (NREL\_STORM\_RESILIENCE)**<br>[github.com … MODEL\_REFERENCE.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/strong_wind_solar/basics/MODEL_REFERENCE.md)<br>Where to look: MODEL\_REFERENCE.md, evidence table | Gives no number. The same NREL report as #2, under the ID the tier table uses. Cited for the caps and midpoints; it gives none of their numbers. |
| **E · Decides what the bottom axis means** | | |
| 4 | **CPP (Banks 2015), Wind Loads on Utility Scale Solar PV Power Plants (SRC\_CPP\_WIND\_LOADS\_UTILITY\_PV)**<br>[cppwind.com … Wind-Loads-on-Utility-Scale-Solar-PV-Power-Plants\_DBanks\_2015.pdf](https://cppwind.com/wp-content/uploads/2020/12/Wind-Loads-on-Utility-Scale-Solar-PV-Power-Plants_DBanks_2015.pdf)<br>Where to look: paper p. 1, p. 3, p. 7: failures well below design wind; equivalent static pressure; dynamic loads 2 to 10 times static | Sets the bottom axis: wind acts on panels as pressure, and plants fail well below their design wind, which is why the curves start at a threshold. It gives no damage number. |
| 10 | **Tier-table ID for the CPP wind-load paper (same as source 4) (CPP\_PV\_WIND\_LOAD)**<br>[github.com … MODEL\_REFERENCE.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/strong_wind_solar/basics/MODEL_REFERENCE.md)<br>Where to look: MODEL\_REFERENCE.md, evidence table: ‘PV loading, dynamic effects, design normalization’ | Gives no number. The same paper as #4, under the ID the tier table uses. Cited for the pressure rule and every threshold, midpoint and slope; the paper gives none of those numbers. |
| 14 | **Wind pressure grows with the square of wind speed (physics; no document named) (WIND\_PRESSURE\_PHYSICS)**<br>[github.com … MODEL\_REFERENCE.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/strong_wind_solar/basics/MODEL_REFERENCE.md)<br>Where to look: MODEL\_REFERENCE.md, evidence table: ‘V² axis bridge’; no citation or URL anywhere in the cell | Sets the bottom axis: wind pressure grows with the square of wind speed, so the axis is the squared ratio of wind to design wind. This is the cell’s only published (T2) parameter. |
| **F · Turns the curve into dollars** | | |
| 13 | **Damage repository, solar and wind value breakdown workbook (SOLAR\_WIND\_VALUE\_BREAKDOWN)**<br>[github.com … solar\_wind\_value\_breakdown.xlsx](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/value_basis/solar_wind_value_breakdown.xlsx)<br>Where to look: sheet Solar\_Map: modules 33.2 %, tracker and racking hardware 12.5 %, foundations 3.5 %, monitoring 0.15 % of physical value | Turns the curves into dollars: cited for the five value shares on curve 4, although the cell’s shares (40, 8, 6, 8 and 2 %) are not the workbook’s rows. |
| **I · Background only, no number taken** | | |
| 6 | **DuraMAT/NREL, Aero-Elastic Modeling and Advanced Field Testing of PV Trackers (SRC\_DURAMAT\_AEROELASTIC)**<br>[duramat.org … aero-elastic-modeling](https://www.duramat.org/projects/aero-elastic-modeling)<br>Where to look: project page: tracker high-wind failure modes are active research | Gives no number. A research project on how trackers fail in high wind. A possible way to calibrate the curves in future; nothing is taken from it. |
| 7 | **DuraMAT/NREL, PVade wind-driven PV system simulation (SRC\_DURAMAT\_PVADE)**<br>[duramat.org … wind-driven-pv-system-simulation](https://www.duramat.org/projects/wind-driven-pv-system-simulation)<br>Where to look: project page: fluid-structure simulation of wind on PV rows | Gives no number. A simulation tool for wind on solar rows. A possible way to calibrate the curves in future; nothing is taken from it. |

**Gaps worth knowing, found while building this page.** (1) 25 of the 26 tiered parameters are T4; the other one is the squared-speed rule, whose ID (WIND\_PRESSURE\_PHYSICS) names no document anywhere in the cell. (2) The tier table cites the value breakdown workbook for the five value shares, but the shares (40, 8, 6, 8, 2 % of physical value) are not the workbook’s solar rows, and the dashboard prices a different covered share (54 %) from the cell’s own 64 %. (3) The workbook has no Evidence\_Log sheet; its Evidence\_Params sheet maps six sources to roles, and none is marked as changing a curve. (4) The workbook’s Site\_Applied\_Loss sheet adds the tracker and racking ratios into one “mounting” figure that exceeds 100 % (134 % at 140 mph); it is a display sheet and does not feed the stored curve.
