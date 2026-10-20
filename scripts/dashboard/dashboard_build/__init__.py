"""The damage-curve dashboard's data build (plan docs/plans/damage_curve_dashboard/, Phase 0).

One Python step reads the catalogue, every cell artifact, the known-answer tests, the registers, the occurrence
register and Hazard's pinned twin crosswalk, samples every curve through this repository's Python evaluators (or
lists it "no evaluator"), reproduces the known answers, detects the derivation chain, and writes static JSON under
dashboard/data/ with a receipt — failing loudly when anything does not reconcile (discussion 05 §3).
"""
