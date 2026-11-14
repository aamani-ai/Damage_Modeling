Damage-curve review · flood × solar farm

# Flood × solar curve, where its shape comes from

A flood curve for a solar plant answers one question: **when water stands at a given depth against a piece of equipment, what share of that equipment's value is lost?**

No laboratory has measured this for solar equipment, so there are no dots. What the sources give instead are rules about behaviour: which parts fail when they get wet, whether they are repaired or replaced, and how quickly. Each rule forces the line to do something, such as start early, climb fast or stop short of 100 %, and the Damage team then chose percentages that follow those rules.

Each source box on the left says what the document says and then, in bold, what that forces the line to do. Seven parts of the plant get a depth curve and the foundations get a flow-speed curve; together the covered parts are about half of the plant's value (48 %), and the rest is withheld.

### What the labels on this page mean

A cell is one hazard × asset pair in the Damage repository, and its dossier is the write-up of how its curves were built.

Each curve is marked by how well it is backed:

- **published (T2)**: taken from a published source and used unchanged
- **borrowed (T3)**: a published result carried over to a case it was not made for
- **our judgment (T4)**: numbers the Damage team chose

Withheld means no number is given, because nobody knows; it is not the same as zero.

## Curves 1, 4 and 5 · the three electronics cabinets: inverter, combiner box, SCADA cabinet

- **Curve 1:** Inverter · water above the cabinet base
- **Curve 4:** Combiner box · water above the box base
- **Curve 5:** SCADA cabinet · water above the cabinet base

**What each source says, and what that means for the line**

