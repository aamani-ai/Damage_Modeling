# Task Context — repo information architecture planning and shallow navigation

## Objective

Turn the repo information-architecture discussion into a Hazard-style planning workflow, then execute the
low-risk navigation improvements without losing provenance or implying runtime/package stability.

## Background

The repo had strong modeling architecture but weak file architecture: current cells, contracts, and method
docs were buried under the versioned v2.5 deliverable tree. The user explicitly wanted a careful sequence:

```text
discussion -> detailed plan in docs/plans -> execution
```

The user also wanted one rule preserved: `src/` should mean a stable importable library/API that
`Hazard_modeling` can depend on. The repo is not there until cloud bucket layout, artifact publishing,
version pinning, Hazard loading, and code/data responsibility are decided.

## Constraints

- Preserve source/provenance material.
- Do not move runtime artifacts, schemas, notebooks, helper code, workbooks, or cell packages.
- Do not create `src/`.
- Keep detailed evidence cell-owned; keep only cross-cell evidence machinery top-level.
- Treat existing `docs/presentations/` dirty files as out of scope.
