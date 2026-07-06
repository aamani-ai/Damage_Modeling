# Handoff — repo information architecture

## Summary

The repo now has a proper discussion -> plan -> execution trail for information architecture. Current cells,
contracts, method, evidence protocol, source material, and scope are discoverable from shallow docs surfaces.
The v2.5 implementation package remains authoritative for runtime artifacts and proof trails.

## Read first

- [`../../../plans/repo_information_architecture/README.md`](../../../plans/repo_information_architecture/README.md)
- [`../../../scope/SCOPE_AND_STORY.md`](../../../scope/SCOPE_AND_STORY.md)
- [`../../../cells/README.md`](../../../cells/README.md)
- [`../../../contracts/README.md`](../../../contracts/README.md)
- [`../../../plans/repo_information_architecture/link_debt.md`](../../../plans/repo_information_architecture/link_debt.md)

## Next actions

1. Do not create `src/` until artifact publishing and Hazard loading are designed.
2. Do not move method docs, contracts, schemas, or cell packages without a file-level link map.
3. Run a dedicated link-normalization pass for the 131-link legacy baseline.
4. Keep `docs/damage_curves/SCOPE_AND_STORY.md` as a compatibility stub until downstream links are normalized.
5. Start a separate runtime artifact publishing plan when cloud bucket/versioning/Hazard loading decisions are ready.

## Current guardrails

```text
runtime artifacts stay in v2.5 package for now
schemas stay in v2.5 package for now
detailed evidence stays with cells
cross-cell evidence protocol is indexed at docs/evidence/
raw source drops are indexed, not promoted to canonical docs
```
