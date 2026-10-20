<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: active
scope: Build the damage-curve dashboard as a local internal instrument in this repository — a Python data build over the catalogue and the cells, then a Next.js app with the library, asset view, curve cell page with the derivation trail, curve dossier, occurrence page and review queue — verified by the data-build checks, the look review and the owner's feedback on the running slices; hosting after local feedback.
-->

# Damage-curve dashboard plan

> **Plan of record — a reviewable library of every damage curve, local first, battery storage end to end
> first.** Today the curves live in 25 catalogue entries and their cell folders, readable only file by file;
> when this is done an internal dashboard shows every cell, part and curve with its derivation chain, its
> evidence tiers, whether the damage has been seen in the field and who has reviewed it, and exports a
> one-pager. Nothing in `docs/cells/` changes; the dashboard reads, it never writes. Reasoning:
> [`docs/extra/discussion/damage_curve_dashboard/`](../../extra/discussion/damage_curve_dashboard/README.md)
> (gates G1–G12 ruled 2026-10-20). Status `active` on the owner's direction of 2026-10-20 — *"Let's just keep
> moving … Let's go."* — with the owner's feedback coming on the running slices, not on this text.

## Outcome first

```text
damage_modeling/
├── dashboard/                       the app (Next.js · TypeScript · Tailwind 4 · ECharts; Hazard's stack and tokens)
│   ├── app/                         /  /assets/<asset>  /cells/<entry>  /cells/<entry>/curves/<curve>  /occurrence/<asset>/<hazard>  /review  /export/<entry>  /code/<damage_code_id>
│   ├── components/                  status rail · trail · tile · curve plot · evidence table · audit stepper · drawer
│   ├── data/                        written ONLY by the build step: manifest.json · cells/*.json · curves/*.json · occurrence/*.json · citations.json · receipt.json
│   └── README.md                    how to run locally, what the build checks are, the look review
├── scripts/dashboard/build_dashboard_data.py      the one build step (python3.12 venv): catalogue → JSON, with every check in 05 §3
├── scripts/reference_helpers/                     + reference evaluators for hurricane × battery and wildfire × battery (G9)
├── docs/evidence/occurrence/<asset>/<hazard>.{json,md}   the "does it happen?" register and search logs (G5)
└── docs/plans/damage_curve_dashboard/evidence/           screenshots per slice (both themes, two widths), named by commit
```

Shared with Hazard: the look principle at `Hazard_modeling/docs/principles/analytical_instrument_look_and_usability.md`
(G11) and the twin and hazard-name crosswalks (G6).

## Scope and non-scope

| In scope | Out of scope |
|---|---|
| Reading every catalogue entry, cell artifact, register, known-answer test and crosswalk into static JSON, with reconciliation checks | Editing any curve, status, tier or catalogue entry from the UI (changes go through the repository) |
| Library · asset view · curve cell page with the derivation trail · curve dossier · occurrence page · review queue · one-pager export · the `/code/` resolver | EAL, PML, VaR or any annual metric as a Damage output (link to Hazard) |
| Sampling curves through this repository's Python evaluators, including two new ones for the battery cells | Evaluating any curve in the browser; interpolating where an artifact forbids it |
| Local run (`npm run dev`), then hosting on Cloud Run through the team's deploy skill after local feedback | A public or client-facing site; the client surface is the one-pager (G8) |
| The occurrence register's shape and empty state; the first battery searches can run in parallel | Deciding research priorities — the page suggests, the owner decides |

## Current state (measured 2026-10-20)

| Fact | Source |
|---|---|
| No `dashboard/` folder exists in this repository (`find . -iname '*dashboard*'` finds only the discussion node) | shell, 2026-10-20 |
| 25 catalogue entries: 13 live · 5 proposals · 3 reused · 4 gaps; 71 part rows, 51 with a T4 shape or cost; 87 curve IDs; 25 of 25 read by an agent only; 14 of 21 cells and bindings partial; 11 with no outside check | `docs/extra/discussion/damage_curve_dashboard/evidence/2026-10-19_catalogue_counts.txt` |
| Chain artifacts as named files: 2 of 21 cells complete on the 10 core stations; seven-step audit 2, pressure test 2, site adapter 0, search log 0; 15 skill-named · 6 plain-named · 4 no folder | `…/evidence/2026-10-20_chain_inventory.txt` |
| 62 curve records in the 13 live artifacts (34 top-level `curve_records`, 28 under `pathways[]`); Python evaluators exist for every form except hurricane × battery and wildfire × battery | discussion `05` §3 |
| Hazard dashboard stack, installed: Next 16.3.1 · React 19.2.4 · Tailwind 4.3.2 · ECharts 6.1.0 · MapLibre 5.24.0 · next-themes 0.4.6 · Vitest 4.1.10; tokens in `dashboard/app/globals.css`; no shadcn or Radix | `Hazard_modeling/dashboard/package.json`, survey 2026-10-20 |
| Node 22.21.0 and `python3.12` venv on the owner's machine | shell |
| The twin → value-bucket crosswalk exists for batteries (58 rows) and substations | `Hazard_modeling/docs/plans/_cross_cutting/bess_conus/twin_crosswalk.csv` |

