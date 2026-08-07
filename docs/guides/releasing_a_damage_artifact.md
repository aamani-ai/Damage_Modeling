<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-08-06
updated: 2026-08-06
status: active
scope: The operating runbook — how a damage artifact travels from authored docs to the governed GCS namespace to its consumers: the release steps, the promotion path, status transitions, verification, and what this repo never touches.
-->

# Releasing a damage artifact — the operating runbook

The **steps** twin of standards [20](../contracts/standards/20_machine_readable_artifact_standard.md) /
[23](../contracts/standards/23_durable_publication_standard.md) /
[24](../contracts/standards/24_asset_to_artifact_mapping_standard.md) (which own the *definitions*). Run this
every time a cell's artifact changes — a new cell, a docs revision, a model version, a schema version.

## 0 · The one-screen picture — three hands, one artifact

```text
 THIS REPO (author + publish)          GCS (distribution truth)            CONSUMERS (register + load)
 docs/cells/<cell>/current/            damage_artifacts/<env>/             Hazard_modeling:
   artifact + KATs + changelog   ──▶     <cell_id>/<version_tag>/    ──▶     registrar → damage_artifact_ref
 machine_readable_artifact_index         files… + manifest.json LAST         (dev DB pointer rows)
 src/damage_modeling/publishing          _schemas/ (per schema ver)          loader → SHA → schema → KATs
 (`damage-publish`)                                                          → compose (standard 24)
```

**This repo NEVER touches the platform database.** That is the seam split (standard 23 §5), on purpose: no DB
credentials live here; registry rows are written by the consumer's registrar from the published manifests
(each manifest embeds its own `registry_row`, so registration is a read of published truth). If a task seems
to need this repo writing Postgres, the task is mis-assigned — route it through Hazard's
[db-asks register](../../Hazard_modeling/docs/plans/_cross_cutting/db_asks.md) (via the symlink).

## 1 · Author the revision (unchanged rules)

Standard 20 governs authoring: edit under `docs/cells/<cell>/current/`, bump `documentation_revision` (or the
semantic model version for physics changes), keep KATs/changelog beside the artifact, keep the parameter-tier
table honest. Then update **the index** — `docs/contracts/machine_readable_artifact_index.json`: the entry's
`documentation_revision`, `path`, and **recomputed `sha256`** (the pin the whole chain trusts):

```bash
shasum -a 256 docs/cells/<cell>/current/<artifact>.json   # → the index's sha256 field
```

## 2 · Plan (offline, fail-closed) — always before run

```bash
.venv/bin/damage-publish plan            # all cells   (add --cell <cell_id> for one)
```

Every gate that can fail offline fails here: file presence · **recomputed SHA == index SHA** · JSON-Schema
validation (with the cross-`$ref` sibling registry) · KAT/changelog resolution. A `FAIL` line means the
*repo* is inconsistent — fix the authoring or the index; never the publisher.

## 3 · Run — create-only, manifest LAST

```bash
.venv/bin/damage-publish run             # or --cell <cell_id> · --env dev · --bucket …
.venv/bin/damage-publish schemas         # only when a NEW schema version joins _schemas/
```

What it does (standard 23 §3): absent-prefix preflight → create-only uploads → remote SHA re-verification →
`manifest.json` last → a local receipt in `outputs/publications/`. **A new revision is a NEW prefix**
(`model_v1_0__docs_r8/` beside `…docs_r7/`); an existing prefix is immutable — a collision is a stop, never
an overwrite, and a partial prefix is fixed forward by the next revision, never by deletion.

Auth: Application Default Credentials (`gcloud auth application-default login`) or the gcloud CLI login —
the publisher uses the Python client.

## 4 · Hand to the consumer (and what they will do to your bytes)

Tell Hazard a release landed (or they poll). Their side, so you know what your artifact must survive:

```bash
# in Hazard_modeling:
.venv/bin/python scripts/governance/register_damage_artifacts.py --dry-run   # then real
```

- the **registrar** reads each `manifest.json` → upserts `damage_artifact_ref` (id · version · sha · uri ·
  status) — pointers only;
- the **loader** (per run) re-verifies your SHA, validates against the *published* schema, and **executes
  your runtime KATs at 1e-12** — a KAT that doesn't hold against your own artifact stops every consumer run;
- **status transitions are deliberate** (standard 23 §6): the consumer moves the prior version to
  `superseded` as a release decision — never assume it happens automatically, and never re-point an old
  version's row;
- since DD-G20 (Hazard), **every future cut — CONUS grid and deep — consumes registry-fed**: your release
  is the only path new science runs will read.

## 5 · Promotion — `proposed` → canonical (the hurricane case)

A proposed artifact (`canonical_runtime_artifact: false`, e.g. the tropical-cyclone solar curve) is **not in
the index and must not be published** — the namespace never gets ahead of curation. Promotion is: the
curation decision here → flip the artifact's canonical/promotion fields → add the index entry (+SHA) → §2–§4.
Consumers that knowingly consumed the proposed artifact (hurricane's grid cut did, by recorded owner
decision) re-pin at their next versioned rerun.

## 6 · Never do

- rewrite or delete anything under a published prefix (immutability is the product);
- publish a cell whose recomputed SHA ≠ index SHA "because it's obviously fine";
- rename manifest fields or move files within a publication layout without a schema-version step —
  the consumer loader treats your layout as a contract;
- weld new value/dollar content into physics artifacts (the two-axis rule, standard 24 §5 — the format-v3
  split is the sanctioned direction);
- touch the platform database from this repo, for anything.

## 7 · Verify a release end-to-end (60 seconds)

```bash
gcloud storage ls gs://infrasure-benchmark/damage_artifacts/dev/<cell_id>/<version_tag>/
#   expect: your files + manifest.json (its presence = publication complete)
.venv/bin/python -m pytest tests -q          # the offline gates still green
# consumer side (Hazard): registrar --dry-run lists your new row; their loader smoke passes
```
