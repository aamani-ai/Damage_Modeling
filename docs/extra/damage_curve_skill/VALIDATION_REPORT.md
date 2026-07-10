# Validation report — damage_curve_skill revision 0.5

**Date:** 2026-07-09

**Status:** PASS
**Skill status:** controlled-use

## Change and version decision

```yaml
operating_mode: inside_repo
change_scope: evergreen_skill_process_only
skill_revision: 0.4 -> 0.5
damage_library_change_class: not_applicable
damage_library_package_release: unchanged
cell_model_versions: unchanged
cell_documentation_revisions: unchanged_by_this_skill_update
schema_artifact_version: unchanged
runtime_outputs_can_change: false
controlled_example_cell: wildfire_solar
```

This revision codifies a reusable evidence-pressure-test and fail-closed new-cell workflow. It does not promote the controlled example into a released model or package. Proposed repository artifacts remain `package_release: unreleased`, `package_inclusion_status: not_included`, and `canonical_runtime_artifact: false` until a separate release decision.

## Checks

| Check | Result |
|---|---|
| OpenAI skill quick validator | PASS |
| Bundle structure, exactly one `SKILL.md`, JSON parse, and Python compile | PASS — 102 files |
| Required rigorous guide/example/template presence | PASS |
| Source, claim, value, and parameter CSV template headers | PASS |
| CSV template row widths / rectangularity | PASS |
| Canonical input-field / alias / field-group guidance | PASS |
| Bounded negative-evidence search-log template and guidance | PASS |
| Rigor-guide required markers | PASS |
| Atomic model/lifecycle/promotion/review/documentation/package fields | PASS |
| Governance classifier self-tests | PASS — 6 cases |
| Fail-closed scaffold required-gate subset test | PASS |
| `agents/openai.yaml` name/default-prompt alignment | PASS |
| Local Markdown link targets | PASS |
| JSON syntax for changed templates and governance tests | PASS |
| Git whitespace/error check for the skill diff | PASS |
| Accidental `src/` directory check | PASS — absent |
| Independent forward test on bushfire × battery storage | PASS |
| Manifest inventory and SHA256 verification | PASS — self-entry intentionally excluded |

## Bundle validation output

```json
{
  "status": "PASS",
  "file_count": 102
}
```

The validator also checks exact headers for:

```text
TEMPLATE_SOURCE_REGISTER.csv
TEMPLATE_CLAIM_PARAMETER_REGISTER.csv
TEMPLATE_VALUE_CROSSWALK.csv
TEMPLATE_PARAMETER_TIER_TABLE.csv
```

and requires the fail-closed guide to contain the seven-step audit, source register, claim-level provenance, legacy numerical audit, site-condition double-counting matrix, and `NO_RUNTIME_CURVE` outcome.

## Governance self-test output

```json
{
  "status": "PASS",
  "cases": 6
}
```

The added `fail_closed_site_conditioned_scaffold` case confirms that `NEW_CELL_SCAFFOLD` requires:

```text
seven_step_audit
source_register
claim_level_provenance
evidence_pressure_test
legacy_numerical_audit_if_applicable
site_condition_adapter_if_site_conditioned
value_crosswalk
withheld_capability_declaration
no_curve_known_answer_tests
```

## Independent forward test

A fresh agent was given only this skill and a hypothetical request to build bushfire × battery-storage curves from a legacy memo while crediting a concrete wall and maintained firebreak. It correctly concluded:

```text
- start as NEW_CELL_SCAFFOLD;
- reproduce and disposition legacy equations, tables, citations, endpoints, and denominators;
- assign no blanket wall/firebreak credit;
- capture construction, geometry, continuity, maintenance, event state, and bypass;
- prevent the same control from affecting exposure and vulnerability/value twice;
- use NO_CREDIT for unknown mitigation and WITHHOLD for unknown load-bearing state;
- keep curve_records empty and withhold every numerical metric if the calibration chain fails;
- do not call the scaffold model v1.0 or include it in a released package.
```

The forward test did not read the controlled `wildfire_solar` cell files and made no edits.

## Commands

```bash
python /root/.codex/skills/oai/skill-creator/scripts/quick_validate.py docs/extra/damage_curve_skill
python docs/extra/damage_curve_skill/tools/validate_skill_bundle.py docs/extra/damage_curve_skill
python docs/extra/damage_curve_skill/tools/run_self_tests.py
python /tmp/check_skill_links.py docs/extra/damage_curve_skill
python -m json.tool docs/extra/damage_curve_skill/templates/TEMPLATE_CURVE_ARTIFACT.json
python -m json.tool docs/extra/damage_curve_skill/templates/TEMPLATE_CAPABILITY_DECLARATION.json
python -m json.tool docs/extra/damage_curve_skill/tests/governance_test_cases.json
git diff --check -- docs/extra/damage_curve_skill
```

`MANIFEST.md` omits its own row because a file cannot carry a stable SHA256 of itself. Every other skill file, including this report, is inventoried and hash-verified.
