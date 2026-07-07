# Release notes template

```markdown
# Release notes — Damage Curve Library <package release>

## Release type

<docs_only | evidence_update | model_update | new_cell_scaffold | new_cell_model | schema_change | implementation_hardening | package_only>

## Summary

<one paragraph>

## Version impacts

| Cell | Prior model | New model | Prior docs | New docs | Runtime behavior changed? |
|---|---:|---:|---:|---:|---:|

## Schema impacts

| Schema | Prior | New | Compatibility | Migration required? |
|---|---:|---:|---|---:|

## Explicit non-changes

```text
- <cell> runtime behavior unchanged.
- <schema> unchanged.
- <metric support> unchanged.
```

## Validation summary

```text
JSON parse:
Known-answer tests:
Capability declarations:
Cap-binding gates:
Zip integrity:
```

## Open seams and follow-ups

```text
- <item>
```
```
