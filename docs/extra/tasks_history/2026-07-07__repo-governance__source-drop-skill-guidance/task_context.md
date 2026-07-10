# Task Context - repo governance, source-drop handling, and skill guidance

## Objective

Finish the repo-information-architecture cleanup in a way that makes the next session easy to restart:
remove the duplicate implementation navigation layer, preserve raw/source material correctly, document how new
ZIP/source drops should be handled, and add a reusable governance skill for future damage-curve changes.

## Background

The previous session created the shallow information architecture and moved the first canonical surfaces into
`docs/scope/`, `docs/method/`, `docs/contracts/`, `docs/cells/`, `docs/evidence/`, and
`docs/source_drops/`. The remaining problem was practical navigation and governance:

```text
raw ZIP / extracted source material
  was still easy to confuse with
canonical docs / cells / contracts / runtime artifacts
```

The user also wanted a repeatable way to handle future deep-research ZIPs or externally produced packages
without duplicating folders, losing provenance, or prematurely creating `src/`.

## Problems Encountered

- The v2.5 implementation folder was acting like a second canonical navigation layer even though its contents
  had already been promoted into shallow repo folders.
- The raw downloaded ZIP and the extracted local mirror needed different semantics: raw ZIP is preserved
  source material; extracted mirror is local audit/staging, not canonical docs.
- The user needed a clear answer for "give me a solar hail curve" and "what options can I tweak" without
  sending future readers through the whole implementation bundle.
- `damage_curve_skill` existed as an untracked rich governance bundle, but its docs were still package-first:
  "latest ZIP in, next ZIP out." That was wrong for in-repo work.
- There was still stale link debt from old `docs/damage_curves/` paths, including two links in `data/README.md`.

## What We Fixed

1. Removed the duplicate implementation navigation layer and rehomed current material.

   The old `docs/damage_curves/damage_curve_implementation/...` deliverable tree was no longer the primary
   route through current docs. Current cell packages, contracts, schemas, method standards, evidence protocol,
   source context, and helper scripts now live under their shallow canonical homes.

2. Clarified source-drop semantics.

   `docs/source_drops/raw_zips/` preserves original ZIPs. `docs/source_drops/extracted/` is a local extracted
   mirror/staging area and is gitignored except for its README. `docs/source_drops/manifests/` records
   source-drop metadata and checksums.

3. Added reusable operator guides.

   `docs/extra/guides/source_drop_ingestion_guide.md` defines the ingestion flow for new ZIP/source drops.
   `docs/extra/guides/hail_solar_curve_request_guide.md` explains how to answer a current solar-hail curve
   request, including standard/default curve selection and user-tweakable options such as tracker/stow
   assumptions.

4. Added repo-owned governance skill bundle.

   `docs/extra/damage_curve_skill/` is now tracked as a draft-operational governance skill. It contains
   classification rules, workflows, design guides, contracts, validation gates, examples, templates, tests, and
   helper scripts for damage-curve-library changes.

5. Added explicit two-mode skill guidance.

   `docs/extra/guides/damage_curve_skill_usage_guide.md` and the skill entrypoints now distinguish:

   ```text
   inside_repo
     edit canonical damage_modeling folders directly; no ZIP round-trip

   outside_package
     work beside a package/folder outside repo, return a governed ZIP/source drop,
     then ingest through docs/source_drops/
   ```

6. Re-locked the `src/` rule.

   `src/` still means stable importable library/API that `Hazard_modeling` can depend on. It must not be
   created until cloud bucket layout, artifact publishing/versioning, Hazard loading path, and code-vs-data
   responsibility are decided.

7. Fixed stale links discovered by validation.

   `data/README.md` no longer points to the removed `docs/damage_curves/` tree. It now points to
   `docs/method/foundations/00_assembled_curve_record.md` and `docs/scope/SCOPE_AND_STORY.md`.

## Files Touched

## Created

- `docs/extra/guides/source_drop_ingestion_guide.md`
- `docs/extra/guides/hail_solar_curve_request_guide.md`
- `docs/extra/guides/damage_curve_skill_usage_guide.md`
- `docs/extra/damage_curve_skill/` and its governance/workflow/template/test/tool files
- `docs/source_drops/extracted/README.md`

## Modified

- `AGENTS.md`
- `README.md`
- `docs/README.md`
- `docs/source_drops/README.md`
- `docs/source_drops/manifests/2026-07-06_v2_5_implementation_hardened_zip.md`
- `docs/extra/guides/README.md`
- `data/README.md`
- repo IA plan/discussion docs under `docs/plans/repo_information_architecture/`

## Rehomed / Removed As Canonical Navigation

- Current cells are under `docs/cells/`.
- Contracts/schemas are under `docs/contracts/`.
- Method standards/templates are under `docs/method/`.
- Evidence ingestion material is under `docs/evidence/`.
- Reference helper Python is under `scripts/reference_helpers/`.
- v2.5 source context and package manifests are under `docs/source_drops/context/` and
  `docs/source_drops/manifests/`.
- The old duplicate `docs/damage_curves/damage_curve_implementation/` navigation layer is gone.

## Current Status

```text
[x] Raw v2.5 ZIP preserved under docs/source_drops/raw_zips/
[x] Extracted source-drop mirror documented as local/staged, not canonical
[x] Current docs/cells/contracts/method/evidence surfaces are shallow and navigable
[x] Source-drop ingestion guide exists
[x] Hail-solar curve request guide exists
[x] Damage-curve skill bundle is tracked
[x] Skill docs distinguish inside_repo vs outside_package
[x] No src/ directory created
[x] Latest governance skill commit pushed to origin/main: 140f484
[ ] Presentation files under docs/presentations/ remain local dirty state and were not staged
```

## Next Steps

1. In a new session, start with this folder's `handoff.md`.
2. Use `docs/extra/guides/source_drop_ingestion_guide.md` for any new ZIP/source drop.
3. Use `docs/extra/guides/damage_curve_skill_usage_guide.md` before using `docs/extra/damage_curve_skill/`.
4. If the next task is a curve request, start with `docs/extra/guides/hail_solar_curve_request_guide.md`.
5. Do not create `src/` until the runtime artifact publishing/Hazard loading plan is explicit.
