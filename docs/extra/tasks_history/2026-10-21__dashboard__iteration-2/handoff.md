# Handoff — damage-curve dashboard, iteration 2: the plain layer first (2026-10-21)

## 10-bullet summary

1. **Iteration 2 runs locally and is on a pull request.** Branch `claude/dashboard-iteration-2-8df11e` from `main`
   at `2efd6c3`; [PR #7](https://github.com/aamani-ai/Damage_Modeling/pull/7) into `main`, open and **not merged**
   (`DCD-D10`): the owner reviews on the running app first. Run it as before
   ([`dashboard/README.md`](../../../../dashboard/README.md)); this iteration was checked on port 3213
   (`PORT=3213 npm run start`) while the owner's build of `main` ran on 3211.
2. **The plain layer is the page (`DCD-D19`).** Every cell page opens on three plain chips and a sentence, then
   *How this was built* — the same ten stations of discussion `07` with plain names and a fact in words under
   each, every one opening a side panel that explains first (the build's paragraph), then lists sources as links
   and parameters in words, then keeps the ledger under *Details*. The curve is drawn one part at a time with a
   caption (what it says · how sure · seen in the field · main references) and *Show the numbers*; five open
   blocks follow; the identity sits once in the footer with *Files · Registers · Known answers · Pins*.
3. **Nothing from V0's ledger was removed.** Its cards became the pieces of `components/ledger.tsx`, rendered under
   each step's Details and the footer; the trail, the cards and the collapsible card were deleted as components only.
4. **Every sentence is the build's.** `dashboard_build/plain.py` writes the chips, the ✓ ◐ ✗ sentences, the
   captions (templates per curve form over the sampled points), the ten paragraphs (fixed templates) and the
   parameters in words; `parts.py` writes the asset sentences and the *split differently* finding. A `plain_text`
   pass gives a bare tier code in the catalogue's own words its tier word and drops register IDs from the default
   view; the raw text stays in the ledger (`DCD-A15`).
5. **Sources are links.** `dashboard_build/sources.py` resolves each source to a web URL, a DOI, a file in this
   repository at the build commit, or a Hazard file (its `main`, said so); otherwise the title, the locator and the
   words *no link in the register*. Across the 18 cells with sources: 267 documents, 249 linked, 13 locator only,
   5 with neither (named on the review queue); 6 provenance markers and 3 placeholder inputs listed apart.
6. **The four oldest cells show their evidence.** Read from the workbook sheets (`Sources`, `Evidence_Log`,
   `*_Evidence_Params`, `*Assumption_Register`, `Open_Seams*`) and the dossier's URL tables, each marked where it
   came from: hail × solar 0 → 21 documents (20 linked), flood × solar 8, convective wind × solar 10, convective
   wind × wind 8, with their claims, assumptions and open seams. Three tier-table IDs match no document
   (`ANZGEO_2023_SCOUR_CONTEXT`, `WIND_PRESSURE_PHYSICS`, `AWN_15_DECLARED_BRIDGE`) and are reported, not guessed.
7. **Every asset has the asset view**, in words, with each cell's own part names on hover and side by side, and the
   finding the owner asked for: solar's cells name 1 to 11 parts on four different value bases; the tornado cell
   splits the turbine the other wind cells withhold; three substation hazards price the whole fenced station while
   wildfire binds eight equipment rows (48 %); hail splits buildings into the roof and the walls; the two battery
   generations price the enclosure differently ($72.1M vs $84.0M). Twin nodes for batteries (leads) and
   substations (nodes, from Hazard's crosswalk, unpinned); *no twin mapping yet* elsewhere.
8. **Four new build checks** — `substation_budget` (Hazard's reference budget against the substation flood
   binding's pin), `plain_layer` (a caption per drawn curve, ten paragraphs per cell), `source_links` and
   `extracted_sources` (data checks that fail honestly on the 5 unlinked sources and the 3 unmatched IDs) — and a
   seeded review queue at `/review`. Every earlier check is kept; `source_ids` still fails on its 22 references.
9. **The look review** is at
   [`evidence/b0ff718/REVIEW.md`](../../../plans/damage_curve_dashboard/evidence/b0ff718/REVIEW.md): the screens
   at both widths and themes, greyscale, scrolled frames, the keyboard walk and the speed runs from one clean build;
   `acceptance_checks.py` proves the brief's §5 checks 1–7 mechanically (no register ID, bare tier code, gate
   letter, station number or SHA on any page before a control). The cold read (§5 check 8) needs a named reader;
   the owner's review (check 9) is open.
10. **Nothing in `docs/cells/` changed, nothing in the Hazard repository was touched, port 3211 was left alone.**
    Hazard's substation budget and crosswalk are read and copied beside the data with their SHAs, as the battery
    crosswalk was.

## Open for the owner

- The five questions on `/v0`: the balance (plain layer first, ledger one control away); the four tier words;
  the canonical rows per asset (`DCD-A14`); who does the cold read; the build date in the header instead of the
  commit.
- The 5 sources with neither a link nor a locator (the hurricane × wind farm register's four rows, one review log
  in wildfire × solar) and the 3 unmatched tier-table IDs are the cells' owners' to fix.
- Carried: the 22 `source_ids` references, the cold reader, the wildfire battery artifact's two reference ids.

## Next

1. The owner's second review on the running app — **held 2026-10-21.** Divy found it close but not there. His
   points change the asset grouping and the page order, so they became gates G13–G19 in
   [`08`](../../discussion/damage_curve_dashboard/08_categories_and_construction.md) rather than plan rows; the
   build date is already ruled out. The five `/v0` questions are mapped there (§5). Next: his rulings, then
   `DCD-D20…` and the changes on this branch.
2. Merge PR #7 and delete the branch and worktree in the same action; refresh the branch register's row.
3. Phase 3 and 4 items unchanged: the chain lens and the gate view as library lenses, lineage lighting, the version
   ghost, the review queue's agent notes, the one-pager (G8), hosting (H1).

## How to pick this up

- Read [`dashboard/README.md`](../../../../dashboard/README.md), then the
  [brief](../../../plans/damage_curve_dashboard/iteration_2_brief.md), then
  [`REVIEW.md`](../../../plans/damage_curve_dashboard/evidence/b0ff718/REVIEW.md); [`decisions.md`](decisions.md)
  here has every engineering choice with its reason; [`notes.md`](notes.md) has the commands and the gotchas.
- To change a sentence, change the build (`scripts/dashboard/dashboard_build/plain.py`, `parts.py`), never a component.
- Rebuild the data from a clean tree so the receipt names a real commit; capture the look review from that build;
  commit the data with its receipt.

## Files touched

Created: `scripts/dashboard/dashboard_build/{sources,plain,parts}.py` · `dashboard/components/{plain-rail,how-built-strip,station-panel,ledger,curve-hero,plain-blocks,cell-footer,source-link}.tsx` ·
`dashboard/app/review/page.tsx` · `dashboard/scripts/look-review/{routes.iter2.json,speed.iter2.json}` ·
`docs/plans/damage_curve_dashboard/evidence/b0ff718/` · this folder.
Edited: the build (`build.py`, `registers.py`, `sampling.py`, `summaries.py`), `dashboard/{lib,app,components}`
(the cell, curve, asset, occurrence, library, layout and `/v0` pages; the plot, the drawer, the nav, the types and
readers), `dashboard/scripts/look-review/{keywalk.mjs,README.md}`, `dashboard/README.md`, `dashboard/data/README.md`,
`scripts/dashboard/README.md`, the plan's README and `assumptions.md`, `docs/plans/README.md`,
`docs/extra/tasks_history/README.md`, `docs/extra/branch_register.md`, `AGENTS.md` (one row).
Deleted: `dashboard/components/{trail,cell-cards,collapsible-card,status-rail}.tsx` (their content moved).
