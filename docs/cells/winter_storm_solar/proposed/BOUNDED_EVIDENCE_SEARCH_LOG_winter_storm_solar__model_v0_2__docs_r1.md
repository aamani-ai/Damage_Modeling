---
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: proposed
extends: BOUNDED_EVIDENCE_SEARCH_LOG_winter_storm_solar__model_v0_1__docs_r1.md (r1 passes stand; this log adds the v0.2 pass)
---

# winter_storm_solar — bounded evidence search log (model v0.2 / docs r1)

## Claim boundary

```text
Within the documented surfaces, queries and cutoff below, the v0.2 pass did not locate: a share of
under-designed ground-mount racks; a source for a 0.85 lower-edge knock-down; an openly readable IEC 61215-2
MQT 16 clause; fixed-tilt module test-to-failure data; a NEDO/JPEA statement of which load governed each
tested rack; an ERA5-Land primary statement on rain in SWE; US ground-mount snow collapse calibration data.
```

This is not a universal absence claim. Paywalled standards, gated insurer reports, METI pages that returned
403, Korean/Chinese/European literature (not searched in v0.2) and unpublished manufacturer data remain outside
scope.

## Protocol

```yaml
review_cutoff: 2026-11-16
language_scope: English, Japanese (Korean and Chinese not run in v0.2; r1 covered Chinese)
access_scope: open web pages and PDFs, official previews; no purchase, no registration, no third-party mirrors of paywalled standards
target_hazard: snow (and glaze) gravity load
target_asset: ground-mount PV (fixed-tilt and single-axis tracker)
target_failure_units: WSS1_SUPPORT_STRUCTURE_COLLAPSE, WSS1_MODULE_FIELD_BREAKAGE
target_endpoint: numbers for the ten v0.2 changes (brief Sec 1.3)
search_surfaces: web search; publisher PDFs (NEDO, NITE, ECMWF, waterboards.ca.gov ASCE 7-10 exhibit, IEC webstore, Kiwa PVEL, PV Tech, Sinovoltaics); internal: SJ v8 Sec 4.1 and refs, review v5 W2/W3, build brief
passes: one bounded pass, about 35 tool calls, 2026-11-16, read-only (delegated search, results checked into this log)
```

## Query families and results

