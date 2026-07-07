# Source Drop Ingestion Guide

Use this guide whenever a new ZIP, deep-research bundle, Drive export, or other source drop is added to this
repo.

The goal is to preserve provenance without creating duplicate canonical docs.

## Flow

```text
new source ZIP
  |
  v
docs/source_drops/raw_zips/
  |
  |  preserve original upload unchanged
  |
  +------------------------------+
  |                              |
  v                              v
docs/source_drops/extracted/     audit / inventory
  <drop_id>/                     .tmp/source_drop_ingest/<drop_id>/
  local mirror only              hashes, file list, duplicate checks
  gitignored
  |
  v
classification + move plan
  |
  +--> exact duplicate        -> do not move
  +--> changed duplicate      -> compare manually
  +--> canonical docs         -> promote to docs/method, docs/contracts, docs/cells, docs/evidence
  +--> source context only    -> docs/source_drops/context/<drop_id>/
  +--> source manifest notes  -> docs/source_drops/manifests/<drop_id>/
  +--> helper scripts         -> scripts/reference_helpers/
  +--> runtime/data artifacts -> defer until publishing/storage/loading design is decided
```

## Directory Roles

```text
docs/source_drops/
  raw_zips/
    <drop>.zip                  # original provenance; do not edit

  extracted/
    <drop_id>/                  # optional local source mirror; ignored by Git

  manifests/
    <drop_id>/                  # checksums, audit notes, source-package metadata

  context/
    <drop_id>/                  # reviewed source context worth inspecting directly

canonical repo docs:
  docs/scope/                   # scope/story and repo boundary
  docs/method/                  # foundations, standards, method support
  docs/contracts/               # Hazard-facing contracts, schemas, handoff
  docs/cells/<cell>/            # current cell packages and cell-owned evidence
  docs/evidence/                # cross-cell evidence protocol/register only
  scripts/reference_helpers/    # helper scripts; not stable src/API
```

## Rule

```text
raw_zips/   = permanent provenance
extracted/  = optional local inspection/staging mirror
canonical/  = only promoted, reviewed material
```

An extracted folder is allowed. It is wrong only when it becomes a second current-docs tree or hides broken
links.

## Required Steps

1. Save the untouched ZIP under `docs/source_drops/raw_zips/`, or record an external location in a manifest if
   the ZIP is too large for Git.
2. Add or update a manifest under `docs/source_drops/manifests/`.
3. Extract locally only when useful:

```bash
mkdir -p docs/source_drops/extracted/<drop_id>
unzip -q docs/source_drops/raw_zips/<drop>.zip -d docs/source_drops/extracted/<drop_id>
```

4. Run an inventory/hash audit before moving files. If the local `source-drop-ingestor` Codex skill is
   installed, use its `source_drop_audit.py` helper:

```bash
python3 /Users/divy/.codex/skills/source-drop-ingestor/scripts/source_drop_audit.py \
  --zip docs/source_drops/raw_zips/<drop>.zip \
  --repo . \
  --out .tmp/source_drop_ingest/<drop_id>
```

5. Classify each important file:

| Classification | Action |
|---|---|
| exact duplicate | Do not copy again. |
| drifted duplicate | Compare content and decide explicitly. |
| canonical method/contract/cell/evidence doc | Promote into the correct canonical docs folder. |
| source/provenance context | Keep under `docs/source_drops/context/<drop_id>/`. |
| package manifest/validation note | Keep under `docs/source_drops/manifests/<drop_id>/`. |
| helper script | Keep under `scripts/reference_helpers/` unless runtime API is approved. |
| runtime/data/hazard artifact | Defer until storage/versioning/loading design exists. |
| ambiguous | Leave staged and record an open question. |

6. Write a move plan before editing:

```text
source path | target path | action | reason | evidence
```

7. Move only reviewed material into canonical folders.
8. Update local links, manifests, and artifact indexes when relevant.
9. Validate before committing.

## Validation

Run from the repo root:

```bash
python3.12 - <<'PY'
from pathlib import Path
import re, sys
missing = []
for f in Path('docs').rglob('*.md'):
    posix = f.as_posix()
    if posix.startswith('docs/source_drops/extracted/') and f.name != 'README.md':
        continue
    text = f.read_text(errors='ignore')
    for m in re.finditer(r'\[[^\]]+\]\(([^)]+)\)', text):
        href = m.group(1).split('#', 1)[0]
        if not href or '://' in href or href.startswith('mailto:'):
            continue
        if not (f.parent / href).exists():
            missing.append((str(f), href))
if missing:
    for row in missing[:100]:
        print('MISSING', row)
    sys.exit(1)
print('markdown local links ok')
PY
```

If `docs/contracts/machine_readable_artifact_index.json` is touched or artifact paths change, verify JSON
hashes:

```bash
python3.12 - <<'PY'
from pathlib import Path
import hashlib, json, sys
idx = json.loads(Path('docs/contracts/machine_readable_artifact_index.json').read_text())
for art in idx['artifacts']:
    p = Path(art['path'])
    h = hashlib.sha256(p.read_bytes()).hexdigest()
    if h != art['sha256']:
        print('HASH MISMATCH', p, art['sha256'], h)
        sys.exit(1)
print('canonical JSON hashes ok')
PY
```

Check guardrails:

```bash
find . -maxdepth 3 -type d -name src -print
git status --short
git diff --cached --name-only
```

## Large Hazard/Data Drops

Do not use the docs-ZIP promotion flow for large hazard/data drops.

```text
large hazard/data ZIP
  |
  v
preserve raw or external storage
  |
  v
manifest + checksum + inventory
  |
  v
storage/versioning/loading decision
  |
  v
only then decide what belongs in Git, cloud storage, data/, notebooks/, or docs/
```

Use manifest-first when a drop is large, has many files, contains geospatial/model-output formats, or lacks a
clear repo storage/runtime design.
