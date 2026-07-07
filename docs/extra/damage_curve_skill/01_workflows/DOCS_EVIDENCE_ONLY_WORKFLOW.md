# Docs / evidence-only workflow

Use when proof trail improves but runtime behavior does not change.

Examples:

```text
- add a source narrative;
- add parameter tier table without changing values;
- clarify derivation rationale;
- fix confusing wording;
- add a reviewer crosswalk;
- add a caveat/open-seam note;
- add a source pathway note for future calibration.
```

## Required proof that outputs do not change

Before calling a change docs/evidence-only, state:

```text
[ ] no curve forms changed;
[ ] no curve parameters changed;
[ ] no selector/conditioner/exposure logic changed;
[ ] no value mapping used by runtime changed;
[ ] no canonical runtime artifact changed in an output-affecting way;
[ ] no damage-code output field meaning changed.
```

If any box is false, use `UPDATE_EXISTING_CELL_WORKFLOW.md`.

## Version outcome

```text
cell model version: unchanged
cell docs revision: bump
package version: patch/minor if shipped
schema version: unchanged
```

## Required release note language

Include an explicit non-change statement:

```text
This release improves evidence/proof trail only. It does not change runtime damage-code behavior for <cell_id>; the same inputs produce the same failure-unit DRs as the prior model version.
```
