**DAMAGE MODELING · WORKED REFERENCE**

**Hail × Solar — building the curve, step by step**

*How the hail × solar damage curve is built across the seven stages: what we do at each stage, why, and the evidence behind every decision — with the actual sources and links.*

**Cell:**  hail\_solar      **Primary damage code:**  HAIL\_SOLAR\_PV\_MODULE\_V1

**Primary failure-unit:**  PV\_MODULE\_GLASS\_CELL   inside PV\_ARRAY

**Status:**  public-source-derived v1 curve — not private-claims-calibrated. This companion mirrors the seven build stages taught in the deck; the source of truth is the derivation dossier (linked at the end).

**Where to find more**  
**GitHub repo:**  [aamani-ai/Damage\_Modeling](https://github.com/aamani-ai/Damage_Modeling)  
**Derivation dossier:**  [hail\_solar\_curve\_derivation\_dossier\_v1\_3.md](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/hail_solar/current/hail_solar_curve_derivation_dossier_v1_3.md)  
**Curation notebook:**  [notebooks/hail/solar/00\_curve\_curation\_walkthrough.ipynb](https://github.com/aamani-ai/Damage_Modeling/blob/main/notebooks/hail/solar/00_curve_curation_walkthrough.ipynb)  
**Runtime artifact:**  [hail\_solar\_\_model\_v1\_0\_\_docs\_r5\_\_curve\_artifact.json](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/hail_solar/current/hail_solar__model_v1_0__docs_r5__curve_artifact.json)  
**Slide deck:**  [Damage Modeling — From the Basics (Google Slides)](https://docs.google.com/presentation/d/1pMgfkteZrTPPlDF5DGEgQBkNmlYv9chrtU_t6JjhfIU/edit?usp=sharing)

# **STAGE 0   The modeling question**

***Decisive question:**  What exactly are we building a curve for — and for which thing that fails?*

The curve is defined before any math. We are **not** asking hail size → whole-plant loss %. We are asking hail diameter → the replacement damage ratio of one failure-unit: the PV module glass/cell.

NOT:   hail diameter  \-\>  whole solar plant damage ratio  
YES:   MESH hail diameter (mm)  \-\>  PV\_MODULE glass/cell replacement DR

**Why this framing:** hail damage concentrates on the exposed module glass/cells. Other subsystems (inverter, substation, racking, civil, foundation) are reviewed, but they are **not** forced into weak nonzero curves unless a distinct, material, sourceable direct-hail mechanism exists. Getting the failure-unit right is what keeps the whole downstream loss honest.

**Reference:**  [03 · failure-unit coverage standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/03_failure_unit_coverage_standard.md); solar-specific pathways — [DOE/FEMP hail mitigation](https://www.energy.gov/femp/hail-damage-mitigation-solar-photovoltaic-systems)

# **STAGE 1   Evidence**

***Decisive question:**  What does the curated evidence base authorize the curve to claim — and how strong is each piece?*

Before searching, we know we need five specific things — not a generic “solar hail curve”:

* what hazard intensity belongs on the **x-axis**

* what physical failure defines the **y-axis**

* at what hail sizes modules start breaking (the curve shape)

* which module types are more fragile or more resistant (selectors)

* what event-time states change damage, e.g. tracker stow (conditioners)

Four evidence classes feed the curve, each with a different role and strength (T1 \= direct empirical → T4 \= expert judgment / placeholder):

| Source | How it is used | Tier |
| :---- | :---- | :---- |
| [NOAA/NCEI Storm Events FAQ](https://www.ncei.noaa.gov/stormevents/faq.jsp) | Operational hazard data — fixes the x-axis and its units (hail size in inches / mm). Strong for the axis, silent on damage. | **axis** |
| [NOAA/NWS WDTD MESH](https://vlab.noaa.gov/web/wdtd/-/maximum-estimated-size-of-hail-mes-2) | Confirms hazard products report maximum hail size (MESH), so the axis is diameter, not energy. | **axis** |
| [DOE/FEMP Hail Damage Mitigation for PV](https://www.energy.gov/femp/hail-damage-mitigation-solar-photovoltaic-systems) | Standards / qualification: IEC 61215 hail-test table — the near-zero 25 mm boundary anchor and the diameter→mass/velocity bridge. | **T2** |
| [PVEL 2023 Hail Stress Sequence](https://2023modulescorecard.pvel.com/hail-stress-sequence/) | Lab aggregate breakage: the main archetype breakage anchors (the strongest public curve evidence). | **T2** |
| [Kiwa PVEL Hail Stress Sequence (current / 2024\)](https://scorecard.pvel.com/hail-stress-sequence/) | Additional public breakage anchors for glass//glass and thicker-glass modules. | **T2/T3** |
| [NREL Extreme Weather & PV Performance](https://research-hub.nrel.gov/en/publications/extreme-weather-and-pv-performance-2) | Field context: latent cracking vs glass-breakage seam. Validation & caveat, not a refit anchor. | **T3** |

**Binding rule:** field/claims evidence (NREL, VU Amsterdam 2024, Ha et al. 2020\) informs direction and caveats but is **not** refit into the v1 curve — it is not clean enough as universal anchors. The weakest tier used on a parameter gates which metrics are honest downstream.

**Reference:**  [08 · evidence, provenance & links standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/08_evidence_provenance_and_links_standard.md)

# **STAGE 2   Grain**

***Decisive question:**  At what level is the curve written, and what happens to everything else on the plant?*

One primary nonzero curve at the failure-unit PV\_MODULE\_GLASS\_CELL. Every other subsystem is explicitly reviewed and recorded — immune is not the same as ignored.

| Subsystem | v1 treatment | Reason |
| :---- | :---- | :---- |
| PV\_ARRAY / PV\_MODULE | **primary nonzero curve** | Direct impact mechanism and material value. |
| MOUNTING / TRACKER | **conditioner-only** | Stow/angle changes module exposure; direct steel hail damage is secondary. |
| RACKING\_STRUCTURE | **secondary / open** | Possible in extremes; not a first-order public-source curve. |
| INVERTER\_SYSTEM · SUBSTATION | **DR ≈ 0 (direct hail, v1)** | Enclosed electrical equipment, not directly exposed like modules. |
| SCADA / MET\_STATION | **optional secondary** | Exposed instruments can be hit, but low materiality. |
| CIVIL / FOUNDATION / DRAINAGE | **DR ≈ 0 (direct hail, v1)** | Direct hail does not normally drive civil/foundation replacement. |

**Composition rule when more than one unit is nonzero:** capex-weighted summation, each unit capped at its own saturation — sum, don’t group.

**Reference:**  [03 · failure-unit coverage standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/03_failure_unit_coverage_standard.md)

# **STAGE 3   Axis**

***Decisive question:**  What variable indexes damage for the module failure-unit?*

The operational x-axis is HAIL\_DIAMETER\_MESH\_EQUIV — maximum hail diameter / MESH-equivalent, internal unit mm (source-native inches or mm allowed). Reason: hazard catalogs and operational hail products report hail *size*, not kinetic energy.

Kinetic energy is kept as a derived physics bridge (from the DOE/FEMP IEC hail-test table), used to interpret lab tests — not as the required input axis:

impact energy \= 0.5 x mass(D) x velocity(D)^2  
mass\_g(D)       \= 0.0005290357 x D^2.973997  
velocity\_mps(D) \= 4.812461 x D^0.486643

| Source | How it is used | Tier |
| :---- | :---- | :---- |
| [NOAA/NCEI Storm Events FAQ](https://www.ncei.noaa.gov/stormevents/faq.jsp) | Hail magnitude reported as size in inches/hundredths — justifies a diameter axis. | **axis** |
| [NOAA/NWS WDTD MESH](https://vlab.noaa.gov/web/wdtd/-/maximum-estimated-size-of-hail-mes-2) | MESH estimates maximum hail size; base unit mm — the operational axis. | **axis** |
| [DOE/FEMP (IEC 61215 hail table)](https://www.energy.gov/femp/hail-damage-mitigation-solar-photovoltaic-systems) | Diameter→mass→velocity table behind the kinetic-energy bridge. | **T2** |

**Reference:**  [04 · x-axis decision standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/04_x_axis_decision_standard.md); axis units from [NOAA/NCEI](https://www.ncei.noaa.gov/stormevents/faq.jsp) \+ [NOAA/NWS MESH](https://vlab.noaa.gov/web/wdtd/-/maximum-estimated-size-of-hail-mes-2)

# **STAGE 4   Form**

***Decisive question:**  What shape does the curve take, and what does the y-axis mean?*

Form: a bounded **logistic** in hail diameter.

P\_break(D) \= 1 / (1 \+ exp(-k \* (D \- D50)))  
  D50 \= diameter at 50% replacement/breakage probability  
  k   \= steepness of the low-to-high transition

**Why logistic:** bounded in \[0,1\]; monotone in hail size; threshold-like without an artificial step; fits sparse public anchors without overfitting; and easy to shift horizontally for vulnerability selectors. It is a controlled v1 functional form, not a claim that nature is exactly logistic.

## **What the y-axis means**

The curve outputs P\_break(D), and v1 uses module replacement DR ≈ P\_break(D). Glass breakage is the clearest public, observable *replacement* trigger. Cell cracking without glass breakage (latent degradation) is deliberately kept out of this replacement-cost curve — an open seam to recalibrate if claims data shows replacement policy differs.

**Reference:**  why this shape — internal [06 · curve form & adjustment standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/06_curve_form_and_adjustment_standard.md); the monotone, bounded shape is set by the empirical breakage-vs-size anchors ([PVEL/Kiwa HSS](https://scorecard.pvel.com/hail-stress-sequence/)); cumulative sigmoidal forms are the established convention for fragility / vulnerability curves — lognormal-CDF in HAZUS, logistic an accepted alternative ([Bull. Earthquake Eng. 2021](https://link.springer.com/article/10.1007/s10518-021-01063-7)).

# **STAGE 5   Adjustments**

***Decisive question:**  What does the curve depend on besides intensity — selector, conditioner, exposure — and how does each enter?*

## **Selector — module\_archetype (fixed asset metadata)**

The selector picks one of three archetype curves, fit from public anchors in logit space:

logit(p) \= ln(p/(1-p))  
k   \= \[logit(p2) \- logit(p1)\] / (D2 \- D1)  
D50 \= D1 \- logit(p1)/k

| Archetype | D50 (mm) | k (1/mm) | Tier | Anchors used |
| :---- | :---- | :---- | :---- | :---- |
| **Fragile thin glass//glass** | 41.07 | 0.220633 | **T2** | 35→18% · 40→57/43% · 45→61% · 50→89% (PVEL/Kiwa) |
| **Default 3.2 mm glass//backsheet** | 52.70 | 0.165912 | **T2** | 25→1% (IEC boundary) · 50→39% (PVEL 2023\) |
| **Hail-hardened / thicker glass** | 64.11 | 0.135331 | **T3** | 25→0.5% (IEC) · 45→7% (PVEL/Kiwa) — tail extrapolated |

**Anchor sources:** [PVEL 2023 HSS](https://2023modulescorecard.pvel.com/hail-stress-sequence/)  ·  [Kiwa PVEL HSS](https://scorecard.pvel.com/hail-stress-sequence/)  ·  [PVEL HSS whitepaper](https://www.pvel.com/wp-content/uploads/PVEL_White-Paper_Hail-Stress-Sequence-for-PV-Modules.pdf)  ·  IEC boundary via [DOE/FEMP](https://www.energy.gov/femp/hail-damage-mitigation-solar-photovoltaic-systems).

## **Conditioner — stow\_state (event-time)**

If the tracker is in hail-stow when damaging hail arrives, damage drops. v1 models it as a horizontal shift plus a small cap:

DR\_stowed(D)   \= 0.90 \* logistic(D; D50+8mm, k)  
DR (unknown)   \= P(stow)\*DR\_stowed \+ (1-P(stow))\*DR\_unstowed

**Placeholder — direction sourced, magnitude not.** The \+8 mm shift and ×0.90 cap are a T4 placeholder. The direction is supported by [VDE Americas hail-stow memo](https://www.vde.com/en/vde-americas/newsroom/hail-stow-tech-memo) and [DOE/FEMP](https://www.energy.gov/femp/hail-damage-mitigation-solar-photovoltaic-systems); high-angle automated stow is commercialized ([FTC Solar 80° stow](https://investor.ftcsolar.com/news-releases/news-release-details/ftc-solar-launches-automated-80deg-high-angle-stow-1p-pioneer/)) — but no public source gives a universal numeric reduction. Replace with tracker-specific test / SCADA-confirmed event state.

**Note:** P(stow) is P(tracker was stowed | damaging hail arrived) — not hail frequency, return period, or EAL.

## **Exposure — array\_exposure\_fraction (value, not fragility)**

Exposure scales value hit, never module fragility: loss \= DR × exposure\_fraction × module value. **v1 runs at full site (f \= 1.0); partial / footprint exposure is a v2 item.**

**Reference:**  [07 · selector / conditioner / exposure standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/07_selector_conditioner_exposure_standard.md); stow direction — [VDE Americas](https://www.vde.com/en/vde-americas/newsroom/hail-stow-tech-memo) · [DOE/FEMP](https://www.energy.gov/femp/hail-damage-mitigation-solar-photovoltaic-systems)

# **STAGE 6   Emit**

***Decisive question:**  What does the curve return per event, and which metrics may honestly be built from it?*

The hail × solar cell emits a **scalar mean DR** (module glass/cell replacement DR ≈ P\_break). It does not carry within-event spread, so it cannot honestly draw a deep tail. Capability declaration that ships with the curve:

failure-unit scalar DR .............. supported  
scenario loss (explicit value basis)  supported  
scalar EAL ......................... conditional (needs downstream frequency \+ cap-binding preflight)  
PML / VaR / TVaR ................... withheld (no tail distribution carried)

**Withhold, not caveat:** a scalar curve over the event set still gives an honest expected loss; a scalar tail would be understated, so the curve declines to emit it rather than shipping it wrong.

**Reference:**  [21 · capability & cap-binding standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/21_capability_and_cap_binding_standard.md); [09 · damage-code interface standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/09_damage_code_interface_standard.md)

# **STAGE 7   Ship**

***Decisive question:**  What does the consumer receive, and on what terms?*

The canonical runtime artifact is hail\_solar\_\_model\_v1\_0\_\_docs\_r5\_\_curve\_artifact.json. The consumer (Hazard M3) pins the cell-damage-model version (v1.0) and calls it; the dossier \+ source context ship with it.

## **Value linkage stays separate**

loss\_$ \= DR\_module(D) x physical\_base\_$ x PV\_ARRAY\_value\_share  
         x f\_hail\_material\_share x array\_exposure\_fraction

Keeping these factors separate is what prevents module damage from being applied to the whole project TIV.

## **Reviewer checklist (before use)**

* x-axis is diameter / MESH, not unlabeled kinetic energy

* module archetype known, or defaulted with a flag

* stow state known, or probabilistic stow clearly labeled (not confused with hail frequency)

* exposure\_fraction site-specific or explicitly full-site default

* curve applied only to PV\_MODULE / PV\_ARRAY exposed value, never whole TIV

* tail / EAL handled downstream with hazard frequency \+ uncertainty, not inside this damage code

## **What makes v2 better (replace placeholders, not polish)**

* BOM-specific hail test reports → exact curve parameters (replaces archetypes)

* claims / repair-policy calibration → calibrate P\_break to actual replacement DR

* tracker/stow-angle testing → replace the \+8 mm / ×0.90 placeholder

* SCADA/event logs → replace assumed P(stow) with observed state

* site MESH swath overlay → replace exposure\_fraction \= 1.0 default

**Reference:**  [09 · damage-code interface standard](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/09_damage_code_interface_standard.md)

# **REFERENCES   All sources used, with links**

| Source | What it supports | Tier | Link |
| :---- | :---- | :---- | :---- |
| **NOAA/NCEI Storm Events FAQ** | Hail reported as size (in/mm) — the axis | **axis** | [open ↗](https://www.ncei.noaa.gov/stormevents/faq.jsp) |
| **NOAA/NWS WDTD MESH** | Max hail size (MESH) — operational axis | **axis** | [open ↗](https://vlab.noaa.gov/web/wdtd/-/maximum-estimated-size-of-hail-mes-2) |
| **DOE/FEMP Hail Damage Mitigation for PV** | IEC 61215 boundary \+ diameter→mass/velocity bridge; stow direction | **T2** | [open ↗](https://www.energy.gov/femp/hail-damage-mitigation-solar-photovoltaic-systems) |
| **PVEL 2023 Hail Stress Sequence** | Default & fragile breakage anchors | **T2** | [open ↗](https://2023modulescorecard.pvel.com/hail-stress-sequence/) |
| **Kiwa PVEL current HSS** | glass//glass & thicker-glass anchors | **T2/T3** | [open ↗](https://scorecard.pvel.com/hail-stress-sequence/) |
| **Kiwa PVEL 2024 HSS** | Updated public breakage anchors | **T2/T3** | [open ↗](https://2024modulescorecard.pvel.com/hail-stress-sequence/) |
| **PVEL Hail Stress Sequence whitepaper** | HSS methodology & field-informed context | **T2/T3** | [open ↗](https://www.pvel.com/wp-content/uploads/PVEL_White-Paper_Hail-Stress-Sequence-for-PV-Modules.pdf) |
| **NREL Extreme Weather & PV Performance** | Latent-cracking vs glass-breakage seam (caveat) | **T3** | [open ↗](https://research-hub.nrel.gov/en/publications/extreme-weather-and-pv-performance-2) |
| **VDE Americas hail-stow memo** | Direction of stow benefit | **T4** | [open ↗](https://www.vde.com/en/vde-americas/newsroom/hail-stow-tech-memo) |
| **FTC Solar 80° hail-stow announcement** | High-angle stow is commercialized | **T4** | [open ↗](https://investor.ftcsolar.com/news-releases/news-release-details/ftc-solar-launches-automated-80deg-high-angle-stow-1p-pioneer/) |

**Source of truth on GitHub:** [hail\_solar dossier v1.3](https://github.com/aamani-ai/Damage_Modeling/blob/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/hail_solar/current/hail_solar_curve_derivation_dossier_v1_3.md)  ·  [curation notebook](https://github.com/aamani-ai/Damage_Modeling/blob/main/notebooks/hail/solar/00_curve_curation_walkthrough.ipynb)  ·  [method standards](https://github.com/aamani-ai/Damage_Modeling/tree/main/docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method)  ·  [slide deck](https://docs.google.com/presentation/d/1pMgfkteZrTPPlDF5DGEgQBkNmlYv9chrtU_t6JjhfIU/edit?usp=sharing).