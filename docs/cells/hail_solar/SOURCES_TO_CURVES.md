Damage-curve review · hail × solar farm

# Hail × solar curve, where its numbers come from

A hail curve for a solar plant answers one question: **if a hailstone of a given size hits a solar panel, what share of the panels will break?**

There are three curves, one for each kind of panel glass, and one adjustment for plants whose panels can tilt away from a storm. Each dot is one published number, from the PVEL 2023 laboratory scorecard, the Kiwa PVEL 2026 scorecard or the certification test described in the DOE guide. Every dot sits at its real hail size and its real breakage share, and the Damage team drew the line through the dots.

### What the labels on this page mean

A cell is one hazard × asset pair in the Damage repository, and its dossier is the write-up of how its curves were built.

Each curve is marked by how well it is backed:

- **published (T2)**: taken from a published source and used unchanged
- **borrowed (T3)**: a published result carried over to a case it was not made for
- **our judgment (T4)**: numbers the Damage team chose

Withheld means no number is given, because nobody knows; it is not the same as zero.

## Curve 1 · thin glass-on-glass modules

**What each source says, and what that means for the line**

- **[#5 · PVEL 2023 scorecard](https://2023modulescorecard.pvel.com/hail-stress-sequence/)** (numbers on the curve come from it)
  - Says: in the lab, these shares of thin glass-on-glass panels broke: ① 35 mm: 18 %  ② 40 mm: 57 %  ⑤ 50 mm: 89 %
  - So: dots ①, ② and ⑤ on the curve
- **[#4 · Kiwa PVEL 2026 scorecard](https://scorecard.pvel.com/hail-stress-sequence/)** (numbers on the curve come from it)
  - Says: in the lab, these shares of the same panels broke: ③ 40 mm: 43 %  ④ 45 mm: 61 %
  - So: dots ③ and ④; the line is drawn through all five dots

**On the Damage dashboard:** [1 · thin glass-on-glass](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/hail_solar/curves/HAIL_SOLAR_FRAGILE_THIN_GG)

Two laboratories fired ice balls at thin-glass panels and counted how many cracked. PVEL reported three results in 2023: at 35 mm, 18 % of panels cracked; at 40 mm, 57 %; at 50 mm, 89 %. Kiwa PVEL reported two results in 2026: at 40 mm, 43 % cracked, and at 45 mm, 61 %. Those five counts are the five dots. The Damage team drew one S-shaped line as close as possible to all five.

Half the panels crack at 41 mm, about the size of a golf ball: if hail that size hits a plant with these panels, about half of them are expected to crack. Smaller hail cracks fewer and bigger hail cracks more. Every dot is a laboratory count, so the curve is marked published (T2).

## Curve 2 · ordinary 3.2 mm glass-on-backsheet modules (the default)

**What each source says, and what that means for the line**

- **#1/14 · DOE/FEMP hail guide** (numbers on the curve come from it)
  - Says: every panel must pass the IEC test with 25 mm hail
  - So: dot ① (25 mm: 1 %) is our judgment, based on that test
- **[#5 · PVEL 2023 scorecard](https://2023modulescorecard.pvel.com/hail-stress-sequence/)** (numbers on the curve come from it)
  - Says: ② 50 mm: 39 % of ordinary panels broke in the lab
  - So: dot ②; the line is drawn through ① and ②

**On the Damage dashboard:** [2 · ordinary 3.2 mm glass (default)](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/hail_solar/curves/HAIL_SOLAR_DEFAULT_3P2_GBS)

This is the kind of panel most plants have, so it is the default curve. It has only two dots. The dot at 25 mm, about the size of a large marble, is not a count. Every panel sold must survive a 25 mm ice ball to be certified, and the DOE guide describes that test.

"Survives" is a word rather than a number, and a line cannot be drawn through a word, so the Damage team chose 1 % to stand for "almost none break". That 1 % is the Damage team's choice, not a figure from any laboratory. The dot at 50 mm, about the size of a tennis ball, is PVEL's 2023 count: 39 % of these panels cracked.

The Damage team drew one S-shaped line through the two dots; half the panels crack at 53 mm. The 50 mm count is published. The 25 mm dot is a published test read as near zero. The line is the Damage team's.

## Curve 3 · hail-hardened modules

**What each source says, and what that means for the line**

- **#1/14 · DOE/FEMP hail guide** (numbers on the curve come from it)
  - Says: hail-hardened panels must beat that 25 mm test
  - So: dot ① (25 mm: 0.5 %) is our judgment: half the ordinary 1 %
- **[#4 · Kiwa PVEL 2026 scorecard](https://scorecard.pvel.com/hail-stress-sequence/)** (numbers on the curve come from it)
  - Says: ② 45 mm: 7 % of hardened panels broke in the lab
  - So: dot ②; the line is drawn through ① and ②

**On the Damage dashboard:** [3 · hail-hardened](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/hail_solar/curves/HAIL_SOLAR_HARDENED_THICKER)

Some panels are built to be extra tough. This curve also has two dots. The dot at 25 mm is set at 0.5 %, which is half of the ordinary curve's 1 %. The dossier's reason is that hardened panels should be no worse than ordinary certified panels, and 0.5 % is a chosen number rather than a count. The other dot is Kiwa PVEL's 2026 count that only 7 % of hardened panels cracked at 45 mm.

Both dots sit at the easy end of the curve, and nothing was tested at a size large enough to crack most of these panels. The line is therefore stretched to the right until half the panels crack at 64 mm, about the size of a baseball, a point that no laboratory has measured. That stretch is why it is marked borrowed (T3) rather than published (T2).

The curve is used only when a plant can prove that its panels are the hardened kind.

## Stow adjustment · applied to all three curves when trackers can tilt

- **Before:** Curve 1 · thin glass-on-glass modules, as published (reference)
- **After:** Curve 1 with stow · moved 8 mm to the right and capped at 90 % (our judgment)

**What each source says, and what that means for the line**

- **[#18 · VDE Americas stow memo](https://www.vde.com/en/vde-americas/newsroom/hail-stow-tech-memo)** (no number on the curve comes from it)
  - Says: steep tracker tilt cuts breakage, but gives no number
  - So: backs having a stow adjustment; no number on the curve
- **#1/14 · DOE/FEMP hail guide** (no number on the curve comes from it)
  - Says: stow the trackers before hail if you can; gives no number
  - So: backs the idea; no number on the curve
- **[Damage team (dossier section 13.3)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/hail_solar/current/hail_solar_curve_derivation_dossier_v1_3.md#133-current-stow-adjustment)** (the Damage team’s own choice)
  - Did: chose 8 mm and 90 % as round placeholder values
  - So: the 'after' line is curve 1 moved 8 mm to the right and capped at 90 %

**On the Damage dashboard:** [the cell page (the stow adjustment has no curve page of its own)](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/hail_solar)

If a plant's trackers can tilt the panels almost upright when hail is coming, the stones hit at a glancing angle and fewer panels break. The VDE memo and the DOE guide are used for one thing only: they say that tilting helps. That is why the rule exists and why it moves the curve to the right rather than to the left. Neither document gives a number.

The numbers were chosen by the Damage team ([section 13.3 of the dossier](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/hail_solar/current/hail_solar_curve_derivation_dossier_v1_3.md#133-current-stow-adjustment)): treat every stone as 8 mm smaller than it is, which slides the whole curve to the right, and never count more than 90 % of the panels as broken. Both are round placeholder values with no test or document behind them, which is why they are marked our judgment (T4).

[Section 13.4 of the dossier](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/hail_solar/current/hail_solar_curve_derivation_dossier_v1_3.md#134-why-this-is-a-placeholder) (the Damage team’s write-up of how the hail × solar curves were built) says they should be replaced when tracker-specific hail tests, an angle-specific impact model, or insurance claims sorted by stow angle become available. This is not a fourth curve. It is a rule applied on top of whichever of the three curves a plant uses, and only when the plant's data says it has trackers that can stow.

## What the review checked, and why it is usable for screening

The damage-curve review judged every curve by one question: is it good enough for a rough national map? That means the size of the loss is about right, places come out in a sensible order, and the curve says what it leaves out. For each curve it checked that the numbers come from the documents cited, whether it is the right curve for a national map, and whether Hazard feeds it the right input.

### What was checked

Six of the eight numbers the cell cites were confirmed in their sources.

The curves' shape and midpoint were fitted to public laboratory hail-impact test results (PVEL and Kiwa), so they rest on measurements rather than judgment.

Hazard compared the model with published solar loss ranges from five insurers and brokers, and says plainly that this is a ballpark check and only partly independent.

It also matches one real event. At Midway Solar in Texas (2019), hail over two inches damaged about 58 % of the plant's 685,000 modules, and reported insured losses were $70 to 80 million against a project cost of about $260 million. The curve gives the same module share at about 55 mm hail, although its dollar figure comes out somewhat low.

### Why it is usable for screening

The size of the loss is anchored to measurements.

Bigger hail always means more loss, so places rank in a sensible order.

It says what it leaves out: only the modules have a curve, and racking, trackers, inverters and controls are declared as having none.

### What to keep in mind

Two numbers are judgment: how far the curve shifts when trackers tilt the panels away from the hail (8 mm), and the 90 % maximum in that case. An industry memo supports the direction of both, not their size.

Two things on the Hazard side set the loss level more than the curve does. Hazard's radar hail product has a floor, so every severe pixel arrives at about 39 mm whatever the real size. And the two repositories use different module value shares: Hazard 35.5 % of installed cost (hardware plus site work), the cell 26 % (hardware only), about 37 % apart.

### What would change the verdict

Insurer claims by hail size for utility solar plants would test both the rule that a broken module glass means a replaced module and the effect of the radar floor.

In short: two laboratories (group B) supply every measured dot. One guide (group C) supplies the pass or fail test that the dossier turned into the 1 % and 0.5 % dots. One memo and that same guide (group D) justify the stow rule, whose numbers were chosen by the Damage team. The other fourteen sources set the axis (group E), turn the curve into dollars (group F), describe the method (group H), give background (group I), or are not used (group J). All eight dots were checked against their source pages on 12 November, and the PVEL 2023 and Kiwa 2026 percentages are where the table says they are.

## All 21 sources, sorted by what each one does: with links and where each number sits

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **B · Puts a measured dot on a curve** | | |
| 5 | **PVEL 2023 scorecard, Hail Stress Sequence**<br>[2023modulescorecard.pvel.com … hail-stress-sequence](https://2023modulescorecard.pvel.com/hail-stress-sequence/)<br>Where to look: Key Takeaways: under the heading “Glass//glass modules are more than twice as likely to break than glass//backsheet” (89 % and 39 % at 50 mm) and under “Glass breakage reduced at lower hail diameters, but wasn’t completely eliminated” (57 % at 40 mm, 18 % at 35 mm). Verified on the page 12 Nov. | Gives dots ①, ② and ⑤ on curve 1 (35 mm: 18 %, 40 mm: 57 %, 50 mm: 89 %) and dot ② on curve 2 (50 mm: 39 %). These are lab counts of broken panels. |
| 4 | **Kiwa PVEL 2026 scorecard, Hail Stress Sequence**<br>[scorecard.pvel.com … hail-stress-sequence](https://scorecard.pvel.com/hail-stress-sequence/)<br>Where to look: On the 2026 Scorecard page: “HSS Key Takeaways”, “Standard modules” callout — “43% of modules with this glass thickness break from 40 mm hail impacts” and the large “61%” figure, “of 2.0 mm glass//2.0 mm glass modules break from 45 mm hail”; “Hail-hardened modules” callout, large “7%” figure, “of thicker glass modules break from 45 mm hail”. | Gives dots ③ and ④ on curve 1 (40 mm: 43 %, 45 mm: 61 %) and dot ② on curve 3 (45 mm: 7 %). These are lab counts of broken panels. |
| **C · Puts a dot whose height we chose** | | |
| 1 / 14 | **DOE/FEMP Hail Damage Mitigation guide (logged in two sheets)**<br>[energy.gov … hail-damage-mitigation-solar-photovoltaic-systems](https://www.energy.gov/femp/hail-damage-mitigation-solar-photovoltaic-systems)<br>Where to look: The IEC 61215 test table (25 mm 7.54 g 23 m/s … 76 mm 203 g 39.5 m/s) and the module-selection and hail-stow guidance paragraphs. The 1 % and 0.5 % are not on the page; they are the dossier’s reading of “passes”. | Gives the 25 mm hail test that every certified panel must pass. The Damage team turned ‘passes’ into 1 % for curve 2 and 0.5 % for curve 3; those dot heights are chosen, not measured. |
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| 18 | **VDE Americas hail-stow memo**<br>[vde.com … hail-stow-tech-memo](https://www.vde.com/en/vde-americas/newsroom/hail-stow-tech-memo)<br>Where to look: Quoted in the workbook: maximum tracker tilt reduces exposed glass area and the normal element of kinetic energy; typical maximum tilt 50–75°. No percentage reduction given. | Gives no number. It says tilting panels steeply cuts breakage, which is why the stow adjustment exists and moves curve 1 to the right. The 8 mm and 90 % are not from it. |
| 1 / 14 | **DOE/FEMP guide (again)**<br>[energy.gov … hail-damage-mitigation-solar-photovoltaic-systems](https://www.energy.gov/femp/hail-damage-mitigation-solar-photovoltaic-systems)<br>Where to look: The IEC 61215 test table (25 mm 7.54 g 23 m/s … 76 mm 203 g 39.5 m/s) and the module-selection and hail-stow guidance paragraphs. The 1 % and 0.5 % are not on the page; they are the dossier’s reading of “passes”. | Gives no number. It recommends stowing trackers before hail, which backs the stow adjustment. |
| 19 | **FTC Solar 80° hail-stow release**<br>[investor.ftcsolar.com … ftc-solar-launches-automated-80deg-high-angle-stow-1p-pioneer](https://investor.ftcsolar.com/news-releases/news-release-details/ftc-solar-launches-automated-80deg-high-angle-stow-1p-pioneer/)<br>Where to look: Press release headline and body: automated 80° stow. | Gives no number. It shows trackers really can tilt to 80°, so the stow adjustment is realistic. |
| — | **Damage team, v1.3 workbook (dossier §13.3)**<br>[github.com … hail\_solar\_curve\_derivation\_dossier\_v1\_3.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/hail_solar/current/hail_solar_curve_derivation_dossier_v1_3.md)<br>Where to look: dossier section 13.3, and the audit workbook sheet Hail\_Adjustment\_Rules in the same folder. | Chose the 8 mm shift and the 90 % cap for the stow adjustment as placeholders. It has no number in the list because no document gives these values. |
| **E · Decides what the bottom axis means** | | |
| 2 | **NOAA/NWS MESH product page**<br>[vlab.noaa.gov … maximum-estimated-size-of-hail-mes-2](https://vlab.noaa.gov/web/wdtd/-/maximum-estimated-size-of-hail-mes-2)<br>Where to look: Product description: MESH estimates maximum hail size, displayed in inches, base units mm. | Gives no number. The radar product behind the hail grid reports hail as a size, which is why the bottom axis is hail size in mm. |
| 3 | **NOAA/NCEI Storm Events FAQ**<br>[ncei.noaa.gov … faq.jsp](https://www.ncei.noaa.gov/stormevents/faq.jsp)<br>Where to look: FAQ entry on hail magnitude: size in inches and hundredths. | Gives no number. Ground reports also give hail as a size, so the same axis fits radar and reports. |
| 17 | **PVEL Hail Stress Sequence whitepaper**<br>[pvel.com … PVEL\_White-Paper\_Hail-Stress-Sequence-for-PV-Modules.pdf](https://www.pvel.com/wp-content/uploads/PVEL_White-Paper_Hail-Stress-Sequence-for-PV-Modules.pdf)<br>Where to look: Test design section: 50 mm at terminal velocity ≈ 31.4 J; breakage can occur at 45 mm and above. | Gives no number. It describes the lab test (ice-ball sizes and speeds), so the lab results sit at the right hail size on the axis. |
| 20 | **VDE Americas 2026 wind-speed update**<br>[vde.com … return-of-hail-season](https://www.vde.com/en/vde-americas/newsroom/return-of-hail-season)<br>Where to look: March 2026 update on wind-driven hail. | Gives no number. Wind makes hail hit harder and can defeat stowing. Logged as an open question; not in any curve yet. |
| **F · Turns the curve into dollars** | | |
| 12 | **NREL PV cost model source file**<br>[data.nlr.gov … 1767739491-UPV 2025Q1.txt](https://data.nlr.gov/system/files/304/1767739491-UPV%202025Q1.txt)<br>Where to look: NREL utility-PV cost rows (2025 Q1). | Gives the cost of each plant part, from which the modules’ share of the plant’s value is worked out. |
| 11 | **Solar/wind value breakdown workbook**<br>[github.com … solar\_wind\_value\_breakdown.xlsx](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/value_basis/solar_wind_value_breakdown.xlsx) | Gives the value share of each part as the cell uses it, including the modules’ share. |
| 9 | **Valuation guide (foundations 03)**<br>[github.com … 03\_valuation\_guide.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/foundations/questions/03_valuation_guide.md) | Gives the rule for turning ‘share of panels broken’ into ‘share of the plant’s value lost’. |
| 10 | **Engineering substrate decomposition**<br>[github.com … substrate\_decomposition.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/source_drops/context/v2_5/substrate_decomposition.md) | Gives the list of plant parts, so the curve can say it covers the modules only and withholds the rest. |
| **H · Method and template** | | |
| 7 | **Damage-curve foundations bundle**<br>[github.com … foundations](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/foundations/) | Gives no number: the eight steps every curve follows. |
| 8 | **Assembled curve record (foundations 00)**<br>[github.com … 00\_assembled\_curve\_record.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/foundations/00_assembled_curve_record.md) | Gives no number: the template the curve file is written in. |
| **I · Background only, no number taken** | | |
| 6 | **NREL/IEEE Extreme Weather and PV Performance**<br>[research-hub.nrel.gov … extreme-weather-and-pv-performance-2](https://research-hub.nrel.gov/en/publications/extreme-weather-and-pv-performance-2)<br>Where to look: Abstract: hail ≥ 25 mm associated with higher performance-loss rates. | Gives no number. It shows hail mainly breaks the module glass, which is why only the modules get a curve. |
| 16 | **Kiwa PVEL 2024 scorecard**<br>[2024modulescorecard.pvel.com … hail-stress-sequence](https://2024modulescorecard.pvel.com/hail-stress-sequence/)<br>Where to look: Quoted in the workbook: 3.2 mm tempered glass//backsheet far less susceptible than 2.0 mm glass//glass; three 2.5 mm glass//glass BOMs had no breakage at 50 mm. | Gives no number. Its results agree with the dots (thicker glass breaks far less), but nothing was taken from it. |
| 21 | **VDE Americas / RETC Hail Resiliency Curve Test**<br>[vde.com … hail-resiliency-curve-test-press-release](https://www.vde.com/en/vde-americas/newsroom/hail-resiliency-curve-test-press-release)<br>Where to look: Press release. | Gives no number. It says hardened panels resist bigger hail, which agrees with curve 3; nothing was taken from it. |
| **J · Not used by this curve: listed to show what was looked at, and why it was left out** | | |
| 13 | **NREL Cost of Wind Energy Review 2024**<br>[nrel.gov … 91775.pdf](https://www.nrel.gov/docs/fy25osti/91775.pdf)<br>Where to look: NREL report PDF. | Not used here. It is in the shared value workbook for wind farms. |
| 15 | **Hail solar v1.1 site-adaptation workbook**<br>[github.com … v1\_1\_site\_adaptation](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/hail_solar/archive/v1_1_site_adaptation/) | Not used here. The previous version’s site inputs: the three slots listed below, still to be filled for any single plant. The dashboard lists those three separately as inputs, not as numbered sources. |
| — | Site-specific hail frequency curve<br>Not a document: a slot for one plant’s own data (from a data provider, the MRMS radar record, an insurer or a site study). | Would replace the default hail frequency for a single plant. The grid uses Hazard’s radar data instead, so nothing is taken from it. |
| — | Hail stow operations<br>Not a document: a slot for one plant’s stow practice (from its control system, operations team or stow protocol). | Would say how often the trackers are stowed before hail. The grid knows no plant’s trackers, so it applies no stow. |
| — | Hail swath footprint<br>Not a document: a slot for how much of one plant a given hail swath covers. | Would set how much of the plant a storm hits. The grid handles this by placing the plant at 256 positions instead. |
