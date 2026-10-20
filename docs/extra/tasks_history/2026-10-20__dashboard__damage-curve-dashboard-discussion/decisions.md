# Decisions — damage-curve dashboard discussion, iteration 2 (2026-10-20)

*Agent decisions about how the work was done. Owner rulings on the dashboard itself are G1–G12 in the node's
README and are all still open.*

| # | Decision | Why |
|---|---|---|
| D1 | Extend the first session's folder (`damage_curve_dashboard/`) as iteration 2 rather than start a new node or restructure it to the skill's template | The skill: reuse the existing discussion home, never duplicate; do not reorganize an existing discussion to match a template. Stable IDs G1–G9 kept; G10–G12 added |
| D2 | Use the desktop app's built-in browser for the visual pass | Claude in Chrome reported not connected; the rule is to ask before switching browsers; Divy answered *"Built-in browser (Recommended)"* on 2026-10-20 |
| D3 | Every count quoted in the node is produced by `evidence/2026-10-19_catalogue_counts.py` and its saved output | The skill's evidence rule: numbers from a read-only script, never hand-typed |
| D4 | Keep only our own apps' screenshots in the repository; describe third-party pages in text | Copyright and repository hygiene; the descriptions carry what matters (marks, layouts, footers) |
| D5 | Write the look and usability as a pointer-first document (`06`): inherited principles quoted with paths first, new rules only for curves and evidence | The owner asked to "put those things in a principle or point to the principles which we already have"; the house already has most rules in five places — the gap was that no builder could find them from this repo |
| D6 | Put the three process and placement questions the look raises to the owner as gates (G10 sign-off, G11 home of the principle, G12 plain language) instead of deciding them | Each changes scope, cost or meaning: who accepts a slice, where a shared principle lives, whether a second UI mode exists |
| D7 | Draft the principle text (`06` §7) but do not promote it anywhere | Promotion needs G11; a draft in the discussion binds only this node's plan |
| D8 | Keep the headless-Chrome captures although they came out dark and without the map's cell layer; say so in the evidence | Honest evidence of the house finish (type, tiles, chips, histogram) is still useful; the light theme is listed as not seen |
| D9 | Record this session as a task-history entry even though the first session did not | The owner wants the next agent to understand the context without the conversation |
| D10 | Record the owner's "I agree with your recommendation" as rulings on all twelve gates, with the conditions quoted, and settle the node | The skill: a ruling is recorded in the owner's words and date; the conditions (creativity not constrained; local first; feedback on running software) are directions recorded in the plan |
| D11 | Activate the plan on the owner's "Let's just keep moving … Let's go." rather than wait for a plan read | The owner chose the running app as the review surface (`DCD-D15`, `D16`); the plan is the reference for that review |
| D12 | Design the chain trail as an engineering decision (`DCD-D14`) instead of a new gate; measure the cells first | The owner's direction was to find the best representation; the measurement (chain inventory) made the four-state design necessary rather than optional |
| D13 | Write the promoted principle into the Hazard repo uncommitted, on its current branch, and flag it | G11 ruled the home; committing in another repo on a branch with unrelated uncommitted edits is the owner's call (`DCD-A09`) |
| D14 | Correct `AGENTS.md` only where it was plainly wrong (no `.github/`; the `src/` package) and register everything else as observations | The owner invited improvements "in the right way"; a draft discussion node with verified items and gates is that way |

