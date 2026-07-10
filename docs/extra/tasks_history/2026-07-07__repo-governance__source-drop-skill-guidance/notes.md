# Notes - commands, checks, and implementation trail

## Commit Trail Covered By This Handoff

```text
a16d854 Rehome damage docs and remove duplicate implementation tree
13103c7 Clarify extracted source-drop staging
6b0cfcf Ignore local source-drop audit scratch
ce5da98 Add source drop ingestion guide
ef635e4 Add extra guides for curve requests
514ee64 Expand hail solar curve request guide
140f484 Add damage curve governance skill guidance
```

`140f484` was pushed to `origin/main`.

## Main Work Completed

- Rehomed current docs out of the duplicate implementation tree into shallow canonical locations.
- Preserved the original v2.5 source ZIP under `docs/source_drops/raw_zips/`.
- Documented the local extracted mirror policy under `docs/source_drops/extracted/README.md`.
- Added source-drop ingestion guidance under `docs/extra/guides/source_drop_ingestion_guide.md`.
- Added and expanded the hail-solar curve request guide under
  `docs/extra/guides/hail_solar_curve_request_guide.md`.
- Added the repo-owned damage-curve governance skill under `docs/extra/damage_curve_skill/`.
- Added the two-mode skill usage guide under `docs/extra/guides/damage_curve_skill_usage_guide.md`.
- Updated `AGENTS.md` so future agents see the source-drop and damage-curve-skill rules early.
- Fixed stale `data/README.md` links from old `docs/damage_curves/` paths.

## Important Commands Run

## Git / history inspection

```bash
git status --short
git log --oneline --reverse --decorate --max-count=20
git show --stat --oneline --summary 140f484
git log --oneline --stat --reverse 4e3427e..HEAD
```

## Source/drop and guide inspection

```bash
find docs/extra/damage_curve_skill -maxdepth 2 -type f | sort
find docs/extra/guides docs/source_drops docs/method/value_basis docs/extra/damage_curve_skill -maxdepth 2 -type f | sort
rg -n "latest damage-curve-library|latest DAMAGE_CURVE_LIBRARY|release zip|package the next|ZIP round-trip|inside_repo|outside_package" docs/extra/damage_curve_skill docs/extra/guides/damage_curve_skill_usage_guide.md AGENTS.md
```

## Skill validation

```bash
python3 docs/extra/damage_curve_skill/tools/validate_skill_bundle.py docs/extra/damage_curve_skill
python3 docs/extra/damage_curve_skill/tools/run_self_tests.py docs/extra/damage_curve_skill
/tmp/source_drop_ingestor_validate_venv/bin/python /Users/divy/.codex/skills/.system/skill-creator/scripts/quick_validate.py docs/extra/damage_curve_skill
```

Results:

```text
Bundle validation: PASS, file_count 93
Governance self-tests: PASS, 5 cases
OpenAI skill validator: Skill is valid!
```

## Repo validation

```bash
python3.12 <local markdown-link-check snippet>
python3.12 <local JSON syntax-check snippet>
find . -maxdepth 3 -type d -name src -print
git diff --cached --check
```

Results:

```text
PASS markdown links checked: 249 files
PASS JSON syntax checked: 16 files
No src/ directory found
git diff --cached --check passed after removing trailing whitespace from VALIDATION_REPORT.md
```

## Push

```bash
git push origin main
```

Result:

```text
514ee64..140f484  main -> main
```

## Known Local Dirty State

These files were dirty/untracked before the task-history entry and were deliberately left alone:

```text
M  docs/presentations/Damage_Modeling_From_Basics.pptx
?? docs/presentations/Flood_Solar_Worked_Reference.docx
?? docs/presentations/Hail_Solar_Worked_Reference.docx
?? docs/presentations/InfraSure_Validation_Framework.pptx
?? docs/presentations/Range_Validation_Method.docx
```

Do not include those in unrelated commits unless the user explicitly asks.

## Key Context For Future Sessions

- Use `docs/extra/tasks_history/` for session handoffs in this repo.
- Use `docs/extra/guides/source_drop_ingestion_guide.md` before promoting anything from a new ZIP.
- Use `docs/extra/guides/damage_curve_skill_usage_guide.md` before using `docs/extra/damage_curve_skill/`.
- If working inside this repo, do not route ordinary changes through a ZIP.
- If working outside this repo, preserve the produced package/ZIP under `docs/source_drops/raw_zips/` and
  ingest it through the source-drop guide.
- `docs/source_drops/extracted/` is a local audit mirror and staging area; it is not canonical navigation.
- `src/` remains deferred until the runtime API/artifact publishing path is explicitly designed.
