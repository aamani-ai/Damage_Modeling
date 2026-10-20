# Handoff — damage-curve dashboard discussion, iterations 2–3 (2026-10-20)

## 10-bullet summary

1. The discussion node `docs/extra/discussion/damage_curve_dashboard/` is **settled** (iteration 3):
   README (brief, verification, the ruled gates, the rulings table, from-here-to-build), `01` why and who,
   `02` reference audit (with what was *seen*), `03` design options, `04` "does it happen?", `05` build
   brief (P1–P25), `06` the look and the usability, **`07` the derivation chain**, and `evidence/`.
2. **All twelve gates were ruled on 2026-10-20** on the recommendation — the owner's words: *"Yeah, I agree
   with your recommendation, but don't let this stop your creativity and some aestheticness … keep the goal
   in mind (why we are building it)"* — plus three directions: local dashboard first, hosting later; feedback
   on the running software; "find the best way to represent that chain".
3. **The plan exists and is active:** `docs/plans/damage_curve_dashboard/` — README (phases 0–5), `decisions.md`
   (`DCD-D01…D16`: the twelve rulings, local-first, the trail, the feedback loop, the activation on "Let's go"),
   `assumptions.md` (`DCD-A01…A12` + watchlist). Ledger row added in `docs/plans/README.md`.
4. **The look principle is promoted** to `Hazard_modeling/docs/principles/analytical_instrument_look_and_usability.md`
   with a row in that folder's README, and linked from this repository's `AGENTS.md` (Conventions). Both
   Hazard edits are **uncommitted on Hazard's branch `codex/bess-conus`**, beside unrelated uncommitted edits
   there; committing them is the owner's call.
