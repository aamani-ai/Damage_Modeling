# Handoff - repo governance and source-drop skill guidance

## 10-bullet summary

1. The duplicate current-looking implementation navigation layer has been removed; current material now lives
   under shallow canonical folders.
2. Current cells are under `docs/cells/`; contracts/schemas under `docs/contracts/`; method under
   `docs/method/`; cross-cell evidence under `docs/evidence/`.
3. The original v2.5 ZIP is preserved under `docs/source_drops/raw_zips/`; extracted mirrors are local/staged
   and not the canonical route.
4. `docs/source_drops/extracted/` is gitignored except for its README.
5. `docs/extra/guides/source_drop_ingestion_guide.md` is the standard flow for any future ZIP/source drop.
6. `docs/extra/guides/hail_solar_curve_request_guide.md` is the shallow answer path for "give me a solar hail
   curve" and related option/tweak questions.
7. `docs/extra/damage_curve_skill/` is now tracked as a draft-operational governance skill bundle.
8. `docs/extra/guides/damage_curve_skill_usage_guide.md` defines the key split: `inside_repo` direct edits vs
   `outside_package` ZIP/source-drop workflow.
9. The `src/` rule remains active: no `src/` until cloud bucket layout, artifact publishing, Hazard loading,
   version pinning, and repo code/data responsibility are decided.
10. Latest pushed commit on `main` is `140f484 Add damage curve governance skill guidance`.

## Read First

- [`../../tasks_history/2026-07-07__repo-governance__source-drop-skill-guidance/task_context.md`](task_context.md)
- [`../../../extra/guides/source_drop_ingestion_guide.md`](../../../extra/guides/source_drop_ingestion_guide.md)
- [`../../../extra/guides/damage_curve_skill_usage_guide.md`](../../../extra/guides/damage_curve_skill_usage_guide.md)
- [`../../../extra/guides/hail_solar_curve_request_guide.md`](../../../extra/guides/hail_solar_curve_request_guide.md)
- [`../../../extra/damage_curve_skill/SKILL.md`](../../../extra/damage_curve_skill/SKILL.md)
- [`../../../extra/damage_curve_skill/START_HERE_FOR_FIRST_READER.md`](../../../extra/damage_curve_skill/START_HERE_FOR_FIRST_READER.md)
- [`../../../source_drops/README.md`](../../../source_drops/README.md)
- [`../../../cells/README.md`](../../../cells/README.md)
- [`../../../contracts/README.md`](../../../contracts/README.md)
- [`../../../method/README.md`](../../../method/README.md)

## Repro / Verify Current State

```bash
git log -1 --oneline
git status --short
python3 docs/extra/damage_curve_skill/tools/validate_skill_bundle.py docs/extra/damage_curve_skill
python3 docs/extra/damage_curve_skill/tools/run_self_tests.py docs/extra/damage_curve_skill
/tmp/source_drop_ingestor_validate_venv/bin/python /Users/divy/.codex/skills/.system/skill-creator/scripts/quick_validate.py docs/extra/damage_curve_skill
find . -maxdepth 3 -type d -name src -print
```

Expected:

```text
HEAD includes 140f484
skill validation PASS
governance tests PASS
OpenAI skill validator PASS
no src/ directory
only unrelated docs/presentations/ local dirt remains, unless the user has changed it
```

## Next Action

## Phase A - Start future sessions from the newest handoff

Read this file first, then `task_context.md`, then the specific guide for the next task. Do not start from the
old v2.5 implementation bundle unless the task is source comparison or provenance audit.

## Phase B - If a new ZIP/source drop arrives

1. Preserve the raw ZIP under `docs/source_drops/raw_zips/` or record the external source in a manifest.
2. Use `docs/source_drops/extracted/` only as local/staged audit material.
3. Run the source-drop ingestion guide.
4. Inventory first; do not move files until duplicates/conflicts are understood.
5. Promote only reviewed canonical material into `docs/cells/`, `docs/contracts/`, `docs/method/`,
   `docs/evidence/`, or `scripts/reference_helpers/`.

## Phase C - If using `damage_curve_skill`

1. Read `docs/extra/guides/damage_curve_skill_usage_guide.md`.
2. Decide mode first:

   ```text
   inside_repo
     edit canonical repo files directly

   outside_package
     produce a governed package/ZIP and ingest through source_drops
   ```

3. Read `docs/extra/damage_curve_skill/SKILL.md`.
4. Classify the requested change before editing.
5. Run the matching workflow under `docs/extra/damage_curve_skill/01_workflows/`.
6. Validate before committing or packaging.

## Phase D - If Hazard wants a curve

Start with `docs/extra/guides/hail_solar_curve_request_guide.md` for solar hail. The normal process is:

```text
request: "give me solar hail curve"
  -> identify cell: docs/cells/hail_solar/
  -> use current JSON/workbook/docs package
  -> choose defaults or requested selectors/conditioners
  -> keep output as damage/vulnerability, not EAL/PML
  -> do not create src/ unless runtime loading/publishing has been designed
```

## Gotchas

- `docs/source_drops/extracted/v2_5_implementation_hardened/` may exist locally, but it is intentionally
  ignored and should not be treated as canonical.
- Do not reintroduce `docs/damage_curves/damage_curve_implementation/` as a current docs route.
- Do not confuse `docs/extra/damage_curve_skill/` with the source-drop ingestion guide. The skill governs
  damage-curve changes; the source-drop guide governs ZIP/source intake.
- Do not stage the local `docs/presentations/` files unless the user explicitly asks.
- The next real runtime design remains open: cloud bucket layout, artifact versioning, Hazard loading, and
  whether this repo publishes code, data, or both.
