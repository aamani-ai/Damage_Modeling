---
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: draft
scope: The "does it happen?" occurrence register — field-report evidence per asset × value bucket × hazard, its states, its guards, the shared slug list and the search-log convention (plan decision DCD-D05; reasoning in docs/extra/discussion/damage_curve_dashboard/04_does_it_happen_evidence.md).
---

# Occurrence register — "does it happen?"

A second kind of reference beside the curve evidence: has this hazard physically damaged this subsystem of
this kind of asset, in the field, outside a test? Kept per **asset × value bucket × hazard**, because one
hazard can hit one part and spare the next, and because gap cells and buckets without a curve need a state too.

```text
docs/evidence/occurrence/
├── README.md                  this file
├── slugs.json                 the one shared slug list: assets, hazards (five catalogue hazards + heat, icing,
│                              lightning), the twin's seven hazard names, and each asset's value buckets
└── <asset>/<hazard>.json      the register for one asset × hazard: one row per value bucket
    <asset>/<hazard>.md        its search log: claim boundary · surfaces · exact queries · cutoff · result
```

## States (per bucket)

| State | Mark | Meaning |
|---|---|---|
| `found` | ✓ | At least one direct report: this hazard, this equipment class, comparable installation, physical damage |
| `adjacent` | ~ | Evidence for a neighbouring case only (another asset class, rooftop not utility scale, a failure with no named cause) |
| `none_after_search` | ∅ | A logged search names the surfaces, the exact queries and a cutoff; at least two of the surfaces could have seen this hazard; nothing was found. Not a proof of absence |
| `not_searched` | ? | The default. Not a finding |

`left_out` (register level) lists parts deliberately left out of a cell with a reason and a decision id — a
modelling choice, distinct from "no curve yet" (model-gpr's 2026-10-04 direction; Hazard's
`model_coverage_is_metadata` principle). It is empty today.

## Guards

1. Absence counts only after a recorded search, never as absence of searching.
2. Every surface says whether it *could* see the hazard. The EPRI BESS failure database cannot: it excludes
   exogenous causes by definition, so a zero there says nothing about weather.
3. Records name the failure more often than the cause — search the mechanism chain too (flood → short → thermal event).
4. The twin lead on each bucket (`twin_lead.level` H · M · L, with the Digital Twin's own reason per node) is
   **design exposure of a sample asset, a lead and never evidence**. It is copied from the twin's data file at
   the commit named in `provenance`, through Hazard's `twin_crosswalk.csv` (pinned by SHA), by
   `scripts/dashboard/seed_occurrence_register.py`.

## How a row changes

Edit the JSON row and append the search to the `.md` log in the same commit: date, surface, exact query,
cutoff, result. A `found` or `adjacent` row carries its reports as
`{id, date, place, what_broke, intensity, source, kind: direct | adjacent}`; an `OCC-<ASSET>-<HZ>-NNN` id is
stable. Then re-run the dashboard build (`scripts/dashboard/build_dashboard_data.py`), which reads these files
and fails if a register's `catalogue_entry` does not match the catalogue.

Catalogue entries point here through their `occurrence_register` field
([`docs/cells/catalogue/README.md`](../../cells/catalogue/README.md)); nothing in this folder lives under
`docs/cells/catalogue/`, because the catalogue builder reads every JSON there as an entry.

## Today (2026-10-20)

Battery storage only, eight hazards, every bucket `not_searched`; no search has been logged. The first
searches (discussion 04 §6: flood first, then hail and convective wind) can run in parallel with the dashboard.
