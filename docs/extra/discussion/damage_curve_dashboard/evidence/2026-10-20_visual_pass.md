<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: active
scope: Evidence — what was actually looked at, in a browser, for the damage-curve dashboard discussion: our own dashboards run locally and the outside references. Observations only; the conclusions are drawn in 02 and 06.
-->

# Visual pass — 2026-10-20

*Claude in Chrome was not reachable from the session (extension not connected); the owner chose the desktop
app's built-in browser instead. Outside pages were viewed at 800 × 600 (the pane's size); our own apps were
run locally and viewed at an emulated 1440 × 900. Third-party screenshots are not kept in the repository;
the PNGs beside this file are of our own apps only, captured with headless Chrome at 1440 × 900 and
downscaled. The headless browser followed the machine's dark system theme, so they are **dark-theme**
captures, and the map's cell layer did not render without WebGL (the basemap did); the live pane showed the
full map. The light theme was not captured.*

## Our own

| What | How it was run | What was seen |
|---|---|---|
| **Hazard dashboard — Delivery** (`Hazard_modeling/dashboard`, `npm run dev`, `/delivery`, dark theme) | local `next dev` on :3000 against the synced `dashboard/data/` | Segmented tabs *Overview · Hazard · Resiliency · Revenue*; a selects row (*Result · Map metric · Units*); a review-filter card whose chips carry counts (*All categories 13,085 · No rule triggered 11,224 · Under review 1,582 · Priority review 279 · Not assessed 0*); the map card with a gradient legend footer (*Full range · colors · gray = unavailable*); a right panel that says *Select a cell — Click the map or search by ID / coordinates* instead of inventing a cell; a stats strip *Across CONUS cells — Geographic distribution, not a confidence interval* with seven tiles (Average · Median · P5 · P90 · P95 · Minimum · Maximum). PNG: `2026-10-20_hazard_dashboard_delivery_dark.png` |
| **Hazard dashboard — Studio** (`/studio`) | same | One picker row of chips (view · hazard · asset · policy · *Scientific 1.3 · environmentally filtered · current*) with two honesty chips beside it; the status chip *SCREENING · complete distribution*; a five-tile KPI row (*NATIONAL EAL $15B · 0.79% of TIV · MEAN/MEDIAN EAL 0.79% · MAX CELL EAL 8.74% · CELLS WITH LOSS 13,058 · NUMERIC SELF-CHECK 100.0%*); map 3/5 with its own legend footer (*0 = ramp floor · no data (hover or click for reason)*) and render/scale chips; FILTER (min/max + p10/p50/p90 presets) and DISTRIBUTION (log-binned orange histogram with percentile marks) in the right 2/5; a *QC — INTERNAL SOUNDNESS* flag strip with counted chips. Eleven-point uppercase muted card titles; tabular numerals everywhere. PNG: `2026-10-20_hazard_dashboard_studio_dark.png` |
| **Hazard dashboard — cell dossier** (click a cell; URL became `/studio?cell=293379`) | same | A right drawer (*cell 293379 · KS · Hail × Solar*) with the status chip repeated at the top, a HEADLINE block (*0.96% EAL of TIV · $1.4M/yr*), identity rows in mono (λ, event samples, zero-loss years, numeric self-check), the RETURN-PERIOD LADDER table (OEP % TIV · OEP $ · AEP), TAIL METRICS and CONDITIONAL LOSS. Dollars and % of TIV side by side on every row. Esc closes it; the URL is the link |
| **Digital Twin — Engineering twin, Solar then BESS** (`~/code/personal/Digital Twin/dist`, static server on :4173) | local `python3 -m http.server` on the built `dist/` | Light only (no theme toggle). One header row: logo · twin tabs · view tabs · category select · asset tabs (*Solar · Wind · BESS · Hybrid*). Left navigator, centre 3D stage with tool chips (*Focus · Isolate · Fade others · Hide · Unhide · Internals · Explode · Subsurface · Connections · Reset*), an OVERLAY select, LEVEL / CASE segmented controls at the bottom, a simulated-day scrubber. Right inspector with tabs *Overview · Properties · Risk · Cost*; for BESS: *Hazards: Flood · High, Extreme Heat · High*, *Value & cost 82% of TIV*, a SYSTEMS list whose rows carry hazard pills (*Hail · Severe Wind · Lightning · Extreme Heat*), an OPERATIONS flow with live numbers. The Risk tab shows a LIVE block and a RESILIENCE list by stage (*Exposure: Enclosure Spacing, Raised Pads · Vulnerability: Explosion Venting · Response: Cell Monitoring*). Green brand accent, Inter, rounded 14 px panels |

