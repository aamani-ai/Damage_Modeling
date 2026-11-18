<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
-->

# Bounded evidence search log — snow_load_real_estate

## Claim boundary

```text
Within the documented surfaces, queries, endpoint tests, and cutoff, the review did not locate (a) a published snow
fragility or damage function for steel-joist, wide-flange or pre-engineered-metal-building roofs, (b) an open copy of
ASCE 7-22 Chapter 7, or (c) a cause-split count of ice-laden tree-fall
claims on houses. (Strobel & Liel 2013 was not found open on 16 Nov; JL supplied the PDF on 17 Nov and it was read.)
```

This is not a universal absence claim. Paywalled standards, insurer and catastrophe-vendor functions (Verisk, Moody's
RMS), unpublished forensic files, non-English work and later publications may hold such evidence.

## Protocol

```yaml
review_cutoff: 2026-11-17
language_scope: English
access_scope: open web, open repositories, files on the build machine; no purchases
target_hazard: snow load on roofs (winter storm)
target_asset: real estate — one-storey house, one-storey pre-engineered steel warehouse, three-storey office
target_failure_units: roof structure (serviceability, partial failure, collapse) expressed as building-value loss
target_endpoint: probability of a damage state vs ground snow load; loss share per state
search_surfaces:
  - files already in hand: Li & van de Lindt 2012 PDF; Kozak & Liel 2015 PDF (both sent by SJ)
  - SJ's recommendations v8 §3.1 and its reference list (her searches of 2 to 3 Nov 2026)
  - review v5 Part D and its reproduction runs (C_new_hazards, 9 Nov 2026)
  - web search (2026-11-16): ICE Virtual Library, Structurae, scite, CU Boulder VIVO / CU Scholar, NSF award records,
    ASCE Library, STRUCTURE magazine, ICC / IBC code viewers, steel-joist industry pages
```

## Query families

| Family | Representative terms / variants | Endpoint sought | Result |
|---|---|---|---|
| Steel roof snow fragility | "snow fragility" steel joist roof; pre-engineered metal building snow collapse fragility; purlin snow reliability | P(state) vs snow load | Kozak & Liel 2015 (reliability, not fragility; used as construction base); Torabian et al. 2023 (purlins, web page per SJ, not read in full); Králik 2020 (nuclear-plant hall frame — different asset, rejected); no fragility for our roofs |
| Repair cost by state | Strobel Liel 2013 "Snow load damage to buildings"; snow roof collapse repair cost per square metre | loss share per state | 16 Nov: abstract-level only, full text paywalled, not bought. 17 Nov: full PDF supplied by JL and read (Table 2, Figure 8, p. 126); used for the T3 loss shares |
| Design-side text | ASCE 7-22 Chapter 7 free; flat roof snow 0.7 Ce Ct pg; snow load factor 1.0 ASCE 7-22 | design demand | standard paywalled; only unauthorised uploads found (not used); STRUCTURE article (O'Rourke) read for γS = 1.0 and Risk Category maps |
| Roof live load | IBC Table 1607.1 roofs 20 psf; ASCE 7 Table 4.3-1 | design demand floor | secondary quotations only (lecture slides, local code adoptions); graded T4 |
| Ground-to-roof model | National Snow Load Study 2020 ground to roof; Ellingwood O'Rourke 0.47 | conversion | NSLS formula via SJ v8 and the review's reproduction (consistent); SEAC 2016 via SJ |
| Serviceability count | Kozak Liel Table 6 Table 7 beta_serv | SJ's 8-of-10 claim | **re-checked from the PDF: holds** |
| Ice-laden tree fall | Oklahoma December 2007 ice storm homeowners claims trees | cause-split claims | v5 W1 statement only; no cause split; recorded, not built |

## Inclusion and exclusion

```text
required evidence chain:
source hazard -> local exposure -> matched failure/replacement state -> same-unit economic denominator

included source/endpoint types: peer-reviewed fragility or reliability models of the same building type and failure
unit; design-standard statements (secondary where the standard is unread, graded accordingly); damage surveys for
validation only.
excluded source/endpoint types: curves of other assets (solar racks, nuclear-plant halls) as proxies; vendor
statements without a function; unauthorised copies of paywalled texts.
```

## Results and disposition

| Evidence link | Located evidence | Missing link | Governed action |
|---|---|---|---|
| hazard → exposure (ground → roof) | NSLS 2020 model; 0.47 / COV 0.44 lognormal | the house conversion (not stated by the paper) | retain both cases; house flagged |
| exposure → failure state (house) | Li & van de Lindt Table 4 | one test house | retain (adopt with limits) |
| exposure → failure state (office, warehouse) | Kozak & Liel limit-state model; Tables 6–7 reproduce | PEMB purlin system; leak-or-partial threshold; serviceability at high design loads | retain with T4 readings; flag |
| failure state → same-unit cost | Li & van de Lindt loss ranges (house); Strobel & Liel repair costs (office, warehouse) | deflection-only repair cost; a "some damage" roof sample | retain; office and warehouse losses re-sourced to T3 (17 Nov) |
| design-side demand | O'Rourke (γS 1.0); Kozak & Liel (0.7, 1.2/1.6) | ASCE 7-22 Ch. 2, 4, 7 text | retain; re-source when read |
| ice-laden tree fall | v5 W1 statement | cause-split counts; a curve | withhold (record only) |

## Reproducibility and update triggers

Source IDs and locators are in the source register. Search dates: 2 to 3 Nov 2026 (SJ), 9 Nov and 12 Nov 2026 (review
runs), 16 Nov 2026 (this build). Re-run when: ASCE 7-22 becomes available or a purchase is approved;
a PEMB snow fragility is published; US snow-collapse claims become available.
