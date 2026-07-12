# Governance release checklist

Before shipping a new damage-curve-library package:

```text
[ ] Change classification exists.
[ ] Version impacts are recorded.
[ ] Cell registry updated.
[ ] Artifact index updated.
[ ] Prior current artifacts archived if behavior changed.
[ ] Current canonical artifact/pin remains untouched while a behavior-changing proposal is incomplete.
[ ] New/updated JSON artifacts parse and validate structurally.
[ ] Dossiers/metadata specs point to the canonical JSON artifact.
[ ] Capability declarations are populated.
[ ] Withheld metrics remain withheld.
[ ] Cap-binding policy recorded.
[ ] Known-answer tests run or marked not applicable with reason.
[ ] Multi-pathway cells have per-pathway KATs and cross-pathway negative tests.
[ ] Every curve record/output/test uses a declared pathway_id; no boolean or implicit fallback remains.
[ ] Unsupported pathway × failure-unit pairs withhold without numeric substitution.
[ ] No-curve scaffold tests assert no numeric DR/loss and NO_RUNTIME_CURVE.
[ ] Source IDs and claim source IDs resolve; exact locators and transfer limits are present.
[ ] Seven-step audit and row-level value crosswalk are complete for the lifecycle state.
[ ] Site-conditioned cells include a double-counting matrix and no blanket control credit.
[ ] Proposed main-branch artifacts remain package_release=unreleased and not_included until promoted.
[ ] Neighboring hurricane/compound-hazard boundary and event double-count rule are explicit.
[ ] Consumer migration and exact cell-model/docs/schema/SHA pin are verified before cutover.
[ ] Release notes include explicit non-changes.
[ ] Manifest lists created/modified/deprecated files.
[ ] Zip integrity checked.
```

Fail conditions:

```text
- model output can change but model version was not bumped;
- runtime artifact changed but registry was not updated;
- unsupported PML/VaR/TVaR is emitted;
- scalar EAL is reported despite missing/failing cap-binding preflight;
- new cell is labeled v1.0 without a reviewable runtime curve;
- deprecated artifact can still be silently used as canonical.
- proposed repository artifact is mislabeled as included in the current package;
- support/logistics or one site control is counted more than once;
- rejected/synthetic numeric arrays remain in a runtime-shaped no-curve artifact.
- a multi-pathway consumer can omit pathway_id, infer it from intensity, or receive a default pathway;
- one pathway's axis, evidence, curve, or KAT is silently reused by another;
- promotion occurs before the consumer migration/pin fixture passes.
```