## Outside references

| Reference | URL | What was seen |
|---|---|---|
| IPCC AR6 WGI Figure SPM.3 | ipcc.ch/report/ar6/wg1/figures/summary-for-policymakers/figure-spm-3/ | Three panels (hot extremes · heavy precipitation · agricultural and ecological drought). One hexagon per region; fill colour = type and direction of change; **dots = confidence** (three high, two medium, one low); **hatching = low agreement**; **white = limited data**. Each panel carries its own legend. Confirms the glyph precedent in [`02`](../02_reference_audit.md) §3 |
| INL CSDET Fragility Curve Library | csdet.inl.gov/tools/fragility-curve-library/ | A hero paragraph, a *Download Curves* button, one filter row (text search · All Hazards · All Curve Types), *Showing 1022 of 1022 records*, and a wide table (Hazard · Intensity Measure · Curve Type · Curve Extent · Sector · CI Type · CI Description · …). **Rows do not open a detail page** and no curve is drawn; the schema lives in the download |
| GEM Vulnerability Model Comparison | docs.openquake.org/vulnerability/comparison.html | Instructions, then a form (Model · Region · IMT · Occupancy · Building Class · Variable), **X-axis max / Y-axis max sliders**, and an empty plot *Select parameters and add curves to compare*. The text states that overlays cycle solid / dashed / dotted / dash-dot line styles across up to ten colours. The plot was not exercised |
| Our World in Data grapher | ourworldindata.org/grapher/co2-emissions-per-capita | Tabs *Table · Map · Line*, a settings control, an entity list with current values. Under the chart: *Data source: Global Carbon Budget (2025); Population based on various sources (2024) – with major processing by Our World in Data · CC BY*; then a block *Unit tonnes per person · Date range 1750–2024 · Last updated 2025-11-13 · Next expected update 2026-11-13 · Managed by …* and a *Related* link to the sources and methods page. Optional cookies were declined |
| Dataset Nutrition Label | datanutrition.org/label/ (the `/labels/` URL in [`02`](../02_reference_audit.md) is a 404) | A marketing page with one label mock (Hippocorpus V3): header strip, *Description · Keywords · Use cases · Inference risks* sections. Confirms the idea; nothing more to take |
| NHERI SimCenter DLML Explorer | dlml-explorer.streamlit.app → *Browse & Search* | A left tray *Selected models* (empty until picked), a Fragility / Consequence / All toggle, search *by description or code*, a filters disclosure, then hazards as headings (*Seismic — 10 sources · 2,411 models*) with **sector groups (Building · Power network · Transportation network · Water network) and one expandable row per source with its model count** (FEMA P-58 2nd Edition 784, Hazus Earthquake Methodology v5.1 248, …). A dark-mode toggle in the header. Model panels were not opened |

## Not done

- The Hazard dashboard's light theme was not seen: the toggle click in the pane missed, and the headless
  capture followed the dark system theme. The light tokens are known from `app/globals.css`
  ([`06`](../06_look_and_usability.md) §3.3); a light screenshot is part of the first slice's review set.
- No outside reference was tested for keyboard use or colour-vision safety; the IPCC and GEM pages state
  their own rules for that.
- The GEM overlay plot and a DLML model panel were not opened (each needs several selections).
