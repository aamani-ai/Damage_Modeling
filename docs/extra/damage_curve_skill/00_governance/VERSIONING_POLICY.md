# Versioning policy

The library uses separate version streams.

```text
Package release version       = the whole zip/delivery bundle
Cell damage-model version     = runtime damage behavior for one hazard × asset pair
Cell documentation revision   = proof trail and explanation for that cell
Schema/artifact version       = machine contract version
Skill version                 = version of this operating manual when uploaded/changed
```

## Golden rule

```text
If the same inputs produce the same damage-code outputs, do not bump the cell damage-model version.
If the same inputs can produce different damage-code outputs, bump the cell damage-model version.
```

## Package release version

Bump when any shipped package content changes:

```text
- add or update a cell;
- add/update global method docs;
- add/update JSON artifacts or schemas;
- add/update helper code;
- add/update release notes, manifest, or registries;
- reorganize delivery structure.
```

A package version change does **not** necessarily mean any damage curve changed.

### Repository presence is not package promotion

A proposed/scaffold cell may be merged into the repository for transparent research and review without being included in the current runtime/package release. Use this convention in proposed artifacts and status blocks:

```yaml
package_release: unreleased
package_baseline: library vX.Y
package_inclusion_status: not_included
canonical_runtime_artifact: false
```

Meaning:

```text
package_release: no package has shipped this artifact;
package_baseline: the released library state against which it was researched;
package_inclusion_status: the artifact is not in the released runtime/package;
canonical_runtime_artifact: downstream runtime must not load it.
```

Merging a proposed folder to `main` improves traceability. It does not by itself bump the package, release a cell model, change runtime routing, or make a proposed artifact canonical. When a later package deliberately includes the cell, replace these fields through the release workflow and record the promotion.

## Cell damage-model version

Bump when runtime behavior changes, including:

```text
- failure-unit coverage affecting outputs;
- hazard x-axis semantics or unit conversions;
- curve form or parameters;
- state table ordinates;
- selector logic;
- conditioner logic;
- exposure logic;
- embedded value-concentration/capping logic;
- output field meanings.
```

### Major

Use when a conceptual or breaking change occurs:

```text
- y-axis changes from physical replacement DR to another loss basis;
- hazard-axis basis changes in a non-compatible way;
- cell splits/merges substantially;
- runtime interface breaks downstream assumptions.
- an implicit/boolean mechanism variant becomes a required first-class pathway contract;
- a combined cell is repartitioned into independently governed pathways or neighboring cells.
```

### Minor

Use when outputs change but the cell remains compatible:

```text
- new archetype or variant;
- revised D50 / R50 / threshold / cap;
- new failure-unit added while preserving old fields;
- improved selector/conditioner that changes results.
```

### Patch

Use for small corrections:

```text
- formula bug;
- unit-conversion correction;
- transcription error;
- implementation mismatch with dossier.
```

If a patch changes outputs, include old-vs-new numbers.

## Cell docs revision

Bump when explanation or auditability improves but outputs do not change:

```text
- evidence map improved;
- source-to-parameter table added;
- derivation rationale clarified;
- open seams/update triggers added;
- metadata fields explained;
- reviewer crosswalk improved.
```

## Schema/artifact version

Bump when machine contract changes:

```text
- required field added/removed;
- field meaning changes;
- enum values change in a way consumers must handle;
- emit object structure changes;
- capability declaration semantics change.
- `pathway_id` becomes required or changes meaning;
- pathway-specific axes, records, outputs, capability matrices, or KAT references become required.
```

A model and schema version may both bump in one delivery, but for different reasons. Record separate change events and prove whether the new pathway architecture changes numerical behavior. A skill revision that introduces this workflow does not itself bump either live version stream.

## Skill version

Do not put a package version in the folder name. If the skill itself changes, update `SKILL_CHANGELOG.md`. When uploaded to a platform that versions skills, the upload/version pointer is separate from all damage-library versions.
