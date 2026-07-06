# Repo Information Architecture Decision Note

Status: proposed target architecture, no migration yet.

This note records the first information-architecture decision for `damage_modeling`. It is a governance note
only. It does not move files, rename deliverables, create package code, change schemas, or decide cloud
storage.

## 1. Why this note exists

The repo currently carries a strong modeling system inside a delivery-package shaped file tree. That shape is
expected: the repo was spun out from `Hazard_modeling`, then deep-research and implementation deliverables
were integrated under `docs/`. The material is valuable, but the current navigation makes a reader dig through
versioned package folders to answer simple questions like:

```text
What is the current hail_solar curve?
What contract does Hazard M3 consume?
Which evidence supports this cell?
Which files are raw source material versus canonical working docs?
```

The target architecture should make current concepts shallow and obvious while preserving the full source
trail.

The current package directory
`docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/`
is therefore treated as an existing versioned deliverable bundle. It may contain current implementation
records, source context, schemas, helper scripts, and packaged evidence material, but it is not the target
navigation layer for the repo. This note does not reclassify or move it; a later migration plan must decide
which parts become canonical docs, which stay as source/provenance material, and which remain runtime
artifacts.

## 2. Locked rule for src/

`src/` should mean "this is now a stable importable library/API that Hazard can depend on." We are not there
until the cloud bucket layout, artifact publishing/versioning, Hazard loading path, and repo responsibility
for code vs data are decided.

Do not create or promote `src/` for the current helper files. The current Python helper files are reference
implementations that clarify the contract. They should remain reference/scripts material until the runtime
publishing path is designed.

## 3. Architecture decision

Use a hybrid documentation architecture.

```text
repo-level contracts
  because Hazard consumes the same seam across cells

cell-level evidence
  because detailed evidence only makes sense against a specific hazard x asset curve

top-level evidence protocol/register
  because standard-16 ingestion is shared across cells
```

### Contracts are first-class docs

Contracts should be easy to find from the docs root because they define the shared seam between this repo and
consumers such as `Hazard_modeling` M3:

```text
damage_code emit object
machine-readable artifact schema
capability declaration
cap-binding preflight rule
version pinning expectations
Hazard M3 handoff notes
```

These are not owned by a single cell. They are repo-level promises.

### Evidence is mostly cell-owned

Detailed evidence should live with the cell it supports:

```text
hail_solar evidence        -> hail_solar cell docs
flood_solar evidence       -> flood_solar cell docs
wind_tornado_wind evidence -> wind_tornado_wind cell docs
```

Evidence is not just a bibliography. It is a source-to-parameter map, caveat list, assumption register, and
versioning decision for a specific curve. Pulling all detailed evidence into a central silo would separate it
from the curve it proves.

Only cross-cell evidence machinery should be top-level:

```text
standard-16 ingestion protocol
evidence ingestion register
evidence update memo template
shared evidence-tier definitions
```

## 4. Target docs layout

This is a target information architecture, not an immediate migration.

```text
docs/
  scope/                 # scope/story and repo boundary
  method/                # foundations, standards, modeling rules
  contracts/             # damage_code, artifact schema, capability, Hazard handoff
  cells/                 # shallow current human-readable cell pages
    hail_solar/
    flood_solar/
    wind_tornado_wind/
    strong_wind_solar/
  evidence/              # cross-cell protocol/register only
  source_drops/          # raw deep-research ZIPs / original uploads
  extra/                 # discussion, task history, archive
```

The future `docs/cells/` surface should be the easy entry point for current hazard x asset cells. It should
not force readers to navigate into versioned deliverable bundles just to understand the current model.

## 5. Artifact and source-material roles

Use these roles when deciding where future material belongs.

| Role | Meaning | Future home |
|---|---|---|
| Canonical docs | Stable explanation of scope, method, contracts, and current cells | `docs/scope/`, `docs/method/`, `docs/contracts/`, `docs/cells/` |
| Runtime artifacts | JSON artifacts consumers pin and load | Not decided; wait for cloud bucket and publishing design |
| Derivation workbooks | Human audit/derivation views, not the runtime contract | Cell package or archival derivation area |
| Raw source drops | Deep-research ZIPs, uploaded bundles, original context | `docs/source_drops/` or a future source archive |
| Discussion/history | Thinking, triage, decisions, handoffs, superseded docs | `docs/extra/` |
| Helper scripts | Reference validation/evaluation utilities, not stable API | `scripts/` or package-local reference helpers until `src/` is justified |
| Future src | Stable importable library/API depended on by Hazard | Deferred |

## 6. No migration yet

This note intentionally does not authorize a file migration.

Do not do any of the following as part of this first step:

```text
move or rename existing deliverable files
create src/
move JSON artifacts into data/
decide cloud bucket structure
change schemas
change curve artifacts
change notebooks
change runtime behavior
```

The next step should be a migration plan with a mapping table, redirects/indexes, and verification checks.
That plan should preserve provenance and distinguish current canonical material from raw source material.
