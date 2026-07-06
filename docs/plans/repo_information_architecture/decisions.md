# Repo Information Architecture — Decisions Log

Running record of non-obvious design decisions for the repo information-architecture workstream.

---

## IA-D6 · Source drops are a real landing zone, not current docs

**Date:** 2026-07-06 · **Status:** decided.

**Context.** The repo contains a large v2.5 deliverable bundle and may receive raw ZIP/deep-research uploads.
Those materials are valuable, but they should not become the reader's main path for current cells or Hazard
contracts.

**Decision.** Use `docs/source_drops/` as the source-material landing zone:

```text
docs/source_drops/raw_zips/   -> untouched ZIPs/original uploads
docs/source_drops/extracted/  -> extracted review copies
docs/source_drops/manifests/  -> source-drop indexes/checksums/provenance
```

The existing v2.5 bundle stays where it is until a reviewed migration maps its mixed contents. Current docs
should be surfaced through `docs/cells/`, `docs/contracts/`, `docs/method/`, `docs/evidence/`, and
`docs/scope/`; raw source drops should preserve provenance, not define navigation.

**Why.** A source drop is input evidence. It is not automatically canonical documentation, and it is not a
runtime package contract.

**Revisit trigger.** When the first raw ZIP/source upload is accepted into the repo, create a manifest entry
and decide whether the binary belongs in git or external storage.

---

## IA-D5 · Phase 4 starts with a reviewed scope-anchor move only

**Date:** 2026-07-06 · **Status:** executed for Batch 4A/4B; deeper moves deferred.

**Context.** The shallow docs surfaces now exist and point to current authoritative files. The next possible
step is file movement, but moving foundations, contracts, schemas, or cell packages can damage provenance or
imply runtime-contract changes.

**Decision.** The first migration batch moves only the repo-level scope anchor, with a compatibility stub at
the old path and full link/hash verification. The old `damage_curves/README.md` becomes a compatibility index.
Method docs, contracts, schemas, cell packages, source drops, notebooks, and helper code stay in place.

**Why.** This tests the redirect/link-check pattern on the lowest-risk canonical doc before touching any
package-bound or runtime-adjacent material.

**Revisit trigger.** After Batch 4A and 4B pass, decide whether method docs should move or remain index-only.

---

## IA-D4 · Planning lives in docs/plans before migration

**Date:** 2026-07-06 · **Status:** decided.

**Context.** The first discussion note established the target architecture and the no-migration rule, but the
user wants the Hazard-style workflow: discussion -> detailed plan -> execution.

**Decision.** Create `docs/plans/repo_information_architecture/` as the planning home before moving files.
This folder owns the plan-of-record, assumptions, and decisions for the migration.

**Why.** The repo has high provenance value. A planning layer prevents a clean-looking restructure from
destroying source context or changing runtime meaning.

**Revisit trigger.** Once the information architecture migration is complete, archive or mark this plan as
complete and write a task-history handoff.

---

## IA-D3 · Runtime publishing decisions are outside this restructure

**Date:** 2026-07-06 · **Status:** decided.

**Context.** The repo has canonical JSON artifacts, but the durable cloud bucket layout, publishing/versioning
flow, and Hazard loading path are not designed yet.

**Decision.** Do not move JSON artifacts into `data/`, do not create cloud-facing folder contracts, and do not
promote helper code to package code as part of docs information architecture.

**Why.** Runtime storage is a system contract with Hazard. It should be designed once, explicitly, not
implied by a docs cleanup.

**Revisit trigger.** Start a separate plan when cloud artifact publishing and Hazard loading are ready to be
specified.

---

## IA-D2 · Contracts are top-level; detailed evidence is cell-owned

**Date:** 2026-07-06 · **Status:** decided.

**Context.** The first proposed layout had both `contracts/` and `evidence/` as possible first-class docs
areas. The user asked whether that was actually right.

**Decision.** Use a hybrid model:

```text
docs/contracts/  -> repo-level consumer seam
docs/evidence/   -> cross-cell ingestion protocol/register only
docs/cells/*     -> detailed cell-specific evidence and proof trail
```

**Why.** Contracts are shared promises consumed by Hazard M3 across cells. Evidence is meaningful only when
attached to the curve parameter, caveat, assumption, and cell version it supports.

**Revisit trigger.** If a future evidence system becomes a real database or registry with stable IDs, revisit
whether more evidence material should move out of cell docs.

---

## IA-D1 · No src/ until there is a stable Hazard-consumable API

**Date:** 2026-07-06 · **Status:** decided.

**Context.** v2.5 includes helper `.py` files, but they are reference snippets that clarify the runtime
contract. The real continuous process still depends on decisions about cloud buckets, artifact publishing,
version pinning, and Hazard loading.

**Decision.** Do not create `src/` in this repo until there is a stable importable library/API that Hazard can
depend on.

**Why.** `src/` would communicate a production API boundary that is not yet designed. Premature package shape
would create coupling and likely need to be undone.

**Revisit trigger.** When the cloud artifact publishing path and Hazard consumer contract are specified,
decide whether this repo publishes code, data, or both.
