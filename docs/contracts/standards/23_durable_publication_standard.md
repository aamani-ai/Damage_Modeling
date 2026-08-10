<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-08-06
updated: 2026-08-06
status: active
scope: Standard 23 — durable artifact publication: the governed GCS namespace, the write protocol, the publish→register→load seam split, progression semantics, and the src/ decision that supersedes the old no-src guardrail.
-->

# 23 · Durable artifact publication standard

**Status: active — implemented and first-exercised 2026-08-06** (all five canonical cells published).
Supersedes the "no durable object-store publishing" future-work notes in standard 20 §10 and the contracts
README guardrail (owner ruling 2026-08-06: the requirement now exists, so the machinery does too).

## 1 · Why this exists

Standard 20 made artifacts *machine-readable*; they remained **git files** — discoverable only with a repo
checkout, mutable by rebase, and unciteable by SHA from a runtime. Consumers (Hazard M3 today; Resiliency and
per-asset runs next) need artifacts that are **durable, immutable, SHA-addressable, and fetchable without this
repository**. This standard defines that layer. The repo stays the *authoring truth*; GCS becomes the
*distribution truth*; the two are pinned to each other by the index SHA.

## 2 · The address grammar

```
gs://infrasure-benchmark/damage_artifacts/<env>/<cell_id>/<version_tag>/
    curve_artifact.json          always
    known_answer_tests.json      when the cell has one
    changelog.json               when the cell has one
    manifest.json                LAST — the only completion marker
gs://infrasure-benchmark/damage_artifacts/<env>/_schemas/<schema_file>
    the bundle JSON-Schema, published once per schema version
```

- `env` — `dev` today; `prod` is a future promotion, never a copy-in-place.
- `cell_id` — the index's cell key (`hail_solar`, `flood_solar`, …).
- `version_tag` — the consumer pin's version half, URI-safe:
  `model v1.0` + `docs r7` → `model_v1_0__docs_r7`. **A publication prefix is immutable**: a new model
  version or docs revision is a **new prefix**; nothing is ever rewritten or deleted. (The pre-standard hail
  bundle at `hazard_conus_grid/dev/hail/solar/damage_curves/HAIL_SOLAR_PV_MODULE_V1@v2_5/` stays at its
  compatibility URI, untouched — the standing immutability doctrine.)

## 3 · The write protocol (fail-closed, in order)

Planning (offline, no network) must pass **every** gate before a byte moves:
1. the artifact file exists at the index's `path`;
2. its recomputed SHA-256 **equals the index `sha256`** (the pin is the truth; a mismatch is a stop);
3. the artifact **validates against its declared bundle schema**, with every library schema pre-registered
   under its `$id` (the bundles cross-`$ref` siblings);
4. KAT/changelog paths named by the index resolve.

Execution:
5. **absent-prefix preflight** — any existing object under the destination prefix is a hard stop (a partial
   prefix is unreadable; it is *never* auto-deleted or overwritten — fix forward with the next revision);
6. every object uploads **create-only** (`if_generation_match=0`);
7. every remote object's SHA is **re-downloaded and re-verified**;
8. `manifest.json` uploads **last** — its presence is the only "publication complete" signal;
9. a local **receipt** lands in `outputs/publications/<ts>_publication_receipt.json`.

## 4 · The manifest

`damage-artifact-publication-manifest/v1`: the full **consumer pin** (cell · model version · docs revision ·
schema version · sha256), per-file `{name, role, sha256, bytes, gcs_generation}`, source provenance (repo git
SHA + index contract revision), the write-protocol assertions, and — deliberately — the **`registry_row`**:
the exact values the consumer side writes into its `damage_artifact_ref` pointer table. Registration is a
*read of published truth*, never a re-derivation.

## 5 · The seam split — publish → register → load

| Act | Owner | Tool | Touches |
|---|---|---|---|
| **publish** | this repo (`damage_modeling`) | `damage-publish` (`src/damage_modeling/publishing/`) | GCS only — never any database |
| **register** | the consumer (`Hazard_modeling`) | `scripts/governance/register_damage_artifacts.py` | reads manifests → upserts `damage_artifact_ref` on the dev workspace DB (pointers only: id · version · sha · uri · status — **never bytes, never an evaluator**) |
| **load** | the consumer runtime | Hazard's damage loader (its CAP-2) | fetch by registry/pin → verify SHA → validate schema → run **physics** KATs → expose `damage_code()` |

This split keeps database credentials out of this repo, keeps curve bytes out of the database (the platform's
own default-value governance: methodology never lives in the DB), and makes each act independently re-runnable.

## 6 · Progression semantics — how versions move

The original five cells were deliberately published **at their different maturities** (r7 · r4 · r4 · r3 ·
r3). The 2026-08-08 flood_wind and wildfire_wind releases add bundle-v3 plans without altering those prefixes.
The progression path is:

1. Author the next revision in `docs/cells/<cell>/current/` (standard 20 rules unchanged).
2. Update the machine-readable index (new SHA, new docs revision) — the index remains the discovery truth.
3. `damage-publish plan` → `run` — a **new prefix** appears; the old prefix is untouched.
4. The consumer registers the new row (`status=active`) and — **deliberately, never automatically** — moves
   the prior row to `superseded`. A status transition is a release decision, not a side effect.
5. Consumers re-pin on their own schedule; the crowned Hazard grid, specifically, re-pins **only through a
   versioned rerun** (its consumption pin's own rule).

Schema-version progression (v2 → the pathway-aware v3 of standard 22) rides the same grammar: v3 artifacts
publish to new prefixes with the v3 schema in `_schemas/`, and v2-only consumers keep reading their pinned v2
prefixes unaffected.

## 7 · The `src/` decision (recorded)

The contracts README previously forbade `src/` "until the runtime publishing and Hazard loading path are
designed." Both are now designed (this standard + Hazard's loader contract), and the owner ruled 2026-08-06
that the guardrail is obsolete: **`src/damage_modeling/` is the home of runtime-facing machinery** — starting
with `publishing/` — packaged (`pyproject.toml`, console script `damage-publish`), offline-tested
(`tests/test_publisher_plan.py` runs every planning gate against the real index with no network), and
documented here. Authoring remains docs-first in `docs/cells/`; nothing in `src/` may alter an artifact.

## 8 · First-exercise record (2026-08-06)

All five canonical cells published to `damage_artifacts/dev/` in one release act (receipt in
`outputs/publications/`): `hail_solar@model_v1_0__docs_r7` · `flood_solar@model_v1_0__docs_r4` ·
`wind_tornado_wind@model_v1_0__docs_r4` · `strong_wind_solar@model_v1_0__docs_r3` ·
`wildfire_solar@model_v1_0__docs_r3`, plus `_schemas/curve_artifact_bundle.v2.schema.json`; five
`damage_artifact_ref` rows registered on the dev DB by the consumer registrar. Consumer-side governance:
Hazard's `docs/plans/_cross_cutting/db_asks.md` (H2) and its storage map §3.2.