## Decisions fixed for this plan

| Decision | Contract | Register |
|---|---|---|
| Page unit: cell page is home, curve dossier is the drill | discussion `03` §6 | [`DCD-D01`](decisions.md#dcd-d01--page-unit-both-as-levels) |
| Own app in this repo, Hazard's stack, local first | `03` §6, owner 2026-10-20 | [`DCD-D02`](decisions.md#dcd-d02--home-own-app-in-this-repository-local-first), [`DCD-D13`](decisions.md#dcd-d13--local-first-host-after-feedback) |
| Hazard dashboard tokens | `06` §3.3 | [`DCD-D03`](decisions.md#dcd-d03--the-look-hazard-dashboard-tokens) |
| First slice: battery storage end to end | `05` §6 | [`DCD-D04`](decisions.md#dcd-d04--first-slice-battery-storage) |
| Occurrence register under `docs/evidence/occurrence/`; a field for deliberate omission | `04` §5 | [`DCD-D05`](decisions.md#dcd-d05--does-it-happen-register-and-the-left-out-state) |
| Reuse Hazard's twin crosswalk; one hazard-name crosswalk owned with Hazard | `05` §5 | [`DCD-D06`](decisions.md#dcd-d06--crosswalks) |
| A `review` block; agents report only at first | `03` §2.6, `05` §2 P14 | [`DCD-D07`](decisions.md#dcd-d07--review-block-and-agent-writes) |
| One-pager fields and NDA line: later | — | [`DCD-D08`](decisions.md#dcd-d08--one-pager-later) (open gate G8) |
| Reference evaluators for the two battery cells, here | `05` §3 | [`DCD-D09`](decisions.md#dcd-d09--battery-evaluators-in-this-repository) |
| Look sign-off: owner accepts screenshots per slice before merge | `06` §4 | [`DCD-D10`](decisions.md#dcd-d10--look-sign-off-per-slice) |
| The look principle lives in `Hazard_modeling/docs/principles/` | `06` §7 | [`DCD-D11`](decisions.md#dcd-d11--home-of-the-look-principle) |
| One plain sentence per screen | `06` §2.6 | [`DCD-D12`](decisions.md#dcd-d12--one-plain-sentence-per-screen) |
| The derivation trail with ten stations and four presence states | `07` | [`DCD-D14`](decisions.md#dcd-d14--the-derivation-trail) |
| Feedback on running software is the review loop | owner 2026-10-20 | [`DCD-D15`](decisions.md#dcd-d15--feedback-on-the-running-slice) |

## Execution sequence

### Phase 0 · The data build (no UI)

- [ ] `scripts/dashboard/build_dashboard_data.py`: load the 25 entries; verify each artifact SHA against its pin (reuse `validate_damage_curve_catalogue.py`); enumerate curves with the catalogue builder's `curve_records()`; sample every curve through a Python evaluator or list it *no evaluator*; reproduce every known answer; join the twin crosswalk (pinned SHA) and the hazard-name crosswalk; write `dashboard/data/*.json` and a `receipt.json` (commit, SHAs, counts)
- [ ] The chain detector (`07` §10): start from `evidence/2026-10-20_chain_inventory.py`; add dossier-heading and workbook-sheet detection before any station is marked *prose*; stations not yet detectable are `not_yet_detected`
- [ ] `citations.json` from the source and claim registers of the cells that have them
- [ ] The occurrence register shape (`04` §5) with every battery row `not_searched`; the catalogue README, builder and validator gain the pointer field
- [ ] Gate: the build checks in `05` §3 all pass (counts equal the catalogue, SHAs equal pins, every curve sampled or listed, every known answer reproduced, every source ID resolves, nothing sampled outside its valid domain); the receipt is committed with the data

### Phase 1 · V0 — battery storage end to end, local

- [ ] `dashboard/` scaffold from the Hazard dashboard's shell: `layout.tsx`, `globals.css` tokens, `ui.tsx` primitives, `status-chip` → the status rail, `echart.tsx`, the drawer; URL state always
- [ ] Library (all 25 entries, status lens; the tile of `06` §3.1) · battery asset view (`03` §2.2) · `flood_bess` cell page with the trail and the cards of `07` §4 · one curve dossier (`BESS_PCS_INUNDATION_PROXY`) · the hail × battery occurrence page (empty state) · the plain first line on each
- [ ] Hurricane × battery and wildfire × battery pages show *Not drawn — no reference evaluator* until Phase 3
- [ ] `dashboard/README.md`: run, build, checks, the look review
- [ ] Gate: the look review of `06` §4, checks 1–8, with the screenshot set under `evidence/<commit>/`; then the owner's review on the running app (check 9)

### Phase 2 · Owner feedback loop (local)

- [ ] The owner runs it locally and gives feedback on the screens; findings become rows here, not reopened gates unless a ruling is contradicted
- [ ] Gate: the owner accepts V0's screenshot set; merge to `main`

### Phase 3 · V1 — every live cell

- [ ] Reference evaluators for `tropical_cyclone_wind_bess` and `wildfire_bess` in `scripts/reference_helpers/`, each proven against the cell's known answers and checked against Hazard's `perils/*/src/*/bess.py` output (read, never imported)
- [ ] All 13 live cells, 5 proposals and 3 bindings sampled; the review block (G7) in the catalogue entries; the chain lens and the gate view (`07` §6–§7); the `/code/` resolver for model-gpr and the Hazard dashboard
- [ ] Gate: look review per slice; the cold-read test with a named reviewer

### Phase 4 · V2 — depth

- [ ] Version ghost and chain diff · lineage lighting · twin thumbnails · the review queue for the weekly agents (JSON only)

### Phase 5 · Hosting and outward

- [ ] Cloud Run through the team's deploy skill, authenticated, after the owner has used the local app; one-pager export after G8
- [ ] Gate: the owner approves hosting (gate H1 below)

## Validation gates

- The data build fails loudly on any reconciliation error; no page renders from unchecked data.
- No slice merges without the look review (`06` §4) and the owner's acceptance of its screenshots.
- Library ≤ 1 s, cell page ≤ 1.5 s to usable on a laptop, measured and written in the slice's evidence folder.
- A cold reader answers *"which hazards affect batteries, and how sure are we?"* from the asset view in under two minutes.
- The four honest states (`not searched`, `no curve`, `left out on purpose`, `no evaluator`) look different and none looks like coverage; T4 and ∅ are never red.
- Every displayed number traces to a repository file at the receipt commit (spot-check 20 per slice).

## Done when

A teammate can clone the repository, run the build step and `npm run dev`, open the library, click Battery storage, see which hazards have curves and how strong their evidence is, open Flood × Battery storage, walk its trail from scope to review, open the PCS curve, trace a parameter to its claim and source, see the field-report state, print the one-pager — and every number on the way matches the files at the receipt commit. The owner has accepted each slice from its screenshots and the running app.

## Owner gates (open)

| Gate | Question | Recommendation |
|---|---|---|
| G8 (carried) | Which fields go on the client one-pager, and the NDA line | After V1; propose from the running cell page |
| H1 | Host on Cloud Run (authenticated) once the local app has been used? | Yes, through the deploy skill; not before the owner has given feedback locally |

## Connected work

- Reasoning: [`docs/extra/discussion/damage_curve_dashboard/`](../../extra/discussion/damage_curve_dashboard/README.md) — `01`–`07` and `evidence/`
- Registers: [`decisions.md`](decisions.md) · [`assumptions.md`](assumptions.md)
- Data layer: [`docs/cells/CATALOGUE.md`](../../cells/CATALOGUE.md), `docs/cells/catalogue/`, `scripts/reference_helpers/build_damage_curve_catalogue.py`
- Sibling instrument: `Hazard_modeling/dashboard/`; its framing `docs/discussion/_cross_cutting/dashboard/00_dashboard_framing_and_reference_audit.md`
- Standards this plan must not violate: `AGENTS.md` (what this repo owns and does not); `docs/method/standards/08_evidence_provenance_and_links_standard.md`; `docs/contracts/standards/17_versioning_policy.md`; the skill's review gates `docs/extra/damage_curve_skill/00_governance/REVIEW_GATES.md`
- Related plans: [`cell_notebook_coverage/`](../cell_notebook_coverage/README.md) (the notebooks read the same artifacts); [`bess_damage/`](../bess_damage/README.md) (the battery cells)
