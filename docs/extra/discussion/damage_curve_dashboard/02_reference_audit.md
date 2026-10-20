<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-19
updated: 2026-10-20
status: active
scope: Reference audit for the damage-curve dashboard — our own dashboards and artifacts first, then outside references — each with what to take and what to leave; §7 records what was seen in a browser on 2026-10-20.
-->

# 02 — Reference audit

*References are inputs, not constraints (the Hazard dashboard's own rule). Our own dashboards come first
because the brief asks the new one to follow their principles and look. Outside references were found by
web search and read by page fetch on 2026-10-19. On 2026-10-20 six of them, and our own Hazard dashboard and
Digital Twin run locally, were **looked at in the desktop app's built-in browser** (Chrome was not reachable;
the owner chose the built-in one): what was seen is in
[`evidence/2026-10-20_visual_pass.md`](evidence/2026-10-20_visual_pass.md) and summarised in §7. "Read" below
means the text was fetched; "not read" means the page did not return usable text; "seen" means viewed.*

## 1 · Our own

| Reference | Where | What we take | What we leave |
|---|---|---|---|
| **Hazard dashboard** (CONUS grid) | `Hazard_modeling/dashboard/`; framing in `docs/discussion/_cross_cutting/dashboard/00_dashboard_framing_and_reference_audit.md` | The house stack (Next.js · TypeScript · Tailwind 4 · ECharts through a theme-aware wrapper `components/echart.tsx`). The **status chip** on every view (*"a screenshot can never escape without its caveat"*). The **dossier drill** for one item with everything about it. **URL state always**. **Manifest-driven**: a new layer is a data entry, zero UI code. Info hints, not footnotes. Its token file `app/globals.css` (zinc neutrals, `--warn / --danger / --ok` pairs, Geist sans and mono, `.tabular`) | The map — curves have no geography. The GCS / parquet data path; our data is small and lives in the repository |
| **model-gpr bankability dashboard** | `model-gpr/apps/cash_flow/`; principles in `docs/principles/` | The principles (listed with paths in [`05`](05_build_brief.md) §2). **Screening across vs diligence within** (`03_output_ui/10_screening_assess_navigation.md`) → library across cells vs cell page within. **Aligned parent/child table**, chevron only on rows with children (`05_insurability_table_and_policy_context.md`) → part → curve rows. **Expand first, inspect beside** (`09_risk_map_navigation.md`). **Source inspector** instead of a long disclaimer banner. **Three status dimensions kept apart**: capability, input/evidence, execution (`docs/principles/analytical_ui.md`) | Its finance-specific configuration workspace. Its product token set, unless G3 chooses it |
| **model-gpr physical-damage views** | `03_output_ui/05_insurability_table_and_policy_context.md`, `07_physical_damage_views.md`; `04_cross_connections/physical_damage_activation.md` | The link point: the table *"Physical damage by hazard"* already carries the Damage artifact's identity, version and hash from the Hazard package (e.g. `WILDFIRE_SOLAR_FSIM_SCREENING_V1`, `model_v1_0__docs_r3`). A row there should open the matching curve page here. Cell rules: `$0` for a reported zero, `—` for unavailable | — |
| **Digital Twin** (Engineering Twin) — most likely the "Claude artifact" the brief means: its pages are Claude Design components (`public/engine/*.dc.html`) converted into a React app | `aamani-ai/infrasure-digital-twin` (local `~/code/personal/Digital Twin`, `d01abd0`); `docs/data-model.md`, `docs/equipment-visuals.md` | **Node IDs** shared by data, geometry and viewer. **Per-node hazard leads** `hz: { flood: [level, why] }`, level 1–3, *"the component's design exposure, not the site's hazard"* — a research lead, not evidence. The **`<subsystem-viewer>`** web component with `thumbnails(ids, w, h)` → a picture of each subsystem on its row. Its 7 hazards: hail, severe wind, lightning, winter storm / icing, extreme heat, flood, wildfire | Its sample costs and illustrative risk scores as facts (Hazard's BESS input audit already says the twin's hazard flags are *"leads for research"*) |
| **Risk Engine v3 — Full-Stack Map** (Claude artifact, Divy's) | claude.ai artifact, 2026-08-04 | **Select one node, its connections light up, the rest dims** (`body.has-sel .node:not(.sel)` → opacity .32) — the cross-connection pattern. A **bottom inspector drawer** opened by clicking anything. A **legend rail** with status tags *carried / planned / open*. **Altitudes** switch (stack · engine room · composer). Calm paper/ink palette with mono eyebrows; light and dark | It is a concept map, not a data view; its palette is not the house token set |
| **Newport Tower Atlas** (Claude artifact — a building asset atlas) | claude.ai artifact, shared | **An evidence status on every field**: *Published · Historical · Conflicting · Needs review · Not verified · Not found · Undated claim*. Its rule: *"'Not found' means no verified value was located in the sources reviewed—not that a system or measurement does not exist."* An **Evidence register** overlay. **Reproduction steps** with file hashes | Editorial "atlas" styling for an internal tool |
| **Cell workbook previews** | `docs/cells/<cell>/previews/*.png` (10 cell folders) | What reviewers already read: all failure-unit curves of a cell overlaid on one axis, the %TIV curve, interpretation notes | Spreadsheet chrome; one image per version; no links to sources |
| **The catalogue** | `docs/cells/CATALOGUE.md`, `docs/cells/catalogue/*.json` | **The data layer**: coverage map, per-cell rows with shape and cost tiers, how to use, judgment, not covered, open items, files; SHA-pinned to each curve file | Its Markdown rendering is the fallback, not the product |
| **The old damage-curve dashboard** (the one Divy said *"doesn't structure in a way that you go into all the subsystem level curves"*) | `infrasure-damage-curves/dashboard/` (Vite · React 18 · Tailwind 3 · Recharts; generated by Perplexity Computer) | The lesson only: a hazard-coloured curve gallery without parts, tiers, sources or review is exactly what reason 2 in [`01`](01_why_and_who.md) rejects | Its look (a generated template), its `HAZARD_COLORS` identity-by-colour, its Recharts gallery |
| **PowerUp** (`outage_pricing/web`, the Hazard dashboard's primary reference) | live at poweroutage.modeling.infrasure.ai; `app/globals.css` header | The composition the Hazard Studio lifted (KPI row → map + distribution → watch tables); its token rule *"Never hardcode a hex in a component; reference these. One green accent. Status pills: active / modeled / placeholder — never red for low confidence."* | Its consumer-facing tone and the green product accent (G3) |
| **GT digital twin** (`gt_models/apps/gt-digital-twin`) | `README.md`, `web/client/src/index.css`, `docs/learning_logs/ui/` | The craft rules: *"No default Streamlit purple, no Plotly defaults, no speedometers, no pie charts, no generic metric-card slop"*; one sans family differentiated by weight, size and tracking; columns with equal vertical bands; provenance badges on every number | Its paper-and-teal palette (a different product) |
| **RiskDash, project_finance dashboard** | `dashboards/riskdash/dashboard`, `project_finance/scripts/dashboard` | Both already run Next + Tailwind 4 with CSS-variable tokens and a dark theme: the house converges on one stack | Their GitHub-like palettes; Plotly |

## 2 · Curve and fragility libraries

| Reference | URL (status) | Take | Leave |
|---|---|---|---|
| NHERI SimCenter DLML and DLML Explorer | github.com/NHERI-SimCenter/DamageAndLossModelLibrary (read) · simcenter.designsafe-ci.org/news/2026/august/dlml-explorer/ (read) · dlml-explorer.streamlit.app (not read: fetch blocked) | Hierarchical IDs (hazard / asset / resolution / method). Parameters in CSV, provenance in JSON. Version-controlled releases an analysis can cite. One panel per model with damage states, repair consequences and curves; side-by-side comparison | A navigation tree so large it swamps the content |
| INL CSDET Fragility Curve Library | csdet.inl.gov/?p=4271 (read) · its `curves.json` (read, first part) | The closest schema to ours: `source_type`, `derivation`, `uncertainty`, `mu_sigma_quality`, `raw_reconstruct`, and `data_points` — the source points a curve was digitised from, so curve and evidence can be drawn together | No plots; intensity measure is free text with no unit |
| GEM vulnerability viewer and comparison | docs.openquake.org/vulnerability/overview.html, …/comparison.html (read) | Overlay up to 10 curves with removable tags; line styles cycle (solid, dashed, dotted) so the overlay works without colour; Beta uncertainty bands that stay within 0–1 | Only one source family can be compared |
| CLIMADA impact functions | climada-python.readthedocs.io (read) | MDR = MDD × PAA: share of units affected × damage given affected — a useful way to explain hail on modules | Static plots |
| OS-Climate physrisk onboarding notebooks | physrisk.readthedocs.io (read) | Every transformation of a source curve is written down (e.g. damage set to 0 at depths ≤ 1 cm) — a "what we changed" list per curve | Single lines, no bands |
| FEMA P-58 fragility specifications; Porter, Kennedy & Bachman 2007 | femap58.atcouncil.org/supporting-materials (read) · authors.library.caltech.edu/records/3gp0y-qbt64 (read) | One page per component with photos of each damage state. Fragility derivation methods A (actual failure data), B (bounding), C (capable), D (derived), E (expert opinion), U (updating) — a cross-check on our T1–T4 | FEMA's quality ratings were not verified |
| RETC / VDE hail resiliency curve | vde.com/en/vde-americas/newsroom/hail-resiliency-curve-test (read) | Lab curves for several module designs overlaid — strong shape evidence, weak cost evidence; kinetic energy as the intensity measure | — |

## 3 · Evidence maps and grading

| Reference | URL (status) | Take | Leave |
|---|---|---|---|
| **IPCC AR6 WGI Figure SPM.3** | ipcc.ch/report/ar6/wg1/figures/summary-for-policymakers/figure-spm-3/ (read) | **The best precedent for our cell glyph**: one hexagon per region; colour = type of change; dots = confidence (3 high, 2 medium, 1 low); hatching = low agreement; grey = limited data. It shows "no evidence" differently from "conflicting evidence" | — |
| EPPI-Mapper evidence gap maps | eppi.ioe.ac.uk/cms/Default.aspx?tabid=3790 (read) | Bubble, heat, mosaic and donut cells; segments per code; filters AND across sections, OR within; click a cell → its evidence list | A static file that breaks when codes change |
| 3ie and Campbell evidence gap maps | 3ieimpact.org/evidence-hub/evidence-gap-maps (read) · campbellcollaboration.org/evidence-gap-maps.html (read) | A gap map shows what evidence exists, not what it concludes (Campbell's own framing, paraphrased) — the split between event evidence (exists) and curve tier (concludes). Confidence shown only where an appraisal exists | Filters left over from other templates |
| GRADE handbook | gdt.gradepro.org/app/handbook/handbook.html (read) | Start from a level, move down for named reasons (another region, imprecise), each with a footnote | GRADE itself warns it is not a quantitative scoring system |
| Kiwa PVEL Module Reliability Scorecard | kiwa.com (2026 executive summary PDF, read) | A manufacturers × tests matrix our audience already knows | — |

## 4 · "Does it happen?" sources (detail in [`04`](04_does_it_happen_evidence.md))

| Source | URL (status) | What it can and cannot tell us |
|---|---|---|
| **EPRI BESS Failure Incident Database** | storagewiki.epri.com/index.php/BESS_Failure_Event_Database (read) · 2024 root-cause white paper (read) | **Cannot show weather damage** — outside causes are excluded by definition. Useful for internal-failure context and water-intrusion leads |
| NITE electrical accident reports (Japan) | nite.go.jp/gcet/tso/kohyo.html (read); search interface not read | Statutory accident reports since FY2020 with CSV download; natural-disaster accidents at solar plants included. The strongest structured public source found |
| NREL, Typhoon Mawar PV assessment, Guam (TP-5R00-89629, 2024) | nrel.gov/docs/fy25osti/89629.pdf (read) | Field survey of 30 PV systems: top clamps the most common failure; damage did not track wind speed |
| NOAA Storm Events Database | ncei.noaa.gov/stormevents/ (read) | US event narratives and damage figures by event, not by asset; keyword search ("battery storage", "solar farm", "wind turbine") |
| Wind turbine incident lists (CWIF continued by Scotland Against Spin; WMEP) | budsoffshoreenergy.com (PDF to Dec 2025, read) · mdpi.com/1996-1073/11/9/2317 (read) | Press-gathered, admitted undercount; WMEP cause codes include high wind, lightning, icing |
| NERC GADS cause codes | nerc.com GADS Appendix K (read) | Weather cause codes for forced outages; whether unit data is public was **not verified** |
| Insurer and broker summaries (kWh Analytics, Tokio Marine GX, Allianz) | kwhanalytics.com/solar-risk-assessment (behind a form) · others read in summary | Loss shares by peril (hail dominates solar losses by amount); little at subsystem level; mostly gated |

## 5 · Provenance and catalogue patterns

| Reference | URL (status) | Take |
|---|---|---|
| Our World in Data chart page | ourworldindata.org/grapher/co2-emissions-per-capita (read) | A Sources tab with *last updated* and *next expected update*, processing steps, citation; download of data + metadata + README |
| FRED series page | fred.stlouisfed.org/series/UNRATE (read) | A header box (units, frequency, last updated) and a link to past versions |
| Datasette facets | docs.datasette.io/en/stable/facets.html (read) | Facet counts with toggles — hazard, asset, status, tier, "does it happen?" |
| Dataset Nutrition Label | datanutrition.org/label/ (read, seen; the `/labels/` path is a 404) | Alerts coloured by whether a fix exists — a model for gaps and open items |
| Hugging Face dataset cards | huggingface.co/docs/hub/datasets-cards (read) | The card is the README; its header drives search filters — like our catalogue JSON |

## 6 · Quality bar for the look

| Write-up | URL (status) | Why |
|---|---|---|
| Bloomberg, *Designing the Terminal for Color Accessibility* (2021) | techatbloomberg.com/blog/designing-the-terminal-for-color-accessibility/ (read) | Dense analyst interface; colour-blind testing; kept users' existing colour meanings |
| IPCC AR6 WGI Visual Style Guide (2022) | ipcc.ch/site/assets/uploads/2022/09/IPCC_AR6_WGI_VisualStyleGuide_2022.pdf (read) | Rules for drawing uncertainty and confidence (shading, hatching, stippling), colour-blind-safe palettes, a figure checklist |

## 7 · Seen, not just read (2026-10-20)

| Seen | What the eye adds to the text | Consequence |
|---|---|---|
| Hazard dashboard — Delivery, Studio, cell dossier (local, dark) | The status chip really is on every surface and repeats at the top of the drawer; the KPI row is five tiles with an ⓘ each; card titles are 11 px uppercase muted; the right panel says *Select a cell* rather than inventing one; the dossier shows $ and % side by side on every row and is a URL | The shell, the rail, the drawer and the tile density are settled by example — [`06`](06_look_and_usability.md) §1.4, §3 |
| Digital Twin — Solar, BESS, Risk tab (local, light only) | One header row carries twin · view · category · asset; the inspector's SYSTEMS rows carry hazard pills; *Hazards: Flood · High, Extreme Heat · High* on the BESS overview; no dark theme at all | The asset view quotes the twin's leads as letters, not pills; cross-links go to the twin node, the twin's look is not copied |
| IPCC SPM.3 | Three panels, each with its own legend; hexagons with dots, hatching and white for limited data read at thumbnail size | The glyph works at tile size without colour — [`03`](03_design_options.md) §3 stands |
| INL CSDET | One filter row and a 1,022-row table; rows do not open; no plot | What a library looks like when the record is the whole product: avoid — the tile → page → dossier drill is the point |
| GEM comparison | A form with six selects and two axis sliders over an empty plot | Overlays are built one curve at a time with tags; keep our overlay to a cell's own curves plus one version ghost |
| Our World in Data | The provenance footer: data source with processing note · unit · date range · last updated · next expected update · managed by · a link to methods | The identity line and the catalogue's `reviewed_on` / `read_by` are our version of this; "next expected update" has no equivalent and is not promised |
| DLML Explorer | Hazard → sector → source groups with model counts; a *Selected models* tray; search by description or code; a dark-mode toggle | The library is organised by what the user looks for (asset × hazard), not by source — sources are badges (the product rule *"sections are data categories, not source labels"*) |

## What the references add up to

1. **Our own dashboards already settle the stack, the tokens and most interaction rules.** The new parts are
   the curve views and the evidence views; those are where outside references help. Seen running, the Hazard
   dashboard is also the visible bar for density and finish ([`06`](06_look_and_usability.md)).
2. **Three outside ideas carry the design:** IPCC's glyph (status, confidence and "limited data" in one
   mark), the evidence-gap map (a matrix you click into for the evidence list), and the curve library's
   provenance schema (curve + the source points it came from + how it was derived).
3. **Two internal ideas carry the cross-connection:** the Digital Twin's node IDs and hazard leads (the
   search frame Divy built it for), and the Risk Engine map's "select one, its connections light up".
4. **One verified fact shapes the evidence model:** the main public BESS incident database cannot see
   weather damage at all, so "not found" must always say *where* we looked and whether that source could have
   seen it ([`04`](04_does_it_happen_evidence.md)).
