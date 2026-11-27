Damage-curve review · wildfire × wind farm

# Wildfire × wind farm curve, where its numbers come from

A wildfire curve for a wind farm answers one question: **if a wildfire burns through the cell around a turbine pad or the substation with flames of a given length, what share of that one part’s value is lost?** It covers only two parts, the electrical kit at each turbine’s pad and the protection and control package at the substation, which together are a small share of a farm; everything else is withheld, not counted as zero.

Like wildfire and solar, each part gets a table of six values, one per flame-length class of the Forest Service fire model, all chosen by the Damage team; unlike the solar cell, nothing adds them up into a farm number. The dashboard calls both tables “our judgment” (tier T4); the axis they sit on is a published Forest Service product.

## Curve 1: the electrical kit at each turbine’s pad

Curve 1 · pad electrical: half lost only at the 12 ft and up class · our judgment (T4)

**What each source says, and what that means for the line**

- **[#6 · owner direction and Damage team table (WW1-A001)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_wind/current/SOURCE_REGISTER_wildfire_wind__model_v1_0__docs_r1.csv)** (the Damage team’s own choice)
  - pad transformer, switchgear and terminations lose 0.1, 0.6, 3, 12, 35, 70 % from class 1 to class 6 (our judgment)
- **[#4 · Butler, Wallace and Hogge 2015, USFS](https://research.fs.usda.gov/treesearch/49452)** (numbers on the curve come from it)
  - no number; steel transformer and junction enclosures were not susceptible, mainly because of the steel exterior: why pads sit lower
- **[#3 · NEMA GD 2-2016, fire-damaged equipment](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-2-2016-evaluating-fire-and-heat-damaged-electrical-equipment-guide.pdf)** (numbers on the curve come from it)
  - no number; heat-exposed apparatus is evaluated and some of it reconditioned, not always replaced

**On the Damage dashboard:** [1 · pad electrical kit](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_wind/curves/WWV1_PAD_ELECTRICAL_FSIM_T4)

This table covers the electrical kit at the foot of each turbine: its step-up transformer, local switchgear, enclosure and cable terminations, valued as that one unit. The six numbers, 0.1, 0.6, 3, 12, 35, 70 % from the smallest flame class to the largest, were set by the Damage team under an explicit owner direction of 8 August 2026 to represent wildfire on wind farms even if only one or two parts could be supported (source [#6](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_wind/current/SOURCE_REGISTER_wildfire_wind__model_v1_0__docs_r1.csv), assumption WW1-A001).

The tier table grades them T4, our judgment, and nothing on the curve was measured. The sources only set the order. A Forest Service study (source [#4](https://research.fs.usda.gov/treesearch/49452), Butler, Wallace and Hogge 2015) found transformer and junction enclosures were not susceptible to damage, mainly because of their steel exterior, which is why the pad table sits below the control table on curve 2; NEMA’s guide to fire-damaged equipment (source [#3](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-2-2016-evaluating-fire-and-heat-damaged-electrical-equipment-guide.pdf)) says some heat-exposed apparatus can be evaluated and reconditioned.

Neither ties damage to a flame class. The six numbers are identical to the transformer and switchgear row of the wildfire and solar cell; the register records that as an audit fingerprint only (source [#5](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/current/wildfire_solar__model_v1_0__docs_r3__curve_artifact.json)), not as evidence carried across. The review (v5, A.9) notes the top two values (35 and 70 %) were set for solar electronics and are probably high for a steel-tank transformer standing on gravel.

The halfway point means that only when a wildfire burns through the turbine’s cell with flames of 12 ft or more does the pad kit lose more than half of its value on this table. The table is used in Damage only; Hazard’s grid does not yet call this cell, and the cell never adds the pads up to a farm figure.

## Curve 2: the protection, control and DC package at the substation

Curve 2 · substation controls: half lost from the 8 to 12 ft class · our judgment (T4)

- **Curve 2:** Substation controls
- **Curve 1 (for comparison):** Pad electrical, the same as curve 1 above

**What each source says, and what that means for the line**

- **[#6 · owner direction and Damage team table (WW1-A001)](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_wind/current/SOURCE_REGISTER_wildfire_wind__model_v1_0__docs_r1.csv)** (the Damage team’s own choice)
  - relays, control, SCADA, communications, station service and DC lose 0.4, 2, 8, 25, 60, 90 % from class 1 to class 6 (our judgment)
- **[#3 · NEMA GD 2-2016, fire-damaged equipment](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-2-2016-evaluating-fire-and-heat-damaged-electrical-equipment-guide.pdf)** (numbers on the curve come from it)
  - no number; heat-damaged relays, communications, UPS and cable endpoints are replaced: why controls sit higher
- **[#2 · Severino and colleagues 2024](https://doi.org/10.1071/WF22113)** (numbers on the curve come from it)
  - no number; polymeric contents of a substation can ignite under radiant heat. Not re-read: the publisher’s page blocked the fetch

**On the Damage dashboard:** [2 · substation controls](https://damage-curves-wsd6lcl64q-uc.a.run.app/cells/wildfire_wind/curves/WWV1_GSU_PROTECTION_CONTROL_DC_FSIM_T4)

The second table covers one shared package at the farm’s substation: protection relays, control and SCADA equipment, communications, station service and the DC batteries. The main transformer, switchgear and cable terminations are separate parts and are withheld. Its numbers, 0.4, 2, 8, 25, 60, 90 % from class 1 to class 6, are again the Damage team’s choice under the owner’s direction (source [#6](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_wind/current/SOURCE_REGISTER_wildfire_wind__model_v1_0__docs_r1.csv)), graded T4, our judgment.

It rises faster than the pad table because electronics, batteries and plastic-covered cable are replacement-prone after fire or heat: NEMA’s guide (source [#3](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-2-2016-evaluating-fire-and-heat-damaged-electrical-equipment-guide.pdf)) says damaged relays, communications gear, UPS units and cable ends should be replaced. A modelling study of a Chilean substation (source [#2](https://doi.org/10.1071/WF22113), Severino and colleagues 2024) supports giving polymeric contents a nonzero, sharply rising vulnerability; the publisher’s page could not be opened for this page, and the review’s source check (B) could not open it either.

These numbers equal the monitoring and communications row of the wildfire and solar cell (source [#5](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/current/wildfire_solar__model_v1_0__docs_r3__curve_artifact.json), audit only). The halfway point means that once flames in the substation’s cell reach 8 to 12 ft, the control package is more than half lost on this table. The package is valued once for the farm, at its own footprint, and never multiplied by the turbine count.

In short: wildfire and wind farm is two chosen tables for two small electrical parts, kept in a sensible order by an equipment guide and a Forest Service study. No source gives a loss at a known flame class, so there are no dots; nothing turns the tables into dollars, because the cell emits a damage ratio per part and withholds every farm-level number. The turbines themselves, the collection system, the main transformer, buildings, foundations and roads have no curve. In the source table, the number of sources in each group is: D (shape and choices) 4, E (bottom axis) 1, H (method) 1, J (not used) 1.

## All 6 listed sources (and 1 repository rule), sorted by what each one does: with links

Each source has the same number here as on the Damage dashboard, in the ‘Sources’ list under ‘Where the numbers come from’. The register ID is in brackets.

| # | Source · link · where to look | What it contributes |
|---|---|---|
| **D · Explains the curve’s shape or a choice behind it, gives no number (the Damage team’s own numbers are here too)** | | |
| 2 | **Severino et al. Assessing wildfire risk to critical infrastructure in central Chile: application to an electrical substation. International Journal of Wildland Fire (2024). DOI 10.1071/WF22113. (WW1-S002)**<br>[doi.org … WF22113](https://doi.org/10.1071/WF22113)<br>Where to look: substation target inventory; PMMA proxy-fuel radiant-flux probit; case heat-flux results. | Gives no number. Helped decide: polymeric control contents get a nonzero, steeply rising table (curve 2). |
| 3 | **NEMA GD 2-2016, Evaluating Fire- and Heat-Damaged Electrical Equipment. (WW1-S003)**<br>[nema.org … nema-gd-2-2016-evaluating-fire-and-heat-damaged-electrical-equipment-guide.pdf](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-2-2016-evaluating-fire-and-heat-damaged-electrical-equipment-guide.pdf)<br>Where to look: sections on switchgear, transformers, wire/cable, protective relays/meters, communications, UPS and residue. | Gives no number. Helped decide: controls and electronics sit above steel apparatus (curve 2 above curve 1). |
| 4 | **Butler, Wallace, and Hogge. Wildfire vulnerability of power transmission and distribution infrastructure (USFS, 2015). (WW1-S004)**<br>[research.fs.usda.gov … 49452](https://research.fs.usda.gov/treesearch/49452)<br>Where to look: preliminary steel-tower and transformer/junction-enclosure simulations. | Gives no number. Helped decide: steel-enclosed pads sit low, but not at zero (curve 1). The review’s source check (B) read the sentence on steel enclosures. |
| 6 | **Owner direction in Damage Modeling task, 2026-08-08: represent wildfire-wind risk even if only one or two subsystems can be supported. (WW1-A001)**<br>[github.com … SOURCE\_REGISTER\_wildfire\_wind\_\_model\_v1\_0\_\_docs\_r1.csv](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_wind/current/SOURCE_REGISTER_wildfire_wind__model_v1_0__docs_r1.csv)<br>Where to look: explicit coverage-first Tier-4 business decision. | Gives no number. The numbers themselves: every value on curves 1 and 2, set under the owner’s coverage-first direction of 8 August 2026. No link: the register records it as a conversation. |
| **E · Decides what the bottom axis means** | | |
| 1 | **Dillon et al. Spatial datasets of probabilistic wildfire risk components for the United States (270 m), 3rd ed., USFS RDS-2016-0034-3 (2023). (WW1-S001)**<br>[fs.usda.gov … \_metadata\_RDS-2016-0034-3.html](https://www.fs.usda.gov/rds/archive/products/RDS-2016-0034-3/_metadata_RDS-2016-0034-3.html)<br>Where to look: conditional flame-length probability class definitions and 270 m support. | Sets the bottom axis: the six flame-length classes on the bottom axis, and the rule that class is not heat at the equipment (confirmed on the metadata page by the review’s source check, B). |
| **H · Method and template** | | |
| — | **Damage Modeling governed damage-curve standards and skill workflow. (GOVERNANCE\_CONTRACT)**<br>[github.com … 00\_index.md](https://github.com/aamani-ai/damage_modeling/blob/main/docs/method/standards/00_index.md)<br>Where to look: cell package, provenance, pathway, capability, versioning, and fail-closed standards. | Repository rule, not a source: the dashboard lists it separately, without a number. The repository’s rules: withheld means withheld, not zero; no farm total from two parts. |
| **J · Not used by this curve: listed to show what was looked at, and why it was left out** | | |
| 5 | **Damage Modeling wildfire\_solar model v1.0/docs r3. (WW1-S005)**<br>[github.com … wildfire\_solar\_\_model\_v1\_0\_\_docs\_r3\_\_curve\_artifact.json](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_solar/current/wildfire_solar__model_v1_0__docs_r3__curve_artifact.json)<br>Where to look: WSV1\_MV\_EQUIPMENT\_THERMAL and WSV1\_SCADA\_THERMAL point arrays. | Not used as evidence. The two tables are numerically identical to two wildfire and solar rows; the register keeps that as an audit fingerprint only. |

**Gaps worth knowing, found while building this page.** (1) The source that authorises every number (source [#6](https://github.com/aamani-ai/damage_modeling/blob/main/docs/cells/wildfire_wind/current/SOURCE_REGISTER_wildfire_wind__model_v1_0__docs_r1.csv), the owner’s direction) is a conversation record with no link. (2) The two tables are identical to two rows of the wildfire and solar cell; the register calls that an audit fingerprint, but the review (v5, A.9) reads it as the solar values copied across and asks for the pad values to be set again for wind. (3) The cell has no value link at all: it refuses the only local cost row (a mixed 72 dollars per kW electrical line) and emits damage ratios only; the dashboard still shows a covered share (8 %, plus 4 % partly), which comes from its own reference profile, not from the cell. (4) The dossier says the flame class describes the surrounding 270 m cell, not the heat at a pad standing on gravel, and the cell gives no credit for clearance.
