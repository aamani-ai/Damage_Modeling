# Notes — reference evaluators for the two battery cells (G9), 2026-10-20

## Chronology

1. Read both cells in full, the contracts and schemas, the house evaluators and validators, the build brief §3,
   and Hazard's two `bess.py` modules plus the `bess_annual.py` loaders (read-only).
2. Found that Hazard's `bess.py` loaders pin the **v0.1 proposal** bytes behind an opt-in, while the
   `bess_annual.py` loaders pin the **exact v1.0 bytes** of both current artifacts (SHA-256 equal to each
   `consumption_pin.json`); the curve records and known answers are byte-identical between v0.1 and v1.0.
3. Wrote `tropical_cyclone_wind_bess_curve_eval.py`; all 20 known answers reproduced (max deviation 1.9e-17).
4. Wrote `wildfire_bess_curve_eval.py`; all 84 known answers reproduced exactly in damage ratio, dollars within
   1.5e-11 of the authors' Decimal arithmetic.
5. Ran Hazard's consumers in Hazard's venv (scratchpad harness): 3,960 hurricane points and 420 wildfire
   points; no status disagreement; max hurricane difference 2.2e-16 at the same demand; wildfire bit-identical.
6. Wrote the two validators and `tests/test_bess_evaluators.py`; the hurricane validator caught two of my own
   harness mistakes and one real ordering gap (unknown scenario on a withheld unit), fixed in the evaluator.
7. Generated `hazard_consumer_comparison.md` under each cell's `current/` from the comparison JSON (numbers
   never hand-typed); added README rows and this entry; committed and opened the PR.

## Findings worth keeping

- **Two reference ids in the canonical wildfire artifact.** `evaluation_contract.reference_id` is
  `BESS_LFP_R1_WILDFIRE_ORDINAL_V1` (discussion `11` calls it "the new canonical reference selector"), while
  `selector_logic` and every record's `selector_match.reference_id` still say `…_LOCAL_V0_1`, and the records'
  `metadata_flags` still include `LOCAL_TEST_ONLY_NOT_CANONICAL` and `ANNUAL_SOURCE_COUPLING_NOT_QUALIFIED`.
  Provenance of the byte-preserved records, not a second selector; surfaced in the PR as an owner question.
- **The hurricane artifact's axis is consumer-bridged.** Hazard forms demand as `(gust/reference)**2`; through
  that bridge `100·√2 / 100` squares to `2.0000000000000004`, which both implementations withhold. The known
  answer at exactly 2.0 is reachable only with a direct ratio, which Hazard's consumer signature does not accept.
- **Known answers computed by independent methods** differ from the evaluator by at most 1.9e-17 (hurricane,
  two cases) and 1.5e-11 USD (wildfire, one case, Decimal × value vs float × value). Neither file declares a
  tolerance.
- **Hazard's wildfire v0.1 loader rejects the v1.0 selector and vice versa**; its `bess_wind_response` raises
  for unknown hypothesis/scenario/pathway/bridge and returns NaN for invalid gusts and withheld units.
- **A worktree lacks the gitignored local symlinks and `outputs/`.** Six house validators (the five substation
  bindings and the flood × wind v0.1 scaffold) fail here for that reason alone; they read
  `Hazard_modeling/docs/plans/_cross_cutting/substation_conus/asset_model.json` or `outputs/flood_wind_v0_1`.
  The other 29 pass, plus the two new ones.
- **`validate_substation_flood_binding.py` writes a receipt** (`docs/extra/discussion/substation_damage/
  verification/flood_binding_validation.json`) when run; running the whole sweep dirties that file. Reverted.

## Gotchas met

- `cd` inside a Bash call moves the persistent working directory out of the worktree; pin every command.
- The wildfire records' `x_axis` (`fsim_class_state_exact_integer_only`) differs from the pathway axis id
  (`FSIM_CLASS_EXACT`), unlike the hurricane cell; the evaluator checks the record constant, not equality.
- The `deepcopy`-mutate corruption checks need mutations that actually break the invariant (a cost of 0.9 at
  state 1 is still sorted).
- macOS has no `timeout`; the validator sweep loop runs without it.