5. **The chain, measured** (`evidence/2026-10-20_chain_inventory.py` → `.txt` at `92ad156`): 2 of 21 cells
   with a folder carry all ten core chain artifacts as named files (both Jung A's); the four oldest canonical
   cells carry 3–4; seven-step audit as a file in 2, pressure test 2, site adapter 0, bounded search log 0;
   15 skill-named · 6 plain-named · 4 without a folder. Detection is by file name; the older cells keep
   registers in dossier prose and workbook sheets — hence the four presence states in `07` §2.
6. `07` designs the **trail** (ten stations under the status rail, ■ ◧ ▢ – marks, one fact per station), the
   **balance** of the cell page (answer above the fold; parts → evidence → audit → proof → seams → field and
   review below; each card names its station and review gate), **lineage lighting** from the registers, the
   **chain lens** on the library, and the `chain` block + `citations.json` for the data contract.
7. **Repository observations** are in `docs/extra/discussion/2026-10-20_repo_observations.md` (draft, sixteen
   verified items with what · why · where · fix, gates RO1–RO5; the branch register is at `docs/extra/branch_register.md`); `AGENTS.md` was corrected where it was
   plainly wrong (no `.github/`; the `src/damage_modeling/publishing/` package exists).
8. The visual pass (built-in browser; Chrome not connected) and the look document are as in iteration 2:
   `evidence/2026-10-20_visual_pass.md`, two dark-theme PNGs of the Hazard dashboard (no WebGL in headless).
9. **Nothing is built and nothing is committed** in this repository: the node, the plan, the observations,
   the `AGENTS.md` edits, the ledger rows and this folder are all in the working tree. Nothing in `docs/cells/`,
   `docs/contracts/`, any artifact or any script outside `evidence/` changed.
10. `main` is at `92ad156` = `origin/main` (`aamani-ai/Damage_Modeling`, the only remote). `.claude/launch.json`
    (gitignored) starts the Hazard dashboard (:3000) and the Digital Twin `dist/` (:4173) for previews.

## Files touched

Created: `docs/extra/discussion/damage_curve_dashboard/{06_look_and_usability,07_derivation_chain}.md` ·
`docs/extra/discussion/damage_curve_dashboard/evidence/{2026-10-19_catalogue_counts.py,2026-10-19_catalogue_counts.txt,2026-10-20_chain_inventory.py,2026-10-20_chain_inventory.txt,2026-10-20_visual_pass.md,2026-10-20_hazard_dashboard_studio_dark.png,2026-10-20_hazard_dashboard_delivery_dark.png}` ·
`docs/plans/damage_curve_dashboard/{README,decisions,assumptions}.md` · `docs/extra/discussion/2026-10-20_repo_observations.md` ·
`Hazard_modeling/docs/principles/analytical_instrument_look_and_usability.md` · this folder.
Modified: `docs/extra/discussion/damage_curve_dashboard/{README,02_reference_audit,03_design_options,05_build_brief}.md` ·
`docs/extra/discussion/README.md` · `docs/plans/README.md` · `docs/extra/tasks_history/README.md` · `AGENTS.md` ·
`Hazard_modeling/docs/principles/README.md`.
Written by the first session (2026-10-19, also uncommitted): the node's `README.md`, `01`–`05`, the ledger row.

## Repro / verify current state

```bash
git status --short                                        # only the paths listed above
.venv/bin/python docs/extra/discussion/damage_curve_dashboard/evidence/2026-10-19_catalogue_counts.py \
  | diff - docs/extra/discussion/damage_curve_dashboard/evidence/2026-10-19_catalogue_counts.txt   # no output
.venv/bin/python docs/extra/discussion/damage_curve_dashboard/evidence/2026-10-20_chain_inventory.py \
  | diff - docs/extra/discussion/damage_curve_dashboard/evidence/2026-10-20_chain_inventory.txt    # no output
for v in scripts/reference_helpers/validate_*.py; do .venv/bin/python "$v" >/dev/null 2>&1 || echo "FAIL $v"; done   # none
git -C Hazard_modeling status --short docs/principles     # the new file and the README edit
```

## Next action

### Phase 0 + V0 — the build (a separate builder session; it reads `05`, `06`, `07` and the plan, nothing else)

1. `scripts/dashboard/build_dashboard_data.py` per the plan's Phase 0: entries → checked JSON, every curve
   sampled through a Python evaluator or listed *no evaluator*, known answers reproduced, the chain block
   (start from the inventory script; ◧ only once dossier headings and workbook sheets are read), `citations.json`,
   the occurrence register shape with every battery row `not_searched`, `receipt.json`. Gate: the checks in `05` §3.
2. `dashboard/` from the Hazard dashboard's shell (`layout.tsx`, `globals.css`, `ui.tsx`, `echart.tsx`, the
   drawer, the status chip → rail); Next 16 — read `node_modules/next/dist/docs/` first. V0 screens per the
   plan's Phase 1 with the trail on the `flood_bess` page. `dashboard/README.md`.
3. The look review (`06` §4): screenshots at 1440 and 1024, both themes, under
   `docs/plans/damage_curve_dashboard/evidence/<commit>/`; greyscale; keyboard path; the fixed state sentences;
   speed numbers. Then the owner runs it locally and gives feedback (`DCD-D15`).

### In parallel

- The "does it happen?" searches on the battery rows (`04` §6), written into `docs/evidence/occurrence/bess/`.
- The owner ranks the repository observations (`RO1` chain backfill vs declared prose locations is the one
  that changes what the chain lens will say).

### Gotchas

- Validators need the repo `.venv` (`python3.12`); macOS has no `timeout`.
- The catalogue builder reads every JSON under `docs/cells/catalogue/` as an entry — put nothing else there.
- Hazard is a gitignored symlink; cite its paths, never import; its consumer code for the two battery cells
  is reference for checking the new evaluators, not a source to copy.
- "Cell" = hazard × asset here, a 0.25° grid cell in Hazard — say which.
- Headless Chrome follows the system theme and has no WebGL; review screenshots come from a real browser.
- A station is ■ only with a file behind it; never mark ◧ from a guess.