- **[#1 · DOE/FEMP solar flood guide](https://www.energy.gov/femp/preventing-and-mitigating-flood-damage-solar-photovoltaic-systems)** (no number on the curve comes from it)
  - Says: water enters through conduits; a submerged inverter is a total loss
  - So: the line must start rising at a few cm and end at 100 %
- **[#3 · NEMA GD 1-2016 guide (PDF table)](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-1-2016-evaluating-water-damaged-electrical-equipment-guide.pdf)** (no number on the curve comes from it)
  - Says: power electronics that got wet are replaced, not repaired
  - So: the line must climb fast, with no partial-repair plateau
- **[#2 · NEMA GD 1-2019 standard](https://www.nema.org/standards/view/evaluating-water-damaged-electrical-equipment)** (no number on the curve comes from it)
  - Says: the same rule, in the current edition
  - So: the 2016 rule still stands; adds no number
- **[Damage team (dossier section 7.2)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_solar/current/flood_solar_curve_derivation_dossier_v1_0.md#72-curve-table)** (the Damage team’s own choice)
  - Did: chose every number in the three tables, following these rules
  - So: curves 1, 4, 5 are these tables (T3)

**On the Damage dashboard:** [1 · inverter](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_solar/curves/FS_INV) · [4 · combiner box](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_solar/curves/FS_COMB) · [5 · SCADA cabinet](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_solar/curves/FS_SCADA)

The three sources do not give any percentage. What they give is three rules about how an electronics cabinet behaves in water. The DOE guide [[#1](https://www.energy.gov/femp/preventing-and-mitigating-flood-damage-solar-photovoltaic-systems)] says that water gets into inverters through the conduits and that a submerged inverter is a total loss, which forces the line to start rising after only a few centimetres and to end at 100 %.

The NEMA 2016 guide [[#3](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-1-2016-evaluating-water-damaged-electrical-equipment-guide.pdf)] says that power electronics that have been wet are replaced rather than repaired, which forces the line to climb quickly with no plateau for partial repair. The NEMA 2019 edition [[#2](https://www.nema.org/standards/view/evaluating-water-damaged-electrical-equipment)] says that the same rule still stands.

The actual percentages, 5 % at 2 cm, 25 % at 5 cm, 75 % at 15 cm, 95 % at 30 cm and 100 % at 60 cm, were then chosen by the Damage team so that the line obeys those three rules. There was no calculation behind them.

[Its section 7.2](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_solar/current/flood_solar_curve_derivation_dossier_v1_0.md#72-curve-table) is the table where these percentages are typed in, with a one-line reason beside each row ("power electronics and controls are high-loss once water enters"), and [its section 8](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_solar/current/flood_solar_curve_derivation_dossier_v1_0.md#8-what-exactly-is-derived-versus-assumed) is the list that separates what came from a source from what the Damage team assumed, where "exact percentages at intermediate depths" appears under the assumptions.

These three curves exist because the dossier applies the same three rules to three parts: the inverter (curve 1), the combiner box (curve 4) and the SCADA cabinet (curve 5). Each part still has its own row of numbers. The combiner box and the SCADA cabinet get slightly different numbers because they are smaller boxes with the same kind of electronics inside. So the sources decide the shape of the line, and the Damage team decided its numbers.

The cell's own grading calls this borrowed (T3), because the way the equipment fails comes from published guidance; the exact percentages are still the Damage team's judgment.

## Curve 2 · the switchgear cabinet

**What each source says, and what that means for the line**

- **[#3 · NEMA GD 1-2016 guide (PDF table)](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-1-2016-evaluating-water-damaged-electrical-equipment-guide.pdf)** (no number on the curve comes from it)
  - Says: switchgear that got wet is replaced (the cell's reading)
  - So: the line must reach 100 % at a shallow depth
- **[#2 · NEMA GD 1-2019 standard](https://www.nema.org/standards/view/evaluating-water-damaged-electrical-equipment)** (no number on the curve comes from it)
  - Says: the same rule, in the current edition
  - So: the 2016 rule still stands; adds no number
- **[Damage team (dossier section 7.2)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_solar/current/flood_solar_curve_derivation_dossier_v1_0.md#72-curve-table)** (the Damage team’s own choice)
  - Did: chose the numbers: 10 % at 2 cm, 85 % at 15 cm, 100 % at 30 cm
  - So: the line on the curve are this table (T3)

**On the Damage dashboard:** [2 · switchgear](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_solar/curves/FS_SWG)

Switchgear is the large breaker cabinet where the plant meets the grid. NEMA's guide for electricians puts it in the category "replace after any water exposure", so the Damage team drew the steepest curve of the set. A wet floor already costs 10 %, ankle-deep water costs 85 %, and knee-deep water costs the whole cabinet. The curve is steeper than the inverter curve only because NEMA is blunter about switchgear. The numbers themselves are still chosen.

The review read the printed NEMA table differently: it lists switchgear as something that may be reconditioned, which would make this curve too steep (see the review section below).

## Curve 3 · the main transformer

**What each source says, and what that means for the line**

- **[#3 · NEMA GD 1-2016 guide (PDF table)](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-1-2016-evaluating-water-damaged-electrical-equipment-guide.pdf)** (no number on the curve comes from it)
  - Says: a wet oil-filled transformer is tested first, not replaced (the cell's reading)
  - So: the line must rise slowly and reach 100 % only when submerged
- **[#2 · NEMA GD 1-2019 standard](https://www.nema.org/standards/view/evaluating-water-damaged-electrical-equipment)** (no number on the curve comes from it)
  - Says: the same rule, in the current edition
  - So: the 2016 rule still stands; adds no number
- **[Damage team (dossier section 7.2)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_solar/current/flood_solar_curve_derivation_dossier_v1_0.md#72-curve-table)** (the Damage team’s own choice)
  - Did: chose the numbers: 3 % at 2 cm, 45 % at 30 cm, 100 % at 2 m
  - So: the line on the curve are this table (T3)

**On the Damage dashboard:** [3 · transformer](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_solar/curves/FS_XFMR)

A large transformer is a steel tank full of oil, not a box of circuit boards. NEMA says that a flooded transformer can often be drained, tested and put back into service, so it should not be written off the moment it gets wet. The Damage team therefore drew a slow, slanting curve: about a third of the value is gone at knee depth, and all of it only when the transformer is fully under water.

How steeply the line climbs is a judgment about how often a flooded transformer can be dried out and used again; no source gives a figure for that. The review also reads the printed NEMA table differently here: it says every type of transformer should be replaced, which would make this curve too gentle.

## Curves 6 and 7 · collection cables and PV modules

- **Curve 6:** Collection cable · AC and DC cables
- **Curve 7:** PV module · water above the module’s lower edge

**What each source says, and what that means for the line**

- **[#1 · DOE/FEMP solar flood guide](https://www.energy.gov/femp/preventing-and-mitigating-flood-damage-solar-photovoltaic-systems)** (no number on the curve comes from it)
  - Says: a submerged panel is lost, but panels sit well above the ground
  - So: the panel line stays at 0 until water reaches the panel's lower edge
- **[#3 · NEMA GD 1-2016 guide (PDF table)](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-1-2016-evaluating-water-damaged-electrical-equipment-guide.pdf)** (no number on the curve comes from it)
  - Says: wet-rated cable survives; its ends and conduits do not
  - So: the cable line stays low and never reaches 100 %
- **[Damage team (dossier section 7.2)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_solar/current/flood_solar_curve_derivation_dossier_v1_0.md#72-curve-table)** (the Damage team’s own choice)
  - Did: chose every number in the two tables, following these rules
  - So: curves 6, 7 are these tables (T3)

**On the Damage dashboard:** [6 · collection cable](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_solar/curves/FS_CABLE) · [7 · PV module](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_solar/curves/FS_PVMOD)

Cables are built to be wet, so their curve stays low and never reaches total loss. What fails is the ends where cables are joined, and the conduits that fill with mud. Panels are the opposite. DOE says that a submerged panel is finished, but panels sit on racks well above the ground, so this curve switches on only once the water climbs to the bottom edge of the panel, and from there it rises quickly.

For most floods on the grid it never switches on at all. Again, the shapes follow the sources and the percentages are chosen by the Damage team; the cell grades both curves borrowed (T3).

## Curve 8 · pile foundations under fast water, a placeholder

**What each source says, and what that means for the line**

- **[#1 · DOE/FEMP solar flood guide](https://www.energy.gov/femp/preventing-and-mitigating-flood-damage-solar-photovoltaic-systems)** (no number on the curve comes from it)
  - Says: flowing water erodes and scours; drainage helps
  - So: the cell includes a scour curve, but DOE gives no numbers for it
- **[Damage team (dossier section 7.3)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_solar/current/flood_solar_curve_derivation_dossier_v1_0.md#73-velocityscour-proxy)** (the Damage team’s own choice)
  - Did: chose the speed steps and the percentages
  - So: every number on this line is a placeholder, our judgment (T4)

**On the Damage dashboard:** [8 · pile scour](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/flood_solar/curves/FS_FOUND)

Moving water can wash the soil out from under the piles that hold the racks up. That is a different kind of damage from water getting into a box, so it has its own curve on its own axis, which is how fast the water flows. The dossier is explicit that the whole curve is a placeholder. DOE says only that scour is real and that drainage helps.

The percentages were made up so that there would be something on the page until a site's own hydraulic study replaces them. Its numbers are our judgment (T4).

## What the review checked, and why it is usable for screening

The damage-curve review judged every curve by one question: is it good enough for a rough national map? That means the size of the loss is about right, places come out in a sensible order, and the curve says what it leaves out. For each curve it checked that the numbers come from the documents cited, whether it is the right curve for a national map, and whether Hazard feeds it the right input.

### What was checked

The review read NEMA's printed table on electrical equipment that has been under water. It says switchgear (the large breaker cabinets) can often be cleaned and reconditioned, while every type of transformer should be replaced. The cell does the opposite: it gives switchgear the steepest curve (all lost at 30 cm of water) and the transformer a gentle one (45 % at 30 cm, all lost only at 2 m). So these two curves look the wrong way round.

Switchgear and the transformer are small parts of the plant's value, so swapping the two curves would move the plant's total by only one or two percentage points. They still need to be swapped: switchgear should get the gentler curve and the transformer the steeper one. Until that is done, neither curve should be used on its own, for example to price a substation or a transformer.

The review looked for any flooded utility solar plant with a published loss and found none, so the dollar level has nothing real to be compared with. Hazard has its own comparison file, but it uses this same cell as its upper limit, so it is not an independent check.

The review also looked at how high each piece of equipment is assumed to sit above the ground. Those heights come from Hazard's standard plant description, which marks them as assumed, not measured.

### Why it is usable for screening

Water rising past the base of each cabinet is the right way the equipment gets damaged.

The base heights are plausible for equipment mounted on pads, and if anything lower than Hazus assumes for substations, so the electrical side errs on the high side.

Deeper water always means more loss, so sites rank in a sensible order by flood depth.

### What to keep in mind

Use the plant total for screening, but not the switchgear or transformer curve on its own: both are flagged to be swapped.

Only about half the plant's value has a curve (48 % on the review's value split). Racking and civil works have none.

The curves only know depth, not water speed, so fast coastal and channel floods come out too low compared with slow ponding.

The lower edge of the panels is assumed to sit 1.0 m above the ground. The modules are the biggest share of value and go from no loss to full loss between 1.0 and 1.5 m of water, so a plant in medium-depth water can read two or three times higher or lower if that height is wrong.

### What would change the verdict

One flood claim file from a US utility solar plant, with the water depth, which cabinets were replaced and which reconditioned, and the amount paid against the plant's value, would test the dollar level.

In short: flood and solar has no measured dots at all. Four documents (group D) say which parts fail when wet and how abruptly. Three documents (group E) say what the axis is and why the curve is a table. Two (group F) turn the curve into dollars. Every percentage on every curve was chosen by the Damage team and is listed as an assumption in the dossier. That is why the review calls the cell "fine with a caveat": it ranks sites sensibly and says what it does not know, but no number in it has been tested against a flooded plant.

## All 9 sources, sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| 1 | **DOE/FEMP, Preventing and Mitigating Flood Damage to Solar PV Systems**<br>[energy.gov/femp/preventing-and-mitigating-flood-damage-solar-photovoltaic-systems](https://www.energy.gov/femp/preventing-and-mitigating-flood-damage-solar-photovoltaic-systems)<br>Where to look: the sections on full submersion, raising equipment, water entering through conduits, and stormwater. | Gives no number. It says a submerged inverter is a total loss and that water gets in through conduits, so the electronics curves (1, 4 and 5) start rising within a few centimetres and end at 100 %. |
| 3 | **NEMA GD 1-2016, Evaluating Water-Damaged Electrical Equipment (open PDF)**<br>[nema.org … nema-gd-1-2016-evaluating-water-damaged-electrical-equipment-guide.pdf](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-1-2016-evaluating-water-damaged-electrical-equipment-guide.pdf)<br>Where to look: the table of what to replace and what to recondition after water damage. | Gives no number. The cell read it as: wet electronics and switchgear are replaced, oil-filled transformers are tested first. That shapes curves 1 to 5. Our review reads the printed table the other way round for switchgear and transformers (see the review section). |
| 2 | **NEMA GD 1-2019 (current standard page)**<br>[nema.org/standards/view/evaluating-water-damaged-electrical-equipment](https://www.nema.org/standards/view/evaluating-water-damaged-electrical-equipment)<br>Where to look: the standard’s page; the full text is sold separately. | Gives no number. The current edition of #3, with the same categories; it confirms the 2016 rule still stands. |
| 4 | **NEMA Enclosure Types**<br>[nema.org … nema-enclosure-types.pdf](https://www.nema.org/docs/default-source/products-document-library/nema-enclosure-types.pdf)<br>Where to look: the table of enclosure types (Type 6 and 6P are built to survive being under water). | Gives no number. It would let a plant with submersible cabinets get a gentler curve; the grid does not use this adjustment. |
| — | **Damage team, v1.0 workbook (dossier section 7.2, section 7.3, section 8)**<br>[github.com … flood\_solar\_curve\_derivation\_dossier\_v1\_0.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_solar/current/flood_solar_curve_derivation_dossier_v1_0.md)<br>Where to look: dossier sections 7.2 and 7.3 (the tables) and section 8 (the list of assumptions). | Gives every number on every curve: the Damage team chose all the percentages, following the rules above (T3; T4 for curve 8). Section 8 of the dossier lists them as assumptions. |
| **E · Decides what the bottom axis means** | | |
| 1 | **DOE/FEMP (again)** | Gives no number. It says to raise equipment, which is why each curve reads the water depth above that part’s own base, not above the ground. |
| 5 | **FEMA / Building America, Protecting Building Utility Systems From Flood Damage**<br>[basc.pnnl.gov … protecting-building-utility-systems-flood-damage-principles-and-practices-design-and](https://basc.pnnl.gov/library/protecting-building-utility-systems-flood-damage-principles-and-practices-design-and)<br>Where to look: its sections on raising and protecting utility equipment against floods. | Gives no number. It supports measuring water against each part’s own base height: equipment raised above the water is not damaged. |
| 6 | **USACE HEC-FIA, Depth-Percent Damage Relationships**<br>[hec.usace.army.mil … depth-percent-damage-relationships-direct-damage](https://www.hec.usace.army.mil/confluence/fiadocs/fiatechref/latest/direct-damage/depth-percent-damage-relationships-direct-damage)<br>Where to look: the page on depth-percent damage relationships. | Gives no number. It is why each curve is a table of depths joined by straight lines rather than a smooth S-curve: that is the standard Army Corps format. |
| **F · Turns the curve into dollars** | | |
| 7 | **Solar/wind value breakdown workbook**<br>[github.com … solar\_wind\_value\_breakdown.xlsx](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/value_basis/solar_wind_value_breakdown.xlsx)<br>Where to look: sheet Solar\_Map: the value of each part. | Gives the value share of each part (modules, cables, switchgear, transformer, inverter, combiners and SCADA), which turns each part’s loss into dollars. |
| 8 | **Engineering substrate decomposition**<br>[github.com … substrate\_decomposition.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/source_drops/context/v2_5/substrate_decomposition.md) | Gives the list of plant parts the curves attach to, so the cell can say which parts have no curve. |
| **I · Background only, no number taken** | | |
| 9 | **Anzgeo 2023, scour context**<br>[github.com … HOW\_THE\_MODEL\_IS\_BUILT.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/flood_solar/basics/HOW_THE_MODEL_IS_BUILT.md)<br>Where to look: the cell’s build notes, where it is listed as background for curve 8. | Gives no number. Scour depends on moving water and on the site, so no general foundation curve can be taken from it; this is why curve 8 stays a placeholder. |
