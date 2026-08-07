<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-08-06
updated: 2026-08-06
status: active
scope: Folder index — the operating manual tier: the repeatable procedures for running this repo's connected machinery (GCS publication, consumer handshakes), paired with the standards that define the words.
-->

# docs/guides/ — the operating manual

**The STEPS tier.** Standards ([`contracts/standards/`](../contracts/standards/)) define what each word
commits us to; a guide says what you actually *run*. The pairing rule is inherited from the Hazard repo's
doctrine: never collapse the two — a standard with no guide is unrunnable, a guide with no standard is
ungoverned.

| # | Date | Created by | Related to | Guide | Pairs with | What you run it for |
|---|---|---|---|---|---|---|
| 1 | 2026-08-06 | owner-directed (Divy) · agent-drafted | — | [`releasing_a_damage_artifact.md`](releasing_a_damage_artifact.md) | standards 20 · 23 · 24 | any artifact change: author → index+SHA → `damage-publish plan`/`run` → consumer handshake (registrar/loader/KATs) → promotion (`proposed`→canonical) → the never-do list. Includes the seam rule: **this repo never touches the platform database** |

Connected machinery this tier documents: the `damage-publish` CLI (`src/damage_modeling/publishing/`), the
GCS namespace `gs://infrasure-benchmark/damage_artifacts/<env>/…`, and the consumer side in
`Hazard_modeling` (registrar → `damage_artifact_ref` on the dev DB → the deep loader). The dev database
itself is deliberately out of this repo's reach — see the guide's §0.
