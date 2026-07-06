# Repo Information Architecture — Assumptions Register

Assumptions for the repo information-architecture workstream. Revisit these before file moves or runtime
artifact changes.

---

## IA-A1 · v2.5 ZIP is source-of-record; useful files are promoted

**Status:** active.

The untouched v2.5 ZIP is preserved at
`docs/source_drops/raw_zips/DOWNLOAD_THIS_damage_curve_library_v2_5_implementation_hardened.zip`.

The whole opened extraction is not kept as a second tree. Useful files were promoted into role-based folders.
The raw ZIP remains the provenance source.

## IA-A2 · JSON runtime artifacts are canonical, but storage/publishing is undecided

**Status:** active.

The v2.5 JSON files are the canonical runtime artifacts inside the repo today. Their durable publishing path
is not decided. Do not move them into `data/` or cloud-facing paths until bucket layout, version pinning,
artifact promotion, and Hazard loading are designed.

## IA-A3 · src/ is deferred

**Status:** active.

`src/` means a stable importable library/API that Hazard can depend on. Current helper `.py` files are
reference implementations, not the published API. They now live under `scripts/reference_helpers/`, but are
not promoted to `src/` under this workstream.

## IA-A4 · Evidence is cell-specific unless it is the ingestion machinery

**Status:** active.

Detailed evidence belongs with the cell it proves. Top-level evidence docs should hold shared ingestion
protocol, register, templates, and tier definitions only.

## IA-A5 · Raw source drops are preserved, not cleaned away

**Status:** active.

Deep-research ZIPs, Drive docs, original deliverable drops, and source context are source material. They may
be re-homed or indexed later, but must not be deleted or collapsed into summaries.

## IA-A6 · Existing presentation worktree changes are outside this workstream

**Status:** active.

Current dirty files under `docs/presentations/` predate this plan. Do not treat them as part of information
architecture execution unless the user explicitly asks.
