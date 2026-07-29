# Change classification — wildfire_wind model v0.1/docs r1

```yaml
change_class: NEW_CELL_SCAFFOLD
cell_id: wildfire_wind
semantic_model_version: model v0.1
documentation_revision: docs r1
runtime_change: false
schema_change: false
canonical_artifact_change: false
artifact_index_change: false
consumer_cutover: false
```

The repository had planning notes and a legacy three-curve placeholder, but no governed `wildfire_wind`
cell. This is therefore a new scaffold, not a docs-only update or a model-v1 release.

The evidence review supports scope, pathways, site fields, failure-unit anatomy, spatial grains, reference
value, and a promotion data program. It does not support any runtime economic ordinate. The correct semantic
version is model v0.1 with zero curve records. Repository presence does not authorize loading.

Trigger for model v1.0: at least one reviewed output-bearing failure-unit record must close the delivered
wildfire-load → inspected disposition → same-unit direct cost chain, pass current schemas/KATs, publish an
exact artifact pin, and receive deliberate consumer migration.
