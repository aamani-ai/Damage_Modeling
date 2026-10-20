# Handoff — reference evaluators for the two battery cells (G9), 2026-10-20

## 10-bullet summary

1. Two new reference evaluators under `scripts/reference_helpers/`:
   `tropical_cyclone_wind_bess_curve_eval.py` (ordered damage-state lognormal, three unweighted resistance
   scenarios reported side by side, explicit hypothesis, declared comparable pressure reference,
   `pressure_ratio` 0–2 or a 3-s gust pair squared) and `wildfire_bess_curve_eval.py` (exact FSim class
   states 0–6 looked up in the seven records, explicit selector, hypothesis and shape, serviceability
   counterfactual for repairs). Both: standard library, damage emit v2, fail closed, withheld units with the
   artifact's reason codes, optional same-unit dollars, a record-grain `evaluate_curve_record` for the sampler.
2. **Every known answer reproduces**: hurricane 20/20 (max deviation 1.9e-17), wildfire 84/84 (damage ratio
   exact, dollars within 1.5e-11). Neither cell declares a tolerance; the validators use 1e-12 DR / 1e-6 USD.
3. Validators `validate_tropical_cyclone_wind_bess_evaluator.py` (1,791 checks) and
   `validate_wildfire_bess_evaluator.py` (1,692 checks): pins, index, schemas, record content (wildfire
   records re-derived as weight × cost ÷ value from the tier table), known answers, record-grain coverage of
   every pathway × unit × hypothesis × scenario/shape, the request contract, the CLI. `tests/test_bess_evaluators.py`
   adds 147 pytest cases; the suite is 166 passed.
4. **Hazard cross-check recorded** in `docs/cells/<cell>/current/hazard_consumer_comparison.md`: Hazard's
   consumers run in Hazard's venv against its installed copy of the exact v1.0 bytes (and the v0.1 proposal).
   Hurricane: 3,960 points, 0 status disagreements, max |Δ| 2.2e-16 at the same demand, bridge arithmetic
   bit-identical. Wildfire: 420 points, 168 numeric bit-identical, 252 both withheld, 0 disagreements.
5. The one behavioural edge: through the gust-pair bridge `(100·√2/100)² = 2.0000000000000004`, so Hazard
   and the bridge mode withhold the r = 2 known-answer point; the direct ratio reproduces it. Not a disagreement.
6. **Open question for the owner**: the canonical wildfire artifact carries two reference ids
   (`evaluation_contract.reference_id` = `…_ORDINAL_V1`; `selector_logic` and every record's `selector_match`
   = `…_LOCAL_V0_1`) and stale record flags (`LOCAL_TEST_ONLY_NOT_CANONICAL`,
   `ANNUAL_SOURCE_COUPLING_NOT_QUALIFIED`). The evaluator follows the contract id, echoes the record id and
   surfaces the record flags; no byte changed.
7. Catalogue entries untouched (their `checks` are outside-evidence checks; `files` has no evaluator slot);
   the dashboard plan's Phase 3 checkbox is left for the merge.
8. Hazard's `bess.py` modules still pin the v0.1 proposal behind an opt-in; the v1.0 bytes are consumed by the
   `bess_annual.py` loaders. Records are identical, so the numbers agree either way; noted for Hazard.
9. The house-wide validator sweep in this worktree: 31 pass; six fail only because the gitignored
   `Hazard_modeling` symlink and `outputs/` do not exist in a worktree (five substation bindings, flood × wind
   v0.1 scaffold). Running `validate_substation_flood_binding.py` rewrites a receipt JSON; reverted.
10. Branch `claude/modest-darwin-9c7792`, PR "Reference evaluators for the two battery cells (G9)"; not merged.

## Files touched

Created: `scripts/reference_helpers/{tropical_cyclone_wind_bess_curve_eval,wildfire_bess_curve_eval,validate_tropical_cyclone_wind_bess_evaluator,validate_wildfire_bess_evaluator}.py` ·
`tests/test_bess_evaluators.py` · `docs/cells/tropical_cyclone_wind_bess/current/hazard_consumer_comparison.md` ·
`docs/cells/wildfire_bess/current/hazard_consumer_comparison.md` · this folder.
Modified: `scripts/reference_helpers/README.md` · `docs/extra/tasks_history/README.md`.
Untouched: every artifact, capability, pin, known-answer file and catalogue entry; `dashboard/`, `scripts/dashboard/`,
`docs/evidence/occurrence/`; the Hazard repository.

## Repro / verify

```bash
.venv/bin/python scripts/reference_helpers/validate_tropical_cyclone_wind_bess_evaluator.py
.venv/bin/python scripts/reference_helpers/validate_wildfire_bess_evaluator.py
.venv/bin/python -m pytest tests -q
.venv/bin/python scripts/reference_helpers/wildfire_bess_curve_eval.py docs/cells/wildfire_bess/current/curve_artifact.json \
  '{"pathway_id":"wildfire_thermal_attack","failure_unit_id":"BESS_INTEGRATED_ENCLOSURE","selector_id":"BESS_LFP_R1_WILDFIRE_ORDINAL_V1","class_state":4,"response_hypothesis_id":"approved_replacement","shape_scenario":"electronics_ordinal","same_unit_value_usd":1050000}'
```

The Hazard harness is reproduced inline in each `hazard_consumer_comparison.md` (Hazard's venv, read-only).

## Next action

- Dashboard build (parallel session): sample the two cells through `evaluate_curve_record` (hurricane: one
  line per record × scenario; wildfire: seven steps per record) and reproduce the known answers through
  `evaluate_damage_call`; retire the "no evaluator" state for these two pages.
- Owner: rule on aligning the wildfire artifact's record-level selector id and flags with the v1.0 contract
  (a docs-revision question, not a numerical one), and on adding a declared tolerance to both known-answer files.
- Hazard: consider retiring the v0.1 `bess_local` resources now that `bess_annual` carries the v1.0 bytes.
