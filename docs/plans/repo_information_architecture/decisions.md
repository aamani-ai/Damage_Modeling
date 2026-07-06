# Repo Information Architecture — Decisions Log

Running record of non-obvious design decisions for the repo information-architecture workstream.

---

## IA-D9 · Remove duplicate implementation trees and promote v2.5 contents

**Date:** 2026-07-06 · **Status:** executed.

**Context.** The raw ZIP
`docs/source_drops/raw_zips/DOWNLOAD_THIS_damage_curve_library_v2_5_implementation_hardened.zip` and the
newly opened folder under `docs/source_drops/raw_zips/` were compared byte-for-byte: 139 files, 0 missing, 0
extra, 0 changed. The older tracked folder under
`docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/`
was not a clean extraction anymore: it had 6 generated `__pycache__` files and 24 edited markdown files.

**Decision.** Remove the old `docs/damage_curves/` tree and do not keep the opened ZIP as a second extraction
tree. Promote useful v2.5 contents into role-based homes:

```text
docs/method/standards/
docs/method/templates/
docs/contracts/standards/
docs/contracts/schemas/
docs/contracts/hazard_handoff/
docs/cells/
docs/evidence/ingestion/
scripts/reference_helpers/
docs/source_drops/context/v2_5/
docs/source_drops/manifests/v2_5_implementation_hardened/
```

Preserve the untouched ZIP at `docs/source_drops/raw_zips/`.

**Why.** A drifted duplicate under an "implementation" path incorrectly suggests canonical architecture.
Keeping a full opened extraction would also create a second navigation tree. The raw ZIP is provenance;
working docs live in `docs/scope/`, `docs/method/`, `docs/contracts/`, `docs/cells/`, and `docs/evidence/`.

**Revisit trigger.** Start a separate runtime-publishing plan before moving JSON artifacts into `data/`,
creating `src/`, or defining cloud/Hazard loading paths.

---

## IA-D8 · Foundations are canonical method docs

**Date:** 2026-07-06 · **Status:** executed.

**Context.** The foundation docs were still under `docs/damage_curves/damage_curve_foundations/`, even though
they are not source drops, discussion notes, or cell deliverables. They define durable modeling principles:
P1-P3, the six question docs, and the assembled-curve-record spec.

**Decision.** Move the canonical foundation docs to:

```text
docs/method/foundations/
```

Remove the old `docs/damage_curves/damage_curve_foundations/` path after links are rewritten. The copy inside
the raw v2.5 ZIP remains provenance source material.

**Why.** Foundations are method, not archive. Keeping them under `docs/method/` avoids double-counting and
keeps the durable reader path shallow.

**Revisit trigger.** None for docs placement. Runtime publication is separate.

---

## IA-D7 · Preserve the v2.5 ZIP, but move value-basis support to method

**Date:** 2026-07-06 · **Status:** decided.

**Context.** The original downloaded file is
`DOWNLOAD_THIS_damage_curve_library_v2_5_implementation_hardened.zip`. Its extracted root is
`DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/`. The extracted bundle is mixed: it contains
current cell packages, contracts, method standards, source context, schemas, helper scripts, and evidence
material.

Separately, `supporting_evaluation_guide.md` and `solar_wind_value_breakdown.xlsx` were sitting under
the old implementation staging area. They are not raw ZIP/source drops. They are value-basis method support.

**Decision.**

```text
docs/source_drops/raw_zips/
  DOWNLOAD_THIS_damage_curve_library_v2_5_implementation_hardened.zip

docs/source_drops/manifests/
  2026-07-06_v2_5_implementation_hardened_zip.md

docs/method/value_basis/
  supporting_evaluation_guide.md
  solar_wind_value_breakdown.xlsx
```

Do not keep the whole extracted v2.5 deliverable as a second tree. Preserve the raw ZIP and promote useful
files into canonical folders.

**Why.** The raw ZIP is provenance. The value-basis guide/workbook are reader-facing method support and should
be shallow under `docs/method/`.

**Revisit trigger.** If new raw source drops arrive, preserve originals first and promote only reviewed
contents into canonical folders.

---

## IA-D6 · Source drops are a real landing zone, not current docs

**Date:** 2026-07-06 · **Status:** decided.

**Context.** The repo contains a large v2.5 deliverable bundle and may receive raw ZIP/deep-research uploads.
Those materials are valuable, but they should not become the reader's main path for current cells or Hazard
contracts.

**Decision.** Use `docs/source_drops/` as the source-material landing zone:

```text
docs/source_drops/raw_zips/   -> untouched ZIPs/original uploads
docs/source_drops/manifests/  -> source-drop indexes/checksums/provenance
docs/source_drops/context/    -> reviewed source-context files worth inspecting directly
```

Current docs should be surfaced through `docs/cells/`, `docs/contracts/`, `docs/method/`, `docs/evidence/`,
and `docs/scope/`; raw source drops should preserve provenance, not define navigation.

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

**Decision.** Superseded by IA-D9. The final docs architecture removes `docs/damage_curves/` rather than
keeping compatibility stubs.

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
