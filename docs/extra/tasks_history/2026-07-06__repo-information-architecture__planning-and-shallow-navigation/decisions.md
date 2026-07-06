# Decisions — repo information architecture

## 1. Hybrid docs architecture

Contracts are repo-level because Hazard consumes the same seam across cells. Detailed evidence remains
cell-owned because evidence proves a specific curve parameter, caveat, or assumption. Top-level evidence is
limited to shared ingestion protocol/register material.

## 2. No src/ yet

`src/` means stable importable library/API. Current helper `.py` files are reference implementations, not a
published package. Package/API promotion is deferred until the durable artifact publishing and Hazard loading
path is designed.

## 3. Start with index-only navigation

Before moving files, create shallow surfaces:

```text
docs/scope/
docs/cells/
docs/contracts/
docs/method/
docs/evidence/
docs/source_drops/
docs/plans/
```

These pages point to the current authoritative v2.5 files without moving them.

## 4. First file move is scope only

Move only the repo-level scope anchor to `docs/scope/SCOPE_AND_STORY.md`. Leave a compatibility stub at
`docs/damage_curves/SCOPE_AND_STORY.md`. Update the old `docs/damage_curves/README.md` into a compatibility
index.

## 5. Link debt is tracked, not hidden

A full-repo Markdown link check has existing debt from relocated/deep docs. Baseline captured:

```text
131 missing local Markdown links
```

IA work must not increase that count. Dedicated link normalization is separate future cleanup.
