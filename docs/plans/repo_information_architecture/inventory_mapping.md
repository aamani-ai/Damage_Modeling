# Repo Information Architecture — Inventory Mapping

Status: initial artifact-group inventory. No files moved.

This table classifies the current repo material before any migration. It is intentionally group-based rather
than one row per file; file-level moves should be planned only after these groups are accepted.

## Mapping table

| Current path / group | Role | Current authority status | Target location | Treatment | Reason | Verification check |
|---|---|---|---|---|---|---|
| `docs/damage_curves/SCOPE_AND_STORY.md` | Scope docs | Compatibility stub after Phase 4A | `docs/scope/SCOPE_AND_STORY.md` | Moved | This is the repo boundary/story entrypoint and should be shallow | Link check; old path points to new anchor |
| `docs/damage_curves/README.md` | Scope/index docs | Compatibility index after Phase 4B | `docs/scope/` and shallow surfaces | Updated in place | Keeps old package tree discoverable without making it the primary navigation path | Link check after index changes |
| `docs/damage_curves/damage_curve_foundations/` | Method docs | Canonical foundations/principles/question docs | `docs/method/foundations/` | Move later after mapping review | Durable method belongs outside deliverable-shaped navigation | Preserve relative links or add redirects |
| `docs/damage_curves/damage_curve_implementation/.../00_global_method/01-08,10,13-18` | Method docs | Canonical global method standards | `docs/method/standards/` | Index first, move later | These are general standards, not cell-specific deliverable material | Link check; no content edits during move |
| `docs/damage_curves/damage_curve_implementation/.../00_global_method/09_damage_code_interface_standard.md` | Contract docs | Canonical damage-code interface standard | `docs/contracts/` | Index first, move later only with review | Hazard consumes this seam across cells | Link check; no schema/runtime change |
| `docs/damage_curves/damage_curve_implementation/.../00_global_method/20_machine_readable_artifact_standard.md` | Contract docs | Canonical artifact standard | `docs/contracts/` | Index first, move later only with review | Repo-level runtime artifact promise | JSON schema unchanged |
| `docs/damage_curves/damage_curve_implementation/.../00_global_method/21_capability_and_cap_binding_standard.md` | Contract docs | Canonical capability/cap-binding standard | `docs/contracts/` | Index first, move later only with review | Controls what downstream metrics may emit | Capability declarations unchanged |
| `docs/damage_curves/damage_curve_implementation/.../00_global_method/schemas/` | Contract artifacts | Canonical JSON schemas in repo today | `docs/contracts/schemas/` or future package/schema area | Index only for now | Schema placement may change with runtime publishing design | SHA/content unchanged |
| `docs/damage_curves/damage_curve_implementation/.../00_global_method/hazard_modeling_handoff/` | Contract/handoff docs | Current Hazard M2/M3 handoff notes | `docs/contracts/hazard_handoff/` | Index first | Cross-repo consumer guidance should be easy to find | Links to Hazard handoff notes resolve |
| `docs/damage_curves/damage_curve_implementation/.../00_global_method/runtime_helpers/` | Helper scripts | Reference snippets, not stable API | future `scripts/` or retained as reference helpers | Index only for now | Do not imply stable package/API before `src/` is justified | No `src/`; helper files unchanged |
| `docs/damage_curves/damage_curve_implementation/.../01_cells/hail_solar/current/` | Current cell docs/artifacts | Authoritative current hail x solar package | `docs/cells/hail_solar/` | Create shallow index first | Current cell should be one click away; artifacts remain in place for now | Index points to JSON, dossier, workbook, metadata, memo |
| `docs/damage_curves/damage_curve_implementation/.../01_cells/flood_solar/current/` | Current cell docs/artifacts | Authoritative current flood x solar package | `docs/cells/flood_solar/` | Create shallow index first | Same as above | Index points to JSON, dossier, workbook, metadata, memo |
| `docs/damage_curves/damage_curve_implementation/.../01_cells/wind_tornado_wind/current/` | Current cell docs/artifacts | Authoritative current wind/tornado x wind package | `docs/cells/wind_tornado_wind/` | Create shallow index first | Same as above | Index points to JSON, dossier, workbook, metadata, memo |
| `docs/damage_curves/damage_curve_implementation/.../01_cells/strong_wind_solar/current/` | Current cell docs/artifacts | Authoritative current strong wind x solar package | `docs/cells/strong_wind_solar/` | Create shallow index first | Same as above | Index points to JSON, dossier, workbook, metadata |
| `docs/damage_curves/damage_curve_implementation/.../01_cells/*/archive/` | Cell archive | Historical cell packages | `docs/source_drops/` or `docs/extra/archive/` later | Archive-only; do not move in first pass | Historical packages preserve provenance but are not current navigation | Archive references still reachable |
| `docs/damage_curves/damage_curve_implementation/.../01_cells/*/previews/` | Cell preview assets | Supporting visuals | Stay with current source until index/move policy exists | Index only if useful | Moving images can break docs silently | Image links render/resolve |
| `docs/damage_curves/damage_curve_implementation/.../02_evidence_ingestion/` | Evidence protocol/register | Current standard-16 evidence ingestion memos/register | `docs/evidence/` plus cell indexes | Index first | Cross-cell evidence machinery is top-level; memos should also be visible from cells | Register/memos linked from evidence and cell pages |
| `docs/extra/discussion/evidence_harvest/` | Discussion/history | Stage A/B evidence-harvest discussion and triage | `docs/extra/discussion/` | Keep | This is reasoning history, not current canonical cell docs | Existing links preserved |
| `docs/damage_curves/damage_curve_implementation/.../99_source_context/` | Source context | Copied source context bundled with v2.5 | `docs/source_drops/` or retained inside archived deliverable | Archive/source material; no first-pass move | This is provenance support for the deliverable | Preserve full contents |
| `docs/google_drive_docs/` | Raw/source docs | Local Drive copies and summaries | `docs/source_drops/google_drive_docs/` later | Keep for now | Source material; may have external source-of-truth implications | No docx edits/moves until source policy |
| `docs/presentations/` | Presentation artifacts | Presentation outputs; currently dirty worktree | `docs/source_drops/` or `docs/presentations/` after policy | Out of scope now | Existing changes predate IA work | Do not touch unless requested |
| `docs/extra/discussion/archive/` | Archive/history | Superseded discussion docs | `docs/extra/archive/` or keep | Keep | Already correctly outside canonical docs | Links preserved |
| `docs/extra/tasks_history/` | Task history | Session handoffs | `docs/extra/tasks_history/` | Keep | Existing house convention | Handoff links preserved |
| `notebooks/hail/solar/` | Notebook companions | Current runnable companion notebooks for hail_solar | `notebooks/hail/solar/` | Keep; link from cell index | Not docs canonical; useful QA/runtime walkthrough | Notebook paths linked |
| `notebooks/flood/solar/` | Notebook companions | Current runnable companion notebooks for flood_solar | `notebooks/flood/solar/` | Keep; link from cell index | Same as above | Notebook paths linked |
| `data/README.md` | Data docs | Currently says JSON is future; partly stale after v2.5 | `data/README.md` | Update later, not in first IA pass | Needs separate artifact-storage decision | Align only after runtime storage policy |
| `.github/workflows/` | CI surface | Empty directory | future CI plan | Out of scope | No current workflow to normalize | None |

## Current cells to expose first

Create index-only pages for these cells before any file moves:

| Cell | Model/docs | Canonical JSON path |
|---|---|---|
| `hail_solar` | model v1.0 / docs r5 | `docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/hail_solar/current/hail_solar__model_v1_0__docs_r5__curve_artifact.json` |
| `flood_solar` | model v1.0 / docs r3 | `docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/flood_solar/current/flood_solar__model_v1_0__docs_r3__curve_artifact.json` |
| `wind_tornado_wind` | model v1.0 / docs r3 | `docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/wind_tornado_wind/current/wind_tornado_wind__model_v1_0__docs_r3__curve_artifact.json` |
| `strong_wind_solar` | model v1.0 / docs r2 | `docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/strong_wind_solar/current/strong_wind_solar__model_v1_0__docs_r2__curve_artifact.json` |

## Phase 3 execution rule

The next safe execution step is to create shallow index pages only:

```text
docs/cells/README.md
docs/cells/<cell>/README.md
docs/contracts/README.md
docs/method/README.md
docs/evidence/README.md
docs/scope/README.md
docs/source_drops/README.md
```

Those pages should point to the current authoritative files listed above. They should not move artifacts,
rewrite schemas, or duplicate detailed evidence.