| Family | Representative queries | Endpoint sought | Result | Disposition |
|---|---|---|---|---|
| F1 IEC 61215 MQT 16 (open text) and fixed-tilt TtF | "IEC 61215-2:2021 MQT 16 static mechanical load test design load safety factor 1.5 minimum 2400 Pa"; "PV module mechanical load test to failure ... four clamps rails" | clause text; fixed-tilt failure loads | IEC webstore preview showed no clause text; iTeh banner only. Secondary (Sinovoltaics, WSS-S005): min design 1600 Pa, γm ≥ 1.5, min test 2400 Pa, 5400 Pa only as a manufacturer example. PV Tech (WSS-S004): fixed-tilt supports near quarter points; tracker clamps 400–450 mm. Kiwa PVEL PQP v12 (WSS-S035): TtF tracker- or corner-mounted from 1800 Pa. A snippet that a glass-glass module broke below 1600 Pa on a torque tube but not on two rails was **not opened** (unverified). **No fixed-tilt TtF data located.** | fixed-tilt anchor kept T4 and **unchecked**; IEC 61215-2 recorded unavailable (WSS-S036) |
| F2 Under-designed share | JA: "太陽光発電 架台 積雪 設計不備 割合 調査 技術基準 適合性"; "2014年 大雪 太陽電池 架台 損壊 JIS C 8955 満たしていない 件"; "架台 強度計算 不適合 割合 立入検査 結果 積雪荷重" | a share of plants/racks below code | NITE 2025-11-20 (WSS-S030): 62 snow/ice accidents FY2020–24; on-site inspections 17/59/50/58 (FY2021–24); one plant designed for 70 cm vs ≥ 160 cm required; **no share published**. METI 2022 report and 2014 WG pages: **HTTP 403**. Snippet only (unverified, wind not snow): a 2016 METI survey reportedly found 16/79 plants with insufficient design wind speed. | share stays an input with **no default** |
| F3 Source for 0.85 | "IEC 62938 non-uniform snow load ... failure load ratio uniform eave"; JA "軒先荷重 太陽電池モジュール 積雪 破壊荷重 均等荷重 比較 産総研"; "non-uniform snow load PV module failure load compared to uniform" | a non-uniform / uniform capacity ratio | NEDO annex B (WSS-S020) pp. B-6 to B-9: measured eave loads ≈ 2/3 of the settlement-force formulas, a structural load, not a module ratio. AIST T11 / P109: **connection refused**. IEC 62938 tables: **paywalled**. NREL "uniform loading can test for nonuniform loading durability": page **unreachable** (snippet suggests uniform tests may be conservative). **No 0.85 located.** | 0.85 kept interim, flagged **UNSOURCED** |
| F4 NEDO/JPEA governing load | NEDO 100895023.pdf annex D read | which load governed each rack | Annex D title 耐風性能試験 (p. D-1); method reproduces wind positive/negative pressure (p. D-3); Table D3 reference conditions 34 m/s and 50 cm ground snow from makers' specs (p. D-2); Table D5 ratios confirmed (p. D-5). **Governing load per rack not stated**; no separate report located. | relabel to wind downforce tests; query drafted to NEDO/JPEA (not sent) |
| F5 ASCE 7-10 §10.4.1 | waterboards.ca.gov DDJ-148 exhibit (open, 253 pp.) | flat-plate rule | PDF p. 91: "V_i = π t_d A_s" (Eq. 10.4-2), A_s one side of the plate; × 0.8 vertical, × 0.6 horizontal; ice density ≥ 900 kg/m³. **Confirmed.** | WSS-S033 adopted; edition stated as ASCE 7-10; ASCE 7-22 Ch.10 not read |
| F6 NITE 22 Dec 2023 | nite.go.jp/data/000152469.pdf (open) | Fig. 4 shares, counts, classes | Fig. 4: 73% / 45% / 4%; size classes 10–<50 kW, 50–<2000 kW, ≥ 2000 kW (p.2 note 2); small 43 accidents (29 + 14); medium and larger 23 (p.3 §1-1). Medium/large split ≈ 16/7 from figure labels only, **unverified**. | WSS-S034 adopted as calibration target |
| F7 ERA5 / ERA5-Land SWE and rain | "ECMWF IFS documentation snow scheme rainfall interception ... Dutra 2010"; "IFS documentation Part IV ... snowpack liquid water" | primary statement | IFS Cy41r2 Part IV §8.4 (WSS-S037): SWE includes liquid; rain on the pack retained up to 3–10% of S. ECMWF Newsletter 127 p.4: liquid storage "allows the interception of rainfall". ERA5-Land (Muñoz-Sabater 2021) **not opened**; Cy47r1 doc > 10 MB not fetched. | glaze kept separate; SJ asked which product (draft) |
| F8 US calibration | "ground-mount solar racking collapse snow load forensic ... kWh Analytics"; "kWh Analytics Solar Risk Assessment snow losses share" | US claims share or forensic case with loads | Snippets only: kWh Analytics 2025 (hail ~73% of loss value); 2026 coverage mentions snow qualitatively. Roof-mount forensic items not ground-mount. Full reports gated (registration not done). **Nothing located.** | `NO_US_CALIBRATION` stated |
| F9 Tight compliant spread (17 Nov) | "Bartlett 2003 updating standard shape material properties resistance coefficient of variation flexure"; "FEMA P-58 fragility dispersion beta default component steel" | a citable spread for well-built steel assemblies | Bartlett et al. 2003 (WSS-S042) Table 9: braced compact beam COV 0.090 (no discretization), read in the downloaded PDF. Cremen & Baker 2019 (WSS-S043) p. 4: P-58 fitting constrains component β to 0.2–0.6. AISC library PDF and the pelicun / P-58 fragility database pages: **HTTP 403 / 404**. A steel shear-tab β of 0.4 appeared in a search snippet only (**not opened**). | two T3 sensitivity rows (0.09, 0.20); served β 0.47 unchanged |

## Internal inputs read

SJ v8 §4.1 (objections table, glaze notes, correction; refs [31], [82], [83], [86]–[93], [135]), review v5 W2 Q3,
Q4, Q6, Q7 and W3, and the build brief §1.3, §3, §4. Two v5 errors not copied: its interval (re-checked: it
matches the unrounded spread; the brief's 0.30–1.03 is the rounded-input value) and its "π·t·d·A_s" diameter
reading.

## Unavailable texts (absence recorded; nothing bought)

| Text | Status |
|---|---|
| IEC 61215-2:2021 (MQT 16), IEC 62938:2020 tables | paywalled; not read |
| ASCE 7-22 Ch.7 and Ch.10; ASCE Press 2025 ground-mount snow book | paywalled; not read |
| METI 2014 WG / 2022 report pages | HTTP 403 |
| AIST 2019 T11 / P109 | connection refused |
| NREL non-uniform loading paper page | unreachable |
| kWh Analytics / GCube full reports | gated |
| ERA5-Land snow documentation | not opened in this pass |

## Update triggers

A NEDO/JPEA reply; any population compliance statistic; IEC 62938 or AIST eave-load values; IEC 61215-2 read;
SJ naming the SWE product; US claims or forensic data. Re-run this log when any arrives.
