# Manifest rules

The manifest is a file-level map of the package.

## Required fields for changed files

```yaml
path:
action: added | modified | moved | deprecated | removed
change_class:
runtime_behavior_impact: yes | no | unknown
version_stream_impact:
notes:
```

## Required summary tables

```text
files added
files modified
files deprecated
files removed
runtime artifacts changed
schemas changed
cells affected
```
