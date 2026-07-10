# Bounded evidence search log — wildfire_solar model v0.1

## Purpose and claim boundary

This log makes the negative-evidence statement in claim `WS-C040` reproducible at the level used for this scaffold. It records a bounded public-evidence review completed on 2026-07-09. The supported statement is only:

> Within the search surfaces, query families, endpoint tests, and cutoff below, the review did not locate a public dataset pairing utility-scale solar component inventory, local wildfire exposure, inspected damage, and economic repair/replacement outcomes.

It does not claim that no such private, unpublished, non-indexed, newly released, or differently described dataset exists.

## Search cutoff and surfaces

```yaml
review_cutoff: 2026-07-09
language_scope: English or English metadata/abstract
access_scope: publicly discoverable metadata, full text, official reports, and datasets
target_asset: ground-mounted utility-scale solar PV
target_pathway: exogenous wildfire physical burnover
```

Search and verification surfaces:

- USDA Forest Service Research Data Archive and TreeSearch;
- NIST publication records and technical reports;
- U.S. Department of Energy FEMP guidance;
- NREL/NLR publication and data records;
- Crossref, OpenAlex, and Semantic Scholar discovery records;
- publisher and DOI landing pages for candidate primary studies;
- official Australian state planning, electrical-safety, and fire-response guidance;
- the legacy `Divi-patel/infrasure-damage-curves` wildfire-solar memo and its cited leads.

## Query families

Queries were varied by singular/plural terms, word order, and the terms `utility-scale`, `solar farm`, `photovoltaic`, and `PV`:

| Family | Representative terms | Endpoint sought |
|---|---|---|
| Paired field loss | wildfire solar farm damage repair replacement cost; utility-scale PV wildfire claims loss | Local exposure + inspected component damage + economic outcome, including unaffected units. |
| Module response | photovoltaic module external fire radiant heat flux ignition failure; PV pool fire thermal response | BOM/specimen, flux/contact, duration, physical endpoint. |
| Cable/electrical response | XLPE cable cone calorimeter critical heat flux ignition; solar cable wildfire damage | Construction, installation state, exposure, failure/replacement endpoint. |
| Hazard product | FSim flame length probability FLP1 FLP6 metadata; fire intensity level burn probability | Source-native axis, units, conditionality, scale, and product limitations. |
| Site transfer | solar wildfire fence wall barrier firebreak vegetation; NIST fence mulch fire spread | Geometry, fuels, maintenance, bypass, and measured/modelled local exposure. |
| Inspection/response | post-fire photovoltaic inspection electroluminescence thermal imaging; solar farm wildfire emergency response | Inspection/replacement rule and response-state evidence. |
| Economic denominator | utility PV replacement cost component breakdown; solar damage ratio replacement value | Same-failure-unit direct replacement value and support-cost allocation. |

## Inclusion and exclusion tests

A candidate could support a runtime ordinate only if it supplied or defensibly connected all load-bearing links:

```text
source hazard state
  → delivered local exposure at a documented component zone
  → matched BOM/construction failure or replacement state
  → same-unit direct repair/replacement cost ratio
  → unaffected comparison or denominator sufficient for calibration
```

Included as evidence constraints or field-design sources:

- primary laboratory studies with exact specimen, exposure, duration, and endpoint;
- official hazard datasets with exact variable semantics and limitations;
- official/primary site, fence, barrier, access, or inspection evidence with explicit transfer limits;
- governed value data with exact workbook lineage.

Excluded from calibration, while sometimes retained for context or search leads:

- residential or community losses without utility-solar component outcomes;
- general acreage, utility-liability, insured-loss, or hypothetical solar-loss anecdotes;
- operating, ignition, or material-property thresholds relabelled as replacement states;
- guidance dimensions or construction types treated as measured mitigation coefficients;
- studies lacking the target BOM, installation state, exposure endpoint, or economic denominator;
- legacy or secondary numbers that could not be reproduced from their cited source.

## Results by evidence link

| Evidence link | Bounded-review result | Governed action |
|---|---|---|
| FSim source-native hazard semantics | Located and retained. | Preserve six conditional FLP bins; keep burn probability in frequency. |
| Landscape hazard to component-zone exposure | Mechanism and site variables located; no qualified universal transfer located. | Require measured/validated local bridge; withhold. |
| PV module external-fire response | Test-specific thermal/ignition studies located. | Retain as BOM/setup-specific constraints only. |
| Installed PV cable/electrical response | One adjacent XLPE material study and qualitative installation guidance located. | Split installation/construction; no bucket-wide curve. |
| Inverter, controls, MV equipment, racking, and foundations | No paired local-exposure-to-replacement calibration located. | Maintain separate candidates; withhold. |
| Fence/wall/firebreak efficacy at solar failure-unit grain | Directional and design evidence located; no calibrated solar loss coefficient located. | Capture geometry/state/bypass; no blanket credit. |
| Utility-solar post-wildfire claims/field dataset | No public paired dataset meeting the inclusion chain located within this review. | `WS-C040`; define field-data promotion gate. |
| Same-unit economic DR and uncertainty | Reference value rows located; no paired damage calibration or statistical spread located. | Reconcile value only; withhold DR and uncertainty. |

## Reproducibility anchors and update triggers

The source identities, URLs, exact locators, permitted/prohibited inferences, and dispositions are in:

- `SOURCE_REGISTER_wildfire_solar__model_v0_1__docs_r1.csv`;
- `CLAIM_PARAMETER_REGISTER_wildfire_solar__model_v0_1__docs_r1.csv`;
- `PARAMETER_TIER_TABLE_wildfire_solar__model_v0_1__docs_r1.csv`;
- `LEGACY_EVIDENCE_INGESTION_wildfire_solar__model_v0_1__docs_r1.md`.

Re-run the relevant query families when a new field/claims dataset, external-fire PV experiment, FSim product/version, component BOM, site-transfer model, inspection standard, or value benchmark appears. Any newly located paired evidence must be evaluated against the same endpoint, grain, denominator, site-state, and unaffected-unit tests before `WS-C040` or the `NO_RUNTIME_CURVE` decision changes.
