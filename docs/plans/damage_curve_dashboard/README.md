<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-22
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
>
> **2026-10-21 — iteration 3 built on the `dashboard` branch
> ([PR #8](https://github.com/aamani-ai/Damage_Modeling/pull/8)), for the owner's review on the running app.** Divy
> took G14–G18 of [`08`](../../extra/discussion/damage_curve_dashboard/08_categories_and_construction.md) as
> recommended (`DCD-D26`–`D30`) after ruling G13 and G20–G23 (`DCD-D20`–`D24`), and all of G19 (`DCD-D31`, `D32`). The
> build: the Digital Twin's categories in the top bar and the library; an asset page per type with the twin's own
> 3D model coloured by what each curve covers, hazard by hazard, and the systems × hazards table; the same picture
> on every cell page; crosswalks drafted for seven types at
> [`docs/contracts/twin_crosswalks/`](../../contracts/twin_crosswalks/README.md); the cell page in the order *curve
> and why we believe it → what it covers → four steps → For Hazard*; evidence in words; one Review page; the
> [FAQ](../../faq.md); data built from `main`, or a labelled preview. Look review at
> [`evidence/2e49bb4/`](evidence/2e49bb4/REVIEW.md); handoff at
> [`tasks_history/2026-10-21__dashboard__iteration-3`](../../extra/tasks_history/2026-10-21__dashboard__iteration-3/handoff.md).
> G19 completed the same day (`DCD-D32`): builder information sits behind one *About this data* link; addendum review
> at [`evidence/4e31ac6/`](evidence/4e31ac6/REVIEW.md).
>
> **2026-10-21: the owner's review of iteration 3 on the running app, built the same day** (`DCD-D33`, `D34`).
> *How this curve was made* now sits above the curve. Its four steps are renamed *What it covers · How it was derived ·
> Where the numbers come from · Has it been checked*, and each carries its key items as chips. Every cell with a
> curve (21 of 21) says why its curve has its shape, in the derived step and, for 17, in the main logic. The 3D
> picture gained the twin's tools, a full-screen view, each part's curve in miniature beside it and level columns.
> The systems × hazards table now selects in the picture. Addendum review at
> [`evidence/5db1b4b/`](evidence/5db1b4b/REVIEW.md).
>
> **2026-10-22: iteration 3 accepted and merged** (`DCD-D35`). The owner accepted it on the running app, and
> [PR #8](https://github.com/aamani-ai/Damage_Modeling/pull/8) merged into `main` as `85aedf6`. The dashboard's data on
> `main` is built from `main` at that commit. The next iteration starts a new `dashboard` branch from `main`.
>
> **2026-10-22: hosted** (`DCD-D36`, gate H1). The dashboard is the Cloud Run service `damage-curves`, behind IAP for
> aamani.ai accounts, deployed from the `deploy/damage-curves` branch, so Jung A can open and own it. Live at
> <https://damage-curves-wsd6lcl64q-uc.a.run.app> (sign in with an aamani.ai account). See
> [`dashboard/README.md`](../../../dashboard/README.md#hosted).

## Outcome first

```text
damage_modeling/
├── dashboard/                       the app (Next.js · TypeScript · Tailwind 4 · ECharts; Hazard's stack and tokens)
│   ├── app/                         /  /assets/<type>  /cells/<entry>  /cells/<entry>/curves/<curve>  /occurrence/<asset>/<hazard>  /review  /faq  /code/<damage_code_id>
│   ├── components/                  status rail · trail · tile · curve plot · evidence table · audit stepper · drawer
│   ├── data/                        written ONLY by the build step: manifest.json · cells/ · curves/ · coverage/ · occurrence/ · faq.json · citations.json · receipt.json (twin/ is the twin export, an input)
│   ├── public/twin/                 the Digital Twin's 3D viewer and models, vendored unchanged and pinned by SHA (DCD-D21)
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
| **V0 built (2026-10-20, after this table was measured):** `dashboard/`, `scripts/dashboard/`, the occurrence register at `docs/evidence/occurrence/`; look review at [`evidence/3f9d516/`](evidence/3f9d516/REVIEW.md); [PR #5](https://github.com/aamani-ai/Damage_Modeling/pull/5) open; accepted by the owner 2026-10-20 (`DCD-D17`), merge pending | branch `claude/dashboard-v0-5d463c`; [`tasks_history/2026-10-20__dashboard__v0-build`](../../extra/tasks_history/2026-10-20__dashboard__v0-build/handoff.md) |
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

- [x] `scripts/dashboard/build_dashboard_data.py`: load the 25 entries; verify each artifact SHA against its pin (reuse `validate_damage_curve_catalogue.py`); enumerate curves with the catalogue builder's `curve_records()`; sample every curve through a Python evaluator or list it *no evaluator*; reproduce every known answer; join the twin crosswalk (pinned SHA) and the hazard-name crosswalk; write `dashboard/data/*.json` and a `receipt.json` (commit, SHAs, counts)
- [x] The chain detector (`07` §10): start from `evidence/2026-10-20_chain_inventory.py`; add dossier-heading and workbook-sheet detection before any station is marked *prose*; stations not yet detectable are `not_yet_detected`
- [x] `citations.json` from the source and claim registers of the cells that have them
- [x] The occurrence register shape (`04` §5) with every battery row `not_searched`; the catalogue README, builder and validator gain the pointer field
- [ ] Gate: the build checks in `05` §3 all pass (counts equal the catalogue, SHAs equal pins, every curve sampled or listed, every known answer reproduced, every source ID resolves, nothing sampled outside its valid domain); the receipt is committed with the data — *2026-10-20: every structural check passes and the receipt is committed; 1,748 of 1,748 known answers run are reproduced (136 not run, each with its reason); the `source_ids` data check fails on 22 references in `tropical_cyclone_wind_wind`, `wildfire_solar` and `tropical_cyclone_wind_solar`, reported and not loosened*

### Phase 1 · V0 — battery storage end to end, local

- [x] `dashboard/` scaffold from the Hazard dashboard's shell: `layout.tsx`, `globals.css` tokens, `ui.tsx` primitives, `status-chip` → the status rail, `echart.tsx`, the drawer; URL state always
- [x] Library (all 25 entries, status lens; the tile of `06` §3.1) · battery asset view (`03` §2.2) · `flood_bess` cell page with the trail and the cards of `07` §4 · one curve dossier (`BESS_PCS_INUNDATION_PROXY`) · the hail × battery occurrence page (empty state) · the plain first line on each
- [x] Hurricane × battery and wildfire × battery pages show *Not drawn — no reference evaluator* until Phase 3 — *their evaluators reached `main` in PR #4 during the build; the build now stops once one exists for a cell it lists as having none, so wiring them is the first V1 step — done 2026-10-20, see Phase 3*
- [x] `dashboard/README.md`: run, build, checks, the look review
- [ ] Gate: the look review of `06` §4, checks 1–8, with the screenshot set under `evidence/<commit>/`; then the owner's review on the running app (check 9) — *2026-10-20, [`evidence/3f9d516/REVIEW.md`](evidence/3f9d516/REVIEW.md): checks 1–6 and 8 pass; check 7 (cold read) not run, it needs a named reader; check 9 **accepted by the owner on the running app, 2026-10-20** ([`DCD-D17`](decisions.md#dcd-d17--v0-accepted-on-the-running-app))*

### Phase 2 · Owner feedback loop (local)

- [x] 2026-10-20 — the owner reviewed V0 on the running app and asked for one more iteration (`DCD-D18`):
  the page reads like an audit ledger; multiple curves on one plot; station drawers and cards too technical;
  sources without links; the asset view for batteries only; older cells showing no evidence. Library and
  lenses accepted.
- [x] **Iteration 2** per [`iteration_2_brief.md`](iteration_2_brief.md): the plain layer is the page and the
  ledger is one control away (`DCD-D19`); one curve at a time with generated captions; sources as links;
  station panels that explain first; the asset view for every asset with the *split differently* block;
  workbook/dossier extraction so the older cells show their evidence. Acceptance: the brief's §5 —
  *2026-10-21, branch `claude/dashboard-iteration-2-8df11e`, [PR #7](https://github.com/aamani-ai/Damage_Modeling/pull/7)
  open, not merged; look review at [`evidence/b0ff718/REVIEW.md`](evidence/b0ff718/REVIEW.md): `06` §4 checks 1–6
  and 8 pass, the brief's §5 checks 1–7 pass mechanically (`acceptance_checks.txt`), check 8 (the cold read) is
  pending a named reader; the walkthrough is `/v0`*
- [x] Gate: the owner's second review on the running app — *2026-10-21: reviewed; the review became discussion `08`
  (G13–G19) and iteration 3*
- [x] **Iteration 3** on the one `dashboard` branch ([PR #8](https://github.com/aamani-ai/Damage_Modeling/pull/8)):
  G13–G23 built (`DCD-D20`–`D32`); look review at [`evidence/2e49bb4/REVIEW.md`](evidence/2e49bb4/REVIEW.md), G19's
  addendum at [`evidence/4e31ac6/REVIEW.md`](evidence/4e31ac6/REVIEW.md)
- [x] 2026-10-21: the owner reviewed iteration 3 on the running app (`DCD-D33`, `D34`). The steps moved above the curve
  with their key items as chips, and each curve's shape now has its reason. The picture gained the twin's tools, full
  screen, curves in miniature and a clickable table. All of it was built the same day. Addendum review at
  [`evidence/5db1b4b/REVIEW.md`](evidence/5db1b4b/REVIEW.md): screens, the keyboard walk, copy and the picture's
  checks pass.
- [x] Gate: the owner accepts iteration 3; merge to `main` and rebuild `dashboard/data/` from `main` (`DCD-D10`, `D30`) —
  *2026-10-22: accepted (`DCD-D35`); PR #8 merged as `85aedf6`; the data rebuilt from `main` at `85aedf6` and committed
  on `main`*

- [x] The owner runs it locally and gives feedback on the screens; findings become rows here, not reopened gates unless a ruling is contradicted — *2026-10-20: the owner asked to review the live app, not screenshots; the review page `/v0` was added and the owner accepted V0 (`DCD-D17`). The page's questions 2–6 stay open*
- [ ] Gate: the owner accepts V0's screenshot set; merge to `main` — *accepted 2026-10-20 (`DCD-D17`); the cold read (check 7) and the merge are pending*

### Phase 3 · V1 — every live cell

- [x] Reference evaluators for `tropical_cyclone_wind_bess` and `wildfire_bess` in `scripts/reference_helpers/`, each proven against the cell's known answers and checked against Hazard's `perils/*/src/*/bess.py` output (read, never imported) — *2026-10-20, merged to `main` in PR #4: each validator reproduces every known answer; the Hazard comparison is in each cell's `current/hazard_consumer_comparison.md`*
- [x] The first V1 step: draw both cells through those evaluators — the hurricane cell as one line per record × resistance scenario, never averaged; the wildfire cell as marks at the exact FSim classes 0–6, never joined; their 104 known answers replayed and reproduced; the look review of the two pages — *2026-10-20, branch `claude/dashboard-v1-battery-75e6ea`, [PR #6](https://github.com/aamani-ai/Damage_Modeling/pull/6) into `claude/dashboard-v0-5d463c`, open; look review at [`evidence/3ea7e02/REVIEW.md`](evidence/3ea7e02/REVIEW.md): checks 1–6 and 8 pass, 25 of 25 traced numbers match*
- [ ] All 13 live cells, 5 proposals and 3 bindings sampled; the review block (G7) in the catalogue entries; the chain lens and the gate view (`07` §6–§7); the `/code/` resolver for model-gpr and the Hazard dashboard
- [ ] Gate: look review per slice; the cold-read test with a named reviewer

### Phase 4 · V2 — depth

- [ ] Version ghost and chain diff · lineage lighting · twin thumbnails · the review queue for the weekly agents (JSON only)

### Phase 5 · Hosting and outward

- [x] Cloud Run through the team's deploy skill, authenticated, after the owner has used the local app — *2026-10-22:
  the service `damage-curves`, behind IAP for aamani.ai, deployed from `deploy/damage-curves` (`DCD-D36`); live at
  <https://damage-curves-wsd6lcl64q-uc.a.run.app>, an anonymous request redirected to Google sign-in*
- [x] Gate: the owner approves hosting (gate H1 below) — *ruled 2026-10-22, `DCD-D36`*
- [ ] The one-pager export, after G8

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
| H1 | Host on Cloud Run (authenticated) once the local app has been used? | **Ruled 2026-10-22** (`DCD-D36`): `damage-curves` behind IAP for aamani.ai, deployed from `deploy/damage-curves` |

## Connected work

- Reasoning: [`docs/extra/discussion/damage_curve_dashboard/`](../../extra/discussion/damage_curve_dashboard/README.md) — `01`–`07` and `evidence/`
- Registers: [`decisions.md`](decisions.md) · [`assumptions.md`](assumptions.md)
- Data layer: [`docs/cells/CATALOGUE.md`](../../cells/CATALOGUE.md), `docs/cells/catalogue/`, `scripts/reference_helpers/build_damage_curve_catalogue.py`
- Sibling instrument: `Hazard_modeling/dashboard/`; its framing `docs/discussion/_cross_cutting/dashboard/00_dashboard_framing_and_reference_audit.md`
- Standards this plan must not violate: `AGENTS.md` (what this repo owns and does not); `docs/method/standards/08_evidence_provenance_and_links_standard.md`; `docs/contracts/standards/17_versioning_policy.md`; the skill's review gates `docs/extra/damage_curve_skill/00_governance/REVIEW_GATES.md`
- Related plans: [`cell_notebook_coverage/`](../cell_notebook_coverage/README.md) (the notebooks read the same artifacts); [`bess_damage/`](../bess_damage/README.md) (the battery cells)
