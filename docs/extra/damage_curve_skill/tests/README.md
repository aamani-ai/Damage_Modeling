# tests

Governance smoke tests for the skill.

Run:

```bash
python tools/run_self_tests.py
```

The tests check that representative change requests are classified with the expected change class and version impacts. The fail-closed new-cell case asserts the expanded evidence/site/value/no-curve gates. The multi-pathway model and schema cases assert pathway architecture, per-pathway evidence/KATs/capabilities, neighboring-cell boundary, and consumer migration/pin gates.
