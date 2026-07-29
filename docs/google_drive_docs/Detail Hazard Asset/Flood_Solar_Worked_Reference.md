**DAMAGE MODELING · WORKED REFERENCE**

**Flood × Solar — building the curve, step by step**

*How the flood × solar damage curves are built across the seven stages: what we do at each stage, why, and the evidence behind every decision — with sources and links. This is the multi-failure-unit companion to the hail × solar reference; where a decision differs from hail, the reason is called out.*

**Cell:**  flood\_solar      **Damage code:**  FLOOD\_SOLAR\_ELECTRICAL\_INUNDATION\_V1

**Design:**  multi-failure-unit (inverter · switchgear · transformer · combiner/DC · SCADA · cable · foundation · module).

**Status:**  public-source-derived v1.0 piecewise/state depth-damage package — not private-claims-calibrated.

**Where to find more**  
**GitHub repo:**  [aamani-ai/Damage\_Modeling](https://github.com/aamani-ai/Damage_Modeling)  
**Derivation dossier:**  [flood\_solar\_curve\_derivation\_dossier\_v1\_0.md](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/flood_solar/current/flood_solar_curve_derivation_dossier_v1_0.md)  
**Curation notebook:**  [notebooks/flood/solar/00\_curve\_curation\_walkthrough.ipynb](https://github.com/aamani-ai/Damage_Modeling/blob/main/notebooks/flood/solar/00_curve_curation_walkthrough.ipynb)  
**Runtime artifact:**  [flood\_solar\_\_model\_v1\_0\_\_docs\_r3\_\_curve\_artifact.json](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/flood_solar/current/flood_solar__model_v1_0__docs_r3__curve_artifact.json)  
**Slide deck:**  [Damage Modeling — From the Basics (Google Slides)](https://docs.google.com/presentation/d/1pMgfkteZrTPPlDF5DGEgQBkNmlYv9chrtU_t6JjhfIU/edit?usp=sharing)

# **STAGE 0   The modeling question**

***Decisive question:**  What are we building a curve for — and why can’t flood be one plant-level number?*

Flood is modeled as **multiple failure-units**, not one whole-plant flood-depth curve. Floodwater does not hit one material surface uniformly — it interacts with each piece of equipment’s elevation, enclosure, conduit path and drainage. Two items at the same site flood depth can see very different local exposure.

NOT:   site flood depth  \-\>  whole solar plant DR  
YES:   local depth at each component datum  \-\>  per-failure-unit DR

**Reference:**  internal method — [03 · failure-unit coverage standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/03_failure_unit_coverage_standard.md); solar-specific pathways — [DOE/FEMP PV flood guidance](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/)

# **STAGE 1   Evidence**

***Decisive question:**  What does the curated evidence base authorize, and what does each source explicitly NOT support?*

The v1.0 package is built from six external sources plus two internal ones. The discipline (per the evidence standard) is to record **what each source does and does not support** — so no source is stretched past its role:

| Source | Supports / does NOT support | Role |
| :---- | :---- | :---- |
| [DOE/FEMP PV flood guidance](https://www.energy.gov/femp/preventing-and-mitigating-flood-damage-solar-photovoltaic-systems) | Supports solar pathways (submersion, conduit water paths, raising equipment). Not final numeric depth-damage curves. | **mechanisms · T2** |
| [NEMA GD 1 — Evaluating Water-Damaged Electrical Equipment](https://www.nema.org/standards/view/evaluating-water-damaged-electrical-equipment) | Replacement/reconditioning framing for water-exposed electrical gear. Not continuous flood-depth curves. | **electrical loss · T2** |
| [NEMA GD 1-2016 (open PDF)](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-1-2016-evaluating-water-damaged-electrical-equipment-guide.pdf) | Category table: switchgear, breakers, electronics, transformers, cable. Not solar-specific; OEM guidance can supersede. | **electrical loss · T2** |
| [NEMA enclosure types](https://www.nema.org/docs/default-source/products-document-library/nema-enclosure-types.pdf) | Distinguishes rain/hosedown from submersion ratings (Type 6/6P). Rating alone doesn’t set replacement cost. | **selector · T2** |
| [FEMA / Building America utility-system flood guide](https://basc.pnnl.gov/library/protecting-building-utility-systems-flood-damage-principles-and-practices-design-and) | Elevation/protection framing for utility systems. Building-utility context, not bespoke PV curves. | **exposure · T3** |
| [USACE HEC-FIA depth-percent damage](https://www.hec.usace.army.mil/confluence/fiadocs/fiatechref/latest/direct-damage/depth-percent-damage-relationships-direct-damage) | Supports the tabular depth-percent curve FORM and interpolation. Generic method, not solar values. | **curve form · T2** |

Later evidence co-curation added mechanism support (Ketjoy et al. 2022 module depth-percent; NERC 2022 substation shallow-depth cases; ANZGeo 2023 scour) as validation and future-selector candidates — not as refit v1.0 numbers.

**Reference:**  [08 · evidence, provenance & links standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/08_evidence_provenance_and_links_standard.md)

# **STAGE 2   Grain**

***Decisive question:**  Which failure-units carry curves, and why is the split broader than hail?*

| Failure-unit | v1.0 treatment | Why |
| :---- | :---- | :---- |
| INVERTER · power electronics | **primary curve** | DOE/FEMP flags inverters as flood-sensitive; NEMA treats electronics as high-loss once wet. |
| SUBSTATION / SWITCHGEAR | **primary curve** | NEMA replacement logic → steep curve after ingress; central grid-connection value. |
| TRANSFORMER / control area | **primary, less vertical** | Liquid-filled units may allow evaluation/reconditioning, so the curve rises more gradually. |
| COMBINER / DC protection | **primary curve** | Small water-sensitive enclosures with surge/protection devices. |
| SCADA / control cabinet | **primary curve** | Electronics/comms are high-loss once wet/contaminated. |
| Collection cable / conduit | **secondary** | Wet-location cable may survive; terminations/conduit contamination dominate. |
| PV module submersion | **conditional** | Utility modules are usually elevated; material only when water reaches the lower edge. |
| Foundation / civil scour | **separate axis** | Different mechanism (velocity/erosion), not cabinet ingress — carried as a proxy. |

Everything above the waterline with no alternate ingress path is kept as an explicit DR ≈ 0 record — reviewed, not forgotten.

**Reference:**  [03 · failure-unit coverage standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/03_failure_unit_coverage_standard.md); [DOE/FEMP](https://www.energy.gov/femp/preventing-and-mitigating-flood-damage-solar-photovoltaic-systems) \+ [NEMA GD 1](https://www.nema.org/standards/view/evaluating-water-damaged-electrical-equipment)

# **STAGE 3   Axis**

***Decisive question:**  What indexes damage for each unit — and why not one site flood depth?*

The axis is **local water depth above each component’s critical datum**, plus a secondary velocity/scour proxy for foundations:

electrical ingress:   h\_i \= max(0, WSE \- z\_i\_crit)  
foundation/civil:     velocity or scour proxy  
  WSE \= water surface elevation at site datum  
  z\_i\_crit \= component-specific critical elevation

**Rejected:** a single plant-level depth curve (two items at the same site depth differ by pad height and entry height), and full 2-D depth × duration curves (duration/contamination/salinity matter, but public evidence isn’t dense enough for per-unit 2-D curves in v1 — they are carried as conditioners/open seams).

**Reference:**  [04 · x-axis decision standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/04_x_axis_decision_standard.md); elevation/protection framing — [FEMA / Building America](https://basc.pnnl.gov/library/protecting-building-utility-systems-flood-damage-principles-and-practices-design-and)

# **STAGE 4   Form  —  why this curve shape**

***Decisive question:**  What shape do the curves take, and what is the evidence for that shape (not just its parameters)?*

**Form:** piecewise-linear depth-percent (state) curves. Flood electrical damage is threshold/state-like — dry → water reaches the enclosure path → partial ingress/contamination → critical components wet → full submersion — which a tabular depth-percent curve captures better than a smooth fragility curve.

![Threshold/state depth-damage curve][image1]

*Illustrative inverter curve: near-zero until the critical elevation, then a steep threshold rise — “water is in, or it isn’t.”*

## **Alternatives considered, and why rejected**

* **Step function —** rejected as too brittle; real sites have uncertainty in elevation, sealing and contamination.

* **Logistic —** rejected as the default; it implies a smooth biological/fragility transition, whereas flood-equipment guidance is threshold/state-based. (Logistic is right for hail glass breakage, which IS a gradual probability in hail size — a deliberate cross-cell contrast.)

* **2-D depth × duration —** rejected for v1; insufficient public evidence per unit. Duration/contamination kept as conditioners.

* **Piecewise-linear depth-percent —** accepted; matches the depth-damage modeling tradition and keeps every threshold auditable.

**Reference:**  internal — [06 · curve form & adjustment standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/06_curve_form_and_adjustment_standard.md);  external precedent — [USACE HEC-FIA depth-percent](https://www.hec.usace.army.mil/confluence/fiadocs/fiatechref/latest/direct-damage/depth-percent-damage-relationships-direct-damage);  depth-damage functions as the established flood convention — [Frontiers in Water (2022)](https://www.frontiersin.org/journals/water/articles/10.3389/frwa.2022.919726/full)

## **v1.0 curve table (module replacement / equipment DR, %)**

| Failure-unit (m →) | 0.02 | 0.05 | 0.15 | 0.30 | 0.60 | 1.00 | 2.00 |
| :---- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| **Inverter** | 5% | 25% | 75% | 95% | 100% | 100% | 100% |
| **Switchgear** | 10% | 40% | 85% | 100% | 100% | 100% | 100% |
| **Transformer/control** | 3% | 10% | 25% | 45% | 65% | 80% | 100% |
| **Combiner/DC** | 10% | 35% | 80% | 100% | 100% | 100% | 100% |
| **SCADA** | 15% | 45% | 90% | 100% | 100% | 100% | 100% |
| **Cable/conduit** | 2% | 5% | 10% | 15% | 25% | 40% | 65% |
| **PV module (cond.)** | 5% | 10% | 30% | 60% | 85% | 100% | 100% |

Shared depth ordinates continue to 1.50 m; the first few centimetres matter because water entry into control sections or cable entries can trigger replacement before deep submersion. Exact intermediate percentages are engineering parameterization (see Caveats).

# **STAGE 5   Adjustments**

***Decisive question:**  What changes the curve besides depth — selector, conditioner, exposure?*

## **Selector — picks a curve variant (fixed metadata)**

* enclosure\_rating  — a Type 6/6P submersion-rated cabinet is a different curve family, not just a value scaling.

* transformer\_type  — dry-type vs liquid-filled changes replacement logic (a v1.1 selector candidate).

* cable\_wet\_location\_rating  — wet-rated cable shifts the collection curve.

## **Conditioner — event-time state**

* energized\_state / shutdown\_before\_flood  — energized inundation can increase severity/safety consequences.

* conduit\_water\_path\_present  — floodwater can reach elevated equipment through conduit (open-seam modifier).

* duration\_hr / contamination\_class  — shifts reconditioning vs replacement; carried as conditioner/open seam.

## **Exposure — value, not fragility**

fraction\_of\_component\_value\_exposed  scales affected value (e.g., only half the inverter stations in the flood swath) — it never changes fragility.

**Reference:**  [07 · selector / conditioner / exposure standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/07_selector_conditioner_exposure_standard.md);  enclosure ratings — [NEMA enclosure types](https://www.nema.org/docs/default-source/products-document-library/nema-enclosure-types.pdf)

# **STAGE 6   Emit**

***Decisive question:**  What does the cell return per event, and which metrics are honest?*

Each failure-unit emits a **scalar depth-driven DR** (plus curve version, evidence level, and selector/conditioner flags). No within-event spread is carried, so the tail is withheld:

failure-unit scalar DR ............. supported  
scenario loss (explicit value basis)  supported  
scalar EAL ........................ conditional (downstream frequency \+ cap-binding preflight)  
PML / VaR / TVaR .................. withheld (no tail distribution carried)

**Reference:**  [21 · capability & cap-binding standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/21_capability_and_cap_binding_standard.md); [09 · damage-code interface standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/09_damage_code_interface_standard.md)

# **STAGE 7   Ship**

***Decisive question:**  What does the consumer receive, and on what terms?*

The canonical artifact flood\_solar\_\_model\_v1\_0\_\_docs\_r3\_\_curve\_artifact.json serializes the piecewise/state curves and the metric gates. The consumer pins the cell-damage-model version and applies value linkage separately:

loss\_i \= DR\_i x value\_i x exposure\_fraction\_i  
then EAL / PML / return-period handled downstream, not here

The implementation note names the metadata that actually matters for flood: component critical elevation, pad height/freeboard, module lower-edge elevation, enclosure ratings, transformer type, cable wet-location rating, conduit routing, energized/shutdown state, drainage/defense state, flow velocity.

**Reference:**  [09 · damage-code interface standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/09_damage_code_interface_standard.md)

# **CAVEATS   Placeholders & open seams — read before use**

Per Prashant’s note, every load-bearing assumption is flagged with why it matters and what would replace it. These are the honest edges of v1.0:

| Open seam / placeholder | Why it matters | Update trigger |
| :---- | :---- | :---- |
| **Foundation / scour velocity proxy (T4)** | Site hydraulics/geotech dominate; the generic curve is a placeholder. | Hydraulic model or forensic failure data. |
| **Exact DR % at intermediate depths (T3)** | Mechanisms are sourced; the precise percentages are engineering parameterization. | Insurer/claims/OEM/forensic dataset. |
| **Default critical elevations** | The local-depth transform h\_i controls DR. | Site survey / EPC drawings / digital twin. |
| **Conduit water-path modifier** | Can damage equipment even when a cabinet looks elevated. | Electrical one-line, civil grading, conduit layout. |
| **Duration / salinity / contamination** | Can shift reconditioning vs replacement. | Source with duration/contamination outcomes. |
| **Enclosure-rating misuse** | NEMA 4/4X is not submersion protection (only 6/6P). | Actual enclosure rating & installation details. |

**Bottom line:** v1.0 is a public-source engineering parameterization. The mechanisms and the curve FORM are source-backed; the exact numbers are replaceable placeholders, and the scour axis is explicitly not yet calibrated. It is built so each record can be tightened when claims / OEM / site-engineering evidence arrives.

# **REFERENCES   All sources, with links**

| Source | What it supports | Tier | Link |
| :---- | :---- | :---- | :---- |
| **DOE/FEMP PV flood guidance** | Solar flood pathways; conduit/submersion mechanisms | **T2** | [open ↗](https://www.energy.gov/femp/preventing-and-mitigating-flood-damage-solar-photovoltaic-systems) |
| **NEMA GD 1 (water-damaged equipment)** | Replacement/reconditioning framing for wet electrical gear | **T2** | [open ↗](https://www.nema.org/standards/view/evaluating-water-damaged-electrical-equipment) |
| **NEMA GD 1-2016 (open PDF)** | Category table: switchgear, breakers, electronics, transformers | **T2** | [open ↗](https://www.nema.org/docs/default-source/standards-document-library/nema-gd-1-2016-evaluating-water-damaged-electrical-equipment-guide.pdf) |
| **NEMA enclosure types** | Rain/hosedown vs submersion ratings (selector) | **T2** | [open ↗](https://www.nema.org/docs/default-source/products-document-library/nema-enclosure-types.pdf) |
| **FEMA / Building America utility flood guide** | Elevation/protection framing for utility systems | **T3** | [open ↗](https://basc.pnnl.gov/library/protecting-building-utility-systems-flood-damage-principles-and-practices-design-and) |
| **USACE HEC-FIA depth-percent damage** | The tabular depth-percent curve FORM \+ interpolation | **T2** | [open ↗](https://www.hec.usace.army.mil/confluence/fiadocs/fiatechref/latest/direct-damage/depth-percent-damage-relationships-direct-damage) |
| **Frontiers in Water (2022) — depth-damage functions** | Depth-damage functions as the established flood convention | **context** | [open ↗](https://www.frontiersin.org/journals/water/articles/10.3389/frwa.2022.919726/full) |
| **InfraSure method standards (00\_global\_method)** | Governs grain / axis / form / adjustments / evidence / emit | **internal** | [open ↗](https://github.com/aamani-ai/Damage_Modeling/tree/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method) |

**Source of truth on GitHub:** [flood\_solar dossier v1.0](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/flood_solar/current/flood_solar_curve_derivation_dossier_v1_0.md)  ·  [curation notebook](https://github.com/aamani-ai/Damage_Modeling/blob/main/notebooks/flood/solar/00_curve_curation_walkthrough.ipynb)  ·  [slide deck](https://docs.google.com/presentation/d/1pMgfkteZrTPPlDF5DGEgQBkNmlYv9chrtU_t6JjhfIU/edit?usp=sharing).

[image1]: <data:image/png;base64,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>