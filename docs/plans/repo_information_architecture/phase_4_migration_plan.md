# Repo Information Architecture — Phase 4 Migration Plan

Status: Batch 4A/4B executed; Batch 4C/4D deferred.

Phase 4 is the first phase that may move files. It must be reviewed before execution because moved docs can
break provenance, links, and the v2.5 package audit trail. This plan is deliberately conservative.

## Recommendation

Execute Phase 4 in small batches. Do not move runtime artifacts, schemas, notebooks, helper code, workbooks,
or v2.5 cell packages in Phase 4.

The only recommended first file move is the scope anchor, because it is a repo-level doc and already has a
new `docs/scope/` surface. Everything else should remain index-only until the first move proves the redirect
and link-check pattern.

## Batch 4A — scope anchor move

Status: executed.

Executed move:

| Current path | Target path | Treatment after move |
|---|---|---|
| `docs/damage_curves/SCOPE_AND_STORY.md` | `docs/scope/SCOPE_AND_STORY.md` | Old path replaced with a short compatibility stub. |

Required edits:

```text
docs/scope/README.md
docs/README.md
docs/damage_curves/README.md
any Markdown link that points to docs/damage_curves/SCOPE_AND_STORY.md
```

Required content cleanup during this move:

```text
replace stale "spin-out pending" wording with current "repo spun out" wording
keep the scope boundary unchanged
do not alter curve semantics or versioning
```

Acceptance checks:

```text
old path still leads readers to the new anchor
new path is the docs-root scope entrypoint
all local Markdown links in new/touched IA docs resolve
full-repo missing-link count does not increase above the baseline in link_debt.md
no JSON artifact hash changes
no notebook/schema/runtime-helper changes
```

## Batch 4B — current docs index cleanup

Status: executed.

The old `docs/damage_curves/README.md` is now a compatibility index rather than the primary reader
entrypoint.

Do not delete `docs/damage_curves/`. It still contains authoritative foundations and implementation files
until later phases.

Executed treatment:

```text
docs/damage_curves/README.md
  -> "legacy/current package location" compatibility index
  -> point readers first to docs/scope, docs/cells, docs/contracts, docs/method, docs/evidence
  -> keep links to the nested source files that still live there
```

Acceptance checks:

```text
docs/README.md points to shallow surfaces first
docs/damage_curves/README.md no longer implies the deep tree is the preferred navigation path
new/touched IA Markdown links resolve
full-repo missing-link count does not increase above the baseline in link_debt.md
```

## Batch 4C — method docs move, deferred

Do not execute this batch until Batch 4A and 4B are stable.

Candidate future moves:

```text
docs/damage_curves/damage_curve_foundations/
  -> docs/method/foundations/

selected non-runtime global method standards
  -> docs/method/standards/
```

Reason to defer:

```text
the foundations docs have many relative links
the implementation standards are bundled with v2.5 source context
moving them may blur package provenance unless redirects are explicit
```

Before this batch, create a file-level link map.

## Batch 4D — contracts move, deferred

Do not move schemas or contract standards yet.

Keep `docs/contracts/README.md` as the primary surface that points to the v2.5 authoritative files. Revisit
only when runtime artifact publishing and Hazard loading are specified.

Reason to defer:

```text
contracts are close to runtime behavior
schemas may later belong with package/runtime publication instead of docs-only paths
Hazard consumers should not see a path change until versioning/loading is decided
```

## Explicit no-move list for Phase 4

Do not move:

```text
docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/
docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/schemas/
docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/00_global_method/runtime_helpers/
docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/02_evidence_ingestion/
notebooks/
data/
docs/google_drive_docs/
docs/presentations/
```

Also do not create:

```text
src/
cloud bucket path contracts
new runtime package manifests
```

## Verification commands

Run after every Phase 4 batch:

```bash
git status --short
find . -maxdepth 2 -type d -name src -print
python3 - <<'PY'
from pathlib import Path
import re, sys
files = [
    Path('docs/README.md'),
    Path('docs/scope/README.md'),
    Path('docs/cells/README.md'),
    Path('docs/contracts/README.md'),
    Path('docs/method/README.md'),
    Path('docs/evidence/README.md'),
    Path('docs/source_drops/README.md'),
    Path('docs/plans/repo_information_architecture/README.md'),
    Path('docs/plans/repo_information_architecture/inventory_mapping.md'),
    Path('docs/plans/repo_information_architecture/phase_4_migration_plan.md'),
    Path('docs/plans/repo_information_architecture/link_debt.md'),
]
missing = []
for f in files:
    text = f.read_text()
    for m in re.finditer(r'\[[^\]]+\]\(([^)]+)\)', text):
        href = m.group(1).split('#', 1)[0]
        if not href or '://' in href or href.startswith('mailto:'):
            continue
        target = (f.parent / href).resolve()
        if not target.exists():
            missing.append((str(f), href, str(target)))
if missing:
    for row in missing:
        print('MISSING:', row)
    sys.exit(1)
print('markdown local links ok')
PY
python3 - <<'PY'
from pathlib import Path
import re, sys
baseline = 131
missing = []
for f in Path('docs').rglob('*.md'):
    text = f.read_text(errors='ignore')
    for m in re.finditer(r'\[[^\]]+\]\(([^)]+)\)', text):
        href = m.group(1).split('#', 1)[0]
        if not href or '://' in href or href.startswith('mailto:'):
            continue
        target = (f.parent / href).resolve()
        if not target.exists():
            missing.append((str(f), href))
if len(missing) > baseline:
    print(f'MISSING LINK COUNT INCREASED: {len(missing)} > {baseline}')
    sys.exit(1)
print(f'full-repo missing-link count {len(missing)} <= baseline {baseline}')
PY
python3 - <<'PY'
from pathlib import Path
import json, hashlib, sys
root = Path('docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE')
idx = json.loads((root / 'machine_readable_artifact_index.json').read_text())
fail = []
for art in idx['artifacts']:
    p = root / art['path']
    h = hashlib.sha256(p.read_bytes()).hexdigest()
    if h != art['sha256']:
        fail.append((str(p), art['sha256'], h))
if fail:
    for row in fail:
        print('HASH MISMATCH:', row)
    sys.exit(1)
print('canonical JSON hashes ok')
PY
```

## Completion condition for Phase 4

Phase 4 is complete only when:

```text
Batch 4A is executed and verified
Batch 4B is executed and verified
Batch 4C/4D are either explicitly deferred in the plan or separately approved
task history records what moved and what remained index-only
legacy link debt is unchanged or reduced
```
