# Machine-readable registries

Registries are the library's table of contents for code.

## Required registries

```text
VERSION_REGISTRY.md                         human-readable semantic state
machine_readable_artifact_index.json        canonical runtime JSON pointers
cell_registry.json or equivalent            machine-readable cell status
changed-files manifest                      release audit
```

## Cell registry minimum

```json
{
  "cell_id": "hail_solar",
  "status": "released_v1_0",
  "canonical": true,
  "semantic_damage_model_version": "model v1.0",
  "documentation_revision": "docs r5",
  "artifact_schema_version": "damage_curve_record_bundle.vN",
  "artifact_sha256": "<sha256>",
  "pathway_ids": ["<pathway_id>"],
  "current_artifact_path": "01_cells/hail_solar/current/hail_solar__model_v1_0__docs_r5__curve_artifact.json",
  "first_introduced_package": "library v1.3",
  "last_updated_package": "library v2.5",
  "notes": "Current filenames may carry legacy labels; registry and JSON artifact are authoritative."
}
```

## Rule

If code should consume it, put it in JSON. If humans need to review it, also write Markdown.

For every canonical consumer handoff, verify an exact tuple rather than a package label alone:

```text
cell_id + semantic_damage_model_version + documentation_revision +
artifact_schema_version + artifact_sha256
```

For multi-pathway cells, the registry/index must enumerate released pathway IDs. A neighboring cell name is not a pathway alias, and a proposed pathway is not runtime-selectable until the canonical index contains it.
