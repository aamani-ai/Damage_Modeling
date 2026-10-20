<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-19
updated: 2026-10-19
status: active
scope: Why the damage-curve dashboard exists, who uses it and for which questions, and what it is not — restated from the 2026-10-19 meetings and Divy's chat brief.
-->

# 01 — Why and who

*A restatement, not a decision. Where a reason was said is given beside it; the meeting records live in
Divy's local notes vault (paths at the end).*

## Definition

**The damage-curve dashboard** is one internal place where every damage curve shows how it was derived, its
main logic, its main references, how strong its evidence is, whether the damage it describes has actually been
seen in the field, and whether a person has reviewed it — so that a person or an agent can check it quickly. The
client one-pager is an export of the same entry; deeper material stays in the linked Markdown files.
*(Divy, Plan for the Week 2026-10-19, 00:22:30–00:27:33, "internal"; the in-person meeting the same day; the
"does it happen?" part is Divy's chat message of 21:49.)*

### Examples

| Example | What the dashboard would show |
|---|---|
| **Convective wind × real estate** (proposal) | The EF-scale curve beside the hurricane curve, the derivation steps, the open question that both run on one wind magnitude, and Jung A's doubt about it — the first case a reviewer caught in an agent-built curve |
| **Hail × solar** (live, shape T2 / cost T2) | The one live cell fitted to data; its client one-pager is exported from the entry, not written separately |
| **Flood × battery storage** (live, T3–T4) | Enclosures replaced once water passes 0.30 m — an owner-approved policy (T4), not a measured fragility; the PCS reuses the Flood × Solar inverter curve (T3); 25% of plant value has no flood curve; no search yet for field reports of floods damaging batteries |
| **Hail × battery storage** (gap) | No curve. The Digital Twin rates hail exposure *Low* for the enclosure shell and chiller; the suggestion in [`04`](04_does_it_happen_evidence.md) is a logged search for field reports before any curve research |

## The people and their questions

| Who | The question they bring | Where it is answered ([`03`](03_design_options.md)) |
|---|---|---|
| Reviewers — Divy, Jung A, Sarasi, Colby | Is this curve right, and what is it based on? | Cell page · curve dossier · review queue |
| Prashant, and anyone talking to a client | For batteries, which hazards matter, and how sure are we? | Asset view (subsystem × hazard) |
| Whoever plans the next research | What should we research next, and what can we drop? | Asset view, "does it happen?" lens · search log |
| The weekly review agents | What is unreviewed, stale or weak this week? | Review queue · the same data as JSON |
| Consumers — Hazard dashboard, model-gpr bankability | Which curve, which version, produced this number? | Deep link by curve identity and version |
| Clients and partners (later) | Can you walk us through this curve? | One-pager export |

## Why — the reasons, with where each was said

| # | Reason | Where it was said |
|---|---|---|
| 1 | **The curves need a human read.** They were built fast and largely by agents; the hazard side had already learned that *"machine readable is not human readable"* (Colby). Since then 8 of the 13 live curve releases record a review state of their own, some owner-approved, some same-author; no catalogue entry has yet been read by its owner. | Damage thread, 2026-08-13; `hazard-modeling-junga.md` (same vault folder); artifact `review_status` fields |
| 2 | **A library of subsystem curves.** Prashant: *"we have a library of… subsystems right the damage curves that are associated with the subsystems correct"* — yes. The old dashboard *"doesn't structure in a way that you go into all the subsystem level curves and all the reasoning and referencing attached to that"* (Divy). | Plan for the Week 10-19, 00:22:30, 00:26:37 |
| 3 | **Record the technique, not an accuracy score.** Divy: *"we don't want to quantify accuracy"*; Sarasi: *"qualify which technique we used for each one"*. The catalogue's T1–T4 tiers and method types already do this. | Plan for the Week 10-19, 00:26:37–00:27:33 |
| 4 | **Scale.** *"five hazards, three asset[s], each of them have a five to seven subsystems… cannot be managed by just MD files"*. | In-person meeting 10-19 (Wispr T869–870) |
| 5 | **Agents as reviewers** need *"this is a damage curve, this is how we derived it, this is a reasoning, and this is a reference"*. | In-person meeting 10-19 (T865–868) |
| 6 | **One source, many outputs** — the one-pager is *"a replica of that same thing"*; *"download that as a PDF"*. | Plan for the Week 10-19, 00:24:34; meeting T864, T872 |
| 7 | **Keep the evidence** found on the way — *"test lab filings, some PDF research paper… we really need to preserve this thing"*. | Meeting T882–883 |
| 8 | **Speed must be checkable** — *"Any new asset, two days"*; the convective-wind case shows why a reviewer must be able to see each step. | Meeting T797–799, T841–857 |
| 9 | **Does it happen?** A reference also means real event reports showing the risk is real for that subsystem; if none can be found, that is a reason not to keep the curve or start the research. | Divy, chat, 21:49 |
| 10 | **Answer Prashant's question** — for batteries, which hazards affect them. | Divy, chat, 21:49 |

## What it is not

| Not this | Why |
|---|---|
| A curve editor | Status and curve changes go through the repository (cell package, decision log, catalogue entry). *"Presentation does not imply authorization"* (model-gpr `docs/principles/model_data/policy_definition_enforcement_and_state_are_separate.md`) |
| An EAL / PML view | This repository does not compute annual metrics; Hazard does (`AGENTS.md`, *What this repo owns*). The dashboard links to Hazard for them |
| A public or marketing page | Internal. Only the one-pager goes out, and only under the NDA line Divy sets (G8) |
| The internal QC dashboard of 10-15 | That is about configuration views in the main app — related, separate |
| A replacement for the write-ups | It summarises and links; the derivation dossier stays the authority |
| A decision engine | The triage in [`04`](04_does_it_happen_evidence.md) suggests a next action; the owner decides |

*Sources (Divy's notes vault, `/Users/divy/Desktop/infrasure/meets/`):
`collab_threads/risk-intelligence/hazard-modeling/damage-resiliency-modeling-junga.md` (section "The
damage-curve dashboard — why, what it is, and where it stands", and the 2026-08-13, 09-11, 09-23, 10-15
entries) · `raw_meet_notes/week-2026-10-18_to_2026-10-24/Plan for the Week - 2026_10_19 17_58 CEST - Notes by
Gemini.md` · `raw_meet_notes/week-2026-10-18_to_2026-10-24/PowerUp In Person and Damage Curves - 2026_10_19 -
Wispr Flow.md` (T-numbers are its line numbers) · `raw_meet_notes/week-2026-10-18_to_2026-10-24/Damage-curve
Catalogue - Jung A - 2026_10_19 17_48 EDT - Slack.md`. Catalogue facts: [`../../../cells/CATALOGUE.md`](../../../cells/CATALOGUE.md).*
