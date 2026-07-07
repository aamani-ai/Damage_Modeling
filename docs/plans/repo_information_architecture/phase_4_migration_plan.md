# Repo Information Architecture — Migration Record

Status: executed for docs information architecture. Runtime publishing remains deferred.

## What Moved

| From | To |
|---|---|
| `docs/damage_curves/SCOPE_AND_STORY.md` | `docs/scope/SCOPE_AND_STORY.md` |
| `docs/damage_curves/damage_curve_foundations/` | `docs/method/foundations/` |
| v2.5 `00_global_method/` method standards | `docs/method/standards/` |
| v2.5 contract/version/artifact/capability standards | `docs/contracts/standards/` |
| v2.5 templates | `docs/method/templates/` |
| v2.5 schemas | `docs/contracts/schemas/` |
| v2.5 Hazard handoff notes | `docs/contracts/hazard_handoff/` |
| v2.5 runtime helper snippets | `scripts/reference_helpers/` |
| v2.5 `01_cells/<cell>/` packages | `docs/cells/<cell>/` |
| v2.5 `02_evidence_ingestion/` | `docs/evidence/ingestion/` |
| v2.5 package-level machine-readable artifact docs | `docs/contracts/` and `docs/cells/` |
| v2.5 package-level manifest/start/validation notes | `docs/source_drops/manifests/v2_5_implementation_hardened/` |
| v2.5 directly useful source context | `docs/source_drops/context/v2_5/` |

## What Was Removed

```text
docs/damage_curves/
tracked duplicate source-drop extraction contents
```

The raw ZIP remains unchanged at:

```text
docs/source_drops/raw_zips/DOWNLOAD_THIS_damage_curve_library_v2_5_implementation_hardened.zip
```

`docs/source_drops/extracted/` remains available as a local, gitignored extraction/staging area. It is not
canonical navigation and should not be used to satisfy docs links.

## Still Out Of Scope

```text
src/
cloud bucket path contracts
runtime package publication
Hazard loading path
data/ artifact relocation
curve model changes
schema behavior changes
notebook changes
presentation changes
```

## Verification Commands

```bash
git status --short
find . -maxdepth 3 -type d -name src -print
python3 - <<'PY'
from pathlib import Path
import hashlib, json, re, sys

missing = []
for f in Path('docs').rglob('*.md'):
    text = f.read_text(errors='ignore')
    for m in re.finditer(r'\\[[^\\]]+\\]\\(([^)]+)\\)', text):
        href = m.group(1).split('#', 1)[0]
        if not href or '://' in href or href.startswith('mailto:'):
            continue
        if not (f.parent / href).exists():
            missing.append((str(f), href))
if missing:
    for row in missing:
        print('MISSING:', row)
    sys.exit(1)
print('markdown local links ok')

idx = json.loads(Path('docs/contracts/machine_readable_artifact_index.json').read_text())
for art in idx['artifacts']:
    p = Path(art['path'])
    h = hashlib.sha256(p.read_bytes()).hexdigest()
    if h != art['sha256']:
        raise SystemExit(f'HASH MISMATCH: {p}')
print('canonical JSON hashes ok')
PY
```
