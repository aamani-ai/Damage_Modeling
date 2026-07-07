# Build notes

This skill was built as an evergreen operating manual for the damage-curve library.

Design choices:

```text
- Folder name has no library package version.
- Exactly one top-level SKILL.md exists for skill compatibility.
- The skill supports two modes: inside_repo direct canonical edits, and outside_package ZIP/source-drop work.
- Versioning policy separates package, cell model, docs revision, schema, and skill upload versions.
- Governance self-tests are included to check representative classification decisions.
- Seed registry reflects damage-curve-library v2.5 but is not the authority when a newer package is supplied.
```
