# Notes — implementation, commands, verification

## Sequence (topical)

### A. Discussion → language fix (in `Hazard_modeling`)
- Read the Drive docs (`textutil -convert txt` on the `.docx`) + the three principles. Confirmed
  destruction-only; found the hail-M3 wording self-contradiction ("folded in" vs "folded out").
- Fixed 9 spots to "deferred — physical repair cost only" across `01_damage.ipynb` (via NotebookEdit),
  `01_damage.py`, `README.md`, `assumptions.md` (A18), `phase-4-damage.md`. Verified with grep (no stray
  "folded" phrasings).

### B. Consolidation + the user's big update
- Ran a read-only consolidation workflow over the Drive docs / library / cells / learning-logs → produced the
  original 7-doc `damage_curves` discussion scaffold (later relocated).
- User then added `damage_curve_foundations/` (P1–P3 + 6 questions + `00_assembled_curve_record`) and
  `damage_curve_implementation/` (v2.0 → **v2.1** `…EVIDENCE_UPDATE_AND_VERSIONING…`: 17 global-method
  standards + templates; cells hail/flood/wind; `99_source_context`). Read the spine directly + 4 parallel
  Explore agents for breadth. Architecture: CELL → FAILURE-UNIT → SUBSYSTEM; coverage roles;
  selector/conditioner/exposure; standards 16 (reference ingestion) + 17 (versioning).

### C. Build the repo (the careful part)
```bash
NEW=/Users/divy/code/work/infrasure_git_codes/damage_modeling
OLD=/Users/divy/code/work/infrasure_git_codes/Hazard_modeling/docs/extra/discussion/damage_curves
GIT=/Users/divy/code/work/infrasure_git_codes

mkdir -p "$NEW/docs" "$NEW/data" "$NEW/notebooks" "$NEW/.github/workflows"
ln -sfn "$GIT/infrasure-damage-curves" "$NEW/infrasure-damage-curves"   # evidence source
ln -sfn "$GIT/Hazard_modeling"         "$NEW/Hazard_modeling"           # consumer
ln -sfn "$GIT/model-gpr"               "$NEW/model-gpr"
ln -sfn /Users/divy/Desktop/Learning   "$NEW/Learning"
ln -sfn /Users/divy/code/personal/renewablesinfo_org "$NEW/renewablesinfo_org"   # added on request

cp -R "$OLD" "$NEW/docs/damage_curves" && find "$NEW/docs/damage_curves" -name .DS_Store -delete

# VERIFY identical BEFORE any delete:
diff <(cd "$OLD" && find . -type f ! -name .DS_Store | sort) \
     <(cd "$NEW/docs/damage_curves" && find . -type f ! -name .DS_Store | sort)   # → identical, 115/115

# anchor-link fix (scoped to SCOPE_AND_STORY.md + damage_curves/README.md) — route via Hazard_modeling symlink:
sed -i '' -e 's#](../../../principles/#](../../Hazard_modeling/docs/principles/#g' \
          -e 's#](../../../../infrasure-damage-curves#](../../infrasure-damage-curves#g' \
          ... (plus plans/learning_logs/google_drive_docs/gpt/aggregation/00_scope_and_story)  "$F1" "$F2"

# tombstone (only AFTER verify): rm -rf "$OLD" && mkdir -p "$OLD"  → wrote redirect README
```
- Bidirectional symlink: `ln -sfn "$NEW" "$GIT/Hazard_modeling/damage_modeling"` + `/damage_modeling` in
  Hazard_modeling `.gitignore` + AGENTS symlink-table row.

### D. Evidence-harvest discussion
- `docs/extra/discussion/evidence_harvest/` kickoff README. Then one Explore agent per cell did a
  **co-curation gap analysis** (old-repo evidence vs our cell's references + flagged gaps). Wrote
  `research/<cell>.md` (facts) + `01_<cell>_triage.md` (adopt/park/reject) for hail, flood, wind.

## Verification

- **Copy identical:** `diff` of file trees → identical; byte-size spot-check on the 3 biggest md → match.
- **Symlinks:** all 5 in `damage_modeling` resolve; `Hazard_modeling/damage_modeling` resolves to AGENTS.md.
- **Links:** scripted resolve-checks (grep markdown links → test each path exists) on skeleton docs, the two
  anchor docs, and all 6 evidence_harvest files → **all resolve**.
- **Tombstone:** old location now contains only `README.md`.

## Metrics

- 115 files relocated (95 md + 8 curve `.xlsx` + 2 value `.xlsx` + 10 preview `.png`; `.DS_Store` dropped).
- 9 spots language-fixed. 5 symlinks in `damage_modeling` + 1 added to `Hazard_modeling`.
- 3 cells co-curated (research + triage each). Old repo: ~40 hail refs / ~47 flood refs / strong-wind +
  hurricane wind research vs our cells' ~9 / ~5 / ~7.

## Key insights

- **Co-curation value rises hail → flood → wind** — the more greenfield/engineering-fit our cell, the more
  the old repo's *evidence* helps. Wind gained the most (Rose 2012 tower fragility, Typhoon Usagi as a 2nd
  empirical anchor, Kapoor/Kareem physics for the tornado shift).
- **No cell gets a new curve** — the old repo is evidence, not a replacement (P3 held).
- **Measured tornado-on-turbine fragility is absent in both repos** — documented as a shared, honest gap.
- **The relocation is the drift-risk moment** — copy-verify-then-delete is non-negotiable because the docs
  aren't reliably in git.
