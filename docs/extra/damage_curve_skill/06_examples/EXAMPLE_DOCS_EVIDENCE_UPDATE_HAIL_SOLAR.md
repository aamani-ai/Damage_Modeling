# Example — docs/evidence update to hail_solar

## Request

```text
Add a new hail claims report to the hail_solar dossier and explain how it supports the existing stow rationale. Do not change parameters.
```

## Classification

```yaml
change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
cell_id: hail_solar
outputs_can_change_for_same_inputs: false
```

## Version impact

```text
package_release: patch/minor if shipped
cell_model_version: unchanged model v1.0
cell_docs_revision: bump, e.g. docs r5 -> docs r6
schema_version: unchanged
```

## Required files

```text
hail_solar dossier addendum
source-to-parameter map update
parameter tier table source_ids update if relevant
VERSION_REGISTRY docs revision update
release notes with explicit non-change statement
```

## Explicit non-change statement

```text
This evidence update does not alter hail_solar runtime curve parameters, selector/conditioner logic, value mapping, or emitted failure-unit DRs.
```
