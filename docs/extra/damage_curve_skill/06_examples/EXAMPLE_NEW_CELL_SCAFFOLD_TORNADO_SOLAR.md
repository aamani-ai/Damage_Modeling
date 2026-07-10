# Example — new tornado_solar scaffold

## Request

```text
Create the initial tornado_solar cell folder and scope the mechanisms.
```

## Classification

```yaml
change_class: NEW_CELL_SCAFFOLD
cell_id: tornado_solar
outputs_can_change_for_same_inputs: false
```

## Version impact

```text
package_release: minor if shipped
new cell model version: no released model v1.0 yet; scaffold/draft state
cell_docs_revision: initial docs r0 or r1
schema_version: unchanged
```

## Required scaffold contents

```text
README with scope
failure-unit candidate table
in/out split from strong_wind_solar
placeholder metadata spec
capability declaration withholding metrics
open evidence plan
seven-step audit
source and claim register skeletons
row-level value crosswalk attempt
site-condition adapter when site transfer matters
no-curve known-answer tests using NO_RUNTIME_CURVE
```

## Important guardrail

Do not reuse straight-line wind solar curves for tornado debris/missiles without a dossier-backed pathway. Tornado_solar may be related to strong_wind_solar, but it is not automatically the same cell.

Use `EXAMPLE_FAIL_CLOSED_WILDFIRE_SOLAR_SCAFFOLD.md` for the full evidence-pressure-test pattern.
