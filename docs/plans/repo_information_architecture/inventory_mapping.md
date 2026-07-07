# Repo Information Architecture — Inventory Mapping

Status: current-state inventory after removing the old `docs/damage_curves/` tree and promoting the v2.5
package contents into role-based folders.

## Current Canonical Layout

| Current path / group | Role | Authority status | Notes |
|---|---|---|---|
| `docs/scope/SCOPE_AND_STORY.md` | Scope docs | Canonical | Repo boundary, phase arc, and Hazard contract story. |
| `docs/method/foundations/` | Method foundations | Canonical | P1-P3, six question docs, and assembled-curve-record spec. |
| `docs/method/standards/` | Method standards | Canonical docs | General standards from the v2.5 package. |
| `docs/method/templates/` | Method templates | Canonical templates | Cell README, dossier, metadata, review, evidence memo, and workbook manifest templates. |
| `docs/method/value_basis/` | Value-basis support | Canonical method support | Supporting evaluation guide and solar/wind value-basis workbook. |
| `docs/contracts/standards/` | Hazard-facing standards | Canonical contracts | Damage-code interface, versioning, machine-readable artifact, and capability/cap-binding standards. |
| `docs/contracts/schemas/` | JSON schemas | Canonical contracts | Schemas are moved but runtime publishing/storage remains undecided. |
| `docs/contracts/hazard_handoff/` | Hazard handoff | Canonical contracts | M2/M3 handoff notes. |
| `docs/contracts/machine_readable_artifact_index.json` | Runtime artifact index | Canonical in repo | Paths now point to `docs/cells/...`; cloud/bucket publication is still deferred. |
| `docs/cells/<cell>/current/` | Current cell package | Canonical current cell docs/artifacts | Four current cells: hail_solar, flood_solar, wind_tornado_wind, strong_wind_solar. |
| `docs/cells/<cell>/archive/` | Cell archive | Historical cell packages | Retained with each cell so old model/docs revisions remain inspectable. |
| `docs/cells/<cell>/previews/` | Cell preview assets | Supporting visuals | Kept beside the relevant cell. |
| `docs/cells/VERSION_REGISTRY.md` | Cell version registry | Canonical current registry | Package version, cell model version, and docs revision tracking. |
| `docs/evidence/ingestion/` | Cross-cell evidence machinery | Canonical evidence protocol/register | Standard-16 co-curation README, evidence register, and update memos. |
| `scripts/reference_helpers/` | Helper scripts | Reference only | Not a stable package API and not `src/`. |
| `docs/source_drops/raw_zips/` | Raw source drops | Original provenance | Untouched v2.5 ZIP lives here. |
| `docs/source_drops/extracted/` | Local extracted source mirrors | Staging/source mirror only | Contents are gitignored by default; use for inspection/comparison, not canonical navigation. |
| `docs/source_drops/manifests/` | Source-drop manifests | Provenance docs | ZIP checksum and package-level source-drop metadata. |
| `docs/source_drops/context/v2_5/` | Source context | Directly useful source context | Context digest, valuation guide, and substrate decomposition from v2.5. |

## Removed Duplicate Trees

| Removed path | Why removed |
|---|---|
| `docs/damage_curves/` | Replaced by direct links to `docs/scope/`, `docs/method/`, `docs/contracts/`, `docs/cells/`, and `docs/evidence/`. No compatibility stubs remain. |
| tracked `docs/source_drops/extracted/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/` contents | The opened folder was useful for comparison, but tracking the whole extraction would be a second navigation tree. Useful contents were promoted; raw ZIP remains provenance; ignored local extraction is allowed. |

## Current Cells

| Cell | Model/docs | Canonical JSON path |
|---|---|---|
| `hail_solar` | model v1.0 / docs r5 | `docs/cells/hail_solar/current/hail_solar__model_v1_0__docs_r5__curve_artifact.json` |
| `flood_solar` | model v1.0 / docs r3 | `docs/cells/flood_solar/current/flood_solar__model_v1_0__docs_r3__curve_artifact.json` |
| `wind_tornado_wind` | model v1.0 / docs r3 | `docs/cells/wind_tornado_wind/current/wind_tornado_wind__model_v1_0__docs_r3__curve_artifact.json` |
| `strong_wind_solar` | model v1.0 / docs r2 | `docs/cells/strong_wind_solar/current/strong_wind_solar__model_v1_0__docs_r2__curve_artifact.json` |

## Still Deferred

Do not create `src/`, move runtime JSON into `data/`, decide cloud bucket paths, or change Hazard loading
contracts until the runtime publishing plan is written.
