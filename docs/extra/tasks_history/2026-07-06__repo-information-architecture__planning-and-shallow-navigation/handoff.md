# Handoff — repo information architecture

## Summary

The repo now has a proper discussion -> plan -> execution trail for information architecture. Current cells,
contracts, method, evidence protocol, source material, and scope are discoverable from shallow docs surfaces.
The v2.5 implementation package remains authoritative for runtime artifacts and proof trails, but raw
ZIP/deep-research source drops now have an explicit landing-zone shape under `docs/source_drops/`.

## Read first

- [`../../../plans/repo_information_architecture/README.md`](../../../plans/repo_information_architecture/README.md)
- [`../../../scope/SCOPE_AND_STORY.md`](../../../scope/SCOPE_AND_STORY.md)
- [`../../../cells/README.md`](../../../cells/README.md)
- [`../../../contracts/README.md`](../../../contracts/README.md)
- [`../../../source_drops/README.md`](../../../source_drops/README.md)
- [`../../../method/value_basis/README.md`](../../../method/value_basis/README.md)
- [`../../../source_drops/manifests/2026-07-06_v2_5_implementation_hardened_zip.md`](../../../source_drops/manifests/2026-07-06_v2_5_implementation_hardened_zip.md)
- [`../../../plans/repo_information_architecture/link_debt.md`](../../../plans/repo_information_architecture/link_debt.md)

## Next actions

1. Do not create `src/` until artifact publishing and Hazard loading are designed.
2. Do not move method docs, contracts, schemas, or cell packages without a file-level link map.
3. Run a dedicated link-normalization pass for the 131-link legacy baseline.
4. Keep `docs/damage_curves/SCOPE_AND_STORY.md` as a compatibility stub until downstream links are normalized.
5. When raw ZIP/deep-research drops are added, place originals under `docs/source_drops/raw_zips/` or record
   external storage in `docs/source_drops/manifests/`.
6. Keep value-basis method support under `docs/method/value_basis/`; do not bury it under extracted source
   drops.
7. Start a separate runtime artifact publishing plan when cloud bucket/versioning/Hazard loading decisions are ready.

## Current guardrails

```text
runtime artifacts stay in v2.5 package for now
schemas stay in v2.5 package for now
detailed evidence stays with cells
cross-cell evidence protocol is indexed at docs/evidence/
raw source drops go under docs/source_drops/raw_zips/ or manifests, not into canonical docs
value-basis guide/workbook live under docs/method/value_basis/
```
